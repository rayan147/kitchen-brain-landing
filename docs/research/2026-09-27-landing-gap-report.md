# Landing gap report (2026-09-27)

This report compares the landing site with the app inventory in
`docs/research/2026-09-27-app-inventory.yaml`. Row IDs refer to that file. It is
research only: it contains no prospect copy, and none of the changes below has been
applied.

## What was compared

**Landing surfaces read:**

- `src/pages/**`: index, all 14 `features/*`, compare, pricing, tour, demo,
  who-its-for, faq, onboarding and the blog index.
- `src/components/sections/*`, `src/components/more/*` and `*MenuContents*`.
- The copy data in `src/lib/*`: `site.ts`, `faq.ts`, `features.ts`, `comparison.ts`,
  `sage.ts`, `labels.ts`, `ordering.ts`, `coming-plans.ts`, `dietary.ts`,
  `nutrition.ts` and `tour.ts`.
- `docs/release-claim-ledger.md` and `scripts/check-landing-claims.mjs`.

**App side:** production is `ed6ff5f01`. No running-app spot checks were done.

**Eligibility rules:**

- Only `production` and `assumed-today` rows can be gaps.
- `production-flagged` rows go in "Ready once switched on".
- `off-page` rows never appear.
- Every assumed-today item carries the plan's deploy gate: no front-of-house claim
  merges to landing `main` before the kitchen-brain branch is on `origin/main`.

**The one new fact:** the landing never mentions any of these:

- inquiries, proposals, agreements or contracts, deposits, or the kitchen draft;
- clients, the calendar or capacity;
- event-level price impact, analytics or closeout by name.

A grep for proposal, contract, deposit, inquir, client, analytics, closeout and
capacity returns no copy hits outside Sage and code comments.

## 1. Gaps (ranked by weekly frequency x persuasive weight)

**How the score works:**

- **Frequency:** 4 = daily, 3 = weekly, 2 = every event, 1 = monthly or rarer.
- **Weight:** how much the gap moves a skeptical owner-operator, on a 1 to 3 scale.
- **Score:** frequency times weight. Rows 1 and 3 are raised to the top because
  they carry the continuity wedge. Row 8 is lowered because the landing already
  covers part of it.

