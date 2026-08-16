# JOURNEY.md

<!-- The structural and temporal design spec. Pairs with DESIGN.md (visual tokens). -->
<!-- For visual tokens, see DESIGN.md (created in Phase 2). -->

---

## Job

**Job story:** When I keep seeing picks sellers claim insane records with no receipts, I want to see a verifiable record I can check myself, understand what it costs, and join without friction — so I can stop guessing whether a service is legitimate and actually get an edge.

**Functional job:** Evaluate a picks service on verifiable proof, then sign up if it checks out.

**Emotional job:** Feel confident I'm not being scammed — that the record is real and the price is fair.

**Social job:** Not be the person who paid for fake picks. Make a smart, evidence-based decision.

**Switch interview (Moesta four forces):**
- **Push:** Every other picks service shows screenshots that are easy to fake. The category is a scam-heavy space; past experience or secondhand stories produce deep distrust of record claims.
- **Pull:** Edgeable's tamper-evident record — picks timestamped before game start, grading one-way, no deletes, publicly verifiable — is a structural differentiator. The performance chart makes the trend visible, not just the aggregate.
- **Anxiety:** Manual payment (CashApp/Zelle) feels sketchy without context. No instant approval. What if I send $30 and nothing happens? Is this a real person?
- **Habit:** Ignoring picks services entirely, or relying on free social-media cappers with no accountability.

**JTBD school used:** Moesta (Switch interview — four forces).

---

## Journey

**Actor:** Skeptical stranger — sports bettor, 21+, primarily on mobile. Arrived from a shared link (bio, referral, DM) or from the /card public record. Has seen picks sellers before; default assumption is scam until proven otherwise.

**Scenario:** Evaluating Edgeable as a picks subscription, from first link-tap to decision.

**Scope:** Current-state, single-actor (stranger → subscriber). Covers awareness through post-CTA wait state. Excludes ongoing subscriber experience.

**Decision model:** Google Messy Middle (2020). The visitor oscillates between explore (record, chart, free picks) and evaluate (price, manual process, legal) before the moment of purchase. The page must feed both loops — proof sections feed explore, process/price sections reduce evaluate anxiety. The loyalty loop (McKinsey 2009) applies post-purchase but is out of scope for this phase.

| Phase | Actions | Mindset | Emotion | Touchpoints | Opportunities |
|-------|---------|---------|---------|-------------|---------------|
| **Trigger** | Sees a shared link, referral, or /card mention | "Is this legit?" — high skepticism baseline | Low | Bio link, share, DM, /card cross-link | First impression: link preview / OG image sets tone before click |
| **Arrive on /join** | Scans hero headline and record stats | "Show me the numbers" — evaluating proof | Low → Med | /join hero section | Record stats visible above fold on mobile — no scroll required for the core proof |
| **Explore proof** | Reads W-L-P, net units, ROI; reads tamper-evidence note; taps /card link to verify archive | "Is the record real? Can I verify it?" | Med | Record hero, tamper-evidence callout, /card link | Tamper-evidence note must explain WHY the record is trustworthy, not just assert it |
| **Explore chart** | Scrubs the units equity curve; selects a range tab | "What does the trend look like? Did it dip?" | Med | Performance chart, range tabs | Chart must show dips honestly — hiding a dip would be visible as manipulation |
| **Explore free picks** | Reads free-pick samples; checks timestamps vs. results | "Are these real? Were they posted before the game?" | Med → High | Free-pick cards with timestamps | Timestamps on free picks extend the tamper-evidence story to individual examples |
| **Evaluate process** | Reads 3-step join section; understands manual payment | "This is manual — is that a red flag?" | Med → neutral | How-joining-works section | Framing as personal/concierge (not janky) is the critical reframe |
| **Evaluate price** | Sees $30/month; reads disclosure | "$30 — is that worth it?" | Med | Price + CTA section | Full process disclosure pre-CTA reduces post-click surprise |
| **CTA moment** | Taps "Join Edgeable" | "OK, I'm doing this" | High | CTA button | Reassurance microcopy adjacent to CTA (manual process acknowledged, not hidden) |
| **Post-CTA: signup** | Creates account at /signup | "Hope this works" | Med | /signup page | Clear progress indication; referral code pre-filled if applicable |
| **Post-CTA: payment** | Sends $30 via CashApp/Zelle; submits proof screenshot | "I've committed — how long?" | Low → anxious | In-app payment instructions, proof upload | Explicit wait-time expectation set; no ambiguity about what happens next |
| **Post-CTA: wait** | Waits for approval | "Did they get it?" | Anxious | Email / notification | Approval same-day expectation stated on /join pre-CTA and confirmed post-submission |
| **Approved** | Receives approval; logs in; accesses subscriber dashboard | "I'm in" | High | Email notification, /dashboard | Strong onboarding moment — first subscriber view should reinforce the quality signal |

