# Story Tracker — Print the recipe sheet your kitchen cooks from (blog how-to)

## My story

- **Piece:** How-to guide (task steps, not a story; see memory "how-to guides are steps")
- **Title / headline:** How to print the recipe sheet your kitchen cooks from
- **My hero's name:** The owner of Harbor & Hearth Catering, whose cooks work from a sheet on the wall
- **Content file(s):** `src/content/blog/print-recipe-sheet.md`
- **Evidence:** RC-88 in `docs/release-claim-ledger.md` (kitchen-brain develop 9b84420f4, read 2026-10-12)
- **Schedule:** publishedDate 2026-11-26 (Thursday), order 29. Hidden until then (src/lib/blog.ts).

## The 11 steps

For a how-to, only Steps 1, 2 and 11 shape the page. The beats are not used.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ (n/a for a how-to: numbered steps) |
| 4 | From Beats to Scenes | ☑ (sections: before you start, write and publish, print, change it later, fixes, limits) |
| 5 | Character Voices | ☑ (reader: the sheet on the wall, the cook; product: the app's labels) |
| 6 | Writing Dialogue | ☑ (each part turns "which sheet is right?" into "this version, live since") |
| 7 | Sorkin Dialogue | ☑ (wants: one sheet the crew trusts; obstacle: edits and old printouts drift apart) |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ (the sheet taped by the stove) |
| 10 | Connecting Your Scenes | ☑ (second person throughout) |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

> A caterer whose cooks work from printed recipes that drift from what's in the system, who wants one sheet the kitchen can trust and a way to change the recipe without confusing the line.

### Step 2 — Your Character

- **Want:** A clean sheet for Saturday's 150.
- **Need:** A published version the kitchen cooks from, and edits kept private until they're ready.
- **Wound:** A cook following last month's printout after the recipe changed.
- **Flaw:** Edits the recipe in place and reprints whenever, so nobody knows which sheet is current.

### Step 8 — Cool Talk (the one snap line)

> "Version 1, live since Oct 12." (the printed sheet's own top line: the sheet says how old it is)

### Step 11 — Revise and Finish

- **Kept to the app's words:** "Start working copy", "The kitchen keeps cooking the saved recipe until you publish the changes", "Quantities stay on the line, so scaling reaches the method instead of the prose", "Confirmed orders always keep the version they were confirmed with", "Nothing the kitchen buys or pays changes", "This is not what the kitchen is cooking".
- **Removed claims:** who may publish (only the app's own "the owner can review and publish a version" is quoted); that step times scale (they don't); the sheet's units (metric shown with US units set, reported as a bug).
- **Found while shooting:** the kitchen view needs a published version before it shows anything; the costed sheet is a separate "Print recipe" in More actions; a critical note always prints as "Food-safety check", so the tip says to keep it for the real check.
- **Final image:** the old sheet comes off the wall because the new one says which version it is.

## Revision 2026-10-13 (re-shot off local develop fcc651477)

- The app fixes landed: the kitchen sheet reads US units in a US kitchen (69.5 lb, 19.9 lb, 4.8 gal for 150), both sheets say "Version N · published <date>", a critical note prints after "Check:" (it said "Food-safety check" for quality notes too), print leaves out "tap a step", "NOW" and timers, and the sub-recipe link prints as "Sub-recipe" without overlapping the name.
- Removed from the page and the ledger: the units caveat (fixed). Changed "live since" to "published" throughout.
- Every shot re-taken from one run, so the versions are dated Oct 13, 2026 (the shoot day). 18 figures, readMinutes 10.
