import { useEffect, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import { ManifestSchema, type Manifest } from "./manifest";

// The manifest is parsed, never cast: a missing figure stops the render here
// instead of printing "undefined" into a caption.
export function useManifest(): Manifest | null {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [handle] = useState(() => delayRender("manifest"));
  useEffect(() => {
    fetch(staticFile("frames/manifest.json"))
      .then((r) => r.json())
      .then((json: unknown) => {
        setManifest(ManifestSchema.parse(json));
        continueRender(handle);
      })
      // Without this a parse failure left the manifest null and the render
      // carried on: a blank film with music.
      .catch((err: unknown) => cancelRender(err));
  }, [handle]);
  return manifest;
}
