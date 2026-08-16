// Shared SVG curve helpers for the landing page charts (ported from the
// approved mock, mocks/join.html). All charts obey the honest-chart law:
// the y-scale always includes 0, the zero baseline is always rendered, and
// smoothing control points are clamped to the plot band so the drawn curve
// never overshoots past the data extremes.

// Catmull-Rom -> cubic Bezier smoothing over [x, y] points.
export function smoothPath(pts, top, bot) {
  if (!pts || pts.length < 2) return '';
  const cl = (y) => Math.max(top, Math.min(bot, y));
  let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + cl(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)
       + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + cl(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)
       + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
  }
  return d;
}

// x/y scales for a value array in an SVG band. Zero is always inside the
// y-domain (no truncation).
export function scaleSeries(vals, width, top, bot) {
  const min = Math.min(0, ...vals);
  const max = Math.max(0, ...vals);
  const span = (max - min) || 1;
  const y = (v) => bot - ((v - min) / span) * (bot - top);
  const x = (i) => (vals.length > 1 ? (i / (vals.length - 1)) * width : width);
  return { x, y, zeroY: y(0) };
}

// Curve + closed area path for a value array in a band.
export function curvePaths(vals, width, top, bot) {
  const { x, y, zeroY } = scaleSeries(vals, width, top, bot);
  const pts = vals.map((v, i) => [x(i), y(v)]);
  const d = smoothPath(pts, top, bot);
  const area = d ? `${d}L${width} ${zeroY.toFixed(1)}L0 ${zeroY.toFixed(1)}Z` : '';
  const endY = pts.length ? pts[pts.length - 1][1] : zeroY;
  return { d, area, zeroY, endY, x, y };
}

export function fmtUnits(v) {
  const n = Math.round((Number(v) || 0) * 10) / 10;
  return (n >= 0 ? '+' : '') + n.toFixed(1);
}

// 'YYYY-MM-DD' -> 'Aug 14'
export function fmtDay(id) {
  const d = new Date(id + 'T00:00:00');
  if (isNaN(d.getTime())) return id;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
