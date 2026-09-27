# Story Tracker — Taking orders

## My story

- **Piece:** Taking orders (the Coming feature group, the menu chip, the FAQ answer)
- **Title / headline:** The enquiry, arriving as something you can quote from.
- **My hero's name:** The owner-caterer taking Saturday's order over the phone with wet hands
- **Content file(s):** `src/lib/ordering.ts`, `src/lib/features.ts`, `src/lib/faq.ts`

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

> A caterer wants Saturday's enquiry to arrive as something he can quote from, but every order still comes as a phone call he transcribes twice and a text he cannot find on Friday.

### Step 2 — Your Character

- **Want:** Stop re-typing the enquiry into the quote.
- **Need:** To be told plainly that this is built and unreachable, so he does not choose CostCook for it and then sit waiting.
- **Wound:** Chose a product once for a screenshot of something that never shipped.
- **Flaw:** Hears "built" as "available", which is exactly the word this feature invites.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | A phone number on a chalkboard and a notebook with three different Saturdays in it. |
| 2 Theme Stated | An order that arrives is still an order you have to say yes to. |
| 3 Set-Up | The costing, the shopping, the prep and the pack already work from one menu and a guest count. |
| 4 Catalyst | He asks whether customers can order from him through CostCook. |
| 5 Debate | Is this the thing that ends the phone calls, or another roadmap line? |
| 6 Break into Two | The answer is Coming, and the reason is the deployment rather than the code. |
| 7 B Story | Built and unreachable is a real distinction, and saying it out loud is what makes the rest of the site worth believing. |
| 8 Fun and Games | What it will do: a menu he published, choices sized, a date, a headcount, a contact, read back before sending. |
| 9 Midpoint | The order arrives awaiting kitchen confirmation, not booked. He still says yes. |
| 10 Bad Guys Close In | Four sentences would each round this up: it confirms, it gets him paid, the customer sees a price, it works while he sleeps. |
| 11 All Is Lost | Any one of those four fails on the first demo call and takes the shipped claims down with it. |
| 12 Finale + Final Image | Coming, with no date, and four boundaries a guard will not let the site cross. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Feature group lead | 1–4, 6 | hoped-for capability → built, not deployed, Coming |
| 2 | Feature group detail | 8–9 | vague "online ordering" → five named steps ending at a confirmation he gives |
| 3 | Menu chip | 6 | a label that could read as shipped → a chip that reads the same word as the group |
| 4 | FAQ answer | 5, 9–12 | "can customers order from me" → No today, and exactly what it will be |

### Step 5 — Character Voices

- **Reader's words:** the enquiry, the phone call, headcount, the date, deposit, do they pay up front, can they order online.
- **Product voice:** plain, unhurried, careful with the difference between written and reachable.
- **Banned:** online ordering platform, seamless, storefront in one click, any date, any word that turns Stripe into a payments product.

### Step 6 — Dialogue

- The lead: an assumed capability → built, not deployed, and the word Coming.
- The detail: a form → five steps that end where a kitchen decision begins.
- The confirmation line: an order that lands → an order awaiting his yes.
- The FAQ: "can they order from me" → not today, and here is precisely what it will be when it lands.

### Step 7 — Sorkin

- **Intention:** Stop transcribing Saturday's order twice.
- **Obstacle:** The capability is finished and no customer on earth can reach it, which is the hardest kind of No to say without sounding like a roadmap.
- **Headline:** The enquiry, arriving as something you can quote from.
- **Subhead:** Built, not deployed, marked Coming. No date.

### Step 8 — Cool Talk

"It arrives awaiting kitchen confirmation, which means you still say yes to it."

### Step 9 — Bringing a Scene to Life

- **Where they are:** By the pass at four in the afternoon, phone wedged against a shoulder, hands wet.
- **What they see:** A notebook page with a headcount crossed out twice and a date he will re-type into the quote tonight.
- **Time of day:** Late afternoon, between prep and service, when the enquiry always comes.

### Step 10 — Connecting Your Scenes

- **POV:** You, locked throughout.
- **Hand-offs:** The day itself covers the event, the shopping, the prep and the pack → taking orders sits at the front of that same day, marked Coming → the menu chip carries the same word → the FAQ answers it directly for anyone who came looking for it.

### Step 11 — Revise and Finish

- **Before → after:** Silence on the site becomes one clearly marked Coming group, rather than a shipped-sounding feature nobody can reach.
- **Claims removed:** That an order is confirmed. That prices are worked out in the customer's browser. That Stripe means money arriving. That the widget can be driven from the page around it.
- **The ending is the word Coming**, and it has to be the least ambiguous word in the group. Four guard regexes exist so the four tempting sentences fail the build rather than the demo call.
- **Final image:** Built, not deployed, no date, and five steps that end with him saying yes.

## Claim correction · 2026-09-27 (online ordering available)

- [x] 1 Idea: A caterer who takes orders by text wants clients to request from her own page, but she will not hand a stranger a booked date or a promise about money.
- [x] 3 Plot: The ending is no longer the word Coming. The client requests, she approves, and the client's payment confirms the order.
- [x] 7 Headline: "Online orders: the client requests, you approve, their payment confirms." Subhead: Available now.
- [x] 8 Snap: kept, reworded to the new truth: it arrives awaiting kitchen confirmation, and you approve or decline.
- [x] 11 Revision: ORDERING_STATUS is yes after the owner ruling of 2026-09-27 (FEATURE_ORDERING_INTEGRATION_ENABLED on as the deployment default). "Built, not deployed" and "Stripe is a handoff" were removed. Limits stated plainly: nothing is charged at request; approval is not confirmation; 72-hour payment window; one balance reminder with a pay link; card payment for online orders only, no saved cards, no automatic refunds, no client invoices; custom requests become inquiries. "Client", not "customer", in every rewritten line. Gap report S9, W9; RC-59.
