# Story Tracker — Resources navigation

## My story

- **Piece:** Navigation explainer copy
- **Title:** Choose the proof or answer you need
- **My hero:** A caterer evaluating CostCook who is not ready to start yet
- **Content files:** `src/lib/site.ts`, `src/components/ResourcesMenuContents.astro`

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ |
| 4 | From Beats to Scenes | ☑ |
| 5 | Character Voices | ☑ |
| 6 | Writing Dialogue | ☑ |
| 7 | Sorkin Dialogue | ☑ |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ |
| 10 | Connecting Your Scenes | ☑ |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

A caterer who wants one specific kind of proof before deciding but a list of bare destination names makes them open pages to learn what each contains.

### Step 2 — Your Character

- **Want:** Reach the useful proof quickly.
- **Need:** Understand the job of each resource before leaving the current page.
- **Wound:** Losing their place in a marketing site after opening vague links.
- **Flaw:** Treating every “resource” as interchangeable until a page proves otherwise.

### Step 3 — The Plot

| Beat | In this menu |
|------|--------------|
| Opening Image | Five plain links under one broad label. |
| Theme Stated | A destination should explain the question it answers. |
| Set-Up | Tour, audience fit, comparison, FAQ, and contact look equal but serve different decisions. |
| Catalyst | The reader pauses because “How we compare” does not say what comparison is shown. |
| Debate | Open several pages or leave. |
| Break into Two | Each route gains a distinct icon and one outcome-led description. |
| B Story | The reader's time and current page context are protected. |
| Fun and Games | Watch the full workflow, check fit, compare choices, find an answer, or reach Rayan. |
| Midpoint | The right next page is recognizable before navigation. |
| Bad Guys Close In | Too much menu copy could crowd the header or bury primary actions. |
| All Is Lost | A giant mega-menu would solve description but create a new scanning problem. |
| Finale + Final Image | One compact two-column panel presents five differentiated paths and keeps all routes available without JavaScript. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Understand the product | Opening–break | vague tour → visible walkthrough |
| 2 | Make the decision | B story–midpoint | generic links → distinct questions |
| 3 | Keep it compact | pressure–finale | menu sprawl → bounded choice |

### Step 5 — Character Voices

- **Reader:** “Show me how it works,” “Is this for my kitchen?”, “Can I talk to someone?”
- **Product:** plain, specific, founder-direct. Banned: resources, learn more, discover.

### Step 6 — Dialogue turns

Each description converts a destination label into the decision it helps the reader make.

### Step 7 — Headline / subhead

- **Intention:** Find the right evidence.
- **Obstacle:** The route names alone do not reveal the evidence inside.
- **Headline:** Resources
- **Subhead:** Choose the proof or answer you need next.

### Step 8 — The one snap line

> Five paths, each answering a different hesitation.

### Step 9 — Bringing the scene to life

- **Where:** In the shared header while evaluating another page.
- **Sensory detail:** A compact paper panel under the trigger, not a full-screen interruption.
- **Time:** The moment before the reader decides whether to keep evaluating.

### Step 10 — Connecting the scenes

- **POV:** Second person implied by action descriptions.
- **Hand-offs:** understand → decide → ask.

### Step 11 — Revise and finish

- Kept every description to one short, outcome-led sentence.
- Avoided repeating the route label in its description.
- **Final image:** The reader recognizes the next useful page without trial-and-error navigation.



## Caterer first-visit revision · 2026-09-11

Content: `src/lib/site.ts` and its shared data/response states.

- [x] 1 — Idea: A busy caterer wants to find the right guide, but vague destinations hide the next step.
- [x] 2 — Character: Runs six people; spreadsheet competent, nontechnical, between services. Wants a quick decision; needs checkable inputs, limits and next action; remembers abandoned software setup; assumes unfamiliar words mean more work.
- [x] 3 — Twelve beats: Interrupted service → clear next decision → existing spreadsheet work → unclear promise → time/card doubt → open the relevant CostCook guide → crew needs a usable plan → inspect the example → understand one concrete outcome → check missing data and limits → avoid another unexplained commitment → choose a guide, trial or human answer knowingly.
- [x] 4 — Six scenes: Entry (uncertain → oriented); prerequisites (unknown → prepared); example (claim → evidence); consequences (guess → known); limits/recovery (risk → choice); next action (pause → decision). These map to existing sections and response states, without adding narrative scaffolding.
- [x] 5 — Voices: Persona questions are simulated, not interview quotes. Reader: “What do I need?”, “Does this include my crew?”, “Did it send?” Product: calm, concrete, kitchen-literate; ban seeded, mechanism, release flag from explanatory copy.
- [x] 6 — Dialogue: Each scene answers the question raised by the last; retain numbers and limits that change the decision, remove editorial commentary.
- [x] 7 — Intention/obstacle: Help her find the right guide; explain the work required before asking her to act.
- [x] 8 — Snap: “Choose a guide, check the limits, or ask Rayan.”
- [x] 9 — Scene: Phone beside the prep list, crew waiting for the next service; attention is limited, not competence.
- [x] 10 — Connection: Reader-focused guide prose; founder voice explicitly identifies Rayan where he answers. Entry → evidence → constraints → action.
- [x] 11 — Revision: Rendered copy, units, navigation and recovery verified. Build and claim checks pass; eight routes at five widths, 200% text, thirteen tour stops, no-JS fallback and mocked contact failure/retry/success pass. Evidence: `docs/qa/resources-caterer-2026-09-11/report.md`.
