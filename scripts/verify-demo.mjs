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
	// What the stubbed endpoint answers next. The send path is checked both ways.
	const apiStub = { status: 200, body: { ok: true } };
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
		// THE ENDPOINT AND THE CALENDAR ARE BOTH STUBBED HERE, ON PURPOSE.
		//
		// /api/demo-request is a Vercel function; `astro preview` serves a static
		// directory and would 404 it, so without this the form could only ever be
		// verified failing. Stubbing it is also what lets the failure path be
		// checked at all: a real endpoint would have to be broken to test it.
		// What actually reaches Resend is checked offline by test-demo-endpoint.mjs.
		//
		// calendar.google.com is stubbed so this run is hermetic and does not
		// depend on, or hammer, a third party. Whether the REAL schedule renders
		// and books inside the frame under the production CSP is not a question a
		// local server can answer, because no local server sends that header. It
		// is checked separately, in a browser, against a server that replays
		// vercel.json's own CSP.
		if (message.method === 'Fetch.requestPaused') {
			const { requestId, request: paused } = message.params;
			const body = paused.url.includes('/api/demo-request')
				? { type: 'application/json', text: JSON.stringify(apiStub.body), status: apiStub.status }
				: { type: 'text/html', text: '<!doctype html><title>stub</title><p>stub calendar', status: 200 };
			void send('Fetch.fulfillRequest', {
				requestId,
				responseCode: body.status,
				responseHeaders: [{ name: 'content-type', value: body.type }],
				body: Buffer.from(body.text).toString('base64')
			});
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
			// The 503 this run asks the stubbed endpoint for, so it can check what
			// the page does with one. A real failure here would be a stub that
			// never got installed, and that shows up as a failed assertion.
			const deliberateSendFailure = url.pathname === '/api/demo-request';
			if (!localAnalytics404 && !deliberateSendFailure) failedRequests.push(`${response.status} ${response.url}`);
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
	await send('Fetch.enable', {
		patterns: [
			{ urlPattern: '*/api/demo-request*' },
			{ urlPattern: 'https://calendar.google.com/*' }
		]
	});

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

	const completedFlow = await evaluate(`(async () => {
		const form = document.querySelector('[data-demo-form]');
		const set = (name, value) => { form.elements[name].value = value; };
		const waitForStep = (step) => new Promise((resolve, reject) => {
			if (form.dataset.currentStep === String(step) && form.dataset.phase === 'idle') return resolve();
			const timeout = setTimeout(() => reject(new Error('step transition timed out')), 1500);
			form.addEventListener('demo-step-settled', (event) => {
				if (event.detail.step !== step) return;
				clearTimeout(timeout);
				resolve();
			}, { once: true });
		});
		set('business', 'Garden Table Catering');
		set('role', 'Owner or chef-owner');
		set('kitchen', 'Catering and private events');
		set('locations', '1');
		set('workflow', 'A 180-guest wedding menu');
		document.querySelector('[data-next]').click();
		const duringNext = {
			step: form.dataset.currentStep,
			phase: form.dataset.phase,
			outgoingVisible: getComputedStyle(document.querySelector('[data-step="1"]')).display !== 'none',
			incomingHidden: getComputedStyle(document.querySelector('[data-step="2"]')).display === 'none'
		};
		await waitForStep(2);
		const afterNext = form.dataset.currentStep;
		const nextFocus = document.activeElement?.getAttribute('name');
		document.querySelector('[data-back]').click();
		await waitForStep(1);
		const afterBack = form.dataset.currentStep;
		document.querySelector('[data-next]').click();
		await waitForStep(2);
		set('firstName', 'Maya');
		set('lastName', 'Ortiz');
		set('email', 'maya@example.com');
		form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		await waitForStep(3);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const frame = document.querySelector('[data-booking-frame]');
		return {
			duringNext,
			afterNext,
			nextFocus,
			afterBack,
			afterSubmit: form.dataset.currentStep,
			preparedVisible: getComputedStyle(document.querySelector('[data-step="3"]')).display,
			sendState: form.dataset.sendState,
			bookingFrameSrc: frame?.getAttribute('src') ?? '',
			bookingFrameHeight: Math.round(frame?.getBoundingClientRect().height ?? 0),
			mailtoLinks: document.querySelectorAll('.demo-page a[href^="mailto:"]').length,
			phase: form.dataset.phase
		};
	})()`);
	assert(completedFlow.duringNext.step === '1', 'workflow: outgoing frame was removed before its exit');
	assert(completedFlow.duringNext.phase === 'leaving', `workflow: expected leaving phase, received ${completedFlow.duringNext.phase}`);
	assert(completedFlow.duringNext.outgoingVisible, 'workflow: outgoing frame flashed away immediately');
	assert(completedFlow.duringNext.incomingHidden, 'workflow: incoming frame appeared before the outgoing frame left');
	assert(completedFlow.afterNext === '2', 'workflow: valid kitchen details did not advance');
	assert(completedFlow.nextFocus === 'firstName', `workflow: focus moved to ${completedFlow.nextFocus || 'nothing'} after the contact frame settled`);
	assert(completedFlow.afterBack === '1', 'workflow: Back did not restore the kitchen step');
	assert(completedFlow.afterSubmit === '3', 'workflow: a successful send did not reach the booking step');
	assert(completedFlow.preparedVisible === 'block', 'workflow: the sent-and-booking state is hidden');
	assert(completedFlow.sendState === 'sent', `workflow: send state is ${completedFlow.sendState}`);
	assert(completedFlow.phase === 'idle', `workflow: booking frame did not settle; phase is ${completedFlow.phase}`);
	assert(
		completedFlow.bookingFrameSrc.startsWith('https://calendar.google.com/calendar/appointments/schedules/'),
		`workflow: booking calendar src is ${completedFlow.bookingFrameSrc || 'missing'}`
	);
	// The iframe is lazy and lives in a display:none panel until this moment, so
	// it measures near zero unless it carries its own height. transitionTo()
	// animates the ticket to that measurement, and a zero collapses the step it
	// is meant to open.
	assert(completedFlow.bookingFrameHeight > 400, `workflow: booking calendar collapsed to ${completedFlow.bookingFrameHeight}px`);
	// The whole point of the change. A mailto: here is the old design returning.
	assert(completedFlow.mailtoLinks === 0, `workflow: the demo route still offers ${completedFlow.mailtoLinks} mailto link(s)`);

	// A SEND THAT FAILS MUST NOT LOOK LIKE ONE THAT WORKED. This is the failure
	// the whole change exists to end, so it is verified in a browser and not
	// only in the endpoint's unit checks.
	apiStub.status = 503;
	apiStub.body = { ok: false, message: 'Your request could not be sent. Everything you typed is still here, so please try again.' };
	await navigate();
	const failedSend = await evaluate(`(async () => {
		const form = document.querySelector('[data-demo-form]');
		const set = (name, value) => { form.elements[name].value = value; };
		set('business', 'Garden Table Catering');
		set('role', 'Owner or chef-owner');
		set('kitchen', 'Catering and private events');
		set('locations', '1');
		document.querySelector('[data-next]').click();
		await new Promise((resolve) => setTimeout(resolve, 700));
		set('firstName', 'Maya');
		set('lastName', 'Ortiz');
		set('email', 'maya@example.com');
		const liveRegionDisplay = getComputedStyle(document.querySelector('[data-send-status]')).display;
		form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		await new Promise((resolve) => setTimeout(resolve, 900));
		return {
			step: form.dataset.currentStep,
			sendState: form.dataset.sendState,
			// A live region that is display:none until it has something to say is
			// not in the accessibility tree when it is given something to say.
			// WCAG 4.1.3 is AA, and AA is the floor here.
			statusWasInTheTree: liveRegionDisplay,
			status: document.querySelector('[data-send-status]')?.textContent.trim(),
			draftSurvived: form.elements.email.value,
			buttonEnabled: !document.querySelector('[data-send]').disabled
		};
	})()`);
	assert(failedSend.step === '2', `failed send: advanced to step ${failedSend.step} anyway`);
	assert(failedSend.sendState === 'failed', `failed send: state is ${failedSend.sendState}`);
	assert(/still here/.test(failedSend.status ?? ''), `failed send: visitor was told "${failedSend.status}"`);
	assert(failedSend.statusWasInTheTree !== 'none', 'failed send: the live region was display:none before it was written to, so the message may never be announced');
	assert(failedSend.draftSurvived === 'maya@example.com', 'failed send: the visitor lost what they typed');
	assert(failedSend.buttonEnabled, 'failed send: the send button stayed disabled, so they cannot retry');
	apiStub.status = 200;
	apiStub.body = { ok: true };

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
	const reducedMotion = await evaluate(`(async () => {
		const form = document.querySelector('[data-demo-form]');
		const set = (name, value) => { form.elements[name].value = value; };
		set('business', 'Garden Table Catering');
		set('role', 'Owner or chef-owner');
		set('kitchen', 'Catering and private events');
		set('locations', '1');
		document.querySelector('[data-next]').click();
		await Promise.resolve();
		return {
			step: form.dataset.currentStep,
			phase: form.dataset.phase,
			focus: document.activeElement?.getAttribute('name'),
			pageEntrances: document.querySelectorAll('.demo-page .anim-enter').length
		};
	})()`);
	assert(reducedMotion.step === '2' && reducedMotion.phase === 'idle', 'reduced motion: frame did not settle immediately');
	assert(reducedMotion.focus === 'firstName', `reduced motion: focus moved to ${reducedMotion.focus || 'nothing'}`);
	assert(reducedMotion.pageEntrances === 0, 'reduced motion: demo still carries a competing page entrance');

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({
		heading: document.querySelector('h1')?.textContent.trim(),
		stepOne: getComputedStyle(document.querySelector('[data-step="1"]')).display,
		stepTwo: getComputedStyle(document.querySelector('[data-step="2"]')).display,
		action: document.querySelector('[data-demo-form]').getAttribute('action'),
		method: document.querySelector('[data-demo-form]').getAttribute('method')
	}))()`);
	assert(noScript.heading === 'Put one real job on the screen.', 'no JavaScript: page identity is missing');
	assert(noScript.stepOne !== 'none' && noScript.stepTwo !== 'none', 'no JavaScript: both form steps are not available');
	// This used to assert the action was a mailto:, which is what the form did
	// instead of sending. Without script the form is a plain POST to the same
	// endpoint the scripted path uses, and /api/demo-request answers a browser
	// with a 303 to a real page.
	assert(noScript.action === '/api/demo-request', `no JavaScript: form action is ${noScript.action}`);
	assert(noScript.method?.toLowerCase() === 'post', `no JavaScript: form method is ${noScript.method}`);
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
	console.error(`Demo browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Demo browser verification passed: flash-free transitions, a send that reaches the booking calendar, a failed send that keeps the draft and says so, no mailto exit, focus, responsive layouts, 200% text, reduced motion, and the no-JavaScript POST.');
