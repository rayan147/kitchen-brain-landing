/**
 * The walkthrough storyboard. Shared by capture-silent.mjs and
 * assemble-silent.mjs so there is exactly one place a beat is defined.
 *
 * NO SPEECH TRACK, BY OWNER DECISION (2026-08-21). A music bed is allowed and
 * assemble-silent.mjs generates one; the cards carry every claim; the motion
 * carries the pace a voice used to. Nothing is conveyed by audio alone, so
 * there is no audio-only content for a media alternative to be equivalent to.
 * The cut must be watchable muted, because most of the page's readers are on a
 * phone mid-shift.
 *
 * WHY CARDS AND NOT CAPTIONS. The previous generation gave each beat one
 * paragraph, written when there was still a voice to read it, and then the
 * voice went away and the paragraph stayed:
 *
 *   "180 guests at $68 a head: $12,240 in, $4,845.61 of food. That is 39.6%,
 *    and it names the price that gets you to thirty."
 *
 * Nobody says that, and nobody reads it at a glance either. speak.py's
 * docstring has the diagnosis: captions and speech are different jobs, and
 * making either a transliteration of the other ruins both. So a beat is a
 * short sequence of cards now, and the rule for writing one is:
 *
 *   EACH CARD STANDS ALONE AND LANDS ON ONE NUMBER.
 *
 * It is read at a glance, on a phone, possibly at arm's length, with no voice
 * to carry the grammar across from the card before it. No card may depend on
 * the previous card's grammar. One idea each: if it needs a semicolon or an
 * "and", it is two cards. Six to ten words. Contractions and plain kitchen
 * English. No em-dashes, ever, in any user-facing text on this project.
 *
 * The smell test comes second, not first: would a chef say this standing next
 * to you? That is the check. Writing a spoken sentence and trimming it to fit
 * produces exactly the clipped headline voice this is replacing.
 *
 * EVERY FIGURE ON A CARD MUST BE LEGIBLE IN THE FRAME BEHIND IT. If it is not
 * on screen, it does not go on a card.
 *
 * EVERY FIGURE CHAINS TO ONE DATASET
 * The Maple & Main world from the app repo's `npm run demo:seed` +
 * `demo:capture` (demo/README.md there): the Alvarez-Whitman wedding, 180
 * guests at $68 on the Wedding Plated Dinner menu, whose Braised Short Rib is
 * the recipe the recipe beat shows. That chain is load-bearing — the pitch is
 * "they are all the same numbers", so a viewer must be able to divide
 * $4,847.96 by 180 and land on the $26.93 the screen shows. An earlier cut
 * narrated the Mediterranean Mezze menu and then quoted the Summer BBQ order's
 * food cost as if they were the same menu; they are not, and the arithmetic
 * did not close.
 *
 * FIGURES BELOW WERE READ OFF THIS RUN'S OWN SCREENS, 2026-08-21, seeded with
 * HISTORY_SEED_DATE=2026-08-21. Re-verify before re-recording: dates and
 * date-derived figures move with the seed anchor. The PO number is deliberately
 * NOT on a card — it contains the order id, which is insertion order in a fresh
 * database, and a card that names it is a card that goes stale the first time
 * somebody captures twice.
 */

/**
 * @typedef {object} Card
 * @property {string} text   Burned into the frame. The only channel there is.
 * @property {number} hold   Seconds this card stays up before the next one.
 */

/**
 * @typedef {object} Move
 * @property {number} at     Seconds from the beat's first retained frame.
 * @property {'cursor'|'ring'|'ringOnly'|'ringOff'|'scroll'|'click'|'type'} act
 * @property {string} [text]   Match by visible text (default targeting).
 * @property {string} [role]   Match by ARIA role, with `name`.
 * @property {string} [name]   Accessible name, used with `role`.
 * @property {string} [label]  Match by form label.
 * @property {string} [row]    Match a table row by its accessible name.
 * @property {number} [up]     Ring this many ancestors up from the match, so a
 *                             ring lands on the figure's whole block rather
 *                             than on the four characters of its label.
 * @property {number} [pad]    Ring padding in px.
 * @property {number} [ms]     Scroll duration.
 * @property {number} [offset] Scroll offset from the target's top.
 * @property {string|number} [value] Text to type, for `type`.
 * @property {boolean} [reinject] Re-inject cursor/ring/cards after a click that
 *                             navigates. Required on any click that leaves the
 *                             page: the injected DOM does not survive it.
 */

