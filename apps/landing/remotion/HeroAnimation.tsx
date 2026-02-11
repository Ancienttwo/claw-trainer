import { AbsoluteFill, Sequence } from "remotion"
import { DeploySequence } from "./scenes/DeploySequence"
import { AgentBirth } from "./scenes/AgentBirth"
import { VillageReveal } from "./scenes/VillageReveal"
import { BrandReveal } from "./scenes/BrandReveal"
import { CrtOverlay } from "./effects/CrtOverlay"
import { Vignette } from "./effects/Vignette"
import { COLORS, SCENES } from "./constants"

export const HeroAnimation: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.surfaceDeep }}>
    {/* Act 1: Deploy — terminal contract deployment */}
    <Sequence
      from={SCENES.deploy.start}
      durationInFrames={SCENES.deploy.end - SCENES.deploy.start}
    >
      <DeploySequence />
    </Sequence>

    {/* Act 2: Birth — egg hatches into Clawbot + stat card */}
    <Sequence
      from={SCENES.birth.start}
      durationInFrames={SCENES.birth.end - SCENES.birth.start}
      premountFor={5}
    >
      <AgentBirth />
    </Sequence>

    {/* Act 3: Village — world reveal with building labels */}
    <Sequence
      from={SCENES.village.start}
      durationInFrames={SCENES.village.end - SCENES.village.start}
      premountFor={5}
    >
      <VillageReveal />
    </Sequence>

    {/* Act 4: Brand — title slam + tagline + CTA */}
    <Sequence
      from={SCENES.brand.start}
      durationInFrames={SCENES.brand.end - SCENES.brand.start}
      premountFor={5}
    >
      <BrandReveal />
    </Sequence>

    {/* Global effects — lighter for bright mode */}
    <CrtOverlay />
    <Vignette />
  </AbsoluteFill>
)
