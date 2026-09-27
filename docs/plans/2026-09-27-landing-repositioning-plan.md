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
  - it takes the inquiry and records the customer;
  - it builds menus, sends a proposal and receives the client's decision on the
    client's own page;
  - the contract is signed and becomes an agreement;
  - the event is booked, and the calendar shows it;
  - the event becomes the order, and the kitchen shops, preps, packs and
    closes out;
  - every step feeds the numbers.
  
  An online ordering site, with approval and capacity, is also shipped. So are
  Square and QuickBooks connections, customer records and analytics.
- **Today** (assumed merged). The one-page proposal builder
  (`feat/proposal-build-20260926`) and deposit and balance terms carried from
  the accepted proposal to the order (`feat/client-payment-booking-loop`).

The product answers a new question. It used to be "what does this event cost
me to cook?". Now it is "take this event from the first email to the last
invoice, and tell me what I made". The landing still answers only the first.

## Owner decisions (blocking, needed before phase 3)

1. **Positioning line.** Choose one:
   - (a) **Event-first.** CostCook runs the catering event end to end, and
     costing is the proof inside it.
   - (b) **Kitchen-first, extended.** Keep "the kitchen brain for caterers" and
     add front-of-house as the way work arrives.
   - (c) **Two doors.** Separate paths for the owner who sells and the chef who
     cooks.
   
   Recommendation: **(a)**. The skeptical owner-operator reading on a phone
   feels the inquiry-to-deposit chase as the more acute pain. Costing is the
   differentiator competitors lack, so it becomes the proof, not the headline.
   Option (c) splits the one-goal page.
2. **Who the reader is.** Is it still "owner-operator caterers and meal-prep,
   1–15 staff"? Meal-prep kitchens barely use proposals and contracts. Decide
   whether they keep a place on the homepage or move to `who-its-for`.
3. **What counts as shipped for this release.** Confirm the assumed-today set
   (proposal builder and client payment terms). Confirm that `ezcater`,
   `ordering-integration` and PO email stay off the page.
4. **The client-money processor.** Decide what the landing may name: Stripe
   Connect, Square, or neither. It depends on discovery section 5.
5. **Pricing and tiers.** Does front-of-house sit behind a plan tier? If so,
   `pricing`, `compare` and the trial terms all change.
6. **Anchor files.** Approve rewriting the product summary in the landing's
   `CLAUDE.md` (Design Context > Users, the one-goal line), the title and
   description in `site.ts`, and kitchen-brain's `CONTEXT.md` line 3. The last
   is a separate kitchen-brain PR, owned there.

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
   | `SeeItRun` | **front-of-house owner**: inquiry → proposal → signed → deposit → booked, shown with real captures |
   | `TheProblem` | the chase: email threads, a Word proposal, a PDF contract, a spreadsheet cost sheet, and the deposit follow-up |
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
- **The client sees it too.** A client-facing offer page, decision and signing
  are something the caterer can show their own customers. That is a trust
  signal and a demo moment.
- **Frequency beats breadth.** Lead with what an owner does weekly (inquiries,
  proposals, prep), not what they do yearly (settings, integrations).
- **Truth as positioning.** Keep the "Straight up: this is early" voice.
  State limits plainly on each feature page, as the existing pages do.
- **Demo path.** The 15-minute demo walks the same one event. Align `demo`,
  `tour` and the video with the homepage story so the call confirms the page.
