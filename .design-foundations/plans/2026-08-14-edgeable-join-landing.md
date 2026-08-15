# Plan: Edgeable /join landing page + "modern gold" identity refresh

**Date:** 2026-08-14 · **Track:** Standard · **Entry stage:** Discover (no JOURNEY.md, no DESIGN.md)
**Status:** complete (after Phase 2 re-deal) · **Started:** 2026-08-14 12:30 · **Completed:** 2026-08-14 · **Workspace:** feature/join-landing (branch)
**Re-deal 2026-08-14:** Sean rejected the Gilt Ledger direction on the rendered mock ("looks very weird on desktop especially"). New reference (user-supplied): refero "Portal" style, https://styles.refero.design/style/b9aeb945-2f6e-4557-9115-e3ff3a8f8dc8 — twilight editorial: near-mono neutrals + ONE sparing accent, atmospheric gradient hero, 22-30px card radius + pill buttons, soft glow-ring depth (no hard shadows/hairline severity), 1200px centered desktop-first, 80-120px section air. New pins: all-sans stands (serif logo-only), gold = the single sparing accent (buttons/links/active only, no gold bands), warm dusk atmospheric hero, DESKTOP-FIRST layout. JOURNEY.md structure + Phase-3 copy stand; DESIGN.md re-dealt; mock re-rendered.
**Research doc:** `.design-foundations/research/2026-08-14-edgeable-join-landing.md` (confirmed)

## Context

Design a public sales page at `/join` for Edgeable (edgeabled.web.app) that converts skeptical strangers into $30/month subscribers by leading with the verifiable pick record (live W-L + net units), a Robinhood-style units performance chart, and a plainly-owned manual join flow. Alongside it, evolve the "Edge Club" visual identity into a modern, sharp, gold-anchored look the rest of the app can adopt later. Problem statement confirmed by Sean 2026-08-14.

## Constraints (whole-plan)

- Stack: React + Vite + Tailwind + shadcn-style CSS-variable tokens (`src/index.css` remaps semantic names). The new look must be expressible in that structure.
- Logo (Bodoni wordmark + rising gold line, `public/edgeable-wordmark.svg`) reused as-is; serif nowhere else.
- Dark + light themes, follow system, both finished and AA-compliant.
- Public data = W-L + units/ROI; pick contents private except `access='public'` free picks (featured as samples).
- Manual CashApp/Zelle + admin approval join flow, owned head-on (3-step section). Price: $30/mo, no other tiers.
- 21+ / legal footer; mobile first-class; /card gets a subtle Join CTA.
- Reference pool: styles.refero.design — comps pinned during Phase 2.

## Chosen Approach

Full lifecycle, three phases: Discover (journey + page spec for one page) → Design DNA (lock DESIGN.md) → Compose (words + data + ethics). One page, so Discover is a single phase; words and data surfaces share Phase 3 because both consume the same two artifacts and the page is small.

---

### Phase 1: Journey + /join page spec
**Stage:** Discover
**Model:** sonnet
**Doctrine:** journey
**Gate:** Standard

**Goal:** Specify how a skeptical stranger moves from link-tap to signed up, and the /join page structure that carries them.

**Scope:**
- IN: JTBD job story; journey map (bio link / share / /card cross-link → /join → signup → payment → approval); IA note (where /join sits among /, /card, /signup, /guide); /join page spec (section order, content slots, CTA placement); /card cross-link CTA spec; mobile-first section behavior.
- OUT: visual identity, tokens, final copy, chart visual encoding (Phases 2–3).

