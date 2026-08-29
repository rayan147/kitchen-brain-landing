# Story Tracker — Nutrition facts & allergens specialist page

## My story

- **Piece:** Specialist feature page and redesign prompt
- **Title / headline:** One recipe. Two answers you cannot guess at.
- **My hero's name:** The meal-prep owner labeling Sunday’s containers while a customer waits for calories, protein, and an allergen answer
- **Content file(s):** `src/pages/features/nutrition-facts-and-allergens.astro`, `src/components/sections/NutritionFactsAllergensFeature.astro`, `docs/prompts/nutrition-facts-allergens-redesign.prompt.md`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. | ☒ |

### Step 1 — The Idea

> A meal-prep owner wants calories, protein, and an allergen answer on Sunday’s containers, but the recipe, nutrition spreadsheet, and supplier evidence do not agree.

### Step 2 — Your Character

- **Want:** Put useful nutrition and allergen information beside each dish before the containers leave.
- **Need:** Both answers to follow the same ingredient and recipe record, with missing evidence visible.
- **Wound:** A complete-looking panel that quietly counted missing values as zero, and an allergen answer based on an ingredient name rather than evidence.
- **Flaw:** Prefers a quick yes or a full panel even when the honest answer is incomplete.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Sunday night: cooling containers, a label roll, and a customer asking about protein and milk. |
| 2 Theme Stated | One recipe should carry both answers, but neither answer should outrun its evidence. |
| 3 Set-Up | Calories live in one sheet, allergens in another, and every recipe edit starts a second round of copying. |
| 4 Catalyst | The burrito bowl recipe changes; the old label and allergen note no longer describe the food. |
| 5 Debate | Can software be trusted when a nutrient source or allergen review is missing? |
| 6 Break into Two | CostCook computes nutrition from matched ingredient profiles and rolls evidence-backed allergen tags into the recipe. |
| 7 B Story | The customer and the cook both need an honest answer more than a fast, polished one. |
| 8 Fun and Games | Per-portion macros, the full fifteen-row panel, source records, incomplete states, recipe roll-up, pack-list badges, and browser print. |
| 9 Midpoint | An actual 297 g Chicken Burrito Bowl fills all fifteen rows from USDA FoodData Central branded record 2704502: 339 calories, 22 g protein, 48.1 g carbohydrate, 7 g fat, and confirmed milk and soy allergens. |
| 10 Bad Guys Close In | Missing profiles, unreviewed ingredients, dietary assumptions, ingredient order, and label-printer expectations test the claim. |
| 11 All Is Lost | A full-looking answer would be easier to print and harder to defend. |
| 12 Finale + Final Image | The owner prints the sourced estimate, keeps incomplete review visible, and answers the customer without pretending certainty. |

### Step 4 — From Beats to Scenes

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero: one recipe, two answers | 1–2 | separate guesses → one evidence path |
| 2 | The Sunday-night split | 3–5 | convenient completeness → useful doubt |
| 3 | Nutrition Facts Software | 6, 8–9 | numbers → sourced per-portion panel |
| 4 | Allergen Management | 6–8 | name-based assumption → evidence-backed review |
| 5 | One printable record | 7, 9 | told → shown in an authentic sheet |
| 6 | Boundaries and capabilities | 10–11 | uncertainty hidden → uncertainty named |
| 7 | FAQ and close | 5, 12 | hesitation → a defensible next label |

### Step 5 — Character Voices

- **Reader's words:** calories, protein, per portion, contains milk, package label, supplier sheet, print the label, Sunday night.
- **Product voice:** calm, exact, candid. Banned: compliant, accurate, automatic, allergen-free, seamless, powerful.

### Step 6 — Dialogue

- Hero: “I need an answer now” → “the answer can stay attached to the recipe.”
- Problem: “a full panel feels safer” → “a blank is safer than a guess.”
- Nutrition: “the number is the proof” → “the source and missing state are part of the number.”
- Allergens: “the ingredient name tells me” → “supplier, package, or kitchen review tells me.”
- Print: “printing finishes the job” → “printing carries the evidence and boundary forward.”
- Trust: “software should fill every row” → “software should stop where the evidence stops.”
- Close: “I have to reconcile this again” → “I can print from the recipe I just reviewed.”

### Step 7 — Sorkin

- **Intention:** Answer the customer and label the containers.
- **Obstacle:** The owner cannot defend a nutrition number or allergen claim assembled from disconnected notes.
- **Headline:** One recipe. Two answers you cannot guess at.
- **Subhead:** Compute the fifteen Nutrition Facts values per portion, roll evidence-backed allergen tags into the recipe, and keep every missing fact visible before you print.

### Step 8 — Cool Talk

> A blank row beats a made-up zero.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At a stainless prep table beside cooling meal-prep containers and a browser-connected label printer.
- **What they see / hear / feel:** A customer message, a roll of blank stock, the old spreadsheet, and the uneasy pause before answering “contains milk.”
- **Time of day:** Sunday, 9 p.m.

### Step 10 — Connecting Your Scenes

- **POV:** Second person throughout.
- **Hand-offs:** The customer’s two questions lead to two product chapters; the nutrition chapter hands its missing-value rule to allergen evidence; both converge in the printed sheet; the sheet’s disclaimers open the trust section; the FAQ resolves buying objections; the CTA returns to the next real recipe.

### Step 11 — Revise and Finish

- **Decision-frame revision, 2026-08-29:** Removed the hand-built four-macro panel that repeated the authentic Chicken Burrito Bowl capture and pushed both decisions below the first viewport. The shared display scale, central demo label, launch terms, self-identifying proof links, and 320 px/200% text recovery now keep the product evidence and the decision in the same frame. The seven-scene order, second-person point of view, safety boundaries, and single snap line remain unchanged.

- **Complete-dish proof revision, 2026-08-29:** Replaced the partial Chicken Shawarma capture with an actual 297 g Chicken Burrito Bowl built from manufacturer analytical data in USDA FoodData Central branded record 2704502. The record supplies all fifteen label nutrients, including explicit zeros for trans fat, added sugars, and vitamin D, and the product evidence confirms milk and soy. Recaptured the live CostCook summary, complete panel, evidence card, and printable sheet at 2× pixel density; constrained the allergen proof to its native reading width instead of enlarging it across the page. The missing-value principle remains in the narrative because completeness still depends on the source, but the midpoint now demonstrates the complete case the reader asked to see.

- **Screenshot revision, 2026-08-29:** Re-exported the verified source capture into high-resolution, task-specific assets for the summary, Nutrition Facts panel, allergen review, and print label. Desktop and mobile now receive crops composed for their available width instead of CSS-positioned slices of the full dashboard. The hero caption was tightened to explain that the proof is cropped to the answer; the story order, claims, point of view, and snap line remain unchanged.

- **Readability revision, 2026-08-29:** Replaced reduced full-screen repeats with magnified nutrition, allergen, and print crops; added full-size capture links; opened the allergen evidence path from four tight columns to a 2×2 reading rhythm. The story order, point of view, claims, and single snap line are unchanged.

- **Word count before → after:** 1,320 → target under 900 words in the rendered page.
- **Claims removed because they could not be shown:** FDA compliance, regulatory ingredient ordering, dietary-characteristic assessment, allergen-free status, fully automatic allergen inference, direct label-printer integration.
- **Final Image:** Print the next label from the recipe you can show your working for.
