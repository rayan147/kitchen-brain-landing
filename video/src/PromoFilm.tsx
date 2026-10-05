import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import { Buy } from "./scenes/Buy";
import { Charge } from "./scenes/Charge";
import { Close } from "./scenes/Close";
import { ColdOpen } from "./scenes/ColdOpen";
import { Deposit } from "./scenes/Deposit";
import { Invoices } from "./scenes/Invoices";
import { Proposal } from "./scenes/Proposal";

// 2640 frames of scenes less six 15-frame fades = 2550 (85 s). Change a
// duration here and the PromoFilm registration and the VTT offsets move too.
export const PromoFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio
        name="Music bed"
        src={staticFile("audio/bed.mp3")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [2520, 2550], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Cold open"
          durationInFrames={180}
          premountFor={fps}
        >
          <ColdOpen />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="What do I charge a head"
          durationInFrames={420}
          premountFor={fps}
        >
          <Charge />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Proposal"
          durationInFrames={480}
          premountFor={fps}
        >
          <Proposal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Deposit"
          durationInFrames={480}
          premountFor={fps}
        >
          <Deposit />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Buy"
          durationInFrames={360}
          premountFor={fps}
        >
          <Buy />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Invoices"
          durationInFrames={300}
          premountFor={fps}
        >
          <Invoices />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Close"
          durationInFrames={420}
          premountFor={fps}
        >
          <Close />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
