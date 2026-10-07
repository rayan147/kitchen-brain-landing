// story: docs/stories/homepage-caterer-fixes.story.md
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
	title: 'CostCook: catering from first inquiry to closeout',
	description:
		'Take the inquiry, send a priced proposal the client accepts on their phone, then build shopping, prep and pack lists from the same menu and guest count.'
} as const;

/**
 * Owner-supplied Google Calendar appointment schedule, in its two forms. Both
 * are public share links, not secrets: anyone who can book can read them.
 *
 * `url` is the short link Google hands you. It is a 302 to `embedUrl`, so it
 * works in a link and CANNOT be framed: an iframe pointed at it navigates to
 * calendar.google.com, and a CSP allowlist written against calendar.app.google
 * would block the very redirect it was meant to permit.
 *
 * `embedUrl` is the same schedule with Google's `gv=true` embed parameter.
 * /demo renders it in the page so nobody has to leave to book. That needs
 * `frame-src https://calendar.google.com` in vercel.json, which is checked
 * against `embedOrigin` by scripts/check-demo-page.mjs, because a CSP is a
 * deploy-only header: no local server sends one, so nothing else would notice
 * the calendar going blank in production.
 */
export const booking = {
	url: 'https://calendar.app.google/CtvTiAXfbNBB4cXE6',
	embedUrl:
		'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0xfUOfjHtWWy-FW4DGE8Ree6p29tr6zrGH3iZ0oYWhLJWqZhtszmFJqGa-JtB3yJ9bmEoT69Ll?gv=true',
	embedOrigin: 'https://calendar.google.com'
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
// Every link into the app derives from this one origin so a local override
// (PUBLIC_APP_URL in .env) moves Start and Sign in together.
const app = appOrigin(import.meta.env.PUBLIC_APP_URL);

// "Free trial" is in the label because the button is where the reader decides,
// and "Start CostCook" gave no hint that anything about it was free or bounded.
// The card disclosure stays in the line under every primary; the label only
// has to stop the button reading like a purchase. 2026-09-10 walkthrough, #10.
export const cta = {
	label: 'Start free trial',
	// Starts with the visible label so speech input ("click Start free trial")
	// matches the accessible name (WCAG 2.5.3).
	ariaLabel: 'Start free trial of CostCook, 15 days',
	href: `${app}/start?plan=launch`,
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
	href: `${app}/login`,
	target: '_self'
} as const;

export const demoCta = {
	label: 'Book a 15-min demo',
	ariaLabel: 'Book a demo: prepare a 15-minute CostCook session',
	href: '/demo',
	target: '_self',
	rel: undefined
} as const;

export const contactCta = {
	label: 'Contact Rayan',
	ariaLabel: 'Contact Rayan about CostCook',
	href: '/contact'
} as const;

/**
 * Public launch terms shown wherever a visitor decides whether to start.
 *
 * THE BILLING UNIT IS "a kitchen", said one way everywhere. The price line
 * used to bill per "workspace" while the limits ticket used the same word for
 * the whole account: one term, two meanings, on the line a reader checks
 * hardest. scripts/check-landing-claims.mjs now fails on the old phrasing.
 * A reader with one kitchen and a sous asks whether the sous is another $49.
 * `crew` answers that on the same line (FAQ "Do I pay per user?", pricing
 * page: teammates unlimited). "During launch" was dropped by owner ruling
 * 2026-10-07: unlimited crew is the standing offer (RC-34).
 */
export const launchPlan = {
	displayPrice: import.meta.env.PUBLIC_LAUNCH_PRICE_DISPLAY?.trim() || '$49/month',
	trialDays: 15,
	unit: 'per kitchen',
	crew: 'unlimited crew',
	crewTerms: 'Teammates are unlimited.',
	billingNote: 'per kitchen, unlimited crew, after a 15-day free trial.'
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
// story: docs/stories/resources-navigation.story.md
const resourceNav = [
	{
		label: 'Product tour',
		href: productTourHref,
		header: 'resources',
		group: 'See it work',
		icon: 'tour',
		description: 'See a sample wedding go from recipe costs to shopping and prep.'
	},
	{
		label: 'Who it\'s for',
		href: '/who-its-for',
		header: 'resources',
		group: 'See it work',
		icon: 'audience',
		description: 'Check the kitchens, events, and working styles CostCook fits.'
	},
	{
		label: 'Your initial setup',
		href: '/onboarding',
		header: 'resources',
		group: 'See it work',
		icon: 'dish',
		description: 'See what to prepare, the five setup stages, and how to invite your crew.'
	},
	{
		label: 'How we compare',
		href: '/compare',
		header: 'resources',
		group: 'Make the decision',
		icon: 'compare',
		description: 'Compare kitchen tasks, product limits, and monthly prices.'
	},
	{
		label: 'FAQ',
		href: '/faq',
		header: 'resources',
		group: 'Make the decision',
		icon: 'faq',
		description: 'Get direct answers about setup, pricing, data, and leaving.'
	},
	{
		label: 'Contact',
		href: contactCta.href,
		header: 'resources',
		group: 'Make the decision',
		icon: 'contact',
		description: 'Email or call Rayan when your question needs a person.'
	}
] as const;

export const nav: readonly { label: string; href: string; header: 'direct' | 'blog' | 'resources' }[] = [
	// Root-relative so the same links resolve from /features too.
	{ label: 'Pricing', href: '/pricing', header: 'direct' },
	// Considered Composite; not used because this remains a flat destination
	// list with placement metadata. The nested feature inventory has its own
	// shared renderer; recursive navigation nodes would add no useful node type.
	{ label: 'Blog', href: '/blog', header: 'blog' },
	...resourceNav
];

export const resourcesMenu = {
	label: 'Resources',
	ariaLabel: 'CostCook resources',
	groups: ['See it work', 'Make the decision'] as const,
	items: resourceNav
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
