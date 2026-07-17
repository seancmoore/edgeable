# Edgeable — Business Setup Roadmap

Purpose of this file: the single source of truth for what gets built and launched, in order.
Claude Code: when asked for the next goal, find the first unchecked task in the earliest
incomplete phase. Do not skip phases — the ordering is deliberate (product → proof → delivery
→ marketing). Never suggest marketing tasks while build/integrity tasks are incomplete.

Core principle: Edgeable is the source of truth for the pick record, and the record must be
tamper-evident. Every feature decision defers to this.

## Phase 1 — Daily Card build (IN PROGRESS)

- [x] Phase 0 architecture report reviewed and approved by Sean (2026-07-17; note: rules were deployed before this gate existed — Sean ratified)
- [x] Firestore schema + security rules proposed and approved by Sean (2026-07-17; "external review" satisfied by an independent fresh-context adversarial review — no exploitable findings; tell Claude to uncheck if a human external review is wanted)
- [x] Data layer + security rules implemented (2026-07-17; verified live by scripts/verify-picks-rules.mjs — 12/12 denial tests pass; edit-after-post tests deferred until the first real pick exists, then rerun with its id)
- [x] Tiered access (per Phase 5 decision): architecture + rules changes proposed and
      approved by Sean (2026-07-17)
- [x] Tiered access implemented + verified (2026-07-17: picks + picksPublic stubs with
      batch-pairing enforced via getAfter; rules deployed; verify-picks-rules.mjs 23/23 —
      signed-out sees stubs only, inactive user denied, active sub reads full picks,
      unpaired/tampered/backdated writes all rejected)
- [ ] Public /card UI handles all viewer tiers (built + deployed + bundle-verified
      2026-07-17; check off after visual confirmation with the first real card)
- [ ] Admin: manual pick entry form
- [ ] Admin: screenshot import via Cloud Function → Anthropic API → review screen (never auto-post)
- [ ] Admin: one-click grading (win/loss/push/void)
- [ ] Admin: "Copy today's card as text" button (Telegram post is generated FROM the site)
- [ ] Public: today's card with visible posted-at timestamps
- [ ] Public: record header (W-L-P, net units, ROI) + full archive, losses equally visible
- [ ] Public: "Verified record on Action Network" link (URL from Sean)
- [ ] Static OG/meta tags in index.html + branded 1200x630 og:image, verified in built output

## Phase 2 — Deploy + integrity verification (requires Sean's machine)

- [ ] Anthropic API key stored as Cloud Functions secret (never in client or repo)
- [ ] firebase deploy (hosting, functions, rules)
- [ ] Manual integrity test checklist passed: edit-after-post rejected, client-supplied
      postedAt rejected, non-admin write denied, delete impossible, backdated gameStartTime rejected
- [ ] Link preview verified on Telegram, iMessage, and Twitter/X after deploy

## Phase 3 — Deliver the promised feature to Telegram

- [ ] Announcement drafted (feature delivered — written AFTER deploy, not before; this is the
      delayed tracker feature subscribers were promised)
- [ ] Workflow switched: every daily card entered in Edgeable first, copy-text posted to Telegram
- [ ] Edgeable link pinned in the Telegram channel
- [ ] 7 consecutive days of cards posted with zero gaps (discipline proof before any marketing)

## Phase 4 — Verification bridge (Action Network)

- [ ] Exact pick count (N) and displayed ROI pulled from AN profile
- [ ] AN profile URL added to site (replace placeholder)
- [ ] Checked whether AN display name can be renamed to match the Edgeable brand; renamed if possible
- [ ] Confirmed whether picks are BetSync-synced or self-tracked; marketing language calibrated
      accordingly (self-tracked = "6-month public record", never "undeniable/verified")

## Phase 5 — BLOCKING BUSINESS DECISION (unresolved — nothing in Phase 6 starts until this is answered)

- [x] Decide what is free vs paid (DECIDED 2026-07-17 by Sean; REVISED same day, supersedes
      the earlier unlock-at-game-start version):
      - Subscriber picks: full details visible ONLY to active subscribers, forever — they
        never unlock publicly, not even after grading
      - Separate daily public pick(s) (~one per day): details visible to any LOGGED-IN user
      - Everyone else sees subscriber picks as locked entries (stubs): existence, timestamps,
        sport, odds, stake, and grading result public; the pick description is the paid product
      - Public record header (W-L-P, net units, ROI) stays complete and publicly verifiable,
        computed from the world-readable stubs — losses can never be hidden
- [ ] Pricing and payment flow documented (what a new subscriber does, step by step, from
      Instagram → site → paid Telegram)

## Phase 6 — Instagram launch

- [ ] Handle reserved (matching/close to Telegram + AN branding)
- [ ] Bio finalized: "Every pick posted and graded publicly. [ROI]% ROI across [N] picks over
      6 months. Record ↓" — no profit promises, no "passive income", no outcome claims,
      no raw unit totals
- [ ] Link-in-bio → Edgeable (with working preview card)
- [ ] First 9 posts drafted: record screenshot (AN UI, not self-made graphics), how-the-tracker-
      works post, daily card format, one honest losing-week recap template
- [ ] Cadence committed: daily card screenshot, weekly graded recap (losses included), monthly
      record update
- [ ] Instagram content rules written: nothing that implies guaranteed profit or income;
      betting-adjacent content framed as tracked analysis (platform-flag risk)

## Phase 7 — v2 / later (do not start before Phases 1–6 complete)

- [ ] Telegram bot: catches the daily screenshot in the channel and pushes it through the same
      parse-and-review pipeline (zero-extra-step entry)
- [ ] On-site subscribe/checkout flow improvements informed by real Instagram traffic
- [ ] Revisit AN unofficial-endpoint import ONLY as a convenience, never as the integrity layer
- [ ] Evaluate closing-line-value tracking as a credibility stat

## Standing rules (apply to every phase)

- No pick history backfill into Edgeable. AN carries the past; Edgeable starts at launch.
- Announce after shipping, never before. (Learned the hard way.)
- A missed daily upload after a losing day invalidates the transparency story — the record
  has no gaps, ever.
- Marketing copy never promises profit. The record argues; the copy points.
