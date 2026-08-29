/**
 * Kitchen label printing, as data. story: docs/stories/labels-printing.story.md
 *
 * BUILT, BEHIND A FLAG, AND NOT IN THE LAUNCH PLAN. Read off sandbox/demo
 * c01bf751 on 2026-08-29: `src/routes/labels/{new,print/[id],shelf-life}`,
 * `src/lib/domain/labeling/*`, `src/lib/components/labels/*` (PRD #442).
 * The whole feature sits behind the `label_printing` release flag
 * (`src/lib/server/features/access.ts`, env `FEATURE_LABEL_PRINTING_ENABLED`,
 * default off, per-business override), and RC-35 is the owner's decision that
 * it is not included at launch. So every surface prints Coming from the one
 * word below, exactly as Sage did, and the captures say SANDBOX BUILD.
 *
 * WHAT MAY NOT BE SAID. That a label reaches a printer on its own: the only
 * output today is the browser's print dialog (`src/lib/labels/transport.ts`,
 * OUTPUT_METHODS = ['browser']; the direct-transport seam is designed, not
 * built). That a blank allergen line is an all-clear (the app says the
 * opposite on the sticker preview). That the app picks a use-by date for
 * you (a label never guesses one; the cook chooses, or prints the made date
 * only). No printer brand is endorsed: the stock profiles are measured in
 * millimetres and the app says nothing is tied to a brand.
 *
 * FLIPPING THE WORD. When the owner changes RC-35 and the deployed default
 * is on, set LABELS_STATUS to 'yes' here; the menu chip, the /features badge,
 * the /compare row, the FAQ and the feature page all read it. The claim guard
 * pins the word to 'coming' until the ledger row changes with it.
 *
 * No pattern: a table the sections render.
 */
import type { Verdict } from './comparison';

export const LABELS_STATUS = 'coming' as Verdict;

export const labelsStatusWord = LABELS_STATUS === 'yes' ? 'Available now' : 'Coming';

