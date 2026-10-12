---
title: "What to ask Sage the day before an event"
menuTitle: "What to ask Sage before an event"
description: "A step-by-step guide with a screenshot at every step: open Sage the day before, ask what's left, check the shelf, and turn the gaps into a shopping list you create yourself."
publishedDate: 2026-12-03
category: Running the event
menuGroup: Plan and buy
menuIcon: calendar
featured: false
order: 30
readMinutes: 8
featureHref: /features/sage
featureLabel: See Sage in CostCook
---
<!-- story: docs/stories/blog-ask-sage-before-event.story.md -->
<!-- Read off kitchen-brain develop 9b84420f4 on 2026-10-12 (RC-85).
     HOW THE CAPTURES WERE MADE: localhost build of 9b84420f4 with a real model
     key (owner's Google AI key, 2026-10-12), so SAGE_AI_PROVIDER=google and the
     run model is google:gemini-3.5-flash (sageModelConfig in
     src/lib/server/sage/config.ts). Production defaults to Anthropic. Answers
     are written by the model and vary from run to run, so the steps say what
     Sage did and only the alt text quotes words, exactly as the shot shows.
     Every figure in the shown answers was checked against the sample kitchen:
     order #765 food cost 30.7% against 30%, shop 16 lines, prep 0 of 19, pack
     0 of 5 (order page and the getOrderList tool call); 2 below par of 66 with
     a par, 12 uncounted (getIngredientsBelowPar tool call). The draft card is
     rendered from the tool's records, not the model.
     "What do I still need to buy for it?" failed twice on this model: Sage's
     answer used numbers its records didn't back (sage_runs.unverified_tokens),
     so the app showed "Sage couldn't answer just now." That screen is the fix
     section's example. The two allowance notices were shown by setting a test
     run's credits in the sample database; their captions say so. Credits:
     SAGE_PERIOD_CREDITS 2,000, SAGE_TRIAL_CREDITS 300 (config.ts), notice at
     80% (allowance.ts NOTICE_SHARE).
     CAPTURES: 11 crops at 390 px, demo seed renamed Harbor & Hearth Catering. -->

By the end of this guide, you'll have asked Sage what's left before tomorrow's event, checked what's below par, and turned this week's gaps into a shopping list you created yourself.

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

3. Read the answer. Sage asks about the order by its full name, then lists what needs you, one numbered line each, with a link to the order on every line. Here it found three things: the food cost is over target, nothing on the shop, prep or pack lists is checked off, and some ingredients still need an allergen review.

![What needs my attention for Ishikawa fundraiser · October 2026 (1)? The answer: The Ishikawa fundraiser · October 2026 (1) order for October 13, 2026 needs attention regarding high food cost and uncompleted task lists. 1, Food cost is over target: The order's food cost is currently at 30.7%, which exceeds your 30% kitchen target. 2, Task lists are incomplete: None of the items on the shop list (16 items), prep list (19 items), or pack list (5 items) have been checked off yet. 3, Dietary safeguards pending review: There are 16 unreviewed ingredients on this order's menu. Suggested next step: Review order details and lists. Open Orders. You review it first.](/proof/blog/ask-sage-before-event/sage-03-left-mobile.png "Three things, each one a link to the order.")

4. Open the order from any line before you act on it. The order page shows the same numbers. Sage only points; **Open Orders** says it plainly: "You review it first."

5. Check the shelf: start a new conversation with **+** and tap **What's below par?** Sage names each item below par, and says which items it couldn't judge because they have no recent count.

![Which ingredients are below par? There are 2 ingredients below par, and 12 ingredients with a par that cannot be judged because they have no trusted count. 1, Dill: On-hand count is below par. 2, Tofu, firm: On-hand count is below par. 12 ingredients (including Avocado, Black peppercorn, and Cilantro) have a par set but no trusted stock count. Suggested next step: Check inventory counts on the Inventory screen. Open Inventory.](/proof/blog/ask-sage-before-event/sage-05-par-mobile.png "Below par, and what it couldn't judge.")

6. Tap **Based on … records** under the answer. Each line is a record Sage read. Tap one to open it.

![Based on 2 records: Dill · ingredient · below par. Tofu, firm · ingredient · below par.](/proof/blog/ask-sage-before-event/sage-06-sources-mobile.png "Every answer shows the records behind it.")

7. Start a new conversation and tap **Draft this week's shopping list**. Sage drafts a list for today and the next 7 days, and says what it will create and what it won't touch.

![Draft shopping list: Creates a draft shopping list of 11 items, about $381.34. Nothing is ordered and no cost changes until you review it. What this creates: Creates a draft shopping list of 11 items. What it does not touch: No order is placed and no supplier is contacted. No ingredient price or recipe cost changes. No inventory count is adjusted. What goes on it: Italian sausage 2 × 5 kg case, Olive oil 1 × 3 L tin, Black peppercorn 1 × 1 kg bag, Brown sugar 1 × 10 kg sack, Carrot 1 × 25 lb bag, Granulated sugar 1 × 25 kg sack, Green bean 1 × 10 lb case, Lime 1 × case 60 ct, Show 3 more. Create the shopping list (ringed) and Discard this draft.](/proof/blog/ask-sage-before-event/sage-07-draft-mobile.png "Nothing is ordered and no cost changes until you review it.")

8. Check the items. Then press **Create the shopping list**, or **Discard this draft** if it's wrong.

9. Tap **Open the shopping list**. It opens the Shopping list in Inventory, where you can change any buy before you shop.

![A notice in Sage: Shopping list created. Open the shopping list.](/proof/blog/ask-sage-before-event/sage-08-created-mobile.png "The list is yours to change from here.")

**Tip:** open Sage from the event's own page, and the questions are about that order: **What's left to do for this order?**, **What do I need to buy for it?** and **Is it over its food-cost target?**

**Tip:** Sage's draft came to the same 11 items, about $381.34, as the Inventory page. If that looks high, count the shelf first, then draft again.

**Tip:** Sage writes each answer fresh, so the wording changes from one time to the next. The numbers come from your records, and the records are linked.

![Answers come only from your CostCook records, with links to each one. Sage suggests changes; you make them.](/proof/blog/ask-sage-before-event/sage-tip-records-mobile.png "Sage reads. You decide.")

## If something goes wrong

### "Sage couldn't answer just now."

Sage didn't give an answer this time. It still lists the record it was looking at under **Where this came from**. Press **Retry**, or open that record and check it yourself. For "what do I need to buy", the order's own **Shop** list has the answer.

![What do I need to buy for Ishikawa fundraiser · October 2026 (1)? Sage couldn't answer just now. Try again or open the linked records to check it. Where this came from: Order, Ishikawa fundraiser · October 2026 (1) · 2026-10-13. Retry.](/proof/blog/ask-sage-before-event/sage-04-buy-mobile.png "No answer is better than a wrong one.")

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
