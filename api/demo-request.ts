import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import {
	composeDemoEmail,
	DEMO_FAILED_MESSAGE,
	DEMO_INVALID_MESSAGE,
	DEMO_RECIPIENTS,
	DEMO_THROTTLED_MESSAGE,
	DEMO_TRAP_FIELD,
	validateDemoRequest,
	type DemoResponse
	// The .js extension is REQUIRED and is not a typo. Vercel compiles this file
	// to api/demo-request.js and runs it as a real ES module, where Node resolves
	// specifiers literally: an extensionless '../src/lib/demo-request' throws
	// ERR_MODULE_NOT_FOUND at runtime. TypeScript understands a .js specifier
	// pointing at a .ts source. Bundlers hide this, which is why an esbuild test
	// can pass while the deployed function returns 500. See api/support.ts, where
	// that 500 actually shipped.
} from '../src/lib/demo-request.js';

/**
 * The demo form's transport.
 *
 * WHAT IT REPLACES. This form used to build a mailto: URL in the browser and
 * navigate to it, so the request only existed if the visitor's device had a
 * mail client, they noticed the draft it opened, and they pressed send. The
 * page was honest about that and told them so, which is not the same as
 * working. Nothing has ever reached support@costcook.io from /demo.
 *
 * WHY IT LIVES IN /api AND NOT IN src/pages. Astro would serve an endpoint too,
 * but only with an adapter, and an adapter moves the build from dist/ to
 * .vercel/output/static. Twenty postbuild guards read dist/ directly, so an
 * adapter would silently disable the truth-pass suite to gain one route. Vercel
 * picks up a root api/ directory next to a static build with no adapter.
 *
 * This is api/support.ts with a different payload and different recipients.
 * Where the two differ, the difference is commented; everywhere else the
 * sameness is deliberate, because two public endpoints on one site that refuse
 * abuse differently are one endpoint waiting to be found.
 */

const RESEND_FROM = 'CostCook site <orders@costcook.io>';

/**
 * Per-instance, best-effort throttle. Vercel may run many instances, so this is
 * a speed bump and NOT a security boundary. It stops the cheapest abuse, which
 * is one client looping on one warm instance. The real backstop is Resend's own
 * sending limits and the fact that every message lands in mailboxes a human
 * reads.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const recentSends = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
	const now = Date.now();
	const hits = (recentSends.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
	hits.push(now);
	recentSends.set(key, hits);
	if (recentSends.size > 5_000) recentSends.clear();
	return hits.length > MAX_PER_WINDOW;
}

function clientKey(request: VercelRequest): string {
	const forwarded = request.headers['x-forwarded-for'];
	const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
	return (value ?? '').split(',')[0]?.trim() || 'unknown';
}

/**
 * The form works without JavaScript, so this endpoint answers two callers.
 * fetch() wants JSON. A native <form method="post"> wants somewhere to land,
 * and showing a visitor raw JSON because their JavaScript did not run is what
 * this site's principle 3 exists to prevent.
 */
function wantsHtml(request: VercelRequest): boolean {
	const accept = request.headers.accept ?? '';
	return accept.includes('text/html') && !accept.includes('application/json');
}

