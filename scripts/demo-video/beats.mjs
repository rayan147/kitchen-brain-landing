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
 * THE WORD COUNT IS FOR SENTENCES, NOT FOR NUMBERS. "Baldor: $690.82." is four
 * words and is one of the strongest cards in the cut. A card whose whole job is
 * to hold up one figure is finished when the figure is up; padding it out to
 * six words to satisfy a rule written for sentences makes it worse.
 *
 * ONE WORD FOR THE PIECE OF WORK, AND IT IS "JOB". The cut had three nouns for
 * the same thing — jobs, events, orders — and b04 used two of them four cards
 * apart. The rule, and the only two exceptions, both of which are the screen
 * overruling the writer:
 *
 *   job    the piece of work. The default, everywhere. It is the word the
 *          hero uses ("A catering order is one job pretending to be six"),
 *          the h2 uses and the end card uses, so the page and the footage say
 *          the same thing.
 *   event  ONLY in b04 before the submit. The form on screen is labelled
 *          Event 1 / Event 2 / Event 3 and the totals row the beat rings reads
 *          "Events 3". A card saying "jobs" over that panel is the exact
 *          card-contradicts-frame defect RC-37 exists to catch.
 *   order  ONLY in b04's last card, which lands after the viewer has watched a
 *          button reading "Create 3 orders" being clicked. The three events
 *          became three orders on screen; the noun changes because the app
 *          changed it.
 *
 * USE THE SCREEN'S OWN NOUNS. Not a synonym, not the word a writer would reach
 * for. The receiving screen says "3 lb clamshell" and two cards said "case",
 * so a viewer who read the card and then looked at the app was told one thing
 * and shown another, in the two beats whose entire subject is that this
 * software tells you the truth about what the truck did.
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
 * @property {string} [mailpitTo] Frame the capture inbox's message for this
 *                              recipient, rendered bare through /view/<id>.html
 *                              instead of inside the mail tool's own UI.
 * @property {number} [zoom]    Zoom applied to the page's own <main> after load.
 *                              NOT to documentElement, which would scale the
 *                              injected overlay with it.
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
		cards: [
			{ text: 'A year of jobs on the books.', hold: 2.2 },
			// THE CUT USED TO POINT AT A JOB IT NEVER NAMED. "The next one is
			// Tuesday" told the viewer when and never what, and then every beat
			// after it talked about "this order" as though they had been
			// introduced. Naming it here is what makes the next ninety seconds
			// one story instead of eight screenshots.
			{ text: 'Next up: the Alvarez-Whitman wedding.', hold: 2.6 },
			// THE WEEKDAY IS GONE ON PURPOSE, and this retires a whole bug class.
			// The marquee order is seeded three days out from the REAL clock, not
			// from HISTORY_SEED_DATE, so the weekday moved between capture runs:
			// the shipped cut said Monday because it was recorded on the 21st and
			// the very next capture put the same order on "Tue, Aug 25". "Three
			// days out" is what the row itself says ("in 3 days") and, because the
			// seed offset is what generates it, it is true on every future capture
			// without anyone having to remember to look.
			{ text: '180 guests, three days out.', hold: 2.4 }
		],
		moves: [
			{ at: 1.6, act: 'ring', row: 'Alvarez-Whitman', pad: 4 },
			{ at: 7.4, act: 'ringOff' }
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
		// WITHOUT THIS THE CARD IS CONTRADICTED BY ITS OWN FRAME. The marquee
		// order is confirmed by the app repo's capture spec (the receiving and
		// purchase-order beats need it to be), so the top of the order page
		// carries a "Confirmed · quantities frozen" badge at y=140 while the last
		// card of this beat says "This is before the quote goes out." Anchoring
		// on the totals panel pushes the badge to y=-83, off the top of the
		// frame, and every figure this beat rings is still in it.
		scrollTop: 'Live totals',
		cards: [
			{ text: '180 guests at $68 is $12,240 in the door.', hold: 4.4 },
			{ text: 'Food on that job: $4,847.96.', hold: 3.8 },
			{ text: '39.6 percent food cost. You wanted 30.', hold: 4.2 },
			// "It wants $89.78 a head" was the weakest card carrying the strongest
			// number. "It" is the software, and nobody cares what the software
			// wants; they care what they have to charge. The screen reads "Charge
			// at least $89.78 per guest to meet the 30% target" (RC-05).
			{ text: 'Charge $89.78 a head to hit 30.', hold: 3.6 },
			// Was "You know that before the quote goes out." — "that" points back
			// at a card which by then has left the screen, and there is no voice
			// to carry the reference across.
			{ text: 'This is before the quote goes out.', hold: 4.0 }
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
			{ text: "It's by vendor, in the packs you actually buy.", hold: 4.0 },
			{ text: 'Baldor: $690.82.', hold: 3.4 },
			// THE SUB-RECIPE PANEL WAS IN EVERY FRAME OF THIS BEAT AND NO CARD
			// EVER MENTIONED IT. It sits in the right rail at y=24..594 under this
			// beat's own anchor, so the cut has been showing a caterer the one
			// thing on the shop list that a spreadsheet cannot do and saying
			// nothing about it. Measured, not guessed: with scrollTop "Baldor" the
			// panel spans y=24..594 against a bar floor of 768.
			{ text: "Stock and mirepoix aren't shopping. They're batches.", hold: 4.0 },
			// The screen: "Mirepoix Base · 3 kg per batch · make 8 of 8" and
			// "House Beef Stock · 8 L per batch · make 6 of 6". The panel's own
			// description, legible behind the card, carries the part no card has
			// room for: "Enter completed batches to reduce purchasing."
			{ text: 'Eight of mirepoix. Six of stock.', hold: 3.6 }
		],
		moves: [
			{ at: 5.4, act: 'ring', text: '^BALDOR$|^Baldor$', up: 1, pad: 8 },
			{ at: 9.6, act: 'ringOnly', text: '690\\.82', pad: 10 },
			// up:3 is the whole rail card, heading and all three sub-recipes:
			// y=24..594. up:2 stops at the header and frames a claim with no
			// numbers under it.
			{ at: 13.4, act: 'ringOnly', text: '^Sub-recipe batches$', up: 3, pad: 8 },
			// up:2 off the name is the Mirepoix block: its name, "3 kg per batch",
			// the on-hand entry and "make 8 of 8". y=149..245.
			{ at: 17.4, act: 'ringOnly', text: '^Mirepoix Base$', up: 2, pad: 8 },
			{ at: 20.4, act: 'ringOff' }
		]
	},
	{
		// THE PREP LIST, WHICH THE CUT PROMISED IN ITS OWN TITLE CARD AND THEN
		// NEVER SHOWED. b00 reads "cost it, buy it, prep it, pack it" and the
		// footage went cost, buy, three-events, email, receive: the one verb with
		// a whole route behind it was the one verb with no frame behind it.
		//
		// It sits here because that is where the app puts it. OrderStageTabs is
		// "1 · Shop, 2 · Prep, 3 · Pack" and the beat before this one is Shop, so
		// the viewer watches the same order move one tab to the right rather than
		// being taken somewhere new. It also earns b04: a viewer who has seen one
		// order's prep list understands what "you shop and prep for all three at
		// once" is actually combining.
		//
		// Measured against the live page at 1600x1000 with this anchor, bar floor
		// y=768: "Prep list" y=24..53, "0 of 34 items complete" y=57..78, the
		// Braised Short Rib heading y=107..151, and its three rows at y=204..260
		// (beef), 260..316 (Mirepoix Base), 316..372 (House Beef Stock). Nothing
		// this beat rings comes near the bar.
		id: 'b03b',
		useOrder: true,
		suffix: '/prep',
		scrollTop: 'Prep list',
		// NO SUB-RECIPE CARD HERE, DELIBERATELY. The prep list does carry them as
		// their own tagged lines (Mirepoix Base 21.6 kg, House Beef Stock 43.2 L),
		// but b03 already spends two cards on sub-recipes and the two claims are
		// different jobs: the shop list gives you the batch COUNT so you can say
		// what you already made and buy less; the prep list gives you the batch
		// as a line to cook. Saying "sub-recipe" twice in twenty seconds spends
		// the beat's whole budget on a word the second card cannot advance.
		cards: [
			// The dish is the wedding's Braised Short Rib, the same recipe the rest
			// of the cut chains to, and the quantity is the one on screen: 75.6 kg
			// of boneless short rib.
			{ text: 'Thirty-four items, scaled to the job.', hold: 3.6 },
			{ text: 'Beef short rib: 75.6 kilos.', hold: 3.4 },
			// RC-24: the checks persist, which is the whole reason this is a screen
			// and not a printout, though it prints too. The ring stays on the beef
			// row through this card rather than moving to the 20px checkbox: the
			// row's own Done box is inside it, which is the picture the card wants.
			{ text: 'Tick them off as you cook.', hold: 3.4 }
		],
		moves: [
			// up:1 frames the "Prep list" heading and the "0 of 34 items complete"
			// line together, y=24..78, which is where the card's number is.
			{ at: 1.4, act: 'ring', text: 'items complete', up: 1, pad: 8 },
			{ at: 5.0, act: 'ringOnly', row: 'Beef short rib', pad: 6 },
			{ at: 10.6, act: 'ringOff' }
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
		//
		// WHAT WAS WRONG WITH THE SHIPPED VERSION, because it was three faults at
		// once and the owner saw all three as "it just flashes":
		//
		//   1. The cards went blank for two seconds after the submit. A click
		//      that navigates destroys the injected overlay and `inject` rebuilt
		//      it EMPTY, so any card still mid-hold died with the page. Fixed in
		//      capture-silent.mjs, which now restores the current card.
		//   2. "Pack stays split by event" played its whole 3.6s over the SHOP
		//      tab. The Pack click was scheduled at 11.4s and the card ended at
		//      11.4s, so the one claim that needed a picture never had one.
		//   3. All three rings were mistargeted: the first onto an element
		//      clipped by the top of the frame, the second onto a page heading
		//      while its card talked about a total, the third onto a table header
		//      row instead of the by-event cells underneath it.
		//
		// `scrollTop` is new and load-bearing. The prepare routine finishes by
		// clicking a date picker inside Event 3, which leaves the form scrolled
		// to its own bottom, so the beat opened on Event 2 and Event 3 with the
		// run header and the totals panel out of frame entirely. The cut spends
		// ninety seconds following one wedding and the single beat claiming
		// "three events" had no evidence of three anything on screen.
		//
		// THE ANCHOR IS THE TOTALS PANEL, NOT THE RUN HEADER, and the two are
		// mutually exclusive: the header's top and the "280" guest figure are 768
		// apart, which is exactly the height of the frame above the caption bar,
		// so no scroll position holds both. The panel wins because it is the only
		// thing on the page that proves the claim. Measured, not guessed:
		//   anchor "Production run total" -> Events/Guests row y=711..759 (clear),
		//   "Estimated margin" y=815..835 (behind the bar, and it must stay there:
		//   the ledger excludes margin claims and no card here makes one).
		scrollTop: 'Production run total',
		cards: [
			{ text: 'Three events the same week? Plan them as one run.', hold: 4.2 },
			{ text: 'Three events, 280 guests, one run.', hold: 3.4 },
			// Was "Shop and prep are totalled together." Totalled is an
			// accountant's word for a card read by a cook.
			{ text: 'You shop and prep for all three at once.', hold: 4.4 },
			{ text: 'Pack stays split. One stack per event.', hold: 4.4 },
			// The scope limit, and it now reads as the design decision it is
			// rather than as an apology for a shortfall. One button firing POs
			// across three orders is how a vendor gets a full delivery for a
			// wedding that was postponed this morning. See RC-36.
			//
			// "ORDER", NOT "JOB", AND THE FOOTAGE EARNS IT. This beat opened on
			// "events" because the form says Event 1/2/3, and closed on "job",
			// which is a third noun for the same three things inside one beat.
			// This card lands after the viewer has watched a button reading
			// "Create 3 orders" being clicked, so by the time it is on screen the
			// three events are three orders and the app changed the noun, not the
			// writer. It is also what the sr-only transcript already said.
			{ text: 'Each order still gets its own confirm and its own PO.', hold: 4.0 }
		],
		// KNOWN, AND LEFT ALONE: the Live quote panel prices event 1 at $4,883.40
		// of food, while the money beat above reads $4,847.96 for the same
		// wedding. They are different numbers because they are different things —
		// the quote panel estimates from the menu before an order exists, and the
		// order's own figure is costed off its lines once it does. No card names
		// the quote-panel figure, and the transcript names neither. If a card ever
		// does, the two have to be reconciled on screen or the beat has to be
		// framed to keep them apart.
		// Every ring here lands on data, never on a heading or a header row, and
		// the submit is now watchable: the button is scrolled into frame, the
		// cursor travels to it, and only then does it click. Previously the
		// cursor was parked at the top of the frame from the opening ring and
		// never moved, so the form simply became another page between two
		// frames and the creation the beat is about was never shown at all.
		// Measured against the real page at 1600x1000, not guessed. The submit
		// button sits ABOVE the run header, so after `scrollTop` it is off the top
		// of the frame and has to be scrolled back to; the two Pack rings are two
		// different dishes going to two different events, which is the only way a
		// still frame can prove "split by event" — one row shows one event, and
		// the ring sliding between two rows shows the split itself.
		//
		// The last card gets no ring on purpose. It is the scope limit, it is
		// about what the combined run does NOT do, and there is nothing on screen
		// to point at.
		moves: [
			// One ring, held across both opening cards, on the Events/Guests row:
			// "Events 3, Guests 280" and nothing else. Ringing the whole totals
			// panel one parent up would frame y=659..951, whose bottom half is
			// behind the caption bar and whose contents include the margin figure.
			{ at: 1.2, act: 'ring', text: '^Events$', up: 1, pad: 10 },
			{ at: 8.0, act: 'scroll', text: 'Create 3 orders', offset: -160, ms: 900 },
			{ at: 9.0, act: 'cursor', role: 'button', name: 'Create 3 orders' },
			{ at: 9.8, act: 'click', role: 'button', name: 'Create 3 orders', reinject: true },
			{ at: 11.4, act: 'ringOnly', text: '^BALDOR$|^Baldor$', up: 1, pad: 8 },
			{ at: 12.6, act: 'cursor', role: 'link', name: '^3 · Pack$|^Pack$' },
			{ at: 13.4, act: 'click', role: 'link', name: '^3 · Pack$|^Pack$', reinject: true },
			{ at: 14.8, act: 'ringOnly', row: 'Braised Short Rib', pad: 6 },
			{ at: 16.6, act: 'ringOnly', row: 'Breakfast Frittata', pad: 6 },
			{ at: 19.8, act: 'ringOff' }
		]
	},
	{
		// The inbox IS the product claim here: the purchase orders really send.
		// Mailpit is the demo's capture inbox, standing in for the vendor's, and
		// every seeded vendor address is under the reserved example.com.
		//
		// `prepare` deletes the sign-in mails first, and it is not cosmetic. The
		// capture signs in by magic link, so the inbox held seven messages of
		// which three were "Your CostCook sign-in link", under a card claiming
		// one message per vendor. There are four vendors. The audience for this
		// page arrives skeptical and counts; a claim that does not survive
		// counting the rows on screen is a claim that fails the truth pass.
		id: 'b05',
		path: 'http://localhost:8025/',
		prepare: 'inboxPOsOnly',
		cards: [{ text: 'Confirm it, and each vendor gets its own PO.', hold: 3.4 }]
	},
	{
		// Mailpit's own message view, NOT the app and not a customer's mail
		// client, used to put 60% of the frame on the tool and 40% on the thing
		// being claimed: a dark developer UI with "Delete all" in the sidebar and
		// a red "HTML Check 79%" badge beside the tab strip. A red failing-looking
		// percentage next to the feature you are claiming works.
		//
		// `mailpitTo` resolves the message by its recipient and renders it bare
		// through Mailpit's /view/<id>.html route: the purchase order as the
		// vendor's mail client would draw it, full frame, no tool around it. That
		// is a closer picture of the claim than the inbox screenshot was, as well
		// as a legible one. Matched on the vendor address rather than on the PO
		// number, which embeds the order id and is insertion order in a fresh
		// database.
		id: 'b06',
		mailpitTo: 'greenvalley',
		zoom: 1.65,
		cards: [
			{ text: "This is what Green Valley's inbox gets.", hold: 3.6 },
			{ text: 'Five items in whole packs. $516.08.', hold: 4.0 }
		],
		moves: [
			{ at: 5.0, act: 'ring', text: '^Subtotal$', up: 1, pad: 8 },
			{ at: 8.2, act: 'ringOff' }
		]
	},
	{
		id: 'b07',
		useOrder: true,
		suffix: '/receiving',
		scrollTop: 'Arugula',
		cards: [
			{ text: 'The truck is never perfect.', hold: 3.4 },
			// The screen: "Received 3 of 4 × 3 lb clamshell" and "1 × 3 lb clamshell
			// saved for purchasing follow-up". The pack is a clamshell, not a case.
			{ text: "One clamshell of arugula short. It's on the record.", hold: 4.6 }
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
			// This beat shipped with three words that are not on the screen behind
			// it. The app says "Ordered 15 × 3 lb clamshell · $410.40", "Delivered
			// 16 × 3 lb clamshell; ordered 15" and "$477.16 received value". It
			// never says quoted, never says promised, and never says case. Nobody
			// promised a caterer anything, which is the whole reason the beat
			// lands: you figured a number, and the truck came in different.
			{ text: 'You ordered fifteen clamshells of spinach.', hold: 3.6 },
			{ text: 'Sixteen came off the truck.', hold: 3.0 },
			{ text: '$477.16 received against $410.40 ordered.', hold: 4.2 }
		],
		// NEITHER OF THE OLD TARGETS EXISTED. This beat shipped ringing
		// 'clamshell extra' and 'Frozen estimate', and the receiving screen
		// contains neither string, so both moves threw, were swallowed by
		// runSchedule's catch, and the beat played with no ring at all. Every
		// string below was read off the live page.
		moves: [
			{ at: 1.4, act: 'ring', text: 'Ordered 15 ', pad: 8 },
			{ at: 5.0, act: 'ringOnly', text: 'Delivered 16 ', pad: 8 },
			// NOT 'received value': that string is on every receiving row, and
			// getByText().first() takes the topmost match in the document, which
			// is the arugula row from the beat before, sitting at y=-71.
			{ at: 8.4, act: 'ringOnly', text: '477\\.16', up: 1, pad: 10 },
			{ at: 11.4, act: 'ringOff' }
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
			{ text: 'What you actually paid is now the price.', hold: 4.0 },
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
			{ text: 'You quoted this job at $26.93 a guest.', hold: 4.2 },
			{ text: 'Today the same food costs $27.13.', hold: 4.0 },
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
