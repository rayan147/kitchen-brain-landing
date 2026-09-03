# Story Tracker — Recipes & Costing redesign prompt

## My story

- **Piece:** Implementation prompt and finished two-feature marketing page
- **Title / headline:** Redesign Recipes & Costing as two connected product stories
- **My hero's name:** The working chef-owner
- **Content file(s):** `docs/prompts/recipes-and-costing-redesign.prompt.md`, `src/components/sections/RecipesCostingFeature.astro`, `src/pages/features/recipes-and-costing.astro`, `src/components/sections/EveryFeature.astro`

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

> A working chef-owner who wants every recipe ready for service and every quote grounded in current costs, but recipes, prep knowledge, and ingredient prices live in different places.

### Step 2 — Your Character

- **Want (surface):** Find, scale, share, and cost a recipe without rebuilding it in another tool.
- **Need (real):** One dependable recipe record that supports both kitchen execution and business decisions.
- **Wound (the bad day):** A familiar prep method lived in one person's head while an old ingredient price made a job look more profitable than it was.
- **Flaw (the habit):** Keeping the working recipe in memory or a document and the “real” cost in a separate spreadsheet.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | The chef-owner moves between a binder, a phone photo, and a cost sheet before service. |
| 2 Theme Stated — the truth they'll learn | A recipe should tell the kitchen how to make it and the owner what it costs. |
| 3 Set-Up — the daily grind, the flaw on display | Recipes drift, scaling is manual, and prices age quietly in a separate file. |
| 4 Catalyst — the bad day / the wall hits | A team member needs the current method while a quote must go out on the same day. |
| 5 Debate — “can it be different?” | The reader worries that organizing everything will become another setup project. |
| 6 Break into Two — they try the new way | CostCook becomes one working recipe record, shown through the product rather than described abstractly. |
| 7 B Story — the person/relationship it's really about | The handoff between the person who writes the recipe and the person who must prep, price, or repeat it. |
| 8 Fun and Games — the promise of the premise | Recipe Management shows drafts, readiness, publishing, earlier versions, filing, structured methods and kitchen view; Recipe Costing shows ingredient math, yield, portion cost and decision support. |
| 9 Midpoint — first real win, with a number | A real or explicitly illustrative recipe example changes batch size and exposes the resulting cost per portion. |
| 10 Bad Guys Close In — the edge cases, the doubts | A price changes, a sub-recipe is reused, the screen shrinks to a phone, or data is incomplete; the interface shows what updates and what still needs attention. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | Another busy week leaves the kitchen following one version while the quote uses another. |
| 12 Finale + Final Image — life after; the CTA in their words | The recipe is ready for the line and the cost is ready to say out loud; the visitor starts or books the next step. |

### Step 4 — From Beats to Scenes (8 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero: one recipe, two jobs | 1–2 | scattered → one dependable record |
| 2 | The split workflow today | 3–4 | familiar workaround → visible operational cost |
| 3 | Product selector / story fork | 5–6 | “too much setup” → choose the job that matters now |
| 4 | Recipe lifecycle feature story | 7–8 | tribal knowledge and version drift → a publishable, recoverable kitchen record |
| 5 | Recipe Costing feature story | 8–9 | old spreadsheet → inspectable cost |
| 6 | Connected proof and edge cases | 9–10 | first win → earned trust |
| 7 | Frequently asked questions | 5, 10 | unresolved objections → specific answers |
| 8 | Closing outcome and CTA | 11–12 | another week of drift → recipe and number ready |

### Step 5 — Character Voices

- **Reader's words for the problem:** “the case price was different,” “what a plate costs,” “what to buy, cook, and pack,” “what am I actually making on this,” and “the number you say out loud.” These come from the current CostCook route, repository story materials, and its established kitchen vocabulary.
- **Product voice:** competent, kitchen-literate, unfussy.
- **Banned words:** seamless, powerful, robust. Also avoid all-in-one, generic efficiency claims, and borrowed competitor language.

### Step 6 — Dialogue (McKee): the turn in each section

1. The hero moves from two disconnected jobs to one shared recipe record.
2. The familiar workaround turns from manageable to visibly fragile.
3. A dense feature category becomes two clear paths the reader can choose between.
4. Recipe knowledge moves from memory and loose documents to a draft, readiness check, published kitchen view and readable history.
5. Cost moves from a static total to arithmetic the reader can inspect.
6. A promising first result is tested by missing prices, reused sub-recipes, and scaling, then holds.
7. The remaining practical objections move from implied uncertainty to concise, inspectable answers grounded in shipped behavior.
8. Another week of drift becomes a recipe ready for the line and a cost ready for the quote.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Run the dish consistently and quote it confidently.
- **Obstacle:** The working method and the current cost live in different places.
- **Headline:** The recipe has to work on the line and in the quote.
- **Subhead:** When the method lives in one place and the cost in another, one of them goes stale. Keep the working recipe and the number you say out loud connected.

### Step 8 — Cool Talk: the one snap line

> A sauce is one recipe, even in five dishes.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the edge of a prep table, moving between a recipe, a supplier price, and the quote that must go out.
- **What they see / hear / feel:** A marked-up binder, a phone, a spreadsheet cell with an old number, the noise of prep continuing around them, and the pressure of answering before every figure has been checked.
- **Time of day:** Late enough that prep has started, early enough that the customer still expects the quote today.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-offs:**
  1. Hero → problem: “The split feels harmless until both versions are needed on the same day.”
  2. Problem → navigator: “One working recipe should carry both the method and the math.”
  3. Navigator → management: “Start with the part the kitchen has to repeat.”
  4. Management → costing: “Once the recipe is dependable, the number can show its work.”
  5. Costing → connected proof: “The test is what happens when one sauce appears in five dishes.”
  6. Proof → FAQ: “The working holds; the remaining questions are about how it behaves in your kitchen.”
  7. FAQ → ending: “With the practical questions answered, the recipe and the quote can leave the same room together.”

### Step 11 — Revise and Finish

- **Word count before → after:** 2,087 words in the implementation prompt → 386 rendered article words in the finished route, including capability labels, lifecycle guidance, FAQs, and onward navigation.
- **Claims removed because they could not be shown:** generic time savings, invented ROI, customer outcomes, “real-time” integrations, AI import, multimedia training and multi-location publishing. Version history is now included because the marketed app exposes earlier published recipe versions.
- **Browser revision:** The desktop and mobile passes kept both product chapters in one reading flow, removed mobile horizontal scrolling from the recipe builder, retained the actual CostCook screenshots in the costing chapter, and added a clear entry from the existing Features hub.
- **FAQ revision:** Six concise disclosures answer the last practical objections about scaling, sub-recipes, missing prices, visible arithmetic, print/export, and confirmed quote prices. Every answer stays inside the shipped feature register.
- **Final Image:** The recipe is ready for the line, the price is ready for the quote, and the next step asks the visitor to bring one real menu.
