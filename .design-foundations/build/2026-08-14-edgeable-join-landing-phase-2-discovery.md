# Discovery + Design: Phase 2 - Design DNA + tokens ("modern gold")

## Artifacts Found / Current State
- **DESIGN.md:** absent — this phase creates and locks it (pending user confirmation via orchestrator).
- **JOURNEY.md:** present at repo root (Phase 1, committed 8db8553). Complete /join page spec (6 blocks), flows, /card CTA amendment. Names the Phase 2 decisions this DNA must answer: header sticky/static, hero anchor CTA weight, range-tab active treatment, primary CTA color/treatment, /card CTA token weight.
- **Current tokens:** `src/index.css` — Edge Club palette (cream `#f6f1e8` light bg, gold `#d8b773`/`#b58a3c`, Bodoni Moda + Mulish + Spline Sans Mono, shadcn semantic aliases + raw `--gold/--gold-ink/--brass/--surface-2/--hairline/--dim`, `--radius` 11px). This is the alias vocabulary the new token block must map onto.
- **Wordmark:** `public/edgeable-wordmark.svg` — Bodoni Moda 600, cream `#f4efe6` fill, gold blade `#d8b773` rising left-to-right at **≈4.6°** (rise 41.1 / run 514). The blade angle is the measurable motif constant.
- **Research doc:** confirmed 2026-08-14; taste signals = the plan's three verbatim pins (gold stays / not template-y / serif logo-only).

