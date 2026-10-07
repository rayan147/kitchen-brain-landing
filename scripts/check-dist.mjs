// Build-output guard (issue #54): every inline <svg> in the built pages
// must carry intrinsic width/height attributes. A viewBox-only svg is
// sized by CSS alone, and until the external hashed stylesheet applies
// it paints at 100% container width — the full-screen logo flash.
// Runs as postbuild, so `npm run build` (local and Vercel) enforces it.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homepageStopIds } from './lib/homepage-stops.mjs';

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

// THE CSP IS A DEPLOY-ONLY HEADER, SO ONLY THE BUILT HTML CAN CATCH THIS.
// vercel.json serves `script-src 'self'` with no 'unsafe-inline', no nonce and
// no hash. `astro dev` and `astro preview` send no CSP at all, so an inline
// script runs in every local check and is refused on costcook.io:
//
//   Executing inline script violates the following Content Security Policy
//   directive 'script-src 'self''. The action has been blocked.
//
// That is how the product tour shipped frozen on stop 1 for as long as its
// handler was `<script is:inline>` (also what `define:vars` compiles to), with
// verify-product-tour.mjs walking all twelve stops and passing throughout.
// `type="application/ld+json"` is exempt: it is data the browser never executes,
// which is why the blog and FAQ structured-data blocks are unaffected.
// Inline `on*=` handlers are blocked by the same directive and are checked too.
const scriptTag = /<script\b([^>]*)>/g;
const inlineHandler = /\son[a-z]+\s*=\s*["']/g;
for (const page of pages) {
	const html = readFileSync(join(dist, page), 'utf8');
	const svgs = html.match(/<svg\b[^>]*>/g) ?? [];
	svgCount += svgs.length;
	for (const tag of svgs.filter((t) => !sized(t))) {
		console.error(`check-dist: ${page}: inline svg missing intrinsic width/height:\n  ${tag}`);
		failed = true;
	}
	for (const [tag, attributes] of html.matchAll(scriptTag)) {
		if (/\ssrc\s*=/.test(attributes)) continue;
		if (/type\s*=\s*["']application\/ld\+json["']/.test(attributes)) continue;
		console.error(
			`check-dist: ${page}: inline script is blocked by the production CSP ` +
				`(script-src 'self'), so it never runs on costcook.io:\n  ${tag}`
		);
		failed = true;
	}
	for (const [handler] of html.matchAll(inlineHandler)) {
		console.error(
			`check-dist: ${page}: inline event handler${handler.trimEnd()} is blocked by the ` +
				"production CSP (script-src 'self')"
		);
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
	{ id: 'events', area: 'events-and-proposals', href: '/features/events-and-proposals' },
	{ id: 'math', area: 'recipes-and-costing', href: '/features/recipes-and-costing' },
	{ id: 'menus', area: 'menus-and-quotes', href: '/features/menus-and-quotes' },
	{
		id: 'ingredients',
		area: 'ingredients-and-supplier-prices',
		href: '/features/ingredients-and-supplier-prices'
	},
	{ id: 'import', area: 'invoices-and-price-list-import', href: '/features/invoices-and-price-list-import' },
	{ id: 'nutrition', area: 'nutrition-facts-and-allergens', href: '/features/nutrition-facts-and-allergens' },
	{
		id: 'guards',
		area: 'guest-restrictions-and-dietary-guards',
		href: '/features/guest-restrictions-and-dietary-guards'
	},
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

// THE HOMEPAGE CONTRACT, rebuilt with the page on 2026-10-06 (canvas
// Home-A-story; docs/stories/homepage-redesign-2026-10.story.md; layout rules in
// docs/superpowers/specs/2026-10-06-homepage-redesign-layout.md). The old
// section-by-section pins went with the sections they pinned.

// Section order, at the rendered level (scripts/lib/homepage-stops.mjs).
const homeSectionIds = [...homeHtml.matchAll(/<section[^>]*\sid="([a-z-]+)"/g)].map((m) => m[1]);
const renderedStops = homeSectionIds.filter((id) => homepageStopIds.includes(id));
if (renderedStops.join(',') !== homepageStopIds.join(',')) {
	console.error(`check-dist: homepage renders bands [${renderedStops.join(', ')}]; expected [${homepageStopIds.join(', ')}]`);
	failed = true;
}

// Rule 1: the bands alternate cream and soft amber, hero first in cream.
const bandTones = [...homeHtml.matchAll(/class="[^"]*\bhome-band--(cream|amber)\b/g)].map((m) => m[1]);
if (bandTones.length !== homepageStopIds.length + 1 || bandTones.some((tone, i) => tone !== (i % 2 ? 'amber' : 'cream'))) {
	console.error(`check-dist: homepage bands must alternate cream and amber from the hero; got [${bandTones.join(', ')}]`);
	failed = true;
}

// The hero: one h1, the accent word, the still in the media slot loaded eagerly.
if ((homeHtml.match(/<h1\b/g) ?? []).length !== 1) {
	console.error('check-dist: homepage must have exactly one h1');
	failed = true;
}
const heroMedia = homeHtml.match(/<figure[^>]*data-hero-media[^>]*>([\s\S]*?)<\/figure>/)?.[1] ?? '';
if (!/src="\/proof\/home\/hero-pricing\.png"[^>]*loading="eager"|loading="eager"[^>]*src="\/proof\/home\/hero-pricing\.png"/.test(heroMedia)) {
	console.error('check-dist: the hero media slot must hold hero-pricing.png, loaded eagerly');
	failed = true;
}

// Every homepage frame: real capture, measured box, lazy below the hero.
const homeImgs = [...homeHtml.matchAll(/<img\b[^>]*src="\/proof\/home\/([a-z-]+)\.png"[^>]*>/g)];
const expectedFrames = ['hero-pricing', 'inquiry-mobile', 'proposal-mobile', 'payment-schedule', 'confirm-dialog', 'shop-list', 'food-cost-breakdown', 'yield-lines', 'import-review', 'allergens-labels', 'ordering-site', 'invoice-inbox', 'sage-answer'];
const renderedFrames = homeImgs.map((m) => m[1]);
if (renderedFrames.join(',') !== expectedFrames.join(',')) {
	console.error(`check-dist: homepage frames render [${renderedFrames.join(', ')}]; expected [${expectedFrames.join(', ')}]`);
	failed = true;
}
for (const [tag, name] of homeImgs) {
	if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) {
		console.error(`check-dist: homepage frame ${name} has no width and height`);
		failed = true;
	}
	if (!/\salt="[^"]{20,}"/.test(tag)) {
		console.error(`check-dist: homepage frame ${name} needs alt text that says what it shows`);
		failed = true;
	}
	if (name !== 'hero-pricing' && !/loading="lazy"/.test(tag)) {
		console.error(`check-dist: homepage frame ${name} must load lazily`);
		failed = true;
	}
}

// Phone captures (design review 2026-10-07): the wide tables are served in the
// app's own phone layout below 48rem. Each <source> carries its box so the
// swap does not shift the page, and points at a file that shipped.
// The deposit frame joined them after the second design review (6px labels at 390).
const expectedPhone = ['payment-schedule', 'food-cost-breakdown', 'yield-lines', 'import-review', 'allergens-labels', 'ordering-site', 'invoice-inbox'];
const phoneSources = [...homeHtml.matchAll(/<source\b[^>]*srcset="\/proof\/home\/([a-z-]+)-phone\.png"[^>]*>/g)];
if (phoneSources.map((m) => m[1]).join(',') !== expectedPhone.join(',')) {
	console.error(`check-dist: homepage phone captures are [${phoneSources.map((m) => m[1]).join(', ')}]; expected [${expectedPhone.join(', ')}]`);
	failed = true;
}
for (const [tag, name] of phoneSources) {
	if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag) || !/media="\(max-width: 47\.99rem\)"/.test(tag)) {
		console.error(`check-dist: phone capture ${name} needs width, height and the 47.99rem media query`);
		failed = true;
	}
	if (!existsSync(join(dist, 'proof', 'home', `${name}-phone.png`))) {
		console.error(`check-dist: phone capture ${name}-phone.png is not in dist`);
		failed = true;
	}
}

