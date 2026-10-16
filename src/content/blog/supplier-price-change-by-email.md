---
title: "How to see what a supplier's price rise does to your booked events"
menuTitle: "When an emailed invoice changes a price"
description: "A step-by-step guide with a screenshot at every step: an invoice arrives by email with a higher price, you review it, and Price changes shows which drafts, booked events, recipes and menus it reaches, then records what you decided."
publishedDate: 2026-12-17
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: prices
featured: false
order: 32
readMinutes: 9
featureHref: /features/invoice-email
featureLabel: See how invoice email works
---
<!-- story: docs/stories/blog-supplier-price-change-by-email.story.md -->
<!-- Read off kitchen-brain local develop a340f35c1 on 2026-10-16 (the owner's
     screenshot source). main ed6ff5f01 has Price changes but not the What
     happened? answers or Undo this answer. Written as a how-to
     (owner, 2026-10-12): numbered steps, one action each, a screenshot at each.
     CAPTURES (2026-10-16): scripts/capture-blog-guides.mjs
     GUIDE=supplier-price-change-by-email, at 390 px (the events card at 414: at
     390 its table cuts the right-hand amounts, an app bug), from a localhost
     copy of the Harbor & Hearth sample kitchen on develop 5e01c9fc7, whose
     purchases, inbox, import and price-change code matches a340f35c1. The
     Highland Meats invoice email and its PDF were made for the shoot and sent
     through the app's own inbox code with `npm run inbox:fixture`. Sample event
     names lost their seed suffixes. Sample data only. -->

By the end of this guide, a supplier's invoice will have come in by email, raised a price, and you'll know which of your booked events it hurts, by how many dollars, and you'll have written down what you decided.

The example is one invoice from Highland Meats. Boneless short rib went from $212.24 to $248.50 a 7 kg case, and short rib is the main on the Wedding Plated Dinner, which you've booked for the Blackwood anniversary party.

## Before you start

- **Invoice email is set up.** Your suppliers send invoices to your CostCook invoice address, or you forward them there. If it isn't set up yet, follow [how to get supplier invoices emailed straight into CostCook](/blog/supplier-invoices-by-email) first.
- **You're the owner or a manager.** Owners and managers answer price changes.
- **Your recipes and menus are costed**, so a new price has somewhere to go.

## Part 1: Review the invoice

1. Open **Purchases**, then **Invoice inbox**. The email is there with **Waiting in review. It counts once you confirm it.** Nothing has changed yet.

![The Invoice inbox card: Highland Meats, Fri, Oct 16. Invoice HM-20417 from Highland Meats, orders.highlandmeats@example.com. An Invoice badge and the line: Waiting in review. It counts once you confirm it. Below: HM-20417.pdf, In review, and a Review link.](/proof/blog/supplier-price-change-by-email/01-inbox-mobile.png "The invoice is in, and it hasn't changed a price.")

2. Press **Review**. You get the same invoice review as an invoice you upload yourself: the supplier, the invoice number and every line, each matched to your ingredients.
3. Scroll to **What this import changes**. Every pack cost the invoice will change is listed with its old and new price. A rise over 15% gets a warning, and the line under it names the recipes and menus it may change.

![What this import changes. Lines add up to the invoice total: $696.43 from the lines, $696.43 printed on the invoice. Beef short rib, boneless: pack cost $212.24 changes to $248.50. A Price rise warning: This pack cost rises +17.1%. Anything past 15% is worth a look before it reaches a quote. Below: May change 1 recipe cost (Braised Short Rib) and 2 menus (Holiday Party Buffet, Wedding Plated Dinner).](/proof/blog/supplier-price-change-by-email/02-price-rise-mobile.png "Before you import, you see the rise and where it goes.")

4. Check **What it does to your plates**. Braised Short Rib goes from $6.86 to $7.95 a portion.

![What it does to your plates: Plate costs move only after the final import succeeds. Braised Short Rib, from Beef short rib, boneless: $6.86 to $7.95, +$1.09. Below it, the Import invoice and update costs button.](/proof/blog/supplier-price-change-by-email/03-plates-mobile.png "The plate cost, before it moves.")

5. If the lines and the total are right, press **Import invoice and update costs**. Now the new price is your current cost.
6. The receipt says **1 current cost changed.** Press **Review affected events**.

![Invoice imported: Saved. The original stays with this import. What changed: 2 purchase records created, with View purchases; Beef short rib, boneless, with View ingredient; 1 current cost changed. Below: a Review affected events button.](/proof/blog/supplier-price-change-by-email/04-imported-mobile.png "One price changed, and the button that follows it.")

## Part 2: See what the price change reaches

7. You're on the price change for **Beef short rib, boneless**, marked **Open review**. At the top: the old and new case price, the percentage, and where it came from (**Invoice HM-20417**, Highland Meats, with a link back to it).
8. Read the three totals under it:
   - **Draft quotes**: how much the food cost of your drafts goes up in total. Here, 2 drafts, +$134.88.
   - **Confirmed event**: how much margin you lose on events you've already booked. Here, 1 event, margin −$110.96. "Clients pay what you quoted."
   - **Recipes and menus**: how many it touches.

