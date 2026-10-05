# Story Tracker — Homepage caterer walkthrough fixes (2026-09-10)

## My story

- **Piece:** Revision pass across the homepage (fold price line, hero caption, outcomes Plan card, demo guide, intake block, close), header, pricing surfaces
- **Title / headline:** unchanged. "Cost it, buy it, prep it, pack it. Enter the numbers once." and "Put one real order through it."
- **My hero's name:** Dana, owner of a six-person catering operation, good with spreadsheets, reading on a phone in the gap between services
- **Content file(s):** `src/components/sections/Hero.astro`, `src/components/sections/StartHere.astro`, `src/components/sections/CustomerOutcomes.astro`, `src/components/sections/SeeItRun.astro`, `src/components/more/IntakeBlock.astro`, `src/components/more/AccessBlock.astro`, `src/components/sections/WhoThisIsFor.astro`, `src/components/SiteNav.astro`, `src/lib/site.ts`, `src/lib/faq.ts`, `src/lib/comparison.ts`, `src/pages/pricing.astro`

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

> A spreadsheet-literate caterer wants to decide between services whether trying CostCook is worth it, but the page left her with unanswered costs: what the trial takes to set up, what "per kitchen workspace" charges her for, and why the same wedding carries three different numbers.

### Step 2 — Your Character

- **Want:** a yes or no on the trial in under a minute.
- **Need:** every cost of trying it on the table before the card comes out: money, crew, setup hours.
- **Wound:** a platform that asked for her whole catalog before it showed a single number, and a quote she lost because a number was wrong.
- **Flaw:** she checks the arithmetic. One mismatch and she stops trusting all of it.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Phone out, gap between services, a cold email open. |
| 2 Theme Stated | "One job pretending to be six." The numbers stay the same the whole way. |
| 3 Set-Up | The fold price line: $49/month. Is that per kitchen or per person? Now: per kitchen, unlimited crew during launch. |
| 4 Catalyst | The pricing panel says charge at least the target price, and her gut says "I'd lose that job." |
| 5 Debate | Is the panel telling her what to do? Now: it is a check; swap a protein, drop a dish, raise the price, or take the margin knowingly. And is the number wrong? Now: it is food only, said in visible text. |
| 6 Break into Two | The film. She follows one wedding. Its figures now match the hero's (one demo state). |
| 7 B Story | The crew: the sous, the prep cooks. Unlimited during launch, on the price line and in the access block. |
| 8 Fun and Games | Shop, Prep, Pack on one plan, and they work on a phone, readable in a walk-in with no signal. |
| 9 Midpoint | The purchase-order email, shown in an inbox "exactly as a supplier receives it", not a "capture inbox". |
| 10 Bad Guys Close In | Paper in: the review queue, not a "staging queue". Receiving at the dock on a phone is NOT claimed (the app's receiving table clips at 390px). |
| 11 All Is Lost | "Put one real order through it" means every dish and every price first, and the page used to say nothing. |
| 12 Finale + Final Image | "What it takes first": each dish goes in once, upload and confirm, type what it could not read, about fifteen minutes for the first. Then the button, which now says "Start free trial". |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn (− → +) |
|---|---------|-------|--------------------|
| 1 | Fold price line | 3 | "is my sous another $49?" → one kitchen, whole crew |
| 2 | Hero caption | 4–5 | "it's telling me to overcharge" → "it's a check, and I decide" |
| 3 | Film + guide | 6, 9 | dev-rig words → plain kitchen words; one set of numbers |
| 4 | Outcomes: Plan | 8 | "does this work on a phone?" → the three screens it does, stated |
| 5 | Intake | 10 | "staging queue?" → review queue |
| 6 | Close | 11–12 | "this is an afternoon of typing" → one dish, about fifteen minutes, the rest the same way |
| 7 | Header | 12 | three button-shaped actions → one button, one link |

### Step 5 — Character Voices

- **Reader's words:** "I'd lose that job." "Is a workspace a kitchen? A user?" "Do I have to type in all my recipes first?"
- **Product voice:** plainspoken, warm, unhurried. Banned: "in one click", "seamless", "effortless", any no-typing promise (RC-58).

### Step 6 — Dialogue (McKee): the turn in each section

1. Price line: suspicion about per-seat pricing → the unit named once.
2. Caption: feeling instructed → feeling equipped.
3. Film guide: "who is this written for?" → it is written for her.
4. Plan card: silent on phones → a bounded, true phone sentence.
5. Intake: jargon → the app's own word.
6. Close: evasion → the cost of the test, stated before the button.
7. Header: two buttons competing → one.

### Step 7 — Sorkin: headline / subhead

- **Intention:** start the trial.
- **Obstacle:** the unstated setup cost.
- **Headline:** unchanged ("Put one real order through it.").
- **Subhead addition:** "What it takes first: every dish on that menu goes in once."

### Step 8 — Cool Talk: the one snap line

> "Swap a protein, drop a dish, raise the price, or take the job at that margin knowing it."

### Step 9 — Bringing a Scene to Life

The pass-through between services, phone in one hand, wet towel over the shoulder, reading the $/guest the panel wants and doing the maths against what the client will pay.

### Step 10 — Connecting Your Scenes

POV stays second person throughout, matching the page. The caption hands off to the film ("this wedding"); the close's new paragraph hands off to the trial ticket beside it and to /onboarding for anyone who wants to see every screen first.

### Step 11 — Revise and Finish

- Every new claim traces to an existing ledger entry: unlimited crew (FAQ billing answer, pricing page), fifteen minutes for the first dish (RC-10, owner-confirmed approximation), upload-then-confirm with typed leftovers (RC-58), phone + no signal for Shop/Prep/Pack (RC-54), the food-only exclusions (the app's own sentence on the target panel, outcome-quote.png).
- Claims withheld: receiving on a phone at the dock. The app bug (receiving table clips at 390px, `src/lib/workflow.ts`) has to be fixed first.
- One wedding, one set of numbers: the film's figures are canonical ($26.93 / 39.6% / 9.6 points / $89.78). `hero-pricing.png`, `hero-pricing-mobile.png` and `outcome-quote.png` were recaptured by `scripts/capture-proof.mjs` from `sandbox/demo` 63a25ae8 seeded at `HISTORY_SEED_DATE=2026-08-21`. The app now totals the order at $4,847.95 (a 2026-09-04 rounding fix) against the film's $4,847.96, so by owner decision the hero crop stops at the target box and next step and shows no total. The two worked blog posts and the blog index card moved to the same figures; their $4,847.96 matches the film.
- Held by the build: `scripts/check-landing-claims.mjs`, block "2026-09-10 CATERER WALKTHROUGH" (including retired wedding figures), and `scripts/check-blog.mjs` (the target-price equation).
