// Captures the Sage film's frames (video/src/film-sage.ts) into
// public/proof/film-sage with a manifest of what the app printed. Story:
// docs/stories/sage-feature.story.md
//
//   APP=http://localhost:4196 KB_DIR=<app checkout> node scripts/capture-sage-film.mjs
//
// The panel and billing frames come from a local demo world of kitchen-brain
// develop (owner, 2026-10-11: the site follows develop for Sage's allowance),
// seeded as a paid kitchen with 1,640 credits used this period, so the panel
// shows its once-a-period note. Sage's answer needs a provider key, so the
// answer frames are the stills the keyed world printed on 2026-10-07
// (scripts/capture-sage-proof.mjs) and are copied, not re-shot; the manifest
// names each frame's source either way.
//
//   panel-ask-desktop.png    Today with the Sage panel open, note hidden
//   panel-note-desktop.png   the same panel with the allowance note
//   billing-usage-desktop.png  Settings > Billing, the usage card's Sage line
//
// Considered Template Method (one sign-in-and-shoot skeleton per frame); not
// used because there are three frames on two pages. Plain code.
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4196';
const KB_DIR = process.env.KB_DIR;
if (!KB_DIR) throw new Error('KB_DIR must point at the app checkout the world runs from');
const APP_SHA = process.env.APP_SHA;
if (!APP_SHA) throw new Error('APP_SHA must name the kitchen-brain commit the world was built from');
const KB_REPO = process.env.KB_REPO ?? '/home/rayan147/kitchen-brain';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
const OWNER = 'marisol@example.com';
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const PROOF = resolve(import.meta.dirname, '../public/proof');
const OUT = resolve(PROOF, 'film-sage');
const FORBIDDEN = [/Kitchen Brain/i, /Maple & Main/, /\bE2E\b/, /fixture/i, /localhost/i];

// The allowance sizes, read from the commit the world was built from, so the
// film's "2,000" and "300" are the app's numbers, not typed ones.
const config = execFileSync('git', ['-C', KB_REPO, 'show', `${APP_SHA}:src/lib/server/sage/config.ts`], { encoding: 'utf8' });
// The share at which the panel's note appears, from allowance.ts at the same commit.
const allowanceSource = execFileSync('git', ['-C', KB_REPO, 'show', `${APP_SHA}:src/lib/server/sage/allowance.ts`], { encoding: 'utf8' });
const noticeShare = Number(allowanceSource.match(/const NOTICE_SHARE = ([\d.]+);/)?.[1]);
if (!noticeShare) throw new Error(`NOTICE_SHARE not found in allowance.ts at ${APP_SHA}`);
const constant = (name) => {
	const raw = config.match(new RegExp(`export const ${name} = ([\\d_]+);`))?.[1];
	if (!raw) throw new Error(`${name} not found in config.ts at ${APP_SHA}`);
	return Number(raw.replaceAll('_', '')).toLocaleString('en-US');
};

async function signIn(page) {
	await page.goto(`${APP}/login`);
	await page.waitForTimeout(1500);
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

async function shoot(page, name) {
	await page.mouse.move(0, 0).catch(() => {});
	await page.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster], [data-ui-role="toast"], .toast')) t.remove();
		return document.fonts.ready;
	});
	await page.waitForTimeout(600);
	const text = await page.evaluate(() => document.body.innerText);
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden ${bad}`);
	await page.screenshot({ path: resolve(OUT, name), animations: 'disabled', caret: 'hide' });
	console.log(`captured ${name}`);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
const printed = {};
try {
	const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const page = await ctx.newPage();
	await signIn(page);

	await page.goto(`${APP}/today`);
	await page.waitForTimeout(2500);
	await page.getByRole('button', { name: /^Sage/ }).first().click();
	const note = page.getByText(/^Sage has used [\d,]+ of [\d,]+ credits\./);
	await note.waitFor({ timeout: 20000 });
	printed.allowanceNote = (await note.innerText()).replace(/\s+/g, ' ').trim();
	await shoot(page, 'panel-note-desktop.png');
	await page.getByRole('button', { name: 'Hide this note' }).click();
	await note.waitFor({ state: 'detached' });
	await shoot(page, 'panel-ask-desktop.png');
	// Close the panel so the billing page has its own width.
	await page.getByRole('button', { name: 'Close Sage' }).click();
	await page.getByRole('button', { name: 'Close Sage' }).waitFor({ state: 'hidden' });

	await page.goto(`${APP}/settings/billing`);
	const line = page.getByText(/^Sage: [\d,]+ of [\d,]+ credits used\./);
	await line.waitFor({ timeout: 20000 });
	printed.billingLine = (await line.innerText()).replace(/\s+/g, ' ').trim();
	await shoot(page, 'billing-usage-desktop.png');
} finally {
	await browser.close();
}

const host = 'local demo world';
const live = { host, app: APP_SHA.slice(0, 9), via: 'capture-sage-film.mjs' };
// The 2026-10-07 answer stills, as the keyed world printed them.
const answer = { host: 'local keyed world', app: '7a7e407d9', via: 'capture-sage-proof.mjs', note: 'copied from public/proof, shot 2026-10-07' };
for (const [from, to] of [['sage-answer.png', 'answer-desktop.png'], ['sage-answer-mobile.png', 'answer-mobile.png']])
	await copyFile(resolve(PROOF, from), resolve(OUT, to));

const [, used, credits, resetsOn] = printed.allowanceNote.match(/used ([\d,]+) of ([\d,]+) credits\. They reset on (.+)\.$/) ?? [];
if (!used) throw new Error(`allowance note did not parse: ${printed.allowanceNote}`);
if (credits !== constant('SAGE_PERIOD_CREDITS')) throw new Error(`note says ${credits}, config says ${constant('SAGE_PERIOD_CREDITS')}`);

const manifest = {
	...printed,
	used,
	periodCredits: credits,
	trialCredits: constant('SAGE_TRIAL_CREDITS'),
	noticeAt: `${Math.round(noticeShare * 100)}%`,
	resetsOn,
	// What the 2026-10-07 answer printed (docs/stories/sage-feature.story.md).
	answerCost: '$7.28',
	appSha: APP_SHA.slice(0, 9),
	capturedOn: new Date().toISOString().slice(0, 10),
	frames: ['panel-ask-desktop.png', 'answer-desktop.png', 'answer-mobile.png', 'panel-note-desktop.png', 'billing-usage-desktop.png'],
	frameSources: {
		'panel-ask-desktop.png': live,
		'panel-note-desktop.png': live,
		'billing-usage-desktop.png': live,
		'answer-desktop.png': answer,
		'answer-mobile.png': answer
	}
};
await writeFile(resolve(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ ...manifest, frames: undefined, frameSources: undefined }, null, 2));
