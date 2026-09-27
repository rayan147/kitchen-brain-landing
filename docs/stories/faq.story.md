# Story Tracker — FAQ

## My story

- **Piece:** `/faq`, the questions page
- **Title / headline:** Know the catch before you hand over the card.
- **My hero's name:** The chef-owner, including the restaurant owner who caters or runs special menus, who opened the site on a phone and has three objections before reading a paragraph
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

> A chef-owner with changing event work who half-wants to try this needs the catch and the fit named before handing over a card, but every software FAQ they have read was written to hide both.

### Step 2 — Your Character

- **Want:** The catch. What it costs, when, how to get out, and whether it fits the catering, special-dinner, or changing-menu side of their kitchen.
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
| 5 Debate | Group 2: fit. Restaurant owners get a precise yes for event-driven work; role boundaries and actual limits still get flat, specific answers. |
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
| 3 | Whether it fits your kitchen | 5–6 | a restaurant label → the event work and actual limits named precisely |
| 4 | How the work moves | 7–10 | claims → mechanics with rows behind them |
| 5 | Getting started, and getting help | 11 | alone with a login → a person who answers |
| 6 | Close | 12 | reading → one real order |

### Step 5 — Character Voices

- **Reader's words:** the catch, the card, day sixteen, special dinner, catering order, the truck was short, forty guests, the walk-in, one bar, margin (which we correct to food cost, gently).
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
- Positioning correction: a restaurant owner is not a misfit. The answer now distinguishes repeating daily service from the catering, special-dinner, and changing-menu work CostCook is built to plan.
- Access correction: the FAQ names Owner, Manager and Staff boundaries without claiming a permission grid, and links the dedicated Team & Access guide.
- Sage correction: the answer now reflects eleven read-only checks and one approval-bound shopping-list proposal rather than the stale six-tool summary.

## Revision — trial and offline boundaries (2026-08-30)

All eleven steps remain complete. The trial answer promises only what the product and Stripe setup establish: $0 charged during the 15-day trial, with billing beginning on day sixteen unless cancelled. It no longer promises that Stripe creates no invoice. The walk-in answer separates three states that used to be collapsed into “works offline”: previously loaded order pages remain readable from their cache and show its time; unseen pages fall back offline; writes need a connection. Server-rendered reading with JavaScript disabled remains a separate capability, not an offline guarantee. The page’s snap line and final image remain unchanged.


## Caterer first-visit revision · 2026-09-11

Content: `src/lib/faq.ts` and its shared data/response states.

- [x] 1 — Idea: A busy caterer wants to find a direct answer before handing over a card, but internal terminology and merged answers delay the decision.
- [x] 2 — Character: Runs six people; spreadsheet competent, nontechnical, between services. Wants a quick decision; needs checkable inputs, limits and next action; remembers abandoned software setup; assumes unfamiliar words mean more work.
- [x] 3 — Twelve beats: Interrupted service → clear next decision → existing spreadsheet work → unclear promise → time/card doubt → open the relevant CostCook guide → crew needs a usable plan → inspect the example → understand one concrete outcome → check missing data and limits → avoid another unexplained commitment → choose a guide, trial or human answer knowingly.
- [x] 4 — Six scenes: Entry (uncertain → oriented); prerequisites (unknown → prepared); example (claim → evidence); consequences (guess → known); limits/recovery (risk → choice); next action (pause → decision). These map to existing sections and response states, without adding narrative scaffolding.
- [x] 5 — Voices: Persona questions are simulated, not interview quotes. Reader: “What do I need?”, “Does this include my crew?”, “Did it send?” Product: calm, concrete, kitchen-literate; ban seeded, mechanism, release flag from explanatory copy.
- [x] 6 — Dialogue: Each scene answers the question raised by the last; retain numbers and limits that change the decision, remove editorial commentary.
- [x] 7 — Intention/obstacle: Help her find a direct answer before handing over a card; explain the work required before asking her to act.
- [x] 8 — Snap: “The guest count.”
- [x] 9 — Scene: Phone beside the prep list, crew waiting for the next service; attention is limited, not competence.
- [x] 10 — Connection: Reader-focused guide prose; founder voice explicitly identifies Rayan where he answers. Entry → evidence → constraints → action.
- [x] 11 — Revision: Rendered copy, units, navigation and recovery verified. Build and claim checks pass; eight routes at five widths, 200% text, thirteen tour stops, no-JS fallback and mocked contact failure/retry/success pass. Evidence: `docs/qa/resources-caterer-2026-09-11/report.md`.

## Claim correction · 2026-09-27 (Sage tools and drafts)

- [x] 11 Revision: Sage now has 22 read-only tools and 3 draft kinds (the kitchen shopping list, one order's shopping list, a guest-count change on a draft order); nothing changes until a manager or owner approves the draft. "Eleven checks", "one proposal" and "shopping-list proposal" were stale, and "proposal" now names the client document, so Sage's output is called a draft everywhere. Beats, point of view and snap line unchanged. Gap report S1, S10, W2; ledger RC-46, RC-49.

## Claim correction · 2026-09-27 (purchase orders)

- [x] 11 Revision: Confirming an order contacts no supplier. The owner presses Order from suppliers and picks email, print or manual per supplier, or I'll shop it myself (kitchen-brain PurchaseOrderReview.svelte). The sentence saying confirmation emails or creates purchase orders was false and is replaced. Beats and snap line unchanged. Gap report S2.

## Claim correction · 2026-09-27 (margin wording)

- [x] 11 Revision: The app does show "Gross margin" on event totals and recipe pricing, so "it is never called margin" was false. The true boundary stays: food cost is food only, and the gross margin the app shows is food-only, not business margin after labor and overhead. Gap report S4, W4.

## Claim correction · 2026-09-27 (buying to par shipped)

- [x] 11 Revision: Buying to par left the Coming list by shipping. Inventory > Build shopping list builds what to buy for confirmed events and your par, by supplier (kitchen-brain e2e/buy-to-par.spec.ts). The Coming band now carries two plans, the /compare row is Yes, and the inventory answers say so. Beats and snap line unchanged. Gap report F1; RC-43.

## Claim correction · 2026-09-27 (kitchen labels available)

- [x] 11 Revision: The owner approved the RC-35 labels launch decision on 2026-09-27 and LABELS_STATUS is now yes. Kitchen date labels print from Prep and Pack through the browser; label stock is set once in Settings > Labels. The premise that the whole feature sat behind the label_printing flag was false (gap report F2). Every Coming sentence about kitchen labels is gone; the browser-only, never-guessed-date and blank-allergen boundaries stay. Beats and point of view unchanged; the labels page hero now states availability instead of a preview.
