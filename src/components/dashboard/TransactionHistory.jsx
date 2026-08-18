import { formatDate, toDate } from '../../utils/subscription.js';
import { formatLength } from '../../utils/dateMath.js';
import { METHOD_LABELS } from './MembershipPanel.jsx';

function money(n) {
  const v = Number(n) || 0;
  return `$${v % 1 ? v.toFixed(2) : v}`;
}

// Transactions store the request's payment method as a "[cashapp] ..." prefix
// on notes (see approveTransactionRequest). Recover it for display.
function methodFromNotes(notes) {
  const m = /^\[(cashapp|zelle)\]/i.exec(notes || '');
  return m ? METHOD_LABELS[m[1].toLowerCase()] : '';
}

function rowsFrom(transactions, requests, membership) {
  const rows = [];

  // Open (pending) requests always show as Verifying receipts; a rejected
  // request shows as Needs attention only while it's the live membership state.
  for (const r of requests) {
    if (r.status === 'pending') {
      rows.push({
        key: `req-${r.id}`,
        t: toDate(r.createdAt)?.getTime() || 0,
        title: `VIP · ${formatLength(r.length)}`,
        detail: `${formatDate(r.createdAt)}${r.paymentMethod ? ` · ${METHOD_LABELS[r.paymentMethod] || r.paymentMethod}` : ''}`,
        amount: money(r.declaredPrice),
        status: 'Verifying',
        tone: 'ts-verify',
      });
    } else if (r.status === 'rejected' && membership === 'rejected') {
      rows.push({
        key: `req-${r.id}`,
        t: toDate(r.createdAt)?.getTime() || 0,
        title: `VIP · ${formatLength(r.length)}`,
        detail: `${formatDate(r.createdAt)}${r.paymentMethod ? ` · ${METHOD_LABELS[r.paymentMethod] || r.paymentMethod}` : ''}`,
        amount: money(r.declaredPrice),
        status: 'Needs attention',
        tone: 'ts-fail',
      });
    }
  }

  for (const txn of transactions) {
    if (txn.type === 'referral_bonus') {
      rows.push({
        key: `txn-${txn.id}`,
        t: toDate(txn.createdAt)?.getTime() || 0,
        title: 'Referral bonus',
        detail: `${formatDate(txn.createdAt)} · code used by a friend`,
        amount: '+2 weeks',
        status: 'Applied',
        tone: 'ts-ok',
      });
    } else {
      const method = methodFromNotes(txn.notes);
      rows.push({
        key: `txn-${txn.id}`,
        t: toDate(txn.createdAt)?.getTime() || 0,
        title: `VIP · ${formatLength(txn.length)}`,
        detail: `${formatDate(txn.createdAt)}${method ? ` · ${method}` : ''}`,
        amount: money(txn.price),
        status: 'Approved',
        tone: 'ts-ok',
      });
    }
  }

  return rows.sort((a, b) => b.t - a.t);
}

/** Purchases + referral bonuses + any in-flight request, newest first. */
export default function TransactionHistory({ transactions, requests, membership }) {
  const rows = rowsFrom(transactions, requests, membership);

  return (
    <section className="soft-card panel" aria-label="Transaction history">
      <p className="eyebrow">Transaction history</p>
      {rows.length === 0 ? (
        <p className="txn-empty">No purchases yet. Your VIP receipts will show up here.</p>
      ) : (
        <div className="txn-list">
          {rows.map((r) => (
            <div className="txn-row" key={r.key}>
              <span className="txn-what">
                <span className="t">{r.title}</span>
                <span className="d">{r.detail}</span>
              </span>
              <span className="txn-right">
                <span className="amt">{r.amount}</span><br />
                <span className={`txn-status ${r.tone}`}>{r.status}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
