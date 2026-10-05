import { Sequence, useVideoConfig } from "remotion";
import { Caption } from "../elements/Caption";
import { EndCard } from "../elements/EndCard";
import { Highlight } from "../elements/Highlight";
import { Screen } from "../elements/Screen";
import { FILM, captionsFor } from "../film";
import { useManifest } from "../useManifest";

// The callback: the same pricing frame scene 1 opened on, so the last figure
// the viewer reads is the one the caterer quoted from.
export const Close: React.FC = () => {
  const { fps } = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const [caption] = captionsFor("close", manifest);
  return (
    <>
      <Sequence name="Callback" durationInFrames={10 * fps} premountFor={fps}>
        <Screen
          src={FILM.close.frames[0]}
          focus={{ x: 50, y: 40, scale: 1.12 }}
        />
        <Highlight x={36} y={30} width={26} height={24} />
        <Sequence name="Caption" from={fps} premountFor={fps}>
          <Caption text={caption} />
        </Sequence>
      </Sequence>
      <Sequence name="End card" from={10 * fps} premountFor={fps}>
        <EndCard
          displayPrice={manifest.displayPrice}
          trialDays={manifest.trialDays}
        />
      </Sequence>
    </>
  );
};
