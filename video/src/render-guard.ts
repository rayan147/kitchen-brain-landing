// What stops a render: a frame the film names that is missing on disk, a file
// on disk that the capture run did not shoot from the app (a mock, a crop, or
// a leftover from an older build), or the pre-capture placeholder manifest.
export function frameProblems(
  filmFrames: string[],
  manifest: { developCommit: string; frames: string[] },
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
        : [],
  );
}
