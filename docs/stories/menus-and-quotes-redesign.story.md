# Story Tracker — Menus & Quotes redesign

## My story

- **Piece:** Research-backed implementation prompt and finished two-product marketing page
- **Title / headline:** Build the menu once. Quote the job you can actually run.
- **My hero's name:** The working caterer answering a customer today
- **Content file(s):** `docs/prompts/menus-and-quotes-redesign.prompt.md`, `src/components/sections/MenusQuotesFeature.astro`, `src/pages/features/menus-and-quotes.astro`

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

> An independent caterer who wants to build a menu and answer a customer with a defensible per-guest quote, but dish choices, guest count, equipment, and the current cost live in different documents.

### Step 2 — Your Character

- **Want (surface):** Put a menu and a price in front of the customer today.
- **Need (real):** One event record where the menu, guest count, food cost, price, and confirmed plan agree.
- **Wound (the bad day):** A guest count changed after the spreadsheet was priced, leaving the kitchen to run a different job from the one that was quoted.
- **Flaw (the habit):** Treating the menu document, quote spreadsheet, and event notes as separate sources of truth.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | A caterer moves between a menu document, a customer email, and a pricing sheet while the reply waits. |
| 2 Theme Stated — the truth they'll learn | The menu the customer sees should be the menu the kitchen has to cost and run. |
| 3 Set-Up — the daily grind, the flaw on display | Dishes are copied into a quote, portions and equipment live elsewhere, and every guest-count change starts another round of checking. |
| 4 Catalyst — the bad day / the wall hits | The customer changes the count and asks for a final number before the old quote has even been reconciled. |
| 5 Debate — “can it be different?” | The reader wonders whether connecting the work will slow down a quote that needs to leave now. |
| 6 Break into Two — they try the new way | CostCook turns one menu, date, guest count, and price into a costed draft before commitment. |
| 7 B Story — the person/relationship it's really about | The promise to the customer and the handoff to the kitchen become the same commitment. |
| 8 Fun and Games — the promise of the premise | Menu Management shows dishes, portions, prices, and equipment together; Catering Quotes shows per-guest cost, target price, confirmation, and the frozen number. |
| 9 Midpoint — first real win, with a number | An explicitly illustrative 180-guest menu shows food cost against the quoted price before it is confirmed. |
| 10 Bad Guys Close In — the edge cases, the doubts | The count changes, a current price moves, a menu is already in use, or purchasing has begun; the system names what can change and what stays frozen. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | Another quote leaves with a number the kitchen has not actually agreed to run. |
| 12 Finale + Final Image — life after; the CTA in their words | The customer gets the number, the kitchen gets the same plan, and the caterer can move on to the next job. |

### Step 4 — From Beats to Scenes (8 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero: one menu, one commitment | 1–2 | scattered documents → one event record |
| 2 | The handoff problem | 3–4 | routine copying → visible quote risk |
| 3 | Two-product anchor navigator | 5–6 | “more setup” → choose the job that matters now |
| 4 | Menu Management Software | 7–8 | menu as document → menu as runnable plan |
| 5 | Catering Quotes | 8–9 | price as guess → price with visible working |
| 6 | Confirmation and change proof | 9–10 | draft confidence → protected commitment |
| 7 | Frequently asked questions | 5, 10 | practical objections → specific answers |
| 8 | Closing outcome and CTA | 11–12 | another unreconciled quote → customer and kitchen aligned |

### Step 5 — Character Voices

- **Reader's words for the problem:** “per guest,” “the number you say out loud,” “menu, date, guests, and price,” “the quote you gave,” “what to buy, cook, and pack,” and “quoted versus today.” These come from CostCook's shipped feature register, claim ledger, and existing demo materials.
- **Product voice:** competent, calm, kitchen-literate.
- **Banned words:** seamless, powerful, robust. Also avoid CRM language, sales-pipeline promises, digital contracts, deposits, BEOs, customer portals, and competitor capabilities CostCook does not ship.

### Step 6 — Dialogue (McKee): the turn in each section

1. Separate documents become one menu-and-quote commitment.
2. Copying that felt harmless becomes an exposed operational risk.
3. A broad feature inventory becomes two clear jobs the reader can inspect.
4. A list of dishes becomes a priced plan with portions and equipment attached.
5. A per-guest price becomes a number tested against current food cost before commitment.
6. A promising draft is tested by confirmation and later price changes, then holds.
7. Remaining objections move from vague concern to feature-ledger-backed answers.
8. Another round of reconciliation becomes one plan ready for the customer and kitchen.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Answer the customer today and give the kitchen a job it can run.
- **Obstacle:** The menu, guest count, quote, and current food cost disagree across separate documents.
- **Headline:** Build the menu once. Quote the job you can actually run.
- **Subhead:** Keep dishes, portions, guest count, equipment, food cost, and the price you say out loud on one path from draft to confirmed event.

### Step 8 — Cool Talk: the one snap line

