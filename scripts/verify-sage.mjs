import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const url = `${baseUrl}/features/sage`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-sage-page-'));
const port = 9337;
const browser = spawn(
	'chromium',
	[
		'--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
		`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, url
	],
	{ stdio: 'ignore' }
);

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

	const send = (method, params = {}) => new Promise((resolve, reject) => {
		messageId += 1;
		pending.set(messageId, { resolve, reject });
		socket.send(JSON.stringify({ id: messageId, method, params }));
	});
	const evaluate = async (expression) => {
		const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
		return result.result.value;
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	// Considered Strategy; not used because this is one fixed route contract
	// exercised with data-driven sizes, not interchangeable browser behavior.
	const viewports = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]];
	for (const [width, height] of viewports) {
		await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
		await send('Page.navigate', { url });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`)) break;
			await delay(100);
		}
		await delay(180);
		await evaluate(`(() => {
			document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
			window.scrollTo(0, document.body.scrollHeight);
		})()`);
		await delay(500);
		await evaluate(`window.scrollTo(0, 0)`);
		// Full-page evidence must not freeze scroll-reveal elements in their
		// pre-animation state. Settle the same class the observer applies.
		await evaluate(`document.querySelectorAll('.reveal-pending').forEach((node) => node.classList.add('revealed'))`);
		await evaluate(`Promise.all([document.fonts?.ready, ...[...document.images].filter((image) => image.complete).map((image) => image.decode?.().catch(() => {}))])`);
		await delay(800);
		const state = await evaluate(`(() => {
			const video = document.querySelector('video');
			return {
				title: document.title,
				h1: document.querySelector('h1')?.textContent.trim(),
				status: document.querySelector('.availability')?.textContent.trim(),
				faqCount: document.querySelectorAll('[data-sage-disclosure]').length,
				abilityCount: document.querySelectorAll('.question-list > li').length,
				videoSources: video ? [...video.querySelectorAll('source')].map((source) => source.getAttribute('type')) : [],
				videoTrack: video?.querySelector('track')?.getAttribute('src'),
				scrollWidth: document.documentElement.scrollWidth,
				innerWidth,
				bodyHeight: document.body.scrollHeight
			};
		})()`);
		if (!state.title.includes('Sage kitchen assistant')) throw new Error(`${width}: wrong title`);
		if (state.h1 !== 'Ask your kitchen. Check the answer.') throw new Error(`${width}: wrong H1`);
		if (state.status !== 'In the app today') throw new Error(`${width}: availability drifted`);
		if (state.faqCount !== 6 || state.abilityCount !== 12) throw new Error(`${width}: list count drifted`);
		if (state.videoSources.join(',') !== 'video/webm,video/mp4') throw new Error(`${width}: video fallbacks drifted`);
		if (state.videoTrack !== '/proof/sage-walkthrough.vtt') throw new Error(`${width}: caption track drifted`);
		if (state.scrollWidth !== state.innerWidth) throw new Error(`${width}: horizontal overflow ${state.scrollWidth}/${state.innerWidth}`);

		if (width === 1440 || width === 390) {
			const shot = await send('Page.captureScreenshot', {
				format: 'png', fromSurface: true, captureBeyondViewport: true,
				clip: { x: 0, y: 0, width, height: state.bodyHeight, scale: 1 }
			});
			await writeFile(join(reviewDir, width === 1440 ? 'desktop.png' : 'mobile.png'), Buffer.from(shot.data, 'base64'));
		}
	}

	await evaluate(`document.querySelector('.faq-list details summary').focus()`);
	await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
	await send('Input.dispatchKeyEvent', { type: 'char', text: ' ', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
	await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
	if (!(await evaluate(`document.querySelector('.faq-list details').open`))) throw new Error('Keyboard: Space did not open the first FAQ');
	if (pageErrors.length) throw new Error(`Console exceptions: ${pageErrors.join(', ')}`);
	if (failedRequests.length) throw new Error(`Failed requests: ${failedRequests.join(', ')}`);

	console.log('Sage browser contract passed at 1440, 1280, 1024, 768, and 390 pixels.');
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
