export const colors = {
  // Brand: Coral (Warm)
  coral: "#FF4D4D",
  coralMid: "#E63946",
  coralDark: "#991B1B",

  // Brand: Cyan (Cool)
  cyan: "#00E5CC",
  cyanMid: "#14B8A6",

  // Brand: Amber (Glow)
  amber: "#F59E0B",
  amberLight: "#FBBF24",
  amberDark: "#D97706",

  // Terminal
  terminalGreen: "#22C55E",
  terminalGreenDark: "#16A34A",
  terminalGreenDim: "#166534",

  // Legacy aliases (from task spec)
  pokedexRed: "#DC0A2D",
  gridGreen: "#003B00",
  terminalAmber: "#FFB000",
  darkBg: "#0D1117",
  cardBg: "#161B22",

  // Surfaces (Deep Ocean)
  surfaceDeep: "#050810",
  surfaceBase: "#0A0F1A",
  surfaceRaised: "#111827",
  surfaceOverlay: "#1E293B",
  surfaceHighlight: "#293548",

  // Text
  textPrimary: "#F0F4FF",
  textSecondary: "#8892B0",
  textMuted: "#5A6480",

  // Semantic
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#FF4D4D",
  info: "#00E5CC",
} as const

export const spacing = {
  pixel: "2px",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
} as const

export const radii = {
  pixel: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  card: "16px",
  full: "9999px",
} as const

export const typography = {
  display: { size: "3rem", lineHeight: "1.1", weight: "600" },
  heading1: { size: "2rem", lineHeight: "1.2", weight: "600" },
  heading2: { size: "1.5rem", lineHeight: "1.3", weight: "600" },
  heading3: { size: "1.25rem", lineHeight: "1.3", weight: "500" },
  bodyLg: { size: "1rem", lineHeight: "1.6", weight: "400" },
  body: { size: "0.875rem", lineHeight: "1.5", weight: "400" },
  bodySm: { size: "0.75rem", lineHeight: "1.5", weight: "400" },
  mono: { size: "0.8125rem", lineHeight: "1.6", weight: "400" },
  monoSm: { size: "0.6875rem", lineHeight: "1.5", weight: "400" },
  pixelLg: { size: "1rem", lineHeight: "1.4", weight: "400" },
  pixel: { size: "0.625rem", lineHeight: "1.4", weight: "400" },
  pixelSm: { size: "0.5rem", lineHeight: "1.4", weight: "400" },
} as const

export const fonts = {
  pixel: '"Press Start 2P", monospace',
  mono: '"IBM Plex Mono", "JetBrains Mono", "Fira Code", monospace',
  display: '"Clash Display", "Inter", system-ui, sans-serif',
  body: '"Satoshi", "Inter", system-ui, sans-serif',
} as const

export const designTokens = {
  colors,
  spacing,
  radii,
  typography,
  fonts,
} as const
