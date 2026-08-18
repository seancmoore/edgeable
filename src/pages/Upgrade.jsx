// /upgrade — the VIP payment flow (Pay → Proof → Approval).
// Pixel spec: mocks/upgrade.html (Dusk Ledger, approved 2026-08-18).
// Reuses the existing transactionRequests machinery (same storage path, same
// doc schema + additive fields) so admin approval keeps working unchanged.
// Payment handles load from Firestore config/paymentInfo, never hard-coded.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { getPaymentInfo } from '../utils/paymentInfo.js';
import submitUpgradeRequest from '../components/upgrade/submitUpgradeRequest.js';
import '../components/upgrade/upgrade.css';

// Tiered pricing (Sean, 2026-08-18): 1-5 months $30/mo, 6-11 months 5% off/mo
// ($28.50), 12+ months 10% off/mo ($27). Discount caps at 10%. UI cap 24 months.
const BASE_RATE = 30;
const MAX_MONTHS = 24;

function discountPctFor(months) {
  return months >= 12 ? 10 : months >= 6 ? 5 : 0;
}
function rateFor(months) {
  return Math.round(BASE_RATE * (100 - discountPctFor(months))) / 100;
}
// "$30", "$28.50", "$199.50": cents only when needed.
function fmtMoney(n) {
  const cents = Math.round(n * 100);
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}
function fmtBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const MAX_PROOF_BYTES = 5 * 1024 * 1024; // matches ImageUploader.jsx
const METHOD_LABELS = { cashapp: 'Cash App', zelle: 'Zelle' };
const METHOD_WHERE = { cashapp: 'on Cash App', zelle: 'with Zelle' };

