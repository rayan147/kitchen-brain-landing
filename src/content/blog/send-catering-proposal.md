---
title: "How to send a catering proposal the client accepts on their phone"
menuTitle: "Send a proposal the client accepts"
description: "A step-by-step guide with a screenshot at every step: price the menu, set the deposit, send the offer, and see exactly what the client reads and presses on their phone."
publishedDate: 2026-10-22
category: Running the event
menuGroup: Plan and buy
menuIcon: calendar
featured: false
order: 24
readMinutes: 9
featureHref: /features/events-and-proposals
featureLabel: See events and proposals in CostCook
---
<!-- story: docs/stories/blog-send-catering-proposal.story.md -->
<!-- Read off kitchen-brain develop 9b84420f4 on 2026-10-12 (RC-81). Labels are
     the app's own. Not claimed: email delivery (the shoot had no mail server,
     so Delivered read "Not confirmed yet"), "Send a test to me" (in the source,
     not seen on screen), anything about card payment on the offer page (the
     deposit guide owns that).
     CAPTURES: 21 crops at 390 px from a localhost build of develop 9b84420f4,
     demo seed renamed Harbor & Hearth Catering (settings.business_name), US
     units, recipes given version 1 with the app's own db:backfill:revisions
     (the seed has none, so saved menus refuse with "Publish every dish"). The
     Nair & Castellano wedding, the client Priya Nair, priya.nair@example.com,
     the $95 price and the $3,500 deposit were entered for the shoot. -->

By the end of this guide, your client has a priced proposal on their phone, and you can see the moment they accept it.

You build it from the menu, set the price and the deposit, and send a link. The client opens it with no login and presses **Accept proposal** or **Ask for changes**. Their yes doesn't book the event or charge anything. The agreement comes next.

This guide picks up after the inquiry is saved. For the whole event, from the first call to closeout, see [Running a catering event in CostCook](/blog/catering-event-first-call-to-closeout).

## Before you start

- The inquiry is saved, with the date and the guest count.
- The dishes you want to serve are published recipes. A draft can't go on a proposal.
- You have the client's email address.

## Build and send the proposal

1. Open the event's **Menu & service**. Under **Start from a saved menu**, find the menu and press **Use menu**.

![A saved menu card: Wedding Plated Dinner, 6 dishes: Braised Short Rib, Wild Mushroom Polenta, Roasted Beet and Citrus, Creamed Spinach, Focaccia and Whipped Goat Cheese, Lemon Posset. Use menu is ringed.](/proof/blog/send-catering-proposal/p01-use-menu-mobile.png "Start from a menu you already priced.")

2. Type the **Price per guest**. CostCook suggests one from what the food costs you, and shows the food cost per guest as you type.

![Servings 150, All guests. Price per guest $95.00, ringed, with Suggested $90.00 at 30% below it. Food cost $26.93 / guest · 28.3% · total $14,250.00.](/proof/blog/send-catering-proposal/p02-price-mobile.png "$26.93 of food per guest, sold at $95.")

3. Press **Continue to proposal**.

![The button Continue to proposal · $14,250.00, ringed.](/proof/blog/send-catering-proposal/p03b-continue-btn-mobile.png "The total travels with you.")

4. Type the client's email under **Client email**. You can't send without it.

![The client Priya Nair, and Client email priya.nair@example.com, ringed.](/proof/blog/send-catering-proposal/p04-client-email-mobile.png "The offer link goes to this address.")

5. If the job has more than food, add it under **What you're charging**: **+ Staff**, **+ Rentals**, **+ Fee** or **+ Other**.

6. Open **Terms** and choose what the client pays, and when. For a deposit, pick **A deposit, then the balance**, then the deposit as a percentage or a fixed amount, and how many days before the event the balance is due.

![This proposal asks for: A deposit, then the balance (ringed). Deposit: A percentage of the order, or A fixed amount, chosen, 3500.](/proof/blog/send-catering-proposal/p05-schedule-mobile.png "The offer states the schedule in dollars.")

7. Read **What the client will read**. That's the schedule exactly as it goes on the offer.

![What the client will read: Deposit to confirm the date $3,500.00. Balance, due Wednesday, December 9, $10,750.00. Your final guest count is due Wednesday, December 9. The total does not change after that.](/proof/blog/send-catering-proposal/p06-client-reads-mobile.png "The final count is due with the balance.")

8. Press **Preview & send**.

![Total · tax not set, $14,250.00, and Preview & send, ringed.](/proof/blog/send-catering-proposal/p07-preview-send-mobile.png "Nothing is sent yet.")

9. Go through **Before you send**. Each line has **Open**, which takes you to the fix. A yellow line is a warning you can send with. A red line has to be fixed first.

![Before you send, 3 to review: Event details not confirmed: venue, service time will show as “To be confirmed”. No terms included: Cancellation, change and service conditions. No tax (0%): Check this against your local tax rules.](/proof/blog/send-catering-proposal/p08-checklist-mobile.png "Check the tax before the client sees the total.")

10. Choose how long the link works under **Offer link valid for**, then press **Send offer**.

