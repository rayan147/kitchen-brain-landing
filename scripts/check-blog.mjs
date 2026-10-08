import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { invoiceEmailLive, setupGuideSlug } from './lib/invoice-email.mjs';

const dist = new URL('../dist', import.meta.url).pathname;
const content = new URL('../src/content/blog', import.meta.url).pathname;
const blogRoot = join(dist, 'blog');
const indexHtml = readFileSync(join(blogRoot, 'index.html'), 'utf8');
const failures = [];

// Considered Chain of Responsibility; not used because this is a small fixed
// build contract whose independent failures should all be reported together.
const requireText = (html, text, label) => {
	if (!html.includes(text)) failures.push(`missing ${label}: ${text}`);
};
const requirePattern = (html, pattern, label) => {
	if (!pattern.test(html)) failures.push(`missing ${label}: ${pattern}`);
};

for (const [text, label] of [
	['Practical answers for the numbers behind the food.', 'blog identity'],
	['blog-working-through-the-number', 'emitted direction contract'],
	['How to calculate food cost per guest for a catering event', 'featured guide'],
	['Costing &amp; pricing', 'costing topic'],
	['Recipes &amp; yield', 'recipe topic'],
	['Running the event', 'event topic'],
	['Buying &amp; suppliers', 'supplier topic']
]) requireText(indexHtml, text, label);
requireText(indexHtml, 'data-blog-menu', 'Blog navigation disclosure');
requirePattern(indexHtml, /<h4[^>]*><a href="\/blog\/food-cost-per-guest"/, 'post title nested beneath its topic heading');

const expectedPosts = [
	'food-cost-per-guest',
	'catering-menu-pricing',
	'case-price-to-portion-cost',
	'client-added-40-guests',
	'shopping-list-whole-packs',
	'supplier-price-changes',
	'delivery-arrived-wrong',
	'expected-vs-actual-food-cost',
	'scale-catering-prep-list',
	'review-supplier-invoice',
	'catering-event-first-call-to-closeout',
	// RC-73: the invoice email guides publish only with the feature (src/lib/blog.ts).
	...(invoiceEmailLive ? [setupGuideSlug, 'supplier-credit-memo-by-email'] : [])
];
// The menu spells the published count (BlogMenuContents, spellCapital), so the
// pin follows the list above instead of a typed word.
const countWords = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];
requireText(indexHtml, `${countWords[expectedPosts.length - 10]} worked guides. The assumptions stay beside the arithmetic.`, 'Blog menu evidence boundary');
// While invoice email is Coming, its setup guide must not be built or linked.
if (!invoiceEmailLive) {
	if (existsSync(join(blogRoot, setupGuideSlug))) {
		failures.push(`RC-73: /blog/${setupGuideSlug} was built while INVOICE_EMAIL_STATUS is coming`);
	}
	if (indexHtml.includes(`href="/blog/${setupGuideSlug}"`)) {
		failures.push('RC-73: the blog links the invoice email setup guide while the feature is Coming');
	}
}
const builtPosts = readdirSync(blogRoot, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);
const sourcePosts = readdirSync(content, { withFileTypes: true })
	.filter((entry) => entry.isFile() && entry.name.endsWith('.md'));

for (const entry of sourcePosts) {
	const source = readFileSync(join(content, entry.name), 'utf8');
	if (source.includes('—')) failures.push(`${entry.name} contains an em dash in user-facing copy`);
	const body = source.replace(/^---\n[\s\S]*?\n---\n/, '');
	const wordCount = body.match(/[\p{L}\p{N}$%]+(?:[.’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
	const expectedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));
	const declaredReadMinutes = Number(source.match(/^readMinutes: (\d+)$/m)?.[1]);
	if (declaredReadMinutes !== expectedReadMinutes) {
		failures.push(
			`${entry.name} readMinutes is ${declaredReadMinutes}; expected ${expectedReadMinutes} at 200 words per minute`,
		);
	}
}

for (const slug of expectedPosts) {
	requireText(indexHtml, `href="/blog/${slug}"`, `${slug} Blog menu link`);
	if (!builtPosts.includes(slug)) failures.push(`missing built article route: /blog/${slug}`);
	else {
		const html = readFileSync(join(blogRoot, slug, 'index.html'), 'utf8');
		requireText(html, '"@type":"Article"', `${slug} Article structured data`);
		requireText(html, 'In this guide', `${slug} table of contents`);
		requireText(html, 'See the working inside the product.', `${slug} feature handoff`);
		requireText(html, 'blog-article-working-shown', `${slug} emitted direction contract`);
		requirePattern(html, /<h3[^>]*><a href="\/blog\//, `${slug} related post heading beneath its section`);
		const guidePath = html.indexOf('aria-labelledby="article-path-title"');
		const articleBody = html.indexOf('class="article-body');
		if (guidePath < 0 || articleBody < 0 || guidePath > articleBody) {
			failures.push(`${slug} guide navigation must precede article content in source order`);
		}
	}
}

requireText(
	readFileSync(join(blogRoot, 'case-price-to-portion-cost', 'index.html'), 'utf8'),
	'$1.4118 per usable lb × 6 lb ≈ $8.47',
	'case-to-portion unrounded worked equation'
);
for (const slug of ['food-cost-per-guest', 'catering-menu-pricing']) {
	requireText(
		readFileSync(join(blogRoot, slug, 'index.html'), 'utf8'),
		'$26.9331 ÷ 0.30 ≈ $89.78 per guest',
		`${slug} unrounded target-price equation`
	);
}

for (const [slug, text, label] of [
	['food-cost-per-guest', 'event shown in the CostCook product tour', 'current example provenance'],
	['shopping-list-whole-packs', 'You cannot order 3.3 sealed cases.', 'whole-pack value'],
	['scale-catering-prep-list', 'eight complete batches', 'batch and equipment-run boundary'],
	['expected-vs-actual-food-cost', 'Attributed food cost =', 'event attribution boundary'],
	['supplier-price-changes', 'The risk starts when a draft quote still carries the old cost.', 'draft quote risk'],
	// Book the event and Confirm order are two steps at app 7a7e407d9.
	['catering-event-first-call-to-closeout', 'Their yes books nothing. The signed agreement and the deposit do', 'acceptance boundary'],
	['catering-event-first-call-to-closeout', 'Book the event</strong> is its own step', 'booking before Confirm order'],
	...(invoiceEmailLive
		? [['supplier-credit-memo-by-email', 'It adds no purchases and changes no prices.', 'credit never moves a price']]
		: []),
]) {
	requireText(readFileSync(join(blogRoot, slug, 'index.html'), 'utf8'), text, `${slug} ${label}`);
}

if (builtPosts.length !== expectedPosts.length) {
	failures.push(`expected ${expectedPosts.length} article routes, received ${builtPosts.length}`);
}

if (failures.length > 0) {
	console.error(`Blog contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log(`Blog contract passed: index, four topic paths, ${expectedPosts.length} articles, structured data, and product handoffs.`);
