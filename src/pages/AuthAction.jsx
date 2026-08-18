/**
 * AuthAction — branded Firebase Auth email action handler ("/auth-action", PUBLIC route).
 *
 * Firebase account-security emails (password reset, email-change verification,
 * email recovery) link here with ?mode=...&oobCode=...&continueUrl=... once the
 * action URL in Firebase Console > Authentication > Templates is pointed at
 * https://edgeabled.web.app/auth-action. Until that console change is made,
 * emails keep using the default Firebase-hosted handler and this page simply
 * receives no traffic (harmless).
 *
 * ── STALENESS WARNING (verifyAndChangeEmail) ─────────────────────────────────
 * When an email change is confirmed here, ONLY the Firebase Auth email updates.
 * Firestore still holds the old address in:
 *   - users/{uid}.email / users/{uid}.authEmail
 *   - usernames/{telegramUsername}.authEmail and phones/{phone}.authEmail
 *     (the lookup docs that power Telegram/phone sign-in)
 * This page usually runs SIGNED OUT (the user clicks the link from their inbox),
 * so it cannot fix Firestore itself. Even signed in, security rules only allow
 * self-updates to `unitSize`, and lookup-doc updates are admin-only, so the
 * best-effort sync below will normally be denied. The PRIMARY email-change path
 * is the Account page flow (profileChangeRequests -> applyProfileChange Cloud
 * Function), which uses the Admin SDK to change the auth email AND sync the
 * lookup docs atomically. Prefer that flow; treat this handler as the landing
 * page for the verification link it sends. When sync fails here we tell the
 * user that Telegram/phone sign-in catches up the next time they log in with
 * their email (the login self-heal / admin tooling reconciles the lookups).
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, Check, KeyRound, LogIn } from 'lucide-react';
import {
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import { useTheme } from '../ThemeContext.jsx';
import { normalizeEmail } from '../utils/auth.js';
import AuthLayout, {
  authAlertClass,
  authButtonClass,
  authInputClass,
  goldLinkClass,
} from '../components/AuthLayout.jsx';
import EdgeableLogo from '../components/EdgeableLogo.jsx';
import EdgeableLoader from '../components/EdgeableLoader.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';

const successBoxClass =
  'flex items-start gap-3 rounded-lg border border-[hsl(var(--success)/0.35)] ' +
  'bg-[hsl(var(--success)/0.1)] px-3.5 py-3 text-sm text-success';

// Best-effort Firestore sync after a confirmed email change. Runs only when a
// user is signed in (rare on this page). Returns true only if the lookup docs
// that power Telegram/phone sign-in were actually updated; the caller shows the
// "updates next login" notice when this returns false. See header comment.
async function trySyncEmailDocs(newEmail) {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    await user.reload().catch(() => {});
    const email = normalizeEmail(newEmail || user.email);
    if (!email) return false;

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return false;
    const data = snap.data();

    // Profile doc (rules normally deny non-admin writes to these fields).
    await updateDoc(userRef, { email, authEmail: email });

    // Lookup docs for Telegram/phone login (rules: update is admin-only).
    if (data.telegramUsername) {
      await updateDoc(doc(db, 'usernames', String(data.telegramUsername).toLowerCase()), {
        authEmail: email,
      });
    }
    if (data.phone) {
      await updateDoc(doc(db, 'phones', String(data.phone).replace(/\D+/g, '')), {
        authEmail: email,
      });
    }
    return true;
  } catch {
    return false;
  }
}

function friendlyCodeError(err) {
  switch (err?.code) {
    case 'auth/expired-action-code':
      return 'This link has expired. Links only work for a limited time.';
    case 'auth/invalid-action-code':
      return 'This link is invalid or has already been used.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support from the login page.';
    case 'auth/user-not-found':
      return 'We could not find an account for this link.';
    case 'auth/weak-password':
      return 'That password is too weak. Use at least 6 characters.';
    default:
      return err?.message || 'Something went wrong. Try requesting a new link.';
  }
}

export default function AuthAction() {
  const { resolvedTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || '';
  const oobCode = searchParams.get('oobCode') || '';
  const continueUrl = searchParams.get('continueUrl') || '';

  // phase: 'loading' | 'reset' | 'success' | 'error'
  const [phase, setPhase] = useState('loading');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [synced, setSynced] = useState(false);

  // Password-reset form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const ranRef = useRef(false);

  // If continueUrl points back into this app, use its path for the sign-in CTA.
  let signInTo = '/login';
  try {
    if (continueUrl) {
      const url = new URL(continueUrl, window.location.origin);
      if (url.origin === window.location.origin && url.pathname !== '/auth-action') {
        signInTo = url.pathname + url.search;
      }
    }
  } catch {
    // Ignore malformed continueUrl; keep /login.
  }

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (!oobCode || !mode) {
      setErrorMsg('');
      setPhase('error');
      return;
    }

    (async () => {
      try {
        if (mode === 'resetPassword') {
          const accountEmail = await verifyPasswordResetCode(auth, oobCode);
          setEmail(accountEmail);
          setPhase('reset');
        } else if (
          mode === 'verifyAndChangeEmail' ||
          mode === 'verifyEmail' ||
          mode === 'recoverEmail'
        ) {
          await applyActionCode(auth, oobCode);
          if (mode === 'verifyAndChangeEmail') {
            setSynced(await trySyncEmailDocs(null));
          }
          setPhase('success');
        } else {
          setPhase('error');
        }
      } catch (err) {
        setErrorMsg(friendlyCodeError(err));
        setPhase('error');
      }
    })();
  }, [mode, oobCode]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setPhase('success');
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/expired-action-code' || code === 'auth/invalid-action-code') {
        setErrorMsg(friendlyCodeError(err));
        setPhase('error');
      } else {
        setFormError(friendlyCodeError(err));
      }
      setSubmitting(false);
    }
  };

  const loading = phase === 'loading';

  return (
    <AuthLayout
      headerLink={{ to: '/login', label: 'Sign in' }}
      mark={
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-card"
            style={{ boxShadow: 'var(--elev-ring)' }}
          >
            {loading || submitting ? (
              <EdgeableLoader height={38} label="Checking your link" />
            ) : (
              <EdgeableLogo
                variant="icon"
                mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                height={34}
              />
            )}
          </div>
          <div className="eyebrow">Account security</div>
        </div>
      }
    >
      {loading && (
        <div role="status" className="py-6 text-center">
          <h1 className="text-[1.5625rem] font-bold leading-[1.1] tracking-tight">
            Checking your link
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">One moment.</p>
        </div>
      )}

      {phase === 'error' && <ErrorState mode={mode} message={errorMsg} />}

      {phase === 'reset' && (
        <>
          <h1 className="text-[1.5625rem] font-bold leading-[1.1] tracking-tight">
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a new password for your Edgeable account.
          </p>

          <form onSubmit={handleResetSubmit} className="mt-7 space-y-5">
            {formError && (
              <div role="alert" className={authAlertClass}>
                <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="action-email">Account</Label>
              <Input
                id="action-email"
                type="email"
                className={authInputClass}
                value={email}
                readOnly
                disabled
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                className={authInputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoFocus
                autoComplete="new-password"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                At least 6 characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                className={authInputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" disabled={submitting} className={authButtonClass}>
              {submitting ? (
                'Updating…'
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Update password
                </>
              )}
            </Button>
          </form>
        </>
      )}

      {phase === 'success' && (
        <SuccessState mode={mode} email={email} synced={synced} signInTo={signInTo} />
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Need help?{' '}
        <Link to="/login" className={goldLinkClass}>
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function SuccessState({ mode, email, synced, signInTo }) {
  let title = 'All set';
  let body = 'You can sign in now.';
  let cta = { to: signInTo === '/login' ? '/login' : signInTo, label: 'Sign in', icon: LogIn };
  let notice = null;

  if (mode === 'resetPassword') {
    title = 'Password updated';
    body = `Your password${email ? ` for ${email}` : ''} has been changed. Use it to sign in.`;
  } else if (mode === 'verifyEmail') {
    title = 'Email verified';
    body = 'Thanks for confirming your email. You are all set.';
  } else if (mode === 'verifyAndChangeEmail') {
    title = 'Email updated';
    body = 'Your account email has been changed. Use it to sign in from now on.';
    if (!synced) {
      notice = 'Telegram and phone sign-in update the next time you log in with your email.';
    }
  } else if (mode === 'recoverEmail') {
    title = 'Email change reversed';
    body =
      'Your email was changed and you clicked the recovery link, so the change has been reversed. ' +
      "If this wasn't you, reset your password now.";
    cta = { to: '/forgot-password', label: 'Reset password', icon: KeyRound };
  }

  const Icon = cta.icon;

  return (
    <div>
      <div role="status" className={successBoxClass}>
        <Check className="mt-0.5 h-[18px] w-[18px] shrink-0" />
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-0.5 text-foreground/75">{body}</div>
          {notice && <div className="mt-1.5 text-foreground/75">{notice}</div>}
        </div>
      </div>

      <Button asChild className={`${authButtonClass} mt-6`}>
        <Link to={cta.to}>
          <Icon className="h-4 w-4" />
          {cta.label}
        </Link>
      </Button>
    </div>
  );
}

function ErrorState({ mode, message }) {
  const isReset = mode === 'resetPassword';
  return (
    <div>
      <h1 className="text-[1.5625rem] font-bold leading-[1.1] tracking-tight">
        This link isn't valid
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {message ||
          'This link is missing information, has expired, or was already used. Request a fresh one and try again.'}
      </p>

      <div role="alert" className={`${authAlertClass} mt-7`}>
        <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />
        <span>
          {isReset
            ? 'Password reset links only work once and expire after a short time.'
            : 'Account links only work once and expire after a short time.'}
        </span>
      </div>

      <Button asChild className={`${authButtonClass} mt-6`}>
        <Link to={isReset ? '/forgot-password' : '/login'}>
          {isReset ? (
            <>
              <KeyRound className="h-4 w-4" />
              Request a new link
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Back to sign in
            </>
          )}
        </Link>
      </Button>
    </div>
  );
}