| # | Gap | Rows | Freq x weight | Owning surface | Capture it needs |
| --- | --- | --- | --- | --- | --- |
| 1 | **Send a proposal and get the client's decision on their phone.** The one-page builder adds staff, rentals, delivery, service fee and tax, with optional lines and choice groups. The caterer previews the client's exact copy and sends it. The client can accept, ask for changes or decline, with no login. The caterer can remind, extend, withdraw, or update the offer. | A-05 (assumed-today, deploy gate), A-06, A-07, A-08, A-09 | 3 x 3 = 9 | Rewrite `/features/menus-and-quotes` as the proposals page. Homepage `SeeItRun`. | The client offer page at 390px: "Choose your services" and "Accept this selection". The builder at desktop, with the sticky total and "Food cost ... only you see this", captured from the proposal-build worktree. |
| 2 | **Take the inquiry and work the pipeline.** "+ New inquiry" accepts an undecided date. The client is picked or added. The follow-up has an owner and a date. The tabs are "Needs attention", "Booked · coming up", "In pipeline" and "Past & closed". Menu and service carry live food cost. | A-01 (B-10), A-03, A-04 | 3 x 3 = 9 | New page "Events" (inquiry to booked). Homepage `TheProblem` (the chase). | New inquiry at phone width with "Save and build menu". The event workspace with the six-step stepper and the Next step card. |
| 3 | **The accepted proposal becomes the kitchen's order, and "Confirm order" books the event.** "Prepare the kitchen draft" creates a tentative order that "holds no day and draws no crew". Confirming freezes prices, and the event then reads "This event is booked." | A-13 (D-01), D-04 (A-15) | 2 x 3 = 6, raised to the top (continuity wedge) | Homepage `TheYield` and the `CustomerOutcomes` "Quote" card. `/features/order-shop-prep-pack`. | The Kitchen draft card in its ready or tentative state. The "Confirm this order?" dialog (Order, Event date, Guests, Revenue). |
| 4 | **A client book.** It covers search by name or phone, a duplicate prompt on save, contacts, and venues with access notes (a gate code, for example). The history groups Upcoming, No date yet and Past. It can start the client's next order, review duplicates and merge them, and link old typed orders. "This order will carry" copies details once. | B-01 to B-08, B-09 | 3 x 2 = 6 | New page "Clients" (or one section of the Events page). | A repeat client's profile with "Start an order for this client". "This order will carry", showing address and access. |
| 5 | **Calendar and daily capacity for hand-made orders.** The calendar has month and week views with Confirmed, Drafts and Requests filters. It reads "Orders N of M" and "Vans out N of M" from the vans and orders-a-day set on `/settings/booking`. An order's day card reads "has room" or "is full", with prep hours by dish and a likely-crew line, and "Confirm order" re-checks the day and asks for a reason when it is over. Closed dates and booking rules are settings only here: they act on storefront and partner requests (flagged), and the owner can still book a closed date inside the app. | A-16, C-02, C-14, C-15, C-17 (C-01 settings only; C-03 excluded, storefront-only) | 3 x 2 = 6 | Events page, or a new "Calendar and capacity" page. | `/calendar` week view showing "3/3 vans" and a Full day. "The day" card on a hand-made order. Show no storefront greying or rule routing, because both are flagged. |
| 6 | **What a price rise does to upcoming events.** The review names the draft and confirmed events it touches. "Confirmed events keep the price you quoted, so a rise there comes out of your margin." It closes with "I changed a price or menu" or "Checked, no change needed". | F-08 | 3 x 2 = 6 | `/features/ingredients-and-supplier-prices` or `/features/invoices-and-price-list-import`. (`features.ts:181` covers recipes and menus only.) | The "Upcoming events" block with the previous and new pack price. "Review affected events" after "Invoice imported". |
| 7 | **Closeout: planned against actual food cost, as a share of the agreed price.** It includes "What moved the food cost". It covers food only and opens the day after the event. | D-11 (G-08) | 2 x 3 = 6 | `/features/purchases-and-month-cost` or `/features/order-shop-prep-pack`. (`features.ts:244` "Event cost, after" is the only nod to it.) | The four-figure "Planned vs actual food cost" card and the "What moved the food cost" table. |
| 8 | **Today's event rail.** Each of today's events shows Receive, Shop, Prep and Pack, with "Now" and one button. Below that sit the to-do list, the month food-cost card and the next 7 days. | D-13, D-14, G-09 | 4 x 2 = 8, lowered because the landing covers part of it | The `/features` "today" group (`features.ts:152-163`) and the homepage. | Today's event card with the rail and "Now" on Prep. **Crop out "Load out"**, which never lights up. |
| 9 | **Ask for a deposit and track it.** The caterer types the amount and chooses "A check, cash or a transfer" or "My own card processor". The panel shows Asked for, Received and "Nothing received yet." It must be worded as *tracked, not taken*. | A-14 (D-12) | 2 x 2 = 4 | Events page. | The Deposit panel: "Asked for $2,500.00 / Received $0.00 / Nothing received yet." |
| 10 | **Analytics.** The tabs are Overview ("This week is on track" or "n things need your attention"), What to charge ("Charge at least $X per guest to reach N%"), Month review, What things cost, and Where the money went (with a CSV export). | G-01 to G-06 (F-09) | 1-3 x 2 = 4 | New page "Numbers", or an expanded `/features/purchases-and-month-cost`. | An over-target menu row reading "Charge at least $.. per guest to reach 30%". |
| 11 | **Agreement without e-signature.** Contract templates can be uploaded or written. The accepted proposal can be attached as Schedule A. A paper-signed PDF can be recorded, and the signed files are kept on the event. | A-11, A-12 | 2 x 2 = 4 | Events page. | Settings > Contracts "Saved templates". Do not show the e-sign status track until A-10 is switched on. |
| 12 | **Prep estimates that learn from corrections, and learned yield.** | C-15, E-18 | 2 x 1 = 2 | `/features/recipes-and-costing` (learned yield is already on the page at `features.ts:204`). | "Prep by dish" with one row marked "yours". Owner question B10 first. |
| 13 | **Email alerts**, sent right away or in the daily summary. For example: "A client accepted a proposal". | I-10 | 1 x 1 = 1 | `/features/team-and-access`. | None needed. |

### Ready once switched on (not gaps until checklist A answers)

