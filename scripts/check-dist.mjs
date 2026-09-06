// Build-output guard (issue #54): every inline <svg> in the built pages
// must carry intrinsic width/height attributes. A viewBox-only svg is
// sized by CSS alone, and until the external hashed stylesheet applies
// it paints at 100% container width — the full-screen logo flash.
// Runs as postbuild, so `npm run build` (local and Vercel) enforces it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist', import.meta.url).pathname;
// \s so stroke-width can't satisfy the check; a bare number before the
// closing quote so width="100%" (container-relative, the exact failure
// mode) can't either.
const sized = (tag) => /\swidth="\d+(?:\.\d+)?"/.test(tag) && /\sheight="\d+(?:\.\d+)?"/.test(tag);

const pages = readdirSync(dist, { recursive: true, encoding: 'utf8' }).filter((f) =>
	f.endsWith('.html')
);
let svgCount = 0;
let failed = false;
for (const page of pages) {
	const html = readFileSync(join(dist, page), 'utf8');
	const svgs = html.match(/<svg\b[^>]*>/g) ?? [];
	svgCount += svgs.length;
	for (const tag of svgs.filter((t) => !sized(t))) {
		console.error(`check-dist: ${page}: inline svg missing intrinsic width/height:\n  ${tag}`);
		failed = true;
	}
}
// RC-57: the spreadsheet column, read off the emitted /compare HTML. The source
// pins in check-landing-claims.mjs prove the values are written; only this
// proves they render, and a five-column table is exactly the kind of change
// that lands in the desktop path and gets forgotten in the phone one.
const compareHtml = readFileSync(join(dist, 'compare/index.html'), 'utf8');
const sheetCellStrings = ['You build it', 'You key it in'];
const compareGroupCount = (compareHtml.match(/what you would maintain/g) ?? []).length;
if (compareGroupCount !== 5) {
	console.error(
		`check-dist: /compare renders ${compareGroupCount} spreadsheet column header(s); every one of ` +
			'the five group tables carries the hedge (RC-57)',
	);
	failed = true;
}
// Every row states what the reader maintains, in BOTH paths: the desktop table
// and the phone card list each render one cell per row.
const sheetCellCount = sheetCellStrings.reduce(
	(sum, value) => sum + (compareHtml.split(value).length - 1),
	0,
);
const compareRowCount = (compareHtml.match(/<th scope="row"/g) ?? []).length;
if (sheetCellCount !== compareRowCount * 2) {
	console.error(
		`check-dist: /compare renders ${sheetCellCount} spreadsheet cell(s) for ${compareRowCount} table ` +
			`row(s); the table and the phone cards each need one per row, so ${compareRowCount * 2} (RC-57)`,
	);
	failed = true;
}
if (!compareHtml.includes('not of what a spreadsheet is able to do')) {
	console.error('check-dist: /compare no longer renders the spreadsheet legend row (RC-57)');
	failed = true;
}

if (failed) process.exit(1);

// The Features mega-menu is a curated shortcut into the exhaustive page. Its
// links and target ids must ship together; source-level typing cannot catch a
// template that stopped rendering one side of that contract.
const homeHtml = readFileSync(join(dist, 'index.html'), 'utf8');
const menuTargets = [
	{ id: 'math', area: 'recipes-and-costing', href: '/features/recipes-and-costing' },
	{ id: 'menus', area: 'menus-and-quotes', href: '/features/menus-and-quotes' },
	{
		id: 'ingredients',
		area: 'ingredients-and-supplier-prices',
		href: '/features/ingredients-and-supplier-prices'
	},
	{ id: 'import', area: 'invoices-and-price-list-import', href: '/features/invoices-and-price-list-import' },
	{ id: 'nutrition', area: 'nutrition-facts-and-allergens', href: '/features/nutrition-facts-and-allergens' },
	{ id: 'assistant', area: 'sage', href: '/features/sage' },
	{ id: 'team', area: 'team-and-access', href: '/features/team-and-access' },
	{ id: 'orders', area: 'order-shop-prep-pack', href: '/features/order-shop-prep-pack' },
	{
		id: 'purchasing',
		area: 'purchasing-and-receiving',
		href: '/features/purchasing-and-receiving'
	},
	{ id: 'inventory', area: 'inventory', href: '/features/inventory' },
	{ id: 'ledger', area: 'purchases-and-month-cost', href: '/features/purchases-and-month-cost' }
];

