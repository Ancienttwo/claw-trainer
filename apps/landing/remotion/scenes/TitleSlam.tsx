import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  AbsoluteFill,
} from "remotion"
import { loadFont as loadPressStart } from "@remotion/google-fonts/PressStart2P"
import { loadFont as loadIBMPlex } from "@remotion/google-fonts/IBMPlexMono"
import { COLORS } from "../constants"

const { fontFamily: pixelFont } = loadPressStart()
const { fontFamily: monoFont } = loadIBMPlex()

const TAGLINE = 'Train your Molt. Own your Mind.'
const CHARS_PER_FRAME = 0.8

export const TitleSlam: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.6 },
  })

  const titleScale = interpolate(titleSpring, [0, 1], [1.5, 1])
  const titleY = interpolate(titleSpring, [0, 1], [-120, 0])
  const titleOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  })

  const subtitleStart = 25
  const charsVisible = Math.max(
    0,
    Math.floor((frame - subtitleStart) * CHARS_PER_FRAME),
  )
  const displayedTagline = TAGLINE.slice(0, charsVisible)
  const showCursor =
    charsVisible > 0 && charsVisible < TAGLINE.length

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <div
        style={{
          fontFamily: pixelFont,
          fontSize: 72,
          color: COLORS.coral,
          transform: `scale(${titleScale}) translateY(${titleY}px)`,
          opacity: titleOpacity,
          textShadow: `
            0 0 20px ${COLORS.amber}88,
            0 0 60px ${COLORS.amber}44,
            0 4px 0 ${COLORS.coralMid}
          `,
          letterSpacing: 2,
        }}
      >
        ClawTrainer.ai
      </div>

      {frame >= subtitleStart && (
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 26,
            color: COLORS.textSecondary,
            opacity: interpolate(
              frame,
              [subtitleStart, subtitleStart + 5],
              [0, 1],
              { extrapolateRight: "clamp" },
            ),
            textShadow: `0 0 10px ${COLORS.textSecondary}33`,
          }}
        >
          {displayedTagline}
          {showCursor && (
            <span
              style={{
                opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
              }}
            >
              |
            </span>
          )}
        </div>
      )}
    </AbsoluteFill>
  )
}
