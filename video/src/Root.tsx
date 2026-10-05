import { Composition, Folder } from "remotion";
import { Caption } from "./elements/Caption";
import { ChapterCard } from "./elements/ChapterCard";
import { EndCard } from "./elements/EndCard";

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
  </>
);
