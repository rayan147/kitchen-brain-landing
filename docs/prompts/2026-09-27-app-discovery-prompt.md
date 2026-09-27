# Prompt: discover every CostCook feature and workflow (2026-09-27)

Paste everything below the rule into a fresh session started in
`/home/rayan147/kitchen-brain-landing`. It is research only: it writes an
inventory and a gap report, and changes no app code and no landing page.

---

## Role and goal

You are auditing what CostCook actually does today so the marketing site can be
rebuilt around the real product. The landing site (this repo) still describes
"back-of-house software for small caterers": order, shop, prep, pack and food
cost. The app (`~/kitchen-brain`) has since grown a full front-of-house event
workflow and several other areas. Find **every** feature and workflow a caterer
can use. Record each one with evidence. Then compare the list with what the
landing site says.

You are finished when the three output files in section 7 exist, every row has
evidence, and nothing in section 5 is unresolved.

## 0. Required skills and working rules

- Load `normal-ui-workflow-audit` (workflow, screen, frame and action modelling)
  and `design-patterns`. Also load `story-content`, but only to read the landing's
  existing `docs/stories/*.story.md` trackers. You will write **no**
  prospect-facing copy in this task.
- Work in a new landing worktree, `git worktree add .gitworktrees/app-discovery-0927 -b research/app-discovery-0927 develop`.
  The primary landing checkout has uncommitted PNGs and `scripts/capture-proof.mjs`.
  Do not touch them.
- Never run `git clean -xdf` in either repo, because it deletes `.gitworktrees/`.
- Treat kitchen-brain as read-only. Do not commit to, rebase or check out branches
  in any of its worktrees.
- Glossary: `kitchen-brain/CONTEXT.md`. **Line 3's product summary is out of date**
  ("Back-of-house costing and order-scaling tool"). Use CONTEXT.md for term
  definitions only, never as a description of the product's scope.
- Never write "Kitchen Brain" as a product name. Use CostCook.

## 1. What counts as "shipped"

| Tier | Meaning | Where to read it |
| --- | --- | --- |
| **production** | Live for customers | `origin/main` (on 2026-09-27, `main` = `develop` = `release` = `ed6ff5f01`; re-check with `git fetch && git rev-parse origin/main origin/develop`) |
| **assumed-today** | In flight, and the owner says it merges today | the two worktrees listed below |
| **off-page** | Built on a branch but not merging today, or described in a PRD but not built | anything else |

Read production code in `~/kitchen-brain-develop-demo`, which has `develop`
checked out. Confirm that its HEAD equals `origin/main` first.

**Assumed-today set.** Read the *working tree* of each, not just its commits:

1. `~/kitchen-brain-proposal-build`, branch `feat/proposal-build-20260926`.
   This is the one-page proposal builder. It has 7 commits and 23 uncommitted
   changes, and it **deletes** `ProposalEditor.svelte` and `ChargeFields.svelte`.
   Describe `/events/[id]/proposal` as it looks in this worktree, not as it looks
   on develop.
2. `~/kb-client-payment`, branch `feat/client-payment-booking-loop`.
   A proposal states its deposit and balance, and an accepted proposal's terms
   reach the order that collects them. Plan:
   `docs/*/…client-payment…` inside that worktree.

Also check `~/kb-stage-diagnosis` (`hotfix/stage-integration-diagnosis`,
4 commits). Classify it as assumed-today only if it changes something a
caterer can see.

**Off-page unless the owner says otherwise:** `feat/ezcater-order-intake`,
`feat/ordering-integration` (12 commits unmerged), and
`feat/purchase-order-email-workflow`. Before you finish, run
`git -C ~/kitchen-brain branch --no-merged origin/main` and classify every
branch whose name mentions a caterer-facing area.

## 2. Sources, in this order

Start from the inventories that already exist. Use the route tree only as a
cross-check.

