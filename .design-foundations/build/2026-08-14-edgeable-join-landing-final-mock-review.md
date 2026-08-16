# Design Review: Edgeable /join landing — final mock

**Date:** 2026-08-14 · **Artifact:** `mocks/join.html` · **Contracts:** DESIGN.md (LOCKED), JOURNEY.md

## Rendered Evidence (Step 0)
- Screenshot: none — browser MCP unavailable; structure-level critique only. Pixel-level rendering (font loading, rotation clipping, exact rendered contrast) unverified. Run the browser MCP to capture pixels.
- Surface: full /join page mock — sections 0–6, both themes via `.dark` class + system preference, interactive chart + range tabs.

## Assessment B — Deterministic Detector
- Command: `node scripts/detect.mjs mocks/join.html > .design-foundations/build/detect.json`
- Exit: 0 (ran)
- Findings: 1 — `aphoristic-cadence` (medium): "5 aphoristic constructions" (short manufactured-contrast sentences)
- Opened only after Assessment A findings were frozen: YES

## Triage
- Baseline (always-on): visual (`design-dna` + `ai-tells` CHECKER) + `usability`
- Dispatched doctrine (per prompt): `design-dna`, `usability`, `ai-tells` — all read and applied
- Data-viz signal present (equity chart) — the chart-honesty checks were carried by the DW heuristic item itself (zero baseline, no truncation, real tabs); full `data-viz` doctrine deferred as covered-by-requirement
- Not applicable: `journey` (single page, spec adherence checked against JOURNEY.md directly), `behavioral`/`deceptive-patterns` (persuasion here is disclosure-forward; no urgency/scarcity/confirmshaming present — verified in copy)

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Major | usability | `touch-action: none` on the chart SVG (line 217) creates a mobile scroll trap: a vertical swipe starting anywhere on the full-width 240px chart will not scroll the page. Actor is "primarily on mobile" per JOURNEY.md. | Norman: gulf of execution; WCAG 2.2 Operable (pointer gestures) | `touch-action: pan-y` and scrub on horizontal movement only (the app's `PerformanceChart.jsx` touch handler is the stated baseline) |
| Minor | usability | `.cta-btn:hover { color: hsl(var(--primary)) }` (line 289) sets `--primary` as a foreground — the exact construct DESIGN.md hard rule 1's structural enforcement bans ("components never set `color: hsl(var(--primary))` as a foreground"). Contrast-harmless here: gold on the ink button face computes 9.63:1 both themes, and JOURNEY.md §5 explicitly specs the inverted button. Register-justified → Minor, not a contrast defect. | DESIGN.md hard rule 1 (structural enforcement); Nielsen #4 consistency | Use `hsl(var(--gold))` (already the button's base text token) or a brightened alias for hover; never the `--primary` alias as text |
| Minor | detector | `aphoristic-cadence` — detector evidence verbatim: `5 aphoristic constructions: "AM ET Game: Aug 3, 1:35 PM ET See the complete record How it works Three steps."` The staccato pairs ("Three steps. No checkout, no bot." / "Every pick. Full record.") fire the rule. Register justification: this copy is JOURNEY.md's locked Phase-3 final copy which DW-MOCK-F.4 requires verbatim — the mock cannot alter it, and the clipped declarative voice is the stated proof-forward register. Resolves to Minor. | ai-tells.md copy tells (Impeccable `aphoristic-cadence`); severity/context model | No mock change. If desired, revisit cadence density in a content-design pass on JOURNEY.md itself |
| Minor | usability | Chart SVG `aria-label` hardcodes "from 0 to +18.4 units" and goes stale after a range switch; scrub is pointer-only with no keyboard path to per-day values (the summary label partially mitigates). | Nielsen #1 visibility of system status; WCAG Perceivable/Operable | Update the label on `render()`; add left/right-arrow scrub when the chart has focus at build time |
| Minor | usability | Theme toggle button reads "Theme" with `aria-pressed` only — the label conveys neither current state nor target state. Demo-only control per its own comment. | Nielsen #1; Norman: signifiers | Label "Dark" / "Light" (target state) or an icon + accessible name at build |
| Minor | visual | Wordmark swap uses two `<img>`s with hardcoded `../public/…` paths rather than the `--wordmark-asset-light/-dark` aliases hard rule 5 names for implementation. The swap behavior itself is correct (ink SVG light, cream SVG dark; both files verified present). Mock-acceptable; the alias mechanism is an implementation-time requirement. | DESIGN.md hard rule 5 (asset-alias clause) | Adopt the CSS aliases when this moves into the app |

