import { AbsoluteFill } from "remotion"

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 99,
      background:
        "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
    }}
  />
)
