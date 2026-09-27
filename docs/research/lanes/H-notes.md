# Lane H notes: Sage

Read-only. Source: `~/kitchen-brain-develop-demo` at `ed6ff5f01` (HEAD = origin/main, checked). Rows are in `H.yaml`.

## Tier counts

| Tier | Rows |
| --- | --- |
| production | 13 (H-01 to H-13) |
| assumed-today | 0 |
| off-page | 2 (H-14 panel redesign, uncommitted in `~/kb-sage-redesign`; H-15 menu-price and supplier-PO drafts, PRD only) |

Caveat on "production": H-01 to H-08 and H-13 are the Sage **agent**. It is on main, but it is switched off unless the deployment sets `SAGE_ENABLED=enabled` (`src/lib/server/sage/config.ts:23`). When the flag is off, `/sage` returns a 404. I did **not** check whether production sets this flag. H-09 to H-12 are the Sage-branded drafting passes. They do not depend on `SAGE_ENABLED`. They need only the import AI key, and the kill switch must not be set.

## Two different things are called "Sage"

1. **Sage the agent** (panel and `/sage`) is a multi-step tool-calling chat.
   - Model: `anthropic:claude-sonnet-5` by default. `SAGE_AI_PROVIDER=google` switches it to `gemini-3.5-flash` (`config.ts:88-92`).
   - It has 22 READ tools and 3 PROPOSE tools (the draft kinds). There are 0 COMMIT tools.
2. **Sage drafts** are one-shot structured calls that run on the *import* pipeline's model: `google:gemini-3.5-flash-lite` by default, `claude-sonnet-5` if `IMPORT_AI_PROVIDER=anthropic` (`src/lib/server/import/provider.ts:96-103`). They cover:
   - ingredient nutrition
   - ingredient allergens
   - recipe allergen and dietary drafts
   - setup food facts
   - yield and conversion estimates

   `SAGE_KILL_SWITCH=stop` turns off both kinds of Sage (`provider.ts:63-74`).

The setup buttons "Build the dish with Sage" and "Build another with Sage" are only links to `/import?kind=recipe`, which is the recipe importer (`SetupRecipesStage.svelte:162,198,248`). The agent is not involved.

## What Sage can change, and who confirms

- **Read tools** run automatically. They write nothing except an audit row.
- **Draft tools** write only a `sage_proposals` row. The real change happens only in `approveProposal` (`proposals.ts:58-138`), which the model cannot call. That function runs only after a person presses the card button, and it re-checks two things first:
  - the person's role
  - a fingerprint of the records the draft was based on. If they changed, the draft is "stale" and nothing is written.
- There are three draft kinds, all MANAGER or above:

| Draft | Approve button | What approving does |
| --- | --- | --- |
| Kitchen shopping list | "Create the shopping list" | Builds the inventory shopping list |
| One order's shopping list | "Save the shopping list" | Saves it to that order |
| Guest count on a draft order | "Change the guest count" | Runs `updateGuests`. The per-guest price stays the same. Any client approval is withdrawn. |

- Every card also has "Discard this draft".
- A staff member sees the card without buttons. It says "This needs a manager. The draft is saved for one of them to review."

## Limits

These are in `config.ts:69-78`:
- 8 steps and 60 s per run
- questions up to 2,000 characters; answers up to 2,000 output tokens
- 3 runs at once per kitchen
- 60 runs per user per hour
- 1.5M tokens per kitchen per day
- each tool returns at most 25 rows

What Sage does not do:
- no memory across threads
- no links in its prose (the app attaches source links to the cited records)
- no sales (Square) data
- no labels
- no customers, events, proposals, contracts or customer invoices. None of the tools reach front of house.

Conversations are shared by the whole kitchen, not private to one user. Answers that used records only a manager may read are redacted for staff.

## What the stub/fake providers leave empty (localhost only)

- **Agent**, `SAGE_AI_PROVIDER=fake` (`provider.ts`): it picks the right tool from keywords, but its final text is a fixed sentence such as "I checked the kitchen attention list and the records behind it." There are **no figures in the prose**. The only evidence it produces is the source list. If a question matches nothing, it replies "I checked the CostCook records available to this kitchen."
- **Drafts**, `IMPORT_AI_PROVIDER=stub`:
  - The allergen and trait classifier returns `unknown` for every item, so "Draft with Sage" drafts nothing.
  - The nutrition estimate returns only calories 100 kcal and protein 10 g per 100 g ("Stub estimate for review.").
- Consequence: section 8 of the brief says to use the real provider for any Sage capture or spot-check, and that is necessary. Captures made with the fake would show answers with no numbers in them.

## Evidence sources used

- `e2e/sage.spec.ts`: 30 tests (lines 38 to 871) and `e2e/import-sage.spec.ts:14`.
- `docs/qa/workflow-paths/inventory.json` lists `/sage` (page) and four endpoints: `/sage/api/{chat,panel,proposal,thread}`. The thread endpoint is covered only by a unit test.
- There is no `sage-panel` regression-workbook case on develop. It exists only uncommitted in `~/kb-sage-redesign`. The develop cases that mention Sage are `ingredients`, `ingredient-detail-redesign`, `first-run-setup`, `recipe-detail-actions` and `inquiry-to-signing-usability`.
- PRD context: `docs/prd/sage-capabilities-prompt.md` (rulings, and section 7 "Not in scope").

## For the gap report: the landing is stale on Sage

- `src/lib/faq.ts:186` says "eleven read-only checks" and that "the one thing it can prepare [is] a shopping-list proposal". The app now has **22 read tools and 3 draft kinds**: the kitchen shopping list, one order's shopping list, and a guest-count change.
- `src/lib/sage.ts:24,46` says "twelve tools" and "Eleven read tools and one approval-bound proposal".
- Newer read tools that no landing copy mentions:
  - order money
  - menu margin
  - spending by supplier and month food cost
  - price impact
  - ingredient explain
  - checking whether the day has room for another order (`checkDayRoom`)
  - prep for a date
  - list check-off progress
  - likely leftovers
  - ordering site status
- Wording: in the app UI a Sage draft is a "draft" ("Draft shopping list", "Discard this draft"). The landing's FAQ says "Sage shopping proposals", which collides with the client **Proposal** (#501). The landing should say "draft".
- Sage drafts also appear on ingredient and recipe screens (H-09 to H-12). If the landing mentions them, it must keep the "estimate, not confirmed until you confirm" framing.

## Open questions for the owner

1. Is `SAGE_ENABLED=enabled` set in production (and on the trial/demo instance)? If it is not, H-01 to H-08 and H-13 are shipped code that customers cannot reach, and the landing's claim that Sage "is available now" (faq.ts:187) is false.
2. Which model runs in production for the agent (Claude Sonnet 5 by default, or Gemini)? And for the drafting passes (Gemini Flash Lite by default)? Is the import AI key set, so that "Draft with Sage" is visible at all?
3. Does a trialing kitchen pass `subscriptionAccess.canUseProduct`? The Sage chat is refused when it does not ("Sage needs an active subscription.").
4. The redesign in `~/kb-sage-redesign` (greeting, structured answers, feedback, conversation search) has 40 uncommitted files. Does it merge today? I tiered it off-page.
5. PRD ruling 1 was reopened. Sage keeps order, menu and spending money MANAGER-only, while the order money bar shows it to every role. Which way did the owner decide?
