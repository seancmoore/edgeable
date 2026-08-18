import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailWarning } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import ShellHeader from '../components/dashboard/ShellHeader.jsx';
import TodaysCard from '../components/dashboard/TodaysCard.jsx';
import MembershipPanel from '../components/dashboard/MembershipPanel.jsx';
import TransactionHistory from '../components/dashboard/TransactionHistory.jsx';
import ReferralPanel from '../components/dashboard/ReferralPanel.jsx';
import RecordView from '../components/dashboard/RecordView.jsx';
import GuideView from '../components/dashboard/GuideView.jsx';
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';
import { getMyTransactionRequests } from '../utils/transactionRequests.js';
import { getSubscriberTransactions } from '../utils/transactions.js';
import { getAllPnL } from '../utils/pnl.js';
import { getPublicStubs, getReadableFullPicks, mergePicks, isPostedToday } from '../utils/picks.js';
import { toDate, formatDate } from '../utils/subscription.js';
import '../components/dashboard/dashboard.css';

/**
 * Map real account data onto the five Dusk Ledger membership states.
 *  - vip:      status active AND subscriptionEnd in the future
 *  - pending:  a transactionRequest with status 'pending' exists
 *  - rejected: the most recent transactionRequest was rejected (and nothing
 *              newer superseded it)
 *  - expired:  not active, but there is subscription history (or status is
 *              expired/paused)
 *  - free:     everything else (inactive, no history)
 */
function deriveMembership(userDoc, requests) {
  if (!userDoc) return 'free';
  const now = new Date();
  const end = toDate(userDoc.subscriptionEnd);
  if (userDoc.status === 'active' && end && end > now) return 'vip';
  if (requests.some((r) => r.status === 'pending')) return 'pending';
  const latest = requests[0]; // newest first
  if (latest && latest.status === 'rejected') return 'rejected';
  const hasHistory = !!toDate(userDoc.subscriptionStart) || !!end
    || userDoc.status === 'expired' || userDoc.status === 'paused';
  if (hasHistory) return 'expired';
  return 'free';
}

const GREETING_SUBS = {
  free: 'Free account. Free picks land here the moment they post.',
  pending: 'Payment received. Your VIP is being verified, usually the same day.',
  rejected: "Your payment couldn't be verified yet. Two quick checks below will fix it.",
  vip: "VIP access is active. Today's full card is below.",
  expired: 'Your VIP access has ended. Your record is safe; the card is waiting.',
};

