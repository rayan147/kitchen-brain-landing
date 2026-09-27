import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

/**
 * Browser verification for /compare. Same CDP harness as verify-onboarding.mjs:
 * one headless Chromium driven over DevTools, no Playwright dependency.
 *
 * WHY THIS ROUTE HAS ONE AT ALL, FROM 2026-09-05. It did not, and it had just
 * become the widest thing on the site: a five-column table over 44 rows in five
 * groups, with a separate one-card-per-row path below sm. A change that lands
 * in the desktop path and is forgotten in the phone one is the failure mode
 * here, and no static contract can see it.
 *
 * MEASURE OVERFLOW AGAINST innerWidth, NEVER documentElement.clientWidth. Under
 * CDP device emulation Chromium reports innerWidth larger than clientWidth (411
 * against 390), so a clientWidth reference reports a constant phantom overflow
 * that stays constant against a baseline and looks exactly like a real
 * pre-existing defect. It cost a wrong bug report on 2026-09-05.
 */
const baseUrl = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const route = `${baseUrl}/compare`;
const profile = await mkdtemp(join(tmpdir(), 'costcook-compare-'));
const port = 9352;
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
			// here keeps a real missing asset on /compare loud.
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
	// Unlike the sibling harnesses this one THROWS on an evaluation error rather
	// than returning undefined. A typo in a selector otherwise surfaces as
	// "cannot read properties of undefined" fifty lines later, which is a much
	// worse debugging afternoon than the exception itself.
	const evaluate = async (expression) => {
		const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
		if (result.exceptionDetails) {
			throw new Error(
				`page evaluation failed: ${result.exceptionDetails.exception?.description ?? result.exceptionDetails.text}`
			);
		}
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
	// Without these the page never emits Runtime.exceptionThrown or
	// Network.responseReceived, and the pageErrors/failedRequests assertions
	// below are dead: a JS exception or a 404 asset would ship green.
	await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Network.enable')]);


	// Desktop: five columns per group, and the spreadsheet column last.
	await viewport(1440, 900);
	await navigate();
	const desktop = await evaluate(`(() => {
		const tables = [...document.querySelectorAll('table')];
		const heads = tables.map((t) => [...t.querySelectorAll('thead th')].map((th) => th.firstChild?.textContent.trim()));
		return {
			tables: tables.length,
			headerCounts: heads.map((h) => h.length),
			firstHeader: heads[0] ?? [],
			// A competitor or spreadsheet cell must never carry a status glyph.
			markedCells: [...document.querySelectorAll('td')]
				.filter((td, i) => i % 4 !== 0 && td.querySelector('[data-cell-mark], svg'))
				.length,
			sheetCells: [...document.querySelectorAll('td')]
				.filter((td) => /^(You build it|You key it in)/.test(td.textContent.trim())).length,
			rows: document.querySelectorAll('th[scope="row"]').length,
			overflow: document.documentElement.scrollWidth - innerWidth
		};
	})()`);
	assert(desktop.tables === 5, `desktop: ${desktop.tables} group tables, expected 5`);
	assert(
		desktop.headerCounts.every((n) => n === 5),
		`desktop: header counts are [${desktop.headerCounts.join(', ')}], every group needs 5`
	);
	assert(
		desktop.firstHeader[4] === 'A spreadsheet',
		`desktop: the fifth column is "${desktop.firstHeader[4]}", expected "A spreadsheet"`
	);
	assert(
		desktop.sheetCells === desktop.rows,
		`desktop: ${desktop.sheetCells} spreadsheet cells for ${desktop.rows} rows`
	);
	assert(desktop.overflow === 0, `desktop: horizontal overflow is ${desktop.overflow}px`);

	// The table is allowed to scroll inside its own wrapper. The page is not.
	const scroller = await evaluate(`(() => {
		const wrap = document.querySelector('table').parentElement;
		return { clips: getComputedStyle(wrap).overflowX, page: document.documentElement.scrollWidth - innerWidth };
	})()`);
	assert(scroller.clips === 'auto', `the table wrapper is overflow-x: ${scroller.clips}, expected auto`);
	assert(scroller.page === 0, `the page scrolls sideways by ${scroller.page}px`);

	// Phone: the card path carries the SAME spreadsheet cell as the table. This
	// is the one that gets forgotten in an edit and the one most readers see.
	await viewport(390, 844, true);
	await navigate();
	const phone = await evaluate(`(() => {
		const cards = [...document.querySelectorAll('ul.sm\\\\:hidden > li')];
		const tableVisible = [...document.querySelectorAll('table')]
			.some((t) => t.getBoundingClientRect().width > 0);
		return {
			cards: cards.length,
			tableVisible,
			withSheet: cards.filter((li) => [...li.querySelectorAll('dt')]
				.some((dt) => dt.textContent.trim() === 'A spreadsheet')).length,
			sheetValues: [...new Set(cards.map((li) => {
				const dt = [...li.querySelectorAll('dt')].find((d) => d.textContent.trim() === 'A spreadsheet');
				// The dd is a text node (the cell) then an optional span (its note).
				return dt?.nextElementSibling?.firstChild?.textContent.trim();
			}))],
			overflow: document.documentElement.scrollWidth - innerWidth,
			// The skip link is sr-only and 1x1 until focused, so it is not a
			// touch target and counting it would be checking the wrong thing.
			targets: [...document.querySelectorAll('a')]
				.filter((a) => !a.classList.contains('sr-only'))
				.filter((a) => {
					const rect = a.getBoundingClientRect();
					return rect.width > 1 && rect.height < 24;
				}).length
		};
	})()`);
	assert(!phone.tableVisible, 'phone: the wide table is rendering instead of the card path');
	assert(phone.cards === 44, `phone: ${phone.cards} cards, expected 44`);
	assert(
		phone.withSheet === phone.cards,
		`phone: ${phone.withSheet} of ${phone.cards} cards carry the spreadsheet cell`
	);
	assert(
		phone.sheetValues.every((v) => v === 'You build it' || v === 'You key it in'),
		`phone: spreadsheet cells read [${phone.sheetValues.join(' | ')}], outside the closed vocabulary`
	);
	assert(phone.overflow === 0, `phone: horizontal overflow is ${phone.overflow}px`);
	assert(phone.targets === 0, `phone: ${phone.targets} link(s) under 24px tall`);

	// 200% text at both phone widths. The fixed-width dt column plus a value is
	// what overflowed here once, and the flex-wrap fix is what holds it.
	for (const width of [320, 390]) {
		await viewport(width, 844, true);
		await navigate();
		const zoom = await evaluate(`(() => new Promise((resolve) => {
			document.documentElement.style.fontSize = '200%';
			requestAnimationFrame(() => {
				const escaped = [...document.body.querySelectorAll('*')].filter((element) => {
					if (element.closest('.overflow-x-auto')) return false;
					if (element.closest('details:not([open])')) return false;
					const rect = element.getBoundingClientRect();
					return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
				});
				resolve({
					overflow: document.documentElement.scrollWidth - innerWidth,
					escaped: escaped.slice(0, 5).map((e) => e.tagName.toLowerCase() + '.' + (e.className || ''))
				});
			});
		}))()`);
		assert(zoom.overflow === 0, `${width}px at 200% text: horizontal overflow is ${zoom.overflow}px`);
		assert(
			zoom.escaped.length === 0,
			`${width}px at 200% text: escaped elements: ${zoom.escaped.join(', ')}`
		);
	}

	// The legend is the one thing on this page whose meaning going fuzzy is an
	// honesty problem: five rows, and the two hedges carry no glyph.
	await viewport(1440, 900);
	await navigate();
	const legend = await evaluate(`(() => {
		// Scope to the legend's own list: every phone card is a <dl> too, and an
		// unscoped selector picked up 153 rows instead of 5.
		const legendList = document.querySelector('h2 + dl');
		const rows = [...legendList.querySelectorAll(':scope > div')];
		return {
			count: rows.length,
			markless: rows.filter((r) => !r.querySelector('dt svg')).map((r) => r.querySelector('dt').textContent.trim()),
			hasSheetHedge: document.body.textContent.includes('not of what a spreadsheet is able to do'),
			perGroupHedges: (document.body.innerHTML.match(/what you would maintain/g) ?? []).length
		};
	})()`);
	assert(legend.count === 5, `legend: ${legend.count} rows, expected 5`);
	assert(
		legend.markless.join(' | ') === 'Not listed | A spreadsheet',
		`legend: the mark-less rows are [${legend.markless.join(' | ')}], expected "Not listed" and "A spreadsheet"`
	);
	assert(legend.hasSheetHedge, 'legend: the spreadsheet column hedge is missing');
	assert(legend.perGroupHedges === 5, `only ${legend.perGroupHedges} of 5 group tables repeat the column hedge`);

	assert(pageErrors.length === 0, `page errors: ${pageErrors.join(', ')}`);
	assert(failedRequests.length === 0, `failed requests: ${failedRequests.join(', ')}`);

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
	console.error(`Compare browser verification failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Compare browser verification passed: five columns across five group tables, the phone card path carrying the same spreadsheet cell, the closed vocabulary, 200% text at 320 and 390, the five-row legend, and no page-level sideways scroll.');
