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
  - Headline: proof-forward, ≤12 words. (Final copy: Phase 3.)
  - Subhead: 1–2 sentences — what Edgeable is, why the record is verifiable. (Final copy: Phase 3.)
  - Stat row: W-L-P record | Net units | ROI — live data from `picks`/`picksPublic` via the same computation as /card (`computeRecord` in `src/utils/picks.js`). Labels below each number. Pending picks excluded; voids excluded from ROI denominator per existing /card rules.
  - Tamper-evidence callout: bordered/inset block. Explains: picks timestamped before game start, grading one-way, no deletes, pick contents private so strategy can't be copied. Inline link: "Verify it yourself →" → /card.
  - **Hero anchor CTA:** "Join for $30/mo — see how it works ↓" — text link / subtle button variant (Phase 2 decides weight), anchors to the price+CTA section (`#join-cta`). Placed below the stat row, above the tamper callout or below it. This CTA exists so a convinced visitor (e.g. referred by a current subscriber) does not have to scroll through all proof sections.
- States:
  - Default: live stats rendered.
  - Loading: skeleton placeholders for stat numbers (3 boxes).
  - Error / data unavailable: "Record temporarily unavailable — [View the full archive →]" linking to /card. No broken UI; the tamper-evidence callout and CTA remain visible.
  - Record negative / short-history: stat row shows real numbers honestly. No special hiding state.
- Mobile: single-column stack. Stat row: 3 equal-width tiles, full-width. Desktop: hero can use a two-column grid (record left, tamper callout right).

**2. Units performance chart**
- Content slots:
  - Section heading: "Net units over time" or equivalent. (Final copy: Phase 3.)
  - Scrubable equity curve chart — Robinhood-style monotone-cubic smoothed line. Interaction baseline: `PerformanceChart.jsx` pattern (pointer/touch scrub updates headline stat + date label).
  - Headline stat above chart: updates on scrub — shows net units at the scrub point and the date.
  - Range tab controls: `role="tablist"` containing 4 `<button role="tab">` elements. Labels: Week | Month | 3M | All. Default selected: All. Keyboard: arrow keys navigate between tabs (roving `tabindex`). Touch target: minimum 44px height per tab. Active tab has distinct visual state (Phase 2 decides treatment).
  - Chart data source: public net-units data (daily granularity, `dailyPnL` collection — engineering to expose world-readable; exact mechanism confirmed in plan). Pending picks excluded from the chart.
- States:
  - Default: chart rendered with All range.
  - Loading: placeholder box with skeleton animation.
  - Sparse data (<7 data points in selected range): render available points; do not extrapolate. Show "Not enough history for this range — showing all available data" note below the chart.
  - Negative net units period: shown as a dip on the curve, without truncation or axis manipulation. Chart baseline at 0 units; negative values render below the axis. This is non-negotiable — hiding a dip would contradict the proof-forward pitch.
  - Range with zero data points: "No data for this range" — chart area empty with note. Tab remains selectable.
  - Data fetch error: "Chart temporarily unavailable" with a link to /card.
- Mobile: chart is full container-width. Range tabs are full-width, equal-distribution, 44px min-height touch targets. Scrub works via touch events.
- Desktop: chart widens with container (max ~640px centered, or full column width in grid).

**3. Free-pick samples**
- Content slots:
  - Section heading: frames the samples as try-before-you-buy, not manufactured scarcity. (Final copy: Phase 3 — must name framing explicitly: occasional `access='public'` picks; subscriber picks stay private.)
  - 2–3 free-pick cards. Each card: "Free pick" badge | pick description (from `picks` where `access='public'`) | posted timestamp (before game start — prominent) | result badge (W/L/P — shown honestly, including losses).
  - Framing note: subscriber picks stay private so the strategy can't be copied or reverse-engineered. This is stated as a feature, not an apology.
  - Link: "See the full record →" → /card (contextual nav).
- States:
  - Default: 2–3 most recent graded public picks displayed.
  - No public picks yet: section is hidden entirely (do not show an empty state here — the section's absence is preferable to an empty promise). Engineering flag: conditional render on `access='public'` pick count > 0.
  - Loading: skeleton pick cards.
- Mobile: single-column stack of pick cards.
- Desktop: 3-column picks grid (or 2-column if only 2 picks available).

**4. How joining works**
- Content slots:
  - Section heading: frames the 3-step process as personal/concierge, not janky. (Final copy: Phase 3.)
  - Step 1: "Create an account" — free signup, email + password, /signup link.
  - Step 2: "Send $30 via CashApp or Zelle" — exact payment info from `config/paymentInfo`; attach proof screenshot in-app. No external checkout.
  - Step 3: "Approved same day" — personally reviewed, full access unlocks when approved.
  - Each step: number indicator (44px touch target circle or equivalent) + heading + 1–2 sentence description.
- States:
  - Default: 3 steps rendered.
  - (No loading or error state — this is static copy.)
- Mobile: single-column stack, steps numbered 1–3 vertically.
- Desktop: 3-column horizontal layout, steps side-by-side.

**5. Price + CTA** `id="join-cta"`
- Content slots:
  - Price: "$30" large + "/month" secondary. Single tier, no comparison table.
  - Value description: one sentence — what's included (every pick, full record, performance chart, cancel anytime). (Final copy: Phase 3.)
  - **Primary CTA button:** "Join Edgeable →" (or equivalent). Full-width on mobile; centered max-width on desktop. Minimum height 48px. Primary visual weight (Phase 2 decides color/treatment). → /signup.
  - Reassurance microcopy: below the CTA button. Acknowledges the manual process explicitly — sets expectation that this is a personal approval, not instant. (Final copy: Phase 3.)
  - Signed-in state: CTA button replaced with "Go to your dashboard →" link if user is authenticated.
- States:
  - Default: price + CTA visible.
  - Signed-in: CTA replaced with dashboard link (no dead action).
  - (No data-fetch states — price is static.)
- Mobile: price and CTA centered, full-width button.
- Desktop: content centered with max-width (~480px) within the wider column.

**CTAs on /join — count and placement summary:**
- CTA 1 (hero anchor): Text link or subtle anchor button in Section 1 below stat row. Low visual weight. Anchors to Section 5. For convinced visitors.
- CTA 2 (primary): Full button in Section 5 (price+CTA). High visual weight. Navigates to /signup. For visitors who completed the proof-review journey.
- Total: 2 CTAs. Rationale: Fitts's law (Fitts 1954) — primary target must be reachable without hunting. The hero anchor reduces scroll distance to action for high-intent visitors without competing visually with the primary CTA.

**6. Legal footer**
- Content slots:
  - 21+ age requirement statement.
  - Not a sportsbook disclaimer. Opinions/analysis, not financial advice.
  - Past performance does not guarantee future results.
  - Links: Terms (/terms) | Privacy (/privacy) | Verify the record (/card).
- Mobile: single-column stack of text + link row.
- Desktop: same, wider container.

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
