import { Composition } from "remotion"
import { HeroAnimation } from "./HeroAnimation"
import { FPS, DURATION_FRAMES, WIDTH, HEIGHT } from "./constants"

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HeroAnimation"
    component={HeroAnimation}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
)
