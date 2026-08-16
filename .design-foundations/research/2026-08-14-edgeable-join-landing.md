# Edgeable — /join landing page

**One-liner:** A new public sales page at `/join` that turns strangers into subscribers by leading with Edgeable's verified pick record, a performance chart, and a single monthly price.

**Date:** 2026-08-14 · **Status:** confirmed (grilled + cold-read same day)

---

## What

A dedicated landing page at a separate route (`/join`) on the existing React + Vite + Tailwind app (edgeabled.web.app). Login stays at root. This is the URL Sean shares in bios and links: the page IS the marketing, since traffic is mixed and the audience is being built from zero.

The rest of the app is out of scope for now; the landing page's visual language should be an evolution the app can adopt later, not a one-off.

## Why (the driver)

The current "Edge Club" look (cream/gold, Bodoni Moda serif, shadcn components) reads as **too generic / template-y**. The revamp direction: **keep gold as the brand color, drop the vintage cream/serif styling** — modern, intentional, distinctly Edgeable.

## Who

- Strangers with no prior trust, arriving from mixed/unknown channels (bio links, shares, referrals). Assume skeptical: sports-picks services are a scam-heavy category, so **verifiable proof is the core persuasion mechanism**.
- Age 21+ audience (legal requirement, already enforced in Terms).
- Device: mixed; design responsive with mobile treated as a first-class citizen (shared links get opened on phones).

## JTBD

"I keep seeing picks sellers who claim insane records with no receipts. Show me proof I can actually verify, tell me what it costs, and make it easy to join." Before Edgeable's public card existed, the only trust signal was screenshots — which everyone fakes. Edgeable's tamper-evident record is the differentiator; the landing page's job is to make that differentiator impossible to miss.

## Page content (agreed)

Lead with proof, in this priority:

1. **Verified pick record** — live W-L-P, net units, ROI from the public `picksPublic`/`picks` data (same source as `/card`). Emphasize the tamper-evidence story: picks timestamped before game start, grading one-way, no deletes.
2. **Performance chart** — Robinhood-style equity curve of net units over time (the `PerformanceChart.jsx` interaction pattern already exists in the app). Units are now public per the updated publicity decision below; the exact public data mechanism (e.g. making `dailyPnL` world-readable) is a plan-phase call.
3. **Pricing** — **$30/month**, one join CTA. Payment is manual P2P (CashApp/Zelle + admin approval), so the CTA drives to signup, not a checkout.

Supporting: link to full `/card` archive as "verify it yourself", referral hook (`/signup?ref=CODE` already works), legal footer (21+, /terms, /privacy).

## Brand & mood

- **Keep:** gold as the brand color (`#d8b773` dark / `#b58a3c` light family); the existing logo — Bodoni Moda "Edgeable" wordmark with a gold line rising left-to-right through it (`public/edgeable-wordmark.svg`, `edgeable-icon.svg`). The **rising gold edge line** is the strongest brand asset and should become a recurring motif (section dividers, chart accent, hero graphic).
- **Drop:** the vintage cream paper background and serif-everywhere styling; the default-shadcn genericness.
- **Feel words:** modern, sharp, credible, premium-but-not-stuffy. Proof-forward, not hype-forward — closer to fintech than sportsbook.
- **Reference pool:** https://styles.refero.design/ (user-supplied gallery of great product design; pull specific comps during planning/mock).

## Taste signals

- Gold stays, vintage goes — explicitly chosen over dark-fintech, light-Stripe-clean, and loud-sportsbook directions.
- "Too template-y" is the sin to avoid: the page should feel designed, not assembled.
- The logo's serif is acceptable as a *logo*; serif appears nowhere else (Decision 3).

## Constraints

- Stack: React + Vite, React Router, Tailwind + shadcn-style kit in `src/components/ui/`. New route added in `src/App.jsx`; public (no auth), like `/card` and `/terms`.
- **Publicity decision (updated 2026-08-14, supersedes the Jul 2026 stance):** W-L record **and units/ROI are now public**; what stays private is the **content of the picks themselves** (sport, description, odds, per-pick stakes) so nobody can model/predict Sean's future picks from history. Implementation: extend the public data surface with aggregate units (e.g. add units to `picksPublic` stubs without descriptions, make `dailyPnL` world-readable, or publish a public aggregate doc) — an engineering decision for the plan phase, with a Firestore-rules change and Sean's sign-off on the exact fields exposed.
- Payments are manual; no checkout to design.
- Site-wide OG tags exist (`og-image.png`); a landing page may deserve its own share image later.
- Dark + light mode both exist in the app; /join follows system like the rest of the app (Decision 4) — both themes must look finished.
- The visual language must be expressible in the existing Tailwind/shadcn CSS-variable token structure so the rest of the app can adopt it later (it's an evolution, not a one-off).
- ⚠️ The repo `CLAUDE.md` still documents units/ROI as subscriber-only — update it when the public-units change ships so future sessions don't get contradicting context.
- Distribution is shared links, so the /join OG share image is part of the deliverable, not a nice-to-have (SPA serves one index.html site-wide; per-route OG needs a workaround or a deliberate site-wide image that sells /join).

## Decisions (resolved 2026-08-14)

1. **Price: $30/month.** Single tier, one CTA.
2. **Chart data:** the real units curve, publicly. Units + W-L are public; **pick contents (sport/description/odds/per-pick stakes) stay private** so pick patterns can't be reverse-engineered. Exact public-field mechanism decided in plan phase.
3. **Serif: logo only.** The page is fully sans; the Bodoni wordmark is the sole serif element.
4. **Theme: follow system** — both dark and light, like the rest of the app. Both must look finished.
5. **Join flow: own the manual process.** A "How joining works" 3-step section — 1) create account, 2) send $30 via CashApp/Zelle with proof, 3) approved same day — framed as personal/concierge, not janky. The page sets the expectation before the CTA, not after.
6. **Proof framing: head-on.** Copy states the rules plainly: every pick is timestamped before game start, grading is one-way with no deletes, and pick details are subscriber-only so the strategy can't be copied or modeled. The limitation is presented as a feature.
7. **The record leads.** Sean confirms the live record is positive and deep enough to be the hero. (Design should still degrade gracefully if the curve dips — it's live data.)

## Open questions (for plan / design DNA)

1. ~~Join copy details~~ **Resolved:** promo hook = **free-picks teaser** — occasional `access='public'` picks are free; the page uses them as try-before-you-buy proof samples. (No referral messaging on /join; referral links still work.)
2. Exact public-data mechanism for units (stub fields vs public `dailyPnL` vs aggregate doc) + rules change — **plan phase**, Sean signs off on fields. This determines chart granularity (daily buckets vs per-pick), history depth, and whether the Robinhood-style scrub is feasible — spec the chart against the chosen mechanism, including sparse/early-data states.
3. Which sans typeface replaces the current Mulish, or keep it? (Part of "not template-y".) — **design DNA step**.
4. ~~/card cross-link~~ **Resolved:** yes — a subtle "Join for $30/mo" CTA on `/card` linking to `/join`.
5. Pull 2–3 concrete visual comps from styles.refero.design during **planning** to pin the "modern gold" execution — the feel words alone (modern, sharp, credible) won't converge without comps.
6. Page composition (hero concept, section order, FAQ/objection handling, "who runs this" credibility element) — deliberately left to the **journey/plan phase**; this brief fixes content priorities, not layout.
