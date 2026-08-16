// Data layer for the anonymous landing page. Everything here reads only
// world-readable surfaces:
//   * picksPublic         — stubs (statuses + timestamps) for the W-L-P record
//                           and the live pending count (same counting rules as
//                           /card: pending excluded from the record)
//   * dailyPnLPublic      — numeric mirror of dailyPnL (units, wins, losses,
//                           pushes, stakedUnits) for net units, the equity
//                           curve, and ROI
//   * picks (access=='public') — free-pick samples, readable by anyone per
//                           the rules; the list query MUST filter on access
//                           so the rule is provable
import {
  collection, getDocs, query, where, orderBy, limit, documentId,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { getPublicStubs } from './picks.js';

// W-L-P + pending count from the world-readable stubs.
export async function fetchPublicRecord() {
  const stubs = await getPublicStubs();
  let wins = 0, losses = 0, pushes = 0, pending = 0;
  for (const s of stubs) {
    if (s.status === 'win') wins++;
    else if (s.status === 'loss') losses++;
    else if (s.status === 'push') pushes++;
    else if (s.status === 'pending') pending++;
    // voids: graded but not part of the displayed W-L-P record (matches /card)
  }
  return { wins, losses, pushes, pending };
}

// Cumulative net-units series from the public P&L mirror. Doc ids are
// YYYY-MM-DD, so ordering by document id is chronological.
export async function fetchPublicPnLSeries() {
  const q = query(collection(db, 'dailyPnLPublic'), orderBy(documentId()), limit(2000));
  const snap = await getDocs(q);
  let cum = 0;
  let totalStaked = 0;
  const series = snap.docs.map((d) => {
    const data = d.data();
    const units = Number(data.units) || 0;
    cum = Math.round((cum + units) * 100) / 100;
    totalStaked += Number(data.stakedUnits) || 0;
    return { id: d.id, units, cum };
  });
  return { series, netUnits: cum, totalStaked: Math.round(totalStaked * 100) / 100 };
}

// Newest graded free picks (access=='public'), full details.
export async function fetchFreePicks(maxCards = 3) {
  const q = query(
    collection(db, 'picks'),
    where('access', '==', 'public'),
    orderBy('postedAt', 'desc'),
    limit(24)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.status === 'win' || p.status === 'loss' || p.status === 'push')
    .slice(0, maxCards);
}
