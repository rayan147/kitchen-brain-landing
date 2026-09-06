/**
 * Contact-support request shape, shared by the browser form and the serverless
 * function behind it, so the two cannot drift on what counts as a valid message.
 *
 * This mirrors kitchen-brain's src/lib/server/support/index.ts, with one
 * difference that drives everything else here: the app knows who is writing.
 * It reads locals.user.email off the session and returns 401 without one. A
 * visitor on the marketing site is anonymous, so the email is a field on the
 * form, it has to be validated, and the endpoint is open to the public and
 * therefore has to survive being found by a bot.
 *
 * Considered sharing the app's module across the two repositories; not used
 * because they deploy separately and a marketing page must not gain a build
 * dependency on the product. Forty lines restated is cheaper than that coupling,
 * and the wire shape is pinned by verify-contact.mjs on this side.
 */

export const SUPPORT_EMAIL = 'support@costcook.io';
export const SUPPORT_MESSAGE_MIN_LENGTH = 10;
export const SUPPORT_MESSAGE_MAX_LENGTH = 4_000;
export const SUPPORT_NAME_MAX_LENGTH = 120;
export const SUPPORT_EMAIL_MAX_LENGTH = 254;

export type SupportRequest = {
	name: string;
	email: string;
	message: string;
};

export type SupportResponse = {
	ok: boolean;
	message?: string;
};

/**
 * One sentence, reused by the endpoint and the form, so a visitor is never told
 * two different things about the same rejected input.
 */
export const SUPPORT_INVALID_MESSAGE =
	'Add your email and a message of at least 10 characters, then send again.';
export const SUPPORT_FAILED_MESSAGE =
	'Your message could not be sent. Your draft is still here, so please try again.';

/**
 * Deliberately permissive: one @, something either side, no spaces, a dot in
 * the domain. Anything stricter rejects real addresses (new TLDs, plus
 * addressing, apostrophes) and the only cost of a bad address here is a bounced
 * reply, not a security hole. The address is never interpolated into a header
 * without the length and newline checks below.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * A line break in a value that reaches a mail header is header injection, so
 * any control character is refused. Deliberately NOT a space: "Sam Smith" is a
 * name, and rejecting it would break the common case to guard the rare one.
 */
const hasControlCharacters = (value: string): boolean =>
	// eslint-disable-next-line no-control-regex
	/[\u0000-\u001f\u007f]/.test(value);

export function validateSupportRequest(value: unknown): SupportRequest | null {
	if (typeof value !== 'object' || value === null) return null;
	const body = value as Record<string, unknown>;

	const rawName = typeof body.name === 'string' ? body.name.trim() : '';
	const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
	const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';

	if (rawEmail.length === 0 || rawEmail.length > SUPPORT_EMAIL_MAX_LENGTH) return null;
	if (!EMAIL_PATTERN.test(rawEmail)) return null;
	if (hasControlCharacters(rawEmail) || hasControlCharacters(rawName)) return null;
	if (rawName.length > SUPPORT_NAME_MAX_LENGTH) return null;
	if (rawMessage.length < SUPPORT_MESSAGE_MIN_LENGTH) return null;
	if (rawMessage.length > SUPPORT_MESSAGE_MAX_LENGTH) return null;

	return { name: rawName, email: rawEmail, message: rawMessage };
}

export function composeSupportEmail(request: SupportRequest): {
	subject: string;
	body: string;
} {
	const name = request.name || 'Not provided';
	return {
		subject: 'CostCook question from the website',
		body: [
			'Someone asked a question from the CostCook website contact page.',
			'',
			`Name: ${name}`,
			`Reply to: ${request.email}`,
			'',
			'Message:',
			request.message
		].join('\n')
	};
}
