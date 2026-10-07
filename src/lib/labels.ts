/**
 * Kitchen label printing, as data. story: docs/stories/labels-printing.story.md
 *
 * AVAILABLE SINCE 2026-09-27. Read off sandbox/demo c01bf751 on 2026-08-29:
 * `src/routes/labels/{new,print/[id],shelf-life}`, `src/lib/domain/labeling/*`,
 * `src/lib/components/labels/*` (PRD #442). Until 2026-09-27 this comment said
 * the whole feature sat behind the `label_printing` release flag. That premise
 * was false (discovery, kitchen-brain ed6ff5f01; gap report F2):
 * `src/hooks.server.ts:507-514` gates only `/settings/labels`, while
 * `/labels/new` and `/labels/print/[id]` carry no flag guard and Prep and Pack
 * read the saved label settings or the defaults. On 2026-09-27 the owner
 * approved the RC-35 launch decision and stated FEATURE_LABEL_PRINTING_ENABLED
 * is on in production, so the recipe entry and Settings > Labels are on too.
 * Every surface reads the one word below, exactly as Sage does. Internal
 * provenance stays in this file and the release ledger instead of appearing
 * in public capture labels.
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
 * THE WORD. The owner changed RC-35 on 2026-09-27, so LABELS_STATUS is 'yes';
 * the menu chip, the /features badge, the /compare row, the FAQ, the tour and
 * the feature page all read it. The claim guard pins the word to 'yes' with
 * the ledger row; if the owner ever withdraws labels, both change together.
 *
 * No pattern: a table the sections render.
 */

import type { Verdict } from './comparison';

export const LABELS_STATUS = 'yes' as Verdict;

export const labelsStatusWord = LABELS_STATUS === 'yes' ? 'In the app today' : 'Coming';
const labelsAreComing = LABELS_STATUS !== 'yes';

