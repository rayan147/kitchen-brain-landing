import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/contact`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-contact-'));
const port = 9366;
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
		await writeFile(join(reviewDir, `contact-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	// The whole point of this page is that a stranger can ask a question without
	// leaving the browser. Everything below is that sentence, checked.

	await viewport(1440, 900);
	await navigate();

	const desktop = await evaluate(`(() => {
		const actions = [...document.querySelectorAll('.ask-support a, .ask-support button')]
			.filter((action) => action.getClientRects().length > 0);
		const form = document.querySelector('[data-support-form]');
		return {
			overflow: document.documentElement.scrollWidth - innerWidth,
			minTarget: actions.length ? Math.min(...actions.map((a) => a.getBoundingClientRect().height)) : 0,
			method: form?.getAttribute('method'),
			action: form?.getAttribute('action'),
			hasEmail: Boolean(form?.querySelector('input[name="email"][required]')),
			hasMessage: Boolean(form?.querySelector('textarea[name="message"][required]')),
			trapHidden: (() => {
				const trap = document.querySelector('input[name="company"]');
				if (!trap) return false;
				const box = trap.getBoundingClientRect();
				return box.width <= 1 || box.height <= 1;
			})(),
			dialogPromoted: Boolean(document.querySelector('dialog.ask-dialog')),
			dialogClosedAtRest: document.querySelector('dialog.ask-dialog')?.open === false,
			openButtonVisible: document.querySelector('[data-support-open]')?.hidden === false,
			inlineLinkRemoved: document.querySelector('[data-support-inline-link]') === null
		};
	})()`);

	assert(desktop.overflow === 0, `1440x900: horizontal overflow is ${desktop.overflow}px`);
	assert(desktop.minTarget >= 44, `1440x900: smallest contact action is ${desktop.minTarget}px`);
	// These two are the no-JavaScript contract. If either drifts, a visitor with
	// script blocked loses the only way to ask a question.
	assert(desktop.method === 'post', 'the ask form is not a POST form');
	assert(desktop.action === '/api/support', `the ask form posts to ${desktop.action}`);
	assert(desktop.hasEmail, 'the ask form has no required email field');
	assert(desktop.hasMessage, 'the ask form has no required message field');
	assert(desktop.trapHidden, 'the bot trap is visible to people');
	assert(desktop.dialogPromoted, 'script did not promote the panel to a dialog');
	assert(desktop.dialogClosedAtRest, 'the dialog is open before anyone asked for it');
	assert(desktop.openButtonVisible, 'the button that opens the dialog is hidden');
	assert(desktop.inlineLinkRemoved, 'the no-script jump link survived into the scripted page');

	// Opening the modal must move focus into it, and closing must give it back.
	const focus = await evaluate(`(async () => {
		const open = document.querySelector('[data-support-open]');
		open.focus();
		open.click();
		await new Promise(requestAnimationFrame);
		const dialog = document.querySelector('dialog.ask-dialog');
		const inside = dialog.contains(document.activeElement);
		const focusedId = document.activeElement?.id ?? '';
		document.querySelector('[data-support-cancel]').click();
		await new Promise(requestAnimationFrame);
		return {
			opened: dialog.open === false ? false : true,
			inside,
			focusedId,
			closed: dialog.open === false,
			returnedFocus: document.activeElement === open
		};
	})()`);
	// The dialog is built by script, so Astro's scoped styles do not reach it
	// unless they are written :global. When they did not, it rendered unstyled
	// in the corner, taller than the screen, and every other check still passed.
	const fit = await evaluate(`(async () => {
		document.querySelector('[data-support-open]').click();
		await new Promise(requestAnimationFrame);
		const dialog = document.querySelector('dialog.ask-dialog');
		const box = dialog.getBoundingClientRect();
		const styles = getComputedStyle(dialog);
		const result = {
			withinViewport: box.top >= -1 && box.bottom <= innerHeight + 1,
			centred: Math.abs((box.left + box.right) / 2 - innerWidth / 2) < 2,
			styled: styles.marginTop !== '0px' || styles.marginLeft !== '0px'
		};
		document.querySelector('[data-support-cancel]').click();
		return result;
	})()`);
	assert(fit.withinViewport, 'the open dialog does not fit inside the viewport');
	assert(fit.centred, 'the open dialog is not centred horizontally');
	assert(fit.styled, 'the dialog is unstyled: scoped CSS did not reach a script-created element');

	assert(focus.inside, 'opening the dialog left focus outside it');
	assert(focus.focusedId === 'support-email', `the dialog focused "${focus.focusedId}" instead of the email field`);
	assert(focus.closed, 'cancel did not close the dialog');
	assert(focus.returnedFocus, 'closing the dialog did not return focus to the button that opened it');

	// A refusal has to reach the visitor in words, and the draft has to survive it.
	const refusal = await evaluate(`(async () => {
		document.querySelector('[data-support-open]').click();
		const form = document.querySelector('[data-support-form]');
		form.querySelector('#support-email').value = 'someone@kitchen.com';
		form.querySelector('#support-message').value = 'A real question about costing a wedding.';
		const originalFetch = window.fetch;
		window.fetch = async () => new Response(JSON.stringify({ ok: false, message: 'Nope.' }), {
			status: 503, headers: { 'content-type': 'application/json' }
		});
		form.requestSubmit();
		for (let attempt = 0; attempt < 60; attempt += 1) {
			if (document.querySelector('[data-support-status]')?.textContent.trim()) break;
			await new Promise(requestAnimationFrame);
		}
		window.fetch = originalFetch;
		const status = document.querySelector('[data-support-status]');
		const result = {
			told: status.textContent.trim(),
			tone: status.dataset.tone,
			live: status.getAttribute('aria-live'),
			draftKept: form.querySelector('#support-message').value.length > 0,
			buttonUsable: document.querySelector('[data-support-send]').disabled === false
		};
		document.querySelector('[data-support-cancel]').click();
		return result;
	})()`);
	assert(refusal.told.length > 0, 'a failed send said nothing to the visitor');
	assert(refusal.tone === 'error', `a failed send was toned "${refusal.tone}"`);
	assert(refusal.live === 'polite', 'the send status is not announced to screen readers');
	assert(refusal.draftKept, 'a failed send threw away the visitor\'s draft');
	assert(refusal.buttonUsable, 'a failed send left the send button disabled');

	// A success must clear the draft only once it is somewhere else.
	const success = await evaluate(`(async () => {
		document.querySelector('[data-support-open]').click();
		const form = document.querySelector('[data-support-form]');
		form.querySelector('#support-email').value = 'someone@kitchen.com';
		form.querySelector('#support-message').value = 'A real question about costing a wedding.';
		const originalFetch = window.fetch;
		window.fetch = async () => new Response(JSON.stringify({ ok: true }), {
			status: 200, headers: { 'content-type': 'application/json' }
		});
		form.requestSubmit();
		for (let attempt = 0; attempt < 60; attempt += 1) {
			if (document.querySelector('[data-support-status]')?.dataset.tone === 'sent') break;
			await new Promise(requestAnimationFrame);
		}
		window.fetch = originalFetch;
		const status = document.querySelector('[data-support-status]');
		return {
			told: status.textContent.trim(),
			cleared: form.querySelector('#support-message').value === ''
		};
	})()`);
	assert(/sent/i.test(success.told), `a successful send said "${success.told}"`);
	assert(success.cleared, 'a successful send kept the draft in the box');

	await capture('desktop');

	// Without JavaScript the panel must be on the page and submittable.
	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`1`).catch(() => null);
	const noScriptState = await send('Runtime.evaluate', {
		expression: `(() => {
			const form = document.querySelector('[data-support-form]');
			const panel = document.querySelector('[data-support-panel]');
			return JSON.stringify({
				formPresent: Boolean(form),
				panelVisible: panel ? panel.getClientRects().length > 0 : false,
				notInDialog: form ? form.closest('dialog') === null : false,
				jumpLink: Boolean(document.querySelector('[data-support-inline-link]'))
			});
		})()`,
		returnByValue: true
	}).then((result) => JSON.parse(result.result.value));
	assert(noScriptState.formPresent, 'no-JavaScript: the ask form is not in the HTML');
	assert(noScriptState.panelVisible, 'no-JavaScript: the ask form is hidden');
	assert(noScriptState.notInDialog, 'no-JavaScript: the form is trapped inside a dialog');
	assert(noScriptState.jumpLink, 'no-JavaScript: nothing links to the form');
	await send('Emulation.setScriptExecutionDisabled', { value: false });

	// Phone, and phone at 200% text.
	await viewport(390, 844, true);
	await navigate();
	const phone = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth
	}))()`);
	assert(phone.overflow === 0, `390x844: horizontal overflow is ${phone.overflow}px`);
	await capture('mobile');

	await viewport(320, 844, true);
	await navigate();
	const zoomed = await evaluate(`(() => {
		document.documentElement.style.fontSize = '200%';
		document.querySelector('[data-support-open]')?.click();
		return { overflow: document.documentElement.scrollWidth - innerWidth };
	})()`);
	assert(zoomed.overflow === 0, `320x844 at 200% text: horizontal overflow is ${zoomed.overflow}px`);

	assert(pageErrors.length === 0, `console errors: ${pageErrors.join('; ')}`);
	assert(failedRequests.length === 0, `failed requests: ${failedRequests.join('; ')}`);
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
	console.error('Contact page verification failed:');
	console.error(failures.map((failure) => `- ${failure}`).join('\n'));
	process.exitCode = 1;
} else {
	console.log('Contact page verified: no-JavaScript form, dialog focus and return, refusal keeps the draft, success clears it, touch targets, phone, and 200% text.');
}