**Emotion curve:** Valley at Trigger (deep skepticism). Rising through proof exploration as evidence accumulates. Flat or neutral during process evaluation (manual payment is a friction point, not a peak). Sharp rise at CTA moment. Drop at payment/wait state (anxiety spike). Recovery peak at approval. The page's job is to keep the rising proof curve steep enough to carry through the process-evaluation plateau.

**Research basis:** UNGROUNDED — hypothetical journey based on confirmed research doc (2026-08-14) and Sean's direct input. No interview sessions or diary studies conducted. Treat as a design hypothesis to validate with real subscriber onboarding feedback.

---

## IA

**Organization scheme:** Audience-based (task-based within the public-facing layer). Public routes serve visitors and subscribers differently; admin routes are entirely separate.

**Structure type:** Hub-and-spoke for authenticated users (/dashboard as hub); sequential for unauthenticated conversion (/join → /signup → payment → approval).

**Sitemap:**
```
/ (root — Login / entry point)
├── /join          [PUBLIC — sales/conversion page; NEW this plan]
├── /card          [PUBLIC — tamper-evident pick archive]
├── /signup        [PUBLIC — account creation]
├── /terms         [PUBLIC — Terms & Disclaimers]
├── /privacy       [PUBLIC — Privacy Policy]
├── /guide         [AUTH — How to tail my picks; active + inactive]
└── /dashboard     [AUTH — Subscriber hub]
    ├── Performance card (Yours / Edgeable scope)
    ├── Subscription status
    ├── Referral card
    └── Account / settings
/admin/*           [ADMIN — subscriber management, card manager]
```

**IA note — where /join sits:** /join is a new public route, parallel to /card and /terms. It is the primary marketing entry point — the URL Sean shares externally. It has no parent page in the navigation; it is the top of the conversion funnel. After /join, the sequential path is /signup → in-app payment flow → /dashboard.

