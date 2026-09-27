import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { moneyClaims } from './lib/money-claims.mjs';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFile(join(root, path), 'utf8');

// Considered Iterator; not used because the blog is one flat directory and
// native array iteration already scans every article without a custom traversal.
const blogSurfaceFiles = (await readdir(join(root, 'src/content/blog'), { withFileTypes: true }))
	.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
	.map((entry) => `src/content/blog/${entry.name}`)
	.sort();

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
	// The event's front half, inquiry to booked (2026-09-27). Its risk is
	// overclaiming money: a deposit is recorded, never taken, on this path.
	'src/components/sections/EventBooking.astro',
	// The event facts EventBooking, the events guide, the tour, /compare and
	// /features read (src/lib/events.ts), and the capture alt text both event
	// surfaces render (src/lib/proof.ts). Moved out of the components on
	// 2026-09-27, so they are scanned where they now live.
	'src/lib/events.ts',
	'src/lib/proof.ts',
	'src/components/sections/CustomerOutcomes.astro',
	'src/components/sections/WhatElse.astro',
	// Beats nine and ten. Its whole risk is saying what another product cannot
	// do, and its comments argue that at length, so both go through the scan.
	'src/components/sections/TheOtherTools.astro',
	'src/components/sections/SeeItRun.astro',
	'src/components/sections/TheYield.astro',
	// #more's four blocks since 2026-09-09; they were four sections.
	'src/components/more/IntakeBlock.astro',
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
	'src/components/sections/RecipesCostingFeature.astro',
	// Menus and the guided tour contain public financial labels and illustrative
	// arithmetic. They were previously outside this scan, which let a gross-
	// margin claim and a stale-count subtraction pass while the guard stayed green.
	'src/components/sections/MenusQuotesFeature.astro',
	'src/components/sections/ProductTour.astro',
	'src/lib/tour.ts',
	// Sage specialist page. Availability, onboarding and assistant boundaries
	// are release claims and must stay inside RC-46/RC-49.
	'src/components/sections/SageFeature.astro',
	'src/components/sections/TeamAccessFeature.astro',
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
	// Owner-confirmed 2026-08-30. These three Coming corrections feed the
	// homepage, comparison, FAQ, inventory and nutrition surfaces.
	'src/lib/coming-plans.ts',
	// The ordering status word and every sentence that reads it. Public copy,
	// and the highest-risk claim on the site: the capability is built and
	// reachable by nobody, which is the exact shape a reader rounds up.
	'src/lib/ordering.ts',
	// The mega-menu descriptions are capability copy, so they pass through the
	// same forbidden-claim scan as the feature pages they link into.
	'src/components/SiteNav.astro',
	'src/components/BlogMenuContents.astro',
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
	// Every worked guide contains costing, purchasing, or product-boundary
	// claims. Discover the complete directory so a new article cannot bypass the
	// same forbidden-claim scan as the product page it links to.
	...blogSurfaceFiles,
	// 2026-08-29. Every FAQ answer is public claim copy and names its rows.
	'src/lib/faq.ts',
	'src/pages/faq.astro',
	'src/components/sections/FaqPage.astro',
	// 2026-08-29. The audience route explains fit across catering, meal prep,
	// special dinners, and restaurant event work; all capability and limit copy
	// stays inside RC-01/03/21/22/24/25/26/30/44.
	'src/pages/who-its-for.astro',
	'src/components/sections/WhoItsForPage.astro',
	// 2026-08-29. Sage: the data file carries every capability sentence, the
	// section renders it. Both are scanned, and the model-name guard below is
	// aimed squarely at them.
	'src/lib/sage.ts',
	'src/lib/labels.ts',
	'src/components/sections/LabelsPrintingFeature.astro',
	'src/components/more/SageBlock.astro',
	'src/components/more/AccessBlock.astro',
	// 2026-08-29. Nutrition: the data file and the section, both claim copy.
	'src/lib/nutrition.ts',
	'src/components/more/NutritionBlock.astro',
	// 2026-08-31. The demo route qualifies one working session, describes the
	// static email handoff honestly, and owns the direct calendar boundary.
	'src/pages/demo.astro',
	'src/components/sections/DemoRequest.astro',
	// 2026-09-05. The setup route states the stage count, the plate-cost
	// arithmetic and the input guards (RC-10, RC-14, RC-55). APPENDED, never
	// inserted: siteSource and heroSource above resolve by position.
	'src/pages/onboarding.astro',
	'src/components/sections/OnboardingPage.astro',
	// 2026-09-27. Events and proposals: the deposit is recorded by hand, so the
	// money patterns above must read this page. APPENDED, like the two above.
	'src/pages/features/events-and-proposals.astro',
	'src/components/sections/EventsProposalsFeature.astro',
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
const featureMenuContentsSource = await read('src/components/FeatureMenuContents.astro');
// The contact page's actions live in this component now, and the endpoint and
// its shared validator are public-behaviour surfaces like any other claim.
const askSupportSource = await read('src/components/sections/AskSupport.astro');
const supportEndpointSource = await read('api/support.ts');
const supportLibSource = await read('src/lib/support.ts');
const blogMenuContentsSource = await read('src/components/BlogMenuContents.astro');
const publicCopy = [...surfaces, comparePage].join('\n');
const siteSource = surfaces[0];
const heroSource = surfaces[1];
const startHereSource = surfaces[surfaceFiles.indexOf('src/components/sections/StartHere.astro')];
const whoSource = surfaces[surfaceFiles.indexOf('src/components/sections/WhoThisIsFor.astro')];
const trustSource = surfaces[surfaceFiles.indexOf('src/components/sections/BuiltForKitchens.astro')];
const alternativesSource = surfaces[surfaceFiles.indexOf('src/components/sections/TheOtherTools.astro')];

// Considered Facade; not used because these surfaces are static claim data,
// not a complex subsystem callers need to operate. One explicit evidence list
// and focused invariants make omissions visible without hiding file ownership.

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
	// One band since 2026-09-09; it was NutritionFacts, PaperIn, Sage and
	// TeamAccess, which are now its four blocks in src/components/more.
	'WhatElse',
	'BuiltForKitchens',
	'StartHere',
]) {
	requireText(index, `<${component} />`, 'landing composition');
}

