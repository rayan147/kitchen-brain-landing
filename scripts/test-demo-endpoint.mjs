/**
 * Behaviour tests for the demo endpoint (api/demo-request.ts).
 *
 * The endpoint is reachable by anyone who finds the URL, so its refusals matter
 * more than its happy path. It bundles itself with esbuild and drives the
 * handler with mock request/response objects: no network, no Resend account, no
 * server.
 *
 * Run: npm run test:demo
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Vercel runs api/*.ts as real ES modules, where Node resolves relative
// specifiers literally and an extensionless one throws ERR_MODULE_NOT_FOUND at
// runtime. esbuild resolves them happily, so the bundle below can never catch
// it: this is a source check, and it is the only reason the 500 that shipped
// from api/support.ts cannot ship again from here.
const apiSource = readFileSync(new URL('../api/demo-request.ts', import.meta.url), 'utf8');
const badSpecifiers = [...apiSource.matchAll(/from\s+'(\.[^']*)'/g)]
	.map((match) => match[1])
	.filter((specifier) => !/\.(js|mjs|cjs|json)$/.test(specifier));

const outDir = mkdtempSync(join(tmpdir(), 'costcook-demo-'));
const outFile = join(outDir, 'demo-request.mjs');
const root = new URL('..', import.meta.url).pathname;

const build = spawnSync(
	'npx',
	// resend is bundled in rather than left external so the output runs from a
	// temp directory, where node_modules resolution would not reach it.
	['esbuild', 'api/demo-request.ts', '--bundle', '--platform=node', '--format=esm', `--outfile=${outFile}`],
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
const valid = {
	business: 'Harbour Road Catering',
	role: 'Owner or chef-owner',
	kitchen: 'Catering and private events',
	locations: '1',
	workflow: 'A 180-guest wedding menu we priced twice last month.',
	firstName: 'Sam',
	lastName: "O'Neill Smith",
	email: 'sam@harbourroad.com',
	phone: '973-555-0134'
};

// Captures what actually reached Resend, so the assertions below are about the
// message that would be delivered, not about a status code.
let lastSend = null;
const stubResend = () => {
	process.env.RESEND_API_KEY = 'test-key-not-real';
	globalThis.fetch = async (_url, init) => {
		lastSend = JSON.parse(init.body);
		return new Response(JSON.stringify({ id: 'stub' }), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		});
	};
};
const unstubResend = () => {
	delete process.env.RESEND_API_KEY;
	globalThis.fetch = undefined;
	lastSend = null;
};

check(
	'every relative import in api/demo-request.ts carries a file extension',
	badSpecifiers.length === 0,
	badSpecifiers.join(', ')
);

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
	['a missing business name', { ...valid, business: '' }],
	['a missing first name', { ...valid, firstName: '' }],
	['a missing role', { ...valid, role: '' }],
	['a missing kitchen type', { ...valid, kitchen: '' }],
	['a missing location count', { ...valid, locations: '' }],
	['a newline in the email (header injection)', { ...valid, email: 'a@b.com\nBcc: x@y.com' }],
	['a CRLF in the business name (header injection)', { ...valid, business: 'Acme\r\nBcc: x@y.com' }],
	['an over-long business name', { ...valid, business: 'x'.repeat(101) }],
	['an over-long free-text answer', { ...valid, workflow: 'x'.repeat(601) }]
]) {
	res = mockResponse();
	await handler(request({ body }), res);
	check(`${label} is rejected`, res.statusCode === 400, `got ${res.statusCode}`);
}

// The happy path, and what it actually puts on the wire.
stubResend();
res = mockResponse();
await handler(
	request({ headers: { accept: 'application/json', 'x-forwarded-for': '5.5.5.5' }, body: valid }),
	res
);
check('a complete request is accepted', res.statusCode === 200, `got ${res.statusCode}`);
check('an ordinary name with a space and an apostrophe survives', res.statusCode === 200);
check('the request reaches rayan@costcook.io', (lastSend?.to ?? []).includes('rayan@costcook.io'), JSON.stringify(lastSend?.to));
check('the request reaches support@costcook.io', (lastSend?.to ?? []).includes('support@costcook.io'), JSON.stringify(lastSend?.to));
check('replies go to the visitor, not to the site', lastSend?.reply_to === valid.email, JSON.stringify(lastSend?.reply_to));
check('the From stays a Resend-verified sender', /costcook\.io/.test(lastSend?.from ?? ''), lastSend?.from);
check('the subject names the business', (lastSend?.subject ?? '').includes(valid.business), lastSend?.subject);
for (const field of ['workflow', 'phone', 'role', 'kitchen'])
	check(`the message carries the ${field} answer`, (lastSend?.text ?? '').includes(valid[field]));

// An optional field left blank is not a rejection, and must not print as blank.
res = mockResponse();
await handler(
	request({ headers: { accept: 'application/json', 'x-forwarded-for': '6.6.6.6' }, body: { ...valid, phone: '', workflow: '' } }),
	res
);
check('blank optional fields are accepted', res.statusCode === 200, `got ${res.statusCode}`);
check('a blank optional field reads as Not provided', (lastSend?.text ?? '').includes('Not provided'));
unstubResend();

// THE BOT TRAP. It must not be named `company`: this form carries a business
// name with autocomplete="organization", so Chrome would autofill a `company`
// input and a real caterer's request would be dropped while they were told it
// sent. A filled trap is answered 200 so a bot learns nothing.
stubResend();
res = mockResponse();
await handler(request({ headers: { accept: 'application/json', 'x-forwarded-for': '7.7.7.7' }, body: { ...valid, ticketRef: 'AcmeBot' } }), res);
check('a filled bot trap is answered 200', res.statusCode === 200);
check('a filled bot trap is told nothing useful', res.body?.ok === true);
check('a filled bot trap sends nothing', lastSend === null);

// The regression this names is not hypothetical: it is what api/support.ts's
// trap would do to this form's autofilled visitors.
lastSend = null;
res = mockResponse();
await handler(request({ headers: { accept: 'application/json', 'x-forwarded-for': '8.8.8.8' }, body: { ...valid, company: 'Harbour Road Catering' } }), res);
check('an autofilled company field does NOT swallow a real request', lastSend !== null && res.statusCode === 200, `got ${res.statusCode}, sent=${lastSend !== null}`);
unstubResend();

// A form that swallows a request is worse than one that admits it is down, so
// an unconfigured mailer must never look like a successful send.
delete process.env.RESEND_API_KEY;
res = mockResponse();
await handler(request({ headers: { accept: 'application/json', 'x-forwarded-for': '4.4.4.4' }, body: valid }), res);
check('a missing API key fails loudly, not silently', res.statusCode === 503, `got ${res.statusCode}`);
check('a failed send says the typing survives', /still here/.test(res.body?.message ?? ''));

// Resend reports failures in the payload rather than by throwing.
process.env.RESEND_API_KEY = 'test-key-not-real';
globalThis.fetch = async () =>
	new Response(JSON.stringify({ name: 'validation_error', message: 'nope' }), {
		status: 422,
		headers: { 'content-type': 'application/json' }
	});
res = mockResponse();
await handler(request({ headers: { accept: 'application/json', 'x-forwarded-for': '3.3.3.3' }, body: valid }), res);
check('a Resend error in the payload is not reported as sent', res.statusCode === 503, `got ${res.statusCode}`);
globalThis.fetch = undefined;
delete process.env.RESEND_API_KEY;

// The form works without JavaScript, so a browser POST must land on a page.
res = mockResponse();
await handler(request({ headers: { accept: 'text/html,application/xhtml+xml' }, body: { ...valid, email: 'bad' } }), res);
check('a no-script post is redirected, not shown JSON', res.statusCode === 303, `got ${res.statusCode}`);
check('a failed no-script post lands on /demo/not-sent', res.headers.location === '/demo/not-sent', res.headers.location);

stubResend();
res = mockResponse();
await handler(request({ headers: { accept: 'text/html', 'x-forwarded-for': '2.2.2.2' }, body: valid }), res);
check('a successful no-script post lands on /demo/sent', res.headers.location === '/demo/sent', res.headers.location);

const statuses = [];
for (let attempt = 0; attempt < 5; attempt += 1) {
	res = mockResponse();
	await handler(request({ headers: { accept: 'application/json', 'x-forwarded-for': '9.9.9.9' }, body: valid }), res);
	statuses.push(res.statusCode);
}
check('the first three sends pass', statuses.slice(0, 3).every((s) => s !== 429), statuses.join(','));
check('a fourth send in the window is throttled', statuses.slice(3).every((s) => s === 429), statuses.join(','));

res = mockResponse();
await handler(request({ headers: { accept: 'application/json', 'x-forwarded-for': '1.1.1.1' }, body: valid }), res);
check('one sender being throttled does not throttle another', res.statusCode !== 429, `got ${res.statusCode}`);
unstubResend();

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
	console.error('Demo endpoint checks failed:');
	console.error(failures.map((failure) => `- ${failure}`).join('\n'));
	process.exit(1);
}
console.log(`Demo endpoint verified: ${passed} checks across method, validation, header injection, both recipients, the autofill-safe bot trap, misconfiguration, Resend errors, no-script redirects, and rate limiting.`);
