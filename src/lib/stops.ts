// Considered Composite; not used because this is a fixed ordered list, not a tree.
// Homepage order is shared with the next-section links. Story: homepage-caterer-fixes.
export const stops = [
  { id: 'outcomes', label: 'One connected plan' },
  { id: 'demo', label: 'See it run' },
  { id: 'problem', label: 'Trust the numbers' },
  { id: 'yield', label: 'Trim and yield' },
  { id: 'trust', label: 'Who made it' },
  { id: 'who', label: 'Who this is for' },
  { id: 'more', label: 'What else is in it' },
  { id: 'alternatives', label: 'What is still coming' },
  { id: 'start', label: 'Start here' }
] as const;
export type StopId = (typeof stops)[number]['id'];
export function nextStop(id: StopId) {
  const index = stops.findIndex((stop) => stop.id === id);
  return index >= 0 ? stops[index + 1] : undefined;
}
