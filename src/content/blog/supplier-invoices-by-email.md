---
title: "How to get supplier invoices emailed straight into CostCook"
description: "Give your sales reps one address, forward the rest from Gmail, and check that the first invoice arrived and waits in review."
publishedDate: 2026-09-10
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 11
readMinutes: 6
featureHref: /features/invoice-email
featureLabel: See how invoice email works
---
<!-- story: docs/stories/blog-supplier-invoices-by-email.story.md -->

Your produce supplier emails a PDF on Tuesday. The dairy rep sends one on Thursday to your personal Gmail. The broadline supplier emails the office address nobody checks. Every one of those invoices already arrived by email. The work is getting each one to the place where it gets checked, before the next quote goes out on last month's prices.

CostCook gives every kitchen its own invoice address. Anything sent there lands in Purchases, waits in review, and changes nothing until you confirm it. This guide sets it up once, in about fifteen minutes, and then checks that it worked.

## Before you start

You need to be the owner. Managers and Staff cannot open kitchen settings.

Have two things open: CostCook, and the last invoice email from each supplier you buy from most. You will want each rep's email address, and you will want to know which invoices come to you instead of to a rep.

## Step 1: Find your invoice address

In CostCook, open **Settings**, then **Invoice email**. Purchases may also show a tip, **Set up invoice email**, that goes to the same page.

The first card, **Ask your suppliers to send invoices here**, shows **Your invoice address**. It starts with `invoices-`, then sixteen letters and numbers. That code is the whole key to your kitchen's mail, so it says nothing about your business and cannot be guessed.

The page says plainly what the address can and can't do: "Invoices sent to this address wait in review. Nothing counts until you check it, so the worst a stranger can do is add to your review list."

## Step 2: Send your sales rep the message

Under the address is **Message for your sales rep**. It is already written, with your address and your business name in it:

```text
Hi,

Please send our invoices and credit memos to
invoices-…@in.costcook.io.
A PDF attached to the email is best.

Thank you,
Your business name
```

Copy it and send it to each rep. Ask them to send to this address directly rather than to you. That is the path where invoices arrive with nobody touching them.

If a rep has to keep sending to you, ask them to copy the invoice address on the same email. The inbox reads who the mail was delivered to, not who is named on the To line.

## Step 3: Forward the ones that come to your Gmail

Some suppliers will only ever email you. For those, the second card, **Forward from Gmail**, lists four steps:

1. In Gmail, open **Settings**, then **Forwarding and POP/IMAP**, and add your invoice address.
2. Gmail sends that address a confirmation code. It appears at the top of Settings > Invoice email and on **Today**, usually within a minute.
3. Enter the code in Gmail.
4. Make a Gmail filter for your suppliers' invoice emails and choose **Forward it to** your invoice address.

Step 2 is where people get stuck. Forwarding is not on until Gmail's code is entered, and the code shows up in CostCook, not in your Gmail. CostCook never follows the link in that email; it only shows you the code. Once you have typed it into Gmail, press **I entered it** to put the notice away.

List your suppliers' addresses in the filter's From field rather than filtering on the word "invoice". A filter on the word will forward every newsletter that says "invoice".

When you forward, the inbox knows the email came from someone in your kitchen and shows **Forwarded by** with your address.

## Step 4: Check that the first one arrived

Do not stop at setup. Ask one rep to resend last week's invoice, or forward one yourself, then press **See what has arrived** at the bottom of the settings page. It opens **Purchases > Invoice inbox**: every email sent to your invoice address, and what became of it.

A good first result reads like this (a sketch of the card, not a screenshot):

```text
Harbor Produce                         Tue 9:14 AM
Invoice 48213
Invoice
Waiting in review. It counts once you confirm it.
invoice-48213.pdf ............ In review    Review
```

Press **Review**. It opens the same invoice review as a photo you upload yourself, with the email's sender beside it. Check the lines, the pack sizes and the total, then confirm. Until you do, the invoice changes no cost.

An invoice from an address that is not one of your suppliers yet carries a **New sender** badge. If the sender could not be verified, the card says so in amber: "Check it is really from them before you confirm anything."

## When an email does not turn into an invoice

Every email is listed with what it became and why. The ones you will meet:

- **Statement**: "Kept, not imported. It repeats invoices you already have."
- **Order confirmation**: "Nothing to import. The invoice comes later."
- **Duplicate**: "Same invoice as one you already have, so it was not added again."
- **Held as spam**: "Not read. Let it through if you know the sender." Press **Let it through**.
- **Nothing to read**: "No PDF or photo came with it. Ask the sender for a PDF."
- **Over today's limit**: past 200 emails in a day, the rest are not read. Ask the sender to resend tomorrow.
- **Needs a look**: the inbox is not sure. Open **Change what this email is** and choose.

It reads PDFs and phone photos attached to the email. If nothing is attached, it reads the email's own text as the invoice. A spreadsheet or Word attachment is listed as not read, so ask that supplier for a PDF. Scans and photos are read up to 100 pages a day per kitchen; past that, a file shows "Could not be read yet" and can be read the next day.

If the inbox got it wrong, **Change what this email is** fixes it. Choose Invoice for one filed as a statement, and it is read again as an invoice within five minutes, then waits in review.

## If the address starts getting junk

Nothing in the junk can count, but it can clutter your review list. The third card, **Change the address**, has **Make a new address**. The old one keeps working for 14 days so your suppliers can catch up. Send the reps the message again from Step 2.

If the junk is the problem, **Stop the old address now** turns it off at once. Mail sent to it is no longer read.

## Once it is running

Check **Purchases > Invoice inbox** the way you check the walk-in: once a day, before you price anything. Filter to **Invoices and credits** to see only what waits in review, or **Held or needs a look** for what needs you.

For what to check on each line once it is in review, read [how to check a supplier invoice before it changes your recipe costs](/blog/review-supplier-invoice).
