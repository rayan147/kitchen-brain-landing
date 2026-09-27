# Lane G notes: Numbers

Source: `~/kitchen-brain-develop-demo` at `ed6ff5f01` (= origin/main, checked 2026-09-27). Paths are
relative to that checkout. Rows are in `G.yaml`: 9 rows, all **production**. No assumed-today row
and no off-page row.

## Counts by tier

| Tier | Rows |
| --- | --- |
| production | 9 (G-01 to G-09) |
| assumed-today | 0 |
| off-page | 0 |

G-08 (closeout) repeats lane D's closeout row from the numbers side. Keep only one of them when the
lanes are merged.

## Where each number comes from

| Screen / figure | Kind | Source |
| --- | --- | --- |
| Overview "Food cost on events" | theoretical | Frozen confirmed-plan cost (misc included) ÷ event revenue. Counts only events with a price, guests, and an exact snapshot (`src/lib/domain/analytics/pulse.ts:79-104`) |
| Overview "Actual food cost against plan" | actual vs plan | Latest closeout revisions in the period. Within 5% counts as on plan (`pulse.ts:15,230-242`) |
| Overview "What price changes added" | actual | Price effect of recorded purchase lines compared with the previous period |
| Overview / What to charge "over target" | theoretical, live | Plate cost and menu cost at **today's** catalog prices vs the selling price or per-guest price (`src/lib/server/analytics/food-cost.ts:13-57`) |
| Month review "Planned food-cost %" | theoretical | Frozen usage + misc ÷ revenue of priced confirmed events (`src/lib/server/purchases/month-cost/aggregates.ts:21-43`) |
| Month review "Recorded food-cost %" | actual spend | Invoice lines dated in the month ÷ the same revenue. This is what was **bought**, not what was used |
| Closeout "Actual food cost, at what you paid" | actual | Attributed ingredient draws priced from purchases. Null while any draw has no price (`src/lib/server/orders/event-closeout.ts:458-461`) |
| Closeout "Food cost, share of the event price" | actual | ÷ the frozen revenue taken at confirm (`snapshot.money.event.revenueCents`) |
| What things cost / Where the money went | actual | `purchases` rows with corrected figures (`src/lib/server/analytics/repository.ts`) |
| Counter sales | mixed | Square net line revenue (actual) against recipe cost at **today's** prices plus misc (theoretical) (`src/lib/domain/analytics/sales.ts:155`) |
| Today "FOOD COST, <MONTH>" | theoretical | The same `getMonthFoodCost().theoreticalPct` as Month review (`src/lib/server/home/queries.ts:444-458`) |

## Does agreed revenue reach closeout and analytics?

**Yes, and it already does in production.** kb-client-payment does not change this.

- EV-07 (`src/lib/domain/profitability/order-revenue.ts`) sets revenue as price × guests + `revenueAdjustmentCents`.
  When the tentative order is created from an accepted proposal, `priceForAgreedRevenue(charge.netCents, servingCount)`
  splits the accepted total into a whole-cent price per guest plus the leftover cents
  (`src/lib/server/events/tentative-order.ts:209-221`).
- That revenue is frozen into the confirm snapshot. Closeout, the pulse, Month review and Today all read it through
  `orderRevenueCents`.
- **Scope of "agreed revenue":** the bridge takes exactly **one accepted food-service charge**, net of any discount.
  It returns 'many-services' when a proposal has more than one service and 'split-charges' when a service has more
  than one charge (`tentative-order.ts:199-203`). Staff, rental and other proposal charges never enter the
  food-cost denominator.
- `~/kb-client-payment` (22 committed files, plus 3 modified and 1 untracked) adds `paymentTermsJson` (deposit and
  balance terms) to that order, and adds agreement checkout routes. It does not touch any analytics, closeout,
  home, month-cost or revenue file. Money collected (deposits, balances, receivables) shows up **nowhere** in
  Analytics. That is still true on the branch.
- `~/kitchen-brain-proposal-build` changes only the proposal-builder charge UI. `~/kb-stage-diagnosis` touches no
  numbers file.

## Plan gating

There is one plan (Launch). No analytics screen is gated by plan. Square counter sales depend on the
`square_integration` release flag, which is off by default and can be overridden per business
(`src/lib/server/features/access.ts:8-22`), plus a connected Square account. The refresh action also requires an
active subscription and the OWNER or MANAGER role (`src/routes/analytics/sales/+page.server.ts:22-36`). The
Counter sales tab appears for every kitchen, even with no Square connection. It then shows "No sales in this view".

## Limits worth stating on the landing

- The whole numbers stack covers **food only**. Staff, rentals, packaging and overproduction are not modelled,
  and the app says so on screen.
- Every revenue figure is **booked price**, never cash received ("Confirmed-event value is the price on those
  events, not cash received.", `FoodCostMonth.svelte:225`).
- The report never labels the gap between purchases and planned usage as waste. Only Logged Waste counts as waste.
- Counter sales come from Square only. The generic POS intake API (`/api/ordering/v1/sales` → `sales` table)
  writes rows that no report reads. Cost comparison works only in USD.
- Nothing is pushed to accounting from these tabs. The only export is the purchases CSV. QuickBooks is covered
  in lane I.

## Wording drift found

1. On Today, the heading **"Price moves this month"** (`src/routes/+page.svelte:260`) sits over a 7-day window
   (`RECENT_PURCHASE_DAYS = 6`, `src/lib/domain/purchasing/drift.ts:61`).
2. The same month figures carry three sets of labels. CONTEXT.md says the UI uses "Should have cost" / "Did cost".
   The Purchases header uses "Should have cost (recipe estimate)" / "Did cost". The Analytics Month review uses
   "Planned food usage cost" / "Recorded ingredient purchases".
3. CONTEXT.md "Sale" says sales are "Posted by a register through the ordering integration". The only report,
   Counter sales, reads Square's tables.
4. The tab names are phrased as questions, not metrics: "What things cost", "Where the money went", "Counter
   sales", "What to charge", "Month review". If the landing says "dashboards", "P&L" or "profit", it overstates
   what the app does.

## Open questions for the owner

1. Is `FEATURE_SQUARE_INTEGRATION_ENABLED` on in production, or on for any pilot kitchen? If it is not, G-07
   can't be shown to prospects.
2. Should STAFF see Analytics? Every `/analytics` route only calls `requireScope`, so staff see event sales and
   margins. Today withholds per-order money and client names from STAFF (`src/lib/server/home/today-work.ts:34-40`).
3. The POS sales intake API stores sales that no report reads. Is that intended, or should Counter sales include
   non-Square registers?
4. Should the landing claim anything about deposits or balances in the numbers? Nothing reports collected client
   money. It exists only per order on `/orders/[id]`.
5. The agreed-revenue bridge refuses proposals with more than one food service or a split charge. Is that limit
   acceptable to state publicly?

## Not verified

I did not run the app for this lane. Every label above was read from source. No spot-check was done in the browser.
