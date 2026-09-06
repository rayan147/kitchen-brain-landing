# Story Tracker — The promise moves into the fold

## My story

- **Piece:** The one-line promise that names the job, moved from the "See it run" heading into the homepage fold
- **Title / headline:** Follow one 180-guest wedding from quote to shelf. Then three events in one run.
- **My hero's name:** An owner-caterer reading on a phone, mid-shift, who arrived from a cold email and will decide in under a minute
- **Content file(s):** `src/components/sections/Hero.astro`, `src/components/sections/SeeItRun.astro`
- **Revises:** [homepage-guided-video.story.md](homepage-guided-video.story.md) (the line's previous home), [homepage-visual-guidance.story.md](homepage-visual-guidance.story.md) (the fold it now shares)

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

> An owner-caterer skimming the fold on a phone wants to know within one screen whether this software is built for the job actually on their calendar, but the fold named a chain of verbs without ever naming a job, so the proof that it handles a real event sat 2,000px further down where a skimmer never reached it.

### Step 2 — Your Character

- **Want (surface):** Decide in under a minute whether a 15-minute demo is worth the time.
- **Need (real):** See their own week described back to them before they will believe any claim about it.
- **Wound (the bad day):** Bought a "restaurant" system that assumed a fixed menu and daily covers, and had to keep the wedding spreadsheet running anyway.
- **Flaw (the habit):** Reads the first screen and leaves. Never scrolls to the section that would have answered the question.

### Step 3 — The Plot (12 beats)

This move touches two beats only. The rest of the homepage plot is unchanged and lives in the trackers listed above.

| Beat | Before this move | After this move |
|------|------------------|-----------------|
| 1 Opening Image — life before | The fold names four verbs (cost, buy, prep, pack) and no job. The reader supplies their own example, or does not. | The fold names the verbs and then the job: a 180-guest wedding, and three events in one run. |
| 2 Theme Stated — the truth they'll learn | Stated 2,000px down, as the heading of the film. | Stated in the fold, where the skimmer is. The film below now shows what the fold already promised. |

### Step 4 — From Beats to Scenes

One sentence changed scenes:

- **Left:** the "See it run" section, where it was the `<h2>`. That section now opens on its eyebrow and lede. It still owns its beat (Catalyst — the delivery that arrives wrong); it no longer owns the promise.
- **Arrived:** the fold, second line, between the `<h1>` and the lede. It does not take a beat from the fold. It makes the fold's existing beat specific.

### Step 5 — Character Voices

- **Reader's voice:** "a 180-guest wedding", "three events in one run". Their unit of work is the event and the head count, never the feature.
- **Product's voice:** absent from this line on purpose. The sentence has no subject and names no product. "Follow" is an instruction to the reader, so the fold's second line belongs to them, not to us.

### Step 6 — Writing Dialogue (the value it turns)

Doubt → recognition. Not doubt → trust: one line cannot earn trust, and claiming it would be the prettier lie. It earns the next fifteen seconds of attention, which is all a fold is for.

### Step 7 — Sorkin (intention vs obstacle)

- **Intention:** "this is your week."
- **Obstacle:** the reader's history of software built for a menu that does not change.
- **Push:** "Then three events in one run" is the half that fights. One wedding could be a demo. Three at once is the thing their spreadsheet cannot do.

### Step 8 — Cool Talk (the one snap line)

> **Then three events in one run.**

Concrete, specific to this trade, and not a sentence any competitor's homepage could carry. The page's snap line now sits in the fold instead of 2,000px down.

Checked against the one-snap-per-page rule: the "See it run" section lost its heading in the same edit, so the page still carries exactly one.

### Step 9 — Bringing a Scene to Life

The reader is holding a phone with one hand, standing up, between prep and service. They have roughly one screen. The scene is not on our page: it is the wedding already on their calendar, which is why the line names an event and a head count rather than a capability.

### Step 10 — Connecting Your Scenes

- **Hand-off in:** the `<h1>` names the chain; this line names what the chain is carrying.
- **Hand-off out:** the lede ("one job pretending to be six") explains why that job is hard, then the loop band draws it, then the pricing figure proves one number from it.
- **POV:** second person throughout, unchanged.

### Step 11 — Revise and Finish

- Moved verbatim. The sentence was already cut to its bone in its previous home; rewriting it to "fit" the fold would have been a second, unasked-for edit.
- **The fold cost was real, and paying it took a second edit.** The line alone added 100px. At 390×844 that left the pricing figure at 812px against an 844px fold: still straddling, but with no slack. At 320×844 it pushed the figure to 913.9px and `verify-homepage.mjs` failed outright — the fold assertion (`heroProofTop < height`, phones only) is what caught it.
  The fix was not shaving margins to clear a threshold. Below `sm` the two fold paragraphs now step from `text-lede` to `text-base` **together**, so their relative weight is unchanged, and the section's top padding drops from `pt-14` to `pt-10`. A 19px lede for seven consecutive lines was heavy on a 320px screen regardless of this move.
  Measured after: **320px → 795px** (clears by 49px), **390px → 671px** (clears by 173px, better than the 712px it measured *before* the line was added). `verify:homepage` passes at six viewports.
- **Known defect shipped deliberately, on request:** removing the `<h2>` from "See it run" leaves that section's two `<h3>` following the page `<h1>` with no `<h2>` between them. This is a heading-order break against the AA floor in CLAUDE.md. It was asked for explicitly after the consequence was named. The remedy, if it is ever put back, is recorded in `SeeItRun.astro`: restore a heading there, or promote those two `<h3>` to `<h2>`.
- Truth pass: the line makes no claim the app does not ship. The 180-guest wedding and the three-event run are both on camera in `public/demo.mp4` and both are covered by the sr-only transcript in `SeeItRun.astro`.

### 2026-09-06 — the heading-order defect above is discharged

The deliberate defect recorded in Step 11 no longer ships. Later the same day
**See it run moved to the second stop**, which made the break worse rather than
tolerable: its two `<h3>` would have been the first headings under the page
`<h1>`, at the top of the scroll rather than three sections down.

Neither remedy the note offered was taken, because a third one costs less. The
section's amber eyebrow, `See it run`, is now its `<h2>`. Nothing changes
visually (the `eyebrow` utility sets its own family, size, weight and colour, so
the element renders identically), and the section is named in the same three
words the hand-off arrows and `src/lib/stops.ts` already use.

**The line this tracker is about stays in the hero.** Restoring a heading in
`SeeItRun` would have put the same promise on screen twice, one screen apart,
which is exactly what moving it here was meant to stop. The one-snap-per-page
check in Step 8 is unaffected: an eyebrow promoted to `h2` adds no line to the
page.

Guarded now rather than remembered: `check-dist.mjs` fails the build if the
first heading after the homepage `<h1>` is anything below `<h2>`. Force-failed
before it was kept.

Full record of the reorder: `docs/stories/homepage-spreadsheet-pain.story.md`
and `docs/stories/homepage-guided-video.story.md`.
