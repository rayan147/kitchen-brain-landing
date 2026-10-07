/**
 * The homepage's frames and the words beside them, in one place.
 * Story: docs/stories/homepage-redesign-2026-10.story.md
 * Layout rules: docs/superpowers/specs/2026-10-06-homepage-redesign-layout.md
 *
 * Every image is a real app frame; where it came from and what it shows is in
 * docs/proof/home-manifest.json. width and height are the PNG's pixels halved
 * (captured at 2x), so the browser reserves the right box before it loads.
 * Every figure in a sentence here is read off one of these frames.
 *
 * Considered Strategy; not used because the sections differ in data, not in
 * behavior: each one renders the same eyebrow, heading, sentence and frame.
 */

import { eventPayments } from './event-payments';
import { acceptanceBoundary, agreementLine } from './events';

export type Shot = {
	src: string;
	alt: string;
	width: number;
	height: number;
	/** A phone frame renders narrower than a desktop one. */
	phone?: boolean;
	/** The same screen in the app's phone layout, served below 48rem (HomeFrame). */
	small?: { src: string; width: number; height: number };
};

/**
 * Where a carried figure sits in its frame, in percent of the PNG, measured
 * from the pixels. The rail draws an amber ring there over the real image; the
 * PNG itself is never edited.
 */
export type Focus = { x: number; y: number; w: number; h: number };

const shot = (name: string, alt: string, px: [number, number], phone = false): Shot => ({
	src: `/proof/home/${name}.png`,
	alt,
	width: Math.round(px[0] / 2),
	height: Math.round(px[1] / 2),
	phone
});

/** Adds the phone capture `<name>-phone.png` (2x, 390 viewport) to a shot. */
const withPhone = (base: Shot, px: [number, number]): Shot => ({
	...base,
	small: {
		src: base.src.replace(/\.png$/, '-phone.png'),
		width: Math.round(px[0] / 2),
		height: Math.round(px[1] / 2)
	}
});

export const heroShot = shot(
	'hero-pricing',
	'Price per guest on the menu: sells for $95.00, food cost $26.18, 27.6% against a 30% target, within target with 2.4 points to spare, food margin $68.82 a guest.',
	[732, 842]
);

/**
 * The event walk, drawn as the workflow rail
 * (docs/superpowers/specs/2026-10-06-workflow-rail.md): every stage in the
 * app's order, and between two stages what carries forward. A carry line
 * only names what both neighbouring frames show (a name, a count, an amount
 * that adds up); the rings mark each stage's own figure. The
 * frames come from two copies of the app (manifest), so dates are never
 * carried.
 */
