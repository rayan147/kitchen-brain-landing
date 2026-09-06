import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const previewHost = new URL(baseUrl).hostname;
const localPreview = previewHost === '127.0.0.1' || previewHost === 'localhost';
const localAnalyticsUrl = new URL('/_vercel/insights/script.js', baseUrl).href;
const artifacts = new URL('../artifacts/features-menu', import.meta.url).pathname;
await mkdir(artifacts, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-features-menu-'));
const port = 10000 + (process.pid % 40000);
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
			const expectedLocalAnalytics404 = localPreview && response.status === 404 && response.url === localAnalyticsUrl;
			if (response.status >= 400 && !expectedLocalAnalytics404) {
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
			flatTourVisible: Boolean(
				document.querySelector('nav[aria-label="Main"] > ul > li > a[href="/tour/main"]')?.getClientRects().length
			),
			demoVisible: Boolean(document.querySelector('header a[href="/demo"]')?.getClientRects().length),
			headerHeight: document.querySelector('header').getBoundingClientRect().height,
			minTarget: Math.min(...links.map((link) => link.getBoundingClientRect().height)),
			left: rect.left,
			right: rect.right,
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth,
			sectionTops: sections.map((section) => section.getBoundingClientRect().top),
			sectionLefts: sections.map((section) => section.getBoundingClientRect().left)
		};
	})()`);
	// Considered Strategy; not used because this pins one fixed navigation
	// contract (twelve curated entries plus tour and all-features actions), not swappable behavior.
	assert(desktop.linkCount === 14, `desktop: expected 14 links, received ${desktop.linkCount}`);
	assert(!desktop.flatTourVisible, 'desktop: product tour still occupies a flat header tab');
	assert(desktop.demoVisible, 'desktop: Book a demo action is not visible');
	assert(desktop.headerHeight < 150, `desktop: shared header is ${desktop.headerHeight}px tall`);
	assert(desktop.minTarget >= 44, `desktop: smallest link target is ${desktop.minTarget}px`);
	assert(desktop.left >= 0 && desktop.right <= desktop.innerWidth, 'desktop: panel leaves the viewport');
	assert(desktop.scrollWidth === desktop.innerWidth, 'desktop: horizontal overflow');
	assert(desktop.sectionTops[0] === desktop.sectionTops[1], 'desktop: menu groups are not aligned');
	assert(desktop.sectionLefts[0] < desktop.sectionLefts[1], 'desktop: menu groups did not form two columns');
	await capture('desktop-open');
	const blog = await evaluate(`(() => new Promise((resolve) => {
		const features = document.querySelector('[data-features-menu]');
		const details = document.querySelector('[data-blog-menu]');
		details.open = true;
		requestAnimationFrame(() => {
			const panel = details.querySelector('summary + div');
			const rect = panel.getBoundingClientRect();
			resolve({
				articleLinks: details.querySelectorAll('a[href^="/blog/"]').length,
				icons: details.querySelectorAll('a[href^="/blog/"] svg').length,
				descriptions: details.querySelectorAll('a[href^="/blog/"] span span + span').length,
				hasOverview: Boolean(details.querySelector('a[href="/blog"]')),
				featuresClosed: !features.open,
				left: rect.left,
				right: rect.right,
				innerWidth
			});
		});
	}))()`);
	assert(blog.articleLinks === 10, `desktop Blog: expected 10 article links, received ${blog.articleLinks}`);
	assert(blog.icons === 10, `desktop Blog: expected 10 icons, received ${blog.icons}`);
	assert(blog.descriptions === 10, `desktop Blog: expected 10 descriptions, received ${blog.descriptions}`);
	assert(blog.hasOverview, 'desktop Blog: overview link is missing');
	assert(blog.featuresClosed, 'desktop Blog: opening it did not close Features');
	assert(blog.left >= 0 && blog.right <= blog.innerWidth, 'desktop Blog: panel leaves the viewport');
	await capture('desktop-blog-open');
	const resources = await evaluate(`(() => new Promise((resolve) => {
		const features = document.querySelector('[data-features-menu]');
		const blog = document.querySelector('[data-blog-menu]');
		const details = document.querySelector('[data-resources-menu]');
		details.querySelector('summary').click();
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const panel = details.querySelector('summary + div');
				const rect = panel.getBoundingClientRect();
				const sections = [...panel.querySelectorAll(':scope > div:first-child > section')];
				resolve({
					linkCount: details.querySelectorAll('a').length,
					icons: details.querySelectorAll('a svg').length,
					descriptions: details.querySelectorAll('a span span + span').length,
					hasTour: Boolean(details.querySelector('a[href="/tour/main"]')),
					featuresClosed: !features.open,
					blogClosed: !blog.open,
					left: rect.left,
					right: rect.right,
					innerWidth,
					sectionTops: sections.map((section) => section.getBoundingClientRect().top),
					sectionLefts: sections.map((section) => section.getBoundingClientRect().left)
				});
			});
		});
	}))()`);
	assert(resources.linkCount === 5, `desktop Resources: expected 5 links, received ${resources.linkCount}`);
	assert(resources.icons === 5, `desktop Resources: expected 5 icons, received ${resources.icons}`);
	assert(resources.descriptions === 5, `desktop Resources: expected 5 descriptions, received ${resources.descriptions}`);
	assert(resources.hasTour, 'desktop Resources: product tour is missing');
	assert(resources.featuresClosed, 'desktop Resources: opening it did not close Features');
	assert(resources.blogClosed, 'desktop Resources: opening it did not close Blog');
	assert(resources.left >= 0 && resources.right <= resources.innerWidth, 'desktop Resources: panel leaves the viewport');
	assert(resources.sectionTops[0] === resources.sectionTops[1], 'desktop Resources: menu groups are not aligned');
	assert(resources.sectionLefts[0] < resources.sectionLefts[1], 'desktop Resources: menu groups did not form two columns');
	await capture('desktop-resources-open');

	for (const [width, height] of [[1280, 800], [1024, 768]]) {
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

	await navigate(`${baseUrl}/features/purchases-and-month-cost#features-ledger`);
	for (let attempt = 0; attempt < 20; attempt += 1) {
		const targetTop = await evaluate(`document.querySelector('#features-ledger').getBoundingClientRect().top`);
		if (targetTop >= 0 && targetTop < 200) break;
		await delay(100);
	}
	const deepLink = await evaluate(`(() => {
		const target = document.querySelector('#features-ledger');
		const rect = target.getBoundingClientRect();
		return { hash: location.hash, top: rect.top, title: target.querySelector('h2, summary span')?.textContent.trim() };
	})()`);
	assert(deepLink.hash === '#features-ledger', 'deep link: hash was not preserved');
	assert(deepLink.top >= 0 && deepLink.top < 200, `deep link: target landed at ${deepLink.top}px`);
	assert(deepLink.title?.length > 0, 'deep link: target section has no visible heading or disclosure label');

	await viewport(390, 844, true);
	await navigate(`${baseUrl}/`);
	const mobile = await evaluate(`(() => {
		const details = document.querySelector('[data-features-menu]');
		details.open = true;
		const panel = details.querySelector('summary + div');
		const sections = [...panel.querySelectorAll(':scope > div:first-child > section')];
		const rect = panel.getBoundingClientRect();
		return {
			flatTourVisible: Boolean(
				document.querySelector('nav[aria-label="Main"] > ul > li > a[href="/tour/main"]')?.getClientRects().length
			),
			demoVisible: Boolean(document.querySelector('header a[href="/demo"]')?.getClientRects().length),
			footerTourVisible: Boolean(
				document.querySelector('nav[aria-label="Footer"] a[href="/tour/main"]')?.getClientRects().length
			),
			left: rect.left,
			right: rect.right,
			bottom: rect.bottom,
			clientHeight: panel.clientHeight,
			panelScrollHeight: panel.scrollHeight,
			scrollWidth: document.documentElement.scrollWidth,
			scrollHeight: document.documentElement.scrollHeight,
			innerWidth,
			sectionTops: sections.map((section) => section.getBoundingClientRect().top)
		};
	})()`);
	assert(mobile.left >= 0 && mobile.right <= mobile.innerWidth, 'mobile: panel leaves the viewport');
	assert(!mobile.flatTourVisible, 'mobile: product-tour link crowded the flat header');
	assert(mobile.demoVisible, 'mobile: Demo action is not visible');
	assert(mobile.footerTourVisible, 'mobile: footer product-tour link is not available');
	assert(mobile.scrollWidth === mobile.innerWidth, 'mobile: horizontal overflow');
	assert(mobile.bottom <= 844, `mobile: panel bottom is ${mobile.bottom}px below the viewport`);
	assert(mobile.panelScrollHeight > mobile.clientHeight, 'mobile: long destinations are not contained in a scroll region');
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
	const mobileMenu = await evaluate(`(() => new Promise((resolve) => {
		const features = document.querySelector('[data-features-menu]');
		const details = document.querySelector('[data-mobile-menu]');
		details.querySelector('summary').click();
		requestAnimationFrame(() => requestAnimationFrame(() => resolve({
			visibleLinks: [...details.querySelectorAll('a')].filter((link) => link.getClientRects().length > 0).length,
			hasPricing: Boolean(details.querySelector('a[href="/pricing"]')),
			hasSignIn: Boolean(details.querySelector('a[href="https://app.costcook.io/login"]')),
			featuresClosed: !features.open
		})));
	}))()`);
	assert(mobileMenu.visibleLinks === 8, `mobile Menu: expected 8 visible links, received ${mobileMenu.visibleLinks}`);
	assert(mobileMenu.hasPricing, 'mobile Menu: Pricing is missing');
	assert(mobileMenu.hasSignIn, 'mobile Menu: Sign in is missing');
	assert(mobileMenu.featuresClosed, 'mobile Menu: opening it did not close Features');
	await capture('mobile-nav-open');

	await viewport(320, 844, true);
	await navigate(`${baseUrl}/`);
	const reflow = await evaluate(`(() => {
		document.documentElement.style.fontSize = '200%';
		const details = document.querySelector('[data-mobile-menu]');
		details.open = true;
		return {
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth,
			featureTriggerVisible: Boolean(document.querySelector('[data-features-menu]').getClientRects().length),
			featureLinkVisible: Boolean(details.querySelector('a[href="/features"]').getClientRects().length)
		};
	})()`);
	assert(reflow.scrollWidth === reflow.innerWidth, '200% text at 320px: horizontal overflow');
	assert(!reflow.featureTriggerVisible, '320px at 200% text: direct Features trigger still crowds the header');
	assert(reflow.featureLinkVisible, '320px at 200% text: Features is missing from Menu');

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
		if (await evaluate(`location.href === ${JSON.stringify(`${baseUrl}/features/recipes-and-costing`)}`)) break;
		await delay(100);
	}
	const noScriptDestination = await evaluate('location.href');
	assert(
		noScriptDestination === `${baseUrl}/features/recipes-and-costing`,
		'no JavaScript: destination link did not navigate'
	);

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
	console.error(`Features menu browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Features menu browser verification passed: desktop, keyboard, deep link, mobile, reflow, reduced motion, and no-JavaScript.');
