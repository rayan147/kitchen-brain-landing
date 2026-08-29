import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFile(join(root, path), 'utf8');

// THIS FILE IS HAND-FORMATTED: tabs, single quotes, and the repo carries no
// prettier config. `npx prettier --write` on it therefore applies the defaults
// (two spaces, double quotes) and rewrites about 190 lines that nobody changed.
// That happened on 2026-08-27 and had to be undone with
// `--use-tabs --single-quote --print-width 100`. Format by hand, or pass those.

const surfaceFiles = [
	'src/lib/site.ts',
	'src/components/sections/Hero.astro',
	// The hero's loop diagram carries public copy, so it goes through the
	// forbidden-claims scan like every other surface. Its whole risk is
	// overclaiming automation.
	'src/components/LoopBand.astro',
	'src/components/sections/TheProblem.astro',
	// Third homepage stop. MUST NOT go first or second in this array: siteSource
	// and heroSource are read by position below. Everything else resolves by
	// indexOf and is safe to reorder.
	'src/components/sections/WhoThisIsFor.astro',
	'src/components/sections/CustomerOutcomes.astro',
	// Beats nine and ten. Its whole risk is saying what another product cannot
	// do, and its comments argue that at length, so both go through the scan.
	'src/components/sections/TheOtherTools.astro',
	'src/components/sections/SeeItRun.astro',
	'src/components/sections/TheYield.astro',
	'src/components/sections/PaperIn.astro',
	'src/components/sections/BuiltForKitchens.astro',
	// /features split into a hub over five area pages on 2026-08-23.
	// EveryFeature.astro (one page, 145 items) became these two.
	'src/components/sections/FeatureIndex.astro',
	'src/components/sections/FeatureSection.astro',
	// Dedicated Ingredients & Supplier Prices story. Its illustrative values
	// are labeled in the page; capability copy still comes from features.ts.
	'src/components/sections/IngredientsSupplierPricesFeature.astro',
	// Specialist import page. Its invoice and price-list explanations can alter
	// how a reader understands financial writes, so every claim passes the same
	// forbidden-automation scan as the broader area page.
	'src/components/sections/InvoicesPriceListImportFeature.astro',
	// Dedicated Inventory story. Trust-state and gap-planning claims are high
	// risk because stale counts must never read as safe to subtract.
	'src/components/sections/InventoryFeature.astro',
	// Sage specialist page. Availability, onboarding and assistant boundaries
	// are release claims and must stay inside RC-46/RC-49.
	'src/components/sections/SageFeature.astro',
	// Dedicated Purchasing & Receiving story. Its send, posting, and price-write
	// boundaries are financial claims, so the full public explanation is scanned.
	'src/components/sections/PurchasingReceivingFeature.astro',
	// Nutrition & allergens specialist page. Nutrition-source and food-safety
	// boundaries must stay inside RC-42/RC-50 and the shipped feature inventory.
	'src/components/sections/NutritionFactsAllergensFeature.astro',
	// Dedicated Orders, Shop, Prep & Pack story. Its frozen-plan, inventory, and
	// completion-state claims must stay inside the shipped orders feature group.
	'src/components/sections/OrderShopPrepPackFeature.astro',
	// Dedicated Purchases & Month Cost story. Month reconciliation and waste
	// language are financial claims, so the complete explanation is scanned.
	'src/components/sections/PurchasesMonthCostFeature.astro',
	// The three drawn area figures. They redraw claims their own pages already
	// make (RC-16, RC-19, RC-09, RC-38, RC-39, RC-42) and must never outrun them.
	'src/components/FeatureAreaFigure.astro',
	'src/components/sections/Integrations.astro',
	'src/lib/features.ts',
	// RC-40 lets this page name competitors. That makes it the highest-risk
	// public copy on the site, so it is scanned like every other surface and
	// its cell contract is pinned below.
	'src/lib/comparison.ts',
	// The mega-menu descriptions are capability copy, so they pass through the
	// same forbidden-claim scan as the feature pages they link into.
	'src/components/SiteNav.astro',
	'src/components/sections/StartHere.astro',
	// Added 2026-08-23. It carries the price and the in-development boundary
	// (RC-34, RC-35, RC-45, RC-46), which is claim copy by any reading, and it
	// had never been scanned. Adding it pushed StartHere off the end of this
	// array, so startHereSource below now resolves by name instead of at(-1).
	'src/pages/pricing.astro',
	// 2026-08-29. Both carry public copy (a trial line, the hand-off labels) and
	// the sticky bar carries a primary, so both go through the scan.
	'src/components/StickyCta.astro',
	'src/components/SectionHandoff.astro',
	// 2026-08-29. Every FAQ answer is public claim copy and names its rows.
	'src/lib/faq.ts',
	'src/pages/faq.astro',
	'src/components/sections/FaqPage.astro',
	// 2026-08-29. Sage: the data file carries every capability sentence, the
	// section renders it. Both are scanned, and the model-name guard below is
	// aimed squarely at them.
	'src/lib/sage.ts',
	'src/components/sections/Sage.astro',
	// 2026-08-29. Nutrition: the data file and the section, both claim copy.
	'src/lib/nutrition.ts',
	'src/components/sections/NutritionFacts.astro',
];