export const labels = {
	name: 'Kitchen labels',
	verified: { sha: 'c01bf751', branch: 'sandbox/demo', on: '2026-08-29' },
	href: '/features/labels-and-printing',
	/** The app's own words for the one hard thing, from the dialog. */
	tagline: 'Choose the storage condition and how many containers, then print. Nothing prints until you choose.',
	/** What a cook does, in the order the dialog asks. Each traces to a route or module named above. */
	steps: [
		{
			lead: 'Tap Label where the food is.',
			detail: 'On the prep list, the pack list, a recipe or an ingredient. All four post to one endpoint, so a sticker printed at the bench cannot differ from one printed at pack-out.'
		},
		{
			lead: 'Say how it is stored.',
			detail: 'Refrigerated, frozen, thawed or opened. There is no default: the app calls it the one thing it cannot know, and nothing prints until you choose.'
		},
		{
			lead: 'Settle the use-by date.',
			detail: 'A saved shelf life for that recipe or ingredient, a number of days, an exact date, or the made date only. Where the app has a sourced suggestion it offers one, and tapping it is what saves the rule. A label never guesses a date.'
		},
		{
			lead: 'Count the containers.',
			detail: 'One label per physical container, numbered 1 of 2, 2 of 2. The batch total on the prep list is not what is in each tub, and the dialog says so.'
		},
		{
			lead: 'See exactly what will print.',
			detail: 'Name, batch and storage word, use-by and made dates, the event and its date on an order-tied label, the kitchen name, who printed it. Confirmed allergens print as Contains and May contain; with no allergen data the sticker prints no line, and the preview says a blank label is not an all-clear.'
		},
		{
			lead: 'Print, and it is on the record.',
			detail: 'The print opens your browser’s print dialog on stock the kitchen chose once in Settings. What the sticker said is frozen at that moment, so a soaked one reprints unchanged even if the recipe has moved since.'
		}
	],
	/** The media the sticker is sized for. Millimetres, so the preview is the print geometry. */
	stock: [
		{ name: '30-up sheet', size: '66 × 25.4 mm, 30 to a letter sheet', detail: 'An office printer and a sheet of stickers.' },
		{ name: '58 mm continuous roll', size: '58 mm wide, cut to length', detail: 'Receipt-width thermal stock, one at a time at the bench.' },
		{ name: '62 mm continuous roll', size: '62 mm wide, cut to length', detail: 'A wider desktop thermal roll for long dish names.' },
		{ name: '2 × 1 in die-cut roll', size: '50.8 × 25.4 mm', detail: 'Pre-cut labels sized for most shipping-label printers.' },
		{ name: 'Describe your own', size: 'Any width from 20 to 220 mm', detail: 'Measure the label you buy. Nothing is tied to a brand.' }
	],
	/** Boundaries, each from the app's own code or screen. */
	notClaimed: [
		'It is behind a release flag and is not included in the launch subscription. Every mention on this site says Coming until that changes.',
		'The only output is the browser’s print dialog. A direct connection to a label printer is designed as a seam in the code and is not built; the app cannot confirm that paper moved.',
		'A blank allergen line is not an all-clear, and the sticker preview says so. Allergens print only from confirmed evidence on the ingredient.',
		'The app never picks a use-by date. A saved shelf life, a number you enter, an exact date, or the made date only.'
	],
	proof: {
		/** The top of the Label dialog on a desktop. On phones the page shows the sticker instead. */
		dialog: {
			src: '/proof/labels/dialog-wide.png',
			width: 2080,
			height: 616,
			alt: 'The top of the Label Braised Short Rib dialog. Storage condition: the one thing the app can’t know, no default, this is a real choice. Four choices: Refrigerated, into the walk-in, selected with a tick; Frozen, into the freezer; Thawed, out of the freezer; Opened, bag or tub broken into. Beside it, The sticker: exactly what will print, 2 stickers, numbered. The sticker reads Braised Short Rib, 360 portions batch total, refrigerated, USE BY SEP 4, 2026, made Aug 29, 2026, Alvarez-Whitman Wedding, Tue Sep 1, Maple and Main Catering, M. Vega, 1 of 2. Under it: no allergen data for this recipe, so the sticker states none; a blank label is not an all-clear. Stickers 2 to 2 are identical apart from their number.'
		},
		sticker: {
			src: '/proof/labels/sticker.png',
			width: 522,
			height: 216,
			alt: 'One sticker as previewed: Braised Short Rib, 360 portions batch total, refrigerated, USE BY SEP 4, 2026 in a box, made Aug 29, 2026, Alvarez-Whitman Wedding, Tue Sep 1, Maple and Main Catering, M. Vega, 1 of 2.'
		},
		print: {
			src: '/proof/labels/print-sheet.png',
			width: 1044,
			height: 240,
			alt: 'The print view: two identical stickers side by side, Braised Short Rib, 360 portions batch total, refrigerated, USE BY SEP 4, 2026, made Aug 29, 2026, Alvarez-Whitman Wedding, Tue Sep 1, Maple and Main Catering, M. Vega, numbered 1 of 2 and 2 of 2.'
		},
		stock: {
			src: '/proof/labels/stock-picker.png',
			width: 1732,
			height: 906,
			alt: 'The label stock picker in Settings, five radio choices. 30-up sheet, 66 by 25.4 mm, 30 to a sheet, selected: 66 by 25 mm, 30 to a letter sheet, works with a standard office printer. 58 mm continuous roll, 58 mm wide, cut to length, one at a time: receipt-width thermal stock, prints one sticker at a time at the bench. 62 mm continuous roll: a wider desktop thermal roll with more room for long dish names. 2 by 1 inch die-cut roll, 50.8 by 25.4 mm: pre-cut thermal labels sized for most shipping-label printers. Describe your own: measure the label you buy; any stock works, nothing here is tied to a brand.'
		},
		caption:
			'Captured from the running app in the tour’s demo kitchen on the sandbox build, 2026-08-29, with the label_printing flag turned on for the demo business (scripts/capture-labels-proof.mjs). Braised Short Rib for the Alvarez-Whitman wedding, refrigerated, the FDA Food Code seven-day suggestion accepted, two containers.'
	}
} as const;
