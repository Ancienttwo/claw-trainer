import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion"
import { COLORS } from "../constants"

const GRID_SIZE = 60
const GRID_COLOR = COLORS.terminalGreenDim

export const GridReveal: React.FC = () => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 30], [0, 0.6], {
    extrapolateRight: "clamp",
  })

  const scale = interpolate(frame, [0, 45], [0.5, 1], {
    extrapolateRight: "clamp",
  })

  const perspective = interpolate(frame, [0, 45], [800, 1200], {
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective,
      }}
    >
      <div
        style={{
          width: "200%",
          height: "200%",
          transform: `scale(${scale}) rotateX(55deg)`,
          transformOrigin: "center center",
          backgroundImage: `
            linear-gradient(${GRID_COLOR}44 1px, transparent 1px),
            linear-gradient(90deg, ${GRID_COLOR}44 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          position: "absolute",
          top: "-20%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center, ${COLORS.terminalGreen}08 0%, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  )
}
