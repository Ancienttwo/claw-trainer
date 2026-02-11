export const COLORS = {
  // Surfaces (Bright Mode)
  surfaceDeep: "#F8F6F0",
  surfaceBase: "#FFFFFF",
  surfaceRaised: "#F0EDE6",

  // Brand
  coral: "#FF4D4D",
  coralMid: "#E63946",

  // Accent (darkened for light-mode readability)
  cyan: "#0D9488",
  cyanBright: "#00E5CC",
  amber: "#D97706",
  amberLight: "#F59E0B",

  // Terminal (darkened)
  terminalGreen: "#15803D",
  terminalGreenBright: "#22C55E",
  terminalGreenDim: "#14532D",

  // Code blocks (bright on dark bg — for boot terminal)
  codeBg: "#1A1A2E",
  codeGreen: "#4ADE80",

  // Text (dark on light)
  textPrimary: "#1A1A2E",
  textSecondary: "#4A4A6A",
  textMuted: "#6B6B85",
} as const

export const FPS = 30
export const DURATION_FRAMES = 240
export const WIDTH = 1920
export const HEIGHT = 1080

// 四幕结构：部署 → 诞生 → 世界 → 召唤
export const SCENES = {
  deploy: { start: 0, end: 60 },
  birth: { start: 55, end: 125 },
  village: { start: 120, end: 185 },
  brand: { start: 178, end: 240 },
} as const

export const DEPLOY_LINES = [
  "> deploying IdentityRegistry.sol...",
  "> contract verified \u2713",
  "> minting agent #001...",
] as const

export const AGENT_STATS = {
  name: "CLAW",
  id: "#001",
  level: 1,
  stats: [
    { label: "ATK", value: 12, max: 30 },
    { label: "DEF", value: 5, max: 30 },
    { label: "SPD", value: 18, max: 30 },
    { label: "INT", value: 24, max: 30 },
  ],
} as const

export const VILLAGE_LABELS = [
  { text: "Tech Tavern", x: 0.15, y: 0.1 },
  { text: "Village Center", x: 0.47, y: 0.1 },
  { text: "Tech Shop", x: 0.8, y: 0.12 },
  { text: "Lobster Lab", x: 0.15, y: 0.55 },
  { text: "Training Grounds", x: 0.8, y: 0.55 },
] as const