if (!homeHtml.includes('data-features-menu')) {
	console.error('check-dist: homepage is missing the Features disclosure');
	failed = true;
}

// The hero loop is a sequence, not six unrelated labels. Keep its accessible
// ordered-list contract and every visual stop in the built homepage so a
// layout refactor cannot silently erase the guidance rail.
const loopSteps = ['PRICE IN', 'COST IT', 'ORDER', 'SHOP', 'PREP', 'PACK'];
if (
	!homeHtml.includes('data-homepage-loop') ||
	!homeHtml.includes('aria-label="From supplier price to packed order"')
) {
	console.error('check-dist: homepage workflow loop is missing its ordered-list landmark');
	failed = true;
}
for (const step of loopSteps) {
	if (!homeHtml.includes(`data-loop-step="${step}"`)) {
		console.error(`check-dist: homepage workflow loop is missing ${step}`);
		failed = true;
	}
}

const demoGuideSteps = ['quote', 'shop', 'prep', 'send', 'receive', 'update'];
if (
	!homeHtml.includes('data-demo-guide') ||
	!homeHtml.includes('data-demo-guide-jump') ||
	!homeHtml.includes('data-demo-multi-run')
) {
	console.error('check-dist: homepage demo is missing its readable guide, jump link, or multi-run proof');
	failed = true;
}
for (const step of demoGuideSteps) {
	if (!homeHtml.includes(`data-demo-guide-step="${step}"`)) {
		console.error(`check-dist: homepage demo guide is missing ${step}`);
		failed = true;
	}
}

const outcomeStages = ['quote', 'plan', 'buy', 'cost-again'];
if (
	!homeHtml.includes('data-outcomes-guide') ||
	(homeHtml.match(/data-outcome-handoff/g) ?? []).length !== outcomeStages.length
) {
	console.error('check-dist: homepage outcomes are missing the guided route or one of its handoffs');
	failed = true;
}
for (const stage of outcomeStages) {
	if (!homeHtml.includes(`data-outcome-stage="${stage}"`)) {
		console.error(`check-dist: homepage outcome route is missing ${stage}`);
		failed = true;
	}
}