const [index, featuresPage, featureAreaPage, contactPage, ledger, ...surfaces] = await Promise.all([
	read('src/pages/index.astro'),
	read('src/pages/features/index.astro'),
	read('src/pages/features/[section].astro'),
	read('src/pages/contact.astro'),
	read('docs/release-claim-ledger.md'),
	...surfaceFiles.map(read),
]);
// compare.astro is read separately below for its RC-40 pins, but its prose is
// public copy like any other and goes through the forbidden-claims scan too.
const comparePage = await read('src/pages/compare.astro');
// The header is not public claim copy, but it owns the sign-in destination, so
// it is read for the pins below rather than added to the forbidden-claims scan.
const navSource = await read('src/components/SiteNav.astro');
const publicCopy = [...surfaces, comparePage].join('\n');
const siteSource = surfaces[0];
const heroSource = surfaces[1];
const startHereSource = surfaces[surfaceFiles.indexOf('src/components/sections/StartHere.astro')];

const failures = [];
const requireText = (source, value, label) => {
	if (!source.includes(value)) failures.push(`${label}: missing ${JSON.stringify(value)}`);
};

for (const component of [
	'TheProblem',
	'WhoThisIsFor',
	'SeeItRun',
	'CustomerOutcomes',
	'TheYield',
	'NutritionFacts',
	'PaperIn',
	'Sage',
	'BuiltForKitchens',
	'StartHere',
]) {
	requireText(index, `<${component} />`, 'landing composition');
}
// The exhaustive list lives on its own page. The outcome section links to it,
// so completeness stays available without making the homepage exhaustive.
// B-split, 2026-08-23. The hub carries NO feature items and the area page
// carries them all; the connections section moved to the one area whose name
// promises it. If the hub ever starts listing items again it is the old wall.
requireText(featuresPage, '<FeatureIndex />', 'features hub composition');
requireText(featureAreaPage, '<FeatureSection entry={entry} />', 'feature area composition');
requireText(featureAreaPage, 'getStaticPaths', 'feature area routes are generated per section');
requireText(featureAreaPage, '<Integrations />', 'connections render on an area page');
requireText(siteSource, "href: '/features'", 'features page nav link');
requireText(navSource, 'data-features-menu', 'features menu disclosure');
requireText(navSource, 'featureMenuSections', 'features menu data source');
requireText(navSource, 'docs/stories/features-navigation.story.md', 'features menu story pointer');
requireText(siteSource, "href: '/contact'", 'contact page nav link');
// The homepage link used to promise "every shipped feature" and point at a
// page that listed them. /features is now a hub of five areas, so the promise
// moved with the page rather than the pin being quietly relocated.
requireText(publicCopy, 'See everything it does, area by area', 'features page homepage link');
// The hero no longer carries a contact link: it was a third competing action
// inside the fold. Contact stays reachable from the nav and the footer, both
// of which render on every page.
requireText(siteSource, 'contactCta.href', 'contact reachable from nav');
requireText(siteSource, 'import.meta.env.PUBLIC_APP_URL', 'environment-aware app handoff');
requireText(siteSource, '/start?plan=launch', 'launch-plan handoff');
requireText(siteSource, "url.protocol !== 'http:' && url.protocol !== 'https:'", 'app origin protocol guard');
requireText(contactPage, 'mailto:${site.email}', 'contact email action');
requireText(contactPage, 'site.phoneHref', 'contact phone action');
requireText(contactPage, 'demoCta.href', 'contact demo action');
requireText(contactPage, 'Do not include passwords, payment card details', 'contact safety copy');
requireText(await read('src/layouts/Base.astro'), 'import.meta.env.PROD', 'deployment-only analytics');

