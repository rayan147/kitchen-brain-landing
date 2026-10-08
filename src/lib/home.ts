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

/**
 * The promo film in the hero (owner, 2026-10-07), rendered on the promo-video
 * branch from frames captured on the hosted test app (develop d3c7c9add) on
 * 2026-10-07. Re-encoded for the web: H.264 with faststart and VP9, music
 * only, every word burned into the picture.
 *
 * The transcript is the film's own on-screen text in order: the chapter
 * questions, then the captions (video/out/promo.vtt, written from film.ts and
 * the frame manifest). Principle 4: it must match the footage, so a re-render
 * that changes a caption changes this list. The end card's price is burned in
 * from the film's manifest, not read from launchPlan; if the launch price
 * moves, the film is re-rendered.
 */
export const heroFilm = {
	webm: '/film/costcook-promo.webm',
	mp4: '/film/costcook-promo.mp4',
	poster: '/film/costcook-promo-poster.jpg',
	width: 1920,
	height: 1080,
	label: 'CostCook film, 1 minute 55 seconds: one sample wedding from inquiry to the day after',
	opening: 'Know what the job makes before you cook it.',
	chapters: [
		{
			question: null,
			lines: ['A client calls about a wedding. Write it down as it comes.', 'Date not decided, about 150 guests. Rough is fine.']
		},
		{
			question: 'What do I charge a head?',
			lines: ['$95.00 a guest. Food cost 29.2%.', 'Under your 30% target. You know it before you send.']
		},
		{
			question: 'Can the client say yes from a phone?',
			lines: [
				"The offer, on the client's phone: $14,250.00.",
				'Accept, or ask for changes. The client decides.',
				'Accepted, from the phone. Next, the agreement.'
			]
		},
		{
			question: 'Signed, and deposit paid?',
			lines: [
				'Deposit $3,500.00, paid by card from the link.',
				'The balance, $10,750.00, is due Wed, Dec 9.',
				'Signed on paper? Upload the copy. It stays with the event.',
				'A yes is not a booking. Signed and paid is.',
				'Booked.'
			]
		},
		{
			question: 'How much do I order so I’m not short?',
			lines: [
				"Whole packs, by supplier, for 150. What's left stays on the shelf.",
				'Confirm, and prices and quantities lock.',
				'Each supplier gets only its own lines.'
			]
		},
		{
			question: 'Did it all come off the truck?',
			lines: ['Check in the trucks. Anything short stays under Still to get.']
		},
		{
			question: 'What does the crew start on at 5 a.m.?',
			lines: ['Bases first, then every dish: 300 portions of short rib.']
		},
		{
			question: 'Is everything in the van?',
			lines: ['Every dish into the van, allergens on each label.']
		},
		{
			question: null,
			lines: ['The day after, at what you paid: 28% of the price, under your 30% target.']
		}
	],
	end: 'CostCook. $49/month, per kitchen. Try it free for 15 days. costcook.io'
} as const;

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
			{ x: 3.4, y: 4, w: 93.3, h: 6.4 },
			{ x: 3.4, y: 85.3, w: 93.3, h: 6.7 }
		] as Focus[],
		guide: { href: '/features/events-and-proposals', label: 'How events and proposals work' },
		tab: 'Inquiry',
		heading: 'The call goes in rough.',
		body: 'All it needs is a name, the client’s or the event’s. No date yet, and a head count that is still a guess? Put it in anyway.',
		shot: shot(
			'inquiry-mobile',
			'New inquiry on a phone: client Priya Nair, a new client, phone (207) 555-0187, reached by phone call, Nair & Castellano wedding, date not decided yet, 150 guests marked as an estimate.',
			[780, 1740],
			true
		)
	},
	{
		id: 'proposal',
		carries: '$14,250.00 accepted, asked as $3,500.00 now and $10,750.00 later',
		focus: [{ x: 3.1, y: 26.2, w: 93.8, h: 17.5 }] as Focus[],
		guide: { href: '/features/events-and-proposals', label: 'How events and proposals work' },
		tab: 'Proposal',
		heading: 'Yes or changes, from their phone.',
		body: 'No login. They open it and see every line you put on it: the food, plus any staff, rentals or service fee. Then they tap Accept proposal or Ask for changes.',
		shot: shot(
			'proposal-mobile',
			'Client proposal on a phone from Harbor & Hearth Catering: Nair & Castellano wedding on December 19, 2026, $14,250.00 for 150 guests at $95.00 per guest, with Ask for changes and Accept proposal.',
			[780, 1560],
			true
		)
	},
	{
		id: 'deposit',
		// Not "booked": booking waits on the signed agreement as well as the
		// deposit (Book the event, app 7a7e407d9).
		carries: 'The Nair & Castellano wedding, deposit paid',
		focus: [
			{ x: 1.6, y: 12, w: 23.5, h: 17.6 },
			{ x: 78.3, y: 66.4, w: 20, h: 9.3 }
		] as Focus[],
		// The same two figures on the phone capture (design review 2026-10-07:
		// the wide frame drew 6px labels at 390px). Measured from its pixels.
		smallFocus: [
			{ x: 1.1, y: 9, w: 97.9, h: 28.9 },
			{ x: 59.8, y: 71.4, w: 39.1, h: 8.5 }
		] as Focus[],
		guide: { href: '/features/events-and-proposals', label: 'How events and proposals work' },
		tab: 'Deposit',
		heading: 'The deposit comes in by card.',
		// The signature lives here, not in the client's yes (RC-64: claimable,
		// not capturable, so it is a sentence without a frame).
		body: `${agreementLine} ${eventPayments.homepage}`,
		shot: withPhone(
			shot(
				'payment-schedule',
				'Deposit on the Nair & Castellano wedding: $3,500.00 asked for and $3,500.00 received, paid in full by card from an email link; balance $10,750.00 owed, due Wed, Dec 9, not requested yet, with Request payment.',
				[1466, 772]
			),
			[748, 850]
		)
	},
	{
		id: 'confirm',
		carries: 'The same menu, quantities and prices locked',
		focus: [{ x: 8.1, y: 31.9, w: 83.9, h: 21.8 }] as Focus[],
		guide: { href: '/features/events-and-proposals#booked', label: 'What booked means' },
		tab: 'Confirm order',
		heading: acceptanceBoundary,
		// When, as advice, not a rule the app enforces (third chef review: "am I
		// locked on a guess?").
		body: 'Wait for the final count, then Confirm. That locks the quantities and prices, and your shopping, prep and pack lists turn into checklists.',
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
		heading: 'Then you shop and prep off the same menu.',
		body: 'You buy by supplier, in whole packs. Prep runs in order, bases before the dishes that use them, scaled to the head count, and you check it off on your phone.',
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
			[780, 800],
			true
		)
	}
] as const;

