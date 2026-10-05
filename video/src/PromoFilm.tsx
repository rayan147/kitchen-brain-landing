import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import { FADE_FRAMES, FILM, SCENE_ORDER, filmFrames } from "./film";
import { Scene } from "./Scene";

// The scenes come from film.ts in the app's own workflow order. They are
// generated from that one table on purpose: their timing is edited there, so
// the film, the VTT and the render guard read the same numbers.
export const PromoFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  const total = filmFrames();
  return (
    <>
      <Audio
        name="Music bed"
        src={staticFile("audio/bed.mp3")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [total - 30, total], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <TransitionSeries>
        {SCENE_ORDER.map((id, i) => (
          <Fragment key={id}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: FADE_FRAMES })}
              />
            ) : null}
            <TransitionSeries.Sequence
              name={id}
              durationInFrames={FILM[id].seconds * fps}
              premountFor={fps}
            >
              <Scene id={id} />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
    </>
  );
};
