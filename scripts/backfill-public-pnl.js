// Backfill the world-readable dailyPnLPublic mirror from dailyPnL.
//
// The anonymous landing page reads dailyPnLPublic/{YYYY-MM-DD} with the
// numeric fields {units, wins, losses, pushes, stakedUnits} ONLY (never
// notes). Going forward the admin P&L entry flow (src/utils/pnl.js
// savePnLEntry) writes the mirror in the same batch as the private doc; this
// script mirrors all EXISTING dailyPnL docs and computes stakedUnits per day
// from the picks collection.
//
// stakedUnits = sum of stakeUnits across picks whose gradedAt falls on that
// America/New_York calendar date (dailyPnL day ids are entered on an
// Eastern-time machine, so ET is the bucketing zone), excluding voids and
// pending picks — consistent with computeRecord's ROI denominator in
// src/utils/picks.js. Days with no computable graded picks get 0.
//
// Idempotent — safe to re-run; each mirror doc is simply overwritten with the
// freshly computed payload.
//
// USAGE:
//   node scripts/backfill-public-pnl.js          (dry run — reports only)
//   node scripts/backfill-public-pnl.js --apply  (writes the mirror docs)
//
// SETUP: needs service-account.json in the project root.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), 'service-account.json');
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Missing service-account.json at ${SERVICE_ACCOUNT_PATH}`);
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'))) });

const db = getFirestore();
const APPLY = process.argv.includes('--apply');

// ET calendar date (YYYY-MM-DD) for a Firestore Timestamp / Date.
function etDateId(ts) {
  const d = typeof ts?.toDate === 'function' ? ts.toDate() : ts;
  if (!(d instanceof Date) || isNaN(d.getTime())) return null;
  // en-CA gives YYYY-MM-DD directly.
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function main() {
  console.log(APPLY ? 'APPLY MODE — writing mirror docs.' : 'DRY RUN — no writes. Pass --apply to write.');

  // 1. Bucket graded picks' stakeUnits by ET gradedAt date. Voids excluded
  //    (computeRecord excludes them from the ROI denominator); pending picks
  //    have no gradedAt and are skipped.
  const picksSnap = await db.collection('picks').get();
  const stakedByDay = new Map();
  let gradedPicks = 0;
  for (const docSnap of picksSnap.docs) {
    const p = docSnap.data();
    if (p.status === 'pending' || p.status === 'void') continue;
    const day = etDateId(p.gradedAt);
    if (!day) continue;
    const u = num(p.stakeUnits);
    if (u <= 0) continue;
    stakedByDay.set(day, (stakedByDay.get(day) || 0) + u);
    gradedPicks++;
  }
  console.log(`Picks scanned: ${picksSnap.size} (${gradedPicks} graded picks with computable stakes across ${stakedByDay.size} ET days)`);

  // 2. Mirror every dailyPnL doc.
  const pnlSnap = await db.collection('dailyPnL').get();
  console.log(`dailyPnL docs to mirror: ${pnlSnap.size}\n`);

  let writer = APPLY ? db.batch() : null;
  let inBatch = 0;
  let written = 0;

  for (const docSnap of pnlSnap.docs) {
    const id = docSnap.id;
    const d = docSnap.data();
    const staked = stakedByDay.get(id) || 0;
    const payload = {
      units: num(d.units),
      wins: num(d.wins),
      losses: num(d.losses),
      pushes: num(d.pushes),
      stakedUnits: Math.round(staked * 100) / 100,
    };
    console.log(
      `${APPLY ? 'WRITE' : 'would write'} dailyPnLPublic/${id}: ` +
      `units=${payload.units} W-L-P=${payload.wins}-${payload.losses}-${payload.pushes} ` +
      `stakedUnits=${payload.stakedUnits}`
    );
    if (APPLY) {
      writer.set(db.collection('dailyPnLPublic').doc(id), payload);
      inBatch++;
      written++;
      if (inBatch >= 400) {
        await writer.commit();
        writer = db.batch();
        inBatch = 0;
      }
    }
  }
  if (APPLY && inBatch > 0) await writer.commit();

  // 3. Flag orphaned mirror docs (mirror exists, private day deleted).
  const mirrorSnap = await db.collection('dailyPnLPublic').get();
  const privateIds = new Set(pnlSnap.docs.map((s) => s.id));
  const orphans = mirrorSnap.docs.map((s) => s.id).filter((id) => !privateIds.has(id));
  if (orphans.length > 0) {
    console.log(`\nWARNING: ${orphans.length} mirror doc(s) with no matching dailyPnL day (not touched): ${orphans.join(', ')}`);
  }

  console.log(APPLY
    ? `\nDone. ${written} mirror doc(s) written.`
    : `\nDry run complete. ${pnlSnap.size} doc(s) would be written. Re-run with --apply to write.`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
