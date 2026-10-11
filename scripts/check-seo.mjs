import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNonIndexablePath, nonIndexablePaths } from '../src/lib/seo-routes.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://costcook.io';
const stagingBuild = process.env.PUBLIC_NOINDEX === '1';
const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
// Considered Chain of Responsibility; not used because these independent
// build assertions should report every failure in one run.
// Algorithm: index sitemap URLs, then compare them with every built page.
// Why: both published routes and sitemap entries grow with the site.
// Complexity: O(n + m) time and O(n + m) memory for n pages and m URLs.
// Alternative rejected: scanning the XML for every page, O(n²).
// Structure: two build-scoped Sets of canonical URL strings.
// Why: detect missing, duplicate, and extra sitemap URLs by membership.
// Costs: average O(1) lookup, O(n + m) memory.
// Alternative rejected: array.includes per page, O(n²) across the build.
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapUrls);
const expectedSitemapSet = new Set();
const failures = [];

if (sitemapSet.size !== sitemapUrls.length) failures.push('sitemap contains duplicate URLs');

const pages = readdirSync(dist, { recursive: true, encoding: 'utf8' }).filter((file) => file.endsWith('index.html'));
for (const file of pages) {
	const path = file === 'index.html' ? '/' : `/${file.slice(0, -'/index.html'.length)}`;
	const expectedCanonical = `${origin}${path}`;
	const html = readFileSync(join(dist, file), 'utf8');
	const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
	const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];

	if (canonical !== expectedCanonical) failures.push(`${path}: canonical is ${canonical ?? 'missing'}`);
	if (isNonIndexablePath(path)) {
		if (!robots?.split(',').some((rule) => rule.trim() === 'noindex')) failures.push(`${path}: missing noindex`);
		if (sitemapSet.has(expectedCanonical)) failures.push(`${path}: utility page is in sitemap`);
	} else {
		expectedSitemapSet.add(expectedCanonical);
		if (stagingBuild && !robots?.includes('noindex')) failures.push(`${path}: staging page is indexable`);
		if (!stagingBuild && robots?.includes('noindex')) failures.push(`${path}: public page has noindex`);
		if (!sitemapSet.has(expectedCanonical)) failures.push(`${path}: missing from sitemap`);
	}
}

for (const url of sitemapUrls) {
	if (url !== `${origin}/` && url.endsWith('/')) failures.push(`${url}: trailing slash in sitemap`);
	if (!url.startsWith(`${origin}/`)) failures.push(`${url}: unexpected sitemap origin`);
	if (!expectedSitemapSet.has(url)) failures.push(`${url}: sitemap URL has no built indexable page`);
}

const homeHtml = readFileSync(join(dist, 'index.html'), 'utf8');
if (!/<title>[^<]*Catering software[^<]*\| CostCook<\/title>/.test(homeHtml)) {
	failures.push('homepage title does not name catering software and CostCook');
}
const organizationText = homeHtml.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
if (!organizationText) {
	failures.push('homepage is missing Organization structured data');
} else {
	try {
		const organization = JSON.parse(organizationText);
		if (organization['@type'] !== 'Organization' || organization.name !== 'CostCook' || organization.url !== origin) {
			failures.push('homepage Organization structured data has the wrong identity');
		}
	} catch {
		failures.push('homepage Organization structured data is invalid JSON');
	}
}

if (failures.length) {
	for (const failure of failures) console.error(`check-seo: ${failure}`);
	process.exit(1);
}

console.log(`check-seo: ${sitemapUrls.length} canonical pages in sitemap; ${nonIndexablePaths.length} form outcome pages are noindex`);