**Distinctiveness criterion (ai-tells CHECKER):** PASS. Direction nameable in 2–3 words: "gilt ledger" (private-bank warm neutrals, one flat gold, terminal mono numerals). Choices a generic system wouldn't make: the −4.6° rising edge keyed to the wordmark blade's measured angle (`--edge-angle` token, one per page, draw-in once); the inverted ink-fill CTA button on the gold band; Archivo × Spline Sans Mono with mono reserved for data; hairline-not-shadow elevation; asymmetric 1.15fr/0.85fr hero grid. No default-shadcn card grid, no nested cards, no purple triplet, no Inter. Not indistinguishable from generic output.

**Chart honesty (via DW heuristic):** zero baseline structurally guaranteed — `min = Math.min(0, …)`, `max = Math.max(0, …)` (lines 537–538), so the axis always includes 0; `--hairline` zero line repositioned per range; no truncation; the sample data includes a real dip (+11.0 → +3.2). Range tabs are real `<button role="tab">` in a `role="tablist"` with roving tabindex + arrow keys, 44px min-height, active = `--gold` fill + `--gold-ink` text + 1px `--ring` border (Cairo 2019 axis rule honored; hard rules 2–3 honored).

## Requirement Fulfillment

### DW-MOCK-F.1
PREMISE:  "mocks/join.html is self-contained and uses NO hard-coded hex outside the token custom-property definitions; all rendered color routes through the DESIGN.md tokens."
EVIDENCE: Regex sweep for `#[0-9a-fA-F]{3,8}` finds hex ONLY inside the `:root`/`.dark` token blocks (lines 16–85), and every one is inside a CSS comment — the token values themselves are HSL triples matching DESIGN.md's app token block verbatim. Every color property in the stylesheet is `hsl(var(--token))` (spot-verified: body, hairlines, chart stroke `hsl(var(--gold))`, tabs, band, footer). Single file with inline CSS + JS; only externals are the DESIGN.md-mandated Google Fonts `@import` (exact line from the fonts adoption note) and the two wordmark SVGs, both verified present at `public/edgeable-wordmark*.svg`.
VERDICT:  PASS

### DW-MOCK-F.2
PREMISE:  "both themes present and functional (system preference + toggle); per-theme wordmark asset swap per DESIGN.md hard rule 5."
EVIDENCE: `.dark` token block redefines all tokens (lines 53–88) with `color-scheme` set per theme. Script (lines 490–503) applies `.dark` from `matchMedia('(prefers-color-scheme: dark)')`, listens for changes (deferring to the user once toggled), and the toggle flips the class + `aria-pressed`. Wordmark: light theme shows `edgeable-wordmark-ink.svg`, dark shows `edgeable-wordmark.svg` via `.dark .wordmark .wm-light { display:none }` swap — correct asset-to-theme mapping per hard rule 5 (ink on light, cream on dark). Minor: hardcoded paths instead of the `--wordmark-asset-*` aliases (implementation-time clause; see findings).
VERDICT:  PASS

### DW-MOCK-F.3
PREMISE:  "exactly one rising-edge diagonal per viewport, at −4.6°, per the DESIGN.md motif usage spec; all other rules/dividers horizontal."
EVIDENCE: Exactly one `.rising-edge` element in the document (hero, line 343), rotated `var(--edge-angle)` = `-4.6deg` (line 99, the wordmark blade angle: atan(41.1/514) = 4.57° ≈ 4.6°), 4px `--gold`, `border-radius: 2px` round caps, rising left-to-right (negative CSS rotation), 650ms draw-in once inside `prefers-reduced-motion: no-preference`, rendered complete under reduce. All other dividers are horizontal 1px `--hairline`/`--border` borders (`header.site` border-bottom, `.hairline-top` on sections 2–4, footer border-top). The chart line is the DESIGN.md-sanctioned second permitted appearance (motif spec item 2) and is data, not decoration; no second decorative diagonal exists.
VERDICT:  PASS