| Capability | Rows | Switch | Landing today |
| --- | --- | --- | --- |
| E-signature through DocuSeal, with the five-stage status track | A-10 | `DOCUSEAL_*`; the page says "Test environment" | Not mentioned (safe) |
| Online ordering: storefront, approve-then-pay via Stripe Connect, balance reminder with pay link, auto-approve, custom requests to Inquiries | C-04 to C-13 (A-02) | `ordering_integration` | Marked Coming (safe) |
| Partner API keys and outgoing webhooks | C-18 (I-16) | `ordering_integration` | "An API to build against": Coming (safe) |
| Sage agent: 22 read tools, 3 draft kinds, the setup panel | H-01 to H-08, H-13 | `SAGE_ENABLED` | **Claimed as available now** (see list 4, D1) |
| Label stock settings; the recipe-page label entry | I-11, D-09 (E-19 entry) | `label_printing` | Marked Coming |
| Square publish and counter sales | I-13 (E-20), I-14, G-07 | `square_integration` plus `sandboxOnly()` | Marked Coming (safe) |
| QuickBooks bills and supplier credits | F-05 (I-15) | `quickbooks_integration` plus `sandboxOnly()` | Marked Coming (safe) |
| Invoice email inbox | F-03 | Production mail worker is off | Not mentioned (safe) |

## 2. Stale claims

| # | Landing (file:line, quoted) | What is true now | Rows |
| --- | --- | --- | --- |
| S1 | `src/lib/faq.ts:186` "eleven read-only checks ... the one thing it can prepare, a shopping-list proposal". Also `src/lib/sage.ts:46,67,72`, `SageFeature.astro:23,28,217-220`, `features.ts:472`, and RC-49 "twelve tools". | The app has 22 read tools and 3 draft kinds: the kitchen shopping list, one order's shopping list, and a guest-count change on a draft order. It has no commit tools. The whole agent is flagged (see D1). | H-01, H-03, H-04, H-05 |
| S2 | `src/lib/faq.ts:256` "Confirming an order emails one purchase order per supplier" | Confirming contacts no supplier: "Confirming the kitchen order has not contacted any supplier." (`PurchaseOrderReview.svelte:122-123`). The owner presses "Order from suppliers" and chooses email, print or manual for each supplier, or "I'll shop it myself". `features.ts:259` already says this correctly. | D-05 |
| S3 | `src/lib/comparison.ts:345,347` "Fourteen allergens". Also `features.ts:185`, `nutrition.ts:73`, `dietary.ts:65` and `DietaryGuardsFeature.astro:163`. | The app uses the fixed US nine (`drizzle/0034_dizzy_klaw.sql:10-19`: milk, egg, fish, crustacean shellfish, tree nuts, peanuts, wheat, soy, sesame). Checked with `grep -rniE "mustard|celery|lupin|mollus|sulph|sulfit" drizzle` (no hits) and `grep -rniE "insert.{0,20}allergens" drizzle` (only 0034). `LABEL_SCAN_CODES` (`src/lib/domain/allergens/label-scan.ts:228`) excludes mustard, and its test asserts that. No custom allergens exist. | E-11, F-22, E-14 |
| S4 | `src/lib/faq.ts:209` "the number is food cost and it is never called margin". Also `comparison.ts:189`. | The app labels "Gross margin" on the event totals (`src/lib/components/events/menu/EventTotals.svelte:38`) and on recipe pricing (`RecipePricingSummary.svelte:91`). It is food-only. The scope claim still holds, but the wording claim is false. | A-04, E-03 |
| S5 | `src/lib/faq.ts:221-223` "How does a quote get its food cost? Pick a costed menu, enter the guest count and the price per head". Also `MenusQuotesFeature.astro:46-48,84,145-157,231-234` ("Three files. One customer waiting.") and `CustomerOutcomes.astro:36-38`. | This undersells the app. The quote is now a proposal with charge lines, tax, options and choice groups. It is sent to a client page, accepted, and carried into an agreement and a kitchen draft. | A-04 to A-09, A-13 |
| S6 | `src/components/sections/Hero.astro:10` "Back-of-house software for independent caterers..." Also `src/lib/site.ts:20` title "shopping, prep & food cost for caterers", `site.ts:21-22` description, and `CLAUDE.md` line 3. | The app now runs the event from inquiry to closeout. This is plan decision 1, so the wording is not proposed here. | A-01 to D-11 |
| S7 | `src/lib/comparison.ts:425` "All can open cost screens". Also `comparison.ts:434`, `faq.ts:136,312`, `features.ts:103,419`, `more/AccessBlock.astro:32`, `TeamAccessFeature.astro:37,64`, `WhoItsForPage.astro:34`, `WhoThisIsFor.astro:41` and `tour.ts:483`. | Partly stale. Staff can open recipe costs and Analytics. But Today withholds per-order money and client names from Staff (`today-work.ts:34-40`), the calendar hides money (`calendar/+page.server.ts:31`), Clients is closed to Staff, and Sage's money tools are for managers only. See owner question B8. | I-06, D-13, A-16, B-01, G-01 |
| S8 | `src/lib/faq.ts:195` "Square, QuickBooks and an API ... marked Coming". Also `features.ts:484` "connections are being built", `Integrations.astro:77`, and RC-45 "QuickBooks is genuinely unbuilt". | The Coming verdict is still right, but the premise has changed. Both integrations are built on main, and `sandboxOnly()` blocks live use ("Currently test mode only."). Only the RC-45 evidence text needs correcting. | I-13, I-14, F-05 |
| S9 | `src/lib/ordering.ts:98` "Stripe is a handoff, and the app states plainly when no online charge and no confirmation happened". Also `ordering.ts:12-25` and RC-59 ("no database, no auth"). | The storefront now does approve-then-pay. The client pays on "Pay to hold your date", the Stripe Connect payment confirms the order, and a balance reminder is sent with a pay link. Coming is still right while the flag is off. This sentence becomes wrong the day the flag flips. | C-08 to C-13 |
| S10 | `src/lib/faq.ts:144` "review Sage shopping proposals". Also `TeamAccessFeature.astro:21` and `tour.ts:497,543`. | Sage writes drafts ("Draft shopping list", "Discard this draft"), and there are three kinds. Staff see "This needs a manager." | H-03 to H-06 |
| S11 | `src/pages/pricing.astro:50-53` lists the plan's inclusions (recipes, orders, purchasing, teammates). Also `compare.astro:98` and the `comparison.ts` groups. | This undersells the app. The single plan also includes events, proposals, agreements, clients, the calendar and analytics, with no tier gating. `/compare` has no front-of-house rows at all. | plan_matrix, A-01 to A-14, B-01, G-01 |