**Constraints:** Section order must lead with proof (record hero → chart → free-pick samples → how-joining-works 3-step → $30 price + CTA → legal footer) per the confirmed brief; deviations need stated rationale. Journey must cover the post-CTA gap: signup → manual payment → approval wait state.
**Edge cases:** Visitor arrives already signed in (skip to dashboard link, not a dead CTA); record momentarily short/negative (page structure cannot depend on a pretty curve); /card visitor who never sees /join (CTA placement must not degrade /card's neutral-proof feel).

**Produces:** JOURNEY.md (Job + Journey + IA + Flows + `## Page specs` with a complete `/join` entry and a `/card` CTA amendment)
**Depends on:** research doc | **Unlocks:** Phase 2, Phase 3

**Done when:**
- [ ] DW-1.1: JOURNEY.md exists with Job, Journey, IA, Flows sections filled from the research doc.
- [ ] DW-1.2: `## Page specs` has a complete `/join` entry: every section named with content slots, CTA count and placement, and mobile ordering.
- [ ] DW-1.3: The flow covers signup → payment → approval including the wait state — no journey dead-end after the CTA.
- [ ] DW-1.4: /card cross-link CTA specified (placement + restraint rationale).

---

### Phase 2: Design DNA + tokens ("modern gold")
**Stage:** Design
**Model:** fable
**Doctrine:** design-dna, archetypes, foundations, fonts, color
**Gate:** Full

**Goal:** Evolve the Edge Club identity into a modern, sharp, gold-anchored visual DNA and lock DESIGN.md.

**Scope:**
- IN: register + archetype; 2-3 named comps from styles.refero.design; sans typeface decision (replace or keep Mulish); gold-anchored palette for dark + light via `palette.mjs`; type scale; radii/spacing; the rising-edge line as a codified motif; motion budget.
- OUT: page layout (Phase 1 owns structure), copy, chart encoding.

**Constraints:** Dealer pins from research taste signals — carried verbatim: (a) gold stays the brand hue (`#d8b773`/`#b58a3c` family), vintage cream/serif goes; (b) "template-y" is the failure mode — the DNA must not read as default shadcn; (c) serif confined to the logo, page all-sans. Token block must map onto the existing semantic alias names in `src/index.css` so the app can adopt it later. Both themes generated, not dark-first-light-afterthought.
**Edge cases:** Gold-on-white AA failure (light-mode gold historically needs darkening to pass — verify `#b58a3c`-family text usage); gold used as large-area background (readability of ink-on-gold CTA); wordmark's cream `#f4efe6` fill on light backgrounds (logo variant or backdrop needed).

**Produces:** DESIGN.md **locked** (register, archetype, comps, token block for both themes, type scale, motif spec, motion budget) — user-confirmed
**Depends on:** Phase 1 (JOURNEY.md) | **Unlocks:** Phase 3

**Done when:**
- [ ] DW-2.1: DESIGN.md locked — token block present for dark AND light, user confirmed the direction.
- [ ] DW-2.2: All text/background pairs pass WCAG AA (≥4.5:1 body, ≥3:1 large) in both themes, verified via `palette.mjs`; interactive elements pass AA non-text (≥3:1).
- [ ] DW-2.3: All semantic aliases resolved (`--background`, `--card`, `--foreground`, `--primary`, `--muted`, functional `--destructive/--success/--warning`) plus type scale defined.
- [ ] DW-2.4: 2-3 refero comps named in DESIGN.md with what each contributes; the rising-edge motif has a usage spec (where it may and may not appear).

---

### Phase 3: Compose — words + data surfaces + ethics pass
**Stage:** Design
**Model:** sonnet
**Doctrine:** content-design, data-viz, behavioral, deceptive-patterns
**Gate:** Standard

**Goal:** Write the microcopy that sells to a skeptic and spec the record header + units chart truthfully, then audit the page for dark patterns.

**Scope:**
- IN: hero + section microcopy (proof framing head-on: timestamped-before-start, one-way grading, why picks are hidden); 3-step join copy; free-pick sample presentation; $30 price + CTA copy; 21+/legal footer copy; empty/edge-state copy; chart spec (data source granularity per the public-units mechanism, axes, W-L + net units + ROI header, sparse/dip/short-history states, scrub interaction, mobile behavior); deceptive-patterns audit of the whole spec.
- OUT: implementation code, Firestore rules changes (engineering, handled at build/dev time — the spec names required public fields for Sean's sign-off).

**Constraints:** Tone = credible, proof-forward, no hype — the copy must survive a skeptic reading it as a scam until proven otherwise. Chart must encode truthfully: no truncated-axis exaggeration of the units curve, dips shown, pending picks excluded per existing record rules. The free-picks teaser is a sample, not manufactured scarcity.
**Edge cases:** Record header when 0 graded picks in range; chart with <7 data points; negative net units (copy and chart must not hide it — transparency IS the pitch); DESIGN.md missing at phase start → gate violation, stop and flag.

**Produces:** JOURNEY.md `/join` page spec updated with final microcopy + chart/table spec + named public data fields for sign-off
**Depends on:** Phase 1 (page specs), Phase 2 (DESIGN.md locked) | **Unlocks:** mock

**Done when:**
- [ ] DW-3.1: Every section in the /join page spec has final microcopy including error/empty/edge states — no lorem or TODO slots.
- [ ] DW-3.2: Chart spec names the data source + granularity + the public fields it requires, and defines sparse (<7 pts), dip, and zero-data states.
- [ ] DW-3.3: Chart spec passes truthful-encoding review: baseline/axis policy stated, no exaggeration, W-L/units/ROI computation rules match the existing /card record rules.
- [ ] DW-3.4: Deceptive-patterns audit logged with zero unresolved ban-list hits (urgency/scarcity manipulation, confirmshaming, hidden costs — $30 and the manual process fully disclosed pre-CTA).

---

## Execution log

### Phase 1: Journey + /join page spec (Gate: Standard)
- [x] BUILD: Discovery + design + production complete
- [x] REVIEW: PASS
- [x] Committed
Commit: 8db8553
Summary: JOURNEY.md created at repo root — job story, journey map, IA, flows including the post-CTA payment/approval wait state, complete /join page spec (6 blocks, hero anchor CTA + bottom CTA, mobile-first ordering, accessible range-tab spec) and the restrained /card cross-link CTA; design can now lay out against locked page structure.

### Phase 2: Design DNA + tokens (Gate: Full)
- [x] BUILD: Discovery + design + production complete (fable)
- [x] REVIEW: FAIL → fix pass → PASS (2 attempts; wordmark asset Critical resolved with ink SVG variants)
- [x] Committed
Commit: 8dcbf69
Summary: DESIGN.md "Gilt Ledger" LOCKED (Sean confirmed) — Archivo + Spline Sans Mono, dual warm-neutral themes seeded from brand gold with all AA pairs verified, −4.6° rising-edge motif spec, hard contrast rules, ink wordmark variants for light theme; Phase 3 composes copy + chart on these tokens.

### Phase 3: Compose — words + data + ethics (Gate: Standard)
- [x] BUILD: Discovery + design + production complete
- [x] REVIEW: PASS (incl. em-dash copy law, truthful encoding vs picks.js, deceptive-patterns audit clean)
- [x] Committed
Commit: eab8e0a
Summary: JOURNEY.md /join spec carries final visitor-facing copy for all six sections with edge/empty/error states, a truthful chart spec on dailyPnL daily granularity with the public-fields sign-off table, and a clean dark-patterns audit.

### Final styled mock (post-phase artifact)
- [x] BUILD: mocks/join.html re-rendered at full fidelity on locked tokens
- [x] REVIEW: dual-blind PASS (detector exit 0; 1 Major usability fix + 3 mechanical fixes applied by orchestrator)
Summary: Both-theme styled mock with the one −4.6° motif, honest chart, verbatim final copy; pixel screenshot still pending (no browser tool this session).

### Phase 2 re-deal: "Dusk Ledger" (Gate: Full)
- [x] BUILD: DESIGN.md rewritten grounded in refero Portal (fable); palette.mjs exit 0 + 52 supplemental AA pairs incl. gradient stops
- [x] Mock: mocks/join.html re-rendered desktop-first on the new tokens
- [x] REVIEW: dual-blind PASS (detector exit 0; Major mobile stat-row overflow risk flagged for build time)
- [x] LOCKED by Sean on the rendered desktop mock
Summary: Dusk Ledger replaces Gilt Ledger — Inter + Spline Sans Mono, near-mono neutrals with gold as the single sparing accent, warm dusk gradient hero, soft glow-ring depth, pill buttons, calm centered 1200px desktop-first. JOURNEY structure/copy unchanged. Known build-time fixes: mobile stat-row overflow, real headings for sections 2/3/5 eyebrows, tab aria-controls linkage.

## Verification plan

Level: standard (mock + dual-blind review before build; per-phase gates as marked).

Per done-when:
- DW-1.1–1.4: JOURNEY.md inspection — sections present, /join entry complete, flow reaches approval state, /card CTA specified.
- DW-2.1: DESIGN.md exists, token block present, Sean's explicit confirmation recorded.
- DW-2.2: `palette.mjs` contrast output for both themes; manual check of gold-on-white and ink-on-gold pairs.
- DW-2.3: grep token block for the semantic alias set used by `src/index.css`.
- DW-2.4: DESIGN.md names comps + motif rules.
- DW-3.1–3.4: page-spec inspection + review-agent cross-pillar pass (content-design, data-viz, deceptive-patterns).

Dirty cases (one per phase):
- Phase 1: signed-in visitor hits /join → spec must route them (no dead CTA). Also: JOURNEY.md missing `## Page specs` → mock would be wireframe-only; treat as phase failure.
- Phase 2: light-theme gold body text fails AA → token rejected, palette re-run (do not ship a failing ramp because dark passes).
- Phase 3: DESIGN.md not locked at phase start → gate violation, phase must stop and flag rather than style ad hoc. Negative-units period rendered → chart shows it honestly.

## Assumptions

- The public-units mechanism (which fields go world-readable) is an engineering decision finalized at build/dev time; Phase 3 names the required fields and Sean signs off. Design proceeds on daily-granularity net-units data being available.
- Live record is currently positive and deep enough to lead (Sean confirmed); dip/sparse states still designed.
- Existing `PerformanceChart.jsx` interaction (scrub, draw-in) is the interaction baseline for the public chart.

## Decision Log

- One Discover phase, not two: single page, IA is trivial (one new route + one CTA).
- Words + data + ethics share Phase 3: both consume the same upstream artifacts; page is small; deceptive-patterns runs last inside the phase as an audit, not a separate phase.
- Model: fable on Phase 2 only (identity creation is the judgment-heavy step); sonnet elsewhere.
- Gate: Full on Phase 2 (locks DESIGN.md); Standard on 1 and 3.
