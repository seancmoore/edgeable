import { useId } from 'react';

/**
 * Edgeable — "sliced & sliding" identity.
 * The diagonal gold blade is the cut; the top half of each letter slides left
 * along it. Built as live SVG <text> so it scales perfectly. Requires the
 * "Bodoni Moda" web font to be loaded (already imported in index.css).
 *
 * <EdgeableLogo />                         → icon + wordmark lockup (dark surfaces)
 * <EdgeableLogo variant="wordmark" />      → wordmark only
 * <EdgeableLogo variant="icon" />          → icon only (app icon / avatar / favicon)
 * <EdgeableLogo mode="light" />            → charcoal letters + brass blade (light surfaces)
 * Size with `height` (px) or just set CSS font-size/height on the wrapper.
 */
export default function EdgeableLogo({
  variant = 'lockup',
  mode = 'dark',
  height,
  className,
  ...rest
}) {
  const uid = useId().replace(/:/g, '');
  const wTop = `wTop-${uid}`;
  const wBot = `wBot-${uid}`;
  const iTop = `iTop-${uid}`;
  const iBot = `iBot-${uid}`;

  const letter = mode === 'light' ? '#1c1813' : '#f4efe6';
  const blade = mode === 'light' ? '#b58a3c' : '#d8b773';
  const wordFont = "600 104px 'Bodoni Moda', serif";
  const iconFont = "600 132px 'Bodoni Moda', serif";

  const Wordmark = (props) => (
    <svg viewBox="0 0 520 150" style={{ overflow: 'visible', display: 'block' }} {...props}>
      <defs>
        <clipPath id={wTop}><polygon points="-60,-60 580,-60 580,51.9 -60,103.1" /></clipPath>
        <clipPath id={wBot}><polygon points="-60,103.1 580,51.9 580,210 -60,210" /></clipPath>
      </defs>
      <g clipPath={`url(#${wTop})`} transform="translate(-14,1.12)">
        <text x="260" y="113" textAnchor="middle" style={{ font: wordFont, fill: letter, letterSpacing: '.5px' }}>Edgeable</text>
      </g>
      <g clipPath={`url(#${wBot})`}>
        <text x="260" y="113" textAnchor="middle" style={{ font: wordFont, fill: letter, letterSpacing: '.5px' }}>Edgeable</text>
      </g>
      <line x1="6" y1="97.8" x2="520" y2="56.7" stroke={blade} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );

  const Icon = (props) => (
    <svg viewBox="0 0 110 130" style={{ overflow: 'visible', display: 'block' }} {...props}>
      <defs>
        <clipPath id={iTop}><polygon points="-30,-30 140,-30 140,49.1 -30,90.9" /></clipPath>
        <clipPath id={iBot}><polygon points="-30,90.9 140,49.1 140,160 -30,160" /></clipPath>
      </defs>
      <g clipPath={`url(#${iTop})`} transform="translate(-17,4.7)">
        <text x="55" y="116" textAnchor="middle" style={{ font: iconFont, fill: letter }}>E</text>
      </g>
      <g clipPath={`url(#${iBot})`}>
        <text x="55" y="116" textAnchor="middle" style={{ font: iconFont, fill: letter }}>E</text>
      </g>
      <line x1="12" y1="82" x2="98" y2="58" stroke={blade} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );

  if (variant === 'icon') {
    return <span className={className} style={{ display: 'inline-flex', height }} {...rest}><Icon height={height} /></span>;
  }
  if (variant === 'wordmark') {
    return <span className={className} style={{ display: 'inline-flex', height }} {...rest}><Wordmark height={height} /></span>;
  }
  // lockup
  const h = height || 28;
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: h * 0.55 }} {...rest}>
      <Icon height={h * 1.18} />
      <Wordmark height={h} />
    </span>
  );
}