**Global navigation labels:** /join has a minimal header (Edgeable wordmark + "Log in" link). No global nav bar — /join is a standalone marketing page, not embedded in the app shell. This is intentional: navigation options compete with the CTA (Hick's law — Hick–Hyman 1952: fewer options → faster decision). The "Log in" link serves authenticated users who arrive on /join by mistake.

**Navigation model:** Contextual only on /join. Internal links: tamper-evidence → /card; footer → /terms, /privacy, /card. No global nav. Post-CTA sequential navigation: /join → /signup → dashboard.

**Validation:** NOT VALIDATED by card sort or tree test. Single new route on a small site; full IA validation is disproportionate. Recommend informal tree test if /join is ever embedded in a broader navigation system.

---

## Flows

### Join flow (primary conversion task flow)

**Type:** User flow (branching — captures the signed-in edge case and error states).

**Entry:** /join page — CTA button tap (or hero anchor link tap).

**Goal:** Stranger becomes an active Edgeable subscriber.

**Steps:**

```
● [Entry: /join CTA tapped]
    │
    ▽ Is user already signed in?
   ◇ Signed in? ──YES──► [Banner: "Already signed in — Go to dashboard →"] ──► ◎ /dashboard
    │ NO
    ▽
[/signup — create account]
    │
    ▽ Signup succeeds?
   ◇ ──FAIL──► [Error state: see Signup error states below] ──► loop back
    │ SUCCESS
    ▽
[In-app: payment instructions screen]
    │  CashApp / Zelle info displayed (from config/paymentInfo)
    │  User sends $30 + proof screenshot
    │
    ▽ Proof submitted?
   ◇ ──FAIL (upload error)──► [Retry prompt: "Upload failed — try again"] ──► retry
    │ SUCCESS
    ▽
[Wait state: pending approval]
    │  "Your request is being reviewed — you'll hear from us same day."
    │  No auto-redirect; user can safely close the app
    │
    ▽ Admin approves
[Approval notification — email]
    │
    ▽
◎ [/dashboard — full subscriber access unlocked]
```

**Error states:**
- Signup email already in use → "An account with this email exists — [Log in]" with login link.
- Signup network failure → "Something went wrong. Try again." Retry button.
- Payment proof upload failure → "Upload failed — try again." No data lost; instructions remain visible.
- Admin does not approve (fraud/duplicate/bad proof) → Out of scope for page spec; admin handles offline.

**Success state:** User reaches /dashboard with active subscription status.

**Session-expiry edge case:** If the user creates an account but closes the app before submitting proof, their account exists (inactive). When they return and log in, the in-app payment instructions should be accessible from the account/settings area. This is an engineering consideration; the spec notes it as a gap to address at build time.

---

### /card cross-link flow (secondary path to /join)

**Type:** Task flow (linear).

**Entry:** /card public record page.

**Goal:** /card visitor who decides they want to subscribe reaches /join.

**Steps:**
1. Visitor on /card — reading record or archive.
2. Sees text link below the record header: "Join for $30/mo →"
3. Taps → lands on /join.
4. Continues the primary join flow above.

**Note:** This flow is intentionally thin. /card's job is proof, not sales. The cross-link is present but restrained.

---

## Page specs

### /join

**Purpose:** Convert a skeptical stranger into a $30/month subscriber by leading with the verifiable pick record and making the manual join process legible before the CTA.

**Entry points:**
- External bio link / share link (primary entry — cold traffic)
- /card cross-link CTA (warmer traffic — already seen the archive)
- Direct URL (referral, DM)
- Search result (future; currently not SEO-optimized)

**Awareness stage (Schwartz ladder):** Problem-aware. Visitors know sports picks services exist and distrust them. The page leads with proof, not with problem recognition.

**Content blocks (in order — mobile-first stack; desktop variations noted):**

**0. Site header**
- Content: Edgeable wordmark (links to /); "Log in" text link (right-aligned).
- Mobile: full-width, sticky or static (Phase 2 decision).
- Desktop: same layout, wider container.
- Signed-in state: "Go to dashboard" replaces "Log in".

**1. Record hero**
- Content slots:
  - Headline: "Do not trust me. Check the record." (Sean-selected 2026-08-15, "invitation to verify" direction)
  - Subhead (Sean-selected 2026-08-16, warm/human + real-data note): "If you have been burned by fake slips and deleted losses, good: you are exactly who this service is for. Edgeable is a picks service built on real data, and every pick goes on the record before the game starts and stays there, wins and losses alike. Have a look around before you decide anything."
  - Stat row: W-L-P record | Net units | ROI — live data from `picks`/`picksPublic` via the same computation as /card (`computeRecord` in `src/utils/picks.js`). Labels below each number. Pending picks excluded; voids excluded from ROI denominator per existing /card rules.
    - Label copy: "W-L-P" | "Net Units" | "ROI"
    - Pending indicator (if any pending picks exist): small eyebrow above stat row in `--muted-foreground`: "Live record. [N] pick[s] pending."
  - Tamper-evidence callout: bordered/inset block using `--surface-2` background and `--hairline` border.
    - Heading (eyebrow style): "How it all works" (renamed 2026-08-16; was "HOW THE RECORD WORKS")
    - Navigation behavior (added 2026-08-16, Sean's order): the two hero side windows are section navigation. The whole tamper-evidence panel is a stretched link that smooth-scrolls to the How it works section (#how-it-works); the browser-framed chart teaser is a link that smooth-scrolls to the performance section (#performance). The /card "verify" link inside the panel stays independently clickable. Smooth scroll obeys prefers-reduced-motion (instant jump).
    - Body (Sean-selected 2026-08-16, "tease the loop" direction; the panel is an attention grab, the full mechanics live in the How it works section it links to): "Daily plays, exact units, real odds. All on the record before kickoff. See the whole loop."
    - ~~Inline link: "Verify the archive yourself" → /card~~ (Removed 2026-08-16, Sean's call. NOTE: /join now has NO link to /card; the archive is reachable only via the app/site nav. The panel is purely a nav card to #how-it-works.)
  - ~~Hero anchor CTA: "Join for $30/mo. See how it works." → #join-cta~~ (Removed 2026-08-16, Sean's call: no price in the hero; the visitor should be intrigued to scroll for it. NOTE: this consciously reverses the wireframe review's hero-CTA finding; price first appears in the How it works step 1 and the membership panel. The hero side windows remain the hero's navigation affordances.)
- States:
  - Default: live stats rendered.
  - Loading: skeleton placeholders for stat numbers (3 boxes, no copy change needed — stat labels remain visible).
  - Error / data unavailable: Replace stat row with: "Record temporarily unavailable. View the full archive." linking to /card. Tamper-evidence callout and hero anchor CTA remain visible and functional. No broken UI.
  - Record negative / short-history: stat row shows real numbers honestly, including a negative net units figure. No hiding state. A negative ROI renders as e.g. "−4.2%" in `--loss` color with the letter "ROI" label — color + value, not color alone.
  - Zero graded picks in selected range: stat row shows "0-0-0 | 0.0 Units | 0.0% ROI" — honest zero state. Tamper-evidence callout remains. Hero anchor CTA remains.
- Mobile: single-column stack. Stat row: 3 equal-width tiles, full-width. Desktop: hero can use a two-column grid (record left, tamper callout right).

**2. Units performance chart**

- Content slots:
  - Section heading (eyebrow): "PERFORMANCE"
  - Section subhead: "Net units over time. Dips included."
  - Headline stat above chart: large Spline Sans Mono display number showing cumulative net units at the scrub point. Updates on pointer/touch scrub. At rest (no scrub): shows the cumulative net units for the selected range.
    - Format: "+12.4 units" or "−3.1 units" — sign always shown, `--win` for positive, `--loss` for negative, `--foreground` for zero.
    - Date label below the headline stat: shows the date of the scrub point in "Aug 14, 2026" format (ET, pinned timezone). At rest: shows the range label ("All time" / "Last 30 days" etc.).
  - Scrubable equity curve chart — monotone-cubic smoothed line. Interaction baseline: `PerformanceChart.jsx` pattern.
  - Range tab controls: `role="tablist"` with 4 `<button role="tab">` elements. Labels: "1W" | "1M" | "3M" | "All". Default selected: "All". Keyboard: arrow keys navigate (roving tabindex). Touch target: 44px min-height. Active tab: `--gold` fill + `--gold-ink` text, 1px `--ring` border in light theme (per DESIGN.md hard rule 3).

- **Chart specification (engineering sign-off required on public fields):**

  **Data source:** `dailyPnL/{YYYY-MM-DD}` Firestore collection.

  **Required public fields (currently signed-in only — needs world-readable rule change):**
  - `units` (Number, 2 decimal — net units for that calendar day). REQUIRED for the chart y-axis.
  - `wins` (Number, integer — daily win count). Secondary: used to build a cumulative W-L overlay or tooltip.
  - `losses` (Number, integer). Secondary.
  - `pushes` (Number, integer). Secondary.
  - `notes` field: NOT required public; stays signed-in only.

  **Engineering action required:** Update Firestore security rules to allow `get` and `list` on `dailyPnL` for unauthenticated users (`allow read: if true` or a scoped rule for the collection). Sean to sign off on the field exposure above before the rule ships.

  **Granularity:** Daily. One document per calendar day. The chart x-axis maps one data point per day with a `dailyPnL` entry; days with no entry are gaps (no interpolation).

  **Chart x-axis:** Date (daily). Labels at range-appropriate intervals (e.g. month-name ticks for 3M+, week-day ticks for 1W). Pinned to ET calendar dates (matching `dailyPnL` document key format `YYYY-MM-DD`).

  **Chart y-axis:** Cumulative net units. Y-axis must include 0 — the zero baseline is always visible. The axis is never truncated to the data range. (Cairo, *How Charts Lie*, 2019: truncating a deviation chart's axis makes a small deviation look large, and a dip below zero look like a flat floor.) A single horizontal hairline at y=0 using `--hairline` color marks the zero baseline. No other horizontal gridlines.

  **Computation rule (cumulative units):** Each chart data point is the running sum of `units` values from the earliest available `dailyPnL` document through that day's document, within the selected range. This matches the spirit of `computeRecord` in `picks.js` (net cumulative, not daily-only view). For the "All" range, the running total starts from the first document in the collection.

  **Pending exclusion:** `dailyPnL` documents are only written after picks are graded (the existing admin P&L entry flow). Pending picks do not appear in `dailyPnL` and thus do not appear on the chart. This is structurally enforced, not a display-layer filter.

  **ROI and W-L header (above chart):**
  - The record header above the chart (stat row in Section 1) is the canonical W-L + ROI surface. The chart section does not duplicate the full stat row.
  - The chart headline stat shows net units at the scrub point, not ROI. ROI is a ratio requiring total staked units, which is available from `picks` (subscriber data) not from `dailyPnL` alone. The chart headline stat is net units only, labeled clearly: "+12.4 units."
  - If the engineering decision later exposes `unitsStaked` as a public field in `dailyPnL` (or a separate public aggregate doc), a cumulative ROI line may be added as a chart overlay — deferred to implementation.

  **Colorblind safety:** The units equity line uses `--gold` (`#dbb155` dark / `--primary` fill) — a warm yellow. The zero baseline hairline uses `--hairline` (neutral). These are two channels: position (primary) and color (secondary). The data is not color-encoded alone — position on the y-axis carries the value. No additional redundancy encoding required for a single-series line chart.

- States:
  - Default: chart rendered for "All" range, running cumulative from first document.
  - Loading: placeholder box (full width, ~200px height) with skeleton pulse animation. Range tabs render in skeleton state.
  - Sparse data (<7 data points in selected range): render the available points as a line (do not extrapolate, do not draw a line between non-adjacent points). Show note below chart in `--muted-foreground`: "Not enough history for this range. Showing all available data." The "All" tab is auto-selected silently when a range tab has <1 data point.
  - Negative net units period: shown as a dip below the zero baseline on the curve, using the same `--gold` line color. No truncation, no axis manipulation, no hiding. The zero-baseline hairline makes the dip visually clear. The headline stat above the chart shows the negative value in `--loss` color when scrubbed into a negative period.
  - Range with zero data points: "No data for this range" — chart area is empty with this note in `--muted-foreground`. The zero-baseline hairline remains visible. Tab remains selectable (do not disable it — disabling implies the data doesn't exist, which may just be a short history).
  - Data fetch error: "Chart temporarily unavailable. View the full record on /card." Note in `--muted-foreground`; inline link to /card.

- Mobile: chart full container-width. Range tabs full-width, equal-distribution, 44px min-height. Scrub via touch events (same touch handler as `PerformanceChart.jsx`).
- Desktop: chart widens with container (max ~640px centered or full column width in two-column grid if used).

**3. Free-pick samples**
- Content slots:
  - Section heading (eyebrow): "FREE PICKS"
  - Section subhead: "From time to time a pick goes out free to everyone. Here are the most recent ones: posted before tip-off, graded after."
  - ~~Framing note (why subscriber picks are private)~~ (Removed 2026-08-16, Sean's call: the section just notes free picks exist. NOTE: the why-picks-are-hidden rationale now appears nowhere on /join; it lives only in the Terms/Guide if needed.)
  - 2–3 free-pick cards. Each card contains:
    - Badge (top-left): "Free pick" in `--accent` tint with `--accent-foreground` text (eyebrow weight).
    - Pick description: from `picks` where `access = 'public'` (the full description, sport, odds visible here because public picks are intentionally shared).
    - Posted timestamp (prominent, Spline Sans Mono): "Posted [time] ET" (before game start, server clock). This is the verifiable proof element.
    - Game start timestamp: "Game: [datetime] ET" (so the visitor can confirm the pick was posted first).
    - Result badge (updated 2026-08-16, Sean's order): W / L / P glyph + the units outcome in mono, e.g. "W +0.8u" / "L -0.5u". Units computed honestly from odds and stake (win profit = stake × 100/|odds| for negative odds, stake × odds/100 for positive; loss = -stake). Color via `--win`/`--loss`/`--muted-foreground`; losses displayed, not filtered; color + glyph per DESIGN.md rule.
  - ~~Link below cards: "See the complete record" → /card~~ (Removed 2026-08-16, Sean's call: the performance chart carries the full record; the tamper panel's "Verify the archive yourself" /card link remains the archive path.)
- States:
  - Default: 2–3 most recent graded public picks. Ordered by `postedAt` descending (most recent first).
  - No public picks yet: section is hidden entirely. No empty-state shown — a promise with nothing behind it would undermine the proof-forward pitch. Engineering: conditional render when `picks where access='public' AND status != 'pending'` count > 0.
  - 1 public pick available: show 1 card. Section heading and framing note remain.
  - Loading: skeleton pick cards (same height as a card, 2 skeletons). Section heading renders immediately (static text).
  - Pending public pick (posted but not yet graded): show the card but replace result badge with "Pending" in `--muted-foreground`. Do not hide the card — a pending public pick proves the pre-game timestamp claim in real time.
- Mobile: single-column stack of pick cards.
- Desktop: 3-column picks grid (or 2-column if only 2 picks available); 1-column if only 1 pick.

**4. How joining works**
- Content slots:
  - Section heading: "How it works"
  - Section subhead: "From joining to your first card, this is the whole loop." (Reworked 2026-08-16, Sean's order: the section now conveys the full service loop — daily data-driven plays with exact units + odds, posted pre-game, never deleted — while keeping the manual-payment disclosure inside step 1.)
  - Step 1:
    - Number indicator: "1" (44px circle, `--secondary` background, `--secondary-foreground` text)
    - Heading: "Join in minutes"
    - Body: "Create a free account, then send $30 by CashApp or Zelle with your payment screenshot. Every member is personally reviewed and approved the same day. No checkout, no auto-billing."
    - [Inline link text:] "Go to signup" → /signup (secondary link style, not a button — the primary CTA is in Section 5)
  - Step 2:
    - Number indicator: "2"
    - Heading: "Get the card every day"
    - Body: "Data-driven plays land daily, each with the exact units to stake and the odds behind it. Nothing vague: you always know what the play is, how much, and at what number."
  - Step 3:
    - Number indicator: "3"
    - Heading: "Everything stays on the record"
    - Body: "Each play is posted publicly before game time and graded when it settles. Wins and losses stay up forever, nothing is edited or deleted. That is the record you scrolled through above."
  - Reassurance note below steps (in `--muted-foreground`, smaller body size): "The manual process is intentional. No automated billing, no surprise charges. $30/month, and you choose when to renew."
- States:
  - Default: 3 steps rendered. (Static content — no data fetch.)
  - (No loading or error states for this section.)
- Mobile: single-column stack, steps 1-2-3 vertically with clear visual separation.
- Desktop: 3-column horizontal layout, steps side-by-side.

**5. Price + CTA** `id="join-cta"`

This section uses the `--gold` full-bleed band (DESIGN.md "CTA gold band" expressive moment). All text uses `--gold-ink`. No muted or secondary text on the gold band per DESIGN.md hard rule 2.

- Content slots:
  - Eyebrow (above price, `--gold-ink` muted-weight): "EDGEABLE MEMBERSHIP"
  - Price: "$30" in Spline Sans Mono display size + "/month" in Archivo body-size secondary. Single tier.
  - Value description: "Every pick. Full record. Live performance chart. Live updates and insights." (2026-08-16, Sean's call: "You cancel when you want" removed, replaced by live updates and insights.)
  - App-preview phone demo (updated 2026-08-16, Sean's order): the Edgeable/Yours scope control is INTERACTIVE. Edgeable = full record (+18.4u all time); Yours = the same record counted only from the join date (demo: +6.2u since Jun 20), with identical recent-day rows (same picks, same grades). Blurb below the phone: "Yours is the same record, counted from the day you join. Early on your curve looks smaller. Stay, and the two charts grow together: the longer you ride the record, the more of its long-run growth ends up yours." (Convergence framed as record participation, not a profit guarantee, per the deceptive-patterns posture; the footer's past-performance disclaimer still applies.)
  - **Primary CTA button:** `--gold-ink` text on a dark `--foreground`-family fill (inverted within the gold band), or a `--card`-surface button within the gold band — exact treatment is DESIGN.md/implementation call; the constraint is: all text on the gold band uses `--gold-ink`, so the button must invert to provide readable contrast on the button face.
    - Copy: "Join Edgeable"
    - Min height: 48px. Full-width on mobile; centered max-width (~400px) on desktop.
    - Navigates to: /signup
  - Reassurance microcopy (below CTA button, `--gold-ink`, smaller body size): "Payment is manual: CashApp or Zelle, $30, attach your screenshot. Every membership is personally approved. No bots."
  - Signed-in state: CTA button replaced with text link: "You're already a member. Go to your dashboard." → /dashboard. Gold band remains.

- States:
  - Default: price + CTA visible. Gold band rendered.
  - Signed-in: CTA button replaced, reassurance copy replaced with "You're already signed in."
  - (No data-fetch states — price is static copy.)

- Mobile: price and CTA centered, full-width button, vertical stack within the gold band.
- Desktop: content centered with max-width (~480px) within the wider column of the gold band.

**CTAs on /join — count and placement summary:**
- CTA 1 (hero anchor): Text link in `--brass` (dark: `--primary-text`) with rising-edge underline on hover. Copy: "Join for $30/mo. See how it works." Placed in Section 1 below the stat row. Anchors to Section 5 (`#join-cta`). For convinced visitors who don't need the full proof journey.
- CTA 2 (primary): Full `--gold` solid button, 48px min-height. Copy: "Join Edgeable." Placed in Section 5. Navigates to /signup. For visitors who read through the proof sections.
- Total: 2 CTAs. Rationale: Fitts's law (Fitts 1954) — primary target must be reachable without hunting. The hero anchor reduces scroll distance to action for high-intent visitors without competing visually with the primary CTA.

---

### Public data fields — engineering sign-off required (Phase 3 output)

The following Firestore changes are required to support the /join page. These are named here for Sean's sign-off; implementation is at build/dev time.

| Collection | Field | Current access | Required access | Why |
|-----------|-------|---------------|-----------------|-----|
| `dailyPnL/{YYYY-MM-DD}` | `units` | Signed-in only | World-readable | Chart y-axis: cumulative net units curve |
| `dailyPnL/{YYYY-MM-DD}` | `wins` | Signed-in only | World-readable | Secondary: daily W-L tooltip on scrub |
| `dailyPnL/{YYYY-MM-DD}` | `losses` | Signed-in only | World-readable | Secondary: daily W-L tooltip on scrub |
| `dailyPnL/{YYYY-MM-DD}` | `pushes` | Signed-in only | World-readable | Secondary: daily W-L tooltip on scrub |
| `dailyPnL/{YYYY-MM-DD}` | `notes` | Signed-in only | Stays signed-in | Notes are internal; not needed public |
| `picks/{id}` | `description`, `sport`, `odds`, `stakeUnits` | Signed-in (active sub or public pick) | No change | Per-pick detail stays subscriber-only except access='public' picks |
| `picksPublic/{id}` | All existing fields | World-readable | No change | Already public: `gameStartTime`, `postedAt`, `status`, `gradedAt` |

**Rule change:** `dailyPnL` collection needs `allow read: if true` (or equivalent world-readable rule) on all documents. Only the four fields above are exposed in the chart; the `notes` field, if it needs to stay private, would require a subcollection or a separate public aggregate document. Simplest path: make the whole document world-readable since `notes` is low-sensitivity internal data. Sean's call.

**No change to pick contents:** `picks/{id}` description, sport, odds, and stakeUnits remain subscriber-only except for `access='public'` picks (which are already accessible to any signed-in user per existing rules and are displayed in Section 3 free-pick cards).

**6. Legal footer**
- Content slots:
  - Age requirement: "You must be 21 or older to subscribe. By joining, you confirm you meet the legal gambling age in your jurisdiction."
  - Not a sportsbook: "Edgeable sells picks as opinions and analysis. We are not a sportsbook, broker, or financial advisor. Nothing here constitutes financial advice or a guaranteed investment."
  - Past performance: "Past performance does not guarantee future results. Sports betting involves substantial risk of financial loss."
  - Links row: "Terms" (/terms) | "Privacy" (/privacy) | "Verify the record" (/card)
  - Copyright: "Edgeable [current year]"
- Mobile: single-column stack. Text blocks stacked vertically. Links row wraps as needed.
- Desktop: same, wider container with a max-width matching the page column.

**Page-level signed-in banner (non-disruptive, above Section 0 header):**
- Copy: "You're already signed in. Go to your dashboard." with a text link to /dashboard.
- Visual: thin bar using `--muted` background, `--muted-foreground` text. Not a modal, not a full banner. Dismissible.

**States (page-level):**
- Default: all sections rendered with live data.
- Loading: skeletons in Sections 1 and 2; rest renders immediately (static content).
- Signed-in visitor: Section 5 CTA replaced; non-disruptive banner at page top: "You're already a member — [Go to your dashboard →]".
- Record data unavailable: Section 1 shows fallback (see above); Section 2 shows chart error state. Rest of page unaffected.

**Primary CTA:** "Join Edgeable →" → /signup

**Exit / next page:** /signup (after CTA); /card (via tamper-evidence link or footer link); /terms, /privacy (footer).

---

### /card — CTA amendment

**Purpose of amendment:** Add a cross-link CTA that surfaces /join to /card visitors without degrading /card's neutral-proof identity.

**CTA spec:**
- **Label:** "Join for $30/mo →"
- **Placement:** Below the record header (W-L-P / net units / ROI stat row), above the pick list / today's card section. This is the natural "I've seen the proof, what next?" moment.
- **Visual treatment:** Subdued text link or small secondary-variant button. NOT the primary accent color or a full-width button. Must not compete with /card's core function (pick verification). Phase 2 decides exact token weight.
- **Restraint rationale:** /card serves two audiences — (1) prospective subscribers verifying the record before joining, and (2) the general public auditing the record with no purchase intent. A loud CTA imposes on the second audience and undermines /card's credibility as a neutral-proof surface. A text link is actionable for the first audience without interrupting the second. This is not timidity — it is appropriate audience segmentation. (Hick's law: avoid adding decision noise for visitors whose job is verification, not evaluation.)
- **Signed-in subscriber state:** CTA hidden or replaced with "Dashboard →" for authenticated active subscribers (they do not need to join).

---

## Marketing spine

**Awareness stage of target visitor:** Problem-aware. Visitors are sports bettors who have seen picks services before and distrust them. Lead with proof, not with problem recognition.

**Section sequence (adapted from canonical spine to fit confirmed brief):**

| # | Section | Maps to canonical | What it does for Edgeable |
|---|---------|-------------------|--------------------------|
| 1 | Record hero | Hero + Social proof | States the verifiable record immediately; live stats are the value prop and the social proof simultaneously |
| 2 | Performance chart | Solution | Makes the trend visible; scrub interaction gives the visitor agency to investigate |
| 3 | Free pick samples | Social proof (product-specific) | Concrete proof instances: picks posted before game start, graded honestly including losses |
| 4 | How joining works | How it works | Eliminates process anxiety around the manual payment — the primary conversion barrier |
| 5 | Price + CTA | Pricing + Final CTA | Single tier, disclosed fully before the button |
| 6 | Legal footer | Objection handling (implicit) | 21+, not a sportsbook, past performance caveat — manages regulatory and credibility objections |

**Sections not used and why:**
- Standalone problem/pain section: omitted. Audience is problem-aware; restating their skepticism lengthens the page without adding value. The proof sections are the answer to an unspoken problem.
- Testimonials: omitted from Phase 1 scope. Research doc does not include them; would require real subscriber quotes. Future consideration.
- Success vision / stakes: omitted. The proof sections do this work more concretely than aspirational copy. A separate "imagine winning" section would read as hype — the opposite of the proof-forward tone.
- FAQ: omitted from Phase 1 spec. The How-joining-works section handles the top objections (process, legitimacy). Phase 3 (content-design) may recommend adding an FAQ slot if objection-handling analysis surfaces unmet questions.

**StoryBrand role (SB7, Miller 2017):** Customer = hero (the skeptical bettor trying to make a smart decision). Edgeable = guide (has the verifiable track record and a clear plan for joining). The guide does not claim to be a hero — the pitch is "here is the proof; you decide." This restraint IS the pitch.
