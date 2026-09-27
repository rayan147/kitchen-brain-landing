# Lane D notes: order to van

Research notes, 2026-09-27. This file is not prospect copy. Production code was read at
`kitchen-brain-develop-demo` `ed6ff5f01`, where HEAD equals origin/main. Assumed-today code
was read from the `kb-client-payment` working tree. The rows are in `D.yaml`: 18 rows, 17
production and 1 assumed-today.

The app has its own tracker for this journey, `docs/stories/order-to-van-copy.story.md`,
whose headline is "Book the event, buy it, cook it, pack it, and get it on the van." The app
stops at "packed". "On the van" is the story's image, not a feature. See the limits below.

## The walk, in a caterer's words

1. **The client said yes.** On the event, the owner presses **Prepare the kitchen draft**.
   CostCook builds the order from what the client accepted: the menu, the head count and
   the per-guest price. If the total does not divide evenly, a line on the money bar makes
   the order total match the accepted total. The draft is "tentative": it holds no day on
   the calendar. (D-01)
2. **A job came in by phone.** Go to Orders, then **New order**, pick a menu, and type the
   guests and the price per guest. A live quote beside the form shows food cost and margin.
   **Add another event** creates 2 to 12 orders at once and opens **Combined production**,
   with one shopping list, one prep list and one pack list across all of them. (D-02, D-03)
3. **Lock it in.** **Confirm order** asks "Confirm this order?", then freezes the quantities
   and prices. If the order has the client's email, the client gets "{Kitchen} confirmed
   {event}." with the date and head count. For an event, this click is the booking: the
   event then reads "The order is confirmed. This event is booked." (D-04)
4. **Tell the suppliers.** **Order from suppliers** opens "Review supplier orders". Each
   supplier gets an email, a printable purchase order, or a manual entry. **I'll shop it
   myself** skips this step. Today nags about unsent POs ("Send POs") and about POs that
   still need printing. (D-05)
5. **Shop.** The Shop list shows need, on hand and buy on one line, grouped by supplier. The
   caterer types what is already on the shelf and checks lines off. For the week, **This
   week's lists** gives one shopping list and one prep list across every confirmed order.
   (D-06, D-15, D-16)
6. **The truck comes.** **Check in deliveries** starts a checklist with one choice per line:
   "All here", "Fewer came", "More came", "Swapped" or "Didn't come". **Finish check-in**
   ends on "Delivery checked in". What was kept goes on the shelf. What didn't come goes to
   the follow-up list. (D-07)
7. **Prep.** The prep list reads "As confirmed Sep 11", so the cook knows which version of
   the recipe they are holding. The caterer checks items off until "All prep is checked
   off". Each recipe row has a label strip that prints container labels with the made date,
   USE BY and a CONTAINS line. (D-08, D-09)
8. **Pack.** The caterer checks off dishes and equipment. **Finish packing** leads to
   "Everything is packed", then "Packed · Finished {when} by {name}". If something was
   missed, the app asks "Was the hummus short, or packed?", then records a cause and how the
   kitchen covered it. (D-10)
9. **After the event.** Today offers **Review closeout**. The caterer links purchases to the
   event, types what was actually used, and sees planned against actual food cost. The last
   step is **Close food-cost review**. (D-11)
10. **Money.** The order carries a Payment card, or separate Deposit and Balance cards, with
    "{paid} received of {due} due" and **Record received payment** for a check or cash. On
    an event the owner can **Ask for a deposit**, but the client cannot pay it by card
    through CostCook today. (D-12)
11. **Every morning.** Today shows each of today's events with a five-step rail: Receive,
    Shop, Prep, Pack, Load out. It marks "Now" on the current step and gives one button for
    it. Below that are the to-do list, month-to-date food cost, the next 7 days, deliveries
    to receive, undated drafts and storefront requests. /todo is the full list. (D-13, D-14)

## Limits (say these plainly, never overclaim)

- **There is no van, driver or delivery step.** Today draws a "Load out" step, but both
  callers pass `vans=null` (`src/routes/+page.svelte:143`, `src/routes/calendar/+page.svelte:370`).
  It therefore always reads "Nothing to load". Calendar's "Vans out" counts booked capacity
  per day, not vans actually loaded. There is no dispatch, routing, driver app or proof of
  delivery.
- **A kitchen draft holds one service.** A proposal with several services is refused:
  "Book this event by hand until multi service drafts land." Only the food service becomes
  kitchen lines. Labor, rentals and delivery charges stay on the proposal.
- **Booking does not check the deposit.** Confirm order on an event order does not ask
  whether a deposit arrived. `ConfirmWithoutPaymentPanel` exists only in the storefront
  approval review.
