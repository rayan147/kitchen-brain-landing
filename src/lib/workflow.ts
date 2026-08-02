/**
 * The workflow, as one chain, in the order it actually happens.
 *
 * WHY THIS IS ONE LIST AND NOT THREE SECTIONS
 * The page used to tell this story three times: a five-item "what it does", a
 * five-screenshot gallery that stopped at plate cost, and a nine-stage prose
 * chain with a second gallery bolted underneath. Three tellings, three
 * different orders, and the screenshots split down the middle. So the one thing
 * the product is, a loop where nothing is typed twice, was the one thing the
 * page could not be read to say.
 *
 * Steps are data, not markup, because the ORDER is the argument: a step that
 * has to move moves as one thing, and a step that cannot be placed in the chain
 * does not belong on the page at all.
 *
 * WHAT WAS MISSING IN FRONT, AND WHY IT MATTERED MOST
 * An earlier cut opened on an import screen and then jumped straight to a plate
 * cost reading "42.2%, critical, 12.2 points over target". Two things were
 * never shown, and both sat before the first screen the reader saw:
 *
 *   1. Where the target comes from. It is one global number you set once
 *      (step 3). Without it, every "over target" flag downstream is the
 *      software asserting a judgement out of nowhere.
 *   2. How an order comes to exist. It is a menu plus a head count plus a
 *      price (step 6). The chain reached an order without anyone making one.
 *
 * So the front of the chain is now: set the target, cost a plate against it,
 * cost a menu, build an order from that menu and a head count, then price it
 * and watch it tell you the price is wrong. That last pair is the sale.
 *
 * IT IS A CIRCLE, AND THE LAST STEP SAYS SO
 * The final step does not end the list, it returns to step 1, because the
 * purchase a receiving tick writes IS the new price the next quote is costed
 * from. An earlier version stopped at the month and read as a row of features
 * that happened to be numbered.
 *
 * TWO ORDERS, ONE CHAIN, STATED ONCE (see the PO step)
 * The Rodriguez wedding is two weeks out and has not been ordered yet; the
 * Fairview lunch was Tuesday and is already received. So the second half is
 * Fairview's. That is not a seam, it is the argument. The loop closes across
 * jobs rather than inside one: what was paid receiving Tuesday's lunch is the
 * current price on Saturday's wedding quote.
 *
 * NO DASHES IN THE COPY. Em dashes were doing the work of commas, colons and
 * full stops throughout, and at this density they read as one voice with one
 * rhythm. Alt text that used to quote a UI string containing a dash now
 * describes the string instead of reproducing it, so nothing is misquoted.
 *
 * EVERY FIGURE IS READ OFF THE IMAGE IT SITS BESIDE. If the two ever disagree,
 * the screenshot wins and the text changes.
 */

/**
 * A screen.
 *
 * `wide` means the desktop crop is a table too wide to sit beside its own text,
 * so it stacks under the copy and takes the full container instead. The cutoff
 * is roughly 900px at 1:1: below that a crop reads fine in a side column, above
 * it the money columns shrink to about a quarter scale and the screenshot stops
 * being evidence. It is a property of the CROP, not of whether a phone version
 * exists; most wide shots have one.
 *
 * `mobile` is a real phone capture, which most steps have. Two do not. The
 * sent-orders and receiving tables are wider than a 390px viewport and the app
 * clips their right-hand columns, so a phone capture shows "Mon, Aug 3, 2" and
 * "Received 1 on Sa" with the rest gone. A screenshot of clipped text is not
 * proof of anything, so those ship as the desktop crop in a scroll container
 * and the reader swipes. That is a real bug in the app's phone layout and it
 * should be fixed there rather than cropped around here.
 */
export interface Shot {
	src: string;
	w: number;
	h: number;
	alt: string;
	mobile?: string;
	mw?: number;
	mh?: number;
	altMobile?: string;
	wide?: boolean;
}

export interface Step {
	tag: string;
	title: string;
	body: string;
	shot?: Shot;
	/** A second desktop-only screen for the same claim. */
	also?: Shot;
	/** Renders the return arrow to step 1. Exactly one step sets this. */
	closes?: boolean;
}

const PHONE = { mw: 780, mh: 1688 };

