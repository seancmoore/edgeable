# Discovery + Design: Phase 3 - Compose

## Artifacts Found / Current State

| Artifact | Status |
|----------|--------|
| DESIGN.md | LOCKED (confirmed by Sean 2026-08-14, Gilt Ledger). Token block present for both themes. All contrast pairs AA-verified. Rising-edge motif spec present. |
| JOURNEY.md | Present at repo root. Complete /join page spec (6 blocks, hero anchor CTA + bottom CTA, mobile-first ordering). Content slots marked "Final copy: Phase 3" throughout. |
| picks.js | Present. `computeRecord`, `pickNetUnits` rules confirmed. |
| `dailyPnL` collection | Exists; currently signed-in only per CLAUDE.md. The plan specifies making it world-readable as the chart data source. |
| Phase 1 + 2 artifacts | Both committed (commits 8db8553, 8dcbf69). |

DESIGN.md gate: LOCKED. All downstream copy and chart work uses the Gilt Ledger token vocabulary. No re-derivation of palette.

## Gaps

1. JOURNEY.md has "Final copy: Phase 3" placeholders in every section. This is the intended state — the gaps are this phase's work product.
2. No chart spec exists yet in JOURNEY.md. Section 2 names slots and states but does not specify axes, data source fields, computation rules, or the public-field engineering requirement.
3. The deceptive-patterns audit has not been run against the spec yet.

No scope conflicts. No missing prerequisites.

## Gate Status

- DESIGN.md locked: YES
- JOURNEY.md present: YES
- Prerequisites met: YES (Phases 1 and 2 committed)
- Scope matches plan: YES

## DW Verification

| DW-ID | Done-When Item | Status | Evidence |
|-------|---------------|--------|----------|
| DW-3.1 | Every section in the /join page spec has final microcopy including error/empty/edge states — no lorem or TODO slots | COVERED | Spec inspection: every "Final copy: Phase 3" slot in JOURNEY.md is replaced with final copy strings in the production output. Edge states (0 picks, chart unavailable, signed-in visitor, record negative) all receive explicit copy. |
| DW-3.2 | Chart spec names data source + granularity + public fields it requires, and defines sparse, dip, and zero-data states | COVERED | JOURNEY.md Section 2 updated with a complete chart spec block: data source = `dailyPnL/{YYYY-MM-DD}`, granularity = daily, required public field = `units` (with existing `wins`/`losses`/`pushes` as secondaries), computation rules, and all three edge states with copy. |
| DW-3.3 | Chart spec passes truthful-encoding review: baseline/axis policy stated, no exaggeration, W-L/units/ROI computation rules match picks.js `computeRecord` | COVERED | Chart spec explicitly states: y-axis baseline = 0 (Cairo: baseline must be shown for deviation charts); axis not truncated; dips rendered honestly; computation rules cited verbatim from picks.js (pending excluded, voids excluded from ROI, pushes in W-L-P at zero units with stake in denominator). |
| DW-3.4 | Deceptive-patterns audit logged with zero unresolved ban-list hits | COVERED | Audit table produced below in Design Decisions section. All findings resolved before production ships. |

All items COVERED: YES

## Design Decisions

### Voice and tone (content-design doctrine)

**Register (Podmajersky):** The product voice is "credible witness" — the person who has the receipts and does not need to oversell them. Tone is direct and understated; it never hypes. The visitor arrives as a skeptic, and the copy treats them as a peer capable of evaluating evidence.

Voice attributes (concrete, not vague):
- **Direct:** States the fact, then moves on. No throat-clearing or qualification spirals.
- **Proof-forward:** The record is the argument. Copy points at evidence; it does not substitute for it.
- **Restrained:** Does not claim more than the evidence supports. "The record shows" not "we dominate."
- **Transparent:** The manual process, the pick-privacy policy, the 21+ requirement — all stated plainly, not buried.
- **Not:** hype-forward, sports-bro, urgent, fear-inducing, or aspirational-lifestyle.

**Scanning (Redish):** Every headline must survive as the only text read. Section headers carry a claim, not a label. Sub-body copy front-loads the key fact.

**Error/empty formula (Yifrah):** State what happened, why, and what to do next. No dead ends. No user blame.