// Ten stops, one claim each. SeeItRun sits ahead of CustomerOutcomes so the
// cold visitor settles "is this real" before being asked to believe outcomes,
// and WhoThisIsFor sits ahead of SeeItRun so the reader has settled "is this
// aimed at me" before the footage plays.
const expectedSectionOrder = [
	'<Hero />',
	'<TheProblem />',
	'<WhoThisIsFor />',
	'<SeeItRun />',
	'<CustomerOutcomes />',
	'<TheYield />',
	// Seventh since 2026-08-29: recipe-level, after yield, before intake.
	'<NutritionFacts />',
	'<PaperIn />',
	// Eighth since 2026-08-29: a mechanic, with the mechanics, ahead of the
	// rival beat whose /compare link lists it as a Coming row.
	'<Sage />',
	// Ninth since 2026-08-27: the rival beat lands after the reader wants the
	// thing, and before the maker signs it. See src/pages/index.astro.
	'<TheOtherTools />',
	'<BuiltForKitchens />',
	'<StartHere />',
];
let previousSectionIndex = -1;
for (const component of expectedSectionOrder) {
	const sectionIndex = index.indexOf(component);
	if (sectionIndex <= previousSectionIndex) {
		failures.push(
			`landing composition: ${component} is out of the approved visitor-workflow order`,
		);
	}
	previousSectionIndex = sectionIndex;
}

// RC-40's condition, enforced rather than trusted. The comparison page is the
// only place on the site allowed to name another company, and the single way it
// becomes a false statement about one is a cell that reads as "their product
// cannot do this" instead of "their pricing page did not list this on a date".
// So: the disclaimer sentence is pinned, the verification date must be present
// and must be rendered on the page, and the CostCook column must still contain
// real "no" rows. A table that ticks all the way down is the failure mode.
const comparisonSource = surfaces[surfaceFiles.indexOf('src/lib/comparison.ts')];
const featuresSource = surfaces[surfaceFiles.indexOf('src/lib/features.ts')];
const featureIndexSource =
	surfaces[surfaceFiles.indexOf('src/components/sections/FeatureIndex.astro')];
const featureSectionSource =
	surfaces[surfaceFiles.indexOf('src/components/sections/FeatureSection.astro')];
const integrationsSource =
	surfaces[surfaceFiles.indexOf('src/components/sections/Integrations.astro')];