export const STEPS: Step[] = [
	{
		tag: 'PRICE IN',
		title: 'Photograph the price board',
		body: 'Or the order guide, or the vendor price sheet your rep emails. A photo is a source like any other here, and the same queue takes a PDF, a spreadsheet, or text you paste. Invoices are the one exception: those want a PDF, and I key the awkward ones by hand rather than pretend otherwise.',
		shot: {
			src: '/proof/loop-price-in.png',
			w: 720,
			h: 548,
			mobile: '/proof/loop-price-in-mobile.png',
			...PHONE,
			alt: 'An import screen. A drop zone reads “Drop files here”, listing PDF, photo, CSV, or DOCX, with a Choose files button and a “Paste text instead” link. Below it, a note offers to map a spreadsheet’s columns for recipes or for supplier prices.',
			altMobile:
				'The same import screen on a phone: a drop zone reading “Drop files here”, listing PDF, photo, CSV, or DOCX, a Choose files button, a “Paste text instead” link, and a note offering to map a spreadsheet’s columns for recipes or for supplier prices.'
		}
	},
	{
		tag: 'THE DIFFS',
		title: 'You tap what changed, not the whole sheet',
		// No screenshot, deliberately. Capturing this needs a staged import batch
		// and the walkthrough seed creates none, so the choice was an honest gap
		// or a mocked screen. A page whose argument is "the number never lies"
		// does not get to fake the screen where the numbers change.
		body: 'It comes back as a list of differences, was $42.10 and now $44.80, and you apply the ones that are right. Nothing is written until you say so, and every recipe using those ingredients re-costs itself the moment you do. This is the step no spreadsheet has, and it is why the sheet is still true in June.'
	},
	{
		tag: 'THE TARGET',
		title: 'Set what you are aiming at, once',
		body: 'Your target food cost is one number, set in one place, and every menu and order on the books is measured against it from then on. The miscellaneous allowance lives beside it: the salt, oil and garnish nobody lines out, added as a percentage instead of being quietly ignored. Change either one and everything downstream re-reads it.',
		shot: {
			src: '/proof/setup-target.png',
			w: 1400,
			h: 1044,
			mobile: '/proof/setup-target-mobile.png',
			...PHONE,
			alt: 'A costing settings screen. Target food cost is set to 30 percent, with a stepper and a slider, described as the percentage above which menus and orders are flagged, and a note that individual dish targets continue to override the setting. Below it, miscellaneous cost is set to 8 percent, described as adding a percentage for salt, oil, garnish and other unlisted costs, with the example that at 4 percent a $10.00 dish cost becomes $10.40.',
			altMobile:
				'The same costing settings on a phone: target food cost 30 percent, flagged above that, with individual dish targets still overriding it; miscellaneous cost 8 percent for salt, oil, garnish and other unlisted costs.'
		}
	},
	{
		tag: 'THE PLATE',
		title: 'A recipe costs itself against that target',
		body: 'The plate cost is not one mystery number. It is the ingredient lines, the miscellaneous allowance, and what those add up to beside the price you charge. Now that the target exists, the dish has something to fail against, and when it does it says so in red rather than leaving you to notice next year.',
		shot: {
			src: '/proof/cost.png',
			w: 744,
			h: 600,
			mobile: '/proof/cost-mobile.png',
			mw: 756,
			mh: 600,
			alt: 'A live plate cost panel for the Greek Salad. Ingredient lines are $1.60, miscellaneous at 8 percent adds $0.13, and the plate cost is $1.73. It sells for $4.10 against a 30 percent food-cost target, and the result reads 42.2 percent food cost, marked critical and 12.2 percentage points over target.',
			altMobile:
				'The same live plate cost panel on a phone: ingredient lines $1.60, miscellaneous at 8 percent $0.13, plate cost $1.73, sells for $4.10 against a 30 percent target, reading 42.2 percent food cost, critical, 12.2 percentage points over target.'
		}
	},
	{
		tag: 'THE MENU',
		title: 'A menu is its dishes, so it costs itself too',
		body: 'Set the portions each guest gets and the cost per guest falls out, against the same target, with the price you would have to charge to hit it spelled out. This is the number you want before you say yes on the phone, not after.',
		shot: {
			src: '/proof/menu.png',
			w: 744,
			h: 956,
			mobile: '/proof/menu-mobile.png',
			...PHONE,
			alt: 'A cost-per-guest panel on a menu. Dish cost is $6.44, miscellaneous cost at 8 percent adds $0.52, and the total cost per guest is $6.96. The selling price is $16.50 per guest, which reads 42.2 percent food cost, marked critical and 12.2 percentage points over target, with a note that meeting the 30 percent target means charging at least $23.20 per guest.',
			altMobile:
				'The same cost-per-guest panel on a phone: dish cost $6.44, miscellaneous at 8 percent $0.52, total cost per guest $6.96, selling price $16.50, reading 42.2 percent food cost, critical, 12.2 percentage points over target, and charge at least $23.20 to meet the 30 percent target. Below it the dish list begins with Greek Salad at $1.60 a portion, 25 percent of the menu cost.'
		}
	},
	{
		tag: 'THE ORDER',
		title: 'A menu and a head count is an order',
		body: 'Pick the menu, put in the guest count, name the job. The menus carry their own cost and price on the tile, so you are choosing with the numbers in front of you rather than remembering them. Picking one fills in its current per-person price, and you can type over it.',
		shot: {
			src: '/proof/setup-order.png',
			w: 1728,
			h: 1198,
			wide: true,
			mobile: '/proof/setup-order-mobile.png',
			...PHONE,
			alt: 'A new order form. Event information asks for a client or event name, an event date, and a guest count. A menu section, noting that selecting a menu fills in its current per-person price, offers two tiles: Mediterranean Mezze at $4.36 cost and $11.75 price, selected, and Summer BBQ at $6.96 cost and $16.50 price. A pricing section shows price per guest at $11.75 and a panel headed “Enter the guest count”, explaining that entering guests compares this price with your food-cost target.',
			altMobile:
				'The same new order form on a phone: client or event name, event date and guest count, then two menu tiles carrying their own cost and price, then a price per guest field and a note that entering the guest count compares that price with your food-cost target.'
		}
	},
	{
		tag: 'THE PRICE',
		title: 'Price it wrong and it says so, before you quote',
		body: 'This is the whole point of the three steps above. Two hundred guests at $16.50 is $3,300 coming in against $1,354.04 of food, which is 41 percent when you set 30. It does not stop at flagging it: it names the price that would have worked, $22.57 a head. A busy season that made no money was decided months earlier by somebody saying a number that sounded about right.',
		shot: {
			src: '/proof/money.png',
			w: 2528,
			h: 430,
			wide: true,
			mobile: '/proof/money-mobile.png',
			...PHONE,
			alt: 'An order financial summary. Order inputs show 200 guests at $16.50 per guest. Revenue is $3,300.00, likely food cost is $1,354.04, and cost per guest is $6.77. Target status reads 41 percent food cost, marked critical, 11 percentage points over target, with advice to charge at least $22.57 per guest to meet the target.',
			altMobile:
				'The Rodriguez backyard wedding on a phone: Summer BBQ, 200 guests, Saturday 15 August, confirmed with quantities and prices frozen. A panel reads quoted on 2026-08-01 at $6.77 per guest and 41 percent food cost; today at current prices $6.96 per guest and 42.2 percent, a 2.8 percent rise and 1.2 percentage points higher. Tabs for Shop, Prep and Pack sit below, then the shopping list beginning with Downtown Bakery at $83.60. A fixed bar reads 16 items left and $1,532.00.'
		}
	},
	{
		tag: 'THE PANS',
		title: 'Recipes and prep scale, batches round to whole pots',
		body: 'The prep sheet comes out at the real portion count, with the instructions frozen at confirmation so a recipe someone edits on Thursday cannot change what Saturday cooks. Sub-recipes come out in whole batches, because nobody makes five and three quarters of anything.',
		shot: {
			src: '/proof/prep.png',
			w: 2304,
			h: 764,
			wide: true,
			mobile: '/proof/prep-mobile.png',
			...PHONE,
			alt: 'A prep sheet section for Warm Pita at 200 portions. Recipe instructions are marked frozen at confirmation. Rows list pita at 200 each and olive oil at 800 millilitres, each with a tick box and no additional prep noted. A shelf-life row offers an FDA Food Code suggestion of 7 days and a button to print a label.',
			altMobile:
				'A prep sheet on a phone. Grilled Chicken Skewers at 200 portions, instructions frozen at confirmation. Boneless chicken thigh, 36 kilograms, trimmed into 1 inch cubes, and bell pepper, 100 each, are both ticked off and struck through. Red onion at 8 kilograms and Lemon-Garlic Marinade at 9 litres are still open. A shelf-life row offers an FDA Food Code suggestion of 7 days and a Label button. The Greek Salad section, also 200 portions, begins underneath.'
		},
		// Desktop only: the order page switches to kitchen mode on a phone and
		// drops this panel entirely, so there is no phone screen to show. The
		// prep shot above carries the same step on a phone.
		also: {
			src: '/proof/loop-batches.png',
			w: 736,
			h: 516,
			alt: 'A sub-recipe batches panel. Lemon-Garlic Marinade, 2 litres per batch, with an on-hand stepper measured in millilitres and a note reading “make 5 of 5”.'
		}
	},
	{
		tag: 'SHOP',
		title: 'One list, by vendor, in whole cases',
		body: 'Grouped by who you buy it from, quantities rounded up to packs you can actually order, with a subtotal per vendor. There is an on-hand column beside every line: you look in the walk-in, type what is there, and the buy quantity drops to match.',
		shot: {
			src: '/proof/shop.png',
			w: 1808,
			h: 1040,
			wide: true,
			mobile: '/proof/shop-mobile.png',
			...PHONE,
			alt: 'A shopping list grouped by vendor. Restaurant Depot totals $354.30, with rows for basmati rice needing 17 kilograms and buying 2 twenty-five-pound bags at $77.80, black pepper 40 grams buying 1 one-pound container at $19.25, cumin 200 grams at $12.35, olive oil 15.3 litres buying 6 three-litre tins at $207.90, oregano 290 grams buying 3 five-ounce containers at $22.35, paprika 300 grams at $10.80, and salt 950 grams with 2 pounds already on hand, buying 1 three-pound box at $3.85.',
			altMobile:
				'The same Restaurant Depot group on a phone, totalling $354.30, one ingredient per row: basmati rice, 17 kilograms, buy 2 twenty-five-pound bags, $77.80; black pepper, 40 grams, 1 one-pound container, $19.25; cumin, 200 grams, $12.35; olive oil, 15.3 litres, 6 three-litre tins, $207.90; oregano, 290 grams, 3 five-ounce containers. Each row carries a tick box and an on-hand stepper.'
		}
	},
	{
		tag: 'PO OUT',
		title: 'A purchase order per supplier, emailed',
		body: 'One order per vendor with a needed-by date, sent from you so replies land in your inbox. What went out is frozen at the moment it goes: a record of the order you actually placed, not of the list you happened to have that morning. From here on these screens are a different job, a 45-guest lunch that was Tuesday, already through the part the wedding has not reached yet.',
		shot: {
			src: '/proof/loop-po.png',
			w: 2656,
			h: 526,
			wide: true,
			alt: 'A sent orders table. Green Valley Produce, sent Saturday 1 August 2026, needed by Monday 3 August, 6 of 7 received, with a Receive link. Downtown Bakery, the same dates, marked All received, with a View link.'
		}
	},
	{
		tag: 'RECEIVING',
		title: 'The truck arrives, and the order you sent is the checklist',
		body: 'Short, substituted, or all there. You tick it off against what you asked for, and there is no ordered-versus-received reconciling to do afterwards, because the ticking is what records the purchase. Buying and bookkeeping are one job.',
		shot: {
			src: '/proof/loop-receiving.png',
			w: 2656,
			h: 920,
			wide: true,
			alt: 'A receiving sheet with columns for ingredient, ordered, received packs, and total paid. Bell pepper, cucumber, dill, garlic, lemon and red onion each read “Received 1 on Sat, Aug 1, 2026”. Roma tomato, ordered as 1 case of 25 pounds, is still open with a quantity of 1 entered, an empty paid field, and a hint reading “now $31.40 per pack”.'
		}
	},
	{
		tag: 'THE PURCHASE',
		title: 'Ticking it off writes the purchase',
		body: 'It lands in the ledger naming where it came from: a receiving tick, an imported invoice, a manual line. Nothing is re-keyed from a piece of paper you already have, which is the only reason a small kitchen ever keeps this up.',
		shot: {
			src: '/proof/loop-ledger.png',
			w: 2656,
			h: 440,
			wide: true,
			mobile: '/proof/loop-ledger-mobile.png',
			...PHONE,
			alt: 'A purchases ledger. Saturday 1 August: multiple suppliers, tagged Received, described as receiving for order number 2, 14 items, $421.15. Tuesday 28 July: Green Valley Produce, tagged Invoice import, Invoice GV-4471, 3 items, $86.65.',
			altMobile:
				'The same purchases ledger on a phone. Saturday 1 August: multiple suppliers, tagged Received, receiving for order number 2, 14 items, $421.15. Tuesday 28 July: Green Valley Produce, tagged Invoice import, Invoice GV-4471, 3 items, $86.65. A note reads that every entry names its source, an order log, invoice import, receiving checklist, or manual entry, and that every price delta is what moved the ingredient’s current cost.'
		}
	},
	{
		tag: 'ON HAND',
		title: 'Which moves the shelf and the price',
		body: 'What you received is stock you have, valued. It is a computed figure and it says so: it will tell you plainly how many items have never had a physical count rather than passing arithmetic off as a fact, and a count you take overrules it without ever being overwritten.',
		shot: {
			src: '/proof/loop-onhand.png',
			w: 2656,
			h: 238,
			wide: true,
			mobile: '/proof/loop-onhand-mobile.png',
			...PHONE,
			alt: 'An inventory summary. On the shelf, $507.80. To restock, $0.00. Inventory status: 0 to order, 0 below par, 20 need a count. A note explains that need reflects uncompleted confirmed orders from 27 July to 2 August, and that a count older than 2 days no longer reduces a purchase.',
			altMobile:
				'The same inventory summary on a phone: on the shelf $507.80, to restock $0.00, and an inventory status reading 0 to order, 0 below par, 20 need a count.'
		}
	},
	{
		tag: 'THE MONTH',
		title: 'What it should have cost, next to what you spent',
		body: 'At the head of the purchases ledger. The difference sits there honestly instead of being called waste, because some of it is still on your shelf. And the price you paid on that truck is now the current price, which is where this started.',
		closes: true,
		shot: {
			src: '/proof/loop-month.png',
			w: 2656,
			h: 816,
			wide: true,
			mobile: '/proof/loop-month-mobile.png',
			...PHONE,
			alt: 'A food cost panel for August 2026. Usage cost to date is $1,447.70, described as what the month’s confirmed events should have cost, 37.8 percent of revenue. Actual spend is $421.15, what the month’s invoices came to, 11 percent of revenue. An unaccounted gap of $1,026.55 is explained as less spent than the month cooked, because it drew down food already on the shelf. A Log waste button sits beside it, and a note warns it is still early in the month.',
			altMobile:
				'The same food cost panel on a phone. August 2026. Usage cost to date $1,447.70, what the month’s confirmed events should have cost, 37.8 percent of revenue. Actual spend $421.15, what the month’s invoices came to, 11 percent of revenue. An unaccounted gap of $1,026.55, explained as less spent than the month cooked because it drew down food already on the shelf, with a Log waste button. A note warns it is still early in the month.'
		}
	}
];