/**
 * @typedef {object} Beat
 * @property {string} id
 * @property {Card[]} cards
 * @property {Move[]} [moves]
 * @property {string} [path]    Literal route. Absolute http(s) URLs are visited
 *                              as-is (the Mailpit inbox is part of the cut).
 * @property {'title'|'end'} [card] Render cards.html instead of the app. These
 *                              beats carry no caption bar; the card IS the frame.
 * @property {string} [click]   After load, click the first visible element whose
 *                              text matches. Runs before the tape's first kept
 *                              frame, unlike a `click` move.
 * @property {boolean} [useOrder]
 * @property {boolean} [useIngredient]
 * @property {boolean} [useRecipe]
 * @property {string} [suffix]  Appended to the resolved record path, e.g. '/receiving'.
 * @property {string} [scrollTo]   Bring this text into view, keeping what is above it.
 * @property {string} [scrollTop]  Pin this text to the top of the frame, hiding what is above it.
 * @property {string} [prepare] Named setup routine in capture-silent.mjs, run
 *                              before the first kept frame.
 * @property {boolean} [captureLast] Record after every other beat, whatever
 *                              position it holds in the cut. For beats that
 *                              change the database.
 * @property {boolean} [keepChrome] Leave the left navigation expanded.
 */

/** Seconds of framed screen before the first card lands. */
export const LEAD_IN = 0.9;
/** Seconds of screen after the last card leaves, before the cut. */
export const TAIL = 0.5;

