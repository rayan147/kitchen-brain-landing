# Story Tracker — One sauce in many dishes (blog how-to)

## My story

- **Piece:** How-to guide (task steps, not a story; see memory "how-to guides are steps")
- **Title / headline:** How to use one sauce in five dishes without costing it five times
- **My hero's name:** The owner of Harbor & Hearth Catering, putting a house aioli on the slider menu
- **Content file(s):** `src/content/blog/one-sauce-many-dishes.md`
- **Evidence:** RC-83 in `docs/release-claim-ledger.md` (kitchen-brain develop 9b84420f4, read 2026-10-12)
- **Schedule:** publishedDate 2026-11-05 (Thursday), order 26. Hidden until then (src/lib/blog.ts).

## The 11 steps

For a how-to, only Steps 1, 2 and 11 shape the page. The beats are not used.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ (n/a for a how-to: numbered steps) |
| 4 | From Beats to Scenes | ☑ (sections: before you start, build once, put it in each dish, change once, fixes, limits) |
| 5 | Character Voices | ☑ (reader: batch, quart, a tablespoon a portion; product: the app's labels) |
| 6 | Writing Dialogue | ☑ (each part turns "five copies" into "one recipe") |
| 7 | Sorkin Dialogue | ☑ (wants: change the aioli once; obstacle: the sauce typed into every dish) |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ (the slider menu, a tablespoon of aioli a portion) |
| 10 | Connecting Your Scenes | ☑ (second person throughout) |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

> A caterer whose house sauce is typed into five dishes, so every price change or recipe tweak means five edits and five chances to miss one.

### Step 2 — Your Character

- **Want:** Change the aioli once and have every dish follow.
- **Need:** The sauce as one costed batch, linked into each dish by the amount a portion gets.
- **Wound:** A quote built on an old sauce cost because one dish's copy never got updated.
- **Flaw:** Copies the sauce's ingredients into each new dish because it's quicker that day.

### Step 8 — Cool Talk (the one snap line)

> "You didn't open a single dish to do it." (after the sauce change re-costs all three dishes by 7 cents each)

### Step 11 — Revise and Finish

- **Kept to the app's words:** "Dishes using this sub re-cost when its lines change.", "Build the batch, then return to add the amount this recipe uses.", "Linked batch. Cost and scaling use this exact amount. Shop and Prep can still round up to whole batches.", "Publishing moves 3 dishes, 1 menu and 1 draft order.", "A confirmed order keeps the costs and quantities it was confirmed with."
- **Path chosen on evidence:** the sauce starts from inside the dish (New sub-recipe under "A sauce or stock made in batches?"). The Recipes page's New recipe window follows the filter the page loaded with, not the Sub-recipes chip just tapped, so that route can open a dish builder.
- **Removed claims:** how a supplier price change displays on each dish (kept to the Sub-recipes list's "on this batch cost"); anything on allergens or nutrition beyond the publish page's sentence; "five dishes" as an example (the shoot used three, and the title keeps the feature page's line).
- **Final image:** three plate costs moved by the same 7 cents from one edit.

### Revision 2026-10-13 (re-shot on local develop fcc651477)

- Every image re-shot from one run on develop fcc651477 (21 crops; was 20). The figures came out the same: aioli $5.36 a qt then $10.07; sliders $2.70, $2.78, $2.85; pulled pork $3.62; shrimp $6.55.
- The Sub-recipes chip then New recipe now opens "New sub-recipe" without a reload, so the Recipes route is offered as a tip with its own screenshot. The dish-first path stays the main path because "Save recipe and return to" brings the cook back to the dish.
- Step 12 no longer assumes version 1: it says "Publish version …" with the dish's next number, and quotes the first-publish wording the app now uses ("This publishes version 1, the first version of this recipe.").
- The sticky working-copy action bar is hidden in the crops, so Add line, Save amounts and the moves panel's dish names are no longer covered.
