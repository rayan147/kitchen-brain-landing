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
 * @property {boolean} [useOrder]
 * @property {boolean} [useMenu]
 * @property {boolean} [useRecipe]
 * @property {string} [suffix]  Appended to the resolved record path, e.g. '/prep'.
 * @property {string} [scrollTo]   Bring this text into view, keeping what is above it.
 * @property {string} [scrollTop]  Pin this text to the top of the frame, hiding what is above it.
 */

/** @type {Beat[]} */
export const BEATS = [
	{
		id: 'b0',
		path: '/orders/list',
		caption: 'Three jobs on the books. The big one: a backyard wedding, 200 guests, two weeks out.',
	},
	{
		id: 'b1',
		useMenu: true,
		caption: 'It starts from a menu you already sell. Five dishes, each a real recipe underneath.',
	},
	{
		id: 'b2',
		useMenu: true,
		scrollTo: 'Cost per guest',
		caption:
			// Recast rather than merely de-dashed: replacing the dash with "That is"
			// pushed this to 127 characters, over the two-line budget, and a caption
			// that spills to three lines grows the bar over the rows it points at.
			'$6.96 a guest against a $16.50 price is 42.2% food cost. Hitting target means charging $23.20.',
	},
	{
		// The money summary and the quoted-vs-today band are one screen, so they
		// are one beat. Splitting them gave two consecutive captions over an
		// identical frame — half a minute of the video with nothing moving — and
		// scrolling the band to the top to force a difference only filled the rest
		// of the frame with the Green Valley rows this cut deliberately avoids.
		id: 'b3',
		useOrder: true,
		caption:
			// Trimmed to the two-line caption budget (see capture-silent.mjs): the
			// freeze is what makes the quoted-vs-today band mean anything, so the
			// band's own figures go and the mechanism stays.
			'200 guests: $3,300 in, $1,354.04 of food, which is 41%. Prices froze at confirmation, so it flags the 2.8% rise since.',
	},
	{
		id: 'b4',
		useOrder: true,
		// Restaurant Depot, not the larger Green Valley Produce group: Green Valley
		// leads with "Bell pepper — need 304.9 each". Nobody needs 304.9 bell
		// peppers, and a decimal count on a countable item is the exact tell that
		// software wrote the sheet rather than a cook. Restaurant Depot's rows are
		// all weight and volume, where a decimal is how a kitchen actually talks.
		scrollTop: 'Restaurant Depot',
		caption:
			'The same order becomes the shopping list, by vendor, in whole cases. Restaurant Depot: $354.30.',
	},
	{
		id: 'b5',
		useOrder: true,
		suffix: '/prep',
		caption:
			'Then the prep sheet, scaled to 200 portions, with instructions frozen at confirmation.',
	},
	{
		id: 'b6',
		useRecipe: true,
		scrollTop: 'Greek Salad',
		caption:
			'Every plate shows its work. Greek Salad: $1.73 a plate against a $4.10 price. Out of line, and it says so in red.',
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
