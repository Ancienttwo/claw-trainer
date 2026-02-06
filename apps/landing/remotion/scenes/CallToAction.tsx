import {
  useCurrentFrame,
  spring,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
} from "remotion"
import { loadFont } from "@remotion/google-fonts/IBMPlexMono"
import { COLORS } from "../constants"

const { fontFamily } = loadFont()

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  })

  const badgeY = interpolate(badgeSpring, [0, 1], [40, 0])
  const badgeOpacity = badgeSpring

  const borderGlow = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.6, 1],
  )

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          transform: `translateY(${badgeY}px)`,
          opacity: badgeOpacity,
          border: `2px solid ${COLORS.terminalGreen}`,
          borderRadius: 12,
          padding: "16px 40px",
          backgroundColor: `${COLORS.surfaceBase}DD`,
          boxShadow: `
            0 0 20px ${COLORS.terminalGreen}${Math.round(borderGlow * 40).toString(16).padStart(2, "0")},
            inset 0 0 20px ${COLORS.terminalGreen}11
          `,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 22,
            color: COLORS.terminalGreen,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            textShadow: `0 0 8px ${COLORS.terminalGreen}44`,
          }}
        >
          BNB Chain Hackathon 2026
        </span>
      </div>
    </AbsoluteFill>
  )
}
