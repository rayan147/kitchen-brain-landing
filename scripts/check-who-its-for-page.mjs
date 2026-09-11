import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/who-its-for/index.html', import.meta.url), 'utf8');
const failures = [];

// Considered Chain of Responsibility; not used because this is one fixed
// build contract whose independent assertions should report together.
const requireText = (text, label) => {
	if (!html.includes(text)) failures.push(`missing ${label}: ${text}`);
};

for (const [text, label] of [
	['Is CostCook right for your kitchen?', 'page identity'],
	['One kitchen · two kinds of service', 'paired service ticket'],
	['Regular service', 'regular restaurant service'],
	['Private dinner', 'special-event service'],
	['Catering and private events', 'catering fit signal'],
	['Restaurant event work', 'restaurant fit signal'],
	['Meal prep and dated production', 'meal-prep fit signal'],
	['Menus that keep changing', 'changing-menu fit signal'],
	['Fit also means knowing where it stops.', 'limits section'],
	['who-its-for-work-fit', 'emitted direction contract'],
	['href="/who-its-for"', 'shared navigation destination'],
	['aria-current="page"', 'active navigation state']
]) requireText(text, label);

const pathSteps = (html.match(/class="path-index"/g) ?? []).length;
if (pathSteps !== 4) failures.push(`expected 4 connected work steps, received ${pathSteps}`);

const limitsStart = html.indexOf('class="limits-ticket"');
const limitsEnd = html.indexOf('</div>', limitsStart);
const limitsMarkup = html.slice(limitsStart, limitsEnd);
const limitCount = (limitsMarkup.match(/<li(?:\s|>)/g) ?? []).length;
if (limitCount !== 3) failures.push(`expected 3 product limits, received ${limitCount}`);

if (/wrong shape|misfit|not for restaurant/i.test(html)) {
	failures.push('restaurant ownership is still framed as a product misfit');
}

if (failures.length > 0) {
	console.error(`Who-it-is-for page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Who-it-is-for page contract passed: work-based fit, two-service ticket, four-step plan, three limits, and active navigation.');
