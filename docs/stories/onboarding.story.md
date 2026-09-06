# Story Tracker — Your initial setup

## My story

- **Piece:** Resource route explaining what setup asks for, where it leaves you, and how the rest of the kitchen comes in (`/onboarding`)
- **Title / headline:** You do not need to enter your whole walk-in
- **My hero's name:** The owner-caterer with the trial page open in one tab, not pressing Start, who has a second question behind the first: and then what?
- **Content file(s):** `src/pages/onboarding.astro`, `src/components/sections/OnboardingPage.astro`

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

> An owner-caterer who wants to know whether CostCook is worth one evening, but believes she has to enter her entire walk-in first, and even if she gets one dish in, cannot picture the day her crew uses it without her.

### Step 2 — Your Character

- **Want:** Know what setup will cost her in time, and what she is supposed to do the morning after.
- **Need:** One real number out of her own kitchen, and a Shop list her crew can work from without her standing over them.
- **Wound:** The last tool wanted her whole catalog before it did anything. The one before that she set up alone, and nobody else ever logged in.
- **Flaw:** She judges software by how much it asks of her up front, so she never gets far enough to find out whether it works, and she assumes rolling it out to the crew is her job alone.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Trial page open in one tab, tomorrow's prep list in the other. Thumb over Start. Not pressing it. |
| 2 Theme Stated | Setup asks for one dish, not your walk-in. Then the rest of the kitchen follows the same doors. |
| 3 Set-Up | Every tool before this wanted the whole catalog first, and every one was set up alone. |
| 4 Catalyst | She opens the app. Empty kitchen, and the old dread: where do I even start. |
| 5 Debate | "I do not have a week for data entry." "Even if I do it, then what?" "My crew will never use it." |
| 6 Break into Two | The guide opens on a question, not a form. One dish. |
| 7 B Story | The roast chicken plate she has cooked four hundred times. Her own knowledge is the data. |
| 8 Fun and Games | Five stages, each asking for the next thing that one dish needs. |
| 9 Midpoint | $1.62. The plate cost, with the case price and the trim beside it. |
| 10 Bad Guys Close In | The guards: blank price, wrong unit, Start over, wifi drop. Then the harder one: "Your kitchen is ready", and she is alone on the completion screen. |
| 11 All Is Lost | The alternative is another season where the number in her head and the number on the invoice differ, and the crew works from a text message. |
| 12 Finale + Final Image | The next dish comes in through the same doors. She invites the two people who work this week; they get a link, no password, and open the Shop list she built. On their own phones. |

### Step 4 — From Beats to Scenes

| § | Section | id | Beats | Value turn |
|---|---------|----|-------|------------|
| 0 | Hero: You do not need to enter your whole walk-in | — | 1–2 | wall → doorway, with a map of three parts |
| 1 | Part 1 · Before you start | `before` | 3–6 | vague dread → named fear → one optional question |
| 2 | Part 2 · The five stages | `stages` | 7–10 | vague → concrete → checkable → tested |
| 3 | Part 3 · After setup: where the app leaves you | `after` | 10 | done → next action named |
| 3b | The rest of your menu | `after-menu` | 12 | "now the other 40 dishes by hand" → same doors, staged review |
| 3c | The rest of your crew | `after-crew` | 12 | "I roll this out alone" → a link, no password, a list waiting |
| 3d | Close | — | 12 | undecided → started |

### Step 5 — Character Voices

