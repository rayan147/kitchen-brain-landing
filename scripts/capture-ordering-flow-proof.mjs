// Captures what a client sees when ordering through the website widget, and
// what lands in the caterer's Orders, for "What your client sees" on
// /features/online-ordering and the homepage ordering card.
// Story: docs/stories/online-ordering.story.md
//
//   APP=http://localhost:4193 HOST=http://127.0.0.1:4370/ \
//     KB_DIR=<kitchen-brain checkout with node_modules> \
//     node scripts/capture-ordering-flow-proof.mjs
//
// SOURCE (2026-10-15): kitchen-brain develop 5e01c9fc7 with the embed ready fix
// 61740a018, sample kitchen Harbor & Hearth Catering, ordering site live with
// Coastal Dinner ($93), Wedding Plated Dinner ($95) and Cocktail Reception ($44),
// delivery $25.00, 20 guest minimum, 72 hours notice, You collect it. The
// package photos are CC0 stand-ins from Wikimedia Commons (manifest), uploaded
// through the package editor. HOST is a plain sample page with the snippet
// pasted verbatim. The widget is the app's; the page around it is sample.
//
// WRITES: one real order is sent through the widget (Dana Okafor, 50 guests,
// delivered, Thu Nov 5) and lands in Orders approved automatically, as the
// kitchen's booking rules decide. The quote form is filled but never sent.
// REFERENCE=<order number> skips the walk and re-shoots only the caterer's
// frame for an order already sent.
//
// Frames, all 2x:
//   home/ordering-site       the sample site's menu, with the package photos (600)
//   home/ordering-site-phone the same at 390
//   ordering-flow/package    Coastal Dinner opened, 50 guests, its dishes (390)
//   ordering-flow/cart       the cart sheet with the estimate (390)
//   ordering-flow/received   the client's confirmation (390)
//   ordering-flow/quote      Ask for a quote, the event filled in (390)
//   ordering-flow/arrived    the same order in the caterer's Orders (1100)
//
// Considered Template Method (a step skeleton per frame); not used because the
// frames are one straight walk through one order, sharing only the clip helper.
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4193';
const HOST = process.env.HOST ?? 'http://127.0.0.1:4370/';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
const REFERENCE = process.env.REFERENCE ?? null;
const OWNER = 'marisol@example.com';
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const OUT = resolve(import.meta.dirname, '../public/proof');
const FORBIDDEN = [/Kitchen Brain/i, /Maple & Main/, /\bE2E\b/, /fixture/i, /localhost/i, /127\.0\.0\.1/, /site_[A-Za-z0-9]/, /Test (environment|site|mode)/i];
const DISHES = ['Cedar Salmon Fillet', 'Seared Scallops, Corn', 'Lemon Orzo Pilaf', 'Charred Green Beans', 'Arugula and Pear Salad', 'Lemon Posset'];

await mkdir(`${OUT}/ordering-flow`, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });

