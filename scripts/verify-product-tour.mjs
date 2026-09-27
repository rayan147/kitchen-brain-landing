import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { tourStopCount } from './lib/tour-stops.mjs';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const artifacts = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(artifacts, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-product-tour-'));
const port = 9334;
const browser = spawn('chromium', [
	'--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
	`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
	`${baseUrl}/tour/main`
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
			// Considered Strategy; not used because this is one fixed local-preview
			// exception shared by the browser verifiers, not a swappable failure policy.
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
	const viewport = (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
	const waitForStop = async (stopId) => {
		for (let attempt = 0; attempt < 30; attempt += 1) {
			if (await evaluate(`document.querySelector('[data-tour-scene]:not([hidden])')?.dataset.stopId === ${JSON.stringify(stopId)}`)) return;
			await delay(50);
		}
		throw new Error(`Tour stop did not become active: ${stopId}`);
	};
	const waitForSceneTransitions = () => evaluate(`Promise.allSettled(
		document.getAnimations({ subtree: true })
			.filter((animation) => animation.effect?.pseudoElement?.includes('tour-scene'))
			.map((animation) => animation.finished)
	)`);
	const navigate = async (path = '/tour/main') => {
		const url = `${baseUrl}${path}`;
		const parsedUrl = new URL(url);
		const pathname = parsedUrl.pathname;
		const stopId = parsedUrl.hash.replace('#tour-', '');
		await send('Page.navigate', { url });
		// Same-route hash checks can otherwise observe the previous document before
		// Chromium begins replacing it.
		await delay(200);
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(pathname)} && ${
				stopId
					? `document.querySelector('[data-tour-tab][aria-selected="true"]')?.getAttribute('aria-controls') === ${JSON.stringify(`tour-panel-${stopId}`)}`
					: `document.querySelector('[data-tour-tab][aria-selected="true"]')?.dataset.index === '0'`
			}`)) {
				await delay(150);
				return;
			}
			await delay(100);
		}
		throw new Error(`Page did not settle: ${url}`);
	};
	const capture = async (name) => {
		await evaluate(`document.querySelector('astro-dev-toolbar')?.remove()`);
		const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: true });
		await writeFile(join(artifacts, `${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	// Considered Strategy; not used because each viewport runs the same fixed
	// tour contract; the only variation is device geometry.
	for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]]) {
		await viewport(width, height, width < 760);
		await navigate();
		const layout = await evaluate(`(() => ({
			tabs: document.querySelectorAll('[data-tour-tab]').length,
			scenes: document.querySelectorAll('[data-tour-scene]').length,
			visibleScenes: [...document.querySelectorAll('[data-tour-scene]')].filter((scene) => !scene.hidden).length,
			selected: document.querySelector('[data-tour-tab][aria-selected="true"]')?.dataset.index,
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth,
			minControl: Math.min(...[...document.querySelectorAll('[data-tour-prev], [data-tour-next]')].map((control) => control.getBoundingClientRect().height)),
			tableOverflow: document.querySelector('[data-tour-scene]:not([hidden]) .app-table-wrap')?.scrollWidth - document.querySelector('[data-tour-scene]:not([hidden]) .app-table-wrap')?.clientWidth,
			mobileControlVisible: Boolean(document.querySelector('[data-tour-select]')?.getClientRects().length),
			railVisible: Boolean(document.querySelector('.tour-rail')?.getClientRects().length)
		}))()`);
		assert(layout.tabs === tourStopCount, `${width}: expected ${tourStopCount} tabs, received ${layout.tabs}`);
		assert(layout.scenes === tourStopCount, `${width}: expected ${tourStopCount} scenes, received ${layout.scenes}`);
		assert(layout.visibleScenes === 1, `${width}: expected one visible scene`);
		assert(layout.selected === '0', `${width}: first stop is not selected`);
		assert(layout.scrollWidth === layout.innerWidth, `${width}: horizontal page overflow`);
		assert(layout.minControl >= 44, `${width}: tour controls are below 44px`);
		if (width < 1100) {
			assert(layout.tableOverflow === 0, `${width}: active evidence table still needs horizontal scrolling`);
			assert(layout.mobileControlVisible && !layout.railVisible, `${width}: compact tour navigation did not replace the rail`);
		} else {
			assert(layout.railVisible && !layout.mobileControlVisible, `${width}: desktop tour rail is not visible`);
		}
	}

	await viewport(1440, 900);
	await navigate();
	// THE TABLE IS THE PAGE. Every stop's numbers live in this table, and the
	// wrap scrolls, so a column pushed out of it disappears in silence: the suite
	// passed for months while all twelve stops clipped their last column at every
	// desktop width from 1100px up. Assert the table fits the pane it sits in.
	const desktopStopOverflow = await evaluate(`(async () => {
		const tabs = [...document.querySelectorAll('[data-tour-tab]')];
		const clipped = [];
		for (let index = 0; index < tabs.length; index += 1) {
			tabs[index].click();
			for (let attempt = 0; attempt < 40; attempt += 1) {
				const open = [...document.querySelectorAll('[data-tour-scene]')].find((scene) => !scene.hidden);
				if (open?.dataset.index === String(index)) break;
				await new Promise(requestAnimationFrame);
			}
			const scene = [...document.querySelectorAll('[data-tour-scene]')].find((entry) => !entry.hidden);
			const wrap = scene.querySelector('.app-table-wrap');
			const overflow = Math.round(wrap.querySelector('table').scrollWidth - wrap.clientWidth);
			if (overflow > 0) clipped.push(scene.dataset.stopId + ' +' + overflow + 'px');
		}
		return clipped;
	})()`);
	assert(
		desktopStopOverflow?.length === 0,
		`stops clip their table at 1440px: ${(desktopStopOverflow || []).join(', ')}`
	);
	// That walk ends on the last stop, where there is no forward move left to
	// make. Reload so the motion checks below start from stop 1 as they expect.
	await navigate();
	const sceneMotion = await evaluate(`(async () => {
		const nativeStartViewTransition = document.startViewTransition?.bind(document);
		if (!nativeStartViewTransition) return { supported: false };
		let transition;
		document.startViewTransition = (update) => {
			transition = nativeStartViewTransition(update);
			return transition;
		};
		document.querySelectorAll('[data-tour-tab]')[5].click();
		await transition.ready;
		const result = {
			supported: true,
			direction: document.documentElement.dataset.tourDirection,
			oldAnimation: getComputedStyle(document.documentElement, '::view-transition-old(tour-scene)').animationName,
			newAnimation: getComputedStyle(document.documentElement, '::view-transition-new(tour-scene)').animationName
		};
		await transition.finished;
		return result;
	})()`);
	assert(sceneMotion.supported, 'Chromium did not expose same-document view transitions');
	assert(sceneMotion.direction === 'forward', 'forward tour selection did not expose its motion direction');
	assert(sceneMotion.oldAnimation?.includes('tour-scene-out-forward'), 'outgoing tour scene has no authored forward transition');
	assert(sceneMotion.newAnimation?.includes('tour-scene-in-forward'), 'incoming tour scene has no authored forward transition');
	await waitForStop('labels-printing');
	const labelsStop = await evaluate(`(() => ({
		visibleId: document.querySelector('[data-tour-scene]:not([hidden])')?.dataset.stopId,
		text: document.querySelector('[data-tour-scene]:not([hidden])')?.textContent
	}))()`);
	assert(labelsStop.visibleId === 'labels-printing', 'Labels and printing scene did not become visible');
	assert(labelsStop.text?.includes('Coming'), 'Labels and printing scene does not expose its Coming status');
	await evaluate(`[...document.querySelectorAll('[data-tour-tab]')].at(-1).click()`);
	await waitForStop('sage');
	await waitForSceneTransitions();
	const finalStop = await evaluate(`(() => ({
		selected: document.querySelector('[data-tour-tab][aria-selected="true"]')?.dataset.index,
		visibleId: document.querySelector('[data-tour-scene]:not([hidden])')?.dataset.stopId,
		next: document.querySelector('[data-tour-next]')?.textContent.trim(),
		hash: location.hash
	}))()`);
	assert(finalStop.selected === '11', 'last tab did not become selected');
	assert(finalStop.visibleId === 'sage', 'Sage scene did not become visible');
	assert(finalStop.next === 'Finish the tour', 'last action does not finish the tour');
	assert(finalStop.hash === '#tour-sage', 'last stop hash was not written');
	await capture('product-tour-desktop');

	await send('Page.navigate', { url: 'about:blank' });
	await delay(100);
	await navigate('/tour/main#tour-inventory');
	const directStop = await evaluate(`(() => ({
		id: document.querySelector('[data-tour-scene]:not([hidden])')?.dataset.stopId,
		workspaceTop: document.querySelector('[data-tour]')?.getBoundingClientRect().top,
		workspaceBottom: document.querySelector('[data-tour]')?.getBoundingClientRect().bottom,
		viewportHeight: innerHeight
	}))()`);
	assert(directStop.id === 'inventory', 'direct inventory hash did not select the inventory stop');
	assert(
		directStop.workspaceTop >= 0 && directStop.workspaceTop <= 32 && directStop.workspaceBottom > directStop.viewportHeight,
		`direct inventory hash did not align the tour workspace with the viewport: ${JSON.stringify(directStop)}`
	);

	await viewport(390, 844, true);
	await navigate();
	await evaluate(`(() => {
		const select = document.querySelector('[data-tour-select]');
		select.value = '4';
		select.dispatchEvent(new Event('change', { bubbles: true }));
	})()`);
	await waitForStop('nutrition-allergens');
	await waitForSceneTransitions();
	const mobileStop = await evaluate(`(() => ({
		selected: document.querySelector('[data-tour-tab][aria-selected="true"]')?.dataset.index,
		visibleId: document.querySelector('[data-tour-scene]:not([hidden])')?.dataset.stopId,
		select: document.querySelector('[data-tour-select]')?.value,
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth
	}))()`);
	assert(mobileStop.selected === '4' && mobileStop.select === '4', 'mobile select did not stay synchronized');
	assert(mobileStop.visibleId === 'nutrition-allergens', 'mobile select did not open nutrition and allergens');
	assert(mobileStop.scrollWidth === mobileStop.innerWidth, 'mobile selection introduced page overflow');
	const mobileEvidence = await evaluate(`(() => {
		const table = document.querySelector('[data-tour-scene]:not([hidden]) .app-table-wrap');
		return {
			overflow: table.scrollWidth - table.clientWidth,
			labelledCells: table.querySelectorAll('td[data-label]').length,
			cells: table.querySelectorAll('td').length
		};
	})()`);
	assert(mobileEvidence.overflow === 0, 'mobile evidence table still needs horizontal scrolling');
	assert(mobileEvidence.labelledCells === mobileEvidence.cells, 'mobile evidence cells are missing visible labels');
	await capture('product-tour-mobile');

	await viewport(1440, 900);
	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await navigate();
	const reducedSceneMotion = await evaluate(`(async () => {
		document.querySelectorAll('[data-tour-tab]')[1].click();
		const transition = document.getAnimations({ subtree: true }).find((animation) => animation.effect?.pseudoElement?.includes('tour-scene'));
		await new Promise(requestAnimationFrame);
		const animationName = getComputedStyle(document.documentElement, '::view-transition-new(tour-scene)').animationName;
		await Promise.allSettled(document.getAnimations({ subtree: true }).map((animation) => animation.finished));
		return animationName;
	})()`);
	assert(reducedSceneMotion?.includes('tour-scene-fade-in'), 'reduced-motion stop change still uses spatial movement');
	await waitForStop('menus-quotes');
	const finishScrollBehavior = await evaluate(`(async () => {
		[...document.querySelectorAll('[data-tour-tab]')].at(-1).click();
		for (let attempt = 0; attempt < 30; attempt += 1) {
			if (document.querySelector('[data-tour-scene]:not([hidden])')?.dataset.stopId === 'sage') break;
			await new Promise(requestAnimationFrame);
		}
		const heading = document.querySelector('#tour-close-heading');
		heading.scrollIntoView = (options) => { window.__tourFinishBehavior = options.behavior; };
		document.querySelector('[data-tour-next]').click();
		return window.__tourFinishBehavior;
	})()`);
	assert(finishScrollBehavior === 'auto', 'reduced-motion tour finish still uses smooth scrolling');
	await send('Emulation.setEmulatedMedia', { features: [] });

	await viewport(320, 844, true);
	await navigate();
	const zoom = await evaluate(`(() => {
		document.documentElement.style.fontSize = '200%';
		return { scrollWidth: document.documentElement.scrollWidth, innerWidth };
	})()`);
	assert(zoom.scrollWidth === zoom.innerWidth, '200% text at 320px causes page overflow');

	assert(pageErrors.length === 0, `console errors: ${pageErrors.join('; ')}`);
	assert(failedRequests.length === 0, `failed requests: ${failedRequests.join('; ')}`);
} finally {
	socket?.close();
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
	console.error(failures.map((failure) => `- ${failure}`).join('\n'));
	process.exitCode = 1;
} else {
	console.log('Product tour verified at five viewports, direct links, all stops, mobile selection, and 200% text.');
}
