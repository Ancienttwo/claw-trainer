# Plan: Remotion Hero Animation — Bright Mode Redo

## Context

The entire app + landing page have been converted to bright mode (#F8F6F0 surfaces, dark text, darkened accent colors for WCAG contrast). The Remotion hero animation is still rendering with the old dark ocean palette (#050810 bg, bright cyan #00E5CC, etc.). Every file in `apps/landing/remotion/` needs updating.

**Current video**: 1920×1080, 30fps, 8 seconds (240 frames), pre-rendered to `public/hero.mp4`

**Goal**: Match the landing page's new bright, warm aesthetic while keeping the same animation choreography (boot → grid → logo evolution → title slam → CTA).

---

## Files to Modify

```
apps/landing/remotion/
├── constants.ts              ← Color palette swap
├── HeroAnimation.tsx         ← Background color
├── scenes/
│   ├── BootSequence.tsx      ← bg, text color, glow
│   ├── GridReveal.tsx        ← grid color, radial glow
│   ├── LobsterEvolution.tsx  ← logo file, glow colors, border colors
│   ├── TitleSlam.tsx         ← text color, shadow colors
│   └── CallToAction.tsx      ← border, bg, text, glow colors
└── effects/
    ├── CrtOverlay.tsx        ← scanline opacity (lighter)
    ├── Vignette.tsx          ← invert: dark edge → light/warm edge
    └── ScreenFlicker.tsx     ← flash color: black → white
```

---

## Step 1: Color Palette — `constants.ts`

Replace the entire COLORS object to match the aligned landing/app tokens:

```ts
export const COLORS = {
  // Surfaces (Bright Mode)
  surfaceDeep: "#F8F6F0",
  surfaceBase: "#FFFFFF",
  surfaceRaised: "#F0EDE6",

  // Brand
  coral: "#FF4D4D",
  coralMid: "#E63946",

  // Accent (darkened for light-mode readability)
  cyan: "#0D9488",        // was #00E5CC
  cyanBright: "#00E5CC",  // keep for glow effects only (not text)
  amber: "#D97706",       // was #F59E0B
  amberLight: "#F59E0B",  // keep for glow effects only

  // Terminal (darkened)
  terminalGreen: "#15803D",       // was #22C55E
  terminalGreenBright: "#22C55E", // keep for glow effects only
  terminalGreenDim: "#14532D",

  // Code blocks (bright on dark bg — for boot terminal)
  codeBg: "#1A1A2E",
  codeGreen: "#4ADE80",

  // Text (dark on light)
  textPrimary: "#1A1A2E",   // was #F0F4FF
  textSecondary: "#4A4A6A", // was #8892B0
  textMuted: "#6B6B85",     // was #5A6480
} as const
```

**Key decision**: Keep `cyanBright`/`amberLight`/`terminalGreenBright` variants for glow/shadow effects where we want visible radiance. Use the dark variants for text/borders.

---

## Step 2: Boot Sequence — `scenes/BootSequence.tsx`

The boot terminal should render as a **dark code block** floating on the bright background (like VS Code's terminal on a light page). This gives the best of both worlds: retro terminal aesthetic + bright mode context.

### Changes:
1. **Background**: `surfaceDeep` (#050810) → render a dark terminal panel:
   - Replace the `AbsoluteFill` background with a centered dark panel
   - Panel bg: `codeBg` (#1A1A2E), rounded corners, subtle shadow
   - Panel dimensions: ~70% width, auto height, centered

2. **Text color**: `terminalGreen` → `codeGreen` (#4ADE80, bright green on dark bg)

3. **Text shadow/glow**: Use `codeGreen` for the glow (bright variant for visibility on dark)

4. **Outer background**: Remove — let HeroAnimation's surfaceDeep (#F8F6F0) show through

### Updated structure:
```tsx
<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
  <div style={{
    backgroundColor: COLORS.codeBg,
    borderRadius: 16,
    padding: "60px 80px",
    width: "70%",
    boxShadow: "0 8px 32px rgba(26, 26, 46, 0.15)",
    border: "1px solid rgba(26, 26, 46, 0.12)",
    opacity: contentOpacity,
  }}>
    {/* boot lines with codeGreen color */}
  </div>
</AbsoluteFill>
```

---

## Step 3: Grid Reveal — `scenes/GridReveal.tsx`

### Changes:
1. **Grid color**: `terminalGreenDim` → `cyan` (#0D9488) with moderate opacity
   - Grid lines: `${COLORS.cyan}30` (was `${GRID_COLOR}44`)

2. **Radial glow**: Change from terminalGreen to cyan
   - `radial-gradient(ellipse at center, ${COLORS.cyanBright}08 0%, transparent 60%)`

3. **Opacity**: Increase from 0.6 to 0.3 max (lighter grid on bright bg needs less opacity)

---

## Step 4: Lobster Evolution — `scenes/LobsterEvolution.tsx`

### Changes:
1. **Logo file**: `staticFile("logo-new.png")` → `staticFile("logo.png")` (both Phase 1 refs, lines 102 + 117)

2. **Amber glow** (Phase 1): Keep `amber`/`amberLight` for the drop-shadow — the logo already has a dark bg so glows will still be visible

3. **Transition flash**: `COLORS.cyan` → `COLORS.cyanBright` (flash effect should be vivid)

4. **Phase 2 border glow**: `COLORS.cyan` → `COLORS.cyanBright` for the boxShadow rgba values (glows need bright variant)

5. **Phase 2 border solid**: Keep `COLORS.cyan` (#0D9488) for the 2px border line

6. **Corner accents**: Keep as-is (coral + cyan, these are border colors)

7. **hero-poster.png**: This is the evolved image shown in Phase 2. Two options:
   - **Option A**: Take a new screenshot of the current bright-mode app and use that
   - **Option B**: Remove Phase 2 entirely and keep the logo.png centered with enhanced animation
   - **Recommended**: Option A — capture a bright-mode app screenshot at 1376×768

---

## Step 5: Title Slam — `scenes/TitleSlam.tsx`

### Changes:
1. **Title text color**: Keep `COLORS.coral` (red works on both dark and light)

2. **Title text shadow**:
   - `${COLORS.amberLight}88` → `${COLORS.amber}44` (subtler glow on bright bg)
   - Remove the heavy 60px outer glow: `${COLORS.amberLight}44` → remove or reduce to `${COLORS.amber}22`
   - Keep the 4px bottom shadow: `${COLORS.coralMid}` (depth effect)

3. **Subtitle text color**: `COLORS.textSecondary` (#4A4A6A, dark on light)

4. **Subtitle text shadow**: `${COLORS.textSecondary}33` → remove entirely (no glow needed on bright bg)

---

## Step 6: Call To Action — `scenes/CallToAction.tsx`

### Changes:
1. **Badge border**: `COLORS.terminalGreen` (#15803D, darkened)

2. **Badge background**: `${COLORS.surfaceBase}DD` (#FFFFFFDD — white panel with slight transparency)

3. **Box shadow**: Use `terminalGreenBright` for glow visibility:
   ```
   0 0 20px ${COLORS.terminalGreenBright}${...}
   inset 0 0 20px ${COLORS.terminalGreenBright}11
   ```

4. **Text color**: `COLORS.terminalGreen` (#15803D — dark green, readable on white)

5. **Text shadow**: `${COLORS.terminalGreenBright}44` (subtle bright glow)

---

## Step 7: Effects — Lighter for Bright Mode

### CrtOverlay.tsx
- Reduce scanline opacity: `rgba(0, 0, 0, 0.15)` → `rgba(0, 0, 0, 0.06)`
- Lighter scanlines suit bright backgrounds

### Vignette.tsx
- **Invert the vignette** — instead of darkening edges, add a subtle warm fade:
  ```
  radial-gradient(ellipse at center, transparent 60%, rgba(248, 246, 240, 0.5) 100%)
  ```
  OR remove entirely (bright pages don't need vignettes as much)
- **Recommended**: Keep a very subtle one — `rgba(26, 26, 46, 0.15)` at edges

### ScreenFlicker.tsx
- Change flash from black to white: `backgroundColor: "white"` (flash-white fits bright mode)
- Or reduce intensity: opacity values `0.92 → 0.96` (subtler flicker)

---

## Step 8: Main Composition — `HeroAnimation.tsx`

### Changes:
1. **Background**: `COLORS.surfaceDeep` is now #F8F6F0 (bright) — no code change needed, the constant swap handles it

---

## Step 9: Generate New hero-poster.png

The Phase 2 of LobsterEvolution shows `hero-poster.png`. This needs to be a bright-mode screenshot.

**Steps**:
1. Run `bun dev` in `apps/app`
2. Navigate to the home page (connected or not)
3. Take a 1376×768 screenshot
4. Save as `apps/landing/public/hero-poster.png`

Alternative: If the poster doesn't work well in the animation, consider replacing Phase 2 with a larger logo treatment (the red claw pokeball centered with animated glow border).

---

## Step 10: Render & Deploy

```bash
cd apps/landing
bun run dev:remotion    # Preview in Remotion Studio, verify all scenes
bun run render:hero     # Render to out/hero.mp4
cp out/hero.mp4 public/hero.mp4
bun run build           # Build Astro site
```

Then deploy:
```bash
cd /path/to/claw-trainer
rm -rf "apps/landing/dist/village/Farmer Generator Linux Build"  # Remove >25MB file
wrangler pages deploy apps/landing/dist --project-name=clawtrainer-landing --branch=main
```

---

## File Change Summary

| File | Type | Description |
|------|------|-------------|
| `remotion/constants.ts` | Rewrite | Full color palette swap to bright mode |
| `remotion/HeroAnimation.tsx` | No change | Background auto-updates via constants |
| `remotion/scenes/BootSequence.tsx` | Modify | Dark terminal panel on bright bg |
| `remotion/scenes/GridReveal.tsx` | Modify | Cyan grid, reduced opacity |
| `remotion/scenes/LobsterEvolution.tsx` | Modify | logo.png, glow colors, poster |
| `remotion/scenes/TitleSlam.tsx` | Modify | Text colors, reduced shadows |
| `remotion/scenes/CallToAction.tsx` | Modify | White panel, dark green text |
| `remotion/effects/CrtOverlay.tsx` | Modify | Lighter scanlines (0.06) |
| `remotion/effects/Vignette.tsx` | Modify | Subtle warm vignette or remove |
| `remotion/effects/ScreenFlicker.tsx` | Modify | White flash, subtler |
| `public/hero-poster.png` | Replace | New bright-mode screenshot |
| `public/hero.mp4` | Replace | Re-rendered video |

---

## Design Principles

1. **Boot terminal stays dark** — code/terminal blocks keep dark bg (`#1A1A2E`) even in bright mode, like VS Code embedded terminal
2. **Glows use bright variants** — `cyanBright`/`amberLight`/`terminalGreenBright` for shadow/glow effects where visual impact matters
3. **Text uses dark variants** — `cyan`/`amber`/`terminalGreen` for readable text and solid borders
4. **Less is more** — bright backgrounds need subtler effects (less vignette, lighter scanlines, softer glows)
5. **Logo is `logo.png`** — the red claw pokeball, NOT `logo-new.png`
