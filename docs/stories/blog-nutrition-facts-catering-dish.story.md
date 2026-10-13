# Story Tracker — Nutrition facts for a catering dish (blog how-to)

## My story

- **Piece:** How-to guide (task steps, not a story)
- **Title / headline:** How to get nutrition facts for a catering dish, and where they stop
- **My hero's name:** The owner of Harbor & Hearth Catering, asked how much protein is in the polenta
- **Content file(s):** `src/content/blog/nutrition-facts-catering-dish.md`
- **Evidence:** RC-84 in `docs/release-claim-ledger.md` (kitchen-brain develop 9b84420f4, read 2026-10-12)
- **Schedule:** publishedDate 2026-11-12 (Thursday), order 27. Hidden until then (src/lib/blog.ts).

## The 11 steps

For a how-to, only Steps 1, 2 and 11 shape the page.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ (n/a for a how-to: numbered steps) |
| 4 | From Beats to Scenes | ☑ (before you start, get the panel, where it stops, fixes, limits) |
| 5 | Character Voices | ☑ (reader: portion, package, the polenta; product: the app's labels) |
| 6 | Writing Dialogue | ☑ (each step turns "Draft" into "confirmed" or a named blank) |
| 7 | Sorkin Dialogue | ☑ (wants: a number for the client; obstacle: blanks it can't fill) |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ (a client asking about the polenta) |
| 10 | Connecting Your Scenes | ☑ (second person throughout) |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

> A caterer asked for the nutrition of a dish, who has ingredient numbers from USDA and packages but doesn't know which lines they can trust or why some stay blank.

### Step 2 — Your Character

- **Want:** A nutrition panel for the dish to send the client.
- **Need:** To know which lines are real and which are unknown, before anyone reads a dash as a zero.
- **Wound:** A spreadsheet total that quietly counted missing values as nothing.
- **Flaw:** Wants a complete-looking label more than a true one.

### Step 8 — Cool Talk (the one snap line)

> "Four dashes: four lines nobody has a number for yet." (the label preview caption; was seven before the 2026-10-13 re-shoot)

### Step 11 — Revise and Finish

- **Kept to the app's words:** "A blank means unknown, never zero", "Is this the same food and preparation you use?", "Draft estimate. Not ready to print.", "Confirm none only if you know no sugars were added.", "Confirm every real source and fill the blank label lines before printing."
- **Removed claims:** any compliance or certification; per-batch panels (not seen on screen); that USDA search works out of the box.
- **Found while shooting:** the matching dialog's "how recipes weigh it" step needs USDA search, which this local build couldn't run, so that step is not a numbered step. Print label is greyed out, not hidden, while lines are blank.
- **Final image:** a label with honest dashes, and the packages that fill them.

### Revision 2026-10-13 (re-shot on local develop f38ea126e, live USDA key)

- The old flow is gone: a USDA source with no weigh answer no longer offers a Confirm that changed nothing. It offers "Answer how recipes weigh it", which opens the ingredient's Match nutrition window (step 1: the food in use is preselected; step 2: Raw, as bought or Cooked, the values per 100 g, Use this source) and brings the cook back to the recipe with "Nutrition matched for <ingredient>." The guide's steps 3 to 9 walk that window; "Is this the same food and preparation you use?", "Yes, confirm" and "Pick another" are no longer quoted.
- Shot with a real USDA key in one run on a fresh copy, so nothing was written into the sample database by hand. For the cremini the app searches USDA's "crimini" itself ("Try “crimini” for “cremini”. Check the food and form before saving."); the fuller "Mushrooms, brown, italian, or crimini, raw" (14 of 15 values) was picked, as the app's warning on the food in use steers ("Labels would be mostly blank."), with "No added sugars (0 g)" for raw mushrooms.
- Before any weigh answer, each total reads "Blank until you answer how recipes weigh 4 ingredients".
- The panel now reads 530 kcal, 19 g fat, 18 g protein, 78 g carbs with "Draft · 4 label lines blank" (was 77 g carbs and seven blank lines). The snap line changes with it.
- New fix entry: "Nutrition search could not be loaded. Try again." (text only).
- 18 crops (was 12). Dialog crops were taken with the dialog's sticky footer unstuck.
