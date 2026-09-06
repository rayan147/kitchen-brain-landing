/**
 * Demo-request shape, shared by the browser form and the serverless function
 * behind it, so the two cannot drift on what counts as a valid request.
 *
 * WHY THIS EXISTS. /demo never sent anything. Its submit handler built a
 * mailto: string and set window.location.href, so a request arrived only if the
 * visitor had a configured mail client, noticed the draft, and pressed send.
 * The reader this site is written for is on a phone mid-shift, where that is a
 * coin flip, and support@costcook.io was never a recipient at all. The page
 * said so out loud rather than fixing it: "CostCook has not claimed your
 * request was sent."
 *
 * This is src/lib/support.ts with a different payload. The validation rules are
 * deliberately the same rules, not similar ones: a permissive email pattern,
 * control characters refused everywhere a value can reach a mail header, and a
 * length cap on every field. Two forms on one site that disagree about what a
 * valid email is would be a bug waiting for whichever one is wrong.
 *
 * Considered folding this into src/lib/support.ts behind a discriminated union;
 * not used because the two forms ask different questions of different people
 * and the only genuinely shared thing is the validation vocabulary, which is
 * forty lines. A union would couple the contact form's wire shape to every
 * future change in the demo form's questions.
 */

/**
 * Both mailboxes, because they answer different questions. Rayan runs the call;
 * support@ is the address the app and the contact form already write to, so a
 * request that arrives while he is on a job still has a record someone can find.
 */
export const DEMO_RECIPIENTS = ['rayan@costcook.io', 'support@costcook.io'] as const;

export const DEMO_NAME_MAX_LENGTH = 80;
export const DEMO_EMAIL_MAX_LENGTH = 254;
export const DEMO_BUSINESS_MAX_LENGTH = 100;
export const DEMO_PHONE_MAX_LENGTH = 40;
export const DEMO_CHOICE_MAX_LENGTH = 60;
export const DEMO_WORKFLOW_MAX_LENGTH = 600;

/**
 * The bot trap's field name. It is NOT `company`, which is what api/support.ts
 * uses, and that is the whole point of it being a named constant.
 *
 * This form already carries <input name="business" autocomplete="organization">,
 * so Chrome reads it as an address profile, and its autofill heuristics map a
 * field named `company` to ORGANIZATION. A real caterer with autofill on would
 * have filled the trap, been answered 200, and been told their request was on
 * its way while nothing was sent. Every guard in this repo would still have
 * passed. `ticketRef` means nothing to any autofill heuristic.
 */
export const DEMO_TRAP_FIELD = 'ticketRef';

export type DemoRequest = {
	business: string;
	role: string;
	kitchen: string;
	locations: string;
	workflow: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
};

export type DemoResponse = {
	ok: boolean;
	message?: string;
};

/**
 * One sentence each, reused by the endpoint and the form, so a visitor is never
 * told two different things about the same rejected request.
 */
export const DEMO_INVALID_MESSAGE =
	'Check your business name, your name, and your email, then send again.';
export const DEMO_FAILED_MESSAGE =
	'Your request could not be sent. Everything you typed is still here, so please try again.';
export const DEMO_THROTTLED_MESSAGE =
	'That is a few requests in quick succession. Give it a minute, then send again.';

/** Same pattern as the contact form's, for the reason given in src/lib/support.ts. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * A line break in a value that reaches a mail header is header injection, so
 * any control character is refused. The free-text answer is the one exception:
 * newlines are the point of a textarea, and it only ever reaches the body.
 */
const hasControlCharacters = (value: string): boolean =>
	// eslint-disable-next-line no-control-regex
	/[\u0000-\u001f\u007f]/.test(value);

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** Every field that reaches the subject line or a mail header. */
const HEADER_SAFE_FIELDS = [
	'business',
	'role',
	'kitchen',
	'locations',
	'firstName',
	'lastName',
	'email',
	'phone'
] as const;

export function validateDemoRequest(value: unknown): DemoRequest | null {
	if (typeof value !== 'object' || value === null) return null;
	const body = value as Record<string, unknown>;

	const request: DemoRequest = {
		business: text(body.business),
		role: text(body.role),
		kitchen: text(body.kitchen),
		locations: text(body.locations),
		workflow: text(body.workflow),
		firstName: text(body.firstName),
		lastName: text(body.lastName),
		email: text(body.email),
		phone: text(body.phone)
	};

	// The six non-email fields the form marks required are required here too.
	// Trusting the browser's `required` attribute is trusting the caller, and
	// this endpoint is reachable by anyone who finds the URL.
	for (const field of [
		'business',
		'role',
		'kitchen',
		'locations',
		'firstName',
		'lastName'
	] as const) {
		if (request[field].length === 0) return null;
	}
	if (request.email.length === 0 || request.email.length > DEMO_EMAIL_MAX_LENGTH) return null;
	if (!EMAIL_PATTERN.test(request.email)) return null;

	if (request.business.length > DEMO_BUSINESS_MAX_LENGTH) return null;
	if (request.firstName.length > DEMO_NAME_MAX_LENGTH) return null;
	if (request.lastName.length > DEMO_NAME_MAX_LENGTH) return null;
	if (request.phone.length > DEMO_PHONE_MAX_LENGTH) return null;
	if (request.workflow.length > DEMO_WORKFLOW_MAX_LENGTH) return null;
	for (const field of ['role', 'kitchen', 'locations'] as const) {
		if (request[field].length > DEMO_CHOICE_MAX_LENGTH) return null;
	}

	for (const field of HEADER_SAFE_FIELDS) {
		if (hasControlCharacters(request[field])) return null;
	}

	return request;
}

export function composeDemoEmail(request: DemoRequest): { subject: string; body: string } {
	return {
		subject: `CostCook demo request: ${request.business}`,
		body: [
			'Someone asked for a 15-minute demo from the CostCook website.',
			'',
			`Name: ${request.firstName} ${request.lastName}`,
			`Reply to: ${request.email}`,
			`Phone: ${request.phone || 'Not provided'}`,
			'',
			`Business: ${request.business}`,
			`Role: ${request.role}`,
			`Kitchen type: ${request.kitchen}`,
			`Locations: ${request.locations}`,
			'',
			'What to put through CostCook:',
			request.workflow || 'Not provided',
			'',
			// The booking is Google's, not ours, and the two arrive separately.
			// Saying so here stops a request with no matching invitation from
			// reading as a bug in the form.
			'They were shown the booking calendar on the page after this was sent.',
			'A confirmed time arrives separately, from Google Calendar.'
		].join('\n')
	};
}
