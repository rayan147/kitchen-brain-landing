# Story Tracker — Homepage Sage redesign

## My story

- **Piece:** Homepage Sage explainer
- **Title / headline:** Ask your kitchen a question. See where the answer came from.
- **My hero's name:** The chef-owner who needs one answer now but will not trust it without the underlying kitchen record
- **Content file(s):** `src/components/sections/Sage.astro`

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

> A chef-owner wants to spot what needs attention without opening five screens, but a fluent assistant is useless unless every answer exposes its source and every proposed action waits for review.

### Step 2 — Your Character

- **Want:** Ask one kitchen question from a phone and get the useful part first.
- **Need:** Check the record behind each line and keep control of anything that could change the work.
- **Wound:** A confident assistant supplied the wrong number or acted before the owner understood what it had done.
- **Flaw:** Reads the polished answer before checking its evidence.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The owner knows Saturday needs attention but not which screen holds the problem. |
| 2 Theme Stated | The answer matters only when its source and boundary remain visible. |
| 3 Set-Up | Prices, recipes, orders, stock, buying, and setup live across the kitchen workspace. |
| 4 Catalyst | One question asks which ingredient prices changed. |
| 5 Debate | Will the answer hide its evidence or try to change a record? |
| 6 Break into Two | Sage reads bounded kitchen checks and returns the relevant records. |
| 7 B Story | The owner’s judgment remains the gate. |
| 8 Fun and Games | A sourced answer names the changed ingredient, old price, new price, percentage, and purchases behind it. |
| 9 Midpoint | The record link turns a fluent sentence into something the owner can verify. |
| 10 Bad Guys Close In | Missing evidence, role limits, or a proposed shopping list test the boundary. |
| 11 All Is Lost | A faster unsupported answer would only make the wrong decision arrive sooner. |
| 12 Finale + Final Image | Sage is available now, helps during onboarding, and leaves the one action it can prepare waiting for owner or manager approval. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | The kitchen question | 1–4 | five screens → one direct question |
| 2 | The sourced answer | 5–9 | fluent claim → checkable kitchen record |
| 3 | Read versus propose | 6, 10 | assistant action → bounded read or reviewable proposal |
| 4 | Guardrails | 7, 10–11 | fear of silent changes → explicit limits |
| 5 | Available and onboarding | 12 | future promise → tool available from setup onward |

### Step 5 — Character Voices

- **Reader's words:** Saturday, what needs attention, which prices changed, what came up short, shopping list, show me the record, setup.
- **Product voice:** calm, sourced, bounded.
- **Banned:** autonomous, learns your business, magic, never wrong.

### Step 6 — Dialogue

- Question: scattered checking → one bounded request.
- Answer: plausible prose → a specific number with linked evidence.
- Capabilities: vague assistant → eleven read-only checks and one reviewed proposal.
- Guardrails: trust us → inspect the source, role, missing evidence, and approval boundary.
- Availability: someday → available now and present during onboarding.

### Step 7 — Sorkin

- **Intention:** Get the answer without losing the evidence.
- **Obstacle:** Assistant language can sound more certain than the records support.
- **Headline:** Ask your kitchen a question. See where the answer came from.
- **Subhead:** Eleven checks read. One shopping-list proposal waits for you.

### Step 8 — Cool Talk

This section adds no second snap line. The homepage keeps its established one:

> The numbers move between them so you do not.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the walk-in door with a phone in one hand and Saturday’s prep in the other.
- **What they see / hear / feel:** A changed cucumber price, two purchase records, and a direct link instead of a paragraph of confidence.
- **Time of day:** During setup or the Thursday-night check before the event.

### Step 10 — Connecting Your Scenes

- **POV:** You, locked throughout.
- **Hand-offs:** Paper intake supplies the records; Sage reads those records; the answer exposes evidence; any shopping proposal stops for review; the wider tool comparison follows.

### Step 11 — Revise and Finish

- **Word count before → after:** Repetition will be replaced by one visible question-to-evidence-to-review path.
- **Claims removed because they could not be shown:** None added beyond the shipped Sage register and onboarding placement.
- **Final Image:** The owner opens Sage during setup, checks the source, and approves only the work they want prepared.

---

## REVISED 2026-09-09 — homepage copy-density pass

The homepage copy this tracker describes was shortened. Full working:
`BRIEF-copy-density-2026-09-09.md`. Tracker for the pass itself:
`docs/stories/homepage-copy-density.story.md`.

The section said one thing six times: eleven checks read, one tool prepares, a
person approves. The approval-path band is the one that shows it, so it kept it.
The .sage-promise rail directly above that band is GONE, markup and styles. The
lede stopped listing the line-marking states, which the missing-evidence
guardrail lists in full (the lede's list was short one state). The h3 subhead
"Evidence, access and action stay separate" went, because it named the three
group labels that render immediately below it. THE SIX GUARDRAILS THEMSELVES
WERE NOT CUT, only their mechanism sentences: this section's own h3 is "Useful
because the boundaries are visible".

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

---

## MOVED 2026-09-09 — this is a block inside `#more`, not a stop

See [[homepage-stop-merge]]. The section this tracker was written for is now one
of four blocks in `src/components/more/`, under one shared heading, one lede and
one hand-off in `src/components/sections/WhatElse.astro`. Its own eyebrow, h2,
lede and hand-off are gone; its h2 text survives as the block's h3.

**No claim, figure or `data-*` hook was cut**, and the build contract asserting
the homepage carries this proof still passes. What the working parts do now is
fold under 64rem behind `FoldedDetail.astro`, shipping open in the served HTML.
Every beat above still applies; only the frame around it changed.

## Claim correction · 2026-09-27 (Sage tools and drafts)

- [x] 11 Revision: Sage now has 22 read-only tools and 3 draft kinds (the kitchen shopping list, one order's shopping list, a guest-count change on a draft order); nothing changes until a manager or owner approves the draft. "Eleven checks", "one proposal" and "shopping-list proposal" were stale, and "proposal" now names the client document, so Sage's output is called a draft everywhere. Beats, point of view and snap line unchanged. Gap report S1, S10, W2; ledger RC-46, RC-49.
