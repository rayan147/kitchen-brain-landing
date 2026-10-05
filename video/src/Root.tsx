import { Composition, Folder } from "remotion";
import { Caption } from "./elements/Caption";
import { ChapterCard } from "./elements/ChapterCard";
import { EndCard } from "./elements/EndCard";
import { PromoFilm } from "./PromoFilm";
import { Scene } from "./Scene";
import { FILM, SCENE_ORDER, filmFrames } from "./film";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Elements">
      <Composition
        id="Caption"
        component={Caption}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={60}
        defaultProps={{ text: "Prices and quantities freeze." }}
      />
      <Composition
        id="ChapterCard"
        component={ChapterCard}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={60}
        defaultProps={{ question: "What do I charge a head?" }}
      />
      <Composition
        id="EndCard"
        component={EndCard}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={90}
        defaultProps={{ displayPrice: "$49/month", trialDays: "15" }}
      />
    </Folder>
    <Folder name="Scenes">
      {SCENE_ORDER.map((id) => (
        <Composition
          key={id}
          id={id}
          component={Scene}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={FILM[id].seconds * 30}
          defaultProps={{ id }}
        />
      ))}
    </Folder>
    <Composition
      id="PromoFilm"
      component={PromoFilm}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={filmFrames()}
    />
  </>
);
