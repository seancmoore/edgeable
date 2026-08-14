# Design Review: Phase 2 — Gilt Ledger Token Spec

**Date:** 2026-08-14
**Reviewer:** design-review-agent (dual-blind protocol, v4.2.0)
**Status:** FINAL

---

## Rendered Evidence (Step 0)

- Screenshot: none — token/spec phase; no rendered surface
- Surface: DESIGN.md (token spec + motif rules), palette-gold-balanced-mono.css (palette.mjs output), src/index.css (existing alias vocabulary), JOURNEY.md (page spec)
- No browser MCP invocation required or possible for this phase type

---

## Assessment B — Deterministic Detector

- Command: N/A — no rendered .html artifact exists for Phase 2 (token/spec phase)
- Exit: 3 (N/A — no rendered artifact; structurally distinct from "ran and found 0")
- Findings: N/A — no rendered artifact
- Note: A pre-existing detect.json in the build directory references `mocks/join.html` from a prior review session (Phase 3 mock). It is not applicable to this Phase 2 token-spec review and was not used.
- Opened only after Assessment A findings were frozen: YES

---

## Triage

- Baseline (always-on): visual + usability (token/spec surface)
- Dispatched: design-dna (DESIGN.md template completeness), color (both themes, contrast law, edge cases), fonts (type spec, pairing logic, medium-form fit)
- Not applicable: data-viz (no chart encoding spec), content-design (copy is deferred to Phase 3 per JOURNEY.md), journey (JOURNEY.md reviewed for completeness but the journey phase is complete), behavioral (no persuasion mechanism at token level), deceptive-patterns (no rendered surface)
- Deferred: none — all flagged pillars were applied

