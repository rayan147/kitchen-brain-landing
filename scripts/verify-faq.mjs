import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/faq`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-faq-'));
const port = 9344;
const browser = spawn('chromium', [
	'--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
	`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'
], { stdio: 'ignore' });

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
let socket;

try {
	let target;
	for (let attempt = 0; attempt < 50; attempt += 1) {
		try {
			const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
			target = targets.find((entry) => entry.type === 'page');
			if (target) break;
		} catch { /* Chromium is still starting. */ }
		await delay(100);
	}
	if (!target) throw new Error('Chromium DevTools target did not become ready');

	socket = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		socket.addEventListener('open', resolve, { once: true });
		socket.addEventListener('error', reject, { once: true });
	});

	let messageId = 0;
	const pending = new Map();
	const pageErrors = [];
	const failedRequests = [];
	socket.addEventListener('message', (event) => {
		const message = JSON.parse(event.data);
		if (message.id) {
			const request = pending.get(message.id);
			if (!request) return;
			pending.delete(message.id);
			if (message.error) request.reject(new Error(message.error.message));
			else request.resolve(message.result);
			return;
		}
		if (message.method === 'Runtime.exceptionThrown') pageErrors.push(message.params.exceptionDetails.text);
		if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
			failedRequests.push(`${message.params.response.status} ${message.params.response.url}`);
		}
	});

	const send = (method, params = {}) => new Promise((resolve, reject) => {
		messageId += 1;
		pending.set(messageId, { resolve, reject });
		socket.send(JSON.stringify({ id: messageId, method, params }));
	});
	const evaluate = async (expression) => {
		const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
		return result.result.value;
	};
	const viewport = (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
	const navigate = async (url = route) => {
		await send('Page.navigate', { url });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`)) break;
			await delay(100);
		}
		await evaluate(`document.fonts.ready.then(() => {
			const style = document.createElement('style');
			style.textContent = 'astro-dev-toolbar { display: none !important; }';
			document.head.append(style);
			document.querySelector('.decision-ticket')?.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
		})`);
	};
	const capture = async (name) => {
		await evaluate('document.documentElement.scrollTop = 0');
		const metrics = await send('Page.getLayoutMetrics');
		const { width, height } = metrics.cssContentSize;
		const shot = await send('Page.captureScreenshot', {
			format: 'png', fromSurface: true, captureBeyondViewport: true,
			clip: { x: 0, y: 0, width, height, scale: 1 }
		});
		await writeFile(join(reviewDir, `faq-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	await viewport(1440, 900);
	await navigate();
	const desktop = await evaluate(`(() => {
		const scopedActions = [...document.querySelectorAll('.hero-actions a, .decision-ticket a, .question-map a, .chapter-heading > a, .close-actions a')];
		return {
			title: document.querySelector('h1')?.textContent.trim(),
			entryCount: document.querySelectorAll('[data-faq-entry]').length,
			disclosureCount: document.querySelectorAll('.faq-page details').length,
			overflow: document.documentElement.scrollWidth - innerWidth,
			minTarget: Math.min(...scopedActions.map((action) => action.getBoundingClientRect().height)),
			activeNav: document.querySelector('a[href="/faq"][aria-current="page"]')?.textContent.trim(),
			chapters: ['money', 'fit', 'how', 'start'].every((id) => document.getElementById(id)),
			contract: document.documentElement.innerHTML.includes('faq-answer-sheet')
		};
	})()`);
	assert(desktop.title === 'Know the catch before you hand over the card.', 'desktop: page identity is missing');
	assert(desktop.entryCount === 34, `desktop: expected 34 answers, received ${desktop.entryCount}`);
	assert(desktop.disclosureCount === 0, `desktop: found ${desktop.disclosureCount} hidden disclosures`);
	assert(desktop.overflow === 0, `desktop: horizontal overflow is ${desktop.overflow}px`);
	assert(desktop.minTarget >= 44, `desktop: smallest route action is ${desktop.minTarget}px`);
	assert(desktop.activeNav === 'FAQ', 'desktop: FAQ navigation is not active');
	assert(desktop.chapters, 'desktop: a question chapter is missing');
	assert(desktop.contract, 'desktop: direction contract did not survive the build');
	await capture('desktop');

	await viewport(390, 844, true);
	await navigate();
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		facts: document.querySelectorAll('.decision-ticket dl a').length,
		heroActionHeight: Math.min(...[...document.querySelectorAll('.hero-actions a')].map((action) => action.getBoundingClientRect().height)),
		ticketBottom: document.querySelector('.decision-ticket').getBoundingClientRect().bottom
	}))()`);
	assert(mobile.overflow === 0, `mobile: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.facts === 4, `mobile: expected four decision facts, received ${mobile.facts}`);
	assert(mobile.heroActionHeight >= 44, `mobile: hero action is ${mobile.heroActionHeight}px tall`);
	assert(mobile.ticketBottom > 0, 'mobile: decision ticket is not rendered');
	await capture('mobile');

	await navigate(`${route}#cancel`);
	for (let attempt = 0; attempt < 30; attempt += 1) {
		const top = await evaluate(`document.querySelector('#cancel').getBoundingClientRect().top`);
		if (top >= 0 && top < 180) break;
		await delay(50);
	}
	const deepLink = await evaluate(`(() => ({ hash: location.hash, top: document.querySelector('#cancel').getBoundingClientRect().top }))()`);
	assert(deepLink.hash === '#cancel', 'deep link: hash was not preserved');
	assert(deepLink.top >= 0 && deepLink.top < 180, `deep link: #cancel landed at ${deepLink.top}px`);

	await viewport(320, 844, true);
	await navigate();
	const zoomOverflow = await evaluate(`(() => {
		document.documentElement.style.fontSize = '200%';
		return new Promise((resolve) => requestAnimationFrame(() => resolve(document.documentElement.scrollWidth - innerWidth)));
	})()`);
	assert(zoomOverflow === 0, `200% text at 320px: horizontal overflow is ${zoomOverflow}px`);

	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(390, 844, true);
	await navigate();
	const reducedMotion = await evaluate(`getComputedStyle(document.querySelector('.decision-ticket')).animationName`);
	assert(reducedMotion === 'none', `reduced motion: ticket animation is ${reducedMotion}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({
		heading: document.querySelector('h1')?.textContent.trim(),
		entryCount: document.querySelectorAll('[data-faq-entry]').length,
		jsonLd: document.querySelector('script[type="application/ld+json"]')?.textContent.length ?? 0
	}))()`);
	assert(noScript.heading === 'Know the catch before you hand over the card.', 'no JavaScript: page identity is missing');
	assert(noScript.entryCount === 34, `no JavaScript: expected 34 answers, received ${noScript.entryCount}`);
	assert(noScript.jsonLd > 100, 'no JavaScript: FAQ structured data is missing');
	assert(pageErrors.length === 0, `browser: ${pageErrors.length} page exception(s): ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `browser: failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	// Chromium can still be flushing its profile when we get here, and an
	// ENOTEMPTY thrown from the finally block replaces the assertion results
	// with a teardown stack trace, which is how a failing run reads as a crash.
	try {
		await rm(profile, { recursive: true, force: true });
	} catch {
		// A leftover temp profile is not a verification result.
	}
}

if (failures.length > 0) {
	console.error(`FAQ browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('FAQ browser verification passed: desktop, mobile, deep links, 200% text, reduced motion, and no-JavaScript.');
