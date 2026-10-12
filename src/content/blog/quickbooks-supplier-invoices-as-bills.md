---
title: "Send supplier invoices to QuickBooks without typing them twice"
description: "You already checked the invoice line by line in CostCook. Send it to QuickBooks Online as a bill, matched to the right vendor and account, and stop retyping it on Sunday night. Step by step, with one supplier."
publishedDate: 2026-10-12
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 21
readMinutes: 5
featureHref: /features/integrations#quickbooks
featureLabel: See QuickBooks in CostCook
---
<!-- story: docs/stories/blog-quickbooks-supplier-invoices-as-bills.story.md -->
<!-- HELD while QuickBooks is Coming (src/lib/connections.ts, src/lib/blog.ts). Before
     it publishes, re-read every step and label against the live build (the account
     labels differ between kitchen-brain main and develop) and shoot the captures
     listed in the story tracker; check-blog requires them once it is built. -->

Tuesday the Harbor Foods truck came. You checked invoice #44817 against what was on the dock, caught the short case of chicken, and confirmed it in CostCook. Sunday night you open QuickBooks and type the same invoice in again, line by line, for the books.

You've already checked that invoice once. Typing it again is how the $139.60 case of chicken turns into $193.60.

This guide connects CostCook to QuickBooks Online so a checked supplier invoice goes across as a bill, to the vendor and the account you chose, without anyone retyping it. The kitchen is Harbor & Hearth Catering, and the invoices are illustrative.

## What it does, in one line

You send the supplier invoices you have already checked to QuickBooks as bills, and supplier credits as credits. CostCook then reads back whether each bill has been paid.

QuickBooks can tell CostCook a bill was paid. It never rewrites an invoice in CostCook.

## Step 1: Connect your QuickBooks company

Open **Settings**, then **Integrations**, and find QuickBooks under **Sales & accounting**. Tap **Set up or manage QuickBooks**, then **Connect QuickBooks**. Intuit asks you to sign in and pick the company, then sends you back.

<!-- capture needed: the QuickBooks settings page after connecting, live company -->

Only the workspace owner connects QuickBooks and sends bills. Anyone else sees "The workspace owner sends invoices to QuickBooks." Your bookkeeper doesn't need a CostCook login for this. The bills show up in the QuickBooks company they already work in.

The settings page walks you through four steps, in this order:

1. Connect your QuickBooks company
2. Pick where purchases go
3. Match your suppliers
4. Send each invoice you have checked

## Step 2: Pick where purchases go

Choose the QuickBooks account that food and ingredients go to, and the one for fees on invoices, like a delivery charge or a fuel surcharge. These are your accounts, from your chart of accounts. CostCook never creates an account.

<!-- capture needed: the accounts card with both accounts chosen -->

If your bookkeeper keeps something apart, like drinks or paper goods, you can send that category to its own account. Everything else goes to the food account.

## Step 3: Match your suppliers

Each CostCook supplier is matched to one QuickBooks vendor. Harbor Foods in CostCook is "Harbor Foods Inc." in QuickBooks, and the match keeps them together. CostCook suggests matches, and you confirm them.

One QuickBooks vendor can be matched to only one CostCook supplier. If a supplier isn't in QuickBooks yet, CostCook creates a vendor (not an account) only when you ask it to for that supplier, and shows you the details first.

<!-- capture needed: supplier matches, one suggestion and one created vendor -->

## Step 4: Send each invoice you have checked

There are three ways to send, and every one is a press. Nothing goes to QuickBooks on its own.

- **One invoice.** On the invoice, tap **Send to QuickBooks as a bill**.
- **Several at once.** On the invoice list, pick the checked invoices and send them together.
- **While you check it.** When you confirm an imported invoice, tick **Send it to QuickBooks too**.

<!-- capture needed: an invoice's QuickBooks section before and after sending -->

A supplier credit goes the same way, with **Send credit to QuickBooks**. It lands in QuickBooks as a vendor credit against that supplier.

Only an invoice you have checked can be sent. That's the point: the version that reaches your books is the one you already compared with what came off the truck.

## Step 5: See where each invoice stands

Each invoice shows where it stands with QuickBooks, from not sent to paid. CostCook reads the paid status back from QuickBooks, so when your bookkeeper pays the Harbor Foods bill there, the invoice in CostCook shows it.

It reads that status. It never pays anything. As the settings page puts it: "CostCook never pays a bill, or sends the same invoice twice."

## When the connection hiccups

Sometimes QuickBooks doesn't answer in time. The worst outcome there would be a second copy of the same bill, so CostCook won't risk it. The app's own rule is "A timeout is not permission to make a second bill." If it can't tell whether the bill landed, it stops and says so: "CostCook stopped trying. No second bill was made." You check QuickBooks, and nothing is doubled.

If the QuickBooks sign-in expires, the settings page asks you to **Reconnect QuickBooks**, and new bills wait until you do.

## What it doesn't do

- **It doesn't send anything without a press.** There is no automatic send.
- **It doesn't pay bills.** Paying stays in QuickBooks, or wherever you pay from today.
- **It doesn't create accounts.** You pick from the accounts you already have.
- **It doesn't change your invoice in CostCook.** QuickBooks can tell CostCook a bill was paid. It can't change what was invoiced, received or corrected.
- **It doesn't send unchecked invoices.** Review comes first, every time.

## Sunday night, after

- Tuesday's Harbor Foods invoice is in QuickBooks as a bill, to Harbor Foods Inc., in the food account, exactly as you checked it.
- The bill matches the invoice Harbor Foods sent, and you checked it against the truck.
- The credit for the short case went across as a vendor credit.
- Your bookkeeper pays from QuickBooks, and CostCook shows it paid. Nobody typed the invoice a second time.