export const eventStages = [
	{
		id: 'inquiry',
		carries: 'Priya Nair · 150 guests',
		focus: [
			{ x: 3.5, y: 3, w: 93, h: 7.5 },
			{ x: 3.5, y: 81.8, w: 93, h: 7.8 }
		] as Focus[],
		guide: { href: '/features/events-and-proposals', label: 'How events and proposals work' },
		tab: 'Inquiry',
		heading: 'The call goes in rough.',
		body: 'Only a client or event name is required. A date not decided yet and a guest count that is an estimate are fine.',
		shot: shot(
			'inquiry-mobile',
			'New inquiry on a phone: client Priya Nair, reached by phone call, Nair & Castellano wedding, date not decided yet, 150 guests marked as an estimate.',
			[780, 1560],
			true
		)
	},
	{
		id: 'proposal',
		carries: '$14,250.00 accepted, asked as $3,500.00 now and $10,750.00 later',
		focus: [{ x: 4, y: 26.6, w: 92, h: 17.3 }] as Focus[],
		guide: { href: '/features/events-and-proposals', label: 'How events and proposals work' },
		tab: 'Proposal',
		heading: 'She says yes on her phone.',
		body: 'The client opens the proposal with no login, sees every line you put on it (the food, and any staff, rentals or service fee), and taps Accept proposal or Ask for changes.',
		shot: shot(
			'proposal-mobile',
			'Client proposal on a phone from Harbor & Hearth Catering: Nair & Castellano wedding on December 19, 2026, $14,250.00 for 150 guests at $95.00 per guest, with Ask for changes and Accept proposal.',
			[780, 1560],
			true
		)
	},
	{
		id: 'deposit',
		// Not "booked": the next step says Confirm order is the booking
		// (chef review 2026-10-07 caught the two disagreeing).
		carries: 'The Nair & Castellano wedding, deposit paid',
		focus: [
			{ x: 2.2, y: 13.5, w: 23.2, h: 17.6 },
			{ x: 77, y: 63.7, w: 21.2, h: 10.1 }
		] as Focus[],
		// The same two figures on the phone capture (design review 2026-10-07:
		// the wide frame drew 6px labels at 390px). Measured from its pixels.
		smallFocus: [
			{ x: 2.4, y: 9.6, w: 95.2, h: 31 },
			{ x: 59.8, y: 69.3, w: 37.8, h: 9.1 }
		] as Focus[],
		guide: { href: '/features/events-and-proposals', label: 'How events and proposals work' },
		tab: 'Deposit',
		heading: 'Paid by card from a link.',
		// The signature lives here, not in the client's yes (RC-64: claimable,
		// not capturable, so it is a sentence without a frame).
		body: `${agreementLine} ${eventPayments.homepage}`,
		shot: withPhone(
			shot(
				'payment-schedule',
				'Deposit on the Nair & Castellano wedding: $3,500.00 asked for and $3,500.00 received, paid in full by card from an email link; balance $10,750.00 owed, due Wed, Dec 9, not requested yet, with Request payment.',
				[1378, 716]
			),
			[748, 794]
		)
	},
	{
		id: 'confirm',
		carries: 'The same menu, quantities and prices locked',
		focus: [{ x: 8.6, y: 32.7, w: 79, h: 20.8 }] as Focus[],
		guide: { href: '/features/events-and-proposals#booked', label: 'What booked means' },
		tab: 'Confirm order',
		heading: acceptanceBoundary,
		// When, as advice, not a rule the app enforces (third chef review: "am I
		// locked on a guess?").
		body: 'Confirm once the final count is in. Confirming locks quantities and prices for the event, and the shopping, prep and pack lists become checklists.',
		shot: shot(
			'confirm-dialog',
			'Confirm order dialog: confirming locks quantities and prices for Nair & Castellano wedding; shopping, prep and pack lists become checklists. Keep editing or Confirm.',
			[992, 476]
		)
	},
	{
		id: 'prep',
		guide: { href: '/features/order-shop-prep-pack', label: 'How orders, shop, prep and pack work' },
		tab: 'Shop / Prep',
		heading: 'The lists come from the same menu.',
		body: 'Buy in whole packs by supplier, then prep in order: sub-recipes first, scaled to the guest count, checked off on the phone.',
		// The shopping list, not the prep sheet (second chef review 2026-10-07):
		// the kitchen is set to US units and the Shop tab buys in them, while
		// the prep sheet prints each recipe in the units it was written in
		// (metric here, and celery counted by the head). The short rib carries a
		// 91% trim yield (third chef review: the need was the plate weight to the
		// gram, the shortage the yield row warns about), so 300 portions of
		// 210 g need 152.7 lb and the cases round up with some to spare.
		shot: shot(
			'shop-list',
			'Shopping list on a phone, Highland Meats, $2,155.59: beef short rib, boneless, need 152.7 lb, buy 10 cases of 7 kg, $2,122.40; beef bones, need 27.6 lb, 1 case of 15 kg, $33.19; neither counted on the shelf yet.',
			[780, 788],
			true
		)
	}
] as const;

