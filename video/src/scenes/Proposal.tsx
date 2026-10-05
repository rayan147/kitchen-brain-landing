import { Sequence, useVideoConfig } from "remotion";
import { Caption } from "../elements/Caption";
import { ChapterCard } from "../elements/ChapterCard";
import { Highlight } from "../elements/Highlight";
import { PhoneFrame } from "../elements/PhoneFrame";
import { Screen } from "../elements/Screen";
import { SplitScreen } from "../elements/SplitScreen";
import { FILM, captionsFor } from "../film";
import { useManifest } from "../useManifest";

export const Proposal: React.FC = () => {
  const { fps } = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const [sent, decide] = captionsFor("proposal", manifest);
  const [sentFrame, offerFrame] = FILM.proposal.frames;
  return (
    <>
      <Sequence name="Chapter" durationInFrames={2 * fps} premountFor={fps}>
        <ChapterCard question={FILM.proposal.chapter ?? ""} />
      </Sequence>
      <Sequence name="Split" from={2 * fps} premountFor={fps}>
        <SplitScreen
          left={<Screen src={sentFrame} />}
          right={
            <PhoneFrame>
              <Screen fit="fill-top" src={offerFrame} scroll={[0, 100]} />
              <Sequence name="Accept ring" from={7 * fps} premountFor={fps}>
                <Highlight x={36} y={91} width={60} height={7} />
              </Sequence>
            </PhoneFrame>
          }
        />
        <Sequence
          name="Sent caption"
          from={fps}
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Caption text={sent} />
        </Sequence>
        <Sequence name="Decide caption" from={7 * fps} premountFor={fps}>
          <Caption text={decide} />
        </Sequence>
      </Sequence>
    </>
  );
};
