// Considered Strategy; not used because index intent is fixed route data,
// shared by sitemap generation and the postbuild guard.
export const nonIndexablePaths = [
	'/contact/sent',
	'/contact/not-sent',
	'/demo/sent',
	'/demo/not-sent'
];

export function isNonIndexablePath(pathname) {
	// Considered Set; not used because this list is capped at four form outcomes.
	return nonIndexablePaths.includes(pathname.replace(/\/$/, '') || '/');
}
