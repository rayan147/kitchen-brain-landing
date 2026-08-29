import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '/home/rayan147/kitchen-brain/node_modules/playwright/index.mjs';

const appUrl = process.env.COSTCOOK_APP_URL ?? 'http://127.0.0.1:4181';
const recipeId = process.env.COSTCOOK_NUTRITION_RECIPE_ID ?? '122';
const outputRoot = resolve('public/proof');
const cropRoot = resolve(outputRoot, 'nutrition');

// Considered Strategy; not used because this is one fixed, evidence-led capture
// workflow whose only variants are viewport and output path, not swappable behavior.
const captures = [
	{ name: 'desktop', width: 1440, height: 1800 },
	{ name: 'mobile', width: 390, height: 1500 }
];

async function signIn(page) {
	await page.goto(`${appUrl}/demo`, { waitUntil: 'networkidle' });
}

async function captureRecipe(page, viewport) {
	await page.setViewportSize({ width: viewport.width, height: viewport.height });
	await page.goto(`${appUrl}/catalog/recipes/${recipeId}#nutrition`, { waitUntil: 'networkidle' });
	const nutrition = page.locator('#nutrition');
	await nutrition.waitFor({ state: 'visible' });
	await nutrition.scrollIntoViewIfNeeded();

	const summary = nutrition.locator(':scope > div').nth(0);
	const macros = nutrition.locator(':scope > div').nth(1);
	const sidePanel = nutrition.locator(':scope > div').nth(2).locator(':scope > div').nth(1);
	const facts = nutrition.locator('.nutrition-label');

	const summaryBox = await summary.boundingBox();
	const macrosBox = await macros.boundingBox();
	if (!summaryBox || !macrosBox) throw new Error('Nutrition summary was not measurable.');

	await page.screenshot({
		path: resolve(cropRoot, `nutrition-summary-${viewport.name === 'desktop' ? 'wide' : 'mobile'}.png`),
		clip: {
			x: Math.min(summaryBox.x, macrosBox.x),
			y: summaryBox.y,
			width: Math.max(summaryBox.x + summaryBox.width, macrosBox.x + macrosBox.width) - Math.min(summaryBox.x, macrosBox.x),
			height: macrosBox.y + macrosBox.height - summaryBox.y
		}
	});

	await sidePanel.screenshot({
		path: resolve(cropRoot, `allergen-review-${viewport.name === 'desktop' ? 'wide' : 'mobile'}.png`)
	});

	if (viewport.name === 'desktop') {
		await nutrition.screenshot({ path: resolve(outputRoot, 'nutrition-panel.png') });
		await facts.screenshot({ path: resolve(cropRoot, 'nutrition-facts-panel.png') });
	}
}

async function capturePrintSheet(page) {
	await page.setViewportSize({ width: 1440, height: 1800 });
	await page.goto(`${appUrl}/catalog/recipes/${recipeId}/nutrition-label`, { waitUntil: 'networkidle' });
	const sheet = page.locator('.label-sheet');
	const facts = sheet.locator('.nutrition-label');
	await sheet.waitFor({ state: 'visible' });
	await sheet.screenshot({ path: resolve(outputRoot, 'nutrition-label.png') });
	await facts.screenshot({ path: resolve(cropRoot, 'label-panel.png') });
}

await mkdir(cropRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
	const page = await browser.newPage({ deviceScaleFactor: 2 });
	await signIn(page);
	for (const viewport of captures) await captureRecipe(page, viewport);
	await capturePrintSheet(page);
} finally {
	await browser.close();
}
