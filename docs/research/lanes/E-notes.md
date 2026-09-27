# Lane E notes: recipes and menus

Research only. The rows are in `E.yaml`. The production code is `~/kitchen-brain-develop-demo`. On 2026-09-27, `HEAD`, `origin/main` and `origin/develop` all equal `ed6ff5f0130f…`.

## Tier counts

| Tier | Rows |
| --- | --- |
| production | 22 (E-01 to E-22; E-14, E-16, E-17, E-19, E-20, E-21 and E-22 overlap lanes D, F and I) |
| assumed-today | 0 |
| off-page | 4 (E-23 to E-26) |

## How the assumed-today check was done

I ran `git diff --name-only ed6ff5f01` and `git status --porcelain` on each worktree, then filtered for `catalog|recipe|menu|allergen|nutri|dietary`:

- **kitchen-brain-proposal-build**: it touches only the proposal-builder components (`proposals/builder/MenuChangeNotice.svelte`, `ChargeRowMenu.svelte`) and workbook cases. Those belong to lane A. No `/catalog` change.
- **kb-client-payment**: no menu or catalog files. Its 4 commits and working tree cover payments only.
- **kb-stage-diagnosis**: its merge base (`fe4b4905`) is older than main, so a plain diff lists many catalog files. Those files are drift, not changes on this branch. Its own 4 commits (`git diff $(merge-base) HEAD`) touch only integrations copy, plus one line on the Square catalog page ("CostCook could not reach Square just now…"). That page belongs to lane I, so nothing in lane E changes.

So every lane-E surface is production as it stands on main.

## Unmerged branches (`git branch --no-merged origin/main`, filtered)

- `feat/487-shared-catalog-overrides-v2` is the one caterer-facing unmerged branch. It carries 13 commits: multi-unit, operating units, a shared catalog with local prices, and #485–#487. I recorded it as off-page row E-23.
- `feat/446-labels`, `feat/253-…`, `feat/256-…`, `chore/231-…`, `feat/ingredients-recipes`: each has 0 commits in `git cherry`. Their content is already on main.
- `feat/335/336/337-catalog-*`, `feat/117/118/138/162-shelf-check*`, `feat/order-shelf-prompt-20260730`, `qa/catalog-audit-final`, `refactor/181`, `refactor/184`: all are July-era. Main has since shipped `/catalog` ("Kitchen records") and the shelf check. The unmerged commits are docs, CI or superseded work. I'm treating them as stale, not as features.

## What the output is and is not (plain limits for marketing)

**Recipes and cost**

- Cost is theoretical: current pack prices × AP quantity (trim and cooking loss charged) + one business-wide misc %. A missing price or conversion is never zero. The screen says the cost is incomplete and links to the fix.
- Food cost is food only. Packaging, rentals and labour are not included (CONTEXT "Food only").

**Versions**

- Editing a live recipe opens draft changes. The kitchen keeps cooking version N until the owner reviews it on `/publish` and publishes. That page lists what the change reaches (dishes, menus, draft orders). Confirmed orders never change.
- The first save of a brand-new recipe records version 1 directly with "Save recipe". Only later versions go through `/publish`.
- Readiness can block a publish. Restoring an old version never publishes it.

**Kitchen sheet**

- Reads the published version only.
- Scales to the soonest confirmed order.
- Progress (ticks, timers) lives in that device's browser storage. It is not shared between devices or with the prep list.

**Allergens**

- The list is fixed at the US nine (`drizzle/0034`). There is no custom-allergen path.
- Recipe allergens are derived from confirmed ingredient facts, including through sub-recipes. Unreviewed means unknown, never free-from.
- The matrix and label both say so in print ("a blank … does not mean free from"; "This is not an allergen-free claim.").

**Diets**

- There are five: Vegetarian, Vegan, Halal, Kosher, Gluten-free.
- Halal meat and kosher meat-with-dairy can only ever read "check".
- "Detects, never certifies" appears only in a code comment (`guards.ts`), not in UI copy. Do not quote it as product text.

**Nutrition**

- Values come from USDA FoodData Central matches or Sage drafts. A person confirms each source.
- The label is a "Calculated estimate", with the line "This estimate is not a claim of retail-label regulatory compliance." The ingredient statement says it is "not a regulatory weight-order claim".
- A missing value prints as a dash and is never counted as zero.
- The basis can be per serving, per batch or per 100 g.
- A recipe that has never been saved cannot print a label (409).

**Guest restrictions**

- Stored per order in `order_guest_restrictions`.
- Frozen at confirm. "Re-check" appends a new reading.
- Outcomes are conflict, check or clear. Unknown never counts as clear.

**Menus**

- Dishes × portions per guest, cost per guest, a selling price per guest and an equipment template.
- Equipment quantities do not scale with guests.
- The menu price is the starting price for new orders. Totals are hidden when any price is missing.

**Imports**

- Recipes can come from photos, PDF, DOCX, CSV/XLSX, pasted text or a link.
- Everything is a staged draft that a person confirms ("Create recipe" / "Import reviewed recipes").
- Recipe CSV import is capped at 1 MB. Only headers and sample rows go to the reading service.

**Station**: used for filtering and printed on the sheet. The prep list does not group by it (UI says so).

## Gates

- **Plan**: there is one Launch plan and no feature entitlements (`docs/billing.md`).
- **Release flags**, both default off with a per-business override (`src/lib/server/features/access.ts`):
  - "Print container label" (E-19) needs `label_printing`.
  - "Publish to Square" (E-20) needs `square_integration` plus a Square connection.
- **Roles**:
  - Owner only: publish, discard, archive and restore; accept learned yield and prep estimates (`[id]/+page.server.ts:472`).
  - Owner or manager: prices and allergen overrides.
  - Staff: can read, file, scale and use the kitchen view.

## Terms and drift worth flagging (not resolved here)

- **Draft vs working copy.** CONTEXT says a working copy must not be called "draft". The UI says "Save draft", "Draft changes: not live yet", "Restore version N as draft" and "Discard draft changes".
- **Readiness.** CONTEXT says it is not a completeness score. The detail page reads "Ready to serve and sell: N of 6 done".
- **Vocabulary.** The UI calls the catalog "Kitchen records" and the recipe list "the book". Shelves are removed with "Take down", which sits beside Archive, Delete and Remove.
- **Menu.** The word covers three different things: the internal catalog menu (lane E), the event menu (`/events/[id]/menu(s)`, lane A) and the Menu Publication on the storefront (lane C).
- **Stale inventory.** `docs/qa/workflow-paths/inventory.json` lists no e2e coverage for `/import/recipe-csv`, but `e2e/recipe-csv-import.spec.ts` exists.

## Open questions for the owner

1. Are `label_printing` and `square_integration` on for paying businesses today? If not, E-19 and E-20 stay off the landing.
2. Does production have USDA FoodData Central and the AI provider configured? Without them, nutrition suggestions, Sage allergen drafts and recipe extraction are empty or manual.
3. Can the landing say "nutrition label" at all, given the on-label disclaimer? Or should it say "nutrition estimate"?
4. Is multi-unit (`feat/487-…-v2`) planned to merge? It stays off-page for now.
5. Should the UI's "draft" wording for working copies be kept? The landing should follow the UI, not CONTEXT.
