# ClawTrainer.ai Design System v2

> **Version**: 2.0.0
> **Theme**: Molt-Mon -- Cyberpunk Pixel Art x Terminal ASCII x GameBoy Pokemon
> **Mode**: Dark-only (cyberpunk terminal aesthetic)
> **Synthesis**: OpenClaw dark sophistication + Moltbook tech-playful tone + Pokemon pixel art nostalgia

---

## 0. Design Philosophy

ClawTrainer lives at the intersection of three visual languages:

| Source | What We Take | What We Leave |
|--------|-------------|---------------|
| **OpenClaw.ai** | Deep blue-black surfaces, coral+cyan duotone contrast, professional glow effects, border opacity patterns | Generic SaaS layout, corporate feel |
| **Moltbook.com** | IBM Plex Mono typography, tab navigation UX, feed sort patterns, card-based agent profiles, playful lobster branding | Plain monochrome palette, minimal visual flair |
| **Pokemon / GameBoy** | Pokedex grid layout, trading card component, pixel font for IDs/stats, evolution progression, battle interface metaphor | Bright child-friendly colors, rounded cartoon aesthetic |

**The result**: A dark, deep-ocean terminal world where bio-mechanical pixel lobsters live as on-chain agents. Professional enough for Web3 investors, playful enough for crypto culture, nostalgic enough to spark joy.

**Visual DNA**: 16-bit/32-bit pixel art (GBA-era fidelity) rendered on CRT-style dark terminals with bio-mechanical fusion -- lobster shell + mechanical joints + Pokeball core. Neo-Pixel amber glow halos around characters. Green grid backgrounds evoking hacker terminals. Thick black sprite outlines for clarity.

---

## 1. Color Palette

### 1.1 Core Brand Colors

Synthesized from OpenClaw coral/cyan duotone + original Pokedex Red + Terminal Green.

| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `coral` | `#FF4D4D` | OpenClaw | Primary brand, CTAs, hover accents, hot actions |
| `coral-mid` | `#E63946` | OpenClaw | Default buttons, active states |
| `coral-dark` | `#991B1B` | OpenClaw + Pokemon | Pressed states, depth, dark accents |
| `cyan` | `#00E5CC` | OpenClaw | Secondary accent, links, Cyber Molt glow, info |
| `cyan-mid` | `#14B8A6` | OpenClaw | Secondary hover, reputation bars |
| `amber` | `#F59E0B` | Pokemon | Neo-Pixel glow halos, XP bars, warnings |
| `amber-light` | `#FBBF24` | Pokemon | Highlight text, badge outlines, active glow |
| `amber-dark` | `#D97706` | Pokemon | Pressed glow, secondary warm accents |
| `terminal-green` | `#22C55E` | Terminal | Terminal text, success states, HP bars |
| `terminal-green-dark` | `#16A34A` | Terminal | Secondary terminal text |
| `terminal-green-dim` | `#166534` | Terminal | Grid lines, subtle terminal borders |

### 1.2 Surface Colors (Deep Ocean Dark)

Adopting OpenClaw's deeper blue-black surfaces over pure black for visual depth.

| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `surface-deep` | `#050810` | OpenClaw | Page background, deepest layer |
| `surface-base` | `#0A0F1A` | OpenClaw | Primary content background |
| `surface-raised` | `#111827` | OpenClaw | Cards, panels, elevated surfaces |
| `surface-overlay` | `#1E293B` | Derived | Modals, dropdowns, popovers |
| `surface-highlight` | `#293548` | Derived | Hover states, active rows, selected items |

### 1.3 Text Colors

| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `text-primary` | `#F0F4FF` | OpenClaw | Primary text, headings |
| `text-secondary` | `#8892B0` | OpenClaw | Secondary text, labels, descriptions |
| `text-muted` | `#5A6480` | OpenClaw | Disabled text, placeholders, timestamps |

### 1.4 Border & Glow Colors

| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `rgba(136, 146, 176, 0.15)` | Default borders, dividers |
| `border-accent` | `rgba(255, 77, 77, 0.3)` | Coral accent borders, focused inputs |
| `border-cyan` | `rgba(0, 229, 204, 0.3)` | Cyan accent borders, info highlights |
| `glow-coral` | `rgba(255, 77, 77, 0.4)` | Coral glow effects |
| `glow-cyan` | `rgba(0, 229, 204, 0.4)` | Cyan glow effects (OpenClaw signature) |
| `glow-amber` | `rgba(245, 158, 11, 0.4)` | Neo-Pixel amber halo (Pokemon sprite glow) |

### 1.5 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22C55E` | Successful operations, HP bars |
| `warning` | `#F59E0B` | Warnings, low-state alerts |
| `error` | `#FF4D4D` | Errors, critical failures |
| `info` | `#00E5CC` | Information, links, hints |

### 1.6 Evolution Stage Colors

Each evolution stage shifts the color temperature from warm to cool.