function StatusChip({ membership, userDoc }) {
  const end = toDate(userDoc?.subscriptionEnd);
  if (membership === 'vip') {
    return (
      <span className="status-chip chip-vip">
        <span className="dot" aria-hidden="true" />VIP active{end ? ` · renews ${formatDate(end)}` : ''}
      </span>
    );
  }
  if (membership === 'pending') {
    return (
      <span className="status-chip chip-pending">
        <span className="dot" aria-hidden="true" />VIP · verifying payment
      </span>
    );
  }
  if (membership === 'rejected') {
    return (
      <span className="status-chip chip-expired">
        <span className="dot" aria-hidden="true" />VIP · payment needs attention
      </span>
    );
  }
  if (membership === 'expired') {
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

export default function Dashboard() {
  const { currentUser, userDoc, logout, emailVerified, resendVerification, refreshEmailVerified } = useAuth();
  const navigate = useNavigate();

  // ── In-page tabs (Dashboard / Record / Guide) with the mock's out/in motion ──
  const [tab, setTab] = useState('dashboard');
  const [leavingTab, setLeavingTab] = useState(null);
  const [recordVisit, setRecordVisit] = useState(0);
  const switchTimer = useRef(0);

  const goTab = (next) => {
    if (next === tab || leavingTab) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const land = () => {
      setTab(next);
      setLeavingTab(null);
      window.scrollTo(0, 0);
      if (next === 'record') setRecordVisit((k) => k + 1); // replay the chart draw
    };
    if (reduce) { land(); return; }
    setLeavingTab(tab); // 150ms out, then 340ms in (CSS)
    switchTimer.current = setTimeout(land, 150);
  };
  useEffect(() => () => clearTimeout(switchTimer.current), []);

  // Reserve the scrollbar gutter for the whole visit so switching tabs never
  // shifts the centered layout sideways.
  useEffect(() => {
    document.documentElement.classList.add('dldash-gutter');
    return () => document.documentElement.classList.remove('dldash-gutter');
  }, []);

  const viewClass = (id) => {
    if (leavingTab === id) return 'view leaving';
    if (tab === id && !leavingTab) return 'view active';
    return 'view';
  };

  // ── Data ────────────────────────────────────────────────────────────────────
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pnlEntries, setPnlEntries] = useState([]);
  const [todayPicks, setTodayPicks] = useState([]);
  const [fullPicks, setFullPicks] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      const [reqs, txns, pnl] = await Promise.all([
        getMyTransactionRequests(currentUser.uid).catch(() => []),
        getSubscriberTransactions(currentUser.uid).catch(() => []),
        getAllPnL().catch(() => []),
      ]);
      if (cancelled) return;
      setRequests(reqs);
      setTransactions(txns);
      setPnlEntries(pnl);
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  // Picks: world-readable stubs give the complete record; full details attach
  // where this viewer can read them (all picks for active subs, access=='public'
  // otherwise). Stub-only rows render as locked.
  useEffect(() => {
    if (!currentUser || !userDoc) return;
    let cancelled = false;
    (async () => {
      const [stubs, full] = await Promise.all([
        getPublicStubs(300).catch(() => []),
        getReadableFullPicks({ userDoc, maxCount: 500 }).catch(() => []),
      ]);
      if (cancelled) return;
      setFullPicks(full);
      const merged = mergePicks(stubs, full)
        .filter(isPostedToday)
        .sort((a, b) => (a.postedAt?.toDate?.()?.getTime() || 0) - (b.postedAt?.toDate?.()?.getTime() || 0));
      setTodayPicks(merged);
    })();
    return () => { cancelled = true; };
  }, [currentUser, userDoc]);

  const membership = useMemo(() => deriveMembership(userDoc, requests), [userDoc, requests]);
  const pendingRequest = requests.find((r) => r.status === 'pending') || null;
  const rejectedRequest = requests[0]?.status === 'rejected' ? requests[0] : null;

  // ── Account chrome ──────────────────────────────────────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const displayName = userDoc?.displayName || 'there';
  const email = userDoc?.email || currentUser?.email || '';

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const goMembership = () => {
    goTab('dashboard');
    setTimeout(() => {
      document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  // ── Email-verification banner (needed before submitting payment proof) ──────
  const [verifyMsg, setVerifyMsg] = useState('');
  const [verifyBusy, setVerifyBusy] = useState(false);
  const handleResendVerification = async () => {
    setVerifyBusy(true);
    setVerifyMsg('');
    try {
      await resendVerification();
      setVerifyMsg('Sent. Check your inbox (and spam), open the link, then re-check.');
    } catch (e) {
      setVerifyMsg(e?.message || 'Could not send the email. Try again shortly.');
    }
    setVerifyBusy(false);
  };
  const handleRecheckVerification = async () => {
    setVerifyBusy(true);
    setVerifyMsg('');
    const ok = await refreshEmailVerified();
    if (!ok) setVerifyMsg('Still not verified. Click the link in the email, then re-check.');
    setVerifyBusy(false);
  };

  return (
    <div className="dldash">
      <div className="container">
        <ShellHeader
          tab={tab}
          onTab={goTab}
          displayName={displayName}
          email={email}
          onSignOut={handleSignOut}
          onChangePassword={() => setShowPasswordModal(true)}
        />

        <main>
          {/* ================= VIEW: DASHBOARD ================= */}
          <section className={viewClass('dashboard')} aria-label="Dashboard" aria-hidden={tab !== 'dashboard'}>
            {currentUser && !emailVerified && (
              <div className="verify-banner" role="note">
                <MailWarning aria-hidden="true" />
                <div>
                  <strong>Confirm your email.</strong> We sent a verification link to{' '}
                  <strong>{email}</strong>. You'll need a verified email to submit a payment
                  request.
                  {verifyMsg && <div style={{ marginTop: 6 }}>{verifyMsg}</div>}
                  <div className="vb-actions">
                    <button className="vb-btn" type="button" onClick={handleResendVerification} disabled={verifyBusy}>
                      Resend email
                    </button>
                    <button className="vb-btn" type="button" onClick={handleRecheckVerification} disabled={verifyBusy}>
                      {verifyBusy ? 'Checking…' : "I've verified"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="greeting">
              <div>
                <h1>Welcome back, {displayName}</h1>
                <p className="sub">{GREETING_SUBS[membership]}</p>
              </div>
              <StatusChip membership={membership} userDoc={userDoc} />
            </div>

            <div className="dash-grid">
              <div className="col">
                <TodaysCard
                  picks={todayPicks}
                  membership={membership}
                  onGoMembership={goMembership}
                />
              </div>
              <div className="col">
                <MembershipPanel
                  membership={membership}
                  userDoc={userDoc}
                  pendingRequest={pendingRequest}
                  rejectedRequest={rejectedRequest}
                />
                <TransactionHistory
                  transactions={transactions}
                  requests={requests}
                  membership={membership}
                />
                <ReferralPanel userDoc={userDoc} />
              </div>
            </div>
          </section>

          {/* ================= VIEW: RECORD ================= */}
          <section className={viewClass('record')} aria-label="Record" aria-hidden={tab !== 'record'}>
            {currentUser && (
              <RecordView
                uid={currentUser.uid}
                userDoc={userDoc}
                membership={membership}
                entries={pnlEntries}
                fullPicks={fullPicks}
                redrawSignal={recordVisit}
              />
            )}
          </section>

          {/* ================= VIEW: GUIDE ================= */}
          <section className={viewClass('guide')} aria-label="Guide" aria-hidden={tab !== 'guide'}>
            <GuideView />
          </section>
        </main>

        <footer className="legal">
          <p>
            21+ only. Picks are opinions, not financial advice. Past performance does not
            guarantee future results. · <Link to="/terms">Terms</Link> ·{' '}
            <Link to="/privacy">Privacy</Link>
          </p>
        </footer>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
