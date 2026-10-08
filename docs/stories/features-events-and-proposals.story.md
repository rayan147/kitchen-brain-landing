# Story Tracker: Events, proposals and booking (feature page)

## My story

- **Piece:** feature explainer, `/features/events-and-proposals` (new,
  2026-09-27). The detailed companion to the homepage's EventBooking section.
- **Hero:** Dana, owner-caterer; a client just called about an October wedding.
- **Content files:** `src/pages/features/events-and-proposals.astro`,
  `src/components/sections/EventsProposalsFeature.astro`.
- **Evidence:** inventory rows A-01 to A-16, B-01 to B-09, C-14/C-15 (day
  verdict for hand-made orders), D-04, D-11. Production only. Deploy-gated
  rows (A-05 one-page builder, A-17 payment terms) are named only in the
  Coming block, never as shipped.

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
> An **owner-caterer** who wants **a signed, booked event without losing the
> numbers she quoted** but **runs the inquiry, proposal, contract, deposit and
> kitchen plan in five places that never agree**.

### Step 2: Character
- **Want:** the client's yes and a date on the calendar.
- **Need:** one event record that the kitchen cooks from.
- **Wound:** a proposal updated for extra guests while the shopping list was not.
- **Flaw:** retyping between tools because each stage lives where it started.

### Step 3: The Plot
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | "October 10, about 150, a wedding. Can you send something?" (the date and count match every capture) |
| 2 Theme | One event record from the first call to Confirm order. |
| 3 Set-Up | Email thread, document, PDF, sticky note, sheet. |
| 4 Catalyst | The client asks for changes after the proposal went out. |
| 5 Debate | "Clients will not log in to anything." (They do not have to.) |
| 6 Break into Two | "+ New inquiry" with the date not decided yet. |
| 7 B Story | The client, deciding on their phone at their own pace. |
| 8 Fun and Games | Pipeline tabs, menu with live food cost, preview and send, remind/extend/withdraw, update the offer, agreement, kitchen draft, deposit tracked, Confirm order, calendar and the day's room. |
| 9 Midpoint | "This event is booked." and the order is on the calendar against the day's vans. |
| 10 Bad Guys | Limits: deposit recorded by hand; one service per kitchen draft; acceptance is not a signature or a booking; nothing tracked after Packed; no customer invoice. |
| 11 All Is Lost | Keep chasing yeses in email and find the loss at closeout. |
| 12 Finale | Start the trial with the next real inquiry. |

### Step 4: Scenes
| § | Section | Turn |
|---|---------|------|
| 1 | Hero: the call, in the client's words | scattered → one record |
| 2 | The inquiry and the pipeline | forgotten follow-up → an owner and a date |
| 3 | The proposal and the client's decision | chasing → they decide on their phone |
| 4 | Agreement and deposit | loose paper → kept on the event |
| 5 | Booked: kitchen draft, Confirm order, calendar and the day's room | a yes → a plan the kitchen cooks |
| 6 | Clients | retyping details → the client book carries them |
| 7 | Limits and what is coming | doubt → named edges |
| 8 | Close | CTA |

### Step 5: Voices
- **Reader:** "send them something", "did they sign", "chase the deposit".
- **App (exact):** "+ New inquiry", "Date not decided yet", "Needs attention",
  "Booked · coming up", "In pipeline", "Past & closed", "Send a reminder",
  "Extend link", "Withdraw offer", "Accept proposal",
  "Ask for changes" (and decline, per A-07; check the label), "Attach the accepted proposal as
  Schedule A", "Prepare the kitchen draft", "Ask for a deposit",
  "Confirm order", "This event is booked.", Clients.
- **Banned:** collect/take/get paid (deposit), invoice (for the client),
  dispatch, delivery tracking, seamless, all-in-one.

### Step 6: Turns (one per section, see Step 4).

### Step 7: Sorkin
- **Headline:** the client's own words on the call.
- **Subhead:** Put it in as an inquiry, and the same record carries the
  menu, the proposal, their answer, the agreement and the booked order.

### Step 8: Snap
> Their yes is not a signature or a booking. Confirm order is.

(Revised 2026-09-27 at build. The earlier line added "and the client's page
says so", which is the older `/proposals/...` route's sentence (A-07); the
client's link is now `/o/<token>` and no capture shows that page printing it,
so the page states the boundary in its own voice and names the booking step
instead. Pinned by `scripts/check-events-proposals-page.mjs`.)

