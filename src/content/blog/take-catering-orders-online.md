---
title: "How to take catering orders online, and approve them before anyone pays"
description: "What the client sees on their phone, what lands in Orders, which booking rule fits which job, and one office lunch for 40 from the order to the food cost."
publishedDate: 2026-10-01
category: Running the event
menuGroup: Plan and buy
menuIcon: order
featured: false
order: 14
readMinutes: 6
featureHref: /features/online-ordering
featureLabel: See how online ordering works
---
<!-- story: docs/stories/blog-take-catering-orders-online.story.md -->

The office manager texts at 4:40: "Lunch Thursday for 40, the chicken one again, can you do noon?" You read it between tickets, type it into the order later, and somewhere between the text and the order, 40 becomes 14. Thursday you find out at the drop.

Online ordering has the client type it once, on their own phone, and it reaches you already priced. It isn't booked until you approve it, and under a pay rule, not until they've paid.

This guide follows one office lunch from their phone to the food cost.

## What the client sees

They open your link or the form on your website. No account, no login. The steps run across the top: **Menu**, **Choices**, **Event**, **Contact**, **Review**.

1. **Choose a menu.** Only the menus you switched on, at your price per guest.
2. **Choose dishes and options.** The choices you set on that menu.
3. **When and where is the event?** Days you're closed are greyed out, and under the calendar it lists them: "Closed in October: …". Then **How should the food arrive?**: **Pickup** or **Delivery**.
4. **Who should the kitchen contact?** Their name, how to reach them, and any diet needs or allergies in the group.
5. **Review the estimate and request.** The estimated total, and a note that sending it doesn't charge them or confirm the event.

They've watched the price the whole way down, under **Estimate so far**. You get no "what would 40 cost?" call. They press **Send request to kitchen** and see **Your request reached the kitchen**, with a reference and **Awaiting kitchen confirmation**.

Their phone sends only what they picked, and CostCook prices it again from what you published.

## What lands in Orders

The request shows up in **Orders** with a **New online request** badge, under **Needs a look**. Open it and the page asks **Approve this request?** Above the buttons it says what approving will do, in one line. Under the pay-in-full rule, that line is "The client pays by card on Stripe. The payment confirms the order."

It arrives priced, with the food cost against your menu, so you know what the job is worth before you say yes.

Then **Approve** or **Decline**. Decline asks for one line the client will read, and sends it with **Decline and tell the client**.

## Pick the booking rule for the job

What approving does is set in **Settings > Booking**, under **Booking rules**. Rules are checked top to bottom, and the first one that fits a request decides. A new account starts with two: anything bespoke comes to you to price, and everything else uses the first of these three.

- **Fixed menu: no online payment.** Approving confirms the order. Use it for the office you've fed for two years, where you already have your own way of billing them.
- **Fixed menu: pay in full.** Approving asks the client for the whole amount, and their payment confirms the order. Use it for a new client and a small job. Lunch for 40 is a small job.
- **Fixed menu: deposit, then the balance.** Approving asks for the deposit, and paying it confirms the order. The balance gets its own pay link before the event. Use it for the big ones, where you'll spend real money on food a week out.

If you take cards through CostCook, asking for money means an email: your kitchen can take the event, and a **Pay** button with the amount. They pay on Stripe's page, into your own Stripe account. Stripe takes the card, and you never see it. If you collect it yourself, the email says what's owed and by when, and you record the payment when it comes in.

If you'd rather not decide each one, **Approving requests** on the same page has **Approve clear requests automatically**. It's off until you turn it on. When it's on, a fixed-menu request on an open day, with at least your minimum notice, approves itself. A custom request, or a day short on prep time or servers, still comes to you.

## One lunch for 40, start to finish

This is the order from our online ordering film, an example kitchen that takes cards and asks for the full amount up front:

1. The client orders lunch for 40 on the kitchen's site and sees the price before anyone calls.
2. It arrives priced. Its food cost, counting misc (the percentage the kitchen adds for small extras), is 29.3% of the price.
3. It was a fixed-menu request on a clear day, so it approved itself. The kitchen could still have declined it.
4. The client gets the pay link and pays $1,273.08 by card.
5. Shopping is in whole packs, by supplier, for 40. Each supplier gets only its own lines.
6. The next day it came in $2.47 over plan. Counting the food alone, without misc, that's 29.1% of the price, still under the kitchen's 30% target.

The kitchen didn't touch it until the shopping at step 5.

## When they don't pay

The pay link is good for 72 hours, and the email gives the exact day and time. If nothing is paid by then, the order reads **The payment window closed** and the day is free again. **Approve again** sends a fresh link if they still want it.

For a job sooner than that, check it's paid before you shop.

## Where it stops

- The pay link goes by email. A client who leaves only a phone number gets no link, so add their email to the order before you approve. With automatic approval on, check new orders for a missing email.
- Card payments go into your own Stripe account. CostCook won't save cards or refund on its own.
- An online order has no invoice. Invoices come from an event's accepted proposal.
- A bespoke request, like staff on site or rentals, takes no money. It comes to you to price.

## Try it on yourself

Turn on one lunch menu, open your link on your phone, and order lunch for 20. You'll see what your clients see and what lands in Orders. If automatic approval is on, turn it off for the test. Decline the order after, so it doesn't sit there like a real job.

To put the same form on your own website, read [how to put a catering order form on your website](/blog/catering-order-form-on-your-website). For what happens after the order is confirmed, read [how to turn a catering menu into a shopping list in whole packs](/blog/shopping-list-whole-packs).