> The quote should know what the kitchen has to pack.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At a prep table with a laptop open and a customer's revised guest count on the phone.
- **What they see / hear / feel:** The old quote attachment, a menu document, a highlighted spreadsheet cell, prep continuing nearby, and the pressure of sending a confident answer before the afternoon disappears.
- **Time of day:** After prep has started and before the customer follows up again.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-offs:**
  1. Hero → problem: “The copying only looks harmless while every document still agrees.”
  2. Problem → navigator: “One menu and one event record can carry the decision instead.”
  3. Navigator → menu management: “Start with what each guest is meant to receive.”
  4. Menu management → quotes: “Once the menu can run, the price can show what it is carrying.”
  5. Quotes → confirmation proof: “The number earns trust when confirmation stops it moving.”
  6. Proof → FAQ: “The commitment holds; the remaining questions are about the edges.”
  7. FAQ → ending: “With those edges named, the same plan can leave for the customer and the kitchen.”

### Step 11 — Revise and Finish

- **Final content count:** 1,821 words in the implementation prompt; the rendered page keeps the core narrative visible and moves the longer capability inventory and FAQs into semantic disclosures.
- **Browser revision:** Verified the complete desktop and 390-pixel mobile flows. The menu ledger reflows into label-value pairs, quote stages remain ordered, evidence stays within the viewport, and the closing action follows the FAQ without a competing detour.
- **Claims removed because they could not be shown:** branded proposals, PDFs sent to customers, digital signatures, deposits, contracts, BEOs, CRM pipelines, online booking, customer portals, automated emails, and revenue or time-saving claims.
- **Research boundary:** Meez informs the separation of menu building from menu analysis; Tripleseat informs the importance of keeping customer-facing and operational details connected. Neither product's claims, numbers, assets, or interface are borrowed.
- **Final Image:** The customer has the number, the kitchen has the same plan, and the caterer is free to answer the next job.


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy owner of a six-person catering kitchen wants to quote an event, but changing guest counts leave the quote and prep plan out of step.
- [x] 2 Character: Wants a usable answer between services; needs a traceable result; remembers a costly spreadsheet mistake; habitually postpones setup.
- [x] 3 Plot: (1) interrupted service gap; (2) one dependable answer; (3) separate records; (4) changing guest counts leave the quote and prep plan out of step; (5) asks what to enter; (6) tries the relevant CostCook task; (7) hands the result to the crew; (8) follows the worked example; (9) checks its labelled numbers; (10) reads missing-data and release limits; (11) sees the cost of guessing; (12) chooses a trial or booked demo.
- [x] 4 Scenes: hero, daily problem, task navigation, worked example, exceptions, detailed questions, next step. Turns: uncertainty to purpose; familiarity to need; confusion to action; doubt to evidence; risk to limits; questions to answers; hesitation to informed choice. Existing route and layout retained.
- [x] 5 Voices: Reader asks “What do I enter?” and “Can my kitchen use this today?” (persona prompts, not customer quotes). Product is calm, concrete and kitchen-literate; ban seamless, powerful and robust.
- [x] 6 Dialogue: Each scene answers the next practical question instead of explaining internal architecture.
- [x] 7 Intention/obstacle: quote an event / changing guest counts leave the quote and prep plan out of step. Headline: “Build your menu. Check the price per guest.” Supporting line: “Choose your dishes and portions, then add the event date, guest count and selling price. Check the food cost before confirming the quote and the kitchen plan together.”
- [x] 8 Snap: “Three files. One customer waiting.” Retain this concrete detail; cut competing abstract slogans.
- [x] 9 Setting: Phone beside the prep bench, a short gap between services, crew waiting for the next list.
- [x] 10 Connection: You throughout; inputs lead to results, results to limits, limits to the trial decision. Shared terms keep the next action consistent.
- [x] 11 Revision: Build and claim checks passed; every feature route inspected at desktop and mobile, with native disclosures and no JavaScript. Five-width regression checks and 320px/200% text passed. Report: `docs/qa/features-caterer-2026-09-11/report.md`.


## Revision 2026-10-07 (chef review of the sub-routes)
- The top quote is the film's sample event, not the tour's; the tour's garden wedding is the lower mockup.
- $1,491.38 ÷ 180 ÷ 0.30 = $27.62 (was rounded early to $27.63).

## Revision 2026-10-07: chef voice pass
Owner: make the site read like a chef wrote it. Copy only; the H1, the
closing heading, the FAQ, the capability list, captions on screenshots and
alt text are unchanged (the H1 and closing heading are pinned).
- **Slogans out:** "Three files. One client waiting." is "Right now the job
  lives in three places."; "Make the menu runnable before you make it
  presentable." is "Get the menu right for the kitchen first."; "Cost before
  commitment." is the page's own numbers, "$68 a head, at 39.6% food cost.";
  "Compare without rewriting." is "The agreed number stays put."
- **Consultant words out:** "workspace", "configured target", "changed
  deliberately", "three working views", "shipped capabilities directly
  involved in". Guest count is "head count" in running text.
- **Lists cut:** "the plan, math, and money" is "the plan and the money"; the
  quote steps' notes are short kitchen phrases.
- **Meaning held:** confirming locks the quote and the kitchen plan
  together; an event can override the menu's details; the confirmed quote
  stays frozen beside today's cost.
