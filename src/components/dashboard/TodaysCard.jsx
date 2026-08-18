import { Lock } from 'lucide-react';
import { formatOdds, formatPostedAt } from '../../utils/picks.js';

// Deterministic skeleton-bar widths so locked rows look varied but stable.
const LOCK_WIDTHS = [46, 58, 40, 52, 62, 44, 56, 38, 50];

function todayMeta(picks) {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  if (picks.length === 0) return date;
  const earliest = picks.reduce((min, p) => {
    const t = p.postedAt?.toDate?.()?.getTime() || 0;
    return t && (min === 0 || t < min) ? t : min;
  }, 0);
  const posted = earliest ? formatPostedAt(picks.find((p) => (p.postedAt?.toDate?.()?.getTime() || 0) === earliest)?.postedAt) : '';
  return `${date} · ${picks.length} pick${picks.length === 1 ? '' : 's'}${posted ? ` · posted ${posted} ET` : ''}`;
}

function PickRow({ pick, lockIdx }) {
  const postedLine = `Posted ${formatPostedAt(pick.postedAt)} ET${pick.gameStartTime ? ` · Game ${formatPostedAt(pick.gameStartTime)} ET` : ''}`;
  if (pick.locked) {
    const w = LOCK_WIDTHS[lockIdx % LOCK_WIDTHS.length];
    return (
      <div className="pick-row locked">
        <span className="sport" aria-hidden="true"><Lock className="lock-ico" /></span>
        <div>
          <p className="desc">
            <span className="lock-bar" style={{ width: `${w}%` }} aria-hidden="true" />
            <span className="sr-only">VIP pick, hidden</span>
          </p>
          <p className="psub">{postedLine}</p>
        </div>
        <div className="chips"><span className="chip">VIP</span></div>
      </div>
    );
  }
  const isFree = pick.access === 'public';
  return (
    <div className="pick-row">
      {isFree
        ? <span className="free-tag">Free</span>
        : <span className="sport">{pick.sport}</span>}
      <div>
        <p className="desc">{pick.description}</p>
        <p className="psub">{postedLine}</p>
      </div>
      <div className="chips">
        <span className="chip">{formatOdds(pick.odds)}</span>
        <span className="chip">{Number(pick.stakeUnits) || 0}u</span>
      </div>
    </div>
  );
}

/**
 * Today's card panel. `picks` are today's merged rows (public stubs + whatever
 * full picks the viewer can read; rows the viewer can't read carry locked=true).
 * VIP users see everything; everyone else sees free picks in full and VIP picks
 * as locked rows with the posted-at timestamp still visible.
 */
export default function TodaysCard({ picks, membership, onGoMembership }) {
  const lockedCount = picks.filter((p) => p.locked).length;
  const stakedUnits = picks.reduce((sum, p) => sum + (Number(p.stakeUnits) || 0), 0);
  const pendingCount = picks.filter((p) => p.status === 'pending').length;

  let lockIdx = -1;

  return (
    <section className="soft-card panel" aria-label="Today's card">
      <div className="panel-head">
        <h2>Today's card</h2>
        <span className="meta">{todayMeta(picks)}</span>
      </div>

      {picks.length === 0 ? (
        <p className="card-empty">
          Nothing posted yet today. Picks land here the moment they go on the record.
        </p>
      ) : (
        <div className="pick-list">
          {picks.map((p) => {
            if (p.locked) lockIdx += 1;
            return <PickRow key={p.id} pick={p} lockIdx={p.locked ? lockIdx : 0} />;
          })}
        </div>
      )}

      {lockedCount > 0 && membership === 'free' && (
        <p className="locked-note">
          {lockedCount} VIP pick{lockedCount === 1 ? '' : 's'} posted today. They went on the
          record when they posted, you just can't see them yet.{' '}
          <button type="button" onClick={onGoMembership}>Unlock VIP access</button>
        </p>
      )}
      {lockedCount > 0 && membership === 'pending' && (
        <p className="locked-note">
          Today's VIP picks are posted and waiting. They unlock the moment your payment is
          verified, usually the same day.
        </p>
      )}
      {lockedCount > 0 && membership === 'rejected' && (
        <p className="locked-note">
          Today's VIP picks are posted and waiting. Sort out the payment check in your
          membership panel and they unlock on approval.
        </p>
      )}
      {lockedCount > 0 && membership === 'expired' && (
        <p className="locked-note">
          Today's {lockedCount} VIP pick{lockedCount === 1 ? ' is' : 's are'} posted and waiting.{' '}
          <button type="button" onClick={onGoMembership}>Renew to see {lockedCount === 1 ? 'it' : 'them'}</button>
        </p>
      )}
      {membership === 'vip' && picks.length > 0 && (
        <div className="card-summary">
          <span>Total staked: {Math.round(stakedUnits * 100) / 100}u</span>
          <span>Pending: {pendingCount}</span>
          <span>All picks locked before game time</span>
        </div>
      )}
    </section>
  );
}
