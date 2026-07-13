/**
 * Single source of truth for owner-supplied values.
 * Every TODO below must be swapped before real traffic — the QA issue's
 * README checklist mirrors this list.
 */
export const site = {
	name: 'Kitchen Brain',
	// TODO(owner): swap for the custom domain before launch (also in astro.config.mjs).
	url: 'https://kitchen-brain-landing.vercel.app',
	// TODO(owner): replace with the real contact address.
	email: 'hello@kitchenbrain.example',
	// Calendly URL comes from PUBLIC_CALENDLY_URL (see the booking section).
	description:
		'Turn any catering order into exact shopping lists, prep sheets, and food cost in one click. Built by a chef with 12 years on the line.'
} as const;

/** The one CTA, referenced everywhere it appears — copy must never drift. */
export const cta = { label: 'Book a 15-min demo', href: '#book' } as const;

/**
 * Section links. Each item ships in the SAME issue as its section, so no
 * dead anchors ever reach production. The footer derives from this array
 * too — it must keep mirroring it, since header links hide below `sm`.
 * Pending: #chef (issue 6).
 */
export const nav: readonly { label: string; href: string }[] = [
	{ label: 'What it does', href: '#what' },
	{ label: 'Why us', href: '#why' }
];
