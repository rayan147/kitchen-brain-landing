import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFile(join(root, path), 'utf8');

const surfaceFiles = [
	'src/lib/site.ts',
	'src/components/sections/Hero.astro',
	// The hero's loop diagram carries public copy, so it goes through the
	// forbidden-claims scan like every other surface. Its whole risk is
	// overclaiming automation.
	'src/components/LoopBand.astro',
	'src/components/sections/TheProblem.astro',
	'src/components/sections/CustomerOutcomes.astro',
	'src/components/sections/SeeItRun.astro',
	'src/components/sections/TheYield.astro',
	'src/components/sections/BuiltForKitchens.astro',
	'src/components/sections/EveryFeature.astro',
	'src/lib/features.ts',
	'src/components/sections/StartHere.astro'
];

const [index, featuresPage, contactPage, ledger, ...surfaces] = await Promise.all([
	read('src/pages/index.astro'),
	read('src/pages/features.astro'),
	read('src/pages/contact.astro'),
	read('docs/release-claim-ledger.md'),
	...surfaceFiles.map(read)
]);
const publicCopy = surfaces.join('\n');
const siteSource = surfaces[0];
const heroSource = surfaces[1];
const startHereSource = surfaces.at(-1);

const failures = [];
const requireText = (source, value, label) => {
	if (!source.includes(value)) failures.push(`${label}: missing ${JSON.stringify(value)}`);
};

for (const component of [
	'TheProblem',
	'SeeItRun',
	'CustomerOutcomes',
	'TheYield',
	'BuiltForKitchens',
	'StartHere'
]) {
	requireText(index, `<${component} />`, 'landing composition');
}
// The exhaustive list lives on its own page. The outcome section links to it,
// so completeness stays available without making the homepage exhaustive.
requireText(featuresPage, '<EveryFeature />', 'features page composition');
requireText(siteSource, "href: '/features'", 'features page nav link');
requireText(siteSource, "href: '/contact'", 'contact page nav link');
requireText(publicCopy, 'See every shipped feature', 'features page homepage link');
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

// Seven stops, one claim each. SeeItRun sits ahead of CustomerOutcomes so the
// cold visitor settles "is this real" before being asked to believe outcomes.
const expectedSectionOrder = [
	'<Hero />',
	'<TheProblem />',
	'<SeeItRun />',
	'<CustomerOutcomes />',
	'<TheYield />',
	'<BuiltForKitchens />',
	'<StartHere />'
];
let previousSectionIndex = -1;
for (const component of expectedSectionOrder) {
	const sectionIndex = index.indexOf(component);
	if (sectionIndex <= previousSectionIndex) {
		failures.push(`landing composition: ${component} is out of the approved visitor-workflow order`);
	}
	previousSectionIndex = sectionIndex;
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
for (let claim = 1; claim <= 37; claim += 1) {
	requireText(ledger, `RC-${String(claim).padStart(2, '0')}`, 'release ledger');
}

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
for (const [label, source] of [['hero', heroSource], ['close', startHereSource]]) {
	if (!/class="btn-primary[^"]*"[\s\S]{0,80}\{cta\.label\}/.test(source)) {
		failures.push(`${label} primary CTA no longer renders cta.label`);
	}
}
if (/class="btn-primary[^"]*"[\s\S]{0,200}demoCta\.label/.test(startHereSource)) {
	failures.push('close section renders the demo CTA as a second primary action');
}

const forbiddenClaims = [
	[/\bknow the margin\b/i, 'full-margin language'],
	[/\bno data entry\b/i, 'no-data-entry promise'],
	[/\bnothing is re-keyed\b/i, 'no-rekeying promise'],
	[/\bfree while/i, 'unapproved pricing promise'],
	[/\beverything downstream re-reads/i, 'confirmed-order repricing implication'],
	[/\bhandles it automatically\b/i, 'unqualified automation promise']
];
for (const [pattern, label] of forbiddenClaims) {
	if (pattern.test(publicCopy)) failures.push(`public copy contains forbidden ${label}`);
}

if (failures.length > 0) {
	console.error(`Landing claim check failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Landing claim ledger and public-copy guard passed.');
