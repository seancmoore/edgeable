# Design Review: Edgeable /join landing — wireframe mock

## Rendered Evidence (Step 0)
- Screenshot: none — browser MCP unavailable; structure-level critique only. Pixel-level spacing/contrast/rhythm unverified. Run the browser MCP to capture pixels before build sign-off.
- Surface: `C:\Users\panky\Desktop\edgeable\mocks\join.html` — single-page greyscale wireframe for `/join`, mobile-first 390px column with a ≥900px desktop widening, 6 annotated sections (record hero, units chart, free-pick samples, how joining works, price + CTA, legal footer).

## Assessment B — Deterministic Detector
- Command: `node scripts/detect.mjs C:\Users\panky\Desktop\edgeable\mocks\join.html > .design-foundations\build\detect.json`
- Exit: 0 (ran; status "ran", 16 rules)
- Findings: 3 — `hero-eyebrow-chip` (high, 1), `repeated-section-kickers` (advisory, 1), `em-dash-overuse` (medium, 1)
- Opened only after Assessment A findings were frozen: YES

## Triage
- Baseline (always-on): visual (`design-dna`/`checklists`, `ai-tells` CHECKER) + `usability` (Nielsen 10, UX laws)
- Dispatched: `journey` (a `/join` landing funnel is a persuasion spine through time); `behavioral` + `deceptive-patterns` lite check (pricing/CTA conversion block — is the persuasion honest?)
- Not applicable: `content-design` (copy is bracketed placeholder annotation, not real copy — deferred to the copy phase); `data-viz` (the chart is an explicit aria-hidden placeholder with no data encoding to adjudicate yet)
- Deferred: none beyond the above

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Major | journey | The ONLY call to action is at the bottom of section 5. The hero carries no CTA and no in-page path to it; a user convinced by the record must scroll the entire page to act. | Persuasion spine: hero = value prop + primary CTA (StoryBrand SB7 / journey doctrine §G); Shapiro conversion equation — added scroll = Labor; Fitts's law (1954) on target distance | Add a secondary CTA (or anchor link to the price box) in the hero; consider a repeat CTA after the free-pick proof section |
| Major | usability | Range tabs (`Week/Month/3M/All`) are plain `<span>`s inside a `div[aria-label="Range tabs"]` — no `button`/`role="tab"`, not focusable, keyboard-inoperable. The wireframe encodes them as non-interactive, so the build will inherit the wrong semantics. | Norman: signifiers/affordances (1988/2013); WCAG 2.1 Operable (keyboard); Nielsen #4 consistency & standards | Mark them as `<button>`s (or `role="tablist"`/`tab`) in the wireframe so the structural intent is correct; 44px min-height is already right (Fitts) |
| Minor | visual | `.hero-grid` two-column desktop layout is defined in CSS (line 236) but never used in the HTML — at ≥900px the hero renders as one 960px-wide column with the 3-stat row stretched full width. Declared desktop intent is unwired. | Ch 5: canvas/container proportions intentionally chosen; dead structure is an unmade layout decision | Either apply `.hero-grid` to the hero markup or delete the rule and accept the single-column desktop hero explicitly |
| Minor | detector | `em-dash-overuse` — detector evidence: "17 em-dashes in body copy". Nearly all sit inside bracketed placeholder annotations, but placeholder tone tends to leak into final copy. | ai-tells.md copy tells (Impeccable `em-dash-overuse`): density is the tell | When real copy is written (content-design phase), restructure with periods/commas; do not inherit the annotation cadence |
| Minor | detector | `hero-eyebrow-chip` (high) — detector evidence: eyebrow "1 · Record hero" above `<h1>`; and `repeated-section-kickers` (advisory) — "3 section kickers". Register justification: these are numbered wireframe annotation labels (dashed-border `.label` chips, explicitly throwaway per the banner), not a designed eyebrow-chip aesthetic. Resolved down from shipped severity. | ai-tells.md `hero-eyebrow-chip` / `numbered-section-markers`; Ch 2: wireframes deliberately rough — annotation is functional here | Strip all `.label` chips when producing the designed mock; if any survive into DESIGN.md-fidelity output, the detector hit regains its High severity |
| Minor | usability | The CTA is a `<button>` with no destination; hero "Log in" and footer links are `href="#"`. Acceptable at wireframe fidelity, but exits/next-page are part of a sound page spec. | Journey doctrine §F page spec (exit/next page); Nielsen #7 flexibility & efficiency | Annotate intended destinations (e.g. `→ /signup`) in the wireframe so the flow is testable |

Honesty check (behavioral / deceptive-patterns) — passes cleanly at structure level: no fake urgency/scarcity, a losing pick is shown ("Result: L — shown honestly"), the manual CashApp/Zelle payment process is disclosed before the CTA, one price with "cancel anytime", tamper-evidence line links to independent verification (`/card`). This is honest-mechanism persuasion (behavioral doctrine; deceptive-patterns ban-list — no hits).

Structural strengths worth keeping: semantic landmarks (`header/main/section[aria-label]/footer`), single `h1` with logical h2/h3 hierarchy (Ch 4), 44–48px touch targets on tabs and CTA (Fitts), `prefers-reduced-motion` guard, W/L results as text not color (Ch 8 redundant cues), 21+/not-a-sportsbook legal footer, section order hero→proof→samples→how-it-works→price→legal is a coherent proof-forward persuasion spine.

## Requirement Fulfillment

### DW-MOCK.1
PREMISE:  "the mock renders a viewable surface for the `/join` page."
EVIDENCE: Structure-level (no screenshot — MCP down): the file is a complete, self-contained HTML document — valid doctype, embedded CSS only, no external dependencies, no scripts required. Every section produces visible rendered content (wireframe banner, header, 6 labeled sections, inline SVG chart placeholder, price box, footer). Nothing is hidden, zero-height, or dependent on JS. It renders as a viewable single-column wireframe in any browser via `file://`.
VERDICT:  PASS (pixel confirmation pending — see Notes)

### DW-MOCK.2
PREMISE:  "wireframe structure is sound (this is a greyscale wireframe checkpoint — no DESIGN.md tokens exist yet)."
EVIDENCE: Greyscale-only palette (11 grey/white tokens, no hue), semantic sectioning with aria-labels, single h1 + logical heading hierarchy, mobile-first 390px column with an intentional ≥900px widening, ≥44px touch targets, honest-persuasion section order matching the marketing spine, states annotated (posted timestamps, W and L results, reassurance microcopy slot). Defects found are Major-or-below (missing hero CTA path, span-based tabs, unwired `.hero-grid`) — none breaks the structure.
VERDICT:  PASS

**All requirements met:** YES

## Notes (non-blocking)
- **Missing pixel evidence:** no screenshot was available (browser MCP down). Contrast, spacing rhythm, and rendered hierarchy are unverified; this review is structure-level. Capture pixels before treating the checkpoint as fully verified.
- **Distinctiveness (ai-tells CHECKER):** the surface is deliberately generic greyscale — that is the declared fidelity of this checkpoint ("wireframes deliberately rough," Ch 2), so the no-aesthetic-direction Critical is not applied here. It WILL apply, in full, to the first DESIGN.md-token mock: system-ui + greyscale + card rows must not survive into the designed surface.
- The desktop `.picks-grid` puts the honest loss card third of three — fine, but keep the loss visible above the fold of that section when designed.
- Chart placeholder: at build time the equity curve needs a labeled axis/baseline and truthful scaling (data-viz doctrine, deferred here since no data is encoded yet).
- Inline `style=""` attributes (3 occurrences) — harmless at throwaway fidelity; tokenize in the designed mock.

**Verdict: PASS**
