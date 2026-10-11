import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://costcook.io';
const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
// Considered Set; not used because the four form outcome routes are a fixed list.
const utilityPaths = ['/contact/sent', '/contact/not-sent', '/demo/sent', '/demo/not-sent'];

// Considered Chain of Responsibility; not used because these independent
// build assertions should report every failure in one run.
// Algorithm: index sitemap URLs once, then check every built page once.
// Why: published routes grow with the site and each page needs membership.
// Complexity: O(n) time and O(n) memory for n published URLs.
// Alternative rejected: scanning the XML for every page, O(n²).
// Structure: Set<URL> for sitemap membership, scoped to this build check.
// Why: each built page needs one by-URL lookup and duplicates must be caught.
// Costs: average O(1) lookup, O(n) memory.
// Alternative rejected: array.includes per page, O(n²) across the build.
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapUrls);
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
	if (utilityPaths.includes(path)) {
		if (!robots?.split(',').some((rule) => rule.trim() === 'noindex')) failures.push(`${path}: missing noindex`);
		if (sitemapSet.has(expectedCanonical)) failures.push(`${path}: utility page is in sitemap`);
	} else {
		if (robots?.includes('noindex')) failures.push(`${path}: public page has noindex`);
		if (!sitemapSet.has(expectedCanonical)) failures.push(`${path}: missing from sitemap`);
	}
}

for (const url of sitemapUrls) {
	if (url !== `${origin}/` && url.endsWith('/')) failures.push(`${url}: trailing slash in sitemap`);
	if (!url.startsWith(`${origin}/`)) failures.push(`${url}: unexpected sitemap origin`);
}

if (failures.length) {
	for (const failure of failures) console.error(`check-seo: ${failure}`);
	process.exit(1);
}

console.log(`check-seo: ${sitemapUrls.length} canonical pages in sitemap; ${utilityPaths.length} form outcome pages are noindex`);
