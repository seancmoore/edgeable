# Design Review: Edgeable /join landing — Dusk Ledger mock

## Rendered Evidence (Step 0)
- Screenshot: none. Browser MCP down per dispatch; structure-level critique only (HTML source, tokens, computed values).
- Surface: `mocks/join.html` — single self-contained page, desktop-first, light + dark themes, 7 blocks (header, record hero, chart, free picks, how-it-works, price/CTA, legal footer).

## Assessment B — Deterministic Detector
- Command: `node scripts/detect.mjs C:\Users\panky\Desktop\edgeable\mocks\join.html > .design-foundations\build\detect.json`
- Exit: 0 (ran)
- Findings: 3 — `nested-cards` (high, line 617), `overused-font` (medium, line 13), `aphoristic-cadence` (medium)
- Opened only after Assessment A findings were frozen: YES

## Triage
- Baseline (always-on): visual (design-dna + ai-tells CHECKER) + usability (Nielsen 10, severity scale)
- Dispatched: data-viz signal present (equity-curve chart with zero baseline, range tabs) — judged against the chart-truthfulness items in the dispatch heuristic and JOURNEY.md's Cairo citation; behavioral/deceptive-patterns signal present (conversion surface, pricing) — spot-checked for honesty (no urgency/scarcity manipulation found; the dip is drawn; the manual process is disclosed pre-CTA)
- Not applicable: journey-as-doctrine (single page, no multi-page flow rendered), ai-native
- Deferred: none

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Major (unverified — no pixels) | usability | Mobile stat-row overflow risk: `.stat .num` keeps `white-space: nowrap` at 31px Spline Sans Mono under 900px; "61-42-3" is ~7 mono glyphs ≈ 125–135px, but a 360px viewport yields ~96px per tile (320px content − 32px gaps ÷ 3). Likely clipping/overflow of the core proof numbers on narrow phones — the exact element JOURNEY.md says must be visible above the fold. | Medium–form fit (ch03); Nielsen #8 aesthetic & minimalist design (content must survive its container) | `clamp()` the mobile stat size or drop `nowrap` below ~420px; verify on a 360px render when the browser MCP is back |
| Minor | usability | Sections 2, 3, 5 have no heading elements — the visual headings are `<p class="eyebrow">`. Screen-reader heading outline jumps h1 → h2 (tamper aside) → h2 (How it works). `aria-label` on each `<section>` mitigates landmark nav but not the heading map. | WCAG 1.3.1 Info and Relationships; Nielsen #4 consistency | Promote the eyebrow (or the `.sub` line) in sections 2/3/5 to `<h2>` styled identically |
| Minor | usability | Range tabs implement roving tabindex + arrow keys (good) but no `aria-controls`/`tabpanel` linkage to the chart region. | ARIA APG Tabs pattern; Nielsen #4 | Add `aria-controls` to each tab and `role="tabpanel"` on `.chart-wrap` at build |
| Minor | detector + visual | Detector: `overused-font "Inter" as a primary face` (line 13, medium). Assessment A independently flagged the same. Register-justified: DESIGN.md pins "Inter-class neutrality" from the Refero Portal reference with stated rationale, and the grotesque × Spline Sans Mono collision is the declared type tension. Justification stated → severity resolves to Minor per the ai-tells severity/context model. | ai-tells.md Typography Tells + Decay Doctrine (register-legitimate when justified) | None for the mock; re-examine only if the Portal grounding is ever dropped |
| Minor | detector + content | Detector: `aphoristic-cadence — 5 aphoristic constructions` (e.g. "Three steps. No checkout, no bot." / "Every pick. Full record."). Real tell in isolation, but the copy is JOURNEY.md final copy verbatim — a DW-R.4 contract; the terse declarative voice is the proof-forward register. | ai-tells.md Copy Tells; DW-MOCK-R.4 verbatim contract | Not fixable in the mock without breaking DW-R.4; route to a content-design pass on JOURNEY.md if the cadence is judged too thick |
| Note | detector | Detector: `nested-cards — <a class="cta-btn"> is a card inside a card ancestor` (high, line 617). False positive by inspection: the flagged node is the pill CTA button inside the price panel — a button, not a card — and Section 5's spec (DESIGN.md §Space/shape/depth) mandates exactly this composition. No card-in-card exists elsewhere; pick cards, steps, chart card are all single-level. | ai-tells.md Layout Tells (nested cards), resolved via the severity/context model | None |
| Note | visual | Wordmark swap works via two `<img>` elements with hardcoded `../public/...` paths; the `--wordmark-asset` alias is defined per DESIGN.md hard rule 5 but unused. Functional for the mock; the rule says components reference the alias, never a hardcoded path. | DESIGN.md hard rule 5 | At build, drive the swap off `--wordmark-asset` (background-image or CSS content) |
| Note | visual | Demo theme toggle carries a 1px `--input` border (hairline on a non-input control). Mock chrome only, explicitly outside the page spec. | DESIGN.md depth system (no hairline borders) | None — excluded from the shipped page |