/** @type {Beat[]} */
export const BEATS = [
	{
		id: 'b00',
		card: 'title',
		cards: [{ text: '', hold: 3.4 }]
	},
	{
		// The orders list first, because without it the cut opens on a screen
		// full of money with no indication of whose kitchen this is or what is
		// at stake, and every beat after it reads as a feature rather than a step.
		id: 'b01',
		path: '/orders/list',
		cards: [{ text: 'A year of jobs, and the next one is Monday.', hold: 4.4 }],
		moves: [
			{ at: 1.6, act: 'ring', row: 'Alvarez-Whitman', pad: 4 },
			{ at: 4.6, act: 'ringOff' }
		]
	},
	{
		// THE MONEY BEAT, AND IT IS DELIBERATELY THIS EARLY. The strongest thing
		// in the dataset is that the $68 guess is under water and the app names
		// the price that fixes it before the quote goes out. In the previous cut
		// that arrived after twenty seconds of list and recipe setup. It now
		// lands inside the first fifteen seconds, which is where a homepage demo
		// has to make its case: completion falls off sharply after the first
		// minute and very few viewers reach the second.
		id: 'b02',
		useOrder: true,
		cards: [
			{ text: '180 guests at $68 is $12,240 in the door.', hold: 4.4 },
			{ text: 'The food costs $4,847.96.', hold: 3.8 },
			{ text: '39.6 percent food cost. You wanted 30.', hold: 4.2 },
			{ text: 'It wants $89.78 a head.', hold: 3.6 },
			{ text: 'You know that before the quote goes out.', hold: 4.0 }
		],
		moves: [
			{ at: 1.2, act: 'ring', text: '^Revenue$', up: 1, pad: 10 },
			{ at: 5.4, act: 'ringOnly', text: 'Theoretical food cost', up: 1, pad: 10 },
			{ at: 9.2, act: 'ringOnly', text: 'food cost · Critical', pad: 8 },
			{ at: 13.4, act: 'ringOnly', text: 'Charge at least', up: 1, pad: 10 },
			{ at: 19.8, act: 'ringOff' }
		]
	},
	{
		// The shopping list is the same order, not an export of it. `scrollTop`
		// rather than `scrollTo`: scrollIntoViewIfNeeded is a no-op on an
		// already-visible element, and that left this beat framed on the Green
		// Valley rows and their "304.9 each" bell peppers, the one number in this
		// dataset that reads as software rather than as a cook.
		id: 'b03',
		useOrder: true,
		scrollTop: 'Baldor',
		cards: [
			{ text: 'The same order is already a shopping list.', hold: 4.0 },
			{ text: 'By vendor, in the packs you actually buy.', hold: 4.0 },
			{ text: 'Baldor: $690.82.', hold: 3.4 }
		],
		moves: [
			{ at: 5.4, act: 'ring', text: '^BALDOR$|^Baldor$', up: 1, pad: 8 },
			{ at: 9.6, act: 'ringOnly', text: '690\\.82', pad: 10 },
			{ at: 12.6, act: 'ringOff' }
		]
	},
	{
		// THE MULTI-EVENT INSET. The owner asked to ALSO show this, not to lead
		// with it, so it is one inset that returns to the wedding and is never
		// mentioned again. A second storyline competing for the same two minutes
		// costs more than it buys; an inset says "and it does this too" without
		// breaking the through-line.
		//
		// The last card is the scope limit and it is not optional.
		// /orders/batch/+page.server.ts exposes exactly two actions, setOnHand
		// and setSubOnHand. There is no confirm action and no purchase-order path
		// on the combined run. A card that says or suggests "confirm all three
		// and the POs go out" is false. See RC-36.
		//
		// `prepare` fills the three events before the tape's first kept frame, so
		// the beat opens on a filled form rather than spending its whole budget
		// watching a form being typed. `captureLast` because submitting it
		// creates three real draft orders: recorded in story position, captured
		// after every beat that shows the orders list.
		id: 'b04',
		path: '/orders/new',
		prepare: 'threeEvents',
		captureLast: true,
		cards: [
			{ text: 'Three events the same week? Plan them as one run.', hold: 4.0 },
			{ text: 'Shop and prep are totalled together.', hold: 3.8 },
			{ text: 'Pack stays split by event.', hold: 3.6 },
			{ text: 'You still confirm and buy each order on its own.', hold: 4.2 }
		],
		// KNOWN, AND LEFT ALONE: the Live quote panel prices event 1 at $4,883.40
		// of food, while the money beat above reads $4,847.96 for the same
		// wedding. They are different numbers because they are different things —
		// the quote panel estimates from the menu before an order exists, and the
		// order's own figure is costed off its lines once it does. No card names
		// the quote-panel figure, and the transcript names neither. If a card ever
		// does, the two have to be reconciled on screen or the beat has to be
		// framed to keep them apart.
		moves: [
			{ at: 1.0, act: 'ring', text: '3 events in this run', up: 1, pad: 8 },
			{ at: 5.6, act: 'click', role: 'button', name: 'Create 3 orders', reinject: true },
			{ at: 9.6, act: 'ringOnly', text: 'orders created together', up: 1, pad: 8 },
			{ at: 11.4, act: 'click', role: 'link', name: '^3 · Pack$|^Pack$', reinject: true },
			{ at: 14.0, act: 'ringOnly', text: 'By event', up: 2, pad: 8 },
			{ at: 17.8, act: 'ringOff' }
		]
	},
	{
		// The inbox IS the product claim here: the purchase orders really send.
		// Mailpit is the demo's capture inbox, standing in for the vendor's, and
		// every seeded vendor address is under the reserved example.com.
		id: 'b05',
		path: 'http://localhost:8025/',
		cards: [{ text: 'Confirming really sends them. One per vendor.', hold: 4.2 }]
	},
	{
		id: 'b06',
		path: 'http://localhost:8025/',
		click: 'PO-\\d{5}-002',
		cards: [
			{ text: "This is what Green Valley's inbox gets.", hold: 4.0 },
			{ text: 'Five items in whole packs. $516.08.', hold: 4.2 }
		],
		moves: [
			{ at: 5.4, act: 'ring', text: '^Subtotal$', up: 1, pad: 8 },
			{ at: 9.0, act: 'ringOff' }
		]
	},
	{
		id: 'b07',
		useOrder: true,
		suffix: '/receiving',
		scrollTop: 'Arugula',
		cards: [
			{ text: 'The truck is never perfect.', hold: 3.4 },
			{ text: 'One case of arugula short, and it is written down.', hold: 4.6 }
		],
		moves: [
			{ at: 4.4, act: 'ring', text: 'Received 3 of 4', pad: 8 },
			{ at: 6.8, act: 'ringOnly', text: 'saved for purchasing follow-up', pad: 8 },
			{ at: 8.6, act: 'ringOff' }
		]
	},
	{
		id: 'b08',
		useOrder: true,
		suffix: '/receiving',
		scrollTop: 'Baby spinach',
		cards: [
			{ text: 'Sixteen cases of spinach came. Fifteen were quoted.', hold: 4.4 },
			{ text: '$477.16 paid against $410.40 promised.', hold: 4.2 }
		],
		moves: [
			{ at: 1.4, act: 'ring', text: 'clamshell extra', pad: 8 },
			{ at: 5.8, act: 'ringOnly', text: 'Frozen estimate', up: 1, pad: 10 },
			{ at: 9.4, act: 'ringOff' }
		]
	},
	{
		// NOT AUTOMATION, CONNECTION. The paid price becomes the live cost with
		// its source on record. Nothing here says CostCook buys, keys, or decides
		// anything: the person posted the delivery, and this is the result.
		id: 'b09',
		useIngredient: true,
		scrollTo: 'Saved price source',
		cards: [
			{ text: 'What you paid becomes the live cost.', hold: 4.0 },
			{ text: '$21.91 a kilo, with the receipt behind it.', hold: 4.2 }
		],
		moves: [
			{ at: 1.4, act: 'ring', text: '^Usable cost$', up: 1, pad: 10 },
			{ at: 5.6, act: 'ringOnly', text: 'Saved price source', up: 1, pad: 10 },
			{ at: 9.2, act: 'ringOff' }
		]
	},
	{
		id: 'b10',
		useOrder: true,
		scrollTop: 'Quoted 2026',
		cards: [
			{ text: 'Back on the order: you quoted $26.93 a guest.', hold: 4.2 },
			{ text: 'Today it reads $27.13. Up 0.7 percent.', hold: 4.0 },
			{ text: 'The quote you sent still holds.', hold: 3.6 }
		],
		moves: [
			{ at: 1.4, act: 'ring', text: 'Quoted 2026', up: 1, pad: 10 },
			{ at: 5.8, act: 'ringOnly', text: 'Today at current prices', up: 1, pad: 10 },
			{ at: 11.0, act: 'ringOff' }
		]
	},
	{
		id: 'b11',
		card: 'end',
		cards: [{ text: '', hold: 4.6 }]
	}
];

