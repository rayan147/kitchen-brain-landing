// Build-output guard (issue #54): every inline <svg> in the built pages
// must carry intrinsic width/height attributes. A viewBox-only svg is
// sized by CSS alone, and until the external hashed stylesheet applies
// it paints at 100% container width — the full-screen logo flash.
// Runs as postbuild, so `npm run build` (local and Vercel) enforces it.
import { createHash } from 'node:crypto';
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
// Considered Strategy; not used because these four fixed decision pages all
// state the same founding offer, with no variant behavior to select.
for (const page of ['index.html', 'pricing/index.html', 'faq/index.html', 'compare/index.html']) {
	const html = readFileSync(join(dist, page), 'utf8');
	for (const term of ['$49/month', '$99/month', 'first 20 kitchens', 'locked in for life', 'Founding offer open now']) {
		if (!html.toLowerCase().includes(term.toLowerCase())) {
			console.error(`check-dist: ${page} is missing founding offer term ${term}`);
			failed = true;
		}
	}
}
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

// THE HOMEPAGE CONTRACT, revised with the compact mockup on 2026-10-22.
// Considered Composite; not used because these are four fixed, flat sections.
const homeSectionIds = [...homeHtml.matchAll(/<section[^>]*\sid="([a-z-]+)"/g)].map((match) => match[1]);
const renderedStops = homeSectionIds.filter((id) => homepageStopIds.includes(id));
if (renderedStops.join(',') !== homepageStopIds.join(',')) {
  console.error(`check-dist: homepage renders [${renderedStops.join(', ')}]; expected [${homepageStopIds.join(', ')}]`);
  failed = true;
}
const bandTones = [...homeHtml.matchAll(/class="[^"]*\bhome-band--(cream|amber)\b/g)].map((match) => match[1]);
if (bandTones.join(',') !== 'cream,amber,cream,amber,cream') {
  console.error(`check-dist: homepage band tones are [${bandTones.join(', ')}]`);
  failed = true;
}
if ((homeHtml.match(/<h1\b/g) ?? []).length !== 1) {
  console.error('check-dist: homepage must have exactly one h1');
  failed = true;
}
for (const claim of [
  'Know the food', '29.2%', '$95.00', '$14,250.00', '$4,165.50',
  'Illustrative summary', 'Card required to start', 'Cost your first dish'
]) {
  if (!homeHtml.includes(claim)) {
    console.error(`check-dist: homepage is missing ${claim}`);
    failed = true;
  }
}
if (/estimated profit/i.test(homeHtml)) {
  console.error('check-dist: food margin must not be called estimated profit');
  failed = true;
}
const journey = homeHtml.match(/<ol class="journey"[\s\S]*?<\/ol>/)?.[0] ?? '';
const steps = [...journey.matchAll(/<strong[^>]*>([^<]+)<\/strong>/g)].map((match) => match[1]);
if (steps.join(',') !== 'Purchasing,Receiving,Prep,Packing,Closeout') {
  console.error(`check-dist: confirmed kitchen journey renders [${steps.join(', ')}]`);
  failed = true;
}
const costFrame = homeHtml.match(/<img[^>]*src="\/proof\/home\/food-cost-breakdown\.png"[^>]*>/)?.[0] ?? '';
if (!/alt="[^"]{20,}"/.test(costFrame) || !/width="600"/.test(costFrame) || !/height="661"/.test(costFrame) || !/loading="lazy"/.test(costFrame)) {
  console.error('check-dist: dish-cost proof needs meaningful alt, measured dimensions and lazy loading');
  failed = true;
}
if (!/<source type="image\/webp" srcset="\/proof\/home\/food-cost-breakdown\.webp">/.test(homeHtml)) {
  console.error('check-dist: dish-cost proof has no WebP source');
  failed = true;
}
for (const phrase of ['stripe', 'Supplier invoice email', 'Square', 'QuickBooks Online', 'Direct label printers', 'CostCook online ordering', 'Saved priced menu', 'Watch 2-min video']) {
  if (!homeHtml.includes(phrase)) {
    console.error(`check-dist: connections summary is missing ${phrase}`);
    failed = true;
  }
}
if (!homeHtml.includes('data-founder-trust') || !homeHtml.includes('data-real-order-trial')) {
  console.error('check-dist: founder and trial terms must remain visible');
  failed = true;
}
// Sage stays available in navigation and its guide; the homepage no longer
// spends a full band on it. Check the shared icon in those remaining contexts.
const sageIconSurfaces = [
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

// WebP captures (mobile review 2026-10-09). integrations/webp-sources.mjs
// offers a WebP for every PNG in scripts/webp-manifest.json. A PNG re-shot
// without `node scripts/make-webp.mjs` would ship beside its old WebP, and
// every modern browser would show the old screen: fail on any hash mismatch.
const webpManifest = JSON.parse(readFileSync(new URL('./webp-manifest.json', import.meta.url), 'utf8'));
for (const [png, hash] of Object.entries(webpManifest)) {
	const pngPath = join(dist, 'proof', png);
	const webpPath = pngPath.replace(/\.png$/, '.webp');
	if (!existsSync(pngPath) || !existsSync(webpPath)) {
		console.error(`check-dist: proof/${png} or its WebP is missing; run node scripts/make-webp.mjs`);
		failed = true;
	} else if (createHash('sha256').update(readFileSync(pngPath)).digest('hex') !== hash) {
		console.error(`check-dist: proof/${png} changed after its WebP was made; run node scripts/make-webp.mjs`);
		failed = true;
	}
}
if (!/<source type="image\/webp" srcset="\/proof\/home\/[a-z-]+\.webp">/.test(homeHtml)) {
	console.error('check-dist: homepage captures carry no WebP source');
	failed = true;
}

if (failed) process.exit(1);
console.log(`check-dist: ${svgCount} inline svg(s) across ${pages.length} page(s) all carry intrinsic width/height`);
console.log(`check-dist: ${pages.length} built page(s) carry no CSP-blocked inline script or event handler`);
console.log(`check-dist: ${menuTargets.length} Features menu deep links resolve across their built area pages`);
console.log(`check-dist: /compare renders a spreadsheet column on ${compareRowCount} rows across 5 group tables`);
console.log(`check-dist: homepage renders ${homepageStopIds.length + 1} alternating bands, three confirmation routes, five shared kitchen steps, and a measured food-cost capture`);
console.log(`check-dist: shared Sage icon is present across ${sageIconSurfaces.length} navigation and decision-route contexts`);
