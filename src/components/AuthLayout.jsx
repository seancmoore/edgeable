import { Link } from 'react-router-dom';
import Wordmark from './Wordmark.jsx';
import ThemeToggle from './ThemeToggle.jsx';

// Shared "Dusk Ledger" auth styles (per mocks/login.html, signup.html, forgot-password.html).
// Gold text falls back to --primary if --primary-text isn't defined yet.
export const goldTextClass = 'text-[hsl(var(--primary-text,var(--primary)))]';
export const goldHoverTextClass = 'hover:text-[hsl(var(--primary-text,var(--primary)))]';
export const goldLinkClass = `font-semibold ${goldTextClass} hover:underline`;
export const authInputClass = 'h-12 rounded-lg px-4';
export const authButtonClass =
  'min-h-[52px] h-auto w-full rounded-full border border-ring bg-gold text-gold-ink text-base font-semibold ' +
  'hover:bg-gold hover:brightness-[1.04] active:translate-y-px';
export const authAlertClass =
  'flex items-start gap-3 rounded-lg border border-[hsl(var(--destructive)/0.35)] ' +
  'bg-[hsl(var(--destructive)/0.08)] px-3.5 py-3 text-sm text-destructive';

const WIDTHS = { md: 'max-w-[440px]', lg: 'max-w-[460px]' };

/**
 * Dusk Ledger auth frame: wordmark header on the continuous dusk gradient,
 * one centered glow-ring card, fine-print legal footer with centered links.
 *
 * - `mark`: optional node rendered above the card (icon tile + eyebrow).
 * - `headerLink`: optional { to, label } quiet cross-link in the header.
 * - `width`: 'md' (440px, login/forgot) or 'lg' (460px, signup).
 */
export default function AuthLayout({ children, mark, headerLink, width = 'md' }) {
  return (
    <div
      className="flex min-h-screen flex-col text-foreground"
      style={{
        background: [
          'radial-gradient(70% 45% at 14% 0%, hsl(var(--hero-g1)) 0%, transparent 72%)',
          'radial-gradient(90% 30% at 50% 102%, hsl(var(--gold) / var(--hero-wash-a, 0.1)) 0%, transparent 62%)',
          'linear-gradient(180deg, hsl(var(--hero-g1)) 0%, hsl(var(--hero-g2)) 34%, hsl(var(--hero-g2)) 62%, hsl(var(--hero-g3)) 100%)',
        ].join(', '),
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <header className="flex items-center justify-between pt-7">
          <Link to="/" aria-label="Edgeable home" className="inline-flex items-center">
            <Wordmark size="md" />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            {headerLink && (
              <Link
                to={headerLink.to}
                className={`inline-flex min-h-[44px] items-center px-2 text-sm ${goldLinkClass}`}
              >
                {headerLink.label}
              </Link>
            )}
            <ThemeToggle />
          </div>
        </header>
      </div>

      <main className="flex flex-1 flex-col items-center px-5 pb-14 pt-10 sm:pb-20 sm:pt-14">
        {mark}
        <section
          className={`w-full ${WIDTHS[width] || WIDTHS.md} rounded-[var(--radius-card,1.5rem)] bg-card px-6 py-7 text-card-foreground sm:p-10 animate-fade-in`}
          style={{ boxShadow: 'var(--elev-ring)' }}
        >
          {children}
        </section>
      </main>

      <footer className="pb-8 pt-4">
        <div className="mx-auto w-full max-w-[560px] px-5 text-center">
          <div className="grid gap-2.5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              You must be 21 or older to subscribe. By joining, you confirm you meet the legal
              gambling age in your jurisdiction.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Edgeable sells picks as opinions and analysis. We are not a sportsbook, broker, or
              financial advisor.
            </p>
          </div>
          <nav
            aria-label="Legal"
            className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1"
          >
            <Link
              to="/terms"
              className={`inline-flex min-h-[44px] items-center text-xs font-medium text-muted-foreground underline underline-offset-[3px] ${goldHoverTextClass}`}
            >
              Terms &amp; Disclaimers
            </Link>
            <Link
              to="/privacy"
              className={`inline-flex min-h-[44px] items-center text-xs font-medium text-muted-foreground underline underline-offset-[3px] ${goldHoverTextClass}`}
            >
              Privacy Policy
            </Link>
          </nav>
          <p className="mt-2 font-mono text-xs text-muted-foreground">Edgeable 2026</p>
        </div>
      </footer>
    </div>
  );
}
