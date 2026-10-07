/**
 * The comparison table, as data.
 * Coming-plan revision: docs/stories/homepage-coming-plans.story.md
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
 *   'no'       CostCook only. We do not do this. The remaining rows stay,
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
 * VERIFIED 2026-08-30 against https://www.parsleysoftware.com/pricing and
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
 * The release ledger records the application SHA used for this truth pass.
 * Deployed feature flags and billing-portal configuration still require the
 * release-owner checks named there.
 */

import { SAGE_STATUS, sageDraftKinds, sageDraftKindsAnd, sageReadToolCount } from './sage';
import { labelsAvailability } from './labels';
import { comingPlans } from './coming-plans';
import { eventPayments } from './event-payments';
import { acceptanceBoundary, depositMethods } from './events';
import { dietary, allergenCount, allergenCountCapital } from './dietary';
import { spell } from './words';

export const VERIFIED_ON = 'August 30, 2026';

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

/**
 * THE SPREADSHEET COLUMN (RC-57). It is not a fourth product. A spreadsheet has
 * no pricing page and no tiers, so the rule that governs every other column
 * here cannot reach it, and it must not be given a version of that rule it
 * would fail.
 *
 * What this column reports is the READER'S LABOR, and nothing else. A blank
 * sheet does nothing; anything a sheet holds, somebody built and now maintains.
 * That is true without exception and it is not a claim about software, so it is
 * the only thing these cells are allowed to say.
 *
 *   'build'  You build it.   Structure and formula: costing, scaling, prep
 *                            lists, par levels.
 *   'key'    You key it in.  Data arriving or leaving by hand: the catalog,
 *                            the USDA figures, an invoice, an order typed into
 *                            an email.
 *
 * NO THIRD VALUE MAY EVER BE ADDED TO DENY A SPREADSHEET AN ABILITY. A sheet can send mail, a sheet can hold permissions,
 * a sheet has an API. Any cell denying that would be the same untrue claim this
 * project refused on the homepage, shipped on the one page whose whole
 * discipline is that no cell asserts a capability. Where a row genuinely costs
 * the reader nothing, it takes a `sheetNote` saying so, not a new value.
 *
 * NO STATUS GLYPH, EVER. CellMark renders in the CostCook column and nowhere
 * else. A glyph here would turn a description of work into a verdict, which is
 * the same mistake the competitor columns exist to avoid.
 *
 * THIS COLUMN READS build OR key ON ALL 44 ROWS, and that is not a clean sweep.
 * It describes labor, not merit: "You build it" is a real answer, and for a
 * kitchen with one repeating menu it is often the right one. On the three rows
 * CostCook marks No (lot tracking, fine-grained screen permissions, several
 * locations) the sheet is the BETTER cell, and the page does not hide it.
 */
export type SheetWork = 'build' | 'key';

export const sheetWork: Record<SheetWork, string> = {
	build: 'You build it',
	key: 'You key it in'
};

