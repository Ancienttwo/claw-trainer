import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  AbsoluteFill,
  Img,
} from "remotion"
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P"
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono"
import { COLORS, AGENT_STATS } from "../constants"

const { fontFamily: pixelFont } = loadPixel()
const { fontFamily: monoFont } = loadMono()

const EGG_W = 120
const EGG_H = 160
const CLAWBOT_SIZE = 280
const GROUP_GAP = 60

const Egg: React.FC<{
  wobble: number
  shakeX: number
  opacity: number
  scale: number
  cracks: number
}> = ({ wobble, shakeX, opacity, scale, cracks }) => (
  <div
    style={{
      width: EGG_W,
      height: EGG_H,
      position: "relative",
      transform: `rotate(${wobble}deg) translateX(${shakeX}px) scale(${scale})`,
      opacity,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        background: `radial-gradient(ellipse at 40% 35%, ${COLORS.amberLight} 0%, ${COLORS.amber} 100%)`,
        boxShadow: `0 8px 24px ${COLORS.amber}44, inset 0 -8px 16px ${COLORS.amber}33`,
      }}
    />
    {cracks > 0 && (
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          width: interpolate(cracks, [0, 1], [0, 40]),
          height: 2,
          backgroundColor: "#4A3520",
          transform: "rotate(-25deg)",
          transformOrigin: "left center",
        }}
      />
    )}
    {cracks > 0.3 && (
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "45%",
          width: interpolate(cracks, [0.3, 1], [0, 35]),
          height: 2,
          backgroundColor: "#4A3520",
          transform: "rotate(15deg)",
          transformOrigin: "left center",
        }}
      />
    )}
    {cracks > 0.6 && (
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "48%",
          width: interpolate(cracks, [0.6, 1], [0, 28]),
          height: 2,
          backgroundColor: "#4A3520",
          transform: "rotate(-10deg)",
          transformOrigin: "left center",
        }}
      />
    )}
  </div>
)

const EggHalf: React.FC<{
  side: "left" | "right"
  progress: number
}> = ({ side, progress }) => {
  const isLeft = side === "left"
  const x = interpolate(progress, [0, 1], [0, isLeft ? -60 : 60])
  const y = interpolate(progress, [0, 1], [0, 40])
  const rot = interpolate(progress, [0, 1], [0, isLeft ? -20 : 20])
  const opacity = interpolate(progress, [0, 0.6, 1], [1, 0.6, 0])

  return (
    <div
      style={{
        position: "absolute",
        width: EGG_W / 2,
        height: EGG_H,
        overflow: "hidden",
        transform: `translateX(${x}px) translateY(${y}px) rotate(${rot}deg)`,
        opacity,
        [isLeft ? "right" : "left"]: EGG_W / 2,
      }}
    >
      <div
        style={{
          width: EGG_W,
          height: EGG_H,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background: `radial-gradient(ellipse at 40% 35%, ${COLORS.amberLight} 0%, ${COLORS.amber} 100%)`,
          position: "absolute",
          [isLeft ? "left" : "right"]: 0,
        }}
      />
    </div>
  )
}

const StatBar: React.FC<{
  label: string
  value: number
  max: number
  fillProgress: number
}> = ({ label, value, max, fillProgress }) => {
  const barW = 180
  const fillW = (value / max) * barW * fillProgress

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontFamily: monoFont,
          fontSize: 14,
          color: COLORS.textSecondary,
          width: 36,
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: barW,
          height: 14,
          backgroundColor: COLORS.surfaceRaised,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: fillW,
            height: "100%",
            backgroundColor: COLORS.coral,
            borderRadius: 3,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: monoFont,
          fontSize: 14,
          color: COLORS.textPrimary,
          width: 28,
          textAlign: "right",
        }}
      >
        {Math.round(value * fillProgress)}
      </span>
    </div>
  )
}

const StatCard: React.FC<{
  slideX: number
  opacity: number
  barProgresses: number[]
  glowPulse: number
}> = ({ slideX, opacity, barProgresses, glowPulse }) => (
  <div
    style={{
      transform: `translateX(${slideX}px)`,
      opacity,
      backgroundColor: COLORS.surfaceBase,
      border: `2px solid ${COLORS.cyan}`,
      borderRadius: 12,
      padding: "24px 28px",
      boxShadow: `0 0 ${20 + glowPulse * 10}px ${COLORS.cyanBright}${Math.round(30 + glowPulse * 30)
        .toString(16)
        .padStart(2, "0")}`,
      minWidth: 300,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 20,
      }}
    >
      <span
        style={{
          fontFamily: pixelFont,
          fontSize: 18,
          color: COLORS.coral,
        }}
      >
        {AGENT_STATS.name} {AGENT_STATS.id}
      </span>
      <span
        style={{
          fontFamily: pixelFont,
          fontSize: 13,
          color: COLORS.amberLight,
        }}
      >
        LV.{AGENT_STATS.level}
      </span>
    </div>
    {AGENT_STATS.stats.map((stat, i) => (
      <StatBar
        key={stat.label}
        label={stat.label}
        value={stat.value}
        max={stat.max}
        fillProgress={barProgresses[i]}
      />
    ))}
  </div>
)