### Step 9: Scene
- The call comes in during Saturday prep; the inquiry is saved before the
  stock comes off.

### Step 10: Connection
- POV "you" throughout. Each section ends on the next step's name, in the
  app's step-bar order.

### Step 11: Revise
- **Removed:** card deposits, balance reminders and payment terms on the
  proposal (Coming block only); the one-page builder's charge lines (deploy
  gate); e-signature status track captures (the signing page prints "Test
  environment"); customer invoices, BEO, staffing, dispatch.
- **Also removed at build (2026-09-27):** the client's decline button (only
  "Accept proposal" and "Ask for changes" are captured on `/o/`); the closeout
  capture (its event date was moved by SQL to open closeout and contradicts
  every other frame, and the scenes end at the day's room); a Clients capture
  (none exists, so the slot is left out, not mocked).
- **Captures used:** events-inquiry-mobile (hero), events-workspace-desktop
  (§2), events-offer-mobile (§3), events-deposit-desktop (§4),
  events-kitchen-draft-desktop, events-confirm-desktop and
  events-calendar-desktop (§5). Sizes are read from the PNGs at build time.
- **One sentence per explanation** (owner rule): each section is a heading and
  one to three single-sentence paragraphs.
- **Final Image:** unchanged `cta.label`.

### Revision 2026-09-27 (single sources)
- The six step names, the deposit list ("a check, cash, a transfer or your own
  card processor") and the boundary line ("Their yes is not a signature or a
  booking. Confirm order is.") now come from `src/lib/events.ts`; the capture
  map and alt text from `src/lib/proof.ts` (`eventProof`), shared with the
  homepage. Rendered wording unchanged except: the offer alt's service time
  reads "17:00 to 22:00, New York time", as the capture prints it.
- The Coming block's body now reads "A card payment page for the deposit and
  the balance of a booked event, and a reminder email before the balance is
  due." (it said "events you book by hand"; booking is Confirm order, only the
  deposit is recorded by hand). The demo link renders `demoCta.label`.

### Revision 2026-10-07: the snap line, reworded
"Their yes is not a signature or a booking. Confirm order is." read to a chef
reviewer as if Confirm order were the signature. The line is now "Their yes
books nothing. Confirm order does." (`acceptanceBoundary`, shared by this
page, /compare and the homepage rail). The signature is the Agreement step.

### Revision 2026-10-07: chef audit of the feature and resource routes
- The payments line is titled "Card payment for event deposits and balances", not "for booked events": the deposit is paid before Confirm order books it.

### Revision 2026-10-07: the opening quote
- "A wedding in October, about 150. Can you send something?" The old line named October 10 while the inquiry capture beside it has "date not decided yet" ticked; the date is settled later, as the calendar shows.
- Known app bug, not page copy: the calendar card reads "Nair & #783" (the app shortens the event name to its first word plus the order number). Flagged for kitchen-brain.

## Revision 2026-10-07 (re-shot from the owner's chosen app: local develop 7a7e407d9)
- One wedding, one date: every capture is the Nair & Castellano wedding on Sat Dec 19, $95, 150 guests, $3,500 deposit, balance due Wed Dec 9, the homepage's event. H1: "A wedding in December, about 150."
- Booking is its own step in this app: Book the event waits on the signed agreement and the deposit (Book anyway asks for a reason). Confirm order only locks quantities and prices. The booked section, its new Book the event frame and the shared boundary line ("Their yes books nothing. The signed agreement and the deposit do.") say so.
- The deposit frame is shown whole: it now lists the deposit and the balance with their due dates.
- The calendar card still reads "Nair & #783" (app truncation; noted before).

### Revision 2026-10-07: chef voice pass
Owner: make the site read like a chef wrote it. Copy only; the H1 quote, the
money sentence, the acceptance boundary, the limits and every caption and alt
text are unchanged.
- **Hero lede:** the five-noun list ("the menu, the proposal, their answer,
  the agreement and the booked order") became "From there it is one record,
  all the way to the booked order." The step bar under it already names the
  six steps.
- **Proposal, agreement, booked:** chained clauses split into short
  sentences in the order a cook does them ("Look it over exactly as the
  client will see it", "Book anyway and it asks why, and your reason stays on
  the event"). The app's button names stay as written.
- **Shared line:** `eventPayments.homepage`, read by the Payments note, was
  reworded on the homepage pass with its meaning held (card, email link,
  deposit and balance, sent whenever you choose, a reminder with a pay link
  three days before if still owed). This page's contract still matches it.