### DW-MOCK-F.4
PREMISE:  "all six sections in JOURNEY.md /join spec order with the final copy verbatim (spot-check at least the hero, tamper-evidence body, 3-step copy, CTA, legal footer); zero em dashes in rendered copy."
EVIDENCE: Section order 0→6 matches the spec (header, record hero, chart, free picks, how it works, `#join-cta` gold band, legal footer). Spot-checks all verbatim against JOURNEY.md: hero headline "Every pick on record. Before the game starts." + full subhead; tamper body word-for-word incl. "The W-L record, net units, and ROI are always public."; all three step headings/bodies incl. "Payment info is shown in-app after you create your account…"; CTA "Join Edgeable", price "$30/month", value description, reassurance microcopy; all three legal paragraphs + Terms/Privacy/Verify-the-record links + "Edgeable 2026". Em-dash sweep: every `—` in the file is in an HTML/CSS comment or the `<title>`; the rendered page copy contains zero (negative values use proper U+2212 minus). The `<title>` em dash is browser chrome, not page copy — noted below as non-blocking.
VERDICT:  PASS

### Heuristic (hard rules 1–4 + chart)
PREMISE:  "DESIGN.md hard rules 1–4 honored in the markup/CSS (no light-theme gold text at accent-9; ink on gold everywhere incl. CTA band; ring border on light gold fills; text-safe --loss/--win for text). Chart: zero baseline present, no axis truncation, range tabs are real role=tab buttons."
EVIDENCE: Rule 1 — every gold-colored text on page surfaces uses `--primary-text` (stat labels, tamper link, hero anchor, picks link, step links, login/footer hovers); no `--gold`/`--primary` text appears on light backgrounds. (Exception examined: CTA button text is `--gold` on the `--gold-ink` button face — 9.63:1 both themes, the JOURNEY §5 inverted-button treatment; the `:hover` use of the `--primary` alias is a Minor token-discipline finding, not a contrast defect.) Rule 2 — `#join-cta` sets `color: hsl(var(--gold-ink))`; eyebrow overridden to gold-ink; reassurance inherits gold-ink; active range tab is `--gold` fill + `--gold-ink` text; no muted/secondary color appears on the band. Rule 3 — active tab (the page's only interactive gold fill) carries `border: 1px solid hsl(var(--ring))`; band itself exempt per DESIGN.md's stated clarification; CTA button is an ink fill, no ring required. Rule 4 — `.stat-pos`/`.chart-stat.pos|.neg`/`.result-badge.w|.l` use `--win`/`--loss` text tokens; no `--destructive`/`--success` fills anywhere; W/L badges pair color with the letter glyph ("W · Win", "L · Loss"). Chart — zero baseline structurally forced into range (`Math.min(0,…)`/`Math.max(0,…)`), `--hairline` zero line drawn, axis never truncated to data; range tabs are four real `<button role="tab">` in `role="tablist"` with `aria-selected`, roving tabindex, arrow-key navigation, 44px min-height.
VERDICT:  PASS

**All requirements met:** YES

## Notes (non-blocking)
- **No screenshot** — browser MCP down; this is a structure + computed-values critique. Pixel-level verification (webfont fallback rendering, rising-edge clipping at narrow widths, actual rendered contrast) remains open; capture with the browser MCP before final sign-off.
- `<title>` "Edgeable — Every pick on record" contains an em dash. Browser-chrome metadata, not page copy, so not counted against DW-F.4 — but given the standing no-em-dash preference, retitle (e.g. "Edgeable: Every pick on record") at build.
- Mid-scroll desktop viewports can show the hero rising edge and the chart line simultaneously; DESIGN.md's motif spec permits both appearances and the chart line is data — no violation, flagged for awareness.
- Dark-theme active range tab border resolves to gold-on-gold (invisible) — harmless; DESIGN.md says dark needs no border.
- Free-pick timestamps hardcode plausible sample data; loading/error/empty states are specced in JOURNEY.md but not demonstrated in the mock — not a DW requirement for this artifact.

**Verdict: PASS**
