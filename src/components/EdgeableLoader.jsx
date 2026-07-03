import { useId } from 'react';
import { useTheme } from '../ThemeContext.jsx';
import { cn } from '../lib/utils.js';

/**
 * Animated Edgeable mark used as a loading indicator. Reuses the icon geometry
 * from EdgeableLogo, but the gold blade repeatedly "cuts" across the E while
 * the top slice slides, over a pulsing gold glow. Animation lives in index.css
 * (.ec-blade / .ec-slice / .ec-glow) and respects prefers-reduced-motion.
 */
export default function EdgeableLoader({ height = 56, className, label = 'Loading' }) {
  const { resolvedTheme } = useTheme();
  const uid = useId().replace(/:/g, '');
  const light = resolvedTheme !== 'dark';
  const letter = light ? '#1c1813' : '#f4efe6';
  const blade = light ? '#b58a3c' : '#d8b773';
  const font = "600 132px 'Bodoni Moda', Georgia, serif";

  return (
    <span
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ height }}
      role="status"
      aria-label={label}
    >
      <span className="ec-glow pointer-events-none absolute inset-0 rounded-full" aria-hidden />
      <svg viewBox="0 0 110 130" height={height} style={{ overflow: 'visible', display: 'block' }} aria-hidden>
        <defs>
          <clipPath id={`ldTop-${uid}`}><polygon points="-30,-30 140,-30 140,49.1 -30,90.9" /></clipPath>
          <clipPath id={`ldBot-${uid}`}><polygon points="-30,90.9 140,49.1 140,160 -30,160" /></clipPath>
        </defs>
        <g className="ec-slice" clipPath={`url(#ldTop-${uid})`} style={{ transform: 'translate(-17px, 4.7px)' }}>
          <text x="55" y="116" textAnchor="middle" style={{ font, fill: letter }}>E</text>
        </g>
        <g clipPath={`url(#ldBot-${uid})`}>
          <text x="55" y="116" textAnchor="middle" style={{ font, fill: letter }}>E</text>
        </g>
        <line className="ec-blade" x1="12" y1="82" x2="98" y2="58" stroke={blade} strokeWidth="5" strokeLinecap="round" pathLength="100" />
      </svg>
    </span>
  );
}