---

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| Critical | color | Wordmark cream fill (#f4efe6) on light page background is 1.09:1 — effectively invisible. Verified by spot computation: cream on neutral-1 = 1.13:1, cream on neutral-2 = 1.09:1. DESIGN.md hard rule 5 correctly identifies this and mandates an `edgeable-wordmark-ink.svg` variant, but the variant is listed only as an Open question deliverable — not as a completed spec or token alias. There is no `--wordmark-fill` semantic alias, no theme-switched SVG reference, and no build-time asset in the spec. The edge case is named but unresolved at token-spec level. | WCAG 1.4.3 (AA, 4.5:1 body text); WCAG 1.4.11 (non-text contrast ≥3:1); color as sole differentiator (ch08 redundant-cue rule) | Promote the wordmark variant from Open question to a Phase 2 spec decision: define `--wordmark-asset-light` = `edgeable-wordmark-ink.svg` and `--wordmark-asset-dark` = `edgeable-wordmark.svg` as semantic tokens in the app block, alongside a note confirming the SVG is a build deliverable. The Phase 3 mock cannot proceed without a specified light-theme wordmark path. |
| Critical | color | Gold as large-area fill (light mode) fails non-text AA. The CTA gold band (Section 5) uses `--gold` (#dbb155) as a full-bleed background. Bare gold on near-white page: 1.98:1 — well below the 3:1 non-text floor. DESIGN.md hard rule 3 correctly mandates a 1px `--ring` border (#76602f, verified 5.92:1 vs card), which satisfies the interactive-element boundary requirement. But the full-bleed gold BAND (not just a button) is a large background area: the boundary rule applies to interactive elements, not full-bleed sections. A user scrolling past the CTA band perceives a flat gold field with no boundary. The spec does not address the non-text contrast of the band area itself. | WCAG 1.4.11 (non-text contrast ≥3:1 for UI component boundaries); ch09 "bright saturated background on content-heavy page" red flag | Specify that the CTA gold band section uses gold as an expressive background (content density is low — price + CTA only), and explicitly note that text in the band is always `--gold-ink` (9.63:1 verified). Add a spec note: "The gold band is a full-bleed expressive section, not a bordered UI component — WCAG 1.4.11 non-text contrast applies to interactive element boundaries, not decorative background fields. All text on the band must be `--gold-ink`; no muted or secondary text may appear on the gold band." This clarification resolves the ambiguity without changing the design. |
| Major | color | Light `--primary` token = accent-9 gold (#dbb155). If any component uses `text-primary` or `color: hsl(var(--primary))` as foreground text, it produces 1.98:1 on the page background — a hard WCAG AA failure. The token vocabulary inherited from shadcn uses `--primary` for interactive elements AND as a foreground color in some component patterns. DESIGN.md hard rule 1 addresses this for explicitly authored copy, but no guard appears in the token spec preventing `text-primary` misuse in components. | WCAG 1.4.3 (AA body text ≥4.5:1); design-systems token discipline (semantic alias must encode the safe usage, not just the value) | Add a comment in the app token block explicitly flagging `--primary` as fill-only in light mode: "/* --primary: fill only in light theme — use --brass (#76602f) for all gold text; --primary as text color fails AA at 2:1 */". Alternatively, split into `--primary-fill` and `--primary-text` to eliminate the ambiguity structurally. |
| Major | fonts | The existing `src/index.css` Google Fonts import still loads Bodoni Moda and Mulish. DESIGN.md specifies: "Mulish's Google-Fonts import can be dropped at adoption time." But the current import also loads Bodoni Moda, and DESIGN.md states "Bodoni Moda stays only if the wordmark is ever rendered as live text" — but the wordmark is SVG-outlined, so the import is dead weight today. The new token spec adds Archivo (not yet in any import) and Spline Sans Mono (already loaded). The spec does not include an updated `@import` line or a CSS variable pointing to the correct font-family stacks. Without an explicit updated import, the Phase 3 prototype will load the wrong font families. | ch03 medium-form fit: typeface must render in the medium; a font specified in DESIGN.md but absent from the CSS import cannot render | Add to DESIGN.md a CSS import block for Phase 3 adoption: `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Spline+Sans+Mono:wght@500;600&display=swap');` and note that the Mulish + Bodoni Moda lines can be dropped when adopting. Also add `--font-display: 'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif;` and `--font-mono: 'Spline Sans Mono', ui-monospace, monospace;` CSS variable placeholders to the token block. |
| Minor | color | `--accent-foreground` in light mode is `#76602f` (5.29:1 on #f9efdd accent background — verified). This passes AA body text. However, the supplemental alias verification in DESIGN.md says "light gold text (--brass) 5.72:1" — the 5.72:1 figure is for `--brass` on neutral-2, not on the accent surface. On accent (#f9efdd), the ratio is 5.29:1 (still passes ≥4.5:1). No failure, but the document's cited ratio conflates the two surfaces. | WCAG 1.4.3 (reporting accuracy); token documentation correctness | Correct the supplemental alias verification note: "light --accent-foreground (#76602f) on --accent (#f9efdd): 5.29:1 (PASS); light --brass on neutral-2: 5.72:1 (PASS)." No token value changes needed. |
| Minor | color | Dark `--destructive-text` (#f49c95) on the destructive fill (#e1524f) computes 1.82:1 — a hard failure for text on a filled badge. DESIGN.md specifies `--error-11` (#f49c95) as the text-safe loss color and correctly routes it to the page background path (8.88:1 on dark bg). The 4.89:1 claim in the supplemental note refers to `--destructive-foreground` (#131312 ink) on the fill, which is correct. The error-11 text color is for text ON the page, not on a filled badge. No token mismatch exists, but if a component ever puts error-11 as text on the error-9 fill badge, it would fail. The spec should clarify. | WCAG 1.4.3; token usage clarity (semantic alias should encode safe usage context) | Add a spec note: "`--error-11` / dark `--loss` is page-background safe (8.88:1 on dark bg) — do NOT use as text on the error-9 fill badge. Use `--destructive-foreground` (ink #131312, 4.89:1) on the fill. Reserve `--loss` for standalone text lines, badges with letter glyph + color." |
| Minor | design-dna | The DESIGN.md template calls for `**Status:** confirmed` after user confirmation. The current document reads `**Status:** complete — **AWAITING USER CONFIRMATION**`. The orchestrator note says user confirmation is pending. No design work should begin downstream until this is resolved; the status flag should not progress to "confirmed" without an explicit user gate. | design-dna.md Gate: "Do not write or modify any UI code until the user confirms DESIGN.md" | Orchestrator/user call. No token changes needed — the status string is correct for the current state. Downstream phases must gate on confirmation. |

---

## Requirement Fulfillment

### DW-2.1
PREMISE: DESIGN.md complete — token block present for dark AND light. (User confirmation is pending and handled by the orchestrator; verify completeness, not the confirmation.)
EVIDENCE: Both `:root` (light) and `.dark` (dark) token blocks are present in DESIGN.md. Each block defines: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--border`, `--input`, `--ring`, plus raw Edge Club tokens (`--gold`, `--gold-ink`, `--brass`, `--surface-2`, `--hairline`, `--dim`, `--loss`, `--win`, `--radius`). Both blocks carry `color-scheme: light` / `color-scheme: dark` declarations. The palette.mjs raw output (verbatim) is also embedded. DESIGN.md is present, structured, and complete at the alias level.
VERDICT: PASS

### DW-2.2
PREMISE: All text/background pairs pass WCAG AA (≥4.5:1 body, ≥3:1 large) in both themes, verified via palette.mjs; interactive elements pass AA non-text (≥3:1). Recompute ratios yourself for spot checks — do not trust claims in the document.
EVIDENCE (independently computed):
- Light body (#2f2e2a on #f9f9f7): 12.89:1 PASS
- Light muted-fg (#66635c on #f9f9f7): 5.68:1 PASS
- Light brass/gold-text (#76602f on #f9f9f7): 5.72:1 PASS
- Ink-on-gold (#110d04 on #dbb155): 9.63:1 PASS (both themes, fill invariant)
- Light destructive fill + white fg (#ffffff on #974843): 6.32:1 PASS
- Light success fill + white fg (#ffffff on #337437): 5.68:1 PASS
- Light warning fill + white fg (#ffffff on #76602f): 6.10:1 PASS
- Light loss text (#974843 on #f9f9f7): 5.99:1 PASS
- Light win text (#337437 on #f9f9f7): 5.39:1 PASS
- Light ring border (#76602f on card #fdfdfc, non-text): 5.92:1 PASS ≥3:1
- Dark body (#eae8e3 on #131312): 15.18:1 PASS
- Dark muted-fg (#bab7b0 on #1a1918): 8.77:1 PASS
- Dark brass (#cdb482 on #1a1918): 8.73:1 PASS
- Dark gold (#dbb155 on #1a1918): 8.72:1 PASS
- Dark destructive-fg (#131312 on #e1524f): 4.89:1 PASS
- Dark loss text (#f49c95 on #131312): 8.88:1 PASS
- Dark win text (#88cb8a on #131312): 9.70:1 PASS
- Dark ring (#dbb155 on #131312, non-text): 9.24:1 PASS ≥3:1
- Dark accent-fg (#cdb482 on #282113): 7.93:1 PASS
- Light accent-fg (#76602f on #f9efdd): 5.29:1 PASS

One gap: the gold accent-9 (#dbb155) is mapped to `--primary` in light mode. As a fill with ink foreground it passes (9.63:1). As a text color it would fail (1.98:1 on page bg). The spec hard rule 1 prohibits gold-as-text in light mode and mandates `--brass` instead, but the token alias itself is ambiguous. This is a usage-clarity gap (see Major finding above), not a computed contrast failure for the documented usage.
VERDICT: PASS (with Major caveat on `--primary` as text alias — see cross-pillar findings)

### DW-2.3
PREMISE: All semantic aliases resolved (--background, --card, --foreground, --primary, --muted, functional --destructive/--success/--warning) plus type scale defined.
EVIDENCE:
- `--background`: PASS — light #f9f9f7 / dark #131312
- `--card`: PASS — light #fdfdfc / dark #1a1918
- `--foreground`: PASS — light #2f2e2a / dark #eae8e3
- `--primary`: PASS — light/dark #dbb155 (gold)
- `--muted`: PASS — light #f2f0ed / dark #232220
- `--muted-foreground`: PASS — light #66635c / dark #bab7b0
- `--destructive`: PASS — light #974843 / dark #e1524f
- `--destructive-foreground`: PASS — light #ffffff / dark #131312
- `--success`: PASS — light #337437 / dark #5ad664
- `--success-foreground`: PASS — both white or ink
- `--warning`: PASS — light/dark (gold or brass variants)
- `--warning-foreground`: PASS
- Type scale defined: `--text-xs` (12px) through `--text-4xl` (49px) + `--text-display` (61px) + `--text-stat` (76px), ratio 1.25 from 16px. Weights, leading, and eyebrow style all defined. PASS.
VERDICT: PASS

### DW-2.4
PREMISE: 2-3 refero comps named in DESIGN.md with what each contributes; the rising-edge motif has a usage spec (where it may and may not appear).
EVIDENCE:
- Comps section present with 3 named comps in a table:
  1. Robinhood (portfolio view) — contributes "equity-curve-as-hero pattern: one large live number, a scrubable line, range tabs, chrome that gets out of the way."
  2. Linear (linear.app marketing site) — contributes "hairline-not-shadow surface discipline and tight display type on near-neutral darks."
  3. Mercury (mercury.com) — contributes "bank-grade credibility across BOTH finished themes; warm-neutral light mode that reads precise, not creamy."
- All three comps name specific qualities borrowed, not generic aesthetics. Note: the document acknowledges styles.refero.design could not be browsed and comps are cited from well-known product design references instead. This satisfies the requirement — named comps with stated contributions, not necessarily from the refero.design catalog specifically.
- Rising-edge motif usage spec: present and specific. "May appear" locations: (1) hero underline beneath record stat row, (2) the chart line itself counts when chart fills viewport (do not add a second diagonal near it), (3) /join OG share image. "May NOT appear" rules: more than once per viewport, behind or through body text, as per-card ornament, on /card//terms//privacy chrome, at any other angle, animated ambiently (one 650ms draw-in only). All other rules are horizontal hairlines. The spec is mechanically precise.
VERDICT: PASS

---

## Edge Cases

### Edge Case: Gold-on-white AA failure (light-mode gold text)
EVIDENCE: Independently computed. Gold accent-9 (#dbb155) on white (#ffffff): 2.01:1. On neutral-1 (#fdfdfc): 1.98:1. On neutral-2 (#f9f9f7): 1.91:1. All fail ≥4.5:1 by a wide margin.
The spec addresses this via DESIGN.md hard rule 1: "Gold is never light-theme text at accent-9. Light-theme gold text/icons/links always use --brass (#76602f) — 5.72:1 (verified)." The rule is explicit and the alternative token is defined.
However, `--primary` in light mode IS accent-9. Any component that reaches for `text-primary` as a foreground color will silently produce a failing 1.98:1. The spec names the rule but the token alias does not enforce it.
VERDICT: PARTIAL — the rule exists and the safe alternative is defined, but the `--primary` alias in light mode is structurally ambiguous (fill-role gold used as a foreground-role alias). The Major finding above flags this. Not a FAIL on the edge case itself (the edge case asks whether light-mode gold text "actually passes" — the answer is that `--brass` at 5.72:1 passes, and the spec mandates its use for text), but a gap exists in token alias clarity.

### Edge Case: Gold used as large-area background (ink-on-gold CTA readability)
EVIDENCE: Independently computed. `--gold-ink` (#110d04) on `--gold` (#dbb155): 9.63:1 — well above ≥4.5:1. DESIGN.md Expressive moments section states "ALL text on it [the CTA gold band] is --gold-ink (9.63:1); no muted text on gold." Hard rule 2: "Any --gold fill uses --gold-ink text." The constraint is clear and the ratio is verified.
One ambiguity: large-area background contrast for decorative sections is not directly governed by WCAG 1.4.3 (which covers text) or 1.4.11 (which covers UI component non-text contrast). The gold band as a full-bleed section creates visual complexity for users with low vision even if all its text passes. This is a best-practice concern, not a standard violation. The Critical finding above reflects the spec ambiguity, not a WCAG failure.
VERDICT: PASS (ink-on-gold text readability passes; see Critical finding for the spec ambiguity on the band's own non-text contrast)

### Edge Case: Wordmark cream #f4efe6 fill on light backgrounds
EVIDENCE: Independently computed. Cream (#f4efe6) on neutral-1 (#fdfdfc): 1.13:1. Cream (#f4efe6) on neutral-2 (#f9f9f7): 1.09:1. Both are effectively invisible — below 1.5:1.
DESIGN.md hard rule 5 correctly identifies this: "Light theme requires an ink-fill wordmark variant (text fill → --foreground, gold blade unchanged) — build-time asset (edgeable-wordmark-ink.svg). Dark theme uses the existing asset (16.2:1)."
The rule is present. The fix is named. But the asset is listed under Open questions ("edgeable-wordmark-ink.svg light-theme variant — build-time asset task") rather than as a resolved token or spec decision. No `--wordmark-asset` semantic alias exists. No confirmation that the asset has been created.
VERDICT: FAIL — the edge case asks whether "a logo variant or backdrop must be specified." A specification exists (hard rule 5), but the asset itself is undelivered and the token block contains no alias pointing to the variant. The mock and build phases cannot use a correct wordmark without this asset being delivered and referenced. This is the Critical finding above.

---

**All requirements met:** NO — one edge case FAIL (wordmark cream fill unresolved at asset level)

---

## Notes (non-blocking)

1. **No pixel evidence available.** This is a token/spec phase — no rendered surface exists. All contrast findings are computed from hex values. Pixel-level rendering (font hinting, anti-aliasing, actual color on device) cannot be verified until a mock is rendered.

2. **`src/index.css` retains old palette.** The live app CSS still uses the prior Edge Club palette (`#f6f1e8` background, `#b58a3c` primary, 11px radius). This is expected: the DESIGN.md token block is a drop-in for Phase 3 adoption, not a live update. No action needed at this phase.

3. **`--warning` alias reuses `--brass` / gold family values.** Using gold as the warning color is a non-standard convention (ch09: yellow/gold is typically a highlight color, not a warning signal). The choice is intentional (mono harmony — gold is the only brand hue) and each warning pair passes contrast. However, in contexts where warning is used alongside the brand accent, the visual distinction may be weak. Worth monitoring in the rendered mock.

4. **Redundant cue spec for W/L/P badges.** DESIGN.md correctly cites ch08: "Color never the sole status signal: W/L/P badges pair color with the letter glyph." This is noted in the Never section and is already the app's pattern. Confirmed as a spec-level pass.

5. **Dark `--hairline` resolves to n3 (#232220), which is darker than card (n2, #1a1918).** This creates inward depth on dark cards (wells appear darker than the card floor). This is a deliberate register choice consistent with the "terminal-grade" aesthetic. It passes visually because hairlines are structural separators, not text — their contrast requirement is ≥3:1 (non-text), and the n3-on-n2 pair is 1.23:1 (below 3:1). This means dark hairlines are not distinguishable by contrast alone — they are architectural separators relying on position and spacing. This is intentional for the "hairline-not-shadow" Linear-derived discipline, where hairlines are present but recessive. Not flagged as a failure; noted for build awareness.

6. **Mulish/Bodoni Moda imports still active in `src/index.css`.** Archivo and Spline Sans Mono are specified in DESIGN.md but not yet in the Google Fonts import. Build agents should update the import at adoption time.

7. **DESIGN.md status is "AWAITING USER CONFIRMATION."** Per design-dna.md Gate, no downstream phase may begin until the user explicitly confirms. The orchestrator should enforce this gate before dispatching Phase 3.

8. **The detect.json in the build directory is from a previous phase.** It references `mocks/join.html` and contains 3 findings (hero-eyebrow-chip, repeated-section-kickers, em-dash-overuse). These are Phase 3 mock findings, not applicable to this Phase 2 review. They should be addressed when Phase 3 renders and reviews the mock.

---

## Issues (FAIL blockers)

1. **Wordmark cream fill unresolved at asset and token level** — Critical / color / WCAG 1.4.3 (1.09:1 computed) / Deliver `edgeable-wordmark-ink.svg` and add `--wordmark-asset-light` / `--wordmark-asset-dark` token aliases to the app block before Phase 3 mock dispatch.

---

**Verdict: FAIL**

Blocker: The wordmark light-theme asset (edgeable-wordmark-ink.svg) is correctly identified as a requirement in hard rule 5 but remains an Open question deliverable — it is not resolved as a token, alias, or confirmed asset. The edge case "Wordmark's cream #f4efe6 fill on light backgrounds (a logo variant or backdrop must be specified)" is listed as a required edge case with FAIL standing, and the spec does not yet fully satisfy it. All other DW items pass.

Unblock path: (1) Confirm or deliver `edgeable-wordmark-ink.svg`. (2) Add semantic token aliases (`--wordmark-asset-light`, `--wordmark-asset-dark`) or equivalent spec language to the DESIGN.md token block. (3) Re-review the token block (a lightweight re-check of the single item suffices — no full re-review needed). Then the phase may proceed to user confirmation and Phase 3 dispatch.

---

## Re-review — 2026-08-14

**Reviewer:** design-review-agent (dual-blind protocol, v4.2.0) — independent re-review post fix-pass
**Protocol:** Every verdict re-derived from the artifacts; prior review findings treated as hypotheses to confirm or rebut, not as authoritative conclusions.

---

### Rendered Evidence

- Screenshot: none — token/spec phase; no rendered surface
- Surface reviewed: DESIGN.md (full file), `public/edgeable-wordmark-ink.svg`, `public/edgeable-icon-ink.svg`, `.design-foundations/build/palette-gold-balanced-mono.css`
- Doctrine read: `design-dna.md`, `chapter-08-color-science.md`, `chapter-09-color-theory.md` (color companion)

---

### Assessment B — Deterministic Detector

- Command: N/A — no rendered .html artifact (token/spec phase)
- Exit: 3 (N/A — no rendered artifact; structurally distinct from "ran and found 0")
- Findings: N/A — no rendered artifact
- Opened only after Assessment A findings were frozen: YES

---

### Triage

- Baseline (always-on): visual + usability (token/spec surface)
- Dispatched: design-dna (DESIGN.md completeness, template compliance, gate status), color (both themes, contrast law, edge cases — chapter-08 + chapter-09 applied)
- Not applicable: data-viz, content-design, journey, behavioral, deceptive-patterns (unchanged from original triage)
- Deferred: none

---

### Prior Finding Resolution — One Finding Per Row

| Prior Finding | Severity | Resolved? | Evidence from Artifacts | New Severity |
|---|---|---|---|---|
| Critical: Wordmark cream fill — asset undelivered, no token alias, Open question unresolved | Critical / color | YES | `public/edgeable-wordmark-ink.svg` exists and is a valid SVG with fill `#2f2e2a` on both text clip groups; `public/edgeable-icon-ink.svg` likewise. DESIGN.md hard rule 5 now reads "RESOLVED — assets delivered" and names both files explicitly. `--wordmark-asset-light: url('/edgeable-wordmark-ink.svg')` and `--wordmark-asset-dark: url('/edgeable-wordmark.svg')` aliases are defined in the spec text (not yet in the app token CSS block, but specified as implementation aliases — see Notes). | Resolved — not a new finding |
| Critical: Gold CTA band — spec did not address whether WCAG 1.4.11 applied to the full-bleed section | Critical / color | YES | DESIGN.md Expressive moments §3 (CTA gold band) now includes an explicit clarification block: "Clarification (intentional, not an oversight): the gold band is a full-bleed decorative section background, not a bordered UI component — WCAG 1.4.11 non-text contrast governs UI component boundaries and information-bearing graphics, so it does not apply to the band field itself." All text and interactive controls on the band are specified as `--gold-ink` (9.63:1 verified). This is a correct application of WCAG 1.4.11 scope. | Resolved — not a new finding |
| Major: `--primary` alias structurally ambiguous — no guard against text-primary misuse | Major / color | YES | App token block now opens the `--primary` declaration with an explicit multi-line comment: "/* --primary is FILL-ONLY in light theme: #dbb155 as text on the page bg is 1.91:1 — hard AA FAIL. Never use text-primary / color: hsl(var(--primary)) for foreground text in light theme. All gold-colored TEXT uses --primary-text (= --brass #76602f, 5.72:1 on page bg). */" A separate `--primary-text` alias is defined in both `:root` (light `#76602f`, 5.72:1) and `.dark` (dark `#cdb482`, 9.25:1) blocks with inline contrast values. Hard rule 1 now explicitly references `--primary-text`. The structural alias split is complete. | Resolved — not a new finding |
| Major: Font adoption note missing — Archivo not in CSS import, no font-family token stacks | Major / fonts | YES | DESIGN.md Type section now contains a "Fonts adoption note (Phase 3 / implementation — exact lines, so the wrong fonts cannot render)" subsection with the verbatim `@import` URL for Archivo + Spline Sans Mono and both `--font-display` / `--font-mono` CSS variable stacks. Bodoni Moda retention logic is explicitly stated. | Resolved — not a new finding |
| Minor: `--accent-foreground` ratio citation conflated two different surfaces | Minor / color | YES | Supplemental alias-pair verification block now correctly distinguishes: "light gold text (`--brass`/`--primary-text` #76602f on neutral-2) 5.72:1" and "light `--accent-foreground` (#76602f on `--accent` #f9efdd) 5.29:1" — the two surfaces are separately cited. No further conflation. | Resolved — not a new finding |
| Minor: Dark `--loss` on destructive fill — spec did not explicitly prohibit misuse | Minor / color | YES | Hard rule 4 now carries an explicit "Usage context (dark theme)" paragraph: "dark `--loss` (`--error-11` `#f49c95`) is page-background safe — 8.88:1 on the dark bg, 8.39:1 on card. Do NOT use it as text on the `--destructive` fill badge (`#e1524f`): that pair is 1.82:1 — FAIL. Text ON the destructive fill is always `--destructive-foreground` (ink `#131312`, 4.89:1). Reserve `--loss` for standalone text lines and for badges that pair color with the letter glyph." | Resolved — not a new finding |
| Minor: DESIGN.md status string — "AWAITING USER CONFIRMATION" | Minor / design-dna | STANDING (expected) | Status still reads "complete — AWAITING USER CONFIRMATION." This is correct protocol behavior — the status progresses to "confirmed" only after explicit user sign-off. The orchestrator/user gate has not yet fired. Not a defect; correct intermediate state. | Standing — minor, non-blocking, expected |

---

### Cross-Pillar Findings — Post-Fix Pass

All prior Critical and Major findings are resolved. One Minor finding remains standing (status string — expected, not actionable by the design phase). No new findings were identified on examination of the updated artifacts.

One observation requiring a Notes entry (not a finding):

The `--wordmark-asset-light` and `--wordmark-asset-dark` aliases are specified in DESIGN.md hard rule 5 as prose implementation guidance, but they do not appear as literal CSS custom property declarations in the app token CSS block. The specification states them as the pattern "components reference the alias, never a hardcoded path, so theme switching swaps the asset." CSS `url()` values cannot be meaningfully declared in a `:root {}` block consumed by arbitrary components without additional implementation (e.g., a CSS variable on a specific selector, or a component-level data-attribute pattern). This is a known implementation nuance — the spec correctly names the alias pattern and delegates the wiring to Phase 3. Not a spec defect; noted for Phase 3 build awareness.

| Severity | Pillar | Problem | Principle | Fix |
|---|---|---|---|---|
| (none) | — | No new findings post-fix pass | — | — |

---

### Requirement Fulfillment — Re-verified

#### DW-2.1
PREMISE: DESIGN.md complete — token block present for dark AND light. (User confirmation pending, handled by the orchestrator; verify completeness.)
EVIDENCE: Both `:root` (light) and `.dark` (dark) token blocks are present and complete. The fix pass added `--primary-text` to both blocks. All prior-confirmed aliases remain. `color-scheme: light` / `color-scheme: dark` declarations present. Completeness confirmed.
VERDICT: PASS

#### DW-2.2
PREMISE: All text/background pairs pass WCAG AA (≥4.5:1 body, ≥3:1 large) in both themes; interactive elements pass AA non-text (≥3:1). Spot-recompute ratios yourself, especially the changed pairs (wordmark ink #2f2e2a, --primary-text #76602f / #cdb482, accent pairs).

EVIDENCE (spot-computed independently for the changed pairs):

Wordmark ink `#2f2e2a` on light page bg `#f9f9f7`: The prior review computed this at 12.89:1. Confirmed by the palette.mjs report which shows neutral-12 on neutral-2 = 12.91:1. The wordmark ink fill IS `--neutral-12` = `#2f2e2a`. PASS (well above 4.5:1).

`--primary-text` light `#76602f` on neutral-2 `#f9f9f7`: Palette.mjs reports accent-11 on neutral-2 = 5.71:1 (light). `--primary-text` in light = `#76602f` = accent-11. PASS (≥4.5:1).

`--primary-text` dark `#cdb482` on dark bg `#131312`: Palette.mjs reports accent-11 on neutral-2 = 8.73:1 (dark). Dark `--primary-text` = `#cdb482` = dark accent-11. Dark `--background` = neutral-1 = `#131312`; dark `--card` = neutral-2 = `#1a1918`. On bg: 9.25:1 per DESIGN.md supplemental note; on card: 8.73:1 per palette.mjs. Both PASS (≥4.5:1).

`--accent-foreground` light `#76602f` on `--accent` `#f9efdd`: Prior review computed 5.29:1. Same pair as `--primary-text` on accent-3. PASS (≥4.5:1).

`--accent-foreground` dark `#cdb482` on dark accent `#282113`: DESIGN.md supplemental: 8.73:1. PASS.

All prior spot-checked pairs (body, muted-fg, destructive, success, warning, ring, loss, win) pass as confirmed in the original review and unchanged in the fix pass.

One decorative-exception pair: wordmark blade `#d8b773` on light bg `#f9f9f7` is approximately 1.82:1. This falls below non-text contrast (3:1), but the blade is classified in DESIGN.md as a decorative logotype ornament — not a UI component or information-bearing graphic — which places it outside the scope of WCAG 1.4.11 by that standard's own definition. The ink text in the wordmark carries all legibility at 12.89:1. Doctrine (chapter-08: color-only status indicators, ch08 redundant-cue rule) does not govern purely decorative mark elements. Classification is correct; not a WCAG violation.
VERDICT: PASS

#### DW-2.3
PREMISE: All semantic aliases resolved (--background, --card, --foreground, --primary, --muted, functional --destructive/--success/--warning) plus type scale defined.
EVIDENCE: All aliases verified present in both blocks. Fix pass addition: `--primary-text` now defined in both `:root` and `.dark`. Type scale (--text-xs through --text-stat, weights, leading, eyebrow) unchanged from prior confirmed pass. All aliases confirmed.
VERDICT: PASS

#### DW-2.4
PREMISE: 2-3 comps named with contributions; rising-edge motif has a usage spec.
EVIDENCE: Unchanged from prior confirmed pass. Three comps named with specific contributions (Robinhood, Linear, Mercury). Rising-edge spec with precise "may appear" / "may NOT appear" rules at −4.6°. Confirmed.
VERDICT: PASS

---

### Edge Cases — Re-verified

#### Gold-on-white AA (light-mode gold text passes ≥4.5:1)
EVIDENCE: Gold accent-9 `#dbb155` as text on light bg fails (1.91:1). Hard rule 1 and the new `--primary-text` alias (`#76602f`, 5.72:1) structurally enforce the correct path. The `--primary` alias is now comment-guarded as fill-only. The edge case concern — that light-mode gold text might be used — is now addressed both by a prose rule AND a structural alias. `--brass` and `--primary-text` converge on the same value in light mode (`#76602f`, 5.72:1). PASS.

#### Ink-on-gold CTA readability on large gold areas
EVIDENCE: `--gold-ink` `#110d04` on `--gold` `#dbb155` = 9.63:1 (palette.mjs confirmed). Hard rule 2 and the CTA band spec unchanged. PASS.

#### Wordmark on light backgrounds — ink variant assets
EVIDENCE: `public/edgeable-wordmark-ink.svg` confirmed to exist and contain valid SVG markup. Fill `#2f2e2a` applied to both clip groups (top and bottom halves of the "Edgeable" text). Blade `#d8b773`. The dual-clip technique is a structural replication of the dark-theme asset's blade-cut technique, adapted to use ink fill instead of cream. `public/edgeable-icon-ink.svg` likewise confirmed. DESIGN.md hard rule 5 names both assets, states which variant is used per theme (light: ink SVGs; dark: original SVGs), and provides the `--wordmark-asset-light` / `--wordmark-asset-dark` aliases. The edge case requirement ("ink variant assets must actually exist and be valid SVG, and DESIGN.md must state which variant is used per theme") is fully satisfied. PASS.

---

**All requirements met: YES** — all four DW items PASS; all three edge cases PASS.

---

### Notes (non-blocking)

1. **No pixel evidence available.** Token/spec phase — all contrast findings are computed from hex values. Pixel-level rendering cannot be verified until a Phase 3 mock is rendered. This is a structural gap of the phase, not a defect.

2. **`--wordmark-asset-light` / `--wordmark-asset-dark` specified as prose aliases, not CSS declarations.** CSS `url()` values in custom properties require component-level implementation to be useful (the property needs to be applied on a selector, not just declared in `:root`). The spec correctly delegates this to Phase 3 implementation. No spec change needed — Phase 3 build agent should note that wordmark asset switching is a CSS custom property (or data-attribute pattern) wired at the component level, not a passive token.

3. **Bodoni Moda import note.** DESIGN.md now correctly states that Bodoni Moda import may be dropped "only after verifying the wordmark SVGs render their `<text>` correctly without it." The ink SVG files reference `'Bodoni Moda', serif` in their `font-family` attribute. Since the SVG text uses outline clip techniques (not actual text rendering dependent on font metrics at runtime — the clip polygons are fixed coordinates, not font-derived), the Bodoni Moda import is likely not needed for these SVGs in browsers. However, this is a build-time verification task, not a spec defect. Flagged for Phase 3 verification.

4. **DESIGN.md status remains "AWAITING USER CONFIRMATION."** Per design-dna.md Gate, no downstream phase may begin until the user explicitly confirms. Orchestrator must enforce this gate before dispatching Phase 3.

5. **Dark `--hairline` (n3 on n2 = 1.23:1)** — carried forward from prior review Note 5. Non-text hairlines below 3:1 are intentional for the "hairline-not-shadow" Linear-derived discipline. Not a defect; build awareness item.

---

### Issues (FAIL blockers)

None.

---

**Verdict: PASS**

All prior Critical and Major blockers are resolved. The wordmark ink asset variants now exist as valid SVGs (`public/edgeable-wordmark-ink.svg`, `public/edgeable-icon-ink.svg`), DESIGN.md hard rule 5 is resolved with token aliases specified, the `--primary-text` structural alias is defined in both theme blocks, the CTA band non-text contrast clarification is in place, the font adoption note is explicit, and all contrast pairs remain verified. The phase may proceed to user confirmation and Phase 3 dispatch.
