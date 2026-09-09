# Story Tracker — Homepage paper-in visual guide

## My story

- **Piece:** Homepage supplier-price intake explainer
- **Title / headline:** Paper in, staged facts out, you confirm.
- **My hero's name:** The chef-owner bringing this week's supplier paperwork into the costing loop
- **Content file(s):** `src/components/sections/PaperIn.astro`

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

> A chef-owner wants this week's supplier prices inside the costing loop, but the source arrives as four different kinds of messy paperwork and none should change the catalog without review.

### Step 2 — Your Character

- **Want:** Get the price board, order guide, invoice, spreadsheet, or pasted list into one place quickly.
- **Need:** Keep the final decision visible and theirs.
- **Wound:** A supplier line was keyed incorrectly or a catalog price changed without anyone noticing.
- **Flaw:** The ugliest invoice gets left for manual entry because checking software output can feel less trustworthy than typing it personally.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Paper, PDFs, spreadsheets, and copied text arrive in different forms. |
| 2 Theme Stated | Fast reading is useful only when approval stays with the kitchen. |
| 3 Set-Up | This week's food cost depends on getting current supplier facts in. |
| 4 Catalyst | The invoice is awkward enough that the owner would rather key it manually. |
| 5 Debate | Will importing it silently rewrite the catalog or guess at unreadable text? |
| 6 Break into Two | The reader chooses whichever of four intake doors fits the source. |
| 7 B Story | Every door protects the same relationship: the owner remains responsible for the number. |
| 8 Fun and Games | Photo, document, spreadsheet, and pasted text all feed one staging queue. |
| 9 Midpoint | A single differences list comes back for review. |
| 10 Bad Guys Close In | Some facts remain uncertain or cannot be made out. |
| 11 All Is Lost | Silent guesses would make every downstream cost look precise and be wrong. |
| 12 Finale + Final Image | The original wording stays visible, nothing is written, and the reader confirms only what they accept. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | This week's source | 1–3 | scattered paperwork → one intake purpose |
| 2 | Four doors | 4–6 | awkward format → supported entry point |
| 3 | One queue | 7–8 | four routes → one predictable review place |
| 4 | Differences | 9 | extracted facts → inspectable changes |
| 5 | Uncertain text | 10–11 | plausible guess → original wording preserved |
| 6 | Confirmation | 12 | software output → owner-approved catalog change |

### Step 5 — Character Voices

- **Reader's words:** price board, order guide, invoice, photograph, PDF, doc, spreadsheet, paste, key it in, look at the differences, say yes.
- **Product voice:** calm, exact, deferential.
- **Banned:** seamless, automatic, AI-powered, magic.

### Step 6 — Dialogue

- Source: incompatible paperwork → four supported ways in.
- Queue: four paths → one place to review.
- Differences: extracted data → visible proposed changes.
- Uncertainty: unreadable source → quoted evidence rather than a guess.
- Confirmation: fast software → a human decision that remains explicit.

### Step 7 — Sorkin

- **Intention:** Bring this week's prices into the costing loop quickly.
- **Obstacle:** The sources disagree in format, and silent catalog edits would make speed unsafe.
- **Headline:** Paper in, staged facts out, you confirm.
- **Subhead:** Four doors, one queue.

### Step 8 — Cool Talk

This section adds no second snap line. The homepage keeps its established one:

> The numbers move between them so you do not.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the office corner of the prep table with a phone photo, a supplier PDF, and a spreadsheet open.
- **What they see / hear / feel:** A creased invoice, a badly aligned line, the urge to type it manually because the number matters.
- **Time of day:** After receiving, before the next quote is costed.

### Step 10 — Connecting Your Scenes

- **POV:** You, locked throughout.
- **Hand-offs:** The reason for intake leads to four doors; the doors visibly converge on one queue; the queue returns a differences list; uncertain text stays attached; confirmation closes the scene.

### Step 11 — Revise and Finish

- **Word count before → after:** Existing explanatory copy preserved; repeated meaning is moved into the visual hierarchy rather than restated.
- **Claims removed because they could not be shown:** None added or removed.
- **Final Image:** Reading the paper is the fast part. Saying yes to it is yours.

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
