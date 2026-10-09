import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/features/labels-and-printing`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-labels-page-'));
const browser = spawn('chromium', [
	'--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
	'--remote-debugging-port=9340', `--user-data-dir=${profile}`, 'about:blank'
], { stdio: 'ignore' });
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
let socket;

try {
	let target;
	for (let attempt = 0; attempt < 50; attempt += 1) {
		try {
			const targets = await fetch('http://127.0.0.1:9340/json/list').then((response) => response.json());
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
	const responseUrls = [];
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
			responseUrls.push(response.url);
			if (response.status >= 400 && !response.url.includes('/_vercel/insights/script.js')) failedRequests.push(`${response.status} ${response.url}`);
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
	// Considered Strategy; not used because each viewport follows one invariant
	// browser sequence and only the dimensions vary.
	const navigate = async () => {
		await send('Page.navigate', { url: route });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(route)}`)) break;
			await delay(100);
		}
		await evaluate(`document.fonts.ready.then(async () => {
			const style = document.createElement('style');
			style.textContent = 'astro-dev-toolbar { display: none !important; }';
			document.head.append(style);
			document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
			document.querySelectorAll('.anim-enter, .reveal-pending').forEach((element) => {
				element.style.animation = 'none'; element.style.transition = 'none';
				element.style.opacity = '1'; element.style.transform = 'none';
			});
			await Promise.all([...document.images].map((image) => image.decode?.().catch(() => undefined)));
			document.documentElement.scrollTop = 0;
		})`);
	};
	const capture = async (name) => {
		const metrics = await send('Page.getLayoutMetrics');
		const { width, height } = metrics.cssContentSize;
		const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
		await writeFile(join(reviewDir, `labels-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);
	for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024]]) {
		await viewport(width, height);
		await navigate();
		const state = await evaluate(`(() => {
			const routeRoot = document.querySelector('#features-labels');
			const targets = [...routeRoot.querySelectorAll('a, summary')].map((element) => element.getBoundingClientRect().height);
			return {
				title: document.title,
				h1: document.querySelector('h1')?.textContent.trim(),
				overflow: document.documentElement.scrollWidth - innerWidth,
				status: document.querySelector('[data-labels-status]')?.textContent.trim(),
				proofTop: document.querySelector('figure')?.getBoundingClientRect().top,
				faqCount: document.querySelectorAll('[data-labels-disclosure]').length,
				navCount: document.querySelectorAll('[data-labels-on-page-link]').length,
				proofLinkCount: document.querySelectorAll('[data-full-proof-link]').length,
				minTarget: Math.min(...targets),
				allClosed: [...document.querySelectorAll('[data-labels-disclosure]')].every((details) => !details.open)
			};
		})()`);
		assert(state.title.includes('Kitchen label printing for caterers'), `${width}: wrong title`);
		assert(state.h1 === 'Kitchen date labels, printed from Prep and Pack.', `${width}: wrong H1`);
		assert(state.overflow === 0, `${width}: horizontal overflow is ${state.overflow}px`);
		// Available since 2026-09-27 (RC-35); the badge reads the shared status word.
		assert(state.status === 'In the app today', `${width}: status is ${state.status}`);
		assert(state.proofTop < height, `${width}: authentic proof starts at ${state.proofTop}px below a ${height}px viewport`);
		assert(state.faqCount === 6 && state.allClosed, `${width}: FAQ inventory drifted or opens by default`);
		assert(state.navCount === 3 && state.proofLinkCount === 4, `${width}: chapter or proof links are missing`);
		assert(state.minTarget >= 44, `${width}: smallest route action is ${state.minTarget}px`);
		if (width === 1440) await capture('desktop');
	}

	await viewport(390, 844, true);
	responseUrls.length = 0;
	await navigate();
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		proofTop: document.querySelector('figure')?.getBoundingClientRect().top,
		proofSource: new URL(document.querySelector('figure img').currentSrc, location.href).pathname
	}))()`);
	assert(mobile.overflow === 0, `mobile: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.proofTop < 844, `mobile: proof starts at ${mobile.proofTop}px`);
	assert(mobile.proofSource === '/proof/labels/sticker.png', `mobile: hero source is ${mobile.proofSource}`);
	assert(!responseUrls.some((url) => url.includes('/proof/labels/dialog-wide.png')), 'mobile: hero downloaded the desktop proof asset');
	await capture('mobile');

	await viewport(320, 844, true);
	await navigate();
	const zoom = await evaluate(`(() => { document.documentElement.style.fontSize = '200%'; return new Promise((resolve) => requestAnimationFrame(() => {
		const width = document.documentElement.clientWidth;
		const escaped = [...document.querySelectorAll('#features-labels *')].filter((element) => {
			// A capture keeps a readable floor and scrolls inside its own frame
			// (.shot-pan, global.css); the frame, not the capture, must fit. Only
			// the image is exempt, and only in a frame that really scrolls.
			const pan = element.closest('.shot-pan');
			if (pan && pan !== element && element.matches('img, picture, source') && /^(auto|scroll)$/.test(getComputedStyle(pan).overflowX)) return false;
			const rect = element.getBoundingClientRect();
			return rect.left < -1 || rect.right > width + 1;
		}).length;
		resolve({ overflow: document.documentElement.scrollWidth - innerWidth, escaped });
	})); })()`);
	assert(zoom.overflow === 0, `200% text: horizontal overflow is ${zoom.overflow}px`);
	assert(zoom.escaped === 0, `200% text: ${zoom.escaped} element(s) escape the viewport`);

	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(390, 844, true);
	await navigate();
	const reduced = await evaluate(`getComputedStyle(document.querySelector('figure')).animationName`);
	assert(reduced === 'none', `reduced motion: hero animation is ${reduced}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await send('Page.navigate', { url: route });
	await delay(500);
	const noScript = await evaluate(`(() => ({ h1: document.querySelector('h1')?.textContent.trim(), faq: document.querySelectorAll('[data-labels-disclosure]').length, hidden: document.querySelectorAll('.reveal-pending').length }))()`);
	assert(noScript.h1 === 'Kitchen date labels, printed from Prep and Pack.', 'no JavaScript: hero did not render');
	assert(noScript.faq === 6 && noScript.hidden === 0, 'no JavaScript: route content did not remain available');
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
	console.error(`Labels browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log('Labels browser verification passed: desktop, mobile art direction, 200% text, reduced motion, and no-JavaScript.');
