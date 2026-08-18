import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { isValidEmail } from '../utils/auth.js';
import AuthLayout, {
  authAlertClass,
  authButtonClass,
  authInputClass,
  goldLinkClass,
} from '../components/AuthLayout.jsx';
import EdgeableLogo from '../components/EdgeableLogo.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { resolvedTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Please enter the email address on your account.');
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      // Don't reveal whether an account exists: show success for user-not-found.
      if (err?.code === 'auth/user-not-found') {
        setSent(true);
      } else if (err?.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes and try again.');
        setSubmitting(false);
      } else {
        setError(err?.message || 'Could not send the reset email. Try again.');
        setSubmitting(false);
      }
    }
  };

  return (
    <AuthLayout
      headerLink={{ to: '/signup', label: 'Create an account' }}
      mark={
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-card"
            style={{ boxShadow: 'var(--elev-ring)' }}
          >
            <EdgeableLogo
              variant="icon"
              mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
              height={34}
            />
          </div>
          <div className="eyebrow">Members only</div>
        </div>
      }
    >
      <h1 className="text-[1.5625rem] font-bold leading-[1.1] tracking-tight">
        Reset your password
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the email on your account and we'll send you a reset link.
      </p>

      {sent ? (
        <div
          role="status"
          className="mt-7 flex items-start gap-3 rounded-lg border border-[hsl(var(--success)/0.35)] bg-[hsl(var(--success)/0.1)] px-3.5 py-3 text-sm text-success"
        >
          <Check className="mt-0.5 h-[18px] w-[18px] shrink-0" />
          <div>
            <div className="font-semibold">Check your inbox</div>
            <div className="mt-0.5 text-foreground/75">
              If that email has an account, a reset link is on its way. It can take a minute; check
              spam too.
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {error && (
            <div role="alert" className={authAlertClass}>
              <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              className={authInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="you@example.com"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Signed up with Telegram or phone only? Message support from the login page and we'll
              reset it for you.
            </p>
          </div>

          <Button type="submit" disabled={submitting} className={authButtonClass}>
            {submitting ? (
              'Sending…'
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send reset link
              </>
            )}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link to="/login" className={goldLinkClass}>
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