## 3. False-by-omission limits (listed as Coming or "not yet", but shipped)

| # | Landing | What shipped | Rows | Guard to change with it |
| --- | --- | --- | --- | --- |
| F1 | **Buying that tops up to par** is marked Coming: `src/lib/coming-plans.ts:30` "it does not yet replenish to par" and `:32`, `comparison.ts:330-333`, `InventoryFeature.astro:42`, the homepage "What is still coming" list (`TheOtherTools.astro`), and RC-43. | Inventory > "Build shopping list" builds "What to buy for confirmed events and your par, by supplier." (`BuildShoppingListDialog.svelte`). It is proven by `e2e/buy-to-par.spec.ts` ("buy to par without events"). Production, unflagged. | D-16 (F-16, E-22) | `check-landing-claims.mjs:344` pins exactly two `verdict: 'coming'` plans. Owner question B5. |
| F2 | **Kitchen label printing** is marked Coming: `src/lib/labels.ts:33` (`LABELS_STATUS = 'coming'`) with the premise at `:7` "The whole feature sits behind the `label_printing` release flag". Also `comparison.ts:400-403`, `faq.ts:171-173`, `features.ts:390-399`, `tour.ts:313-338`, `ProductTour.astro:20,48`, `FeatureAreaFigure.astro:223` "The printer does not, yet.", `pricing.astro:59-61`, and RC-35 and RC-51. | The premise is false. `src/hooks.server.ts:507-514` gates only `/settings/labels`. `/labels/new` and `/labels/print/[id]` have no flag guard, and prep and pack read the saved settings or the defaults (`orders/[id]/prep/+page.server.ts:22`, `src/lib/server/labels/settings.ts:20-30`). Any trial kitchen can print labels from Prep and Pack through the browser today. Only the recipe-page entry and the stock settings are flagged. | D-09 (E-19), I-11 | `check-landing-claims.mjs:409` pins `'coming'`. RC-35 is also an owner launch decision, so this waits on owner question B4. |

