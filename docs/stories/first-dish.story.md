# Story Tracker — Your first dish

## My story

- **Piece:** Resource route explaining what setup actually asks for (`/first-dish`)
- **Title / headline:** You do not need to enter your whole walk-in
- **My hero's name:** The owner-caterer with the trial page open in one tab, not pressing Start
- **Content file(s):** `src/pages/first-dish.astro`, `src/components/sections/FirstDishPage.astro`

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

> An owner-caterer who wants to know whether CostCook is worth one evening, but believes she has to enter her entire walk-in before it will tell her anything.

### Step 2 — Your Character

- **Want:** Know what setup will cost her in time before she commits an evening to it.
- **Need:** One real number out of her own kitchen, so the decision stops being a leap of faith.
- **Wound:** The last tool wanted her whole catalog before it would do anything. The half-filled spreadsheet is still on the desktop, a monument to an evening she does not get back.
- **Flaw:** She judges software by how much it asks of her up front, so she never gets far enough to find out whether it works. The real prices stay in her head, where nothing can check them.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Trial page open in one tab, tomorrow's prep list in the other. Thumb over Start. Not pressing it. |
| 2 Theme Stated | Setup asks for one dish, not your walk-in. |
| 3 Set-Up | Every tool before this one wanted the whole catalog first. She has the half-filled spreadsheet to prove how that ends. |
| 4 Catalyst | She opens the app. Empty kitchen, and the old dread: where do I even start. |
| 5 Debate | "I do not have a week for data entry." "I do not know my yields." "What if I enter it wrong." |
| 6 Break into Two | The guide opens on a question, not a form: what kind of kitchen, what you want first, and the name of one dish you already cook. Every answer optional. |
| 7 B Story | The dish itself. The roast chicken plate she has cooked four hundred times. Her own knowledge is the data, and the app says its name back to her on every screen after. |
| 8 Fun and Games | Five stages, each asking for the next thing that one dish needs. Kitchen and supplier. Its ingredients. Its food facts. The dish. A menu and a date. |
| 9 Midpoint | $1.62. The plate cost, with the case price and the trim it came from sitting beside it. |
| 10 Bad Guys Close In | She leaves a price blank; it will not go on. She picks ml for something sold by weight; it names the fix. She hits Start over by mistake; her records survive. The wifi drops mid-save; her typing stays on screen. |
| 11 All Is Lost | The alternative is another season where the number in her head and the number on the invoice are two different numbers. |
| 12 Finale + Final Image | Stage five ends at the shopping list, which is where the product tour begins. She presses Start. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | You do not need to enter your whole walk-in | 1–2 | wall → doorway |
| 2 | The empty screen | 3–4 | vague dread → named fear |
| 3 | What it asks you for | 5–6 | resistant → curious |
| 4 | Five stages, one dish's worth | 6, 8 | vague → concrete |
| 5 | The number, and where it came from | 9 | guessing → checkable |
| 6 | What it refuses to do | 10 | trust → tested → held |
| 7 | Where stage five leaves you | 11–12 | undecided → started |

### Step 5 — Character Voices

