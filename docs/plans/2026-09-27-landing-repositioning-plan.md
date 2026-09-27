# Plan: reposition the landing site for the app CostCook has become (2026-09-27)

Input: the discovery run from `docs/prompts/2026-09-27-app-discovery-prompt.md`.
Phases 2 onward depend on its three output files. This plan has **no headlines
and no sample copy**. Prospect-facing wording is written in phase 3 through
`story-content`, with a tracker for each surface.

## What changed

- **Then.** The landing sells back-of-house: order → shop → prep → pack and
  real food cost. So do `CLAUDE.md` ("back-of-house software"), the `site.ts`
  title ("shopping, prep & food cost for caterers") and kitchen-brain
  `CONTEXT.md` line 3.
- **Now** (production at `ed6ff5f01`, where main = develop = release). The app
  runs the whole event:
  - it takes the inquiry and records the client (the app says "Clients");
  - it builds menus with live food cost, sends a proposal and receives the
    client's decision on the client's own page, with no login;
  - it sends an agreement for signature through DocuSeal (live status in
    production unknown: the signing page says "Test environment");
  - the accepted proposal becomes a tentative kitchen draft, the deposit is
    **recorded by hand** (no card payment for events), and "Confirm order"
    books it; the calendar shows it;
  - the kitchen shops, preps and packs, and closes out food cost against the
    agreed price, which also reaches Analytics and Today.

  Merged but **behind switches that default off** (tier `production-flagged`
  in `docs/research/2026-09-27-app-inventory.yaml`): the online ordering site
  (`ordering_integration`), label printing settings, the Sage chat
  (`SAGE_ENABLED`), invoice email, and Square and QuickBooks (test mode only).
  None of these may be sold as available until the owner confirms the
  production switch.

  Not built: card payment for event deposits, customer invoices (PRD 06), BEO,
  staffing, dispatch and delivery. Nothing is tracked after "Packed".
- **Today** (assumed merged). The one-page proposal builder
  (`feat/proposal-build-20260926`) and deposit and balance terms carried from
  the accepted proposal to the order (`feat/client-payment-booking-loop`).

The product answers a new question. It used to be "what does this event cost
me to cook?". Now it is "take this event from the first inquiry to the
closeout, and tell me what I made". (Not "to the last invoice": customer
invoices are not built.) The landing still answers only the first.

## Owner decisions (blocking, needed before phase 3)

1. **Positioning line.** Choose one:
   - (a) **Event-first.** CostCook runs the catering event end to end, and
     costing is the proof inside it.
   - (b) **Kitchen-first, extended.** Keep "the kitchen brain for caterers" and
     add front-of-house as the way work arrives.
   - (c) **Two doors.** Separate paths for the owner who sells and the chef who
     cooks.
   
   Recommendation: **(a)**. The skeptical owner-operator reading on a phone
   feels the inquiry-to-booking chase as the more acute pain. Costing is the
   differentiator competitors lack, so it becomes the proof, not the headline.
   Option (c) splits the one-goal page.
2. **Who the reader is.** Is it still "owner-operator caterers and meal-prep,
   1–15 staff"? Meal-prep kitchens barely use proposals and contracts. Decide
   whether they keep a place on the homepage or move to `who-its-for`.
3. **What counts as shipped for this release.** Confirm the assumed-today set
   (proposal builder and client payment terms). Confirm that `ezcater`,
   `ordering-integration` and PO email stay off the page.
4. **Resolved by discovery: the client-money processor.** No processor
   collects event deposits; they are recorded by hand. Stripe Connect handles
   storefront orders only, and the storefront is flagged. Square never collects
   client money. The landing names no processor for events.
5. **Resolved by discovery: pricing and tiers.** One plan, CostCook Launch,
   $49 per kitchen per month, 15-day trial, no feature gated by tier.
6. **Anchor files.** Approve rewriting the product summary in the landing's
   `CLAUDE.md` (Design Context > Users, the one-goal line), the title and
   description in `site.ts`, and kitchen-brain's `CONTEXT.md` line 3. The last
   is a separate kitchen-brain PR, owned there.
7. **Production switches (new, blocking).** Confirm the production values of
   the checklist in `docs/research/2026-09-27-app-inventory.md` (group A):
   `SAGE_ENABLED`, the four per-kitchen release flags, invoice email, the
   DocuSeal environment, `BILLING_ENFORCEMENT` and `LAUNCH_PRICE_DISPLAY`.
   They are not in any repo (`infra/env/production.env.example` leaves them
   blank). The landing already prints Sage as "Available now"
   (`src/lib/sage.ts:29`).

## Constraints

These invariants from `CLAUDE.md` still hold:

- One primary action, labeled with `cta.label` verbatim, on open and close.
- At most two quiet secondary actions.
- One promise per section.
- No em-dashes, no "Kitchen Brain", and no stock SaaS phrases.
- AA contrast, and motion that obeys reduced-motion settings.

**Deploy gate.** A merge to `main` deploys to Vercel immediately. No
front-of-house claim may merge into this repo's `main` until the assumed-today
kitchen-brain branches are on kitchen-brain `origin/main`. Enforce this in
phase 4, not by memory.

## Phase 1: Discovery (today)

Run the discovery prompt in its own worktree (`research/app-discovery-0927`).
Its outputs are the inventory YAML and MD, and the landing gap report.

Exit criteria:

- The owner has answered decisions 1–6.
- The gap report is ranked.

## Phase 2: Message architecture (structure, not wording)

1. **One story for the whole product.** Using the workflow map, choose the one
   chain the homepage tells, from first email to money made, and the single
   character who lives it: an owner-operator with a real inquiry on their phone.
