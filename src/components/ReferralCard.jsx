import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Card } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { referralLink } from '../utils/referrals.js';

export default function ReferralCard({ userDoc }) {
  const [copied, setCopied] = useState('');
  const code = userDoc?.referralCode;
  if (!code) return null; // not generated yet (existing users get one via backfill)

  const count = Number(userDoc?.referralCount || 0);

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      // clipboard blocked — selecting the visible code still works
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-1 w-full bg-primary" aria-hidden />
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Gift className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display font-semibold tracking-tight">Refer a friend</div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Share your code. When your friend signs up and gets approved, you each get{' '}
              <strong className="text-foreground">2 extra weeks</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <code className="rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-lg font-semibold tracking-widest">
            {code}
          </code>
          <Button variant="outline" size="sm" onClick={() => copy(code, 'code')}>
            {copied === 'code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'code' ? 'Copied' : 'Copy code'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => copy(referralLink(code), 'link')}>
            {copied === 'link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'link' ? 'Copied' : 'Copy link'}
          </Button>
        </div>

        {count > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            <strong className="text-foreground">{count}</strong>{' '}
            {count === 1 ? 'friend has' : 'friends have'} joined with your code.
          </p>
        )}
      </div>
    </Card>
  );
}
