import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/demo`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-demo-'));
const port = 9351;
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
			const response = message.params.response;
			const url = new URL(response.url);
			// Considered Strategy; not used because this is one exact local-preview
			// exception, not a family of interchangeable request classifiers.
			const localAnalytics404 = response.status === 404 &&
				(url.hostname === '127.0.0.1' || url.hostname === 'localhost') &&
				url.pathname === '/_vercel/insights/script.js';
			if (!localAnalytics404) failedRequests.push(`${response.status} ${response.url}`);
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
			document.querySelectorAll('.anim-enter').forEach((element) => element.getAnimations().forEach((animation) => animation.finish()));
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
		await writeFile(join(reviewDir, `demo-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	await viewport(1440, 900);
	await navigate();
	const desktop = await evaluate(`(() => {
		const routeActions = [...document.querySelectorAll('.demo-page a, .demo-page button')].filter((action) => action.getClientRects().length > 0);
		const form = document.querySelector('[data-demo-form]');
		return {
			title: document.querySelector('h1')?.textContent.trim(),
			overflow: document.documentElement.scrollWidth - innerWidth,
			minTarget: Math.min(...routeActions.map((action) => action.getBoundingClientRect().height)),
			currentStep: form?.dataset.currentStep,
			stepTwoDisplay: getComputedStyle(document.querySelector('[data-step="2"]')).display,
			contract: document.documentElement.innerHTML.includes('request-demo-working-session'),
			demoLinks: document.querySelectorAll('a[href="/demo"]').length
		};
	})()`);
	assert(desktop.title === 'Put one real job on the screen.', 'desktop: page identity is missing');
	assert(desktop.overflow === 0, `desktop: horizontal overflow is ${desktop.overflow}px`);
	assert(desktop.minTarget >= 44, `desktop: smallest route action is ${desktop.minTarget}px`);
	assert(desktop.currentStep === '1', `desktop: expected step 1, received ${desktop.currentStep}`);
	assert(desktop.stepTwoDisplay === 'none', 'desktop: contact step is visible before kitchen details');
	assert(desktop.contract, 'desktop: direction contract did not survive the build');
	assert(desktop.demoLinks > 0, 'desktop: shared demo destination is missing');
	await capture('desktop');

	const emptyAdvance = await evaluate(`(() => {
		document.querySelector('[data-next]').click();
		return document.querySelector('[data-demo-form]').dataset.currentStep;
	})()`);
	assert(emptyAdvance === '1', 'validation: empty kitchen step advanced');

	const completedFlow = await evaluate(`(() => {
		const form = document.querySelector('[data-demo-form]');
		const set = (name, value) => { form.elements[name].value = value; };
		set('business', 'Garden Table Catering');
		set('role', 'Owner or chef-owner');
		set('kitchen', 'Catering and private events');
		set('locations', '1');
		set('workflow', 'A 180-guest wedding menu');
		document.querySelector('[data-next]').click();
		const afterNext = form.dataset.currentStep;
		document.querySelector('[data-back]').click();
		const afterBack = form.dataset.currentStep;
		document.querySelector('[data-next]').click();
		set('firstName', 'Maya');
		set('lastName', 'Ortiz');
		set('email', 'maya@example.com');
		form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		return { afterNext, afterBack, afterSubmit: form.dataset.currentStep, preparedVisible: getComputedStyle(document.querySelector('[data-step="3"]')).display };
	})()`);
	assert(completedFlow.afterNext === '2', 'workflow: valid kitchen details did not advance');
	assert(completedFlow.afterBack === '1', 'workflow: Back did not restore the kitchen step');
	assert(completedFlow.afterSubmit === '3', 'workflow: valid contact details did not prepare the request');
	assert(completedFlow.preparedVisible === 'block', 'workflow: prepared-email state is hidden');

	for (const [width, height] of [[1280, 800], [1024, 768], [768, 1024]]) {
		await viewport(width, height);
		await navigate();
		const responsive = await evaluate(`(() => ({
			overflow: document.documentElement.scrollWidth - innerWidth,
			headerHeight: Math.round(document.querySelector('header').getBoundingClientRect().height),
			formWidth: Math.round(document.querySelector('[data-demo-form]').getBoundingClientRect().width)
		}))()`);
		assert(responsive.overflow === 0, `${width}x${height}: horizontal overflow is ${responsive.overflow}px`);
		assert(responsive.headerHeight < 170, `${width}x${height}: shared header is ${responsive.headerHeight}px tall`);
		assert(responsive.formWidth > 280, `${width}x${height}: form collapsed to ${responsive.formWidth}px`);
	}

	await viewport(390, 844, true);
	await navigate();
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		ticketTop: Math.round(document.querySelector('.demo-ticket').getBoundingClientRect().top),
		minControl: Math.min(...[...document.querySelectorAll('.demo-page input, .demo-page select, .demo-page button, .demo-page a')].map((control) => control.getBoundingClientRect().height).filter(Boolean)),
		step: document.querySelector('[data-demo-form]').dataset.currentStep
	}))()`);
	assert(mobile.overflow === 0, `mobile: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.ticketTop < 844, `mobile: primary form starts below the first viewport at ${mobile.ticketTop}px`);
	assert(mobile.minControl >= 44, `mobile: smallest control is ${mobile.minControl}px`);
	assert(mobile.step === '1', 'mobile: form does not open on the kitchen step');
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
	const reducedMotion = await evaluate(`getComputedStyle(document.querySelector('.anim-enter')).animationName`);
	assert(reducedMotion === 'none', `reduced motion: entrance animation is ${reducedMotion}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({
		heading: document.querySelector('h1')?.textContent.trim(),
		stepOne: getComputedStyle(document.querySelector('[data-step="1"]')).display,
		stepTwo: getComputedStyle(document.querySelector('[data-step="2"]')).display,
		action: document.querySelector('[data-demo-form]').getAttribute('action')
	}))()`);
	assert(noScript.heading === 'Put one real job on the screen.', 'no JavaScript: page identity is missing');
	assert(noScript.stepOne !== 'none' && noScript.stepTwo !== 'none', 'no JavaScript: both form steps are not available');
	assert(noScript.action?.startsWith('mailto:'), 'no JavaScript: email fallback action is missing');
	assert(pageErrors.length === 0, `browser: ${pageErrors.length} page exception(s): ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `browser: failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	await rm(profile, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(`Demo browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Demo browser verification passed: validation, three-frame workflow, desktop, responsive layouts, mobile fold, 200% text, reduced motion, and no-JavaScript fallback.');
