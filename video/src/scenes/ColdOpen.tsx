import {
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "../elements/Caption";
import { PhoneFrame } from "../elements/PhoneFrame";
import { Screen } from "../elements/Screen";
import { FILM, captionsFor } from "../film";
import { FONT_DISPLAY } from "../fonts";
import { C, EASE_OUT, TYPE } from "../tokens";
import { useManifest } from "../useManifest";

export const ColdOpen: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const manifest = useManifest();
  if (!manifest) return null;
  const [caption] = captionsFor("coldOpen", manifest);
  return (
    <>
      <Sequence name="Title" durationInFrames={2 * fps} premountFor={fps}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: C.cream,
            display: "grid",
            placeItems: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              maxWidth: 1300,
              textAlign: "center",
              fontFamily: FONT_DISPLAY,
              fontWeight: 400,
              fontSize: TYPE.title,
              lineHeight: 1.05,
              color: C.ink,
              opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_OUT),
              }),
            }}
          >
            Know what the job makes before you cook it.
          </h1>
        </div>
      </Sequence>
      <Sequence name="Inquiry" from={2 * fps} premountFor={fps}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: C.offwhite,
            display: "grid",
            alignItems: "center",
            justifyItems: "end",
            paddingRight: 240,
          }}
        >
          <PhoneFrame
            style={{
              translate: interpolate(
                frame,
                [2 * fps, 2.6 * fps],
                ["0px 160px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                },
              ),
            }}
          >
            <Screen
              fit="fill-top"
              src={FILM.coldOpen.frames[0]}
              scroll={[0, 45]}
            />
          </PhoneFrame>
        </div>
        <Sequence name="Caption" from={0.5 * fps} premountFor={fps}>
          <Caption text={caption} />
        </Sequence>
      </Sequence>
    </>
  );
};
