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

const productionAppOrigin = 'https://app.costcook.io';

function appOrigin(configuredOrigin: string | undefined): string {
	if (!configuredOrigin?.trim()) return productionAppOrigin;

	try {
		const url = new URL(configuredOrigin.trim());
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return productionAppOrigin;
		return url.origin;
	} catch {
		return productionAppOrigin;
	}
}

/** The one CTA, referenced everywhere it appears so its label and destination cannot drift. */
export const cta = {
	label: 'Start CostCook',
	ariaLabel: 'Start CostCook',
	href: `${appOrigin(import.meta.env.PUBLIC_APP_URL)}/start?plan=launch`,
	target: '_self',
	rel: undefined
} as const;

/**
 * Returning users. The app calls this "Sign in" (its login page title is
 * "Sign in | CostCook"), so the page uses the same word. "Log in" here and
 * "Sign in" there is a small lie about how carefully anything else was built.
 *
 * Deliberately NOT in the `nav` array below. That array is prospect
 * navigation with a one-slot mobile budget; this is an account action for
 * someone who already decided, and it renders beside the CTA at every width.
 */
export const signIn = {
	label: 'Sign in',
	ariaLabel: 'Sign in to CostCook',
	href: 'https://app.costcook.io/login',
	target: '_self'
} as const;

export const demoCta = {
	label: 'Book a 15-min demo',
	ariaLabel: 'Prepare and book a 15-minute CostCook demo',
	href: '/demo',
	target: '_self',
	rel: undefined
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

const productTourHref = '/tour/main';

/**
 * Destinations only. The three in-page anchors that used to live here ("The
 * problem", "What changes", "Watch it work") were removed: a header that
 * indexes its own scroll is noise on a one-pager, and it competed with the
 * single primary CTA sitting beside it.
 *
 * `header` controls only the desktop header hierarchy. The footer renders the
 * whole flat list, while narrow screens expose the same destinations through
 * one contained Menu disclosure so no route disappears with the breakpoint.
 */
export const nav: readonly { label: string; href: string; header: 'direct' | 'blog' | 'resources' }[] = [
	// Root-relative so the same links resolve from /features too.
	{ label: 'Pricing', href: '/pricing', header: 'direct' },
	// Considered Composite; not used because this remains a flat destination
	// list with placement metadata. The nested feature inventory has its own
	// shared renderer; recursive navigation nodes would add no useful node type.
	{ label: 'Blog', href: '/blog', header: 'blog' },
	{ label: 'Product tour', href: productTourHref, header: 'resources' },
	// The fit question is a bookmarkable read, not an ARIA tabs widget. It is
	// deliberately not earlyVisible: pricing still owns the one phone slot,
	// while the full footer keeps this destination available at every width.
	{ label: 'Who it\'s for', href: '/who-its-for', header: 'resources' },
	// 'Every feature' left this array on 2026-08-23. /features is now a hub
	// over five area pages, and a flat link to it hid that structure one click
	// deep; the header renders it as a disclosure instead (see featuresMenu and
	// SiteNav). It stays in the FOOTER as a plain link, because a footer is a
	// list, not a menu, and a second disclosure down there would be worse.
	{ label: 'How we compare', href: '/compare', header: 'resources' },
	// Added 2026-08-29. Not earlyVisible: pricing keeps the one phone slot, and
	// the FAQ's first group IS the pricing questions, reachable from /pricing
	// and from the close. The header carries it from md up, the footer always.
	{ label: 'FAQ', href: '/faq', header: 'resources' },
	{ label: 'Contact', href: contactCta.href, header: 'resources' }
];

export const resourcesMenu = {
	label: 'Resources',
	ariaLabel: 'CostCook resources',
	items: nav.filter((item) => item.header === 'resources')
} as const;

export const blogMenu = {
	label: 'Blog',
	href: '/blog',
	overviewLabel: 'Read every guide',
	ariaLabel: 'Blog guides, broken down by kitchen question'
} as const;

export const mobileMenu = {
	label: 'Menu',
	ariaLabel: 'Site navigation'
} as const;

/**
 * Header disclosure copy. The curated destinations live beside the feature
 * source data, while this object owns only the shared navigation language.
 *
 * A DISCLOSURE, NOT A HOVER MENU. The reader is on a phone mid-shift where
 * hover does not exist, so it opens on click and on Enter, in the same way at
 * every width. Nothing about the site depends on it: JS off leaves a working
 * <details>, and /features itself is the same five choices on a page.
 */
export const featuresMenu = {
	label: 'Features',
	href: '/features',
	overviewLabel: 'Explore every shipped feature',
	tourLabel: 'Take the product tour',
	tourHref: productTourHref,
	ariaLabel: 'Features, broken down by kitchen job'
} as const;
