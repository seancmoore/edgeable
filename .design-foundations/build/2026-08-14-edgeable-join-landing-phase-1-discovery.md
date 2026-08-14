# Discovery + Design: Phase 1 - Journey + /join page spec

## Artifacts Found / Current State

- **JOURNEY.md**: Does not exist at project root. This phase creates it.
- **DESIGN.md**: Does not exist. Correct — Phase 2 creates it.
- **Existing wireframe mock**: `mocks/join.html` exists (greyscale, throwaway fidelity, no DESIGN.md tokens). Reviewed.
- **Research doc**: `C:\Users\panky\Desktop\edgeable\.design-foundations\research\2026-08-14-edgeable-join-landing.md` confirmed and read.
- **Plan file**: `C:\Users\panky\Desktop\edgeable\.design-foundations\plans\2026-08-14-edgeable-join-landing.md` read in full.
- **CLAUDE.md**: Read. Firestore data model, pick record rules, public data decisions all confirmed.

## Gaps

1. **Hero-level CTA gap (from wireframe checkpoint):** The wireframe placed the sole Join CTA at the bottom price section. The spec must add a hero-anchor CTA so a convinced visitor (e.g., someone sent the link by a friend who is already a subscriber) can act immediately without scrolling through proof they already trust. Resolution: add a secondary "Join for $30/mo" anchor link below the record stats row in the hero section, linking to the price+CTA section. This satisfies Fitts's law (Fitts 1954) — primary target reachable early without hunt.

2. **Range tab keyboard accessibility gap (from wireframe checkpoint):** The wireframe rendered range tabs as `<span>` elements — not keyboard-focusable controls. The spec must designate these as `<button role="tab">` controls in a `role="tablist"` group, with arrow-key navigation. This is a spec constraint, not a visual-design concern.

3. **Post-CTA flow dead-end**: The wireframe had no explicit representation of the signup → payment → approval wait state. The spec must close this gap (DW-1.3).

4. **Signed-in visitor edge case**: No routing for an authenticated user landing on /join. Spec must handle this (plan edge case).

5. **Record momentarily short/negative edge case**: Page structure must not depend on a positive curve. Section order is fixed proof-first regardless of record shape.

6. **/card CTA restraint**: Spec must define placement and a rationale for why the /card CTA doesn't undermine /card's neutral-proof tone.

## Gate Status

- **DESIGN.md locked?** No — correct. Phase 1 is pre-design-DNA. No tokens to honor.
- **JOURNEY.md present?** No — this phase creates it.
- **Prior-phase prerequisites met?** Yes. Research doc is confirmed; plan is approved. No upstream phase dependency for Phase 1.
- **Wireframe mock exists?** Yes — mocks/join.html reviewed. Two checkpointed findings incorporated above (hero CTA + tab accessibility).

## DW Verification

