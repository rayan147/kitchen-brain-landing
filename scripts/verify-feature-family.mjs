import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const routes = [
	'/',
	'/compare',
	'/contact',
	'/faq',
	'/features',
	'/features/compliance-and-labels',
	'/features/getting-prices-in',
	'/features/ingredients-and-supplier-prices',
	'/features/inventory',
	'/features/invoices-and-price-list-import',
	'/features/labels-and-printing',
	'/features/menus-and-quotes',
	'/features/nutrition-facts-and-allergens',
	'/features/order-shop-prep-pack',
	'/features/purchases-and-month-cost',
	'/features/purchasing-and-receiving',
	'/features/recipes-and-costing',
	'/features/sage',
	'/features/team-and-access',
	'/features/team-and-connections',
	'/features/the-day-itself',
	'/pricing',
	'/tour/main',
	'/who-its-for'
];
const detailedFeatureRoutes = new Set([
	'/features/ingredients-and-supplier-prices',
	'/features/inventory',
	'/features/invoices-and-price-list-import',
	'/features/menus-and-quotes',
	'/features/purchases-and-month-cost',
	'/features/recipes-and-costing',
	'/features/sage'
]);
const specialistFeatureRoutes = new Set([
	...detailedFeatureRoutes,
	'/features/nutrition-facts-and-allergens',
	'/features/order-shop-prep-pack',
	'/features/purchasing-and-receiving',
	'/features/team-and-access'
]);
// Inventory's surface contract keeps its computed result and both decisions in
// the first phone frame. Its compact minimums are data, not another layout
// algorithm; every other specialist guide retains the shared 32px rhythm.
const compactMobileHeroRoutes = new Set(['/features/inventory']);
const viewports = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]];
const profile = await mkdtemp(join(tmpdir(), 'costcook-feature-family-'));
const port = 9341;
const browser = spawn('chromium', [
	'--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
	`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `${baseUrl}${routes[0]}`
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
		if (result.exceptionDetails) {
			throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
		}
		return result.result.value;
	};
	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);
	const waitForRoute = async (route) => {
		for (let attempt = 0; attempt < 50; attempt += 1) {
			const ready = await evaluate(`document.readyState === 'complete' && location.pathname.replace(/\\/$/, '') === ${JSON.stringify(route.replace(/\/$/, '') || '/')}`);
			if (ready) break;
			await delay(100);
		}
		await evaluate('document.fonts.ready');
	};

	// Considered Strategy; not used because every feature guide follows one fixed
	// semantic contract. Routes and viewports are test data, not behavior swaps.
	for (const route of routes) {
		const url = `${baseUrl}${route}`;
		await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
		await send('Page.navigate', { url });
		await waitForRoute(route);

		for (const [width, height] of viewports) {
			await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
			await evaluate(`new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
				document.querySelectorAll('.anim-enter, .reveal-pending').forEach((element) => {
					element.style.animation = 'none'; element.style.transition = 'none';
					element.style.opacity = '1'; element.style.transform = 'none';
				});
				document.documentElement.scrollTop = 0;
				resolve();
			})))`);
			const state = await evaluate(`(() => {
				const heights = (selector) => [...document.querySelectorAll(selector)].map((node) => node.getBoundingClientRect().height);
				const mobileTargets = [...document.querySelectorAll('header a, header summary, .btn-primary, .btn-outline, .btn-quiet, .feature-breadcrumb a, .feature-onward a, .faq summary')]
					.filter((node) => { const style = getComputedStyle(node); const rect = node.getBoundingClientRect(); return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0; })
					.map((node) => ({ label: node.textContent.trim().replace(/\\s+/g, ' ').slice(0, 60), height: node.getBoundingClientRect().height }));
				const heroActions = [...document.querySelectorAll('.hero-actions a')].map((node) => node.getBoundingClientRect());
				const heroGrid = document.querySelector('.hero-grid');
				const heroGridStyle = heroGrid ? getComputedStyle(heroGrid) : null;
				const heroActionsGroup = document.querySelector('.hero-actions');
				return {
					h1Count: document.querySelectorAll('h1').length,
					heroH2Count: document.querySelectorAll('.hero h2').length,
					overflow: document.documentElement.scrollWidth - innerWidth,
					chapterNavCount: document.querySelectorAll('nav[aria-label="On this page"] a').length,
					breadcrumbMin: Math.min(...heights('.feature-breadcrumb a, .breadcrumb a')),
					onwardMin: Math.min(...heights('.feature-onward a')),
					faqMin: Math.min(...heights('.faq summary')),
					heroTargetsMin: Math.min(...heroActions.map((rect) => rect.height)),
					heroBottom: Math.max(...heroActions.map((rect) => rect.bottom)),
					heroActionsFit: heroActions.every((rect) => rect.bottom <= innerHeight),
					heroPaddingTop: heroGridStyle ? parseFloat(heroGridStyle.paddingTop) : null,
					heroPaddingBottom: heroGridStyle ? parseFloat(heroGridStyle.paddingBottom) : null,
					heroRowGap: heroGridStyle ? parseFloat(heroGridStyle.rowGap) : null,
					heroActionMargin: heroActionsGroup ? parseFloat(getComputedStyle(heroActionsGroup).marginTop) : null,
					heroIsStacked: heroGridStyle ? heroGridStyle.gridTemplateColumns.split(' ').length === 1 : false,
					bodyFontSize: parseFloat(getComputedStyle(document.body).fontSize),
					shortMobileTargets: mobileTargets.filter((target) => target.height < 43.5)
				};
			})()`);
			const label = `${route} at ${width}x${height}`;
			assert(state.h1Count === 1, `${label}: expected one H1, found ${state.h1Count}`);
			assert(state.overflow === 0, `${label}: horizontal overflow is ${state.overflow}px`);
			if (width === 390) {
				assert(state.bodyFontSize >= 16, `${label}: body text is ${state.bodyFontSize}px`);
				assert(state.shortMobileTargets.length === 0, `${label}: controls below 44px: ${state.shortMobileTargets.map((target) => `${target.label} (${target.height}px)`).join(', ')}`);
			}
			if (detailedFeatureRoutes.has(route)) {
				assert(state.heroH2Count === 0, `${label}: illustrative hero record is exposed as an H2`);
				assert(state.chapterNavCount >= 2, `${label}: missing local chapter navigation`);
				assert(state.onwardMin >= 44, `${label}: onward target is ${state.onwardMin}px`);
				assert(state.faqMin >= 44, `${label}: FAQ target is ${state.faqMin}px`);
				assert(state.heroActionsFit, `${label}: hero action ends at ${state.heroBottom}px, below the ${height}px first viewport`);
			}
			if (specialistFeatureRoutes.has(route)) {
				const compactMobileHero = width === 390 && compactMobileHeroRoutes.has(route);
				assert(state.breadcrumbMin >= 44, `${label}: breadcrumb target is ${state.breadcrumbMin}px`);
				assert(state.heroTargetsMin >= 44, `${label}: hero target is ${state.heroTargetsMin}px`);
				assert(state.heroPaddingTop >= (compactMobileHero ? 20 : 32), `${label}: hero top padding is ${state.heroPaddingTop}px`);
				assert(state.heroPaddingBottom >= 32, `${label}: hero bottom padding is ${state.heroPaddingBottom}px`);
				assert(state.heroActionMargin >= (compactMobileHero ? 16 : 24), `${label}: hero action separation is ${state.heroActionMargin}px`);
				if (state.heroIsStacked) assert(state.heroRowGap >= (compactMobileHero ? 16 : 32), `${label}: stacked hero gap is ${state.heroRowGap}px`);
			}
		}

		await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 844, deviceScaleFactor: 1, mobile: true });
		const overflow = await evaluate(`(() => { document.documentElement.style.fontSize = '200%'; return new Promise((resolve) => requestAnimationFrame(() => resolve(document.documentElement.scrollWidth - innerWidth))); })()`);
		assert(overflow === 0, `${route} at 320px with 200% text: horizontal overflow is ${overflow}px`);
	}

	assert(pageErrors.length === 0, `browser exceptions: ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	await rm(profile, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(`Feature-family browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log('Site spacing verification passed: 24 routes, five viewports, specialist hero rhythm, and 200% text at 320px.');