/** The kitchen half: each row is eyebrow, heading, one sentence, one frame (rule 3). */
export const kitchenRows = [
	{
		id: 'costs',
		guide: { href: '/features/menus-and-quotes', label: 'How menus and quotes are priced' },
		eyebrow: 'Food cost',
		pain: 'You quote $95 a head and find out if you made money when the month closes.',
		heading: 'See the food cost before you quote.',
		body: 'Every dish shows what it costs per guest and its share of the total. If a price is missing, it tells you which one. It never slips in as zero.',
		shot: withPhone(
			shot(
				'food-cost-breakdown',
				'Dishes per guest with each one’s share of cost: Braised Short Rib, two portions, $14.56; Wild Mushroom Polenta, about 240 g a portion, $2.93; Creamed Spinach, half a portion, $2.91; Focaccia and Whipped Goat Cheese $2.56.',
				[1880, 808]
			),
			[780, 1384]
		)
	},
	{
		id: 'yield',
		guide: { href: '/features/recipes-and-costing', label: 'How recipes are costed' },
		eyebrow: 'Trim and yield',
		// No figure: the old weight was on no frame and, read against the
		// wedding's 300 portions, came to 2 oz a plate (chef review 2026-10-07).
		pain: 'The recipe says what goes on the plate. You buy exactly that and you are short at 5 a.m.',
		heading: 'Buy for what survives the knife.',
		body: 'Each recipe line carries its trim yield. 60 g of Roma tomato in the recipe at 91% yield means you buy 66 g.',
		shot: withPhone(
			shot(
				'yield-lines',
				'A recipe line with its yield and the amount to buy: Roma tomato, 60 g used at 91% yield, buy 66 g.',
				[1540, 874]
			),
			// Cropped to the tomato line: the cucumber's 0.3 each rounded to the
			// same 0.3 to buy, so the yield did nothing on screen (third chef review).
			[724, 514]
		)
	},
	{
		id: 'paperwork',
		guide: { href: '/features/invoices-and-price-list-import', label: 'How invoice and price-list import works' },
		eyebrow: 'Invoices and price sheets',
		pain: 'You’re not typing 400 ingredients into one more system.',
		heading: 'Upload the invoice. Confirm what it read.',
		body: 'It takes invoices and price sheets, even a spreadsheet or a Word file. Lines it matched wait for your OK. The rest get flagged for you to look at. And it learns your names for things.',
		shot: withPhone(
			shot(
				'import-review',
				'Import review of a sample produce invoice: 7 products, 2 flagged Needs review and listed first, 4 matched to ingredients, 1 ready to create.',
				[2336, 968]
			),
			[780, 1536]
		)
	},
	{
		id: 'labels',
		guide: { href: '/features/nutrition-facts-and-allergens', label: 'How allergens and nutrition work' },
		eyebrow: 'Allergens and labels',
		pain: 'A bride asked for an allergen sheet. You wrote it by hand.',
		heading: 'The allergens come off the recipe.',
		body: 'An allergen in a base shows up on every dish that uses it, right on the pack list. Labels print from your browser.',
		shot: withPhone(
			shot(
				'allergens-labels',
				'Pack list for 150 guests: six dishes, each with its allergens (Contains: Milk; Contains: Milk, Wheat and May contain: Egg, Sesame, Soy; No listed allergens) and a Label button.',
				[1360, 1212]
			),
			[780, 1902]
		)
	}
] as const;

