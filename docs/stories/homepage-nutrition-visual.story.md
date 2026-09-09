# Story Tracker — Homepage nutrition evidence guide

## My story

- **Piece:** Homepage nutrition and allergen explainer
- **Title / headline:** Calories and protein, per portion, on the recipe you already costed.
- **My hero's name:** The chef-owner answering a customer nutrition or allergen question from an already-costed recipe
- **Content file(s):** `src/components/sections/NutritionFacts.astro`

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

> A chef-owner wants to answer a customer’s nutrition or allergen question from an already-costed recipe, but source matching, missing nutrient values, label limits, and allergen evidence make a simple total unsafe.

### Step 2 — Your Character

- **Want:** See calories, protein, carbs, fat, and the full panel per portion without rebuilding the recipe.
- **Need:** Know which numbers and allergen statements are supported, partial, or still waiting for review.
- **Wound:** A calculated panel looked complete because missing values were silently counted as zero, or an allergen assumption travelled farther than its evidence.
- **Flaw:** Treats the finished-looking total as more trustworthy than the source trail beneath it.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | A customer asks for the four numbers they recognize: calories, protein, carbs, and fat. |
| 2 Theme Stated | A useful panel must show where its numbers came from and where they stop. |
| 3 Set-Up | The recipe is already costed, portioned, and full of ingredients and sub-recipes. |
| 4 Catalyst | Nutrition is needed per portion, not as a second disconnected recipe. |
| 5 Debate | Can a calculated result be trusted when profiles or allergen reviews are incomplete? |
| 6 Break into Two | Each ingredient is deliberately matched to a USDA FoodData Central profile. |
| 7 B Story | The same approved source follows that ingredient everywhere it appears. |
| 8 Fun and Games | Sub-recipes roll up and the recipe shows the four headline values plus the full panel. |
| 9 Midpoint | The chef can view the result per portion or per batch. |
| 10 Bad Guys Close In | A source lacks a nutrient value, or an ingredient has not been reviewed for allergens. |
| 11 All Is Lost | A blank treated as zero or an unsupported allergen-free claim would turn uncertainty into false confidence. |
| 12 Finale + Final Image | The printable sheet carries the panel, ingredient statement, allergen line, time, and calculated-estimate limitation with missing evidence still visible. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Per-portion answer | 1–4 | customer question → recipe-level nutrition view |
| 2 | Matched source | 5–7 | generic ingredient → reviewed USDA profile used everywhere |
| 3 | Explicit gaps | 8–11 | complete-looking total → partial result said out loud |
| 4 | Printed sheet | 12 | screen result → timestamped calculated-estimate label |
| 5 | Allergen evidence | 10–12 | assumption → supplier, package, or kitchen-review evidence |

### Step 5 — Character Voices

- **Reader's words:** per portion, per batch, raw, cooked, prepared, sub-recipe, blank, missing, print the label, ingredient statement, allergen line, package label, reviewed.
- **Product voice:** careful, inspectable, plain.
- **Banned:** certified, compliant, guaranteed, allergen-free.

### Step 6 — Dialogue

- Nutrition total: separate calculation → the recipe already costed.
- Source match: plausible database result → a profile chosen by the kitchen.
- Missing value: silent zero → visible blank and partial status.
- Print: generic browser output → a kitchen sheet with provenance and limitation.
- Allergens: inferred absence → evidence-backed tags and explicit unreviewed state.

### Step 7 — Sorkin

- **Intention:** Answer the customer from the recipe already in use.
- **Obstacle:** A finished-looking number can outrun its nutrition or allergen evidence.
- **Headline:** Calories and protein, per portion, on the recipe you already costed.
- **Subhead:** The result travels with its source, gaps, print limitation, and allergen evidence.

### Step 8 — Cool Talk

This section adds no second snap line. The homepage keeps its established one:

> The numbers move between them so you do not.

### Step 9 — Bringing a Scene to Life

- **Where they are:** Beside the recipe screen while a customer waits for an answer about the dish.
- **What they see / hear / feel:** Four familiar numbers, a missing-value warning, a supplier label, and the pressure to answer more confidently than the evidence allows.
- **Time of day:** During menu planning or before labels go onto prepared food.

### Step 10 — Connecting Your Scenes

- **POV:** You, locked throughout.
- **Hand-offs:** The portion result leads back to its USDA matches; those matches expose gaps; the gap policy protects the printed panel; the final allergen state remains attached to evidence.

### Step 11 — Revise and Finish

- **Word count before → after:** Core explanatory copy preserved; sequence, icons, and evidence states carry the hierarchy instead of extra prose.
- **Claims removed because they could not be shown:** None added or removed.
- **Final Image:** A printed calculated estimate whose nutrition gaps and allergen review state are still visible.

---

## REVISED 2026-09-09 — homepage copy-density pass

The homepage copy this tracker describes was shortened. Full working:
`BRIEF-copy-density-2026-09-09.md`. Tracker for the pass itself:
`docs/stories/homepage-copy-density.story.md`.

Five detail paragraphs were shortened. Each had spelled out what the cue rail
rendered directly beneath it (point 4 listed the panel, the ingredient statement,
the allergen line and the printed time; the cues read Panel / Ingredients /
Allergens / Printed time). The lede stopped stating the blank-not-zero rule,
which is point 3's whole claim. The caption dropped the numbers the alt text
carries and the disclaimer notClaimed[0] now carries in the guard's exact words.
The five points, the proof captures and the boundary list all remain.

No beat, section order, heading or value turn changed. Every cut was a claim
the page was making twice; nothing was removed for being unprovable.

---

## REVISED 2026-09-09 — scan path and depth pass

See [[homepage-scan-and-depth]]. Nothing in the beats above changed. What changed
in this section:

- **`#yield` and `#intake` eyebrows** now name their subject ("Trim and yield",
  "Invoices and price lists") instead of their place in the argument ("The hard
  part", "Before any of that"). Both hand-off lines picked the new words up from
  `src/lib/stops.ts`, where each label is written once.
- **`#nutrition`'s five-step evidence rail and `#sage`'s nine boundary rules**
  fold under 64rem behind `FoldedDetail.astro`. The claim above each stays
  visible; only the working folds. Both ship open in the served HTML, so a no-JS
  reader gets all of it and every `data-*` hook the build contracts read is still
  in `dist/index.html`.
- **The four split grids** (`yield`, `nutrition`, `intake`, Sage's two) now share
  `.split-layout` in `global.css` with a 27rem track floor, so iPad landscape
  gets two columns instead of the phone's stacked layout.

No claim was added, removed or reworded.
