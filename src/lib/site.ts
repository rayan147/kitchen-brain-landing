/**
 * Single source of truth for owner-supplied values.
 * Every TODO below must be swapped before real traffic — the QA issue's
 * README checklist mirrors this list.
 */
export const site = {
	name: 'CostCook',
	url: 'https://costcook.io',
	email: 'rayan@costcook.io',
	phone: '973-870-6309',
	phoneHref: 'tel:+19738706309',
	/* Full name, because it signs the provenance section: a page whose pitch is
	   "built by a chef, not a software company" is making an accountability
	   claim, and half a name is a weaker one. The CTAs stay first-name
	   ("Contact Rayan") on purpose. That is the chef-to-chef voice, and it is
	   the register a reader replies in. */
	founderName: 'Rayan Ramirez',
	// ≤60 chars so Google doesn't truncate the audience qualifier.
	title: 'CostCook: shopping, prep & food cost for caterers',
	description:
		'Enter a catering menu and guest count once. CostCook scales recipes, builds shopping, prep, and pack plans, and shows food cost before you quote.'
} as const;

/** Owner-supplied Google Calendar appointment schedule. */
export const booking = {
	url: 'https://calendar.app.google/CtvTiAXfbNBB4cXE6'
} as const;

/** The one CTA, referenced everywhere it appears so its label and destination cannot drift. */
export const cta = {
	label: 'Start CostCook',
	ariaLabel: 'Start CostCook',
	href: 'https://app.costcook.io/start?plan=launch',
	target: '_self',
	rel: undefined
} as const;

export const demoCta = {
	label: 'Book a 15-min demo',
	ariaLabel: 'Book a 15-min demo (opens in a new tab)',
	href: booking.url,
	target: '_blank',
	rel: 'noopener noreferrer'
} as const;

export const contactCta = {
	label: 'Contact Rayan',
	ariaLabel: 'Contact Rayan about CostCook',
	href: '/contact'
} as const;

/** Public launch terms shown wherever a visitor decides whether to start. */
export const launchPlan = {
	displayPrice: import.meta.env.PUBLIC_LAUNCH_PRICE_DISPLAY?.trim() || '$49/month',
	trialDays: 15,
	billingNote: 'per kitchen workspace after a 15-day free trial.'
} as const;

/**
 * Destinations only. The three in-page anchors that used to live here ("The
 * problem", "What changes", "Watch it work") were removed: a header that
 * indexes its own scroll is noise on a one-pager, and it competed with the
 * single primary CTA sitting beside it.
 *
 * `earlyVisible` is the mobile-header budget. Below `md` the header can carry
 * the wordmark, ONE link, and the CTA pill without crowding; pricing wins that
 * slot because it is the question a cold-email visitor asks first, and it was
 * previously unreachable from a phone header entirely. The footer renders the
 * whole array at every width.
 */
export const nav: readonly { label: string; href: string; earlyVisible?: true }[] = [
	// Root-relative so the same links resolve from /features too.
	{ label: 'Pricing', href: '/pricing', earlyVisible: true },
	{ label: 'Every feature', href: '/features' },
	{ label: 'Contact', href: contactCta.href }
];

/** Header disclosure copy; destinations stay with the feature source data. */
export const featuresMenu = {
	label: 'Features',
	ariaLabel: 'Features, broken down by kitchen job',
	overviewLabel: 'Explore every shipped feature',
	overviewHref: '/features'
} as const;
