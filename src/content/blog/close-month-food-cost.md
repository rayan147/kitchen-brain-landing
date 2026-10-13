---
title: "How to close the month on food cost"
menuTitle: "Close the month on food cost"
description: "A step-by-step guide with a screenshot at every step: compare what the month's events should have cost with what you paid, then check orders, deliveries, shelf counts and waste until the gap is explained or named."
publishedDate: 2026-10-29
category: Costing & pricing
menuGroup: Cost the work
menuIcon: variance
featured: false
order: 25
readMinutes: 10
featureHref: /features/purchases-and-month-cost
featureLabel: See purchases and month cost in CostCook
---
<!-- story: docs/stories/blog-close-month-food-cost.story.md -->
<!-- Read off kitchen-brain local develop fcc651477 on 2026-10-13 (RC-82). Labels and
     figures are the app's own, from the Harbor & Hearth sample kitchen's closed
     September 2026: Purchases > Food-cost gap, Show the work, Reconcile food
     cost (/purchases/reconcile), Log waste (More menu), Analytics > Month close.
     Not claimed: what a "normal" gap is; that the gap is waste; how long a close
     takes; corrections (not shot for this guide).
     CAPTURES: 17 crops at 390 px from a localhost build of develop fcc651477,
     demo seed renamed Harbor & Hearth Catering, US units, nothing entered for
     the shoot. Re-shot 2026-10-13 after the app fixes: Reconcile now separates
     draft events ("Not counted yet") from confirmed ones ("Counted"), "Review
     purchases and log waste" opens Log waste, and Ingredient contributions
     stacks into cards on a phone with Gap in view. "Review receiving" on a
     delivery is a status; the button is "Open receiving". -->

By the end of this guide, last month has a food-cost number you can explain. You'll see what your events should have cost, what you paid, and what part of the difference is still a question.

You do it on one screen in **Purchases**, then four checks on **Reconcile food cost**. The example is a sample kitchen's September: nine confirmed events, and $19,750.41 of food bought.

The app's own line is worth keeping in mind the whole way through: "A gap is a question, not a waste entry."

This guide is for the whole month. To check one event against its plan, see [The event is over. What should the food have cost?](/blog/expected-vs-actual-food-cost)

## Before you start

- The month is over, and its events are confirmed in CostCook. Events that aren't confirmed don't count toward what the month should have cost.
- Your purchases for the month are in: imported invoices, received deliveries, or logged by hand. To bring invoices in, see [How to import your ingredients, invoices and recipes](/blog/import-invoices-recipes-ingredient-lists).
- Ideally, you counted your shelves near the end of the month. See [How to count your inventory the first time](/blog/count-inventory-first-time).

## Read the month

1. Open **Purchases** and go to **Food cost** for the month. Pick the month you're closing in **Month**.

![Food cost, September 2026: month closed, 9 confirmed events. Food only. Staff, packaging and rentals are not in these numbers. The Month picker, set to September 2026, is ringed.](/proof/blog/close-month-food-cost/m-01-month-mobile.png "Pick the month you're closing.")

2. Read the three numbers. **Should have cost** is what your confirmed events' recipes say they used. **Did cost** is what you paid. **Unaccounted gap** is what's left after logged waste and the change in what's on your shelves.

![Should have cost (recipe estimate) $12,599.25, Used by 9 confirmed events. Did cost (what you paid) $19,750.41, 97 items across 10 purchases. Unaccounted gap $4,426.71: What is left after the waste, byproduct credit, and inventory you logged. 22.4% of spend.](/proof/blog/close-month-food-cost/m-02-numbers-mobile.png "September: $7,151.16 more bought than used, $4,426.71 still unexplained.")

In September the kitchen bought $7,151.16 more food than its events used. $96.48 of that was logged waste. The shelves ended the month $2,627.97 fuller than they started, so that much was bought ahead. That leaves $4,426.71 unaccounted for.

3. Press **Show the work** to see the sum.

