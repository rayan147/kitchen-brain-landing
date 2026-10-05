import { Sequence, useVideoConfig } from "remotion";
import { Caption } from "../elements/Caption";
import { ChapterCard } from "../elements/ChapterCard";
import { Highlight } from "../elements/Highlight";
import { Screen } from "../elements/Screen";
import { FILM, captionsFor } from "../film";
import { useManifest } from "../useManifest";

export const Charge: React.FC = () => {
  const { fps } = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const [caption] = captionsFor("charge", manifest);
  return (
    <>
      <Sequence name="Chapter" durationInFrames={2 * fps} premountFor={fps}>
        <ChapterCard question={FILM.charge.chapter ?? ""} />
      </Sequence>
      <Sequence name="Pricing panel" from={2 * fps} premountFor={fps}>
        <Screen
          src={FILM.charge.frames[0]}
          focus={{ x: 50, y: 40, scale: 1.12 }}
        />
        <Sequence name="Food cost ring" from={2 * fps} premountFor={fps}>
          <Highlight x={36} y={30} width={26} height={24} />
        </Sequence>
        <Sequence name="Caption" from={fps} premountFor={fps}>
          <Caption text={caption} />
        </Sequence>
      </Sequence>
    </>
  );
};
