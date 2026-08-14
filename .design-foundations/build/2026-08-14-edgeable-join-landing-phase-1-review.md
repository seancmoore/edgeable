# Design Review: Phase 1 - Edgeable /join Landing Page Spec

## Rendered Evidence (Step 0)
- Screenshot: N/A — spec-only phase (no rendered surface)
- Surface: JOURNEY.md structural + temporal specification (C:\Users\panky\Desktop\edgeable\JOURNEY.md)
- Artifact type: Phase 1 specification document; no HTML/visual artifact yet

## Assessment B — Deterministic Detector
- Status: **N/A — No rendered artifact**
- Reason: Spec-only phase; the detector `scripts/detect.mjs` requires a rendered .html or mock file. A JOURNEY.md text document carries no visual surface to audit.
- Finding count: N/A
- Opened after Assessment A: N/A (no file to open)

## Triage
- Baseline (always-on): **journey** doctrine (spec-level artifact auditing)
- Dispatched pillars:
  - `journey` — Yes. The artifact is a JOURNEY.md spec (job stories, journey map, IA, flows, page specs, marketing spine). Journey doctrine applies directly.
  - `usability` — Yes (cited within journey). Flow edge cases and CTA placement invoke Fitts's law + Hick's law (keystone usability principles cited in the journey spec).
- Not applicable: `design-dna`, `checklists`, `design-systems` (no visual tokens or rendered surface yet)
- Visual baseline deferred: spec-only phase; pixel-level critique deferred to Phase 2 (DESIGN.md) and Phase 3 (mock review)

## Cross-Pillar Findings (Assessment A — PASS)

