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
  return (
    <EdgeableLogo
      variant="lockup"
      mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
      height={SIZE_HEIGHTS[size] || SIZE_HEIGHTS.md}
      className={cn('shrink-0', className)}
      aria-label="Edgeable"
    />
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