1. `docs/qa/workflow-paths/inventory.json`: the canonical list of workflow paths.
2. `apps/regression-workbook/catalog/cases/*.json`: one case per workflow,
   with steps.
3. `e2e/*.spec.ts`: what is proven end to end. Cite the spec file as evidence.
4. The `qa/full-workflow-walk*` worktrees (`~/kb-qa-suites`,
   `~/costcook-workflow-qa`): the most recent full walks.
5. PRDs: `docs/prd/front-of-house/00–11`, `docs/prd/booking-capacity/00–12`,
   `plans/front-of-house-inquiry-to-invoice.md`, and `docs/feature-demo.md`.
   A PRD **proves nothing is built**. Mark each PRD item built, partial or
   not built, with the code location. Customer invoices, BEO, staffing,
   delivery dispatch and route optimization are especially likely to be
   PRD-only.
6. `docs/billing.md` and `/settings/billing`: which features each plan tier
   unlocks.
7. The route tree: `find src/routes -name '+page.svelte'`. Every route must
   end up on some workflow row or on an "internal / not for marketing" list
   that gives a reason.

## 3. Lanes

Run these as parallel sub-agents (Explore, "very thorough"), one lane each.
Each lane returns rows in the schema in section 4.

| Lane | Scope (routes and areas) |
| --- | --- |
| **A. Front of house: events** | `/events`, `/events/new`, `/events/[id]` and its `menu`, `menus`, `proposal`, `proposal/preview`, `proposal/send`, `proposal/update`, `decision`, `contract`, `contract/preview`, `contract/signing`, `agreement`; the client-facing offer page `/proposals/[businessId]/[offerId]`; deposit, booked and balance; `/calendar`; `/settings/booking` and `/settings/contracts`; event PDF. Walk the full inquiry → booked chain. |
| **B. Customers** | `/customers`, `/customers/[id]`, `/customers/duplicates` and `merge`, and the order history for each client. |
| **C. Online ordering and requests** | `/o/[token]`, `/settings/ordering` and `ordering/site`; request → **Approval** → **Payment Window** → deposit and balance (booking-capacity PRD 03, 08, 12); capacity and day verdict; closed dates. |
| **D. Order to van** | `/orders` (list, week, batch, new), and `/orders/[id]` with `prep`, `pack`, `receiving`, `closeout`, and purchase-order print; `/todo` and Today; `/labels/print`; shopping list. |
| **E. Recipes and menus** | `/catalog/*` including revisions, working copy, readiness, collections, shelves, allergen matrix, nutrition label, facts review, publish and print; menus. |
| **F. Buying and invoices** | `/purchases/*` (inbox, invoices, reconcile, price-impact, prices, follow-up, receiving), `/import/*`, `/ingredients/*`, `/settings/invoice-inbox`, and `/settings/vendors`. |
| **G. Numbers** | `/analytics` (food-cost, prices, sales, spending), closeout food cost, and what the Today screen reports. |
| **H. Sage** | `/sage` and the Sage panel. List each tool Sage can call and each thing it can draft. Note the limits, and note what the stub AI provider leaves empty. |
| **I. Setup, team, integrations, billing** | `/start`, `/setup`, `/settings/*` (team, integrations: Square catalog and sales, QuickBooks; notifications, labels, costing, sample data), `/access`, plan tiers, and webhooks. |

## 4. Row schema (one row per workflow, not per route)

```yaml
- id: A-03
  lane: A
  workflow: "Send a proposal and get the client's decision"   # verb-first, in caterer words
  job_to_be_done: "Get a yes and a deposit without chasing email"
  actors: [owner, manager, client]        # who touches it; the client counts
  routes: [/events/[id]/proposal/send, /proposals/[businessId]/[offerId], /events/[id]/decision]
  entry: "Events > <event> > 'Send proposal'"   # exact button labels from the source
  done_marker: "the exact text or state the app shows when the job is done"
  hands_off_to: A-04                       # the next workflow in the chain
  tier: production | assumed-today | off-page
  evidence: ["e2e/proposal-offers.spec.ts", "src/routes/…:line"]
  plan_gate: "which plan unlocks it (Launch / …), or none"
  limits: ["what it does NOT do, stated plainly"]
  glossary_terms: [Proposal, Acceptance, Agreement]
  capture_worthy: yes/no, plus the one frame worth showing
```

