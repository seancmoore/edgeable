import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PerformanceChart from '../PerformanceChart.jsx';
import UnitSizeModal from './UnitSizeModal.jsx';
import { toDate, formatDate } from '../../utils/subscription.js';
import { summarizePnL, formatUnits } from '../../utils/pnl.js';
import { pickNetUnits } from '../../utils/picks.js';

const RANGES = [
  { key: 'week', label: 'Week', blurb: 'past week', days: 7 },
  { key: 'month', label: 'Month', blurb: 'past month', days: 30 },
  { key: '3m', label: '3M', blurb: 'past 3 months', days: 90 },
  { key: 'all', label: 'All', blurb: 'all time', days: null },
];

const SCOPES = [
  { key: 'edgeable', label: 'Edgeable' },
  { key: 'yours', label: 'Yours' },
  { key: 'compare', label: 'Compare' },
];

function fmtHeadline(units) {
  const v = Math.round((Number(units) || 0) * 100) / 100;
  return `${v >= 0 ? '+' : ''}${v} units`;
}

function fmtShort(units) {
  const v = Math.round((Number(units) || 0) * 100) / 100;
  return `${v >= 0 ? '+' : ''}${v}u`;
}

function dayLabel(ts) {
  const d = toDate(ts);
  return d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
}

function toSeries(list) {
  const asc = [...list].sort(
    (a, b) => (toDate(a.date)?.getTime() || 0) - (toDate(b.date)?.getTime() || 0),
  );
  let total = 0;
  return asc.map((e) => {
    total += Number(e.units || 0);
    const d = toDate(e.date);
    return { t: d ? d.getTime() : 0, date: d, cum: total };
  });
}

