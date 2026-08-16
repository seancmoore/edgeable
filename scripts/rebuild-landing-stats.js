// Rebuild landingStats/current, the single world-readable summary doc the
// anonymous landing page reads, from its sources: dailyPnLPublic (series,
// net units, staked), picksPublic (W-L-P + pending), and picks where
// access=='public' (free-pick samples).
//
// This is the repair tool: fully derived and idempotent, safe to run any
// time. The same rebuild also runs automatically after every P&L write in
// the app (src/utils/pnl.js) and in scripts/add-pnl-day.js.
//
// USAGE:
//   node scripts/rebuild-landing-stats.js
//
// SETUP: needs service-account.json in the project root.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { rebuildLandingStats } from './_landing-stats.mjs';

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), 'service-account.json');
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Missing service-account.json at ${SERVICE_ACCOUNT_PATH}`);
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'))) });
const db = getFirestore();

const s = await rebuildLandingStats(db);
console.log(
  `landingStats/current rebuilt: ${s.series.length} day(s), ` +
  `netUnits=${s.netUnits}, totalStaked=${s.totalStaked}, ` +
  `record=${s.record.wins}-${s.record.losses}-${s.record.pushes} ` +
  `(${s.record.pending} pending), freePicks=${s.freePicks.length}`
);
