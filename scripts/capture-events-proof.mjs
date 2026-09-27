// Captures the event workflow, inquiry to closeout, from the running app: one
// wedding carried through every frame. Notes: docs/landing-capture/events-captures.md
//
//   APP=http://localhost:4188 DB=/abs/path/to/app/e2e/.scratch/demo.db \
//     node scripts/capture-events-proof.mjs
//
// ENVIRONMENT (defaults are the values the 2026-09-27 captures used)
//   APP          the running app                      http://localhost:4188
//   DB           the app's scratch SQLite file        required; must sit under
//                                                     an e2e/.scratch/ directory
//   KB_DIR       a kitchen-brain checkout whose       /home/rayan147/kitchen-brain-develop-demo
//                node_modules provide playwright and
//                @libsql/client (the primary ~/kitchen-brain
//                checkout's dependencies did not load on
//                2026-09-27; develop-demo's did)
//   CHROME_PATH  the browser binary                   /usr/bin/google-chrome
//
// THE DATE IS FIXED, AND EVERY RE-SHOOT MUST UPDATE IT. EVENT.date below is
// October 10, 2026, and the page copy and the alt text in src/lib/proof.ts
// name that date ("October 10, about 150, a wedding"), so it is not computed:
// a moving date would make every new capture disagree with the words beside
// it. Before a re-shoot, pick a Saturday about two weeks out, set EVENT.date,
// and change the copy and alts with it. The script refuses a date that is not
// in the future, because the calendar frame needs the event still ahead.
//
// STANDING THE APP UP (the script drives it, it does not build it)
//
// The app is kitchen-brain PRODUCTION, origin/main, exported clean so nothing
// unshipped reaches a marketing frame (git archive reads the commit and
// touches no worktree). Use a NEW scratch folder each time: an older export
// left in place mixes files and fails to build. First shot against develop
// c88f2eed2; re-shot and confirmed against origin/main ed6ff5f01 on
// 2026-09-27, seven frames byte-identical and the offer frame differing only
// in its respond-by clock time.
//
//   git -C ~/kitchen-brain fetch -q
//   APPDIR=<new scratch dir>; mkdir -p $APPDIR
//   git -C ~/kitchen-brain archive origin/main | tar -x -C $APPDIR
//   ln -s ~/kitchen-brain-develop-demo/node_modules $APPDIR/node_modules
//   cd $APPDIR
//   TURSO_DATABASE_URL= RESTAURANT_TIME_ZONE=America/New_York npm run demo:seed
//   #   the demo world: ~100 ingredients, 75 costed recipes, 15 menus, 3 years
//   #   of orders and purchases, owner marisol@example.com
//   DATABASE_URL=file:e2e/.scratch/demo.db TURSO_DATABASE_URL= npm run db:backfill:revisions
//   #   production runs this backfill on every boot (scripts/backfill-recipe-
//   #   revisions.ts); the demo seed does not, and without it every dish is
//   #   unpublished and "Use menu" refuses ("Publish every dish in that menu").
//   #   Then rename the kitchen with any SQLite client (sqlite3 may be missing;
//   #   a few lines of @libsql/client from KB_DIR work): organization.name and
//   #   settings.business_name = Harbor & Hearth Catering, reply_to_email =
//   #   kitchen@harborhearth.example.com, phone = (207) 555-0142,
//   #   delivery_address = 12 Commercial Street, Portland, ME 04101 (sample
//   #   values, never a real business). The run refuses to start if not renamed.
//   TURSO_DATABASE_URL= npm run build
//   # serve with demo/serve.sh's env, on 4188, without its rebuild:
//   DATABASE_URL=file:e2e/.scratch/demo.db RESTAURANT_TIME_ZONE=America/New_York \
//   TURSO_DATABASE_URL= TURSO_AUTH_TOKEN= IMPORT_AI_PROVIDER=stub \
//   BETTER_AUTH_SECRET=demo-only-secret-never-production-0123456789abcdef \
//   BETTER_AUTH_URL=http://localhost:4188 AUTH_RATE_LIMIT_DISABLED=1 MAGIC_LINK_TEST_CAPTURE=1 \
//   SEED_DEMO_EMAIL=marisol@example.com EMAIL_TRANSPORT=smtp SMTP_URL=smtp://localhost:1025 \
//   RESEND_API_KEY= EMAIL_FROM= SAGE_ENABLED= GOOGLE_GENERATIVE_AI_API_KEY= ANTHROPIC_API_KEY= \
//   npm run preview -- --port 4188 --strictPort
//
// The walk is not idempotent: acceptance, confirmation and the date move cannot
// be undone. A second run against the same database refuses; re-seed first.
//
// WHAT IS NOT DONE THROUGH THE UI, AND WHY (both written into the notes file)
//   - the event date is moved to yesterday with SQL just before the closeout
//     frame, because closeout opens the day after the event and the calendar
//     frame needs the same event in the future. orders.event_date and
//     events.service_date move together; nothing else is written.
//   - nothing else. Capacity (vans, orders a day) is set on Settings > Booking.
//
// Rules kept from capture-proof.mjs / capture-setup-proof.mjs: deviceScaleFactor
// 2, desktop 1440 and phone 390 CSS px, element-bounded clips, mouse parked,
// focus blurred, animations off, caret hidden, fonts loaded, toasts removed.
// Every clip is also checked for text that must never ship (see FORBIDDEN).
//
// Pattern: none. Considered Template Method (one walk, per-frame hooks); not
// used because the walk is linear, runs once, and each frame's precondition is
// the previous frame's irreversible action, so there is no seam to vary. Plain
// sequential code with one clip helper and one text guard.
import { mkdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4188';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
if (!process.env.DB) throw new Error('DB=<absolute path to the app scratch demo.db> is required (the date move writes it).');
const DB = resolve(process.env.DB);
// The walk writes this database twice with raw SQL (see header). Only ever a
// scratch copy: refuse anything outside an e2e/.scratch/ directory.
if (!DB.includes(`${sep}e2e${sep}.scratch${sep}`)) {
	throw new Error(`DB is ${DB}; this script writes it with raw SQL and only runs against a file under e2e/.scratch/`);
}
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const { createClient } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/@libsql/client/lib-esm/node.js')).href);
const OUT = resolve(import.meta.dirname, '../public/proof');
const OWNER = 'marisol@example.com';
const KITCHEN = 'Harbor & Hearth Catering';

// The one event every frame shows. Menu and price are the demo world's own
// "Wedding Plated Dinner" (six costed dishes, $95.00 a guest).
const EVENT = {
	client: 'Priya Nair',
	phone: '(207) 555-0187',
	email: 'priya.nair@example.com',
	name: 'Nair & Castellano wedding',
	guests: '150',
	menu: 'Wedding Plated Dinner',
	date: '2026-10-10', // a Saturday two weeks out; the week has no other orders. Fixed: see header
	start: '17:00',
	end: '22:00',
	terms: 'Final guest count is due two weeks before the wedding.',
	deposit: '3500'
};

// Text that must never be in a shipped frame (brief: no Load out, no signing
// page, no storefront/Square/QuickBooks, no internal product name, no fixture).
const FORBIDDEN = [/Load out/i, /Kitchen Brain/i, /Test environment/i, /Maple & Main/, /\bE2E\b/, /Square/, /QuickBooks/i, /Probe/];

// The kitchen's own zone: the app reads dates there, and so does this check.
const todayInKitchen = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
if (EVENT.date <= todayInKitchen()) {
	throw new Error(`EVENT.date ${EVENT.date} is not in the future; pick a new Saturday and update the copy and alts with it (see header)`);
}

const db = createClient({ url: `file:${DB}` });
const one = async (sql, args = []) => (await db.execute({ sql, args })).rows[0];

// Preconditions: the renamed kitchen, and no earlier run of this walk.
{
	const org = await one('select name from organization limit 1');
	if (org?.name !== KITCHEN) throw new Error(`the kitchen is "${org?.name}", not "${KITCHEN}"; rename it (see header)`);
	const prior = await one('select count(*) as n from events where description = ?', [EVENT.name]);
	if (Number(prior.n) > 0) throw new Error(`"${EVENT.name}" already exists in ${DB}; re-seed the demo world first (see header)`);
	const unpublished = await one('select count(*) as n from recipes where published_revision_number is null');
	if (Number(unpublished.n) > 0) throw new Error('recipes are unpublished; run npm run db:backfill:revisions (see header)');
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
	executablePath: CHROME_PATH,
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});
const shots = [];

