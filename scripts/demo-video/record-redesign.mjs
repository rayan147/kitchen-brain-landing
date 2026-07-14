// Records the redesigned Kitchen Brain walkthrough (~50s, calm pace).
// Flow: login → Rodriguez order shopping → prep → pack → recipes food cost.
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:5199';
const OUT = '/tmp/claude-1000/-home-rayan147-kitchen-brain/cc4d86d5-ccfd-4404-8245-dd19e1d7d6dc/scratchpad/video2';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});
const ctx = await browser.newContext({
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 2,
	recordVideo: { dir: OUT, size: { width: 1280, height: 800 } }
});
const page = await ctx.newPage();

// Prime every route once so dev-compile stutter never reaches the take.
const authCtx = await browser.newContext();
const prime = await authCtx.newPage();
await prime.goto(BASE + '/login', { waitUntil: 'networkidle' });
await prime.waitForTimeout(800);
await prime.locator('#email').fill('demo@costcook.io');
await prime.locator('#password').fill('walkin-fridge-2026');
await prime.getByRole('button').first().click();
await prime.waitForURL(BASE + '/', { timeout: 20000 });
for (const p of ['/orders', '/orders/1', '/orders/1/prep', '/orders/1/pack', '/recipes', '/recipes/1'])
	await prime.goto(BASE + p, { waitUntil: 'networkidle' });
await authCtx.close();

// --- Take ---
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await pause(1200);
await page.locator('#email').pressSequentially('demo@costcook.io', { delay: 34 });
await page.locator('#password').pressSequentially('walkin-fridge-2026', { delay: 26 });
await pause(500);
await page.getByRole('button').first().click();
await page.waitForURL(BASE + '/', { timeout: 20000 });
await page.waitForLoadState('networkidle');
await pause(1500);

// Orders → Rodriguez
await page.goto(BASE + '/orders', { waitUntil: 'networkidle' });
await pause(1800);
await page.locator('a', { hasText: 'Rodriguez' }).first().click();
await page.waitForLoadState('networkidle');

// Shopping list
await pause(2600);
await page.mouse.wheel(0, 480);
await pause(1900);
await page.mouse.wheel(0, 520);
await pause(2200);

// Prep
await page.locator('nav[aria-label="Order views"] a', { hasText: 'Prep' }).click();
await page.waitForLoadState('networkidle');
await pause(2600);
await page.mouse.wheel(0, 520);
await pause(1900);
await page.mouse.wheel(0, 560);
await pause(2000);

// Pack
await page.locator('nav[aria-label="Order views"] a', { hasText: 'Pack' }).click();
await page.waitForLoadState('networkidle');
await pause(2800);

// Food cost: recipes list (over-target badge), then the skewers recipe
await page.goto(BASE + '/recipes', { waitUntil: 'networkidle' });
await pause(2400);
const skewers = page.locator('a', { hasText: 'Skewers' }).first();
await skewers.click();
await page.waitForLoadState('networkidle');
await pause(1800);
// scroll to Pricing & food cost
await page.locator('#pricing-heading').scrollIntoViewIfNeeded();
await pause(2800);

await ctx.close();
const video = await page.video().path();
console.log('VIDEO:', video);
await browser.close();
