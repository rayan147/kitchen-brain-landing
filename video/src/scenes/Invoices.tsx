import { Sequence, useVideoConfig } from "remotion";
import { Caption } from "../elements/Caption";
import { ChapterCard } from "../elements/ChapterCard";
import { Screen } from "../elements/Screen";
import { FILM, captionsFor } from "../film";
import { useManifest } from "../useManifest";

export const Invoices: React.FC = () => {
  const { fps } = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const [caption] = captionsFor("invoices", manifest);
  return (
    <>
      <Sequence name="Chapter" durationInFrames={2 * fps} premountFor={fps}>
        <ChapterCard question={FILM.invoices.chapter ?? ""} />
      </Sequence>
      <Sequence name="Screen" from={2 * fps} premountFor={fps}>
        <Screen
          src={FILM.invoices.frames[0]}
          focus={{ x: 50, y: 40, scale: 1.05 }}
        />
        <Sequence name="Caption" from={fps} premountFor={fps}>
          <Caption text={caption} />
        </Sequence>
      </Sequence>
    </>
  );
};