// Monotone-cubic smoothing (Fritsch-Carlson), local copy for the compare
// overlay (PerformanceChart keeps its own private version).
function smoothPath(xs, ys) {
  const n = xs.length;
  if (n < 2) return '';
  const dx = []; const slope = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = xs[i + 1] - xs[i] || 1e-6;
    slope[i] = (ys[i + 1] - ys[i]) / dx[i];
  }
  const m = new Array(n);
  m[0] = slope[0]; m[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / slope[i]; const b = m[i + 1] / slope[i];
    const h = Math.hypot(a, b);
    if (h > 3) { const t = 3 / h; m[i] = t * a * slope[i]; m[i + 1] = t * b * slope[i]; }
  }
  let d = `M ${xs[0].toFixed(2)} ${ys[0].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    d += ` C ${(xs[i] + dx[i] / 3).toFixed(2)} ${(ys[i] + (m[i] * dx[i]) / 3).toFixed(2)},`
      + ` ${(xs[i + 1] - dx[i] / 3).toFixed(2)} ${(ys[i + 1] - (m[i + 1] * dx[i]) / 3).toFixed(2)},`
      + ` ${xs[i + 1].toFixed(2)} ${ys[i + 1].toFixed(2)}`;
  }
  return d;
}

/** Compare overlay: Edgeable (solid gold + fill) vs Yours (dashed muted). */
function CompareChart({ seriesA, seriesB }) {
  const W = 640; const H = 200;
  const geom = useMemo(() => {
    if (seriesA.length < 2) return null;
    const all = [...seriesA, ...seriesB];
    const t0 = Math.min(...all.map((p) => p.t));
    const t1 = Math.max(...all.map((p) => p.t));
    const span = t1 - t0 || 1;
    const cums = all.map((p) => p.cum);
    const min = Math.min(...cums, 0);
    const max = Math.max(...cums, 0);
    const range = max - min || 1;
    const map = (s) => {
      const xs = s.map((p) => ((p.t - t0) / span) * W);
      const ys = s.map((p) => H - 10 - ((p.cum - min) / range) * (H - 20));
      return smoothPath(xs, ys);
    };
    const zeroY = H - 10 - ((0 - min) / range) * (H - 20);
    const pathA = map(seriesA);
    return {
      pathA,
      fillA: `${pathA} L ${W} ${zeroY.toFixed(2)} L 0 ${zeroY.toFixed(2)} Z`,
      pathB: seriesB.length >= 2 ? map(seriesB) : '',
      zeroY,
    };
  }, [seriesA, seriesB]);
  if (!geom) return null;
  return (
    <svg
      className="compare-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Cumulative net units: Edgeable (solid) compared with yours (dashed)."
    >
      <path className="area-fill" d={geom.fillA} />
      <line className="zero-baseline" x1="0" y1={geom.zeroY} x2={W} y2={geom.zeroY} strokeWidth="1" />
      <path className="curve" d={geom.pathA} pathLength="1" fill="none" strokeWidth="2.5" strokeLinecap="round" />
      {geom.pathB && (
        <path className="curve2" d={geom.pathB} fill="none" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * The Record tab: performance panel with the pinned Edgeable / Yours / Compare
 * scope toggle (chart draw re-triggers on every switch), recent days, the
 * unit-size panel + modal, and the record-integrity panel.
 *
 * "Yours" counts what you could see when it posted: free picks (graded public
 * picks) from stretches outside your membership window, plus every recorded
 * day inside it. A pick never counts twice: free picks graded inside the
 * window are skipped because the daily P&L for those days already includes them.
 */
export default function RecordView({ uid, userDoc, membership, entries, fullPicks, redrawSignal = 0 }) {
  const [scope, setScope] = useState('edgeable');
  const [range, setRange] = useState('all');
  const [drawKey, setDrawKey] = useState(0);
  const [showUnitModal, setShowUnitModal] = useState(false);

  const unitSize = Number(userDoc?.unitSize) > 0 ? Number(userDoc.unitSize) : 0;

  const start = toDate(userDoc?.subscriptionStart);
  const subEnd = toDate(userDoc?.subscriptionEnd);

  // "Yours" entry list: membership-window P&L days + free-pick days outside it.
  const yoursEntries = useMemo(() => {
    const now = new Date();
    const winEnd = subEnd && subEnd < now ? subEnd : now;
    const memberDays = start
      ? entries.filter((e) => {
          const d = toDate(e.date);
          return d && d >= start && d <= winEnd;
        })
      : [];

    // Free picks graded outside the membership window, bucketed per day.
    const freeByDay = new Map();
    for (const p of fullPicks) {
      if (p.access !== 'public') continue;
      if (!['win', 'loss', 'push'].includes(p.status)) continue;
      const g = toDate(p.gradedAt);
      if (!g) continue;
      if (start && g >= start && g <= winEnd) continue; // already in memberDays
      const key = `${g.getFullYear()}-${g.getMonth()}-${g.getDate()}`;
      const day = freeByDay.get(key) || { date: new Date(g.getFullYear(), g.getMonth(), g.getDate()), units: 0 };
      day.units += pickNetUnits(p);
      freeByDay.set(key, day);
    }
    return [...memberDays, ...freeByDay.values()];
  }, [entries, fullPicks, start, subEnd]);

  const rangeDef = RANGES.find((r) => r.key === range) || RANGES[3];
  const cutoff = rangeDef.days ? Date.now() - rangeDef.days * 86400000 : 0;
  const inRange = (list) => list.filter((e) => {
    const d = toDate(e.date);
    return d && d.getTime() >= cutoff;
  });

  const edgeableRanged = useMemo(() => inRange(entries), [entries, cutoff]); // eslint-disable-line react-hooks/exhaustive-deps
  const yoursRanged = useMemo(() => inRange(yoursEntries), [yoursEntries, cutoff]); // eslint-disable-line react-hooks/exhaustive-deps

  const edgeableSeries = useMemo(() => toSeries(edgeableRanged), [edgeableRanged]);
  const yoursSeries = useMemo(() => toSeries(yoursRanged), [yoursRanged]);

  const edgeableSummary = useMemo(() => summarizePnL(edgeableRanged), [edgeableRanged]);
  const edgeableTotal = edgeableSummary.totalUnits;
  const yoursTotal = yoursRanged.reduce((s, e) => s + Number(e.units || 0), 0);

  const yoursSince = yoursSeries.length ? formatDate(yoursSeries[0].date) : '';

  const yoursWhen = (() => {
    if (!yoursSeries.length) return 'No picks on your record yet';
    const base = `Since ${yoursSince}`;
    if (membership === 'vip' && start) return `${base} · free picks + full card from ${formatDate(start)}`;
    if (membership === 'expired' && subEnd) return `${base} · full card until ${formatDate(subEnd)}, free picks since`;
    return `${base} · free picks`;
  })();

  const SCOPE_NOTES = {
    free: 'Your curve counts every pick you could see when it posted. Right now that is the free picks. Go VIP and the full card starts counting from day one.',
    pending: 'Your curve counts every pick you could see when it posted. Your VIP is being verified now; once approved, the full card starts counting from that moment.',
    rejected: 'Your curve counts every pick you could see when it posted. Your VIP payment needs a quick fix; once it clears, the full card starts counting from approval.',
    vip: 'Your curve counts every pick you could see when it posted: free picks from before you joined, then the full card from your membership start. Each pick counts once, even when a card play also went out free.',
    expired: 'Your curve kept every pick from your VIP months and still counts free picks now. Renew and the full card picks up right where it left off.',
  };

  const recorded = edgeableSummary.wins + edgeableSummary.losses + edgeableSummary.pushes > 0;
  const edgeableWhen = `${rangeDef.blurb} · ${edgeableSummary.days} day${edgeableSummary.days === 1 ? '' : 's'}`
    + (recorded ? ` · ${edgeableSummary.wins}-${edgeableSummary.losses}-${edgeableSummary.pushes}` : '');

  const headlineTotal = scope === 'yours' ? yoursTotal : edgeableTotal;
  const headline = scope === 'compare'
    ? `${fmtShort(edgeableTotal)} / ${fmtShort(yoursTotal)}`
    : fmtHeadline(headlineTotal);
  const whenLine = scope === 'compare'
    ? `Edgeable, ${rangeDef.blurb} vs yours`
    : (scope === 'edgeable' ? edgeableWhen : yoursWhen);
  const valTone = headlineTotal > 0 ? '' : headlineTotal < 0 ? ' is-loss' : ' is-flat';

  const pickScope = (key) => {
    if (key === scope) return;
    setScope(key);
    setDrawKey((k) => k + 1); // remount the chart so the draw-in replays
  };
  const pickRange = (key) => {
    if (key === range) return;
    setRange(key);
    setDrawKey((k) => k + 1);
  };

  const recent = entries.slice(0, 5);
  const allTimeTotal = useMemo(
    () => entries.reduce((s, e) => s + Number(e.units || 0), 0),
    [entries],
  );

  const activeSeries = scope === 'yours' ? yoursSeries : edgeableSeries;

  return (
    <>
      <div className="greeting">
        <div>
          <h1>The record</h1>
          <p className="sub">Net units over time. Dips included, nothing deleted.</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="col">
          <section className="soft-card panel perf-panel" aria-label="Performance chart">
            <span className="seg" role="group" aria-label="Performance scope">
              {SCOPES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`seg-btn${scope === s.key ? ' on' : ''}`}
                  aria-pressed={scope === s.key}
                  onClick={() => pickScope(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </span>

            <div className="perf-top">
              <div>
                <div className={`perf-val${valTone}`}>{headline}</div>
                <div className="perf-when">{whenLine}</div>
              </div>
            </div>

            {scope === 'yours' && SCOPE_NOTES[membership] && (
              <p className="scope-note">{SCOPE_NOTES[membership]}</p>
            )}

            <div className="range-row">
              <span className="seg" role="group" aria-label="Chart range">
                {RANGES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    className={`seg-btn${range === r.key ? ' on' : ''}`}
                    aria-pressed={range === r.key}
                    onClick={() => pickRange(r.key)}
                  >
                    {r.label}
                  </button>
                ))}
              </span>
            </div>

            <div className={`perf-chart${scope === 'compare' ? ' chart-anim' : ''}`}>
              {scope === 'compare' ? (
                edgeableSeries.length >= 2 ? (
                  <div key={`cmp-${drawKey}-${redrawSignal}`}>
                    <CompareChart seriesA={edgeableSeries} seriesB={yoursSeries} />
                    <div className="chart-legend" aria-hidden="true">
                      <span><i />Edgeable, {rangeDef.blurb}</span>
                      <span>
                        <i className="lg-dash" />
                        {yoursSeries.length >= 2 ? `Yours · since ${yoursSince}` : 'Yours · not enough data yet'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="scope-note">Not enough data in this range yet.</p>
                )
              ) : activeSeries.length >= 2 ? (
                <PerformanceChart
                  key={`chart-${scope}-${range}-${drawKey}-${redrawSignal}`}
                  series={activeSeries}
                  height={200}
                />
              ) : (
                <p className="scope-note">Not enough data in this range yet.</p>
              )}
            </div>

            {recent.length > 0 && (
              <div className="recent-days" aria-label="Recent days">
                {recent.map((e) => (
                  <div className="day-row" key={e.id || dayLabel(e.date)}>
                    <span>{dayLabel(e.date)}</span>
                    <span className={Number(e.units) >= 0 ? 'd-win' : 'd-loss'}>
                      {fmtShort(e.units)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="col">
          <section className="soft-card panel" aria-label="Your units">
            <p className="eyebrow">Your unit size</p>
            {unitSize > 0 ? (
              <div>
                <div className="m-price">
                  <span className="amount mono">${unitSize % 1 ? unitSize.toFixed(2) : unitSize}</span>
                  <span className="per">= 1 unit</span>
                </div>
                <div className="sub-facts">
                  <div className="fact-row">
                    <span className="k">A 1u play costs you</span>
                    <span className="v">${unitSize % 1 ? unitSize.toFixed(2) : unitSize}</span>
                  </div>
                  <div className="fact-row">
                    <span className="k">A 0.5u play</span>
                    <span className="v">${(unitSize / 2) % 1 ? (unitSize / 2).toFixed(2) : unitSize / 2}</span>
                  </div>
                  <div className="fact-row">
                    <span className="k">{formatUnits(allTimeTotal).replace(' U', 'u')} all time equals</span>
                    <span
                      className="v"
                      style={{ color: allTimeTotal >= 0 ? 'hsl(var(--win))' : 'hsl(var(--loss))' }}
                    >
                      {allTimeTotal >= 0 ? '+' : '-'}${Math.abs(Math.round(allTimeTotal * unitSize))}
                    </span>
                  </div>
                </div>
                <p className="fact-note">
                  A unit is 1/500th of your bankroll (0.2%). Same unit whether you're up or down;
                  never resize on emotion.
                </p>
                <button className="link-quiet" type="button" onClick={() => setShowUnitModal(true)}>
                  Change unit size
                </button>
              </div>
            ) : (
              <div>
                <div className="m-price"><span className="amount mono">Not set</span></div>
                <p className="m-copy">
                  Picks are tracked in units, never dollars. A unit is 1/500th of your bankroll
                  (0.2%): set it once and every stake on the card scales to you.
                </p>
                <button className="cta-btn cta-outline" type="button" onClick={() => setShowUnitModal(true)}>
                  Set your unit size
                </button>
              </div>
            )}
          </section>

          <section className="soft-card panel" aria-label="Record integrity">
            <p className="eyebrow">Why you can trust this</p>
            <p className="m-copy">
              Every pick posts before game time with a server timestamp, grades one way when it
              settles, and can never be edited or deleted. Wins and losses stay up forever.
            </p>
            <Link className="link-quiet" to="/card">See the public record</Link>
          </section>
        </div>
      </div>

      {showUnitModal && (
        <UnitSizeModal
          uid={uid}
          currentUnitSize={unitSize}
          onClose={() => setShowUnitModal(false)}
        />
      )}
    </>
  );
}
