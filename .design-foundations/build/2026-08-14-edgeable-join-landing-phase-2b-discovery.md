# Discovery + Design: Phase 2 (re-deal) - Design DNA + tokens, "twilight editorial"

## Artifacts Found / Current State

- `DESIGN.md` (project root): "Gilt Ledger" — LOCKED then **REJECTED by Sean on rendered pixels** ("looks very weird on desktop especially"). To be fully overwritten.
- `JOURNEY.md`: complete with final Phase-3 copy. **Stands unchanged (law for structure + copy).** It carries some visual annotations from the rejected DNA (gold band in Section 5, rising-edge hover underline, hairline callout borders) that the new DESIGN.md must supersede at the visual layer.
- `src/index.css`: the app's shadcn HSL-triple alias vocabulary (`--background` ... `--ring` + raw `--gold/--gold-ink/--brass/--surface-2/--hairline/--dim`). The new token block must stay drop-in for this vocabulary.
- Archived palette output: `.design-foundations/build/palette-gold-balanced-mono.css` (seed #d8b773, balanced, mono — exit 0). Re-run this session for fresh evidence.
- Wordmark ink variants exist: `public/edgeable-wordmark-ink.svg`, `public/edgeable-icon-ink.svg` (light theme); cream originals for dark.

## What the rejection implies

Sean rejected **composition and register, not the brand hue**. The pixels that read "weird on desktop":

1. **Editorial Spread asymmetry** (variance 7: offset section headers, unequal gutters, magazine gaps) — reads as broken alignment at 1200px, not as editorial confidence.
2. **Hairline severity** — 1px-rule-everywhere elevation reads thin and stark at desktop scale; "private bank ledger" landed as "austere spreadsheet."
3. **The gold band** — a full-bleed gold field is exactly the "large gold area" the new pins outlaw; loud where the page should be calm.
4. **Sharp compact display type (Archivo 800)** amplified the severity.

What survives the rejection: the brand gold hue (pinned), the all-sans law, the mono-harmony warm-neutral palette math (the palette itself was never the complaint — and it happens to already be a paper-white/ash/smoke/graphite/ink near-mono system), Spline Sans Mono's role as the proof-numeral voice, the WCAG hard rules (`--primary-text` discipline, ink-on-gold, light-theme gold fill border).

## The new grounding (user law)

Refero **"Portal"** style (https://styles.refero.design/style/b9aeb945-2f6e-4557-9115-e3ff3a8f8dc8), "twilight editorial": premium magazine calm meets native-app polish. Borrow/adapt per the dispatch prompt: near-mono neutrals + exactly one functional accent (theirs iOS blue → ours brand gold), atmospheric gradient hero (theirs sky-blue→violet→coral → ours warm dusk amber→rose→soft violet), generous centered air (80–120px gaps, ~1200px max-width), soft depth (22–30px radii, pill buttons, glow-ring elevation), handcrafted anti-SaaS feel.

## Gaps

- No browser MCP guarantee this session; DESIGN.md production needs only `palette.mjs` + computed pairs (no render evidence required this phase — the mock is a later artifact).
- JOURNEY.md Section 5 specifies "the `--gold` full-bleed band" (a Gilt Ledger visual reference inside otherwise-standing copy). New DNA outlaws gold bands. Resolution: DESIGN.md ships a **JOURNEY.md visual-supersession map** (visual layer only; structure/copy untouched). Not an UPDATE_PLAN case — the dispatch prompt itself re-dealt the visual DNA and pinned "no gold bands."

## Gate Status

- DESIGN.md: present but rejected → this phase rewrites it; output marked **AWAITING USER CONFIRMATION** (not locked — lock is Sean's explicit act).
- JOURNEY.md: present, complete, law.
- Prerequisites met: plan phase 2 re-deal context, research pins, palette script available.

## DW Verification

| DW-ID | Done-When Item | Status | Evidence |
|-------|---------------|--------|----------|
| DW-2.1r | DESIGN.md fully rewritten (no Gilt Ledger residue contradicting the new register), token blocks both themes, marked AWAITING USER CONFIRMATION | COVERED | File inspection: rewritten DESIGN.md with both HSL-triple theme blocks + status line; residue check (no Editorial Spread, no gold band, no hairline-elevation rules, no one-diagonal-per-viewport rule) |
| DW-2.2r | All text/background pairs AA-verified via palette.mjs + supplemental pairs, both themes, incl. gradient-hero text rule | COVERED | `palette.mjs` exit 0 + contrast report; supplemental node-computed WCAG pairs for every alias mapping AND each gradient stop vs its text colors; the scrim/guaranteed-zone rule stated in DESIGN.md |
| DW-2.3r | Full semantic alias set + type scale + spacing/radius system (desktop-first) defined | COVERED | Token block inspection: all `src/index.css` aliases present both themes; type scale steps listed; spacing/radius/gap system with desktop-primary values |
| DW-2.4r | Portal reference cited with borrowed-vs-adapted; Never list updated to new failure modes | COVERED | DESIGN.md Comps table (borrowed vs adapted per trait) + rewritten Never list (no hairline severity, no magazine asymmetry, no gold floods, keep no-default-shadcn, no em dashes) |

**All items COVERED:** YES

## Design Decisions

1. **Name: "Dusk Ledger."** The ledger identity (verifiable record) survives; the register moves from gilt severity to twilight calm.
2. **Composition axis is now user-pinned** (calm centered, ~1200px, generous air — variance ~2). Per the re-deal protocol, the rejected Editorial Spread cell stays consumed; no dealer re-run is needed because every previously-dealt axis is now user law (hue pinned #d8b773 family, composition pinned by the Portal reference, register pinned twilight-calm). Pinned axes are dealt around, never re-chosen.
3. **Sans: switch Archivo → Inter** (display + body). Rationale: the Portal register is Inter-class neutrality — a realist/neo-grotesque with tall x-height, screen-native hinting, and no display-face aggression. Archivo's compact sharp-shouldered grotesque was chosen to collide with the old luxury register; in a calm centered composition it keeps the severity we are removing. Deliberate-contrast pairing law holds: neutral grotesque (Inter) x mono (Spline Sans Mono) — not the uncanny middle (appendix pairing rule). Display sizes use Inter at -0.02em tracking, weights capped at 700 (no 800 display shouting).
4. **Numerals: keep Spline Sans Mono.** The record and chart are the product's proof; naturally-tabular mono prevents layout shift on live scrub, is already loaded by the app, and the grotesque-x-mono contrast is the page's one type tension. Unifying to Inter numerals would soften the proof voice for no gain.
5. **Palette: re-run the same seed** (`#d8b773`, balanced, mono). The generated neutral ramp IS a paper-white/ash/smoke/graphite/ink near-mono system with a faint warm cast that flatters gold; the accent ramp is the brand gold. The rejection never touched the palette; changing seeds now would be redesign-for-motion's-sake. All hard contrast rules carry forward (`--primary-text` light-gold text-safe step #76602f, ink-on-gold #110d04, light gold-fill 1px `--ring` border).
6. **Atmospheric gradient hero (the page's one expressive moment):** warm dusk, three stops per theme. Light: pale amber #fdf4e4 → warm rose #f4e4da → soft violet #e9e2f0. Dark: deep violet #1c1626 → mauve #2c2130 → ember #3a2a26. Tuned warm so flat brand gold sits ON the sky rather than competing with it. Static — no animated gradients. Text-on-gradient law: every text element over the gradient must sit in a guaranteed-contrast zone (a defined stop whose pair is computed and passing) or on a ≥85%-opacity `--card` scrim (then judged as the text-on-card pair). Verified numerically this session.
7. **Soft depth replaces hairline severity:** cards 24px radius (feature panels 28px), pill CTAs (radius 9999px, ~50-56px height), glow-ring elevation (`0 0 0 5px` near-neutral ring + soft ambient) instead of 1px-hairline card edges and drop-shadow stacks. Hairlines survive ONLY where information-bearing (chart zero baseline, input borders at ≥3:1) — never as the elevation system.
8. **Rising-edge motif (-4.6°): survives only as the chart line itself.** The equity curve is the authentic rising edge; a decorative 3-4px diagonal rule is hard-edged severity the soft register just retired. No hero underline motif, no diagonal dividers, no horizon line forced into the gradient. Not forced — per the pin.
9. **Section 5 CTA treatment (supersedes the gold band):** a centered `--card` panel with glow-ring depth on the calm page ground; the $30 price in Spline Sans Mono; ONE gold pill button ("Join Edgeable"). Gold appears only on the pill, links, and active tabs. All JOURNEY.md copy in the section unchanged.
10. **Desktop-first:** the 1200px centered composition is the designed artifact; mobile adapts down (single-column stack, clamped display sizes, 64px gaps). Inverts the old mobile-first stance per pin.

## Recommendation

**BUILD**
