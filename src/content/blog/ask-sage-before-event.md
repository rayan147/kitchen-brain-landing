---
title: "What to ask Sage the day before an event"
menuTitle: "What to ask Sage before an event"
description: "A step-by-step guide with a screenshot at every step: open Sage the day before, ask what's left and what to buy, check the shelf, and turn the gaps into a shopping list you create yourself."
publishedDate: 2026-12-03
category: Running the event
menuGroup: Plan and buy
menuIcon: calendar
featured: false
order: 30
readMinutes: 10
featureHref: /features/sage
featureLabel: See Sage in CostCook
---
<!-- story: docs/stories/blog-ask-sage-before-event.story.md -->
<!-- Read off kitchen-brain develop fcc651477 on 2026-10-13 (RC-85).
     HOW THE CAPTURES WERE MADE: localhost build of fcc651477 with a real model
     key (owner's Google AI key), so SAGE_AI_PROVIDER=google and the run model
     is google:gemini-3.5-flash (sageModelConfig in
     src/lib/server/sage/config.ts). Production defaults to Anthropic. Answers
     are written by the model and vary from run to run, so the steps say what
     Sage did and only the alt text quotes words, exactly as the shot shows.
     The sample order #765 was moved from Oct 13 to Oct 14 in the shoot's copy
     of the sample kitchen, so it is tomorrow on the shoot day (orders.event_date
     only).
     Every figure in the shown answers was checked against order #765's own
     page: food cost 30.7% against 30% (frozen at confirmation), shop 16 lines,
     prep 0 of 19, pack 0 of 5, and Shop $1,011.00 across 6 suppliers with
     every supplier subtotal and every line price matching the Shop list.
     Below par: 2 (Dill, Tofu, firm), 12 with a par and no trusted count. The
     draft card is rendered from the tool's records: 11 items, $381.34, the
     same as Inventory's To order and Cost to buy.
     The "couldn't check" screen is real: one run of "What do I still need to
     buy for it?" was withheld by Sage's own check (code UNVERIFIED,
     src/lib/sage/transcript.ts UNVERIFIED_ANSWER); the next run answered.
     The two allowance notices were shown by setting a test run's credits in
     the sample database; their captions say so. Credits: SAGE_PERIOD_CREDITS
     2,000, SAGE_TRIAL_CREDITS 300 (config.ts), notice at 80% (allowance.ts).
     CAPTURES: 13 crops at 390 px, demo seed renamed Harbor & Hearth Catering. -->

By the end of this guide, you'll have asked Sage what's left before tomorrow's event and what to buy for it, checked what's below par, and turned this week's gaps into a shopping list you created yourself.

Sage reads your CostCook records and answers with a link to each record it used. It doesn't change anything on its own. In the app's words: "Sage suggests changes; you make them."

## Before you start

- Your events, recipes and inventory are in CostCook. Sage only answers from what's there.
- Count the shelves you're about to buy for. Sage's shopping draft uses the same numbers as Inventory, so an item with no recent count is bought in full. See [How to count your inventory the first time](/blog/count-inventory-first-time).
- Sage comes with 2,000 Sage credits each paid month, 300 during the free trial.

## Ask Sage the day before

1. Tap **Sage**, the leaf at the top of the screen.

![The top bar on a phone: the menu button, CostCook, Today, then the Sage leaf button, ringed, and search.](/proof/blog/ask-sage-before-event/sage-01-open-mobile.png "Sage is in the top bar.")

2. Read the first line. Sage opens on what's next. Here it's "Ishikawa #765 is tomorrow.", with questions for that event under **Coming up** and for the week under **This week**. Tap **What's left to do for Ishikawa #765?**