requireText(comparePage, 'It does not mean their product cannot do it.', 'comparison legend');
requireText(comparisonSource, 'export const VERIFIED_ON', 'comparison verification date');
requireText(comparePage, 'VERIFIED_ON', 'comparison verification date on the page');
requireText(comparePage, 'costcookNo', 'comparison must count its own no rows');
requireText(
	comparePage,
	'costcookLimits',
	'comparison surfaces every CostCook no row before the detailed table',
);
const costcookNoRows = (comparisonSource.match(/costcook: 'no'/g) ?? []).length;
if (costcookNoRows < 4) {
	failures.push(
		`comparison honesty: only ${costcookNoRows} row(s) say CostCook does not do something. ` +
			'A comparison that wins every row does not survive a demo call. If capability really ' +
			'changed, move the row and say so in RC-40 rather than lowering this floor.',
	);
}
// A prior version contradicted its own six No rows in the close and turned a
// pricing-page omission into a claim about competitors' products. Keep both
// failure phrases out instead of trusting future copy edits to remember RC-40.
if (/the rows neither of them has|the whole board|the two rows we do not have/i.test(comparePage)) {
	failures.push(
		'comparison honesty: page copy overstates competitor evidence or understates CostCook No rows',
	);
}
// Nutrition labels are the specific rows this guard exists for: they are the
// most prominent thing on both competitors' pages. Since 2026-08-29 (RC-50)
// the printed sheet ships from the browser and the row is 'yes', on the
// condition that its note carries the estimate-not-compliance boundary the
// sheet itself prints. The label PRINTER row is the one that stays 'coming'.
requireText(comparisonSource, "label: 'Printed USDA nutrition labels'", 'comparison nutrition row');
const printedPanel = comparisonSource.slice(
	comparisonSource.indexOf("label: 'Printed USDA nutrition labels'"),
);
if (!printedPanel.slice(0, 400).includes("costcook: 'yes'")) {
	failures.push('comparison: printed USDA nutrition labels ship (RC-50); the row must say yes');
}
if (!/not a retail-label compliance claim/.test(printedPanel.slice(0, 600))) {
	failures.push('comparison honesty: the printed-labels note must carry the estimate-not-compliance boundary');
}
const printerRow = comparisonSource.slice(comparisonSource.indexOf("label: 'Kitchen label printing'"));
if (!printerRow.slice(0, 200).includes("costcook: 'coming'")) {
	failures.push('comparison honesty: the label printer is not connected (RC-35); that row may not claim yes');
}
// Every surface that says the sheet prints must say what the sheet says of itself.
const nutritionSource = surfaces[surfaceFiles.indexOf('src/lib/nutrition.ts')];
requireText(nutritionSource, 'not a retail-label compliance claim', 'nutrition copy carries the boundary');
if (/\b(FDA[- ]approved|compliant label|regulatory[- ]compliant)\b/i.test(publicCopy)) {
	failures.push('public copy claims regulatory compliance for a nutrition label (RC-50 forbids it)');
}
// RC-40, the status marks. /compare renders yes/coming/no as a glyph beside the
// word in the CostCook column. A competitor cell is a STRING reporting what
// their own pricing page said on a date, so it may never carry a mark: a glyph
// beside "Not listed" rounds a hedge into a verdict about another company's
// product. The columns look asymmetric and that asymmetry IS the honesty, so
// the pull to tidy it up is what this pins against.
requireText(
	comparePage,
	'<CellMark status={row.costcook} />',
	'comparison marks the CostCook column',
);
requireText(comparePage, '{row.parsley}</td>', 'the Parsley cell is a bare string');
requireText(comparePage, '{row.meez}</td>', 'the meez cell is a bare string');
if (/CellMark[^>]*row\.(?:parsley|meez)/.test(comparePage)) {
	failures.push(
		'comparison honesty: a competitor cell is rendering a status mark. Those cells ' +
			'report what a pricing page said on a date, not what a product can do, and a ' +
			'glyph turns one into the other. Only the CostCook column is marked.',
	);
}
// The mark never stands alone: the word carries the meaning, the glyph is
// aria-hidden, and nothing depends on colour or on a legend scrolled past.
const cellMarkSource = await read('src/components/CellMark.astro');
requireText(cellMarkSource, 'aria-hidden="true"', 'status glyphs are decorative');
for (const word of ["label: 'Yes'", "label: 'Coming'", "label: 'No'"]) {
	requireText(cellMarkSource, word, 'every status mark ships its word');
}
// Both markup paths or neither. The phone card path is the one an edit forgets
// and the one most of these readers see.
if ((comparePage.match(/<CellMark status={row.costcook} \/>/g) ?? []).length !== 2) {
	failures.push(
		'comparison marks: the table and the phone card path must both render the ' +
			'mark. One of them is missing it.',
	);
}

// RC-41. The preloaded catalog is names and aliases. The moment the page implies
// it ships prices, we are promising a cost basis nobody chose.
requireText(comparisonSource, 'Names and aliases, not prices', 'comparison catalog no-price edge');

// A1: the returning trial user. costcook.io had no way into the product from
// any page, which is not a claim problem, it is a missing door. The app's own
// login page is titled "Sign in | CostCook", so the label is pinned to that
// word: "Log in" here against "Sign in" there is a small lie about how
// carefully the rest was built.
requireText(siteSource, 'app.costcook.io/login', 'sign-in destination');
requireText(siteSource, "label: 'Sign in'", 'sign-in label matches the app');
requireText(navSource, 'signIn.href', 'header renders the sign-in link');
requireText(navSource, '{signIn.label}', 'header renders the sign-in label');

// B1: the /features sections are the /compare row groups, VERBATIM. Two
// reference pages that carve the same product into two different sets of words
// teach a reader that neither is authoritative. This reads the group titles
// out of comparison.ts rather than restating them, so the two cannot drift.
const comparisonGroupTitles = [...comparisonSource.matchAll(/^\t\ttitle: '(.+)',$/gm)].map(
	(m) => m[1],
);
if (comparisonGroupTitles.length === 0) {
	failures.push('feature sections: could not read the comparison group titles to check against');
}
for (const title of comparisonGroupTitles) {
	requireText(featuresSource, `'${title}'`, 'feature section vocabulary matches /compare');
}

