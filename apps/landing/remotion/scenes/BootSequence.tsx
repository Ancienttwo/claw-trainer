import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion"
import { loadFont } from "@remotion/google-fonts/IBMPlexMono"
import { COLORS, BOOT_LINES } from "../constants"

const { fontFamily } = loadFont()

const CHARS_PER_FRAME = 1.2
const LINE_DELAY_FRAMES = 8

export const BootSequence: React.FC = () => {
  const frame = useCurrentFrame()

  const screenFlicker = interpolate(
    frame,
    [0, 8, 12, 18, 22, 30],
    [0, 1, 0.3, 0.8, 0.4, 1],
    { extrapolateRight: "clamp" },
  )

  const contentOpacity = frame < 30 ? screenFlicker : 1

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.surfaceDeep,
        opacity: contentOpacity,
        justifyContent: "center",
        paddingLeft: 200,
      }}
    >
      {BOOT_LINES.map((line, idx) => {
        const lineStart = 30 + idx * LINE_DELAY_FRAMES
        const charsVisible = Math.max(
          0,
          Math.floor((frame - lineStart) * CHARS_PER_FRAME),
        )
        const displayedText = line.slice(0, charsVisible)
        const showCursor =
          charsVisible > 0 && charsVisible < line.length && frame >= lineStart

        const lineOpacity = interpolate(
          frame,
          [lineStart, lineStart + 3],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )

        return (
          <div
            key={idx}
            style={{
              fontFamily,
              fontSize: 28,
              color: COLORS.terminalGreen,
              opacity: lineOpacity,
              marginBottom: 12,
              textShadow: `0 0 10px ${COLORS.terminalGreen}40`,
              whiteSpace: "pre",
            }}
          >
            {displayedText}
            {showCursor && (
              <span
                style={{
                  opacity: Math.sin(frame * 0.5) > 0 ? 1 : 0,
                }}
              >
                _
              </span>
            )}
          </div>
        )
      })}
    </AbsoluteFill>
  )
}
