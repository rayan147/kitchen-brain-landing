# Story Tracker — What to ask Sage the day before an event (blog how-to)

## My story

- **Piece:** How-to guide (task steps, not a story; see memory "how-to guides are steps")
- **Title / headline:** What to ask Sage the day before an event
- **My hero's name:** The owner of Harbor & Hearth Catering, the afternoon before the Ishikawa fundraiser
- **Content file(s):** `src/content/blog/ask-sage-before-event.md`
- **Evidence:** RC-85 in `docs/release-claim-ledger.md` (kitchen-brain develop 9b84420f4, read 2026-10-12)
- **Schedule:** publishedDate 2026-12-03 (Thursday), order 30. Hidden until then (src/lib/blog.ts).
- **Capture model:** localhost 9b84420f4 with the owner's Google AI key (2026-10-12): SAGE_AI_PROVIDER=google, run model google:gemini-3.5-flash. Production defaults to Anthropic. Answers vary run to run.

## The 11 steps

For a how-to, only Steps 1, 2 and 11 shape the page.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ (n/a for a how-to: numbered steps) |
| 4 | From Beats to Scenes | ☑ (before you start, ask the day before, fixes, limits) |
| 5 | Character Voices | ☑ (reader: tomorrow, the shelf, the list; product: the app's labels) |
| 6 | Writing Dialogue | ☑ (each step turns a worry into a record you can open) |
| 7 | Sorkin Dialogue | ☑ (wants: nothing missed before tomorrow; obstacle: no time to open every screen) |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ (the panel opens on "Ishikawa #765 is tomorrow.", and the answer finds the 30.7% food cost) |
| 10 | Connecting Your Scenes | ☑ (second person throughout) |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

> A caterer the day before an event who wants to know what's left, what's short and what to buy, without opening every screen, and who won't let software change anything on its own.

### Step 2 — Your Character

- **Want:** One place to ask "what's left for tomorrow?"
- **Need:** Answers they can check, and a shopping list nothing turns into an order without them.
- **Wound:** A tool that "helpfully" placed or changed something they hadn't approved.
- **Flaw:** Takes a confident answer at face value.

### Step 8 — Cool Talk (the one snap line)

> "Sage suggests changes; you make them." (the app's own line on the opening panel)

### Step 11 — Revise and Finish

- **Re-shot with a real model** (2026-10-12). The steps describe what Sage did; only alt text quotes answer words, exactly as each shot shows, because the model writes each answer fresh.
- **Checked every figure in a shown answer against the sample kitchen:** order #765 food cost 30.7% vs 30% target, shop 16 lines, prep 0 of 19, pack 0 of 5 (order page, getOrderList tool call); 2 below par of 66 with a par, 12 uncounted (getIngredientsBelowPar tool call). The 16 unreviewed ingredients come from the order view's guard summary (tools.ts unreviewedIngredients).
- **Not shown:** Sage's prose around the shopping draft. Both runs said the list waits for you to "review and approve it" and suggested **Open Inventory**, while the action is the card's **Create the shopping list**. The post shows the card, which is rendered from the tool's records, and uses the app's button labels.
- **Fix section, real not staged:** "What do I still need to buy for it?" failed twice on this model (the answer used numbers its records didn't back, sage_runs.unverified_tokens), so the app showed "Sage couldn't answer just now." with Retry and the linked order.
- **Staged, and captioned as staged:** the two allowance notices (a test run's credits set in the sample database), kept from the first shoot; they don't depend on the model.
- **Final image:** the list created and opened, yours to change before you shop.

### Revision 2026-10-13 (re-shot on develop 916f3ffbd)

- **Why:** the app fixes reached local develop: the panel header names the order ("Looking at: Ishikawa fundraiser #765"), and a withheld answer has its own sentence ("Sage's answer used numbers it couldn't check against your records, so it wasn't shown.") instead of "Sage couldn't answer just now."
- **Every shot re-taken** on 916f3ffbd with the real model. The sample order #765 was moved to Oct 14 in the shoot's database copy so it is tomorrow on the shoot day.
- **"What do I still need to buy for it?" now answers.** It is step 5. Every figure was checked against the order's Shop tab: $1,011.00 across 6 suppliers and each supplier subtotal.
- **The "what's left" answer now adds the price that meets 30%, $43.41.** Checked: $377.60 food / 29 guests / 0.30 = $43.402, rounded up to the next cent as the app rounds.
- **Fix section, real not staged:** one run of the buy question (of two) was withheld by Sage's check, so the fix entry shows the new sentence with Retry. "Sage couldn't answer just now." stays as a text-only entry for an outage.
- **New tip shot:** Sage opened from the order, naming it in the header.
- **Staged, and captioned as staged:** the two allowance notices, re-shot by setting a test run's credits in the sample database.
- **Order names:** on 916f3ffbd Sage names the order "Ishikawa fundraiser #765" in the question it sends, every answer line, the sources and the next-step button ("Open Ishikawa fundraiser #765 · 2026-10-14").
- **New answer line checked:** "Overall ingredient shortages across confirmed events include Italian sausage and olive oil, which are both needed for this order." Both are on the week's draft list and on #765's Shop list.
- 13 figures, readMinutes 10.
