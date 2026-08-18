import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import AuthLayout, {
  authAlertClass,
  authButtonClass,
  authInputClass,
  goldHoverTextClass,
  goldLinkClass,
} from '../components/AuthLayout.jsx';
import EdgeableLogo from '../components/EdgeableLogo.jsx';
import EdgeableLoader from '../components/EdgeableLoader.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';

export default function Login() {
  const { login, currentUser, role, loading } = useAuth();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [currentUser, role, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(identifier, password);
    } catch (err) {
      setError(friendlyError(err) || 'Login failed.');
      setSubmitting(false);
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
            {submitting ? (
              <EdgeableLoader height={38} label="Signing in" />
            ) : (
              <EdgeableLogo variant="icon" mode={resolvedTheme === 'dark' ? 'dark' : 'light'} height={34} />
            )}
          </div>
          <div className="eyebrow">{submitting ? 'Signing in…' : 'Members only'}</div>
        </div>
      }
    >
      <h1 className="text-[1.5625rem] font-bold leading-[1.1] tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to your dashboard.</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {error && (
          <div role="alert" className={authAlertClass}>
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />
            <div>
              <div className="font-semibold">Sign-in failed</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="identifier">Email, Telegram username, or phone</Label>
          <Input
            id="identifier"
            type="text"
            className={authInputClass}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoFocus
            placeholder="you@example.com, @yourname, or +15551234567"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className={`-my-3 inline-flex min-h-[44px] items-center px-1 text-xs font-medium text-muted-foreground transition-colors ${goldHoverTextClass}`}
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            className={authInputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={submitting} className={authButtonClass}>
          {submitting ? (
            'Signing in…'
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign in
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{' '}
        <Link to="/signup" className={goldLinkClass}>
          Create a free account
        </Link>
      </p>
    </AuthLayout>
  );
}

function friendlyError(err) {
  const code = err?.code || '';
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
      return 'Login or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again in a few minutes.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return err?.message || null;
  }
}
