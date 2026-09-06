import { connect, type Socket } from 'node:net';

/**
 * Loopback SMTP capture transport, for local development only.
 *
 * Ported from kitchen-brain's src/lib/server/email/smtp.ts, and kept as close
 * to it as the smaller job allows. Working on the contact form otherwise means
 * either a real Resend key on a developer's machine, or never seeing the mail
 * the form actually produces. Mailpit on 127.0.0.1:1025 is the capture point,
 * and this module is the whole transport: a deliberately small SMTP client
 * rather than a mail dependency, because it may only ever speak to a loopback
 * capture server.
 *
 * ANYTHING THAT IS NOT LOOPBACK IS REFUSED BEFORE A SOCKET OPENS. That is the
 * property that makes this safe to ship in the same file tree as the production
 * sender: this path cannot be misconfigured into delivering real mail, because
 * it will not open a connection to anywhere that could.
 *
 * Simplified from the app's version in one way, deliberately: the landing form
 * composes plain text only, so there is no multipart branch here. If an HTML
 * body is ever added, port that branch across rather than inventing a second
 * one.
 */

// The app's list also carries the Compose-internal name `mailpit`. This site
// has no compose file, so the hostnames are the ones a developer can actually
// reach from their own machine.
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export interface SmtpMessage {
	from: string;
	/**
	 * One address or several. The demo request goes to two mailboxes in one
	 * message, so a single RCPT TO would have quietly dropped the second: the
	 * To: header would still have listed both and the capture would have looked
	 * complete. One conversation, one RCPT TO per recipient.
	 */
	to: string | string[];
	subject: string;
	text: string;
	replyTo?: string;
}

/** "Name <addr>" to addr, for the SMTP envelope; headers keep the full form. */
const extractSmtpEnvelopeAddress = (value: string): string => {
	const match = value.match(/<([^>]+)>/);
	return match ? match[1] : value.trim();
};

/** Dot-stuff and normalise line endings per RFC 5321 section 4.5.2. */
const encodeSmtpMessageBody = (raw: string): string =>
	raw.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..');

/** Every recipient, in header order, for both the header and the envelope. */
const recipientsOf = (to: SmtpMessage['to']): string[] => (Array.isArray(to) ? to : [to]);

const buildMimeMessage = (message: SmtpMessage): string => {
	const headers = [
		`From: ${message.from}`,
		`To: ${recipientsOf(message.to).join(', ')}`,
		`Subject: ${message.subject}`,
		...(message.replyTo ? [`Reply-To: ${message.replyTo}`] : []),
		'MIME-Version: 1.0',
		'Content-Type: text/plain; charset=utf-8'
	];
	return `${headers.join('\r\n')}\r\n\r\n${encodeSmtpMessageBody(message.text)}`;
};

/**
 * One SMTP conversation: greeting, HELO, MAIL FROM, RCPT TO, DATA, QUIT.
 * Every reply is checked, so a failed capture throws rather than looking sent.
 * That is the same contract the Resend branch keeps, and it is the reason the
 * endpoint can treat both transports identically.
 */
export async function sendViaLoopbackSmtp(url: string, message: SmtpMessage): Promise<void> {
	const target = new URL(url);
	if (target.protocol !== 'smtp:' || !LOOPBACK_HOSTS.has(target.hostname)) {
		throw new Error(
			`SMTP_URL must be a loopback smtp:// capture server (got ${url}): this transport never delivers real mail`
		);
	}
	const port = Number(target.port || 25);

	const socket: Socket = connect({ host: target.hostname.replace(/^\[|\]$/g, ''), port });
	socket.setEncoding('utf8');

	let buffer = '';
	const receivedReplies: string[] = [];
	const pendingResolvers: Array<(line: string) => void> = [];
	socket.on('data', (chunk: string) => {
		buffer += chunk;
		let index = buffer.indexOf('\r\n');
		while (index !== -1) {
			const line = buffer.slice(0, index);
			buffer = buffer.slice(index + 2);
			// Multi-line replies ("250-...") continue; only the final "250 " line
			// completes the pending command.
			if (!/^\d{3}-/.test(line)) {
				const resolvePending = pendingResolvers.shift();
				if (resolvePending) resolvePending(line);
				else receivedReplies.push(line);
			}
			index = buffer.indexOf('\r\n');
		}
	});

	const waitForNextReply = (): Promise<string> => {
		const buffered = receivedReplies.shift();
		if (buffered !== undefined) return Promise.resolve(buffered);

		return new Promise<string>((resolve, reject) => {
			const cleanup = () => {
				clearTimeout(timer);
				socket.off('error', onError);
				socket.off('close', onClose);
				const index = pendingResolvers.indexOf(onReply);
				if (index !== -1) pendingResolvers.splice(index, 1);
			};
			const onError = (error: Error) => {
				cleanup();
				reject(error);
			};
			const onClose = () => {
				cleanup();
				reject(new Error('SMTP capture server closed before replying'));
			};
			const timer = setTimeout(() => {
				cleanup();
				reject(new Error('SMTP capture server timed out'));
			}, 10_000);
			const onReply = (line: string) => {
				cleanup();
				resolve(line);
			};
			socket.once('error', onError);
			socket.once('close', onClose);
			pendingResolvers.push(onReply);
		});
	};

	const command = async (line: string, accepted: RegExp): Promise<void> => {
		socket.write(`${line}\r\n`);
		const answer = await waitForNextReply();
		if (!accepted.test(answer)) {
			throw new Error(`SMTP refused "${line.split(' ')[0]}": ${answer}`);
		}
	};

	try {
		const greeting = await waitForNextReply();
		if (!greeting.startsWith('220')) throw new Error(`SMTP greeting failed: ${greeting}`);
		await command('HELO costcook.local', /^250/);
		await command(`MAIL FROM:<${extractSmtpEnvelopeAddress(message.from)}>`, /^250/);
		for (const recipient of recipientsOf(message.to)) {
			await command(`RCPT TO:<${extractSmtpEnvelopeAddress(recipient)}>`, /^250/);
		}
		await command('DATA', /^354/);
		await command(`${buildMimeMessage(message)}\r\n.`, /^250/);
		await command('QUIT', /^221/);
	} finally {
		socket.destroy();
	}
}
