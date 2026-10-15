/**
 * The /features/online-ordering guide, as data.
 * story: docs/stories/online-ordering.story.md
 *
 * SETTINGS are quoted from kitchen-brain local develop 7a7e407d9, Settings >
 * Integrations > Ordering site (read 2026-10-08): the layout's four tabs, the
 * Setup cards, the website tab, and the Go live blockers in
 * src/lib/storefront/issues.ts. If the app renames a label, this file changes
 * with it. scripts/check-online-ordering-page.mjs pins the tab names and the
 * blockers.
 *
 * THE FILM is the office-lunch film rendered on the promo-dropoff branch
 * (video/out/dropoff.mp4, 49.5 s, music only). `lines` are its captions in
 * order, verbatim from dropoff.vtt (principle 4: the transcript matches the
 * footage). A re-render that changes a caption changes this list.
 *
 * No pattern: tables the guide renders.
 */
export const orderingFilm = {
	mp4: '/film/dropoff.mp4',
	captions: '/film/dropoff.vtt',
	poster: '/film/dropoff-poster.jpg',
	width: 1920,
	height: 1080,
	label: 'CostCook film, 50 seconds: a client orders lunch for 40 on the caterer’s ordering site, and the order goes from request to food cost',
	// The words are burned into the frames, so the captions track is there for
	// players that read it and is off by default: on, it printed each line twice.
	caption: 'One office lunch for 40, from the order on the client’s phone to the food cost the next day. That kitchen takes cards and asks for the full amount up front. It runs 50 seconds, music only, with the words on screen.',
	lines: [
		'A client orders lunch for 40 on your site.',
		'The client sees the price before anyone calls.',
		'It arrives priced. Food cost 29.3%, with misc.',
		'Clear day, priced menu, so it approved itself. You can still decline.',
		'The client gets a pay link and pays $1,273.08 by card.',
		'Nobody typed the order twice or chased the money.',
		'Whole packs, by supplier, for 40. The rest stays on the shelf.',
		'Each supplier gets only its own lines.',
		'A prep order the crew works top to bottom.',
		'2 stuffed peppers, and no clashes with the guests’ restrictions.',
		'The next day it came in $2.47 over plan, still under your 30% target at 29.1% without misc.'
	]
} as const;

/** The four tabs, in the app's order, with what a caterer sets on each. */
export const orderingTabs = [
	{
		name: 'Setup',
		what: 'Who’s ordering and how it gets to them.',
		settings: [
			'The name clients see, from your business profile',
			'Smallest and largest group',
			'Notice and how far ahead they can book, from Settings > Booking',
			'Pickup (place and address) and delivery (with a fee)',
			'How they pay, and an estimated tax'
		]
	},
	{
		name: 'Menus',
		what: 'Which menus clients can order, at what price.',
		settings: [
			'Switch each menu on or off for the site',
			'The name and price per guest clients see',
			'Descriptions for the menu and each dish, or let Sage draft them',
			'Diet badges, which show once every ingredient in the dish is answered'
		]
	},
	{
		name: 'Look',
		what: 'Make it look like your website.',
		settings: [
			'Your logo',
			'Text, button, picked-menu and background colours',
			'A contrast check, so the text stays readable'
		]
	},
	{
		name: 'Put on your website',
		what: 'Your link, and the form for your own site.',
		settings: [
			'Your link, with Copy and a QR code',
			'Websites that will show it',
			'Snippet for your web person'
		]
	}
] as const;

/** The Go live blockers (issues.ts), in plain words. Suggestions are not here. */
export const goLiveNeeds = [
	'Pickup or delivery is on. Pickup needs a place and an address.',
	'At least one menu is on the site.',
	'Every menu on the site has a price above $0.',
	'If clients pay by card through CostCook, Stripe is connected and can take cards.'
] as const;

/** Payments and tax: the three choices. The app's labels; the details in plain words. */
export const paymentChoices = [
	{
		label: 'Card, through CostCook',
		detail: 'Connect Stripe here. When your booking rules ask for money, the client pays by card from an emailed link, into your own Stripe account.'
	},
	{
		label: 'A partner collects it',
		detail: 'A payment partner takes the money and reports back when it’s paid.'
	},
	{
		label: 'You collect it',
		detail: 'Your own invoice, a check, cash or ACH. The client gets an approval email, and you record the payment on the order. New sites start on this one.'
	}
] as const;

/**
 * Where it stops, for a caterer reading the guide. The same five boundaries as
 * ordering.notClaimed (src/lib/ordering.ts), in plain words: that list is the
 * guard's wording, and "five outbound states" means nothing to a cook.
 */
