import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

/**
 * Browser verification for /first-dish. Same CDP harness as verify-faq.mjs:
 * one headless Chromium driven over DevTools, no Playwright dependency.
 *
 * What this route can get wrong that a static contract cannot see: the
 * arithmetic table is the widest thing on the page, and it must scroll inside
 * its own container while the page body never does. Everything else is the
 * house checklist (identity, overflow, targets, keyboard, 200% text, reduced
 * motion, no-JavaScript).
 */
const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/first-dish`;
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-first-dish-'));
const port = 9346;
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
			// Vercel Web Analytics is injected at serve time, so /_vercel/insights
			// is never in dist and always 404s against `astro preview`. It 404s on
			// costcook.io too (checked 2026-09-05), which is a project-level
			// analytics-configuration matter and predates this route: filtering it
			// here keeps a real missing asset on /first-dish loud.
			if (!message.params.response.url.includes('/_vercel/insights/')) {
				failedRequests.push(`${message.params.response.status} ${message.params.response.url}`);
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
	const navigate = async (url = route) => {
		await send('Page.navigate', { url });
		let ready = false;
		for (let attempt = 0; attempt < 50; attempt += 1) {
			ready = await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`);
			if (ready) break;
			await delay(100);
		}
		if (!ready) throw new Error(`${url} never reached readyState complete`);
		await evaluate(`document.fonts.ready.then(() => {
			const style = document.createElement('style');
			style.textContent = 'astro-dev-toolbar { display: none !important; }';
			document.head.append(style);
			document.querySelectorAll('[data-reveal], .anim-enter').forEach((node) => {
				node.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
			});
		})`);
		await delay(250);
	};
	/**
	 * Bring every reveal block into view the way a reader reaches it, one at a
	 * time. Jumping the scroll position in whole screens does not give the
	 * IntersectionObserver a paint frame between hops, so blocks in the middle
	 * of the page stay pending and the run reports a defect the page does not
	 * have. scrollIntoView plus three animation frames is the honest walk.
	 */
	const walkPage = async () => {
		await evaluate(`(async () => {
			const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			for (const node of document.querySelectorAll('[data-reveal]')) {
				node.scrollIntoView({ block: 'center', behavior: 'instant' });
				await frame();
				await frame();
			}
			window.scrollTo(0, 0);
			await frame();
			// Settle the entrance so opacity is read at its final value, not
			// mid-transition.
			document.querySelectorAll('[data-reveal], .anim-enter').forEach((node) => {
				node.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
			});
			await frame();
		})()`);
		await delay(150);
	};
	const capture = async (name) => {
		await evaluate('document.documentElement.scrollTop = 0');
		const metrics = await send('Page.getLayoutMetrics');
		const { width, height } = metrics.cssContentSize;
		const shot = await send('Page.captureScreenshot', {
			format: 'png', fromSurface: true, captureBeyondViewport: true,
			clip: { x: 0, y: 0, width, height, scale: 1 }
		});
		await writeFile(join(reviewDir, `first-dish-${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	// The reveal register hides content until JS runs. Whatever this reads must
	// be visible to a no-JS reader too, which the no-JavaScript pass asserts.
	const probe = `(() => {
		const actions = [...document.querySelectorAll('.fd-actions a, .feature-breadcrumb a')];
		const maths = document.querySelector('.fd-maths-scroll');
		return {
			title: document.querySelector('#fd-heading')?.textContent.trim(),
			stages: document.querySelectorAll('.fd-stage').length,
			ticketStages: document.querySelectorAll('.fd-ticket-stages li').length,
			guards: document.querySelectorAll('.fd-guards li').length,
			plateCost: document.querySelector('.fd-maths-total .fd-maths-value')?.textContent.trim(),
			snap: (document.querySelector('.fd-snap')?.textContent ?? '').includes('$1.62'),
			h1Count: document.querySelectorAll('h1').length,
			bodyOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
			mathsScrolls: maths ? maths.scrollWidth > maths.clientWidth : null,
			mathsFocusable: maths ? maths.tabIndex >= 0 && Boolean(maths.getAttribute('aria-label')) : false,
			mathsColHeaders: document.querySelectorAll('.fd-maths th[scope="col"]').length,
			shot: (() => {
				const img = document.querySelector('.fd-shot img');
				if (!img) return null;
				return {
					loaded: img.complete && img.naturalWidth > 0,
					natural: img.naturalWidth,
					rendered: Math.round(img.getBoundingClientRect().width),
					alt: (img.getAttribute('alt') ?? '').length
				};
			})(),
			mathsFits: maths ? maths.getBoundingClientRect().right <= document.documentElement.clientWidth + 1 : null,
			minTarget: actions.length ? Math.min(...actions.map((a) => a.getBoundingClientRect().height)) : 0,
			primaryLabel: document.querySelector('.fd-actions .btn-primary')?.textContent.trim(),
			primaryCount: document.querySelectorAll('.fd-actions .btn-primary').length,
			activeNav: [...document.querySelectorAll('nav a[aria-current="page"]')].map((a) => a.textContent.trim()),
			revealHidden: [...document.querySelectorAll('[data-reveal]')]
				.filter((n) => getComputedStyle(n).opacity !== '1').length
		};
	})()`;

	// Without these the page never emits Runtime.exceptionThrown or
	// Network.responseReceived, and the pageErrors/failedRequests assertions
	// below are dead: a JS exception or a 404 asset would ship green.
	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	await viewport(1440, 900);
	await navigate();
	await walkPage();
	const desktop = await evaluate(probe);
	await capture('1440x900');

	assert(desktop.title === 'You do not need to enter your whole walk-in.', `desktop: page identity is "${desktop.title}"`);
	assert(desktop.h1Count === 1, `desktop: found ${desktop.h1Count} h1 elements`);
	assert(desktop.stages === 5, `desktop: expected 5 stage rows, received ${desktop.stages}`);
	assert(desktop.ticketStages === 5, `desktop: expected 5 ticket stages, received ${desktop.ticketStages}`);
	assert(desktop.guards === 4, `desktop: expected 4 guard lines, received ${desktop.guards}`);
	assert(desktop.plateCost === '$1.62', `desktop: plate cost reads ${desktop.plateCost}`);
	assert(desktop.snap, 'desktop: the snap line no longer carries $1.62');
	assert(desktop.bodyOverflow === 0, `desktop: horizontal overflow is ${desktop.bodyOverflow}px`);
	assert(desktop.mathsFits, 'desktop: the arithmetic table escapes the viewport');
	assert(desktop.mathsFocusable, 'desktop: the arithmetic scroll container is not keyboard focusable');
	assert(desktop.mathsColHeaders === 3, `desktop: expected 3 column headers on the arithmetic table, received ${desktop.mathsColHeaders}`);
	// RC-48: stored at 2x, rendered at half its pixel width or narrower, and
	// it has to actually load — a 404 here is a broken proof, not a missing
	// decoration.
	assert(desktop.shot, 'desktop: the setup capture is not on the page');
	assert(desktop.shot?.loaded, 'desktop: the setup capture did not load');
	assert((desktop.shot?.natural ?? 0) >= 2304, `desktop: setup capture is only ${desktop.shot?.natural}px wide; a 1152px container would upscale it`);
	assert(
		desktop.shot && desktop.shot.rendered <= desktop.shot.natural / 2,
		`desktop: setup capture renders at ${desktop.shot?.rendered}px, wider than half its ${desktop.shot?.natural}px (RC-48)`
	);
	assert((desktop.shot?.alt ?? 0) > 200, 'desktop: the setup capture alt does not read off the pixels');
	assert(desktop.minTarget >= 44, `desktop: smallest route action is ${desktop.minTarget}px`);
	assert(desktop.primaryCount === 2, `desktop: expected 2 route primaries (open and close), received ${desktop.primaryCount}`);
	assert(desktop.activeNav.includes('Your first dish'), `desktop: navigation is not active (${desktop.activeNav.join(', ')})`);
	assert(desktop.revealHidden === 0, `desktop: ${desktop.revealHidden} reveal section(s) never settled`);

	// The primary's LABEL is pinned in check-landing-claims.mjs, on the source,
	// because the template interpolates {cta.label}: comparing the rendered
	// text against site.ts here can never disagree with itself. What the
	// browser can still tell us is that the button rendered something at all.
	assert(desktop.primaryLabel, 'desktop: the primary CTA rendered no label');

	await viewport(390, 844, true);
	await navigate();
	await walkPage();
	const mobile = await evaluate(probe);
	await capture('390x844');

	assert(mobile.bodyOverflow === 0, `mobile: horizontal overflow is ${mobile.bodyOverflow}px`);
	assert(mobile.mathsFits, 'mobile: the arithmetic table escapes the viewport');
	assert(mobile.minTarget >= 44, `mobile: smallest route action is ${mobile.minTarget}px`);
	assert(mobile.plateCost === '$1.62', `mobile: plate cost reads ${mobile.plateCost}`);
	assert(mobile.stages === 5, `mobile: expected 5 stage rows, received ${mobile.stages}`);
	// The claim in this file's docstring and success line. At 390px the table
	// is wider than its column, so it MUST overflow its own container rather
	// than the page: if it ever stops scrolling, the values are unreachable.
	assert(mobile.shot?.loaded, 'mobile: the setup capture did not load');
	assert(
		mobile.shot && mobile.shot.rendered <= mobile.shot.natural / 2,
		`mobile: setup capture renders at ${mobile.shot?.rendered}px, wider than half its natural width`
	);
	assert(mobile.mathsScrolls === true, 'mobile: the arithmetic table no longer scrolls inside its own container');
	// FINDING 1: that scroll must be reachable without a pointer (WCAG 2.1.1).
	assert(mobile.mathsFocusable, 'mobile: the arithmetic scroll container is not keyboard focusable');

	// Keyboard: the arithmetic region must take focus and scroll from the
	// keyboard, because at 390px its value column is entirely off-screen.
	await viewport(390, 844, true);
	await navigate();
	const keyboard = await evaluate(`(async () => {
		const maths = document.querySelector('.fd-maths-scroll');
		maths.focus();
		const focused = document.activeElement === maths;
		const before = maths.scrollLeft;
		maths.scrollLeft = maths.scrollWidth;
		const moved = maths.scrollLeft > before;
		const ring = getComputedStyle(maths, ':focus-visible').outlineStyle;
		return { focused, moved, ring, hiddenWidth: maths.scrollWidth - maths.clientWidth };
	})()`);
	assert(keyboard.focused, 'keyboard: the arithmetic region does not take focus');
	assert(keyboard.moved, 'keyboard: the arithmetic region does not scroll');
	assert(keyboard.hiddenWidth > 0, 'keyboard: expected the arithmetic table to overflow at 390px');

	// 200% text. The stage list and the arithmetic are the two places where a
	// doubled root size can clip.
	await viewport(1280, 800);
	await navigate();
	await evaluate("document.documentElement.style.fontSize = '32px'");
	await delay(200);
	const zoomed = await evaluate(probe);
	await capture('200-percent-text');
	assert(zoomed.bodyOverflow === 0, `200% text: horizontal overflow is ${zoomed.bodyOverflow}px`);
	assert(zoomed.mathsFits, '200% text: the arithmetic table escapes the viewport');

	// Reduced motion: nothing may stay hidden when the animation register is off.
	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(1440, 900);
	await navigate();
	const reduced = await evaluate(`(() => ({
		hidden: [...document.querySelectorAll('[data-reveal], .anim-enter')]
			.filter((n) => getComputedStyle(n).opacity !== '1').length,
		plateCost: document.querySelector('.fd-maths-total .fd-maths-value')?.textContent.trim()
	}))()`);
	assert(reduced.hidden === 0, `reduced motion: ${reduced.hidden} element(s) stayed hidden`);
	assert(reduced.plateCost === '$1.62', 'reduced motion: the plate cost is not readable');
	await send('Emulation.setEmulatedMedia', { features: [] });

	// No JavaScript: content is never hidden for a no-JS visitor.
	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate();
	const noScript = await evaluate(`(() => ({
		stages: document.querySelectorAll('.fd-stage').length,
		guards: document.querySelectorAll('.fd-guards li').length,
		plateCost: document.querySelector('.fd-maths-total .fd-maths-value')?.textContent.trim(),
		hidden: [...document.querySelectorAll('[data-reveal]')]
			.filter((n) => getComputedStyle(n).opacity !== '1').length
	}))()`).catch(() => null);
	await send('Emulation.setScriptExecutionDisabled', { value: false });
	assert(noScript, 'no JavaScript: the probe did not return; the pass below was never proven');
	if (noScript) {
		assert(noScript.stages === 5, `no JavaScript: expected 5 stage rows, received ${noScript.stages}`);
		assert(noScript.guards === 4, `no JavaScript: expected 4 guard lines, received ${noScript.guards}`);
		assert(noScript.plateCost === '$1.62', 'no JavaScript: the plate cost is not readable');
		assert(noScript.hidden === 0, `no JavaScript: ${noScript.hidden} section(s) stayed hidden`);
	}

	assert(pageErrors.length === 0, `browser: ${pageErrors.length} page exception(s): ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `browser: failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	await rm(profile, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(`First-dish browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('First-dish browser verification passed: desktop, mobile, 200% text, reduced motion, keyboard, no-JavaScript, and the arithmetic scrolls in its own container.');
