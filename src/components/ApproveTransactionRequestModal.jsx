import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import LengthPicker from './LengthPicker.jsx';
import { applyLength } from '../utils/dateMath.js';
import { toDate, formatDate } from '../utils/subscription.js';
import { formatLength } from '../utils/dateMath.js';
import { approveTransactionRequest } from '../utils/transactionRequests.js';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { Textarea } from './ui/textarea.jsx';
import ProofImage from './ProofImage.jsx';

export default function ApproveTransactionRequestModal({ request, admin, onClose, onDone }) {
  const [length, setLength] = useState(request.length);
  const [price, setPrice] = useState(String(request.declaredPrice ?? ''));
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [subscriberDoc, setSubscriberDoc] = useState(null);
  const [referrerName, setReferrerName] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snap = await getDoc(doc(db, 'users', request.subscriberUid));
      if (cancelled) return;
      const data = snap.exists() ? snap.data() : null;
      setSubscriberDoc(data);
      // If this subscriber was referred and hasn't been credited yet, look up
      // the referrer so the admin can sanity-check before the auto-bonus fires.
      if (data?.referredByUid && !data.referralBonusApplied) {
        const refSnap = await getDoc(doc(db, 'users', data.referredByUid));
        if (!cancelled) {
          const r = refSnap.exists() ? refSnap.data() : null;
          setReferrerName(r ? (r.telegramUsername ? `@${r.telegramUsername}` : r.displayName || 'a member') : '(account no longer exists)');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [request.subscriberUid]);

  const pendingReferral = !!(subscriberDoc?.referredByUid && !subscriberDoc.referralBonusApplied);

  // Field-wise compare (not JSON) so a missing `days` on old requests reads as 0.
  const lengthChanged = ['years', 'months', 'weeks', 'days']
    .some((k) => Number(length?.[k] || 0) !== Number(request.length?.[k] || 0));
  const priceChanged = Number(price) !== Number(request.declaredPrice);
  const willModify = lengthChanged || priceChanged;

  const preview = useMemo(() => {
    if (!subscriberDoc) return null;
    const today = new Date();
    const currentEnd = toDate(subscriberDoc.subscriptionEnd);
    const extendFrom = (currentEnd && currentEnd > today) ? currentEnd : today;
    const newEnd = applyLength(extendFrom, length);
    return { extendFrom, newEnd, expired: !currentEnd || currentEnd <= today };
  }, [subscriberDoc, length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!Number(length.years || 0) && !Number(length.months || 0) && !Number(length.weeks || 0) && !Number(length.days || 0)) {
      return setError('Length must include at least one of years, months, weeks, or days.');
    }
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      return setError('Please enter a valid price.');
    }
    if (willModify && !adminNotes.trim()) {
      const proceed = window.confirm(
        'You\'re modifying the request but haven\'t added a note explaining why. The subscriber will see the modified values without context. Proceed anyway?'
      );
      if (!proceed) return;
    }
    setSubmitting(true);
    try {
      await approveTransactionRequest(request.id, admin, {
        length, price, adminNotes,
      });
      if (onDone) await onDone();
      onClose();
    } catch (e) {
      setError(e.message || 'Approval failed.');
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Approve subscription request</DialogTitle>
        </DialogHeader>

        <div className="text-sm">
          <strong className="font-semibold">{request.subscriberDisplayName || 'Subscriber'}</strong>
          {request.subscriberTelegramUsername && <span className="text-muted-foreground"> · @{request.subscriberTelegramUsername}</span>}
        </div>

        <div className="rounded-lg border border-border bg-secondary/50 p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Subscriber claimed</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
            <span>{formatLength(request.length)}</span>
            <span className="text-muted-foreground/50">·</span>
            <span>${Number(request.declaredPrice).toFixed(2)}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="capitalize">{request.paymentMethod}</span>
          </div>
          {request.proofImageUrl && (
            <div className="mt-3">
              <ProofImage url={request.proofImageUrl} thumbClassName="max-h-40 max-w-40" />
            </div>
          )}
          {request.paymentReference && (
            <div className="mt-1.5 text-xs text-muted-foreground">Ref: {request.paymentReference}</div>
          )}
          {request.notes && (
            <div className="mt-1.5 text-xs text-muted-foreground">Subscriber notes: {request.notes}</div>
          )}
        </div>

        {pendingReferral && (
          <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-foreground/85">
            <div className="font-medium text-foreground">Referred by {referrerName || '…'}</div>
            <div className="mt-0.5 text-muted-foreground">
              Code <span className="font-mono">{subscriberDoc.referredByCode}</span>. Approving will
              auto-grant <strong className="text-foreground">+2 weeks</strong> to this user and to the
              referrer. Reject instead if this looks like a self-referral.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Final length to credit">
            <LengthPicker value={length} onChange={setLength} />
          </Field>

          <Field label="Final price recorded ($)" htmlFor="ap-price">
            <Input
              id="ap-price"
              type="number" min="0" step="0.01"
              value={price} onChange={(e) => setPrice(e.target.value)}
            />
          </Field>

          <Field label={`Note to subscriber ${willModify ? '(recommended)' : '(optional)'}`} htmlFor="ap-notes">
            <Textarea
              id="ap-notes"
              value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              placeholder={willModify
                ? 'Why you adjusted (e.g., "Proof only showed 3 months")'
                : 'Anything to share with the subscriber'}
            />
          </Field>

          {willModify && (
            <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground dark:text-warning">
              <strong>Modified:</strong>{' '}
              {lengthChanged && <>length {formatLength(request.length)} → {formatLength(length)}</>}
              {lengthChanged && priceChanged && '; '}
              {priceChanged && <>price ${Number(request.declaredPrice).toFixed(2)} → ${Number(price).toFixed(2)}</>}
            </div>
          )}

          {preview && (
            <div className="rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
              Will extend from <strong>{formatDate(preview.extendFrom)}</strong>
              {preview.expired && <span className="opacity-70"> (was expired — extending from today)</span>}
              {' '}to <strong>{formatDate(preview.newEnd)}</strong>.
            </div>
          )}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-success text-success-foreground hover:bg-success/90">
              {submitting ? 'Working…' : 'Approve & process'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
