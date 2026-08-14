# Design: Gilt Ledger

**Date:** 2026-08-14 · **Status:** **LOCKED** (direction confirmed by Sean 2026-08-14 — this is law for all downstream design and implementation)
**Archetype:** Ruler (primary), Sage inflecting the data presentation only · **Register:** calm product structure · expressive at: record hero, chart reveal, CTA gold band
**Grounding:** Robinhood's equity-curve-as-proof + Mercury's bank-grade dual-theme calm
**DNA:** Art Deco/Luxury (base) + type voice and motion from Data-Dense Professional · **Dominant axis:** type voice
**Composition:** \<dealt\> — Art Deco/Luxury × **Editorial Spread** (variance 7: oversized display type against modest body columns, magazine asymmetry, deliberate gaps, display-type-first hierarchy) × hue 84.5 (yellow/gold) × signature "exactly one diagonal element per view, always at the same angle" (`dealer.mjs --project edgeable-join --date 2026-08-14 --candidates 1 --pin hue=84.5`, reroll 0 — executed as dealt)
**Pins:** hue = 84.5 (OKLCH hue of brand gold `#d8b773`, from research taste signals); serif confined to the logo (page all-sans — rides the TYPE line as a stated constraint); vintage cream dropped. Pinned values are user law.

---

## Direction

A private bank's ledger, kept by a machine: deep warm-neutral surfaces, one metallic gold, and oversized monospaced numerals doing the talking. It serves a skeptical stranger deciding whether a picks record is real — so the luxury is restraint (hairlines, one accent, one diagonal), and the flourish is always the *evidence*: the number, the timestamp, the curve. Gold-on-ink luxury discipline colliding with terminal-grade numeric type is not a template cluster — it can only come from this brand's gold blade and this page's proof-first content.

## Comps (reference points)

> styles.refero.design could not be browsed in this environment (no browser MCP). Comps are named from well-known product design references, stated explicitly per the dispatch note.

| Comp | What it contributes |
|------|--------------------|
| **Robinhood** (portfolio view) | The equity-curve-as-hero pattern: one large live number, a scrubable line under it, range tabs, chrome that gets out of the way. Already the app's `PerformanceChart.jsx` interaction baseline — /join inherits it. |
| **Linear** (linear.app marketing site) | Hairline-not-shadow surface discipline and tight display type on near-neutral darks — the proof that "premium" can come from type + 1px rules instead of glow and gradients. Anti-template posture. |
| **Mercury** (mercury.com) | Bank-grade credibility across BOTH finished themes; warm-neutral light mode that reads precise, not creamy. The register model for "closer to fintech than sportsbook." |

## Signature move — the rising edge

**One gold diagonal per viewport, always at −4.6°** (the measured angle of the wordmark blade: rise 41.1/run 514 in `public/edgeable-wordmark.svg`). Rendered as a 3–4px `--gold` rule with round caps, rising left-to-right.