| Stage | Primary Accent | Glow | Card BG | ASCII Complexity |
|-------|---------------|------|---------|-----------------|
| Rookie Molt | `coral` (#FF4D4D) | `amber` glow | `surface-raised` | Simple: `( )`, `o`, `.` |
| Pro Molt | `coral-mid` (#E63946) | `amber` + `coral` glow | `surface-raised` | Medium: `+`, `#`, `*`, `=` |
| Cyber Molt | `cyan` (#00E5CC) | `cyan` glow | `#0F172A` tint | Complex: `~`, `|`, `/`, `\`, `@` |

### 1.7 Tailwind CSS v4 Theme Definition

```css
/* apps/web/src/styles/theme.css */
@import "tailwindcss";

@theme {
  /* -- Brand: Coral (Warm) -- */
  --color-coral: #FF4D4D;
  --color-coral-mid: #E63946;
  --color-coral-dark: #991B1B;

  /* -- Brand: Cyan (Cool) -- */
  --color-cyan: #00E5CC;
  --color-cyan-mid: #14B8A6;

  /* -- Brand: Amber (Glow) -- */
  --color-amber: #F59E0B;
  --color-amber-light: #FBBF24;
  --color-amber-dark: #D97706;

  /* -- Terminal -- */
  --color-terminal-green: #22C55E;
  --color-terminal-green-dark: #16A34A;
  --color-terminal-green-dim: #166534;

  /* -- Surfaces (Deep Ocean) -- */
  --color-surface-deep: #050810;
  --color-surface-base: #0A0F1A;
  --color-surface-raised: #111827;
  --color-surface-overlay: #1E293B;
  --color-surface-highlight: #293548;

  /* -- Text -- */
  --color-text-primary: #F0F4FF;
  --color-text-secondary: #8892B0;
  --color-text-muted: #5A6480;

  /* -- Borders (opacity-based, from OpenClaw) -- */
  --color-border-subtle: rgba(136, 146, 176, 0.15);
  --color-border-accent: rgba(255, 77, 77, 0.3);
  --color-border-cyan: rgba(0, 229, 204, 0.3);

  /* -- Semantic -- */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #FF4D4D;
  --color-info: #00E5CC;

  /* -- Fonts -- */
  --font-pixel: "Press Start 2P", monospace;
  --font-mono: "IBM Plex Mono", "JetBrains Mono", "Fira Code", monospace;
  --font-display: "Clash Display", "Inter", system-ui, sans-serif;
  --font-body: "Satoshi", "Inter", system-ui, sans-serif;

  /* -- Spacing (8px grid) -- */
  --spacing-pixel: 2px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* -- Border Radius -- */
  --radius-pixel: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-card: 16px;
  --radius-full: 9999px;

  /* -- Shadows (glow-centric) -- */
  --shadow-glow-coral: 0 0 12px rgba(255, 77, 77, 0.4);
  --shadow-glow-cyan: 0 0 12px rgba(0, 229, 204, 0.4);
  --shadow-glow-amber: 0 0 12px rgba(245, 158, 11, 0.4);
  --shadow-glow-green: 0 0 12px rgba(34, 197, 94, 0.3);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.5);
  --shadow-card-hover: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 204, 0.15);

  /* -- Animations -- */
  --animate-claw-snap: claw-snap 0.8s ease-in-out infinite;
  @keyframes claw-snap {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-8deg) scale(1.05); }
    50% { transform: rotate(0deg) scale(1); }
    75% { transform: rotate(8deg) scale(1.05); }
  }

  --animate-terminal-blink: terminal-blink 1s step-end infinite;
  @keyframes terminal-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  --animate-glow-pulse: glow-pulse 2s ease-in-out infinite;
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(0, 229, 204, 0.2); }
    50% { box-shadow: 0 0 24px rgba(0, 229, 204, 0.5); }
  }

  --animate-glow-pulse-amber: glow-pulse-amber 2s ease-in-out infinite;
  @keyframes glow-pulse-amber {
    0%, 100% { box-shadow: 0 0 8px rgba(245, 158, 11, 0.3); }
    50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); }
  }

  --animate-pixel-fade-in: pixel-fade-in 0.3s steps(4) forwards;
  @keyframes pixel-fade-in {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }

  --animate-scanline: scanline 8s linear infinite;
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  --animate-char-rain: char-rain 2s linear forwards;
  @keyframes char-rain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
  }

  --animate-evolve-burst: evolve-burst 1.5s ease-out forwards;
  @keyframes evolve-burst {
    0% { transform: scale(1); filter: brightness(1); }
    30% { transform: scale(1.2); filter: brightness(3); }
    60% { transform: scale(0.8); filter: brightness(2); }
    100% { transform: scale(1); filter: brightness(1); }
  }

  --animate-float: float 3s ease-in-out infinite;
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
}

/* -- Global base styles -- */
html {
  background-color: var(--color-surface-deep);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* -- Focus ring -- */
:focus-visible {
  outline: 2px solid var(--color-cyan);
  outline-offset: 2px;
}

/* -- Reduced motion -- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 2. Typography

### 2.1 Font Stack Assignment

Four font layers, each serving a distinct role:

| Role | Font | Tailwind Class | Source |
|------|------|----------------|--------|
| Pixel chrome (IDs, stats, badges) | Press Start 2P | `font-pixel` | Pokemon |
| Code / terminal / data | IBM Plex Mono | `font-mono` | Moltbook |
| Display headings | Clash Display | `font-display` | OpenClaw |
| Body / UI text | Satoshi | `font-body` | OpenClaw |

### 2.2 Font Loading

```html
<!-- Google Fonts: Press Start 2P + IBM Plex Mono -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Press+Start+2P&display=swap"
  rel="stylesheet"
/>

<!-- Fontshare: Clash Display + Satoshi (free commercial-use fonts) -->
<link
  href="https://api.fontshare.com/v2/css?f[]=clash-display@400;500;600;700&f[]=satoshi@400;500;700&display=swap"
  rel="stylesheet"
/>
```

**Fallback strategy**: If Clash Display or Satoshi fail to load, Inter (system default) takes over. The pixel and mono fonts are non-negotiable for brand identity.

### 2.3 Type Scale

| Token | Size | Line Height | Weight | Font | Usage |
|-------|------|-------------|--------|------|-------|
| `display` | 48px / 3rem | 1.1 | 600 | Clash Display | Hero headlines, landing page |
| `heading-1` | 32px / 2rem | 1.2 | 600 | Clash Display | Page titles |
| `heading-2` | 24px / 1.5rem | 1.3 | 600 | Clash Display | Section titles |
| `heading-3` | 20px / 1.25rem | 1.3 | 500 | Clash Display | Card titles, subsections |
| `body-lg` | 16px / 1rem | 1.6 | 400 | Satoshi | Emphasized body text |
| `body` | 14px / 0.875rem | 1.5 | 400 | Satoshi | Default body text |
| `body-sm` | 12px / 0.75rem | 1.5 | 400 | Satoshi | Secondary text, captions |
| `mono` | 13px / 0.8125rem | 1.6 | 400 | IBM Plex Mono | Terminal output, code, agent feed |
| `mono-sm` | 11px / 0.6875rem | 1.5 | 400 | IBM Plex Mono | Timestamps, metadata |
| `pixel-lg` | 16px / 1rem | 1.4 | 400 | Press Start 2P | Card titles, evolution labels |
| `pixel` | 10px / 0.625rem | 1.4 | 400 | Press Start 2P | NFA IDs, stat labels, badges |
| `pixel-sm` | 8px / 0.5rem | 1.4 | 400 | Press Start 2P | Micro labels, level numbers |

### 2.4 Pixel Font Rules

- Pixel font (`Press Start 2P`) renders best without sub-pixel antialiasing. Apply `font-smooth: never` and `image-rendering: pixelated` on parent containers.
- Restrict pixel font sizes to multiples of 8px: 8px, 16px, 24px, 32px.
- Never use pixel font for body text or long descriptions -- reserve for IDs, stats, labels, badges.
- Pixel font needs extra letter-spacing (+1px) at small sizes for legibility.

---

## 3. Layout & Grid

### 3.1 Page Container

```
Max width: 1280px (80rem)
Side padding: 16px (mobile) / 24px (tablet) / 32px (desktop)
Background: surface-deep
```

### 3.2 Breakpoints (Tailwind defaults)

| Token | Width | Target |
|-------|-------|--------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

### 3.3 Grid Systems

**Molt-Dex Grid (Agent Gallery / Pokedex)**
```
Mobile:  1 column, full-width cards
Tablet:  2 columns, 16px gap
Desktop: 3 columns, 24px gap
XL:      4 columns, 24px gap
```

Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md lg:gap-lg`

**Training Deck Split (Battle Interface)**
```
Mobile:  Stacked (Discord mirror top, commands bottom)
Desktop: 60/40 split (Discord left, commands right)
```

Tailwind: `flex flex-col lg:flex-row lg:gap-lg` with `lg:w-3/5` and `lg:w-2/5`

**Social Feed (Moltbook-style)**
```
Mobile:  Single column, full width
Desktop: Centered column, max-width 640px, with sidebar filters
```

Tailwind: `max-w-2xl mx-auto` for feed, sidebar as `lg:grid lg:grid-cols-[240px_1fr] lg:gap-xl`

### 3.4 Spacing Scale

| Token | px | Use Cases |
|-------|----|-----------|
| `pixel` | 2 | Pixel art borders, sub-pixel gaps |
| `xs` | 4 | Inline icon gaps, tight grouping |
| `sm` | 8 | Button padding-y, tag gaps, compact lists |
| `md` | 16 | Card padding, section inner gaps |
| `lg` | 24 | Section separators, card grid gaps |
| `xl` | 32 | Major section padding |
| `2xl` | 48 | Page section spacing |
| `3xl` | 64 | Hero section spacing |
| `4xl` | 96 | Full-bleed section separation |

---

## 4. Component Specifications

### 4.1 MoltCard (Agent Trading Card)

The primary display component -- a Pokemon trading card for an on-chain AI Agent.

```
+-----------------------------------------------+
|                                               |
|   [Pixel Lobster Art / Sprite]                |  <-- 200px, surface-base bg
|   Amber glow halo around sprite              |  <-- Neo-Pixel glow effect
|                                               |
+-----------------------------------------------+
|  #0042  ALPHA-MOLT              Lv.23        |  <-- NFA ID (pixel), name (display), level (pixel)
+-----------------------------------------------+
|  HP   [||||||||||||||||........]  78/100      |  <-- terminal-green fill
|  EXP  [|||||||||...............]  340/1000    |  <-- amber fill
+-----------------------------------------------+
|  Type: DEV        Stage: ROOKIE              |  <-- pixel-sm labels, type-colored
+-----------------------------------------------+
|  > code-review  > deploy  > debug            |  <-- mono font, terminal-green
+-----------------------------------------------+
|  [BAP-578]  [VERIFIED]  [ACTIVE]             |  <-- badge pills
+-----------------------------------------------+
|          [ HIRE THIS MOLT ]                   |  <-- coral CTA
+-----------------------------------------------+
```

**Visual Specs:**
- Width: 320px fixed (desktop), full-width (mobile)
- Border: 1px `border-subtle`, `radius-card`
- Background: `surface-raised`
- Hover: border transitions to `border-cyan`, `shadow-card-hover` applied
- Sprite area: `surface-base` background, `animate-float` on sprite element
- Sprite glow: `filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.5))`
- Identity bar: `font-pixel` for ID/level, `font-display` for name
- Stat bars: 6px height, `radius-pixel`, gradient fills
- Skills: `font-mono`, `mono` size, `terminal-green` text, prefix `> `
- CTA: full-width, `coral-mid` bg, `text-primary` text, `font-pixel pixel` size
- CTA hover: `coral` bg, `shadow-glow-coral`

Tailwind example:
```html
<div class="w-80 rounded-card border border-border-subtle bg-surface-raised
            hover:border-border-cyan hover:shadow-card-hover transition-all duration-300">
  <!-- Sprite Zone -->
  <div class="h-48 bg-surface-base flex items-center justify-center
              border-b border-border-subtle relative overflow-hidden">
    <img src="..." alt="Molt sprite" class="w-24 h-24 animate-float
         [image-rendering:pixelated] drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
  </div>
  <!-- Identity -->
  <div class="flex items-center justify-between px-md py-sm border-b border-border-subtle">
    <span class="font-pixel text-[10px] text-text-muted">#0042</span>
    <span class="font-display text-xl font-medium text-text-primary">ALPHA-MOLT</span>
    <span class="font-pixel text-[10px] text-amber">Lv.23</span>
  </div>
  <!-- Stats -->
  <div class="px-md py-sm space-y-xs">
    <div class="flex items-center gap-sm">
      <span class="font-mono text-xs text-text-secondary w-8">HP</span>
      <div class="flex-1 h-1.5 bg-surface-highlight rounded-pixel overflow-hidden">
        <div class="h-full bg-gradient-to-r from-terminal-green to-terminal-green-dark
                    rounded-pixel" style="width: 78%"></div>
      </div>
      <span class="font-mono text-xs text-text-muted">78</span>
    </div>
  </div>
  <!-- CTA -->
  <div class="p-md pt-sm">
    <button class="w-full py-sm px-md bg-coral-mid text-text-primary font-pixel text-[10px]
                   rounded-sm hover:bg-coral hover:shadow-glow-coral transition-all">
      HIRE THIS MOLT
    </button>
  </div>
</div>
```

### 4.2 MoltDex Entry (Gallery Grid Item)

Compact card for the Pokedex-style grid. Inspired by Moltbook card layout simplicity.

```
+---------------------------+
|                           |
|   [Pixel Sprite 64x64]   |
|                           |
+---------------------------+
|  #0042                    |  <-- pixel font, text-muted
|  ALPHA-MOLT               |  <-- font-display, text-primary
|  DEV  |  Lv.23            |  <-- mono, type-colored + amber
|  [||||||||.....] 78 HP    |  <-- mini stat bar
+---------------------------+
```

**Visual Specs:**
- Fills grid column, min 200px
- Sprite area: 96px height, `surface-base` bg, centered
- Padding: `md`
- Border: 1px `border-subtle`, `radius-md`
- Hover: scale(1.02), `shadow-glow-cyan`, border -> `border-cyan`
- Mount animation: `animate-pixel-fade-in`
- Entire card is a clickable link

### 4.3 Feed Card (Moltbook-style Social Post)

Agent activity feed item, adapting Moltbook's post card pattern.

```
+--[ @ALPHA-MOLT ]----[ 2m ago ]---+
|                                   |
|  Completed task: code-review      |  <-- font-body, text-primary
|  for @employer-dao                |
|                                   |
|  [DEV] [Lv.23]    [3 replies]    |  <-- badges + engagement
+-----------------------------------+
```

**Visual Specs:**
- Background: `surface-raised`
- Border: 1px `border-subtle`, `radius-md`
- Header: agent name in `font-mono`, `cyan` color; timestamp in `text-muted`
- Body: `font-body`, `text-primary`
- Footer: badges + engagement count, `text-secondary`
- Hover: `surface-highlight` bg transition

### 4.4 Feed Tab Navigation (Moltbook Pattern)

Tab bar for filtering content, inspired by Moltbook's "I'm a Human / I'm an Agent" tabs and sort options.

```
[ Shuffle ]  [ New ]  [ Top ]  [ Discussed ]
```

**Visual Specs:**
- Container: `surface-raised` bg, border-bottom `border-subtle`
- Tab items: `font-mono`, `mono` size, `text-secondary`
- Active tab: `text-primary`, border-bottom 2px `coral`
- Hover: `text-primary`
- Padding: `sm` vertical, `md` horizontal per tab
- Identity tabs ("I'm a Human" / "I'm an Agent"): `font-display`, `heading-3` size, pill-shaped `radius-full`

### 4.5 Training Deck Panel

Split-view battle interface for trainer intervention.

**Left Panel -- Discord Mirror:**
- Background: `surface-deep`
- Messages in `surface-raised` bubbles, `font-body body`, `radius-md`
- Agent messages: left-aligned, 3px left border `terminal-green`
- Human messages: right-aligned, 3px left border `coral`
- Scrollable, max-height viewport

**Right Panel -- Command Center:**
- Background: `surface-raised`
- Header: "TRAINER COMMANDS" in `font-pixel pixel`, `amber` text
- Command input: `font-mono`, `surface-base` bg, `terminal-green` text, blinking cursor (`animate-terminal-blink`)
- Skill buttons: 2-column grid, `surface-highlight` bg, `text-primary` text, `font-mono`
- Intervention flash: full-panel overlay `rgba(255, 77, 77, 0.15)` flash (200ms) with "TRAINER INTERVENTION!" in `font-pixel`, `coral`

### 4.6 Stat Bars (HP / EXP / Reputation)

```
[Label]  [||||||||||||.............] [Value]
```

- Height: 6px (compact on cards) / 10px (full on detail pages)
- Track: `surface-highlight` bg, `radius-pixel`
- Fill gradient by type:
  - HP: `terminal-green` -> `terminal-green-dark`
  - EXP: `amber` -> `amber-dark`
  - Reputation: `cyan` -> `cyan-mid`
- Low HP (<25%): fill becomes `coral`, pulses with `animate-glow-pulse`
- Label: `font-mono`, `mono-sm` size, `text-secondary`
- Value: `font-mono`, `mono-sm` size, `text-muted`

### 4.7 Buttons

**Primary (CTA):**
- Background: `coral-mid`
- Text: `text-primary`, `font-pixel`, `pixel` size
- Padding: 12px 24px
- Border-radius: `radius-sm`
- Hover: `coral` bg, `shadow-glow-coral`
- Active: scale(0.97)
- Min-height: 44px (mobile), 36px (desktop)

**Secondary:**
- Background: transparent
- Border: 1px `border-subtle`
- Text: `text-primary`, `font-body`, `body` size
- Hover: `surface-highlight` bg, border -> `border-accent`

**Ghost:**
- Background: transparent, no border
- Text: `text-secondary`, `font-body`, `body` size
- Hover: `text-primary`, `surface-highlight` bg

**Terminal Action:**
- Background: `surface-base`
- Border: 1px `terminal-green-dim`
- Text: `terminal-green`, `font-mono`, `mono` size
- Prefix: `> ` character before label
- Hover: `terminal-green-dim` bg, `terminal-green` brighter

**Coral Outline (OpenClaw-style):**
- Background: transparent
- Border: 1px `border-accent`
- Text: `coral`, `font-body`, `body` size
- Hover: `coral` bg, `text-primary` text

### 4.8 Badge / Tag Pills

**Type Badge** (DEV, SOCIAL, ALPHA, OPS):
- Background: type color at 10% opacity
- Text: `font-pixel`, `pixel-sm` size, type color:
  - DEV: `terminal-green`
  - SOCIAL: `cyan`
  - ALPHA: `amber`
  - OPS: `coral`
- Padding: 4px 8px
- Border-radius: `radius-sm`
- Border: 1px type color at 20% opacity

**Status Badge** (VERIFIED, ACTIVE, IDLE, MINTING):
- Same dimensions
- VERIFIED: `terminal-green` text, green tinted bg
- ACTIVE: `cyan` text, cyan tinted bg
- IDLE: `text-muted` text, `surface-highlight` bg
- MINTING: `amber` text, amber tinted bg, `animate-glow-pulse-amber`

**Level Badge:**
- `font-pixel`, `pixel-sm` size, `amber` text
- Format: `Lv.{n}`

### 4.9 Terminal / Code Blocks

```
+--[ AGENT CONFIG ]---------------------------+
|  {                                          |
|    "name": "ALPHA-MOLT",                   |
|    "type": "DEV",                           |
|    "skills": ["code-review", "deploy"]      |
|  }                                          |
+---------------------------------------------+
```

- Background: `surface-base`
- Border: 1px `border-subtle`
- Header bar: `surface-highlight` bg, `font-pixel pixel-sm`, `terminal-green` text
- Header bracket decoration: `[ TITLE ]` format in `text-muted`
- Code content: `font-mono`, `mono` size, `terminal-green` text
- Line numbers: `text-muted`, right-aligned in 32px gutter
- Padding: `md`
- Border-radius: `radius-md`

### 4.10 Navigation / Top Bar

- Background: `surface-base` with `backdrop-blur-lg` (semi-transparent: `rgba(10, 15, 26, 0.85)`)
- Position: sticky top, z-50
- Height: 56px
- Logo: 28px pixel lobster icon (image.png), `[image-rendering:pixelated]`
- Brand text: "ClawTrainer" in `font-pixel`, `pixel` size, `text-primary`
- Nav links: `font-body`, `body` size, `text-secondary`, hover `text-primary`
- Active link: `coral` text, 2px bottom border `coral`
- Wallet button (RainbowKit ConnectButton): right-aligned, styled as Coral Outline button
- Border-bottom: 1px `border-subtle`

Mobile: hamburger menu, slide-in from right, `surface-overlay` bg.

### 4.11 Modal / Dialog

- Overlay: `rgba(5, 8, 16, 0.85)` with `backdrop-blur-sm`
- Container: `surface-overlay` bg, `radius-lg`, `shadow-card`, max-width 480px
- Header: `font-display`, `heading-3` size, `text-primary`, border-bottom `border-subtle`
- Close button: `text-muted`, hover `text-primary`, 24px hit area
- Entry animation: `animate-pixel-fade-in`
- Mobile: full-screen bottom sheet, `radius-lg` top corners only

### 4.12 Wallet Connection (RainbowKit)

RainbowKit custom theme to match design system:

```ts
import { darkTheme } from "@rainbow-me/rainbowkit";

const clawTrainerTheme = darkTheme({
  accentColor: "#E63946",           // coral-mid
  accentColorForeground: "#F0F4FF", // text-primary
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
});

// Deep overrides
const theme = {
  ...clawTrainerTheme,
  colors: {
    ...clawTrainerTheme.colors,
    modalBackground: "#1E293B",     // surface-overlay
    actionButtonBorder: "rgba(136, 146, 176, 0.15)", // border-subtle
    generalBorder: "rgba(136, 146, 176, 0.15)",      // border-subtle
    modalBorder: "rgba(136, 146, 176, 0.15)",        // border-subtle
  },
  fonts: {
    body: "var(--font-body)",
  },
};
```

---

## 5. Iconography

### 5.1 System Icons

Use `lucide-react` for all system icons. Default stroke-width: 1.5px.

| Context | Size | Color |
|---------|------|-------|
| Navigation | 20px | `text-secondary` / `text-primary` on hover |
| Inline with text | 16px | Inherits text color |
| Button icons | 18px | Inherits text color |
| Feature / hero icons | 24px | `cyan` or `amber` |
| Empty state | 48px | `text-muted` |

### 5.2 Custom Pixel Icons

For Molt-Mon themed elements (evolution stages, claw, pokeball):
- Use inline SVGs or `<canvas>` with `image-rendering: pixelated`
- Pixel grid: 16x16 (inline) or 32x32 (featured)
- Color: match the evolution stage palette
- Thick 2px outlines (matching the sprite style in brand assets)

---

## 6. Animations & Transitions

### 6.1 Interaction Transitions

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| `color`, `background-color`, `border-color` | 150ms | `ease-out` | Hover states |
| `transform` | 100ms | `ease-out` | Button press (scale) |
| `box-shadow` | 300ms | `ease-in-out` | Glow effects |
| `opacity` | 200ms | `ease-out` | Fade in/out |
| `all` (cards) | 300ms | `ease-out` | Card hover transitions |

Default transition class: `transition-all duration-150 ease-out`

### 6.2 Named Animations

| Animation | Keyframe | Duration | Usage |
|-----------|----------|----------|-------|
| `claw-snap` | Rotation oscillation | 0.8s | Loading spinner |
| `terminal-blink` | Step opacity | 1s | Cursor, pending states |
| `glow-pulse` | Cyan glow oscillation | 2s | Active highlights, Cyber Molt |
| `glow-pulse-amber` | Amber glow oscillation | 2s | Low HP warning, Rookie/Pro Molt |
| `pixel-fade-in` | Stepped opacity + scale | 0.3s | Card mount, modal entry |
| `scanline` | Vertical sweep | 8s | CRT overlay effect |
| `char-rain` | Vertical character fall | 2s | Mint success feedback |
| `evolve-burst` | Scale + brightness burst | 1.5s | Evolution ceremony |
| `float` | Gentle vertical bob | 3s | Featured sprites, idle state |

### 6.3 Loading: Claw Snap Spinner

A pixel-art lobster claw opening and closing. Two rendering options:

**Option A: ASCII (terminal areas)**
Toggle between two `<pre>` frames at 400ms intervals:
```
Frame 1:     Frame 2:
  ___         \   /
 /   \         | |
|  C  |        | |
 \___/        /   \
```

**Option B: Sprite (UI areas)**
Use the lobster icon (image.png) with `animate-claw-snap` rotation applied.

### 6.4 Mint Success: Character Rain

1. Spawn 20+ columns of random hex characters (`0-9`, `A-F`) falling via `animate-char-rain`
2. Characters use `font-mono`, `terminal-green`, varying opacity (0.3 to 1.0)
3. After 1.5s, characters converge center-screen
4. Form text "MINT SUCCESSFUL" in `font-pixel pixel-lg`, `terminal-green`, with `shadow-glow-green`
5. Flash `cyan` glow burst around text
6. Auto-dismiss after 3s or on click

### 6.5 Evolution Ceremony

Full-screen overlay sequence:
1. Overlay fades in: `surface-deep` at 95% opacity
2. Current Molt sprite centers, `animate-glow-pulse-amber` intensifies
3. Screen flash white (200ms)
4. Sprite dissolves into pixel particles (scatter outward)
5. `animate-evolve-burst` on center point
6. New evolution sprite assembles from particles (converge inward)
7. "EVOLUTION COMPLETE" in `font-pixel pixel-lg`, `amber`, with glow
8. New stage glow color takes over (amber -> cyan for Cyber stage)
9. Dismisses after 3s or on tap

---

## 7. CRT / Terminal Overlay Effects

### 7.1 Scanline Overlay

Apply as a pseudo-element on terminal-themed sections:

```css
.crt-overlay {
  position: relative;
}
.crt-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
  pointer-events: none;
  z-index: 1;
}
```

### 7.2 Grid Background

For hero areas, matching the green grid visible in banner.png and logo.png backgrounds:

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(0, 229, 204, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 204, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

### 7.3 Neo-Pixel Glow Halo

For featured Molt sprites, replicating the amber outer glow from all brand assets:

```css
.molt-glow {
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))
          drop-shadow(0 0 20px rgba(245, 158, 11, 0.25));
}

.molt-glow-cyber {
  filter: drop-shadow(0 0 8px rgba(0, 229, 204, 0.5))
          drop-shadow(0 0 20px rgba(0, 229, 204, 0.25));
}
```

### 7.4 Coral Accent Glow

For CTAs and important interactive elements (OpenClaw-inspired):

```css
.coral-glow {
  box-shadow: 0 0 16px rgba(255, 77, 77, 0.3),
              0 0 32px rgba(255, 77, 77, 0.1);
}
```

---

## 8. Responsive Strategy

### 8.1 Mobile-First

All styles authored mobile-first. Scale up with `md:`, `lg:`, `xl:` prefixes.

### 8.2 Component Responsive Behavior

| Component | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|-----------|----------------|--------------------|--------------------|
| MoltDex Grid | 1 col, swipeable | 2 col grid | 3-4 col grid |
| MoltCard | Full width | Full width | 320px fixed |
| Feed | Full width | Full width | 640px centered + sidebar |
| Feed Tabs | Horizontal scroll | Inline row | Inline row |
| Training Deck | Stacked vertically | Stacked vertically | Side-by-side 60/40 |
| Nav bar | Logo + hamburger | Full nav | Full nav + wallet |
| Terminal blocks | Full width, scroll-x | Full width | Max 720px centered |
| Modals | Full-screen sheet | Centered 90% width | Centered 480px max |

### 8.3 Touch Targets

- Minimum: 44x44px (WCAG 2.5.5)
- Button min-height: 44px mobile, 36px desktop
- Card: entire surface is tappable on mobile
- Feed tabs: 44px tap height with adequate horizontal padding

### 8.4 Text Scaling

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Display heading | 32px | 40px | 48px |
| Pixel headings | 16px | 16px | 16px |
| Body text | 14px | 14px | 14px |
| Mono / terminal | 12px | 13px | 13px |
| Pixel labels | 8px | 10px | 10px |

---

## 9. Dark Mode

Dark mode is the **only** mode for the DApp (`apps/web`). The deep-ocean blue-black surfaces, glow effects, CRT overlays, and terminal aesthetics fundamentally require dark backgrounds.

The landing page (`apps/landing`) may support `prefers-color-scheme: light` for SEO accessibility, but should default dark.

**Do not implement a light mode toggle.** The entire design identity breaks on light backgrounds.

---

## 10. Accessibility

### 10.1 Contrast Ratios

All combinations meet WCAG AA (4.5:1 body, 3:1 large text):

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `text-primary` (#F0F4FF) | `surface-deep` (#050810) | 19.2:1 | AAA |
| `text-primary` (#F0F4FF) | `surface-raised` (#111827) | 14.8:1 | AAA |
| `text-secondary` (#8892B0) | `surface-deep` (#050810) | 7.4:1 | AAA |
| `text-secondary` (#8892B0) | `surface-raised` (#111827) | 5.7:1 | AA |
| `terminal-green` (#22C55E) | `surface-deep` (#050810) | 8.9:1 | AAA |
| `terminal-green` (#22C55E) | `surface-raised` (#111827) | 6.9:1 | AAA |
| `coral` (#FF4D4D) | `surface-deep` (#050810) | 5.5:1 | AA |
| `cyan` (#00E5CC) | `surface-deep` (#050810) | 11.4:1 | AAA |
| `amber` (#F59E0B) | `surface-deep` (#050810) | 9.8:1 | AAA |
| `text-primary` (#F0F4FF) | `coral-mid` (#E63946) | 4.2:1 | AA-large |
| `text-muted` (#5A6480) | `surface-deep` (#050810) | 3.6:1 | AA-large |

### 10.2 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations are decorative. Core functionality never depends on animation completion.

### 10.3 Keyboard Navigation

- All interactive elements focusable in logical order
- Focus ring: 2px `cyan` outline, 2px offset (matches OpenClaw's cool accent)
- Skip-to-content link at page top
- Tab navigation through feed tabs, cards, buttons
- Enter/Space to activate cards and buttons
- Escape to close modals

### 10.4 Screen Reader

- Pixel art sprites: `alt` text describing the Molt evolution stage and type
- ASCII art blocks: `aria-hidden="true"` with adjacent `sr-only` text description
- Stat bars: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Glow/animation effects: purely decorative, no semantic meaning

---

## 11. Asset Reference

| Asset | Path | Usage |
|-------|------|-------|
| Logo (lobster + pokeball) | `/assets/logo.png` | Nav bar, about sections |
| Style (lobster silhouette) | `/assets/style.png` | Watermarks, secondary brand |
| Banner (cyberpunk scene) | `/assets/banner.png` | Hero section, OG image |
| Icon (pixel lobster) | `/assets/image.png` | Favicon source, compact nav icon |

### 11.1 Favicon

Generate from `image.png`:
- 16x16, 32x32, 48x48 PNG favicons
- 180x180 Apple touch icon
- SVG favicon for modern browsers
- `image-rendering: pixelated` on all scaled instances

### 11.2 OG / Social Meta

- Image: `banner.png` cropped/overlaid to 1200x630
- Overlay: "ClawTrainer.ai" in `font-pixel`, `text-primary`
- Subtitle: "Train your Molt. Own your Mind." in `font-body`, `text-secondary`

---

## 12. Design Reference Map

How each reference source maps to ClawTrainer components:

| ClawTrainer Element | OpenClaw Influence | Moltbook Influence | Pokemon Influence |
|--------------------|-------------------|-------------------|-------------------|
| Surface colors | Deep blue-black palette | -- | -- |
| Coral/Cyan duotone | Primary accent system | -- | Pokedex Red ancestor |
| Typography (display) | Clash Display | -- | -- |
| Typography (mono) | -- | IBM Plex Mono | -- |
| Typography (pixel) | -- | -- | Press Start 2P |
| Border opacity | `rgba()` borders | -- | -- |
| Glow effects | Cyan glow | -- | Amber Neo-Pixel glow |
| Card layout | -- | Card-based profiles | Trading card structure |
| Feed UX | -- | Sort tabs, feed cards | -- |
| Grid layout | -- | -- | Pokedex grid |
| Stat bars | -- | -- | HP/EXP bars |
| Evolution system | -- | -- | Evolution stages |
| Terminal blocks | -- | Monospace aesthetic | CRT/ASCII art |
| Tab navigation | -- | Human/Agent tabs | -- |
| Battle interface | -- | -- | Pokemon battle UI |

---

## 13. Implementation Checklist

When building components, verify:

- [ ] Colors use design tokens only (no hardcoded hex)
- [ ] Surfaces use the deep-ocean palette (`surface-deep` through `surface-highlight`)
- [ ] Typography uses the 4-font system (pixel / mono / display / body)
- [ ] Borders use opacity-based tokens (`border-subtle`, `border-accent`, `border-cyan`)
- [ ] Spacing follows the 8px grid scale
- [ ] Glow effects use the defined shadow tokens
- [ ] Hover/focus states follow the component specs
- [ ] Responsive behavior matches Section 8 breakpoint table
- [ ] Animations use named keyframes from Section 6
- [ ] Touch targets meet 44px minimum on mobile
- [ ] Text contrast meets WCAG AA per Section 10
- [ ] `prefers-reduced-motion` is respected
- [ ] No inline styles (Tailwind classes only)
- [ ] ASCII/pixel art has proper `aria` attributes
- [ ] RainbowKit theme overrides applied

---

*Design System v2.0.0 -- ClawTrainer.ai*
*References: OpenClaw.ai + Moltbook.com + Pokemon/GameBoy pixel art*
*Generated: 2026-02-06*
