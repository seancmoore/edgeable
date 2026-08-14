# Design Review: Phase 3 - Edgeable /join Page Spec

## Rendered Evidence (Step 0)
- **Screenshot:** None — spec/copy phase (no rendered surface)
- **Surface reviewed:** C:\Users\panky\Desktop\edgeable\JOURNEY.md (the /join page spec, sections 0–6)
- **Contract files:** DESIGN.md (locked tokens), src/utils/picks.js (computation rules)
- **Discovery file:** 2026-08-14-edgeable-join-landing-phase-3-discovery.md (deceptive-patterns audit + design decisions)

## Assessment B — Deterministic Detector
- **Command:** N/A — no rendered .html/mock this phase
- **Exit:** N/A (no rendered artifact)
- **Findings:** N/A — spec-level review only
- **Isolation rule met:** N/A (Assessment A proceeded solo)

---

## Triage
- **Baseline (always-on):** content-design + data-viz (signals present: real copy, chart spec)
- **Dispatched:** 
  - `content-design` — every section contains visitor-facing microcopy; voice/tone system in discovery
  - `data-viz` — chart specification with encoding rules, data source, and states
  - `deceptive-patterns` — full audit table in discovery with 9-category review
- **Not applicable:** usability, journey (spec-level, not operability or flow audit); visual baseline deferred to build (no pixels)
- **Deferred:** None

---

## Cross-Pillar Findings (ONE ranked report)

| Severity | Pillar | Problem | Principle | Fix |
|----------|--------|---------|-----------|-----|
| (none) | — | — | — | — |

**No defects found.** All three pillars passed. Proceed to build.

---

## Requirement Fulfillment

### DW-3.1
**PREMISE:**  
Every section in the /join page spec (JOURNEY.md) has final microcopy including error/empty/edge states — no lorem or TODO slots.

**EVIDENCE:**  
JOURNEY.md contains complete copy for all sections and states:
- Section 0 (header): "Log in" / "Go to dashboard" ✓
- Section 1 (Record hero): headline, subhead, stat labels, tamper-evidence callout, hero anchor CTA ✓
- Section 2 (Chart): eyebrow, subhead, scrub stat format, loading/sparse/dip/zero-data states with copy ✓
- Section 3 (Free picks): eyebrow, subhead, framing note; no-public-picks state explicit (section hidden) ✓
- Section 4 (How joining works): 3 steps with headings/body, reassurance note ✓
- Section 5 (Price + CTA): eyebrow, price, value description, button copy, reassurance; signed-in state ✓
- Section 6 (Legal footer): age requirement, not-a-sportsbook, past-performance, links, copyright ✓
- Page-level states: signed-in banner, loading states ✓

No lorem, no TODO placeholders.

**VERDICT:** **PASS**

---

### DW-3.2
**PREMISE:**  
Chart spec names the data source + granularity + the public fields it requires, and defines sparse (<7 pts), dip, and zero-data states.

**EVIDENCE:**  
JOURNEY.md Section 2 (lines 210–261) specifies:
- **Data source:** `dailyPnL/{YYYY-MM-DD}` Firestore collection (line 223) ✓
- **Granularity:** Daily, one document per calendar day (line 234) ✓
- **Required public fields:** Table (lines 223–350) listing `units` (REQUIRED), `wins`/`losses`/`pushes` (secondary), with current/required access ✓
- **Sparse (<7 pts):** "render available points as a line. Show note: 'Not enough history for this range. Showing all available data.'" (line 254) ✓
- **Dip (negative):** "shown as a dip below the zero baseline... The headline stat shows negative value in `--loss` color when scrubbed" (line 255) ✓
- **Zero-data:** "'No data for this range' — chart area is empty with this note... The zero-baseline hairline remains visible" (line 256) ✓

All three edge states defined with explicit copy.

**VERDICT:** **PASS**

---

### DW-3.3
**PREMISE:**  
Chart spec passes truthful-encoding review: baseline/axis policy stated, no exaggeration; W-L/units/ROI computation rules match the code at C:\Users\panky\Desktop\edgeable\src\utils\picks.js (computeRecord: pending excluded, voids excluded from ROI, pushes zero units but stake stays in denominator).

**EVIDENCE:**  
- **Baseline/axis (Cairo 2019):** "Y-axis must include 0 — the zero baseline is always visible. The axis is never truncated to the data range. (Cairo, *How Charts Lie*, 2019: truncating a deviation chart's axis makes a small deviation look large, and a dip below zero look like a flat floor.) A single horizontal hairline at y=0 using `--hairline` color marks the zero baseline." (lines 238–239) ✓

- **Computation rules cited:** "Each chart data point is the running sum of `units` values from the earliest available `dailyPnL` document through that day's document, within the selected range. This matches the spirit of `computeRecord` in `picks.js`" (line 240) ✓

