/**
 * The comparison table, as data.
 *
 * WHY THIS FILE EXISTS AT ALL. docs/release-claim-ledger.md excludes
 * "competitor comparisons ... without owner-approved evidence". The owner asked
 * for this page on 2026-08-23 and that request IS the approval; it is recorded
 * as RC-40 rather than left as a comment. If the approval is ever withdrawn,
 * this file and /compare come off together.
 *
 * WHAT A CELL IS ALLOWED TO MEAN. This is the whole discipline of the page.
 * The only defensible claim about another company's product is what their own
 * pricing page says on a given day. So:
 *
 *   'yes'      CostCook only. It ships in the build you would start today.
 *   'coming'   CostCook only. Being built, not in that build. Never a tick.
 *   'no'       CostCook only. We do not do this. There are six of them and
 *              they stay, because a table where one column is ticks all the way
 *              down reads as marketing to the exact reader we want.
 *
 * THE MARK IS FOR THE COSTCOOK COLUMN AND NOWHERE ELSE. /compare renders these
 * three statuses as a hairline glyph beside the word (CellMark.astro). A
 * competitor cell never gets one. A glyph beside "Not listed" would round a
 * hedge about someone's pricing page into a verdict about their product, which
 * is the single thing this whole file exists to prevent. The columns look
 * asymmetric on purpose; check-landing-claims enforces it.
 *   a string   A competitor cell. Either the tier that lists it and its price,
 *              or NOT_LISTED. It means "not named on their pricing page on the
 *              verification date". It does NOT mean the product cannot do it,
 *              and no copy on the page may round it to that.
 *
 * ONE BILLING BASIS: MONTHLY, EVERYWHERE. meez publishes two numbers per tier
 * and the annual-prepay one is the number they lead with ($19, $89, $179).
 * CostCook is billed monthly, so every figure here is the monthly-billed one
 * ($24, $119, $199) and the column header says so. Putting $49 monthly beside
 * $179 annual-prepay would be the first thing a skeptical caterer caught.
 *
 * VERIFIED 2026-08-23 against https://www.parsleysoftware.com/pricing and
 * https://www.getmeez.com/pricing. Both are living pages. RC-40's release check
 * is to re-read both and update VERIFIED_ON before this ships or ships again.
 *
 * THE COSTCOOK COLUMN IS READ OFF sandbox/demo, THE MARKETED RELEASE, AND
 * NOTHING ELSE. This is not a style preference, it is the correction that
 * produced three wrong cells in one afternoon. The catalog row, the nutrition
 * row and the par row all shipped as "no" because they were checked against a
 * stale local branch that happened to be checked out. A feature worktree, a
 * local branch, and develop are all the wrong answer here: the only question a
 * cell answers is whether a visitor who starts today gets the thing.
 *
 * NOTE FOR THE RELEASE OWNER: the ledger's demo-base pin is 6a29e88e and
 * sandbox/demo is now at b858a483. The pin needs refreshing before deployment,
 * per the release-check rule at the top of the ledger.
 */

import { SAGE_STATUS } from './sage';

export const VERIFIED_ON = 'August 23, 2026';

export const NOT_LISTED = 'Not listed';

export const competitors = [
	{
		key: 'parsley',
		name: 'Parsley',
		href: 'https://www.parsleysoftware.com/pricing',
		/* Their page shows one price per tier with no annual alternative. */
		basis: 'Billed monthly'
	},
	{
		key: 'meez',
		name: 'meez',
		href: 'https://www.getmeez.com/pricing',
		/* Their headline figures are annual-prepay. These are the monthly ones. */
		basis: 'Billed monthly'
	}
] as const;

export type Verdict = 'yes' | 'no' | 'coming';

export interface Row {
	label: string;
	costcook: Verdict;
	/** Shown under the label. Required wherever a tick or a dash needs its edge. */
	note?: string;
	parsley: string;
	meez: string;
}

export interface RowGroup {
	title: string;
	rows: Row[];
}

