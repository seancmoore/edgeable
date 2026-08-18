import { useState } from 'react';
import { referralLink } from '../../utils/referrals.js';

/**
 * Referral panel: the existing ReferralCard's data + clipboard behavior,
 * restyled as a Dusk Ledger soft-card panel (mock: "Refer a friend").
 */
export default function ReferralPanel({ userDoc }) {
  const [copied, setCopied] = useState(false);
  const code = userDoc?.referralCode;
  if (!code) return null; // not generated yet (existing users get one via backfill)

  const count = Number(userDoc?.referralCount || 0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink(code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard blocked; selecting the visible code still works
    }
  };

  return (
    <section className="soft-card panel" aria-label="Referrals">
      <p className="eyebrow">Refer a friend</p>
      <p className="m-copy">
        They enter your code at signup. When they're approved, you BOTH get +2 weeks of VIP free.
      </p>
      <div className="ref-code">
        <span className="code">{code}</span>
        <button className="copy-btn" type="button" onClick={copy}>
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      {count > 0 && (
        <p className="m-note">
          <strong>{count}</strong> {count === 1 ? 'friend has' : 'friends have'} joined with your code.
        </p>
      )}
    </section>
  );
}
