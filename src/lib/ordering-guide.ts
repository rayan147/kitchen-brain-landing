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
	caption: 'One office lunch for 40, from the order on the client’s phone to the food cost the next day. 50 seconds, music only, every word on screen.',
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
		what: 'Who is ordering and how it reaches them.',
		settings: [
			'The name clients see, from your business profile',
			'Smallest and largest group',
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
			'Descriptions for the menu and each dish, or let Sage draft them'
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

/** Payments and tax: the three choices, the app's labels and help text. */
export const paymentChoices = [
	{
		label: 'Card, through CostCook',
		detail: 'Connect Stripe here. After you approve, the client gets a pay link and pays into your own Stripe account.'
	},
	{
		label: 'A partner collects it',
		detail: 'A payment partner takes the money and reports back when it’s paid.'
	},
	{
		label: 'You collect it',
		detail: 'Invoice, check, cash or ACH, after you confirm. This is where a new site starts.'
	}
] as const;

/**
 * Where it stops, for a caterer reading the guide. The same five boundaries as
 * ordering.notClaimed (src/lib/ordering.ts), in plain words: that list is the
 * guard's wording, and "five outbound states" means nothing to a cook.
 */
export const orderingLimits = [
	'Approving is not the booking. The client’s payment confirms the order.',
	'The client’s browser never sends a price. CostCook works out every amount after the request arrives, from what you published.',
	'The pay link is good for 72 hours. If nothing is paid, the day opens up again and the order waits for you to approve it again.',
	'Card payments go into your own Stripe account. No saved cards, no automatic refunds and no client invoices.',
	'The form shows only on the websites you list, and it can’t read or change anything else on your page.'
] as const;
