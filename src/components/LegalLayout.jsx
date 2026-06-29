import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Wordmark from './Wordmark.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { LEGAL } from '../utils/legal.js';

// Public, pre-auth layout for the legal pages. Unlike AppShell it does not
// require a signed-in user, so it can be linked straight from the signup form.
export default function LegalLayout({ title, children }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="bg-grid absolute inset-0 pointer-events-none" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/login" aria-label="Edgeable home">
          <Wordmark size="md" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex-1 px-4 pb-12">
        <div className="mx-auto w-full max-w-3xl animate-fade-in">
          <Link
            to="/signup"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign up
          </Link>

          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last updated: {LEGAL.updated}. Version {LEGAL.version}.
          </p>

          <div className="mt-7 space-y-8">{children}</div>

          <footer className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/terms" className="hover:text-foreground hover:underline">Terms &amp; Disclaimers</Link>
              <Link to="/privacy" className="hover:text-foreground hover:underline">Privacy Policy</Link>
              <Link to="/login" className="hover:text-foreground hover:underline">Sign in</Link>
            </div>
            <p className="mt-3">
              Responsible gambling: only stake what you can afford to lose. If gambling stops being fun or
              starts causing harm, please step away. Help is available 24/7 at 1-800-GAMBLER.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

// Shared section + bullet helpers so both legal pages read consistently.
export function LegalSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-20 space-y-3">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

export function LegalBullets({ items }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5 marker:text-muted-foreground">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
