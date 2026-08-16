import { useEffect, useMemo, useRef, useState } from 'react';
import { smoothPath, scaleSeries, fmtUnits, fmtDay } from './curve.js';

// Interactive performance chart (Section 2 of the landing page), ported from
// the approved mock (mocks/join.html). Range tabs swap the dataset with a
// ~500ms re-draw; pointer scrub reads real points with a clamped inverse
// tooltip. Chart honesty holds in every range: zero baseline always rendered
// (inside the plot when a range dips below 0), y-axis never truncated, dips
// shown. Reduced motion: instant swaps, dot static, chart renders complete.
//
// props.series: [{ id: 'YYYY-MM-DD', units, cum }] chronological.

const W = 1000, TOP = 10, BOT = 310;
const RANGE_DAYS = { '1W': 7, '1M': 31, '3M': 91 };
const RANGE_KEYS = ['1W', '1M', '3M', 'All'];
const NAMES = { '1W': 'Past week', '1M': 'Past month', '3M': 'Past 3 months', 'All': 'All time' };

// Window the cumulative series to a range key. The window is rebased so it
// shows net change over the range (base = cumulative total before the
// window); for 'All' the base is 0 and the curve is the full record.
function view(series, key) {
  let startIdx = 0;
  if (key !== 'All') {
    const days = RANGE_DAYS[key];
    const last = new Date(series[series.length - 1].id + 'T00:00:00');
    const cutoff = new Date(last);
    cutoff.setDate(cutoff.getDate() - (days - 1));
    startIdx = series.findIndex((p) => new Date(p.id + 'T00:00:00') >= cutoff);
    if (startIdx < 0) startIdx = 0;
  }
  const base = startIdx > 0 ? series[startIdx - 1].cum : 0;
  const pts = series.slice(startIdx);
  const vals = pts.map((p) => Math.round((p.cum - base) * 10) / 10);
  return { key, pts, vals, net: vals.length ? vals[vals.length - 1] : 0 };
}

