import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Built-page contract for /features/online-ordering (RC-59).
 *
 * WHAT THIS IS ACTUALLY GUARDING.
 *  - The film is there, with its poster and captions, and the transcript
 *    under it is the captions file line for line (principle 4).
 *  - The settings walk names the app's four tabs, in order, and Go live lists
 *    exactly the app's four blockers.
 *  - The snippet is a shape: no working site id, no localhost.
 *  - A request is never called booked, and every primary says the CTA label.
 *  - The homepage ordering row and the area page link the guide.
 *
 * Every failure is collected and reported together, then the script exits 1,
 * like its sibling page contracts.
 *
 * Considered Strategy; not used because this validates one stable built-page
 * contract and has no interchangeable validation algorithms.
 */
const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'features/online-ordering/index.html'), 'utf8');
const home = readFileSync(join(dist, 'index.html'), 'utf8');
const area = readFileSync(join(dist, 'features/the-day-itself/index.html'), 'utf8');
const site = readFileSync(join(root, 'src/lib/site.ts'), 'utf8');
const ctaLabel = site.match(/export const cta = \{\s*label: '([^']+)'/)?.[1];

const failures = [];
const fail = (message) => failures.push(message);
const plain = (text) => text.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
const decode = (text) =>
	text
		.replace(/<script[\s\S]*?<\/script>/g, ' ')
		.replace(/<style[\s\S]*?<\/style>/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&rsquo;/g, '’')
		.replace(/\s+/g, ' ');
const prose = decode(html);

// The film, its poster and its captions, all served.
for (const asset of ['/film/dropoff.mp4', '/film/dropoff.vtt', '/film/dropoff-poster.jpg']) {
	if (!html.includes(asset)) fail(`the page does not reference ${asset}`);
	if (!existsSync(join(dist, asset))) fail(`${asset} is not in dist`);
}
// The words are burned in; a default track printed each line twice.
if (!/<track[^>]*kind="captions"/.test(html)) fail('the film lost its captions track');
if (/<track[^>]*\bdefault\b/.test(html)) fail('the captions track is on by default and doubles the burned-in words');
if ((html.match(/data-ordering-limit/g) ?? []).length !== 5) fail('expected five limits');
if (/<video[^>]*autoplay/.test(html)) fail('the film autoplays');
const cues = readFileSync(join(root, 'public/film/dropoff.vtt'), 'utf8')
	.split(/\n\n+/)
	.map((block) => block.split('\n').filter((line) => line && !line.includes('-->') && line !== 'WEBVTT').join(' '))
	.filter(Boolean)
	.map(plain);
const transcript = [...html.matchAll(/<li data-ordering-film-line[^>]*>([\s\S]*?)<\/li>/g)].map((m) => plain(decode(m[1])));
if (transcript.length !== cues.length || transcript.some((line, i) => line !== cues[i])) {
	fail(`the transcript does not match dropoff.vtt (${transcript.length} lines, ${cues.length} cues)`);
}

// The app's four tabs, in its order, and its four Go live blockers.
const tabs = [...html.matchAll(/data-ordering-tab="([^"]+)"/g)].map((m) => m[1]);
if (tabs.join('|') !== 'Setup|Menus|Look|Put on your website') fail(`tabs read ${tabs.join(', ')}`);
if ((html.match(/data-ordering-golive-need/g) ?? []).length !== 4) fail('Go live should list exactly the four blockers');
for (const choice of ['Card, through CostCook', 'A partner collects it', 'You collect it']) {
	if (!html.includes(`data-ordering-payment="${choice}"`)) fail(`payment choice missing: ${choice}`);
}
if (!prose.includes('Your web person pastes two lines. You never touch the code.')) fail('the snap line is gone');
if (!html.includes('data-ordering-snippet')) fail('the snippet ticket is gone');

// Never a working id or a local address.
if (/site_[A-Za-z0-9]{6,}/.test(html)) fail('the page prints a site id');
if (/localhost|127\.0\.0\.1/.test(prose)) fail('the page prints a local address');
if (/request[^.]{0,40}\bbooked\b/i.test(prose) && !/A request isn’t a booking/.test(prose)) fail('a request is called booked');
if (prose.includes('—')) fail('an em dash in the copy');

const primaries = [...html.matchAll(/<a[^>]*class="btn-primary"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => decode(m[1]).trim());
if (!primaries.length || primaries.some((label) => label !== ctaLabel)) fail(`primaries read ${primaries.join(', ')}; cta.label is ${ctaLabel}`);

if (!home.includes('href="/features/online-ordering"')) fail('the homepage ordering row does not link the guide');
if (!area.includes('href="/features/online-ordering"')) fail('the-day-itself does not link the guide');

if (failures.length) {
	console.error(`Online ordering page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log('Online ordering page contract passed: film, captions, transcript, four tabs, Go live, snippet shape, links.');