**Motif usage spec:**
- **May appear:** (1) the hero — as the underline/divider beneath the record stat row (the page's one diagonal); (2) the chart line itself counts as the diagonal when the chart section fills the viewport (do not add a second decorative diagonal near it); (3) the /join OG share image.
- **May NOT appear:** more than once per viewport (the dealt rule is the enforcement); behind or through body text; as a per-card or per-list-item ornament; on /card, /terms, /privacy chrome; at any other angle; animated ambiently (a single 650ms draw-in on first paint is allowed, then it is static).
- All other rules and dividers in the system are **horizontal hairlines** (`--border`/`--hairline`) — the diagonal is singular by contrast.

## Expressive moments

1. **Record hero** (peak, committed amplitude): stat row in Spline Sans Mono at the display sizes (49–76px), the rising-edge rule beneath it, gold used on the numbers' unit labels only. Everything else in the hero holds the calm baseline.
2. **Chart reveal** (moderate): 650ms left-to-right draw-in (existing `chart-reveal` keyframe), once per load; scrub feedback is instant.
3. **CTA gold band** (moderate): Section 5 (`#join-cta`) may use a full-bleed `--gold` field — the only large-area gold on the page. ALL text on it is `--gold-ink` (9.63:1); no muted text on gold.
   **Clarification (intentional, not an oversight):** the gold band is a full-bleed *decorative section background*, not a bordered UI component — WCAG 1.4.11 non-text contrast governs UI component boundaries and information-bearing graphics, so it does not apply to the band field itself. Every piece of text and every control ON the band uses `--gold-ink` (9.63:1, verified), and interactive gold fills inside it still carry the light-theme 1px `--ring` border per hard rule 3. No muted or secondary text may ever appear on the band.

Everything else — header, free-pick cards, 3-step section, footer — holds the structure register: neutral surfaces, hairlines, sans body, no gold except interactive accents.

## Type

- **Display + body: Archivo** (Google Fonts, variable; fallback `system-ui, -apple-system, 'Segoe UI', sans-serif`). Compact grotesque — sharp at heavy weights, screen-ready realist structure. Replaces Mulish.
- **Numerals & timestamps: Spline Sans Mono** (already loaded by the app; fallback `ui-monospace, monospace`). Used for: the stat row (W-L-P, net units, ROI), chart headline + axis/date labels, posted-at timestamps, odds, and the `$30` price. Naturally tabular — no layout shift on live updates.
- **Serif: Bodoni Moda — wordmark asset only.** Never set as page text. (Mulish's Google-Fonts import can be dropped at adoption time; Bodoni Moda stays only if the wordmark is ever rendered as live text.)
- **Pairing logic:** deliberate contrast (grotesque × mono), per the appendix pairing rule — not the uncanny middle.
- **Scale:** ratio 1.25 (major third) from 16px — `12 / 14 / 16 / 20 / 25 / 31 / 39 / 49` px (`--text-xs` … `--text-4xl`), plus display steps `61` (`--text-display`, section-level stats) and `76` (`--text-stat`, hero record number, mobile may clamp to 61).
- **Leading:** body 1.5 · display 1.1 · mono stats 1.0. **Weights:** Archivo 400/500/600/700 (800 display only); Spline Sans Mono 500/600.
- **Eyebrow style** (kept from current system, re-typed): Archivo 600, 11px, 0.16em tracking, uppercase, `--muted-foreground`.

### Fonts adoption note (Phase 3 / implementation — exact lines, so the wrong fonts cannot render)

Archivo is specced above but is **not** in the current `src/index.css` Google Fonts import (which still loads Bodoni Moda + Mulish). At adoption time, replace the existing `@import` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Spline+Sans+Mono:wght@500;600&display=swap');
```

Font-family stacks (define as tokens and use everywhere — never bare family names):

```css
--font-display: 'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif;  /* display + body */
--font-mono: 'Spline Sans Mono', ui-monospace, monospace;                     /* numerals, timestamps, odds, price */
```

The Mulish import line is dropped (Archivo replaces it). The Bodoni Moda import may also be dropped **only after verifying** the wordmark SVGs render their `<text>` correctly without it in the target browsers (the SVGs reference `'Bodoni Moda', serif`); until verified, keep the Bodoni Moda import. Bodoni Moda is never set as page text either way.

## Color tokens

Generated by `palette.mjs` (design-for-ai 4.2.0): `--seed "#d8b773" --chroma balanced --harmony mono --scheme both` → seed reported as `oklch 0.79 0.095 84.5` — the brand gold is the seed by construction. **Script exit 0.** Full output archived at `.design-foundations/build/palette-gold-balanced-mono.css`.

### palette.mjs output (verbatim)

```css
/* seed: derived from #d8b773 (oklch 0.79 0.095 84.5) · chroma: balanced · harmony: mono */
:root {
  --neutral-1: #fdfdfc;  --neutral-2: #f9f9f7;  --neutral-3: #f2f0ed;  --neutral-4: #eae8e4;
  --neutral-5: #e0ded8;  --neutral-6: #d5d2cb;  --neutral-7: #c7c3bb;  --neutral-8: #afaaa1;
  --neutral-9: #bdb7ab;  --neutral-10: #aaa499; --neutral-11: #66635c; --neutral-12: #2f2e2a;
  --accent-1: #fffcf7;   --accent-2: #fdf8f0;   --accent-3: #f9efdd;   --accent-4: #f4e6cb;
  --accent-5: #efdcb7;   --accent-6: #e7cfa0;   --accent-7: #dcc086;   --accent-8: #c8a65e;
  --accent-9: #dbb155;   --accent-10: #c69e48;  --accent-11: #76602f;  --accent-12: #382c13;
  --accent-on-solid: #110d04;
  --error-3: #ffebe9;    --error-9: #e1524f;    --error-11: #974843;
  --success-3: #e0f8e0;  --success-9: #5ad664;  --success-11: #337437;
  --warning-3: #f9f0dd;  --warning-9: #dbb155;  --warning-11: #76602f;
  --info-3: #e3f3ff;     --info-9: #5baee5;     --info-11: #3d6886;
}
[data-theme="dark"] {
  --neutral-1: #131312;  --neutral-2: #1a1918;  --neutral-3: #232220;  --neutral-4: #2b2a27;
  --neutral-5: #34322e;  --neutral-6: #3e3b36;  --neutral-7: #4c4942;  --neutral-8: #646057;
  --neutral-9: #bdb7ab;  --neutral-10: #d0cabe; --neutral-11: #bab7b0; --neutral-12: #eae8e3;
  --accent-1: #14120f;   --accent-2: #1c1913;   --accent-3: #282113;   --accent-4: #332912;
  --accent-5: #3f300e;   --accent-6: #4c3808;   --accent-7: #5e4502;   --accent-8: #7a5b04;
  --accent-9: #dbb155;   --accent-10: #edc56f;  --accent-11: #cdb482;  --accent-12: #f5e6c9;
  --accent-on-solid: #110d04;
  --error-3: #331a18;    --error-9: #e1524f;    --error-11: #f49c95;
  --success-3: #152715;  --success-9: #5ad664;  --success-11: #88cb8a;
  --warning-3: #282113;  --warning-9: #dbb155;  --warning-11: #cdb482;
  --info-3: #17242d;     --info-9: #5baee5;     --info-11: #90bedf;
}
```

**Contrast report (palette.mjs, verbatim — all PASS, exit 0):**

```
PASS  [light] neutral-11 on neutral-2: 5.68:1 (target 4.5:1)
PASS  [light] neutral-12 on neutral-2: 12.91:1 (target 7:1)
PASS  [light] neutral-12 on neutral-3: 12:1 (target 4.5:1)
PASS  [light] accent-11 on neutral-2: 5.71:1 (target 4.5:1)
PASS  [light] accent-11 on accent-2: 5.71:1 (target 4.5:1)
PASS  [light] accent-on-solid on accent-9: 9.63:1 (target 4.5:1)
PASS  [dark] neutral-11 on neutral-2: 8.75:1 (target 4.5:1)
PASS  [dark] neutral-12 on neutral-2: 14.25:1 (target 7:1)
PASS  [dark] neutral-12 on neutral-3: 12.94:1 (target 4.5:1)
PASS  [dark] accent-11 on neutral-2: 8.73:1 (target 4.5:1)
PASS  [dark] accent-11 on accent-2: 8.73:1 (target 4.5:1)
PASS  [dark] accent-on-solid on accent-9: 9.63:1 (target 4.5:1)
```

### App token block (drop-in for `src/index.css` — same alias vocabulary, HSL triples)

```css
:root {
    --background: 60 14.3% 97.3%;        /* #f9f9f7  n2 — page */
    --foreground: 48 5.6% 17.5%;         /* #2f2e2a  n12 */
    --card: 60 20% 99%;                  /* #fdfdfc  n1 — cards sit lighter */
    --card-foreground: 48 5.6% 17.5%;    /* #2f2e2a */
    --popover: 60 20% 99%;               /* #fdfdfc */
    --popover-foreground: 48 5.6% 17.5%; /* #2f2e2a */
    /* --primary is FILL-ONLY in light theme: #dbb155 as text on the page bg is 1.91:1 — hard AA FAIL.
       Never use text-primary / color: hsl(var(--primary)) for foreground text in light theme.
       All gold-colored TEXT uses --primary-text (= --brass #76602f, 5.72:1 on page bg). */
    --primary: 41 65% 59.6%;             /* #dbb155  gold (accent-9) — fills only, always with --primary-foreground ink */
    --primary-foreground: 42 61.9% 4.1%; /* #110d04  ink-on-gold 9.63:1 */
    --primary-text: 41 43% 32.4%;        /* #76602f  gold-colored text/icons/links (alias of --brass) — 5.72:1 on bg, 5.92:1 on card */
    --secondary: 40 12.5% 90.6%;         /* #eae8e4  n4 */
    --secondary-foreground: 48 5.6% 17.5%;
    --muted: 36 16.1% 93.9%;             /* #f2f0ed  n3 */
    --muted-foreground: 42 5.2% 38%;     /* #66635c  n11 — 5.68:1 */
    --accent: 39 70% 92.2%;              /* #f9efdd  gold tint (accent-3) */
    --accent-foreground: 41 43% 32.4%;   /* #76602f  deep gold — 5.29:1 on --accent #f9efdd */
    --destructive: 4 38.5% 42.7%;        /* #974843  error-11 (fill + text) */
    --destructive-foreground: 0 0% 100%; /* 6.32:1 on fill */
    --success: 124 38.9% 32.7%;          /* #337437  success-11 */
    --success-foreground: 0 0% 100%;     /* 5.68:1 */
    --warning: 41 43% 32.4%;             /* #76602f  deep gold as warning */
    --warning-foreground: 0 0% 100%;     /* 6.03:1 */
    --border: 42 10.6% 81.6%;            /* #d5d2cb  n6 — decorative hairlines */
    --input: 42 5.2% 38%;                /* #66635c  n11 — field border ≥3:1 */
    --ring: 41 43% 32.4%;                /* #76602f  focus — 5.92:1 vs card */
    /* raw Edge Club tokens */
    --gold: 41 65% 59.6%;                /* #dbb155 */
    --gold-ink: 42 61.9% 4.1%;           /* #110d04 */
    --brass: 41 43% 32.4%;               /* #76602f  deep gold: gold TEXT + light gold-button border */
    --surface-2: 36 16.1% 93.9%;         /* #f2f0ed  inset wells (n3) */
    --hairline: 45 11.4% 86.3%;          /* #e0ded8  n5 */
    --dim: 39 9.1% 63.3%;                /* #aaa499  n10 placeholder */
    --loss: 4 38.5% 42.7%;               /* #974843  text-safe loss */
    --win: 124 38.9% 32.7%;              /* #337437  text-safe win */
    --radius: 0.5rem;                    /* 8px */
    color-scheme: light;
}
.dark {
    --background: 60 2.7% 7.3%;          /* #131312  n1 */
    --foreground: 43 14.3% 90.4%;        /* #eae8e3  n12 */
    --card: 30 4% 9.8%;                  /* #1a1918  n2 */
    --card-foreground: 43 14.3% 90.4%;
    --popover: 40 4.5% 13.1%;            /* #232220  n3 */
    --popover-foreground: 43 14.3% 90.4%;
    /* Dark theme: --primary passes as text too (#dbb155 on #131312 = 9.24:1), but use --primary-text
       for all gold TEXT anyway so components stay theme-agnostic (one alias, safe in both themes). */
    --primary: 41 65% 59.6%;             /* #dbb155  gold — fills pair with --primary-foreground ink */
    --primary-foreground: 42 61.9% 4.1%; /* #110d04  9.63:1 */
    --primary-text: 40 42.9% 65.7%;      /* #cdb482  gold-colored text (alias of dark --brass) — 9.25:1 on bg, 8.73:1 on card */
    --secondary: 45 4.9% 16.1%;          /* #2b2a27  n4 */
    --secondary-foreground: 43 14.3% 90.4%;
    --muted: 40 4.5% 13.1%;              /* #232220  n3 */
    --muted-foreground: 42 6.8% 71%;     /* #bab7b0  n11 — 8.77:1 */
    --accent: 40 35.6% 11.6%;            /* #282113  gold tint (accent-3) */
    --accent-foreground: 40 42.9% 65.7%; /* #cdb482  8.73:1 */
    --destructive: 1 70.9% 59.6%;        /* #e1524f  error-9 fill */
    --destructive-foreground: 60 2.7% 7.3%; /* ink fg — 4.89:1 */
    --success: 125 60.2% 59.6%;          /* #5ad664  success-9 */
    --success-foreground: 60 2.7% 7.3%;  /* 9.95:1 */
    --warning: 41 65% 59.6%;             /* #dbb155 */
    --warning-foreground: 42 61.9% 4.1%;
    --border: 38 6.9% 22.7%;             /* #3e3b36  n6 */
    --input: 41 7% 44.7%;                /* #7a756a  n8.5 interpolation — 3.83:1 */
    --ring: 41 65% 59.6%;                /* #dbb155  8.72:1 */
    /* raw Edge Club tokens */
    --gold: 41 65% 59.6%;                /* #dbb155 */
    --gold-ink: 42 61.9% 4.1%;           /* #110d04 */
    --brass: 40 42.9% 65.7%;             /* #cdb482  deep-gold text tone */
    --surface-2: 60 2.7% 7.3%;           /* #131312  wells = page depth */
    --hairline: 40 4.5% 13.1%;           /* #232220  n3 */
    --dim: 42 7% 36.7%;                  /* #646057  n8 placeholder */
    --loss: 4 81.2% 77.1%;               /* #f49c95  text-safe loss — 8.39:1 */
    --win: 122 39.2% 66.5%;              /* #88cb8a  text-safe win — 9.16:1 */
    --radius: 0.5rem;
    color-scheme: dark;
}
```

**Supplemental alias-pair verification** (WCAG 2.x computed on the mapped values above — all PASS at their targets):
light body 12.89:1 · light muted-fg 5.68:1 · light gold text (`--brass`/`--primary-text` #76602f on neutral-2) 5.72:1 · light `--accent-foreground` (#76602f on `--accent` #f9efdd) 5.29:1 · ink-on-gold 9.63:1 · light destructive fill 6.32:1 / text 5.99:1 · light success 5.68/5.39:1 · light input border 5.68:1 · light ring 5.92:1 · dark body 14.34:1 · dark muted-fg 8.77:1 · dark gold text (`--brass`/`--primary-text` #cdb482) 8.73:1 on card / 9.25:1 on bg · dark gold vs bg (non-text) 9.24:1 · dark destructive fill 4.89:1 / text 8.39:1 · dark success 9.95/9.16:1 · dark input 3.83:1 · dark ring 8.72:1.

### Hard rules (contrast law — the defects the old palette had, fixed here)

1. **Gold is never light-theme text at accent-9.** Historic `#b58a3c` on white measures **3.15:1 — FAIL**; `#dbb155` on the light page is **1.91:1 — FAIL**. Light-theme gold text/icons/links always use `--brass` `#76602f` (5.72:1). Dark theme may use `--gold` or `--brass` freely (both ≥8:1). **Structural enforcement:** `--primary` is a *fill-role* alias — in light theme it is fill-only, always paired with `--primary-foreground` ink. All gold-colored *text* goes through **`--primary-text`** (light `#76602f` 5.72:1 · dark `#cdb482` 9.25:1), defined in both theme blocks. Components never set `text-primary` / `color: hsl(var(--primary))` as a foreground.
2. **Ink on gold, always.** Any `--gold` fill (CTA button, gold band, active range tab) uses `--gold-ink` text — 9.63:1 both themes. No white-on-gold, no muted-on-gold.
3. **Light-theme gold fills carry a 1px `--ring` border** (`#76602f`, 5.92:1 boundary) — a bare gold fill on near-white is 1.91:1 and fails non-text AA. Dark theme needs no border (gold vs bg 9.24:1).
4. **Loss/win as text** use `--loss`/`--win` (text-safe steps), not `--destructive`/`--success` fills. **Usage context (dark theme):** dark `--loss` (`--error-11` `#f49c95`) is *page-background* safe — 8.88:1 on the dark bg, 8.39:1 on card. Do **NOT** use it as text on the `--destructive` fill badge (`#e1524f`): that pair is 1.82:1 — FAIL. Text ON the destructive fill is always `--destructive-foreground` (ink `#131312`, 4.89:1). Reserve `--loss` for standalone text lines and for badges that pair color with the letter glyph.
5. **Wordmark theme rule (RESOLVED — assets delivered).** The cream-fill SVG (`#f4efe6`) is 1.09:1 on the light page — invisible. The ink-fill variants exist and are the law:
   - **Light theme** uses **`public/edgeable-wordmark-ink.svg`** and **`public/edgeable-icon-ink.svg`** — text fill `#2f2e2a` (`--foreground`), 12.89:1 on the page bg / 13.35:1 on card. The gold blade stays `#d8b773` (1.82:1 on light bg — acceptable: the blade is a decorative logotype ornament, not a UI component or information-bearing graphic; the ink text carries legibility).
   - **Dark theme** uses the existing **`public/edgeable-wordmark.svg`** and **`public/edgeable-icon.svg`** — cream `#f4efe6` at 16.23:1, blade at 9.69:1.
   - Asset aliases for implementation: `--wordmark-asset-light: url('/edgeable-wordmark-ink.svg')` / `--wordmark-asset-dark: url('/edgeable-wordmark.svg')` (same pattern for the icon). Components reference the alias, never a hardcoded path, so theme switching swaps the asset.

## Space, shape, depth

- **Spacing scale:** 4-base — `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96` px. Section vertical padding: 64 mobile / 96 desktop. Editorial Spread's "deliberate gaps": section headers may sit offset-left of their content column on desktop; stat row tiles keep unequal gutters over uniform-card-grid symmetry.
- **Radius:** `--radius` 8px (down from 11) — cards, buttons, fields all 8px; badges/chips 4px; **no pills**; the motif line and hairlines square (0).
- **Borders/shadows:** hierarchy from **1px hairlines**, not shadows — `--border` for card edges and dividers, `--input` for field borders, `--ring` for focus (2px offset ring, kept from current system). The only shadow is the existing `card-glow` top-edge inset highlight (already hue-neutral warm, never pure black). No glassmorphism, no glow.
- **JOURNEY.md Phase-2 decisions:** header **static** (not sticky — nothing competes with the proof); hero anchor CTA = **text link in `--brass`/dark `--brass`** with rising-edge-colored underline on hover (low weight per spec); range-tab active state = **`--gold` fill + `--gold-ink` text** pill-less rounded-4px tab (light adds the 1px ring border per hard rule 3); primary CTA = `--gold` solid, 48px min-height (light adds ring border); /card cross-link CTA = **`--muted-foreground` text link, `--brass` on hover** — subdued per the restraint rationale.

## Motion

- **Timing:** micro 120ms / standard 180ms / large 650ms (chart + motif draw-in only) · **Easing:** `cubic-bezier(0.2, 0, 0, 1)` sharp ease-out for state changes; `cubic-bezier(0.22, 1, 0.36, 1)` for the two draw-ins (existing `chart-reveal` curve).
- **Allowed:** hover/press/focus state changes; the chart draw-in once per load; the hero motif draw-in once per load; stat count-up once on first paint (≤500ms); scrub feedback (instant, no easing).
- **Never:** ambient loops on /join (the `ec-glow` sign-in loader stays a sign-in-only exception); parallax; scroll-triggered entrance cascades; bounce easing; animated gradients.
- **prefers-reduced-motion:** all animation `none`; chart and motif render complete; count-up renders final value.

## Never (this project's tells at risk)

- **No default-shadcn look** — the named failure mode. Concretely: no uniform card grid of identical rounded boxes, no `slate` greys, no shadow-based elevation stack, no generic hero-badge-pill + gradient-text pattern.
- **No cream/serif regression** — `#f6f1e8`-family backgrounds and Bodoni-as-page-text are retired. The neutrals above are warm near-neutrals, not paper.
- **No second accent hue.** Mono harmony: gold is the only brand hue. Functional colors (loss red / win green / info blue) appear only carrying their function — never decoratively. (Red never dominates a section — analytical context, ch09.)
- **No gradient gold / metallic-effect gold.** Gold is flat `--gold` (Art Deco "not gradient gold").
- **No dark-default glowing hero** (banned tell cell adjacent to this DNA): dark hero light comes from type contrast and the one gold rule, not glows.
- **No second diagonal.** One rising edge per viewport, −4.6°, or none.
- **Color never the sole status signal:** W/L/P badges pair color with the letter glyph (ch08 redundant-cue rule — already the app's pattern).

## Open questions

- Adoption sequencing for the rest of the app (this DNA is app-adoptable by design; /join ships first) — orchestrator/user call.
- /join OG share image using the motif — deliverable flagged in research; belongs to mock/build, tokens here feed it.
- Whether to drop the Mulish + Bodoni Moda Google-Fonts imports at adoption time (perf win; wordmark is SVG-outlined text so Bodoni may still be needed for SVG `<text>` rendering — verify at build).
