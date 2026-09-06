/**
 * Behaviour tests for the contact endpoint (api/support.ts).
 *
 * The endpoint is the one piece of this site that is not a static page, and it
 * is reachable by anyone who finds the URL, so its refusals matter more than its
 * happy path. It bundles itself with esbuild and drives the handler with mock
 * request/response objects: no network, no Resend account, no server.
 *
 * Run: npm run test:support
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const outDir = mkdtempSync(join(tmpdir(), 'costcook-support-'));
const outFile = join(outDir, 'support.mjs');
const root = new URL('..', import.meta.url).pathname;

const build = spawnSync(
	'npx',
	// resend is bundled in rather than left external so the output runs from a
	// temp directory, where node_modules resolution would not reach it.
	['esbuild', 'api/support.ts', '--bundle', '--platform=node', '--format=esm', `--outfile=${outFile}`],
	{ cwd: root, encoding: 'utf8' }
);
if (build.status !== 0) {
	console.error(build.stderr || build.stdout);
	rmSync(outDir, { recursive: true, force: true });
	process.exit(1);
}

const { default: handler } = await import(outFile);

let passed = 0;
const failures = [];
const check = (name, condition, detail = '') => {
	if (condition) {
		passed += 1;
		return;
	}
	failures.push(`${name}${detail ? ` (${detail})` : ''}`);
};

function mockResponse() {
	const response = { statusCode: null, headers: {}, body: null };
	response.status = (code) => ((response.statusCode = code), response);
	response.setHeader = (key, value) => ((response.headers[key.toLowerCase()] = value), response);
	response.json = (body) => ((response.body = body), response);
	response.end = () => response;
	return response;
}
const request = (overrides = {}) => ({
	method: 'POST',
	headers: { accept: 'application/json' },
	body: {},
	...overrides
});
const valid = { name: 'Sam', email: 'sam@kitchen.com', message: 'How do I cost a 180 guest wedding?' };

let res = mockResponse();
await handler(request({ method: 'GET' }), res);
check('GET is refused with 405', res.statusCode === 405, `got ${res.statusCode}`);
check('a refused method advertises POST', res.headers.allow === 'POST');

res = mockResponse();
await handler(request({ body: null }), res);
check('a missing body is rejected', res.statusCode === 400);

// Every one of these must be refused BEFORE anything reaches the mailer.
for (const [label, body] of [
	['an empty email', { ...valid, email: '' }],
	['a malformed email', { ...valid, email: 'not-an-email' }],
	['a message under the minimum', { ...valid, message: 'too short' }],
	['a newline in the email (header injection)', { ...valid, email: 'a@b.com\nBcc: x@y.com' }],
	['a CRLF in the name (header injection)', { ...valid, name: 'Sam\r\nBcc: x@y.com' }],
	['a message over the maximum', { ...valid, message: 'x'.repeat(4001) }]
]) {
	res = mockResponse();
	await handler(request({ body }), res);
	check(`${label} is rejected`, res.statusCode === 400, `got ${res.statusCode}`);
}

// Regression: the control-character guard was briefly a space, which rejected
// every ordinary two-word name while the tests passed on the one-word 'Sam'.
process.env.RESEND_API_KEY = 'test-key-not-real';
globalThis.fetch = async () =>
	new Response(JSON.stringify({ id: 'stub' }), { status: 200, headers: { 'content-type': 'application/json' } });
res = mockResponse();
await handler(
	request({ headers: { accept: 'application/json', 'x-forwarded-for': '5.5.5.5' }, body: { ...valid, name: "Sam O'Neill Smith" } }),
	res
);
check('an ordinary two-word name is accepted', res.statusCode === 200, `got ${res.statusCode} for a name with a space`);
res = mockResponse();
await handler(
	request({ headers: { accept: 'application/json', 'x-forwarded-for': '6.6.6.6' }, body: { ...valid, name: '' } }),
	res
);
check('a missing optional name is accepted', res.statusCode === 200, `got ${res.statusCode}`);
delete process.env.RESEND_API_KEY;
globalThis.fetch = undefined;

res = mockResponse();
await handler(request({ body: { ...valid, company: 'AcmeBot' } }), res);
check('a filled bot trap is answered 200', res.statusCode === 200);
check('a filled bot trap is told nothing useful', res.body?.ok === true);

// A contact form that swallows a message is worse than one that admits it is
// down, so an unconfigured mailer must never look like a successful send.
delete process.env.RESEND_API_KEY;
res = mockResponse();
await handler(request({ body: valid }), res);
check('a missing API key fails loudly, not silently', res.statusCode === 503, `got ${res.statusCode}`);
check('a failed send says the draft survives', /draft is still here/.test(res.body?.message ?? ''));

// The form works without JavaScript, so a browser POST must land on a page.
res = mockResponse();
await handler(
	request({ headers: { accept: 'text/html,application/xhtml+xml' }, body: { ...valid, email: 'bad' } }),
	res
);
check('a no-script post is redirected, not shown JSON', res.statusCode === 303, `got ${res.statusCode}`);
check('a failed no-script post lands on /contact/not-sent', res.headers.location === '/contact/not-sent', res.headers.location);

process.env.RESEND_API_KEY = 'test-key-not-real';
globalThis.fetch = async () =>
	new Response(JSON.stringify({ id: 'stub' }), { status: 200, headers: { 'content-type': 'application/json' } });
const statuses = [];
for (let attempt = 0; attempt < 5; attempt += 1) {
	res = mockResponse();
	await handler(
		request({ headers: { accept: 'application/json', 'x-forwarded-for': '9.9.9.9' }, body: valid }),
		res
	);
	statuses.push(res.statusCode);
}
check('the first three sends pass', statuses.slice(0, 3).every((s) => s !== 429), statuses.join(','));
check('a fourth send in the window is throttled', statuses.slice(3).every((s) => s === 429), statuses.join(','));

res = mockResponse();
await handler(
	request({ headers: { accept: 'application/json', 'x-forwarded-for': '1.1.1.1' }, body: valid }),
	res
);
check('one sender being throttled does not throttle another', res.statusCode !== 429, `got ${res.statusCode}`);

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
	console.error('Support endpoint checks failed:');
	console.error(failures.map((failure) => `- ${failure}`).join('\n'));
	process.exit(1);
}
console.log(`Support endpoint verified: ${passed} checks across method, validation, header injection, bot trap, misconfiguration, no-script redirect, and rate limiting.`);
