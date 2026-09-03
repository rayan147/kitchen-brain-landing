# Story Tracker — Nutrition facts

## My story

- **Piece:** Nutrition facts across the site: homepage section, header menu item, `/features` group and area figure, `/compare` rows, FAQ entry, the give-ups list
- **Title / headline:** The numbers on the label, from the recipe you already costed.
- **My hero's name:** The meal-prep owner whose customers ask for calories and protein before they ask for a price
- **Content file(s):** `src/lib/nutrition.ts`, `src/components/sections/NutritionFacts.astro`, `src/lib/features.ts` (nutrition group, compliance meta, menu item), `src/lib/comparison.ts` (printed row), `src/lib/faq.ts` (#labels), `src/components/sections/TheOtherTools.astro` (give-up swap), `src/components/FeatureAreaFigure.astro` (compliance figure)

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

> A meal-prep owner needs calories and protein on every container by Sunday night, but the numbers live in a spreadsheet nobody trusts and a label tool that does not know the recipe.

### Step 2 — Your Character

- **Want:** A number per portion they can put on the container and defend when a customer asks.
- **Need:** The number to come from the same recipe that prices the container, so it moves when the recipe moves.
- **Wound:** A label with a made-up sodium figure. A "compliant" claim from a tool that turned out to guess.
- **Flaw:** Will take a full-looking panel over an honest partial one, and get burned by it.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Sunday night, containers, no numbers. |
| 2 Theme Stated | From the recipe you already costed. |
| 3 Set-Up | Calories, protein, carbs, fat at the top of the recipe. |
| 4 Catalyst | Fifteen numbers under them, per portion. |
| 5 Debate | Where do they come from? USDA records, matched once per ingredient. |
| 6 Break into Two | Partial is said out loud: a blank row, not a zero. |
| 7 B Story | The founder's rule: an incomplete dish is never totalled as complete. |
| 8 Fun and Games | Print it; allergens ride along with evidence. |
| 9 Midpoint | The sheet says on itself that it is an estimate, not a compliance claim. |
| 10 Bad Guys Close In | What it is not: not compliance, not dietary tags, not weight order, not a printer. |
| 11 All Is Lost | The flaw wants the full panel anyway. |
| 12 Finale + Final Image | The capture: a real panel with real blanks, and a sheet that prints. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Eyebrow, headline, lede | 1–2 | a spreadsheet nobody trusts → the recipe you already trust |
| 2 | Five points | 3–8 | numbers → sourced, partial-honest, printable, allergen-aware numbers |
| 3 | The captures | 9, 12 | told → shown, blanks and all |
| 4 | What it is not | 10–11 | a full-looking panel → an honest one |
| 5 | Menu, compare, feature area, FAQ | — | one status: the sheet ships, the printer does not |

### Step 5 — Character Voices

- **Reader's words:** calories, protein, macros, the container, the label, the customer asks, Sunday night.
- **Product voice:** the app's own labels, verbatim: "Some nutrients unavailable", "Missing values stay blank instead of being counted as zero", "This is not an allergen-free claim", "not a claim of retail-label regulatory compliance".
- **Banned:** compliant, FDA-approved, certified, "accurate", exclamation points, em-dashes.

### Step 6 — Dialogue

Each point turns "a number" into "a number with a source and a boundary". The captures show a partial panel on purpose, because the partial is the claim.

### Step 7 — Sorkin

- **Intention:** Put a defensible number on the container.
- **Obstacle:** Every tool that promised one guessed.
- **Headline:** "The numbers on the label, from the recipe you already costed."

### Step 8 — Cool Talk

**"Missing values stay blank instead of being counted as zero."** The app's own sentence, and the one no label tool the reader has used would print.

### Step 9 — Bringing a Scene to Life

Sunday, 9 p.m., forty containers cooling, a roll of label stock, and a customer text asking how much protein is in the shawarma bowl. The recipe already knows.

### Step 10 — Connecting Your Scenes

- POV: second person; the meal-prep kitchen named once in the lede, not as a persona card.
- Hand-off: TheYield (the line moves the quantity) → NutritionFacts (the line carries the numbers) → PaperIn (how the prices got in). `stops.ts` carries the order.
- One status: `/compare` says the sheet is Yes and the printer is Coming; the give-ups list, the feature figure and the FAQ say the same.

### Step 11 — Revise and Finish

- Cut: "compliant" everywhere and "accurate". Dietary characteristics remain unassessed today, but owner confirmation on 2026-08-30 moved them from No to Coming; public boundaries now state both facts together.
- The printed-label status was moved from Coming to Yes on evidence (RC-50), and every surface that argued the old status was rewritten rather than left to contradict.
- Ending: the feature-area link, then the hand-off to PaperIn.
