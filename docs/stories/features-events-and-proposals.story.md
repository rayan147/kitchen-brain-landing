# Story Tracker: Events, proposals and booking (feature page)

## My story

- **Piece:** feature explainer, `/features/events-and-proposals` (new,
  2026-09-27). The detailed companion to the homepage's EventBooking section.
- **Hero:** Dana, owner-caterer; a client just called about a June wedding.
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
| 1 Opening Image | "June 14, about 150, garden ceremony, can you send something?" |
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
> Acceptance is not a signature or a booking, and the client's page says so.

(The app's own statement on the offer page, A-07.)

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
- **Final Image:** unchanged `cta.label`.
