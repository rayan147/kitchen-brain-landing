# CostCook app inventory (2026-09-27)

Research notes, not prospect copy. The source of truth is
`docs/research/2026-09-27-app-inventory.yaml`: 148 canonical rows, merged from the
167 rows in lanes A to I. The brief said there were 187; the lane files hold 167.
Nineteen duplicates were folded into `also_in`.

Production means `~/kitchen-brain-develop-demo` at `ed6ff5f01`, where HEAD equals
`origin/main`. Assumed-today means the working trees of `~/kitchen-brain-proposal-build`
and `~/kb-client-payment`.

**No running-app spot checks were done in this merge** (prompt section 8 is still
open). Every label and done marker was read from source, either by the lanes or
during the merge. The merge re-read the label-printing gate in
`src/hooks.server.ts:507-521`.

## Tiers

| Tier | Meaning |
| --- | --- |
| production | On main **and** reachable by a new trial kitchen with default config |
| production-flagged | On main but behind a switch that defaults off or cannot run live. The switch is named in `switch:`, and its production value is unknown (checklist A) |
| assumed-today | In the two named worktrees, which the owner says merge today |
| off-page | Branch-only, uncommitted, or PRD-only |

**Rule.** A row is flagged only when its switch defaults off or throws on a live
deployment. The switches that qualify are:

- the four release flags: `ordering_integration`, `label_printing`,
  `square_integration` and `quickbooks_integration`;
- `SAGE_ENABLED`;
- DocuSeal;
- the production mail worker;
- `sandboxOnly()`.

Rows that only need a provider key (the import AI key, or the USDA FoodData Central
key) stay production. Those keys appear in checklist A as config to confirm.

## Workflow map, in the order a caterer meets it

Legend: `[F]` production-flagged (switch named), `[T]` assumed-today, `[X]` off-page;
anything unmarked is production. Row IDs in brackets.

```text
INQUIRY ........ + New inquiry, client picked or added (A-01), pipeline tabs + follow-ups (A-03)
                 web Custom Request -> Inquiry [F ordering] (C-07)
MENU & SERVICE . services, live food cost + "Gross margin" (A-04)
PROPOSAL ....... one-page builder: staff, rentals, delivery, fee, tax, options [T] (A-05)
                 preview exact client copy, "Send offer to <name>" (A-06)
CLIENT ACCEPTS . client page on phone, no login: accept / change / decline (A-07)
                 remind, extend, withdraw, record a phone yes (A-08); update offer (A-09)
AGREEMENT ...... templates (A-12); send for e-signature [F DocuSeal, "Test environment"] (A-10)
                 or file a paper-signed PDF, signed files kept (A-11)
KITCHEN DRAFT .. "Prepare the kitchen draft": tentative order, one service only (A-13)
                 accepted deposit/balance terms reach the order, no UI [T] (A-17)
DEPOSIT ........ "Ask for a deposit": typed, recorded by hand, nothing sent (A-14)
                 client pays event deposit by card [X] (A-18)
BOOKED ......... "Confirm order" freezes prices = event booked (D-04); calendar (A-16)
SHOP ........... POs by email/print/manual (D-05), shop list (D-06), week lists (D-15)
                 deliveries checked in (D-07), follow-up (F-11)
PREP ........... prep list "As confirmed <date>" (D-08), labels via browser print (D-09)
PACK ........... pack + equipment, shortfall question, "Packed" (D-10)
                 [nothing after Packed: no load-out, dispatch or delivery; A-22, A-23 are X]
CLOSEOUT ....... planned vs actual food cost, share of agreed price, food only (D-11)
NUMBERS ........ Today (D-13, G-09), Analytics: on track, what to charge, month (G-01..G-06)
                 Square counter sales [F square + sandbox] (G-07)

SIDE LOOPS
Recipes & menus  book, costing, versions/publish, kitchen sheet, allergens (US nine),
                 nutrition "Calculated estimate", menus per guest, import (E-01..E-18)
Clients ........ client book, contacts, venues, history, duplicates, merge (B-01..B-09)
Buying & invoices invoice import + review (F-02), price impact on events (F-08),
                 inventory + par (F-15), buy to par (D-16), compare buys (F-21)
                 invoice email [F mail worker off] (F-03), QuickBooks bills [F qb + sandbox] (F-05)
Capacity ....... booking settings, day verdict, prep hours, likely crew (C-01..C-03, C-14..C-17)
Online ordering  storefront, approve-then-pay via Stripe Connect, balance reminders,
                 auto-approve, partner API + webhooks [F ordering] (C-04..C-13, C-18)
Sage ........... agent: ask, 3 kinds of draft, approve [F SAGE_ENABLED] (H-01..H-08, H-13)
                 "Draft with Sage" on ingredients/recipes/setup, import model (H-09..H-12)
Setup & team ... start, trial, setup (I-01..I-03), team (I-06), billing (I-07),
                 settings (I-08..I-10, I-12, I-17), label stock [F labels] (I-11),
                 Square publish [F square + sandbox] (I-13, I-14)
```

