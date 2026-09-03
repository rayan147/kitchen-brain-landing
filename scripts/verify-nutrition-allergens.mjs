import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/features/nutrition-facts-and-allergens`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-nutrition-page-'));
const port = 9338;
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
	const viewport = (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
	// Considered Strategy; not used because every viewport needs the same fixed
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
		await writeFile(join(reviewDir, `nutrition-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);
	for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024]]) {
		await viewport(width, height);
		await navigate();
		const state = await evaluate(`(() => ({
			title: document.title,
			h1: document.querySelector('h1')?.textContent.trim(),
			overflow: document.documentElement.scrollWidth - innerWidth,
			faqCount: document.querySelectorAll('[data-nutrition-disclosure]').length,
			capabilityCount: document.querySelectorAll('[data-capability-disclosure]').length,
			proofCount: document.querySelectorAll('[data-proof-image]').length,
			heroActionBottoms: [...document.querySelectorAll('.hero-actions a')].map((action) => Math.round(action.getBoundingClientRect().bottom)),
			minActionTarget: Math.min(...[...document.querySelectorAll('.nutrition-page a, .nutrition-page summary')].map((action) => action.getBoundingClientRect().height)),
			capabilitiesClosed: [...document.querySelectorAll('[data-capability-disclosure]')].every((details) => !details.open)
		}))()`);
		assert(state.title.includes('Nutrition facts and allergen management software'), `${width}: wrong title`);
		assert(state.h1 === 'One recipe. Two answers you cannot guess at.', `${width}: wrong H1`);
		assert(state.overflow === 0, `${width}: horizontal overflow is ${state.overflow}px`);
		assert(state.faqCount === 6 && state.capabilityCount === 2, `${width}: disclosure count drifted`);
		assert(state.proofCount === 4, `${width}: proof count is ${state.proofCount}`);
		assert(state.heroActionBottoms.every((bottom) => bottom <= height), `${width}: hero actions end at ${state.heroActionBottoms.join('px and ')}px in a ${height}px viewport`);
		assert(state.minActionTarget >= 44, `${width}: smallest route action is ${state.minActionTarget}px`);
		assert(state.capabilitiesClosed, `${width}: capability inventory is open by default`);
		if (width === 1440) await capture('desktop');
	}

	await viewport(390, 844, true);
	await navigate();
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		heroActionsVisible: [...document.querySelectorAll('.hero-actions a')].every((action) => action.getBoundingClientRect().bottom <= innerHeight),
		proofStartsInViewport: document.querySelector('.hero-proof').getBoundingClientRect().top < innerHeight,
		proofSources: [...document.querySelectorAll('[data-proof-image]')].map((image) => new URL(image.currentSrc, location.href).pathname)
	}))()`);
	assert(mobile.overflow === 0, `mobile: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.heroActionsVisible, 'mobile: a hero action is below the first viewport');
	assert(mobile.proofStartsInViewport, 'mobile: authentic hero proof starts below the first viewport');
	assert(mobile.proofSources.includes('/proof/nutrition/nutrition-summary-mobile.png'), 'mobile: art-directed summary proof is missing');
	await capture('mobile');

	await viewport(320, 844, true);
	await navigate();
	const zoomLayout = await evaluate(`(() => { document.documentElement.style.fontSize = '200%'; return new Promise((resolve) => requestAnimationFrame(() => {
		const viewportWidth = document.documentElement.clientWidth;
		const escaped = [...document.querySelectorAll('.nutrition-page *')].filter((element) => {
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
	const reducedMotion = await evaluate(`(() => ({ hero: getComputedStyle(document.querySelector('.hero-proof')).animationName, disclosure: getComputedStyle(document.querySelector('.faq-list summary svg')).transitionDuration }))()`);
	assert(reducedMotion.hero === 'none', `reduced motion: hero animation is ${reducedMotion.hero}`);
	assert(reducedMotion.disclosure === '0s', `reduced motion: disclosure transition is ${reducedMotion.disclosure}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await send('Page.navigate', { url: route });
	await delay(500);
	const noScript = await evaluate(`(() => ({ heading: document.querySelector('h1')?.textContent.trim(), proofCount: document.querySelectorAll('[data-proof-image]').length, capabilityCount: document.querySelectorAll('[data-capability-disclosure] li').length, hiddenRevealCount: document.querySelectorAll('.reveal-pending').length }))()`);
	assert(noScript.heading === 'One recipe. Two answers you cannot guess at.', 'no JavaScript: hero did not render');
	assert(noScript.proofCount === 4, 'no JavaScript: proof did not render');
	assert(noScript.capabilityCount > 0, 'no JavaScript: capability content did not render');
	assert(noScript.hiddenRevealCount === 0, 'no JavaScript: content stayed reveal-hidden');
	assert(pageErrors.length === 0, `browser: ${pageErrors.length} page exception(s): ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `browser: failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	await rm(profile, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(`Nutrition & allergens browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log('Nutrition & allergens browser verification passed: desktop, mobile, 200% text, reduced motion, and no-JavaScript.');
