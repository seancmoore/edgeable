import {
  collection, addDoc, doc, updateDoc, getDocs,
  query, orderBy, limit, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';

// Public verifiable pick record. Every write here must survive the picks
// security rules: postedAt MUST be serverTimestamp() (rules require
// postedAt == request.time), picks are immutable after create except
// status+gradedAt, and grading is one-way pending -> final.

export const FINAL_STATUSES = ['win', 'loss', 'push', 'void'];

// The single write path for creating a pick. Both manual entry and confirmed
// screenshot imports go through here so the integrity rules apply identically.
export async function createPick({ sport, description, odds, stakeUnits, gameStartTime }) {
  const o = Math.trunc(Number(odds));
  const u = Number(stakeUnits);
  const start = gameStartTime instanceof Date ? gameStartTime : new Date(gameStartTime);

  if (!sport || String(sport).trim().length < 2) throw new Error('Sport/league is required.');
  if (!description || String(description).trim().length < 3) throw new Error('Description is required.');
  if (isNaN(o) || (o > -100 && o < 100)) throw new Error('Odds must be valid American odds (e.g. -110, +145).');
  if (isNaN(u) || u <= 0 || u > 100) throw new Error('Stake must be between 0 and 100 units.');
  if (isNaN(start.getTime())) throw new Error('Invalid game start time.');
  if (start.getTime() <= Date.now()) throw new Error('Game start time must be in the future.');

  const ref = await addDoc(collection(db, 'picks'), {
    sport: String(sport).trim().toUpperCase().slice(0, 20),
    description: String(description).trim().slice(0, 200),
    odds: o,
    stakeUnits: u,
    gameStartTime: Timestamp.fromDate(start),
    postedAt: serverTimestamp(),
    status: 'pending',
    gradedAt: null,
  });
  return ref.id;
}

export async function gradePick(pickId, status) {
  if (!FINAL_STATUSES.includes(status)) throw new Error('Invalid grade.');
  await updateDoc(doc(db, 'picks', pickId), {
    status,
    gradedAt: serverTimestamp(),
  });
}

export async function getAllPicks(maxCount = 2000) {
  const q = query(collection(db, 'picks'), orderBy('postedAt', 'desc'), limit(maxCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function isPostedToday(pick) {
  const posted = pick.postedAt?.toDate?.();
  if (!posted) return false;
  const now = new Date();
  return posted.getFullYear() === now.getFullYear()
    && posted.getMonth() === now.getMonth()
    && posted.getDate() === now.getDate();
}

// Net units returned by a graded pick at American odds.
export function pickNetUnits(pick) {
  const u = Number(pick.stakeUnits) || 0;
  const o = Number(pick.odds) || 0;
  switch (pick.status) {
    case 'win': return u * (o > 0 ? o / 100 : 100 / -o);
    case 'loss': return -u;
    default: return 0; // push, void, pending
  }
}

// Record across graded picks. Pending excluded everywhere; voids excluded
// from ROI entirely; pushes count in the W-L-P record at zero units (their
// stake stays in the ROI denominator — the units were genuinely risked).
export function computeRecord(picks) {
  let wins = 0, losses = 0, pushes = 0, voids = 0;
  let netUnits = 0, unitsStaked = 0;
  for (const p of picks) {
    if (p.status === 'pending') continue;
    if (p.status === 'win') wins++;
    else if (p.status === 'loss') losses++;
    else if (p.status === 'push') pushes++;
    else if (p.status === 'void') { voids++; continue; }
    netUnits += pickNetUnits(p);
    unitsStaked += Number(p.stakeUnits) || 0;
  }
  const roi = unitsStaked > 0 ? netUnits / unitsStaked : 0;
  return { wins, losses, pushes, voids, netUnits, unitsStaked, roi, graded: wins + losses + pushes + voids };
}

export function formatOdds(odds) {
  const o = Number(odds) || 0;
  return o > 0 ? `+${o}` : String(o);
}

export function formatStake(u) {
  const v = Math.round((Number(u) || 0) * 100) / 100;
  return `${v}U`;
}

// Pinned to ET so the public record reads the same everywhere — a verifiable
// timestamp shouldn't change with the viewer's device timezone.
const TIME_FMT = { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' };
const DATETIME_FMT = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' };

export function formatPostedAt(ts, { withDate = false } = {}) {
  const d = ts?.toDate?.();
  if (!d) return '';
  return d.toLocaleString('en-US', withDate ? DATETIME_FMT : TIME_FMT);
}

// Plaintext card for Telegram, generated FROM the posted site record so the
// public timestamps always precede (or match) the Telegram post.
export function cardAsText(picks) {
  const now = new Date();
  const lines = [
    `EDGEABLE — Daily Card (${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})`,
    '',
  ];
  for (const p of picks) {
    lines.push(`${p.sport} | ${p.description} @ ${formatOdds(p.odds)} — ${formatStake(p.stakeUnits)}`);
    lines.push(`   posted ${formatPostedAt(p.postedAt)} ET on edgeabled.web.app/card`);
  }
  lines.push('');
  lines.push('Full verified record: https://edgeabled.web.app/card');
  return lines.join('\n');
}