- **Event money in production.** The deposit amount is typed by hand. Collection is "A check,
  cash or a transfer" or "My own card processor". The app shows "Nothing is sent to the
  client from here." Event orders have no balance line and no reminder, and CostCook takes
  no card payment for them. The "My own card processor" route has no record form in the
  app; the partner API reports it.
- **Storefront orders (lane C) do get the full ledger:** deposit plus a dated balance, a
  reminder email with a pay link, refunds and chargeback states, all through Stripe Connect.
  When the kitchen collects offline, the owner is reminded on Today ("Balance due: {name}",
  "Record payment").
- **CostCook does not produce customer invoices.** "Invoice" appears only as a
  payment-method label.
- **Supplier POs go out by email or on a printed sheet.** There is no supplier portal and
  no EDI. Confirming an order contacts no supplier until the owner chooses to.
- **Labels print through the browser print dialog only**, with no thermal-printer driver.
  Printing from Prep and Pack is not behind a flag. The label stock settings are
  (`FEATURE_LABEL_PRINTING_ENABLED`, which defaults to off).
- **Closeout covers food only** and opens the day after the event. "Actual" means purchases
  the owner linked to the event plus the amounts used that the owner typed.
- **Combined production** can only be reached right after creating several orders at once.
  Nothing links back to it. The week view has no check-offs and no pack list.
- **Staff** do not see client names or money on Today.

## Assumed-today (kb-client-payment)

The accepted proposal's payment terms are now written onto the order the kitchen draft
creates (`paymentTermsJson`). A test pins the result: a $5,800 agreement gives a $1,450
deposit, taken on the whole total. **No screen changes.** No deposit or balance is created
from those terms, and the owner still types the deposit amount. The siteless Stripe checkout
endpoints are uncommitted and have no pay page. For the landing, this row adds nothing
visible. It is groundwork. The proposal that states the deposit and the balance belongs to
lane A (`6c395b764`).

## Terms this lane pinned down

The full list is in `D.yaml`. These are the ones that matter most:

- **Booked** means the kitchen-draft order was confirmed. There is no separate Book button.
- **Deposit and balance** live on the order, not the event. The event only asks for them.
- **Client card money** goes through Stripe Connect hosted Checkout, for storefront orders
  only. There is no Square code for client payments.
- The **"Invoice" method label** collides with the glossary rule that an unqualified
  "invoice" means a supplier invoice.
- **"Frozen"** means locked at confirmation. The prep screen says "As confirmed {date}" so
  cooks do not read it as frozen chicken.

## Frames worth capturing

1. Today's event card, with the five-step rail and "Now" on Prep. *Caveat:* crop out the
   Load out step, or explain that it is never live.
2. The "Confirm this order?" dialog, which lists Order, Event date, Guests and Revenue.
3. "Review supplier orders", with email and print badges on each vendor.
4. The Shop list on a phone, showing need, on hand and buy on one line.
5. A receiving line with the "All here / Fewer came / More came / Swapped" choices.
6. A printed prep sheet with "As confirmed Sep 11" and the "Printed … by D. Reyes" stamp.
7. A printed container label showing USE BY, CONTAINS and the event name.
8. The pack shortfall question, "Was the hummus short, or packed?"
9. The closeout "Planned vs actual food cost" and "What moved the food cost" tables.
10. The Kitchen draft card in its ready state, with the "Prepare the kitchen draft" button.

## Owner questions

1. Is `FEATURE_LABEL_PRINTING_ENABLED` on in production? If it is off, customers print on
   the default stock and cannot choose a stock.
2. Should "Load out" be tracked, or removed from Today's rail? Right now it is a step that
   never lights up.
3. Should confirming an event order warn when no deposit has been recorded? Today it does
   not check.
4. When the client-payment work is live, should event orders show separate Deposit and
   Balance cards? The balance card only appears once an order has a second obligation.
5. Should Combined production have a way back in, for example from the orders hub? Today a
   caterer who leaves the page loses it.
6. "Invoice" as a client-payment method label clashes with the rule that an unqualified
   "invoice" means a supplier invoice. Should it be renamed?
7. On an event deposit taken through "My own card processor", should the owner be able to
   record it by hand? The app has no form for this; only the partner API can record it.

## Evidence gaps

- No e2e spec opens `/todo` directly. Server tests cover the list builder.
- No e2e spec exercises "Record received payment". An SSR test covers the card
  (`src/lib/server/orders/payment-tracking-ssr.test.ts`).
- I did not run the app for spot checks in this lane. Every label above comes from source.
