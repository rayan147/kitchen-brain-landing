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
	// TODO(owner): add your last name to the signature.
	founderName: 'Rayan',
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
	label: 'Book a 15-min demo',
	ariaLabel: 'Book a 15-min demo (opens in a new tab)',
	href: booking.url,
	target: '_blank',
	rel: 'noopener noreferrer'
} as const;

/**
 * Section links. Each item ships in the SAME issue as its section, so no
 * dead anchors ever reach production. The footer derives from this array
 * too — it must keep mirroring it, since header links hide below `sm`.
 */
export const nav: readonly { label: string; href: string }[] = [
	// Root-relative so the same links resolve from /features too.
	{ label: 'The problem', href: '/#problem' },
	{ label: 'What changes', href: '/#outcomes' },
	{ label: 'Watch it work', href: '/#demo' },
	{ label: 'Every feature', href: '/features' }
];
