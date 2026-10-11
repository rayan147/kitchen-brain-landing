# Story Tracker — A catering deposit without chasing it

## My story

- **Piece:** Worked blog guide
- **Title:** How to get a catering deposit in without chasing it
- **My hero:** An owner-caterer the week after a wedding couple said yes, spending on rentals before the deposit lands
- **Content file:** `src/content/blog/catering-deposit-without-chasing.md`
- **Source of truth:** kitchen-brain `develop` 66d0703fe, read 2026-10-10 (four read-only research passes; exact strings and file:line in the session notes). kitchen-brain origin/main (ed6ff5f01, 2026-09-27) does not carry the payment schedule, "Book the event", "Record a payment" or card deposits; the site follows develop under the owner's standing rulings.

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ |
| 4 | From Beats to Scenes | ☑ |
| 5 | Character Voices | ☑ |
| 6 | Writing Dialogue | ☑ |
| 7 | Sorkin Dialogue | ☑ |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ |
| 10 | Connecting Your Scenes | ☑ |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

An owner-caterer who wants the deposit in before spending on the event, but only mentioned it after the yes and is now texting for it.

### Step 2 — Your Character

- **Want:** The deposit in, without the awkward texts.
- **Need:** The deposit agreed as part of the yes, and a booking rule that waits for it.
- **Wound:** Spending on rentals for a wedding that went quiet.
- **Flaw:** Treating the client’s yes as the booking.

### Step 3 — The Plot

| Beat | In this guide |
|------|---------------|
| Opening Image | Sunday yes, Friday second text. |
| Theme Stated | You chase the deposit you only mentioned. |
| Set-Up | Deposits agreed after the yes are favours. |
| Catalyst | Rentals and dry goods need money this week. |
| Debate | Push the couple, or front the money? |
| Break into Two | Put the money on the proposal. |
| B Story | The guest count that keeps moving until the balance date. |
| Fun and Games | One wedding worked: 30% of $9,600, balance 14 days out. |
| Midpoint | "A yes isn’t a booking": four conditions. |
| Bad Guys Close In | What still needs you: manual deposit asks, refunds in Stripe, no re-billing. |
| All Is Lost | Book anyway, and why to write the reason. |
| Finale + Final Image | Friday with nobody to text; the deposit is in, the date is booked. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Opening | Opening + theme | relief → dread |
| 2 | Put the money on the proposal | Set-up + break | favour → term |
| 3 | Work one wedding | Fun and games | vague → $2,880 exact |
| 4 | What the client does | Promise | chasing → a link |
| 5 | Book on all four | Midpoint | feeling → four conditions |
| 6 | What still needs you | Bad guys | assumed automation → known limits |
| 7 | The week after the yes | Final image | texts → booked |

### Step 5 — Character Voices

- **Reader:** "We’ll send it this week.", "I feel like a debt collector."
- **Product:** calm, exact, names the app's own labels in bold; says plainly what it does not do. Banned: seamless, smart, peace of mind.

### Step 6 — Dialogue turns

Relief becomes dread; a mention becomes a term; a yes becomes four conditions; assumed automation becomes a short list of what still needs you.

### Step 7 — Headline / subhead

- **Intention:** Get the deposit in.
- **Obstacle:** It was never part of what they agreed to.
- **Headline:** How to get a catering deposit in without chasing it
- **Subhead:** Set the deposit and the balance date on the proposal, so the client agrees to them before they agree to the food.

### Step 8 — The one snap line

> Nobody chases a deposit they set up properly. You chase the one you only mentioned.

### Step 9 — Bringing the scene to life

- **Where:** The office, phone in hand, rental quote open.
- **Sensory detail:** The unanswered text thread.
- **Time:** The Friday after a Sunday yes.

### Step 10 — Connecting the scenes

- **POV:** Second person throughout.
- **Hand-offs:** proposal → arithmetic → client → booking rule → limits → checklist.

### Step 11 — Revise and finish

- Checked against develop: PaymentScheduleFields (percent or fixed, 14-day default, final count same day), booking-requirements (four conditions, exact missing-requirement sentences), EventDeposit (manual ask, amount fixed once asked), balance reminder 3 days before for card only, refunds in Stripe, no re-billing on count change.
- Did not repeat the deposit email’s "a reminder comes that day" (the sweep runs 3 days before).
- Wedding figures are illustrative and labelled so; dates checked to fall on Saturdays.
- **Final image:** Friday, nobody to text; $2,880 in the kitchen’s own account and the date booked.

**Revision 2026-10-10: reviews applied.** Owner-caterer review: the client's options are **Accept the reviewed selection** and **Decline this offer** (ClientResponse.svelte); **Send again** is on the order's payment request, not the event; "spend up to the deposit" replaced, since the food order follows the final count; added a line on writing the refund terms into the agreement. Humanize review: the mirrored opening lines, "A yes isn't a booking" and the time-word closer rewritten; the snap line became "The deposits you end up chasing are the ones you mentioned and never wrote down."; the checklist shortened to three.

**Revision: step-by-step guide with app captures.** Rebuilt as a step-by-step how-to on 2026-10-11 with ten phone captures of the site's wedding (Nair & Castellano, 150 guests at $95, $3,500 deposit, balance $10,750 due Wed Dec 9): the proposal's Payment schedule, the client's schedule and Accept for $14,250.00, Book the event's missing list, the agreement's schedule, Ask for a deposit (check), the Money tab, Record a payment and its review, and the gate with only the signature left. The illustrative 120-guest example is gone. The screenshots showed an uploaded paper copy does not count as signed, and that a card link needs Stripe connected; both are stated.

**Revision, second review pass.** Second review pass (2026-10-11). Owner-caterer: Ask for a deposit by check emails nothing by itself; the guide now adds Add payment instructions and Request payment / Send again (PaymentRequestAction). The paper-copy sentence is cut (the app contradicts itself: PaperCopy.svelte says an upload does not count, booking-requirements.ts counts it). Refunds: card in Stripe, a check your usual way. Humanize: the opener, "That's the point", the stops-becomes line and the callback closer reworked.
