# CostCook landing-page release claim ledger

Last reviewed: 2026-08-19

## Marketed release

The landing page treats the first-run setup wizard as merged into the release being marketed, per the release decision for this landing update.

The evidence baseline is pinned as a composite lineage so the release decision remains traceable without inventing a merge SHA:

- Demo base: `sandbox/demo` at `6a29e88e36445b74ba5d057fe0461196e39b5c35`
- Setup implementation: `feat/first-run-setup-wizard` at `dfb71efc524da94efc6cec2f354751ce69d424e2`
- Required wizard lineage: `c572f55`, `0463875`, `735fb3b`, `7ceb02dbb67034e507aeb279abb421ddd90df87f`, `dfb71ef`
- Landing implementation: `main` plus the changes that add this ledger

Before deployment, the release owner must replace the composite lineage above with the deployed application SHA and verify that `/setup` exists in that build. If the wizard is not in the deployed build, claims `RC-10` through `RC-15` must not ship.

Unless a row says otherwise, shipped evidence is read at the demo-base commit and setup evidence is read at the setup-implementation commit.

## Source priority

1. Executable behavior in the marketed release
2. Domain services and tests
3. Database schema and server actions
4. The pinned setup implementation
5. Approved product documentation
6. Landing-page copy

## Approved claims

| ID | Public claim | Classification | Evidence | Release check |
| --- | --- | --- | --- | --- |
| RC-01 | CostCook is for independent caterers and small kitchen teams. | Product positioning | `PRODUCT.md`, Users | Confirm audience has not changed. |
| RC-02 | CostCook connects supplier prices, ingredients, recipes, menus, orders, shopping, prep, packing, and purchases. | Shipped workflow | `docs/audits/product-certification-20260730/feature-map.md`, product spine | Walk one connected seeded order. |
| RC-03 | A costed menu, guest count, and selling price produce a live draft event estimate. | Shipped calculation | Order creation, order money, and golden-loop coverage | Create a draft order and change guests. |
| RC-04 | CostCook shows theoretical event food cost and food-cost percentage against a target. | Shipped calculation | `src/lib/core/foodcost.ts`, `src/lib/server/order-money.ts` | Compare UI with independent arithmetic. |
| RC-05 | CostCook can name the selling price required to meet the configured food-cost target. | Shipped calculation | `foodCost()` suggested price | Verify rounding to the next whole cent. |
| RC-06 | Draft order quantities and costs update from current catalog facts. | Shipped workflow | Order plan and money readers | Change a current ingredient price on a draft. |
| RC-07 | Confirming an order freezes its plan, costing inputs, and money. | Shipped workflow | `orders/repository.ts`, `order_snapshots` | Confirm, change catalog facts, and compare. |
| RC-08 | Later prices update future catalog and draft costs without rewriting confirmed orders. | Shipped invariant | Current-cost tests and snapshot repository | Run quoted-versus-today regression. |
| RC-09 | Imported information remains staged until the user reviews and commits it. | Shipped safety rule | Import route family and review-gate tests | Verify match/create/correct/skip paths. |
| RC-10 | Setup has six stages: settings, business and suppliers, ingredients, recipes, menu, and first order. | Setup release | `src/lib/onboarding.ts` at setup commit | Verify all six stages in deployed `/setup`. |
| RC-11 | Setup is available to an owner or manager. | Setup release | `src/lib/server/onboarding/permissions.ts` | Verify role gates. |
| RC-12 | Setup progress can be saved and resumed. | Setup release | Onboarding progress store and E2E scenario | Exit, sign in again, and resume. |
| RC-13 | Existing kitchens enter review mode and reuse completed records. | Setup release | `getSetupState()` and existing-data tests | Open setup with seeded data; assert no duplicates. |
| RC-14 | Setup ends with a first costed order and shopping handoff. | Setup release | Setup create-order action and completion summary | Complete setup and open Shop. |
| RC-15 | Setup exposes the calculations at each stage. | Setup release | Cost disclosures and onboarding transparency tests | Keyboard-open every disclosure. |
| RC-16 | Ingredients support pack price, quantity, yield, conversions, and supplier context. | Shipped catalog | Ingredient cost engine and wizard | Create a priced ingredient. |
| RC-17 | Recipes can start blank, duplicate an existing recipe, or enter through import. | Shipped catalog | `NewRecipeDialog.svelte`, recipe actions | Verify all three doors. |
| RC-18 | A recipe can include reusable sub-recipes. | Shipped catalog | Core recipe graph and builder | Cost a dish containing a sub-recipe. |
| RC-19 | Recipe lines show used quantity, yield, amount to buy, preparation, and cost contribution. | Shipped calculation UI | Recipe builder and line-contribution engine | Verify one costable recipe. |
| RC-20 | Missing prices and conversion facts stop costing rather than becoming zero. | Shipped safety rule | Ingredient and recipe engines | Verify explicit missing-fact state. |
| RC-21 | Menus calculate cost per guest from dish portions and miscellaneous cost. | Shipped calculation | `calculateMenuCost()` | Compare UI with engine fixture. |
| RC-22 | Shop consolidates ingredient needs by supplier and rounds buying to whole packs. | Shipped operations | Production plan and Shop workspace | Verify supplier subtotal and pack count. |
| RC-23 | Trusted on-hand quantity reduces estimated buying, not theoretical consumption. | Shipped invariant | Inventory planner and onboarding costing policy | Verify fresh/stale count behavior. |
| RC-24 | Prep includes scaled dishes, whole sub-recipe batches, instructions, and persistent checks. | Shipped operations | Prep route and check storage | Walk seeded Prep. |
| RC-25 | Pack includes dishes, quantities, equipment, and persistent checks. | Shipped operations | Pack route and equipment reader | Walk seeded Pack. |
| RC-26 | Purchases can enter through posted receiving, invoice import, or manual entry. | Shipped purchasing | Purchases and import route families | Verify all three source labels. |
| RC-27 | Receiving supports full, over, short, substitute, missing, and unexpected decisions before posting. | Shipped purchasing | Order receiving workflow | Run mixed receiving scenario. |
| RC-28 | The newest qualifying purchase by purchase date can update current ingredient price. | Shipped invariant | `purchases-current-cost.test.ts` | Backlog an older invoice after a newer purchase. |
| RC-29 | A confirmed price sheet can update catalog price without creating actual spend. | Setup release clarification | Sheet review and costing policy | Confirm ledger total remains unchanged. |
| RC-30 | CostCook separates theoretical food cost, estimated buy cost, and actual purchase spend. | Shipped calculation | Costing policy, order totals, month-cost engine | Reconcile all three values. |
| RC-31 | Physical count resets the inventory baseline; later purchases, waste, and completed Pack consumption move it. | Shipped inventory | `src/lib/core/inventory.ts` | Run movement-series regression. |
| RC-32 | Calculation disclosures identify the inputs and provenance CostCook can prove. | Setup release | Setup disclosures and price provenance service | Verify fallback wording when provenance is incomplete. |
| RC-33 | CostCook uses a real, captioned product walkthrough on the landing page. | Landing proof | `public/demo.mp4`, `SeeItRun.astro` | Reconcile video, transcript, duration, and accessible label. |
| RC-34 | CostCook is sold as one launch subscription per kitchen workspace, managed by the verified owner, with unlimited teammates during launch. | Owner-approved launch model | Subscription launch decision, Better Auth Stripe implementation | Verify pricing, start, checkout, and billing routes against the deployed app. |
| RC-35 | Label printing and external ordering integrations are in development and are not included in the launch subscription. | Owner-approved release boundary | Release flags and subscription launch decision | Verify both features are absent from included lists and clearly marked in development. |

