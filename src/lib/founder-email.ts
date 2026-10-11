/**
 * The founder's address, in a module with no Vite env access and no imports,
 * so the serverless contact function (api/support.ts, run as a plain ES module
 * on Vercel) can read it without pulling in site.ts, which reads
 * import.meta.env. site.email re-exports this value, so it stays the one source.
 *
 * Considered a Facade over site.ts for the function; not used because one
 * constant needs no interface, only a home both runtimes can load.
 */
export const founderEmail = 'rayan@costcook.io';