// Considered Strategy; not used because rivals and rows vary as dated evidence
// data, not as interchangeable behavior selected by the page at runtime.
export const comparison: RowGroup[] = [
	{
		title: 'Recipes and costing',
		rows: [
			{
				label: 'Recipe costing and pricing',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'Recipe scaling and unit conversion',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'Sub-recipes that cost through to the plate',
				costcook: 'yes',
				parsley: NOT_LISTED,
				meez: 'Starter, $24'
			},
			{
				label: 'Menus costed per guest',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: NOT_LISTED
			},
			{
				label: 'Trim yield on the recipe line',
				costcook: 'yes',
				note: 'It moves what you buy, not only what it costs.',
				parsley: NOT_LISTED,
				meez: 'Starter, $24'
			},
			{
				label: 'Food cost percent against a target you set',
				costcook: 'yes',
				note: 'Food cost. Not labor, not overhead, so not business margin.',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				/* Corrected 2026-08-23. This shipped as a "no" for one afternoon
				   because the catalog was checked on a stale local branch. It is
				   on origin/main: 1,478 entries across eleven categories, 413
				   carrying vendor aliases, in src/lib/reference-data/catalog/,
				   with scripts/seed-catalog-embeddings.ts as the embedding
				   target that intake matches against. RC-41. */
				label: 'A preloaded ingredient catalog',
				costcook: 'yes',
				note: 'Around 1,500 canonical names with the vendor abbreviations that resolve to them, so an invoice reading chix breast lands on chicken breast. Names and aliases, not prices: a preloaded price would be a number nobody chose sitting on your plate cost.',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'USDA yields, densities and unit weights',
				costcook: 'yes',
				note: 'Offered as chips you tap to fill, each sourced to its FoodData Central or Handbook 102 entry. Nothing is assumed until you accept it.',
				parsley: NOT_LISTED,
				meez: 'Starter, $24'
			}
		]
	},
	{
		title: 'Getting prices in',
		rows: [
			{
				label: 'AI recipe import',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'Supplier order guides and price sheets',
				costcook: 'yes',
				note: 'Applied row by row. A pack-size change refuses to apply quietly.',
				parsley: 'Chef, $129',
				meez: 'Premium, $199'
			},
			{
				label: 'Invoice scanning',
				costcook: 'yes',
				note: 'Photo, PDF, spreadsheet, Word, or pasted text, all staged for you to confirm.',
				parsley: 'Enterprise, call for quote',
				meez: 'Premium, $199'
			},
			{
				label: 'Where a price came from, on the price',
				costcook: 'yes',
				note: 'Which receiving, which invoice, which date.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			}
		]
	},
	{
		title: 'The day itself',
		rows: [
			{
				label: 'Prep lists scaled to the job',
				costcook: 'yes',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Production plans across several events',
				costcook: 'yes',
				note: 'Two to twelve events plan as one run. Each still confirms and buys on its own.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Shopping by supplier in whole packs',
				costcook: 'yes',
				parsley: 'Business, $379',
				meez: 'Starter, $24'
			},
			{
				label: 'Pack lists with equipment',
				costcook: 'yes',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'Purchase orders emailed to your suppliers',
				costcook: 'yes',
				note: 'You see the exact body that was sent.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'Receiving against what you ordered',
				costcook: 'yes',
				note: 'Short, over, substitute, missing, unexpected. Ticking it off writes the purchase.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Inventory',
				costcook: 'yes',
				note: 'Computed from dated movements, and it says out loud when a count is stale.',
				parsley: 'Business, $379',
				meez: 'Pro, $119'
			},
			{
				/* Verified against sandbox/demo, the marketed release, after the
				   catalog and nutrition rows were both wrong off a stale local
				   branch. Par levels ship: core/inventory-planning.ts carries
				   below-par / at-or-above-par / unevaluable / no-par, judged
				   only from a trusted count. Buying does not read them, so the
				   two halves are separate rows. RC-43. */
				label: 'Par levels per ingredient',
				costcook: 'yes',
				note: 'A floor you set, and the shelf is flagged when it falls under. Judged only from a count it can trust, never from a guess.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Buying that tops up to par',
				costcook: 'no',
				note: 'Shopping is what the jobs on the books need minus what the shelf can be trusted for. It will not order you back up to a par level.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			}
		]
	},
	{
		title: 'Compliance and labels',
		rows: [
			{
				label: 'Allergen tagging',
				costcook: 'yes',
				note: 'Fourteen allergens, rolled up from ingredient to recipe, on the pack list. Catalog entries carry curated allergen facts as an allow-list, so a name match never invents food-safety data. A chef override needs a written reason.',
				parsley: 'Chef Plus, $189',
				meez: 'Enterprise, custom'
			},
			{
				/* Corrected 2026-08-23, same stale-branch mistake as the catalog
				   row. Nutrition is on origin/main: src/lib/core/nutrition.ts
				   computes all fifteen FDA label nutrients per recipe, with
				   profiles pulled from USDA FoodData Central. Split in two
				   because the computed facts ship and the printed panel does
				   not. RC-42. */
				label: 'Full nutrition facts',
				costcook: 'yes',
				note: 'All fifteen nutrients an FDA label carries, computed per recipe from USDA FoodData Central profiles. It tells you when a profile or a conversion is missing instead of quietly totalling an incomplete dish.',
				parsley: 'Chef Plus, $189',
				meez: 'Enterprise, custom'
			},
			{
				label: 'Printed USDA nutrition labels',
				/* Moved from coming to yes on 2026-08-29 (RC-50): the print page is on
				   sandbox/demo with no flag. Browser print; the printer integration is
				   the "Kitchen label printing" row below and stays coming. */
				costcook: 'yes',
				note: 'Printed from the recipe through the browser onto label stock. The sheet says it is a calculated estimate, not a retail-label compliance claim.',
				parsley: 'Chef Plus, $189',
				meez: 'Enterprise, custom'
			},
			{
				label: 'Dietary characteristics',
				costcook: 'no',
				note: 'A recipe shows the heading and tells you plainly that it has not been assessed. Nothing is inferred from an ingredient name.',
				parsley: 'Chef Plus, $189',
				meez: NOT_LISTED
			},
			{
				label: 'Lot tracking and FSMA 204',
				costcook: 'no',
				note: 'Built for caterers, not for a facility under a traceability rule.',
				parsley: 'Enterprise, call for quote',
				meez: NOT_LISTED
			},
			{
				label: 'Kitchen label printing',
				costcook: 'coming',
				note: 'Built in the app behind a release flag and not included at launch: storage condition, a use-by date the cook settles, one numbered label per container, printed through the browser onto sheet or roll stock and frozen for reprints. No direct printer connection.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			}
		]
	},
	{
		title: 'Team, and what it connects to',
		rows: [
			{
				label: 'Unlimited teammates',
				costcook: 'yes',
				note: 'During launch, on the one plan. No per-device count.',
				parsley: 'Business, $379',
				meez: 'Pro, $119, five active devices'
			},
			{
				label: 'Tiered user access',
				costcook: 'no',
				note: 'Owner and manager roles gate setup. There is no fine-grained permission grid.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'English and Spanish',
				costcook: 'no',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Several locations',
				costcook: 'no',
				note: 'One kitchen workspace.',
				parsley: 'Enterprise, call for quote',
				meez: NOT_LISTED
			},
			{
				label: 'Point of sale',
				costcook: 'coming',
				note: 'Square is being built.',
				parsley: 'Business, $379',
				meez: 'Enterprise, custom'
			},
			{
				label: 'Accounting',
				costcook: 'coming',
				note: 'QuickBooks is being built.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'An API to build against',
				costcook: 'coming',
				parsley: 'Business, $379',
				meez: 'Enterprise, custom'
			},
			{
				label: 'An assistant that answers from your numbers',
				// Read from src/lib/sage.ts, the one place the word may change (RC-49).
				costcook: SAGE_STATUS,
				note: 'Sage is available now. It reads your records, shows its sources, helps during setup and can prepare a shopping-list draft for you to approve.',
				parsley: NOT_LISTED,
				meez: 'Enterprise, custom'
			},
			{
				label: 'Works with no signal, and with no JavaScript',
				costcook: 'yes',
				note: 'Order pages keep working in the walk-in, marked with when they were cached.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			}
		]
	}
];

/** Counted, never typed, so the prose under the table cannot drift from it. */
export const rowCount = comparison.reduce((sum, group) => sum + group.rows.length, 0);
export const costcookYes = comparison.reduce(
	(sum, group) => sum + group.rows.filter((row) => row.costcook === 'yes').length,
	0
);
export const costcookNo = comparison.reduce(
	(sum, group) => sum + group.rows.filter((row) => row.costcook === 'no').length,
	0
);
