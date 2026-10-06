// What stops a render: a frame the film names that is missing on disk, a file
// the capture record does not list, a frame with no recorded source (host and
// app), or the pre-capture placeholder manifest. It cannot tell a cropped or
// browser-extension capture from a scripted one: frameSources in
// public/proof/film/manifest.json says which are which.
export function frameProblems(
  filmFrames: string[],
  manifest: {
    developCommit: string;
    frames: string[];
    frameSources: Record<string, { host: string; app: string }>;
  },
  onDisk: Set<string>,
): string[] {
  if (manifest.developCommit === "PENDING-CAPTURE")
    return ["manifest is the pre-capture placeholder"];
  const shot = new Set(manifest.frames);
  return filmFrames.flatMap((f) =>
    !onDisk.has(f)
      ? [`missing frame ${f}`]
      : !shot.has(f)
        ? [`${f} was not shot from the app by this capture run`]
        : !manifest.frameSources[f]
          ? [`${f} has no recorded source (host and app)`]
          : [],
  );
}

/** The film's frames counted by where they came from, most first. */
export function sourceCounts(
  filmFrames: string[],
  sources: Record<string, { host: string; app: string }>,
): string[] {
  const counts = new Map<string, number>();
  for (const f of filmFrames) {
    const s = sources[f];
    if (!s) continue;
    const key = `${s.host} at ${s.app}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1])
    .map(([key, n]) => `${n} from ${key}`);
}
