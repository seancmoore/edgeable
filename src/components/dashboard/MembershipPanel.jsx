import { Link } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { formatDate, toDate } from '../../utils/subscription.js';
import { formatLength } from '../../utils/dateMath.js';

export const METHOD_LABELS = { cashapp: 'Cash App', zelle: 'Zelle' };

function money(n) {
  const v = Number(n) || 0;
  return `$${v % 1 ? v.toFixed(2) : v}`;
}

/**
 * Per-state membership side panel (Dusk Ledger). One whole-panel variant per
 * membership state; all purchase paths lead to /upgrade.
 */
export default function MembershipPanel({ membership, userDoc, pendingRequest, rejectedRequest }) {
  if (membership === 'free') {
    return (
      <section className="soft-card panel panel-tinted" id="membership" aria-label="Membership">
        <p className="eyebrow">Your membership</p>
        <div className="m-price"><span className="amount mono">$0</span><span className="per">/month · free picks</span></div>
        <p className="m-copy">
          You get every free pick the moment it posts. The full daily card, every play with
          exact units and odds, is VIP.
        </p>
        <ul className="m-list">
          <li><Check aria-hidden="true" />Every pick, every day.</li>
          <li><Check aria-hidden="true" />Exact units and odds.</li>
          <li><Check aria-hidden="true" />Live updates and insights in the private Telegram channel.</li>
        </ul>
        <Link className="cta-btn" to="/upgrade">Unlock VIP · $30/month</Link>
        <p className="m-note">CashApp or Zelle with your screenshot. Personally approved same day.</p>
      </section>
    );
  }

  if (membership === 'pending') {
    const lengthLabel = pendingRequest ? formatLength(pendingRequest.length) : '';
    const method = METHOD_LABELS[pendingRequest?.paymentMethod] || pendingRequest?.paymentMethod || '';
    return (
      <section className="soft-card panel panel-tinted" id="membership" aria-label="Membership">
        <p className="eyebrow">Your membership</p>
        <div className="m-price">
          <span className="amount mono">Verifying</span>
          {lengthLabel && <span className="per">VIP · {lengthLabel}</span>}
        </div>
        <p className="m-copy">
          Payment received{pendingRequest ? `: ${money(pendingRequest.declaredPrice)}${method ? ` by ${method}` : ''}` : ''}.
          {' '}It's being personally matched and approved, usually the same day. Nothing else is
          needed from you.
        </p>
        <div className="verify-steps" aria-label="Verification progress">
          <div className="v-step done"><span className="vi" aria-hidden="true">✓</span>Proof received</div>
          <div className="v-step now"><span className="vi" aria-hidden="true">●</span>Being verified</div>
          <div className="v-step todo"><span className="vi" aria-hidden="true">3</span>Approved: card + Telegram invite unlock</div>
        </div>
        <p className="m-note">
          Sent the wrong amount or forgot the username note? Nothing is lost, it just may take a
          little longer to match.
        </p>
      </section>
    );
  }

  if (membership === 'rejected') {
    const method = METHOD_LABELS[rejectedRequest?.paymentMethod] || rejectedRequest?.paymentMethod || '';
    const lengthLabel = rejectedRequest ? formatLength(rejectedRequest.length) : '';
    const matchKey = userDoc?.telegramUsername || userDoc?.displayName || 'your username';
    return (
      <section className="soft-card panel panel-danger" id="membership" aria-label="Membership">
        <p className="eyebrow">Your membership</p>
        <div className="m-price">
          <span className="amount mono" style={{ color: 'hsl(var(--loss))' }}>Needs attention</span>
          {lengthLabel && <span className="per">VIP · {lengthLabel}</span>}
        </div>
        <p className="m-copy">
          Your {rejectedRequest ? `${money(rejectedRequest.declaredPrice)}${method ? ` ${method}` : ''} payment` : 'payment'}{' '}
          couldn't be matched to your account. Almost always it's one of these:
        </p>
        <ul className="fix-list">
          <li><Info aria-hidden="true" /><span>The payment note is missing your username, <strong className="mono">{matchKey}</strong></span></li>
          <li><Info aria-hidden="true" /><span>The amount sent doesn't match{rejectedRequest ? <> <strong className="mono">{money(rejectedRequest.declaredPrice)}</strong></> : ' the price'}</span></li>
          <li><Info aria-hidden="true" /><span>The screenshot is cropped or unreadable</span></li>
        </ul>
        {rejectedRequest?.rejectionReason && (
          <p className="m-note"><strong>Note from review:</strong> {rejectedRequest.rejectionReason}</p>
        )}
        <Link className="cta-btn" to="/upgrade">Resubmit your proof</Link>
        <p className="m-note">
          Your money isn't lost. If you paid, it gets matched and approved the moment we can
          connect it to your account.
        </p>
      </section>
    );
  }

  if (membership === 'vip') {
    const end = toDate(userDoc?.subscriptionEnd);
    const since = toDate(userDoc?.subscriptionStart) || toDate(userDoc?.createdAt);
    return (
      <section className="soft-card panel" id="membership" aria-label="Membership">
        <p className="eyebrow">Your membership</p>
        <div className="m-price"><span className="amount mono">VIP</span><span className="per">$30/month</span></div>
        <div className="sub-facts">
          <div className="fact-row"><span className="k">Status</span><span className="v" style={{ color: 'hsl(var(--win))' }}>Active</span></div>
          <div className="fact-row"><span className="k">Renews</span><span className="v">{end ? formatDate(end) : '—'}</span></div>
          <div className="fact-row"><span className="k">Member since</span><span className="v">{since ? formatDate(since) : '—'}</span></div>
        </div>
        <Link className="cta-btn cta-outline" to="/upgrade">Extend membership</Link>
        <p className="m-note">No auto-billing. You choose when to renew.</p>
      </section>
    );
  }

  // expired (also covers paused accounts, whose access is off until reactivated)
  const end = toDate(userDoc?.subscriptionEnd);
  return (
    <section className="soft-card panel" id="membership" aria-label="Membership">
      <p className="eyebrow">Your membership</p>
      <div className="m-price">
        <span className="amount mono">{userDoc?.status === 'paused' ? 'Paused' : 'Expired'}</span>
        {end && <span className="per">{formatDate(end)}</span>}
      </div>
      <p className="m-copy">
        Nothing was lost: your performance history and account are intact. Renew and the full
        card is back instantly after approval.
      </p>
      <Link className="cta-btn" to="/upgrade">Renew VIP · $30/month</Link>
      <p className="m-note">CashApp or Zelle with your screenshot. Personally approved same day.</p>
    </section>
  );
}
