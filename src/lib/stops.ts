// Considered Composite; not used because this is a fixed ordered list, not a tree.
// Homepage order is shared with the next-section links. Story: homepage-caterer-fixes.
export const stops = [
  { id: 'event-walk', label: 'One event, start to booked' },
  { id: 'kitchen', label: 'Costs, buys and labels' },
  { id: 'front', label: 'Orders and invoices' },
  { id: 'sage', label: 'Ask your kitchen' },
  { id: 'start', label: 'Start here' }
] as const;
export type StopId = (typeof stops)[number]['id'];
export function nextStop(id: StopId) {
  const index = stops.findIndex((stop) => stop.id === id);
  return index >= 0 ? stops[index + 1] : undefined;
}
