import {
  collection, doc, getDoc, getDocs, setDoc, writeBatch,
  query, where, orderBy, limit, documentId, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';

// Doc IDs are local-time YYYY-MM-DD. Easy upserts, natural sort.
function pad(n) { return String(n).padStart(2, '0'); }

export function todayDocId() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateIdToDate(id) {
  // Treat as local midnight to avoid timezone slippage.
  return new Date(id + 'T00:00:00');
}

export async function getPnLEntry(dateId) {
  const snap = await getDoc(doc(db, 'dailyPnL', dateId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ── Public mirror (dailyPnLPublic) ─────────────────────────────────────────
// The anonymous landing page reads a world-readable numeric mirror of each
// dailyPnL day: units, wins, losses, pushes, stakedUnits ONLY (never notes).
// Every dailyPnL write below also writes the mirror doc in the same batch;
// scripts/backfill-public-pnl.js mirrors the history.

// UTC instant of midnight America/New_York for a YYYY-MM-DD id. dailyPnL day
// ids are entered on an Eastern-time machine, so ET is the bucketing zone for
// "that day's graded picks". (Exact except inside the DST switch hour itself,
// when no picks settle.)
function etMidnightUtc(dateId) {
  const utcGuess = new Date(`${dateId}T00:00:00Z`);
  const nyWall = new Date(utcGuess.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return new Date(utcGuess.getTime() + (utcGuess.getTime() - nyWall.getTime()));
}

function nextDateId(dateId) {
  const d = new Date(dateId + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Sum of stakeUnits across picks graded on that ET day. Matches computeRecord
// (src/utils/picks.js) ROI semantics: wins/losses/pushes count toward staked,
// voids are excluded. Pending picks have gradedAt == null and never match the
// range query. Returns 0 when nothing is computable.
async function computeStakedUnitsForDay(dateId) {
  const start = etMidnightUtc(dateId);
  const end = etMidnightUtc(nextDateId(dateId));
  const q = query(
    collection(db, 'picks'),
    where('gradedAt', '>=', Timestamp.fromDate(start)),
    where('gradedAt', '<', Timestamp.fromDate(end)),
  );
  const snap = await getDocs(q);
  let staked = 0;
  for (const d of snap.docs) {
    const p = d.data();
    if (p.status === 'void' || p.status === 'pending') continue;
    const u = Number(p.stakeUnits);
    if (Number.isFinite(u) && u > 0) staked += u;
  }
  return Math.round(staked * 100) / 100;
}

// ── Landing summary (landingStats/current) ─────────────────────────────────
// The anonymous landing page reads ONE world-readable doc instead of querying
// live collections. It holds raw numbers only and is rebuilt here after every
// P&L write/delete (and by scripts/add-pnl-day.js / rebuild-landing-stats.js).
// Sources are all readable by the admin session: dailyPnLPublic + picksPublic
// are world-readable, and the free-pick query filters access=='public'.
export async function rebuildLandingStats() {
  // Per-day units series + totals from the public P&L mirror. Doc ids are
  // YYYY-MM-DD, so ordering by document id is chronological.
  const pnlSnap = await getDocs(
    query(collection(db, 'dailyPnLPublic'), orderBy(documentId()), limit(2000))
  );
  let netUnits = 0;
  let totalStaked = 0;
  const series = pnlSnap.docs.map((d) => {
    const data = d.data();
    const u = Number(data.units) || 0;
    netUnits = Math.round((netUnits + u) * 100) / 100;
    totalStaked += Number(data.stakedUnits) || 0;
    return { d: d.id, u };
  });

  // W-L-P + pending from the world-readable pick stubs (voids ignored).
  const stubSnap = await getDocs(
    query(collection(db, 'picksPublic'), orderBy('postedAt', 'desc'), limit(2000))
  );
  let wins = 0, losses = 0, pushes = 0, pending = 0;
  for (const d of stubSnap.docs) {
    const s = d.data().status;
    if (s === 'win') wins++;
    else if (s === 'loss') losses++;
    else if (s === 'push') pushes++;
    else if (s === 'pending') pending++;
  }

  // Newest graded free picks (up to 3), full details, timestamps as ISO
  // strings so the summary doc stays plain raw values.
  const freeSnap = await getDocs(
    query(collection(db, 'picks'), where('access', '==', 'public'), orderBy('postedAt', 'desc'), limit(24))
  );
  const freePicks = freeSnap.docs
    .map((d) => d.data())
    .filter((p) => p.status === 'win' || p.status === 'loss' || p.status === 'push')
    .slice(0, 3)
    .map((p) => ({
      desc: p.description || '',
      sport: p.sport || '',
      odds: Number(p.odds) || 0,
      stake: Number(p.stakeUnits) || 0,
      status: p.status,
      postedAt: p.postedAt?.toDate?.()?.toISOString() || null,
      gameStartTime: p.gameStartTime?.toDate?.()?.toISOString() || null,
    }));

  await setDoc(doc(db, 'landingStats', 'current'), {
    series,
    netUnits,
    totalStaked: Math.round(totalStaked * 100) / 100,
    record: { wins, losses, pushes, pending },
    freePicks,
    updatedAt: Timestamp.now(),
  });
}

// Best-effort refresh: a summary failure must never fail the P&L write that
// triggered it. The repair tool is scripts/rebuild-landing-stats.js.
async function refreshLandingStats() {
  try {
    await rebuildLandingStats();
  } catch (err) {
    console.warn('landingStats rebuild failed (P&L write succeeded):', err);
  }
}

export async function savePnLEntry({ dateId, units, wins, losses, pushes, notes, admin }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateId)) throw new Error('Invalid date.');
  if (units === '' || isNaN(Number(units))) throw new Error('Units must be a number.');

  const ref = doc(db, 'dailyPnL', dateId);
  const existing = await getDoc(ref);
  const now = Timestamp.fromDate(new Date());

  const data = {
    date: Timestamp.fromDate(dateIdToDate(dateId)),
    units: Number(units),
    wins:   wins   !== '' && wins   != null ? Number(wins)   : null,
    losses: losses !== '' && losses != null ? Number(losses) : null,
    pushes: pushes !== '' && pushes != null ? Number(pushes) : null,
    notes: notes ? String(notes).trim() : '',
    updatedAt: now,
  };

  // stakedUnits for the public mirror: computed from that day's graded picks
  // where possible; a picks-query failure must never block the P&L save.
  let stakedUnits = 0;
  try {
    stakedUnits = await computeStakedUnitsForDay(dateId);
  } catch {
    stakedUnits = 0;
  }

  const batch = writeBatch(db);
  if (existing.exists()) {
    batch.set(ref, data, { merge: true });
  } else {
    batch.set(ref, {
      ...data,
      createdAt: now,
      createdBy: admin?.uid || '',
      createdByEmail: admin?.email || '',
    });
  }
  // World-readable mirror: numbers only, no notes, written in the same batch.
  batch.set(doc(db, 'dailyPnLPublic', dateId), {
    units: Number(units),
    wins:   data.wins   != null ? data.wins   : 0,
    losses: data.losses != null ? data.losses : 0,
    pushes: data.pushes != null ? data.pushes : 0,
    stakedUnits,
  });
  await batch.commit();
  await refreshLandingStats();
}


export async function deletePnLEntry(dateId) {
  // Remove the day and its public mirror together so the landing chart can
  // never show a day the private ledger no longer has.
  const batch = writeBatch(db);
  batch.delete(doc(db, 'dailyPnL', dateId));
  batch.delete(doc(db, 'dailyPnLPublic', dateId));
  await batch.commit();
  await refreshLandingStats();
}

export async function getRecentPnL(maxCount = 60) {
  const q = query(
    collection(db, 'dailyPnL'),
    orderBy('date', 'desc'),
    limit(maxCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllPnL(maxCount = 2000) {
  const q = query(
    collection(db, 'dailyPnL'),
    orderBy('date', 'desc'),
    limit(maxCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPnLSinceDate(startDate, maxCount = 365) {
  const q = query(
    collection(db, 'dailyPnL'),
    where('date', '>=', Timestamp.fromDate(startDate)),
    orderBy('date', 'desc'),
    limit(maxCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function summarizePnL(entries) {
  let totalUnits = 0;
  let wins = 0, losses = 0, pushes = 0;
  let recordedDays = 0;
  for (const e of entries) {
    totalUnits += Number(e.units || 0);
    if (e.wins != null)   wins   += Number(e.wins);
    if (e.losses != null) losses += Number(e.losses);
    if (e.pushes != null) pushes += Number(e.pushes);
    recordedDays++;
  }
  return { totalUnits, wins, losses, pushes, days: recordedDays };
}

// Returns a Tailwind text-color class. Theme-aware.
export function unitsColor(n) {
  if (n > 0) return 'text-success';
  if (n < 0) return 'text-destructive';
  return 'text-muted-foreground';
}

// Returns the raw CSS color (for SVG fill/stroke).
export function unitsCssColor(n) {
  if (n > 0) return 'hsl(var(--success))';
  if (n < 0) return 'hsl(var(--destructive))';
  return 'hsl(var(--muted-foreground))';
}

export function formatUnits(n) {
  const v = Number(n) || 0;
  // Up to 2 decimals, no rounding to 1 and no forced trailing zeros
  // (e.g. 2.25 → "2.25", 2.5 → "2.5", 2 → "2").
  const rounded = Math.round(v * 100) / 100;
  return `${v >= 0 ? '+' : ''}${rounded} U`;
}