## Claims that are intentionally excluded

Do not add these without a new ledger review:

- Full business margin or profitability. CostCook currently calculates food cost, not labor and overhead margin.
- Fully automatic import or matching. The user confirms uncertain information.
- Production-certified OCR accuracy.
- Guaranteed purchase-order email delivery.
- Fine-grained role-based access across every operational route.
- Automatic repricing of confirmed events.
- Inventory as an infallible live count. Freshness and physical-count state matter.
- “No data entry” or “nothing is re-keyed.” Manual workflows are supported intentionally.
- A promise that every new kitchen can reach a completed order in fifteen minutes.
- A specific price, free trial, billing interval, customer metrics, testimonials, competitor comparisons, or service-response promise without owner-approved evidence.

## Landing-page ownership

| Surface | Claims used |
| --- | --- |
| Hero | RC-01–RC-08 |
| Core loop rail | RC-02, RC-26 |
| Connected chain | RC-02, RC-06–RC-09, RC-26, RC-28 |
| Product walkthrough | RC-33 |
| Guided setup | RC-10–RC-15 |
| Catalog | RC-16–RC-21 |
| Operations | RC-03–RC-08, RC-22–RC-25 |
| Purchases | RC-09, RC-26–RC-29 |
| Calculation trust | RC-04, RC-20, RC-23, RC-30–RC-32 |
| Pricing and start | RC-34, RC-35 |
