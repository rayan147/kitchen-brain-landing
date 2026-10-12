# Story Tracker — Import invoices, recipes and ingredient lists (blog guide)

## My story

- **Piece:** How-to guide (task steps, not a story)
- **Title / headline:** How to import your ingredients, invoices and recipes into CostCook
- **My hero's name:** The owner of Harbor & Hearth Catering, in their first week on CostCook
- **Content file(s):** `src/content/blog/import-invoices-recipes-ingredient-lists.md`
- **Evidence:** RC-79 in `docs/release-claim-ledger.md` (kitchen-brain main ed6ff5f01 and develop 6450d7c54, read 2026-10-12)

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☑ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☑ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☑ |
| 4 | From Beats to Scenes | 12 beats → the 6–8 sections you will write. | ☑ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☑ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☑ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☑ |
| 8 | Cool Talk | One line of snap. | ☑ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☑ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☑ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done. | ☑ |

---

### Step 1 — The Idea

> A caterer starting on CostCook who wants their invoices, ingredient list and recipe binder in, but doesn't know what each import needs or what happens to it, and won't let a machine write their costs unchecked.

### Step 2 — Your Character

- **Want:** Get the paperwork into CostCook this week.
- **Need:** Know the requirements up front and the right order, so the review is short and every saved number was checked.
- **Wound:** A past tool that "imported" a price list and quietly priced everything wrong.
- **Flaw:** Starts with the recipes, because that's the fun part, and drowns in new-ingredient questions.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Invoice, order-guide spreadsheet and a pencilled recipe binder on the pass. |
| 2 Theme Stated | Bring it in as it is, check it, save only what you checked. |
| 3 Set-Up | Who can import, where, which formats. |
| 4 Catalyst | Nothing is saved until the final button. |
| 5 Debate | Which first? |
| 6 Break into Two | Ingredients first, recipes last, and why. |
| 7 B Story | The app's own line: an ingredient with no price can't be costed. |
| 8 Fun and Games | The three imports, each with its requirements and its button. |
| 9 Midpoint | The invoice becomes purchases and costs change, counted on screen. |
| 10 Bad Guys Close In | Spreadsheet invoices log no purchase; unreadable lines; limits. |
| 11 Dark Night | No undo after saving. |
| 12 Final Image | Friday: purchases, ingredients, costed recipes, all checked. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Turn |
|---|---------|-------|------|
| 0 | Opening (pass) | 1–2 | pile → plan |
| 1 | Before you start | 3–4 | unsure → safe to try |
| 2 | Do it in this order | 5–7 | every line a question → few questions |
| 3–5 | Ingredient list / invoice / recipes | 8–9 | paper → checked records |
| 6 | When something can't be read | 10 | gap → named fix |
| 7 | Limits worth knowing | 10 | surprise refusal → known limits |
| 8 | Before you save, and after | 11 | fear of mistakes → know where to fix |
| 9 | Friday, after the first week | 12 | final image |

### Step 5 — Character Voices

- **Reader:** "the binder", "order guide", "what I paid", "pack", "case".
- **Product:** the app's own labels, quoted exactly ("What are you bringing in?", "Import invoice and update costs", "Nothing on it can change here.").

### Step 6 — Dialogue

Each section turns doubt into a known requirement or a known button. The order section changes the reader's plan.

### Step 7 — Sorkin

- **Intention:** Get the paperwork in.
- **Obstacle:** Not knowing what each import needs, and not trusting an unchecked import.

### Step 8 — Cool Talk (the one snap line)

> "an ingredient with no price can't be costed." (the app's own validation message, used as the reason for ingredients-first)

### Step 9 — Scene

The pass, first week: a Tuesday invoice, an order guide on a laptop, a binder with pencil in the margins and a coffee ring.

### Step 10 — Connecting

Second person throughout. Before you start → order → three imports in that order → what goes wrong → limits → before and after saving → Friday.

### Step 11 — Revise and Finish

- **Removed claims:** reading accuracy, "nothing missed", "no typing" (RC-58); unreadable text quoted "verbatim" (recipes list a title or short description); the develop-only late-invoice price hold; the semicolon CSV refusal (column mapper only).
- **Kept on purpose:** the template door adds rows with no review step, said plainly.
- **Final Image:** Nothing went in that you didn't look at first.

## Revision 2026-10-12: the English editor's review (27 findings, all applied)

- "Nothing is saved" now names **Import and review**, so it no longer contradicts the template door, which now warns it skips review before its instructions.
- The spreadsheet-invoice trap moved to the top of the invoice section; the order heading now states the order ("Ingredients first, recipes last") with the list first.
- Pronouns fixed ("CostCook" for the reader), limits split into photos and other files, title and description tightened, US spelling.
- Kept "Save changes keeps one row's edits for later" (the app's wording) and described the bulk-answer button rather than quoting it, since its label carries a count.

## Revision 2026-10-12 (2): rewritten as a how-to

Owner: "this needs to be a guided blog, a how to … no one understands this." The story framing (Harbor & Hearth's first week, the binder scene, Friday's final image) is gone. Practice applied, from the Google developer documentation style guide (procedures), Diátaxis (how-to guides are task steps with explanation kept out) and Shopify's import help (template, then upload, review, confirm, then troubleshooting):

- Task title that starts "How to". The opening says what you'll have at the end, then the three parts in order.
- "Before you start" lists what you need.
- Each part is numbered steps, one action each, with the app's exact button in bold and what you'll see.
- Tips sit outside the steps. The optional template route is its own sub-procedure.
- An "If something goes wrong" table pairs the app's exact messages with the fix.
- Limits and undo are separate reference sections at the end.

Steps 1, 2 and 11 still hold: hero = the owner importing; want = everything in and costed; the one snap line stays as the app's "an ingredient with no price can't be costed" (now in the fix column). Every label was re-checked on main ed6ff5f01 and develop 6450d7c54, adding "Extract sources", "Review", "Add document to queue".

## Revision 2026-10-12 (3): screenshots at every step

Owner: "use screenshots to show it as well", and for the troubleshooting rows "even more". 28 captures at 390 px under `public/proof/blog/import-invoices-recipes-ingredient-lists/`: 19 for the steps (Part 1: 01–06, Part 2: 07–12, Part 3: 13–19), and 9 for the troubleshooting section, which became one sub-heading per problem with the app's own message on screen.

Source: local build of kitchen-brain develop 9bd986496 (import code matches 6450d7c54 apart from two mapper subtitles), Harbor & Hearth sample kitchen, at localhost only. Its reader is the fixed test reader, so the honest limits are:
- The ingredient rows (Yellow onion, Olive oil) are the test reader's sample rows.
- The invoices were PDFs generated for the shoot, read by the app's own rules reader.
- The recipe came in through Map recipe columns, a rules reader, so its lines are real.
- The "Couldn't read" note was written into the sample database to show the notice, and its caption says "Example note."

The shoot taught the guide four facts, now in the steps:
- With one document the review opens by itself.
- After Add all you land on Ingredients.
- An invoice pack mismatch offers "Use N packs".
- Recipe units come from a list (g, oz, lb, ml, tbsp…), so the guide no longer lists only five.
