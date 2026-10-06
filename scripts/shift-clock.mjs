// Moves the capture app's server clock to SHIFT_CLOCK_TO, so a local copy sees
// the day after the event and opens the food-cost closeout for the real
// wedding without editing a date in the data. Loaded only by the capture run:
//
//   SHIFT_CLOCK_TO=2026-12-29T20:00:00Z NODE_OPTIONS="--import <this file>" npm run preview
//
// Considered Proxy over Date; not used because a subclass that changes two
// entry points (no-argument construction and now()) is the whole need.
const target = Date.parse(process.env.SHIFT_CLOCK_TO ?? '');
if (Number.isNaN(target)) throw new Error('SHIFT_CLOCK_TO must be an ISO date-time');
const RealDate = Date;
const offset = target - RealDate.now();
class ShiftedDate extends RealDate {
	constructor(...args) {
		if (args.length === 0) super(RealDate.now() + offset);
		else super(...args);
	}
	static now() {
		return RealDate.now() + offset;
	}
}
globalThis.Date = ShiftedDate;