export const AgentBirth: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // --- Flash fade (0-8) ---
  const flashOpacity = interpolate(frame, [0, 8], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // --- Egg entrance (5-18) ---
  const eggOpacity = interpolate(frame, [5, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const eggScale = interpolate(frame, [5, 18], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // --- Egg wobble (18-30) ---
  const wobbleProgress = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const wobbleSpeed = 0.5 + wobbleProgress * 1.5
  const wobbleAmp = wobbleProgress * 8
  const wobble =
    frame >= 18 && frame <= 33
      ? Math.sin(frame * wobbleSpeed) * wobbleAmp
      : 0
  const shakeX =
    frame >= 18 && frame <= 33
      ? Math.sin(frame * wobbleSpeed * 1.3) * wobbleProgress * 4
      : 0

  // --- Crack lines (28-35) ---
  const crackProgress = interpolate(frame, [28, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // --- Egg split (33-38) ---
  const splitProgress = interpolate(frame, [33, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const showWholeEgg = frame < 33
  const showSplitEgg = frame >= 33 && frame < 42

  // --- Amber burst flash (33-38) ---
  const burstOpacity = interpolate(
    frame,
    [33, 35, 38],
    [0, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  )

  // --- Clawbot spring entrance (35-50) ---
  const clawbotSpring = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  })
  const clawbotScale = frame >= 35 ? clawbotSpring : 0
  const clawbotY = frame >= 35
    ? interpolate(clawbotSpring, [0, 1], [20, 0])
    : 20
  const clawbotOpacity = frame >= 35 ? 1 : 0

  // Amber glow pulse on clawbot
  const glowPulse =
    frame >= 38
      ? interpolate(Math.sin((frame - 38) * 0.2), [-1, 1], [0.3, 0.8])
      : 0.5

  // --- Stat card slide (42-65) ---
  const cardSpring = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
  })
  const cardSlideX = frame >= 42
    ? interpolate(cardSpring, [0, 1], [400, 0])
    : 400
  const cardOpacity = frame >= 42 ? cardSpring : 0

  // Stat bar fill — staggered 4 frames each, starting at frame 48
  const barProgresses = AGENT_STATS.stats.map((_, i) => {
    const barStart = 48 + i * 4
    return interpolate(frame, [barStart, barStart + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  })

  // Card glow pulse
  const cardGlow =
    frame >= 50
      ? interpolate(Math.sin((frame - 50) * 0.15), [-1, 1], [0, 1])
      : 0

  // --- Float hold (63-70) ---
  const floatY =
    frame >= 63
      ? Math.sin((frame - 63) * 0.15) * 4
      : 0

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      {/* Central group: clawbot + stat card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: GROUP_GAP,
          position: "relative",
        }}
      >
        {/* Left side: egg / clawbot */}
        <div
          style={{
            width: CLAWBOT_SIZE,
            height: CLAWBOT_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transform: `translateY(${floatY}px)`,
          }}
        >
          {/* Whole egg */}
          {showWholeEgg && (
            <Egg
              wobble={wobble}
              shakeX={shakeX}
              opacity={eggOpacity}
              scale={eggScale}
              cracks={crackProgress}
            />
          )}

          {/* Split egg halves */}
          {showSplitEgg && (
            <div
              style={{
                position: "absolute",
                width: EGG_W,
                height: EGG_H,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <EggHalf side="left" progress={splitProgress} />
              <EggHalf side="right" progress={splitProgress} />
            </div>
          )}

          {/* Clawbot */}
          <Img
            src={staticFile("logo.png")}
            style={{
              width: CLAWBOT_SIZE,
              height: CLAWBOT_SIZE,
              objectFit: "contain",
              position: "absolute",
              transform: `scale(${clawbotScale}) translateY(${clawbotY}px)`,
              opacity: clawbotOpacity,
              filter: `drop-shadow(0 0 24px ${COLORS.amber}${Math.round(glowPulse * 200)
                .toString(16)
                .padStart(2, "0")})`,
            }}
          />
        </div>

        {/* Right side: stat card */}
        <StatCard
          slideX={cardSlideX}
          opacity={cardOpacity}
          barProgresses={barProgresses}
          glowPulse={cardGlow}
        />
      </div>

      {/* White flash from previous scene */}
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Amber burst at egg crack */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.amberLight,
          opacity: burstOpacity,
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </AbsoluteFill>
  )
}
