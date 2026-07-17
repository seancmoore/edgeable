import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink } from 'lucide-react';
import Wordmark from '../components/Wordmark.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import {
  getAllPicks, computeRecord, isPostedToday,
  formatOdds, formatStake, formatPostedAt,
} from '../utils/picks.js';
import { unitsColor, formatUnits } from '../utils/pnl.js';
import { cn } from '../lib/utils.js';

// TODO: replace with the real Action Network profile URL when Panky supplies it.
const ACTION_NETWORK_URL = 'https://www.actionnetwork.com/';

const STATUS_STYLES = {
  pending: 'bg-muted text-muted-foreground',
  win: 'bg-success/15 text-success',
  loss: 'bg-destructive/15 text-destructive',
  push: 'bg-muted text-muted-foreground',
  void: 'bg-muted text-muted-foreground line-through',
};

function PickRow({ pick, withDate }) {
  return (
    <li className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{pick.sport}</div>
          <div className="mt-0.5 text-sm font-semibold leading-snug">
            {pick.description} <span className="font-normal text-muted-foreground">@ {formatOdds(pick.odds)}</span>
          </div>
        </div>
        <Badge className={cn('shrink-0 uppercase', STATUS_STYLES[pick.status] || '')}>
          {pick.status}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
          <Clock className="h-3.5 w-3.5" />
          posted {formatPostedAt(pick.postedAt, { withDate })} ET
        </span>
        <span>{formatStake(pick.stakeUnits)}</span>
      </div>
    </li>
  );
}

export default function PublicCard() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllPicks(2000)
      .then(setPicks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const record = computeRecord(picks);
  const today = picks.filter(isPostedToday);
  const archive = picks.filter((p) => !isPostedToday(p));

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
        <div className="mx-auto w-full max-w-xl animate-fade-in">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Daily Card</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every pick is posted here before tip-off with a server-set timestamp.
            Picks can never be edited, backdated, or deleted — the losses stay up with the wins.
          </p>

          {/* Record header */}
          <Card className="mt-5">
            <CardContent className="grid grid-cols-3 gap-4 p-5">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Record</div>
                <div className="mt-1 font-display text-xl font-bold sm:text-2xl">
                  {record.wins}-{record.losses}-{record.pushes}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Net units</div>
                <div className={cn('mt-1 font-display text-xl font-bold sm:text-2xl', unitsColor(record.netUnits))}>
                  {formatUnits(record.netUnits)}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">ROI</div>
                <div className={cn('mt-1 font-display text-xl font-bold sm:text-2xl', unitsColor(record.roi))}>
                  {(record.roi * 100).toFixed(1)}%
                </div>
              </div>
              <div className="col-span-3 border-t border-border pt-3 text-xs text-muted-foreground">
                Across {record.graded} graded pick{record.graded === 1 ? '' : 's'} · pending picks excluded ·
                voids excluded from ROI · pushes count at zero units
              </div>
            </CardContent>
          </Card>

          <a
            href={ACTION_NETWORK_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium transition-colors hover:border-primary/50"
          >
            <ExternalLink className="h-4 w-4" />
            Verified record on Action Network
          </a>

          {error && (
            <div className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          {loading && <p className="mt-5 text-muted-foreground">Loading record…</p>}

          {/* Today */}
          {!loading && (
            <section className="mt-7">
              <h2 className="font-display text-xl font-semibold tracking-tight">Today's card</h2>
              {today.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No picks posted yet today. Check back later.</p>
              ) : (
                <ul className="mt-3 flex list-none flex-col gap-2 p-0">
                  {today.map((p) => <PickRow key={p.id} pick={p} />)}
                </ul>
              )}
            </section>
          )}

          {/* Archive — every past pick, newest first, no filtering */}
          {!loading && archive.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold tracking-tight">Archive</h2>
              <p className="mt-1 text-xs text-muted-foreground">All {archive.length} past picks, newest first.</p>
              <ul className="mt-3 flex list-none flex-col gap-2 p-0">
                {archive.map((p) => <PickRow key={p.id} pick={p} withDate />)}
              </ul>
            </section>
          )}

          <footer className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/terms" className="hover:text-foreground hover:underline">Terms &amp; Disclaimers</Link>
              <Link to="/privacy" className="hover:text-foreground hover:underline">Privacy Policy</Link>
              <Link to="/login" className="hover:text-foreground hover:underline">Sign in</Link>
            </div>
            <p className="mt-3">
              Edgeable sells opinions, not outcomes. 21+ only. Responsible gambling: only stake what you can
              afford to lose. Help is available 24/7 at 1-800-GAMBLER.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
