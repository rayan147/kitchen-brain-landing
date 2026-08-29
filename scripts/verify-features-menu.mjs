import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4322';
const artifacts = new URL('../artifacts/features-menu', import.meta.url).pathname;
await mkdir(artifacts, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-features-menu-'));
const port = 9333;
const browser = spawn(
	'chromium',
	[
		'--headless',
		'--no-sandbox',
		'--disable-gpu',
		'--hide-scrollbars',
		`--remote-debugging-port=${port}`,
		`--user-data-dir=${profile}`,
		`${baseUrl}/`
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
		if (message.method === 'Runtime.exceptionThrown') {
			pageErrors.push(message.params.exceptionDetails.text);
		}
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
	const navigate = async (url) => {
		await send('Page.navigate', { url });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			const settled = await evaluate(`document.readyState === "complete" && location.href === ${JSON.stringify(url)}`);
			if (settled) {
				// Anchor scrolling and late font layout happen after the load state.
				await delay(100);
				return;
			}
			await delay(100);
		}
		throw new Error(`Page did not settle: ${url}`);
	};
	const viewport = async (width, height, mobile = false) => {
		await send('Emulation.setDeviceMetricsOverride', {
			width,
			height,
			deviceScaleFactor: 1,
			mobile
		});
	};
	const capture = async (name) => {
		const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
		await writeFile(join(artifacts, `${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	await viewport(1440, 900);
	await navigate(`${baseUrl}/`);
	const desktop = await evaluate(`(() => {
		const details = document.querySelector('[data-features-menu]');
		details.open = true;
		const panel = details.querySelector('summary + div');
		const sections = [...panel.querySelectorAll(':scope > div:first-child > section')];
		const links = [...panel.querySelectorAll('a')];
		const rect = panel.getBoundingClientRect();
		return {
			linkCount: links.length,
			minTarget: Math.min(...links.map((link) => link.getBoundingClientRect().height)),
			left: rect.left,
			right: rect.right,
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth,
			sectionTops: sections.map((section) => section.getBoundingClientRect().top),
			sectionLefts: sections.map((section) => section.getBoundingClientRect().left)
		};
	})()`);
	assert(desktop.linkCount === 9, `desktop: expected 9 links, received ${desktop.linkCount}`);
	assert(desktop.minTarget >= 44, `desktop: smallest link target is ${desktop.minTarget}px`);
	assert(desktop.left >= 0 && desktop.right <= desktop.innerWidth, 'desktop: panel leaves the viewport');
	assert(desktop.scrollWidth === desktop.innerWidth, 'desktop: horizontal overflow');
	assert(desktop.sectionTops[0] === desktop.sectionTops[1], 'desktop: menu groups are not aligned');
	assert(desktop.sectionLefts[0] < desktop.sectionLefts[1], 'desktop: menu groups did not form two columns');
	await capture('desktop-open');

	for (const [width, height] of [[1280, 800], [1024, 768], [768, 1024]]) {
		await viewport(width, height);
		await navigate(`${baseUrl}/`);
		const responsive = await evaluate(`(() => {
			const details = document.querySelector('[data-features-menu]');
			details.open = true;
			const panel = details.querySelector('summary + div');
			const sections = [...panel.querySelectorAll(':scope > div:first-child > section')];
			const rect = panel.getBoundingClientRect();
			return {
				left: rect.left,
				right: rect.right,
				scrollWidth: document.documentElement.scrollWidth,
				innerWidth,
				sectionTops: sections.map((section) => section.getBoundingClientRect().top),
				sectionLefts: sections.map((section) => section.getBoundingClientRect().left)
			};
		})()`);
		assert(responsive.left >= 0 && responsive.right <= responsive.innerWidth, `${width}x${height}: panel leaves the viewport`);
		assert(responsive.scrollWidth === responsive.innerWidth, `${width}x${height}: horizontal overflow`);
		assert(responsive.sectionTops[0] === responsive.sectionTops[1], `${width}x${height}: menu groups are not aligned`);
		assert(responsive.sectionLefts[0] < responsive.sectionLefts[1], `${width}x${height}: menu groups did not form two columns`);
	}

	await evaluate(`(() => {
		const details = document.querySelector('[data-features-menu]');
		details.open = true;
		details.querySelector('summary').focus();
	})()`);
	await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
	await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
	const escapeState = await evaluate(`(() => {
		const details = document.querySelector('[data-features-menu]');
		return { open: details.open, triggerFocused: document.activeElement === details.querySelector('summary') };
	})()`);
	assert(!escapeState.open, 'keyboard: Escape did not close the menu');
	assert(escapeState.triggerFocused, 'keyboard: Escape did not return focus to the trigger');

	await evaluate(`(() => {
		const details = document.querySelector('[data-features-menu]');
		details.open = true;
		const links = details.querySelectorAll('a');
		links[links.length - 1].focus();
	})()`);
	await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab' });
	await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
	const focusOutState = await evaluate(`!document.querySelector('[data-features-menu]').open`);
	assert(focusOutState, 'keyboard: tabbing out of the menu did not close it');

	await navigate(`${baseUrl}/features#features-purchasing`);
	for (let attempt = 0; attempt < 20; attempt += 1) {
		const targetTop = await evaluate(`document.querySelector('#features-purchasing').getBoundingClientRect().top`);
		if (targetTop >= 0 && targetTop < 200) break;
		await delay(100);
	}
	const deepLink = await evaluate(`(() => {
		const target = document.querySelector('#features-purchasing');
		const rect = target.getBoundingClientRect();
		return { hash: location.hash, top: rect.top, title: target.querySelector('h2').textContent.trim() };
	})()`);
	assert(deepLink.hash === '#features-purchasing', 'deep link: hash was not preserved');
	assert(deepLink.top >= 0 && deepLink.top < 200, `deep link: target landed at ${deepLink.top}px`);
	assert(deepLink.title.length > 0, 'deep link: target section has no visible heading');

	await viewport(390, 844, true);
	await navigate(`${baseUrl}/`);
	const mobile = await evaluate(`(() => {
		const details = document.querySelector('[data-features-menu]');
		details.open = true;
		const panel = details.querySelector('summary + div');
		const sections = [...panel.querySelectorAll(':scope > div:first-child > section')];
		const rect = panel.getBoundingClientRect();
		return {
			left: rect.left,
			right: rect.right,
			bottom: rect.bottom,
			scrollWidth: document.documentElement.scrollWidth,
			scrollHeight: document.documentElement.scrollHeight,
			innerWidth,
			sectionTops: sections.map((section) => section.getBoundingClientRect().top)
		};
	})()`);
	assert(mobile.left >= 0 && mobile.right <= mobile.innerWidth, 'mobile: panel leaves the viewport');
	assert(mobile.scrollWidth === mobile.innerWidth, 'mobile: horizontal overflow');
	assert(mobile.scrollHeight >= mobile.bottom, 'mobile: document cannot scroll to the end of the panel');
	assert(mobile.sectionTops[1] > mobile.sectionTops[0], 'mobile: menu groups did not stack');
	await capture('mobile-open');
	const finalItemVisible = await evaluate(`(() => {
		document.documentElement.style.scrollBehavior = 'auto';
		const links = document.querySelectorAll('[data-features-menu] a');
		links[links.length - 1].scrollIntoView({ block: 'center' });
		const rect = links[links.length - 1].getBoundingClientRect();
		return rect.top >= 0 && rect.bottom <= innerHeight;
	})()`);
	assert(finalItemVisible, 'mobile: the final menu action cannot be scrolled into view');

	await viewport(320, 844, true);
	await navigate(`${baseUrl}/`);
	const reflow = await evaluate(`(() => {
		document.documentElement.style.fontSize = '200%';
		const details = document.querySelector('[data-features-menu]');
		details.open = true;
		return { scrollWidth: document.documentElement.scrollWidth, innerWidth };
	})()`);
	assert(reflow.scrollWidth === reflow.innerWidth, '200% text at 320px: horizontal overflow');

	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(390, 844, true);
	await navigate(`${baseUrl}/`);
	const reducedMotion = await evaluate(`getComputedStyle(document.querySelector('[data-features-menu] summary svg')).transitionDuration`);
	assert(reducedMotion === '0s', `reduced motion: chevron transition is ${reducedMotion}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate(`${baseUrl}/`);
	const triggerBox = await evaluate(`(() => {
		const rect = document.querySelector('[data-features-menu] summary').getBoundingClientRect();
		return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
	})()`);
	await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: triggerBox.x, y: triggerBox.y, button: 'left', clickCount: 1 });
	await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: triggerBox.x, y: triggerBox.y, button: 'left', clickCount: 1 });
	const noScriptOpen = await evaluate(`document.querySelector('[data-features-menu]').open`);
	assert(noScriptOpen, 'no JavaScript: native disclosure did not open');
	const noScriptLinkBox = await evaluate(`(() => {
		const rect = document.querySelector('[data-features-menu] a').getBoundingClientRect();
		return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
	})()`);
	await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: noScriptLinkBox.x, y: noScriptLinkBox.y, button: 'left', clickCount: 1 });
	await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: noScriptLinkBox.x, y: noScriptLinkBox.y, button: 'left', clickCount: 1 });
	for (let attempt = 0; attempt < 30; attempt += 1) {
		if (await evaluate(`location.href === ${JSON.stringify(`${baseUrl}/features#features-math`)}`)) break;
		await delay(100);
	}
	const noScriptDestination = await evaluate('location.href');
	assert(noScriptDestination === `${baseUrl}/features#features-math`, 'no JavaScript: destination link did not navigate');

	assert(pageErrors.length === 0, `browser: ${pageErrors.length} page exception(s): ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `browser: failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	await rm(profile, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(`Features menu browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Features menu browser verification passed: desktop, keyboard, deep link, mobile, reflow, reduced motion, and no-JavaScript.');
