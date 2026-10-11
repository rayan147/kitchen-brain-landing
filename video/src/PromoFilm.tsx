import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import { WEDDING } from "./film";
import { DROPOFF } from "./film-dropoff";
import { SAGE } from "./film-sage";
import { FADE_FRAMES, totalFramesOf, type Film } from "./film-model";
import { Scene } from "./Scene";

// The scenes come from the film's table in the app's own workflow order. They
// are generated from that one table on purpose: their timing is edited there,
// so the film, the VTT and the render guard read the same numbers.
export const FilmComposition: React.FC<{ film: Film }> = ({ film }) => {
  const { fps } = useVideoConfig();
  const total = totalFramesOf(film);
  return (
    <>
      <Audio
        name="Music bed"
        src={staticFile("audio/music.mp3")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [total - 75, total], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <TransitionSeries>
        {film.order.map((id, i) => (
          <Fragment key={id}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: FADE_FRAMES })}
              />
            ) : null}
            <TransitionSeries.Sequence
              name={id}
              durationInFrames={film.scenes[id].seconds * fps}
              premountFor={fps}
            >
              <Scene film={film} id={id} />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
    </>
  );
};

export const PromoFilm: React.FC = () => <FilmComposition film={WEDDING} />;
export const DropoffFilm: React.FC = () => <FilmComposition film={DROPOFF} />;
export const SageFilm: React.FC = () => <FilmComposition film={SAGE} />;
