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
		'Type in the menu and the guest count; CostCook hands back the shopping list, prep sheets, and plate cost. Built by a chef with 12 years on the line.'
} as const;

/** The one CTA, referenced everywhere it appears — copy must never drift. */
export const cta = { label: 'Book a 15-min demo', href: '#book' } as const;

/**
 * TODO(owner): set PUBLIC_CALENDLY_URL (Vercel env + .env locally) to your
 * real 15-minute event link. `||` not `??`: empty-string env values must
 * fall through to the placeholder.
 */
const rawCalendlyUrl =
	import.meta.env.PUBLIC_CALENDLY_URL || 'https://calendly.com/your-handle/15min';
// Build-time guard: this value becomes an href AND an iframe src, and the
// postMessage handler trusts the https://calendly.com origin to match it.
if (!rawCalendlyUrl.startsWith('https://calendly.com/')) {
	throw new Error(`PUBLIC_CALENDLY_URL must be an https://calendly.com/ link, got: ${rawCalendlyUrl}`);
}
export const calendlyUrl = rawCalendlyUrl;

/**
 * Section links. Each item ships in the SAME issue as its section, so no
 * dead anchors ever reach production. The footer derives from this array
 * too — it must keep mirroring it, since header links hide below `sm`.
 */
export const nav: readonly { label: string; href: string }[] = [
	{ label: 'What it does', href: '#what' },
	{ label: 'See it run', href: '#demo' },
	{ label: 'How it works', href: '#loop' },
	{ label: 'The hard part', href: '#yield' },
	{ label: 'Why us', href: '#why' },
	{ label: 'From the chef', href: '#chef' }
];
