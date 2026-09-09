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

### 2026-09-05 revision — the pains that are wrong, not slow

The release owner read the four moments and doubted they were the whole list.
They were not, and the gap was a category rather than an item: **all four
describe labor.** Every one says the work is slow. None says the answer was
wrong, and the second is the one that costs money.

So a fifth element sits after the ticket stack, carrying the two failures RC-20
names: a price that is not there yet, and a conversion nobody checked. Both
total silently. Beat-wise it is the Catalyst sharpening, not a fifth Debate
item, which is why it does not take a fifth answer in `outcomes`.

It is deliberately not a fifth ticket. The four are numbered `01`–`04` in a
tilted stack, and anything wearing that costume becomes a peer to the eye
whatever the DOM says. It sits outside the `<ol>`, in the section's
rule-and-prose register, with no number and no `h3`. `check-dist` fails the
build if it ever moves inside the list.

Refused, and now guarded: that CostCook catches a price you typed wrong. It
does not, and neither does a spreadsheet. RC-20 covers a fact that is **absent**,
and the copy stops exactly there.

Still no rival snap line. The block's closing line, *"They are wrong, and
nothing on the screen says so"*, carries no number by design.

### 2026-09-06 revision — the quiet one, read as a guide

The release owner read the block back and said what it was: *"this part has a
lot of word and it is not easy to state the issue."* Both halves of that are
true, and the second is the real one. Three stacked paragraphs of equal weight
give the eye nothing to land on, so a reader cannot say what the failure IS
without reading all of them, and a reader mid-shift on a phone will not.

Nothing was added and no claim moved. The block now runs in three moves instead
of three paragraphs:

1. **The shape, once.** "A sheet totals what is in it, so a missing fact does
   not stop the number. It shrinks it." That is the whole diagnosis in two
   sentences, ahead of any example.
2. **The two failures, as two labelled rows.** `A PRICE YOU HAVE NOT GOT YET`
   and `A CONVERSION NOBODY CHECKED`, side by side under their own hairlines.
   The label is the issue stated; the body is the evidence for it. A reader who
   reads only the two labels has the point.
3. **The rule.** CostCook holds the costing and names the line it is waiting on.

Shorter as well as clearer: roughly 118 words where there were about 120, but
the eye now has four landing points instead of one.

Form constraints kept, all of them from the 2026-09-05 revision above. The rows
are `<p>`, never `<h3>`, because `check-dist` reads every `<h3>` in `#problem`
as one of the four pains and would silently make that list six. They sit side
by side rather than stacked, so the pair does not read as a continuation of the
four tilted tickets. No number, no tilt, no card. The mono label is the page's
own micro-label voice, set in ink rather than the eyebrow's amber, so it reads
as a label inside an aside and not as a new section opening.

The closing line changed shape and not meaning: *"They are wrong, and nothing on
the screen says so"* is now *"They are wrong, and the screen does not say so."*
Still no number, still no rival snap line.

Two new pins in `check-dist.mjs`, both force-failed before they were kept: the
two row labels must render, and the section-order and heading-level checks that
came with the same day's reorder (below).

### 2026-09-06 revision — the footage runs before the diagnosis

Owner decision, same sitting: **See it run moved to the second stop**, ahead of
this section. Scene order, so it belongs in Step 10 as much as here.

What it does to this story. The Catalyst no longer opens the page. The reader
now watches the working product for two and a half minutes and then meets her
own week, which means this section is read by someone who has already settled
"is this real" rather than by someone still deciding. That is a different
reader, and it makes the diagnosis land as recognition rather than as a pitch.
The 1:1 pairing with `outcomes` is untouched: `problem` and `who` keep their
order relative to each other, and `outcomes` still follows them.

What it voids. The 2026-08-21 measurement recorded in `src/pages/index.astro`
traded 604px of recall distance for 1,258px of depth off the video; the video is
now at the top of the scroll, so those figures are history. The 2026-08-23 note
argued the misfit list must settle "is this aimed at me" before the footage
plays; this reverses that. Both are marked superseded in that file rather than
left standing. **No new measurement was run** — this records a decision, not a
number, and the note says so.

One thing the move forced. `SeeItRun` had no `h2` (its heading moved into the
hero on 2026-09-06), so at the second stop its two `h3` would have been the
first headings under the page `h1`. The eyebrow is now that section's `h2`,
which costs nothing visually and names the section in the same three words the
hand-off arrows use. The removed line stays in the hero; putting it back here
would say the same thing twice one screen apart.

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

---

## REVISED 2026-09-09 — homepage copy-density pass

The homepage copy this tracker describes was shortened. Full working:
`BRIEF-copy-density-2026-09-09.md`. Tracker for the pass itself:
`docs/stories/homepage-copy-density.story.md`.

Two cuts, both in the lede paragraphs above the ticket stack; the four tickets,
the quiet-one block and every pinned string are untouched. The first lede
paragraph dropped "in every copy of the sheet that still holds the old one",
which the next paragraph states as the flaw beat. The third paragraph gave its
first sentence back to #trust (see that tracker).

No beat, section order, heading or value turn changed. Every cut was a claim
the page was making twice; nothing was removed for being unprovable.
