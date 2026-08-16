// Shared Admin-SDK rebuild of landingStats/current, the single world-readable
// summary doc the anonymous landing page reads. Mirrors the client-side
// rebuild in src/utils/pnl.js (rebuildLandingStats): keep the two in sync.
//
// Doc shape (raw numbers only):
//   { series: [{ d: 'YYYY-MM-DD', u: units }...] (chronological),
//     netUnits, totalStaked,
//     record: { wins, losses, pushes, pending },   // voids ignored
//     freePicks: [up to 3 of { desc, sport, odds, stake, status,
//                              postedAt: ISO, gameStartTime: ISO }],
//     updatedAt }
//
// Sources: dailyPnLPublic (series/netUnits/totalStaked), picksPublic
// (record), picks where access=='public' (freePicks). Idempotent.

import { FieldPath, Timestamp } from 'firebase-admin/firestore';

function toIso(ts) {
  const d = typeof ts?.toDate === 'function' ? ts.toDate() : ts;
  return d instanceof Date && !isNaN(d.getTime()) ? d.toISOString() : null;
}

// Reads the sources, writes landingStats/current, and returns the payload.
export async function rebuildLandingStats(db) {
  // Per-day units series + totals. Doc ids are YYYY-MM-DD, so ordering by
  // document id is chronological.
  const pnlSnap = await db.collection('dailyPnLPublic')
    .orderBy(FieldPath.documentId()).limit(2000).get();
  let netUnits = 0;
  let totalStaked = 0;
  const series = pnlSnap.docs.map((docSnap) => {
    const u = Number(docSnap.data().units) || 0;
    netUnits = Math.round((netUnits + u) * 100) / 100;
    totalStaked += Number(docSnap.data().stakedUnits) || 0;
    return { d: docSnap.id, u };
  });

  // W-L-P + pending from the stubs (voids ignored).
  const stubSnap = await db.collection('picksPublic').get();
  let wins = 0, losses = 0, pushes = 0, pending = 0;
  for (const docSnap of stubSnap.docs) {
    const s = docSnap.data().status;
    if (s === 'win') wins++;
    else if (s === 'loss') losses++;
    else if (s === 'push') pushes++;
    else if (s === 'pending') pending++;
  }

  // Newest graded free picks (up to 3), timestamps as ISO strings.
  const freeSnap = await db.collection('picks')
    .where('access', '==', 'public').orderBy('postedAt', 'desc').limit(24).get();
  const freePicks = freeSnap.docs
    .map((docSnap) => docSnap.data())
    .filter((p) => ['win', 'loss', 'push'].includes(p.status))
    .slice(0, 3)
    .map((p) => ({
      desc: p.description || '',
      sport: p.sport || '',
      odds: Number(p.odds) || 0,
      stake: Number(p.stakeUnits) || 0,
      status: p.status,
      postedAt: toIso(p.postedAt),
      gameStartTime: toIso(p.gameStartTime),
    }));

  const payload = {
    series,
    netUnits,
    totalStaked: Math.round(totalStaked * 100) / 100,
    record: { wins, losses, pushes, pending },
    freePicks,
    updatedAt: Timestamp.now(),
  };
  await db.collection('landingStats').doc('current').set(payload);
  return payload;
}