// B2: four in-development groups all carried the bare title "In development",
// so four groups shared one heading and none of them said what it was. The
// eyebrow word stays (it is the shared status vocabulary); the TITLE may not be
// it. Scoped to features.ts on purpose: FeatureSection.astro and pricing.astro
// both use the phrase correctly as a label.
if (/title: 'In development'/.test(featuresSource)) {
	failures.push(
		'feature groups: a group title is still the bare string "In development". ' +
			'Four groups shared that heading and none of them named itself. Give the ' +
			'group a real title and let its status render the Coming badge.',
	);
}
// One status vocabulary, the one /compare's legend defines.
requireText(featuresSource, "status: 'in-development'", 'in-development status field');
requireText(integrationsSource, 'Coming', 'connections section uses the shared status word');

// E1: RC-45. Coming is a statement about the app a reader would start today,
// not about the branch. Moving either row is a deliberate act with an evidence
// check attached, never a quiet edit to a cell.
for (const label of ['Point of sale', 'Accounting']) {
	const row = comparisonSource.slice(comparisonSource.indexOf(`label: '${label}'`));
	if (!row.slice(0, 220).includes("costcook: 'coming'")) {
		failures.push(
			`connections honesty: the ${label} row no longer says coming. QuickBooks ` +
				'is unbuilt on sandbox/demo; Square IS built there but gated behind ' +
				'FEATURE_SQUARE_INTEGRATION_ENABLED, which defaults off (RC-45). Coming ' +
				'is true of the app a reader would start today. Before moving either row, ' +
				'check the DEPLOYED env var and businessFeatureOverrides, not the branch.',
		);
	}
}
// The connections section reads both rows out of comparison.ts rather than
// retyping them, which is what keeps the two surfaces from disagreeing.
requireText(
	integrationsSource,
	"from '../../lib/comparison'",
	'connections section reads the shared rows',
);
// /pricing quotes a price, so it must name ALL of what is not in that price.
// It listed two of the four in-development groups by hand. It now maps them.
const pricingSource = surfaces[surfaceFiles.indexOf('src/pages/pricing.astro')];
requireText(
	pricingSource,
	'inDevelopmentFeatureGroups',
	'pricing names every in-development group',
);
requireText(pricingSource, 'href="/compare"', 'pricing links to the comparison');

// D1: the one piece of moving proof, reachable from the two pages that ask a
// reader to judge capability off a list. Same literal as the hero, which the
// assembler prints and which has drifted twice.
requireText(featureIndexSource, 'Watch the 2:30 product tour', 'features page proof link');
requireText(comparePage, 'Watch the 2:30 product tour', 'comparison page proof link');

// B3: the five area slugs are PUBLIC URLS and are typed, not derived from the
// headings. Deriving them would mean any reworded heading silently 404s every
// inbound link. This pins the typed field and pins each slug the site links to.
requireText(featuresSource, 'SECTION_META', 'section slugs are typed, not derived');
const sectionSlugs = [...featuresSource.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
if (sectionSlugs.length !== comparisonGroupTitles.length) {
	failures.push(
		`feature areas: ${sectionSlugs.length} slug(s) for ${comparisonGroupTitles.length} section(s). ` +
			'Every section needs exactly one typed slug or a route goes missing.',
	);
}
for (const slug of sectionSlugs) {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
		failures.push(`feature areas: "${slug}" is not a clean URL slug`);
	}
}
// B4: the arithmetic. featureCount anchors the headline on a page that no
// longer lists anything, and the five per-area counts are what a reader adds
// up. A per-section number that drifts from the headline is the exact defect
// this file has produced twice, and only arithmetic catches it.
requireText(featuresSource, 'count: groups', 'per-area counts are computed, not typed');
requireText(featureSectionSource, '{entry.count}', 'the area page renders its computed count');
if (/\ball (\d+) things\b/i.test(featureIndexSource)) {
	failures.push('features hub: the headline count is typed. Render {featureCount} instead.');
}
// B5: the hub is a hub. It may name the areas; it may not list the items.
if (/item\.lead|group\.items\.map/.test(featureIndexSource)) {
	failures.push(
		'features hub: it is rendering feature items again. The hub carries five ' +
			'signposts and no line items; depth lives on /features/[section].',
	);
}
// B6: the disclosure is a disclosure, not a hover menu. The reader is on a
// phone where hover does not exist, and principle 3 forbids content that is
// only reachable by pointing at it.
requireText(navSource, '<details', 'features menu is a native disclosure');
// The header reads the curated menu list (featureMenuSections), which features.ts
// derives from the same SECTIONS the hub renders. Renamed 2026-08-29 with the
// mega-menu merge; the pin follows the identifier the header really uses.
requireText(navSource, 'featureMenuSections.map', 'features menu lists the areas from one source');
if (/hover:(?:block|flex|opacity)/.test(navSource) || /group-hover/.test(navSource)) {
	failures.push('features menu opens on hover. It must open on click, at every width.');
}

