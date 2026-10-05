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
import { PhoneFrame } from "./elements/PhoneFrame";
import { Screen } from "./elements/Screen";
import { SplitScreen } from "./elements/SplitScreen";
import {
  CHAPTER_SECONDS,
  FILM,
  resolveCaption,
  type Beat,
  type SceneId,
} from "./film";
import { FONT_DISPLAY } from "./fonts";
import type { Manifest } from "./manifest";
import { C, EASE_OUT, TYPE } from "./tokens";
import { useManifest } from "./useManifest";

const TITLE = "Know what the job makes before you cook it.";

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
        {TITLE}
      </h1>
    </div>
  );
};

const Phone: React.FC<{
  src: string;
  scroll?: [number, number];
  ring?: Beat["ring"];
}> = ({ src, scroll, ring }) => (
  <PhoneFrame>
    <Screen fit="fill-top" src={src} scroll={scroll} />
    {ring ? <Highlight {...ring} /> : null}
  </PhoneFrame>
);

const BeatView: React.FC<{ beat: Beat; manifest: Manifest }> = ({
  beat,
  manifest,
}) => {
  const { fps } = useVideoConfig();
  const [first, second] = beat.frames;
  const body =
    beat.layout === "title" ? (
      <Title />
    ) : beat.layout === "end" ? (
      <EndCard
        displayPrice={manifest.displayPrice}
        trialDays={manifest.trialDays}
      />
    ) : beat.layout === "phone" ? (
      // The phone sits right of centre so the caption on the left never covers it.
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
        <Phone src={first} scroll={beat.scroll} ring={beat.ring} />
      </div>
    ) : beat.layout === "split" ? (
      <SplitScreen
        left={<Screen src={first} />}
        right={<Phone src={second} scroll={beat.scroll} ring={beat.ring} />}
      />
    ) : (
      <>
        <Screen src={first} />
        {beat.ring ? <Highlight {...beat.ring} /> : null}
      </>
    );
  return (
    <>
      {body}
      {beat.caption ? (
        <Sequence name="Caption" from={Math.round(0.5 * fps)} premountFor={fps}>
          <Caption text={resolveCaption(beat.caption, manifest)} />
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
          <BeatView beat={beat} manifest={manifest} />
        </Sequence>
      ))}
    </>
  );
};
