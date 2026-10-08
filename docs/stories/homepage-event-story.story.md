# Story Tracker: the event you sold is the event you cook

## My story

- **Piece:** homepage repositioning, event-first (2026-09-27). Supersedes the
  "back-of-house" framing in `homepage-caterer-fixes.story.md` for the hero
  and adds one new section. Every other section keeps its own tracker.
- **Hero (the reader):** Dana, owner-operator caterer, six on the crew, reads
  on a phone between services.
- **Content files:** `src/components/sections/Hero.astro`,
  `src/components/sections/EventBooking.astro` (new),
  `src/components/sections/CustomerOutcomes.astro` (first stage only),
  `src/lib/site.ts` (title, description), `CLAUDE.md` (product line).
- **Evidence:** every claim cites a row in
  `docs/research/2026-09-27-app-inventory.yaml`. Production rows only
  (A-01 to A-16, B, D, G). The one-page proposal builder (A-05) and structured
  payment terms (A-17) stay off this page until their kitchen-brain branches
  are on `origin/main`.

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | [x] |
| 2 | Your Character | [x] |
| 3 | The Plot | [x] |
| 4 | From Beats to Scenes | [x] |
| 5 | Character Voices | [x] |
| 6 | Writing Dialogue | [x] |
| 7 | Sorkin Dialogue | [x] |
| 8 | Cool Talk | [x] |
| 9 | Bringing a Scene to Life | [x] |
| 10 | Connecting Your Scenes | [x] |
| 11 | Revise and Finish | [x] |

### Step 1: The Idea
> An **owner-caterer** who wants **to win the job and then cook it on the
> numbers she quoted**, but **the inquiry lives in her email, the proposal in a
> document, the contract in a PDF and the cost in a spreadsheet, and none of
> them agree by the time the van is loaded.**

### Step 2: Your Character
- **Want:** a yes from the client, with a deposit in hand, without chasing.
- **Need:** the price she quoted and the plan the kitchen cooks to be the same
  record, so a yes cannot quietly become a loss.
- **Wound:** the wedding where the client added thirty guests by text, the
  proposal was updated, the shopping list was not, and the margin went with it.
- **Flaw:** she keeps each stage in whatever tool was open at the time, and
  retypes between them.

### Step 3: The Plot (12 beats)
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | A new inquiry arrives while she is plating a lunch. |
| 2 Theme Stated | The event you sold is the event you cook. |
| 3 Set-Up | Inquiry in email, proposal in a document, contract in a PDF, deposit on a sticky note, costs in a sheet. |
| 4 Catalyst | The client changes the count after saying yes; four places need the new number. |
| 5 Debate | "My kitchen is small, this sounds like software for hotels." Answered by who-it-is-for and the fifteen-minute first dish. |
| 6 Break into Two | She takes the inquiry in CostCook and builds the menu from her own costed recipes. |
| 7 B Story | The client: she reviews the offer on her phone, no login, and says yes on her own time. |
| 8 Fun and Games | Proposal, the client's decision, the agreement, the deposit tracked, Confirm order, then shop, prep, pack. |
| 9 Midpoint | The yes becomes a kitchen draft priced at the agreed number; closeout later shows food cost against it. |
| 10 Bad Guys Close In | Limits said plainly: the deposit is recorded, not taken by card (yet); a kitchen draft holds one service; nothing is tracked after Packed. |
| 11 All Is Lost | Another season of retyping between five tools, finding the loss at closeout. |
| 12 Finale | Start the trial with the next real inquiry. |

### Step 4: From Beats to Scenes
| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Hero | 1, 2 | scattered tools → one event record |
| 2 | EventBooking (new): inquiry to booked | 3, 4, 6, 7 | chasing → the client decides on her phone, you book with one button |
| 3 | CustomerOutcomes (kitchen half) | 8 | retyping → one guest count carried through |
| 4 | SeeItRun (film, unchanged) | 8, 9 | claims → watch it run |
| 5 | TheProblem, TheYield, BuiltForKitchens | 3, 9, 10 | doubt about the numbers → inspectable math |
| 6 | WhoThisIsFor, WhatElse | 5, 10 | "is this for me" → fit and limits named |
| 7 | TheOtherTools (incl. what is still coming) | 10, 11 | unknowns → a dated list |
| 8 | StartHere | 12 | considering → first real order |