## Tier counts

| Lane | production | production-flagged | assumed-today | off-page | rows |
| --- | --- | --- | --- | --- | --- |
| A Front of house | 12 | 1 | 2 | 6 | 21 |
| B Clients | 9 | 0 | 0 | 0 | 9 |
| C Ordering & capacity | 7 | 11 | 0 | 3 | 21 |
| D Order to van | 15 | 0 | 0 | 0 | 15 |
| E Recipes & menus | 18 | 0 | 0 | 4 | 22 |
| F Buying & invoices | 18 | 2 | 0 | 2 | 22 |
| G Numbers | 7 | 1 | 0 | 0 | 8 |
| H Sage | 4 | 9 | 0 | 2 | 15 |
| I Setup, team, integrations | 12 | 3 | 0 | 0 | 15 |
| **All** | **102** | **27** | **2** | **17** | **148** |

### Changes from the lane tiers

- **Re-tiered production to production-flagged (24 rows).** These were C-04 to
  C-13, C-18, A-10, I-11, G-07, F-05, and H-01 to H-08 plus H-13.
- **Re-tiered off-page to production-flagged (3 canonical rows, plus I-15).**
  I-13, I-14 and I-15 are merged code that `sandboxOnly()` blocks; I-15 is now
  folded into F-05. F-03 is merged code whose production mail worker is off.

### Dedupe map

Each row on the left of the arrow was folded into the canonical row on the right.

- Front of house: B-10 → A-01, D-01 → A-13, D-12 → A-14, and C-19 and D-18 → A-17.
  C-20 → A-18, and `/o/[token]` now sits on A-07.
- Ordering, capacity and orders: A-24 → C-01, A-02 → C-07, I-16 → C-18,
  A-15 → D-04 and F-10 → D-07.
- Closeout and labels: G-08 → D-11 and E-19 → D-09. The recipe-page entry that
  E-19 described is flagged; the prep and pack entries are not.
- Buying and prices: E-22 and F-16 → D-16, E-21 → F-20, and F-09 → G-04.
- Integrations: E-20 → I-13 and I-15 → F-05.

Four rows were kept because no row duplicates them:

- **B-09** covers choosing a client on an order. D-02 writes the order and has no
  client-selection step.
- **E-14** covers guests' restrictions. D only displays the guards on prep and pack.
- **E-16 and E-17** cover recipe import. F covers invoice, price-sheet and
  ingredient imports.

**Route check.** All 110 `+page.svelte` routes in develop-demo appear on a row or in
`internal_routes`. None are missing.

## Terms (settled from code)