export default function LandingChart({ series }) {
  const [range, setRange] = useState('All');
  const [note, setNote] = useState('');
  const [announceText, setAnnounceText] = useState('');
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const frameRef = useRef(null);
  const svgRef = useRef(null);
  const curveRef = useRef(null);
  const areaRef = useRef(null);
  const dotRef = useRef(null);
  const scrubMarkRef = useRef(null);
  const scrubLineRef = useRef(null);
  const scrubPtRef = useRef(null);
  const chipRef = useRef(null);
  const swappingRef = useRef(false);
  const firstRenderRef = useRef(true);

  const v = useMemo(() => view(series, range), [series, range]);
  const geom = useMemo(() => {
    const { x, y, zeroY } = scaleSeries(v.vals, W, TOP, BOT);
    const points = v.vals.map((val, i) => [x(i), y(val)]);
    const d = smoothPath(points, TOP, BOT);
    return {
      x, y, zeroY,
      d,
      area: d ? `${d}L${W} ${zeroY.toFixed(1)}L0 ${zeroY.toFixed(1)}Z` : '',
      endY: points.length ? points[points.length - 1][1] : zeroY,
    };
  }, [v]);

  const lastId = series[series.length - 1].id;
  const whenLabel = v.key === 'All' ? 'All time' : `${fmtDay(v.pts[0].id)} to ${fmtDay(lastId)}`;
  const xLabels = useMemo(() => {
    const n = v.pts.length;
    if (n < 2) return [];
    return [0, 1, 2, 3].map((i) => fmtDay(v.pts[Math.round((i / 3) * (n - 1))].id));
  }, [v]);

  // The main chart's sweep waits until ~60% of the frame is in the viewport
  // (the CSS pauses its animations until .chart-go lands).
  useEffect(() => {
    if (reduced) return;
    if (!('IntersectionObserver' in window)) {
      frameRef.current?.classList.add('chart-go');
      return;
    }
    const frame = frameRef.current;
    if (!frame) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('chart-go'); // once only
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    io.observe(frame);
    return () => io.disconnect();
  }, [reduced]);

  const hideScrub = () => {
    scrubMarkRef.current?.classList.remove('on');
    chipRef.current?.classList.remove('on');
  };

  // Range activation: roving tabindex + the animated ~500ms re-draw. React
  // renders the new path first; this effect then drives the dash re-draw
  // exactly like the mock (skipped on first paint, where the load-time CSS
  // sweep owns the animation).
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return undefined;
    }
    hideScrub();
    setAnnounceText(`${NAMES[v.key]}: ${fmtUnits(v.net)} net units.`);
    if (reduced) return undefined;
    const curve = curveRef.current;
    const area = areaRef.current;
    const dot = dotRef.current;
    if (!curve || !area || !dot) return undefined;
    swappingRef.current = true;
    // First interaction clears the load-time CSS animations (their forwards
    // fill would override inline styles), then the swap is driven inline.
    curve.style.animation = 'none';
    area.style.animation = 'none';
    dot.style.animation = 'none';
    dot.style.opacity = '0'; // the live dot hides during the transition
    area.style.opacity = '0';
    curve.style.transition = 'none';
    curve.style.strokeDasharray = '1';
    curve.style.strokeDashoffset = '1';
    void curve.getBoundingClientRect(); // reflow so the redraw starts from zero
    curve.style.transition = 'stroke-dashoffset 500ms var(--ease)';
    curve.style.strokeDashoffset = '0';
    area.style.transition = 'opacity 400ms var(--ease) 150ms';
    area.style.opacity = '1';
    const t = window.setTimeout(() => {
      dot.style.transition = 'opacity 260ms var(--ease)';
      dot.style.opacity = '1'; // and reappears on the new endpoint
      swappingRef.current = false;
    }, 500);
    return () => window.clearTimeout(t);
  }, [v, reduced]);

  const selectRange = (key, focusEl) => {
    // Sparse range: fall back to All silently, with the honest note.
    if (key !== 'All' && view(series, key).pts.length < 2) {
      setNote('Not enough history for this range. Showing all available data.');
      key = 'All';
    } else {
      setNote('');
    }
    if (focusEl) focusEl.focus();
    setRange(key);
  };

  const onTabKeyDown = (e, idx) => {
    let next = null;
    if (e.key === 'ArrowRight') next = RANGE_KEYS[(idx + 1) % RANGE_KEYS.length];
    if (e.key === 'ArrowLeft') next = RANGE_KEYS[(idx - 1 + RANGE_KEYS.length) % RANGE_KEYS.length];
    if (next) {
      e.preventDefault();
      const btn = e.currentTarget.parentElement.querySelector(`[data-range="${next}"]`);
      selectRange(next, btn);
    }
  };

  // Scrub: crosshair + date/units chip, instant updates (no easing).
  // touch-action: pan-y stays on the svg so page scroll is never hijacked.
  const scrub = (e) => {
    if (swappingRef.current || v.vals.length < 2) return;
    const svg = svgRef.current;
    const chip = chipRef.current;
    if (!svg || !chip) return;
    const r = svg.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const i = Math.round(f * (v.vals.length - 1));
    const px = v.vals.length > 1 ? (i / (v.vals.length - 1)) * W : W;
    const py = geom.y(v.vals[i]);
    scrubLineRef.current.setAttribute('x1', px.toFixed(1));
    scrubLineRef.current.setAttribute('x2', px.toFixed(1));
    scrubPtRef.current.setAttribute('cx', px.toFixed(1));
    scrubPtRef.current.setAttribute('cy', py.toFixed(1));
    scrubMarkRef.current.classList.add('on');
    chip.textContent = `${fmtDay(v.pts[i].id)} · ${fmtUnits(v.vals[i])}u`;
    chip.classList.add('on');
    // Clamp the chip using its REAL half-width (measured after the text is
    // set) so it stays fully on-screen at the edges on narrow viewports.
    const half = (chip.offsetWidth / 2) || 56;
    chip.style.left = `${Math.min(r.width - half, Math.max(half, f * r.width))}px`;
  };

  const valClass = v.net < 0 ? 'val neg' : v.net === 0 ? 'val zero' : 'val';

  return (
    <div className="frame chart-frame" data-reveal ref={frameRef}>
      <div className="frame-chrome" aria-hidden="true">
        <span className="frame-dots"><span /><span /><span /></span>
        <span className="frame-addr">edgeabled.web.app/card</span>
      </div>
      <div className="chart-body">
        <div className="chart-top">
          <div className="chart-headline">
            <div className={valClass}>{fmtUnits(v.net)} units</div>
            <div className="when">{whenLabel}</div>
          </div>
          <div className="range-tabs" role="tablist" aria-label="Chart range">
            {RANGE_KEYS.map((key, idx) => (
              <button
                key={key}
                role="tab"
                type="button"
                data-range={key}
                aria-selected={range === key}
                tabIndex={range === key ? 0 : -1}
                onClick={(e) => selectRange(key, e.currentTarget)}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
              >
                {key}
              </button>
            ))}
          </div>
          {/* announces the selected range + its net units to screen readers */}
          <div className="sr-only chart-announce" aria-live="polite">{announceText}</div>
        </div>

        <div className="chart-wrap">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} 320`}
            role="img"
            aria-label={`Cumulative net units, ${fmtDay(v.pts[0].id)} to ${fmtDay(lastId)}. Ends at ${fmtUnits(v.net)} units. Zero baseline shown.`}
            onPointerMove={scrub}
            onPointerDown={scrub}
            onPointerLeave={hideScrub}
          >
            <defs>
              <linearGradient id="gold-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" className="fill-stop-top" />
                <stop offset="1" className="fill-stop-bot" />
              </linearGradient>
            </defs>
            {/* soft gold area fill under the curve (same data path, closed to the baseline) */}
            <path ref={areaRef} className="area-fill" d={geom.area} />
            {/* zero baseline: the one information-bearing hairline */}
            <line className="zero-baseline" x1="0" y1={geom.zeroY.toFixed(1)} x2={W} y2={geom.zeroY.toFixed(1)} strokeWidth="1" />
            {/* equity curve over the real dailyPnLPublic data */}
            <path
              ref={curveRef}
              className="curve"
              pathLength="1"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              d={geom.d}
            />
            {/* live dot on the last data point; the halo pulse is one of the
                page's two permitted ambient loops */}
            <g className="chart-dot" aria-hidden="true" ref={dotRef}>
              <circle className="dot-halo" cx={W} cy={geom.endY.toFixed(1)} r="5" />
              <circle className="dot-core" cx={W} cy={geom.endY.toFixed(1)} r="4.5" />
            </g>
            {/* scrub crosshair: shown only while the pointer is over the chart */}
            <g className="scrub-mark" aria-hidden="true" ref={scrubMarkRef}>
              <line className="scrub-line" ref={scrubLineRef} x1="0" y1={TOP} x2="0" y2={BOT} />
              <circle className="scrub-pt" ref={scrubPtRef} r="4" cx="0" cy="0" />
            </g>
          </svg>
          <div className="scrub-chip mono" aria-hidden="true" ref={chipRef} />
          {xLabels.length > 0 && (
            <div className="x-labels" aria-hidden="true">
              {xLabels.map((label, i) => <span key={i}>{label}</span>)}
            </div>
          )}
        </div>
        {note && <p className="chart-note">{note}</p>}
      </div>
    </div>
  );
}