Meal-prep kitchens (owner decision 3, chosen 2026-09-27): the homepage speaks
to caterers who sell events; meal-prep and restaurants that cater keep their
place on `/who-its-for` and in the WhoThisIsFor section, not in the hero.

### Step 5: Character Voices
- **Reader's words:** "the inquiry", "send them a proposal", "did they sign",
  "chase the deposit", "the count changed", "what did I actually make on it".
- **App's words (quote exactly):** "+ New inquiry", "Send offer",
  "Accept proposal", "Ask for changes", "Prepare the kitchen draft", "Ask for a deposit",
  "Confirm order", "This event is booked.", Clients (never customers).
- **Product voice:** plain, calm, chef-to-chef. Banned: seamless, powerful,
  all-in-one, "in one click", "get paid", "collect deposits".

### Step 6: Dialogue (turns)
- Hero: "I need five tools for one party" → "one event, start to closeout."
- EventBooking: "I chase every yes" → "she accepts on her phone, and her yes is
  already the kitchen's draft."
- CustomerOutcomes stage one: "I quote from an old price" → "the proposal is
  priced from today's recipe costs."

### Step 7: Sorkin
- **Intention:** sell the event and cook it at the price she quoted.
- **Obstacle:** every hand-off between tools is a place the number changes.
- **Headline:** The event you sold is the event you cook.
- **Subhead:** Take the inquiry, send a priced proposal, and let the client
  accept on their phone. Confirm the order, and the same menu and guest count
  build your shopping, prep and pack lists.

### Step 8: Cool Talk (the one snap line)
> Prepare the kitchen draft from their yes. It holds no day and draws no crew
> until you book the event.

(The app's own sentence, `A-13`. The old hero snap, "swap a protein, drop a
dish, raise the price", stays as the practical note under the pricing proof,
not as the page's snap.)

### Step 9: Bringing a Scene to Life
- **Where:** the pass, between a lunch service and the afternoon prep.
- **What:** a phone buzzes: the client accepted. She taps once and the order
  is on the calendar against the day's vans.
- **Time:** 2:40 p.m., gloves still on.

### Step 10: Connecting Your Scenes
- **POV:** second person, "you", locked across the page.
- **Hand-offs:** Hero → "Here is one event, start to booked." EventBooking →
  "Once it is booked, the kitchen side takes the same numbers." CustomerOutcomes
  keeps its existing hand-off to the film.

### Step 11: Revise and Finish
- **Claims removed because they cannot be shown today:** card deposits,
  balance reminders for booked events and customer invoices (not shipped; the
  first two are listed as Coming with the client-payment work in progress);
  the one-page builder's charge lines and choice groups (deploy gate);
  e-signature status track in captures (the signing page prints "Test
  environment"); anything after Packed.
- **Final Image (CTA):** unchanged `cta.label`; the close asks for the next
  real inquiry, not a sample.

### Revision 2026-09-27 (single sources)
- EventBooking's step names, deposit list and offer capture (alt text and
  measured size) are read from `src/lib/events.ts` and `src/lib/proof.ts`,
  the same sources as the events guide. The offer alt now says "service time
  17:00 to 22:00, New York time" (it said "5 to 10 p.m.", which the capture
  does not print).
- The Coming line renders `comingPlans.eventPayments.homepage` verbatim: "A
  card payment page for the deposit and the balance of a booked event, and a
  reminder email before the balance is due." ("events you book by hand" was
  wrong: Confirm order books the event; only the deposit is recorded by hand.)
- The full-size link is visible text beside the image, not an aria-label
  wrapping it, so the image keeps its alt and the link's name is what it says.

### Revision 2026-10-06 (payments and invoice email live)
- Owner ruling: card payment for booked events and invoice email are live.
  Step 11's "card deposits, balance reminders" removal is reversed: the
  payments line renders `eventPayments.homepage` from
  `src/lib/event-payments.ts` (the client pays by card from an email link; a
  reminder with a pay link goes out three days before the balance is due, read off
  kitchen-brain `balance-reminders.ts` on develop 7a7e407d9). The Coming line is gone.
- Customer invoices stay unbuilt and unclaimed.

## Revision 2026-10-07 (boundary line)
- The shared line under the client's yes now reads "Their yes books nothing. The signed agreement and the deposit do." In the owner's chosen app (local develop 7a7e407d9) Book the event is its own step; Confirm order no longer books. The homepage's own steps still need a pass against that app.
