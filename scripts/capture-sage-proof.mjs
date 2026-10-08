// Captures the /features/sage stills from LOCAL DEVELOP, kitchen-brain
// 7a7e407d9 (owner, 2026-10-07: "local develop latest"), in the sample
// kitchen that carries the Nair & Castellano wedding. Story:
// docs/stories/sage-feature.story.md
//
//   APP=http://localhost:4193 node scripts/capture-sage-proof.mjs
//   node scripts/sage-video/assemble.mjs      # rebuilds the walkthrough
//
// Sage answers need SAGE_ENABLED and a provider key, so this runs against the
// keyed world (the owner starts it; this script never sees a key). Sage words
// its answers fresh each time: the script prints every answer, and an answer
// is only used after it has been read against the records (the homepage's
// first wedding answer called a draft confirmed; it was not used).
//
//   sage-setup-workspace.png  a new conversation: "Ask your first question"
//                             and the starting questions the records suggest
//   sage-answer.png           the wedding's short rib, line by line, desktop
//   sage-answer-mobile.png    the same answer on a phone
// sage-onboarding.png (the setup screen) is not re-shot: onboarding stays as
// it is (owner, 2026-10-07).
//
// Considered Template Method (one ask-and-crop skeleton per viewport); not
// used because there are two viewports and one question. Plain code.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4193';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
const OWNER = 'marisol@example.com';
const QUESTION = process.env.QUESTION ?? 'Why does the Braised Short Rib cost what it costs?';
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const OUT = resolve(import.meta.dirname, '../public/proof');
const FORBIDDEN = [/Kitchen Brain/i, /Maple & Main/, /\bE2E\b/, /fixture/i, /localhost/i];

async function signIn(page) {
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
}

async function settle(page) {
	await page.mouse.move(0, 0).catch(() => {});
	await page.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster], [data-ui-role="toast"], .toast')) t.remove();
		return document.fonts.ready;
	});
	await page.waitForTimeout(600);
}

async function shoot(page, name, clip) {
	await settle(page);
	const text = await page.evaluate(() => document.querySelector('main')?.innerText ?? '');
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden ${bad}`);
	await page.screenshot({ path: resolve(OUT, `${name}.png`), clip, animations: 'disabled', caret: 'hide' });
	console.log(`captured ${name}.png  css ${Math.round(clip.width)} x ${Math.round(clip.height)}`);
}

/** A fresh conversation on /sage. */
async function newConversation(page) {
	await page.goto(`${APP}/sage`);
	await page.waitForTimeout(2500);
	await page.getByText('New conversation', { exact: true }).first().click();
	await page.getByText('Ask your first question', { exact: true }).waitFor();
	await page.waitForTimeout(1000);
}

async function ask(page) {
	await page.getByRole('textbox').last().fill(QUESTION);
	await page.keyboard.press('Enter');
	// Every finished answer ends on "Based on N record(s)"; a suggested next
	// step ("You review it first.") only comes with some.
	await page.getByText(/^Based on \d+ records?$/).last().waitFor({ timeout: 120000 });
	await page.waitForTimeout(2500);
	const main = await page.locator('main').innerText();
	const answer = main.slice(main.lastIndexOf(QUESTION));
	console.log(`  answer:\n${answer}\n`);
	return answer;
}

/** Viewport box from "You asked" down to above the suggested-next-step card. */
async function answerClip(page, width) {
	const asked = page.getByText('You asked', { exact: true }).last();
	await asked.scrollIntoViewIfNeeded();
	await page.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if ((cs.position === 'fixed' || cs.position === 'sticky') && !e.closest('main')) e.style.visibility = 'hidden'; } });
	const top = await asked.boundingBox();
	const stepLabel = page.getByText(/suggested next step/i).last();
	const end = (await stepLabel.count()) ? (await stepLabel.boundingBox()).y - 22 : (await page.getByText(/^Based on \d+ records?$/).last().boundingBox()).y - 12;
	const col = await asked.evaluate((el) => { let n = el; while (n.parentElement && n.getBoundingClientRect().width < 300) n = n.parentElement; const r = n.getBoundingClientRect(); return { x: r.left, w: r.width }; });
	return width ? { x: 0, y: top.y - 16, width, height: end - top.y + 16 } : { x: col.x - 16, y: top.y - 16, width: col.w + 32, height: end - top.y + 16 };
}

const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
try {
	const ctx = await browser.newContext({ viewport: { width: 1280, height: 744 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
	const page = await ctx.newPage();
	await signIn(page);

	// 1. A new conversation and its starting questions (the video's 0:05).
	if (!process.env.SKIP_WORKSPACE) {
		await newConversation(page);
		await shoot(page, 'sage-setup-workspace', { x: 0, y: 0, width: 1280, height: 744 });
	}

	// 2. The answer, desktop at 2x.
	const desk = await browser.newContext({ viewport: { width: 1280, height: 1100 }, deviceScaleFactor: 2, reducedMotion: 'reduce', storageState: await ctx.storageState() });
	const dp = await desk.newPage();
	await newConversation(dp);
	await ask(dp);
	await shoot(dp, 'sage-answer', await answerClip(dp));
	const url = dp.url();

	// 3. The same thread on a phone (no second ask: one answer, two layouts).
	const phone = await browser.newContext({ viewport: { width: 390, height: 1400 }, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: true, hasTouch: true, storageState: await ctx.storageState() });
	const pp = await phone.newPage();
	await pp.goto(url);
	await pp.getByText(/^Based on \d+ records?$/).last().waitFor({ timeout: 60000 });
	await pp.waitForTimeout(1500);
	await shoot(pp, 'sage-answer-mobile', await answerClip(pp, 390));
} finally {
	await browser.close();
}