function send(
	request: VercelRequest,
	response: VercelResponse,
	status: number,
	body: DemoResponse
): void {
	if (wantsHtml(request)) {
		// 303 so the browser follows with GET and a reload cannot resend the
		// request. /demo/sent carries the same booking calendar the scripted
		// path shows in step 3, so a visitor without JavaScript still books on a
		// CostCook page rather than being handed a bare link.
		response.status(303).setHeader('Location', body.ok ? '/demo/sent' : '/demo/not-sent');
		response.end();
		return;
	}
	response.status(status).json(body);
}

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
): Promise<void> {
	if (request.method !== 'POST') {
		response.setHeader('Allow', 'POST');
		send(request, response, 405, { ok: false, message: 'Send this form with POST.' });
		return;
	}

	const body: unknown =
		typeof request.body === 'string' ? safeParse(request.body) : (request.body ?? null);

	if (typeof body !== 'object' || body === null) {
		send(request, response, 400, { ok: false, message: DEMO_INVALID_MESSAGE });
		return;
	}

	// A field no human sees and no human fills. Answer 200 so a bot never learns
	// it was refused, and send nothing. The field is NOT called `company` here,
	// unlike api/support.ts: this form asks for a business name with
	// autocomplete="organization", so Chrome would autofill a `company` input
	// and a real caterer's request would vanish while they were told it sent.
	const trap = (body as Record<string, unknown>)[DEMO_TRAP_FIELD];
	if (typeof trap === 'string' && trap.trim().length > 0) {
		send(request, response, 200, { ok: true });
		return;
	}

	const demoRequest = validateDemoRequest(body);
	if (!demoRequest) {
		send(request, response, 400, { ok: false, message: DEMO_INVALID_MESSAGE });
		return;
	}

	if (isRateLimited(clientKey(request))) {
		send(request, response, 429, { ok: false, message: DEMO_THROTTLED_MESSAGE });
		return;
	}

	const email = composeDemoEmail(demoRequest);
	const from = process.env.EMAIL_FROM || RESEND_FROM;

	// LOCAL CAPTURE FIRST, ON PURPOSE. Same two knobs as /api/support and as the
	// app: EMAIL_TRANSPORT=smtp AND SMTP_URL, both required, so no single ambient
	// variable can reroute mail on its own. Checked before Resend so a developer
	// holding a real key and a capture server still captures. The transport
	// refuses any target that is not loopback, so this cannot become a delivery
	// path. Without it `npm run dev:api` cannot exercise this form at all, and
	// `astro dev` does not serve a root api/ directory in the first place: it
	// answers /api/demo-request with its own 404 page, which the browser handler
	// reads as a failed send.
	const smtpUrl = process.env.SMTP_URL;
	if (process.env.EMAIL_TRANSPORT === 'smtp' && smtpUrl) {
		try {
			const { sendViaLoopbackSmtp } = await import('../src/lib/smtp.js');
			await sendViaLoopbackSmtp(smtpUrl, {
				from,
				to: [...DEMO_RECIPIENTS],
				subject: email.subject,
				text: email.body,
				replyTo: demoRequest.email
			});
		} catch (error) {
			console.error('demo.request.failed (smtp capture)', error);
			send(request, response, 503, { ok: false, message: DEMO_FAILED_MESSAGE });
			return;
		}
		send(request, response, 200, { ok: true });
		return;
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		// Loud on the server, honest to the visitor. The failure this endpoint
		// exists to end is a request that looks sent and is not, so it must never
		// answer ok because it could not try.
		console.error(
			'demo.request.misconfigured: set RESEND_API_KEY, or EMAIL_TRANSPORT=smtp with SMTP_URL for local capture'
		);
		send(request, response, 503, { ok: false, message: DEMO_FAILED_MESSAGE });
		return;
	}

	try {
		const { error } = await new Resend(apiKey).emails.send({
			from,
			// Both mailboxes in one send: two sends would mean a half-delivered
			// request that this handler would have to describe to the visitor.
			to: [...DEMO_RECIPIENTS],
			subject: email.subject,
			text: email.body,
			// The visitor's address goes here and nowhere else. Replying reaches
			// them; the From stays a domain Resend has verified, so this never
			// fails SPF or lands in spam for impersonation.
			replyTo: demoRequest.email
		});
		// Resend reports failures in the payload rather than by throwing, so a
		// caller that only tries/catches believes every message was delivered.
		if (error) throw new Error(error.message);
	} catch (error) {
		console.error('demo.request.failed', error);
		send(request, response, 503, { ok: false, message: DEMO_FAILED_MESSAGE });
		return;
	}

	send(request, response, 200, { ok: true });
}

function safeParse(value: string): unknown {
	try {
		return JSON.parse(value) as unknown;
	} catch {
		return null;
	}
}
