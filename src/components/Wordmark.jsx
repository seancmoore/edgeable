import EdgeableLogo from './EdgeableLogo.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { cn } from '../lib/utils.js';

/**
 * Edgeable wordmark — Edge Club "sliced & sliding" identity.
 * Thin wrapper over <EdgeableLogo> so existing call sites keep the same
 * { size, className } API while adopting the new brand. The logo picks
 * its dark/light glyph colors from the active theme.
 */
const SIZE_HEIGHTS = {
  sm: 20, // header lockup
  md: 26,
  lg: 34,
  xl: 46,
};

export default function Wordmark({ size = 'md', className }) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const h = SIZE_HEIGHTS[size] || SIZE_HEIGHTS.md;
  // Visibility is controlled on the wrapper spans, not on EdgeableLogo itself,
  // because EdgeableLogo sets an inline `display:inline-flex` that would
  // override Tailwind's `hidden`/`sm:hidden` (which toggle `display`).
  return (
    <>
      {/* Mobile: icon only. Desktop (sm+): full lockup. */}
      <span className={cn('shrink-0 sm:hidden', className)}>
        <EdgeableLogo variant="icon" mode={mode} height={h + 4} aria-label="Edgeable" />
      </span>
      <span className={cn('hidden shrink-0 sm:block', className)}>
        <EdgeableLogo variant="lockup" mode={mode} height={h} aria-label="Edgeable" />
      </span>
    </>
  );
}

/** Icon-only mark — for avatars, favicons, tight spots. */
export function EdgeMark({ className }) {
  const { resolvedTheme } = useTheme();
  return (
    <EdgeableLogo
      variant="icon"
      mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
      className={cn('inline-flex', className)}
      aria-label="Edgeable mark"
    />
  );
}