requireText(ledger, '6a29e88e36445b74ba5d057fe0461196e39b5c35', 'release ledger');
requireText(ledger, 'dfb71efc524da94efc6cec2f354751ce69d424e2', 'release ledger');
requireText(ledger, '7ceb02dbb67034e507aeb279abb421ddd90df87f', 'release ledger');
requireText(siteSource, 'href: booking.url', 'booking CTA');
requireText(siteSource, "target: '_blank'", 'booking CTA');
requireText(siteSource, "rel: 'noopener noreferrer'", 'booking CTA');
requireText(publicCopy, 'Watch the 2:30 product tour', 'hero proof link');
requireText(heroSource, 'launchPlan.displayPrice', 'homepage launch price');
// Every row that exists, not a number somebody remembered. The bound was 33
// while the ledger already carried RC-34 and RC-35, so two rows were shipping
// unguarded; RC-36 (multi-event planning) would have made three.
for (let claim = 1; claim <= 50; claim += 1) {
	requireText(ledger, `RC-${String(claim).padStart(2, '0')}`, 'release ledger');
}

// G1: the hand-off lines. Every "NEXT · ..." on the page is looked up from
// src/lib/stops.ts, so that list must be the composition order above with the
// same ids, or an arrow points at the wrong neighbour. The sticky bar is a
// third primary and must render cta.label like the other two.
const stopsSource = await read('src/lib/stops.ts');
const stopIds = [...stopsSource.matchAll(/\{ id: '([a-z]+)'/g)].map((m) => m[1]);
const expectedStopIds = [
	'problem',
	'who',
	'demo',
	'outcomes',
	'yield',
	'nutrition',
	'intake',
	'sage',
	'alternatives',
	'trust',
	'start',
];
if (stopIds.join(',') !== expectedStopIds.join(',')) {
	failures.push(
		`hand-offs: src/lib/stops.ts reads [${stopIds.join(', ')}] but the homepage renders ` +
			`[${expectedStopIds.join(', ')}]. Reorder stops.ts with index.astro, never separately.`,
	);
}
requireText(index, '<StickyCta />', 'phone sticky primary');
const stickySource = surfaces[surfaceFiles.indexOf('src/components/StickyCta.astro')];
if (!/class="btn-primary[^"]*"[\s\S]{0,80}\{cta\.label\}/.test(stickySource)) {
	failures.push('sticky bar primary CTA no longer renders cta.label');
}
for (const id of expectedStopIds.slice(0, -1)) {
	if (!publicCopy.includes(`<SectionHandoff from="${id}" />`)) {
		failures.push(`hand-offs: section #${id} has no <SectionHandoff from="${id}" /> at its foot`);
	}
}

