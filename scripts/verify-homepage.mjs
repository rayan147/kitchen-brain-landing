import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { homepageStopIds } from './lib/homepage-stops.mjs';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/`;
const previewHost = new URL(baseUrl).hostname;
const localPreview = previewHost === '127.0.0.1' || previewHost === 'localhost';
const localAnalyticsUrl = new URL('/_vercel/insights/script.js', baseUrl).href;
// Considered Strategy; not used because this is one exact local-preview
// exception, not a family of interchangeable request-classification rules.
const isExpectedLocalAnalytics404 = (response) =>
	localPreview && response.status === 404 && response.url === localAnalyticsUrl;
const profile = await mkdtemp(join(tmpdir(), 'costcook-homepage-'));
const port = 10000 + (process.pid % 40000);
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
		if (message.method === 'Network.responseReceived') {
			const { response } = message.params;
			if (response.status >= 400 && !isExpectedLocalAnalytics404(response)) {
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
	const viewport = (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', {
		width, height, deviceScaleFactor: 1, mobile
	});
	const navigate = async () => {
		await send('Page.navigate', { url: route });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(route)}`)) break;
			await delay(100);
		}
		await evaluate(`document.fonts.ready.then(() => {
			document.querySelectorAll('[data-reveal]').forEach((element) => {
				element.classList.remove('reveal-pending');
				element.classList.add('revealed');
			});
			document.getAnimations().forEach((animation) => animation.finish());
		})`);
		await delay(50);
	};
	const capture = async (name, fullPage = true) => {
		await evaluate(`new Promise((resolve) => {
			document.documentElement.style.scrollBehavior = 'auto';
			scrollTo(0, 0);
			requestAnimationFrame(() => requestAnimationFrame(resolve));
		})`);
		const viewportShot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
		await writeFile(join(tmpdir(), `costcook-homepage-${name}-fold.png`), Buffer.from(viewportShot.data, 'base64'));
		if (fullPage) {
			const metrics = await send('Page.getLayoutMetrics');
			const { width, height } = metrics.cssContentSize;
			const shot = await send('Page.captureScreenshot', {
				format: 'png', fromSurface: true, captureBeyondViewport: true,
				clip: { x: 0, y: 0, width, height, scale: 1 }
			});
			await writeFile(join(tmpdir(), `costcook-homepage-${name}.png`), Buffer.from(shot.data, 'base64'));
		}
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	// Considered Strategy; not used because viewport adaptation is declarative
	// layout with one content order, not interchangeable runtime behavior.
	for (const [width, height, mobile] of [[1440, 900, false], [1024, 768, false], [768, 1024, true], [844, 390, true], [390, 844, true], [320, 844, true]]) {
		await viewport(width, height, mobile);
		await navigate();
		const state = await evaluate(`(() => {
			const visibleActions = [...document.querySelectorAll('a, button, summary')].filter((element) => {
				const style = getComputedStyle(element);
				const rect = element.getBoundingClientRect();
				return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 4 && rect.height > 4;
			});
			const heroFigure = document.querySelector('main > section:first-child figure');
			return {
				overflow: document.documentElement.scrollWidth - innerWidth,
				minTarget: Math.min(...visibleActions.map((action) => action.getBoundingClientRect().height)),
				headerHeight: document.querySelector('header').getBoundingClientRect().height,
				heroProofTop: heroFigure.getBoundingClientRect().top,
				hasPrimary: Boolean(document.querySelector('main > section:first-child .btn-primary')),
				hasViewportFit: document.querySelector('meta[name="viewport"]')?.content.includes('viewport-fit=cover')
			};
		})()`);
		assert(state.overflow === 0, `${width}x${height}: horizontal overflow is ${state.overflow}px`);
		assert(state.minTarget >= 44, `${width}x${height}: smallest visible action is ${state.minTarget}px`);
		assert(state.headerHeight < 150, `${width}x${height}: shared header is ${state.headerHeight}px tall`);
		assert(state.hasPrimary, `${width}x${height}: hero primary action is missing`);
		if (width <= 390) assert(state.heroProofTop < height, `${width}x${height}: product proof begins below the first viewport at ${state.heroProofTop}px`);
		assert(state.hasViewportFit, `${width}x${height}: viewport-fit=cover is missing`);
		if (width === 390) await capture('mobile');
		if (width === 320) await capture('narrow', false);
	}

	// The Features panel is offered from 640px; below that it lives in Menu
	// (one-row phone header, 2026-10-07).
	await viewport(640, 844, true);
	await navigate();
	const menu = await evaluate(`(() => {
		const details = document.querySelector('[data-features-menu]');
		details.open = true;
		const panel = details.querySelector('summary + div');
		const rect = panel.getBoundingClientRect();
		const pageTop = scrollY;
		panel.scrollTop = panel.scrollHeight;
		const links = panel.querySelectorAll('a');
		const last = links[links.length - 1].getBoundingClientRect();
		return {
			bottom: rect.bottom,
			clientHeight: panel.clientHeight,
			scrollHeight: panel.scrollHeight,
			pageStayedPut: scrollY === pageTop,
			lastVisible: last.top >= rect.top && last.bottom <= rect.bottom
		};
	})()`);
	assert(menu.bottom <= 844, `mobile menu: panel bottom is ${menu.bottom}px below the viewport`);
	assert(menu.scrollHeight > menu.clientHeight, 'mobile menu: long destinations are not contained in a scroll region');
	assert(menu.pageStayedPut, 'mobile menu: reaching the final destination scrolls the page');
	assert(menu.lastVisible, 'mobile menu: final destination cannot be brought into the panel viewport');
	await evaluate(`document.querySelector('[data-features-menu] > div').scrollTop = 0`);
	const menuShot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
	await writeFile(join(tmpdir(), 'costcook-homepage-mobile-menu.png'), Buffer.from(menuShot.data, 'base64'));

	await navigate();
	const sticky = await evaluate(`(() => new Promise((resolve) => {
		// Partway into the rail (its second stage), not after it: the bar must
		// carry the primary through the event walk, where the page has none.
		const stage = document.querySelectorAll('#event-walk [data-rail-stage]')[1];
		document.documentElement.style.scrollBehavior = 'auto';
		scrollTo(0, stage.getBoundingClientRect().top + scrollY);
		requestAnimationFrame(() => requestAnimationFrame(() => {
			const bar = document.querySelector('[data-sticky-cta]');
			const action = bar.querySelector('a');
			resolve({ hidden: bar.hidden, actionHeight: action.getBoundingClientRect().height });
		}));
	}))()`);
	assert(!sticky.hidden, 'mobile sticky action does not appear inside the event walk');
	assert(sticky.actionHeight >= 44, `mobile sticky action is ${sticky.actionHeight}px tall`);

	await viewport(320, 844, true);
	await navigate();
	const zoom = await evaluate(`(() => new Promise((resolve) => {
		document.querySelector('[data-features-menu]').open = false;
		document.documentElement.style.fontSize = '200%';
		requestAnimationFrame(() => {
			const escaped = [...document.body.querySelectorAll('*')].filter((element) => {
				if (element.closest('details:not([open])')) return false;
				const rect = element.getBoundingClientRect();
				return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
			});
			resolve({
				overflow: document.documentElement.scrollWidth - innerWidth,
				escaped: escaped.map((element) => element.tagName.toLowerCase() + '.' + (element.className || ''))
			});
		});
	}))()`);
	assert(zoom.overflow === 0, `320px at 200% text: horizontal overflow is ${zoom.overflow}px`);
	assert(zoom.escaped.length === 0, `320px at 200% text: escaped elements: ${zoom.escaped.join(', ')}`);

	// 390 AT 200% TEXT, ADDED 2026-09-05. 320 was the only width this check ran
	// at, and 390 is the modal phone for the reader this site is written for: a
	// caterer on a handset mid-shift. The two are not the same test. Several
	// sections change grid between them, so a layout can hold at 320 and break
	// at 390 with nothing in the build able to see it.
	//
	// MEASURE AGAINST innerWidth, NEVER documentElement.clientWidth. Under CDP
	// device emulation Chromium reports innerWidth larger than clientWidth (411
	// against 390 here), so a clientWidth reference reports a constant ~21px of
	// phantom overflow on every page and stays constant against a baseline,
	// which makes it look exactly like a real pre-existing defect. It cost a
	// wrong bug report on 2026-09-05.
	await viewport(390, 844, true);
	await navigate();
	const zoom390 = await evaluate(`(() => new Promise((resolve) => {
		document.querySelector('[data-features-menu]').open = false;
		document.documentElement.style.fontSize = '200%';
		requestAnimationFrame(() => {
			const escaped = [...document.body.querySelectorAll('*')].filter((element) => {
				if (element.closest('details:not([open])')) return false;
				const rect = element.getBoundingClientRect();
				return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
			});
			resolve({
				overflow: document.documentElement.scrollWidth - innerWidth,
				escaped: escaped.map((element) => element.tagName.toLowerCase() + '.' + (element.className || ''))
			});
		});
	}))()`);
	assert(zoom390.overflow === 0, `390px at 200% text: horizontal overflow is ${zoom390.overflow}px`);
	assert(zoom390.escaped.length === 0, `390px at 200% text: escaped elements: ${zoom390.escaped.join(', ')}`);

	// The hero film starts from a tap anywhere on the poster, not only from
	// its corner button (owner, 2026-10-07: "the video is not playable").
	await viewport(1440, 900, false);
	await navigate();
	const film = await evaluate(`(() => { const r = document.querySelector('[data-hero-media] video').getBoundingClientRect(); return { x: r.x + r.width * 0.3, y: r.y + r.height * 0.3, controls: document.querySelector('[data-hero-media] video').controls }; })()`);
	assert(film.controls === false, 'hero film: with JS the native bar should wait behind the play button');
	for (const type of ['mousePressed', 'mouseReleased']) {
		await send('Input.dispatchMouseEvent', { type, x: film.x, y: film.y, button: 'left', clickCount: 1 });
	}
	const started = await evaluate(`(() => { const v = document.querySelector('[data-hero-media] video'); return { controls: v.controls, button: document.querySelector('[data-hero-play]').hidden }; })()`);
	assert(started.controls && started.button, 'hero film: a click on the poster did not start the film');

	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(390, 844, true);
	await navigate();
	const reduced = await evaluate(`getComputedStyle(document.querySelector('.anim-enter')).animationName`);
	assert(reduced === 'none', `reduced motion: hero animation is ${reduced}`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({
		heading: document.querySelector('h1')?.textContent.trim(),
		primary: Boolean(document.querySelector('main .btn-primary')),
		sections: [...document.querySelectorAll('main > section')].map(section => section.id).filter(Boolean)
	}))()`);
	assert(noScript.heading?.startsWith('Know what the job makes before you cook it.'), 'no JavaScript: homepage identity is missing');
	assert(noScript.primary, 'no JavaScript: primary action is missing');
	assert(await evaluate(`document.querySelector('[data-hero-media] video').controls`), 'no JavaScript: the hero film must keep its native controls');
	// Assert visitor destinations rather than an obsolete minimum section count.
	// The one explicit stop order, shared with check-landing-claims and check-dist.
	assert(noScript.sections.join(',') === homepageStopIds.join(','), `no JavaScript: homepage sections read [${noScript.sections.join(', ')}]; expected [${homepageStopIds.join(', ')}]`);

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
	console.error(`Homepage browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Homepage browser verification passed: six viewports, phone-first fold, touch targets, contained mobile navigation, sticky action, 200% text at 320 and 390, reduced motion, a hero film that starts from the poster, and no JavaScript.');