- **Reader's words:** my whole walk-in, a week of data entry, where do I start, one dish, what I actually pay, case, trim, per head, the number in my head, then what, my crew, roll it out, who can see the costs, one login for everyone.
- **Product voice (from the app's own setup copy, `stage-guide.ts`):** honest, warm, unhurried. Sentences that are facts about the costed chain, never descriptions of a screen.
- **Banned:** seamless, effortless, powerful, instantly, in one click, and the three the claim guard fails the build on — "no data entry", "nothing is re-keyed", "handles it automatically". Any duration ("set up in 20 minutes") is banned too: no artifact supports one. Also banned: custom role, permission, automatically, extracts, reads it correctly, roll out in a day.

### Step 6 — Dialogue (McKee): the turn in each section

- §0 "This will want everything I have" → "It wants one dish, and here are the three questions this page answers."
- §1 "I am bad at this" → "The empty screen is the problem, and it asks one optional question."
- §2 "Five stages sounds like a week" → "Five stages is one dish's worth of facts, and I can check the number."
- §3 "It says ready. Now what?" → "It names the next screen: the shopping list."
- §3b "So I key the other forty dishes by hand" → "Same doors as the first: paper in, staged facts back, my last word on every line."
- §3c "Rolling this out is on me" → "Two emails, two links, no passwords, and they land on a list, not an empty kitchen."
- §3d "Is this worth an evening?" → "One dish, and you will know. Then the crew will too."

### Step 7 — Sorkin: headline / subhead

- **Intention:** Find out whether this is worth one evening.
- **Obstacle:** She believes she has to enter everything before it does anything.
- **Headline:** You do not need to enter your whole walk-in.
- **Subhead:** Setup asks for one dish you already cook and takes about fifteen minutes. Four stages in, it prints that dish's plate cost with the arithmetic beside it. This page also says what comes after, and how the rest of your kitchen gets in.
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
  - §0 → §1: the map's first row, "Before you start".
  - §1 → §2: "Those answers are optional. These five are the work."
  - §2 → §3: "Stage five ends on a screen that says your kitchen is ready. Here is what it offers next."
  - §3 → §3b: "The first dish was the hard one. The rest come in the same way."
  - §3b → §3c: "A catalog nobody else opens is a spreadsheet with a login. This is how the crew gets one."
  - §3c → §3d: "Invite after the first order exists, so they arrive to a list."

### Step 11 — Revise and Finish

- **Word count:** 470 words of prose, 696 including the stage table, the setup
  ticket and the arithmetic figure. (An earlier draft of this tracker guessed
  "690 → 415" before the page existed; these are the counts off the built
  page.) The stage table and the arithmetic are reference, not reading: a
  skimmer takes the seven headings and the $1.62 and leaves.
- **Claims removed because they could not be shown:**
  - Any setup duration. Nothing in the rehearsal artifacts supports a number.
  - "Upload an invoice and your ingredients fill in." Both test layers pin `IMPORT_AI_PROVIDER: 'stub'`; no PDF was ever extracted for real. STILL REMOVED after the 2026-09-06 revision below: the page now names the door and the gate, and says nothing about what extraction returns.
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
- **Visual added after review:** §4 was the most text-heavy part of the page,
  so it now carries one capture of the running app: stage one, with the
  five-stage rail beside it. The rail in the picture reads the same five names
  as the table above it, which is the point. The 18 existing rehearsal
  captures could NOT be used: every one shows the superseded six-stage rail
  (Costing defaults, Business and suppliers, Ingredients, Recipes, Menu, First
  order), so shipping one would have put a six-stage image beside a
  five-stage sentence. `scripts/capture-setup-proof.mjs` takes a fresh one off
  an empty kitchen, and RC-48 records the provenance.
- **Sage and the fifteen minutes (owner, 2026-09-05):** the owner confirmed
  setup takes about fifteen minutes and asked for Sage in the shot, since it
  is part of what setup offers. Both are in. The duration is recorded in RC-10
  as a RELEASE-OWNER CONFIRMATION, not a measurement, and the guard now allows
  the approximation while failing a hardened one ("in under 10 minutes",
  "guaranteed"). Two things the owner said are NOT on the page, because RC-49
  forbids them and the evidence does not support them: that you rarely type
  (the five-stage walk is typed throughout, and import extraction is stubbed
  in every test), and that the app fixes issues so you do not get stuck (the
  guards STOP you and NAME the fix; Sage reads records and never writes one).
  The honest version of both is §6 plus the new Sage paragraph: the questions
  that stage raises, answered from what you have entered, and a screen that
  says what is wrong and where.
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

- **The three doors (revision, 2026-09-06):** the page answered "what does setup
  ask for" but not "how does my kitchen get in", and the owner named the second
  as a sale the page was leaving on the table. The honest half of it is now §4a.
  What went in is a ROUTE fact, read that day off `sandbox/demo`
  `src/routes/setup/+page.svelte`: with no ingredients yet, stage two renders
  three choices, not a form, and stage four offers Sage a recipe card, photo,
  PDF, pasted text or link. RC-58 records it. What stayed out is everything
  about what a document comes back as, because RC-55 still pins
  `IMPORT_AI_PROVIDER: 'stub'` at both test layers of the rehearsal, and the
  `check-landing-claims.mjs` regex that fails the build on photograph, upload or
  scan beside invoice, price sheet or recipe was deliberately NOT relaxed. So
  the block sells the door and the review gate (RC-09, RC-39) and then says the
  quiet part itself: reading a document is still work. The app's own line,
  "Supplier, packs, and prices come back for you to confirm, not type", is the
  copy this page may use the day a rehearsal runs against a real provider.
  The hero lede gained one sentence for the same reason and no more, because
  the hero is the one slot a skimmer reads: "Its ingredients can come in from an
  invoice or a spreadsheet, not just the keyboard."
- **No second snap line.** §4a is deliberately unquotable. The page's one snap
  line is still the $1.62 in §5, and a second would have cost it.
- **Direction contract corrected:** the page shell still carried "refuse any
  duration claim, because no rehearsal artifact supports one", which RC-10
  superseded on 2026-09-05 and which the build's own guard contradicts (it
  REQUIRES "about fifteen minutes"). The contract now states the RC-10 boundary
  it should have carried since, and names the doors in the story line.
- **Verified in the browser, 2026-09-06:** 1440x900 and 390x844, zero horizontal
  overflow at both, dashed ticket rules and cream paper consistent with the
  hero ticket, build and all page contracts green.
- **After-setup revision (2026-09-06):** the owner named the two questions the
  page left open: what do I do next, and how do I onboard the rest of my
  kitchen. Both have shipped answers and both are now Part 3. What went in is
  read off `sandbox/demo` that day: `SetupCompletionSummary.svelte` (heading
  "Your kitchen is ready", actions "Open shopping list" and "Go to Today"),
  the import queue (RC-38, RC-39), Sage's recipe door (RC-58), later prices
  (RC-08), and Settings > Team (`settings/team/+page.svelte`: invite by email,
  "They will receive a one-time link to join this kitchen. No password is
  needed.", `INVITED_ROLE = 'STAFF'`, RC-52). What stayed out: any word on
  what extraction returns, any role behaviour beyond RC-52, any rollout
  duration. Parts 1 and 2 were cut (Krug: omit needless words); the page
  gained a three-row map in the hero ticket so a reader picks the question
  they came with.
- **Counts after the 2026-09-06 revision:** 1,503 words inside the article
  including the stage table, the doors, the arithmetic, the completion
  figure and both tracks. Parts 1 and 2 lost two bands and about a third of
  their prose; Part 3 added three short bands. Verified in the browser at
  1440x900, 390x844 and 200% text: zero horizontal overflow, the three map
  anchors resolve, the Part 3 label passes the trunk test after an anchor
  scroll on both viewports, and the smallest route action is at least 44px.
