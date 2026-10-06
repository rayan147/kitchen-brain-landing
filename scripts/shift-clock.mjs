// Moves the capture app's server clock to SHIFT_CLOCK_TO, so a local copy sees
// the day after the event and opens the food-cost closeout for the real
// wedding without editing a date in the data. Set both variables inline on the
// one command that starts the capture app, never exported in a shell: every
// child Node process inherits NODE_OPTIONS, and a daily sweep running on the
// shifted day would act on it (the Dec 28 balance reminder, for one).
//
//   SHIFT_CLOCK_TO=2026-12-29T20:00:00Z NODE_OPTIONS="--import <this file>" npm run preview
//
// It refuses to load unless the app points at a local file database under
// e2e/.scratch (a capture copy). Only the JavaScript clock moves: SQL now() and
// performance timers do not.
//
// Considered Proxy over Date; not used because a function that wraps two entry
// points (construction with no arguments, and now()) is the whole need.
const target = Date.parse(process.env.SHIFT_CLOCK_TO ?? '');
if (Number.isNaN(target)) throw new Error('SHIFT_CLOCK_TO must be an ISO date-time');
const db = process.env.DATABASE_URL ?? '';
if (process.env.TURSO_DATABASE_URL || !/^file:.*\.scratch\//.test(db))
	throw new Error(`shift-clock loads only against a local capture database (file:...e2e/.scratch/...), not "${db}"`);

const RealDate = Date;
const offset = target - RealDate.now();
const shiftedNow = () => RealDate.now() + offset;

// A plain function, not a class: app code may call Date() without new, which
// returns a string and would throw on a class constructor.
function ShiftedDate(...args) {
	if (!new.target) return new RealDate(shiftedNow()).toString();
	return args.length === 0 ? new RealDate(shiftedNow()) : new RealDate(...args);
}
ShiftedDate.prototype = RealDate.prototype;
ShiftedDate.now = shiftedNow;
ShiftedDate.parse = RealDate.parse;
ShiftedDate.UTC = RealDate.UTC;
globalThis.Date = ShiftedDate;
