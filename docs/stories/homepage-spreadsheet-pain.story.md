# Story Tracker — Homepage spreadsheet pain, named

## My story

- **Piece:** The homepage diagnosis and its answer, sharpened so the sheet is named
- **Title / headline:** The spreadsheet works until the job changes.
- **My hero's name:** The owner-caterer whose costing lives in a sheet that was right the day she made it
- **Content file(s):** `src/components/sections/TheProblem.astro`, `src/components/sections/CustomerOutcomes.astro`
- **Plan:** `docs/plans/spreadsheet-pain-2026-09-05.md`

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
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done! | ☒ |

### Step 1 — The Idea

> An owner-caterer who costs every job on a spreadsheet and wants to know whether this page is describing her week or somebody's idea of it, but the page names her tool once in a heading and then goes vague about what actually goes wrong with it.

### Step 2 — Your Character

- **Want:** Decide in under a minute whether this is worth fifteen more.
- **Need:** To hear her own week described accurately enough that the rest of the page inherits the credit.
- **Wound:** Quoted a job off last month's sheet, found the case price had moved, and ate the difference in front of a client she wanted to keep.
- **Flaw:** Starts every job as the last job's sheet saved under a new name, which is the correct move with the tools she has, and is also the thing that lets the two prices drift.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| Opening Image | The sheet, open, correct, the night she made it. |
| Theme Stated | "The spreadsheet works until the job changes." |
| Set-Up | A price moves, forty guests arrive, a case comes short. |
| Catalyst | Each of those is a number she has to find by hand in every copy that still holds the old one. |
| Debate | Four moments, one per way the copying costs her. |
| Break Into Two | The four "before" labels in the answer: a price the copy never got, one number in four tabs, rows retyped into emails, an invoice in a folder. |
| B Story | The founder cooked for twelve years; the four moments are his own week. |
| Fun and Games | Quote, plan, buy, cost again, each step picking up where the last finished. |
| Midpoint | The screens beside each answer: the food-cost panel, the prep list, the supplier group, the live cost. |
| Bad Guys Close In | Nothing new here. The rival beat stays at `alternatives`, un-touched. |
| All Is Lost / Dark Night | Not this thread's beats; the page already spends them at `alternatives` and `trust`. |
| Break Into Three | The loop closes without repricing the event she confirmed. |
| Finale | One record instead of a folder of sheets that agreed only on the day she made them. |
| Final Image | The next quote starts with what she paid. |

### Step 4 — From Beats to Scenes

No new scene. This thread sharpens two that exist and are already paired one for
one, four against four:

| Scene | Beat group | Value turned |
|---|---|---|
| `problem` (the four moments) | Theme Stated → Debate | recognised − → named + |
| `outcomes` (the four handoffs) | Break Into Two → Finale | copied sheet − → one record + |

Adding a fifteenth stop was rejected: `src/pages/index.astro` records a measured
section-order trade that is only valid while these two mirror each other four
for four.

### Step 5 — Character Voices

- **Reader's voice:** tabs, copies, "saved under a new name", the dock, the truck was short, a folder of invoices. Her nouns, from the same glossary the rest of the page uses.
- **Product's voice:** flat, unhurried, no blame. It never says her tool is bad. It says what she does by hand, and then what happens instead.

### Step 6 — Writing Dialogue

Every one of the four moments turns the same value in a different place:
confident − to exposed +. Moment 1 turns it on price, 2 on scale, 3 on buying, 4
on time. Delete any one and its partner in `outcomes` answers nothing, which is
the test that keeps the pairing honest.

### Step 7 — Sorkin Dialogue

The heading is unchanged and still wants something: "The spreadsheet works until
the job changes" concedes the obstacle's strength before pushing against it. The
new lede pushes on the same axis: it holds *until something moves*.

### Step 8 — Cool Talk

The homepage keeps its one established snap line, in the hero crop:

> Charge at least $89.78 per guest to meet the 30% target.

Nothing added here competes. No line in this thread carries a number, on
purpose. The closest is "the one you miss turns up at the dock", which is a
description of her Saturday, not a boast about ours.

### Step 9 — Bringing a Scene to Life

The key scene is the dock: she is holding a printed list that came out of a tab
she edited three of four times, the truck is short a case, and the number she
needs is in a sheet on a laptop at the kitchen. That is why moment 2 ends there
rather than at the desk.

### Step 10 — Connecting Your Scenes

Point of view is locked to second person, unchanged. The hand-off chain in
`src/lib/stops.ts` is untouched: `problem → who → demo → outcomes`. Moment 4
ends on invoices deciding weeks later; the fourth answer opens on bringing the
paid price back. The sheet noun introduced in `problem` is the same noun the
four `from` labels in `outcomes` pick up, which is what makes the pairing
visible rather than merely structural.

### Step 11 — Revise and Finish

Cut twice. The lede lost a sentence; each moment body is one or two sentences
and none exceeds the old ones by more than a line, so the ticket stack keeps its
column. Two claims were considered and refused because they are not true:

- that a spreadsheet **is unable to** re-cost a recipe (a lookup against a price
  tab does exactly that; what is true is that her *copy* holds the old number),
- and any named spreadsheet product, which RC-40 confines to `/compare` with a
  dated pricing-page citation.

Both now fail the claim guard by pattern, as does reordering either list, in
the component source and again in the emitted HTML. The ending is unchanged and still
lands where it did: the next quote starts with what you paid.
