// /account — subscriber account settings (Dusk Ledger).
// Same chrome pattern as /upgrade: wordmark header + back link, dusk gradient
// top band, narrow centered column, legal footer. Policy (Sean):
//  * self-service: email, phone, password
//  * admin-approved request flow: displayName + telegramUsername (payment
//    matching identity, "can't lose track of who is who")
//  * password changes go via a personalized email link (sendPasswordResetEmail
//    to the auth email; the link opens the branded /auth-action screen); the
//    in-app ChangePasswordModal stays as a secondary path, and is the ONLY
//    path for legacy synthetic-email accounts.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import { useAuth } from '../AuthContext.jsx';
import Wordmark from '../components/Wordmark.jsx';
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';
import UnitSizeModal from '../components/dashboard/UnitSizeModal.jsx';
import RequestChangeModal from '../components/account/RequestChangeModal.jsx';
import ChangeEmailModal from '../components/account/ChangeEmailModal.jsx';
import ChangePhoneModal from '../components/account/ChangePhoneModal.jsx';
import { getMyProfileRequests } from '../utils/profileRequests.js';
import { toDate, formatDate } from '../utils/subscription.js';
import {
  normalizeEmail, isValidEmail, SYNTHETIC_EMAIL_DOMAIN, normalizeTelegramUsername,
} from '../utils/auth.js';
import '../components/account/account.css';

// Membership status, same shape as the dashboard's derivation (which is
// module-local there): active + end in the future = VIP; any subscription
// history = expired; otherwise free.
function deriveStatus(userDoc) {
  if (!userDoc) return 'free';
  const end = toDate(userDoc.subscriptionEnd);
  if (userDoc.status === 'active' && end && end > new Date()) return 'vip';
  const hasHistory = !!toDate(userDoc.subscriptionStart) || !!end
    || userDoc.status === 'expired' || userDoc.status === 'paused';
  return hasHistory ? 'expired' : 'free';
}

function StatusChip({ status, userDoc }) {
  const end = toDate(userDoc?.subscriptionEnd);
  if (status === 'vip') {
    return (
      <span className="status-chip chip-vip">
        <span className="dot" aria-hidden="true" />VIP active{end ? ` · renews ${formatDate(end)}` : ''}
      </span>
    );
  }
  if (status === 'expired') {
    const paused = userDoc?.status === 'paused';
    return (
      <span className="status-chip chip-expired">
        <span className="dot" aria-hidden="true" />
        {paused ? 'VIP paused' : `VIP expired${end ? ` ${formatDate(end)}` : ''}`}
      </span>
    );
  }
  return (
    <span className="status-chip chip-free">
      <span className="dot" aria-hidden="true" />Free account
    </span>
  );
}

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function fmtUnit(n) {
  if (!(n > 0)) return null;
  return `$${n % 1 ? n.toFixed(2) : n}`;
}

