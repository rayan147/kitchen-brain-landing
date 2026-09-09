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
 * word below, exactly as Sage did. Internal provenance stays in this file and
 * the release ledger instead of appearing in public capture labels.
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
import { dietary } from './dietary';

import type { Verdict } from './comparison';

export const LABELS_STATUS = 'coming' as Verdict;

export const labelsStatusWord = LABELS_STATUS === 'yes' ? 'Available now' : 'Coming';
const labelsAreComing = LABELS_STATUS !== 'yes';

/** One status flip, with each public surface receiving copy for its own job. */
export const labelsAvailability = {
	isComing: labelsAreComing,
	verdict: LABELS_STATUS,
	word: labelsStatusWord,
	featureLead: labelsAreComing ? 'Built, behind a flag, marked Coming.' : 'Available now.',
	pageSentence: labelsAreComing
		? 'Not included in the CostCook subscription you would start today. This feature remains marked Coming until that changes.'
		: 'Available now in the CostCook subscription you would start today.',
	featureDetail: labelsAreComing
		? 'Tap Label on the prep list, choose how the batch is stored, settle a use-by date the app never guesses, count the containers, and print through the browser onto sticker sheets or thermal rolls. What the sticker said is frozen on the record for reprints. The feature is built behind a release flag and not included at launch, so it remains marked Coming.'
		: 'Tap Label on the prep list, choose how the batch is stored, settle a use-by date the app never guesses, count the containers, and print through the browser onto sticker sheets or thermal rolls. What the sticker said is frozen on the record for reprints.',
	sectionBlurb: labelsAreComing
		? 'The fifteen numbers an FDA panel carries, per recipe, and a sheet to print them on. Kitchen date labels are built and marked Coming.'
		: 'Nutrition panels and kitchen date labels, calculated or settled from the recipe and ready for the browser to print.',
	sectionLede: labelsAreComing
		? 'Nutrition facts are computed per recipe out of the ingredients you already entered, and print from the recipe as a sheet for label stock. Kitchen date and allergen labels are built in the app behind a release flag and not included at launch, so they are marked Coming below rather than folded into the shipped list.'
		: 'Nutrition facts are computed per recipe out of the ingredients you already entered, and print from the recipe as a sheet for label stock. Kitchen date and allergen labels ask you to settle the storage and use-by facts before the browser prints them.',
	nutritionFaqCrosslink: labelsAreComing
		? `Kitchen date and allergen stickers are a separate thing, built behind a release flag and marked Coming; see the next answer. ${dietary.faq}`
		: `Kitchen date and allergen stickers are a separate feature; see the next answer. ${dietary.faq}`,
	seoDescription: labelsAreComing
		? 'Date and allergen labels from the prep list: storage condition, a use-by date the cook settles, one label per container, printed through the browser and frozen on the record. Built behind a flag and marked Coming.'
		: 'Date and allergen labels from the prep list: storage condition, a use-by date the cook settles, one label per container, printed through the browser and frozen on the record.',
	comparisonNote: labelsAreComing
		? 'Not included at launch. The feature is built behind a release flag: choose storage, settle the use-by date, print one numbered label per container through the browser, and keep the frozen record for reprints. No direct printer connection.'
		: 'Choose storage, settle the use-by date, print one numbered label per container through the browser, and keep the frozen record for reprints. No direct printer connection.',
	faqStatus: labelsAreComing
		? [
				'Not in the app you would start today. The feature is built behind a release flag and remains marked Coming. Tap Label on the prep list, pack list, a recipe, or an ingredient; choose the storage condition; settle the use-by date yourself; count the containers; and print through your browser onto measured sheet or roll stock. The recorded label is frozen for reprints.',
				'It is not included in the launch subscription. There is no direct connection to a label printer; the output is the browser print dialog.'
			]
		: [
				'Yes. Tap Label on the prep list, pack list, a recipe, or an ingredient; choose the storage condition; settle the use-by date yourself; count the containers; and print through your browser onto measured sheet or roll stock. The recorded label is frozen for reprints.',
				'There is no direct connection to a label printer; the output is the browser print dialog.'
			],
	homepageTradeoff: labelsAreComing
		? 'Date and allergen stickers from the prep list are built behind a release flag and not in the launch plan, so they remain marked Coming. Nutrition sheets print from the recipe today.'
		: null
} as const;

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
		labelsAvailability.pageSentence,
		'The only output is the browser’s print dialog. A direct connection to a label printer is not built; the app cannot confirm that paper moved.',
		'A blank allergen line is not an all-clear, and the sticker preview says so. Allergens print only from confirmed evidence on the ingredient.',
		'The app never picks a use-by date. A saved shelf life, a number you enter, an exact date, or the made date only.'
	],
	proof: {
		heroAlt: 'Label preview for Braised Short Rib, refrigerated, with use-by and made dates and two numbered containers.',
		/** The top of the Label dialog on a desktop. On phones the page shows the sticker instead. */
		dialog: {
			src: '/proof/labels/dialog-wide.png',
			width: 2080,
			height: 616,
			alt: 'Label dialog for Braised Short Rib showing four storage choices, Refrigerated selected, and a two-sticker preview.'
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
			alt: 'Label stock settings showing five measured sheet, roll, and custom stock choices.'
		},
		caption:
			'Braised Short Rib for the Alvarez-Whitman wedding, refrigerated, with the FDA Food Code seven-day suggestion accepted and two containers recorded.'
	}
} as const;