| DW-ID | Done-When Item | Status | Evidence |
|-------|----------------|--------|----------|
| DW-1.1 | JOURNEY.md exists with Job, Journey, IA, Flows sections filled from the research doc. | COVERED | Artifact presence: JOURNEY.md written to project root with all four sections populated from research doc content. Sections inspectable directly. |
| DW-1.2 | `## Page specs` has a complete `/join` entry: every section named with content slots, CTA count and placement, and mobile ordering. | COVERED | Artifact presence: `/join` page spec in JOURNEY.md names all 6 sections (record hero, chart, free picks, how-joining-works, price+CTA, legal footer) with content slots, CTA placements (2 CTAs: hero anchor + price section), and mobile ordering notes. |
| DW-1.3 | The flow covers signup → payment → approval including the wait state — no journey dead-end after the CTA. | COVERED | Artifact presence: "Join flow" task flow in JOURNEY.md Flows section traces: CTA → /signup → payment instructions → proof submission → wait state (pending approval) → approval email → /dashboard. Error states at each step included. |
| DW-1.4 | /card cross-link CTA specified (placement + restraint rationale). | COVERED | Artifact presence: `/card` CTA amendment in JOURNEY.md Page specs section specifies placement (below record header, above the pick list) and restraint rationale (must not compete with /card's neutral-proof identity — subtle text link, not a prominent button). |

**All items COVERED:** YES

**DW-ID count check:** 4 DW-IDs in dispatch prompt — 4 DW-IDs in table. Count matches.

## Design Decisions

**JTBD school:** Moesta Switch interview (four forces). Chosen because the project is acquisition-focused and the four-forces frame maps directly to the skeptic-visitor's actual decision moment: push = distrust of picks sellers generally, pull = verifiable tamper-evident record, anxiety = manual payment process + uncertainty about legitimacy, habit = continuing to ignore picks services. Moesta is the most actionable school for this acquisition context (journey.md doctrine, §JTBD).

**Decision model:** Google Messy Middle (2020) applies over McKinsey loyalty loop. The target is a cold stranger, not a returning buyer. The explore-evaluate loop is the correct frame: visitor oscillates between exploring proof (record, chart, free picks) and evaluating risk (price, how joining works, legal) before the moment of purchase. The page structure must feed both loops — proof sections feed explore, process/price sections reduce evaluate anxiety.

**Persuasion spine adaptation:** The canonical spine (hero → social proof → problem → guide → solution → how-it-works → objections → testimonials → pricing → final CTA) is adapted to fit the confirmed section order from the approved brief (record hero → chart → free picks → how-joining-works → price+CTA → legal footer). Mapping: hero = record hero + tamper evidence; social proof = embedded in hero (live stats, /card link); problem = implicit (skeptic context stated in brief — not a separate section; a cold audience for this product is already problem-aware per Schwartz ladder); solution = free pick samples + chart; how-it-works = 3-step join section; pricing = price+CTA section. No testimonials section in Phase 1 scope — research doc does not call for it, it is out of scope.

**Awareness stage (Schwartz ladder):** Problem-aware. Visitors are sports bettors who already know picks services exist and already distrust them. Lead with proof, not with problem recognition. This is why the record leads — not a generic value-prop opener.

**Hero CTA count:** Two CTAs on /join: (1) an anchor link in the hero section below the stat row (label: "Join for $30/mo — see how it works ↓"), links to the price section by anchor; (2) the primary CTA button in the price+CTA section. Rationale: Fitts's law (Fitts 1954) — a convinced visitor should not hunt for the action. The hero anchor is low-friction (anchor link, not a full button), reducing visual weight while remaining actionable. The price section retains the primary button with full disclosure.

**Range tabs:** Spec as `role="tablist"` with `<button role="tab">` children, `tabindex` managed by arrow-key roving focus. Tab labels: Week, Month, 3M, All. Default selected: All. Rationale: keyboard accessibility is required (WCAG 2.1 SC 2.1.1 — keyboard accessible). The wireframe checkpoint flagged this explicitly.

**Signed-in visitor routing:** If authenticated user hits /join, show a non-disruptive banner: "You're already signed in — [Go to your dashboard →]". The CTA section replaces the Join button with the same dashboard link. This prevents a dead CTA without disrupting the page for non-authenticated visitors.

**Record edge case (negative/short curve):** Section order is invariant — always record hero → chart → free picks → how-it-works → price. If the record is negative, it is shown honestly (zero manipulation — this is the proof-forward pitch). The chart section includes an explicit sparse/negative state slot in the spec. The page structure does not depend on a pretty curve.

**/card CTA design decision:** Placed as a text link below the record header stats, above the pick list. Label: "Join for $30/mo →". Rendered as a subdued text link (not a button, not colored accent) to preserve /card's neutral-proof identity. Rationale: /card serves two audiences — the general public verifying the record and potential subscribers. A loud CTA interrupts the verification task for the first audience. A text link is scannable by interested parties without imposing on verifiers. This is the "restraint rationale" the plan requires.

**Mobile ordering:** Single-column stack. Section order is identical on mobile and desktop. Desktop gets a two-column hero grid (record stats left, tamper evidence right) and a three-column picks grid. Range tabs remain full-width on mobile (touch targets ≥44px height). Step cards stack on mobile, go three-across on desktop.

## Recommendation

BUILD