async function settle(page) {
	await page.waitForLoadState('load');
	await page.mouse.move(0, 0);
	await page.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster], [data-ui-role="toast"], .toast')) t.remove();
		return document.fonts.ready;
	});
	await page.waitForTimeout(500);
}

/** Text of every visible leaf-ish element intersecting the clip, for the guard. */
async function textIn(page, clip, fullPage) {
	return page.evaluate(
		({ clip, fullPage }) => {
			const sx = fullPage ? window.scrollX : 0;
			const sy = fullPage ? window.scrollY : 0;
			const parts = [];
			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
			for (let n = walker.nextNode(); n; n = walker.nextNode()) {
				const text = n.textContent.trim();
				if (!text || !n.parentElement) continue;
				const style = getComputedStyle(n.parentElement);
				if (style.visibility === 'hidden' || style.display === 'none') continue;
				const range = document.createRange();
				range.selectNodeContents(n);
				for (const r of range.getClientRects()) {
					const x = r.left + sx;
					const y = r.top + sy;
					if (r.width && x < clip.x + clip.width && x + r.width > clip.x && y < clip.y + clip.height && y + r.height > clip.y) {
						parts.push(text);
						break;
					}
				}
			}
			return parts.join(' | ');
		},
		{ clip, fullPage }
	);
}

