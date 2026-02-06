export const COLORS = {
  surfaceDeep: "#050810",
  surfaceBase: "#0A0F1A",
  coral: "#FF4D4D",
  coralMid: "#E63946",
  cyan: "#00E5CC",
  amber: "#F59E0B",
  amberLight: "#FBBF24",
  terminalGreen: "#22C55E",
  terminalGreenDim: "#166534",
  textPrimary: "#F0F4FF",
  textSecondary: "#8892B0",
  textMuted: "#5A6480",
} as const

export const FPS = 30
export const DURATION_FRAMES = 240
export const WIDTH = 1920
export const HEIGHT = 1080

export const SCENES = {
  boot: { start: 0, end: 60 },
  grid: { start: 45, end: 90 },
  lobster: { start: 75, end: 165 },
  title: { start: 150, end: 210 },
  cta: { start: 195, end: 240 },
} as const

export const BOOT_LINES = [
  "> INITIALIZING CLAW_TRAINER.AI...",
  "> LOADING AGENT REGISTRY...",
  "> SYSTEM READY",
] as const
