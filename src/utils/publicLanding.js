// Data layer for the anonymous landing page. One read, total:
//   landingStats/current, a world-readable summary doc holding raw numbers
//   only, rebuilt by the admin write paths (src/utils/pnl.js savePnLEntry /
//   deletePnLEntry, scripts/add-pnl-day.js) and repairable any time with
//   scripts/rebuild-landing-stats.js. Shape:
//     { series: [{ d: 'YYYY-MM-DD', u: units }...] (chronological),
//       netUnits, totalStaked,
//       record: { wins, losses, pushes, pending },
//       freePicks: [up to 3 of { desc, sport, odds, stake, status,
//                                postedAt: ISO, gameStartTime: ISO }],
//       updatedAt }
// The three exports below keep their old signatures/return shapes so
// Landing.jsx is unchanged; all three share a single cached getDoc.
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

let summaryPromise = null;

// One fetch shared by all three callers. A missing doc is empty data, not an
// error; a failed fetch clears the cache so a remount can retry.
function loadSummary() {
  if (!summaryPromise) {
    summaryPromise = getDoc(doc(db, 'landingStats', 'current'))
      .then((snap) => (snap.exists() ? snap.data() : null))
      .catch((err) => {
        summaryPromise = null;
        throw err;
      });
  }
  return summaryPromise;
}

// W-L-P + pending count (pending excluded from the record, same as /card).
export async function fetchPublicRecord() {
  const s = await loadSummary();
  const r = s?.record || {};
  return {
    wins: Number(r.wins) || 0,
    losses: Number(r.losses) || 0,
    pushes: Number(r.pushes) || 0,
    pending: Number(r.pending) || 0,
  };
}

// Cumulative net-units series. The doc stores raw per-day units; cum is
// derived here so the summary stays pure numbers.
export async function fetchPublicPnLSeries() {
  const s = await loadSummary();
  const raw = Array.isArray(s?.series) ? s.series : [];
  let cum = 0;
  const series = raw.map((p) => {
    const units = Number(p.u) || 0;
    cum = Math.round((cum + units) * 100) / 100;
    return { id: p.d, units, cum };
  });
  return {
    series,
    netUnits: Number(s?.netUnits) || 0,
    totalStaked: Number(s?.totalStaked) || 0,
  };
}

// Newest graded free picks, already selected at rebuild time. ISO strings are
// rehydrated to Timestamps so formatPostedAt/pickNetUnits keep working.
export async function fetchFreePicks(maxCards = 3) {
  const s = await loadSummary();
  const raw = Array.isArray(s?.freePicks) ? s.freePicks : [];
  return raw.slice(0, maxCards).map((p, i) => ({
    id: `free-${i}`,
    sport: p.sport,
    description: p.desc,
    odds: p.odds,
    stakeUnits: p.stake,
    status: p.status,
    postedAt: p.postedAt ? Timestamp.fromDate(new Date(p.postedAt)) : null,
    gameStartTime: p.gameStartTime ? Timestamp.fromDate(new Date(p.gameStartTime)) : null,
  }));
}
