import { AbsoluteFill } from "remotion"

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 99,
      background:
        "radial-gradient(ellipse at center, transparent 60%, rgba(26,26,46,0.15) 100%)",
    }}
  />
)
