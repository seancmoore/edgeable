import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicRecord, fetchPublicPnLSeries, fetchFreePicks } from '../utils/publicLanding.js';
import { formatOdds, formatPostedAt, pickNetUnits } from '../utils/picks.js';
import { smoothPath, scaleSeries, fmtUnits } from '../components/landing/curve.js';
import LandingChart from '../components/landing/LandingChart.jsx';
import PhoneDemo from '../components/landing/PhoneDemo.jsx';
import './landing.css';

// Public landing page at "/" — a faithful React port of the approved mock
// (mocks/join.html, Dusk Ledger). All visuals are scoped under .dusk-theme
// (src/pages/landing.css); the rest of the app keeps its own global tokens.
// Data comes from ONE world-readable summary doc (landingStats/current, via
// src/utils/publicLanding.js): record + pending count, net units + chart +
// ROI, and the free-pick samples, all in a single read.

const DownArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v14M6 12.5l6 6 6-6" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

// Result badge for a graded free pick: W/L/P glyph + honest units outcome.
function PickResult({ pick }) {
  const net = Math.round(pickNetUnits(pick) * 100) / 100;
  const cls = pick.status === 'win' ? 'result-win' : pick.status === 'loss' ? 'result-loss' : 'result-push';
  const glyph = pick.status === 'win' ? 'W' : pick.status === 'loss' ? 'L' : 'P';
  const label = pick.status === 'push' ? '0u' : `${net > 0 ? '+' : ''}${net}u`;
  return (
    <p className={`pick-result ${cls}`}>
      <span className="result-glyph" aria-hidden="true">{glyph}</span>{' '}
      <span className="mono">{label}</span>
    </p>
  );
}