![Offer link valid for 7 days, Until Mon, Oct 19. Send offer is ringed. Below it: The event isn't booked until the customer accepts.](/proof/blog/send-catering-proposal/p09-send-mobile.png "Pick how long they have to decide.")

11. You land on the client decision page. It shows when the offer was sent, delivered and viewed, and waits for the decision.

![Waiting on Priya Nair. Offer sent Mon, Oct 12 · the link works for 7 more days, until Mon, Oct 19. Step 4 of 6: Client decision. $14,250.00, Waiting for response. Sent Oct 12, Delivered Not confirmed yet, Viewed Not opened yet, Decision Accept or decline.](/proof/blog/send-catering-proposal/p10-waiting-mobile.png "Sent, delivered, viewed, decided.")

Want to send the link yourself, by text? Press **Copy offer link**.

![View proposal, Send a reminder, and Copy offer link, ringed.](/proof/blog/send-catering-proposal/p11-copy-link-mobile.png "The same link the email carries.")

## What the client sees

The client opens the link on their phone. There's no account and no login.

![Proposal for Priya Nair. Nair & Castellano wedding. Please respond by Mon, Oct 19 · 7 days left. Total for your event $14,250.00, 150 guests · $95.00 per guest. Your event: Date December 19, 2026, Guests 150, Venue To be confirmed, Service time To be confirmed.](/proof/blog/send-catering-proposal/c01-top-mobile.png "The deadline is at the top.")

They see the menu, the total and the payment schedule, in the same words you checked in step 7.

![Payment schedule: Deposit to confirm the date $3,500.00. Balance, due Wednesday, December 9, $10,750.00. Your final guest count is due Wednesday, December 9.](/proof/blog/send-catering-proposal/c02-menu-schedule-mobile.png "The schedule they accept with the price.")

Two buttons stay at the bottom of the screen: **Ask for changes** and **Accept proposal**.

![The bottom bar of the client’s page: Ask for changes, and Accept proposal, ringed.](/proof/blog/send-catering-proposal/c04-buttons-mobile.png "Always in reach on a phone.")

To accept, they type their name and press **Accept for $14,250.00**. The window says it plainly: "Nothing is charged today."

![Accept this proposal? Nair & Castellano wedding · $14,250.00. Your full name: Priya Nair. Note for Harbor & Hearth Catering · optional. Nothing is charged today. Harbor & Hearth Catering will send an agreement to sign next. Accept for $14,250.00 is ringed.](/proof/blog/send-catering-proposal/c05-accept-dialog-mobile.png "Their name goes on the acceptance.")

They see what happens next.

![Thank you. Proposal accepted. We’ve let Harbor & Hearth Catering know. A copy is on its way to priya.nair@example.com. What happens next: Proposal accepted. You’ll receive an agreement to sign. Your date is held once it’s signed.](/proof/blog/send-catering-proposal/c06-thanks-mobile.png "Their yes, and what comes after it.")

## After they accept

12. On your side, the event moves to the agreement. Press **Send agreement**. The deposit and the booking come after that: see [How to get a catering deposit in without chasing it](/blog/catering-deposit-without-chasing).

![Step 5 of 6: Agreement. Client accepted this offer. The next step is the agreement. Send agreement is ringed.](/proof/blog/send-catering-proposal/p12-accepted-mobile.png "Accepted is not booked. The agreement is next.")

**Tip:** if the client presses **Ask for changes**, they write what they'd like changed and it comes straight to you. To change the menu, price or terms after sending, use **Update the offer** on the client decision page. "The current link keeps working until you send the update."

![Ask for changes. Your response goes directly to the caterer. Your full name · optional. What would you like to change? Send to Harbor & Hearth Catering.](/proof/blog/send-catering-proposal/c-tip-changes-mobile.png "Their changes come to you, not to a form somewhere.")

**Tip:** if they said yes or no on the phone, record it under **Heard back another way?** with **They accepted** or **They declined**. CostCook notes who recorded it.

**Tip:** no answer yet? Press **Send a reminder** on the client decision page.

## If something goes wrong

### "Publish every dish in that menu before using it here."

One of the menu's dishes isn't published. Open each dish under **Recipes**, finish and publish it, then press **Use menu** again. Adding a single unpublished dish gives the same answer: "Publish that dish before adding it."

![A red notice: Publish every dish in that menu before using it here.](/proof/blog/send-catering-proposal/err-publish-mobile.png "Only published recipes go on a proposal.")

### "No customer email"

The **Before you send** list marks it **1 must fix**, and **Send offer** stays greyed out. Go back and type the client's email.

![Before you send, 1 must fix: No customer email. Add an email before sending.](/proof/blog/send-catering-proposal/err-no-email-mobile.png "No email, no offer.")

### "The balance due date has already passed"

The event is closer than the number of days you gave for the balance. Open **Terms** and shorten the days before the event, or check the event date.

![The balance due date has already passed. Balance and final guest count say Fri Oct 9, but the event is Mon Oct 19 and today is Mon Oct 12.](/proof/blog/send-catering-proposal/err-balance-passed-mobile.png "A balance date in the past blocks the send.")

## Limits

- Accepting isn't booking. The client's page says "Nothing is charged today", and the agreement comes next.
- The link stops working when the time you chose under **Offer link valid for** runs out, or straight away if you press **Withdraw offer**.
- The client sees "To be confirmed" for anything you didn't fill in, like the venue and the service time.
- Food cost stays on your side. The client never sees it.