![The Sage panel: Ishikawa #765 is tomorrow. Ask anything about your orders, prep, stock or costs. COMING UP: What's left to do for Ishikawa #765? (ringed), What do I still need to buy for it? THIS WEEK: Draft this week's shopping list, What's below par?, Which orders are over 30%?, Why did Olive oil, extra virgin cost more?](/proof/blog/ask-sage-before-event/sage-02-start-mobile.png "Sage opens on tomorrow's event.")

3. Read the answer. Sage asks about the order by its full name, then lists what needs you, one numbered line each, with a link to the order on every line. Here it found three things: the food cost is over target, nothing on the shop, prep or pack lists is ticked off, and some ingredients still need an allergen review.

![What needs my attention for Ishikawa fundraiser · October 2026 (1)? The answer: The Ishikawa fundraiser on October 14, 2026 needs attention for its food cost margin and incomplete task lists. 1, Food cost is over target: The frozen food cost is 30.7%, which exceeds your 30% target. 2, Lists are not checked off: None of the 16 shopping items, 19 prep tasks, or 5 packing items have been ticked off yet. 3, 16 unreviewed ingredients: The order's dietary guards show 16 ingredients still require allergen review. Overall, 0 out of 40 tasks on the shop, prep, and pack lists are complete. Suggested next step: Review the order details. Open Orders. You review it first.](/proof/blog/ask-sage-before-event/sage-03-left-mobile.png "Three things, each one a link to the order.")

4. Open the order from any line before you act on it. The order page shows the same numbers. Sage only points; beside **Open Orders** it says so plainly: "You review it first."

5. Start a new conversation with **+** and tap **What do I still need to buy for it?** Sage answers from the order's Shop list: the total, then one line per supplier, with what to buy and what each costs.

![What do I need to buy for Ishikawa fundraiser · October 2026 (1)? The shopping list totals $1,011.00 across 6 suppliers. 1, Baldor ($80.78): 2 × 3 lb clamshell Arugula ($41.16) and 1 × 10 lb case Cremini mushroom ($39.62). 2, Green Valley Produce ($124.45): Carrot, Orange, Sweet potato and Yellow onion. 3, Highland Meats ($182.43): 3 × 5 kg case Italian sausage. 4, Restaurant Depot ($166.49): All-purpose flour, Granulated sugar, Maple syrup, Olive oil and Polenta. 5, Stone Mill Dairy ($390.36): Unsalted butter ($202.63), Goat cheese ($62.74) and Parmesan block ($124.99). 6, Sysco ($66.49): 1 × case 180 ct Large eggs. Suggested next step: View order details. Open Orders. You review it first. Based on 25 records.](/proof/blog/ask-sage-before-event/sage-04-buy-mobile.png "The same $1,011.00 as the order's Shop tab.")

6. Check the shelf: start a new conversation and tap **What's below par?** Sage names each item below par, and says how many it couldn't judge because they have no recent count.

![Which ingredients are below par? There are 2 ingredients below par today: Dill and Tofu, firm. 1, Dill is below par: Trusted on-hand count is below the declared par level. 2, Tofu, firm is below par. There are also 12 ingredients with set pars that cannot be judged because they lack a trusted count. Suggested next step: Check inventory counts and pars. Open Inventory. You review it first.](/proof/blog/ask-sage-before-event/sage-05-par-mobile.png "Below par, and what it couldn't judge.")

7. Tap **Based on … records** under the answer. Each line is a record Sage read. Tap one to open it.

![Based on 2 records: Dill · ingredient · below par. Tofu, firm · ingredient · below par.](/proof/blog/ask-sage-before-event/sage-06-sources-mobile.png "Every answer shows the records behind it.")

8. Start a new conversation and tap **Draft this week's shopping list**. Sage drafts a list for today and the next 7 days, and says what it will create and what it won't touch.

![Draft shopping list: Creates a draft shopping list of 11 items, about $381.34. Nothing is ordered and no cost changes until you review it. What this creates: Creates a draft shopping list of 11 items. What it does not touch: No order is placed and no supplier is contacted. No ingredient price or recipe cost changes. No inventory count is adjusted. What goes on it: Italian sausage 2 × 5 kg case, Olive oil 1 × 3 L tin, Black peppercorn 1 × 1 kg bag, Brown sugar 1 × 10 kg sack, Carrot 1 × 25 lb bag, Granulated sugar 1 × 25 kg sack, Green bean 1 × 10 lb case, Lime 1 × case 60 ct, Show 3 more. Create the shopping list (ringed) and Discard this draft.](/proof/blog/ask-sage-before-event/sage-07-draft-mobile.png "Nothing is ordered and no cost changes until you review it.")

9. Check the items. Then press **Create the shopping list**, or **Discard this draft** if it's wrong.

10. Tap **Open the shopping list**. It opens the Shopping list in Inventory, where you can change any buy before you shop.

![A notice in Sage: Shopping list created. Open the shopping list.](/proof/blog/ask-sage-before-event/sage-08-created-mobile.png "The list is yours to change from here.")

**Tip:** open Sage from the event's own page, and the panel says which order it's looking at. The questions are about that order: **What's left to do for this order?**, **What do I need to buy for it?** and **Is it over its food-cost target?**

![Sage opened from the order: Looking at: Ishikawa fundraiser #765. Ishikawa #765 is tomorrow. FOR THIS ORDER: What's left to do for this order?, What do I need to buy for it?, Is it over its food-cost target?](/proof/blog/ask-sage-before-event/sage-tip-order-mobile.png "Opened from the order, Sage names it.")

**Tip:** Sage's draft came to the same 11 items, about $381.34, as the Inventory page. If that looks high, count the shelf first, then draft again.

**Tip:** Sage writes each answer fresh, so the wording changes from one time to the next. The numbers come from your records, and the records are linked.

![Answers come only from your CostCook records, with links to each one. Sage suggests changes; you make them.](/proof/blog/ask-sage-before-event/sage-tip-records-mobile.png "Sage reads. You decide.")

## If something goes wrong

### "Sage's answer used numbers it couldn't check against your records, so it wasn't shown."

Sage checks every number it writes against the records it read. When one doesn't match, you get this instead of the answer. It lists the records it was looking at under **Where this came from**. Press **Retry**, or ask it another way. For "what do I need to buy", the order's own **Shop** tab has the answer.

![What do I need to buy for Ishikawa fundraiser · October 2026 (1)? Sage's answer used numbers it couldn't check against your records, so it wasn't shown. Retry, or ask it another way. Where this came from: three Ishikawa orders. Retry.](/proof/blog/ask-sage-before-event/err-unverified-mobile.png "No answer is better than a wrong one.")

### "Sage couldn't answer just now."

Sage didn't get an answer back this time. Press **Retry**. If it keeps happening, open the records yourself: everything Sage reads is in CostCook.

### "Sage has used 1,700 of 2,000 credits."

This is a heads-up, shown once 80% of the allowance is used. It says the day the credits reset. Sage still answers until they run out.

![Sage has used 1,700 of 2,000 credits. They reset on Sat Oct 31.](/proof/blog/ask-sage-before-event/err-notice-mobile.png "Usage set in the sample kitchen for this screenshot.")

### "Sage has used this kitchen's allowance."

Sage stops answering until the reset date. Everything else in CostCook still works, so do the same check by hand: **Inventory** for what's below par and what to buy, and the event's page for what's left.

![Sage has used this kitchen's allowance. It comes back on Sat Oct 31, and every kitchen screen still works.](/proof/blog/ask-sage-before-event/err-spent-mobile.png "Usage set in the sample kitchen for this screenshot.")

## Limits

- Sage answers only from your CostCook records. Check an answer against the record it links before you act on it.
- A draft doesn't order anything, contact a supplier, change a price or recipe cost, or adjust a count. Nothing is saved until you press **Create the shopping list**.
- The shopping draft covers today and the next 7 days.
- 2,000 Sage credits each paid month, 300 during the free trial.
