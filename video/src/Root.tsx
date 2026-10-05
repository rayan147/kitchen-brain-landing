import { Composition, Folder } from "remotion";
import { Caption } from "./elements/Caption";
import { ChapterCard } from "./elements/ChapterCard";
import { EndCard } from "./elements/EndCard";
import { PromoFilm } from "./PromoFilm";
import { Buy } from "./scenes/Buy";
import { Charge } from "./scenes/Charge";
import { Close } from "./scenes/Close";
import { ColdOpen } from "./scenes/ColdOpen";
import { Deposit } from "./scenes/Deposit";
import { Invoices } from "./scenes/Invoices";
import { Proposal } from "./scenes/Proposal";

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
      <Composition
        id="ColdOpen"
        component={ColdOpen}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={180}
      />
      <Composition
        id="Charge"
        component={Charge}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={420}
      />
      <Composition
        id="Proposal"
        component={Proposal}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={480}
      />
      <Composition
        id="Deposit"
        component={Deposit}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={480}
      />
      <Composition
        id="Buy"
        component={Buy}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={360}
      />
      <Composition
        id="Invoices"
        component={Invoices}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
      />
      <Composition
        id="Close"
        component={Close}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={420}
      />
    </Folder>
    <Composition
      id="PromoFilm"
      component={PromoFilm}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={2550}
    />
  </>
);