![Beef short rib, boneless, Open review: $212.24 to $248.50 per case 7 kg, up 17%. From Invoice HM-20417, Fri Oct 16, Highland Meats. Three totals: 2 draft quotes, +$134.88, food cost goes up in total, biggest $82.67. 1 confirmed event, Margin −$110.96, clients pay what you quoted. Recipes and menus: 1 recipe, 2 menus. Braised Short Rib $6.86 to $7.95 a portion.](/proof/blog/supplier-price-change-by-email/05-price-change-mobile.png "What one price did, in dollars.")

9. Look at **Upcoming events**. The biggest change is first. "Drafts follow the new cost automatically. Confirmed events keep the price you quoted." So the Blackwood party still bills what you quoted; the $110.96 comes out of your margin. The two drafts show their food cost before and after, so you can re-price them before they go out.

![Upcoming events: Drafts follow the new cost automatically. Confirmed events keep the price you quoted. Changed 3, Not affected 0. Blackwood anniversary party, Mon Oct 26, Confirmed, +$110.96, margin −$110.96. Delacroix company offsite, Tue Oct 27, Draft, $1,023.46 to $1,106.13, +$82.67. Salazar memorial luncheon, Fri Oct 23, Draft, $627.37 to $679.58, +$52.21.](/proof/blog/supplier-price-change-by-email/06-events-mobile.png "The booked event keeps its price. Your margin takes the rise.")

10. Below that, **Recipes** and **Menus** show the new cost a portion and a guest. Each name opens the recipe or menu, if you want to change the dish or its price.

![Recipes: Braised Short Rib, $6.86 to $7.95 a portion, +$1.09. Menus: Holiday Party Buffet, $26.14 to $28.32 a guest, +$2.18. Wedding Plated Dinner, $26.93 to $29.11 a guest, +$2.18.](/proof/blog/supplier-price-change-by-email/07-menus-mobile.png "Every recipe and menu the price reaches.")

## Part 3: Say what happened, and close it

11. Under **What happened?**, pick the answer that's true:
    - **The old price was wrong**: the old price was a mistake. Keep the new one.
    - **The price really rose**: the supplier charged more. Keep the new price. It tells you how much margin you lose on booked events.
    - **The new price is wrong**: undo it and go back to the old price. Drafts go back to their old cost.
12. Add a **Note** if you want one, for whoever looks at it next. Here: "Highland confirmed short rib is up through November."
13. Press **Close review**.

![What happened? Your answer closes this review. The first two keep $248.50; the third puts $212.24 back. Three choices: The old price was wrong; The price really rose, selected: Beef short rib, boneless got more expensive. Keep $248.50. Your margin on 1 confirmed event drops $110.96; The new price is wrong: Undo it and go back to $212.24. Drafts return to their old cost. A note: Highland confirmed short rib is up through November. A Close review button.](/proof/blog/supplier-price-change-by-email/08-decision-mobile.png "Three answers. Only the third changes the price back.")

14. The review now reads **Closed · Real change**, with who closed it, when, and your note. If you picked the wrong answer, press **Undo this answer**. You have ten minutes.

![Closed · Real change. Marisol Vega, Fri Oct 16. Highland confirmed short rib is up through November. An Undo this answer button: You can undo this for ten minutes after closing it.](/proof/blog/supplier-price-change-by-email/09-closed-mobile.png "Who decided, when, and why.")

## Where to find price changes later

You don't have to answer a price change the day the invoice arrives. Every one waits in **Purchases** > **Price changes** until someone answers it, with the biggest effect on upcoming events first. **Today** says how many need a decision.

![Price changes: See how ingredient price changes affect upcoming events, then review each change. Filters: Open 100, Looks unusual 0, Closed, All; All suppliers; Sort: biggest effect; a search box, Ingredient, supplier or invoice. The first row: Bay scallops, Purchase, Coastal Seafood, Thu Oct 15, $64.63 to $62.99 per 1 kg box, down 3%, 5 drafts −$49.20, 1 confirmed not affected, and a Review button.](/proof/blog/supplier-price-change-by-email/10-list-mobile.png "Every open price change, biggest effect first. (Sample kitchen.)")

- **Looks unusual** shows the changes of 40% or more, either way, by default. Those are usually a misread pack or a typo, not a real price.
- **Closed** keeps every answered one, with its note.
- If a newer invoice changes the same ingredient again before you answer, the newer price change replaces the older open one, so you never answer an old price.

## If something goes wrong

| What you see | What to do |
| --- | --- |
| The invoice says **Could not be read yet** in the inbox | Nothing was imported and no price changed yet. If you were over the day's reading limit, it's read tomorrow. Otherwise, ask the supplier for a clearer PDF, or upload a clear photo in **Import and review**. |
| No **Review affected events** button after importing | No current cost changed, so there's nothing to answer. |
| "An owner or manager closes this one" | You're signed in as Staff. Ask the owner or a manager to answer it. |
| The new price is a misread (the wrong pack, a typo) | Answer **The new price is wrong**. It goes back to the old price and your drafts go back with it. |
| You closed it with the wrong answer | Press **Undo this answer** within ten minutes and answer again. |

## What it doesn't do

Price changes doesn't change a menu price, a recipe or a booked event for you. It shows you what moved and keeps your answer. Changing the dish or the quote is up to you. For how to compare supplier prices before you buy, read [how supplier price changes reach the recipes you already costed](/blog/supplier-price-changes).
