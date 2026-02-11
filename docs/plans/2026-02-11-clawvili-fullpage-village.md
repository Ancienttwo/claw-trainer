# Clawvili v2: Full-Page Pixel Village Landing

## Context

clawvili.md 的核心理念是 **"The World as Interface"** — 整个 Landing Page 就是一个像素村庄。
用户滚动页面 = 摄像机在村庄中移动。现有的 6 个 Astro section 全部变成村庄中的建筑/场景。

**不是"在页面里加个小游戏"，而是"页面本身就是游戏"。**

---

## Design Decision: Bright Mode (Pokemon-Style)

全页从暗色深海主题 → **明亮像素 RPG 风格**（参考宝可梦红宝石/蓝宝石）。

### New Color Palette

```
@theme {
  /* -- Sky & Nature (Bright RPG) -- */
  --color-sky-light: #87CEEB;        /* 天空蓝 */
  --color-sky-deep: #4A90D9;         /* 深天蓝 */
  --color-grass-light: #7EC850;      /* 亮草绿 */
  --color-grass-mid: #5EA832;        /* 中草绿 */
  --color-grass-dark: #3D7A1C;       /* 暗草绿 */
  --color-dirt-light: #D4A574;       /* 亮泥土 */
  --color-dirt-mid: #B8845A;         /* 泥土棕 */
  --color-dirt-dark: #8B6340;        /* 暗泥土 */
  --color-sand: #F5DEB3;             /* 沙色 */
  --color-water-light: #5BC0EB;      /* 浅水蓝 */
  --color-water-deep: #2980B9;       /* 深水蓝 */

  /* -- Brand (Keep, adjust brightness) -- */
  --color-coral: #FF4D4D;            /* 不变 — 龙虾红 */
  --color-coral-mid: #E63946;
  --color-cyan: #00D4B8;             /* 稍微调暗一点在亮底上更可读 */
  --color-amber: #F59E0B;            /* 不变 */
  --color-terminal-green: #22C55E;   /* 不变 */

  /* -- Surfaces (Bright Mode) -- */
  --color-surface-deep: #F8F6F0;     /* 米白 (原 #050810) */
  --color-surface-base: #FFFFFF;     /* 纯白 (原 #0A0F1A) */
  --color-surface-raised: #F0EDE6;   /* 暖灰 (原 #111827) */
  --color-surface-overlay: #E8E4DC;  /* 浅灰 (原 #1E293B) */
  --color-surface-highlight: #DDD8CE;

  /* -- Text (Dark on light) -- */
  --color-text-primary: #1A1A2E;     /* 深蓝黑 (原 #F0F4FF) */
  --color-text-secondary: #4A4A6A;   /* 中灰蓝 (原 #8892B0) */
  --color-text-muted: #8888A0;       /* 浅灰 (原 #5A6480) */

  /* -- Borders (Subtle on light) -- */
  --color-border-subtle: rgba(26, 26, 46, 0.12);
  --color-border-accent: rgba(255, 77, 77, 0.3);
  --color-border-cyan: rgba(0, 212, 184, 0.3);

  /* -- Panel Overlay (for HTML content over game) -- */
  --color-panel-bg: rgba(255, 255, 255, 0.92);
  --color-panel-border: rgba(26, 26, 46, 0.15);

  /* -- Shadows (warm, no glow) -- */
  --shadow-card: 0 4px 16px rgba(26, 26, 46, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(26, 26, 46, 0.12);

  /* -- Fonts (same) -- */
  --font-pixel: "Press Start 2P", monospace;
  --font-mono: "IBM Plex Mono", "Fira Code", monospace;
  --font-display: "Clash Display", "Inter", system-ui, sans-serif;
  --font-body: "Satoshi", "Inter", system-ui, sans-serif;
}
```

### What Changes