export const orderingLimits = [
	'The pay link goes by email. A client who leaves only a phone number is sent nothing, so add their email to the order before you approve it.',
	'When money is due, the client has 72 hours to pay, or you have 72 hours to record what you collected. If nothing is paid or recorded, the day opens back up and the order goes back to waiting on you.',
	'The price never comes from the client’s screen. CostCook works out every amount after the request arrives, from what you published.',
	'Card payments go into your own Stripe account. CostCook won’t save cards or refund on its own.',
	'The form shows only on the websites you list, and it can’t read or change anything else on your page.'
] as const;

/**
 * Settings > Booking > Booking rules: what a fixed-menu request pays when you
 * approve it. Labels verbatim (BookingRuleForm.svelte); a new account's
 * default rule is no online payment (server/booking/rules.ts), and then
 * approving confirms the order (approval/review.ts collectionLine).
 */
export const bookingRuleOutcomes = [
	{
		label: 'Fixed menu: no online payment',
		detail: 'Approving confirms the order. A new account starts here.'
	},
	{
		label: 'Fixed menu: pay in full',
		detail: 'Approving sends the client a pay link. Their payment confirms the order.'
	},
	{
		label: 'Fixed menu: deposit, then the balance',
		detail: 'The pay link takes the deposit and confirms the order. The balance gets its own link before the event.'
	}
] as const;

/**
 * "What your client sees": one order through the website widget, then the same
 * order in the caterer's Orders. Captured 2026-10-15 by
 * scripts/capture-ordering-flow-proof.mjs from kitchen-brain develop 5e01c9fc7
 * with the embed ready fix (61740a018). Every figure is read off its frame:
 * Coastal Dinner at $93.00 a guest, 50 guests, $4,650.00 food, $25.00
 * delivery, $4,675.00 before tax, food cost 25.9% against a 30% target.
 * The package photos are CC0 stand-ins (docs/proof/ordering-flow.md), which
 * the page says under the frames.
 *
 * Considered Composite; not used because this is one flat list of frames.
 */
export const clientWalk = [
	{
		src: '/proof/ordering-flow/package.png',
		width: 350,
		height: 1134,
		step: 'Pick',
		caption: 'They open a package, set the head count, and the price follows: 50 guests, $4,650.00.',
		alt: 'The Coastal Dinner package opened on a phone: a photo of the dish, a short description (cedar salmon and seared scallops with corn, lemon orzo, charred green beans and an arugula and pear salad, lemon posset to finish), Guests for this package set to 50, the six included dishes ticked, an optional box for preparation instructions, and $4,650.00 for 50 guests with Cancel and Add to cart.'
	},
	{
		src: '/proof/ordering-flow/cart.png',
		width: 350,
		height: 543,
		step: 'Check',
		caption: 'The cart keeps the estimate in front of them before they give any details.',
		alt: 'The cart on a phone: Coastal Dinner for 50 guests at $4,650.00 with its six dishes, Edit and Remove, Food $4,650.00, Estimated total $4,650.00, and Continue.'
	},
	{
		src: '/proof/ordering-flow/received.png',
		width: 318,
		height: 1117,
		step: 'Send',
		caption: 'Sent. They keep a reference and what they were quoted, delivery included, before tax.',
		alt: 'The client’s confirmation on a phone: order saved, a request reference, the event on Nov 5 for 50 guests delivered to 40 Fore Street, Portland, and what they were quoted: Coastal Dinner 50 × $93.00 $4,650.00, delivery $25.00, sales tax added by the kitchen, $4,675.00 before tax; the kitchen will arrange payment.'
	},
	{
		src: '/proof/ordering-flow/quote.png',
		width: 350,
		height: 1282,
		step: 'Or ask',
		caption: 'Something off the menu? Ask for a quote takes the event, the guest range and what they need. No price until you reply.',
		alt: 'Ask for a quote on a phone: Nothing is booked yet, Tell us about the event, filled in as a family-style rehearsal dinner in early June 2027 for 80 to 100 guests at a barn venue outside Portland, with staff on site and rentals ticked.'
	}
] as const;

export const caterersView = {
	src: '/proof/ordering-flow/arrived.png',
	width: 1036,
	height: 783,
	caption: 'The same order in your Orders, already costed off your recipes: 25.9% food cost against your 30% target. A clear day and a priced menu let it approve on its own if your booking rules say so; you can still decline before anything is paid.',
	alt: 'The order in Orders: Company anniversary dinner, Thu Nov 5, Dana Okafor, 50 guests, Coastal Dinner, a draft. Price $93.00 a guest; food cost 25.9% against a 30% target, sales $4,650.00, food $1,204.66, food margin $3,445.34. Approved, waiting on the payment: approved automatically because the day was clear and the menu had a price; the client pays the whole $4,675.00 up front, and you collect it yourself.'
} as const;
