import { useEffect, useRef, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { normalizePhone, isValidPhone } from '../../utils/auth.js';
import { updateUserProfile } from '../../utils/users.js';
import AcctModal from './AcctModal.jsx';

/**
 * Self-service phone change. Normalizes like signup, guards against a number
 * already registered to someone else, then updateUserProfile runs the
 * transaction: users/{uid}.phone update + phones/{old} delete + phones/{new}
 * create with {uid, authEmail}, so phone sign-in keeps resolving correctly.
 */
export default function ChangePhoneModal({ uid, currentPhone, onClose, onChanged }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const normalized = normalizePhone(phone);
    if (!isValidPhone(normalized)) {
      setError('Phone must be 7-15 digits.');
      return;
    }
    if (normalized === (currentPhone || '')) {
      setError('That is already the phone number on your account.');
      return;
    }

    setBusy(true);
    try {
      // Friendly pre-check (the transaction re-checks atomically).
      const existing = await getDoc(doc(db, 'phones', normalized));
      if (existing.exists() && existing.data().uid !== uid) {
        setError('That phone number is already registered to another account.');
        setBusy(false);
        return;
      }
      await updateUserProfile(uid, { phone: normalized });
      setDone(true);
      onChanged?.();
    } catch (err) {
      setError(err?.message || 'Could not update your phone number. Try again.');
      setBusy(false);
    }
  };

  return (
    <AcctModal
      titleId="dlacct-phone-title"
      title="Change your phone number"
      sub={done ? null : 'Your phone number is one of the ways you can sign in. It updates immediately.'}
      onClose={onClose}
    >
      {done ? (
        <>
          <div className="m-success" role="status">
            Phone number updated. You can sign in with it right away.
          </div>
          <div className="btn-row">
            <button className="cta-btn" type="button" onClick={onClose}>Done</button>
          </div>
        </>
      ) : (
        <form onSubmit={submit}>
          <div className="current-box">
            <span className="k">Current phone</span>
            <span className="v">{currentPhone || 'Not set'}</span>
          </div>

          <label className="field-label" htmlFor="dlacct-phone-new">New phone number</label>
          <div className="field-wrap">
            <input
              ref={inputRef}
              className="field"
              id="dlacct-phone-new"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="9175551234"
              maxLength={20}
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
            />
          </div>

          {error && <p className="m-error">{error}</p>}

          <div className="btn-row">
            <button className="cta-btn" type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save phone number'}
            </button>
            <button className="cta-btn cta-outline" type="button" onClick={onClose} disabled={busy}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </AcctModal>
  );
}