export default function Landing() {
  const rootRef = useRef(null);

  const [record, setRecord] = useState({ loading: true, data: null, error: false });
  const [pnl, setPnl] = useState({ loading: true, data: null, error: false });
  const [picks, setPicks] = useState({ loading: true, data: [], error: false });

  useEffect(() => {
    let alive = true;
    fetchPublicRecord()
      .then((data) => { if (alive) setRecord({ loading: false, data, error: false }); })
      .catch(() => { if (alive) setRecord({ loading: false, data: null, error: true }); });
    fetchPublicPnLSeries()
      .then((data) => { if (alive) setPnl({ loading: false, data, error: false }); })
      .catch(() => { if (alive) setPnl({ loading: false, data: null, error: true }); });
    fetchFreePicks(3)
      .then((data) => { if (alive) setPicks({ loading: false, data, error: false }); })
      .catch(() => { if (alive) setPicks({ loading: false, data: [], error: true }); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Edgeable';
    return () => { document.title = prev; };
  }, []);

  // Scroll entrances (once-only fade + 20px rise, 80ms card stagger). The
  // hidden state only exists after .reveal-ready lands on the wrapper, so
  // without JS or IntersectionObserver nothing ever hides; anything already
  // in the viewport when it registers is shown instantly. Re-runs as data
  // sections finish loading so late-added cards get observed too.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!('IntersectionObserver' in window)) return undefined;

    root.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
      group.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.style.setProperty('--reveal-delay', `${i * 80}ms`);
      });
    });
    const els = Array.from(root.querySelectorAll('[data-reveal]')).filter((el) => !el.dataset.revealBound);
    els.forEach((el) => { el.dataset.revealBound = '1'; });
    // above the fold never waits
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
    root.classList.add('reveal-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in'); // once only: never re-triggers on scroll-up
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
    // Failsafe: if the observer misbehaves in some browser, nothing may stay
    // invisible. One sweep marks any still-hidden element as revealed.
    const failsafe = window.setTimeout(() => {
      root.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => el.classList.add('in'));
    }, 1200);
    return () => { window.clearTimeout(failsafe); io.disconnect(); };
  }, [record.loading, pnl.loading, picks.loading]);

  // Smooth-scroll section navigation (the two hero windows). Obeys
  // prefers-reduced-motion: instant jump.
  const scrollToSection = (e, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  // ── derived hero data ────────────────────────────────────────────────────
  const statsError = record.error || pnl.error;
  const statsLoading = record.loading || pnl.loading;
  const wlp = record.data ? `${record.data.wins}-${record.data.losses}-${record.data.pushes}` : '0-0-0';
  const pendingCount = record.data?.pending ?? 0;
  const netUnits = pnl.data?.netUnits ?? 0;
  const totalStaked = pnl.data?.totalStaked ?? 0;
  const roi = totalStaked > 0 ? netUnits / totalStaked : null;
  const roiText = roi == null ? null : `${roi >= 0 ? '+' : ''}${(roi * 100).toFixed(1)}%`;
  const series = pnl.data?.series ?? [];

  // Hero teaser curve from the real all-time series (viewBox 420x130).
  const teaser = useMemo(() => {
    if (series.length < 2) return null;
    const vals = series.map((p) => p.cum);
    const { x, y, zeroY } = scaleSeries(vals, 420, 8, 124);
    const pts = vals.map((v, i) => [x(i), y(v)]);
    const d = smoothPath(pts, 8, 124);
    return { d, area: `${d}L420 ${zeroY.toFixed(1)}L0 ${zeroY.toFixed(1)}Z`, zeroY };
  }, [series]);

  const gradedFreePicks = picks.data;
  const picksGridClass =
    gradedFreePicks.length === 2 ? 'picks-grid two' : gradedFreePicks.length === 1 ? 'picks-grid one' : 'picks-grid';

  return (
    <div className="dusk-theme" ref={rootRef}>
      {/* Warm gold-hour gradient backs Section 0 + Section 1 only. */}
      <div className="dusk">
        <div className="container">

          {/* 0. Site header */}
          <header className="site">
            <Link className="wordmark" to="/" aria-label="Edgeable home">
              <img className="wm-light" src="/edgeable-wordmark-ink.svg" alt="Edgeable" />
              <img className="wm-dark" src="/edgeable-wordmark.svg" alt="Edgeable" />
            </Link>
            <Link className="login-link" to="/login">Log in</Link>
          </header>

          {/* 1. Record hero */}
          <section className="hero" aria-label="Record">
            <div className="hero-grid">
              <div>
                <h1>Do not trust me. Check the record.</h1>
                <p className="subhead">
                  If you have been burned by fake slips and deleted losses, good: you are exactly who
                  this service is for. Edgeable is a picks service built on real data, and every pick
                  goes on the record before the game starts and stays there, wins and losses alike.
                  Have a look around before you decide anything.
                </p>

                <p className="eyebrow pending-eyebrow">
                  <span className="live-dot" aria-hidden="true" />
                  <span>
                    Live record.{' '}
                    {pendingCount > 0 && (
                      <span className="pending-count">
                        {pendingCount} pick{pendingCount === 1 ? '' : 's'} pending.
                      </span>
                    )}
                  </span>
                </p>

                {statsError ? (
                  <p className="hero-fallback">
                    Record temporarily unavailable.{' '}
                    <Link to="/card">View the full archive.</Link>
                  </p>
                ) : statsLoading ? (
                  <div className="stat-row" aria-hidden="true">
                    <div className="stat"><div className="skel skel-stat" /><div className="label eyebrow">W-L-P</div></div>
                    <div className="stat"><div className="skel skel-stat small" /><div className="label eyebrow">Net Units</div></div>
                    <div className="stat"><div className="skel skel-stat small" /><div className="label eyebrow">ROI</div></div>
                  </div>
                ) : (
                  <div className="stat-row">
                    <div className="stat">
                      <div className="num mono">{wlp}</div>
                      <div className="label eyebrow">W-L-P</div>
                    </div>
                    <div className="stat">
                      <div className={netUnits < 0 ? 'num units mono neg' : 'num units mono'}>{fmtUnits(netUnits)}</div>
                      <div className="label eyebrow">Net Units</div>
                    </div>
                    {roiText != null && (
                      <div className="stat">
                        <div className={roi < 0 ? 'num roi mono neg' : 'num roi mono'}>{roiText}</div>
                        <div className="label eyebrow">ROI</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="hero-right">
                {/* Chart teaser in a browser device frame. Clickable: scrolls
                    to the full performance section. */}
                <a
                  className="frame frame-nav"
                  href="#performance"
                  onClick={(e) => scrollToSection(e, 'performance')}
                  aria-label={`Preview of the record: net units curve ending at ${fmtUnits(netUnits)}. Jump to the full performance chart.`}
                >
                  <div className="frame-chrome" aria-hidden="true">
                    <span className="frame-dots"><span /><span /><span /></span>
                    <span className="frame-addr">edgeabled.web.app/card</span>
                  </div>
                  <div className="teaser-body" aria-hidden="true">
                    <div className="teaser-top">
                      {pnl.loading ? (
                        <span className="skel skel-line" style={{ height: '1.5625rem', width: '130px' }} />
                      ) : (
                        <span className={netUnits < 0 ? 'teaser-val neg' : 'teaser-val'}>{fmtUnits(netUnits)} units</span>
                      )}
                      <span className="teaser-when">All time</span>
                    </div>
                    <div className="teaser-chart">
                      <svg viewBox="0 0 420 130">
                        <defs>
                          <linearGradient id="gold-fill-teaser" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" className="fill-stop-top" />
                            <stop offset="1" className="fill-stop-bot" />
                          </linearGradient>
                        </defs>
                        {teaser ? (
                          <>
                            <path className="area-fill" d={teaser.area} />
                            <line className="zero-baseline" x1="0" y1={teaser.zeroY.toFixed(1)} x2="420" y2={teaser.zeroY.toFixed(1)} strokeWidth="1" />
                            <path className="curve" pathLength="1" fill="none" strokeWidth="2" strokeLinecap="round" d={teaser.d} />
                          </>
                        ) : (
                          <line className="zero-baseline" x1="0" y1="124" x2="420" y2="124" strokeWidth="1" />
                        )}
                      </svg>
                    </div>
                    <span className="nav-hint">See performance <DownArrow /></span>
                  </div>
                  <span className="nav-overlay" aria-hidden="true">See performance <DownArrow /></span>
                </a>

                {/* Tamper-evidence callout: card scrim on the gradient.
                    Stretched link scrolls to the How it works section. */}
                <aside className="tamper">
                  <h2 className="eyebrow">
                    <a className="tamper-nav" href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>
                      How it all works
                    </a>
                  </h2>
                  <p>Daily plays, exact units, real odds. All on the record before kickoff. See the whole loop.</p>
                  <span className="nav-hint" aria-hidden="true">See how it works <DownArrow /></span>
                  <span className="nav-overlay" aria-hidden="true">See how it works <DownArrow /></span>
                </aside>
              </div>
            </div>
          </section>

        </div>
      </div>

      <main className="container">

        {/* 2. Units performance chart */}
        <section className="section" id="performance" aria-label="Performance">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Performance</p>
            <p className="sub">Net units over time. Dips included.</p>
          </div>

          {pnl.loading ? (
            <div className="frame chart-frame" aria-hidden="true">
              <div className="frame-chrome">
                <span className="frame-dots"><span /><span /><span /></span>
                <span className="frame-addr">edgeabled.web.app/card</span>
              </div>
              <div className="chart-body">
                <div className="chart-top">
                  <div className="skel skel-line" />
                  <div className="range-tabs">
                    <span className="skel skel-tab" /><span className="skel skel-tab" />
                    <span className="skel skel-tab" /><span className="skel skel-tab" />
                  </div>
                </div>
                <div className="skel skel-chart" />
              </div>
            </div>
          ) : pnl.error ? (
            <div className="frame chart-frame">
              <div className="chart-body">
                <div className="chart-empty">
                  <p>
                    Chart temporarily unavailable.{' '}
                    <Link to="/card">View the full record on /card.</Link>
                  </p>
                </div>
              </div>
            </div>
          ) : series.length < 2 ? (
            <div className="frame chart-frame">
              <div className="chart-body">
                <div className="chart-empty"><p>No data for this range</p></div>
              </div>
            </div>
          ) : (
            <LandingChart series={series} />
          )}
        </section>

        {/* 3. Free-pick samples — hidden entirely when there are none */}
        {(picks.loading || gradedFreePicks.length > 0) && (
          <section className="section" aria-label="Free picks">
            <div className="section-head" data-reveal>
              <p className="eyebrow">Free picks</p>
              <p className="sub measure">
                From time to time a pick goes out free to everyone. Here are the most recent ones:
                posted before tip-off, graded after.
              </p>
            </div>

            {picks.loading ? (
              <div className="picks-grid two" aria-hidden="true">
                <div className="skel skel-card" />
                <div className="skel skel-card" />
              </div>
            ) : (
              <div className={picksGridClass} data-reveal-stagger>
                {gradedFreePicks.map((p) => (
                  <article className="soft-card pick-card" data-reveal key={p.id}>
                    <div className="pick-head">
                      <span className="pick-badge">Free pick</span>
                      <span className="sport-chip">{p.sport}</span>
                    </div>
                    <p className="pick-desc">{p.description}</p>
                    <div className="pick-chips" aria-label="Odds and stake">
                      <span className="chip">{formatOdds(p.odds)}</span>
                      <span className="chip">{Math.round((Number(p.stakeUnits) || 0) * 100) / 100}u</span>
                    </div>
                    <div className="pick-times">
                      <span className="posted">Posted {formatPostedAt(p.postedAt)} ET</span>
                      <span>Game: {formatPostedAt(p.gameStartTime, { withDate: true })} ET</span>
                    </div>
                    <PickResult pick={p} />
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 4. How joining works */}
        <section className="section" id="how-it-works" aria-label="How it works">
          <div className="section-head" data-reveal>
            <h2>How it works</h2>
            <p className="sub">From joining to your first card, this is the whole loop.</p>
          </div>

          <div className="steps" data-reveal-stagger>
            <article className="soft-card step" data-reveal>
              <div className="step-top">
                <span className="step-num" aria-hidden="true">1</span>
                <span className="step-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="8" r="3.5" />
                    <path d="M3.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
                    <path d="M19 7v6M16 10h6" />
                  </svg>
                </span>
              </div>
              <h3>Join in minutes</h3>
              <p>
                Create a free account, then send $30 by CashApp or Zelle with your payment screenshot.
                Every member is personally reviewed and approved the same day. No checkout, no auto-billing.
              </p>
              <Link to="/signup">Go to signup</Link>
            </article>
            <article className="soft-card step" data-reveal>
              <div className="step-top">
                <span className="step-num" aria-hidden="true">2</span>
                <span className="step-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="2.5" />
                    <path d="M8 8h8M8 12h8M8 16h4" />
                  </svg>
                </span>
              </div>
              <h3>Get the card every day</h3>
              <p>
                Data-driven plays land daily, each with the exact units to stake and the odds behind it.
                Nothing vague: you always know what the play is, how much, and at what number.
              </p>
            </article>
            <article className="soft-card step" data-reveal>
              <div className="step-top">
                <span className="step-num" aria-hidden="true">3</span>
                <span className="step-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12.5l2.8 2.8L16.5 9" />
                  </svg>
                </span>
              </div>
              <h3>Everything stays on the record</h3>
              <p>
                Each play is posted publicly before game time and graded when it settles. Wins and losses
                stay up forever, nothing is edited or deleted. That is the record you scrolled through above.
              </p>
            </article>
          </div>

          <p className="steps-note measure" data-reveal>
            The manual process is intentional. No automated billing, no surprise charges. $30/month,
            and you choose when to renew.
          </p>
        </section>

        {/* 5. Price + CTA */}
        <section className="section" id="join-cta" aria-label="Membership">
          <div className="join-grid" data-reveal-stagger>

            <PhoneDemo series={series} />

            <div className="price-panel" data-reveal>
              <p className="eyebrow">Edgeable membership</p>
              <div className="price-line">
                <span className="amount">$30</span>
                <span className="per">/month</span>
              </div>
              <ul className="feature-list">
                <li><Check />Every pick.</li>
                <li><Check />Full record.</li>
                <li><Check />Live performance chart.</li>
                <li><Check />Live updates and insights.</li>
              </ul>
              <Link className="cta-btn" to="/signup">Join Edgeable</Link>
              <p className="cta-reassure">
                Payment is manual: CashApp or Zelle, $30, attach your screenshot. Every membership is
                personally approved. No bots.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 6. Legal footer */}
      <footer className="legal">
        <div className="container" data-reveal>
          <div className="footer-wordmark wordmark" aria-hidden="true">
            <img className="wm-light" src="/edgeable-wordmark-ink.svg" alt="" />
            <img className="wm-dark" src="/edgeable-wordmark.svg" alt="" />
          </div>
          <div className="blocks">
            <p>You must be 21 or older to subscribe. By joining, you confirm you meet the legal gambling age in your jurisdiction.</p>
            <p>Edgeable sells picks as opinions and analysis. We are not a sportsbook, broker, or financial advisor. Nothing here constitutes financial advice or a guaranteed investment.</p>
            <p>Past performance does not guarantee future results. Prediction markets involve substantial risk of financial loss.</p>
          </div>
          <nav className="footer-links" aria-label="Legal">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
          <p className="copyright">Edgeable {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
