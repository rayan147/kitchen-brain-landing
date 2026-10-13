# Story Tracker — Set up your kitchen (blog how-to)

## My story

- **Piece:** How-to guide (task steps, not a story; see memory "how-to guides are steps")
- **Title / headline:** How to set up your kitchen in CostCook, from an empty account to a costed first order
- **My hero's name:** A new owner of Harbor & Hearth Catering, on their first day in CostCook
- **Content file(s):** `src/content/blog/set-up-your-kitchen.md`
- **Evidence:** RC-87 in `docs/release-claim-ledger.md` (kitchen-brain develop 9b84420f4, walked end to end 2026-10-12; re-walked on local develop f38ea126e, 2026-10-13)
- **Schedule:** publishedDate 2026-12-10 (Thursday), order 31 (the Sage guide took Dec 3). Hidden until then (src/lib/blog.ts).
- **Overlap:** /onboarding pitches the same five stages as five scenes. This post is the numbered version and links back via featureHref. It keeps that page's claim boundary: upload then confirm; never complete, correct or "no typing".

## The 11 steps

For a how-to, only Steps 1, 2 and 11 shape the page. The beats are not used.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ (n/a for a how-to: numbered steps by stage) |
| 4 | From Beats to Scenes | ☑ (sections: before you start, five stages, fixes, limits) |
| 5 | Character Voices | ☑ (reader: dish, pack, invoice, guests; product: the app's labels) |
| 6 | Writing Dialogue | ☑ (each stage turns "empty" into "saved") |
| 7 | Sorkin Dialogue | ☑ (wants: one costed event; obstacle: an empty app and no idea where to start) |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ (one dish you cook often, a recent invoice) |
| 10 | Connecting Your Scenes | ☑ (second person throughout) |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

> A caterer who just opened an empty CostCook account and wants to see one real event costed, but doesn't know what to enter first or how much of it there is.

### Step 2 — Your Character

- **Want:** See what one event really costs.
- **Need:** A short, ordered path: one supplier, one dish's ingredients, the dish, one order.
- **Wound:** A past system that wanted the whole price book typed in before it showed a single number.
- **Flaw:** Tries to enter every ingredient they buy before costing anything.

### Step 8 — Cool Talk (the one snap line)

> "a name can show butter has milk, not that chicken has none." (the app's own sentence, stage 3)

### Step 11 — Revise and Finish

- **Kept to the app's words:** "Stop after any stage and come back: each one saves when you continue", "Most caterers use 28 to 32%", "Pick No or Yes. A blank here reads the same as nobody asked", "The order stays a draft, with prices updating, until you confirm it on the order page."
- **Removed claims:** any duration ("first hour"), reading accuracy for imports or Sage, "no typing".
- **Final image:** the order's shopping list, sorted by supplier, in whole packs.

### Revision 2026-10-13 (re-walked on develop f38ea126e; hold lifted)

- **Hold lifted:** the stage 4 dish screen now shows each line and the draft plate cost as you add them. The guide gains two shots: the lines (Chicken thigh $1.20, Lemon $0.08, Lines total $1.28) and the Draft plate cost ($1.31 = $1.28 + misc 2% $0.03).
- **Label changes followed:** the dish button is now **Save dish and continue** (was "Check dish and continue"); Add line now says "Line added. Its exact used amount is now included in the plate cost."
- **US units in setup:** the ingredient rows read "$3.20 / lb usable" and "$0.33 / each usable" (a metric "$/kg usable" on fcc651477 is gone).
- **One percent everywhere:** at $4.50 the dish screen, the live quote and "Your kitchen is ready" all read 29.2% food cost, 0.8 points under target (fcc651477 showed 29.1% on the dish screen).
- **New tip:** the dish screen's nutrition note, "Nutrition and allergens follow this dish as you build it. Save dish and continue to use them in the kitchen."
- 27 figures, readMinutes 12. Every shot re-taken on f38ea126e.