Quote button labels and done markers from the source code, never from memory.
If a label is only in a worktree, say which one.

## 5. Terms to resolve (do not guess)

Fill in this table from code and CONTEXT.md:

| Term | What it means in this app | Must not be confused with |
| --- | --- | --- |
| Invoice (unqualified) | the **supplier** invoice | customer invoice or receivable (client money) |
| Acceptance (#501) | a client accepting a proposal | Approval (#512) |
| Approval (#512) | the kitchen approving an online order request | booking; "approved" ≠ confirmed |
| Booked | the owner books the event; the deposit is evidence, not the trigger | paid |
| Deposit / balance | held on the event-linked **order**, not on the event | subscription billing |
| Payment processor for client money | **pin it down**: Stripe Connect, Square, or both, and for which path | CostCook's own subscription (Stripe platform account) |

Add every other term a lane runs into that the landing uses differently from
the app.

## 6. Compare with the landing site

Read every page in `src/pages` (the homepage sections in
`src/components/sections/*`, all 14 `features/*` pages, `compare`, `pricing`,
`tour`, `demo`, `who-its-for`, `faq`, `onboarding`), plus `src/lib/site.ts`,
`docs/release-claim-ledger.md`, and `scripts/check-landing-claims.mjs`.
Produce four lists:

1. **Gaps.** The app does it (production or assumed-today) and the landing
   never mentions it. Rank by how often a caterer would use it (weekly beats
   yearly) and by how much it would move a skeptical owner-operator.
2. **Stale claims.** The landing describes something that has changed. For
   example, `features/menus-and-quotes` compared with the proposal builder,
   or `compare` rows that now undersell the app.
3. **False-by-omission limits.** The landing says "we don't do X", or lists X
   as coming, but X is now shipped. Search for "coming", "not yet", "planned"
   and "roadmap".
4. **Wording drift.** The landing uses a word the app no longer uses, or uses
   a term from section 5 the wrong way.

For every gap, name the landing surface that should own it (an existing page
or section, or "new page needed") and the capture it would need.

## 7. Outputs (in the discovery worktree)

1. `docs/research/2026-09-27-app-inventory.yaml`: every row from section 4,
   plus an `internal_routes:` list that gives a reason for each route left out.
2. `docs/research/2026-09-27-app-inventory.md`: the human-readable version,
   containing:
   - a one-screen **workflow map** of the whole product, in the order a
     caterer meets it (inquiry → proposal → signed → deposit → booked → order
     → shop → prep → pack → deliver → closeout → numbers), with side loops for
     buying, recipes and ordering site;
   - the section 5 terms table;
   - the count of rows per tier;
   - open questions for the owner.
3. `docs/research/2026-09-27-landing-gap-report.md`: the four lists from
   section 6, plus a proposed update to `docs/release-claim-ledger.md` (as a
   diff, not applied).

## 8. Verification before you finish

- Every route from the route tree appears on a row or in `internal_routes`.
- Every production or assumed-today row cites at least one spec or code line
  that you opened.
- Spot-check five rows in the running app. Stand up `kitchen-brain-develop-demo`
  with the E2E env; the port and steps are in `scripts/capture-setup-proof.mjs`.
  Use the **real** AI provider for any Sage row. For the proposal builder,
  run the `kitchen-brain-proposal-build` worktree instead.
- Do not describe anything as done, correct or complete unless the app says
  so itself.
- Report back: the tier counts, the top 10 gaps, and every open question.