export const frontOfHouse = [
	{
		id: 'ordering',
		heading: 'Online ordering',
		// "Confirm" is the event walk's word for booking, so this row says
		// "approve" and "pay" (third chef review 2026-10-07).
		// The widget is Settings > Integrations > Ordering site > Put on your
		// website: one script tag, a sandboxed frame (develop 7a7e407d9). The
		// frame is that widget in a sample page for the sample kitchen.
		body: 'Use your own ordering page, or paste one snippet into the website you already have and the order form sits right on it. A client picks a set menu (say, a $93 Coastal Dinner), a date, and pickup or delivery. You approve the request. They pay by card.',
		shot: withPhone(
			shot(
				'ordering-site',
				'The ordering widget on a caterer’s own website: under the kitchen’s Order catering heading, CostCook’s order form for Harbor & Hearth Catering with a 20 guest minimum, 72 hours notice, pickup or delivery, the steps Menu to Review, and the Coastal Dinner at $93.00 a guest.',
				[2496, 2136]
			),
			[780, 2866]
		)
	},
	{
		id: 'invoice-email',
		guide: { href: '/features/invoice-email', label: 'How invoice email works' },
		heading: 'Invoices by email',
		body: 'Suppliers email invoices to your kitchen’s own private address. You can see what happened to each one, and none of it counts until you confirm it.',
		shot: withPhone(
			shot(
				'invoice-inbox',
				'Invoice inbox: invoices HF-3102 and HF-3103 held, not read, because the address they came from is not on your list, with Let this one through; and Harbor Foods invoice HF-3106 from its approved address, waiting in review, counting once you confirm it.',
				[1416, 1158]
			),
			[780, 1254]
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
	'Sage asked what is still owed on the Nair & Castellano wedding on December 19: $10,750.00, due December 9, 2026, citing two records with links to the wedding (the $3,500.00 deposit paid by card link; the balance due December 9), and the order total of $14,250.00 with no customer invoice issued yet.',
	// Cropped above the suggested-next-step card: its green button read as the
	// page's primary (design review 2026-10-07).
	[808, 1014]
);
