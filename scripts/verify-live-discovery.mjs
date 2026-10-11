import { isNonIndexablePath } from '../src/lib/seo-routes.mjs';

const origin = 'https://costcook.io';
const publicPaths = ['/', '/features', '/pricing', '/blog/food-cost-per-guest'];
const outcomePaths = ['/contact/sent', '/contact/not-sent', '/demo/sent', '/demo/not-sent'];
const crawlerAgents = ['Googlebot', 'bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'Claude-User'];
const failures = [];

// Considered Strategy; not used because every fixed probe follows the same
// HTTP contract. A user-agent header cannot prove that a crawler's real IP
// passes the CDN or firewall; inspect server logs for that separate question.
async function get(path, userAgent) {
	try {
		return await fetch(new URL(path, origin), {
			headers: userAgent ? { 'user-agent': userAgent } : undefined,
			redirect: 'manual',
			signal: AbortSignal.timeout(10_000)
		});
	} catch (error) {
		failures.push(`${path}${userAgent ? ` (${userAgent})` : ''}: request failed: ${error.message}`);
		return null;
	}
}

function canonicalIn(html) {
	return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
}

function noindexIn(html) {
	return /<meta name="robots" content="[^"]*\bnoindex\b/.test(html);
}

const robots = await get('/robots.txt');
if (robots?.status !== 200) failures.push(`/robots.txt: expected 200, got ${robots?.status ?? 'no response'}`);
else if (!(await robots.text()).includes('Sitemap: https://costcook.io/sitemap-index.xml')) {
	failures.push('/robots.txt: missing canonical sitemap reference');
}

const index = await get('/sitemap-index.xml');
if (index?.status !== 200) failures.push(`/sitemap-index.xml: expected 200, got ${index?.status ?? 'no response'}`);
else if (!(await index.text()).includes(`${origin}/sitemap-0.xml`)) {
	failures.push('/sitemap-index.xml: missing sitemap-0.xml');
}

const sitemap = await get('/sitemap-0.xml');
let sitemapText = '';
if (sitemap?.status !== 200) failures.push(`/sitemap-0.xml: expected 200, got ${sitemap?.status ?? 'no response'}`);
else sitemapText = await sitemap.text();

for (const path of publicPaths) {
	const expected = `${origin}${path}`;
	const response = await get(path);
	if (response?.status !== 200) {
		failures.push(`${path}: expected 200, got ${response?.status ?? 'no response'}`);
		continue;
	}
	const html = await response.text();
	if (canonicalIn(html) !== expected) failures.push(`${path}: canonical does not match ${expected}`);
	if (noindexIn(html) || /\bnoindex\b/i.test(response.headers.get('x-robots-tag') ?? '')) {
		failures.push(`${path}: public page is noindex`);
	}
	if (sitemapText && !sitemapText.includes(`<loc>${expected}</loc>`)) failures.push(`${path}: missing from sitemap`);
}

for (const path of outcomePaths) {
	const response = await get(path);
	if (response?.status !== 200) {
		failures.push(`${path}: expected 200, got ${response?.status ?? 'no response'}`);
		continue;
	}
	if (!isNonIndexablePath(path) || !noindexIn(await response.text())) failures.push(`${path}: missing noindex`);
	if (sitemapText && sitemapText.includes(`<loc>${origin}${path}</loc>`)) failures.push(`${path}: outcome page is in sitemap`);
}

for (const path of ['/features', '/pricing', '/blog/food-cost-per-guest']) {
	const response = await get(`${path}/`);
	const destination = response?.headers.get('location');
	if (![301, 308].includes(response?.status) || new URL(destination ?? '/', origin).href !== `${origin}${path}`) {
		failures.push(`${path}/: expected a permanent redirect to ${origin}${path}, got ${response?.status ?? 'no response'} ${destination ?? ''}`);
	}
}

// Algorithm: a bounded set of five crawler identities, one homepage request
// each. Why: this is a release probe, not a growing crawl. No index needed.
for (const userAgent of crawlerAgents) {
	const response = await get('/', userAgent);
	if (response?.status !== 200 || canonicalIn(await response.text()) !== `${origin}/`) {
		failures.push(`/: ${userAgent} user-agent did not receive the public homepage`);
	}
}

if (failures.length) {
	for (const failure of failures) console.error(`verify-live-discovery: ${failure}`);
	process.exitCode = 1;
} else {
	console.log('verify-live-discovery: public pages, outcomes, sitemap, redirects, and user-agent probes passed');
}
console.log('verify-live-discovery: user-agent probes do not prove real crawler IP access or indexing; check server logs and webmaster tools.');
