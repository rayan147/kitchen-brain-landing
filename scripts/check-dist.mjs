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
console.log(`check-dist: homepage paper intake retains ${intakeSources.length} sources, one queue, and confirmation`);
console.log(`check-dist: homepage nutrition evidence retains ${nutritionSteps.length} guided steps and proof`);
console.log(`check-dist: homepage yield calculation retains ${yieldStages.length} visible stages and proof`);
console.log(`check-dist: homepage retains ${comingPlans.length} explicitly marked Coming soon plans`);
console.log(`check-dist: homepage close retains ${realOrderInputs.length} real-order inputs, ${realOrderOutputs.length} outputs, and trial terms`);
console.log(`check-dist: homepage founder trust retains a portrait, direct contact, and ${founderConsequences.length} product consequences`);
console.log(`check-dist: homepage Sage retains ${sageStages.length} stages, ${sageScopes.length} jobs, and ${sageBoundaries.length} boundaries`);
