import { Link } from 'react-router-dom';
import Wordmark from './Wordmark.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function AuthLayout({ children, footer }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Decorated background: grid + warm gold glows + the logo's blade motif */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse at center, hsl(var(--gold) / 0.20), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-24 h-[360px] w-[360px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(var(--gold) / 0.12), transparent 70%)' }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.08]" preserveAspectRatio="none" aria-hidden>
          <line x1="-2%" y1="88%" x2="102%" y2="52%" stroke="hsl(var(--gold))" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-2%" y1="94%" x2="102%" y2="58%" stroke="hsl(var(--gold))" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/login" aria-label="Edgeable home">
          <Wordmark size="md" />
        </Link>
        <ThemeToggle />
      </header>

      {/* Centered content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </main>

      {footer && (
        <footer className="relative z-10 px-4 py-6 text-center text-xs text-muted-foreground">
          {footer}
        </footer>
      )}
    </div>
  );
}
