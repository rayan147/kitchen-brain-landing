import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/features/ingredients-and-supplier-prices`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-ingredients-prices-'));
const port = 9334;
const browser = spawn(
	'chromium',
	[
		'--headless',
		'--no-sandbox',
		'--disable-gpu',
		'--hide-scrollbars',
		`--remote-debugging-port=${port}`,
		`--user-data-dir=${profile}`,
		route
	],
	{ stdio: 'ignore' }
);

const failures = [];
const assert = (condition, message) => {
	if (!condition) failures.push(message);
};

let socket;
try {
	let target;
	for (let attempt = 0; attempt < 50; attempt += 1) {
		try {
			const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
			target = targets.find((entry) => entry.type === 'page');
			if (target) break;
		} catch {
			// Chromium is still starting.
		}
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
		if (message.method === 'Network.responseReceived') {
			const { response } = message.params;
			if (response.status >= 400 && !response.url.includes('/_vercel/insights/script.js')) {
				failedRequests.push(`${response.status} ${response.url}`);
			}
		}
	});

	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			messageId += 1;
			pending.set(messageId, { resolve, reject });
			socket.send(JSON.stringify({ id: messageId, method, params }));
		});
	const evaluate = async (expression) => {
		const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
		return result.result.value;
	};
	const viewport = (width, height, mobile = false) =>
		send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
	const navigate = async () => {
		await send('Page.navigate', { url: route });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(route)}`)) break;
			await delay(100);
		}
		await evaluate(`Promise.all([
			document.fonts.ready,
			...Array.from(document.images, (image) => {
				image.loading = 'eager';
				if (image.complete) return image.decode().catch(() => undefined);
				return new Promise((resolve) => {
					image.addEventListener('load', resolve, { once: true });
					image.addEventListener('error', resolve, { once: true });
				});
			})
		]).then(() => {
			document.querySelectorAll('.anim-enter, .reveal-pending').forEach((element) => {
				element.style.animation = 'none';
				element.style.transition = 'none';
				element.style.opacity = '1';
				element.style.transform = 'none';
			});
		})`);
	};
	const captureFullPage = async (name) => {
		const metrics = await send('Page.getLayoutMetrics');
		const { width, height } = metrics.cssContentSize;
		const shot = await send('Page.captureScreenshot', {
			format: 'png',
			fromSurface: true,
			captureBeyondViewport: true,
			clip: { x: 0, y: 0, width, height, scale: 1 }
		});
		await writeFile(join(reviewDir, `${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	await viewport(1440, 900);
	await navigate();
	const desktop = await evaluate(`(() => {
		const actions = [...document.querySelectorAll('.hero-actions a, .story-nav a, .closing-actions a')];
		return {
			title: document.querySelector('h1')?.textContent.trim(),
			overflow: document.documentElement.scrollWidth - innerWidth,
			minTarget: Math.min(...actions.map((action) => action.getBoundingClientRect().height)),
			chapters: ['ingredient-records', 'supplier-prices', 'features-ingredients', 'faq-heading'].every((id) => document.getElementById(id)),
			menuHref: [...document.querySelectorAll('[data-features-menu] a')].find((link) => link.textContent.includes('Ingredients & supplier prices'))?.getAttribute('href')
		};
	})()`);
	assert(desktop.title === 'Know which supplier price is inside the recipe.', 'desktop: page identity is missing');
	assert(desktop.overflow === 0, `desktop: horizontal overflow is ${desktop.overflow}px`);
	assert(desktop.minTarget >= 44, `desktop: smallest primary/navigation target is ${desktop.minTarget}px`);
	assert(desktop.chapters, 'desktop: a required story chapter is missing');
	assert(desktop.menuHref === '/features/ingredients-and-supplier-prices', 'desktop: dropdown destination is wrong');
	await captureFullPage('desktop');

	await viewport(390, 844, true);
	await navigate();
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		supplierGridColumns: getComputedStyle(document.querySelector('.comparison-row')).gridTemplateColumns,
		actionsFullWidth: [...document.querySelectorAll('.hero-actions a')].every((action) => action.getBoundingClientRect().width > 340)
	}))()`);
	assert(mobile.overflow === 0, `mobile: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.supplierGridColumns.split(' ').length === 2, 'mobile: supplier comparison did not reflow to two columns');
	assert(mobile.actionsFullWidth, 'mobile: hero actions are not full width');
	await captureFullPage('mobile');

	await viewport(320, 844, true);
	await navigate();
	const zoom = await evaluate(`(() => {
		document.documentElement.style.fontSize = '200%';
		return new Promise((resolve) => requestAnimationFrame(() => resolve(document.documentElement.scrollWidth - innerWidth)));
	})()`);
	assert(zoom === 0, `200% text at 320px: horizontal overflow is ${zoom}px`);

	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(390, 844, true);
	await navigate();
	const reducedMotion = await evaluate(`getComputedStyle(document.querySelector('.faq summary svg')).transitionDuration`);
	assert(reducedMotion === '0s', `reduced motion: disclosure transition is ${reducedMotion}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({
		heading: document.querySelector('h1')?.textContent.trim(),
		capabilityCount: document.querySelectorAll('#features-ingredients li').length
	}))()`);
	assert(noScript.heading === 'Know which supplier price is inside the recipe.', 'no JavaScript: hero did not render');
	assert(noScript.capabilityCount > 0, 'no JavaScript: capability list did not render');

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
	console.error(`Ingredients & Supplier Prices browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Ingredients & Supplier Prices browser verification passed: desktop, mobile, 200% text, reduced motion, and no-JavaScript.');
