import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const reviewDir = new URL('../.impeccable/review', import.meta.url).pathname;
await mkdir(reviewDir, { recursive: true });

const profile = await mkdtemp(join(tmpdir(), 'costcook-blog-'));
const port = 9354;
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
			if (response.status < 400) return;
			const url = new URL(response.url);
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
	const navigate = async (path) => {
		const url = `${baseUrl}${path}`;
		await send('Page.navigate', { url });
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (await evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`)) break;
			await delay(100);
		}
		await evaluate(`document.fonts.ready.then(() => {
			document.querySelectorAll('.anim-enter').forEach((element) => element.getAnimations().forEach((animation) => animation.finish()));
			document.querySelectorAll('[data-reveal]').forEach((element) => {
				element.classList.remove('reveal-pending');
				element.classList.add('revealed');
			});
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
		await writeFile(join(reviewDir, `${name}.png`), Buffer.from(shot.data, 'base64'));
	};

	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);

	await viewport(1440, 900);
	await navigate('/blog');
	const desktop = await evaluate(`(() => {
		const links = [...document.querySelectorAll('main a')].filter((link) => link.getClientRects().length > 0);
		const resources = document.querySelector('[data-resources-menu]');
		resources.open = true;
		return {
			title: document.querySelector('h1')?.textContent.trim(),
			overflow: document.documentElement.scrollWidth - innerWidth,
			minTarget: Math.min(...links.map((link) => link.getBoundingClientRect().height)),
			posts: document.querySelectorAll('article.blog-row').length,
			blogNav: resources.querySelector('a[href="/blog"]')?.textContent.trim(),
			activeResources: resources.querySelector('summary')?.classList.contains('text-ink'),
			contract: document.documentElement.innerHTML.includes('blog-working-through-the-number')
		};
	})()`);
	assert(desktop.title === 'Practical answers for the numbers behind the food.', 'desktop index: page identity is missing');
	assert(desktop.overflow === 0, `desktop index: horizontal overflow is ${desktop.overflow}px`);
	assert(desktop.minTarget >= 44, `desktop index: smallest action is ${desktop.minTarget}px`);
	assert(desktop.posts === 6, `desktop index: expected 6 article rows, received ${desktop.posts}`);
	assert(desktop.blogNav === 'Blog', 'desktop index: Blog is missing from Resources');
	assert(desktop.activeResources, 'desktop index: Resources is not active');
	assert(desktop.contract, 'desktop index: direction contract did not survive the build');
	await evaluate(`document.querySelector('[data-resources-menu]').open = false`);
	await capture('blog-desktop');

	await navigate('/blog/food-cost-per-guest');
	const article = await evaluate(`(() => ({
		title: document.querySelector('h1')?.textContent.trim(),
		overflow: document.documentElement.scrollWidth - innerWidth,
		sections: document.querySelectorAll('.article-body h2').length,
		tocLinks: document.querySelectorAll('[aria-labelledby="article-path-title"] a').length,
		structured: document.querySelector('script[type="application/ld+json"]')?.textContent.includes('Article'),
		contract: document.documentElement.innerHTML.includes('blog-article-working-shown')
	}))()`);
	assert(article.title === 'How to calculate food cost per guest for a catering event', 'desktop article: page identity is missing');
	assert(article.overflow === 0, `desktop article: horizontal overflow is ${article.overflow}px`);
	assert(article.sections === article.tocLinks && article.sections >= 4, 'desktop article: table of contents does not match sections');
	assert(article.structured, 'desktop article: Article structured data is missing');
	assert(article.contract, 'desktop article: direction contract did not survive the build');
	await capture('blog-article-desktop');

	for (const [width, height] of [[1280, 800], [1024, 768], [768, 1024]]) {
		await viewport(width, height);
		await navigate('/blog');
		const responsive = await evaluate(`(() => ({
			overflow: document.documentElement.scrollWidth - innerWidth,
			headerHeight: Math.round(document.querySelector('header').getBoundingClientRect().height)
		}))()`);
		assert(responsive.overflow === 0, `${width}x${height}: horizontal overflow is ${responsive.overflow}px`);
		assert(responsive.headerHeight < 170, `${width}x${height}: header is ${responsive.headerHeight}px tall`);
	}

	await viewport(390, 844, true);
	await navigate('/blog');
	const mobile = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		posts: document.querySelectorAll('article.blog-row').length,
		featuredTop: Math.round(document.querySelector('#featured-guide-title').getBoundingClientRect().top),
		menuBlog: document.querySelector('[data-mobile-menu] a[href="/blog"]')?.textContent.trim()
	}))()`);
	assert(mobile.overflow === 0, `mobile index: horizontal overflow is ${mobile.overflow}px`);
	assert(mobile.posts === 6, 'mobile index: article rows are missing');
	assert(mobile.featuredTop < 1600, `mobile index: featured guide begins too late at ${mobile.featuredTop}px`);
	assert(mobile.menuBlog === 'Blog', 'mobile index: Blog is missing from Menu');
	await capture('blog-mobile');

	await navigate('/blog/food-cost-per-guest');
	const mobileArticle = await evaluate(`(() => ({
		overflow: document.documentElement.scrollWidth - innerWidth,
		tocTop: Math.round(document.querySelector('#article-path-title').getBoundingClientRect().top),
		firstSectionTop: Math.round(document.querySelector('.article-body h2').getBoundingClientRect().top)
	}))()`);
	assert(mobileArticle.overflow === 0, `mobile article: horizontal overflow is ${mobileArticle.overflow}px`);
	assert(mobileArticle.tocTop < mobileArticle.firstSectionTop, 'mobile article: guide path does not precede the article body');
	await capture('blog-article-mobile');

	await viewport(320, 844, true);
	await navigate('/blog/food-cost-per-guest');
	const zoomOverflow = await evaluate(`(() => {
		document.documentElement.style.fontSize = '200%';
		return new Promise((resolve) => requestAnimationFrame(() => resolve(document.documentElement.scrollWidth - innerWidth)));
	})()`);
	assert(zoomOverflow === 0, `200% text at 320px: horizontal overflow is ${zoomOverflow}px`);

	await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
	await viewport(390, 844, true);
	await navigate('/blog');
	const reduced = await evaluate(`document.querySelector('.anim-enter').getAnimations().length`);
	assert(reduced === 0, `reduced motion: found ${reduced} hero animation(s)`);

	await send('Emulation.setScriptExecutionDisabled', { value: true });
	await navigate('/blog');
	const noScript = await evaluate(`(() => {
		const menu = document.querySelector('[data-mobile-menu]');
		menu.open = true;
		return {
			title: document.querySelector('h1')?.textContent.trim(),
			posts: document.querySelectorAll('article.blog-row').length,
			blogLink: menu.querySelector('a[href="/blog"]')?.textContent.trim()
		};
	})()`);
	assert(noScript.title === 'Practical answers for the numbers behind the food.', 'no JavaScript: blog identity is missing');
	assert(noScript.posts === 6, 'no JavaScript: article rows are missing');
	assert(noScript.blogLink === 'Blog', 'no JavaScript: Blog is missing from Menu');
	assert(pageErrors.length === 0, `browser: ${pageErrors.length} page exception(s): ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `browser: failed requests: ${failedRequests.join(', ')}`);
} finally {
	if (socket?.readyState === WebSocket.OPEN) socket.close();
	browser.kill('SIGTERM');
	await rm(profile, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(`Blog browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Blog browser verification passed: Resources navigation, index, article, intermediate widths, mobile, 200% text, reduced motion, and no-JavaScript.');
