# Lane I notes: setup, team, integrations, billing

Source checkout: `~/kitchen-brain-develop-demo`, HEAD `ed6ff5f01` = `origin/main` (checked 2026-09-27).
Rows, plan matrix, roles, internal routes, unmerged branches and terms are in `I.yaml`.

## Counts

| Tier | Rows |
| --- | --- |
| production | 14 (I-01 to I-12, I-16, I-17) |
| assumed-today | 0 |
| off-page | 3 (I-13 Square publish, I-14 Square sales, I-15 QuickBooks), all merged on main but unusable live |

## The chain a new owner walks

`/start` "Start your kitchen" → email link → `/settings/billing?welcome=1` "Add card and start trial" (Stripe Checkout, $0 today) → "Your free trial is active. Next: set up your kitchen." → `/setup` (welcome questions and five stages) → "Your kitchen is ready" → "Open shopping list" (lane D).
The app counts this as "Step 1 of 3 / 2 of 3 / 3 of 3" (`src/lib/features/onboarding/journey.ts:16-20`).

## Findings that matter for the landing

1. **One plan, no tiers.** "CostCook Launch" costs $49 USD per kitchen per month, with a 15-day trial and unlimited teammates (`src/lib/server/billing/plan.ts`, `docs/billing.md`). No feature is gated by plan. Instead, access runs through four layers:
   - the subscription, which blocks the whole kitchen, and only when `BILLING_ENFORCEMENT=enforce`;
   - per-kitchen release flags, all off by default;
   - environment flags;
   - roles.
2. **Square and QuickBooks do not work for a live customer.** Both integration environments go through `sandboxOnly()`, which throws "Live … credentials are not wired yet." (`src/lib/server/integrations/config.ts:17-28,76-78`). The app says so itself: "Currently test mode only." and "Square Sandbox · test only". I tiered them off-page even though the code is on main.
3. **The in-app plan card over-promises.** It lists "Square and QuickBooks sync", "Label printing" and "Online ordering" as included (`src/lib/components/settings/BillingPlanCard.svelte:279-287`). The first is Sandbox-only, and the other two depend on flags that default off. The landing should not copy this list.
4. **Label printing is less gated than the flag name suggests.** `label_printing` hides only the `/settings/labels` screen. Printing from prep and pack reads the saved settings, and the only output is the browser print dialog.
5. **Roles.** There are three roles: Owner, Manager and Staff.
   - Every invite joins as Staff, and the app has no way to change a role.
   - Staff see only Notifications in Settings. They cannot see clients or mark an order paid.
   - Anything touching money or integrations is owner only.
   - Any landing claim about "managers" needs to match how a manager actually gets created.
6. **Notifications are email only**, sent either "Right away" or "In the daily summary". Which kinds a person can receive depends on their role.
7. **Outgoing webhooks** are signed, can be replayed and have a test button, but they sit behind the `ordering_integration` flag. The page is developer-facing.
8. **App bug, not a landing issue.** The setup completion card says "Delete the sample in Team settings" and links to `/settings/team`. Sample deletion actually lives at `/settings/sample-data` (`SetupCompletionSummary.svelte:108-109`).

## Section 5 additions (terms)

| Term | In the app | Must not be confused with |
| --- | --- | --- |
| Kitchen / workspace | "kitchen" in owner copy; "workspace" in refusals and integration cards; Business in CONTEXT.md | a location (multi-unit is off-page) |
| Subscription | CostCook's own Stripe charge (Better Auth Stripe plugin) | client deposits and balances (Stripe Connect on the ordering site); Square is never a client-payment path |
| Set up your kitchen | UI name for First-Run Setup | Sample data; Concierge Onboarding is the same workflow, assisted |
| Sample data | example records beside the real ones, which can be removed after a review | CONTEXT.md Demo Instance |
| "In development" badge | integration flag is off for this kitchen | "Available" Square/QuickBooks, which are still Sandbox |

## Routes deferred to other lanes

- `/settings/booking` and `/settings/contracts` go to A.
- `/settings/ordering/site` and the partner-keys half of `/settings/ordering` go to C.
- `/settings/vendors`, `/settings/vendors/[id]/timing` and `/settings/invoice-inbox` go to F.
- The webhooks half of `/settings/ordering` is I-16. Merge it with lane C's row so it is not counted twice.

## Branch check

- `hotfix/stage-integration-diagnosis` (`~/kb-stage-diagnosis`):
  - All 4 commits are already on origin/main as 224b89d78 and 85f56f3a7, found by `git cherry` and subject match.
  - The working tree is clean.
  - It rewords the Square/QuickBooks connection status and is production, so nothing is assumed-today from it.
- Of the 190 branches not merged into origin/main, those with real unique caterer-facing work are:
  - the two named assumed-today branches;
  - the multi-unit series 485 to 490 (operating units, per-unit roles, commissary, transfers, consolidated reporting);
  - `feat/ezcater-order-intake`;
  - `feat/purchase-order-email-workflow`;
  - `design/client-to-order-guidance`;
  - `feat/order-shelf-prompt-20260730`;
  - `feat/popovers-and-walkthrough-fixes-20260729`.
- Branches from July that show unique commits are marked "likely-superseded". I did not check them commit by commit.

## Open questions for the owner

1. What are production's values for `BILLING_ENFORCEMENT`, `FEATURE_LABEL_PRINTING_ENABLED`, `FEATURE_ORDERING_INTEGRATION_ENABLED`, `SETUP_SAMPLE_DATA_ENABLED`, and any `business_feature_overrides` rows? These decide whether labels settings, the ordering site and webhooks are live for a new trial.
2. How does someone become a Manager today, given there is no role-change control? Should the landing mention managers at all?
3. When will live Square and QuickBooks credentials be wired? Until then, should the in-app plan card keep saying "Square and QuickBooks sync"?
4. Stripe checkout sends `seats: 1` while the docs say unlimited teammates. Please confirm the Stripe price is not per seat.
5. Is `LAUNCH_PRICE_DISPLAY` set in production to anything other than $49/month?

Not done in this lane: running the app in a browser (the section 8 spot-checks belong to the merge step).
