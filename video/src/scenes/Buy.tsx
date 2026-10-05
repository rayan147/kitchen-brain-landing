import { Sequence, useVideoConfig } from "remotion";
import { Caption } from "../elements/Caption";
import { ChapterCard } from "../elements/ChapterCard";
import { Screen } from "../elements/Screen";
import { FILM, captionsFor } from "../film";
import { useManifest } from "../useManifest";

export const Buy: React.FC = () => {
  const { fps } = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const [caption] = captionsFor("buy", manifest);
  return (
    <>
      <Sequence name="Chapter" durationInFrames={2 * fps} premountFor={fps}>
        <ChapterCard question={FILM.buy.chapter ?? ""} />
      </Sequence>
      <Sequence name="Screen" from={2 * fps} premountFor={fps}>
        <Screen src={FILM.buy.frames[0]} focus={{ x: 50, y: 20, scale: 1.1 }} />
        <Sequence name="Caption" from={fps} premountFor={fps}>
          <Caption text={caption} />
        </Sequence>
      </Sequence>
    </>
  );
};
