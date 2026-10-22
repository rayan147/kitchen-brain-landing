// Considered Composite; not used because this is a fixed ordered list, not a tree.
// Homepage order is shared with the rendered-page checks.
export const stops = [
  { id: 'event-walk', label: 'Follow one wedding' },
  { id: 'kitchen', label: 'Food cost' },
  { id: 'connections', label: 'Payments and connections' },
  { id: 'start', label: 'Start here' }
] as const;
export type StopId = (typeof stops)[number]['id'];
export function nextStop(id: StopId) {
  const index = stops.findIndex((stop) => stop.id === id);
  return index >= 0 ? stops[index + 1] : undefined;
}