// The event walk as the workflow rail (docs/superpowers/specs/2026-10-06-workflow-rail.md):
// five stages in the app's order, all in the HTML with nothing hidden, a carry
// line between each pair, and the amber rings over the frames.
const walkStages = [...homeHtml.matchAll(/data-event-stage="([a-z]+)"/g)].map((m) => m[1]);
if (walkStages.join(',') !== 'inquiry,proposal,deposit,confirm,prep') {
	console.error(`check-dist: the event walk renders stages [${walkStages.join(', ')}]; expected inquiry, proposal, deposit, confirm, prep`);
	failed = true;
}
if ((homeHtml.match(/data-carry\b/g) ?? []).length !== 4) {
	console.error('check-dist: the workflow rail needs a carry line between each of its five stages (four)');
	failed = true;
}
if (/data-rail-stage[^>]*\shidden\b|role="tablist"/.test(homeHtml)) {
	console.error('check-dist: the workflow rail shows every stage; no hidden stage and no tabs');
	failed = true;
}
if (!/class="ring"[^>]*aria-hidden="true"/.test(homeHtml)) {
	console.error('check-dist: the workflow rail lost its decorative focus rings');
	failed = true;
}

// The close: the trial card and the founder.
for (const hook of ['data-real-order-trial', 'data-founder-trust', 'data-home-sage']) {
	if (!homeHtml.includes(hook)) {
		console.error(`check-dist: homepage is missing ${hook}`);
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
console.log(`check-dist: ${pages.length} built page(s) carry no CSP-blocked inline script or event handler`);
console.log(`check-dist: ${menuTargets.length} Features menu deep links resolve across their built area pages`);
console.log(`check-dist: /compare renders a spreadsheet column on ${compareRowCount} rows across 5 group tables`);
console.log(`check-dist: homepage renders ${homepageStopIds.length + 1} alternating bands and ${expectedFrames.length} measured frames, hero eager, the rest lazy`);
console.log('check-dist: homepage workflow rail renders five stages and four carry lines, nothing hidden');
console.log(`check-dist: shared Sage icon is present across ${sageIconSurfaces.length} homepage and decision-route contexts`);