// RC-56: the spreadsheet pain and its mirrored answers, read off the EMITTED
// HTML rather than the component source. check-landing-claims.mjs pins both
// lists in the .astro files, which proves the strings are written; it cannot
// prove they render, and it reads them with a regex over the whole file that a
// stray `title:` elsewhere in the module would poison. This is the same class
// of hole as the tautological CTA check removed on 2026-09-05.
//
// The ORDER is the contract. TheProblem states four pains and CustomerOutcomes
// answers them one for one; the homepage section order rests on a measurement
// that is void if that pairing breaks (src/pages/index.astro).
const stripTags = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const spreadsheetPains = [
	'You quote from an old price',
	'You rebuild the same order four times',
	'You retype the list to buy it',
	'You learn the margin after service',
];
const spreadsheetBefores = [
	'A price the copy never got',
	'One number, four tabs',
	'Rows retyped into emails',
	'An invoice in a folder, not the sheet',
];
const problemSectionHtml = homeHtml.slice(
	homeHtml.indexOf('id="problem"'),
	homeHtml.indexOf('id="who"'),
);
const renderedPains = [...problemSectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((match) =>
	stripTags(match[1]),
);
if (renderedPains.join(' | ') !== spreadsheetPains.join(' | ')) {
	console.error(
		`check-dist: homepage pains render as [${renderedPains.join(', ')}] but the answers ` +
			`in outcomes are written against [${spreadsheetPains.join(', ')}] (RC-56)`,
	);
	failed = true;
}
// The "Before" side of each handoff, in route order. Every handoff renders
// Before then Instead, so the odd entries are the befores.
const outcomesSectionHtml = homeHtml.slice(
	homeHtml.indexOf('data-outcomes-guide'),
	homeHtml.indexOf('id="yield"'),
);
const renderedBefores = [...outcomesSectionHtml.matchAll(/<strong[^>]*>([\s\S]*?)<\/strong>/g)]
	.map((match) => stripTags(match[1]))
	.filter((_, index) => index % 2 === 0)
	.slice(0, spreadsheetBefores.length);
if (renderedBefores.join(' | ') !== spreadsheetBefores.join(' | ')) {
	console.error(
		`check-dist: homepage answers render befores [${renderedBefores.join(', ')}], which no ` +
			`longer mirror the four pains one for one and in order (RC-56)`,
	);
	failed = true;
}
// The fifth element renders, and stays out of the ticket stack. If it ever
// lands inside the <ol> it becomes a peer to the eye and the pairing above
// silently stops meaning anything; the h3 count already catches the obvious
// version of that, this catches the subtle one.
if (!problemSectionHtml.includes('Those four are the slow ones')) {
	console.error('check-dist: homepage diagnosis no longer names the silent failure (RC-56/RC-20)');
	failed = true;
}
const problemListHtml = problemSectionHtml.slice(
	problemSectionHtml.indexOf('<ol'),
	problemSectionHtml.indexOf('</ol>'),
);
if (problemListHtml.includes('Those four are the slow ones')) {
	console.error(
		'check-dist: the fifth element has moved inside the ticket stack, which makes it read as a ' +
			'fifth pain and unpairs the four from their answers (RC-56)',
	);
	failed = true;
}
if (!problemSectionHtml.includes('Most kitchens cost on a spreadsheet')) {
	console.error('check-dist: homepage diagnosis no longer names the spreadsheet in its lede (RC-56)');
	failed = true;
}

// The quiet-one block reads as a guide, not as three paragraphs: the shape
// stated once, the two failures as two labelled rows, the rule at the end.
// Pinned because the rows are <p> rather than <h3> on purpose (a heading here
// would join the four-pain list above and unpair it from its four answers), so
// nothing else in the build can see them go missing.
for (const [text, label] of [
	['A price you have not got yet', 'the missing-price row (RC-20)'],
	['A conversion nobody checked', 'the missing-conversion row (RC-20)'],
]) {
	if (!problemSectionHtml.includes(text)) {
		console.error(`check-dist: homepage diagnosis no longer names ${label}`);
		failed = true;
	}
}

// SECTION ORDER, at the rendered level. src/lib/stops.ts and index.astro are
// pinned to each other in check-landing-claims.mjs, but nothing checked that
// the HTML actually comes out in that order. The proof video runs SECOND since
// 2026-09-06, ahead of the diagnosis; see the note in src/pages/index.astro.
const homeSectionIds = [...homeHtml.matchAll(/<section[^>]*\sid="([a-z-]+)"/g)].map((m) => m[1]);
const demoIndex = homeSectionIds.indexOf('demo');
const problemIndex = homeSectionIds.indexOf('problem');
if (demoIndex === -1 || problemIndex === -1 || demoIndex > problemIndex) {
	console.error(
		`check-dist: homepage renders sections [${homeSectionIds.join(', ')}]; the proof video ` +
			`must run before the diagnosis (2026-09-06 owner decision, src/pages/index.astro)`,
	);
	failed = true;
}

// HEADING ORDER. The demo section lost its h2 on 2026-09-06 and regained one as
// its eyebrow when it moved to second. If it loses it again, the first heading
// under the page h1 becomes an h3 and the page skips a level at the top, which
// no other check on this page would notice.
const firstHeadingAfterH1 = homeHtml.slice(homeHtml.indexOf('</h1>')).match(/<(h[2-6])\b/);
if (firstHeadingAfterH1?.[1] !== 'h2') {
	console.error(
		`check-dist: the first heading after the homepage h1 is ` +
			`<${firstHeadingAfterH1?.[1] ?? 'none'}>, so the page skips a heading level at the top`,
	);
	failed = true;
}

const intakeSources = [
	'Photograph it',
	'Drop the PDF or the doc in',
	'Upload the spreadsheet',
	'Paste the text'
];
if (
	!homeHtml.includes('data-paper-intake') ||
	!homeHtml.includes('data-intake-queue') ||
	!homeHtml.includes('data-intake-confirmation')
) {
	console.error('check-dist: homepage paper intake is missing its source-to-confirmation path');
	failed = true;
}
for (const source of intakeSources) {
	if (!homeHtml.includes(`data-intake-source="${source}"`)) {
		console.error(`check-dist: homepage paper intake is missing ${source}`);
		failed = true;
	}
}

const nutritionSteps = ['01', '02', '03', '04', '05'];
if (
	!homeHtml.includes('data-nutrition-evidence') ||
	!homeHtml.includes('data-nutrition-proof') ||
	!homeHtml.includes('data-nutrition-cue')
) {
	console.error('check-dist: homepage nutrition section is missing its evidence rail or proof');
	failed = true;
}
for (const step of nutritionSteps) {
	if (!homeHtml.includes(`data-nutrition-step="${step}"`)) {
		console.error(`check-dist: homepage nutrition evidence is missing step ${step}`);
		failed = true;
	}
}

const yieldStages = ['Used in recipe', 'Trim yield', 'Required to buy', 'Purchase cost', 'Line cost'];
if (!homeHtml.includes('data-yield-path') || !homeHtml.includes('data-yield-proof')) {
	console.error('check-dist: homepage yield section is missing its calculation path or product proof');
	failed = true;
}
for (const stage of yieldStages) {
	if (!homeHtml.includes(`data-yield-stage="${stage}"`)) {
		console.error(`check-dist: homepage yield calculation is missing ${stage}`);
		failed = true;
	}
}

const comingPlans = ['labels', 'par-buying', 'dietary', 'spanish'];
if (!homeHtml.includes('data-coming-plans')) {
	console.error('check-dist: homepage is missing the Coming soon plan');
	failed = true;
}
for (const plan of comingPlans) {
	if (!homeHtml.includes(`data-coming-plan="${plan}"`)) {
		console.error(`check-dist: homepage Coming plan is missing ${plan}`);
		failed = true;
	}
}

const realOrderInputs = ['One menu', 'Guest count', 'Current prices'];
const realOrderOutputs = ['Food cost', 'Shopping', 'Prep', 'Pack'];
if (!homeHtml.includes('data-real-order-path') || !homeHtml.includes('data-real-order-trial')) {
	console.error('check-dist: homepage close is missing its real-order path or trial boundary');
	failed = true;
}
for (const input of realOrderInputs) {
	if (!homeHtml.includes(`data-order-input="${input}"`)) {
		console.error(`check-dist: homepage real-order path is missing input ${input}`);
		failed = true;
	}
}
for (const output of realOrderOutputs) {
	if (!homeHtml.includes(`data-order-output="${output}"`)) {
		console.error(`check-dist: homepage real-order path is missing output ${output}`);
		failed = true;
	}
}

const founderConsequences = ['missing', 'connected', 'event'];
if (
	!homeHtml.includes('data-founder-trust') ||
	!homeHtml.includes('data-founder-portrait') ||
	!homeHtml.includes('data-founder-contact')
) {
	console.error('check-dist: homepage founder section is missing its portrait, trust scene, or contact');
	failed = true;
}
for (const consequence of founderConsequences) {
	if (!homeHtml.includes(`data-founder-consequence="${consequence}"`)) {
		console.error(`check-dist: homepage founder section is missing ${consequence}`);
		failed = true;
	}
}

// Sage is one bounded path: records are read, one proposal can be prepared,
// and a person decides whether it moves. Preserve that story and both pieces
// of product evidence when the homepage section is edited.
const sageStages = ['read', 'prepare', 'approve'];
const sageScopes = ['Run the shift', 'Check a recipe', 'Check stock and buying', 'Finish setup', 'Prepare one change'];
const sageBoundaries = ['Evidence', 'Access', 'Action'];
if (
	!homeHtml.includes('data-sage-home') ||
	!homeHtml.includes('data-sage-answer') ||
	!homeHtml.includes('data-sage-onboarding')
) {
	console.error('check-dist: homepage Sage section is missing its answer or onboarding evidence');
	failed = true;
}
for (const stage of sageStages) {
	if (!homeHtml.includes(`data-sage-stage="${stage}"`)) {
		console.error(`check-dist: homepage Sage path is missing ${stage}`);
		failed = true;
	}
}
for (const scope of sageScopes) {
	if (!homeHtml.includes(`data-sage-scope="${scope}"`)) {
		console.error(`check-dist: homepage Sage scope is missing ${scope}`);
		failed = true;
	}
}
for (const boundary of sageBoundaries) {
	if (!homeHtml.includes(`data-sage-boundary="${boundary}"`)) {
		console.error(`check-dist: homepage Sage boundary is missing ${boundary}`);
		failed = true;
	}
}

// Sage owns one distinctive mark wherever a reader encounters it as a named
// product feature. The shared component carries a context hook so a future
// visual refactor cannot leave the homepage and supporting decision routes
// speaking different icon languages.
const sageIconSurfaces = [
	['index.html', 'homepage'],
	['index.html', 'navigation'],
	['features/sage/index.html', 'specialist'],
	['features/team-and-connections/index.html', 'feature-area'],
	['compare/index.html', 'comparison'],
	['faq/index.html', 'faq'],
	['tour/main/index.html', 'tour']
];
for (const [page, context] of sageIconSurfaces) {
	const html = readFileSync(join(dist, page), 'utf8');
	if (!html.includes(`data-sage-icon="${context}"`)) {
		console.error(`check-dist: ${page} is missing the shared Sage icon in ${context}`);
		failed = true;
	}
}

for (const target of menuTargets) {
	const href = `href="${target.href ?? `/features/${target.area}#features-${target.id}`}"`;
	const id = `id="features-${target.id}"`;
	const featuresHtml = readFileSync(join(dist, `features/${target.area}/index.html`), 'utf8');
	if (!homeHtml.includes(href)) {
		console.error(`check-dist: Features menu is missing ${href}`);
		failed = true;
	}
	if (!featuresHtml.includes(id)) {
		console.error(`check-dist: Features page is missing ${id}`);
		failed = true;
	}
}

if (failed) process.exit(1);
console.log(`check-dist: ${svgCount} inline svg(s) across ${pages.length} page(s) all carry intrinsic width/height`);
console.log(`check-dist: ${menuTargets.length} Features menu deep links resolve across their built area pages`);
console.log(`check-dist: homepage workflow loop retains ${loopSteps.length} ordered visual stops`);
console.log(`check-dist: homepage demo retains ${demoGuideSteps.length} readable handoffs and the multi-run boundary`);
console.log(`check-dist: homepage outcomes retain ${outcomeStages.length} guided handoffs and their proof`);
console.log(`check-dist: /compare renders a spreadsheet column on ${compareRowCount} rows across 5 group tables`);
console.log(`check-dist: homepage diagnosis renders ${spreadsheetPains.length} spreadsheet pains mirrored by ${spreadsheetBefores.length} answers`);
console.log(`check-dist: homepage paper intake retains ${intakeSources.length} sources, one queue, and confirmation`);
console.log(`check-dist: homepage nutrition evidence retains ${nutritionSteps.length} guided steps and proof`);
console.log(`check-dist: homepage yield calculation retains ${yieldStages.length} visible stages and proof`);
console.log(`check-dist: homepage retains ${comingPlans.length} explicitly marked Coming soon plans`);
console.log(`check-dist: homepage close retains ${realOrderInputs.length} real-order inputs, ${realOrderOutputs.length} outputs, and trial terms`);
console.log(`check-dist: homepage founder trust retains a portrait, direct contact, and ${founderConsequences.length} product consequences`);
console.log(`check-dist: homepage Sage retains ${sageStages.length} stages, ${sageScopes.length} jobs, and ${sageBoundaries.length} boundaries`);
console.log(`check-dist: shared Sage icon is present across ${sageIconSurfaces.length} homepage and decision-route contexts`);
