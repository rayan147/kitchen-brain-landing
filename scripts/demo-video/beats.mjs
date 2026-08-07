/**
 * The walkthrough storyboard. Shared by capture-silent.mjs and
 * assemble-silent.mjs so there is exactly one place a beat is defined.
 *
 * NO NARRATION. The cut is captions over a music bed, and `caption` is the only
 * channel carrying meaning. That is a deliberate retreat, not a shortcut: every
 * synthesised voice this rig tried read the lines as headlines rather than
 * speech, and the licence on the one engine that did not (XTTS, CPML
 * non-commercial) is not a licence this page can ship under anyway. A caption
 * nobody has to believe is a person is better than a voice everybody can tell
 * is not. It also removes the accessibility problem entirely — there is no
 * audio-only content left to be equivalent to.
 *
 * The practical consequence is that captions now have to stand alone, so they
 * are written to be read at a glance and at size: one claim, the figures that
 * prove it, no subordinate clauses. Every figure must be legible in the frame
 * behind them.
 *
 * THE STORY IS ONE ORDER, START TO FINISH
 * b0 establishes who and what before anything is demonstrated. Without it the
 * video opened on a menu list with no indication of whose kitchen this is or
 * what is at stake, and every following beat was a feature rather than a step.
 *
 * EVERY FIGURE CHAINS TO ONE DATASET
 * Harbor & Vine's walkthrough seed: the Rodriguez backyard wedding, 200 guests
 * at $16.50, on the Summer BBQ menu, whose Greek Salad is the recipe in b6.
 * That chain is load-bearing — the pitch is "they are all the same numbers", so
 * a viewer must be able to divide $1,354.04 by 200 and land on the $6.77 the
 * screen shows. An earlier cut narrated the Mediterranean Mezze menu ($4.36 a
 * guest) and then quoted the Summer BBQ order's food cost as if they were the
 * same menu; they are not, and the arithmetic did not close. capture-silent.mjs
 * now pins the menu and the recipe by name for exactly this reason.
 *
 * Re-verify against the running app before re-recording. A caption that
 * disagrees with the frame behind it is the one mistake this footage cannot
 * survive.
 */
/**
 * @typedef {object} Beat
 * @property {string} id
 * @property {string} caption   Burned into the frame. The only channel there is.
 * @property {string} [path]    Literal route, for beats not tied to a pinned record.
 *                              Absolute http(s) URLs are visited as-is (the
 *                              Mailpit inbox is part of the v2 recording).
 * @property {string} [click]   After load, click the first visible element
 *                              whose text matches this (opens the PO email).
 * @property {boolean} [useOrder]
 * @property {boolean} [useIngredient]
 * @property {boolean} [useRecipe]
 * @property {string} [suffix]  Appended to the resolved record path, e.g. '/prep'.
 * @property {string} [scrollTo]   Bring this text into view, keeping what is above it.
 * @property {string} [scrollTop]  Pin this text to the top of the frame, hiding what is above it.
 */

/**
 * WALKTHROUGH v2 (2026-08-08): the Maple & Main world from the app repo's
 * `npm run demo:seed` + `demo:capture` (demo/README.md there). One order,
 * start to finish: the Alvarez–Whitman wedding, 180 guests on the Wedding
 * Plated Dinner menu — through the ACTUAL email send (Mailpit on :8025 is
 * part of the recording), the imperfect delivery, and the shelf. Every figure
 * below was read off the demo world's own screens; re-verify against the
 * running app before re-recording.
 */
/** @type {Beat[]} */
export const BEATS = [
	{
		id: 'b0',
		path: '/orders/list',
		caption: 'A year of jobs on the books. The next big one: a wedding, 180 plates, three days out.',
	},
	{
		id: 'b1',
		useRecipe: true,
		scrollTop: 'Lines per portion',
		caption:
			'It starts from recipes that carry their own cost. Braised short rib: the beef is 93% of the plate.',
	},
	{
		id: 'b2',
		useOrder: true,
		caption:
			'180 guests at $68 a head: $12,240 in, $4,845.61 of food. That is 39.6%, and it names the price that gets you to thirty.',
	},
	{
		id: 'b3',
		useOrder: true,
		scrollTop: 'Baldor',
		caption:
			'The same order is already a shopping list, by vendor, in whole packs. What you buy, not what you plate. Baldor: $690.82.',
	},
	{
		// The inbox IS the product claim here: the purchase orders really send.
		// Mailpit is the demo's capture inbox, standing in for the vendor's.
		id: 'b4',
		path: 'http://localhost:8025/',
		caption: 'Confirming sends the purchase orders: one per vendor, each with its own number.',
	},
	{
		id: 'b5',
		path: 'http://localhost:8025/',
		click: 'PO-00783-002',
		caption:
			'What Green Valley receives: PO-00783-002, five items in whole packs, $516.08, terms and dock notes included.',
	},
	{
		id: 'b6',
		useOrder: true,
		suffix: '/receiving',
		scrollTop: 'Arugula',
		caption:
			'The truck is never perfect. A short case is recorded and saved for follow-up, not found at five a.m. with the salad still to build.',
	},
	{
		id: 'b7',
		useOrder: true,
		suffix: '/receiving',
		scrollTop: 'Baby spinach',
		caption:
			'Sixteen cases came where fifteen were quoted. $477.16 paid, $410.40 promised: 9% more per case, on the line.',
	},
	{
		id: 'b8',
		useIngredient: true,
		scrollTo: 'Saved price source',
		caption:
			'One tap posts it all to inventory, and the paid price becomes the live cost with its source on record.',
	},
	{
		id: 'b9',
		path: '/catalog/inventory',
		caption: 'The shelf agrees: what arrived is on hand, counted today, valued at what you paid.',
	},
	{
		id: 'b10',
		useOrder: true,
		scrollTop: 'Quoted 2026',
		caption:
			'Quoted at $26.92 a guest. Today reads $27.12. The price moved 0.7%, and the quote still holds.',
	}
];

/**
 * How long a beat stays on screen, in seconds.
 *
 * With narration, this was the length of the spoken line plus a tail — the
 * audio set the pace and the picture followed. There is no audio now, so the
 * pace has to come from the only thing left that varies per beat: how long the
 * caption takes to read. A fixed hold is the wrong answer in both directions at
 * once, because b5's caption is half the length of b3's.
 *
 * LEAD_IN gives the eye the screen before any text lands on it. DWELL is the
 * part the reader actually feels — silence after the last word, where they look
 * back up at the numbers the caption just pointed at. That beat of looking is
 * the entire reason someone watches this rather than reading the page, so it is
 * generous on purpose.
 *
 * WPS is slow for silent reading (a comfortable rate is nearer 4) because these
 * lines are dense with figures, and a figure is not read at prose speed — the
 * eye stops on "$1,354.04" and again on "41%". The clamp keeps a short caption
 * from flashing past and a long one from becalming the cut.
 */
const LEAD_IN = 1.0;
const DWELL = 2.4;
const WPS = 2.8;
const MIN_HOLD = 7.5;
const MAX_HOLD = 13;

export const holdFor = (beat) => {
	const words = beat.caption.trim().split(/\s+/).length;
	return Math.min(MAX_HOLD, Math.max(MIN_HOLD, LEAD_IN + words / WPS + DWELL));
};

/** Exported so the capture rig can show the screen before the caption lands. */
export const CAPTION_DELAY = LEAD_IN;
