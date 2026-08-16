// Add (or update) one daily P&L entry from the terminal, writing BOTH
// dailyPnL/{date} (private, matches src/utils/pnl.js savePnLEntry shape)
// and the world-readable dailyPnLPublic/{date} mirror in one batch, so the
// landing chart updates immediately.
//
// USAGE:
//   node scripts/add-pnl-day.js <YYYY-MM-DD> <units> <W-L[-P]> [notes...]
//   e.g. node scripts/add-pnl-day.js 2026-07-10 +11.76 7-6-1
//        node scripts/add-pnl-day.js 2026-07-11 -4.01 5-7 "rough card"
//
// stakedUnits for the mirror is computed from that ET day's graded picks
// (same rule as the backfill script); with an empty picks archive it is 0.
//
// SETUP: needs service-account.json in the project root.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { rebuildLandingStats } from './_landing-stats.mjs';

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), 'service-account.json');
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Missing service-account.json at ${SERVICE_ACCOUNT_PATH}`);
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'))) });
const db = getFirestore();

const [dateId, unitsArg, wlp, ...notesParts] = process.argv.slice(2);
if (!/^\d{4}-\d{2}-\d{2}$/.test(dateId || '')) {
  console.error('Usage: node scripts/add-pnl-day.js <YYYY-MM-DD> <units> <W-L[-P]> [notes...]');
  process.exit(1);
}
const units = Number(unitsArg);
if (isNaN(units)) { console.error(`Units "${unitsArg}" is not a number.`); process.exit(1); }
const m = /^(\d+)-(\d+)(?:-(\d+))?$/.exec(wlp || '');
if (!m) { console.error(`Record "${wlp}" must look like 7-6-1 or 5-7.`); process.exit(1); }
const wins = Number(m[1]), losses = Number(m[2]), pushes = Number(m[3] || 0);
const notes = notesParts.join(' ').trim();

// ET-day staked units from graded picks (0 when archive is empty), matching backfill logic.
function etDateId(ts) {
  const d = typeof ts?.toDate === 'function' ? ts.toDate() : ts;
  if (!(d instanceof Date) || isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}
let stakedUnits = 0;
try {
  const snap = await db.collection('picks').get();
  for (const doc of snap.docs) {
    const p = doc.data();
    if (!['win', 'loss', 'push'].includes(p.status)) continue;
    if (etDateId(p.gradedAt) !== dateId) continue;
    const s = Number(p.stakeUnits);
    if (!isNaN(s)) stakedUnits += s;
  }
  stakedUnits = Math.round(stakedUnits * 100) / 100;
} catch { stakedUnits = 0; }

// Local midnight for the date field, matching the client's dateIdToDate behavior
// (admin machine is Eastern, same as the client entry flow).
const [y, mo, da] = dateId.split('-').map(Number);
const now = Timestamp.now();
const ref = db.collection('dailyPnL').doc(dateId);
const existing = await ref.get();

const data = {
  date: Timestamp.fromDate(new Date(y, mo - 1, da)),
  units, wins, losses, pushes, notes,
  updatedAt: now,
};

const batch = db.batch();
if (existing.exists) {
  batch.set(ref, data, { merge: true });
} else {
  batch.set(ref, { ...data, createdAt: now, createdBy: 'script:add-pnl-day', createdByEmail: '' });
}
batch.set(db.collection('dailyPnLPublic').doc(dateId), { units, wins, losses, pushes, stakedUnits });
await batch.commit();

console.log(`${existing.exists ? 'UPDATED' : 'ADDED'} ${dateId}: units=${units} W-L-P=${wins}-${losses}-${pushes} stakedUnits=${stakedUnits}${notes ? ` notes="${notes}"` : ''} (private + public mirror)`);

// Keep the landing page's single summary doc fresh. The day is already
// saved above, so a summary failure just points at the repair tool.
try {
  const s = await rebuildLandingStats(db);
  console.log(`landingStats/current rebuilt (${s.series.length} day(s), netUnits=${s.netUnits}).`);
} catch (err) {
  console.warn('landingStats rebuild failed (day was saved). Run: node scripts/rebuild-landing-stats.js', err);
}
