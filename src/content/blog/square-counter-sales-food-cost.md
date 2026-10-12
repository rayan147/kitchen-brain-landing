---
title: "Square and CostCook: what sold at the counter, and what it cost to make"
menuTitle: "Square counter sales and food cost"
description: "Publish the dishes you pick to your Square register, and the register's sales come back with today's recipe cost beside them. One Saturday market stall, step by step in CostCook."
publishedDate: 2026-10-12
category: Costing & pricing
menuGroup: Cost the work
menuIcon: calculator
featured: false
order: 20
readMinutes: 7
featureHref: /features/integrations#square
featureLabel: See Square in CostCook
---
<!-- story: docs/stories/blog-square-counter-sales-food-cost.story.md -->
<!-- HELD while Square is Coming (src/lib/connections.ts, src/lib/blog.ts). Before
     it publishes, re-read every step against the live build and shoot the captures
     listed in the story tracker; check-blog requires them once it is built. -->

Saturday at the market stall goes fine. The register says you sold 42 chicken bowls, 65 slices of focaccia and 18 short rib plates. Monday morning you know what you took in. You don't know what any of it cost you to make, because the register has never seen a recipe and your recipes have never seen the register.

That's the gap this connection closes. Square keeps ringing the sales. CostCook knows the recipes and today's ingredient prices. Put the two together and Monday's question has an answer.

The kitchen in this guide is Harbor & Hearth Catering. It books weddings and office lunches, and on Saturdays it runs a market stall with a Square register. The numbers are illustrative.

## Who this is for, and who can skip it

It's for food you sell at a register as well as at events: a café counter, a market stall, a meal-prep pickup window. The app says it straight on the Square page: "If you only book catering events, you can skip this integration."

A catering event already has its own price, its own invoice and its own food cost in CostCook. The register is for everything else.

## Step 1: Connect Square

Open **Settings**, then **Integrations**, and find the Square card under **Sales & accounting**. Tap **Set up or manage Square**, then **Connect Square**. Square asks you to sign in and approve, and sends you back to CostCook.

<!-- capture needed: the Square settings page after connecting, live account, desktop -->

Only the workspace owner can connect or disconnect Square. Anyone else sees "Ask a workspace owner in Team & access to connect Square."

Connecting doesn't change anything at the register. The page says so: "Connecting is not publishing." Nothing goes to Square until you choose dishes and publish them.

## Step 2: Choose the dishes to publish

Publishing sends a dish to the register so it can be rung up. Pick the dishes you sell at the counter. Each one needs a selling price, and a draft can't be published.

Then pick the Square locations where it should appear, and for each dish decide where it lands:

- **A new Square item**, if the register doesn't have it yet.
- **An item already in Square**, if the bowl is already on the register under some other name. CostCook links the dish to that exact item, so the sales line up later. One Square item can link to only one dish.

## Step 3: Review, then publish

The review shows exactly what will reach the register: the name, the description, the price and the locations, and whether each one creates a new item or updates the one you picked. Read it once, then publish.

<!-- capture needed: the publication review with three dishes, live account -->

What goes to Square is that list and nothing else. "Ingredients, allergens and stock quantities stay in CostCook." Your recipe for the short rib, its yield and its allergens never leave.

If one dish is refused, the rest of the menu still goes. CostCook sends the dishes again one at a time, so one bad dish can't hold the others back.

## Step 4: When somebody changes a price at the register

It happens. Somebody bumps the focaccia to $4.50 on the register on a busy Saturday. The next time you publish, CostCook doesn't overwrite it. It stops and says "Some Square items changed," and shows you both prices so you can decide which one stands.

<!-- capture needed: the "Some Square items changed" conflict, both prices shown -->

On a dish linked to Square, CostCook tells you where it stands: **In sync with Square**, **Not published yet**, or **Changed in Square**. That reading comes from what CostCook last saw, not a fresh call to Square, so it shows when it last checked.

## Step 5: The sales come back

Once dishes are published, completed sales and refunds from the register come into CostCook. They arrive as Square sends them, and an hourly check looks back over the last two days for anything that was missed.

A sale is never turned into a catering order or a purchase. It's a record of what sold, kept apart from your events.

A refund doesn't rewrite the sale. It's counted against it, so a sale refunded in part shows what you actually kept.

If the register rings something that isn't linked to a dish, like the iced tea nobody set up, the page tells you how many sale lines need a dish match. Match the iced tea once and future sales of it use the same match. CostCook never guesses a match from a similar name.

## Step 6: Read Counter sales

Open **Analytics**, then **Counter sales**. The page's own line is the whole job: "What sold at the register, what it cost to make at today's prices, and how much to cook to do it again."

<!-- capture needed: Counter sales for the Saturday, desktop and phone -->

Here's Harbor & Hearth's Saturday, worked through:

| Dish | Sold | Price | Food cost each | Food cost |
|---|---|---|---|---|
| Herb roast chicken bowl | 42 | $14.00 | $3.18 | $133.56 |
| Lemon focaccia slice | 65 | $4.00 | $0.41 | $26.65 |
| Braised short rib plate | 18 | $24.00 | $7.28 | $131.04 |
| Iced tea | 30 | $3.50 | No dish match | Not counted |

The three matched dishes took in $588 + $260 + $432 = $1,280. They cost $133.56 + $26.65 + $131.04 = $291.25 to make at today's prices. So $291.25 ÷ $1,280 ≈ 22.8% food cost, and the iced tea stays out of the number until it's matched, rather than being counted as free.

That "at today's prices" matters. The cost comes from your current recipes and current ingredient prices. If chicken goes up on Tuesday, Saturday's bowls are costed at Tuesday's chicken from then on. It tells you what selling the same food costs you now. It isn't an accounting of what you paid back then.

## Step 7: Cook it again

The same page scales a prep preview from what sold. If next Saturday should look like this one, it tells you how much chicken, dough and short rib that is, from the recipes you already keep. It's a preview to plan from. Nothing is ordered or taken off the shelf for you.

## When a price moves

When an ingredient price pushes a counter dish over its food-cost target, the price review shows the dish, its price and a suggested price. You can charge the suggestion, type your own, or keep the price you have. CostCook records which you chose, including keeping it.

Choosing a price never writes to Square by itself. It opens the publication review from Step 3 with the dish already picked, and the register changes only when you publish.

## What it doesn't do

- **It doesn't take stock off your shelf.** Your counts stay yours.
- **It doesn't turn sales into orders.** The register's sales sit beside your events, not inside them.
- **It isn't a payout or profit report.** It doesn't know Square's fees or what landed in your bank. For that, Square's own reports are the place.
- **It doesn't send recipes or allergens to Square.** Only the name, description, price and locations.

## If you stop using it

**Disconnect Square** asks once: "Disconnect this Square account?" New updates stop. Existing Square items and CostCook sales remain. The register keeps its items, and CostCook keeps the sales it already has.

If Square's sign-in lapses, the page says "Reconnect to resume updates." Your sales are safe in Square either way. Reconnect soon, so CostCook's copy doesn't fall behind.

## Monday, after the market

- The dishes on the register are the ones you chose, at the prices you reviewed.
- Saturday's sales are in CostCook with what each dish cost to make at today's prices.
- The iced tea is matched, so next week it counts.
- You know how much to cook for next Saturday, and the register was never asked to know a recipe.