/**
 * How long a beat stays on screen, in seconds.
 *
 * Derived from its own cards now, not from a word count. The previous
 * generation computed one hold per beat as `1.0 + words/2.8 + 2.4`, clamped to
 * 7.5-13 seconds, which is why the cut read as a slideshow: every beat was a
 * still image held for eight to thirteen seconds with a paragraph under it.
 * A beat's length is the sum of its cards plus the lead-in and the tail, and
 * the motion is scheduled inside that window rather than bolted on after.
 *
 * LEAD_IN gives the eye the screen before any text lands on it. TAIL is the
 * part the reader feels: the last card is gone and they look back up at the
 * number it pointed at. That beat of looking is the entire reason someone
 * watches this rather than reading the page.
 */
export const beatLength = (beat) => {
	const cards = beat.cards.reduce((sum, card) => sum + card.hold, 0);
	// A title or end card has nothing to look at before its own text: it IS the
	// text. Giving it a lead-in buys three seconds of empty cream paper.
	return beat.card ? cards : LEAD_IN + cards + TAIL;
};

/** Whole-cut runtime in seconds, before the head and tail fades. */
export const runtime = () => BEATS.reduce((sum, beat) => sum + beatLength(beat), 0);

/** "1:57", for the chip, the hero link and the guard literal. */
export const runtimeLabel = () => {
	const total = Math.round(runtime());
	return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};
