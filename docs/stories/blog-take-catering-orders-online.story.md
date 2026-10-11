# Story Tracker: Blog, take catering orders online

## My story

- **Piece:** blog guide, `/blog/take-catering-orders-online` (2026-10-01 in the
  weekly sequence). Post 1 of `docs/plans/2026-10-08-ordering-and-event-blog-plan.md`.
  Hands off to `/features/online-ordering`.
- **Hero:** the owner-caterer who takes office lunches by text and email and
  retypes each one.
- **Content file:** `src/content/blog/take-catering-orders-online.md`.
- **Gate:** owner lifted Gate 0 on 2026-10-08 ("prod will deploy, there is no
  traffic now, so add the pay link"). Published with ordering (`src/lib/blog.ts`).
- **Evidence (kitchen-brain develop 185451a1b, read 2026-10-08):** steps
  `packages/ordering-ui/src/types.ts:31-35`; step titles and buttons
  `apps/ordering/.../HostedStorefront.svelte:165-182,1633-1669`; closed dates
  `EventDateField.svelte:85-100`; pickup/delivery `HostedStorefront.svelte:1259-1273`;
  estimate `RunningEstimate.svelte:59,65`, `estimate-lines.ts:14`; receipt
  `HostedStorefront.svelte:963-1067`; pay page `HostedPayment.svelte`,
  `payment-copy.ts`; pay email `booking-approval-copy.ts:57-83`; kitchen badge
  `OrderSourceBadge.svelte:25`, filters `orders-page.ts:242`, heading
  `status-reading.ts:77,83`, `review.ts:70-74`, `ApprovalDeclinePanel.svelte`;
  auto-approve `settings/booking/+page.svelte:410-446`, `auto-approval.ts`;
  rules `BookingRuleForm.svelte:222,229,301`. Lunch figures: the film's captions
  (`src/lib/ordering-guide.ts` `orderingFilm.lines`), labelled as its example kitchen.
- **Not claimed:** "72 hours" on any app screen (the email gives a date and time);
  saved cards, automatic refunds; an invoice for an online order.

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
> An **owner-caterer who takes office lunches by text** wants **orders that
> arrive priced, and paid when it matters**, but **each one is retyped,
> priced from memory and chased for money**.

### Step 2: Character
- **Want:** stop retyping lunch orders.
- **Need:** an order the client types once, that waits on their yes.
- **Wound:** 40 became 14 between the text and the order.
- **Flaw:** "I'll type it in properly later."

### Step 3: The Plot
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The 4:40 text, 40 becomes 14. |
| 2 Theme | Typed once, by the client. |
| 3 Set-Up | Retyped orders. |
| 4 Catalyst | Your link or your website. |
| 5 Debate | Does anything get booked without me? (No.) |
| 6 Break into Two | What the client sees, step by step. |
| 7 B Story | The price never comes from their screen. |
| 8 Fun and Games | Approve this request?; the three rules. |
| 9 Midpoint | Approve clear requests automatically. |
| 10 Bad Guys | They don't pay: the window closes. |
| 11 All Is Lost | Where it stops. |
| 12 Finale | Order lunch for 20 yourself. |

### Step 4: Scenes
Opening; What the client sees; What lands in Orders; Pick the booking rule;
One lunch for 40; When they don't pay; Where it stops; Try it on yourself.

### Step 5: Voices
Reader: "between tickets", "the drop", "chased the money". Product: the app's
labels, bolded and verbatim.

### Step 6: Turns
Each section moves one worry into the app: the typing, the price, the yes,
the money, the no-show payment.

### Step 7: Headline
"How to take catering orders online, and approve them before anyone pays."

### Step 8: Snap line (one)
"Somewhere between the text and the order, 40 becomes 14."

### Step 9: Scene
4:40 pm, a text read between tickets.

### Step 10: Connection
Second person throughout; hands off to the website guide and the shopping list guide.

### Step 11: Revise
Cut "72 hours" as an app string (the email gives the deadline). Kept the film's
figures, named as the film's kitchen.
