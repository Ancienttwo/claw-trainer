import { AbsoluteFill, Sequence } from "remotion"
import { BootSequence } from "./scenes/BootSequence"
import { GridReveal } from "./scenes/GridReveal"
import { LobsterEvolution } from "./scenes/LobsterEvolution"
import { TitleSlam } from "./scenes/TitleSlam"
import { CallToAction } from "./scenes/CallToAction"
import { CrtOverlay } from "./effects/CrtOverlay"
import { Vignette } from "./effects/Vignette"
import { ScreenFlicker } from "./effects/ScreenFlicker"
import { COLORS, SCENES } from "./constants"

export const HeroAnimation: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.surfaceDeep }}>
    <Sequence
      from={SCENES.grid.start}
      durationInFrames={SCENES.grid.end - SCENES.grid.start + 150}
      premountFor={15}
    >
      <GridReveal />
    </Sequence>

    <Sequence
      from={SCENES.boot.start}
      durationInFrames={SCENES.boot.end - SCENES.boot.start}
      premountFor={0}
    >
      <BootSequence />
    </Sequence>

    <Sequence
      from={SCENES.lobster.start}
      durationInFrames={SCENES.lobster.end - SCENES.lobster.start}
      premountFor={10}
    >
      <LobsterEvolution />
    </Sequence>

    <Sequence
      from={SCENES.title.start}
      durationInFrames={SCENES.title.end - SCENES.title.start}
      premountFor={10}
    >
      <TitleSlam />
    </Sequence>

    <Sequence
      from={SCENES.cta.start}
      durationInFrames={SCENES.cta.end - SCENES.cta.start}
      premountFor={10}
    >
      <CallToAction />
    </Sequence>

    <CrtOverlay />
    <Vignette />
    <ScreenFlicker />
  </AbsoluteFill>
)