These limits still hold, and each was re-checked against the inventory:

- one kitchen per subscription (multi-unit is off-page);
- no lot tracking or FSMA 204;
- no per-screen permission grid;
- no Spanish;
- the offline limits.

## 4. Wording drift

### Dangerous: landing claims of flagged or sandbox-only features

| # | Claim | Where | Switch | Verdict |
| --- | --- | --- | --- | --- |
| D1 | **Sage "Available now"** | `src/lib/sage.ts:29` (`SAGE_STATUS = 'yes'`, rendered "Available now" on the compare row, the features group, the menu chip and pricing). `faq.ts:187` "Sage is available now and stays within reach during setup". `comparison.ts:483-484`. `features.ts:472`. The homepage film's Sage beat (`SeeItRun.astro:73`). `WhatElse.astro:70` with `more/SageBlock.astro:171-179` (Ask Sage in the setup header). `OnboardingPage.astro:51-52` ("Sage open beside it"). `tour.ts:515-520`. `/features/sage`. | `SAGE_ENABLED`: `/sage` returns 404 without it. The last evidence is RC-46, an owner statement from 2026-08-29, not an env read. | **At risk.** If the flag is off in production or on trial kitchens, every one of these claims is false. Answer checklist A5 first. |
| D2 | The setup "Draft with Sage" food facts and the recipe importer | `OnboardingPage.astro:77,84` (drafts ingredient allergens and diet facts), `:90` ("Build with Sage") | The import model (not `SAGE_ENABLED`). "Build with Sage" is a link to `/import?kind=recipe`. | Safe if the import AI key is set (checklist A9). |
| D3 | Label printing, Square, QuickBooks, online ordering, the partner API | See S8, S9 and F2 | Flags and `sandboxOnly()` | **Not claimed as available.** Each is marked Coming. The app's own plan card over-promises them instead (bug C3). |
| D4 | Invoice email, e-signature, card deposits for events | None | Mail worker, DocuSeal, off-page | **Never claimed.** A grep for invoice email, inbox, forwarding, contract and deposit returns no landing copy. |

### Other drift