/**
 * Everything real and shipped that is not a link in the chain. Kept to one line
 * each and deliberately not fourteen more cards: the chain above is already the
 * longest thing on the page, and the failure mode here is length, not coverage.
 *
 * Verified on develop 2026-08-01: inventory/commands.ts (append-only counts),
 * purchases/waste.ts, purchase_corrections (revision + deltas, original intact),
 * orders/equipment.ts, labels/print/[id] + LabelPreview.svelte,
 * service-worker.ts + offline.ts (CACHE_STAMP_META) + OrderViewHeader.svelte,
 * tenancy/membership.ts ('OWNER' | 'MANAGER' | 'STAFF'),
 * orders/quoted-price-comparison.ts, purchases/event-attribution.ts,
 * routes/demo/+server.ts.
 */
export const ALSO_IN_THERE: string[] = [
	'Waste you log, so the gap gets a name instead of being written off',
	'Purchase corrections that keep the original row intact and record the delta',
	'The pack list, with the chafers on it and not just the food',
	'Shelf-life labels, with a print simulator so you find out before the roll',
	// Not in quotes, and not "cached at 4:52am": the real string is
	// "Offline. Showing this page as loaded 4:52 AM. Reconnect to refresh."
	// Quoting copy the app does not say is the same class of mistake as a
	// caption disagreeing with its screenshot.
	'The three lists in the walk-in with no signal, each telling you what time it loaded',
	'More than one kitchen, with owner, manager and staff roles',
	'What an event actually drew, attributed to the event and not guessed',
	'A sample kitchen you can open in one tap, with a real order already in it'
];