/** One status flip, with each public surface receiving copy for its own job. */
export const labelsAvailability = {
	isComing: labelsAreComing,
	verdict: LABELS_STATUS,
	word: labelsStatusWord,
	featureLead: labelsAreComing ? 'Coming; not included today.' : 'In the app today.',
	pageSentence: labelsAreComing
		? 'Not included in the CostCook subscription you would start today. This feature remains marked Coming until that changes.'
		: 'In the CostCook subscription you would start today.',
	featureDetail: labelsAreComing
		? 'Tap Label on the pack list, choose how the batch is stored, settle a use-by date the app never guesses, count the containers, and print through the browser onto sticker sheets or thermal rolls. What the sticker said is frozen on the record for reprints. This is a preview of the planned workflow. Kitchen date labels are not included in the subscription today.'
		: 'Tap Label on the pack list, choose how the batch is stored, settle a use-by date the app never guesses, count the containers, and print through the browser onto sticker sheets or thermal rolls. What the sticker said is frozen on the record for reprints.',
	sectionBlurb: labelsAreComing
		? 'Calculate nutrition per portion and print an estimate. Review allergens and guest restrictions. Kitchen date labels are Coming.'
		: 'Nutrition panels and kitchen date labels, calculated or settled from the recipe and ready for the browser to print.',
	sectionLede: labelsAreComing
		? 'Nutrition facts are computed per recipe out of the ingredients you already entered, and print from the recipe as a sheet for label stock. Kitchen date and allergen stickers are a separate feature marked Coming and are not included today. Nutrition sheets are calculated estimates, not a retail-label compliance claim.'
		: 'Nutrition facts are computed per recipe out of the ingredients you already entered, and print from the recipe as a sheet for label stock. Kitchen date and allergen labels ask you to settle the storage and use-by facts before the browser prints them.',
	nutritionFaqCrosslink: labelsAreComing
		? 'Kitchen date labels are a separate feature marked Coming and are not included today; see the next answer.'
		: 'Kitchen date labels are a separate feature; see the next answer.',
	seoDescription: labelsAreComing
		? 'Date and allergen labels from the pack list: storage condition, a use-by date the cook settles, one label per container, printed through the browser and frozen on the record. Coming; not included in the subscription today.'
		: 'Date and allergen labels from the pack list: storage condition, a use-by date the cook settles, one label per container, printed through the browser and frozen on the record.',
	comparisonNote: labelsAreComing
		? 'Coming; not included today. The preview lets you choose storage, settle the use-by date, print one numbered label per container through the browser, and keep the frozen record for reprints. No direct printer connection.'
		: 'Choose storage, settle the use-by date, print one numbered label per container through the browser, and keep the frozen record for reprints. No direct printer connection.',
	faqStatus: labelsAreComing
		? [
				'Coming; not included in your trial or subscription. In the preview, tap Label on the pack list, a recipe, or an ingredient; choose the storage condition; settle the use-by date yourself; count the containers; and print through your browser onto measured sheet or roll stock. The recorded label is frozen for reprints.',
				'It is not included in the launch subscription. There is no direct connection to a label printer; the output is the browser print dialog.'
			]
		: [
				'Yes. Tap Label on the pack list, a recipe, or an ingredient; choose the storage condition; settle the use-by date yourself; count the containers; and print through your browser onto measured sheet or roll stock. The recorded label is frozen for reprints.',
				'There is no direct connection to a label printer; the output is the browser print dialog.'
			],
	homepageTradeoff: labelsAreComing
		? 'Date and allergen stickers from the pack list are built behind a release flag and not in the launch plan, so they remain marked Coming. Nutrition sheets print from the recipe today.'
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
			detail: 'On the pack list, a recipe or an ingredient. Each opens the same label form so you can review the same details before printing.'
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
			detail: 'One label per physical container, numbered 1 of 10, 2 of 10. The batch total on the pack list is not what is in each pan, and the dialog says so.'
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
	/** The media the sticker is sized for. Millimetres, so the preview is the printed size. */
	stock: [
		{ name: '30-up sheet', size: '2⅝ × 1 in (66 × 25.4 mm), 30 to a letter sheet', detail: 'An office printer and a sheet of stickers.' },
		{ name: '58 mm continuous roll', size: '2.3 in (58 mm) wide, cut to length', detail: 'Receipt-width thermal stock, one at a time at the bench.' },
		{ name: '62 mm continuous roll', size: '2.4 in (62 mm) wide, cut to length', detail: 'A wider desktop thermal roll for long dish names.' },
		{ name: '2 × 1 in die-cut roll', size: '2 × 1 in (50.8 × 25.4 mm)', detail: 'Pre-cut labels sized for most shipping-label printers.' },
		{ name: 'Describe your own', size: 'Any width from about ¾ to 8½ in (20 to 220 mm)', detail: 'Measure the label you buy. Nothing is tied to a brand.' }
	],
	/** Boundaries, each from the app's own code or screen. */
	notClaimed: [
		// The Coming sentence belongs under "What it is not" only while labels are Coming.
		...(labelsAreComing ? [labelsAvailability.pageSentence] : []),
		'The only output is the browser’s print dialog. A direct connection to a label printer is not built; the app cannot confirm that paper moved.',
		'A blank allergen line is not an all-clear, and the sticker preview says so. Allergens print only from confirmed evidence on the ingredient.',
		'The app never picks a use-by date. A saved shelf life, a number you enter, an exact date, or the made date only.'
	],
	// Re-shot 2026-10-07 from app 7a7e407d9 (owner's chosen source): the
	// homepage's wedding, labelled from the Pack tab. The made date is the day
	// of capture, so it sits weeks before the event.
	proof: {
		heroAlt: 'Label preview for Braised Short Rib for the Nair & Castellano wedding on Dec 19, refrigerated, with use-by and made dates and ten numbered containers.',
		/** The top of the Label dialog on a desktop. On phones the page shows the sticker instead. */
		dialog: {
			src: '/proof/labels/dialog-wide.png',
			width: 2080,
			height: 1692,
			alt: 'Label dialog for Braised Short Rib: four storage choices with Refrigerated selected, a shelf life of 7 days saved on the recipe, use by Oct 13, 2026, ten containers and ten labels, the 30-up sheet stock and a Print 10 labels button. Beside it, the sticker preview and the note that every ingredient was reviewed and none reported an allergen, and that stickers 2 to 10 are identical apart from their number.'
		},
		sticker: {
			src: '/proof/labels/sticker.png',
			width: 522,
			height: 216,
			alt: 'One sticker as previewed: Braised Short Rib, 300 portions batch total, refrigerated, USE BY OCT 13, 2026 in a box, made Oct 7, 2026, Nair & Castellano wedding, Dec 19, 2026, Harbor & Hearth Catering, M. Vega, 1 of 10.'
		},
		print: {
			src: '/proof/labels/print-sheet.png',
			width: 1544,
			height: 816,
			alt: 'The print view: ten identical stickers in three columns, Braised Short Rib, 300 portions batch total, refrigerated, USE BY OCT 13, 2026, made Oct 7, 2026, Nair & Castellano wedding, Dec 19, 2026, Harbor & Hearth Catering, M. Vega, numbered 1 of 10 to 10 of 10.'
		},
		stock: {
			src: '/proof/labels/stock-picker.png',
			width: 2208,
			height: 906,
			alt: 'Label stock settings with five choices: a 30-up sheet, 66 × 25.4 mm, selected; 58 mm and 62 mm continuous rolls; a 2 × 1 in die-cut roll; and Describe your own.'
		},
		caption:
			'Braised Short Rib for the Nair & Castellano wedding, refrigerated, with the seven-day shelf life saved on the recipe and ten containers recorded.'
	}
} as const;
