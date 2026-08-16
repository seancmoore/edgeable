import { useMemo, useRef, useState } from 'react';
import { curvePaths, fmtUnits, fmtDay } from './curve.js';

// "Inside the app" phone-frame demo (Section 5), ported from the approved
// mock. Edgeable = the REAL all-time curve from dailyPnLPublic. Yours and
// Compare use an illustrative since-join window derived from the real data's
// last ~55 days (rebased to zero at the join date) and are labeled as an
// illustration. Recent-day rows are the real last three P&L days.
//
// props.series: [{ id, units, cum }] chronological (may be short or empty).

const MW = 260, MTOP = 6, MBOT = 90;
const JOIN_WINDOW_DAYS = 55;

export default function PhoneDemo({ series }) {
  const [scope, setScope] = useState('edgeable');
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const chartRef = useRef(null);

  const data = useMemo(() => {
    const allVals = series.map((p) => p.cum);
    const netAll = allVals.length ? allVals[allVals.length - 1] : 0;

    // Illustrative since-join window: the same record, counted only from a
    // join date ~55 days back (or the whole history when shorter).
    const start = Math.max(0, series.length - JOIN_WINDOW_DAYS);
    const windowPts = series.slice(start);
    const base = start > 0 ? series[start - 1].cum : 0;
    const yoursVals = windowPts.map((p) => Math.round((p.cum - base) * 10) / 10);
    const netYours = yoursVals.length ? yoursVals[yoursVals.length - 1] : 0;
    const joinLabel = windowPts.length ? fmtDay(windowPts[0].id) : '';

    const edge = curvePaths(allVals, MW, MTOP, MBOT);
    const yours = curvePaths(yoursVals, MW, MTOP, MBOT);
    // Compare: both curves on ONE shared y-scale so the two are honestly
    // comparable inside the same plot.
    const sharedScale = curvePaths([...allVals, ...yoursVals], MW, MTOP, MBOT);
    const mk = (vals) => {
      if (vals.length < 2) return '';
      const pts = vals.map((v, i) => [(i / (vals.length - 1)) * MW, sharedScale.y(v)]);
      let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        const cl = (y) => Math.max(MTOP, Math.min(MBOT, y));
        d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + cl(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)
           + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + cl(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)
           + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
      }
      return d;
    };
    const cmpEdgeD = mk(allVals);
    const cmpYoursD = mk(yoursVals);

    return {
      joinLabel,
      scopes: {
        edgeable: {
          stat: `${fmtUnits(netAll)} units`,
          when: 'All time',
          net: netAll,
          curve: edge.d,
          area: edge.area,
          curve2: '',
        },
        yours: {
          stat: `${fmtUnits(netYours)} units`,
          when: joinLabel ? `Since joining, ${joinLabel} (illustration)` : 'Since joining (illustration)',
          net: netYours,
          curve: yours.d,
          area: yours.area,
          curve2: '',
        },
        compare: {
          stat: `${fmtUnits(netAll)} / ${fmtUnits(netYours)} units`,
          when: joinLabel ? `All time vs since ${joinLabel} (illustration)` : 'All time vs since joining (illustration)',
          net: netAll,
          curve: cmpEdgeD,
          area: cmpEdgeD ? `${cmpEdgeD}L${MW} ${sharedScale.zeroY.toFixed(1)}L0 ${sharedScale.zeroY.toFixed(1)}Z` : '',
          curve2: cmpYoursD,
        },
      },
      zeroY: { edgeable: edge.zeroY, yours: yours.zeroY, compare: sharedScale.zeroY },
    };
  }, [series]);

  const recentDays = useMemo(() => series.slice(-3).reverse(), [series]);

  const cur = data.scopes[scope];

  const switchScope = (next) => {
    if (next === scope) return;
    if (reduced) {
      setScope(next);
      return;
    }
    // Fade the whole mini chart out, swap, fade back in; the legend expands
    // in parallel via the animated grid row so the panel stretches smoothly.
    const el = chartRef.current;
    if (el) el.style.opacity = '0';
    window.setTimeout(() => {
      setScope(next);
      if (el) el.style.opacity = '1';
    }, 180);
  };

  return (
    <div className="app-preview" data-reveal>
      <span className="eyebrow">Inside the app</span>
      <div
        className="phone"
        aria-label="Interactive preview of the subscriber dashboard performance card. Toggle between Edgeable's full record and Yours, the same record since your join date."
      >
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-screen">
          <span className="seg" role="group" aria-label="Performance scope">
            {[['edgeable', 'Edgeable'], ['yours', 'Yours'], ['compare', 'Compare']].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={scope === key ? 'seg-btn on' : 'seg-btn'}
                aria-pressed={scope === key}
                onClick={() => switchScope(key)}
              >
                {label}
              </button>
            ))}
          </span>
          <div className={`mini-stat${cur.net < 0 ? ' neg' : ''}${scope === 'compare' ? ' compact' : ''}`}>{cur.stat}</div>
          <div className="mini-when">{cur.when}</div>
          <div className="mini-chart" ref={chartRef}>
            <svg viewBox={`0 0 ${MW} 96`} aria-hidden="true">
              <defs>
                <linearGradient id="gold-fill-mini" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" className="fill-stop-top" />
                  <stop offset="1" className="fill-stop-bot" />
                </linearGradient>
              </defs>
              <path className="area-fill" d={cur.area} />
              <line className="zero-baseline" x1="0" y1={data.zeroY[scope].toFixed(1)} x2={MW} y2={data.zeroY[scope].toFixed(1)} strokeWidth="1" />
              <path className="curve" pathLength="1" fill="none" strokeWidth="2" strokeLinecap="round" d={cur.curve} />
              {/* second curve for the Compare view (Yours): dashed + muted =
                  distinguishable without color alone */}
              {cur.curve2 && (
                <path className="curve2" fill="none" strokeWidth="2" strokeLinecap="round" d={cur.curve2} />
              )}
            </svg>
          </div>
          {/* Always mounted: the wrapper's grid row animates 0fr to 1fr so the
              panel stretches smoothly instead of jumping when Compare opens. */}
          <div className={scope === 'compare' ? 'mini-legend-wrap open' : 'mini-legend-wrap'} aria-hidden="true">
            <div className="mini-legend">
              <span><i className="lg-solid" />Edgeable, all time</span>
              <span><i className="lg-dash" />Yours, since {data.joinLabel || 'joining'}</span>
            </div>
          </div>
          {recentDays.length > 0 && (
            <div className="mini-days" aria-hidden="true">
              {recentDays.map((d) => (
                <div className="mini-day" key={d.id}>
                  <span>{fmtDay(d.id)}</span>
                  <span className={d.units > 0 ? 'd-win' : d.units < 0 ? 'd-loss' : undefined}>
                    {fmtUnits(d.units)}u
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="app-blurb">
        Yours is the same record, counted from the day you join. Early on your curve looks smaller.
        Stay, and the two charts grow together: the longer you ride the record, the more of its
        long-run growth ends up yours.
      </p>
    </div>
  );
}