// H1: the FAQ. Every answer lists the ledger rows it rests on, and every one
// of those rows must exist. An answer that cites nothing, or cites a row that
// is not in the ledger, is an unbacked claim wearing a citation.
const faqSource = surfaces[surfaceFiles.indexOf('src/lib/faq.ts')];
const faqEntries = [...faqSource.matchAll(/id: '([a-z-]+)',\s*question:[\s\S]*?claims: \[([^\]]*)\]/g)];
if (faqEntries.length === 0) failures.push('faq: could not read any entries to check');
for (const [, id, claimList] of faqEntries) {
	const rows = [...claimList.matchAll(/'(RC-\d{2})'/g)].map((m) => m[1]);
	if (rows.length === 0) failures.push(`faq: #${id} cites no ledger row`);
	for (const row of rows) {
		if (!ledger.includes(`| ${row} |`)) failures.push(`faq: #${id} cites ${row}, which is not in the ledger`);
	}
}
// A "no" row on /compare may not become a "yes" in an answer. The four RC-44
// misfits and the RC-47 give-ups are the ones a friendly answer is most
// tempted to soften, so their answers are pinned to open with the word.
for (const id of ['locations', 'permissions', 'fsma', 'spanish']) {
	const entry = faqSource.slice(faqSource.indexOf(`id: '${id}'`));
	if (!/answer: \[\s*'(?:No\.|Not yet\.)/.test(entry.slice(0, 400))) {
		failures.push(`faq: #${id} must open with "No." (it is a no row on /compare)`);
	}
}
requireText(siteSource, "href: '/faq'", 'faq reachable from nav and footer');
requireText(startHereSource, 'href="/faq"', 'close links to the faq');

if (/href:\s*['"]#book['"]/.test(siteSource)) {
	failures.push('booking CTA still points to the inline booking section');
}
if (startHereSource && /<iframe\b/i.test(startHereSource)) {
	failures.push('booking section still contains an inline scheduler');
}

// F1: the page opens and closes on the SAME action. Every btn-primary on the
// homepage must render cta.label from site.ts; the close section used to ship a
// second primary pointing at the booking calendar, so the page asked the reader
// to pick a funnel. demoCta survives only as a quiet link.
for (const [label, source] of [
	['hero', heroSource],
	['close', startHereSource],
]) {
	if (!/class="btn-primary[^"]*"[\s\S]{0,80}\{cta\.label\}/.test(source)) {
		failures.push(`${label} primary CTA no longer renders cta.label`);
	}
}
if (/class="btn-primary[^"]*"[\s\S]{0,200}demoCta\.label/.test(startHereSource)) {
	failures.push('close section renders the demo CTA as a second primary action');
}

// RC-49: Sage's status lives in one file and every surface reads it. The
// homepage section, the compare row and the feature group may not carry their
// own word, and the section must print the word rather than imply it.
const sageSource = surfaces[surfaceFiles.indexOf('src/lib/sage.ts')];
const sageSection = surfaces[surfaceFiles.indexOf('src/components/sections/Sage.astro')];
requireText(sageSource, 'export const SAGE_STATUS', 'sage status lives in sage.ts');
requireText(comparisonSource, 'costcook: SAGE_STATUS', 'compare reads the sage status');
requireText(featuresSource, "status: SAGE_STATUS === 'yes'", 'features reads the sage status');
requireText(sageSection, '{sageStatusWord}', 'sage section prints its status');
if (/SAGE_STATUS = 'coming'/.test(sageSource) && !/not in the app you would start today/.test(sageSection)) {
	failures.push('sage: status is coming but the section no longer says it is not in the app you would start today');
}
if (/SAGE_STATUS = 'yes'/.test(sageSource) && /not in the app you would start today|not in the launch price/.test(`${sageSection}\n${comparisonSource}\n${featuresSource}`)) {
	failures.push('sage: status is available but a shared product surface still describes it as unavailable');
}

const forbiddenClaims = [
	[/\bknow the margin\b/i, 'full-margin language'],
	[/\bno data entry\b/i, 'no-data-entry promise'],
	[/\bnothing is re-keyed\b/i, 'no-rekeying promise'],
	[/\bfree while/i, 'unapproved pricing promise'],
	[/\beverything downstream re-reads/i, 'confirmed-order repricing implication'],
	[/\bhandles it automatically\b/i, 'unqualified automation promise'],
	// RC-49. The assistant's model and provider are configuration, not claims,
	// and the default has never been evaluated on the marketed branch.
	// CLAUDE.md is a filename that comments cite; the lookahead spares it.
	[/\b(gemini|gpt-?\d|openai|anthropic|claude(?!\.md)|sonnet|opus|llama|mistral)\b/i, 'model or provider name'],
	[/\bnever invents? a number\b/i, 'unqualified never-invents claim (RC-49 softens it)'],
	[/\blearns? your (business|kitchen)\b/i, 'assistant-learns claim'],
];
for (const [pattern, label] of forbiddenClaims) {
	if (pattern.test(publicCopy)) failures.push(`public copy contains forbidden ${label}`);
}

if (failures.length > 0) {
	console.error(`Landing claim check failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Landing claim ledger and public-copy guard passed.');
