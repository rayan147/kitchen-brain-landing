# Story Tracker — Inventory

## My story

- **Piece:** Finished feature marketing page
- **Title / headline:** Inventory
- **My hero's name:** The chef-owner checking the shelf before the next shopping list is built
- **Content file(s):** `src/pages/features/inventory.astro`, `src/components/sections/InventoryFeature.astro`, and the Features dropdown data

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

> A chef-owner who wants to buy only what the next jobs need, but the on-hand number may be fresh, stale, or never counted and still looks exact on a screen.

### Step 2 — Your Character

- **Want (surface):** Know what is on the shelf and subtract only trustworthy stock from the next buy.
- **Need (real):** An inventory record that distinguishes a physical count from later movement and refuses false certainty.
- **Wound (the bad day):** The shopping list assumed a case was in the walk-in; the shelf was empty when prep started.
- **Flaw (the habit):** Treating the last remembered count as current because checking every shelf again feels slower than trusting it.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | The chef-owner stands at the walk-in door with a phone, an old count, and tomorrow's shopping list. |
| 2 Theme Stated — the truth they'll learn | An on-hand number is useful only when it says why it deserves to be trusted. |
| 3 Set-Up — the daily grind, the flaw on display | Purchases arrive, food is used, waste is logged, and the remembered shelf drifts away from the real one. |
| 4 Catalyst — the bad day / the wall hits | Prep reaches for a case the list said was already there, but the shelf is empty. |
| 5 Debate — “can it be different?” | The reader worries that accurate inventory means pausing the kitchen for constant counting. |
| 6 Break into Two — they try the new way | CostCook starts from a dated physical count, carries later movements forward, and labels the result fresh, stale, or never counted. |
| 7 B Story — the person/relationship it's really about | The handoff between the person who counts the shelf and the person who buys for the next jobs. |
| 8 Fun and Games — the promise of the premise | The reader sees count baselines, dated movement, state badges, need breakdowns, and a durable gap shopping list. |
| 9 Midpoint — first real win, with a number | A clearly labelled illustrative line shows need minus trusted shelf becoming the quantity left to buy. |
| 10 Bad Guys Close In — the edge cases, the doubts | A count goes stale, an ingredient has never been counted, a chef override exists, or a back-dated correction appears; the interface names the state rather than inventing precision. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | Another shopping list subtracts food that exists only in memory. |
| 12 Finale + Final Image — life after; the CTA in their words | The next list subtracts only a shelf quantity the reader can defend; the visitor starts or books the next step. |

### Step 4 — From Beats to Scenes (8 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero: know what the shelf number means | 1–2 | exact-looking estimate → trusted state |
| 2 | The empty-shelf morning | 3–4 | familiar shortcut → visible operational risk |
| 3 | Inventory story navigator | 5–6 | “constant counting” → one dated baseline plus movement |
| 4 | Count and trust state | 7–8 | remembered stock → explicit physical-count baseline |
| 5 | Movement and shelf value | 8–9 | running total → dated, inspectable history |
| 6 | Gap shopping list and edge cases | 9–10 | blunt subtraction → trusted shelf and separate override |
| 7 | Complete capability list and FAQ | 5, 10 | unresolved objections → bounded shipped answers |
| 8 | Closing outcome and CTA | 11–12 | stock that exists in memory → a shelf number ready to use |

### Step 5 — Character Voices

- **Reader's words for the problem:** “what is on the shelf,” “physical count,” “on hand,” “fresh,” “stale,” “never counted,” “what to buy,” “whole packs,” and “the next shopping list.” These come from the shipped feature register, RC-22, RC-23, RC-31, RC-43, and the established Features navigation story.
- **Product voice:** competent, kitchen-literate, unfussy.
- **Banned words:** seamless, powerful, robust. Also avoid real-time inventory, live count, automatic replenishment, shrinkage blame, savings guarantees, and any suggestion that stale stock reduces buying.

### Step 6 — Dialogue (McKee): the turn in each section

1. The hero moves from an exact-looking quantity to a number with a visible trust state.
2. The remembered case turns from harmless shortcut to an empty-shelf morning.
3. Constant recounting becomes one dated baseline plus the movement after it.
4. A running total becomes an append-only movement history with shelf value held to its date.
5. Need-minus-stock becomes a guarded equation that accepts only trusted on-hand quantity.
6. Stale and never-counted states move from ambiguous warnings to direct recovery actions.
7. The remaining practical objections move from implied doubt to bounded, shipped answers.
8. Another list built from memory becomes a shelf number ready to use.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Buy what the next jobs need without rebuying food already on the shelf.
- **Obstacle:** The on-hand quantity may look exact even when its physical-count baseline no longer deserves trust.
- **Headline:** Know when the shelf number deserves your trust.
- **Subhead:** Start with a physical count. Carry every dated movement after it. If the result is stale or unsupported, say so before it changes what you buy.

