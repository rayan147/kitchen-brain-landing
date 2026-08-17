import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFile(join(root, path), 'utf8');

const surfaceFiles = [
	'src/lib/site.ts',
	'src/components/sections/Hero.astro',
	'src/components/sections/TheLoop.astro',
	'src/components/sections/TheProblem.astro',
	'src/components/sections/CostingChain.astro',
	'src/components/sections/GuidedSetup.astro',
	'src/components/sections/CatalogSystem.astro',
	'src/components/sections/OrderOperations.astro',
	'src/components/sections/PurchaseLoop.astro',
	'src/components/sections/CostTransparency.astro',
	'src/components/sections/SeeItRun.astro',
	'src/components/sections/FeatureBridge.astro',
	'src/components/sections/EveryFeature.astro',
	'src/lib/features.ts',
	'src/components/sections/BookDemo.astro'
];

const [index, featuresPage, ledger, ...surfaces] = await Promise.all([
	read('src/pages/index.astro'),
	read('src/pages/features.astro'),
	read('docs/release-claim-ledger.md'),
	...surfaceFiles.map(read)
]);
const publicCopy = surfaces.join('\n');
const siteSource = surfaces[0];
const bookDemoSource = surfaces.at(-1);

const failures = [];
const requireText = (source, value, label) => {
	if (!source.includes(value)) failures.push(`${label}: missing ${JSON.stringify(value)}`);
};

for (const component of [
	'CostingChain',
	'SeeItRun',
	'GuidedSetup',
	'CatalogSystem',
	'OrderOperations',
	'PurchaseLoop',
	'CostTransparency',
	'FeatureBridge'
]) {
	requireText(index, `<${component} />`, 'landing composition');
}
// The exhaustive list lives on its own page; the home page carries only the
// bridge. Both halves must exist or the nav link / bridge link goes dead.
requireText(featuresPage, '<EveryFeature />', 'features page composition');
requireText(siteSource, "href: '/features'", 'features page nav link');

const expectedSectionOrder = [
	'<Hero />',
	// The canonical loop rail sits directly under the hero on purpose: it answers
	// "what is this" before the page argues about anything. Moving it below
	// TheProblem turns it back into a seventh overview.
	'<TheLoop />',
	'<TheProblem />',
	'<CostingChain />',
	'<SeeItRun />',
	'<GuidedSetup />',
	'<CatalogSystem />',
	'<OrderOperations />',
	'<PurchaseLoop />',
	'<CostTransparency />',
	'<FeatureBridge />',
	'<BookDemo />'
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
requireText(publicCopy, 'Watch the 1:51 product tour', 'hero proof link');
for (let claim = 1; claim <= 33; claim += 1) {
	requireText(ledger, `RC-${String(claim).padStart(2, '0')}`, 'release ledger');
}

if (/href:\s*['"]#book['"]/.test(siteSource)) {
	failures.push('booking CTA still points to the inline booking section');
}
if (bookDemoSource && /<iframe\b/i.test(bookDemoSource)) {
	failures.push('booking section still contains an inline scheduler');
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
