# Story Tracker: Blog, one catering event from the first call to closeout

## My story

- **Piece:** blog guide, `/blog/catering-event-first-call-to-closeout`
  (2026-10-01 in the weekly sequence). The trunk post: every step of the
  event workflow in the app's order, and each step links the guide that
  covers it in depth. Hands off to `/features/events-and-proposals`.
- **Hero:** the owner-caterer who takes event inquiries by phone mid-shift
  and runs the rest from memory, documents and text threads.
- **Content file:** `src/content/blog/catering-event-first-call-to-closeout.md`.
- **Evidence:** kitchen-brain local develop 7a7e407d9 (the owner's chosen
  source, 2026-10-07), labels read 2026-10-08 from `routes/events/*`,
  `events/new`, `MenuStartOptions`, `EventTotals`, `proposal/send`,
  `events/[id]/decision`, `o/[token]`, `settings/contracts`, `AgreementRail`,
  `EventDeposit`, `BookEvent`, `OrderRedesignShell`, `SupplierOrdersRail`,
  `ShopDetail`, `ReceivingLine`, `receiving`, `orders/[id]/closeout`. Claims
  stay inside what `/features/events-and-proposals`, `/features/order-shop-prep-pack`
  and `/features/purchasing-and-receiving` already say; limits are the events
  page's own list. The sample event is the events page's: a December wedding
  for about 150. No figures beyond that are invented.
- **Kept out:** the proposal builder's charge lines, choice groups and payment
  terms (A-05, A-17, RC-62, as on the events page); the client's decline
  button (not captured, as on the events page); the ordering-site allergen
  check on inquiries (ordering-site only); online orders (posts 1 and 2 of
  `docs/plans/2026-10-08-ordering-and-event-blog-plan.md` are held: production
  storefront 1bd7ef34 has no pay route).
- **Correction to the plan:** at 7a7e407d9 Book the event is its own step
  (agreement and deposit); Confirm order comes after and locks the numbers.

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
> An **owner-caterer who sells events** wants **one record from the first call
> to the last pan**, but **the inquiry starts on the back of a ticket and the
> rest lives in documents, texts and memory**.

### Step 2: Character
- **Want:** see what CostCook does at each step before trying it.
- **Need:** one event that carries its own numbers from quote to closeout.
- **Wound:** the shopping list built on last month's head count.
- **Flaw:** "I'll write it down properly later."

### Step 3: The Plot
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | "Wedding Dec 150" on the back of a ticket. |
| 2 Theme | One record, all the way through. |
| 3 Set-Up | Where events slip: memory, documents, texts. |
| 4 Catalyst | + New inquiry. |
| 5 Debate | No date yet? Save it anyway. |
| 6 Break into Two | The costed menu. |
| 7 B Story | The client, on their phone, at their own pace. |
| 8 Fun and Games | Proposal, agreement, deposit. |
| 9 Midpoint | Book the event: the check that lists what is missing. |
| 10 Bad Guys | Head count changes, short deliveries, price moves. |
| 11 All Is Lost | The limits (one service, no invoice, nothing after Packed). |
| 12 Finale | Closeout, then Copy a past event for the next call. |

### Step 4: Scenes
Twelve numbered steps, then Where it stops, then the close. A trunk guide is
the exception to 6 to 8 scenes: the reader asked for every step, and each
section is one turn.

### Step 5: Voices
- Reader: "the burner is calling", "back of a ticket", "the week of".
- Product: the app's labels, bolded and verbatim.

### Step 6: Turns
Each step moves one thing from memory into the record: the follow-up, the
cost, the price, the yes, the signature, the money, the day, the lists, the
delivery, the result.

### Step 7: Headline
"Running a catering event in CostCook, from the first call to closeout."

### Step 8: Snap line (one)
"Their yes books nothing. The signed agreement and the deposit do." (shared
with the events page; in this post it pays off the "sure, sounds great" line).

### Step 9: Scene
Lunch prep, phone wedged on a shoulder, a ticket and a Sharpie.

### Step 10: Connection
Second person throughout. The opening ticket returns in the close; each step
links its deeper guide.

### Step 11: Revise
Cut online orders (held). Cut charge lines and payment terms (gated on the
landing). Cut "This event is booked" (no such string in the app).
