import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  AbsoluteFill,
} from "remotion"
import { loadFont } from "@remotion/google-fonts/IBMPlexMono"
import { COLORS, DEPLOY_LINES } from "../constants"

const { fontFamily } = loadFont()

const CHARS_PER_FRAME = 1.5
const BAR_WIDTH = 20
const FILLED_CHAR = "\u2588"
const EMPTY_CHAR = "\u2591"

const typedText = (
  frame: number,
  lineStart: number,
  text: string,
): string => {
  const elapsed = frame - lineStart
  if (elapsed < 0) return ""
  const chars = Math.floor(elapsed * CHARS_PER_FRAME)
  return text.slice(0, chars)
}

const isTyping = (
  frame: number,
  lineStart: number,
  text: string,
): boolean => {
  const elapsed = frame - lineStart
  const chars = Math.floor(elapsed * CHARS_PER_FRAME)
  return elapsed >= 0 && chars < text.length
}

const progressBar = (fill: number): string => {
  const filled = Math.round(fill * BAR_WIDTH)
  const empty = BAR_WIDTH - filled
  const pct = Math.round(fill * 100)
  return `[${FILLED_CHAR.repeat(filled)}${EMPTY_CHAR.repeat(empty)}] ${pct}%`
}

export const DeploySequence: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Panel entrance (frames 0-4)
  const panelOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const panelScale = interpolate(frame, [0, 4], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Line typing start frames
  const lineStarts = [4, 14, 24] as const

  // Progress bar fill (frames 36-50)
  const barFill = interpolate(frame, [36, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const barVisible = frame >= 36

  // Success message spring (frame 50+)
  const successScale =
    frame >= 50
      ? spring({
          frame: frame - 50,
          fps,
          config: { damping: 8, stiffness: 200, mass: 0.6 },
        })
      : 0

  // Exit fade (frames 55-60)
  const exitOpacity = interpolate(frame, [55, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // White flash (frames 55-60)
  const flashOpacity = interpolate(frame, [55, 60], [0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Cursor blink: active on whichever line is currently typing
  const cursorBlink = Math.sin(frame * 0.5) > 0

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          backgroundColor: COLORS.codeBg,
          borderRadius: 16,
          padding: "48px 64px",
          width: "65%",
          boxShadow: "0 8px 32px rgba(26, 26, 46, 0.2)",
          border: `1px solid rgba(74, 222, 128, 0.15)`,
          opacity: panelOpacity * exitOpacity,
          transform: `scale(${panelScale})`,
          fontFamily,
        }}
      >
        {DEPLOY_LINES.map((line, idx) => {
          const start = lineStarts[idx]
          const displayed = typedText(frame, start, line)
          const typing = isTyping(frame, start, line)

          return (
            <div
              key={idx}
              style={{
                fontSize: 26,
                color: COLORS.codeGreen,
                marginBottom: 8,
                textShadow: `0 0 8px ${COLORS.codeGreen}30`,
                whiteSpace: "pre",
                minHeight: 32,
              }}
            >
              {displayed}
              {typing && (
                <span style={{ opacity: cursorBlink ? 1 : 0 }}>_</span>
              )}
            </div>
          )
        })}

        {barVisible && (
          <div
            style={{
              fontSize: 22,
              marginTop: 16,
              whiteSpace: "pre",
              minHeight: 28,
            }}
          >
            {progressBar(barFill).split("").map((char, i) => (
              <span
                key={i}
                style={{
                  color:
                    char === FILLED_CHAR
                      ? COLORS.amberLight
                      : char === EMPTY_CHAR
                        ? COLORS.textMuted
                        : COLORS.codeGreen,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        )}

        {successScale > 0 && (
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.coral,
              marginTop: 20,
              transform: `scale(${successScale})`,
              transformOrigin: "left center",
              textShadow: `0 0 12px ${COLORS.coral}40`,
            }}
          >
            AGENT MINTED ✓
          </div>
        )}
      </div>

      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  )
}