- **Reader's words:** my whole walk-in, a week of data entry, where do I start, one dish, what I actually pay, case, trim, per head, the number in my head.
- **Product voice (from the app's own setup copy, `stage-guide.ts`):** honest, warm, unhurried. Sentences that are facts about the costed chain, never descriptions of a screen.
- **Banned:** seamless, effortless, powerful, instantly, in one click, and the three the claim guard fails the build on — "no data entry", "nothing is re-keyed", "handles it automatically". Any duration ("set up in 20 minutes") is banned too: no artifact supports one.

### Step 6 — Dialogue (McKee): the turn in each section

- §1 "This will want everything I have" → "It wants one dish."
- §2 "I am bad at this" → "The empty screen is the problem, and it has a shape."
- §3 "I do not have the answers it needs" → "It asks for what I already know, and every question is optional."
- §4 "Five stages sounds like a week" → "Five stages is one dish's worth of facts."
- §5 "Software numbers are a black box" → "I can check this one on paper."
- §6 "I will break it, or it will let me" → "It stops me, and it says why."
- §7 "Is this worth an evening?" → "One dish, and I will know."

### Step 7 — Sorkin: headline / subhead

- **Intention:** Find out whether this is worth one evening.
- **Obstacle:** She believes she has to enter everything before it does anything.
- **Headline:** You do not need to enter your whole walk-in.
- **Subhead:** Setup asks for one dish you already cook. Four stages in, it prints that dish's plate cost with the arithmetic beside it. The fifth turns it into a shopping list.
  (The subhead first read "Five stages later it prints that dish's plate cost",
  which contradicted §4's hand-off, "Stage four ends on a number." The dish is
  costed at stage four; stage five is the menu, the date and the shopping list.
  Code review caught it.)

### Step 8 — Cool Talk: the one snap line

> A $32 case of thighs, 80% of it surviving the knife, 180 g on the plate: $1.62. Check it on paper. We would rather you did.

### Step 9 — Bringing a Scene to Life

- **Where they are:** §2. The office corner of her own kitchen, laptop on stainless, walk-in humming behind her.
- **What they see / hear / feel:** The last tool's half-filled spreadsheet still on the desktop. An empty kitchen on screen with nothing in it. Forty minutes left before she stops making sense.
- **Time of day:** Nine at night, after service.

### Step 10 — Connecting Your Scenes

- **POV:** Second person, "you". Locked. No first-person founder voice on this page; `BuiltForKitchens` owns that register.
- **Hand-off lines:**
  - §1 → §2: "The dread is not irrational. It has a shape, and it is worth naming."
  - §2 → §3: "So here is what the guide actually asks you for."
  - §3 → §4: "Those answers are optional. The five stages after them are not."
  - §4 → §5: "Stage four ends on a number."
  - §5 → §6: "A number you can check is only half of it. The other half is what happens when you get something wrong."
  - §6 → §7: "Which leaves one question: what do you have at the end?"

### Step 11 — Revise and Finish

- **Word count:** 470 words of prose, 696 including the stage table, the setup
  ticket and the arithmetic figure. (An earlier draft of this tracker guessed
  "690 → 415" before the page existed; these are the counts off the built
  page.) The stage table and the arithmetic are reference, not reading: a
  skimmer takes the seven headings and the $1.62 and leaves.
- **Claims removed because they could not be shown:**
  - Any setup duration. Nothing in the rehearsal artifacts supports a number.
  - "Upload an invoice and your ingredients fill in." Both test layers pin `IMPORT_AI_PROVIDER: 'stub'`; no PDF was ever extracted for real.
  - "Load sample data to look around first." Presence checked, behaviour untested at both layers.
  - "Try it without signing up." `app.costcook.io/demo` returns 404 in production; there is no public sandbox.
- **Final Image (the CTA sentence):** The CTA renders `cta.label` from `site.ts` verbatim. The line above it is the reader's new evening: "One dish, and you will know."
- **Fixed during browser verification** (all three caught at 1440x900 and 390x844, none visible in the source):
  - The close CTA rendered dark green on green: `.fd-prose a` outranked
    `.btn-primary`'s white on specificity. The prose rule now excludes buttons.
  - Three sections centred themselves while three sat left, because
    `container-page fd-prose` on one element let `max-width: 40rem` override
    the page gutter. Same semantic role now gets the same treatment: the copy
    column is always a `.fd-prose` inside a `.container-page`.
  - 169px of horizontal overflow at 390px: grid children default to
    `min-width: auto`, so the nowrap arithmetic table widened its column
    instead of scrolling inside it.
- **Fixed after code review:**
  - The arithmetic table's scroll container took no keyboard focus and had no
    name. At 390px its whole value column, the $1.62 included, sits off-screen,
    so a keyboard-only reader could not reach the number the page is about
    (WCAG 2.1.1). It is now a named, focusable region with column headers, and
    both the build contract and the browser run fail without them.
  - The hero and §4 disagreed about which stage prints the plate cost. Fixed
    above.
  - The food-facts sentence ("reads 'check', never 'clear'") was true of the
    app but traced to no ledger row. RC-55 now carries the boundary and the
    guard pins the wording.
