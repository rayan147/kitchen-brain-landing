# Story Tracker — FAQ

## My story

- **Piece:** `/faq`, the questions page
- **Title / headline:** Know the catch before you hand over the card.
- **My hero's name:** The owner-caterer who got the text, opened the site on a phone, and has three objections before they have read a paragraph
- **Content file(s):** `src/lib/faq.ts`, `src/pages/faq.astro`, `src/components/sections/FaqPage.astro`, link lines in `src/lib/site.ts` and `src/components/sections/StartHere.astro`

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

> An owner-caterer who half-wants to try this needs the catch named before they hand over a card, but every software FAQ they have read was written to hide the catch.

### Step 2 — Your Character

- **Want:** The catch. What it costs, when, how to get out, and whether it does the four things they are afraid it does not.
- **Need:** To be told no by the company, in plain words, so that the yeses can be believed.
- **Wound:** A trial that turned into a bill, and a "contact sales to cancel". A feature list where "coming soon" meant never.
- **Flaw:** Assumes every answer is spin, so reads only the first word of each.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The reader with the cold email open and three objections. |
| 2 Theme Stated | "Where the answer is no, it says no." |
| 3 Set-Up | Group 1: the money. Trial, card, cancel, price, seats, export. |
| 4 Catalyst | "Can I take my work with me?" answered with a yes and a plain "not yet". |
| 5 Debate | Group 2: fit. Four flat noes, one not-yet, one "it is food cost, not margin". |
| 6 Break into Two | The reader believes the noes, so the yeses in group 3 land. |
| 7 B Story | The founder answering in first person ("that one is on me to build", "I do"). |
| 8 Fun and Games | Group 3: how the work moves, one mechanic per question, each on a ledger row. |
| 9 Midpoint | "What do I retype?" "The guest count." |
| 10 Bad Guys Close In | Inventory is not a live count; email is email; the combined run does not buy. |
| 11 All Is Lost | Nothing is hidden and nothing is oversold, which is the whole point. |
| 12 Finale + Final Image | Group 4 gets them started; the close asks once, in the homepage's words. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Promise + before-you-start ticket | 1–2 | suspicion → four hard terms visible |
| 2 | The trial, the bill, and leaving | 3–4 | the catch hidden → the catch named |
| 3 | Whether it fits your kitchen | 5–6 | spin → flat noes that make the yeses credible |
| 4 | How the work moves | 7–10 | claims → mechanics with rows behind them |
| 5 | Getting started, and getting help | 11 | alone with a login → a person who answers |
| 6 | Close | 12 | reading → one real order |

### Step 5 — Character Voices

- **Reader's words:** the catch, the card, day sixteen, the truck was short, forty guests, the walk-in, one bar, margin (which we correct to food cost, gently).
- **Product voice:** first person where a human is answering (cancel, export, help), otherwise plain second person. "No." as a complete sentence.
- **Banned:** seamless, powerful, in one click, exclamation points, em-dashes, "margin" as a claim, "no data entry".

### Step 6 — Dialogue

Every answer turns doubt → checkable fact by naming the mechanism (Stripe, Settings then Billing, the recipe list export, whole packs, the newest purchase by date). Answers that cannot name a mechanism were cut.

### Step 7 — Sorkin

- **Intention:** Get to the card with nothing left to be surprised by.
- **Obstacle:** Every FAQ the reader has ever read.
- **Headline:** "Know the catch before you hand over the card." Subhead: "Where the answer is no, it says no."

### Step 8 — Cool Talk

**"The client added forty guests. What do I retype?" "The guest count."** One line, and it is the product.

### Step 9 — Bringing a Scene to Life

Phone, one bar, the walk-in door propped with a foot. The reader is not going to open an accordion. Everything is open, the four hard terms are visible first, and #cancel is a link that can go in a reply.

### Step 10 — Connecting Your Scenes

- POV: second person, with the founder's first person only where a human is doing the thing (cancelling nothing, building the export, answering the email). Never both in one answer.
- Order: money → fit → mechanics → start. Each group's last question hands to the next group's first (export → who is this for; margin → how does a quote get its food cost; inventory → how do prices get in; demo → the close).

### Step 11 — Revise and Finish

- Cut: an onboarding-wizard answer (RC-10 to RC-15 are conditional on the deployed build and the ledger says so), a "how accurate is the OCR" answer (excluded claim), and a "how fast is setup" answer (excluded claim).
- Every answer names its rows; `check-landing-claims.mjs` fails on a row that does not exist and on a no answer that stops opening with "No."
- Ending: the homepage's close, in its words, once.
