# Lane A notes: front of house, inquiry to booked

Research notes only. This is not prospect copy. The rows are in `A.yaml` (A-01 to A-23).
Production is `~/kitchen-brain-develop-demo` at `ed6ff5f01`, which equals `origin/main`.

## The chain in a caterer's words

1. **The phone rings.** The caterer opens Events and taps "+ New inquiry". They type
   who is asking, the occasion and a rough date and guest count. They can also leave
   "Date not decided yet". They set who follows up and when. If the same person asked
   recently, the app warns "Open it instead?" but does not block the save. A web
   request the storefront could not price arrives as a Custom Request instead, and
   "Move to Inquiries" turns it into the same kind of lead. (A-01, A-02)
2. **The pipeline.** Events sorts leads into "Needs attention", "Booked · coming up",
   "In pipeline" and "Past & closed". Each lead gets a next task, such as "Follow up
   on offer" or "Reschedule or close". The event page shows six steps: Inquiry, Menu &
   service, Proposal, Client decision, Agreement, Booked. It has one "Next step" card
   and warns when a date has passed and the event is not booked. (A-03)
3. **Menu and service.** The caterer starts from a saved menu, from their own recipes,
   or by copying a past event. They can add several services, for example lunch and
   then a dessert table. The totals card shows food cost and gross margin as they go.
   (A-04)
4. **The proposal.** On the one-page builder, the caterer adds "+ Staff", "+ Rentals",
   "+ Delivery", "+ Service fee" or another menu. Each line can be taxable,
   discountable or optional for the client, and choice groups let the client pick
   between options. The caterer then sets a discount, tax (Stripe works it out when
   the kitchen is set up for it) and saved terms. Food cost % is shown with "only you
   see this". The builder is assumed-today; production still uses the step editor.
   (A-05)
5. **Send.** The caterer checks exactly what the client will see on desktop, phone and
   email. They pick how long the link stays valid (3 to 30 days) and press "Send offer
   to <name>". The app confirms with "Proposal sent." (A-06)
6. **The client decides on their phone.** No login is needed. The client picks
   options and add-ons, reviews the total, then chooses "Accept this selection",
   "Send change request" or "Decline offer". The page says plainly that acceptance
   is not a signature or a booking. The caterer gets an email when the client
   accepts. (A-07)
7. **Chasing and changes.** The caterer can press "Send a reminder", "Copy offer link",
   "Extend link" or "Withdraw offer". If the client said yes on the phone, "They
   accepted" records it. "Edit proposal" leads to "Update the offer", where the
   caterer writes "What changed, in your words". When they send it, the old link
   stops working. (A-08, A-09)
8. **The agreement.** The caterer uses a saved contract template, writes terms, or
   uploads their own file. They can "Attach the accepted proposal as Schedule A",
   name both signers, choose "Client signs first, then you", and press "Send for
   signature". Signing runs through DocuSeal. A status track shows Sent, Client
   viewed, Client signed, You countersign and Completed. After both sign, the signed
   PDF and audit file are kept on the event. If online signing is off, the caterer
   records a paper-signed PDF instead. (A-10, A-11, A-12)
9. **Kitchen draft.** "Prepare the kitchen draft" turns what the client accepted into
   a tentative order. It "holds no day and draws no crew until you book the event."
   (A-13)
10. **Deposit.** The caterer types the deposit amount and picks "A check, cash or a
    transfer" or "My own card processor", then presses "Ask for a deposit". The panel
    then reads "Asked for / Received / Nothing received yet." The money itself is
    recorded on the order. Nothing is sent to the client. (A-14)
11. **Booked.** On the kitchen draft, "Confirm order" freezes quantities and prices.
    The event then says "The order is confirmed. This event is booked." and hands off
    to shop, prep and pack in lane D. The calendar shows it among "Confirmed" orders
    and counts it against the day's capacity and vans. (A-15, A-16)

## Limits a demo must not overstate