/**
 * One clip. `fullPage` true means `clip` is in document coordinates (a tall page
 * captured whole, then cut); false means viewport coordinates (a phone screen
 * with its fixed action bar, which only exists relative to the viewport).
 */
async function shoot(page, name, clip, { fullPage = true } = {}) {
	await settle(page);
	const box = {
		x: Math.max(0, Math.round(clip.x)),
		y: Math.max(0, Math.round(clip.y)),
		width: Math.round(clip.width),
		height: Math.round(clip.height)
	};
	const text = await textIn(page, box, fullPage);
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden text ${bad} in frame: ${text.slice(0, 400)}`);
	await page.screenshot({ path: `${OUT}/${name}.png`, clip: box, fullPage, animations: 'disabled', caret: 'hide' });
	shots.push({ name, px: `${box.width * 2}x${box.height * 2}` });
	console.log(`captured ${name} (${box.width}x${box.height} CSS px, ${box.width * 2}x${box.height * 2} PNG)`);
	return text;
}

/** Document-space box of a locator. */
async function docBox(locator) {
	const b = await locator.evaluate((el) => {
		const r = el.getBoundingClientRect();
		return { x: r.left + window.scrollX, y: r.top + window.scrollY, r: r.right + window.scrollX, b: r.bottom + window.scrollY };
	});
	return b;
}

async function union(locators, pad = 16) {
	let box = null;
	for (const l of locators) {
		const d = await docBox(l.first());
		box = box ? { x: Math.min(box.x, d.x), y: Math.min(box.y, d.y), r: Math.max(box.r, d.r), b: Math.max(box.b, d.b) } : d;
	}
	return { x: box.x - pad, y: box.y - pad, width: box.r - box.x + pad * 2, height: box.b - box.y + pad * 2 };
}

async function hydrate(page) {
	await page.waitForLoadState('load');
	await page.waitForTimeout(2000);
}

async function signIn(page) {
	await page.goto(`${APP}/login`);
	await page.getByLabel('Email').fill(OWNER);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor();
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
}

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP });
const page = await ctx.newPage();

try {
	await signIn(page);

	// ------------------------------------------------ 1. inquiry, phone width
	await page.goto(`${APP}/events/new`);
	await hydrate(page);
	await page.getByRole('combobox', { name: 'Client' }).click();
	await page.getByRole('combobox', { name: 'Find a client' }).fill(EVENT.client);
	await page.getByRole('option', { name: /Add.*as new client/ }).click();
	await page.getByLabel('Phone or email').fill(EVENT.phone);
	await page.getByLabel('Event name', { exact: true }).fill(EVENT.name);
	await page.getByLabel('Date not decided yet').check();
	await page.getByLabel('Guests', { exact: true }).fill(EVENT.guests);
	await page.evaluate(() => window.scrollTo(0, 0));
	// The action bar is fixed to the bottom of the screen. Size the phone
	// screen so the bar sits directly under the end of "The event" card: the
	// whole inquiry, undecided date and all, above the one button that saves it.
	{
		const bar = page.getByRole('button', { name: 'Save and build menu', exact: true });
		const eventCard = page.getByRole('heading', { name: 'The event' }).locator('xpath=ancestor::*[self::section or self::fieldset or self::div][.//button[contains(., "Add time, venue")]][1]');
		const cardBottom = (await docBox(eventCard)).b;
		// The bar's own container spans from above the primary button to the
		// bottom of the viewport; measure it at the current viewport.
		const barTop = await bar.evaluate((el) => {
			let n = el;
			while (n.parentElement && getComputedStyle(n).position !== 'fixed' && getComputedStyle(n).position !== 'sticky') n = n.parentElement;
			return n.getBoundingClientRect().top;
		});
		const barHeight = 844 - barTop;
		await page.setViewportSize({ width: 390, height: Math.round(cardBottom + 12 + barHeight) });
		await page.evaluate(() => window.scrollTo(0, 0));
		const h = page.viewportSize().height;
		await shoot(page, 'events-inquiry-mobile', { x: 0, y: 0, width: 390, height: h }, { fullPage: false });
	}
	await page.getByRole('button', { name: 'Save and build menu', exact: true }).click();
	await page.waitForURL(/\/events\/[0-9a-f-]+\/menu$/);
	const eventUrl = page.url().replace(/\/menu$/, '');
	const eventId = eventUrl.split('/').at(-1);
	console.log('event', eventUrl);

	// ------------------------------------------------ menu and service (not shot)
	await page.setViewportSize({ width: 1440, height: 900 });
	await hydrate(page);
	await page.getByRole('searchbox', { name: 'Search menus or dishes' }).fill(EVENT.menu);
	await page.waitForTimeout(800);
	await page.getByRole('button', { name: 'Use menu' }).first().click();
	await page.getByRole('heading', { name: 'Menu & service' }).waitFor();
	await page.getByText('All changes saved').waitFor();

	// ------------------------------------------------ the date gets decided
	await page.goto(eventUrl);
	await hydrate(page);
	await page.getByRole('button', { name: 'Edit details' }).click();
	const dialog = page.getByRole('dialog', { name: 'Edit event details' });
	await dialog.waitFor();
	await dialog.getByLabel('Date not decided yet').uncheck();
	// The radio's input is visually hidden behind its label, so check() is
	// forced; then assert it took, rather than falling back to a label click
	// that could silently choose nothing.
	const wedding = dialog.getByRole('radio', { name: 'Wedding' });
	await wedding.check({ force: true });
	if (!(await wedding.isChecked())) throw new Error('the Wedding event type did not select');
	await dialog.getByLabel('Service start').fill(EVENT.start);
	await dialog.getByLabel('Service end').fill(EVENT.end);
	// No venue: on c88f2eed2 (and the same code on origin/main ed6ff5f01) a free-text venue makes "Prepare the kitchen draft"
	// refuse with 409 "The venue changed" (tentative-order.ts readEvent does not
	// select captureDetails, so the typed venue reads back as none). See notes.
	await dialog.getByText('Plated', { exact: true }).click();
	await dialog.getByRole('button', { name: 'Save changes' }).click();
	await dialog.waitFor({ state: 'hidden' });
	// The date through the workspace's own form action, the one e2e/event-
	// workspace.spec.ts drives: the picker is a month grid and the action is
	// what it posts.
	{
		const r = await page.request.post(`${eventUrl}?/setDate`, { headers: { origin: APP }, form: { serviceDate: EVENT.date } });
		if (!r.ok()) throw new Error(`setDate refused: ${r.status()}`);
	}

	// ------------------------------------------------ 2. workspace, desktop
	await page.goto(eventUrl);
	await hydrate(page);
	{
		const next = page.locator('.workspace-next');
		await next.waitFor();
		const title = page.getByRole('heading', { level: 1 });
		const steps = page.locator('.workspace-progress');
		const box = await union([title, steps, next], 0);
		// Full content width, from the breadcrumb above the title to the Next
		// step card's bottom edge; the right column's first card ends near it.
		await shoot(page, 'events-workspace-desktop', { x: box.x - 24, y: 0, width: box.width + 48, height: box.y + box.height + 24 });
	}

	// ------------------------------------------------ proposal (editor not shot)
	await page.goto(`${eventUrl}/proposal`);
	await hydrate(page);
	await page.getByLabel('Customer name').fill(EVENT.client);
	await page.getByLabel('Customer email (needed before sending)').fill(EVENT.email);
	await page.getByRole('button', { name: 'Continue to what it includes' }).click();
	await page.getByRole('button', { name: 'Continue to tax and terms' }).click();
	await page.getByLabel('Terms the customer will read').fill(EVENT.terms);
	await page.getByRole('button', { name: 'Save and review offer' }).click();
	await page.waitForURL(/\/proposal\/send\?revision=/);
	await hydrate(page);
	await page.locator('#send-offer-form').getByRole('button', { name: /Send offer to/ }).click();
	await page.waitForURL(/\/decision/);
	await hydrate(page);
	await page.getByRole('button', { name: 'Copy offer link' }).click();
	const offerUrl = await page.evaluate(() => navigator.clipboard.readText());
	if (!/^https?:\/\//.test(offerUrl)) throw new Error(`Copy offer link gave "${offerUrl}"`);
	console.log('offer', new URL(offerUrl).pathname.slice(0, 12) + '…');

	// ------------------------------------------------ 3. the client's offer, phone
	{
		const client = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
		const cp = await client.newPage();
		await cp.goto(offerUrl);
		await hydrate(cp);
		const accept = cp.getByRole('button', { name: 'Accept proposal' }).last();
		await accept.waitFor();
		// A phone screen tall enough that the fixed Accept bar sits under the
		// dish list: the price, the event, the menu and the button, one screen.
		const listBottom = (await docBox(cp.getByRole('heading', { name: /what we.ll serve/i }).locator('xpath=following::ul[1]'))).b;
		const barTop = await accept.evaluate((el) => {
			let n = el;
			while (n.parentElement && !['fixed', 'sticky'].includes(getComputedStyle(n).position)) n = n.parentElement;
			return n.getBoundingClientRect().top;
		});
		const barHeight = 844 - barTop;
		await cp.setViewportSize({ width: 390, height: Math.round(listBottom + 20 + barHeight) });
		await cp.evaluate(() => window.scrollTo(0, 0));
		await shoot(cp, 'events-offer-mobile', { x: 0, y: 0, width: 390, height: cp.viewportSize().height }, { fullPage: false });

		// The client accepts.
		await cp.setViewportSize({ width: 390, height: 844 });
		await accept.click();
		await cp.getByLabel('Your full name').fill(EVENT.client);
		await cp.getByRole('button', { name: /^Accept for / }).click();
		await cp.getByRole('heading', { name: /proposal accepted/ }).waitFor();
		await client.close();
	}

	// ------------------------------------------------ 4. kitchen draft, desktop
	await page.goto(eventUrl);
	await hydrate(page);
	const draft = page.getByRole('region', { name: 'Kitchen draft', exact: true });
	await draft.getByRole('button', { name: 'Prepare the kitchen draft', exact: true }).click();
	await draft.getByText('It is tentative', { exact: false }).waitFor();
	await page.reload();
	await hydrate(page);
	{
		const heading = draft.getByRole('heading', { name: 'Kitchen draft', exact: true });
		const open = draft.getByRole('link', { name: 'Open the kitchen draft', exact: true });
		const card = await docBox(draft);
		const top = await docBox(heading);
		const bottom = await docBox(open);
		await shoot(page, 'events-kitchen-draft-desktop', { x: card.x - 16, y: top.y - 24, width: card.r - card.x + 32, height: bottom.b - top.y + 48 });
	}

	// ------------------------------------------------ 5. deposit asked, desktop
	await draft.getByLabel('Deposit amount').fill(EVENT.deposit);
	await draft.getByText('A check, cash or a transfer', { exact: true }).click();
	await draft.getByRole('button', { name: 'Ask for a deposit', exact: true }).click();
	await draft.getByText('Nothing received yet.', { exact: true }).waitFor();
	await page.reload();
	await hydrate(page);
	{
		const heading = draft.getByRole('heading', { name: 'Deposit', exact: true });
		const record = draft.getByRole('link', { name: 'Record the money on the kitchen draft', exact: true });
		const card = await docBox(draft);
		const top = await docBox(heading);
		const bottom = await docBox(record);
		await shoot(page, 'events-deposit-desktop', { x: card.x - 16, y: top.y - 24, width: card.r - card.x + 32, height: bottom.b - top.y + 48 });
	}
	const orderHref = await draft.getByRole('link', { name: 'Open the kitchen draft', exact: true }).getAttribute('href');
	const orderId = Number(orderHref.split('/').at(-1));

	// ------------------------------------------------ capacity, on Settings > Booking
	await page.goto(`${APP}/settings/booking`);
	await hydrate(page);
	await page.getByLabel('Vans', { exact: true }).fill('2');
	await page.getByLabel('Most orders a day', { exact: true }).fill('3');
	await page.getByRole('button', { name: 'Save capacity' }).click();
	await page.waitForTimeout(1500);

	// ------------------------------------------------ 6. confirm dialog, desktop
	await page.goto(`${APP}${orderHref}`);
	await hydrate(page);
	await page.getByRole('button', { name: 'Confirm order' }).first().click();
	const confirm = page.getByRole('alertdialog');
	await confirm.getByText('Confirm this order?').waitFor();
	await page.waitForTimeout(600);
	{
		const b = await confirm.boundingBox();
		// Viewport coordinates: the dialog is fixed over the page.
		await shoot(page, 'events-confirm-desktop', { x: b.x - 24, y: b.y - 24, width: b.width + 48, height: b.height + 48 }, { fullPage: false });
	}
	await confirm.getByRole('button', { name: 'Confirm order' }).click();
	await confirm.waitFor({ state: 'hidden' });
	await page.waitForTimeout(1500);
	{
		const row = await one('select status, event_date from orders where id = ?', [orderId]);
		if (row.status !== 'confirmed' || row.event_date !== EVENT.date) throw new Error(`order ${orderId} is ${row.status} on ${row.event_date}`);
	}

	// ------------------------------------------------ 7. calendar week, desktop
	await page.goto(`${APP}/calendar?date=${EVENT.date}&view=week`);
	await hydrate(page);
	if ((await page.locator('[role="gridcell"]').count()) !== 7) {
		await page.getByRole('radio', { name: 'Week' }).click();
		await page.waitForTimeout(1000);
	}
	{
		const title = page.getByRole('heading', { name: 'Calendar', level: 1 });
		const grid = page.locator('[role="gridcell"]').last();
		const help = page.getByText('Drag a draft from', { exact: false });
		const box = await union([title, grid], 0);
		const helpTop = (await docBox(help)).y;
		await shoot(page, 'events-calendar-desktop', { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: Math.min(helpTop, box.y + box.height + 16) - box.y + 24 });
	}

	// ------------------------------------------------ 8. closeout, desktop
	// Closeout opens the day after the event. Move the event to yesterday (in
	// the app's own zone) in the scratch data: the only write not done through
	// the UI, and recorded in the notes.
	const yesterday = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(Date.now() - 86_400_000));
	// Guard the raw writes: the event and order this walk created through the
	// app must be the rows about to move, in this database.
	{
		const event = await one('select id from events where id = ? and description = ?', [eventId, EVENT.name]);
		if (!event) throw new Error(`event ${eventId} ("${EVENT.name}") is not in ${DB}; refusing the date move`);
		const order = await one('select id from orders where id = ? and event_date = ?', [orderId, EVENT.date]);
		if (!order) throw new Error(`order ${orderId} on ${EVENT.date} is not in ${DB}; refusing the date move`);
	}
	await db.execute({ sql: 'update orders set event_date = ? where id = ?', args: [yesterday, orderId] });
	await db.execute({ sql: 'update events set service_date = ? where id = ?', args: [yesterday, eventId] });
	await page.goto(`${APP}/orders/${orderId}/closeout`);
	await hydrate(page);
	{
		const title = page.getByRole('heading', { name: 'Food-cost closeout', level: 1 });
		const card = page.locator('section[aria-labelledby="closeout-result-heading"]');
		await card.waitFor();
		const box = await union([title, card], 0);
		await shoot(page, 'events-closeout-desktop', { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: box.height + 48 });
	}

	console.log(`\n${shots.length} frames written to public/proof/`);
	for (const s of shots) console.log(`  ${s.name}.png  ${s.px}`);
	console.log(`event ${eventId}, order ${orderId}, closeout date ${yesterday}`);
} finally {
	await browser.close();
	db.close();
}
