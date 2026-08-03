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
		'Know what every catering event should cost before you quote it. CostCook connects supplier prices, recipes, menus, orders, shopping, prep, packing, and purchases.'
} as const;

/** The one CTA, referenced everywhere it appears — copy must never drift. */
export const cta = { label: 'Book a 15-min demo', href: '#book' } as const;

/** Owner-supplied Google Calendar appointment schedule. */
export const booking = {
	url: 'https://calendar.app.google/CtvTiAXfbNBB4cXE6',
	embedUrl:
		'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0xfUOfjHtWWy-FW4DGE8Ree6p29tr6zrGH3iZ0oYWhLJWqZhtszmFJqGa-JtB3yJ9bmEoT69Ll?gv=true'
} as const;

/**
 * Section links. Each item ships in the SAME issue as its section, so no
 * dead anchors ever reach production. The footer derives from this array
 * too — it must keep mirroring it, since header links hide below `sm`.
 */
export const nav: readonly { label: string; href: string }[] = [
	{ label: 'How it works', href: '#chain' },
	{ label: 'Setup', href: '#setup' },
	{ label: 'Operations', href: '#operations' },
	{ label: 'The math', href: '#math' },
	{ label: 'See it run', href: '#demo' }
];