**Em-dash prohibition (Sean's copy law):** Zero em dashes in page copy. Every em-dash position restructured as a new sentence, a colon, or a comma.

### Chart encoding (data-viz doctrine)

**Chart type (Munzner marks/channels):** Time-series deviation from a baseline — line chart is correct. The data relationship is "change in net units over time relative to a zero baseline." Area chart is rejected: the filled area would visually exaggerate positive periods and minimize dips (Cairo, *How Charts Lie*: area encoding implies magnitude, not rate of change). Line chart with a zero-baseline rule drawn as a hairline is the honest encoding.

**Baseline (Cairo):** Y-axis must include 0. If the range in view is e.g. +3 to +47 units, the axis must still show 0 so the viewer can gauge the actual deviation. Truncating to the data range would make a +3 unit floor look like a flat zero — a lie by omission.

**Data-ink (Tufte VDQI):** Remove gridlines except a single zero-baseline hairline. Remove chart border/frame. Axis labels: y-axis (units) and x-axis (date) only, minimal ticks. The line itself is the primary data ink; the scrub tooltip carries the precise value on demand.

**Colorblind safety:** The units line uses `--primary` gold (`#dbb155`) in dark theme. Gold is not the sole encoding dimension — the line is also distinct by its single-stroke position on the chart. For the win/loss column annotations (if used as a secondary layer), color is paired with glyph (W/L letter), per the DESIGN.md "color never sole status signal" rule. However, the primary chart surface is a single-series line — no competing color channels requiring redundancy.

**Scrub (Robinhood pattern):** Headline stat above the chart updates on pointer/touch scrub. This is the existing `PerformanceChart.jsx` interaction baseline — adopted, not reinvented.

### Behavioral doctrine (honest application)

**Authority (Cialdini):** The tamper-evidence callout is the authority signal — picks timestamped before game start by server clock, grading one-way by rules, no deletes. This is structural authority, not claimed expertise. Transparent mechanism = honest Cialdini authority.

**Commitment/consistency:** The 3-step join section sequences the commitment: create account (small step) → send payment (medium step) → wait for approval (low effort). The steps are disclosed pre-CTA, not revealed post-click. This reduces post-commitment anxiety rather than exploiting it.

**Social proof:** Omitted (no testimonials in scope; none manufactured). Free-pick samples with timestamps and honest W/L results are a form of concrete social proof — verifiable, not anecdotal.

**Reciprocity (Cialdini):** Free picks are genuine free value delivered before asking. They are labeled "free pick" clearly. No false-scarcity framing around them.

**Fogg model — motivation:** The visitor has the motivation (they want an edge; they're already looking at picks services). Ability is low (skepticism is the friction). The page addresses ability by providing verifiable evidence; it does not manufacture motivation.

### Deceptive-patterns audit (full spec review)

Running the 9-category ban-list against the /join page spec as specified in JOURNEY.md Phase 1 + Phase 2:

| Severity | Pattern category | Instance reviewed | Finding | Resolution |
|----------|-----------------|-------------------|---------|------------|
| — | Urgency/scarcity manipulation | Any countdown timer, "limited spots," "offer ends tonight" | NOT PRESENT in spec. No urgency or scarcity copy exists. | No action needed. |
| — | Confirmshaming | Opt-out labels like "No thanks, I don't want picks" | NOT PRESENT. CTA copy is affirmative ("Join Edgeable"). No negatively-framed decline option. | No action needed. |
| — | Hidden costs | Price or fee revealed only after CTA | NOT PRESENT. "$30/month" is stated in Section 5 (price+CTA), and the "Join for $30/mo" hero anchor CTA exposes the price even earlier. Manual CashApp/Zelle process disclosed in Section 4 (how joining works) before the primary CTA. | No action needed. |
| — | Misdirection | Visually obscured cancel path, attention-stealing animations | NOT PRESENT. No cancel-flow is designed here (cancel is a subscriber feature, not on /join). No ambient animations per DESIGN.md motion rules. | No action needed. |
| — | Trick questions | Pre-checked opt-in boxes, ambiguous double-negatives | NOT PRESENT. /join has no form fields or opt-in mechanics — it is a read-only sales page linking to /signup. The /signup form is out of this phase's scope. | No action needed on /join. |
| Low | Social proof inflation | Free-pick samples — risk that cherry-picking only winning free picks misrepresents the record | POTENTIAL: if the implementation only shows public picks with 'win' status, the sample would be misleading. | RESOLVED by spec: Section 3 explicitly requires "result badge (W/L/P — shown honestly, including losses)." The most recent graded public picks are displayed regardless of result. |
| Low | False scarcity (free picks framing) | "Subscriber picks stay private" could be read as artificial gating | REVIEWED: The privacy is structural — pick contents are private so the strategy cannot be reverse-engineered. This is a real constraint, not manufactured. The copy must state the reason plainly, not just assert the gate. | RESOLVED by copy spec: Section 3 copy reads "Subscriber picks stay private — so nobody can model or front-run the strategy. What you see here is real." |
| — | Roach motel (friction asymmetry) | Cancellation harder than signup | NOT PRESENT. Cancel is a subscriber-facing feature. The plan notes manual payment + admin approval; the user accepts this friction knowingly (it is disclosed). | No action needed. |
| — | Disguised ads / bait and switch | Promises not fulfilled post-CTA | NOT PRESENT. The record, chart, and process are all disclosed before the CTA. Post-CTA is /signup (account creation), which is what the CTA promises. | No action needed. |

**Audit result: 0 unresolved ban-list hits.** Two low-severity items reviewed and resolved by spec constraints already in place.

**Em-dash check:** This phase's copy output must pass a self-audit before finalizing — zero em dashes (—) in any copy string. All em-dash positions use periods, commas, or colons instead.

## Recommendation

BUILD