// RC-44 / RC-47: restaurant ownership is not a proxy for product fit. One
// kitchen can run regular service and event-driven work; only the requirements
// CostCook cannot support belong in the limits ticket.
requireText(
	whoSource,
	'catering-only kitchen or a restaurant too',
	'restaurant event-work fit',
);
requireText(alternativesSource, 'A restaurant can run both.', 'restaurant dual-workflow fit');
// The fold must name the same audience the Who section does. Until 2026-08-30
// it named caterers and meal-prep kitchens only, contradicting RC-44 on the
// same page. Scope stays event work, so the words are "restaurants that cater".
requireText(heroSource, 'restaurants that cater', 'hero audience includes restaurants (RC-01, RC-44)');
requireText(
	trustSource,
	'catering, meal-prep, and restaurant kitchens that plan work from menus and guest counts',
	'trust section audience includes restaurants (RC-01, RC-44)',
);
if (/one restaurant on a fixed daily menu|shape is wrong for you|tool built for it will fit you better/i.test(publicCopy)) {
	failures.push('restaurant positioning: a restaurant owner is still framed as the wrong fit');
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
requireText(featureMenuContentsSource, 'featureMenuSections', 'features menu data source');
requireText(navSource, 'docs/stories/features-navigation.story.md', 'features menu story pointer');
requireText(navSource, 'data-resources-menu', 'secondary navigation disclosure');
requireText(navSource, 'resourcesMenu', 'shared Resources navigation source');
requireText(navSource, '<ResourcesMenuContents {path} />', 'Resources menu renderer');
requireText(siteSource, 'docs/stories/resources-navigation.story.md', 'Resources menu story pointer');
requireText(siteSource, "href: '/blog'", 'blog reachable from shared navigation');
requireText(navSource, 'data-blog-menu', 'blog navigation disclosure');
requireText(navSource, '<BlogMenuContents {path} />', 'blog menu renderer');
requireText(blogMenuContentsSource, "getCollection('blog')", 'blog menu article source');
requireText(blogMenuContentsSource, 'post.data.description', 'blog menu article descriptions');
requireText(navSource, 'data-mobile-menu', 'contained mobile navigation');
requireText(navSource, 'demoCta.href', 'header demo action');
requireText(navSource, 'Book a demo', 'header demo label');
requireText(siteSource, "href: '/contact'", 'contact page nav link');
requireText(siteSource, "href: '/who-its-for'", 'who-it-is-for navigation link');
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
// CONTACT MOVED FROM A HANDOFF TO A FORM (2026-09-06). The page used to offer
// `mailto:` as its primary action; the ask now posts to /api/support, the same
// shape as Contact support in the app. So the email and phone actions are
// asserted where they now live, in the component, and the mailto is pinned as
// what it became: the way out when the form cannot send, not the way in. Pinning
// it against contact.astro would have passed on a leftover unused const.
requireText(askSupportSource, 'mailto:${site.email}', 'contact email fallback still offered');
requireText(askSupportSource, 'site.phoneHref', 'contact phone action');
requireText(askSupportSource, "action=\"/api/support\"", 'contact form posts to the support endpoint');
requireText(askSupportSource, 'method="post"', 'contact form submits without JavaScript');
requireText(askSupportSource, 'name="company"', 'contact form keeps its bot trap');
requireText(supportEndpointSource, 'replyTo: supportRequest.email', 'support mail replies to the visitor');
requireText(supportEndpointSource, "SUPPORT_EMAIL", 'support mail reaches the support mailbox');
requireText(supportLibSource, "SUPPORT_EMAIL = 'support@costcook.io'", 'support mailbox matches the app');
requireText(contactPage, 'demoCta.href', 'contact demo action');
requireText(askSupportSource, 'Do not include passwords, payment card details', 'contact safety copy');
requireText(await read('src/layouts/Base.astro'), 'import.meta.env.PROD', 'deployment-only analytics');

// Ten stops, one claim each. SeeItRun sits SECOND since 2026-09-06, at the
// owner's request: the footage runs before the page argues anything, so a
// reader arriving cold from an email settles "is this real" on the first
// scroll instead of on the fourth. TheProblem and WhoThisIsFor keep their
// order relative to each other and still land before the answers they set up.
// The 2026-09-11 review puts one event's proof before optional diligence.
// EventBooking sits right under the hero since 2026-09-27: the page is
// event-first, so the inquiry-to-booked promise is the first thing proven.
// docs/stories/homepage-event-story.story.md
const expectedSectionOrder = [
 '<Hero />', '<EventBooking />', '<CustomerOutcomes />', '<SeeItRun />', '<TheProblem />',
 '<TheYield />', '<BuiltForKitchens />', '<WhoThisIsFor />', '<WhatElse />',
 '<TheOtherTools />', '<StartHere />'
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
const comingPlansSource = surfaces[surfaceFiles.indexOf('src/lib/coming-plans.ts')];
const featuresSource = surfaces[surfaceFiles.indexOf('src/lib/features.ts')];
const featureIndexSource =
	surfaces[surfaceFiles.indexOf('src/components/sections/FeatureIndex.astro')];
const featureSectionSource =
	surfaces[surfaceFiles.indexOf('src/components/sections/FeatureSection.astro')];
const integrationsSource =
	surfaces[surfaceFiles.indexOf('src/components/sections/Integrations.astro')];
requireText(comparePage, 'It does not mean their product cannot do it.', 'comparison legend');
requireText(comparisonSource, 'export const VERIFIED_ON', 'comparison verification date');
requireText(comparisonSource, "VERIFIED_ON = 'August 30, 2026'", 'current comparison verification date');
requireText(comparePage, 'VERIFIED_ON', 'comparison verification date on the page');
requireText(comparePage, 'costcookNo', 'comparison must count its own no rows');
requireText(
	comparePage,
	'costcookLimits',
	'comparison surfaces every CostCook no row before the detailed table',
);
const costcookNoRows = (comparisonSource.match(/costcook: 'no'/g) ?? []).length;
if (costcookNoRows < 3) {
	failures.push(
		`comparison honesty: only ${costcookNoRows} row(s) say CostCook does not do something. ` +
			'A comparison that wins every row does not survive a demo call. If capability really ' +
			'changed, move the row and say so in RC-40 rather than lowering this floor.',
	);
}
// TWO SINCE 2026-09-09, and it was three. Dietary characteristics left this
// list by SHIPPING, which is the only way anything is allowed to leave it: a
// Coming row that quietly disappears is a promise nobody kept. RC-60 records
// what replaced it, and the pins below moved to src/lib/dietary.ts rather than
// being deleted. ONE SINCE 2026-09-27: buying to par shipped (RC-43, gap
// report F1), and its pins moved to the /compare yes row below. TWO SINCE
// 2026-09-27 (later the same day): the owner ruled that card payment for booked
// events and a balance reminder are being built (inventory A-18), so they
// joined as a plan. That is the only other way onto this list.
const comingPlanKeys = ['spanish', 'eventPayments'];
for (const key of comingPlanKeys) {
	requireText(comingPlansSource, `${key}: {`, `Coming plan ${key}`);
}
for (const phrase of [
	"title: 'Spanish'",
	"title: 'Card payment for booked events'",
	'a reminder email before the balance is due'
]) {
	requireText(comingPlansSource, phrase, 'owner-confirmed Coming plans');
}
if ((comingPlansSource.match(/verdict: 'coming' as const/g) ?? []).length !== comingPlanKeys.length) {
	failures.push(`owner-confirmed Coming plans: every plan (${comingPlanKeys.join(', ')}) must stay Coming, and no other may be added unpinned`);
}
// Each plan's id is the key in kebab case, as its siblings' ids are, and it is
// what the homepage renders as data-coming-plan (check-dist.mjs).
for (const key of comingPlanKeys) {
	const id = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
	requireText(comingPlansSource, `id: '${id}'`, `Coming plan ${key} id`);
}
requireText(comparisonSource, "note: 'Inventory > Build shopping list builds what to buy for confirmed events and your par, by supplier. Only a recent count is taken off the buy.'", 'buying to par is a shipped yes row (RC-43)');
if (/parBuying/.test(comingPlansSource)) {
	failures.push('buying to par shipped (RC-43); it may not return to the Coming plans');
}
for (const key of comingPlanKeys) {
	requireText(
		comparisonSource,
		`costcook: comingPlans.${key}.verdict`,
		`comparison consumes the shared ${key} status`,
	);
}

// RC-60. The shipped capability gets the same treatment the unshipped ones get:
// one file owns the wording and every surface reads it, so a later correction is
// one edit and not four. The two caps are pinned because they are the sentences
// a friendly rewrite drops first, and dropping them turns a detection tool into
// a safety promise.
const dietarySource = await read('src/lib/dietary.ts');
requireText(dietarySource, "verdict: 'yes' as const", 'dietary ships as a yes');
requireText(dietarySource, 'CostCook detects, it never certifies.', 'dietary keeps the product boundary');
requireText(dietarySource, 'Halal and kosher can only ever come back as a check', 'dietary keeps the halal and kosher cap');
requireText(dietarySource, 'is never counted as clear', 'dietary keeps the unreviewed cap');
requireText(dietarySource, 'freezes the reading', 'dietary keeps the frozen-at-confirm boundary');
requireText(comparisonSource, 'costcook: dietary.verdict', 'comparison consumes the shared dietary status');
// The four words this capability may never say, scanned over the SHIPPED COPY
// ONLY: comments are stripped first, because the note at the head of that file
// has to be able to name what it forbids, and the one legal use of
// "allergen-free" is the sentence denying it. Everything else in that file is a
// sentence a prospect reads.
const dietaryCopy = dietarySource
	.replace(/\/\*[\s\S]*?\*\//g, ' ')
	.replace(/\/\/[^\n]*/g, ' ')
	.replace(/No screen makes an allergen-free claim\./gi, ' ');
for (const word of ['safe', 'certified', 'guaranteed', 'allergen-free']) {
	if (new RegExp(`\\b${word}\\b`, 'i').test(dietaryCopy)) {
		failures.push(`dietary: the shipped wording uses "${word}", which this capability may never claim`);
	}
}
requireText(alternativesSource, 'data-coming-plans', 'homepage Coming plan group');
requireText(alternativesSource, 'Coming soon', 'homepage Coming status');
// A prior version contradicted its own No rows in the close and turned a
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
// Kitchen labels: available since 2026-09-27, when the owner approved the RC-35
// launch decision (RC-35, RC-51). The one word lives in src/lib/labels.ts and
// is pinned here with the ledger row.
const labelsSource = surfaces[surfaceFiles.indexOf('src/lib/labels.ts')];
if (!/LABELS_STATUS = 'yes'/.test(labelsSource)) {
	failures.push('labels status: RC-35 was approved on 2026-09-27; LABELS_STATUS must read yes until the ledger row changes');
}
requireText(labelsSource, 'browser', 'labels copy names the browser as the only output');
requireText(labelsSource, 'never guesses', 'labels copy carries the no-guessed-date rule');
requireText(labelsSource, 'not an all-clear', 'labels copy carries the blank-allergen boundary');
for (const [name, source] of [['src/lib/labels.ts', labelsSource], ['src/components/sections/LabelsPrintingFeature.astro', surfaces[surfaceFiles.indexOf('src/components/sections/LabelsPrintingFeature.astro')]]]) {
	if (/Brother|DYMO|Dymo|Zebra|Avery/.test(source)) failures.push(`${name}: no printer or stock brand may be named`);
	if (/direct(ly)? to (the |a |your )?(label )?printer|sends? (it |them |labels )?to (the |a |your )?printer/i.test(source)) failures.push(`${name}: may not say a label reaches a printer on its own`);
}
const printerRow = comparisonSource.slice(comparisonSource.indexOf("label: 'Kitchen label printing'"));
if (!printerRow.slice(0, 220).includes('costcook: labelsAvailability.verdict')) {
	failures.push('comparison honesty: the kitchen label row must read the shared labels word (RC-35), never a typed verdict');
}
requireText(printerRow.slice(0, 260), "parsley: '$59/month add-on'", 'current Parsley label-printing add-on');
const roleRow = comparisonSource.slice(comparisonSource.indexOf("label: 'Role-aware sensitive actions'"));
requireText(roleRow.slice(0, 420), "meez: 'Starter, $24'", 'current meez access listing');
const locationsRow = comparisonSource.slice(comparisonSource.indexOf("label: 'Several locations'"));
requireText(locationsRow.slice(0, 360), 'added recipe-viewer locations $60/month each', 'current meez location add-on');
const accountingRow = comparisonSource.slice(comparisonSource.indexOf("label: 'Accounting'"));
requireText(accountingRow.slice(0, 320), 'Restaurant365 sync, $199/month plus setup fee', 'current meez accounting integration');
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
requireText(comparisonSource, 'You supply the pack sizes and prices', 'comparison catalog no-price edge');

// A1: the returning trial user. costcook.io had no way into the product from
// any page, which is not a claim problem, it is a missing door. The app's own
// login page is titled "Sign in | CostCook", so the label is pinned to that
// word: "Log in" here against "Sign in" there is a small lie about how
// carefully the rest was built.
requireText(siteSource, '`${app}/login`', 'sign-in destination derives from the app origin');
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
requireText(featureIndexSource, 'Watch the 2:53 product tour', 'features page proof link');
requireText(comparePage, 'Watch the 2:53 product tour', 'comparison page proof link');

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
requireText(featureMenuContentsSource, 'featureMenuSections.map', 'features menu lists the areas from one source');
if (/hover:(?:block|flex|opacity)/.test(navSource) || /group-hover/.test(navSource)) {
	failures.push('features menu opens on hover. It must open on click, at every width.');
}

requireText(ledger, 'f44c9393973244b8b7f62edaf98c1bd0362162ce', 'release ledger truth-pass baseline');
requireText(ledger, 'dfb71efc524da94efc6cec2f354751ce69d424e2', 'release ledger');
requireText(ledger, '7ceb02dbb67034e507aeb279abb421ddd90df87f', 'release ledger');
// RC-16..RC-25, the costing core. Until 2026-09-05 these ten were the only rows
// in the ledger whose evidence named no file, no sha and no artifact, and RC-20
// had a new homepage claim resting on 31 characters of it. Seven of the ten are
// now executed against the engine at the sha below; the artifact says plainly
// which three are not. Pinned so the sha and the artifact cannot quietly part.
requireText(ledger, 'a34149cb4a1e8bc36c69fbf88da2ef74924d650c', 'costing-core verification sha (RC-16..RC-25)');
requireText(ledger, 'docs/verification/costing-core/260905a/', 'costing-core verification artifact (RC-16..RC-25)');
for (const file of [
	'docs/verification/costing-core/260905a/results.md',
	'docs/verification/costing-core/260905a/verify-rc20.ts',
	'docs/verification/costing-core/260905a/verify-costing-block.ts',
]) {
	try {
		await read(file);
	} catch {
		failures.push(`costing-core: the ledger cites ${file} and it is not in the repo`);
	}
}
requireText(siteSource, "href: '/demo'", 'demo preparation CTA');
requireText(siteSource, "target: '_self'", 'demo preparation CTA');
const demoRequestSource = surfaces[surfaceFiles.indexOf('src/components/sections/DemoRequest.astro')];
// THE TRUTH STATE MOVED, 2026-09-06, because the underlying truth did.
//
// This used to pin the sentence "CostCook has not claimed your request was
// sent", and that sentence was correct: the form built a mailto: and hoped, so
// saying anything else would have been a lie. The form now posts to
// /api/demo-request and reaches two mailboxes, so the honest sentence is the
// opposite one, and it is pinned here in its place.
//
// What has NOT changed is the boundary the old line was really protecting: the
// page must not claim something it cannot know. It cannot know a time was
// booked. The calendar is Google's, inside a frame that reports nothing back,
// so "sent" and "booked" stay two different sentences.
requireText(demoRequestSource, 'href={booking.url}', 'owner-supplied demo calendar handoff');
requireText(demoRequestSource, 'target="_blank"', 'demo calendar new-tab boundary');
requireText(demoRequestSource, 'rel="noopener noreferrer"', 'demo calendar safe external link');
requireText(demoRequestSource, 'data-booking-src={booking.embedUrl}', 'demo calendar embedded on the page');
requireText(demoRequestSource, 'A time is booked only once you choose one above and Google confirms it', 'demo booking truth state');
if (/CostCook has not claimed your request was sent/.test(demoRequestSource)) {
	failures.push('demo page still says it has not sent the request, which is no longer true');
}
requireText(demoRequestSource, 'docs/stories/request-demo.story.md', 'demo story pointer');
requireText(publicCopy, 'Watch the 2:53 product tour', 'hero proof link');
requireText(heroSource, 'launchPlan.displayPrice', 'homepage launch price');
// Every row that exists, not a number somebody remembered. The bound was 33
// while the ledger already carried RC-34 and RC-35, so two rows were shipping
// unguarded; RC-36 (multi-event planning) would have made three.
for (let claim = 1; claim <= 60; claim += 1) {
	requireText(ledger, `RC-${String(claim).padStart(2, '0')}`, 'release ledger');
}

// G1: the hand-off lines. Every "NEXT · ..." on the page is looked up from
// src/lib/stops.ts, so that list must be the composition order above with the
// same ids, or an arrow points at the wrong neighbour. The sticky bar is a
// third primary and must render cta.label like the other two.
const stopsSource = await read('src/lib/stops.ts');
const stopIds = [...stopsSource.matchAll(/\{ id: '([a-z]+)'/g)].map((m) => m[1]);
const expectedStopIds = ['booking', 'outcomes', 'demo', 'problem', 'yield', 'trust', 'who', 'more', 'alternatives', 'start'];
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
requireText(faqSource, 'href="/onboarding#after-crew"', 'faq: after-setup crew answer links to the guide');
const faqEntries = [...faqSource.matchAll(/id: '([a-z-]+)',\s*question:[\s\S]*?claims: \[([^\]]*)\]/g)];
if (faqEntries.length === 0) failures.push('faq: could not read any entries to check');
for (const [, id, claimList] of faqEntries) {
	const rows = [...claimList.matchAll(/'(RC-\d{2})'/g)].map((m) => m[1]);
	if (rows.length === 0) failures.push(`faq: #${id} cites no ledger row`);
	for (const row of rows) {
		if (!ledger.includes(`| ${row} |`)) failures.push(`faq: #${id} cites ${row}, which is not in the ledger`);
	}
}
const restaurantAnswer = faqSource.slice(faqSource.indexOf("id: 'restaurant'"));
if (!/answer: \[\s*'Yes, for the part of your business/.test(restaurantAnswer.slice(0, 700))) {
	failures.push('faq: the restaurant answer must open with the event-work fit, not a blanket misfit');
}
// A "no" row on /compare may not become a "yes" in an answer. The three RC-44
// product limits are the ones a friendly answer is most tempted to soften, so
// their answers are pinned to open with the word. Spanish moved to Coming in
// the owner-confirmed 2026-08-30 RC-47 revision.
for (const id of ['locations', 'permissions', 'fsma']) {
	const entry = faqSource.slice(faqSource.indexOf(`id: '${id}'`));
	if (!/answer: \[\s*'(?:No\.|Not yet\.)/.test(entry.slice(0, 400))) {
		failures.push(`faq: #${id} must open with "No." (it is a no row on /compare)`);
	}
}
const spanishAnswer = faqSource.slice(faqSource.indexOf("id: 'spanish'"));
if (!spanishAnswer.slice(0, 400).includes('comingPlans.spanish.faq')) {
	failures.push('faq: #spanish must read the shared Coming plan');
}
// RC-65. Card payment for an event is Coming; the answer reads the shared plan,
// and the plan's answer must open with "Not yet." like the other not-shipped rows.
const eventPaymentsAnswer = faqSource.slice(faqSource.indexOf("id: 'event-payments'"));
if (faqSource.indexOf("id: 'event-payments'") === -1 || !eventPaymentsAnswer.slice(0, 400).includes('comingPlans.eventPayments.faq')) {
	failures.push('faq: #event-payments must exist and read the shared Coming plan (RC-65)');
}
if (!/\bfaq: `Not yet\. Card payment for booked events is Coming soon/.test(comingPlansSource)) {
	failures.push('faq: the event card payment answer must open with "Not yet." (RC-65: recorded by hand today)');
}
requireText(siteSource, "href: '/faq'", 'faq reachable from nav and footer');
requireText(startHereSource, 'href="/faq"', 'close links to the faq');
requireText(faqSource, "claims: ['RC-54']", 'offline FAQ cites its resilience boundary');
requireText(faqSource, 'Previously loaded order pages remain readable with no signal', 'bounded offline FAQ answer');
requireText(faqSource, 'actions that write data need a connection', 'offline write boundary');

// The tour is illustrative, but its language must still obey the same product
// invariants as a feature page: food cost is not business margin, stale stock
// cannot reduce buying, and the total month difference is not all unexplained.
const tourSource = surfaces[surfaceFiles.indexOf('src/lib/tour.ts')];
const productTourSource = surfaces[surfaceFiles.indexOf('src/components/sections/ProductTour.astro')];
requireText(tourSource, "label: 'Revenue after food cost'", 'tour food-cost remainder label');
requireText(tourSource, "value: '4.1 kg · count first'", 'tour stale-count buying boundary');
requireText(tourSource, "label: 'Difference to explain'", 'tour month difference label');
requireText(tourSource, 'Garden wedding supper', 'tour illustrative event identity');
requireText(productTourSource, '<strong>Garden wedding supper</strong>', 'tour visible event identity');

const purchasingSource = surfaces[surfaceFiles.indexOf('src/components/sections/PurchasingReceivingFeature.astro')];
requireText(purchasingSource, 'recorded as queued before CostCook attempts the email', 'purchase-order queued lifecycle');
requireText(purchasingSource, 'same record keeps the failure and remains safe to retry', 'purchase-order retry lifecycle');

requireText(featureIndexSource, 'feature groups below contain work marked Coming', 'features Coming group count');
requireText(pricingSource, 'feature groups contain work marked Coming', 'pricing Coming group count');

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
const sageSection = surfaces[surfaceFiles.indexOf('src/components/more/SageBlock.astro')];
requireText(sageSource, 'export const SAGE_STATUS', 'sage status lives in sage.ts');
// RC-49's counts, one place. Every sentence that counts Sage's tools or drafts
// spells these, so the number is pinned here and a hand-typed copy is refused.
requireText(sageSource, 'export const sageReadToolCount = 22;', 'Sage read-only tool count (RC-49: 22)');
if ((sageSource.match(/export const sageDraftKinds = \[([\s\S]*?)\] as const/)?.[1].match(/^\s*'[^']+'/gm) ?? []).length !== 3) {
	failures.push('Sage draft kinds: RC-49 ships exactly three (kitchen shopping list, one order shopping list, guest-count change)');
}
if (/twenty-two|\b22 read/i.test(publicCopy.replace(sageSource, ''))) {
	failures.push('Sage tool count is typed by hand; spell sageReadToolCount from src/lib/sage.ts');
}
requireText(comparisonSource, 'costcook: SAGE_STATUS', 'compare reads the sage status');
requireText(featuresSource, "status: SAGE_STATUS === 'yes'", 'features reads the sage status');
requireText(sageSection, '{sageStatusWord}', 'sage section prints its status');
if (/SAGE_STATUS = 'coming'/.test(sageSource) && !/not in the app you would start today/.test(sageSection)) {
	failures.push('sage: status is coming but the section no longer says it is not in the app you would start today');
}
if (/SAGE_STATUS = 'yes'/.test(sageSource) && /not in the app you would start today|not in the launch price/.test(`${sageSection}\n${comparisonSource}\n${featuresSource}`)) {
	failures.push('sage: status is available but a shared product surface still describes it as unavailable');
}

// RC-10 / RC-55: the setup route. The stage count and the plate-cost
// arithmetic are the two things a reader can check against the running app,
// so both are pinned here rather than left to a careful editor. If the app
// adds a stage or changes DEFAULT_ONBOARDING_MISC_COST_PCT, this fails first.
const onboardingSource = surfaces[surfaceFiles.indexOf('src/components/sections/OnboardingPage.astro')];
requireText(onboardingSource, 'docs/stories/onboarding.story.md', 'onboarding story pointer');
requireText(onboardingSource, 'Stage four ends on a number.', 'onboarding plate-cost stage (RC-10)');
// F1 again, on a decision route: both primaries must render cta.label from
// site.ts rather than a literal, so the label cannot drift page by page. The
// browser cannot catch this — the template interpolates the same value it
// would be compared against — so the pin has to sit on the source.
if ((onboardingSource.match(/class="btn-primary"[^>]*>\{cta\.label\}/g) ?? []).length !== 2) {
	failures.push('onboarding: both primaries must render {cta.label} from site.ts');
}
for (const value of ['$32.00', '4,535.92 g', '0.80 trim yield', '180 g', '$1.59', '$0.03', '$1.62']) {
	requireText(onboardingSource, value, 'onboarding plate-cost arithmetic (RC-55)');
}
// The misc line is a default, not a constant. Saying 2% without saying it is
// the default overstates it for any kitchen that changed the setting.
requireText(onboardingSource, '2% misc (the default)', 'onboarding misc default boundary (RC-55)');
// RC-55: an unreviewed ingredient reads "check", never "clear". The page is
// the only surface that says so, so the wording is pinned to the app's.
requireText(onboardingSource, '\u201ccheck\u201d, never \u201cclear\u201d', 'onboarding unknown-is-not-clear boundary (RC-55)');
// RC-10: the duration is the owner's approximation, and the page must say so
// in those words rather than as a measurement.
requireText(onboardingSource, 'about fifteen minutes', 'onboarding owner-confirmed setup duration (RC-10)');
// RC-49/RC-55: Sage reads, it never writes. A page that sells setup as
// AI-assisted drifts straight at this line, so the disclaimer is pinned to
// the same paragraph that makes the claim.
// RC-58: the walkthrough names the upload by the app's own labels, and the
// review gate (RC-09, RC-39) travels with it or the walkthrough comes off.
for (const [text, label] of [
	['Import an invoice or price sheet', 'stage-two first choice (RC-58)'],
	['Import an ingredient list', 'stage-two second choice (RC-58)'],
	['Add ingredients manually', 'stage-two third choice (RC-58)'],
	['Choose files', 'the dropzone control (RC-58)'],
	['Review extracted records', 'the review screen heading (RC-09)'],
	['Back to Ingredients', 'the way back into setup (RC-58)'],
	['Build with Sage', 'stage-four Sage door (RC-58)'],
	['Build the dish by hand', 'stage-four manual door (RC-58)'],
	['Review the amounts and prices it reads', 'confirm-not-type framing (RC-09)'],
	['quoted back to you', 'unreadable-is-not-guessed (RC-39)'],
]) requireText(onboardingSource, text, `onboarding ${label}`);
requireText(onboardingSource, 'Sage stays open beside', 'onboarding Sage-in-setup claim (RC-55)');
requireText(onboardingSource, 'never fills a stage in for you', 'onboarding Sage read-only boundary (RC-49)');
for (const [pattern, label] of [
	[/Sage[^.]{0,80}\b(fills|enters|fixes|completes|writes|sets up)\b/i, 'Sage doing the work (RC-49 forbids autonomous changes)'],
	[/\b(rarely|barely|hardly|never) (have to )?typ/i, 'a no-typing promise (a line the upload could not read is typed)'],
	[/\b(no|zero|without) (typing|data entry)\b|\bnothing to type\b|\bdo(es)? not (have to )?type\b/i, 'a no-typing promise (a line the upload could not read is typed)'],
	[/\bfixes (it|any|every|the) (issue|problem|error)/i, 'the app repairing a problem (the guards stop and name the fix)'],
]) {
	if (pattern.test(onboardingSource)) failures.push(`onboarding states ${label}`);
}
if (!/5 stages/.test(onboardingSource)) {
	failures.push('onboarding: the setup ticket no longer states the shipped stage count (RC-10)');
}
// Part 3, after setup. Each line is read off sandbox/demo on 2026-09-06 and
// pinned so the page can neither drop the boundary nor sharpen the claim.
// 3a: the completion screen (SetupCompletionSummary.svelte).
requireText(onboardingSource, 'Your kitchen is ready', 'after-setup completion heading');
requireText(onboardingSource, 'Open shopping list', 'after-setup first action');
requireText(onboardingSource, 'Go to Today', 'after-setup second action');
// 3b: the import queue (RC-38) and its two boundaries (RC-39, RC-08).
requireText(onboardingSource, 'a photo, a PDF, a spreadsheet, a Word document or pasted text', 'after-setup five doors (RC-38)');
requireText(onboardingSource, 'quoted back', 'after-setup unreadable-is-not-guessed (RC-39)');
requireText(onboardingSource, 'without rewriting confirmed orders', 'after-setup later prices boundary (RC-08)');
// 3c: Settings > Team (RC-52). The role boundary and the Staff-sees-costs
// caveat travel with the invite claim or the claim comes off.
requireText(onboardingSource, 'one-time link', 'after-setup invite mechanism (RC-52)');
requireText(onboardingSource, 'No password', 'after-setup no-password boundary (RC-52)');
requireText(onboardingSource, 'join as Staff', 'after-setup invited role (RC-52)');
requireText(onboardingSource, 'Staff can open cost screens', 'after-setup Staff-sees-costs caveat (RC-52)');
requireText(onboardingSource, '/features/team-and-access', 'after-setup link to the full boundary (RC-52)');
for (const [pattern, label] of [
	[/(?<!\bno )(?<!\bnot a )\bcustom roles?\b(?![^.]{0,40}\b(not|no)\b)/i, 'a custom role (RC-52: none exists)'],
	[/\bpermission builder\b|\bper-screen\b/i, 'per-screen permissions (RC-52 forbids the grid)'],
	[/\bextracts?\b|\breads? (it|them|your \w+) (correctly|accurately)\b/i, 'extraction accuracy (stubbed at both test layers)'],
	[/\bautomatically\b/i, 'automation the ledger does not cover'],
	[/\b(roll|rolled) out in\b/i, 'a rollout duration (nothing supports one)'],
]) {
	if (pattern.test(onboardingSource)) failures.push(`onboarding states ${label}`);
}
// RC-55 forbids these three on this evidence. They are the claims the page
// would drift toward, and none is covered by the rehearsal artifact, which
// ran with IMPORT_AI_PROVIDER pinned to 'stub' at both layers.
for (const [pattern, label] of [
	[/\bsample data\b/i, 'sample-data path (untested at both layers)'],
	// A duration was forbidden outright until 2026-09-05, when the release
	// owner confirmed about fifteen minutes. It is an owner's figure, not a
	// measured one, so the page may approximate it and may not harden it: no
	// tighter number, no "guaranteed", no minutes attached to a stage.
	[/\bset up in\b|\bin (under|less than) \w+ minutes\b|\bguaranteed\b/i, 'a hardened setup duration (RC-10 allows only the owner-confirmed approximation)'],
	// The upload itself is a shipped route fact (RC-58, and the deployed app
	// runs a real provider: kitchen-brain docs/provisioning.md reserves the
	// stub for the E2E harness). What no rehearsal shows is how COMPLETE or
	// CORRECT a read is, so those are the words that fail the build.
	[/\b(comes?|came|coming) back (complete|correct|right|perfect|finished|filled)/i,
		'a complete or correct read (no rehearsal ran against a real provider)'],
	[/\breads? (every|each|all) (line|row|word)s?\b|\bnothing (is )?missed\b|\b(reads?|came back|comes back)[^.]{0,40}\b(perfectly|flawlessly)\b/i,
		'a complete or correct read (no rehearsal ran against a real provider)'],
]) {
	if (pattern.test(onboardingSource)) failures.push(`onboarding states ${label}`);
}

// RC-57: the spreadsheet column on /compare. It is the one column on that page
// with no pricing page behind it, so the rule that keeps the others honest
// cannot reach it. What holds it honest instead is that its cells describe the
// READER'S WORK and nothing else, drawn from a vocabulary closed at two values.
const comparisonRowLabels = [...comparisonSource.matchAll(/^\t{4}label: (.+),$/gm)].map((m) => m[1]);
const comparisonSheetValues = [...comparisonSource.matchAll(/^\t{4}sheet: '(.+)',$/gm)].map((m) => m[1]);
if (comparisonSheetValues.length !== comparisonRowLabels.length) {
	failures.push(
		`comparison (RC-57): ${comparisonRowLabels.length} row(s) but ${comparisonSheetValues.length} ` +
			'spreadsheet cell(s). Every row states what the reader would maintain.',
	);
}
// The vocabulary, closed. A third value is how this column would acquire a
// verdict, so growing it has to be a decision somebody makes here on purpose.
const sheetVocabulary = ['build', 'key'];
const strayValues = [...new Set(comparisonSheetValues)].filter((value) => !sheetVocabulary.includes(value));
if (strayValues.length > 0) {
	failures.push(
		`comparison (RC-57): spreadsheet cell value(s) [${strayValues.join(', ')}] are outside the ` +
			`closed vocabulary [${sheetVocabulary.join(', ')}]`,
	);
}
requireText(comparisonSource, "build: 'You build it'", 'spreadsheet cell vocabulary (RC-57)');
requireText(comparisonSource, "key: 'You key it in'", 'spreadsheet cell vocabulary (RC-57)');
requireText(comparePage, 'what you would maintain', 'spreadsheet column header hedge (RC-57)');
requireText(
	comparePage,
	'It is a description of your work, not of what a spreadsheet is able to do.',
	'spreadsheet legend row (RC-57)',
);
// No glyph in this column, for the reason no competitor cell has one.
if (/CellMark[^>]*row\.sheet/.test(comparePage)) {
	failures.push(
		'comparison honesty: the spreadsheet column is rendering a status mark. Those cells ' +
			'describe the reader work, and a glyph would read them as a verdict (RC-57)',
	);
}
// The three rows CostCook loses must say so in the spreadsheet column, or the
// column reads as a clean sweep, which is the failure mode RC-57 names.
for (const label of ['Lot tracking and FSMA 204', 'Fine-grained screen permissions', 'Several locations']) {
	const rowText = comparisonSource.slice(
		comparisonSource.indexOf(`label: '${label}'`),
		comparisonSource.indexOf(`label: '${label}'`) + 700,
	);
	if (!/sheetNote: 'CostCook does not support this\. In a spreadsheet, you would build and check it yourself\.'/.test(rowText)) {
		failures.push(
			`comparison (RC-57): "${label}" is a CostCook No row, so its spreadsheet cell must say ` +
				'CostCook does not support it and the spreadsheet requires building and checking',
		);
	}
}

// RC-56: the spreadsheet pain, named. The heading always carried it; the four
// tickets, which is where the eye lands, did not. These pins hold the two
// halves together. TheProblem states the pain and CustomerOutcomes answers it,
// one for one and in order, and the homepage section order rests on a
// measurement that is void if that pairing breaks (src/pages/index.astro).
const problemSource = surfaces[surfaceFiles.indexOf('src/components/sections/TheProblem.astro')];
const outcomesSource = surfaces[surfaceFiles.indexOf('src/components/sections/CustomerOutcomes.astro')];

requireText(problemSource, 'The spreadsheet works until the job changes.', 'homepage diagnosis heading (RC-56)');
requireText(problemSource, 'Most kitchens cost on a spreadsheet', 'homepage spreadsheet lede (RC-56)');
requireText(problemSource, 'docs/stories/homepage-spreadsheet-pain.story.md', 'spreadsheet-pain story pointer');
requireText(outcomesSource, 'docs/stories/homepage-spreadsheet-pain.story.md', 'spreadsheet-pain story pointer');

// RC-56 / RC-20: the fifth element. It states the two failures that are silent
// rather than slow, and its own fix, because RC-20 is a shipped safety rule and
// this block borrows no CustomerOutcomes card. It is pinned so it cannot drift
// past what RC-20 covers, which is a price or a conversion that is ABSENT.
requireText(problemSource, 'Those four are the slow ones', 'the wrong-not-slow turn (RC-56)');
requireText(
	problemSource,
	'A missing price or a missing conversion holds the costing',
	'the missing-fact safety rule the fifth element rests on (RC-20)',
);
// A present-but-wrong number is caught by nothing, in either tool. This block
// is the one place on the page tempted to promise otherwise.
for (const [pattern, label] of [
	[/\b(catch|catches|spot|spots|flag|flags)[^.]{0,40}\b(typo|wrong (price|number)|mistyped|fat.finger)/i,
		'catching a wrong-but-present number (RC-20 covers only a missing one)'],
	[/\bevery (error|mistake)\b/i, 'an all-errors promise (RC-20 covers missing facts only)'],
]) {
	if (pattern.test(problemSource)) failures.push(`homepage diagnosis states ${label}`);
}

// The four pains and the four befores, in order. Pinning the ORDER, not just
// the presence, is the point: a reordered answer list silently unpairs the two
// sections and nothing else in the build can see it.
const problemMoments = [
	'You quote from an old price',
	'You rebuild the same order four times',
	'You retype the list to buy it',
	'You learn the margin after service',
];
const outcomeBefores = [
	'A price the copy never got',
	'One number, four tabs',
	'Rows retyped into emails',
	'An invoice in a folder, not the sheet',
];
const renderedMoments = [...problemSource.matchAll(/title: '([^']+)'/g)].map((m) => m[1]);
if (renderedMoments.join('|') !== problemMoments.join('|')) {
	failures.push(
		`homepage pains (RC-56): TheProblem reads [${renderedMoments.join(', ')}] but the answers ` +
			`in CustomerOutcomes are written against [${problemMoments.join(', ')}]`,
	);
}
const renderedBefores = [...outcomesSource.matchAll(/from: '([^']+)'/g)].map((m) => m[1]);
if (renderedBefores.join('|') !== outcomeBefores.join('|')) {
	failures.push(
		`homepage answers (RC-56): CustomerOutcomes befores read [${renderedBefores.join(', ')}], ` +
			`which no longer mirror the four pains one for one and in order`,
	);
}

// Ordering: available since 2026-09-27 (RC-59). Until then it was built and
// deployed nowhere; the owner stated on 2026-09-27 that
// FEATURE_ORDERING_INTEGRATION_ENABLED is on as the deployment default, so
// every trial kitchen has it. The one word lives in src/lib/ordering.ts and is
// pinned here with the ledger row.
const orderingSource = surfaces[surfaceFiles.indexOf('src/lib/ordering.ts')];
if (!/ORDERING_STATUS = 'yes'/.test(orderingSource)) {
	failures.push('ordering status: RC-59 says online ordering is on for every kitchen since 2026-09-27; ORDERING_STATUS must read yes until the ledger row changes');
}
requireText(orderingSource, 'payment confirms the order', 'ordering copy says payment, not approval, confirms (RC-59)');
requireText(orderingSource, '72 hours', 'ordering copy carries the payment window (RC-59)');
requireText(orderingSource, 'awaiting kitchen confirmation', 'ordering copy carries the confirmation boundary');
requireText(orderingSource, 'without prices', 'ordering copy carries the price-authority boundary');
requireText(orderingSource, 'no inbound command', 'ordering copy carries the widget protocol boundary');

const forbiddenClaims = [
	[/\bknow the margin\b/i, 'full-margin language'],
	[/(?<!food-only )\bgross margin\b|\binspect the margin\b/i, 'unsupported margin label'],
	[/\bwritten only after a successful send\b/i, 'incorrect purchase-order send lifecycle'],
	[/\bthere is no invoice for the\b/i, 'unsupported no-invoice trial promise'],
	[/\bworks with no signal and with JavaScript off\b/i, 'collapsed offline and no-JavaScript promise'],
	[/\bno data entry\b/i, 'no-data-entry promise'],
	[/\bnothing is re-keyed\b/i, 'no-rekeying promise'],
	[/\bfree while/i, 'unapproved pricing promise'],
	[/\beverything downstream re-reads/i, 'confirmed-order repricing implication'],
	[/\bhandles it automatically\b/i, 'unqualified automation promise'],
	// A booked event's deposit is recorded by hand in production (inventory A-14),
	// and customer invoices are an unbuilt PRD (front-of-house 06). Both patterns
	// live in scripts/lib/money-claims.mjs, shared with the built events page.
	...moneyClaims,
	// RC-49. The assistant's model and provider are configuration, not claims,
	// and the default has never been evaluated on the marketed branch.
	// CLAUDE.md is a filename that comments cite; the lookahead spares it.
	[/\b(gemini|gpt-?\d|openai|anthropic|claude(?!\.md)|sonnet|opus|llama|mistral)\b/i, 'model or provider name'],
	[/\bnever invents? a number\b/i, 'unqualified never-invents claim (RC-49 softens it)'],
	[/\blearns? your (business|kitchen)\b/i, 'assistant-learns claim'],
	// RC-56. A verdict on the tool rather than a description of the reader's
	// hands. It would also be false: a lookup against a price tab re-costs a
	// recipe perfectly well. What is true is that her COPY holds the old number.
	[/\b(spreadsheets?|the sheet|tabs?)\b[^.]{0,45}\b(cannot|can't|can not|is unable|are unable|will never|fails to|is incapable|has no way)\b/i,
		'verdict on what a spreadsheet cannot do (RC-56 allows only the reader own manual work)'],
	// RC-40 confines named products to /compare, where a cell reports only what
	// that company own pricing page listed on a stated date. A spreadsheet suite
	// is a named product with a pricing page, so the homepage noun stays generic.
	[/\b(microsoft excel|google sheets|apple numbers|libreoffice)\b/i, 'named spreadsheet product outside /compare (RC-40)'],
	// RC-59. The four sentences an ordering feature makes it easy to write and
	// impossible to defend on a demo call.
	[/\bconfirms? the (order|booking) automatically\b/i, 'automatic order confirmation (RC-59: a submission awaits kitchen confirmation)'],
	[/\b(gets?|getting) you paid\b/i, 'a payment promise (RC-59: the client pays your own Stripe account for online orders only; CostCook promises no payout)'],
	[/\bcustomers? sees? (the|their|a) price\b[^.]{0,40}\binstantly\b/i, 'a price computed in the browser (RC-59: selections travel without prices)'],
	[/\btakes? orders? while you (sleep|cook)\b/i, 'the stock automation promise the confirmation gate contradicts'],
];
for (const [pattern, label] of forbiddenClaims) {
	if (pattern.test(publicCopy)) failures.push(`public copy contains forbidden ${label}`);
}

// 2026-09-10 CATERER WALKTHROUGH. A six-person caterer read the homepage
// between services and stopped on these; each one is held here so it cannot
// quietly come back. Tracker: docs/stories/homepage-caterer-walkthrough.story.md
//
// Considered Chain of Responsibility; not used because these are independent
// assertions over static source, and one flat list is how every other rule in
// this file is written.
//
// 1. One word for the billing unit. "Workspace" meant the price unit on the
//    fold and the whole account in the limits ticket.
for (const [pattern, label] of [
	[/\bper kitchen workspace\b/i, 'the price unit as "per kitchen workspace" (say "per kitchen")'],
	[/\bone kitchen workspace\b/i, 'the account as "one kitchen workspace" (say "one subscription covers one kitchen")'],
	// 2. Rig vocabulary. A reader has no idea what either is, and a technical
	//    reader knows exactly what it is, which is worse.
	[/\bcapture inbox\b/i, 'dev-rig vocabulary "capture inbox"'],
	[/\bstaging queue\b/i, 'dev-rig vocabulary "staging queue" (the app says review)'],
]) {
	if (pattern.test(publicCopy)) failures.push(`public copy contains ${label}`);
}
requireText(heroSource, '{launchPlan.unit}, {launchPlan.crew}', 'hero price line names the unit and the crew');
requireText(siteSource, "crew: 'unlimited crew during launch'", 'billing unit answers the per-user question');
// 3. The cost of trying it, said before the close's button. A spreadsheet
//    person knows "one real order" means every dish and price on it; silence
//    there reads as evasion. Pinned by hook, not by sentence, so the words can
//    be revised, but the paragraph has to exist and name the first-dish time.
requireText(startHereSource, 'data-real-order-setup', 'close states what one order requires first');
requireText(startHereSource, 'about fifteen minutes', 'close states the owner-confirmed first-dish time (RC-10)');
requireText(startHereSource, 'type any line it could not', 'close keeps the typed-line boundary (RC-58)');
// 4. The panel is a check, not an instruction, and the number is food only.
//    Both used to live only in pixels and alt text.
requireText(heroSource, 'packaging, rentals, staff and anything you cook over the guarantee', 'hero caption says the number is food only');
requireText(heroSource, 'What you do about the gap is your call', 'hero caption frames the panel as a check');
// 5. One wedding, one set of numbers. The hero, the outcome crop and the two
//    worked blog posts showed $26.98 / 39.7% / $89.94 from an Aug 29 capture
//    while the film showed $26.93 / 39.6% / $89.78. For a product whose whole
//    promise is that the numbers agree, that was the finding most likely to
//    cost trust. The film is canonical because it is the expensive thing to
//    redo. Its $4,847.96 total is one cent off today's app ($4,847.95 since a
//    2026-09-04 rounding fix), so the hero crop leaves the total out.
{
	const wedding = [
		heroSource,
		surfaces[surfaceFiles.indexOf('src/components/sections/SeeItRun.astro')],
		surfaces[surfaceFiles.indexOf('src/components/sections/CustomerOutcomes.astro')],
		surfaces[surfaceFiles.indexOf('src/components/sections/MenusQuotesFeature.astro')],
		await read('src/pages/blog/index.astro'),
		await read('src/content/blog/food-cost-per-guest.md'),
		await read('src/content/blog/catering-menu-pricing.md'),
	].join('\n');
	for (const retired of ['$26.98', '$89.94', '39.7%', '39.7 percent', '$4,856.55', '9.7 percentage']) {
		if (wedding.includes(retired)) failures.push(`wedding figures: retired ${retired} is back (canonical: $26.93 / 39.6% / $89.78)`);
	}
	for (const canonical of ['$26.93', '$89.78', '39.6%']) {
		requireText(heroSource, canonical, 'hero carries the film\'s wedding figures');
	}
}

if (failures.length > 0) {
	console.error(`Landing claim check failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Landing claim ledger and public-copy guard passed.');