![The bottom of the gap card: $2,553.14 opening inventory carried in from last month. Show the work is ringed, with Review food-cost gap below it.](/proof/blog/close-month-food-cost/m-03-show-work-btn-mobile.png "Every number in the gap is shown.")

![Net food-cost balance: $19,750.41 plus $2,553.14 minus $12,599.25 minus $96.48 minus $5,181.11 equals $4,426.71.](/proof/blog/close-month-food-cost/m-04-formula-mobile.png "Purchases plus opening stock, minus usage, waste and closing stock.")

## Check the gap

4. Press **Review food-cost gap**. **Reconcile food cost** opens with the remaining gap and the six numbers behind it.

![Remaining gap $4,426.71. A gap is a question, not a waste entry. Missing records, purchase timing and stock carried between months can affect this difference. Actual spend $19,750.41, Opening inventory $2,553.14, Confirmed usage $12,599.25, Ending inventory $5,181.11, Logged waste $96.48, Byproduct credit $0.00.](/proof/blog/close-month-food-cost/m-05-remaining-mobile.png "“A gap is a question, not a waste entry.”")

5. Under **1. Review orders**, look at **Not counted yet**. These are the month's draft events, and they don't count toward Should have cost. If one really happened, press **Review order** and confirm it once it's ready. Confirming an event freezes its costs.