## Gaps
- No DESIGN.md (expected — the deliverable).
- styles.refero.design cannot be browsed (no browser MCP in this environment). Per the dispatch note, comps are named from knowledge of well-known product design references, stated explicitly in DESIGN.md.
- Historic light gold `#b58a3c` measured at **3.15:1 on white — fails AA for body text** (the plan's predicted edge case, confirmed numerically). New light-theme gold text token must be darker.
- Wordmark cream fill measured at **1.09:1 on the new light background — invisible**. Light theme requires an ink-fill wordmark variant (edge case confirmed).

## Gate Status
- DESIGN.md: absent — this phase IS the establishing phase (produces + locks it; lock completion = user confirmation, handled by orchestrator).
- JOURNEY.md: present with complete `## Page specs` — prerequisite met.
- Workspace: feature/join-landing per plan.

## DW Verification
| DW-ID | Done-When Item | Status | Evidence |
|-------|---------------|--------|----------|
| DW-2.1 | DESIGN.md locked — token block dark AND light, user confirmed | COVERED | DESIGN.md written at repo root with both theme blocks; marked **awaiting user confirmation** (confirmation is the orchestrator's step, per dispatch note) |
| DW-2.2 | All text/bg pairs AA (≥4.5:1 body, ≥3:1 large) both themes via palette.mjs; interactive ≥3:1 non-text | COVERED | `palette.mjs --seed #d8b773 --chroma balanced --harmony mono` **exit 0**, 12/12 PASS report; plus a supplemental WCAG check of every mapped semantic-alias pair incl. the plan's edge cases (gold-on-white text, ink-on-gold CTA, input borders, destructive fills) — all PASS after remapping (see Design Decisions) |
| DW-2.3 | Semantic aliases resolved (`--background --card --foreground --primary --muted --destructive --success --warning`) + type scale | COVERED | Token block written in the `src/index.css` HSL-triple alias vocabulary covering the full existing alias set (semantic + raw Edge Club tokens); type scale section in DESIGN.md; verified by grep after write |
| DW-2.4 | 2–3 comps named with contributions; rising-edge motif usage spec | COVERED | DESIGN.md "Comps" section: Robinhood / Linear / Mercury with named contributions (refero unbrowsable — stated); "Signature move / motif spec" section with may/may-not-appear rules at the measured 4.6° angle |

**All items COVERED:** YES

## Design Decisions

**Doctrine applied:** design-dna (pipeline + DESIGN.md template), archetypes (Part A/B/C funnel), foundations (§7 harmony, credibility imperative), fonts (ch03 medium-form + appendix pairing rules), color (ch08 science + ch09 theory companion — both read).

1. **Archetype: Ruler, inflected by Sage.** Feel words (premium-but-not-stuffy, credible, refined) map to Ruler; the proof-forward "here is the evidence, you decide" posture is Sage inflecting the data presentation only (archetypes Part C: mixed signals → primary + one-dimension secondary). Ruler's visual gravity — deep tones + gold, luxury restraint — is exactly the brand constraint.
2. **Dealer run, hand executed (not chosen).** The plan constraints carry "dealer pins from research taste signals"; per design-dna, in a non-interactive dispatch pins come from the research doc and unpinned axes are dealt. Ran `dealer.mjs --project edgeable-join --date 2026-08-14 --candidates 1 --pin hue=84.5` (84.5 = OKLCH hue of `#d8b773`, measured by palette.mjs). Dealt hand: **Art Deco/Luxury × Editorial Spread (variance 7) × yellow/gold 84.5 × "exactly one diagonal element per view, always at the same angle."** Justification: Art Deco is a Ruler primary family whose color strategy IS "deep base + metallic gold at controlled chroma"; Editorial Spread's display-type-first hierarchy serves a page whose hero is a number; and the dealt signature is, verbatim, the brand's existing rising-edge blade. The hand is executed as dealt — no re-deal needed.
3. **DNA remix: Art Deco/Luxury base + type voice AND motion borrowed from Data-Dense Professional; dominant axis = type voice.** The serif-logo-only pin outlaws Art Deco's default serif display; content pressure (dense numbers, live record) pulls type toward Data-Dense Pro (compact grotesque + tabular/mono numerals — "tabular numerals mandatory"). Motion borrows Data-Dense Pro's state-change-only vocabulary (Art Deco's slow 400–500ms fades would read as stuffy on a proof page). Two borrows, legal; color strategy and composition stay with base/deal (remix rule 4). This collision is what kills "template shadcn": luxury color discipline + terminal-grade numerals is not a training-data cluster.
4. **Typeface: replace Mulish with Archivo; keep Spline Sans Mono for numerals.** Mulish is a rounded humanist sans — the "friendly generic" note in the current look. Archivo: free (Google Fonts), variable, compact grotesque named in both the Swiss and Data-Dense Pro family docs, screen-ready (realist structure, generous x-height — ch03 medium-form), sharp at 700/800 display weights. Stats, odds, timestamps, and the price set in **Spline Sans Mono** (already loaded by the app — zero new cost, naturally tabular, extends the tamper-evidence "machine record" feel). Pairing = deliberate contrast (grotesque vs mono), not uncanny-valley middle (appendix rule). Bodoni Moda confined to the wordmark asset; page is 100% sans.
5. **Palette: `palette.mjs --seed #d8b773 --chroma balanced --harmony mono`.** Seed derived from the brand gold itself (script reports oklch 0.79 0.095 84.5) — gold stays the brand hue by construction. Mono harmony = one accent, Ruler restraint; functional colors come from the script's functional ramp. Neutrals land warm-near-neutral (`#fdfdfc/#f9f9f7` light, `#131312/#1a1918` dark) — warm enough to sit with gold, nowhere near the vintage cream. Exit 0, all 12 constructed pairs PASS.
6. **Alias remapping fixes (defects found, targets never lowered):**
   - Light gold **text** = accent-11 `#76602f` (5.72:1) — never `#b58a3c` (3.15:1 fail) and never accent-9 as text on light.
   - Light **destructive fill** = error-11 `#974843` + white fg (6.32:1); error-9 + white was 3.80:1 FAIL. Dark destructive fill = error-9 `#e1524f` + near-black fg (4.89:1); white-on-error-9 fails.
   - Light gold **button fill** (accent-9 on near-white = 1.91:1 non-text) → codified rule: light-theme gold fills always carry a 1px accent-11 border (5.92:1 boundary) + ink text 9.63:1. Dark needs no border (gold vs bg 9.24:1).
   - **Input borders**: light `--input` = neutral-11 `#66635c` (5.68:1 ≥3); dark ramp has no passing step between n8 (2.80) and n9 (8.7), so dark `--input` = `#7a756a`, a documented n8→n9 interpolation (3.83:1) — completing the ramp, not inventing a one-off.
   - Wordmark cream on light bg 1.09:1 → light theme requires an ink-fill wordmark variant (gold blade unchanged); logged as a build-time asset requirement.
7. **Motif codified from measurement:** the rising edge is a gold rule at **−4.6°** (the wordmark blade's measured angle), max once per viewport (the dealt signature's "exactly one diagonal" is the enforcement rule). Usage spec in DESIGN.md.
8. **Radii/spacing:** 8px controls/cards, 4px badges (down from 11px — sharper), 4-base spacing scale. Depth from hairlines, not shadows (Art Deco fine rules + not-shadcn); shadows demoted to the existing card-glow top-edge highlight only.
9. **JOURNEY.md Phase-2 decision handoffs answered** in DESIGN.md (header static, hero anchor CTA = gold text link, range-tab active = ink-on-gold pill, primary CTA = gold solid, /card CTA = muted-foreground text link with gold hover).

**Concise production notes:** palette.mjs generated all tokens (no hand-rolled ramps); Spline Sans Mono reused from the existing stack; no mock produced this phase (render evidence N/A — Phase 3/mock consumes the tokens).

## Recommendation
BUILD