**Distinctiveness (ai-tells CHECKER, always-on):** PASS. Direction nameable in 2–3 words: "twilight editorial ledger." Choices a generic system wouldn't make: an amber→rose→violet dusk gradient (not purple-to-blue — the light-theme hero hues are h38/h23/h270 pastels), elevation via a 5px near-neutral glow ring instead of an opacity-0.1 shadow stack, mono proof numerals as the dominant voice, and gold restricted to interactive elements only. Not indistinguishable from default AI output.

## Requirement Fulfillment

### DW-MOCK-R.1
PREMISE:  "mocks/join.html self-contained; zero hard-coded hex outside the token custom-property blocks."
EVIDENCE: Single file: all CSS in one inline `<style>`, all JS in one inline `<script>`; only external references are the DESIGN.md-mandated Google Fonts `@import` (line 13, exact spec line) and the wordmark SVGs (`../public/edgeable-wordmark*.svg` — verified present on disk). Hex grep over the whole file: every `#xxxxxx` occurrence sits inside the `:root` / `.dark` / prefers-color-scheme token blocks, and all of them are inside comments only — zero functional hex anywhere; every applied color is `hsl(var(--token))` (the two raw `hsl()` values live inside the `--elev-ring` custom property, i.e. inside the token block).
VERDICT:  PASS

### DW-MOCK-R.2
PREMISE:  "DESKTOP-FIRST: the 1200px desktop composition is the base stylesheet (not a mobile stylesheet scaled up); layout is calm/centered per DESIGN.md (no magazine asymmetry); mobile degrades via media query."
EVIDENCE: Base (unqualified) rules ARE the desktop composition: `.container { max-width: 1200px }` (line 192), hero `grid-template-columns: 7fr 5fr` (line 251), picks/steps `repeat(3, 1fr)` (lines 333, 358), 76px hero stat, 112px section rhythm. The single `@media (max-width: 900px)` block (lines 413–432) only overrides downward (1-col grids, smaller type, 64px rhythm). Calm/centered: centered 1200px column, `.section-head { text-align: center }`, equal gutters, centered price panel — no offset headers, no unequal gutters. The hero's 7fr/5fr two-column grid is JOURNEY.md's explicit desktop variant ("record left, tamper callout right"), not magazine asymmetry.
VERDICT:  PASS

### DW-MOCK-R.3
PREMISE:  "both themes functional (system preference + toggle); the dusk gradient hero honors DESIGN.md's text-on-gradient law (only --foreground/--primary-text/--muted-foreground directly on the gradient; anything else on a ≥85% card scrim); per-theme wordmark swap."
EVIDENCE: System preference: `@media (prefers-color-scheme: dark) { :root:not(.light) { …dark tokens… } }` (lines 113–154). Toggle: fixed button cycles system→dark→light by setting `.dark`/`.light` on `<html>` (lines 645–656); `.dark` class block mirrors the media block. Text-on-gradient audit — every text node inside `.dusk`: "Log in" link `--primary-text`; h1 `--foreground`; subhead `--muted-foreground`; pending eyebrow `--muted-foreground`; stat numerals `--foreground`; stat labels `--muted-foreground`; hero anchor `--primary-text`; wordmark = the theme-correct SVG assets per hard rule 5. Everything else (tamper callout heading/body/link) sits on `.tamper { background: hsl(var(--card) / 0.92) }` — a 92% ≥ 85% card scrim, judged as text-on-card (5.92:1 light link per DESIGN.md report). Gradient dissolves to `--background` at the 100% stop (line 225). Wordmark swap: `.wm-light`/`.wm-dark` imgs toggled by both the `.dark` class selectors and the prefers-color-scheme media path (lines 233–239), so the swap tracks system AND toggle. (Note: hardcoded img paths rather than the `--wordmark-asset` alias — functional, flagged as a build-phase note above.)
VERDICT:  PASS

