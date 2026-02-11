import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  AbsoluteFill,
} from "remotion"
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P"
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono"
import { COLORS } from "../constants"

const { fontFamily: pixelFont } = loadPixel()
const { fontFamily: monoFont } = loadMono()

const TAGLINE = "Train your Claw. Own your Mind."
const CHARS_PER_FRAME = 0.8
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const

const TypewriterText: React.FC<{
  text: string
  frame: number
  startFrame: number
  font: string
  fontSize: number
  color: string
}> = ({ text, frame, startFrame, font, fontSize, color }) => {
  const elapsed = frame - startFrame
  const charsVisible = Math.max(0, Math.floor(elapsed * CHARS_PER_FRAME))
  const displayed = text.slice(0, charsVisible)
  const cursorVisible = elapsed >= 0 && Math.sin(frame * 0.4) > 0

  return (
    <div
      style={{
        fontFamily: font,
        fontSize,
        color,
        whiteSpace: "pre",
        minHeight: fontSize + 8,
      }}
    >
      {displayed}
      {elapsed >= 0 && (
        <span style={{ opacity: cursorVisible ? 0.8 : 0 }}>|</span>
      )}
    </div>
  )
}

const CtaBadge: React.FC<{
  frame: number
  fps: number
  enterFrame: number
}> = ({ frame, fps, enterFrame }) => {
  const badgeSpring =
    frame >= enterFrame
      ? spring({
          frame: frame - enterFrame,
          fps,
          config: { damping: 12, stiffness: 120, mass: 0.7 },
        })
      : 0

  const badgeY = interpolate(badgeSpring, [0, 1], [60, 0])

  // Glow pulse after badge settles (frame 48+)
  const glowPulse = interpolate(
    Math.sin((frame - 48) * 0.12),
    [-1, 1],
    [0.5, 1],
  )
  const glowAlpha = frame >= 48 ? Math.round(glowPulse * 50) : 20
  const glowHex = glowAlpha.toString(16).padStart(2, "0")

  return (
    <div
      style={{
        transform: `translateY(${badgeY}px)`,
        opacity: badgeSpring,
        border: `2px solid ${COLORS.terminalGreen}`,
        borderRadius: 12,
        padding: "16px 40px",
        backgroundColor: `${COLORS.surfaceBase}DD`,
        boxShadow: `
          0 0 20px ${COLORS.terminalGreenBright}${glowHex},
          inset 0 0 20px ${COLORS.terminalGreenBright}11
        `,
      }}
    >
      <span
        style={{
          fontFamily: monoFont,
          fontSize: 22,
          color: COLORS.terminalGreen,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
          textShadow: `0 0 8px ${COLORS.terminalGreenBright}44`,
        }}
      >
        BNB Chain Hackathon 2026
      </span>
    </div>
  )
}

export const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Frame 0-8: Dim overlay fades in
  const dimOpacity = interpolate(frame, [0, 8], [0, 0.7], CLAMP)

  // Frame 5-20: Title springs down from above
  const titleSpring =
    frame >= 5
      ? spring({
          frame: frame - 5,
          fps,
          config: { damping: 10, stiffness: 160, mass: 0.6 },
        })
      : 0
  const titleY = interpolate(titleSpring, [0, 1], [-150, 0])
  const titleScale = interpolate(titleSpring, [0, 1], [1.4, 1.0])

  // Frame 48-62: Gentle title pulse
  const titlePulse =
    frame >= 48
      ? interpolate(Math.sin((frame - 48) * 0.08), [-1, 1], [1.0, 1.01])
      : 1.0
  const finalTitleScale = titleScale * titlePulse

  return (
    <AbsoluteFill>
      {/* Dim overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.surfaceDeep,
          opacity: dimOpacity,
        }}
      />

      {/* Content column */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Title */}
        <div
          style={{
            transform: `translateY(${titleY}px) scale(${finalTitleScale})`,
            opacity: titleSpring,
            fontFamily: pixelFont,
            fontSize: 72,
            color: COLORS.coral,
            letterSpacing: 2,
            textShadow: `0 0 20px ${COLORS.amber}44, 0 4px 0 ${COLORS.coralMid}`,
          }}
        >
          ClawTrainer.ai
        </div>

        {/* Tagline */}
        <div style={{ marginTop: 40 }}>
          <TypewriterText
            text={TAGLINE}
            frame={frame}
            startFrame={18}
            font={monoFont}
            fontSize={26}
            color={COLORS.textSecondary}
          />
        </div>

        {/* CTA Badge */}
        <div style={{ marginTop: 80 }}>
          <CtaBadge frame={frame} fps={fps} enterFrame={32} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
