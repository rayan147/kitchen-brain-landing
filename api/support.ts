import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import {
	composeSupportEmail,
	SUPPORT_EMAIL,
	SUPPORT_FAILED_MESSAGE,
	SUPPORT_INVALID_MESSAGE,
	validateSupportRequest,
	type SupportResponse
} from '../src/lib/support';

/**
 * The contact form's transport. Same shape as kitchen-brain's
 * /api/support: validate, compose, hand to Resend, reply to the writer.
 *
 * WHY THIS LIVES IN /api AND NOT IN src/pages. Astro would serve an endpoint
 * too, but only with an adapter, and an adapter moves the build from dist/ to
 * .vercel/output/static. Twenty postbuild guards read dist/ directly
 * (check-dist.mjs and every check-*-page.mjs), so an adapter would silently
 * disable the entire truth-pass suite to gain one route. Vercel picks up a
 * root api/ directory next to a static build with no adapter, so the site stays
 * exactly as static as it was and dist/ keeps its meaning.
 *
 * WHAT IS DIFFERENT FROM THE APP'S VERSION. The app's endpoint opens with
 * `if (!locals.user) return 401`. That single line is doing a lot of work: it
 * means only a signed-in customer can reach the mailer, so the app needs no
 * spam handling at all. This endpoint is reachable by anyone who finds the URL,
 * so the guards below replace that session check. They are the price of the
 * form being useful to a stranger, which is the whole point of it.
 */

const RESEND_FROM = 'CostCook site <orders@costcook.io>';

/**
 * Per-instance, best-effort throttle. Vercel may run many instances, so this is
 * a speed bump and NOT a security boundary: it costs a scripted sender almost
 * nothing to route around. It is here because the cheapest abuse is one client
 * looping on one warm instance, and that is exactly what this stops. The real
 * backstop is Resend's own sending limits and the fact that every message lands
 * in one mailbox a human reads.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const recentSends = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
	const now = Date.now();
	const hits = (recentSends.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
	hits.push(now);
	recentSends.set(key, hits);
	// Unbounded growth across a long-lived Fluid instance is its own problem.
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
 * and showing a visitor a page of raw JSON because their JavaScript did not run
 * is the kind of thing this site's principle 3 exists to prevent. Content
 * negotiation keeps one handler honest to both.
 */
function wantsHtml(request: VercelRequest): boolean {
	const accept = request.headers.accept ?? '';
	return accept.includes('text/html') && !accept.includes('application/json');
}

function send(
	request: VercelRequest,
	response: VercelResponse,
	status: number,
	body: SupportResponse
): void {
	if (wantsHtml(request)) {
		// 303 so the browser follows with GET and a reload cannot resend the
		// message. Both destinations are real prerendered pages: this site is
		// static, so it cannot read a query string on the server, and a visitor
		// without JavaScript would have been shown an empty page by ?sent=1.
		response.status(303).setHeader('Location', body.ok ? '/contact/sent' : '/contact/not-sent');
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
		send(request, response, 400, { ok: false, message: SUPPORT_INVALID_MESSAGE });
		return;
	}

	// A field no human sees and no human fills. A bot that fills every input
	// tells on itself here. Answer 200 so it never learns it was refused, and
	// send nothing.
	const trap = (body as Record<string, unknown>).company;
	if (typeof trap === 'string' && trap.trim().length > 0) {
		send(request, response, 200, { ok: true });
		return;
	}

	const supportRequest = validateSupportRequest(body);
	if (!supportRequest) {
		send(request, response, 400, { ok: false, message: SUPPORT_INVALID_MESSAGE });
		return;
	}

	if (isRateLimited(clientKey(request))) {
		send(request, response, 429, {
			ok: false,
			message: 'That is a few messages in quick succession. Give it a minute, then send again.'
		});
		return;
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		// Loud on the server, honest to the visitor. A contact form that silently
		// swallows a message is worse than one that admits it is down, because the
		// visitor walks away believing someone will reply.
		console.error('support.request.misconfigured: RESEND_API_KEY is not set');
		send(request, response, 503, { ok: false, message: SUPPORT_FAILED_MESSAGE });
		return;
	}

	const email = composeSupportEmail(supportRequest);

	try {
		const { error } = await new Resend(apiKey).emails.send({
			from: process.env.EMAIL_FROM || RESEND_FROM,
			to: SUPPORT_EMAIL,
			subject: email.subject,
			text: email.body,
			// The visitor's address goes here and nowhere else. Replying to the
			// message reaches them; the From stays a domain Resend has verified,
			// so this never fails SPF or lands in a spam folder for impersonation.
			replyTo: supportRequest.email
		});
		// Resend reports failures in the payload rather than by throwing, so a
		// caller that only tries/catches believes every message was delivered.
		if (error) throw new Error(error.message);
	} catch (error) {
		console.error('support.request.failed', error);
		send(request, response, 503, { ok: false, message: SUPPORT_FAILED_MESSAGE });
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