/** The kitchen half: each row is eyebrow, heading, one sentence, one frame (rule 3). */
export const kitchenRows = [
	{
		id: 'costs',
		guide: { href: '/features/menus-and-quotes', label: 'How menus and quotes are priced' },
		eyebrow: 'Costs itself',
		pain: 'You quote $95 a head and find out if you made money when the month closes.',
		heading: 'Food cost, worked out before you quote.',
		body: 'Each dish shows its cost per guest and its share of the plate. A missing price is named, never counted as zero.',
		shot: withPhone(
			shot(
				'food-cost-breakdown',
				'Dishes per guest with each one’s share of cost: Braised Short Rib, two portions, $14.56; Wild Mushroom Polenta, about 240 g a portion, $2.93; Creamed Spinach, half a portion, $2.91; Focaccia and Whipped Goat Cheese $2.56.',
				[1880, 810]
			),
			[716, 1324]
		)
	},
	{
		id: 'yield',
		guide: { href: '/features/recipes-and-costing', label: 'How recipes are costed' },
		eyebrow: 'Orders the right amount',
		// No figure: the old weight was on no frame and, read against the
		// wedding's 300 portions, came to 2 oz a plate (chef review 2026-10-07).
		pain: 'The recipe says what goes on the plate. You buy exactly that and you are short at 5 a.m.',
		heading: 'Buy for what survives the knife.',
		body: 'Each line carries its trim yield, so the amount to buy covers what you lose to the knife.',
		shot: withPhone(
			shot(
				'yield-lines',
				'A recipe line with its yield and the amount to buy: Roma tomato, 60 g used at 91% yield, buy 66 g.',
				[1540, 890]
			),
			// Cropped to the tomato line: the cucumber's 0.3 each rounded to the
			// same 0.3 to buy, so the yield did nothing on screen (third chef review).
			[716, 512]
		)
	},
	{
		id: 'paperwork',
		guide: { href: '/features/invoices-and-price-list-import', label: 'How invoice and price-list import works' },
		eyebrow: 'Reads your paperwork',
		pain: 'You are not typing 400 ingredients into another system.',
		heading: 'Upload the invoice. Confirm what it read.',
		body: 'Invoices, price sheets, spreadsheets and Word files. Lines that match wait for your OK, the rest are flagged for review, and it learns your names.',
		shot: withPhone(
			shot(
				'import-review',
				'Import review of a sample produce invoice: 7 products, 2 flagged Needs review and listed first, 4 matched to ingredients, 1 ready to create.',
				[2236, 966]
			),
			[780, 1526]
		)
	},
	{
		id: 'labels',
		guide: { href: '/features/nutrition-facts-and-allergens', label: 'How allergens and nutrition work' },
		eyebrow: 'Writes the labels',
		pain: 'A bride asked for an allergen sheet. You wrote it by hand.',
		heading: 'Allergens from the recipe, on every dish.',
		body: 'Allergens roll up through sub-recipes to each dish on the pack list, and labels print from your browser.',
		shot: withPhone(
			shot(
				'allergens-labels',
				'Pack list for 150 guests: six dishes, each with its allergens (Contains: Milk; Milk, Wheat; no listed allergens) and a Label button.',
				[1360, 1272]
			),
			[780, 1892]
		)
	}
] as const;

export const frontOfHouse = [
	{
		id: 'ordering',
		heading: 'Online ordering',
		// "Confirm" is the event walk's word for booking, so this row says
		// "approve" and "pay" (third chef review 2026-10-07).
		body: 'Clients pick a set menu, like a $93 Coastal Dinner, a date and pickup or delivery on your own ordering page. You approve the request, and they pay by card.',
		shot: withPhone(
			shot(
				'ordering-site',
				'Your online ordering site: a 20 guest minimum, 72 hours notice, pickup or delivery, and the Coastal Dinner at $93.00 a guest.',
				[2432, 1630]
			),
			[780, 1810]
		)
	},
	{
		id: 'invoice-email',
		guide: { href: '/features/invoice-email', label: 'How invoice email works' },
		heading: 'Invoices by email',
		body: 'Suppliers send invoices to your kitchen’s private address. Each email shows what became of it, and nothing counts until you confirm it.',
		shot: withPhone(
			shot(
				'invoice-inbox',
				'Invoice inbox: a credit memo for returned flour, CM-3104, waiting in review, to come off your cost once confirmed; and invoices HF-3102 and HF-3103 from a new sender, waiting in review with a note to check the sender before confirming.',
				[1568, 770]
			),
			[760, 770]
		)
	}
] as const;

/** Under the kitchen band: the guides the bands above do not reach. */
export const moreGuides = [
	{ href: '/features/ingredients-and-supplier-prices', label: 'Ingredients and supplier prices' },
	{ href: '/features/purchasing-and-receiving', label: 'Purchasing and receiving' },
	{ href: '/features/inventory', label: 'Inventory' },
	{ href: '/features/purchases-and-month-cost', label: 'Purchases and month cost' },
	{ href: '/features/labels-and-printing', label: 'Labels and printing' },
	{ href: '/features/guest-restrictions-and-dietary-guards', label: 'Guest restrictions' },
	{ href: '/features/events-and-proposals#clients', label: 'Clients' },
	{ href: '/features/team-and-access', label: 'Team and access' }
] as const;

export const sageGuide = { href: '/features/sage', label: 'How Sage works' } as const;

export const sageShot = shot(
	'sage-answer',
	'Sage asked what is still owed on the Nair & Castellano wedding on December 19: a balance of $10,750.00, citing one record (balance due December 9, 2026; the $3,500.00 deposit already paid) with a link to the wedding.',
	// Cropped above the suggested-next-step card: its green button read as the
	// page's primary (design review 2026-10-07).
	[808, 676]
);
