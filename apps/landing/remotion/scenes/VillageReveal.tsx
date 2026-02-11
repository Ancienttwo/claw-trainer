import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  AbsoluteFill,
  Img,
} from "remotion"
import { loadFont } from "@remotion/google-fonts/PressStart2P"
import { COLORS, VILLAGE_LABELS } from "../constants"

const { fontFamily: pixelFont } = loadFont()

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const
const LABEL_GAP = 6
const BRACKET_SIZE = 16
const IMAGE_WIDTH = 1200

const CornerBracket: React.FC<{
  position: "tl" | "tr" | "bl" | "br"
  color: string
  opacity: number
}> = ({ position, color, opacity }) => {
  const isTop = position === "tl" || position === "tr"
  const isLeft = position === "tl" || position === "bl"

  return (
    <div
      style={{
        position: "absolute",
        top: isTop ? -1 : undefined,
        bottom: isTop ? undefined : -1,
        left: isLeft ? -1 : undefined,
        right: isLeft ? undefined : -1,
        width: BRACKET_SIZE,
        height: BRACKET_SIZE,
        borderTop: isTop ? `2px solid ${color}` : "none",
        borderBottom: isTop ? "none" : `2px solid ${color}`,
        borderLeft: isLeft ? `2px solid ${color}` : "none",
        borderRight: isLeft ? "none" : `2px solid ${color}`,
        opacity,
      }}
    />
  )
}

const PulsingDot: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 1])

  return (
    <div
      style={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: COLORS.coral,
        opacity: pulse,
        flexShrink: 0,
      }}
    />
  )
}

const BuildingLabel: React.FC<{
  text: string
  x: number
  y: number
  frame: number
  fps: number
  enterFrame: number
}> = ({ text, x, y, frame, fps, enterFrame }) => {
  const labelScale =
    frame >= enterFrame
      ? spring({
          frame: frame - enterFrame,
          fps,
          config: { damping: 10, stiffness: 180, mass: 0.5 },
        })
      : 0

  return (
    <div
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        transform: `translate(-50%, -50%) scale(${labelScale})`,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <PulsingDot frame={frame} />
      <div
        style={{
          fontFamily: pixelFont,
          fontSize: 14,
          color: COLORS.codeGreen,
          backgroundColor: `${COLORS.codeBg}CC`,
          padding: "4px 12px",
          borderRadius: 6,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  )
}

export const VillageReveal: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Frame 0-15: Image fades in from blur
  const imageBlur = interpolate(frame, [0, 15], [20, 0], CLAMP)
  const imageOpacity = interpolate(frame, [0, 15], [0, 1], CLAMP)
  const imageScale = interpolate(frame, [0, 15], [1.3, 1.0], CLAMP)

  // Frame 10-15: Border + brackets fade in
  const borderOpacity = interpolate(frame, [10, 15], [0, 1], CLAMP)

  // Frame 45-65: Gentle zoom hold
  const holdScale = interpolate(frame, [45, 65], [1.0, 1.02], CLAMP)

  const combinedScale = imageScale * holdScale

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: IMAGE_WIDTH }}>
        {/* Cyan border frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `2px solid ${COLORS.cyan}`,
            borderRadius: 12,
            opacity: borderOpacity,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <CornerBracket position="tl" color={COLORS.cyan} opacity={borderOpacity} />
          <CornerBracket position="tr" color={COLORS.cyan} opacity={borderOpacity} />
          <CornerBracket position="bl" color={COLORS.coral} opacity={borderOpacity} />
          <CornerBracket position="br" color={COLORS.coral} opacity={borderOpacity} />
        </div>

        {/* Village poster */}
        <Img
          src={staticFile("hero-poster.png")}
          style={{
            width: "100%",
            display: "block",
            borderRadius: 12,
            filter: `blur(${imageBlur}px)`,
            opacity: imageOpacity,
            transform: `scale(${combinedScale})`,
          }}
        />

        {/* Building labels overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
          }}
        >
          {VILLAGE_LABELS.map((label, idx) => (
            <BuildingLabel
              key={label.text}
              text={label.text}
              x={label.x}
              y={label.y}
              frame={frame}
              fps={fps}
              enterFrame={15 + idx * LABEL_GAP}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
