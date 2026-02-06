import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion"

export const CrtOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const scanlineOffset = interpolate(frame % 120, [0, 120], [0, 10])

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 100,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.15) 2px,
          rgba(0, 0, 0, 0.15) 4px
        )`,
        backgroundPositionY: scanlineOffset,
      }}
    />
  )
}
