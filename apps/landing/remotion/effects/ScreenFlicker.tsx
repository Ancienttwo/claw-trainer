import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion"

export const ScreenFlicker: React.FC = () => {
  const frame = useCurrentFrame()

  const flickerAt = (center: number) =>
    interpolate(
      frame,
      [center - 1, center, center + 1],
      [1, 0.92, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    )

  const opacity = flickerAt(90) * flickerAt(180)

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 98,
        backgroundColor: "black",
        opacity: 1 - opacity,
      }}
    />
  )
}
