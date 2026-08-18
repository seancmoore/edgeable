import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import {
  normalizeTelegramUsername, isValidTelegramUsername,
  normalizePhone, isValidPhone, isValidEmail,
} from '../utils/auth.js';
import AuthLayout, {
  authAlertClass,
  authButtonClass,
  authInputClass,
  goldLinkClass,
} from '../components/AuthLayout.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';

export default function Signup() {
  const { signup, currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorRef = useRef(null);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState((searchParams.get('ref') || '').toUpperCase());
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [error]);

  const fail = (msg) => {
    setError(msg);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedUsername = normalizeTelegramUsername(telegramUsername);
    const normalizedPhone = normalizePhone(phone);
    const hasUsername = !!normalizedUsername;
    const hasPhone = !!normalizedPhone;

    if (!displayName.trim()) return fail('Please enter your display name.');
    if (!isValidEmail(email)) return fail('Please enter a valid email address.');
    if (!hasUsername) return fail('Please enter your Telegram username.');
    if (!isValidTelegramUsername(normalizedUsername)) {
      return fail('Telegram username must be 5-32 characters: letters, numbers, or underscore.');
    }
    if (!hasPhone) return fail('Please enter your phone number.');
    if (!isValidPhone(normalizedPhone)) {
      return fail('Phone must be 7-15 digits.');
    }
    if (password.length < 6) return fail('Password must be at least 6 characters.');
    if (password !== confirmPassword) return fail("Passwords don't match.");
    if (!agreeAge) return fail('Please confirm you meet the age requirements.');
    if (!agreeTerms) return fail('Please agree to the Terms and Privacy Policy to continue.');

    setSubmitting(true);
    try {
      await signup({ displayName, email, telegramUsername, phone, password, referralCode });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      fail(err.message || 'Sign-up failed. Please try again.');
    }
  };

  return (
    <AuthLayout width="lg" headerLink={{ to: '/login', label: 'Log in' }}>
      <h1 className="text-[1.5625rem] font-bold leading-[1.1] tracking-tight">
        Create your free account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No payment required. Free picks land in your dashboard the moment you're in; VIP is there
        whenever you want it.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {error && (
          <div ref={errorRef} role="alert" className={authAlertClass}>
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />
            <div>
              <div className="font-semibold">Sign-up failed</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            className={authInputClass}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            autoFocus
            placeholder="How you'd like to be called"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className={authInputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="you@example.com"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            You'll get a link to confirm this email. Used to sign in and to reset your password if
            you forget it.
          </p>
        </div>

        <div className="grid gap-3.5 rounded-lg bg-muted p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Both your Telegram username and phone number are required.
          </p>
          <div className="space-y-2">
            <Label htmlFor="telegramUsername">Telegram username</Label>
            <Input
              id="telegramUsername"
              className={authInputClass}
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              required
              maxLength={33}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="@yourname"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              className={authInputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1 555 123 4567"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className={authInputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="6+ characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input
              id="confirmPassword"
              type="password"
              className={authInputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralCode">Referral code (optional)</Label>
          <Input
            id="referralCode"
            className={`${authInputClass} font-mono font-medium uppercase tracking-[0.06em] placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal`}
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            maxLength={12}
            autoCapitalize="characters"
            autoCorrect="off"
            placeholder="Got a code from a friend?"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Enter a friend's code and you'll each get 2 extra weeks of VIP once your first payment
            is approved.
          </p>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg bg-muted px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-px h-4 w-4 shrink-0" />
          <span>
            Your free account works <strong className="font-semibold text-foreground">immediately</strong>:
            free picks, the live record, and the guide. The full daily card is VIP, $30/month, and
            you can unlock it anytime from your dashboard.
          </span>
        </div>

        <div className="grid gap-1 rounded-lg bg-muted p-4">
          <label className="flex min-h-[44px] cursor-pointer items-start gap-3 px-1 py-2 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={agreeAge}
              onChange={(e) => setAgreeAge(e.target.checked)}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-border accent-gold"
            />
            <span>
              I am at least <strong className="font-semibold text-foreground">21 years old</strong>{' '}
              (or the legal gambling age where I live).
            </span>
          </label>
          <label className="flex min-h-[44px] cursor-pointer items-start gap-3 px-1 py-2 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-border accent-gold"
            />
            <span>
              I have read and agree to the{' '}
              <Link to="/terms" target="_blank" rel="noreferrer" className={goldLinkClass}>
                Terms &amp; Disclaimers
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" rel="noreferrer" className={goldLinkClass}>
                Privacy Policy
              </Link>
              , including that Edgeable sells opinions and information only, places no wagers, gives
              no financial advice, and is not responsible for any losses.
            </span>
          </label>
        </div>

        <Button type="submit" disabled={submitting} className={authButtonClass}>
          {submitting ? (
            'Creating account…'
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create account
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className={goldLinkClass}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
