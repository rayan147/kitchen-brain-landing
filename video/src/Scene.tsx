import {
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "./elements/Caption";
import { ChapterCard } from "./elements/ChapterCard";
import { EndCard } from "./elements/EndCard";
import { Highlight } from "./elements/Highlight";
import { Logo } from "./elements/Logo";
import { PhoneFrame } from "./elements/PhoneFrame";
import { Screen } from "./elements/Screen";
import { SplitScreen } from "./elements/SplitScreen";
import {
  CHAPTER_SECONDS,
  FILM,
  TITLE,
  resolveCaption,
  type Beat,
  type SceneId,
} from "./film";
import { FONT_DISPLAY } from "./fonts";
import type { Manifest } from "./manifest";
import { C, EASE_OUT, TYPE } from "./tokens";
import { useManifest } from "./useManifest";

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: C.cream,
        display: "grid",
        placeItems: "center",
        alignContent: "center",
        rowGap: 48,
      }}
    >
      <Logo size={44} />
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
        {TITLE}
      </h1>
    </div>
  );
};

// A screen with what the beat asks of it: the camera's focus and the ring on
// what the caption names. The ring rides inside the camera so it stays on its
// number while the frame pushes in.
const Shot: React.FC<{ beat: Beat; src: string; phone?: boolean }> = ({
  beat,
  src,
  phone,
}) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Screen
      src={src}
      fit={phone ? "fill-top" : "contain"}
      scroll={phone ? beat.scroll : undefined}
      focus={phone ? undefined : beat.focus}
    >
      {beat.ring ? <Highlight {...beat.ring} /> : null}
    </Screen>
  </div>
);

const BeatView: React.FC<{
  beat: Beat;
  manifest: Manifest;
  fadeIn: boolean;
}> = ({ beat, manifest, fadeIn }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const [first, second] = beat.frames;
  const length = Math.round((beat.to - beat.from) * fps);
  const captionFrom = Math.round(0.5 * fps);
  const body =
    beat.layout === "title" ? (
      <Title />
    ) : beat.layout === "end" ? (
      <EndCard
        displayPrice={manifest.displayPrice}
        trialDays={manifest.trialDays}
      />
    ) : beat.layout === "phone" ? (
      // Same place as the phone in a split screen, with the left side empty
      // for the caption.
      <SplitScreen
        left={null}
        right={
          <PhoneFrame>
            <Shot beat={beat} src={first} phone />
          </PhoneFrame>
        }
        style={{ backgroundColor: C.offwhite }}
      />
    ) : beat.layout === "split" ? (
      <SplitScreen
        left={<Screen src={first} focus={beat.focus} />}
        right={
          <PhoneFrame>
            <Shot beat={beat} src={second} phone />
          </PhoneFrame>
        }
      />
    ) : (
      <Shot beat={beat} src={first} />
    );
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          // After a chapter card the UI fades up instead of cutting in.
          opacity: fadeIn
            ? interpolate(frame, [0, 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1,
        }}
      >
        {body}
      </div>
      {beat.caption ? (
        <Sequence
          name="Caption"
          from={captionFrom}
          durationInFrames={length - captionFrom}
          premountFor={fps}
        >
          <Caption
            text={resolveCaption(beat.caption, manifest)}
            duration={length - captionFrom}
            maxWidth={
              beat.layout === "split" || beat.layout === "phone" ? 1000 : 1400
            }
          />
        </Sequence>
      ) : null}
    </>
  );
};

// Pattern: none. One renderer reads a scene's beats from film.ts; every scene
// is the same shape, so the variation lives in the table, not in components.
export const Scene: React.FC<{ id: SceneId }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const scene = FILM[id];
  return (
    <>
      {scene.chapter ? (
        <Sequence
          name="Chapter"
          durationInFrames={CHAPTER_SECONDS * fps}
          premountFor={fps}
        >
          <ChapterCard question={scene.chapter} />
        </Sequence>
      ) : null}
      {scene.beats.map((beat, i) => (
        <Sequence
          key={i}
          name={beat.caption ?? beat.layout}
          from={Math.round(beat.from * fps)}
          durationInFrames={Math.round((beat.to - beat.from) * fps)}
          premountFor={fps}
        >
          <BeatView
            beat={beat}
            manifest={manifest}
            fadeIn={Boolean(scene.chapter) && beat.from === CHAPTER_SECONDS}
          />
        </Sequence>
      ))}
    </>
  );
};
