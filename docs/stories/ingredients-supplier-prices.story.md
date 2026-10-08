# Story Tracker — Ingredients & Supplier Prices

## My story

- **Piece:** Finished feature marketing page
- **Title / headline:** Ingredients & Supplier Prices
- **My hero's name:** The chef-owner checking the next quote against this week's supplier prices
- **Content file(s):** `src/pages/features/ingredients-and-supplier-prices.astro`, supporting feature-page components, and the Features dropdown data

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the 6–8 sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done! | ☒ |

### Step 1 — The Idea

> A chef-owner who wants to know what each ingredient costs before pricing the next job, but supplier invoices, pack sizes, and unit prices keep changing in different places.

### Step 2 — Your Character

- **Want (surface):** Compare supplier prices and use the right ingredient cost without rebuilding the math by hand.
- **Need (real):** One dependable ingredient record that turns every supplier pack into a cost the kitchen can compare and reuse.
- **Wound (the bad day):** A familiar case arrived at a new price and the change was discovered only after the menu had already been quoted.
- **Flaw (the habit):** Trusting the last remembered price, then checking invoices only when the margin already looks wrong.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | The chef-owner moves between an invoice, a supplier portal, and a spreadsheet while a quote waits. |
| 2 Theme Stated — the truth they'll learn | A supplier price is useful only when it becomes an ingredient cost you can compare and use. |
| 3 Set-Up — the daily grind, the flaw on display | The same ingredient appears in different packs and units while yesterday's spreadsheet still looks plausible. |
| 4 Catalyst — the bad day / the wall hits | A case price changes after the menu was costed, exposing a margin built on an old number. |
| 5 Debate — “can it be different?” | The reader worries that cleaning supplier data will become another job to maintain. |
| 6 Break into Two — they try the new way | CostCook connects supplier items to one ingredient record and makes the comparable cost visible. |
| 7 B Story — the person/relationship it's really about | The handoff between the person receiving the invoice and the person pricing or cooking the menu. |
| 8 Fun and Games — the promise of the premise | The reader sees supplier offers, pack conversions, price history, and recipe impact as one traceable path. |
| 9 Midpoint — first real win, with a number | A concrete, clearly labelled example converts two supplier packs into the same unit so the better price is obvious. |
| 10 Bad Guys Close In — the edge cases, the doubts | Units differ, a pack is incomplete, a supplier price is missing, or the preferred option changes; the interface shows what is known and what needs attention. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | Another quote leaves with a margin based on a price nobody checked this week. |
| 12 Finale + Final Image — life after; the CTA in their words | The next quote uses a supplier price the reader can trace back to its pack; the visitor starts or books the next step. |

### Step 4 — From Beats to Scenes (8 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero: know which price is in the recipe | 1–2 | scattered prices → one comparable ingredient cost |
| 2 | The quiet cost of an old case price | 3–4 | plausible spreadsheet → visible margin risk |
| 3 | Product story navigator | 5–6 | “another data-cleanup job” → a clear first action |
| 4 | Ingredient records | 7–8 | duplicated names and units → one reusable kitchen ingredient |
| 5 | Supplier prices | 8–9 | unlike packs → an inspectable comparison |
| 6 | Price changes and recipe impact | 9–10 | change without context → a traceable downstream effect |
| 7 | Frequently asked questions | 5, 10 | unresolved edge cases → direct, bounded answers |
| 8 | Closing outcome and CTA | 11–12 | another quote built on memory → a price ready to defend |

### Step 5 — Character Voices

- **Reader's words for the problem:** “the case price was different,” “supplier price,” “pack cost,” “usable yield,” “what a plate costs,” and “the number you say out loud.” These come from the release claim ledger, shipped feature register, the existing Recipes & Costing story, and CostCook's public workflow copy.
- **Product voice:** competent, kitchen-literate, unfussy.
- **Banned words:** seamless, powerful, robust. Also avoid real-time, automated sync, best price, savings claims, and any suggestion that CostCook chooses a supplier for the reader.

### Step 6 — Dialogue (McKee): the turn in each section

1. The hero moves from scattered supplier figures to one comparable ingredient cost.
2. A familiar spreadsheet number turns from plausible to visibly risky when the invoice changes.
3. A maintenance burden becomes two direct product chapters: the ingredient and its supplier offers.
4. Duplicated buying facts become one ingredient record reused wherever the food appears.
5. Unlike cases become a same-unit comparison with the arithmetic open.
6. A changed price moves from isolated fact to visible recipe impact and real product evidence.
7. The remaining edge cases move from implied doubt to bounded, shipped answers.
8. Another quote based on memory becomes a price the reader can trace and defend.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Know which supplier price is shaping the next recipe and quote.
- **Obstacle:** Case sizes, units, yields, and invoice dates make the last remembered price look more comparable than it is.
- **Headline:** Know which supplier price is inside the recipe.
- **Subhead:** A case price is not comparable until pack size and usable yield have had their say. Keep every offer attached to the ingredient, with the working open.

### Step 8 — Cool Talk: the one snap line