export default function Account() {
  const { currentUser, userDoc, logout } = useAuth();
  const navigate = useNavigate();

  const status = useMemo(() => deriveStatus(userDoc), [userDoc]);
  const displayName = userDoc?.displayName || 'there';
  const initial = (displayName || '?').trim().charAt(0).toUpperCase();
  const memberSince = toDate(userDoc?.createdAt);

  // The address Firebase Auth actually signs this user in with.
  const authEmail = normalizeEmail(currentUser?.email || userDoc?.authEmail || '');
  const hasRealEmail = isValidEmail(authEmail) && !authEmail.endsWith(`@${SYNTHETIC_EMAIL_DOMAIN}`);

  // ── Pending profile-change requests (identity fields) ───────────────────────
  const [requests, setRequests] = useState([]);
  const loadRequests = useMemo(() => async () => {
    if (!currentUser) return;
    const list = await getMyProfileRequests(currentUser.uid).catch(() => []);
    setRequests(list);
  }, [currentUser]);
  useEffect(() => { loadRequests(); }, [loadRequests]);

  const pendingFor = (field) => requests.find((r) => r.field === field && r.status === 'pending') || null;
  const pendingName = pendingFor('displayName');
  const pendingTelegram = pendingFor('telegramUsername');

  // ── Email self-heal (staleness fix after a verified email change) ───────────
  // /auth-action only updates the Firebase Auth email; the users doc and the
  // usernames/phones lookup docs still hold the old address. When this page
  // loads signed in and the live auth email differs from the stored authEmail,
  // write through the fix. Rules allow it only when the new value matches the
  // caller's own Auth token email, so nothing can be spoofed.
  const healedRef = useRef(false);
  useEffect(() => {
    if (healedRef.current || !currentUser || !userDoc) return;
    const live = normalizeEmail(currentUser.email);
    const stored = normalizeEmail(userDoc.authEmail || userDoc.email);
    if (!live || live === stored) return;
    healedRef.current = true;
    (async () => {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { email: live, authEmail: live });
        const tg = normalizeTelegramUsername(userDoc.telegramUsername);
        if (tg) {
          await updateDoc(doc(db, 'usernames', tg), { authEmail: live }).catch(() => {});
        }
        if (userDoc.phone) {
          await updateDoc(doc(db, 'phones', String(userDoc.phone)), { authEmail: live }).catch(() => {});
        }
      } catch { /* rules may deny on older deployments; admin tooling reconciles */ }
    })();
  }, [currentUser, userDoc]);

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [requestField, setRequestField] = useState(null); // 'displayName' | 'telegramUsername'
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);

  // ── Password link (primary path: personalized email → /auth-action) ─────────
  const [pwBusy, setPwBusy] = useState(false);
  const [pwSent, setPwSent] = useState(false);
  const [pwError, setPwError] = useState('');
  const sendPasswordLink = async () => {
    if (pwBusy) return;
    setPwBusy(true);
    setPwError('');
    try {
      await sendPasswordResetEmail(auth, authEmail);
      setPwSent(true);
    } catch (err) {
      setPwError(err?.code === 'auth/too-many-requests'
        ? 'Too many attempts. Wait a few minutes and try again.'
        : 'Could not send the email. Try again in a minute.');
    }
    setPwBusy(false);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const unitStr = fmtUnit(Number(userDoc?.unitSize));

  return (
    <div className="dlacct">
      <div className="container">

        <header className="shell">
          <Link className="wordmark" to="/dashboard" aria-label="Edgeable dashboard">
            <Wordmark size="md" />
          </Link>
          <Link className="back-link" to="/dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            Back to dashboard
          </Link>
        </header>

        <main className="acct-wrap">

          {/* ── Status header ── */}
          <div className="acct-head">
            <div className="acct-who">
              <span className="avatar" aria-hidden="true">{initial}</span>
              <div>
                <h1>{displayName}</h1>
                <p className="sub">Your account settings</p>
              </div>
            </div>
            <div className="head-chips">
              <StatusChip status={status} userDoc={userDoc} />
              {memberSince && (
                <span className="member-since">Member since {formatDate(memberSince)}</span>
              )}
            </div>
          </div>

          {/* ── Your identity ── */}
          <section className="soft-card panel" aria-label="Your identity">
            <div className="panel-head"><h2>Your identity</h2></div>
            <div className="lock-note" role="note">
              <LockIcon />
              <span>Changes need admin approval so payments always match the right account.</span>
            </div>
            <div className="row-list">
              <div className="acct-row">
                <div className="rw">
                  <span className="k">Edgeable username</span>
                  <span className="v mono">{userDoc?.displayName || 'Not set'}</span>
                  {pendingName && (
                    <span className="req-val">Requested: {pendingName.proposedValue}</span>
                  )}
                </div>
                {pendingName ? (
                  <span className="req-chip"><span className="dot" aria-hidden="true" />Pending approval</span>
                ) : (
                  <button className="row-btn" type="button" onClick={() => setRequestField('displayName')}>
                    Request a change
                  </button>
                )}
              </div>
              <div className="acct-row">
                <div className="rw">
                  <span className="k">Telegram username</span>
                  <span className="v mono">
                    {userDoc?.telegramUsername ? `@${userDoc.telegramUsername}` : 'Not set'}
                  </span>
                  {pendingTelegram && (
                    <span className="req-val">Requested: @{pendingTelegram.proposedValue}</span>
                  )}
                </div>
                {pendingTelegram ? (
                  <span className="req-chip"><span className="dot" aria-hidden="true" />Pending approval</span>
                ) : (
                  <button className="row-btn" type="button" onClick={() => setRequestField('telegramUsername')}>
                    Request a change
                  </button>
                )}
              </div>
            </div>
            <p className="hint">
              Your username goes in the payment note when you pay, and Telegram is where your
              VIP invite goes. That&apos;s why these two are approved by hand.
            </p>
          </section>

          {/* ── Contact and sign-in ── */}
          <section className="soft-card panel" aria-label="Contact and sign-in">
            <div className="panel-head"><h2>Contact and sign-in</h2></div>
            <div className="row-list">
              <div className="acct-row">
                <div className="rw">
                  <span className="k">Email</span>
                  <span className="v mono">{hasRealEmail ? authEmail : 'No email on file'}</span>
                </div>
                <button className="row-btn" type="button" onClick={() => setShowEmailModal(true)}>
                  {hasRealEmail ? 'Change' : 'Add email'}
                </button>
              </div>
              <div className="acct-row">
                <div className="rw">
                  <span className="k">Phone</span>
                  <span className="v mono">{userDoc?.phone || 'Not set'}</span>
                </div>
                <button className="row-btn" type="button" onClick={() => setShowPhoneModal(true)}>
                  Change
                </button>
              </div>
              <div className="acct-row">
                <div className="rw">
                  <span className="k">Password</span>
                  <span className="v mono" aria-hidden="true">••••••••</span>
                </div>
                {hasRealEmail ? (
                  <button className="row-btn" type="button" onClick={sendPasswordLink} disabled={pwBusy}>
                    {pwBusy ? 'Sending…' : 'Email me a password link'}
                  </button>
                ) : (
                  <button className="row-btn" type="button" onClick={() => setShowPasswordModal(true)}>
                    Change
                  </button>
                )}
              </div>
            </div>

            {hasRealEmail && pwSent && (
              <div className="inline-success" role="status">
                We sent a password link to <strong>{authEmail}</strong>. It opens a screen
                where you set the new one. Don&apos;t see it? Check your spam folder.
              </div>
            )}
            {hasRealEmail && pwError && <p className="inline-error">{pwError}</p>}

            {hasRealEmail && (
              <p className="hint">
                Know your current password?{' '}
                <button className="link-btn" type="button" onClick={() => setShowPasswordModal(true)}>
                  Change it here instead
                </button>
              </p>
            )}
            <p className="hint">
              You can sign in with your email, Telegram username, or phone number. They all
              open the same account.
            </p>
          </section>

          {/* ── Preferences ── */}
          <section className="soft-card panel" aria-label="Preferences">
            <div className="panel-head"><h2>Preferences</h2></div>
            <div className="row-list">
              <div className="acct-row">
                <div className="rw">
                  <span className="k">Unit size</span>
                  <span className="v mono">{unitStr ? `1 unit = ${unitStr}` : 'Not set'}</span>
                </div>
                <button className="row-btn" type="button" onClick={() => setShowUnitModal(true)}>
                  {unitStr ? 'Change' : 'Set unit size'}
                </button>
              </div>
            </div>
            <p className="hint">
              Your unit is 1/500th of your bankroll. It only affects how dollars are shown to
              you, never the record.
            </p>
          </section>

          {/* ── Sign out ── */}
          <div className="signout-row">
            <button className="cta-btn cta-outline" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </main>

        <footer className="legal">
          <p>
            21+ only. Picks are opinions, not financial advice. ·{' '}
            <Link to="/terms">Terms</Link> · <Link to="/privacy">Privacy</Link>
          </p>
        </footer>
      </div>

      {requestField && (
        <RequestChangeModal
          field={requestField}
          currentValue={requestField === 'displayName' ? (userDoc?.displayName || '') : (userDoc?.telegramUsername || '')}
          uid={currentUser?.uid}
          displayName={userDoc?.displayName || ''}
          onClose={() => setRequestField(null)}
          onCreated={loadRequests}
        />
      )}
      {showEmailModal && (
        <ChangeEmailModal
          authEmail={authEmail}
          currentEmail={hasRealEmail ? authEmail : ''}
          onClose={() => setShowEmailModal(false)}
        />
      )}
      {showPhoneModal && (
        <ChangePhoneModal
          uid={currentUser?.uid}
          currentPhone={userDoc?.phone || ''}
          onClose={() => setShowPhoneModal(false)}
        />
      )}
      {showUnitModal && (
        <UnitSizeModal
          uid={currentUser?.uid}
          currentUnitSize={Number(userDoc?.unitSize) || 0}
          onClose={() => setShowUnitModal(false)}
        />
      )}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