![1. Review orders: 9 confirmed events contribute usage. Confirm only events that are ready; confirmation freezes their costs. Not counted yet: 9 draft events. Nakamura engagement party #7, Sep 2, with Review order ringed.](/proof/blog/close-month-food-cost/m-06-orders-mobile.png "Drafts don't count until they're confirmed.")

6. Under **2. Review deliveries**, the events that count are listed under **Counted**. Where one says **Review receiving**, press **Open receiving** and check it against what arrived. A delivery you never recorded makes the month look cheaper than it was. A delivery recorded twice makes it look dearer.

![2. Review deliveries: Check actual deliveries against the order. A sent purchase order does not mean food has been received. Review existing purchases before recording a delivery again. Counted: 9 confirmed events. Ferreira baby shower #11, Sep 10: Review receiving, and Open receiving, ringed.](/proof/blog/close-month-food-cost/m-07-deliveries-mobile.png "Sent is not received.")

7. Under **3. Check shelf counts**, press **Count or re-count shelf** if your counts are thin. Ending inventory comes from counts near the end of the month.

![3. Check shelf counts: Ending inventory uses counts near the end of the selected month, valued at their recorded prices. A zero count can be correct. Today's count does not replace a historical count. Count or re-count shelf is ringed.](/proof/blog/close-month-food-cost/m-08-counts-mobile.png "A count today won't fix last month.")

8. Under **4. Review known waste**, check what was logged. New waste you log now is dated today, so it lands in this month, not the one you're closing. **Review purchases and log waste** opens **Log waste** for waste you see today.

![4. Review known waste: $96.48 logged. Record only waste you observed today. New waste entries use today's date and do not change a past month. No waste is a valid outcome. Review purchases and log waste is ringed.](/proof/blog/close-month-food-cost/m-09-waste-mobile.png "No waste is a valid outcome.")

![Log waste: Something you threw out. It counts as waste in this month's food cost, valued at what you paid and dated today. Ingredient, Type to search, How much, Unit.](/proof/blog/close-month-food-cost/tip-waste-mobile.png "It opens ready: ingredient, how much, and an optional note.")

9. Read **Ingredient contributions**, one card per ingredient, with its **Gap** on the first line. Start with the biggest numbers, positive or negative. Here, the brisket shows $2,718.24 more used than bought and stocked. The lamb shows $1,747.52 bought and not used by any event.

![Ingredient contributions: Spend + opening stock − usage − inventory − waste. Positive and negative differences both need context; neither proves loss. Beef brisket, Gap −$2,718.24: Spend $4,606.06, Opening stock $195.54, Usage $6,128.01, Inventory $1,348.98, Waste $42.85. Lamb leg, boneless, Gap $1,747.52: Spend $2,237.99, Opening stock $159.54, Usage $0.00, Inventory $650.01, Waste $0.00.](/proof/blog/close-month-food-cost/m-10-ingredients-mobile.png "“Neither proves loss.” Each line is a question for one ingredient.")

Each line is a question you can answer. A missing invoice, a delivery booked to the wrong month, a count that missed a shelf. When you've answered what you can, whatever is left stays on the page as the unaccounted gap.

**Tip:** log waste on the day it happens, not at month end. On **Purchases**, open **More**, then **Log waste**. It's valued at what you paid, and dated that day.

![The More menu on Purchases: Import invoice, Log one item, Log waste (ringed), Stock turnover, Shelf check, Sent purchase orders (0), Receiving follow-up, Supplier invoices, Invoice inbox.](/proof/blog/close-month-food-cost/tip-menu-mobile.png "Log waste lives under More.")

**Tip:** to see which events were priced too tight, open **Analytics**, then **Month close**. It lists the month's events, the ones furthest over your food-cost target first.

![Events this month: 6 of 9 were planned over target. Together they cost $898.06 more than 30% would have. Ferraro fundraiser #3, Mon, Sep 21: Guests 182, Sales $13,458.90, Planned food $4,574.11, Food cost 34.0%, Vs target +$536.44.](/proof/blog/close-month-food-cost/tip-events-mobile.png "Planned over target is a pricing question, not a kitchen one.")

## If something goes wrong

### "Month-boundary counts are incomplete"

Your counts don't cover everything bought or planned that month. Only counts from the 14 days before the start and end of the month are used, so a count you take today may not help. Count near month end next time.

![Month-boundary counts are incomplete: Opening or closing counts do not cover every ingredient bought or planned for this month. Only counts within 14 days before each boundary are used; a fresh count today may be outside that window.](/proof/blog/close-month-food-cost/err-boundary-mobile.png "Count in the last two weeks of the month.")

### "1 of 9 events has no per-guest price yet"

An event without a price still counts in usage, so the dollar figures are right. The percentages wait until every event is priced. Price the event, then come back.

![1 of 9 events has no per-guest price yet. Their food counts in usage but not in revenue, so the percentages wait until every event is priced: the dollar figures still stand.](/proof/blog/close-month-food-cost/err-unpriced-mobile.png "Dollars stand. Percentages wait.")

### A negative gap on an ingredient

The events used more than you bought plus what you had. Look for a purchase that isn't recorded, stock that was there but never counted, or a recipe amount that's off. The app says neither a positive nor a negative gap proves loss.

![The Beef brisket card: Gap −$2,718.24, ringed. Spend $4,606.06, Opening stock $195.54, Usage $6,128.01, Inventory $1,348.98, Waste $42.85.](/proof/blog/close-month-food-cost/err-negative-mobile.png "More used than bought: find the missing record.")

### Month close in Analytics shows a bigger number

**Analytics**, **Month close** says what's "not yet explained" before any shelf count. It says so: most of that is usually stock still on your shelves. **Food cost** in **Purchases** takes the counted shelf out. For September that's $7,054.68 in Analytics and $4,426.71 in Purchases. The difference is the $2,627.97 the shelves grew.

![Analytics, Month close: You bought $7,151.16 more than September's events used. That gap isn't waste or profit on its own. Most of it is usually stock still on your shelves. A shelf count turns it into something you can read. $12,599.25 planned for events, $96.48 logged waste, $7,054.68 not yet explained: stock on hand, pack rounding, unlogged waste or missing records.](/proof/blog/close-month-food-cost/err-analytics-mobile.png "Before the shelf count: $7,054.68. After it: $4,426.71.")

## Limits

- Food only. Staff, packaging and rentals aren't in these numbers.
- Should have cost comes from confirmed events only. Drafts, cancelled and future events are left out.
- Ending and opening stock come from counts within 14 days before each month boundary. A count you take later doesn't change a past month.
- New waste is dated the day you log it. It never changes a past month.
- CostCook doesn't call the gap waste. Whatever no record explains stays on the page, named as the unaccounted gap.