| Term | What it means in the app | Must not be confused with |
| --- | --- | --- |
| Client (not customer) | The UI says "Clients": a person or company kept in the client book, with contacts and venues | The typed customer on an order, or a storefront requester (neither becomes a Client unless someone links it) |
| Invoice (unqualified) | The **supplier** invoice. No customer invoice exists (#504 is unbuilt) | Client billing. "Invoice" is also a client payment-method label, which clashes with this meaning |
| Proposal / offer | The proposal is the document. An offer is one sent revision with a client link | The landing's "quote", which means a draft order with a per-guest price |
| Acceptance (#501) | The client presses "Accept this selection". The page says acceptance "is not an e-signature or a booking confirmation" | Approval, a signature, or a booking |
| Approval (#512) | The kitchen says yes to a storefront request, and a 72-hour Payment Window opens. `[F ordering]` | Confirmed. An approved order is still a draft |
| Agreement / contract signing | Step 5 is the Agreement. Signing runs through DocuSeal only when `DOCUSEAL_*` is set, and the page then says "Test environment". The paper-signed PDF path always works | A live e-signature the landing can claim today |
| Kitchen draft | The tentative order made from an accepted proposal. It "holds no day and draws no crew" and holds one service only | A hand-typed draft order |
| Booked | The kitchen draft is confirmed with "Confirm order". This checks day capacity, not the signature or the deposit | Paid, signed or accepted. The event chip says "Booked" earlier, once an agreement is complete (bug C4) |
| Deposit / balance | Owed amounts held on the **order**. For an event, the caterer types the deposit and records it by hand (check, cash, transfer, or their own processor). There is no balance, due date or reminder, and "Nothing is sent to the client from here" | The subscription, or a customer invoice |
| Client-money processor | Stripe Connect, on the caterer's own connected account, for **storefront orders only** `[F ordering]`. CostCook has no processor for event deposits. Square never touches client money | CostCook's own subscription, which runs on the Stripe platform account |
| After "Packed" | Nothing is tracked. Today's "Load out" step never lights up, and "Vans" is a capacity count | Dispatch, delivery or routes (PRD only) |
| Closeout | Planned against actual food cost, as a share of the frozen agreed price. Food only | A P&L or labor costing |
| Revenue | The booked price, frozen at confirm. For an order made from a proposal, it is the one accepted food-service charge | Cash received, or the proposal's grand total |
| Gross margin | The app shows "Gross margin" on event totals and recipe pricing. It is food-only | Business profit. The landing FAQ says the app never uses the word "margin" |
| Draft vs working copy | The UI says "draft" for both. CONTEXT.md says a working copy must not be called a draft | Order drafts and kitchen drafts |
| Sage draft | The Sage cards say "Draft shopping list", "Draft guest change" and "Discard this draft". There are 22 read tools and 3 draft kinds | The client Proposal. The landing says "proposal" and "eleven checks" |
| Sage agent vs "Draft with Sage" | The agent sits behind `SAGE_ENABLED`. The drafting buttons run on the import model and do not need that flag | Each other |
| Nutrition label | "Calculated estimate", which is "not a claim of retail-label regulatory compliance" | An FDA-compliant or lab-tested label |
| Allergens | The fixed US nine (`drizzle/0034`) | The landing's "fourteen allergens", which is wrong |
| Plan | One plan: CostCook Launch, $49 per kitchen per month, a 15-day trial with a card and $0 today, unlimited teammates. No feature is gated by tier | Release flags and roles |
| Online ordering area | The app uses four names: Ordering site, Online ordering, Ordering integration, storefront | The client proposal page `/o/[token]` |

More terms are in the YAML: Partner, supplier and vendor, kitchen and workspace,
Kitchen records, Readiness, price sheet, and "Should have cost" and "Did cost".

## Owner questions (consolidated and deduplicated)

### A. Production switches checklist (answer in one pass)

For each switch, give the production value and say whether it is on for trial kitchens.

1. **`ordering_integration`.** Is `FEATURE_ORDERING_INTEGRATION_ENABLED` set, and which
   `business_feature_overrides` rows exist? This switch controls C-04 to C-13 and C-18.
   Last known: the flag was absent from the production env on 2026-09-08
   (`src/lib/ordering.ts:19-25`).
2. **`label_printing`.** Is `FEATURE_LABEL_PRINTING_ENABLED` set, and are there any
   override rows? This controls I-11 and the recipe-page label entry.
3. **`square_integration`.** Is the flag set? And when will live Square credentials
   replace `sandboxOnly()`? This controls I-13, I-14 and G-07.
4. **`quickbooks_integration`.** Is the flag set? And when will live QuickBooks
   credentials replace `sandboxOnly()`? This controls F-05.
5. **Sage.** Is `SAGE_ENABLED=enabled` set on production and on the trial and demo
   instance? What are `SAGE_KILL_SWITCH` and `SAGE_AI_PROVIDER`? Does a trialing kitchen
   pass `subscriptionAccess.canUseProduct`? This controls H-01 to H-08 and H-13. Last
   known: RC-46, the owner's statement of 2026-08-29.
6. **Invoice email.** `infra/cdk/environments.ts:156` sets `worker: false` with empty
   name servers. When will mail reach `@in.costcook.io`? This controls F-03.
7. **DocuSeal.** Is `DOCUSEAL_*` set in production? And is the signing page's "Test
   environment" line intended? This controls A-10.
8. **Other env values.** What are `BILLING_ENFORCEMENT`, `SETUP_SAMPLE_DATA_ENABLED`
   and `LAUNCH_PRICE_DISPLAY` set to?
9. **Config that does not change tiers.** Are the import AI provider and key set
   (Gemini flash-lite by default)? Without them, scans and photos stop at "Scan not
   readable" and the "Draft with Sage" buttons do not appear. Is the USDA FoodData
   Central key set? Are the `STRIPE_ORDERING_*` keys set?

### B. Positioning-relevant product facts

1. **Assumed-today set.** Do `feat/proposal-build-20260926` and
   `feat/client-payment-booking-loop` merge today? The deploy gate says no
   front-of-house claim may merge to landing `main` before they do.
2. **Payment terms.** The client never sees the proposal's deposit and balance terms
   (A-17). Should they appear on the offer before the landing mentions them?
3. **Client money.** May the landing name Stripe Connect, and only for online
   ordering? For events it must say deposits are *tracked, not taken*. When is card
   deposit for events (A-18) planned?
4. **Label printing.** Printing from prep and pack is not behind `label_printing`,
   so any trial kitchen can print labels today. Does RC-35 ("not included at launch")
   still stand, or should the landing flip it to available?
5. **Buying to par.** Buy-to-par ships (D-16, `e2e/buy-to-par.spec.ts`). Confirm that
   the Coming plan can be retired.
6. **Clients.** Should the landing adopt "client" everywhere? Is the missing "new
   inquiry for this client" button intended? Should the profile stay without money
   and booking status?
7. **Multi-service events.** A kitchen draft holds one service, so the app says "Book
   this event by hand until multi service drafts land". Is that acceptable to sell to
   weddings, and when does it change?
8. **Staff and money.** Should staff see money? Today, the calendar and Clients hide
   money from staff, but Analytics shows it to them, and the landing says "anyone can
   open the costs". Which is intended? Sage keeps its money tools manager-only while
   the order money bar shows every role (PRD ruling 1, reopened).
9. **Managers.** How does someone become a Manager, given that invites are always
   Staff? Should the landing mention managers at all?
10. **Estimates.** May the landing mention prep estimates, "Close it?" and likely
    crew? PRD slices 5-7 and 10 were "held for design-partner feedback", but they are
    merged and visible.
11. **Nutrition wording.** Should the landing say "nutrition label" or "nutrition
    estimate"?
12. **Working copy.** Should the landing use the UI word "draft" or the glossary
    word "working copy"?
13. **Partner API and webhooks.** Should they be marketed at all, or kept for
    developers?
14. **Payment Window.** Should it stay fixed at 72 hours, as the landing may state?
    PRD story 44 says the owner sets it.
15. **Collected money in the numbers.** Should any numbers claim mention collected
    money? Nothing reports deposits or balances.
16. **Branches.** What is the status of these branches: `design/client-to-order-guidance`,
    the multi-unit series 485-490, `feat/purchase-order-email-workflow`,
    `feat/ezcater-order-intake` and the Sage redesign in `~/kb-sage-redesign`?
    Can `codex/541-archive-customers` be deleted?
17. **Deposit warning.** Should "Confirm order" on an event warn when no deposit has
    been recorded?

### C. App bugs and inconsistencies found

1. `apps/ordering/src/lib/components/PaymentHandoffPanel.svelte:137` shows the old
   internal product name to storefront clients. Line 126 ("Paying does not confirm
   the kitchen's availability") is stale under approve-then-pay.
2. The setup completion card sends sample deletion to Team settings
   (`SetupCompletionSummary.svelte:108-109`). It should link to `/settings/sample-data`.
3. The in-app plan card lists "Label printing", "Square and QuickBooks sync" and
   "Online ordering" as included (`BillingPlanCard.svelte:279-287`). All three are
   flag-off or sandbox-only.
4. The event chip and stepper say "Booked" once an agreement is complete
   (`events/[id]/+page.server.ts:145`), but the journey says "Event booked" only
   after "Confirm order".
5. The two screens disagree on when planning opens. The agreement page says "Kitchen
   planning opens as soon as you send" (`:221`). The event page says it "Opens once
   the client accepts a proposal" (`[id]/+page.svelte:230`).
6. `e2e/tentative-order.spec.ts` drives old step-editor labels and "Email offer
   revision N to customer", which is not in `src`. The proposal-build branch does not
   update it. Is the draft-to-deposit proof red?
7. The builder's autosave may wipe the payment terms. Both assumed-today branches
   edit `src/lib/domain/proposals/draft.ts`, and the builder never sends
   `paymentTerms`.
8. Every invite joins as Staff, and no screen changes a role. A code comment says "a
   manager promotes from the team page", but no such control exists.
9. Checkout sends `seats: 1` (`settings/billing/+page.server.ts:53`), while the docs
   say teammates are unlimited. Confirm the Stripe price is not per seat.
10. Today's "Load out" step never lights up, because both callers pass `vans=null`.
    Track it or remove it.
11. Today's heading "Price moves this month" (`+page.svelte:260`) sits over a
    7-day window.
12. The same month figures carry three label sets: "Should have cost" and "Did cost"
    against "Planned food usage cost" and "Recorded ingredient purchases".
13. "Invoice" as a client payment-method label clashes with the glossary.
14. Combined production (`/orders/batch`) cannot be reopened once you leave it.
15. A deposit taken through "My own card processor" has no record form. Only the
    partner API can record it.
16. Adding a client from an inquiry skips the duplicate question that `/customers`
    asks.
17. Docs and trackers have drifted:
    - `docs/ordering-integration.md` step 4 is stale.
    - Issue #524 is still open although the work is merged.
    - The POS sales intake API writes rows that no report reads.
    - `inventory.json` misses `e2e/recipe-csv-import.spec.ts`.
    - CONTEXT.md line 3 still describes the product as back-of-house only.
18. Evidence gaps:
    - `e2e/order-client-selection.spec.ts:52` was red in the 2026-09-26 walk and has
      not been re-run.
    - No e2e test opens `/todo`.
    - No e2e test covers "Record received payment".
