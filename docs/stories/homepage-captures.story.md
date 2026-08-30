# Story Tracker — Homepage captures

## My story

- **Piece:** Every product screenshot on the homepage, retaken from the running app by one script, with alt text and captions rewritten from the new pixels
- **Title / headline:** (no new headline; the captures serve the sections' existing ones)
- **My hero's name:** The owner-caterer on a phone mid-shift who has seen a hundred SaaS "screenshots" that were mockups
- **Content file(s):** `scripts/capture-proof.mjs`, `public/proof/*.png`, alts in `src/components/sections/Hero.astro`, `CustomerOutcomes.astro`, `TheYield.astro`, `src/lib/nutrition.ts`, `src/lib/sage.ts`

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

> A caterer reading on a phone between two deliveries wants to see, not be told, that the numbers on this page come from a real screen, but every capture on the page was a soft video frame or a different zoom, and a blurry number reads as a made-up one.

### Step 2 — Your Character

- **Want:** To glance at a picture and know whether this is real software.
- **Need:** A capture that is sharp enough to read the cents, cropped to one thing, from the same kitchen the video shows.
- **Wound:** A "product screenshot" that turned out to be a Figma mockup, discovered on the demo call.
- **Flaw:** Skims the images, skips the words; will bounce on blur before reading the sentence next to it.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The hero crop, 750 px wide, cut from the video, soft at every phone's pixel density. |
| 2 Theme Stated | The number never lies, so the picture of the number may not blur it. |
| 3 Set-Up | Twelve captures, three pipelines, none of them owned by a script. |
| 4 Catalyst | One script, `capture-proof.mjs`, that signs in, builds the tour's order, and clips every panel at 2x. |
| 5 Debate | Crop the whole product or crop the claim? The claim. |
| 6 Break into Two | Desktop clips at 1440, the app's own harness width; phone clips at 390; wide lists taken from the phone layout. |
| 7 B Story | The union-box bug: viewport boxes added to one scroll offset drift; document space, then a tall viewport. |
| 8 Fun and Games | Yield with its calculation open; the vendor card; the live-cost card; the Sage answer with its source. |
| 9 Midpoint | Every alt rewritten from the pixels: $4,856.55, 39.7 percent, $89.94. |
| 10 Bad Guys Close In | The tour world had been reseeded; the wedding order was gone. The script recreates it through the same form the tour uses. |
| 11 All Is Lost | Sage lives in a different container behind a flag; the script signs in by magic link and skips, never fakes, when it is down. |
| 12 Finale + Final Image | Twelve sharp PNGs, 560 KB together, one command to retake them all. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Hero figure | 1, 9 | soft → sharp, first screen |
| 2 | Outcomes 2x2 | 5, 6 | whole product → one claim per card, readable at card width |
| 3 | Yield figure | 8 | a table → the math, open |
| 4 | Nutrition figure | 8 | told → shown, blanks and all |
| 5 | Sage figure | 11 | a chat box → an answer with its record |
| 6 | The script | 4, 7, 12 | three pipelines → one command |

### Step 5 — Character Voices

- **Reader's words:** is that real, can I read it, what does it say, which order is that.
- **Product voice:** the app's own labels, verbatim in every alt: "Food-cost target", "Next step", "View line calculation", "Where this came from".
- **Banned:** device frames, tilted mockups, gradients, arrows, "beautifier" tools, any capture from `demo.mp4`.

### Step 6 — Dialogue

Each figure turns "a claim in a sentence" into "a claim in a screen"; the alt is the screen read aloud.

### Step 7 — Sorkin

- **Intention:** Show the real screen sharp enough to read the cents.
- **Obstacle:** The screen lives in three different worlds and moves every release.

### Step 8 — Cool Talk

**"60 g ÷ 0.91 = 66 g."** The line calculation, open, in the capture. No other page shows its arithmetic.

### Step 9 — Bringing a Scene to Life

Phone at 200 percent brightness in a parking lot, thumb over the hero image, pinching to zoom on "$89.94 per guest". It stays sharp.

### Step 10 — Connecting Your Scenes

- POV: second person throughout; alts are descriptions, not persuasion.
- Each figure now names the product evidence it shows, such as `RECIPE NUTRITION` or `SAGE ANSWER · SOURCE LINKED`. Internal branch and build provenance stays in the release ledger instead of asking the reader to interpret engineering context.

### Step 11 — Revise and Finish

- Cut: the whole Greek Salad table (seven lines) down to three with the calculation open; the empty cream under the Sage answer; the app chrome around the label sheet; the dead `shot` data in `src/lib/workflow.ts` that pointed at twelve deleted files.
- Honest gaps kept: the nutrition panel still shows two seeded profiles and blank rows; the caption says so.
- Ending: `node scripts/capture-proof.mjs` retakes all twelve.
- 2026-08-30 revision: removed `SANDBOX BUILD` and branch/date labels from every public capture. Kept the exact records, amounts, alt text, and capture pipeline unchanged.