export interface Row {
	label: string;
	/** Optional product identity mark used beside a visible capability label. */
	icon?: 'sage';
	costcook: Verdict;
	/** Shown under the label. Required wherever a tick or a dash needs its edge. */
	note?: string;
	/** What the reader maintains if this lives in a spreadsheet. RC-57. */
	sheet: SheetWork;
	/** The edge on a spreadsheet cell, where the row costs the reader nothing. */
	sheetNote?: string;
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
				sheet: 'build',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'Recipe scaling and unit conversion',
				sheet: 'build',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'Sub-recipes that cost through to the plate',
				sheet: 'build',
				costcook: 'yes',
				parsley: NOT_LISTED,
				meez: 'Starter, $24'
			},
			{
				label: 'Menus costed per guest',
				sheet: 'build',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: NOT_LISTED
			},
			{
				label: 'Trim yield on the recipe line',
				sheet: 'build',
				costcook: 'yes',
				note: 'It moves what you buy, not only what it costs.',
				parsley: NOT_LISTED,
				meez: 'Starter, $24'
			},
			{
				label: 'Food cost percent against a target you set',
				sheet: 'build',
				costcook: 'yes',
				note: 'Food cost only, not labor or overhead. Where the app shows a food-only gross margin, it is not business margin.',
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
				sheet: 'key',
				sheetNote: 'Around 1,500 names, plus the vendor abbreviations, typed once and corrected forever after.',
				costcook: 'yes',
				note: 'Around 1,500 ingredient names and supplier abbreviations help match your paperwork. You supply the pack sizes and prices.',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'USDA yields, densities and unit weights',
				sheet: 'key',
				sheetNote: 'Looked up per ingredient, in the source, and kept beside it.',
				costcook: 'yes',
				note: 'Suggested ingredient conversions show their USDA source. Review and accept a suggestion before it fills a value.',
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
				sheet: 'key',
				costcook: 'yes',
				parsley: 'Chef, $129',
				meez: 'Starter, $24'
			},
			{
				label: 'Supplier order guides and price sheets',
				sheet: 'key',
				sheetNote: 'Every changed line, read off the sheet they sent and entered against the right pack.',
				costcook: 'yes',
				note: 'Applied row by row. A pack-size change refuses to apply quietly.',
				parsley: 'Chef, $129',
				meez: 'Premium, $199'
			},
			{
				label: 'Invoice scanning',
				sheet: 'key',
				costcook: 'yes',
				note: 'Upload a photo, PDF, spreadsheet or Word document, or paste text. Review the extracted records before saving.',
				parsley: '$69/month add-on; also listed in Enterprise',
				meez: 'Premium, $199'
			},
			{
				label: 'Where a price came from, on the price',
				sheet: 'build',
				sheetNote: 'A column beside each price, filled in by whoever changed it.',
				costcook: 'yes',
				note: 'The delivery record, invoice and date behind the price.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			}
		]
	},
	{
		title: 'The day itself',
		rows: [
			/* FRONT OF HOUSE, added 2026-09-27 (gap report S11; RC-61, RC-63 to
			   RC-67). The CostCook cells are production rows of
			   docs/research/2026-09-27-app-inventory.yaml. The competitor cells
			   were read off both pricing pages on 2026-09-27, NOT on VERIFIED_ON:
			   Parsley's Business tier lists "Calendar & Table Views", so the
			   calendar row names that tier; neither page lists inquiries,
			   proposals, agreements, deposits or a client book, so those read
			   NOT_LISTED, which means exactly that and nothing about either
			   product (RC-40). VERIFIED_ON stays August 30 until a full re-read
			   of every cell; the next RC-40 release check owns that. */
			{
				label: 'Inquiries and a follow-up pipeline',
				sheet: 'key',
				costcook: 'yes',
				note: 'Take an inquiry before the date is decided, and name who follows up and when.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'Proposals the client accepts on their phone',
				sheet: 'build',
				costcook: 'yes',
				note: `No login for the client. ${acceptanceBoundary}`,
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'Agreements sent for e-signature',
				sheet: 'build',
				costcook: 'yes',
				note: 'From your saved contract template, with the accepted proposal attached, or kept as a copy signed on paper.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'Event deposits tracked',
				sheet: 'key',
				costcook: 'yes',
				note: `What you asked for against what came in, paid by card from an email link or recorded by hand, as ${depositMethods}.`,
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: eventPayments.comparisonLabel,
				sheet: 'key',
				costcook: eventPayments.verdict,
				note: eventPayments.comparisonNote,
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'A client book',
				sheet: 'build',
				costcook: 'yes',
				note: 'Contacts, venues with access notes, and each client\u2019s events and orders, for owners and managers.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'A calendar of booked orders',
				sheet: 'build',
				costcook: 'yes',
				note: 'Each day counts its orders and vans against the limits you set, and an order says whether its day has room.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Prep lists scaled to the job',
				sheet: 'build',
				costcook: 'yes',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Production plans across several events',
				sheet: 'build',
				costcook: 'yes',
				note: 'Two to twelve events plan as one run. Each still confirms and buys on its own.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Shopping by supplier in whole packs',
				sheet: 'build',
				costcook: 'yes',
				parsley: 'Business, $379',
				meez: 'Starter, $24'
			},
			{
				label: 'Pack lists with equipment',
				sheet: 'build',
				costcook: 'yes',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'Purchase orders emailed to your suppliers',
				sheet: 'key',
				sheetNote: 'The rows go into one message per supplier.',
				costcook: 'yes',
				note: 'You see the exact body that was sent.',
				parsley: NOT_LISTED,
				meez: NOT_LISTED
			},
			{
				label: 'Receiving against what you ordered',
				sheet: 'key',
				sheetNote: 'What arrived comes back in by hand, against the order you sent.',
				costcook: 'yes',
				note: 'Record what arrived, review quantities and prices, then save the delivery to record the purchase.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Inventory',
				sheet: 'build',
				costcook: 'yes',
				note: 'A physical count updated by recorded deliveries, waste and packed orders. Old counts are marked for checking.',
				parsley: 'Business, $379',
				meez: 'Pro, $119'
			},
			{
				/* Verified against sandbox/demo, the marketed release, after the
				   catalog and nutrition rows were both wrong off a stale local
				   branch. Par levels ship: core/inventory-planning.ts carries
				   below-par / at-or-above-par / unevaluable / no-par, judged
				   only from a trusted count. Since 2026-09-27 the buying row below
				   is a yes too: Build shopping list reads confirmed events and
				   par (e2e/buy-to-par.spec.ts). RC-43. */
				label: 'Par levels per ingredient',
				sheet: 'build',
				costcook: 'yes',
				note: 'A floor you set, and the shelf is flagged when it falls under. Judged only from a count it can trust, never from a guess.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Buying that tops up to par',
				sheet: 'build',
				costcook: 'yes',
				note: 'Inventory > Build shopping list builds what to buy for confirmed events and your par, by supplier. Only a recent count is taken off the buy.',
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
				sheet: 'key',
				sheetNote: `${allergenCountCapital} allergens per ingredient, then rolled up to the recipe yourself.`,
				costcook: 'yes',
				note: `The ${allergenCount} major US allergens, rolled up from ingredient to recipe, on the pack list. A name match alone does not confirm allergen information. A chef override needs a written reason.`,
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
				sheet: 'key',
				sheetNote: 'Fifteen nutrients per ingredient before anything totals.',
				costcook: 'yes',
				note: 'All fifteen nutrients an FDA label carries, computed per recipe from USDA FoodData Central profiles. It tells you when a profile or a conversion is missing instead of quietly totalling an incomplete dish.',
				parsley: 'Chef Plus, $189',
				meez: 'Enterprise, custom'
			},
			{
				label: 'Printed USDA nutrition labels',
				sheet: 'build',
				/* Yes since 2026-08-29 (RC-50); develop gates it on confirmed sources and
				   no blank lines (the note says so). Kitchen date labels: the row below. */
				costcook: 'yes',
				note: 'Printed from the recipe through the browser onto label stock, once every source is confirmed and no line is blank. The sheet says it is a calculated estimate, not a retail-label compliance claim.',
				parsley: 'Chef Plus, $189',
				meez: 'Enterprise, custom'
			},
			{
				/* WAS A COMING ROW UNTIL 2026-09-09 and it should not have been by
				   then: the capability shipped and this row was telling a reader
				   CostCook cannot do a thing it does. RC-60. The note keeps the two
				   caps in the same breath as the yes, because a row that only says
				   yes here is the row a demo call takes apart. */
				label: dietary.comparisonLabel,
				sheet: 'key',
				costcook: dietary.verdict,
				note: dietary.comparisonNote,
				parsley: 'Chef Plus, $189',
				meez: NOT_LISTED
			},
			{
				label: 'Lot tracking and FSMA 204',
				sheet: 'build',
				sheetNote: 'CostCook does not support this. In a spreadsheet, you would build and check it yourself.',
				costcook: 'no',
				note: 'CostCook does not provide lot tracking. Check this requirement before choosing a tool.',
				parsley: 'Enterprise, call for quote',
				meez: NOT_LISTED
			},
			{
				label: 'Kitchen label printing',
				sheet: 'build',
				costcook: labelsAvailability.verdict,
				note: labelsAvailability.comparisonNote,
				parsley: '$59/month add-on',
				meez: NOT_LISTED
			}
		]
	},
	{
		title: 'Team, and what it connects to',
		rows: [
			{
				label: 'Unlimited teammates',
				sheet: 'build',
				sheetNote: 'The file shares for free. Two people in the same cell at once is the part you manage.',
				costcook: 'yes',
				note: 'During launch, on the one plan. No per-device count.',
				parsley: 'Business, $379',
				meez: 'Pro, $119, five active devices'
			},
			{
				label: 'Role-aware sensitive actions',
				sheet: 'build',
				costcook: 'yes',
				note: 'Owner, Manager and Staff have different permissions for billing, team setup, recipe publishing and Sage approvals. Staff can open recipe costs and Analytics; order money, client names on Today and the Clients book are kept to owners and managers.',
				parsley: 'Business, $379',
				meez: 'Starter, $24'
			},
			{
				label: 'Fine-grained screen permissions',
				sheet: 'build',
				sheetNote: 'CostCook does not support this. In a spreadsheet, you would build and check it yourself.',
				costcook: 'no',
				note: 'No custom roles or per-screen permission grid. A teammate on Staff can open recipe costs and Analytics.',
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: comingPlans.spanish.comparisonLabel,
				sheet: 'key',
				costcook: comingPlans.spanish.verdict,
				note: comingPlans.spanish.comparisonNote,
				parsley: 'Business, $379',
				meez: NOT_LISTED
			},
			{
				label: 'Several locations',
				sheet: 'build',
				sheetNote: 'CostCook does not support this. In a spreadsheet, you would build and check it yourself.',
				costcook: 'no',
				note: 'One subscription covers one kitchen.',
				parsley: 'Enterprise, call for quote',
				meez: 'Premium, $199; added recipe-viewer locations $60/month each'
			},
			{
				label: 'Point of sale',
				sheet: 'build',
				costcook: 'coming',
				note: 'Square is not available today. CostCook does not send menus to your till or import its sales.',
				parsley: 'Business, $379',
				meez: 'Enterprise, custom'
			},
			{
				label: 'Accounting',
				sheet: 'build',
				costcook: 'coming',
				note: 'QuickBooks Online is not available today. There is no accounting sync and no release date is promised.',
				parsley: NOT_LISTED,
				meez: 'Restaurant365 sync, $199/month plus setup fee'
			},
			{
				label: 'An API to build against',
				sheet: 'build',
				costcook: 'coming',
				parsley: 'Business, $379',
				meez: 'Enterprise, custom'
			},
			{
				label: 'An assistant that answers from your numbers',
				sheet: 'build',
				icon: 'sage',
				// Read from src/lib/sage.ts, the one place the word may change (RC-49).
				costcook: SAGE_STATUS,
				note: `Sage is available now. It reads your records with ${spell(sageReadToolCount, { compound: true })} read-only tools, shows its sources, helps during setup and can prepare ${spell(sageDraftKinds.length)} kinds of draft for a manager or owner to approve: ${sageDraftKindsAnd}.`,
				parsley: NOT_LISTED,
				meez: 'Enterprise, custom'
			},
			{
				label: 'Read previously loaded orders offline',
				sheet: 'build',
				costcook: 'yes',
				note: 'Previously loaded order pages stay readable offline and show when they were saved. Reconnect to make changes. With a connection, core pages remain readable without JavaScript.',
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
