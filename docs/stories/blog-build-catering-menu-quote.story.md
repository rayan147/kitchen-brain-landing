# Story Tracker — Build a catering menu and quote from your recipes (blog how-to)

## My story

- **Piece:** How-to guide (task steps, not a story; see memory "how-to guides are steps")
- **Title / headline:** How to build a catering menu and quote from your recipes
- **My hero's name:** The owner of Harbor & Hearth Catering, pricing a 120-guest wedding
- **Content file(s):** `src/content/blog/build-catering-menu-quote.md`
- **Evidence:** RC-86 in `docs/release-claim-ledger.md` (kitchen-brain develop 9b84420f4, read 2026-10-12)
- **Schedule:** publishedDate 2026-11-19 (Thursday), order 28. Hidden until then (src/lib/blog.ts).

## The 11 steps

For a how-to, only Steps 1, 2 and 11 shape the page. The beats are not used.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ (n/a for a how-to: numbered steps) |
| 4 | From Beats to Scenes | ☑ (sections: before you start, build the menu, quote one event, fixes, limits) |
| 5 | Character Voices | ☑ (reader: a head, chafers, the count; product: the app's labels) |
| 6 | Writing Dialogue | ☑ (each step turns a guess into a priced number) |
| 7 | Sorkin Dialogue | ☑ (wants: a price that holds; obstacle: costs that move after the yes) |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ (the client waiting on a number) |
| 10 | Connecting Your Scenes | ☑ (second person throughout) |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

> A caterer with recipes already costed who needs to turn them into a per-guest price for an event, and to keep that price once the client agrees, but who builds quotes in a spreadsheet that never matches the kitchen.

### Step 2 — Your Character

- **Want:** Send a per-guest number today.
- **Need:** A number built from the recipes the kitchen will cook, held after the yes.
- **Wound:** A quote that looked fine, then lost money when the dressing came out of a whole batch and the produce went up.
- **Flaw:** Prices from last year's menu instead of today's costs.

### Step 8 — Cool Talk (the one snap line)

> "$9.20 a guest on the menu, $9.50 on the order: the vinaigrette is made in whole batches."

### Step 11 — Revise and Finish

- **Kept to the app's words:** "Selecting a menu fills in its current per-person price", "Changes apply to new orders only", "Charge at least", "Confirming locks quantities and prices, and starts shopping, prep and pack", "Locked when confirmed. Reopen as draft to change the price."
- **Corrected from the code (detail-view.ts):** Confirm order is blocked by an over-target price ("Fix the price") and by unreviewed allergens; guest restrictions and the customer are optional on a plain order.
- **Removed claims:** what reopening does to prices or when it is refused (not exercised); the owner's confirm-anyway override (not exercised).
- **Final image:** the agreed price next to today's cost, with the gap named.

## Revision 2026-10-13 (re-shot on local develop f38ea126e)

- Every image re-shot from the fixed app; 19 figures, same filenames.
- Step 6 and m-06 now include the menu builder's new line: "An order counts whole batches of this menu's bases, so its cost per guest can come out higher." The Part 2 paragraph ties the $9.20 to $9.50 difference back to that warning, so the snap line now pays off a warning the reader already saw.
- q-06 alt text follows the order panel's fuller whole-batch sentence (which batch, how many for how much needed).
- The sample kitchen lists 17 menus (was 18).
- Second pass the same day on local develop f38ea126e: all 19 images re-shot. The figures held ($9.20, Use $30.67, $9.50, $31.67, 29.7%), and no order title is inside a crop, so the text stands.
