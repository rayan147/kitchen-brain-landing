import { useEffect, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import type { Film, FilmManifest } from "./film-model";

// The manifest is parsed, never cast: a missing figure stops the render here
// instead of printing "undefined" into a caption.
export function useManifest(film: Film): FilmManifest | null {
  const [manifest, setManifest] = useState<FilmManifest | null>(null);
  const [handle] = useState(() => delayRender("manifest"));
  useEffect(() => {
    fetch(staticFile(`${film.framesDir}/manifest.json`))
      .then((r) => r.json())
      .then((json: unknown) => {
        setManifest(film.parseManifest(json));
        continueRender(handle);
      })
      // Without this a parse failure left the manifest null and the render
      // carried on: a blank film with music.
      .catch((err: unknown) => cancelRender(err));
  }, [film, handle]);
  return manifest;
}
