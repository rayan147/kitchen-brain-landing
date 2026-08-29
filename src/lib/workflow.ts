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
 *
 * EVERY PHONE SHOT IS A CROP, AND `mw`/`mh` ARE READ OFF THE FILE
 * They used to be whole 390x844 screens, spread from one shared constant. Twelve
 * of them meant twelve copies of the app's own header, each the boldest thing in
 * its frame, sitting above the figure the caption points at; edges that landed
 * mid-word because the scroll stopped there; and twelve identically-shaped grey
 * slabs regardless of content. They are now cropped to the panel exactly as the
 * desktop shots always were, so no two are the same shape and the declared size
 * has to come from the file. Do not reintroduce a shared size constant: the
 * width and height attributes reserve the space before the image loads, and one
 * wrong pair is a squashed screenshot with nothing to catch it.
 */
export interface Step {
	tag: string;
	title: string;
	body: string;
	/** Renders the return arrow to step 1. Exactly one step sets this. */
	closes?: boolean;
}

export const STEPS: Step[] = [
	{
		tag: 'PRICE IN',
		title: 'Photograph the price board',
		body: 'Or the order guide, or the vendor price sheet your rep emails. A photo is a source like any other here, and the same queue takes a PDF, a spreadsheet, or text you paste. Invoices are the one exception: those want a PDF, and I key the awkward ones by hand rather than pretend otherwise.',
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
	},
	{
		tag: 'THE PLATE',
		title: 'A recipe costs itself against that target',
		body: 'The plate cost is not one mystery number. It is the ingredient lines, the miscellaneous allowance, and what those add up to beside the price you charge. Now that the target exists, the dish has something to fail against, and when it does it says so in red rather than leaving you to notice next year.',
	},
	{
		tag: 'THE MENU',
		title: 'A menu is its dishes, so it costs itself too',
		body: 'Set the portions each guest gets and the cost per guest falls out, against the same target, with the price you would have to charge to hit it spelled out. This is the number you want before you say yes on the phone, not after.',
	},
	{
		tag: 'THE ORDER',
		title: 'A menu and a head count is an order',
		body: 'Pick the menu, put in the guest count, name the job. The menus carry their own cost and price on the tile, so you are choosing with the numbers in front of you rather than remembering them. Picking one fills in its current per-person price, and you can type over it.',
	},
	{
		tag: 'THE PRICE',
		title: 'Price it wrong and it says so, before you quote',
		body: 'This is the whole point of the three steps above. Two hundred guests at $16.50 is $3,300 coming in against $1,354.04 of food, which is 41 percent when you set 30. It does not stop at flagging it: it names the price that would have worked, $22.57 a head. A busy season that made no money was decided months earlier by somebody saying a number that sounded about right.',
	},
	{
		tag: 'THE PANS',
		title: 'Recipes and prep scale, batches round to whole pots',
		body: 'The prep sheet comes out at the real portion count, with the instructions frozen at confirmation so a recipe someone edits on Thursday cannot change what Saturday cooks. Sub-recipes come out in whole batches, because nobody makes five and three quarters of anything.',
		// Desktop only: the order page switches to kitchen mode on a phone and
		// drops this panel entirely, so there is no phone screen to show. The
		// prep shot above carries the same step on a phone.
	},
	{
		tag: 'SHOP',
		title: 'One list, by vendor, in whole cases',
		body: 'Grouped by who you buy it from, quantities rounded up to packs you can actually order, with a subtotal per vendor. There is an on-hand column beside every line: you look in the walk-in, type what is there, and the buy quantity drops to match.',
	},
	{
		tag: 'PO OUT',
		title: 'A purchase order per supplier, emailed',
		body: 'One order per vendor with a needed-by date, sent from you so replies land in your inbox. What went out is frozen at the moment it goes: a record of the order you actually placed, not of the list you happened to have that morning. From here on these screens are a different job, a 45-guest lunch that was Tuesday, already through the part the wedding has not reached yet.',
	},
	{
		tag: 'RECEIVING',
		title: 'The truck arrives, and the order you sent is the checklist',
		body: 'Short, substituted, or all there. You tick it off against what you asked for, and there is no ordered-versus-received reconciling to do afterwards, because the ticking is what records the purchase. Buying and bookkeeping are one job.',
	},
	{
		tag: 'THE PURCHASE',
		title: 'Ticking it off writes the purchase',
		body: 'It lands in the ledger naming where it came from: a receiving tick, an imported invoice, a manual line. Nothing is re-keyed from a piece of paper you already have, which is the only reason a small kitchen ever keeps this up.',
	},
	{
		tag: 'ON HAND',
		title: 'Which moves the shelf and the price',
		body: 'What you received is stock you have, valued. It is a computed figure and it says so: it will tell you plainly how many items have never had a physical count rather than passing arithmetic off as a fact, and a count you take overrules it without ever being overwritten.',
	},
	{
		tag: 'THE MONTH',
		title: 'What it should have cost, next to what you spent',
		body: 'At the head of the purchases ledger. The difference sits there honestly instead of being called waste, because some of it is still on your shelf. And the price you paid on that truck is now the current price, which is where this started.',
		closes: true,
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
