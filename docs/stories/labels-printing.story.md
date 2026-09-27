# Story Tracker — Kitchen labels and printing

## My story

- **Piece:** Kitchen label printing across the site: `/features/labels-and-printing`, the header menu item (Coming chip), the `/features` group, the `/compare` row note, the FAQ entry, the homepage give-up line
- **Title / headline:** The sticker says what you chose. Nothing more.
- **My hero's name:** The cook at the prep bench at 5 a.m. with forty containers cooling and a roll of blank stickers, who has been burned by a use-by date somebody guessed
- **Content file(s):** `src/lib/labels.ts`, `src/lib/availability.ts`, `src/components/sections/LabelsPrintingFeature.astro`, `src/pages/features/labels-and-printing.astro`, `src/lib/features.ts` (labels group, menu item), `src/lib/comparison.ts` (row note), `src/lib/faq.ts` (#label-printing), `src/components/sections/TheOtherTools.astro` (give-up), `src/components/sections/FeatureIndex.astro`, `src/pages/compare.astro`, `src/pages/pricing.astro`, `scripts/capture-labels-proof.mjs`

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

> A cook needs a date-and-allergen sticker on every container before the walk-in door closes, but every label tool either guesses the date for them or makes them retype the dish, and the owner reading this page has been sold "label printing" that turned out to be a PDF.

### Step 2 — Your Character

- **Want:** A sticker on the tub, now, that an inspector will accept.
- **Need:** A date they chose and can defend, on a label that says exactly what was recorded.
- **Wound:** A use-by date a tool defaulted to, found on a container two days late.
- **Flaw:** Will take a default to save a tap, and will read "Coming" as "never".

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | 5 a.m., forty containers, a marker, and a guess. |
| 2 Theme Stated | The sticker says what you chose. Nothing more. |
| 3 Set-Up | Where the Label button lives: prep, pack, recipe, ingredient. |
| 4 Catalyst | The dialog asks the one thing the app cannot know. No default. |
| 5 Debate | Who picks the date? You do: a saved rule, days, a date, or made-date only. |
| 6 Break into Two | One label per container, numbered. |
| 7 B Story | The founder's rule: it is behind a flag and marked Coming, said in a sentence, not hidden in a chip. |
| 8 Fun and Games | The sticker preview, in millimetres, with the blank allergen line explained. |
| 9 Midpoint | Print; what the sticker said is frozen. |
| 10 Bad Guys Close In | What it is not: no printer connection, no guessed date, no all-clear. |
| 11 All Is Lost | The flaw reads Coming as never. |
| 12 Finale + Final Image | The print view, 2 of 2, reprintable; the CTA for everything that ships today. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Hero: status chip, headline, status sentence, dialog capture | 1–2, 7 | a guessed date → a chosen one; a chip → a sentence |
| 2 | How a label is made (six steps) + sticker | 3–6, 8 | retyping → six explicit decisions |
| 3 | The record + print view | 9 | a soaked sticker → a tap |
| 4 | What it prints on + settings capture | 8 | brand lock-in → millimetres |
| 5 | What it is not | 10 | a sales page → boundaries |
| 6 | FAQ + closing | 11–12 | "never" → "when the word changes" |
| 7 | Menu, /features group, /compare, FAQ, give-up | — | one status word from one file |

### Step 5 — Character Voices

- **Reader's words:** the walk-in, the tub, use-by, made on, how many containers, the inspector, the sticker roll.
- **Product voice:** the app's own labels, verbatim: "The one thing the app can't know. No default", "Nothing prints until you choose", "A blank label is not an all-clear", "Printing records what the sticker said, so a soaked one costs a tap".
- **Banned:** printer brand names, "sends to your printer", "compliant", "available" while the word is Coming, em-dashes, exclamation points.

### Step 6 — Dialogue

Each step turns "the app decides" into "you decide and it records". The status sentence turns the chip into a fact with a condition.

### Step 7 — Sorkin

- **Intention:** Put a defensible date on the container in six steps.
- **Obstacle:** It is built but not in the plan the reader can buy today.
- **Headline:** "The sticker says what you chose. Nothing more."

### Step 8 — Cool Talk

**"Printing records what the sticker said, so a soaked one costs a tap."** The app's own line under the print button.

### Step 9 — Bringing a Scene to Life

Wet hands, the walk-in door held with a foot, a phone propped on the lowboy. Refrigerated. Seven days. Two tubs. Print. The sheet comes out of the office printer down the hall.

### Step 10 — Connecting Your Scenes

- POV: second person; the cook is "you", the owner reads over their shoulder.
- Status: `LABELS_STATUS` and `labelsAvailability` in `src/lib/labels.ts` feed the chip, group badge, row, FAQ, homepage tradeoff, SEO description and status sentence. The shared Coming definition says only that the feature is absent today; the feature detail names whether it is being built or already behind a flag. RC-35 owns the word.
- Hand-off: the closing sends the reader to the trial for everything that ships and to `/features` for the rest.

### Step 11 — Revise and Finish

- Cut: the phone dialog capture (1700 CSS px tall; one responsive picture serves the sticker instead), the seeded device name from every alt, "printer-ready output" from the old group line, the unverified "six taps" count, and a trial action beside a Coming promise.
- Added: first-frame proof, status-aligned hero action, an on-page chapter index, full-size proof links, 72px FAQ targets, explicit trial terms at the close, and one atomic availability object for every public status surface.
- Every capability traces to `src/routes/labels/*`, `src/lib/domain/labeling/*`, `src/lib/labels/transport.ts` and `src/lib/server/features/access.ts` at sandbox/demo c01bf751; RC-51 lists them.
- Ending: "Print what you chose. Keep the record." then the primary CTA.
- 2026-08-30 revision: public copy now says only what the reader needs to decide: Labels is Coming and is not included today. The internal sandbox and release-flag provenance remains in RC-51, not on the page.


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy caterer wants to decide whether this part of CostCook fits her kitchen, but technical wording obscures the task and its limits.
- [x] 2 Character: Six-person operation; spreadsheet competent; wants a quick answer, needs evidence, distrusts vague promises and delays setup.
- [x] 3 Plot: service gap → need for clarity → scattered records → a client question → doubt about setup → inspect CostCook → crew handoff → task examples → labelled result → missing evidence → risk of assuming → informed next step.
- [x] 4 Scenes: orientation, kitchen problem, first action, example, limits, questions, next step; each moves from uncertainty to an explicit answer. Existing layout retained.
- [x] 5 Voice: Plain kitchen English; reader questions are persona assumptions, not testimonials. No seamless, powerful or robust.
- [x] 6 Dialogue: Availability precedes commitment; every next step names its outcome.
- [x] 7 Intention/obstacle: Find the relevant kitchen task without decoding implementation terms.
- [x] 8 Snap: Keep the existing concrete kitchen image; remove abstract slogans that compete with it.
- [x] 9 Scene: A phone at the prep bench between services.
- [x] 10 Connection: You throughout; choose a task, inspect what it does, read limits, decide.
- [x] 11 Revision: Built pages, shared consumers, status wording, five responsive widths and 320px/200% text verified. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

## Claim correction · 2026-09-27 (kitchen labels available)

- [x] 11 Revision: The owner approved the RC-35 labels launch decision on 2026-09-27 and LABELS_STATUS is now yes. Kitchen date labels print from Prep and Pack through the browser; label stock is set once in Settings > Labels. The premise that the whole feature sat behind the label_printing flag was false (gap report F2). Every Coming sentence about kitchen labels is gone; the browser-only, never-guessed-date and blank-allergen boundaries stay. Beats and point of view unchanged; the labels page hero now states availability instead of a preview.
