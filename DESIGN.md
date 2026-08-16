# Design: Dusk Ledger

**Date:** 2026-08-14 · **Status:** **LOCKED** (confirmed by Sean on the rendered desktop mock, 2026-08-14 — replaces the rejected "Gilt Ledger" DNA; this is law for all downstream design and implementation)
**Amended 2026-08-14 on Sean's direct feedback** (user-ordered amendments to the locked DNA — see Changelog at the end): (1) all violet/purple removed; hero gradient re-tuned to a premium warm-metal register (champagne / pale amber / warm bronze light · deep espresso / dark bronze / amber ember dark), every text-on-gradient pair re-verified AA via `.design-foundations/build/contrast-2c.mjs`; (2) Portal device-frame mockups with soft glow rings adopted as a component; (3) atmospheric hero depth (layered radial washes) and page-richness guidance added. The AA law, gold-as-only-accent, type system, and token vocabulary are unchanged.
**Archetype:** Ruler (primary), Sage inflecting the data presentation only · **Register:** twilight-calm structure · expressive at: the atmospheric gradient hero (the page's one expressive moment), chart reveal (moderate)
**Grounding:** Refero "Portal" style (https://styles.refero.design/style/b9aeb945-2f6e-4557-9115-e3ff3a8f8dc8) — twilight editorial: premium magazine calm + native-app polish — collided with Edgeable's proof-first content (the verifiable record, the units curve)
**DNA:** Twilight editorial (base) + numeric proof voice (Spline Sans Mono) retained from the product · **Dominant axis:** composition (calm centered air + soft depth)
**Composition:** user-pinned — calm centered, ~1200px max-width, 80–120px desktop section gaps, soft-depth cards (variance ~2). The previously dealt Editorial Spread cell was rejected by Sean on rendered pixels and stays consumed per the re-deal protocol; every axis is now user law from the Portal reference, so no fresh deal was run (pinned axes are dealt around, never re-chosen).
**Pins (user law):** hue pinned to brand gold `#d8b773` family (OKLCH hue 84.5) as the SINGLE chromatic accent, used sparingly and functionally only; ALL-SANS page (serif = logo asset only); no gold bands or large gold fields; warm dusk atmospheric gradient hero; DESKTOP-FIRST (1200px composition is primary, mobile adapts down); both themes follow system; WCAG AA law unchanged; token block stays in the `src/index.css` shadcn HSL-triple vocabulary.

---

## Direction

A calm, premium dusk: near-monochrome paper-and-ink surfaces, one warm gold accent that only ever means "act here," and a soft twilight-sky gradient behind the record — the page's single expressive moment, and it backs the proof. The luxury is air and softness (24px cards, pill buttons, glow-ring depth, 100px of breathing room between sections), not severity. The mono numerals still do the talking: the record, the curve, the timestamps. Editorial beauty over feature claims; handcrafted, never SaaS-template.

## Comps (reference points)

| Comp | Borrowed (as-is) | Adapted (translated for Edgeable) |
|------|------------------|-----------------------------------|
| **Refero "Portal"** (primary — user-supplied law) | Near-mono neutral system (paper white / ash / smoke / graphite / ink); EXACTLY ONE chromatic accent, sparing and functional (buttons, links, active states); atmospheric gradient hero; generous centered air (80–120px desktop gaps, ~1200px max-width); soft depth (22–30px card radii, pill buttons, glow-ring elevation, no hard hairlines or drop-shadow stacks); Inter-class type neutrality | Accent: their iOS blue → **brand gold** `#d8b773` family, with the light-theme text-safe step (`--primary-text`). Gradient: their sky-blue → violet → coral → **warm dusk gold-hour** (champagne → pale amber → warm bronze light / deep espresso → dark bronze → amber ember dark; amended 2026-08-14 — the original soft-violet horizon is removed per Sean's "no purple, more premium" order) so it flatters flat gold and stays on-brand. Their device-frame product mockups with soft glow rings → adopted (amendment 2, below). Their serif headlines → rejected: page stays ALL-SANS per Sean's pin; serif lives in the wordmark only |
| **Robinhood** (portfolio view) | Equity-curve-as-hero: one large live number, scrubable line, range tabs, chrome out of the way — already the app's `PerformanceChart.jsx` baseline | Curve rendered in the calm register: gold line on neutral ground, single zero-baseline hairline (information-bearing, so it survives), soft draw-in once |
| **Mercury** (mercury.com) | Bank-grade credibility across BOTH finished themes; warm-neutral light mode that reads precise, not creamy | Kept as the register model for "closer to fintech than sportsbook," now expressed through softness and air instead of hairline severity |

## The rising-edge motif (resolved: chart-only)

The −4.6° wordmark-blade diagonal survives **only as the equity-curve line itself** — the chart IS the rising edge, authentically, when the record rises. No decorative diagonal rules anywhere: no hero underline motif, no diagonal dividers, no forced horizon line in the gradient. A hard 3–4px diagonal is exactly the hairline severity this register retires; the motif is not forced, per the pin.

## Expressive moments

1. **Atmospheric gradient hero** (peak): the dusk-sky gradient backs Section 1 (record hero) ONLY — full-bleed behind the header + hero, dissolving into `--background` before Section 2. Hero content (headline, stat row in Spline Sans Mono at display sizes, tamper-evidence panel, anchor link) sits directly on it under the text-on-gradient law below. The gradient is static: no animation, no parallax, no aurora drift.
2. **Chart reveal** (moderate): 700ms left-to-right draw-in (existing `chart-reveal` pattern, softened timing), once per load; scrub feedback instant.

Everything else — free-pick cards, 3-step section, price/CTA panel, footer — holds the calm structure register: neutral surfaces, soft depth, generous air, gold only on interactive elements.

## Type

- **Display + body: Inter** (Google Fonts, variable; fallback `system-ui, -apple-system, 'Segoe UI', sans-serif`). Chosen over keeping Archivo: the Portal register is Inter-class neutrality — realist/neo-grotesque, tall x-height, screen-native, no display-face aggression. Archivo's compact sharp shoulders were the old severity; in a calm centered composition they fight the register. Display sizes track −0.02em; weights capped at 700 (no 800 shouting).
- **Numerals & timestamps: Spline Sans Mono** (already app-loaded; fallback `ui-monospace, monospace`) — KEPT. The record and chart are the proof; naturally-tabular mono means no layout shift on live scrub, and the grotesque × mono collision is the page's one type tension. Used for: stat row (W-L-P, net units, ROI), chart headline + axis/date labels, posted-at timestamps, odds, the `$30` price.
- **Serif: Bodoni Moda — wordmark asset only.** Never set as page text.
- **Pairing logic:** deliberate contrast (neutral grotesque × mono), per the appendix pairing rule — not the uncanny middle.
- **Scale:** ratio 1.25 (major third) from 16px — `12 / 14 / 16 / 20 / 25 / 31 / 39 / 49` px (`--text-xs` … `--text-4xl`), plus display steps `61` (`--text-display`) and `76` (`--text-stat`, hero record number — desktop primary; mobile clamps to 61).
- **Leading:** body 1.55 (airier than the old 1.5, serving the generous-air register) · display 1.1 · mono stats 1.0. **Weights:** Inter 400/500/600/700; Spline Sans Mono 500/600.
- **Eyebrow style:** Inter 600, 11px, 0.14em tracking, uppercase, `--muted-foreground`.

### Fonts adoption note (implementation — exact lines)

Replace the existing `@import` in `src/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Spline+Sans+Mono:wght@500;600&display=swap');
```

```css
--font-display: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;  /* display + body */
--font-mono: 'Spline Sans Mono', ui-monospace, monospace;                   /* numerals, timestamps, odds, price */
```

Mulish and Archivo imports are dropped. The Bodoni Moda import may be dropped **only after verifying** the wordmark SVGs render their `<text>` correctly without it in target browsers; until verified, keep it. Bodoni Moda is never page text either way.

## Color tokens

Generated by `palette.mjs` (design-for-ai 4.2.0): `--seed "#d8b773" --chroma balanced --harmony mono --scheme both` → seed reported as `oklch 0.79 0.095 84.5` — the brand gold is the seed by construction, and the generated neutral ramp is exactly the Portal near-mono system (paper white / ash / smoke / graphite / ink with a faint warm cast that flatters gold). **Script exit 0** (re-run 2026-08-14 for this re-deal). Full output archived at `.design-foundations/build/palette-gold-balanced-mono-2b.css`.

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
    --border: 42 10.6% 81.6%;            /* #d5d2cb  n6 — decorative edges (rare; see depth system) */
    --input: 42 5.2% 38%;                /* #66635c  n11 — field border ≥3:1 (5.68:1) */
    --ring: 41 43% 32.4%;                /* #76602f  focus + light gold-fill boundary — 5.92:1 vs card */
    /* raw Edge Club tokens */
    --gold: 41 65% 59.6%;                /* #dbb155 */
    --gold-ink: 42 61.9% 4.1%;           /* #110d04 */
    --brass: 41 43% 32.4%;               /* #76602f  deep gold: gold TEXT + light gold-fill border */
    --surface-2: 36 16.1% 93.9%;         /* #f2f0ed  inset wells (n3) */
    --hairline: 45 11.4% 86.3%;          /* #e0ded8  n5 — information-bearing rules ONLY (chart zero baseline) */
    --dim: 39 9.1% 63.3%;                /* #aaa499  n10 placeholder */
    --loss: 4 38.5% 42.7%;               /* #974843  text-safe loss */
    --win: 124 38.9% 32.7%;              /* #337437  text-safe win */
    /* dusk gradient hero (Section 1 backdrop only) — warm metal, no violet (amended 2026-08-14).
       Every stop AA-verified for hero text colors, incl. under the 10% gold atmospheric wash. */
    --hero-g1: 41 88% 93.5%;             /* #fdf4e0  champagne sky (top) */
    --hero-g2: 38 73.6% 89.6%;           /* #f8ead1  pale amber */
    --hero-g3: 40 62.9% 86.3%;           /* #f2e3c6  warm bronze (horizon) */
    /* soft depth */
    --elev-ring: 0 0 0 5px hsl(45 11% 86% / 0.6), 0 24px 64px -32px hsl(33 20% 20% / 0.16);
    --radius: 0.875rem;                  /* 14px — fields, small controls */
    --radius-card: 1.5rem;               /* 24px — cards */
    --radius-panel: 1.75rem;             /* 28px — feature panels (tamper callout, price panel) */
    --radius-pill: 9999px;               /* pill buttons + tabs */
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
    --muted-foreground: 42 6.8% 71%;     /* #bab7b0  n11 — 9.29:1 */
    --accent: 40 35.6% 11.6%;            /* #282113  gold tint (accent-3) */
    --accent-foreground: 40 42.9% 65.7%; /* #cdb482  7.93:1 */
    --destructive: 1 70.9% 59.6%;        /* #e1524f  error-9 fill */
    --destructive-foreground: 60 2.7% 7.3%; /* ink fg — 4.89:1 */
    --success: 125 60.2% 59.6%;          /* #5ad664  success-9 */
    --success-foreground: 60 2.7% 7.3%;  /* 9.95:1 */
    --warning: 41 65% 59.6%;             /* #dbb155 */
    --warning-foreground: 42 61.9% 4.1%;
    --border: 38 6.9% 22.7%;             /* #3e3b36  n6 — decorative edges (rare) */
    --input: 41 7% 44.7%;                /* #7a756a  n8.5 interpolation — 4.05:1 */
    --ring: 41 65% 59.6%;                /* #dbb155  9.24:1 */
    /* raw Edge Club tokens */
    --gold: 41 65% 59.6%;                /* #dbb155 */
    --gold-ink: 42 61.9% 4.1%;           /* #110d04 */
    --brass: 40 42.9% 65.7%;             /* #cdb482  deep-gold text tone */
    --surface-2: 60 2.7% 7.3%;           /* #131312  wells = page depth */
    --hairline: 40 4.5% 13.1%;           /* #232220  n3 — information-bearing rules ONLY */
    --dim: 42 7% 36.7%;                  /* #646057  n8 placeholder */
    --loss: 4 81.2% 77.1%;               /* #f49c95  text-safe loss — 8.88:1 */
    --win: 122 39.2% 66.5%;              /* #88cb8a  text-safe win — 9.70:1 */
    /* dusk gradient hero — warm metal, no violet (amended 2026-08-14).
       Every stop AA-verified for hero text colors, incl. under the 15% gold atmospheric wash. */
    --hero-g1: 23 19% 8.2%;              /* #191411  deep espresso (top) */
    --hero-g2: 30 33.3% 10.6%;           /* #241b12  dark bronze */
    --hero-g3: 28 36.6% 16.1%;           /* #38281a  amber ember (horizon) */
    /* soft depth */
    --elev-ring: 0 0 0 5px hsl(40 5% 13% / 0.8), 0 24px 64px -32px hsl(0 0% 0% / 0.55);
    --radius: 0.875rem;
    --radius-card: 1.5rem;
    --radius-panel: 1.75rem;
    --radius-pill: 9999px;
    color-scheme: dark;
}
```

**Supplemental alias-pair verification** (WCAG 2.x computed 2026-08-14 via `.design-foundations/build/contrast-2b.mjs` — **all required pairs PASS, exit 0**):
light body 12.89:1 (bg) / 13.35:1 (card) · light muted-fg 5.68:1 · light gold text (`--primary-text` #76602f) 5.72:1 bg / 5.92:1 card · light `--accent-foreground` on `--accent` 5.29:1 · ink-on-gold 9.63:1 · light destructive fill 6.32:1 / text 5.99:1 · light success 5.68/5.39:1 · light input border 5.68:1 · light ring 5.92:1 · dark body 15.18:1 (bg) / 14.34:1 (card) · dark muted-fg 9.29:1 · dark gold text (#cdb482) 9.25:1 bg / 8.73:1 card · dark gold vs bg (non-text) 9.24:1 · dark destructive fill 4.89:1 / text 8.88:1 · dark success 9.95/9.70:1 · dark input 4.05:1 · dark ring 9.24:1 · **gradient stops (amended 2026-08-14, re-verified via `.design-foundations/build/contrast-2c.mjs` — all required pairs PASS, exit 0), light** (ink / brass link / muted-fg on each stop): #fdf4e0 → 12.42 / 5.51 / 5.48 · #f8ead1 → 11.44 / 5.07 / 5.05 · #f2e3c6 → 10.73 / 4.76 / 4.73 · light ring border vs stops ≥4.76 (non-text ≥3) · light worst-case composite under the 10% gold atmospheric wash (#f0debb): ink 10.27 / brass 4.55 / muted-fg 4.53 / ring 4.55 · **gradient stops, dark** (fg / gold-text / muted-fg / gold-pill-non-text on each stop): #191411 → 14.92 / 9.09 / 9.12 / 9.08 · #241b12 → 13.83 / 8.42 / 8.45 / 8.41 · #38281a → 11.54 / 7.03 / 7.06 / 7.02 · dark worst-case composite under the 15% gold wash (#503d23): fg 8.44 / gold-text 5.14 / muted-fg 5.16 / pill 5.13 · device-frame chrome address label (`--muted-foreground` on `--muted`): light 5.27 / dark 7.94.

## The gradient hero — spec + text-on-gradient law

- **Where:** backs Section 0 (header) + Section 1 (record hero) only. `linear-gradient(180deg, hsl(var(--hero-g1)) 0%, hsl(var(--hero-g2)) 55%, hsl(var(--hero-g3)) 100%)`, dissolving into `--background` at the section boundary (a final blend stop into the page color — no hard seam). Static; never animated.
- **Atmospheric depth (amendment 3, 2026-08-14 — Portal's hero landscape, translated):** the gradient is no longer a flat wash. Layer static radial washes over it for a gold-hour horizon glow: soft `radial-gradient` ellipses of `hsl(var(--gold) / α)` low on the hero (the "sun below the horizon" glow) and of `hsl(var(--hero-g1))`/`hsl(var(--hero-g3))` for sky banding. **Wash alpha law:** gold washes are capped at **10% alpha in light theme, 15% in dark** — the worst-case composited color at those caps is AA-verified for all three permitted hero text colors (report above; `contrast-2c.mjs` computes the composites). No landscape silhouette shape (a hard horizon edge is retired hairline severity); depth comes from layered light, not drawn terrain. Still static: no drift, no parallax.
- **Text-on-gradient law (contrast rule):** text on the gradient must sit on a **guaranteed-contrast zone or a scrim**. The entire gradient is a guaranteed-contrast zone for exactly three text colors — `--foreground`, `--primary-text`, `--muted-foreground` — because every stop × each of those colors is computed ≥4.5:1 in both themes (report above). Any OTHER text color over the gradient requires a `--card` scrim at ≥85% opacity (e.g. the tamper-evidence panel), and is then judged as the text-on-card pair. No exceptions, no "it looks readable."
- **Gold on the gradient:** dark theme — gold pills/fills pass non-text ≥3:1 against every stop (≥7.02:1 raw, ≥5.13:1 under the 15% wash), no border needed. Light theme — bare gold on the light stops is 1.59–1.84:1 (computed FAIL), so light-theme gold fills on the gradient (and anywhere light) carry the 1px `--ring` border per hard rule 3.
- **Wordmark on the gradient:** light theme uses the ink wordmark (fill #2f2e2a, ≥10.73:1 on every stop); dark theme uses the cream wordmark (≥11:1). Same assets as the theme rule below.

## Hard rules (contrast law — carried forward and extended)

1. **Gold is never light-theme text at accent-9.** `#dbb155` on the light page is 1.91:1 — FAIL. All gold-colored text/icons/links go through **`--primary-text`** (light `#76602f` 5.72:1 · dark `#cdb482` 9.25:1), defined in both theme blocks. `--primary` is a fill-role alias: light theme fill-only, always paired with `--primary-foreground` ink. Components never set `text-primary` / `color: hsl(var(--primary))` as a foreground.
2. **Ink on gold, always.** Any `--gold` fill (pill CTA, active range tab) uses `--gold-ink` text — 9.63:1 both themes. No white-on-gold, no muted-on-gold.
3. **Light-theme gold fills carry a 1px `--ring` border** (`#76602f`) — on the page (5.92:1 vs card), and on the gradient (≥4.76:1 vs every stop). Bare gold on light grounds is 1.59–1.91:1 and fails non-text AA. Dark theme needs no border (≥5.13:1 everywhere, incl. under the wash).
4. **Loss/win as text** use `--loss`/`--win` (text-safe steps), not `--destructive`/`--success` fills. Dark `--loss` (`#f49c95`) is page/card safe (8.88/8.39:1) but is 1.82:1 on the `--destructive` fill — text ON the destructive fill is always `--destructive-foreground` ink (4.89:1). W/L/P badges pair color with the letter glyph (redundant cue, ch08) — color is never the sole status signal.
5. **Wordmark theme rule (assets exist).** Light theme: **`public/edgeable-wordmark-ink.svg`** / **`edgeable-icon-ink.svg`** (ink text #2f2e2a; the gold blade stays decorative). Dark theme: **`public/edgeable-wordmark.svg`** / **`edgeable-icon.svg`** (cream #f4efe6, 16.23:1). Alias pattern: `--wordmark-asset-light: url('/edgeable-wordmark-ink.svg')` / `--wordmark-asset-dark: url('/edgeable-wordmark.svg')`; components reference the alias, never a hardcoded path.

## Space, shape, depth (desktop-first)

- **Composition:** centered, symmetric, calm. Content max-width **1200px**, centered; text measure ~640px. Section headers centered above their content — never offset. Equal gutters. This replaces (and bans) the Editorial Spread asymmetry that read "weird on desktop."
- **Spacing scale:** 4-base — `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 112 / 120` px. **Desktop section gaps 96–120px (default 112)**; mobile adapts down to 64. Card internal padding: 32 desktop / 24 mobile.
- **Radius:** fields + small controls `--radius` 14px · cards `--radius-card` 24px · feature panels (tamper callout, price panel) `--radius-panel` 28px · buttons + range tabs full pill `--radius-pill` (primary CTA ~52px height, 28px side padding) · badges/chips 10px.
- **Depth = soft glow-ring, not hairlines, not shadow stacks.** Elevated surfaces use `box-shadow: var(--elev-ring)` — a 5px near-neutral ring + one soft ambient — on `--card`. No 1px border card edges, no layered drop shadows, no glassmorphism. Hairlines survive ONLY where information-bearing: the chart zero baseline (`--hairline`) and input borders (`--input`, ≥3:1). Focus stays the existing 2px `--ring` offset ring.
- **Section 5 (price + CTA) treatment — supersedes the retired gold band:** a centered `--card` panel (`--radius-panel`, `--elev-ring`) on the calm page ground; `$30` in Spline Sans Mono display; ONE gold pill CTA ("Join Edgeable", `--gold` fill + `--gold-ink` text, light adds the ring border); reassurance microcopy in `--muted-foreground` on the panel. Gold appears nowhere else in the section.

## Device frames + glow rings (amendment 2, 2026-08-14 — Portal component adopted)

Portal's white device-frame product mockups are now part of this DNA: "inside the app" previews rendered in clean frame cards, built as **pure HTML/CSS/SVG — never images**.

- **Browser frame:** a `--card` surface at `--radius-card`, elevated by `--elev-ring` (the 5px soft glow ring — same token, no new elevation system). Chrome bar: `--muted` strip with three `--border` window dots and a pill address label (`--muted-foreground` on `--muted`, 5.27:1 light / 7.94:1 dark — AA-verified). Content area shows real product surfaces (the performance chart, the record) with real data shapes.
- **Phone frame:** same recipe at `--radius-panel`+ (up to 32px outer), a `--muted` speaker/notch bar, content = a truthful miniature of the subscriber dashboard (stat header, mini curve, recent-days rows). Truthfulness law: previews depict surfaces that exist in the product; no invented features, no fake notification chrome.
- **Where they earn their glow:** the hero (a framed chart/record teaser is the hero's proof-object), Section 2 (the chart lives inside the browser frame), and optionally beside the price panel (dashboard preview = "what you get"). Frames never carry gold except where the real UI does (chart line, active tab, CTA).
- **Inside a frame,** the honest-chart law and token law apply unchanged: zero baseline `--hairline`, dips shown, `--gold` line, mono numerals.

### Richness guidance (amendment 3 — "stop looking so minimalistic")

The calm register stays, but calm ≠ sparse. Density levers that are law-compatible: device-frame previews (above); a fuller hero (stat row + framed proof teaser visible together); free-pick cards carrying their full JOURNEY.md field set as chips (sport tag, odds, units) in `--secondary`/`--accent` chip styles; small inline SVG iconography for the 3 steps (stroke `currentColor`, sitting in the existing number circles' register); the price panel expanded with a feature list drawn verbatim from the value-description phrases, check glyphs in `--primary-text`; a footer wordmark. Bounds: no fake testimonials, no fake scarcity, no invented copy (JOURNEY.md strings stay verbatim; only subordinate presentational elements and small factual labels may be added), gold stays interactive-only, section order unchanged.

## Motion (amended 2026-08-15 — amendment 4; amended 2026-08-16 — amendment 5, Sean's order)

- **Timing:** micro 140ms / standard 220ms / entrance 600ms (scroll reveals) / large 700ms (chart draw-in only) · **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` soft ease-out throughout (one curve; the register is calm, not snappy).
- **Allowed:** hover/press/focus state changes; the chart draw-in once per load; stat count-up once on first paint (≤500ms); scrub feedback (instant, no easing); scroll-triggered section entrances (spec below); the two permitted ambient loops: the chart live dot and the live-pending indicator blink (specs below); the chart range-swap re-draw (~500ms, on tab activation only).
- **Scroll entrances (supersedes the former "no scroll-triggered entrance cascades" ban, per Sean's direct order):** below-the-fold sections and cards reveal as they enter the viewport. Spec: fade from 0 plus a 20px rise, 600ms, the one soft ease-out curve, triggered by IntersectionObserver at ~15% visibility, ONCE only (unobserve after reveal; never re-trigger on scroll-up). Card grids stagger 80ms per card. Above-the-fold law: the gradient hero and header carry no reveal, and anything already inside the viewport at load is shown instantly; content above the fold never waits. Register law: these are subtle reveals, not showpieces. No bounce, no parallax, no scale/rotate theatrics. Progressive-enhancement law: the hidden state is applied only after JS confirms IntersectionObserver support; with no JS, nothing is ever hidden.
- **Chart "live" treatment:** the 700ms draw-in stays; the dot and labels wait for it. (1) **Area fill:** a soft gradient under the curve, flat `--gold` fading to transparent, alpha via `--chart-fill-a` (0.16 light / 0.22 dark; decorative non-text, no purple, no metallic), fading in during the draw. (2) **Live dot:** sits on the last data point in `--gold`, appears when the draw-in completes (~700ms), with a soft gold halo (capped at `--gold`/0.45) pulsing on a ~2.4s scale-and-fade loop. **This pulse is one of exactly two permitted ambient loops** (amendment 5 adds the second). It marks the record as live; nothing else on /join may loop (the `ec-glow` sign-in loader stays a sign-in-only exception). (3) Axis/date labels fade in after the draw. Chart honesty is untouched: zero baseline, dips shown, data unchanged.
- **Live-pending indicator (amendment 5, 2026-08-16, Sean's order):** the hero pending eyebrow carries a small round `--loss` "recording" dot ahead of the text, softly blinking on a ~1.8s opacity loop (smooth ease-in-out, never strobing), and the pending-count text shifts to `--loss` (text-safe on the page backgrounds in both themes; no new colors). **This blink is the second and final permitted ambient loop** alongside the chart live dot. prefers-reduced-motion: dot static, no blink.
- **Interactive chart ranges (amendment 5):** range-tab activation swaps the dataset with a ~500ms re-draw (dash re-draw + area-fill fade; the live dot may hide during the swap and reappear on the new endpoint); scrub feedback stays instant with no easing. Chart honesty holds in every range: zero baseline always rendered (inside the plot when a range dips below 0), y-axis never truncated, dips shown. Reduced motion: instant data swap, no re-draw, dot static.
- **Never:** animated gradients or aurora drift (the dusk sky is STATIC); parallax; reveal re-triggering or scroll-linked scrubbing of entrances; ambient loops other than the two permitted (chart live dot + live-pending indicator blink); bounce easing.
- **prefers-reduced-motion:** all animation `none`. Sections render in place (no hidden states), the chart renders complete with the area fill shown and the dot static (halo hidden, no pulse), the live-pending dot holds static (no blink), range swaps are instant, count-up renders the final value.

## JOURNEY.md visual-supersession map (visual layer only — structure + copy untouched)

JOURNEY.md predates this re-deal and carries Gilt Ledger visual annotations. This DESIGN.md supersedes them as follows; the mock/build phases apply these treatments to JOURNEY.md's unchanged structure and copy:

| JOURNEY.md says (old DNA) | Dusk Ledger treatment |
|---------------------------|------------------------|
| Hero anchor CTA: `--brass` link with "rising-edge underline on hover" | `--primary-text` link with a standard text-decoration underline on hover — no diagonal motif |
| Tamper-evidence callout: `--surface-2` bg + `--hairline` border | `--card` panel, `--radius-panel`, `--elev-ring` (it sits on the gradient, doubling as the hero's scrim surface) |
| Range tab active: `--gold` fill + `--gold-ink`, "rounded-4px" | `--gold` fill + `--gold-ink`, **pill** radius; light adds the 1px `--ring` border |
| Section 5: "`--gold` full-bleed band", all text `--gold-ink` | Centered `--card` panel per the depth system above — the gold band is retired; `--gold-ink` applies only ON the gold pill |
| Free-pick "Free pick" badge: `--accent` tint + `--accent-foreground` | Unchanged (tint chips are small highlights — legal gold use) |
| Header static (not sticky); /card cross-link = muted text link | Unchanged |
| Chart line `--gold`, zero baseline `--hairline` | Unchanged (the baseline hairline is information-bearing) |
| Mobile-first stack ordering | Ordering unchanged; the DESIGNED composition is now the 1200px desktop layout, mobile adapts down |

## Never (this project's tells + failure modes at risk)

- **No default-shadcn look** — the named failure mode. No uniform card grid of identical boxes, no `slate` greys, no shadow-based elevation stack, no hero-badge-pill + gradient-text pattern.
- **No hard hairline severity** — 1px rules are never the elevation or division system. (The rejected DNA's core failure.) Information-bearing hairlines only (chart baseline, inputs).
- **No magazine asymmetry** — no offset section headers, no unequal gutters, no "deliberate gaps." Centered, calm, symmetric. (The other core failure: "weird on desktop.")
- **No gold floods** — no gold bands, no large gold fields, no gold section backgrounds. Gold = buttons, links, active tabs, small highlights ONLY.
- **No second accent hue.** Mono harmony: gold is the only brand chroma. Functional colors (loss red / win green / info blue) appear only carrying their function; red never dominates a section (analytical context, ch09). The gradient's champagne/bronze stops are ambient neutrals of the sky, never used as UI accents.
- **No purple/violet anywhere** (amendment 1, 2026-08-14 — Sean's order). The original soft-violet/mauve gradient stops are retired; every surface, gradient, and wash stays in the warm gold/bronze/neutral register.
- **No animated gradients or glow auras.** The dusk gradient is one static backdrop; soft depth is a static ring, not a glow effect.
- **No gradient/metallic gold.** Gold stays flat `--gold`; the gradient is the sky, never the gold.
- **No serif page text / no cream regression** — Bodoni is wordmark-only; the retired `#f6f1e8` cream family stays retired.
- **No decorative diagonals** — the −4.6° motif lives only in the chart line itself.
- **No em dashes in visitor-facing copy** (standing copy law; restructure with periods/commas/colons).

## Changelog

- **amendment 5, 2026-08-16: live-pending indicator blink added on Sean's order.** The hero pending eyebrow gains a round `--loss` recording dot on a soft ~1.8s opacity blink plus `--loss` pending-count text; the ambient-loop budget is now exactly two (chart live dot + this blink). Same amendment: chart range tabs become interactive (sample-data swaps with a ~500ms re-draw, scrub crosshair + chip); chart honesty (zero baseline, no truncation, dips) holds in every range. Reduced motion: dot static, instant swaps.
- **2026-08-15 — motion amendment (amendment 4), Sean's order on the approved mock:** (1) Scroll-triggered entrance reveals adopted (fade + 20px rise, 600ms soft ease-out, IntersectionObserver, once only, 80ms card stagger, above-the-fold exempt, JS-gated so nothing hides without IntersectionObserver). This replaces the former "no scroll-triggered entrance cascades" ban in the Motion Never list. (2) Chart enriched: gradient area fill under the curve (`--chart-fill-a`, 0.16 light / 0.22 dark, gold to transparent), live end-of-line dot appearing after the 700ms draw-in with a ~2.4s pulsing halo, documented as the page's single ambient loop; axis/date labels fade in after the draw. Chart honesty (zero baseline, dips, data) unchanged. (3) prefers-reduced-motion disables all of it: sections in place, chart complete, dot static.
- **2026-08-14 — amended on Sean's feedback** (direction stays locked; these are user-ordered amendments): (1) **No purple.** Hero gradient re-tuned from violet dusk to premium warm metal — light `#fdf4e0 → #f8ead1 → #f2e3c6` (champagne → pale amber → warm bronze), dark `#191411 → #241b12 → #38281a` (deep espresso → dark bronze → amber ember). All text-on-gradient pairs re-verified AA (incl. under the atmospheric gold washes) via `.design-foundations/build/contrast-2c.mjs`, all PASS, exit 0; report in the supplemental verification paragraph. "No purple/violet anywhere" added to the Never list. (2) **More Portal.** Device-frame + glow-ring component spec added (browser + phone frames, pure HTML/CSS/SVG); atmospheric hero depth spec added (layered radial washes, wash alpha law 10% light / 15% dark). (3) **Anti-sparse.** Richness guidance added (framed previews, fuller hero, pick-card chips, step iconography, price-panel feature list, footer wordmark) within the deceptive-pattern and verbatim-copy bounds.
- **2026-08-14 — initial lock** (Dusk Ledger confirmed by Sean on the rendered desktop mock).

## Open questions

- Adoption sequencing for the rest of the app (this DNA is app-adoptable; /join ships first) — orchestrator/user call.
- /join OG share image on the dusk gradient — belongs to mock/build; tokens here feed it.
- Whether the gradient's dissolve-to-background boundary lands mid-hero or at the exact section edge — a mock-phase composition call within this spec's law.
- Dropping the Bodoni Moda import (wordmark SVG `<text>` rendering) — verify at build.
