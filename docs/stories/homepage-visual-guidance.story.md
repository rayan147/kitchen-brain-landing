# Story Tracker — Homepage visual guidance pass

## My story

- **Piece:** Homepage, 2026-08-29 visual-and-guidance revision (no new claims; new figures, hand-offs, and one phone-only bar)
- **Title / headline:** Cost it, buy it, prep it, pack it. Enter the numbers once. (unchanged)
- **My hero's name:** The owner-caterer reading on a phone, mid-shift, off a cold email
- **Content file(s):** `src/components/sections/Hero.astro`, `TheProblem.astro`, `WhoThisIsFor.astro`, `CustomerOutcomes.astro`, `TheOtherTools.astro`, `src/components/SectionHandoff.astro`, `src/components/StickyCta.astro`, `src/lib/stops.ts`

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

> An owner-caterer on a phone, skeptical from a cold email, wants to decide in under a minute whether this is real and aimed at them, but the page gave them ten screens of type, no picture of the product until the fourth screen, and nothing that said where to look next.

### Step 2 — Your Character

- **Want:** See the thing, not read about it. Know in one thumb-scroll whether to keep going.
- **Need:** Evidence they can check against their own week (their numbers, their sheets, their Saturday).
- **Wound:** Sales funnels that promised a demo and delivered a pitch. Screens of copy with a mockup at the end.
- **Flaw:** Skims. Reads headings and pictures, skips paragraphs, leaves at the first blank screen.

### Step 3 — The Plot

The beats are the existing page's (STORY-SPINE-2026-08-27.md). This pass changes what each beat SHOWS, not what it says.

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The fold: the chain named, and now the product's pricing panel under the ask (Hero figure). |
| 2 Theme Stated | "Enter the numbers once." (unchanged) |
| 3 Set-Up | The four moments of the week, now dealt onto the counter as four tickets beside the diagnosis (TheProblem). |
| 4 Catalyst | Who it is for, beside who it is not, in one frame (WhoThisIsFor). |
| 5 Debate | Is this real? The film. (unchanged) |
| 6 Break into Two | Four answers, each with the frame of the film that proves it (CustomerOutcomes). |
| 7 B Story | The yield. (unchanged) |
| 8 Fun and Games | Paper in. (unchanged) |
| 9 Bad Guys Close In | The other tools: the two calendars beside the lede rather than under it (TheOtherTools). |
| 10 All Is Lost | What you give up. (unchanged) |
| 11 Finale | Who made it. (unchanged) |
| 12 Final Image | Put one real order through it. (unchanged) |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn | What changed |
|---|---------|-------|------------|--------------|
| 1 | Hero | 1–2 | "software" → "that panel, for my order" | Pricing-panel crop straddling the fold |
| 2 | TheProblem | 3 | my week → my week, named | Ticket stack in the empty right column; provenance cut to two sentences |
| 3 | WhoThisIsFor | 4 | is this for me → yes, and here is who it is not for | Misfit list as one ticket, right column |
| 4 | SeeItRun | 5 | claim → footage | Hand-off only |
| 5 | CustomerOutcomes | 6 | four sentences → four frames | 2x2 crops with timestamps |
| 6–8 | TheYield, PaperIn, TheOtherTools | 7–10 | — | Hand-offs; calendars beside the lede |
| 9 | BuiltForKitchens | 11 | — | Hand-off |
| 10 | StartHere | 12 | — | Unchanged; the phone bar hides here |

### Step 5 — Character Voices

- **Reader's words:** the sheet, the case, the count, the truck, the invoice, Saturday, a head.
- **Product voice (new lines only):** mono micro-labels, the brand's one device: `ORDER · 180 GUESTS · $68 A HEAD`, `FROM THE TOUR · 0:29`, `NEXT · SEE IT RUN`, `NOT FOR · FOUR KITCHENS`.
- **Banned:** seamless, powerful, in one click, exclamation points, em-dashes.

### Step 6 — Dialogue

- Hero figure: doubt (is there a product?) → evidence (there is, and it is already arguing about my price).
- TheProblem tickets: a list → a stack of paper on a counter, which is what the reader's problem physically is.
- WhoThisIsFor ticket: a paragraph of fit → a ticket that could be pinned to the wall and checked against.
- Outcome crops: told → shown, each with the second in the film it was cut from.
- Hand-offs: "am I done?" → "no, the next one is called this, and it is that way."

### Step 7 — Sorkin

- **Intention:** Show the reader the product before they have to trust a sentence about it.
- **Obstacle:** The truth pass. Nothing may be shown that the app does not ship, so every picture is a frame of the footage the ledger already vouches for (RC-48).
- **Headline:** unchanged. **New subhead (hero figcaption):** "The pricing panel from the tour below. Food cost against the target, and the price that would have met it, before the quote goes out."

### Step 8 — Cool Talk

The one snap line on the page, in the hero crop itself and named by its caption: **"Charge at least $89.78 per guest to meet the 30% target."** It is a real number from a real order and could not be about any other product. Nothing else added in this pass tries to be quotable.

### Step 9 — Bringing a Scene to Life

The key scene is the fold on a phone, one thumb in, screen dimmed by a walk-in light. What lands there now is a boxed line in amber on paper: charge at least $89.78 a head. The reader has been that number's wrong side.

### Step 10 — Connecting Your Scenes

- POV: second person throughout (unchanged). The founder's first-person line in TheProblem stays as testimony inside a "you" page, as before.
- Hand-offs: every section now ends with `NEXT · <the next eyebrow> ↓`, looked up from `src/lib/stops.ts` so the words on the arrow are the words on arrival. The hero keeps its own hand-off (the tour link). The close hands off to nothing.

### Step 11 — Revise and Finish

- Cut: TheProblem's provenance paragraph from four sentences to two (the full block still lives in BuiltForKitchens); TheOtherTools's "so the question" paragraph merged into the lede column, "and several do it well" dropped.
- Nothing claimed that was not already on the ledger. RC-48 added for the frame rule, not for a capability.
- Ending unchanged: the CTA is the Final Image and the phone bar carries the same words to it.
