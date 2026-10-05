import { Sequence, useVideoConfig } from "remotion";
import { Caption } from "../elements/Caption";
import { ChapterCard } from "../elements/ChapterCard";
import { Highlight } from "../elements/Highlight";
import { PhoneFrame } from "../elements/PhoneFrame";
import { Screen } from "../elements/Screen";
import { SplitScreen } from "../elements/SplitScreen";
import { FILM, captionsFor } from "../film";
import { useManifest } from "../useManifest";

export const Deposit: React.FC = () => {
  const { fps } = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const [request, reminder, snap, freeze] = captionsFor("deposit", manifest);
  const [requestFrame, payFrame, paidFrame, reminderFrame, confirmFrame] =
    FILM.deposit.frames;
  return (
    <>
      <Sequence name="Chapter" durationInFrames={2 * fps} premountFor={fps}>
        <ChapterCard question={FILM.deposit.chapter ?? ""} />
      </Sequence>
      <Sequence
        name="Request and pay"
        from={2 * fps}
        durationInFrames={5 * fps}
        premountFor={fps}
      >
        <SplitScreen
          left={<Screen src={requestFrame} />}
          right={
            <PhoneFrame>
              <Screen fit="fill-top" src={payFrame} />
            </PhoneFrame>
          }
        />
        <Sequence name="Request caption" from={0.5 * fps} premountFor={fps}>
          <Caption text={request} />
        </Sequence>
      </Sequence>
      <Sequence
        name="Paid"
        from={7 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <Screen src={paidFrame} />
      </Sequence>
      <Sequence
        name="Reminder"
        from={10 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <Screen src={reminderFrame} />
        <Sequence name="Reminder caption" from={0.3 * fps} premountFor={fps}>
          <Caption text={reminder} />
        </Sequence>
      </Sequence>
      <Sequence name="Confirm order" from={13 * fps} premountFor={fps}>
        <Screen src={confirmFrame} />
        <Sequence name="Confirm ring" from={0.5 * fps} premountFor={fps}>
          <Highlight x={66} y={78} width={24} height={12} />
        </Sequence>
        <Sequence
          name="Snap caption"
          durationInFrames={1.5 * fps}
          premountFor={fps}
        >
          <Caption text={snap} />
        </Sequence>
        <Sequence name="Freeze caption" from={1.5 * fps} premountFor={fps}>
          <Caption text={freeze} />
        </Sequence>
      </Sequence>
    </>
  );
};
