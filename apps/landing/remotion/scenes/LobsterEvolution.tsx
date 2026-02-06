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

  // --- Phase 1: Rookie logo entrance (frames 0–44) ---
  const rookieEntrance = spring({
    frame,
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

  // Glitch effect during "molt" transition
  const glitchActive = frame >= 30 && frame <= 45
  const glitchOffset = glitchActive
    ? interpolate(Math.sin(frame * 8), [-1, 1], [-12, 12])
    : 0
  const glitchOpacity = glitchActive
    ? interpolate(Math.sin(frame * 12), [-1, 1], [0.2, 1])
    : 1

  // Chromatic aberration during glitch
  const chromaticShift = glitchActive
    ? interpolate(Math.sin(frame * 6), [-1, 1], [-4, 4])
    : 0

  // Rookie scale pulse before molt
  const rookieScale = glitchActive
    ? interpolate(Math.sin(frame * 10), [-1, 1], [0.95, 1.1])
    : 1

  // --- Phase 2: Evolved scene entrance (frames 45+) ---
  const evolvedEntrance = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  })

  const evolvedScale = interpolate(evolvedEntrance, [0, 1], [0.3, 1])
  const evolvedOpacity = frame >= 45 ? evolvedEntrance : 0

  // Subtle float animation after settled
  const floatY =
    frame >= 60
      ? interpolate(Math.sin((frame - 60) * 0.08), [-1, 1], [-6, 6])
      : 0

  // Cyan border glow pulse
  const borderGlow =
    frame >= 50
      ? interpolate(Math.sin((frame - 50) * 0.12), [-1, 1], [0.4, 1])
      : 0

  // Flash-white on transition frame
  const flashOpacity = interpolate(
    frame,
    [44, 46, 50],
    [0, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  )

  const showRookie = frame < 46
  const showEvolved = frame >= 45

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      {/* Phase 1: Rookie pixel lobster */}
      {showRookie && (
        <div
          style={{
            position: "absolute",
            transform: `translateY(${rookieY}px) translateX(${glitchOffset}px) scale(${rookieScale})`,
            opacity: rookieOpacity * glitchOpacity,
          }}
        >
          {/* Chromatic aberration red layer */}
          {glitchActive && (
            <Img
              src={staticFile("logo-new.png")}
              style={{
                width: 320,
                height: 320,
                objectFit: "contain",
                position: "absolute",
                top: 0,
                left: chromaticShift,
                opacity: 0.5,
                filter: "brightness(2) hue-rotate(-30deg)",
                mixBlendMode: "screen",
              }}
            />
          )}
          <Img
            src={staticFile("logo-new.png")}
            style={{
              width: 320,
              height: 320,
              objectFit: "contain",
              filter: `drop-shadow(0 0 30px ${COLORS.amber}${Math.round(amberGlow * 255)
                .toString(16)
                .padStart(2, "0")})`,
            }}
          />
        </div>
      )}

      {/* Transition flash */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.cyan,
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {/* Phase 2: Evolved cinematic scene */}
      {showEvolved && (
        <div
          style={{
            position: "absolute",
            transform: `scale(${evolvedScale}) translateY(${floatY}px)`,
            opacity: evolvedOpacity,
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: `
                0 0 40px ${COLORS.cyan}${Math.round(borderGlow * 100)
                .toString(16)
                .padStart(2, "0")},
                0 0 80px ${COLORS.cyan}22,
                inset 0 0 60px rgba(0,0,0,0.5)
              `,
              border: `2px solid ${COLORS.cyan}${Math.round(borderGlow * 180)
                .toString(16)
                .padStart(2, "0")}`,
            }}
          >
            <Img
              src={staticFile("hero-poster.png")}
              style={{
                width: 960,
                height: "auto",
                maxHeight: 540,
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Corner accents matching Hero.astro */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 16,
                height: 16,
                borderTop: `2px solid ${COLORS.cyan}`,
                borderLeft: `2px solid ${COLORS.cyan}`,
                opacity: borderGlow,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 16,
                height: 16,
                borderTop: `2px solid ${COLORS.cyan}`,
                borderRight: `2px solid ${COLORS.cyan}`,
                opacity: borderGlow,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 16,
                height: 16,
                borderBottom: `2px solid ${COLORS.coral}`,
                borderLeft: `2px solid ${COLORS.coral}`,
                opacity: borderGlow,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 16,
                height: 16,
                borderBottom: `2px solid ${COLORS.coral}`,
                borderRight: `2px solid ${COLORS.coral}`,
                opacity: borderGlow,
              }}
            />
          </div>
        </div>
      )}
    </AbsoluteFill>
  )
}
