import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
const routes = [
	{ slug: 'sage', path: '/features/sage', h1: 'Ask Sage about your kitchen.', selector: '.question-list > li', count: 13 },
	{ slug: 'recipes', path: '/features/recipes-and-costing', h1: 'Cost a recipe before you quote.', selector: '.lifecycle-path li', count: 5 },
	{ slug: 'team', path: '/features/team-and-access', h1: 'Give your crew their own sign-in.', selector: '[data-team-disclosure]', count: 4 },
	// 2026-09-27 (RC-61): the six steps of the app's event step bar.
	{ slug: 'events', path: '/features/events-and-proposals', h1: '\u201cA wedding in December, about 150. Can you send something?\u201d', selector: '[data-event-step]', count: 6 }
];
const viewports = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]];

await mkdir(reviewDir, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'costcook-feature-parity-'));
const port = 9343;
const browser = spawn('chromium', [
	'--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
	`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `${baseUrl}${routes[0].path}`
], { stdio: 'ignore' });

let socket;
try {
	let target;
	for (let attempt = 0; attempt < 50; attempt += 1) {
		try {
			const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
			target = targets.find((entry) => entry.type === 'page');
			if (target) break;
		} catch { /* Chromium is starting. */ }
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
	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);
	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

	// Considered Strategy; not used because these routes share one fixed
	// verification contract and vary only by expected data.
	for (const route of routes) {
		const url = `${baseUrl}${route.path}`;
		for (const [width, height] of viewports) {
			await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
			await send('Page.navigate', { url });
			for (let attempt = 0; attempt < 50; attempt += 1) {
				if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`)) break;
				await delay(100);
			}
			await evaluate(`(() => { document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; }); window.scrollTo(0, document.body.scrollHeight); })()`);
			await delay(250);
			await evaluate(`window.scrollTo(0, 0); document.querySelectorAll('.reveal-pending').forEach((node) => node.classList.add('revealed'))`);
			await evaluate(`Promise.all([document.fonts?.ready, ...[...document.images].filter((image) => image.complete).map((image) => image.decode?.().catch(() => {}))])`);
			const state = await evaluate(`(() => ({ h1: document.querySelector('h1')?.textContent.trim(), count: document.querySelectorAll(${JSON.stringify(route.selector)}).length, scrollWidth: document.documentElement.scrollWidth, innerWidth, bodyHeight: document.body.scrollHeight }))()`);
			if (state.h1 !== route.h1) throw new Error(`${route.slug} ${width}: wrong H1`);
			if (state.count !== route.count) throw new Error(`${route.slug} ${width}: expected ${route.count} contract rows, received ${state.count}`);
			if (state.scrollWidth !== state.innerWidth) throw new Error(`${route.slug} ${width}: horizontal overflow ${state.scrollWidth}/${state.innerWidth}`);
			if (width === 1440 || width === 390) {
				const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: state.bodyHeight, scale: 1 } });
				await writeFile(join(reviewDir, `${route.slug}-${width === 1440 ? 'desktop' : 'mobile'}.png`), Buffer.from(shot.data, 'base64'));
			}
		}

		await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 720, deviceScaleFactor: 1, mobile: true });
		await evaluate(`document.documentElement.style.fontSize = '200%'`);
		const zoom = await evaluate(`(() => {
			const selectors = ['h1', 'h2', '.hero-actions a', '.closing-actions a'];
			const offenders = [...document.querySelectorAll(selectors.join(','))].flatMap((node) => {
				const rect = node.getBoundingClientRect();
				return rect.left < -1 || rect.right > innerWidth + 1
					? [node.textContent.trim().replace(/\\s+/g, ' ').slice(0, 60)]
					: [];
			});
			return { scrollWidth: document.documentElement.scrollWidth, innerWidth, offenders };
		})()`);
		if (zoom.scrollWidth !== zoom.innerWidth) throw new Error(`${route.slug}: horizontal overflow at 200% text`);
		if (zoom.offenders.length) throw new Error(`${route.slug}: clipped content at 200% text: ${zoom.offenders.join(', ')}`);
		if (route.slug === 'team') {
			const teamSemantics = await evaluate(`(() => ({
				breadcrumbCurrent: document.querySelector('.feature-breadcrumb [aria-current="page"]')?.textContent.trim(),
				menuCurrent: document.querySelector('[data-features-menu] a[aria-current="page"]')?.getAttribute('href'),
				roleFacts: document.querySelectorAll('.role-facts').length,
				roleLabels: document.querySelectorAll('.role-facts dt').length,
				boundaryOffset: getComputedStyle(document.querySelector('#role-boundaries')).scrollMarginTop,
				targets: [...document.querySelectorAll('.feature-breadcrumb a, .feature-onward a')].map((node) => node.getBoundingClientRect().height)
			}))()`);
			if (teamSemantics.breadcrumbCurrent !== 'Team & access') throw new Error('team: breadcrumb lost current-page semantics');
			if (teamSemantics.menuCurrent !== '/features/team-and-access') throw new Error('team: feature menu lost current-page semantics');
			if (teamSemantics.roleFacts !== 3 || teamSemantics.roleLabels !== 9) throw new Error('team: role comparison lost its semantic fact grid');
			if (teamSemantics.boundaryOffset === 'auto' || teamSemantics.boundaryOffset === '0px') throw new Error('team: boundary anchor has no sticky-header offset');
			if (teamSemantics.targets.some((height) => height < 44)) throw new Error('team: breadcrumb or onward target is smaller than 44px');
		}
		await evaluate(`document.documentElement.style.fontSize = ''`);

		await send('Emulation.setScriptExecutionDisabled', { value: true });
		await send('Page.navigate', { url });
		await delay(400);
		const noJsH1 = await evaluate(`document.querySelector('h1')?.textContent.trim()`);
		if (noJsH1 !== route.h1) throw new Error(`${route.slug}: no-JavaScript page lost its identity`);
		await send('Emulation.setScriptExecutionDisabled', { value: false });
	}

	if (pageErrors.length) throw new Error(`Console exceptions: ${pageErrors.join(', ')}`);
	if (failedRequests.length) throw new Error(`Failed requests: ${failedRequests.join(', ')}`);
	console.log('Feature parity browser contract passed for Sage, Recipes & Costing, Team & Access, and Events & Proposals at five viewports, 200% text, reduced motion, and no JavaScript.');
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