// Inline icons (stroke = currentColor, matching the mock's icon set)
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export default function Upgrade() {
  const { currentUser, userDoc, emailVerified, resendVerification, refreshEmailVerified } = useAuth();

  // ── flow state ──
  const [step, setStep] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const goStep = (n) => {
    if (n === step || leaving) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const land = () => {
      setStep(n);
      setLeaving(false);
      window.scrollTo(0, 0);
    };
    if (reduce) { land(); return; }
    setLeaving(true);
    setTimeout(land, 150);
  };

  // ── step 1: months + method ──
  const [months, setMonths] = useState(1);
  const [method, setMethod] = useState('cashapp');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [infoError, setInfoError] = useState('');
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getPaymentInfo()
      .then((info) => { if (!cancelled) setPaymentInfo(info); })
      .catch(() => { if (!cancelled) setInfoError('Could not load payment details. Refresh the page to try again.'); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const discountPct = discountPctFor(months);
  const rate = rateFor(months);
  const total = Math.round(rate * months * 100) / 100;
  const totalStr = fmtMoney(total);
  const recipient = paymentInfo?.[method]?.recipient || '';
  const methodEnabled = paymentInfo?.[method]?.enabled !== false;
  const username = userDoc?.displayName || userDoc?.telegramUsername || 'your username';

  const handleCopy = async () => {
    if (!recipient) return;
    try {
      await navigator.clipboard.writeText(recipient);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard unavailable: the handle is visible to copy manually */ }
  };

  // ── step 2: proof file ──
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return undefined; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const acceptFile = (f) => {
    setFileError('');
    setSubmitError('');
    if (!f) return;
    if (!['image/png', 'image/jpeg'].includes(f.type)) {
      setFileError('That file is not a PNG or JPG. Screenshots from your phone work perfectly.');
      return;
    }
    if (f.size > MAX_PROOF_BYTES) {
      setFileError('That image is larger than 5 MB. A regular screenshot will be well under the limit.');
      return;
    }
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setFileError('');
    setSubmitError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // ── email-verify gate (same policy as the legacy renewal modal) ──
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('');
  useEffect(() => { refreshEmailVerified(); }, [refreshEmailVerified]);
  const handleResend = async () => {
    setVerifyBusy(true); setVerifyMsg('');
    try {
      await resendVerification();
      setVerifyMsg('Verification email sent. Check your inbox and spam folder.');
    } catch (e) {
      setVerifyMsg(e?.message || 'Could not send the email. Try again in a minute.');
    }
    setVerifyBusy(false);
  };
  const handleRecheck = async () => {
    setVerifyBusy(true); setVerifyMsg('');
    const ok = await refreshEmailVerified();
    if (!ok) setVerifyMsg('Still not verified. Click the link in the email, then re-check.');
    setVerifyBusy(false);
  };

  const handleSubmit = async () => {
    if (!file || submitting || !emailVerified) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitUpgradeRequest({
        subscriberUid: currentUser.uid,
        subscriberDisplayName: userDoc?.displayName,
        subscriberTelegramUsername: userDoc?.telegramUsername,
        subscriberPhone: userDoc?.phone,
        months,
        monthlyRate: rate,
        discountPercent: discountPct,
        total,
        paymentMethod: method,
        imageFile: file,
      });
      goStep(3);
    } catch {
      setSubmitError("The upload didn't go through. Nothing was lost: your screenshot is still attached. Check your connection and tap Submit again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepPill = (n, label) => (
    <span className={`upg-step-pill${step === n ? ' on' : ''}${step > n ? ' done' : ''}`}>
      <span className="upg-n">{step > n ? '✓' : n}</span>
      <span className="upg-lbl">{label}</span>
    </span>
  );

  return (
    <div className="upg">
      <div className="upg-container">

        <header className="upg-shell">
          <Link className="upg-wordmark" to="/dashboard" aria-label="Edgeable dashboard">
            <img className="upg-wm-light" src="/edgeable-wordmark-ink.svg" alt="Edgeable" />
            <img className="upg-wm-dark" src="/edgeable-wordmark.svg" alt="Edgeable" />
          </Link>
          <Link className="upg-back-link" to="/dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            Back to dashboard
          </Link>
        </header>

        <div className="upg-flow-head">
          <h1>Unlock VIP access</h1>
          <p className="upg-sub">$30/month. No auto-billing, no checkout bots. Paid person-to-person, approved personally.</p>
        </div>

        <div className="upg-stepper" aria-label="Progress">
          {stepPill(1, 'Pay')}
          <span className="upg-step-line" aria-hidden="true" />
          {stepPill(2, 'Proof')}
          <span className="upg-step-line" aria-hidden="true" />
          {stepPill(3, 'Approval')}
        </div>

        <main>
          {/* ============ STEP 1: PAY ============ */}
          {step === 1 && (
            <section className={`upg-step-view ${leaving ? 'leaving' : 'entering'}`} aria-label="Pay">
              <div className="upg-soft-card upg-panel">
                <div className="upg-sum-row">
                  <span className="upg-eyebrow">VIP access</span>
                  <span><span className="upg-amount upg-mono">{fmtMoney(rate)}</span> <span className="upg-per">/month</span></span>
                </div>
                <ul className="upg-m-list">
                  <li><CheckIcon />Every pick, every day. The full card.</li>
                  <li><CheckIcon />Exact units and odds on every play.</li>
                  <li><CheckIcon />Live updates and insights in the private Telegram channel.</li>
                </ul>

                <div className="upg-qty-block">
                  <div className="upg-qty-row">
                    <div>
                      <p className="upg-eyebrow">How many months?</p>
                      <div className="upg-qty">
                        <button
                          className="upg-qty-btn" type="button" aria-label="Fewer months"
                          disabled={months <= 1}
                          onClick={() => setMonths((m) => Math.max(1, m - 1))}
                        >
                          &minus;
                        </button>
                        <span className="upg-qty-num upg-mono" aria-live="polite">{months}</span>
                        <button
                          className="upg-qty-btn" type="button" aria-label="More months"
                          disabled={months >= MAX_MONTHS}
                          onClick={() => setMonths((m) => Math.min(MAX_MONTHS, m + 1))}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="upg-price-brk">
                      <div className="upg-brk-row"><span>Rate</span><span className="upg-mono">{fmtMoney(rate)}/mo</span></div>
                      {discountPct > 0 && (
                        <div className="upg-brk-row"><span>Discount</span><span className="upg-mono upg-brk-disc">{discountPct}% off every month</span></div>
                      )}
                      <div className="upg-brk-row total">
                        <span>Total due</span>
                        <span className="upg-mono">{totalStr}{months > 1 ? ` · ${months} months` : ''}</span>
                      </div>
                    </div>
                  </div>
                  <p className="upg-tier-hint">1-5 months $30/mo · 6+ months 5% off every month · 12+ months 10% off every month</p>
                </div>

                <p className="upg-renew-note">Renewing? Same flow. New months stack onto whatever time you have left, nothing is wasted.</p>
              </div>

              <div className="upg-soft-card upg-panel">
                <p className="upg-eyebrow">Choose how to pay</p>
                <div className="upg-method-seg" role="group" aria-label="Payment method">
                  {['cashapp', 'zelle'].map((m) => (
                    <button
                      key={m} type="button" className="upg-method-btn"
                      aria-pressed={method === m}
                      onClick={() => setMethod(m)}
                    >
                      <img className="upg-brand-logo" src={m === 'cashapp' ? '/cashapp-logo.svg' : '/zelle-logo.svg'} alt="" aria-hidden="true" />
                      {METHOD_LABELS[m]}
                    </button>
                  ))}
                </div>

                {infoError && <div className="upg-method-off">{infoError}</div>}

                {!infoError && !methodEnabled && (
                  <div className="upg-method-off">
                    {METHOD_LABELS[method]} is temporarily unavailable. Please use the other method.
                  </div>
                )}

                {!infoError && methodEnabled && (
                  <div className="upg-pay-detail">
                    <div className="upg-pay-to">
                      <div>
                        <div className="upg-k">Send {totalStr} {METHOD_WHERE[method]} to</div>
                        <div className="upg-v">{paymentInfo ? (recipient || 'Unavailable right now') : 'Loading…'}</div>
                      </div>
                      <button className="upg-copy-btn" type="button" onClick={handleCopy} disabled={!recipient}>
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <ol className="upg-pay-steps">
                      <li>Send exactly <strong className="upg-mono">{totalStr}</strong>.</li>
                      <li>Put your Edgeable username, <strong className="upg-mono">{username}</strong>, in the payment note.</li>
                      <li>Screenshot the confirmation. You&apos;ll attach it in the next step.</li>
                    </ol>
                    <div className="upg-note-chip" role="note">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
                      <span>The username in the note is how your payment gets matched to your account fast. Without it, approval can take longer.</span>
                    </div>
                  </div>
                )}

                <div className="upg-btn-row">
                  <button className="upg-cta-btn" type="button" onClick={() => goStep(2)}>
                    I&apos;ve sent the {totalStr}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ============ STEP 2: PROOF ============ */}
          {step === 2 && (
            <section className={`upg-step-view ${leaving ? 'leaving' : 'entering'}`} aria-label="Proof">
              <div className="upg-soft-card upg-panel">
                <p className="upg-eyebrow">Attach your payment screenshot</p>
                <p style={{ marginTop: 10, fontSize: 'var(--upg-text-sm)', color: 'hsl(var(--muted-foreground))' }}>
                  The screenshot is your receipt. It&apos;s how your payment is verified and approved, usually the same day.
                </p>

                {!emailVerified && (
                  <div className="upg-verify-box">
                    <span>
                      <strong>Verify your email first.</strong> Before submitting a payment request, confirm
                      your email address. We sent a link to <strong>{userDoc?.email || 'your email'}</strong>.
                    </span>
                    {verifyMsg && <span>{verifyMsg}</span>}
                    <span className="upg-verify-actions">
                      <button type="button" onClick={handleResend} disabled={verifyBusy}>Resend email</button>
                      <button type="button" onClick={handleRecheck} disabled={verifyBusy}>
                        {verifyBusy ? 'Checking…' : "I've verified, re-check"}
                      </button>
                    </span>
                  </div>
                )}

                {!file && (
                  <div
                    className={`upg-dropzone${dragging ? ' dragging' : ''}`}
                    role="button" tabIndex={0}
                    aria-label="Upload payment screenshot"
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); }
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      acceptFile(e.dataTransfer.files?.[0]);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
                    <p className="upg-dz-main">Tap to choose your screenshot</p>
                    <p className="upg-dz-sub">or drag it here · PNG or JPG</p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  style={{ display: 'none' }}
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />

                {file && (
                  <div className="upg-file-row">
                    <span className="upg-file-thumb" aria-hidden="true">
                      {previewUrl ? (
                        <img src={previewUrl} alt="" />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="9.5" cy="9.5" r="1.5" /><path d="M20 15l-4.5-4.5L6 20" /></svg>
                      )}
                    </span>
                    <span className="upg-file-meta">
                      <span className="upg-fname">{file.name}</span>
                      <span className="upg-fsize">{fmtBytes(file.size)}</span>
                    </span>
                    <button className="upg-file-x" type="button" aria-label="Remove screenshot" onClick={removeFile} disabled={submitting}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                  </div>
                )}

                {fileError && <div className="upg-upload-err">{fileError}</div>}
                {submitError && <div className="upg-upload-err">{submitError}</div>}

                <div className="upg-btn-row">
                  <button
                    className="upg-cta-btn" type="button"
                    disabled={!file || !emailVerified || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? 'Submitting…' : 'Submit for approval'}
                  </button>
                  <button className="upg-cta-btn upg-cta-outline" type="button" onClick={() => goStep(1)} disabled={submitting}>
                    Back
                  </button>
                </div>
                <p className="upg-fine">Nothing is charged through the app. Your screenshot goes only to the owner for verification.</p>
              </div>
            </section>
          )}

          {/* ============ STEP 3: PENDING APPROVAL ============ */}
          {step === 3 && (
            <section className={`upg-step-view ${leaving ? 'leaving' : 'entering'}`} aria-label="Pending approval">
              <div className="upg-soft-card upg-done-panel">
                <span className="upg-done-icon" aria-hidden="true"><CheckIcon /></span>
                <h2>Proof received. You&apos;re in the queue.</h2>
                <p className="upg-d-sub">
                  Every membership is personally reviewed and approved, usually the <strong>same day</strong>.
                  Nothing else is needed from you.
                </p>

                <div className="upg-next-list">
                  <div className="upg-next-item">
                    <span className="upg-ni" aria-hidden="true">1</span>
                    <span className="upg-t"><strong>Your payment gets matched</strong> to your account using the username in the note.</span>
                  </div>
                  <div className="upg-next-item">
                    <span className="upg-ni" aria-hidden="true">2</span>
                    <span className="upg-t"><strong>You&apos;re approved</strong> and your VIP month starts that moment, not when you paid.</span>
                  </div>
                  <div className="upg-next-item">
                    <span className="upg-ni" aria-hidden="true">3</span>
                    <span className="upg-t"><strong>The full card unlocks instantly</strong> on your dashboard, starting with today&apos;s picks.</span>
                  </div>
                  <div className="upg-next-item">
                    <span className="upg-ni" aria-hidden="true">4</span>
                    <span className="upg-t"><strong>Your Telegram invite arrives</strong>, a private link to the channel where live updates and insights drop.</span>
                  </div>
                </div>

                <div className="upg-btn-row" style={{ maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
                  <Link className="upg-cta-btn" to="/dashboard">Back to dashboard</Link>
                </div>
                <p className="upg-fine">
                  Sent the wrong amount or forgot the note? Nothing is lost, it just may take a little
                  longer to match. You can also message support from your account menu.
                </p>
              </div>
            </section>
          )}
        </main>

        <footer className="upg-legal">
          <p>21+ only. Payments are non-refundable per the Terms. No auto-billing: your month ends unless you renew it.</p>
        </footer>
      </div>
    </div>
  );
}