| # | Landing word | App word | Where on the landing | Rows |
| --- | --- | --- | --- | --- |
| W1 | customer | **Client** (sidebar, the book, the pickers) | `MenusQuotesFeature.astro:145,157,348`, `ordering.ts:63-83`, `features.ts:75`, the FAQ | B-01, A-01 |
| W2 | Sage "proposal" | **draft** ("Draft shopping list", "Discard this draft"). "Proposal" is now the client document (#501) | `faq.ts:144,186`, `sage.ts:67,72`, `SageFeature.astro:23,28,220`, `more/SageBlock.astro:121-130`, `features.ts:472-474`, `TeamAccessFeature.astro:21`, `tour.ts:497,543` | H-03, A-05 |
| W3 | "quote" for a draft order ("Quote it, freeze it, run it") | **proposal / offer** for the client document. "quote" survives only as the owner-side storefront number | `features.ts:228`, `MenusQuotesFeature.astro`, `faq.ts:221-231`, `CustomerOutcomes.astro:36-38` | A-05, A-06 |
| W4 | "margin" is never the app's word | **"Gross margin"** appears on event and recipe screens | `faq.ts:207-209`, `comparison.ts:189` | A-04, E-03 |
| W5 | "enquiry", "Taking orders" | **Inquiry**; the ordering area has four names | `features.ts:334`, `ordering.ts:67,88` | A-01, C-04 |
| W6 | "workspace owner" | **kitchen** to owners ("Start your kitchen"). "workspace" appears only in refusals | `faq.ts:74`, `comparison.ts:434`, `TeamAccessFeature.astro:37` | I-01, I-07 |
| W7 | Van imagery: "Seven in the van", "Close the van on the same plan" | Nothing is tracked after **Packed**. "Load out" never lights up, and "Vans" is a capacity count | `OrderShopPrepPackFeature.astro:87,91,153` | D-10, A-22 |
| W8 | "Does it do nutrition labels? Yes." | **"Calculated estimate"**, "not a claim of retail-label regulatory compliance" | `faq.ts:156-158` (the answer's body says estimate, but the lead word does not) | E-13 |
| W9 | "Stripe is a handoff" | "Pay to hold your date", then "Payment received" | `ordering.ts:98` | C-09 |

## Proposed update to `docs/release-claim-ledger.md` (not applied)

This diff has three parts:

- It adds rows RC-61 to RC-72, each with its inventory ID and tier, as planned in
  phase 4 of the repositioning plan.
- It adds the new exclusions.
- It appends a corrections section for the rows whose premises changed.

The existing row lines are left untouched so the hunks stay small. Every correction
waits on an owner answer, and each one names that answer.

```diff
--- a/docs/release-claim-ledger.md
+++ b/docs/release-claim-ledger.md
@@ -1,3 +1,3 @@
 # CostCook landing-page release claim ledger
 
-Last reviewed: 2026-09-09
+Last reviewed: 2026-09-27 (discovery: docs/research/2026-09-27-app-inventory.yaml, app ed6ff5f01)
@@ -97,2 +97,14 @@
+| RC-61 | CostCook takes an inquiry through menu and service, a sent proposal, the client's decision and a kitchen draft to a booked event: "Confirm order" on the kitchen draft is the booking. | PENDING owner B1. Inventory A-01, A-03, A-04, A-06 to A-09, A-13, D-04. Tier production. | kitchen-brain ed6ff5f01; e2e/new-inquiry.spec.ts, e2e/event-workspace.spec.ts, e2e/proposal-workflow-redesign.spec.ts, e2e/proposal-offers.spec.ts, e2e/proposal-offer-update.spec.ts, e2e/tentative-order.spec.ts (stale labels, bug C6) | Re-run tentative-order.spec.ts green before any claim ships. Never say "booked" for an accepted, signed or paid event. |
+| RC-62 | The proposal is built on one page with staff, rentals, delivery, service fee and tax lines, optional lines and choice groups, and food cost the client never sees. | PENDING. Inventory A-05. Tier assumed-today (feat/proposal-build-20260926). | ~/kitchen-brain-proposal-build e2e/proposal-build.spec.ts, e2e/proposal-builder-journeys.spec.ts | Deploy gate: blocked until the branch is on kitchen-brain origin/main. check-landing-claims.mjs must fail while this row says assumed-today. |
+| RC-63 | The client reviews the offer on their phone without logging in, picks options, and accepts, asks for changes or declines; acceptance is not a signature or a booking. | PENDING. Inventory A-07. Tier production. | src/routes/proposals/[businessId]/[offerId]/+page.svelte:86-90; e2e/proposal-workflow-redesign.spec.ts:175 | Keep the app's own sentence that acceptance is not a signature or booking. |
+| RC-64 | Agreements come from saved contract templates, can attach the accepted proposal, and keep the signed file on the event; a paper-signed PDF can be recorded. | PENDING owner A7. Inventory A-11, A-12 (A-10 e-signature is production-flagged: DocuSeal). | e2e/agreement-redesign.spec.ts, e2e/contract-preparation.spec.ts | No e-signature claim until DOCUSEAL_* is confirmed live and the "Test environment" line is gone. |
+| RC-65 | A deposit is asked for on the event and recorded by hand; CostCook tracks it and does not take the card. | PENDING owner B3. Inventory A-14. Tier production. | src/lib/server/ordering-payments/event-deposit.ts:16-26; EventDeposit.svelte:67-68 | Must read "tracked", never "take", "collect" or "get paid". |
+| RC-66 | A client book keeps people and companies with contacts, venues and access notes, their events and orders, duplicate review and merge. | PENDING owner B6. Inventory B-01 to B-09. Tier production. | e2e/customer-directory.spec.ts, e2e/client-history.spec.ts, e2e/client-duplicates.spec.ts, e2e/customer-contacts-venues.spec.ts | Say "client". Re-run e2e/order-client-selection.spec.ts:52 (red on 2026-09-26). |
+| RC-67 | A calendar shows confirmed orders and drafts against the day's order and van limits, and an order shows whether its day has room. | PENDING. Inventory A-16, C-01, C-02, C-14. Tier production (storefront greying is production-flagged). | e2e/today-calendar-redesign.spec.ts, e2e/day-verdict.spec.ts | "Vans" is a daily count, never dispatch. |
+| RC-68 | A price rise names the upcoming events it reaches; confirmed events keep the quoted price. | PENDING. Inventory F-08. Tier production. | e2e/price-impact-action-queue.spec.ts | None beyond RC-08. |
+| RC-69 | Closeout compares planned and actual food cost as a share of the agreed event price, food only. | PENDING. Inventory D-11. Tier production. | e2e/event-food-cost-closeout.spec.ts | Food only; revenue is the frozen booked price, not cash received. |
+| RC-70 | Analytics answers whether the period is on track, what to charge, and how the month's plan compares with purchases. | PENDING. Inventory G-01 to G-06. Tier production. | e2e/analytics-decisions.spec.ts, e2e/analytics.spec.ts | Never "dashboard", "P&L" or "profit". |
+| RC-71 | The shopping list can build from confirmed events and par. Supersedes the Coming half of RC-43. | PENDING owner B5. Inventory D-16. Tier production. | e2e/buy-to-par.spec.ts; src/routes/catalog/inventory/shopping-list | Remove parBuying from src/lib/coming-plans.ts and the pinned count in check-landing-claims.mjs:344 in the same commit. |
+| RC-72 | Kitchen labels print from Prep and Pack through the browser for any kitchen; label stock settings stay flagged. | PENDING owner B4 (RC-35 launch decision). Inventory D-09, I-11. Tier production (settings production-flagged). | src/hooks.server.ts:507-514 gates only /settings/labels; /labels/new and /labels/print/[id] unguarded | Flip LABELS_STATUS and check-landing-claims.mjs:409 only with the owner's RC-35 change. |
 
 ## Claims that are intentionally excluded
@@ -112,2 +124,12 @@
+- Card payment of an event deposit or balance through CostCook (A-18 off-page). Storefront card payments are production-flagged (ordering_integration).
+- Customer invoices or receivables, BEOs, staffing rosters, delivery dispatch, route planning, or anything tracked after Packed (A-19 to A-23).
+- E-signature, until DOCUSEAL_* is confirmed live in production (A-10).
+- Online ordering, the partner API, Square, QuickBooks, invoice email, or label stock settings as available, until checklist A confirms each switch.
+- The Sage agent as available, until SAGE_ENABLED is confirmed on production and trial kitchens (H-01 to H-08, H-13).
+- "Fourteen allergens". The app carries the US nine.
+- Sage "proposals". Sage writes drafts; "proposal" is the client document.
+- More than one service on a kitchen draft ("Book this event by hand until multi service drafts land").
+- Booking gated on a signature or a deposit. Confirm order checks day capacity only.
+- Deposit or balance terms shown to the client on the offer (A-17 has no UI).
 
 ## Landing-page ownership
@@ -175,0 +198,13 @@
+
+### Discovery corrections · 2026-09-27
+
+Read off kitchen-brain ed6ff5f01 (main = develop = release). None of these is applied to a row yet; each waits on the named owner answer.
+
+- RC-35 and RC-51: the premise "the whole feature sits behind label_printing" is false for Prep and Pack printing (see RC-72). Owner B4 decides whether the launch boundary still stands.
+- RC-43: buying to par ships (see RC-71). Owner B5.
+- RC-45: QuickBooks is built, not unbuilt; Square and QuickBooks both run only in Sandbox (sandboxOnly(), src/lib/server/integrations/config.ts:17-28,76-78). Coming stays correct. Correct the evidence text only.
+- RC-46: availability rests on SAGE_ENABLED, whose production value is unverified. Owner A5 before any Sage surface ships again.
+- RC-49: Sage has 22 read tools and 3 draft kinds (kitchen shopping list, one order's shopping list, a draft order's guest count), not eleven checks and one proposal. Rewrite after A5.
+- RC-52: Staff do not see per-order money or client names on Today, the calendar hides money from Staff, and Clients is owner and manager only; Analytics stays open to Staff. Owner B8 decides the public sentence.
+- RC-59: the storefront now runs approve-then-pay with Stripe Connect confirming the order and a balance reminder; "Stripe is a handoff" becomes false the day ordering_integration is on. Coming stays correct while it is off. Owner A1.
+- RC-60 and the allergen rows: the allergen count is nine (drizzle/0034_dizzy_klaw.sql), not fourteen.
```
