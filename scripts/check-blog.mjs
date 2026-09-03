import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist', import.meta.url).pathname;
const blogRoot = join(dist, 'blog');
const indexHtml = readFileSync(join(blogRoot, 'index.html'), 'utf8');
const failures = [];

// Considered Chain of Responsibility; not used because this is a small fixed
// build contract whose independent failures should all be reported together.
const requireText = (html, text, label) => {
	if (!html.includes(text)) failures.push(`missing ${label}: ${text}`);
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

const expectedPosts = [
	'food-cost-per-guest',
	'catering-menu-pricing',
	'case-price-to-portion-cost',
	'client-added-40-guests',
	'shopping-list-whole-packs',
	'supplier-price-changes'
];
const builtPosts = readdirSync(blogRoot, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);

for (const slug of expectedPosts) {
	if (!builtPosts.includes(slug)) failures.push(`missing built article route: /blog/${slug}`);
	else {
		const html = readFileSync(join(blogRoot, slug, 'index.html'), 'utf8');
		requireText(html, '"@type":"Article"', `${slug} Article structured data`);
		requireText(html, 'In this guide', `${slug} table of contents`);
		requireText(html, 'See the working inside the product.', `${slug} feature handoff`);
		requireText(html, 'blog-article-working-shown', `${slug} emitted direction contract`);
	}
}

if (builtPosts.length !== expectedPosts.length) {
	failures.push(`expected ${expectedPosts.length} article routes, received ${builtPosts.length}`);
}

if (failures.length > 0) {
	console.error(`Blog contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Blog contract passed: index, four topic paths, six articles, structured data, and product handoffs.');
