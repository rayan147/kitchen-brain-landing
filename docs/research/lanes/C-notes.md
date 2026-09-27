# Lane C notes: online ordering and requests (2026-09-27)

Research only. The rows are in `C.yaml`. Production is `~/kitchen-brain-develop-demo` at
`ed6ff5f01`, which equals `origin/main`. All paths are relative to that checkout.

## The one thing to settle first: the ordering flag

Nearly everything in this lane sits behind the release flag `ordering_integration`.
That covers the storefront, approve-then-pay, auto-approve, balance reminders and the
partner API.

- **Defaults.** The flag defaults off (`src/lib/server/features/access.ts:96-98`).
  `infra/env/production.env.example:50` leaves it blank, and `docs/billing.md:50-52`
  says it is "not subscription entitlements and default off".
- **Where it is enforced.** `src/hooks.server.ts:516-521` returns
  "Ordering integrations are in development." for `/settings/ordering*`.
- **What the kitchen sees without it.** `/settings/integrations` shows the badge
  "In development".

Some parts work without the flag:

- `/settings/booking`, which covers closed dates, capacity, booking rules and the
  auto-approve switch.
- The **Day Verdict card** on any order.
- The capacity counts on `/calendar`.
- The prep and crew lines.

The tier is still `production`, because the code is on main. A caterer cannot reach
any of the storefront rows (C-04 to C-13 and C-18) unless someone sets the flag for
their business. The page must not claim these rows until the owner confirms the flag
is on.

## Walk in caterer words

**1. Set up (owner, once).** Go to Settings > Booking.
- Tick the days you are closed.
- Set how much notice you need and how far ahead clients can book.
- Close a holiday week.
- Enter your vans and your most orders a day.
- Optionally add prep hours a day and guests per server.
- Write a rule or two. For example, "Order value over $3,000 → Custom Request: no
  price until you reply" and "Fixed menu: deposit, then the balance".

**2. Put a menu online (owner, once).** Go to Settings > Ordering site.
- Save your storefront: name, time zone, pickup or delivery, and guest range.
- Connect Stripe under "How you get paid" and choose a deposit.
- Switch on the menus clients can order and give each a per-guest price.
- Copy the link, or the snippet for your web person.
- Press "Go live". The app tells you to "Place a test order from the link above and
  cancel it in Orders."

**3. The client orders (client, phone).** The client works through these steps:
- Choose a menu.
- Choose dishes.
- Pick the date. Closed or full days are greyed out, for example "Delivery is full on
  the 14th. Pickup is still open that day."
- Pick pickup or delivery.
- Enter contact details, plus diet and allergy needs.
- Review the estimate and press "Send request to kitchen".

They see "Awaiting kitchen confirmation" and a reference. Nothing is charged. If they
ticked something bespoke, they see "Needs a price from the kitchen", and the request
becomes an Inquiry in Events (lane A).

**4. The kitchen decides (owner or manager).** Home lists "Awaiting approval". The
order page asks "Approve this request?".
- **The day card** shows whether the day "has room" or "is full". It also shows the
  prep hours by dish, which you can correct, and the likely servers.
- **Approve.** The client gets an email: "<kitchen> can take <event>. Pay to hold the
  date".
- **Decline.** The client is told, and nothing needs refunding.
- **Over the budget.** If the approval puts the day over the prep budget, the app asks
  "Close it?"

**5. The client pays (client).** The client opens "Pay to hold your date", presses
"Pay $650.00" and pays on Stripe's page. They then see "Payment received. Your
confirmation comes by email from the kitchen."

The order is confirmed and lands on the Shop list (lane D). If the client does not pay
within 72 hours, the day is freed and the order shows "Approve again".

**6. The balance (automatic).** The order's Balance card shows the due day, which
defaults to 14 days before the event and can be changed per order. On that day the
client gets a reminder email with its own pay link. The card then reads "Paid."

If you collect offline, the reminder goes to your Home instead of the client.

**Option: let clear days approve themselves.** Settings > Booking > "Approve clear
requests automatically". It is off by default. Anything that needs thought still
comes to you.

## Limits to state plainly (true today)

**What it does not do:**
- **Cards only on the storefront.** Card payment through Stripe Connect only works for
  **storefront** orders. On develop, an event or proposal deposit can only be recorded
  offline or through an external system.
- **Reminders only on the storefront.** Balance reminders only fire for storefront
  approve-then-pay orders.
- **No customer invoices.** #504 is unbuilt, so there is no invoice numbering or
  dunning. Each due date gets one reminder.
- **No Square for client money.** Square is not used on this path.
- **No saved cards and no automatic refunds.**

**Fixed or estimated values:**
- **Payment Window.** It is fixed at 72 hours and is not a setting
  (`src/lib/server/orders/approval/state.ts:39`).
- **Capacity.** Capacity is counted per day. Each delivery takes one van for the whole
  day. There are no time slots, no runs per van, no per-item limits and no separate
  kitchens.
- **Prep and crew.** Both are estimates and never grey out a date. Crew is a ratio.
  There are no rosters or shifts.