### DW-MOCK-R.4
PREMISE:  "all six sections in JOURNEY.md order with final copy verbatim; zero em dashes in copy/title/aria."
EVIDENCE: Order matches JOURNEY.md exactly: 0 header (wordmark + "Log in") → 1 record hero → 2 performance chart → 3 free picks → 4 how it works → 5 price+CTA (`id="join-cta"`) → 6 legal footer. Copy diffed against JOURNEY.md verbatim: headline, subhead, stat labels ("W-L-P" | "Net Units" | "ROI"), pending eyebrow pattern, tamper-evidence heading + full body + "Verify the archive yourself", hero anchor "Join for $30/mo. See how it works.", chart eyebrow/subhead/"+18.4 units"/tab labels 1W|1M|3M|All (default All), free-picks subhead + framing note + "See the complete record", all three step headings/bodies + reassurance note, "EDGEABLE MEMBERSHIP"/$30//month/value description/"Join Edgeable"/CTA reassurance line, all three legal blocks + Terms|Privacy|Verify the record + "Edgeable 2026" — all match. Em/en-dash grep over the entire file (—, –): zero matches, including `<title>` and both aria-label strings.
VERDICT:  PASS

### DW-Heuristic
PREMISE:  "DESIGN.md rules honored — gold ONLY on interactive elements (no gold bands/floods), pill buttons + 24px-class card radii + glow-ring depth (no hard hairline borders except the chart zero baseline), light-theme gold fills carry the ring border and gold text uses --primary-text, chart truthful (zero baseline, no truncation, real role=tab buttons, touch-action pan-y)."
EVIDENCE: Gold usage exhaustive: active range tab (interactive), CTA pill (interactive), chart curve stroke (`--gold`, explicitly "Unchanged/legal" in DESIGN.md's supersession map), `--accent` tint on the Free-pick badge (named legal small highlight). No gold bands — Section 5 is the centered `--card` panel; the gold band is retired as specced. Shapes/depth: tabs + CTA + step numbers + toggle all `--radius-pill`; cards `--radius-card` 24px; tamper + price panels `--radius-panel` 28px; every elevated surface uses `box-shadow: var(--elev-ring)` — no border-based card edges anywhere. Border inventory: transparent tab borders, active-tab + CTA `1px hsl(var(--ring))` (that IS hard rule 3 — in dark, `--ring` = `--gold` so it blends into the fill), the demo toggle's `--input` border (mock chrome, excluded), and the SVG `line.zero-baseline` in `--hairline` — the one permitted information-bearing hairline. Gold text: global `a { color: hsl(var(--primary-text)) }`; no `--primary`-as-text anywhere; CTA/tab text is `--gold-ink` on the fill per hard rule 2. Chart truthful: baseline drawn at y=310 with the curve origin M0 310 on it (zero included, axis not truncated to data); the mid-July dip is present in the path data (y rises to ~219 around x≈620) and named in the SVG `aria-label`; four real `<button role="tab">` in a `role="tablist"` with roving tabindex + ArrowLeft/Right handling; `svg { touch-action: pan-y }` (line 316). `prefers-reduced-motion` kills the draw-in and renders the curve complete.
VERDICT:  PASS

**All requirements met:** YES

## Notes (non-blocking)
- **No screenshot available — structure-level critique only; pixel-level contrast/spacing/hierarchy unverified.** The token math is contract-verified (DESIGN.md's palette.mjs + contrast-2b reports), but actual rendered rhythm, the gradient dissolve seam, and the mobile stat fit need a browser-MCP capture. The Major mobile-overflow finding above is a computed suspicion, not an observed defect.
- The mock shows only default states; loading/error/empty/signed-in states from JOURNEY.md are unmocked (not required by any DW item — build-phase scope).
- Tabs do not switch chart data (declared mock-level; fine for a mock).
- Two consecutive uniform 3-card grids (picks, steps) are both spec-mandated layouts; presentation still varies page-wide (asymmetric hero grid, full-width chart card, centered panel), so the identical-card-grid tell does not fire at page level.

## Verdict: PASS

Both assessments ran in isolation and were synthesized after freezing. Detector hits: 1 false positive (nested-cards on a pill button), 2 register-justified Minors (Inter per the Portal pin; aphoristic cadence locked by the verbatim-copy contract). No DW item lacks evidence, no visible contrast/token/spec violation, no listed edge cases in the dispatch prompt, no Critical principle violation, distinctiveness passes CHECKER mode.