2. **Homepage slot map.** Give each section one promise. Every slot has exactly
   one owner, and no section is added alongside the rest without an owner.

   | Current section | Proposed job in the new story |
   | --- | --- |
   | `Hero` | the repositioned promise (decision 1) + primary CTA |
   | `CustomerOutcomes` | outcomes across the whole event, not only food cost |
   | `SeeItRun` | **front-of-house owner**: inquiry → proposal → client accepts → agreement → booked ("Confirm order"), shown with real captures; the deposit appears only as something the app records, never collects |
   | `TheProblem` | the chase: email threads, a Word proposal, a PDF contract, a spreadsheet cost sheet, and tracking who has paid the deposit |
   | `TheYield` | **the proof**: the accepted proposal becomes the order, which becomes the shop, prep and pack lists, which give the real food cost against agreed revenue at closeout |
   | `BuiltForKitchens` | the kitchen side (recipes, labels, nutrition) in one slot |
   | `WhoThisIsFor` | the reader from decision 2 |
   | `WhatElse` | the secondary areas: ordering site, buying and invoices, Sage, analytics, integrations |
   | `TheOtherTools` | the replaced stack now includes proposal and contract tools, not only spreadsheets |
   | `StartHere` | close on the same primary CTA |

   Merge or cut sections rather than grow the page. Phase 2 produces the
   decision on which ones.
3. **Feature family.** Map the gap report onto `src/pages/features/*`:
   - **New pages.** The likely set is events and proposals, contracts and
     booking, customers and calendar, online ordering, and analytics. Each needs
     `FeatureAreaIcon` and `FeatureMenuContents` entries, a check script and a
     verify script, following the pattern the existing 14 pages use.
   - **Rewrite.** `menus-and-quotes`, where "quotes" is now the proposal.
   - **Update.** Pages whose limits or "coming" lines are now false.
4. **Secondary surfaces.** `compare`, `pricing` (decision 5), `tour`, `demo`,
   `faq`, `onboarding`, and the nav menus (`FeatureMenuContents`,
   `ResourcesMenuContents`). List each change in the gap report. Wording
   changes are made in phase 3.

Exit criterion: the owner approves the slot map and the feature-page list.

## Phase 3: Content and captures (one story tracker per surface)

- For every surface, use `story-content`. The tracker goes in
  `docs/stories/<slug>.story.md`, with a `<!-- story: … -->` pointer in the
  source file.
- Every claim traces to an inventory row ID. Rows with the off-page tier never
  appear.
- **Captures.**
  - Stand up an integration build: kitchen-brain `develop` plus the
    assumed-today branches. Before they merge, build from their worktrees
    rather than from `develop`.
  - Use the real AI provider, never the stub. Use tight clips of the content
    area.
  - Use a Harbor & Hearth style sample kitchen with one real-looking event
    carried from inquiry to closeout. Use the same event across every capture
    so the story holds together.
  - Extend `scripts/capture-proof.mjs`, or add `capture-events-proof.mjs`.
- **Demo video.** If the video changes, rebuild it (`scripts/demo-video`) and
  update the screen-reader transcript to match the footage.
- **Visuals.** Use the ticket motif from the brand. The proposal and contract
  can read as paper. Do not use dashboard screenshots in perspective frames.

## Phase 4: Guards and verification

- `docs/release-claim-ledger.md`: add a row for every new claim, giving the
  inventory ID, the tier and the kitchen-brain commit.
- `scripts/check-landing-claims.mjs`:
  - Add the new pages and banned-phrase checks for the terms in discovery
    section 5. For example, "invoice" may never mean client billing
    unqualified, and "approved" must never be written as if it meant booked.
  - Add a gate that fails the build while any ledger row is still
    `assumed-today`.
- Run each new page's `check-*` and `verify-*` scripts, plus
  `verify-homepage`, `verify-feature-parity`, `verify-features-menu` and
  `verify-compare`.
- Verify in a browser at 390×844 and 1440×900, and at 200% text size.
  Refresh the `.impeccable/review` captures.
- Use `normal-ui-workflow-audit` in route-family mode for the new feature
  pages.

## Phase 5: Ship

1. Branch `feat/landing-event-repositioning` from `develop`, in
   `.gitworktrees/`.
2. Merge to `develop`.
3. Merge to `main` only after the deploy gate passes.
4. Afterward, update the landing's `CLAUDE.md` Design Context (decision 6).

## Marketing levers to weigh in phase 2

These are not copy. They are the arguments the story can use.

- **Continuity is the wedge.** Proposal and contract tools stop at signature.
  Costing tools start at the recipe. CostCook carries one event across both.
  The accepted proposal *is* the order, and closeout compares food cost with
  the revenue that was agreed. That link is the claim no competitor can make.
  Show it as one event moving through the product, not as a feature grid.
  Its limits go on the page with it: a kitchen draft holds one service, a
  proposal with more than one food service or a split charge is refused, and
  nothing is tracked after "Packed".
- **The client sees it too.** A client-facing offer page and decision (and signing, once DocuSeal is confirmed live)
  are something the caterer can show their own customers. That is a trust
  signal and a demo moment.
- **Frequency beats breadth.** Lead with what an owner does weekly (inquiries,
  proposals, prep), not what they do yearly (settings, integrations).
- **Truth as positioning.** Keep the "Straight up: this is early" voice.
  State limits plainly on each feature page, as the existing pages do.
- **Demo path.** The 15-minute demo walks the same one event. Align `demo`,
  `tour` and the video with the homepage story so the call confirms the page.