| Severity | Pillar | Finding | Principle | Status |
|----------|--------|---------|-----------|--------|
| ✓ PASS | journey | JOURNEY.md fully populated: Job (JTBD story + four forces, Moesta school identified), Journey (actor/scenario/scope, emotion curve, decision model = Google Messy Middle 2020, research basis = UNGROUNDED), IA (audience/task org, hub-and-spoke + sequential structure, sitemap, nav model), Flows (2 user/task flows with edge cases). Spec-first artifact complete. | Journey doctrine §A/C/D/E/F/H: JTBD, journey map, IA, flows, page specs, JOURNEY.md template (journey-stack.md lines 61–467) | ✓ PASS — all sections present and filled per doctrine structure |
| ✓ PASS | journey | /join page spec comprehensive: 6 named content blocks (header, record hero, chart, free picks, how-joining, price+CTA, legal footer) in mobile-first stack. Each block: content slots, states (default/loading/empty/error/signed-in), mobile/desktop layout guidance. Per journey-stack.md §page-specs template (lines 245–275). | Journey doctrine page spec format; Fitts's law (Fitts 1954) for CTA placement; Miller/Cowan ~4±1 chunks for info chunking | ✓ PASS — complete page spec with all required elements |
| ✓ PASS | journey | Join flow (primary): branching user flow with entry, 3 decision nodes (signed-in?, signup success?, proof upload success?), success state (/dashboard), error states named (email exists, network failure, upload failure), wait state included with approval notification. Per journey-stack.md §user-flows notation (lines 205–240). | Journey doctrine user flow format; Fitts's law on CTA placement; Hick's law on option reduction at decision nodes | ✓ PASS — complete flow with edge cases and states documented |
| ✓ PASS | journey | Post-CTA wait state explicitly mapped (lines 125–128): "Wait state: pending approval. Your request is being reviewed — you'll hear from us same day. No auto-redirect; user can safely close the app." No dead-end after CTA. Journey continues to /dashboard on admin approval. Exit from /join specified (line 281): /signup, /card, /terms, /privacy. | Journey doctrine flow design; Google Messy Middle decision model (journey-stack.md §decision-journey-models line 137: explore↔evaluate loop resolved by proof + process legibility) | ✓ PASS — complete journey from signup through approval to subscriber access |
| ✓ PASS | usability | /card cross-link CTA placement + restraint rationale specified (lines 287–295): placement "below record header, above pick list" — the "I've seen proof, what next?" moment (Messy Middle evaluate→action transition). Restraint rationale explicitly cited (Hick's law, line 293): "avoid adding decision noise for visitors whose job is verification, not evaluation." Text link (not primary button) preserves /card's neutral-proof identity. Signed-in state (line 294): CTA hidden for active subscribers (no dead action). | Hick's law (Hick–Hyman 1952) for option-count and cognitive load; Nielsen heuristic #4 (consistency: /card tone preserved); journey-stack.md §page-specs line 274 (Fitts's law CTA placement guidance) | ✓ PASS — CTA placement justified by principle, restraint preserves UX integrity |
| ✓ PASS | journey | Signed-in visitor edge case handled (DW edge case #1): Join flow (lines 108–109) routes to /dashboard banner ("Already signed in — Go to dashboard →"). Page-level state (line 276) adds non-disruptive top banner. /join spec Section 5 (lines 251–256) replaces CTA with "Go to your dashboard →" link. No dead CTA. | Journey doctrine flow design; edge case encoding (journey-stack.md §user-flows line 240: "encode edge cases...") | ✓ PASS — complete handling, no dead action |
| ✓ PASS | journey | Record short-history / negative net units edge case handled (DW edge case #2): Section 1 (line 199) states "Record negative / short-history: stat row shows real numbers honestly. No special hiding state." Section 2 chart states (line 213): "Negative net units period: shown as a dip on the curve, without truncation or axis manipulation. Chart baseline at 0 units; negative values render below the axis. This is non-negotiable." Sparse data (<7 points, line 212) handled gracefully. Page structure does NOT depend on a pretty curve; proof-forward design maintained under adverse data. | Journey doctrine flow design + page states; proof-forward marketing spine (journey-stack.md §persuasion-spine line 330: "Conversion = Desire − (Labor + Confusion)" — honesty reduces confusion, supports Desire) | ✓ PASS — structure remains sound under negative data; no manipulation |
| ✓ PASS | journey | /card visitor who never joins (DW edge case #3): /card cross-link CTA (lines 287–295) is subdued text link, explicitly restrained to avoid degrading /card's neutral-proof feel for the "general public auditing the record with no purchase intent" audience (line 287). Restraint is a design feature (Hick's law), not timidity (line 293 rationale). Audience segmentation acknowledged and honored. | Journey doctrine IA + navigation (rosenfeld/morville contextual navigation, journey-stack.md §IA line 190); Hick's law for noise reduction in verification-focused task | ✓ PASS — restraint is principle-grounded; /card's identity protected |
| ✓ PASS | journey | CTA count + placement justified (lines 259–262): "CTA 1 (hero anchor): Text link...Low visual weight. CTA 2 (primary): Full button in Section 5...High visual weight. Total: 2 CTAs. Rationale: Fitts's law (Fitts 1954) — primary target must be reachable without hunting." Hero anchor reduces scroll distance for high-intent visitors; primary CTA remains visually dominant for the proof-review journey. Fitts's law and attention hierarchy both honored. | Fitts's law (Fitts 1954) CTA placement; Nielsen heuristic #2 (match system to world: two paths for two intent levels); Hick's law (two CTAs, distinct visual weight, no option clutter) | ✓ PASS — CTA architecture justified and proportionate |

## Requirement Fulfillment

### DW-1.1
**PREMISE:** JOURNEY.md exists with Job, Journey, IA, Flows sections filled from the research doc.

**EVIDENCE:** 
- JOURNEY.md present at C:\Users\panky\Desktop\edgeable\JOURNEY.md
- Job section (lines 8–24): job story ("When I keep seeing picks sellers..."), functional/emotional/social jobs, Switch interview (four forces: push, pull, anxiety, habit), JTBD school (Moesta)
- Journey section (lines 28–55): actor (skeptical stranger, sports bettor, 21+, mobile-first), scenario (evaluating Edgeable as subscription), scope (current-state, single-actor, awareness through post-CTA wait), decision model (Google Messy Middle, explore↔evaluate), emotion curve described (valley→rising→plateau→sharp rise→drop→recovery), research basis (UNGROUNDED)
- IA section (lines 59–89): organization scheme (audience-based public layer, task-based authenticated layer), structure type (hub-and-spoke for auth, sequential for conversion), sitemap with 9 routes (/, /join, /card, /signup, /terms, /privacy, /guide, /dashboard, /admin/*), global nav labels (minimal: wordmark + Log in), navigation model (contextual only on /join, no global bar), validation note (NOT VALIDATED by card sort or tree test)
- Flows section (lines 92–164): Join flow (primary, user flow, branching, entry: /join CTA, goal: stranger→subscriber, 6 steps + decision branches + error states + success), /card cross-link flow (secondary, task flow, entry: /card, goal: visitor→/join→join flow, 4 steps)

**VERDICT:** **PASS** — All four sections present and populated with complete, principle-grounded content per journey doctrine

### DW-1.2
**PREMISE:** `## Page specs` has a complete `/join` entry: every section named with content slots, CTA count and placement, and mobile ordering.

**EVIDENCE:**
- Page specs section present (lines 166–272)
- /join page spec (lines 168–282) includes:
  - Purpose (line 170): "Convert a skeptical stranger into a $30/month subscriber..."
  - Entry points (lines 172–176): bio link, /card cross-link, direct URL, search result (future)
  - Awareness stage (lines 178–179): problem-aware (Schwartz ladder)
  - Content blocks in order, mobile-first:
    1. Site header (lines 182–186): wordmark, "Log in" link, signed-in state
    2. Record hero (lines 188–200): headline, subhead, stat row, tamper-evidence callout, hero anchor CTA, loading/error/negative states, mobile 1-column + desktop 2-column
    3. Units performance chart (lines 202–217): heading, scrubable chart, range tabs (Week/Month/3M/All), loading/sparse/negative/zero/error states, 44px touch targets, mobile full-width
    4. Free-pick samples (lines 219–230): heading, 2–3 cards, framing note, result badges, loading state, hidden if no public picks, mobile 1-column + desktop 3-column
    5. How joining works (lines 232–243): heading, 3 steps (account, payment, approval), 44px touch targets, mobile vertical + desktop horizontal
    6. Price + CTA (lines 245–257): "$30/month" large, value description, primary button (48px min), reassurance microcopy, signed-in state, mobile full-width centered + desktop max-width centered
    7. Legal footer (lines 264–271): 21+ disclaimer, not a sportsbook, past performance caveat, links to /terms, /privacy, /card
  - States at page level (lines 273–277): default, loading, signed-in, record unavailable
  - CTA count and placement (lines 259–262): 2 CTAs (hero anchor text link in Section 1, primary button in Section 5), Fitts's law rationale
  - Mobile ordering: full-width stacked throughout; desktop variations noted per block

**VERDICT:** **PASS** — Complete /join spec with all sections named, content slots documented, CTA count/placement justified, mobile ordering explicit

### DW-1.3
**PREMISE:** The flow covers signup → payment → approval including the wait state — no journey dead-end after the CTA.

**EVIDENCE:**
- Join flow (lines 104–134) shows complete path:
  - Entry: /join CTA tapped
  - Step 1: Is user signed in? YES→dashboard banner, NO→continue
  - Step 2: /signup screen (create account)
  - Step 3: Signup succeeds? FAIL→error state, SUCCESS→continue
  - Step 4: In-app payment instructions screen (CashApp/Zelle info, proof screenshot upload)
  - Step 5: Proof submitted? FAIL→retry, SUCCESS→continue
  - Step 6: Wait state (pending approval): "Your request is being reviewed — you'll hear from us same day. No auto-redirect; user can safely close the app."
  - Step 7: Admin approves → Approval notification (email)
  - Step 8: /dashboard (full subscriber access unlocked)
- Error states documented (lines 136–140): email exists, network failure, upload failure, fraud/duplicate/bad proof (offline)
- Success state (line 142): "User reaches /dashboard with active subscription status"
- Session-expiry edge case (lines 144–145): inactive account, instructions re-accessible on login
- Section 5 page spec (line 279): "Primary CTA: 'Join Edgeable →' → /signup"; (line 281) "Exit / next page: /signup (after CTA); /card (via tamper-evidence link or footer link); /terms, /privacy (footer)."

**VERDICT:** **PASS** — Journey covers complete signup→payment→approval flow with wait state included; no dead-ends after CTA

### DW-1.4
**PREMISE:** /card cross-link CTA specified (placement + restraint rationale).

**EVIDENCE:**
- /card CTA amendment section (lines 285–295) specifies:
  - Label (line 290): "Join for $30/mo →"
  - Placement (lines 291–292): "Below the record header (W-L-P / net units / ROI stat row), above the pick list / today's card section. This is the natural 'I've seen the proof, what next?' moment."
  - Visual treatment (lines 292–293): "Subdued text link or small secondary-variant button. NOT the primary accent color or a full-width button. Must not compete with /card's core function (pick verification). Phase 2 decides exact token weight."
  - Restraint rationale (lines 293–294): "Hick's law: avoid adding decision noise for visitors whose job is verification, not evaluation. A text link is actionable for the first audience without interrupting the second. This is not timidity — it is appropriate audience segmentation."
  - Signed-in state (line 294): "CTA hidden or replaced with 'Dashboard →' for authenticated active subscribers (they do not need to join)."

**VERDICT:** **PASS** — CTA fully specified with placement (journey moment), visual treatment (restrained), and principle-grounded rationale (Hick's law); signed-in state handled

### Edge Case: Visitor arrives already signed in
**PREMISE:** Skip to dashboard link, not a dead CTA.

**EVIDENCE:**
- Join flow (lines 108–109): "Is user already signed in? ──YES──► [Banner: 'Already signed in — Go to dashboard →']"
- Page spec Section 5 (lines 251–256): "Signed-in state: CTA button replaced with 'Go to your dashboard →' link if user is authenticated."
- Page-level state (line 276): "Signed-in visitor: Section 5 CTA replaced; non-disruptive banner at page top: 'You're already a member — [Go to your dashboard →]'."

**VERDICT:** **PASS** — Handled in flow and page spec; no dead action

### Edge Case: Record momentarily short/negative
**PREMISE:** Page structure cannot depend on a pretty curve.

**EVIDENCE:**
- Section 1 state (line 199): "Record negative / short-history: stat row shows real numbers honestly. No special hiding state."
- Section 2 chart state (line 213): "Negative net units period: shown as a dip on the curve, without truncation or axis manipulation. Chart baseline at 0 units; negative values render below the axis. This is non-negotiable — hiding a dip would contradict the proof-forward pitch."
- Sparse data handling (line 212): "Sparse data (<7 data points in selected range): render available points; do not extrapolate. Show 'Not enough history for this range — showing all available data' note below the chart."
- Zero-data range (line 214): "'No data for this range' — chart area empty with note. Tab remains selectable."

**VERDICT:** **PASS** — Structure sound under adverse data; no manipulation of curve or axis

### Edge Case: /card visitor who never sees /join
**PREMISE:** CTA placement must not degrade /card's neutral-proof feel.

**EVIDENCE:**
- /card CTA amendment (lines 287–295) explicitly addresses this:
  - Visual treatment (lines 292–293): "Subdued text link or small secondary-variant button. NOT the primary accent color or a full-width button. Must not compete with /card's core function (pick verification)."
  - Restraint rationale (line 293): "A text link is actionable for the first audience [prospective subscribers] without interrupting the second [the general public auditing the record with no purchase intent]."
  - Principle cited (line 293): "Hick's law: avoid adding decision noise for visitors whose job is verification, not evaluation."
  - Audience segmentation (line 293): "This is not timidity — it is appropriate audience segmentation."
  - Signed-in state (line 294): "CTA hidden or replaced with 'Dashboard →' for authenticated active subscribers (they do not need to join)."

**VERDICT:** **PASS** — Restraint principle-grounded (Hick's law); /card's identity protected; audience segmentation acknowledged

**All requirements met:** YES

## Notes (non-blocking)

1. **Research basis flagged as UNGROUNDED (line 55).** Journey doc correctly flags this: "UNGROUNDED — hypothetical journey based on confirmed research doc (2026-08-14) and Sean's direct input. No interview sessions or diary studies conducted. Treat as a design hypothesis to validate with real subscriber onboarding feedback." This is a strength (transparent) and a call to action (validate post-launch). Not a defect.

2. **IA validation deferred (line 88).** The spec notes "NOT VALIDATED by card sort or tree test" and recommends "informal tree test if /join is ever embedded in a broader navigation system." Appropriate scoping for Phase 1; a single new route with minimal global nav does not justify formal testing. Not a defect.

3. **Session-expiry edge case engineering note (lines 144–145).** "When they return and log in, the in-app payment instructions should be accessible from the account/settings area. This is an engineering consideration; the spec notes it as a gap to address at build time." Correct handoff; defers implementation detail to Phase 2/3.

4. **Public data mechanism deferred (research doc, decision 2).** Exact fields exposed (units on `picksPublic` stub vs. public `dailyPnL` vs. aggregate doc) is a plan-phase call ("Engineering to expose world-readable" line 208). Chart state handling (sparse, zero-data, negative) covers all scenarios regardless of exact mechanism. Appropriate deferral.

5. **Phase 2 design decisions deferred to DESIGN.md.** Visual weight of CTAs (lines 193–194, 249), token treatment for hero anchor/primary button (line 292), serif restriction to logo only (research decision 3), typeface selection (research open question 3) — all correctly scoped to Phase 2. This spec carries structural + flow concerns; visual tokens are DESIGN.md's domain.

6. **OG share image noted as deliverable (research doc, line 61).** Research notes "the /join OG share image is part of the deliverable, not a nice-to-have (SPA serves one index.html site-wide; per-route OG needs a workaround or a deliberate site-wide image that sells /join)." Carried forward in the spec? Not explicit in JOURNEY.md. Check DESIGN.md phase plan for inclusion; recommend adding to Phase 2 deliverables (visual assets).

---

## Issues (none)

No defects identified. All Done-When items met. All edge cases handled with clear rationale.

---

**Verdict: PASS**

**Blocker:** None.

All four Done-When items are fulfilled with evidence. All three edge cases are explicitly handled in spec with principle-grounded rationale. JOURNEY.md is a complete, structurally sound specification ready for Phase 2 (DESIGN.md tokens).

---

**Report generated:** 2026-08-14 (Phase 1 specification review)
**Doctrine applied:** `journey` (per pillar-taxonomy.md §5 resolver)
**Next phase:** Phase 2 (DESIGN.md + visual tokens) per design-for-ai workflow