| Element | Before (Dark) | After (Bright) |
|---|---|---|
| `html` background | #050810 (deep ocean) | #87CEEB (sky blue) |
| `body` text | #F0F4FF (white) | #1A1A2E (dark) |
| Section bg | #0A0F1A, #111827 | #FFFFFF, #F0EDE6 |
| Card borders | rgba(white, 0.15) | rgba(dark, 0.12) |
| Glow effects | Cyan/coral glow | Warm drop shadows |
| Grid bg pattern | Cyan 3% opacity | Removed (Phaser handles bg) |
| CRT scanlines | Removed | Removed (doesn't fit bright theme) |
| Navbar | Dark transparent | White/cream with subtle border |
| Footer | Dark bg | Cream bg |
| Terminal blocks | Dark bg, green text | Dark bg (keep for contrast), green text |

### Navbar & Footer Adaptation

Navbar and Footer also switch to bright mode:
- **Navbar**: `bg-white/90 backdrop-blur border-b border-border-subtle`
- **Footer**: `bg-surface-raised border-t border-border-subtle`
- Text colors invert: primary → dark, accents stay coral/cyan
- Logo stays the same but on light background
- Mobile menu: light panel instead of dark

---

## Architecture: Phaser Full-Viewport + HTML Overlay

```
┌─────────────────────────────────────────────────┐
│  Navbar (HTML, fixed top, z-50)                 │ ← 保留原样
├─────────────────────────────────────────────────┤
│                                                 │
│  Phaser Canvas (100vw × 100vh, position:fixed)  │ ← 全屏像素世界
│  - Tilemap: 40 tiles wide × 150 tiles tall      │
│  - Camera Y driven by scroll position           │
│                                                 │
├─────────────────────────────────────────────────┤
│  HTML Overlay Panels (position:absolute, z-30)  │ ← 在 scroll 触发时显示
│  - Content from current sections                │
│  - Positioned at specific scroll offsets        │
│  - Semi-transparent white panels (bright mode)   │
├─────────────────────────────────────────────────┤
│  Scroll Spacer (height: worldHeight px)         │ ← 撑起滚动高度
│  - Invisible div, only provides scroll range    │
├─────────────────────────────────────────────────┤
│  Footer (HTML, at bottom of scroll spacer)      │ ← 保留原样
└─────────────────────────────────────────────────┘
```

### Key Mechanism: Scroll-Driven Camera

```ts
// 页面滚动 → Phaser 摄像机 Y 轴移动
window.addEventListener("scroll", () => {
  const scrollPercent = window.scrollY / maxScroll
  camera.scrollY = scrollPercent * (worldHeight - viewportHeight)
})
```

用户不操作游戏角色，而是通过**滚动网页**来"走过"村庄。
这保留了 Landing Page 的基本交互模式（滚动阅读），同时用像素世界替代了枯燥的 section 切换。

---

## Village Map Layout (40×150 tiles, 16px each)

```
Y=0    ┌────────────────────────────────────────┐
       │          🌊 WATER BORDER 🌊            │
       │                                        │
Y=10   │     ╔══════════════════════════╗       │  ZONE 1: 孵化广场 (Hero)
       │     ║   Central Plaza          ║       │  - Logo + Tagline overlay
       │     ║   🦞 lobsters wander     ║       │  - Hatching machine (animated)
       │     ║   [Hatching Pod] CTA     ║       │  - "Launch App" + "View skill.md" buttons
       │     ╚══════════════════════════╝       │
       │              │ path                    │
Y=35   │     ╔════════╧═════════════════╗       │  ZONE 2: 实验室 (AgentSkill)
       │     ║   Lobster Lab            ║       │  - NPC: "Give your agent skill.md"
       │     ║   🧪 Terminal screens    ║       │  - skill.md terminal preview overlay
       │     ║   [Copy URL] button      ║       │  - 4-step process shown as lab stations
       │     ╚══════════════════════════╝       │
       │              │ path                    │
Y=60   │  ╔═══════╗  │  ╔═══════╗  ╔═══════╗  │  ZONE 3: 三区 (Features)
       │  ║ MINT  ║──┤──║ TRAIN ║──║EVOLVE ║  │  - 3 buildings side by side
       │  ║  🔴   ║  │  ║  🔵   ║  ║  🟡   ║  │  - Click → feature description overlay
       │  ╚═══════╝  │  ╚═══════╝  ╚═══════╝  │  - Lobsters demonstrating each ability
       │              │ path                    │
Y=85   │     ╔════════╧═════════════════╗       │  ZONE 4: 训练之路 (HowItWorks)
       │     ║   Training Grounds       ║       │  - 4 waypoints along a path
       │     ║   🎯 Target dummies      ║       │  - NPC at each station
       │     ║   Terminal output panel   ║       │  - Animated lobster walking the path
       │     ╚══════════════════════════╝       │
       │              │ path                    │
Y=110  │     ╔════════╧═════════════════╗       │  ZONE 5: 竞技酒馆 (TechStack)
       │     ║   Tech Tavern            ║       │  - Contract code on tavern wall
       │     ║   🏆 Leaderboard         ║       │  - Tech badges as tavern signs
       │     ║   📜 Contract address    ║       │  - NPC bartender: "Built on BNB Chain"
       │     ╚══════════════════════════╝       │
       │                                        │
Y=140  │          🌊 WATER BORDER 🌊            │
Y=150  └────────────────────────────────────────┘
```

---

## Section → Zone Mapping

| Current Section | Village Zone | Visual Theme | Content Strategy |
|---|---|---|---|
| **Hero** | Central Plaza (Y=10-30) | Open grass plaza, hatching pod, fountain | Logo/tagline as HTML overlay centered on plaza. CTA buttons float above hatching pod. Lobsters wander in background. |
| **AgentSkill** | Lobster Lab (Y=35-55) | Indoor lab, screens, test tubes | Terminal preview as HTML overlay panel (dark panel). 4 steps = 4 lab stations with NPC at each. |
| **Features** | Three Districts (Y=60-80) | 3 colored buildings: Coral/Cyan/Amber | Each building is clickable → opens feature overlay. Mint=forge, Train=gym, Evolve=evolution chamber. |
| **HowItWorks** | Training Grounds (Y=85-105) | Outdoor training field, dummies, paths | 4 waypoint markers along a dirt path. Terminal output panel floating. Animated lobster walks the path. |
| **TechStack** | Tech Tavern (Y=110-135) | Wood tavern interior, shelves, signs | Tech badges as pixel signs on wall. Contract code snippet as tavern notice board. |
| **Footer** | Village Gate (Y=140-150) | Stone gate, road leading out | Links as signposts. "Built with <3 on BNB Chain" carved in stone. |

---

## HTML Overlay System

Each zone has an associated HTML panel that appears when the user scrolls to that zone.

```astro
<!-- index.astro structure -->
<Layout>
  <Navbar />

  <!-- Phaser canvas: fixed, full viewport -->
  <div id="phaser-root" class="fixed inset-0 z-0">
    <VillageGame client:only="react" />
  </div>

  <!-- Scroll spacer: provides scroll height -->
  <div id="scroll-spacer" style="height: 4800px; position: relative;">

    <!-- Zone overlays positioned at scroll offsets -->
    <HeroOverlay t={t.hero} style="top: 0px" />           <!-- 0-960px -->
    <LabOverlay t={t.agentSkill} style="top: 960px" />     <!-- 960-1920px -->
    <DistrictOverlay t={t.features} style="top: 1920px" /> <!-- 1920-2880px -->
    <TrainingOverlay t={t.howItWorks} style="top: 2880px" /><!-- 2880-3840px -->
    <TavernOverlay t={t.techStack} style="top: 3840px" />  <!-- 3840-4800px -->

  </div>

  <Footer />
</Layout>
```

Each overlay component:
- `position: absolute` within the scroll spacer
- Semi-transparent white background (`bg-white/92 backdrop-blur-sm`)
- Warm border (`border border-border-subtle rounded-xl shadow-card`)
- Appears naturally as user scrolls (no animation needed — just positioned correctly)
- Contains the same content as the original Astro sections, restyled for bright mode
- `pointer-events: auto` on panels, `pointer-events: none` on spacer
- Text: dark primary (`text-text-primary`), accents stay coral/cyan/amber
- Terminal blocks: keep dark bg (`bg-[#1A1A2E]`) for contrast — pixel terminal feel

---

## Phaser World Structure

### Scenes

1. **BootScene** — Load/generate assets, show pixel loading bar
2. **VillageScene** — Main world scene, receives scroll events

### Camera System

- Camera viewport = browser viewport (100vw × 100vh)
- World bounds = 640 × 2400 pixels (40×150 tiles at 16px)
- Scale.FIT to fill viewport width
- Camera Y = `scrollPercent * (worldHeight - viewportHeight)`
- No player character — camera moves with scroll

### Tilemap Layers (bottom to top)

1. **water** — Light blue water with wave animation (#5BC0EB / #2980B9)
2. **ground** — Bright grass (#7EC850) with variation patches (#5EA832)
3. **paths** — Warm dirt/stone walkways (#D4A574 / #B8845A)
4. **buildings-base** — White/cream stone walls, warm wood accents
5. **buildings-roof** — Colored roofs per building (coral/cyan/amber/green)
6. **decorations** — Trees (bright green), flowers (multicolor), signs, fences
7. **collision** — Invisible layer for zone detection

**Bright palette for Phaser world (hex for Phaser):**
```ts
const BRIGHT_COLORS = {
  sky: 0x87ceeb,
  grassLight: 0x7ec850,
  grassMid: 0x5ea832,
  grassDark: 0x3d7a1c,
  dirtLight: 0xd4a574,
  dirtMid: 0xb8845a,
  waterLight: 0x5bc0eb,
  waterDeep: 0x2980b9,
  sand: 0xf5deb3,
  wallWhite: 0xf0ede6,
  wallWood: 0xc4a882,
  roofCoral: 0xff4d4d,
  roofCyan: 0x00d4b8,
  roofAmber: 0xf59e0b,
  roofGreen: 0x22c55e,
  treeTrunk: 0x8b6340,
  treeLeaf: 0x4caf50,
  flowerPink: 0xff69b4,
  flowerYellow: 0xffd700,
}
```

### Entities

- **Lobsters** (5-8): Patrol between zones, colored variants, name labels
- **NPCs** (5-6): One per zone, clickable, dialogue bubbles
- **Ambient**: Fireflies, water ripples, smoke from chimneys

---

## Asset Strategy

### Day 1: Open-Source Pixel Art

Priority: Use existing open-source tilesets to get visual quality fast.

| Asset | Source | License |
|---|---|---|
| Village tileset | [Serene Village Revamped by LimeZu](https://limezu.itch.io/serenevillagerevamped) | CC-BY 4.0 |
| Character sprites | [Top-Down Prototype Character by Snoblin](https://snoblin.itch.io/pixel-rpg-free-npc) | Free |
| Crab/lobster base | [2D Pixel Art Crab by Elthen](https://elthen.itch.io/2d-pixel-art-crab-sprites) | Commercial OK |
| UI elements | Programmatic (Phaser.Graphics) | N/A |

If licensing is unclear, fall back to programmatic generation (like the current BootScene approach).

### Day 2-3: Custom Assets

- Commission or create ClawTrainer-branded lobster sprites (3 color variants)
- Custom building facades matching brand (coral forge, cyan lab, amber tavern)
- Tinted versions of open-source tiles to match brand palette

---

## Mobile Strategy

**< 768px**: Don't load Phaser. Show a static pixel art poster image with zone-based navigation buttons.

```astro
<!-- Mobile fallback -->
<div class="lg:hidden">
  <img src="/village/poster.png" alt="Clawvili" class="w-full" />
  <nav class="grid grid-cols-2 gap-4 p-6">
    <a href="#hero">Plaza</a>
    <a href="#lab">Lab</a>
    <a href="#features">Districts</a>
    <a href="#training">Training</a>
  </nav>
  <!-- Then render original Astro sections as-is for mobile -->
  <Hero t={t.hero} />
  <AgentSkill t={t.agentSkill} />
  ...
</div>
```

Desktop (>= 768px): Full Phaser experience.

---

## File Structure

```
apps/landing/
  public/village/
    tilesets/               # Open-source tileset PNGs
    sprites/                # Character/lobster sprite sheets
    poster.png              # Mobile fallback poster
  src/
    components/village/
      VillageGame.tsx        # React wrapper (client:only="react")
      config.ts              # Phaser GameConfig + constants
      scenes/
        BootScene.ts         # Asset preload + progress bar
        VillageScene.ts      # Main world: tilemap + scroll camera
      entities/
        Lobster.ts           # Waypoint patrol sprite
        NPC.ts               # Clickable NPC + events
      systems/
        ScrollCamera.ts      # Syncs window.scrollY → Phaser camera
        DialogueSystem.ts    # Bubble text manager
        ZoneSystem.ts        # Building hover/click detection
        OverlayBridge.ts     # Phaser → HTML overlay communication
      data/
        village-map.ts       # Programmatic tilemap generation
        zone-defs.ts         # Zone positions, targets, descriptions
        npc-defs.ts          # NPC positions, names, dialogues
        lobster-defs.ts      # Lobster patrol paths
    components/overlays/
      HeroOverlay.astro      # Hero content (over plaza)
      LabOverlay.astro       # AgentSkill content (over lab)
      DistrictOverlay.astro  # Features content (over districts)
      TrainingOverlay.astro  # HowItWorks content (over training)
      TavernOverlay.astro    # TechStack content (over tavern)
    pages/
      index.astro            # Rewired: Phaser + overlays + mobile fallback
```

---

## Implementation Phases

### Phase 0: Theme Switch (Task 0)

0. **Switch global.css to bright mode** — Replace all dark surface/text/border tokens with bright equivalents. Update Navbar.astro + Footer.astro to bright variants. Verify existing pages still render correctly.

### Phase 1: Engine Foundation (Tasks 1-5)

1. **Install deps** — `bun add phaser @astrojs/react`
2. **Rewrite index.astro** — Phaser canvas (fixed) + scroll spacer + overlay slots + mobile fallback
3. **VillageGame.tsx + config.ts** — Full-viewport Phaser, Scale.FIT, sky-blue background
4. **ScrollCamera system** — `window.scrollY` → `camera.scrollY` sync with rAF
5. **BootScene + VillageScene shell** — Programmatic bright tilemap (grass/water/paths), 40×150 grid
6. **Verify**: Scroll page = camera moves through bright green/blue world

### Phase 2: World Building (Tasks 5-8)

5. **Village tilemap data** — Zone layouts, buildings, paths, water
6. **Building rendering** — Draw 5 zone buildings with colored roofs
7. **Zone system** — Hover highlight, click detection per building
8. **Lobster entities** — 5-8 lobsters on patrol routes between zones

### Phase 3: Content Overlays (Tasks 9-13)

9. **HeroOverlay** — Logo + tagline + CTA (replaces Hero.astro content)
10. **LabOverlay** — skill.md terminal + steps (replaces AgentSkill.astro content)
11. **DistrictOverlay** — 3 feature cards (replaces Features.astro content)
12. **TrainingOverlay** — 4-step flow + terminal (replaces HowItWorks.astro content)
13. **TavernOverlay** — Tech badges + contract (replaces TechStack.astro content)

### Phase 4: Interaction + Polish (Tasks 14-17)

14. **NPC entities + DialogueSystem** — Clickable NPCs with bubbles
15. **OverlayBridge** — Phaser events trigger HTML overlay visibility
16. **Mobile fallback** — < 768px renders original sections without Phaser
17. **Open-source assets** — Replace programmatic tiles with real pixel art

---

## Verification Checklist

1. Desktop: Page loads → see pixel village plaza (Zone 1)
2. Scroll down → camera smoothly pans through village zones
3. Each zone has its corresponding HTML overlay content
4. Click building → highlight + info overlay
5. Lobsters patrol between zones during scroll
6. NPC click → dialogue bubble
7. Mobile (< 768px) → original section layout, no Phaser
8. `bun run build` → no SSR errors
9. Lighthouse: Performance > 80 (Phaser is lazy-loaded)

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Phaser bundle too large (1.5MB) | Lazy load via `client:only="react"`, only on desktop |
| Scroll jank | Use `requestAnimationFrame` for scroll→camera sync, debounce |
| Mobile perf | Don't load Phaser on mobile at all |
| Asset licensing | Verify each itch.io asset is commercial-OK before using |
| Content accessibility | HTML overlays remain screen-reader accessible |
| SEO | Overlay text is real HTML, crawlable |

---

## Dependencies on Existing Code

| Keep As-Is | Modify | Replace |
|---|---|---|
| `Navbar.astro` | `index.astro` (rewrite) | `Hero.astro` → `HeroOverlay.astro` |
| `Footer.astro` | `i18n/*` (add village keys) | `AgentSkill.astro` → `LabOverlay.astro` |
| `Layout.astro` | `astro.config.mjs` (add react) | `Features.astro` → `DistrictOverlay.astro` |
| `global.css` | `package.json` (add phaser) | `HowItWorks.astro` → `TrainingOverlay.astro` |
| `LocaleSwitcher.astro` | | `TechStack.astro` → `TavernOverlay.astro` |

Original section components are NOT deleted — they're reused as content sources for the overlay components, and serve as mobile fallback.
