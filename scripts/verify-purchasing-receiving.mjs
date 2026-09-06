import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/features/purchasing-and-receiving`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-purchasing-'));
const port = 9340;
const browser = spawn('chromium', [
	'--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
	`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, route
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
	// Considered Strategy; not used because every capture needs the same fixed
	// stabilization sequence rather than interchangeable browser behaviors.
	const navigate = async () => {
		await send('Page.navigate', { url: route });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(route)}`)) break;
			await delay(100);
		}
		await evaluate(`document.fonts.ready.then(async () => {
			const captureStyle = document.createElement('style');
			captureStyle.textContent = 'astro-dev-toolbar { display: none !important; }';
			document.head.append(captureStyle);
			document.querySelectorAll('.anim-enter, .reveal-pending').forEach((element) => {
				element.style.animation = 'none'; element.style.transition = 'none';
				element.style.opacity = '1'; element.style.transform = 'none';
			});
			await Promise.all(Array.from(document.querySelectorAll('.purchasing-enter')).flatMap((element) =>
				element.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => undefined))
			));
			document.documentElement.scrollTop = 0;
		})`);
	};
	const capture = async (name) => {
		const metrics = await send('Page.getLayoutMetrics');
		const { width, height } = metrics.cssContentSize;
		const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
		await writeFile(join(reviewDir, `purchasing-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);
	await viewport(1440, 900);
	await navigate();
	const desktop = await evaluate(`(() => {
		const actions = [...document.querySelectorAll('.hero-actions a, .story-nav a, .closing-actions a, .breadcrumb a, .onward a')];
		const heroActions = [...document.querySelectorAll('.hero-actions a')];
		return {
			title: document.querySelector('h1')?.textContent.trim(),
			overflow: document.documentElement.scrollWidth - innerWidth,
			minTarget: Math.min(...actions.map((action) => action.getBoundingClientRect().height)),
			chapters: ['send-the-order', 'receive-the-delivery', 'features-purchasing', 'faq-heading'].every((id) => document.getElementById(id)),
			menuHref: [...document.querySelectorAll('[data-features-menu] a')].find((link) => link.textContent.trim().startsWith('Purchasing'))?.getAttribute('href'),
			motionName: getComputedStyle(document.querySelector('.purchasing-enter .handoff-flow > *')).animationName,
			genericRevealCount: document.querySelectorAll('.purchasing-page [data-reveal]').length,
			heroActionBottoms: heroActions.map((action) => Math.round(action.getBoundingClientRect().bottom)),
			viewportHeight: innerHeight,
			capabilitiesOpen: document.querySelector('#features-purchasing').open,
			receivedPrice: document.querySelector('.receiving-line .price')?.textContent.replace(/\s+/g, ' ').trim()
		};
	})()`);
	assert(desktop.title === 'The order you sent should meet the delivery at the back door.', 'desktop: page identity is missing');
	assert(desktop.overflow === 0, `desktop: horizontal overflow is ${desktop.overflow}px`);
	assert(desktop.minTarget >= 44, `desktop: smallest action target is ${desktop.minTarget}px`);
	assert(desktop.chapters, 'desktop: a required story chapter is missing');
	assert(desktop.menuHref === '/features/purchasing-and-receiving', 'desktop: dropdown destination is wrong');
	assert(desktop.motionName === 'purchasing-handoff-step', `desktop: purchasing motion owner is ${desktop.motionName}`);
	assert(desktop.genericRevealCount === 0, `desktop: ${desktop.genericRevealCount} generic reveal hook(s) remain`);
	assert(desktop.heroActionBottoms.every((bottom) => bottom <= desktop.viewportHeight), `desktop: hero actions end at ${desktop.heroActionBottoms.join('px and ')}px in a ${desktop.viewportHeight}px viewport`);
	assert(desktop.capabilitiesOpen === false, 'desktop: full capability inventory is open by default');
	assert(desktop.receivedPrice?.includes('$45.00') && desktop.receivedPrice?.includes('$47.00'), `desktop: received price provenance is ${desktop.receivedPrice}`);
	await capture('desktop');

	await viewport(390, 844, true);
	await navigate();
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		actionsFit: [...document.querySelectorAll('.hero-actions a')].every((action) => action.getBoundingClientRect().height >= 44),
		resultBottom: document.querySelector('.handoff-flow .result').getBoundingClientRect().bottom,
		viewportHeight: innerHeight,
		actionsVisible: [...document.querySelectorAll('.hero-actions a')].every((action) => action.getBoundingClientRect().bottom <= innerHeight)
	}))()`);
	assert(mobile.overflow === 0, `mobile: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.actionsFit, 'mobile: hero actions are below 44px');
	assert(mobile.resultBottom <= mobile.viewportHeight, `mobile: follow-up result ends at ${mobile.resultBottom}px in a ${mobile.viewportHeight}px viewport`);
	assert(mobile.actionsVisible, 'mobile: a hero action is below the first viewport');
	await capture('mobile');

	await viewport(320, 844, true);
	await navigate();
	const zoomLayout = await evaluate(`(() => { document.documentElement.style.fontSize = '200%'; return new Promise((resolve) => requestAnimationFrame(() => {
		const viewportWidth = document.documentElement.clientWidth;
		const escaped = [...document.querySelectorAll('.purchasing-page *')].filter((element) => {
			const rect = element.getBoundingClientRect();
			return rect.left < -1 || rect.right > viewportWidth + 1;
		}).length;
		resolve({ overflow: document.documentElement.scrollWidth - innerWidth, escaped });
	})); })()`);
	assert(zoomLayout.overflow === 0, `200% text at 320px: horizontal overflow is ${zoomLayout.overflow}px`);
	assert(zoomLayout.escaped === 0, `200% text at 320px: ${zoomLayout.escaped} element(s) escape the viewport`);

	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(390, 844, true);
	await navigate();
	const reducedMotion = await evaluate(`(() => ({
		disclosure: getComputedStyle(document.querySelector('.faq summary svg')).transitionDuration,
		handoff: getComputedStyle(document.querySelector('.purchasing-enter .handoff-flow > *')).animationName
	}))()`);
	assert(reducedMotion.disclosure === '0s', `reduced motion: disclosure transition is ${reducedMotion.disclosure}`);
	assert(reducedMotion.handoff === 'none', `reduced motion: handoff animation is ${reducedMotion.handoff}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({ heading: document.querySelector('h1')?.textContent.trim(), capabilityCount: document.querySelectorAll('#features-purchasing li').length }))()`);
	assert(noScript.heading === 'The order you sent should meet the delivery at the back door.', 'no JavaScript: hero did not render');
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
	console.error(`Purchasing & Receiving browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log('Purchasing & Receiving browser verification passed: desktop, mobile, 200% text, reduced motion, and no-JavaScript.');