/** A viewport clip: a fullPage shot drew the cross-origin frame soft at 2x. */
async function shoot(page, name, box, textSource) {
	const clip = { x: Math.max(0, Math.round(box.x)), y: Math.max(0, Math.round(box.y)), width: Math.round(box.width), height: Math.round(box.height) };
	const text = textSource ? (await textSource.innerText()).replace(/\s+/g, ' ') : '';
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden text ${bad}: ${text.slice(0, 300)}`);
	await page.mouse.move(0, 0);
	await page.screenshot({ path: `${OUT}/${name}.png`, clip, animations: 'disabled', caret: 'hide' });
	console.log(`captured ${name}  px [${clip.width * 2}, ${clip.height * 2}]`);
	console.log(`  text: ${text.slice(0, 400)}`);
}

async function openSite(width) {
	const ctx = await browser.newContext({ viewport: { width, height: 2600 }, deviceScaleFactor: 2, reducedMotion: 'reduce', ...(width < 500 ? { isMobile: true, hasTouch: true } : {}) });
	const page = await ctx.newPage();
	await page.goto(HOST);
	const frame = page.frameLocator('#order-here iframe');
	await frame.getByRole('heading', { name: 'Catering menu' }).waitFor({ timeout: 30000 });
	await page.locator('#order-here iframe').waitFor({ state: 'visible' });
	await page.waitForTimeout(2000);
	return { ctx, page, frame };
}

async function openPackage(frame, page) {
	await frame.getByRole('button', { name: 'Configure Coastal Dinner' }).click();
	const dialog = frame.getByRole('dialog').filter({ hasText: 'Guests for this package' });
	await dialog.getByLabel('Guests for this package').fill('50');
	for (const dish of DISHES) await dialog.getByLabel(dish).check();
	await page.waitForTimeout(1500);
	return dialog;
}

async function signIn(ctx) {
	const page = await ctx.newPage();
	await page.goto(`${APP}/login`);
	await page.waitForTimeout(2000);
	await page.getByLabel('Email').fill(OWNER);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor({ timeout: 120000 });
	let link = null;
	for (let i = 0; i < 40 && !link; i += 1) {
		const r = await page.request.get(`${APP}/api/test/magic-link?email=${encodeURIComponent(OWNER)}`);
		if (r.ok()) link = (await r.json()).url;
		if (!link) await page.waitForTimeout(250);
	}
	if (!link) throw new Error('no magic link captured; start the app with MAGIC_LINK_TEST_CAPTURE=1');
	const u = new URL(link);
	await page.goto(`${APP}${u.pathname}${u.search}`);
	await page.waitForLoadState('load');
	return page;
}

try {
	let reference = REFERENCE;
	if (!reference) {
		// Homepage: the sample site's menu with the package photos, from the
		// site's header to the end of the Coastal Dinner card.
		for (const [name, width] of [['home/ordering-site', 600], ['home/ordering-site-phone', 390]]) {
			const { ctx, page, frame } = await openSite(width);
			const card = frame.getByText('$93.00 / guest', { exact: true }).first().locator('xpath=ancestor::*[.//*[normalize-space()="Coastal Dinner"]][1]');
			const box = await card.boundingBox();
			await shoot(page, name, { x: 0, y: 0, width, height: box.y + box.height + 20 }, frame.locator('main'));
			await ctx.close();
		}

		// The walk at phone width: package, cart, then one real order to its receipt.
		const { ctx, page, frame } = await openSite(390);
		const dialog = await openPackage(frame, page);
		await shoot(page, 'ordering-flow/package', await dialog.boundingBox(), dialog);
		await dialog.getByRole('button', { name: 'Add to cart' }).click();
		await page.waitForTimeout(1200);
		await frame.getByRole('button', { name: /View cart/ }).click();
		await page.waitForTimeout(1500);
		const cart = frame.getByRole('dialog').filter({ hasText: 'Estimated total' });
		await shoot(page, 'ordering-flow/cart', await cart.boundingBox(), cart);

		await cart.getByRole('button', { name: 'Continue' }).click();
		await page.waitForTimeout(1500);
		await frame.getByLabel('Event name').fill('Company anniversary dinner');
		await frame.getByRole('radio', { name: 'Delivery' }).check();
		await frame.getByLabel('Street address').fill('40 Fore Street');
		await frame.getByLabel('City').fill('Portland');
		await frame.getByLabel('State').fill('ME');
		await frame.getByLabel('ZIP code').fill('04101');
		await frame.getByLabel('Event date').fill('2026-11-05');
		await frame.getByLabel('Requested delivery time').fill('18:00');
		await frame.getByRole('button', { name: 'Continue' }).click();
		await page.waitForTimeout(1500);
		await frame.getByLabel('Your name').fill('Dana Okafor');
		await frame.getByLabel('Email').fill('dana.okafor@example.com');
		await frame.getByLabel('Phone').fill('(207) 555-0142');
		await frame.getByLabel(/Company/).fill('Okafor & Lane Design');
		await frame.getByLabel(/Notes for the kitchen/).fill('Please be set up by 5:30 PM in the main hall.');
		await frame.getByRole('button', { name: 'Continue' }).click();
		await frame.getByRole('heading', { name: 'Review your order' }).waitFor({ timeout: 30000 });
		await frame.getByRole('button', { name: 'Confirm order' }).click();
		const receipt = frame.locator('section, article, div').filter({ has: frame.getByText('Request reference') }).filter({ hasText: 'Total before tax' }).last();
		await receipt.waitFor({ timeout: 30000 });
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(1500);
		await shoot(page, 'ordering-flow/received', await receipt.boundingBox(), receipt);
		reference = (await receipt.innerText()).match(/order_(\d+)/)?.[1];
		await ctx.close();
		if (!reference) throw new Error('received: no order reference on the receipt');

		// Ask for a quote, filled in and never sent.
		const { ctx: qctx, page: qpage, frame: q } = await openSite(390);
		await q.getByRole('button', { name: 'Ask for a quote' }).click();
		await q.getByRole('heading', { name: 'Tell us about the event' }).waitFor();
		await q.getByLabel('What is the event?').fill('Rehearsal dinner, family style');
		await q.getByLabel('Or roughly when').fill('Early June 2027');
		await q.getByLabel('Guests, at least').fill('80');
		await q.getByLabel('Guests, at most').fill('100');
		await q.getByLabel(/Where is it/).fill('A barn venue outside Portland');
		await q.getByLabel('Staff on site').check();
		await q.getByLabel('Rentals').check();
		await q.getByLabel('Vegetarian').check();
		await q.getByLabel('Tree nuts').check();
		await qpage.waitForTimeout(1200);
		const heading = await q.getByRole('heading', { name: 'Tell us about the event' }).boundingBox();
		const lastField = await q.getByLabel('Rentals').boundingBox();
		const frameBox = await qpage.locator('#order-here iframe').boundingBox();
		const top = heading.y - 44;
		await shoot(qpage, 'ordering-flow/quote', { x: frameBox.x, y: top, width: frameBox.width, height: lastField.y + lastField.height + 28 - top }, q.locator('main'));
		await qctx.close();
	}

	// The same order on the caterer's side: the top of the order in Orders, to
	// the payment line. The "Also on" list below it names other orders that day.
	const octx = await browser.newContext({ viewport: { width: 1100, height: 1400 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const opage = await signIn(octx);
	await opage.goto(`${APP}/orders/${reference}`);
	await opage.getByText('Approved automatically').waitFor({ timeout: 30000 });
	await opage.waitForTimeout(2000);
	await opage.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster]')) t.remove();
	});
	const title = await opage.getByRole('heading', { level: 1 }).first().boundingBox();
	const end = await opage.getByText(/You collect it yourself/).first().boundingBox();
	const main = await opage.locator('main').boundingBox();
	const top = title.y - 20;
	await shoot(opage, 'ordering-flow/arrived', { x: main.x + 8, y: top, width: main.width - 16, height: end.y + end.height + 10 - top }, opage.locator('main'));
	await octx.close();
} finally {
	await browser.close();
}