**Not built yet:**
- **Day-load flag (#521).** Nothing flags a day that goes over after a confirmed order
  grows.
- **Event booking review.** It does not show the Day Verdict yet (#523, criteria 3-5).

**Partner API:**
- It needs a developer on the other side.
- ezCater is a fixture-only branch.
- Partner custom requests stay Custom Request orders and are not Inquiries.

## Findings the owner should see (not capture frames)

1. **The old internal name is visible to clients.**
   `apps/ordering/src/lib/components/PaymentHandoffPanel.svelte:137` shows the retired
   repo name in an Alert title to storefront clients when payment is external. This
   breaks the naming rule, and the string should change to CostCook or to neutral
   wording.
2. **Stale copy in the same panel.** Line 126 says "Paying does not confirm the
   kitchen's availability." Under approve-then-pay and auto-approve, clients only pay
   after the kitchen has approved, so the line is now misleading.
3. **Stale doc.** `docs/ordering-integration.md` step 4 says payment terms live on
   "Settings → Ordering integration". They now render under "How you get paid" on
   `/settings/ordering/site`.
4. **Routing mistake in the brief.** `/o/[token]` is the client **proposal** page
   (`src/lib/server/proposals/public-link.ts:8-10`), not the ordering storefront. It
   belongs to lane A. The storefront is the separate app `apps/ordering`, at
   `/[store]` and `/[store]/pay`.

## Terms (see `C.yaml` terms for sources)

- **Processor for client money.** Stripe Connect, using Accounts v2 on the caterer's
  own connected account with its own `STRIPE_ORDERING_*` keys. The caterer is merchant
  of record. CostCook's application fee exists in code but is null for every account.
  This is separate from the CostCook subscription, which uses the Stripe platform
  account.
- **Approval is not Acceptance, and approved is not confirmed.** Approval is the
  kitchen's yes to a storefront request. Acceptance is a client accepting a proposal.
  Confirmed happens only when the payment arrives, or when the owner confirms without
  payment and records a reason.
- **One number, two names.** The client sees "estimate" and the owner sees "quote".
- **One area, four names.** "Ordering site", "Online ordering", "Ordering integration"
  and "storefront". The landing should pick one caterer word. "Online ordering" or
  "ordering page" reads best.
- **"Partner" on screen** means an outside payment or ordering system. The docs reserve
  "partner" for the caterer, so the landing should avoid the word.
- **Deposit and balance** are obligations on the **order**, labelled "Catering deposit"
  and "Catering balance". They are not a customer invoice.

## Owner questions

1. Is `FEATURE_ORDERING_INTEGRATION_ENABLED` set in production? If not, which
   businesses have a `business_feature_overrides` row for `ordering_integration`? No
   storefront row can go on the page until this is answered.
2. Prep estimates, corrections, "Close it?" and likely crew (PRD slices 5, 6, 7 and 10)
   were "held for design-partner feedback" in the PRD README. They are merged and show
   by default in the Capacity form and on the order day card. Was that intended, and
   can the landing mention them?
3. #524 (auto-approve) is merged and has an e2e test, but the issue is still OPEN.
   Should it be closed, or is something missing?
4. Should the Payment Window stay fixed at 72 hours? PRD story 44 says the owner sets
   it.
5. Can the landing say "take a card deposit" in general? That is true only for
   storefront orders. For events it waits on the kb-client-payment follow-up: a
   siteless pay page, and reminders that fire for booked events.
6. Should the partner API (integration keys) be marketed at all, or kept for
   developers?

## Capture-worthy frames (if the flag question clears)

1. **Storefront date step at phone width** (C-06). Greyed closed days and the
   "Delivery is full on … Pickup is still open that day." line.
2. **Order page "Approve this request?"** (C-08). "The day" card beside it, showing the
   verdict, the prep by dish and the crew line.
3. **"Pay to hold your date" at phone width** (C-09). The "Pay $650.00" button.
4. **Order "Balance" card** (C-12). "$0.00 received of $1,950.00 due" with the
   reminder date.
5. **Settings > Booking** (C-01, C-03 and C-13). The closed dates list, a booking rule
   above the default, and the auto-approve switch with its "Still comes to you"
   explanation.
6. **The "Close it?" card** (C-16), with its evidence sentence.
7. **/calendar week view** (C-02 and C-14), showing "n/m vans" and "Full". This one
   works without the flag.

## Overlaps for the merge

- **Lane A.** `/settings/booking` (C-01 to C-03). Also Custom Request → Inquiry (C-07),
  event deposit and verdict (C-19, C-20, C-22) and `/o/[token]`.
- **Lane D.** Today's "came in from" arrivals (C-18) and the Shop handoff.
- **Lane E.** Prep Estimate on the recipe page (C-15).
- **Lane H.** Sage tool `checkDayRoom` (`src/lib/server/sage/tools-booking.ts:66`),
  which reads the Day Verdict.
- **Lane I.** Webhooks under `/settings/ordering`.
