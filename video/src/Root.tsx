import { Composition, Folder } from "remotion";
import { Caption } from "./elements/Caption";
import { ChapterCard } from "./elements/ChapterCard";
import { EndCard } from "./elements/EndCard";
import { DropoffFilm, PromoFilm, SageFilm } from "./PromoFilm";
import { DROPOFF } from "./film-dropoff";
import { SAGE } from "./film-sage";
import { totalFramesOf } from "./film-model";
import { Scene } from "./Scene";
import { FILM, SCENE_ORDER, WEDDING, filmFrames } from "./film";

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
        defaultProps={{ text: "Prices and quantities lock.", duration: 60 }}
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
          defaultProps={{ film: WEDDING, id }}
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
    <Composition
      id="DropoffFilm"
      component={DropoffFilm}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={totalFramesOf(DROPOFF)}
    />
    <Composition
      id="SageFilm"
      component={SageFilm}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={totalFramesOf(SAGE)}
    />
  </>
);