- **CostCook does not collect an event deposit by card.** In production an event
  deposit is always a check, cash, a transfer, or the caterer's own processor, and
  the amount is recorded by hand. No pay link is sent and there is no balance, due
  date or reminder. Card payment through Stripe Connect exists only on the
  storefront path, which lane C covers.
- **There is no customer invoice, BEO, staffing roster, delivery dispatch or route
  planning.** Each exists only as a PRD (06 to 10). "Vans" is a daily capacity
  number, and "+ Staff" is a priced line on the proposal and nothing more.
- **A kitchen draft holds one service.** If a client accepts two services (lunch and
  dinner), the app says "Book this event by hand until multi service drafts land."
- **Booking is the owner's call.** "Confirm order" checks the day's capacity (with an
  override reason). It does not check for a signed agreement or a paid deposit
  (`src/lib/server/orders/shell-actions.ts:129-160`).
- **Proposal PDFs come from browser print.** Only the agreement and contract PDFs
  are generated files.
- **Online signing needs DocuSeal to be configured.** When it is on, the signing
  page still says "Test environment. Use controlled test recipients only."
- **Events never show on the calendar by themselves.** An event appears there only
  once it has a kitchen draft (under Drafts) or a confirmed order.

## Open questions for the owner

1. **Is live DocuSeal signing turned on in production?** The signing page always
   shows the "Test environment" line when signing is available
   (`contract/signing/+page.svelte:49`). If signing is live, that line is wrong. If
   it is not, the landing cannot claim e-signature.
2. **What should "Booked" mean on the event page?** The chip and stepper say "Booked"
   once an agreement is completed, even with no confirmed order
   (`events/[id]/+page.server.ts:145`). The journey says "Event booked" only after
   "Confirm order". Which one is the definition?
3. **When does kitchen planning open?** The agreement page says "Kitchen planning opens
   as soon as you send." The event page says it "Opens once the client accepts a
   proposal." Which is right?
4. **Can the agreed payment terms in kb-client-payment survive the merge?** Both
   assumed-today branches change `src/lib/domain/proposals/draft.ts`, and the new
   builder never sends `paymentTerms`, so its autosave may wipe the Booking Rule
   prefill. The terms also appear on no screen, including the client's offer. That
   means the order could carry a deposit the client was never shown. Should terms be
   shown on the offer before this ships?
5. **`e2e/tentative-order.spec.ts` uses labels that are no longer in `src`.** It
   drives the old step editor ("Continue to what it includes", "Save and review
   offer") and "Email offer revision N to customer", which is not in `src` at all.
   The proposal-build branch deletes that editor but does not update this spec. Is
   the draft-to-deposit end-to-end proof currently red?
6. **Is the multi-service booking gap acceptable to sell?** Weddings often have more
   than one service. When will "multi service drafts" land?
7. **Is card deposit for events (lane 1 of the client-payment plan) meant to ship
   soon?** It needs the siteless checkout route ruling (option A or B in section 5
   of that plan). Until then the landing must say deposits are tracked, not taken.

## Most capture-worthy frames

1. **The client's offer page at phone width.** It shows "Choose your services", the
   optional add-ons, and "Accept this selection". It is the one screen a skeptical
   caterer can picture their client using. (`/proposals/[businessId]/[offerId]`)
2. **The event page after acceptance.** It shows the six-step stepper and, under
   Kitchen planning, the tentative kitchen draft ("It is tentative: it holds no day
   and draws no crew") above the Deposit panel "Asked for $2,500.00 / Received $0.00
   / Nothing received yet." One frame covers accepted, planned and deposit tracked.
3. **Agreement status.** It shows the five-stage signing track (Sent, Client viewed,
   Client signed, You countersign, Completed) with "Send reminder" and "Download
   current PDF". Use it only once question 1 is answered.

Runner-up: the one-page proposal builder (assumed-today) at desktop, with the charge
table and the sticky total showing "Food cost … only you see this".