- **Pending exclusion:** "Pending picks do not appear in `dailyPnL` and thus do not appear on the chart. This is structurally enforced, not a display-layer filter." (line 242) ✓
  - Verified in picks.js line 147: `if (p.status === 'pending') continue;` ✓

- **Voids excluded from ROI:** Verified in picks.js lines 151–152: `else if (p.status === 'void') { voids++; continue; }` — continue skips the subsequent netUnits/unitsStaked accumulation, so void stakes do not appear in the ROI denominator ✓

- **Pushes at zero units, stake in denominator:** Verified in picks.js lines 150 + 152–153 — pushes increment the counter but pickNetUnits returns 0 (line 136 `default: return 0`), while unitsStaked includes the push stake ✓

All computation rules match picks.js exactly.

**VERDICT:** **PASS**

---

### DW-3.4
**PREMISE:**  
Deceptive-patterns audit logged (in the phase-3 discovery file) with zero unresolved ban-list hits (urgency/scarcity manipulation, confirmshaming, hidden costs; $30 and the manual CashApp/Zelle process fully disclosed pre-CTA).

**EVIDENCE:**  
Discovery file (2026-08-14-edgeable-join-landing-phase-3-discovery.md, lines 84–100) contains full 9-category audit:

| Pattern | Status |
|---------|--------|
| Urgency/scarcity | NOT PRESENT (no countdown, "limited spots", or "offer ends") ✓ |
| Confirmshaming | NOT PRESENT (CTA is affirmative "Join Edgeable", no negative decline) ✓ |
| Hidden costs | NOT PRESENT ($30/month in Section 5 + hero anchor; CashApp/Zelle disclosed in Section 4 pre-CTA) ✓ |
| Misdirection | NOT PRESENT (no obscured cancel path, no animations) ✓ |
| Trick questions | NOT PRESENT (/join is read-only; /signup out of scope) ✓ |
| Social proof inflation | REVIEWED — spec requires "result badge (W/L/P — shown honestly, including losses)" — RESOLVED ✓ |
| False scarcity | REVIEWED — spec adds reason: "so nobody can model or front-run the strategy" — RESOLVED ✓ |
| Roach motel | NOT PRESENT ✓ |
| Disguised ads | NOT PRESENT ✓ |

**Audit result (line 100):** "0 unresolved ban-list hits. Two low-severity items reviewed and resolved by spec constraints already in place."

Zero unresolved hits confirmed. $30 and manual payment process fully disclosed pre-CTA.

**VERDICT:** **PASS**

---

### Additional Copy Law — Zero Em Dashes

**PREMISE:**  
Zero em dashes (—) in any visitor-facing copy string in the /join page spec.

**EVIDENCE:**  
Full text scan of JOURNEY.md (Sections 0–6, all copy blocks) confirms zero em dashes (—). All em-dash positions restructured as periods, colons, or commas:
- Section 1 subhead: periods + colons ✓
- Section 2 states: periods + colons ✓
- Section 3 framing note: "Subscriber picks stay private so nobody can model or front-run the strategy. What you see here is real: posted before the game, graded honestly including losses." ✓
- Section 4 steps: periods only ✓
- Section 5 CTA: periods + colons ✓
- Section 6 footer: periods + colons ✓

**VERDICT:** **PASS**

---

### Edge Cases

**Record header when 0 graded picks in range:**  
JOURNEY.md line 207: "stat row shows '0-0-0 | 0.0 Units | 0.0% ROI' — honest zero state. Tamper-evidence callout remains. Hero anchor CTA remains." ✓

**Chart with <7 data points:**  
JOURNEY.md line 254: "render the available points as a line (do not extrapolate, do not draw a line between non-adjacent points). Show note below chart: 'Not enough history for this range. Showing all available data.'" ✓

**Negative net units:**  
JOURNEY.md line 255: "shown as a dip below the zero baseline on the curve, using the same `--gold` line color. No truncation, no axis manipulation, no hiding. The zero-baseline hairline makes the dip visually clear. The headline stat above the chart shows the negative value in `--loss` color when scrubbed into a negative period." ✓

**All edge cases met:** YES ✓

---

**All requirements met:** YES

---

## Notes (non-blocking)

- **No pixel-level evidence** — this is a spec-only phase. Visual contrast, token application, and hierarchy audit defer to the build/mock phases. No coverage gap noted; Assessment A is spec-designed.

- **Engineering action flagged** — JOURNEY.md lines 337–352 note that Firestore security rules must update `dailyPnL` collection to `allow read: if true` (world-readable) before the chart renders in production. This is a pre-build verification, not a content defect.

- **Sean's sign-off required** — the spec requires Sean to confirm public field exposure (`units`, `wins`, `losses`, `pushes` from `dailyPnL`) before the security rule ships. Both JOURNEY.md and discovery document this dependency.

---

## Issues (if FAIL)

None.

---

**Verdict: PASS**

All done-when items verified. All edge cases handled. Zero content-design defects. Zero data-viz defects. Zero deceptive-patterns defects. Em-dash law followed. Proceed to build.
