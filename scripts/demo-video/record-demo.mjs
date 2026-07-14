// Records a walkthrough of the real CostCook app (dev server on :5199)
// as WebM video. Storyboard: login → recipe w/ live plate cost → create a
// 200-guest order → shopping list → prep → pack.
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:5199';
const OUT = '/tmp/claude-1000/-home-rayan147-kitchen-brain/cc4d86d5-ccfd-4404-8245-dd19e1d7d6dc/scratchpad/video';
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const ctx = await browser.newContext({
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 2,
	recordVideo: { dir: OUT, size: { width: 1280, height: 800 } }
});
const page = await ctx.newPage();

// Prime routes once so dev-server compiles don't stutter the recording take.
for (const p of ['/login', '/']) await page.goto(BASE + p, { waitUntil: 'networkidle' });

// --- Take starts here ---
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await pause(900);
await page.locator('#email').pressSequentially('demo@costcook.demo', { delay: 28 });
await page.locator('#password').pressSequentially('demo-passw0rd!', { delay: 28 });
await pause(400);
await page.getByRole('button').first().click();
await page.waitForURL(BASE + '/', { timeout: 15000 });
await page.waitForLoadState('networkidle');
await pause(1600);

// Recipe with live plate cost + food cost %
await page.goto(BASE + '/recipes/2', { waitUntil: 'networkidle' });
await pause(1800);
await page.mouse.wheel(0, 500);
await pause(1400);
await page.mouse.wheel(0, 700);
await pause(2000);
await page.mouse.wheel(0, -1200);
await pause(800);

// Create the order, on camera
await page.goto(BASE + '/orders/new', { waitUntil: 'networkidle' });
await pause(1200);
await page.locator('#guestCount').click();
await page.locator('#guestCount').pressSequentially('200', { delay: 120 });
await pause(400);
await page.locator('#name').pressSequentially('Alvarez wedding', { delay: 32 });
await page.locator('#eventDate').fill('2026-07-18');
await pause(700);
await page.getByRole('button', { name: /create order/i }).click();
await page.waitForURL(/\/orders\/\d+/, { timeout: 15000 });
await page.waitForLoadState('networkidle');

// Shopping list
await pause(2200);
await page.mouse.wheel(0, 550);
await pause(1600);
await page.mouse.wheel(0, 550);
await pause(1800);
await page.mouse.wheel(0, -1200);
await pause(700);

// Prep list
const orderUrl = page.url().replace(/[#?].*$/, '');
await page.goto(orderUrl + '/prep', { waitUntil: 'networkidle' });
await pause(2200);
await page.mouse.wheel(0, 600);
await pause(1700);
await page.mouse.wheel(0, 600);
await pause(1700);

// Pack list
await page.goto(orderUrl + '/pack', { waitUntil: 'networkidle' });
await pause(2400);
await page.mouse.wheel(0, 500);
await pause(1800);

await ctx.close(); // flushes the video
const video = await page.video().path();
console.log('VIDEO:', video);
await browser.close();
