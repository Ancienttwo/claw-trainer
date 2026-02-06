import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  AbsoluteFill,
  Img,
} from "remotion"
import { COLORS } from "../constants"

export const LobsterEvolution: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const rookieEntrance = spring({
    frame: frame - 0,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  })

  const rookieY = interpolate(rookieEntrance, [0, 1], [300, 0])
  const rookieOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  })

  const amberGlow = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.3, 0.8],
  )

  const glitchActive = frame >= 30 && frame <= 45
  const glitchOffset = glitchActive
    ? interpolate(
        Math.sin(frame * 8),
        [-1, 1],
        [-8, 8],
      )
    : 0
  const glitchOpacity = glitchActive
    ? interpolate(
        Math.sin(frame * 12),
        [-1, 1],
        [0.3, 1],
      )
    : 1

  const bannerEntrance = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  })

  const bannerScale = interpolate(bannerEntrance, [0, 1], [0.3, 1])
  const bannerOpacity = frame >= 45 ? bannerEntrance : 0

  const floatY = frame >= 60
    ? interpolate(
        Math.sin((frame - 60) * 0.08),
        [-1, 1],
        [-8, 8],
      )
    : 0

  const showRookie = frame < 45
  const showBanner = frame >= 45

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showRookie && (
        <div
          style={{
            position: "absolute",
            transform: `translateY(${rookieY}px) translateX(${glitchOffset}px)`,
            opacity: rookieOpacity * glitchOpacity,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{
              width: 280,
              height: 280,
              objectFit: "contain",
              filter: `drop-shadow(0 0 30px ${COLORS.amber}${Math.round(amberGlow * 255).toString(16).padStart(2, "0")})`,
            }}
          />
        </div>
      )}

      {showBanner && (
        <div
          style={{
            position: "absolute",
            transform: `scale(${bannerScale}) translateY(${floatY}px)`,
            opacity: bannerOpacity,
          }}
        >
          <Img
            src={staticFile("banner.png")}
            style={{
              width: 900,
              height: "auto",
              maxHeight: 500,
              objectFit: "contain",
              filter: `drop-shadow(0 0 40px ${COLORS.cyan}66)`,
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  )
}
