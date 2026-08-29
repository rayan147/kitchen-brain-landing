import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4328';
const route = `${baseUrl}/who-its-for`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-who-its-for-'));
const port = 9345;
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
	const navigate = async () => {
		await send('Page.navigate', { url: route });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(route)}`)) break;
			await delay(100);
		}
		await evaluate(`document.fonts.ready.then(() => {
			const style = document.createElement('style');
			style.textContent = 'astro-dev-toolbar { display: none !important; }';
			document.head.append(style);
			document.querySelectorAll('[data-reveal]').forEach((element) => {
				element.classList.remove('reveal-pending');
				element.classList.add('revealed');
			});
			document.querySelector('.service-ticket')?.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
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
		await writeFile(join(reviewDir, `who-its-for-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	await viewport(1440, 900);
	await navigate();
	const desktop = await evaluate(`(() => {
		const actions = [...document.querySelectorAll('.audience-page a')];
		const header = document.querySelector('header');
		return {
			title: document.querySelector('h1')?.textContent.trim(),
			overflow: document.documentElement.scrollWidth - innerWidth,
			minTarget: Math.min(...actions.map((action) => action.getBoundingClientRect().height)),
			activeNav: document.querySelector('a[href="/who-its-for"][aria-current="page"]')?.textContent.trim(),
			fitSignals: document.querySelectorAll('.fit-signals li').length,
			workSteps: document.querySelectorAll('.work-path li').length,
			limits: document.querySelectorAll('.limits-ticket li').length,
			headerRows: Math.round(header.getBoundingClientRect().height),
			contract: document.documentElement.innerHTML.includes('who-its-for-work-fit')
		};
	})()`);
	assert(desktop.title?.startsWith('The work decides whether CostCook fits.'), 'desktop: page identity is missing');
	assert(desktop.overflow === 0, `desktop: horizontal overflow is ${desktop.overflow}px`);
	assert(desktop.minTarget >= 44, `desktop: smallest route action is ${desktop.minTarget}px`);
	assert(desktop.activeNav === "Who it's for", 'desktop: navigation tab is not active');
	assert(desktop.fitSignals === 4, `desktop: expected 4 fit signals, received ${desktop.fitSignals}`);
	assert(desktop.workSteps === 4, `desktop: expected 4 work steps, received ${desktop.workSteps}`);
	assert(desktop.limits === 3, `desktop: expected 3 limits, received ${desktop.limits}`);
	assert(desktop.headerRows < 150, `desktop: shared header wrapped to ${desktop.headerRows}px`);
	assert(desktop.contract, 'desktop: direction contract did not survive the build');
	await capture('desktop');

	for (const [width, height] of [[1280, 800], [1024, 768], [768, 1024]]) {
		await viewport(width, height);
		await navigate();
		const responsive = await evaluate(`(() => ({
			overflow: document.documentElement.scrollWidth - innerWidth,
			headerHeight: Math.round(document.querySelector('header').getBoundingClientRect().height),
			navVisible: getComputedStyle(document.querySelector('a[href="/who-its-for"]')).display !== 'none'
		}))()`);
		assert(responsive.overflow === 0, `${width}x${height}: horizontal overflow is ${responsive.overflow}px`);
		assert(responsive.headerHeight < 160, `${width}x${height}: shared header is ${responsive.headerHeight}px tall`);
		assert(responsive.navVisible, `${width}x${height}: navigation tab is hidden`);
	}

	await viewport(390, 844, true);
	await navigate();
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		ticketBottom: document.querySelector('.service-ticket').getBoundingClientRect().bottom,
		fitSignals: document.querySelectorAll('.fit-signals li').length,
		minAction: Math.min(...[...document.querySelectorAll('.audience-page a')].map((action) => action.getBoundingClientRect().height))
	}))()`);
	assert(mobile.overflow === 0, `mobile: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.ticketBottom > 0, 'mobile: service ticket is not rendered');
	assert(mobile.fitSignals === 4, 'mobile: fit signals are missing');
	assert(mobile.minAction >= 44, `mobile: smallest route action is ${mobile.minAction}px`);
	await capture('mobile');

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
	const reducedMotion = await evaluate(`getComputedStyle(document.querySelector('.service-ticket')).animationName`);
	assert(reducedMotion === 'none', `reduced motion: ticket animation is ${reducedMotion}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({
		heading: document.querySelector('h1')?.textContent.trim(),
		fitSignals: document.querySelectorAll('.fit-signals li').length,
		limits: document.querySelectorAll('.limits-ticket li').length
	}))()`);
	assert(noScript.heading?.startsWith('The work decides whether CostCook fits.'), 'no JavaScript: page identity is missing');
	assert(noScript.fitSignals === 4, 'no JavaScript: fit signals are missing');
	assert(noScript.limits === 3, 'no JavaScript: limits are missing');
	assert(pageErrors.length === 0, `browser: ${pageErrors.length} page exception(s): ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `browser: failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	await rm(profile, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(`Who-it-is-for browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Who-it-is-for browser verification passed: navigation, desktop, responsive headers, mobile, 200% text, reduced motion, and no-JavaScript.');