### Step 8 — Cool Talk: the one snap line

> A stale count is not a low count.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the walk-in door with a phone in one hand and tomorrow's shopping list in the other.
- **What they see / hear / feel:** A shelf label, an empty space where the case should be, compressor noise, prep starting nearby, and an old on-screen quantity that still looks certain.
- **Time of day:** 5:30 a.m., after buying is done and before the missing case can be replaced easily.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-offs:**
  1. Hero → problem: “The empty shelf was hidden inside an exact number.”
  2. Problem → navigator: “A stale count is not a low count. It is a question that still needs an answer.”
  3. Navigator → count: “Reset the baseline and keep freshness beside the quantity.”
  4. Count → movement: “Let the dated movement explain what came next.”
  5. Movement → gap: “Once the shelf has earned trust, it can be allowed into the buy equation.”
  6. Gap → recovery: “Every shelf state gets a different answer.”
  7. Recovery → diligence: “With the guardrail visible, the remaining questions are about history, par, and earlier dates.”
  8. FAQ → ending: “Bring one real shopping list and count one shelf.”

### Step 11 — Revise and Finish

- **Word count:** 989 visible words in the built page's main story, including capability and FAQ disclosures.
- **Claims removed because they could not be shown:** infallible live inventory, automatic replenishment to par, stale stock reducing buying, automatic waste or shrinkage blame, guaranteed savings, and invented time or margin outcomes.
- **Evidence revision:** Every constructed count, movement, value, and buy-gap figure is marked illustrative. The page uses no unrelated product screenshot as borrowed proof.
- **Responsive revision:** The hero arithmetic and buy-gap equation stack without nested scrolling; movement rows reflow into dated mobile records; actions become full width; the page survives 320px at 200% text.
- **Final Image:** A shelf number ready to use.


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy owner of a six-person catering kitchen wants to buy only the stock needed, but an old count looks current.
- [x] 2 Character: Wants a usable answer between services; needs a traceable result; remembers a costly spreadsheet mistake; habitually postpones setup.
- [x] 3 Plot: (1) interrupted service gap; (2) one dependable answer; (3) separate records; (4) an old count looks current; (5) asks what to enter; (6) tries the relevant CostCook task; (7) hands the result to the crew; (8) follows the worked example; (9) checks its labelled numbers; (10) reads missing-data and release limits; (11) sees the cost of guessing; (12) chooses a trial or booked demo.
- [x] 4 Scenes: hero, daily problem, task navigation, worked example, exceptions, detailed questions, next step. Turns: uncertainty to purpose; familiarity to need; confusion to action; doubt to evidence; risk to limits; questions to answers; hesitation to informed choice. Existing route and layout retained.
- [x] 5 Voices: Reader asks “What do I enter?” and “Can my kitchen use this today?” (persona prompts, not customer quotes). Product is calm, concrete and kitchen-literate; ban seamless, powerful and robust.
- [x] 6 Dialogue: Each scene answers the next practical question instead of explaining internal architecture.
- [x] 7 Intention/obstacle: buy only the stock needed / an old count looks current. Headline: “Check your stock before you buy more.” Supporting line: “Count an ingredient first. Recorded deliveries, waste and packed orders update the quantity. Old or missing counts do not reduce what the shopping list buys.”
- [x] 8 Snap: “A stale count is not a low count.” Retain this concrete detail; cut competing abstract slogans.
- [x] 9 Setting: Phone beside the prep bench, a short gap between services, crew waiting for the next list.
- [x] 10 Connection: You throughout; inputs lead to results, results to limits, limits to the trial decision. Shared terms keep the next action consistent.
- [x] 11 Revision: Build and claim checks passed; every feature route inspected at desktop and mobile, with native disclosures and no JavaScript. Five-width regression checks and 320px/200% text passed. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

## Claim correction · 2026-09-27 (buying to par shipped)

- [x] 11 Revision: Buying to par left the Coming list by shipping. Inventory > Build shopping list builds what to buy for confirmed events and your par, by supplier (kitchen-brain e2e/buy-to-par.spec.ts). The Coming band now carries two plans, the /compare row is Yes, and the inventory answers say so. Beats and snap line unchanged. Gap report F1; RC-43.
