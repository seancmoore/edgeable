import { useEffect, useRef, useState } from 'react';
import {
  EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { auth } from '../../firebase.js';
import { normalizeEmail, isValidEmail } from '../../utils/auth.js';
import AcctModal from './AcctModal.jsx';

/**
 * Self-service email change. Re-authenticates with the current password, then
 * verifyBeforeUpdateEmail sends a personalized confirmation link to the NEW
 * address. The sign-in email only switches once that link is clicked (the
 * branded /auth-action page handles it). Firestore copies of the email are
 * synced by the Account page's self-heal the next time it loads signed in.
 */
export default function ChangeEmailModal({ authEmail, currentEmail, onClose }) {
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const target = normalizeEmail(newEmail);
    if (!isValidEmail(target)) { setError('Enter a valid email address.'); return; }
    if (target === normalizeEmail(authEmail)) {
      setError('That is already your sign-in email.');
      return;
    }
    if (!password) { setError('Enter your current password.'); return; }

    const user = auth.currentUser;
    if (!user) { setError('You are not signed in.'); return; }

    setBusy(true);
    try {
      const cred = EmailAuthProvider.credential(authEmail, password);
      await reauthenticateWithCredential(user, cred);
      await verifyBeforeUpdateEmail(user, target, {
        url: 'https://edgeabled.web.app/account',
      });
      setSentTo(target);
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('That password is incorrect.');
      } else if (code === 'auth/email-already-in-use') {
        setError('That email is already attached to another account.');
      } else if (code === 'auth/invalid-email') {
        setError('Enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Wait a few minutes and try again.');
      } else {
        setError(err?.message || 'Could not start the email change. Try again.');
      }
      setBusy(false);
    }
  };

  return (
    <AcctModal
      titleId="dlacct-email-title"
      title={sentTo ? 'Confirm your new email' : 'Change your email'}
      sub={sentTo ? null : 'Your email is how you sign in and where password links go. Confirm your password, then we send a link to the new address.'}
      onClose={onClose}
    >
      {sentTo ? (
        <>
          <div className="m-success" role="status">
            Check <strong>{sentTo}</strong> for a confirmation link. Your sign-in email
            switches once you click it. Until then, keep signing in with your current
            email. Don&apos;t see it? Check your spam folder.
          </div>
          <div className="btn-row">
            <button className="cta-btn" type="button" onClick={onClose}>Done</button>
          </div>
        </>
      ) : (
        <form onSubmit={submit}>
          <div className="current-box">
            <span className="k">Current email</span>
            <span className="v">{currentEmail || 'No email on file'}</span>
          </div>

          <label className="field-label" htmlFor="dlacct-email-pw">Current password</label>
          <div className="field-wrap">
            <input
              ref={inputRef}
              className="field"
              id="dlacct-email-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </div>

          <label className="field-label" htmlFor="dlacct-email-new">New email</label>
          <div className="field-wrap">
            <input
              className="field"
              id="dlacct-email-new"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={254}
              value={newEmail}
              onChange={(e) => { setNewEmail(e.target.value); setError(''); }}
            />
          </div>

          {error && <p className="m-error">{error}</p>}

          <div className="btn-row">
            <button className="cta-btn" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send confirmation link'}
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