> Compare the food, not the shape of the case.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the prep-table edge with a new invoice beside the spreadsheet used for today's quote.
- **What they see / hear / feel:** The same supplier name, a different case price, a pack description that almost matches, prep continuing nearby, and the pressure to answer before the source has been checked.
- **Time of day:** Late enough that the invoice has arrived, early enough that the customer still expects the quote today.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-offs:**
  1. Hero → problem: “The old price still looks right.”
  2. Problem → navigator: “The difference is not a rounding error. It is a different buying fact.”
  3. Navigator → ingredient record: “Keep purchase, yield, storage, and allergen facts on the food.”
  4. Ingredient record → supplier prices: “Once the ingredient is stable, compare the food rather than the case.”
  5. Supplier comparison → impact: “The source stays with the number, and the next question is what the change touches.”
  6. Impact → evidence: “The supplier price keeps walking.”
  7. Evidence → diligence and FAQ: “With the working visible, the remaining questions are about how the facts enter and change.”
  8. FAQ → ending: “Bring one supplier sheet and one real ingredient.”

### Step 11 — Revise and Finish

- **Word count:** 1,096 visible words in the built page's main story, including capability and FAQ disclosures.
- **Claims removed because they could not be shown:** automatic supplier synchronization, real-time pricing, purchasing recommendations, guaranteed savings, invented time or margin outcomes, and any suggestion that the canonical ingredient catalog contains prices.
- **Evidence revision:** The first capture exposed a lazy-loaded real-product image; the verification now waits for evidence images to decode before capture. The final desktop and mobile evidence both show the real CostCook recipe-line interface.
- **Responsive revision:** The supplier comparison becomes a two-column mobile table with its fact label on a full row, keeping all values visible without page-level or nested horizontal scrolling. Hero actions become full width.
- **Final Image:** A price you can trace. A quote you can defend.


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy owner of a six-person catering kitchen wants to choose a supplier price, but different case sizes make the cheapest offer hard to spot.
- [x] 2 Character: Wants a usable answer between services; needs a traceable result; remembers a costly spreadsheet mistake; habitually postpones setup.
- [x] 3 Plot: (1) interrupted service gap; (2) one dependable answer; (3) separate records; (4) different case sizes make the cheapest offer hard to spot; (5) asks what to enter; (6) tries the relevant CostCook task; (7) hands the result to the crew; (8) follows the worked example; (9) checks its labelled numbers; (10) reads missing-data and release limits; (11) sees the cost of guessing; (12) chooses a trial or booked demo.
- [x] 4 Scenes: hero, daily problem, task navigation, worked example, exceptions, detailed questions, next step. Turns: uncertainty to purpose; familiarity to need; confusion to action; doubt to evidence; risk to limits; questions to answers; hesitation to informed choice. Existing route and layout retained.
- [x] 5 Voices: Reader asks “What do I enter?” and “Can my kitchen use this today?” (persona prompts, not customer quotes). Product is calm, concrete and kitchen-literate; ban seamless, powerful and robust.
- [x] 6 Dialogue: Each scene answers the next practical question instead of explaining internal architecture.
- [x] 7 Intention/obstacle: choose a supplier price / different case sizes make the cheapest offer hard to spot. Headline: “Compare supplier prices by what you can use.” Supporting line: “Enter the case price, pack size and usable yield for one ingredient. Compare suppliers per usable kilo, pound or item, and see which recipes a price change affects.”
- [x] 8 Snap: “The old price still looks right.” Retain this concrete detail; cut competing abstract slogans.
- [x] 9 Setting: Phone beside the prep bench, a short gap between services, crew waiting for the next list.
- [x] 10 Connection: You throughout; inputs lead to results, results to limits, limits to the trial decision. Shared terms keep the next action consistent.
- [x] 11 Revision: Build and claim checks passed; every feature route inspected at desktop and mobile, with native disclosures and no JavaScript. Five-width regression checks and 320px/200% text passed. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

### Revision 2026-10-07: chef audit, numbers and US units
- Illustrative frames rewritten in US units (lb, qt, gal, Aug 28) with arithmetic that reconciles on the page: see the commit "fix(features): receiving, order, ingredients and recipes add up".


## Revision 2026-10-07 (chef review of the sub-routes)
- "Trim yield" everywhere (app field name; CONTEXT avoids "usable yield").
- The impact row is Chicken pot pie, not the tour's herb roast chicken, which buys from Harbor.
- History names the Aug 28 price as the PO-1048 delivery and gives the Market Supply pack (25 lb).

### Revision 2026-10-07: chef voice pass
Owner: make the site read like a chef wrote it, not AI. Copy only; the H1,
the FAQ, the capability list, the illustrative comparison and its caption
("CostCook orders concurrent offers by usable-unit cost"), and every
screenshot caption and alt text are unchanged.
- **Slogan headings out:** "Compare the food, not the shape of the case." is
  "A cheaper case can cost you more."; "The supplier price keeps walking." is
  "The price follows the ingredient into the recipe."; "A price you can
  trace. A quote you can defend." is "Know where every price came from before
  you quote." (pin in check-ingredients-supplier-prices-page.mjs moved, pure
  wording).
- **Plainer lines:** the problem paragraph is said the way it happens ("The
  invoice went up and the case size changed, but your spreadsheet still has
  the old number."); "reconciles" is "adds up to"; "invisible adjustment" is
  "never buried in the price".
- **Meaning held:** every offer keeps its source and date; trim and cooking
  loss stay visible; the price-change impact on recipes is shown before you
  adopt it.
