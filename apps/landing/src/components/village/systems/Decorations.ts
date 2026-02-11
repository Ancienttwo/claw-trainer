import Phaser from 'phaser'

// ── Signposts ──────────────────────────────────────
const SIGNPOST_DEFS = [
  { x: 630, y: 510, labels: ['← Lab', 'Shop →'] },
  { x: 1320, y: 510, labels: ['← Plaza', 'Arena ↓'] },
] as const

function drawSignpost(scene: Phaser.Scene, def: typeof SIGNPOST_DEFS[number]): void {
  const gfx = scene.add.graphics()
  gfx.setDepth(def.y)

  gfx.fillStyle(0x7a5c28, 1)
  gfx.fillRect(def.x - 3, def.y - 42, 6, 42)

  for (let i = 0; i < def.labels.length; i++) {
    const sy = def.y - 39 + i * 18
    gfx.fillStyle(0xb8924a, 1)
    gfx.fillRect(def.x - 30, sy, 60, 15)
    gfx.lineStyle(1, 0x7a5c28, 1)
    gfx.strokeRect(def.x - 30, sy, 60, 15)
  }

  for (let i = 0; i < def.labels.length; i++) {
    scene.add
      .text(def.x, def.y - 33 + i * 18, def.labels[i], {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '7px',
        color: '#3a2810',
      })
      .setOrigin(0.5, 0.5)
      .setDepth(def.y + 1)
  }
}

// ── Flowers ────────────────────────────────────────
const FLOWER_COLORS = [0xff6b8a, 0xffaa44, 0xeedd44, 0xbb66ff, 0xff4d4d, 0x66ccff]

const FLOWER_CLUSTERS = [
  { x: 480, y: 300, count: 6 },
  { x: 1125, y: 390, count: 5 },
  { x: 750, y: 720, count: 7 },
  { x: 1275, y: 720, count: 5 },
  { x: 930, y: 870, count: 6 },
  { x: 1710, y: 420, count: 4 },
  { x: 525, y: 870, count: 5 },
  { x: 1650, y: 825, count: 4 },
] as const

function drawFlowerCluster(gfx: Phaser.GameObjects.Graphics, cx: number, cy: number, count: number): void {
  for (let i = 0; i < count; i++) {
    const fx = cx + Phaser.Math.Between(-30, 30)
    const fy = cy + Phaser.Math.Between(-18, 18)
    const color = FLOWER_COLORS[Phaser.Math.Between(0, FLOWER_COLORS.length - 1)]

    gfx.fillStyle(0x3da840, 1)
    gfx.fillRect(fx, fy, 2, 6)

    gfx.fillStyle(color, 1)
    gfx.fillCircle(fx + 1, fy - 1, 3)

    gfx.fillStyle(0xffee88, 1)
    gfx.fillRect(fx, fy - 2, 2, 2)
  }
}

// ── Rocks ──────────────────────────────────────────
const ROCK_POSITIONS = [
  { x: 450, y: 495, size: 9 },
  { x: 1125, y: 525, size: 6 },
  { x: 750, y: 600, size: 8 },
  { x: 1500, y: 660, size: 6 },
  { x: 930, y: 750, size: 5 },
  { x: 300, y: 675, size: 8 },
  { x: 1350, y: 870, size: 6 },
] as const

function drawRock(gfx: Phaser.GameObjects.Graphics, x: number, y: number, size: number): void {
  gfx.fillStyle(0x8899aa, 1)
  gfx.fillEllipse(x, y, size * 2, size * 1.3)
  gfx.fillStyle(0xa0b0c0, 1)
  gfx.fillEllipse(x - 1, y - 1, size * 1.4, size * 0.9)
}

// ── Lamp Posts ─────────────────────────────────────
const LAMP_POSITIONS = [
  { x: 648, y: 480 },
  { x: 648, y: 540 },
  { x: 1320, y: 480 },
  { x: 1320, y: 540 },
  { x: 648, y: 684 },
  { x: 1320, y: 684 },
] as const

function drawLampPost(scene: Phaser.Scene, x: number, y: number): void {
  const gfx = scene.add.graphics()
  gfx.setDepth(y)

  gfx.fillStyle(0x444455, 1)
  gfx.fillRect(x - 2, y - 27, 4, 27)

  gfx.fillStyle(0x555566, 1)
  gfx.fillRect(x - 5, y - 33, 10, 7)

  gfx.fillStyle(0xffee88, 0.3)
  gfx.fillCircle(x, y - 29, 15)
  gfx.fillStyle(0xffdd44, 0.8)
  gfx.fillCircle(x, y - 29, 5)
}

// ── Barrels & Crates ───────────────────────────────
const PROP_DEFS = [
  { x: 195, y: 405, type: 'barrel' as const },
  { x: 218, y: 413, type: 'crate' as const },
  { x: 1530, y: 510, type: 'barrel' as const },
  { x: 1568, y: 503, type: 'crate' as const },
  { x: 360, y: 1050, type: 'barrel' as const },
  { x: 1620, y: 990, type: 'crate' as const },
  { x: 855, y: 593, type: 'barrel' as const },
] as const

function drawProp(gfx: Phaser.GameObjects.Graphics, x: number, y: number, type: 'barrel' | 'crate'): void {
  if (type === 'barrel') {
    gfx.fillStyle(0x8b5e3c, 1)
    gfx.fillEllipse(x, y - 8, 15, 18)
    gfx.fillStyle(0x666677, 1)
    gfx.fillRect(x - 7, y - 14, 15, 2)
    gfx.fillRect(x - 7, y - 3, 15, 2)
    gfx.fillStyle(0xa07040, 1)
    gfx.fillRect(x - 3, y - 15, 5, 15)
  } else {
    gfx.fillStyle(0xb8924a, 1)
    gfx.fillRect(x - 7, y - 15, 15, 15)
    gfx.lineStyle(1, 0x7a5c28, 1)
    gfx.strokeRect(x - 7, y - 15, 15, 15)
    gfx.lineBetween(x, y - 15, x, y)
    gfx.lineBetween(x - 7, y - 8, x + 8, y - 8)
  }
}

// ── Grass Tufts ────────────────────────────────────
function drawGrassTufts(gfx: Phaser.GameObjects.Graphics, mapData: number[][]): void {
  for (let r = 4; r < mapData.length - 4; r += 3) {
    for (let c = 4; c < mapData[0].length - 4; c += 4) {
      if (mapData[r][c] !== 0 && mapData[r][c] !== 1) continue
      if (Math.random() > 0.3) continue

      const x = c * 24 + Phaser.Math.Between(0, 18)
      const y = r * 24 + Phaser.Math.Between(0, 18)

      gfx.fillStyle(0x5ea832, 0.7)
      gfx.fillRect(x, y, 2, 5)
      gfx.fillRect(x - 3, y + 1, 2, 3)
      gfx.fillRect(x + 3, y, 2, 4)
    }
  }
}

// ── Skill Bulletin Board ──────────────────────────
const SKILL_BOARD = { x: 960, y: 900 } as const

function drawSkillBoardGfx(
  gfx: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  highlight = false,
): void {
  const bw = 320
  const bh = 200
  const postH = 180

  // Two thick support posts
  gfx.fillStyle(0x7a5c28, 1)
  gfx.fillRect(x - bw / 2 + 16, y - postH, 16, postH)
  gfx.fillRect(x + bw / 2 - 32, y - postH, 16, postH)

  // Board body
  gfx.fillStyle(highlight ? 0xd4a85a : 0xb8924a, 1)
  gfx.fillRect(x - bw / 2, y - postH - 20, bw, bh)
  gfx.lineStyle(4, highlight ? 0x00e5cc : 0x7a5c28, 1)
  gfx.strokeRect(x - bw / 2, y - postH - 20, bw, bh)

  // Inner panel
  gfx.fillStyle(highlight ? 0xb89048 : 0x9a7838, 1)
  gfx.fillRect(x - bw / 2 + 16, y - postH - 4, bw - 32, bh - 32)

  // Pinned notes
  gfx.fillStyle(0xfff8dc, 1)
  gfx.fillRect(x - 120, y - postH + 4, 100, 56)
  gfx.fillStyle(0xe8f4e8, 1)
  gfx.fillRect(x + 20, y - postH + 4, 100, 56)
  gfx.fillStyle(0xfff0e0, 1)
  gfx.fillRect(x - 60, y - postH + 72, 120, 48)

  // Pins
  gfx.fillStyle(0xff4d4d, 1)
  gfx.fillCircle(x - 70, y - postH + 4, 5)
  gfx.fillStyle(0x00e5cc, 1)
  gfx.fillCircle(x + 70, y - postH + 4, 5)
  gfx.fillStyle(0xf59e0b, 1)
  gfx.fillCircle(x, y - postH + 72, 5)
}

function drawSkillBoard(scene: Phaser.Scene, x: number, y: number): void {
  const gfx = scene.add.graphics()
  gfx.setDepth(y)
  drawSkillBoardGfx(gfx, x, y)

  // Title text above board
  scene.add
    .text(x, y - 208, 'SKILL BOARD', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4,
      letterSpacing: 2,
    })
    .setOrigin(0.5, 1)
    .setDepth(y + 1)

  // Left pinned note — main message
  scene.add
    .text(x - 70, y - 148, 'Send your\nSkill URL\nto Agent', {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '11px',
      color: '#3a2810',
      fontStyle: 'bold',
      lineSpacing: 6,
      align: 'center',
    })
    .setOrigin(0.5, 0.5)
    .setDepth(y + 1)

  // Right pinned note — skills.sh
  scene.add
    .text(x + 70, y - 156, 'skills.sh', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#00695c',
    })
    .setOrigin(0.5, 0.5)
    .setDepth(y + 1)

  scene.add
    .text(x + 70, y - 138, 'Browse\n& Install', {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '10px',
      color: '#555544',
      align: 'center',
      lineSpacing: 3,
    })
    .setOrigin(0.5, 0.5)
    .setDepth(y + 1)

  // Bottom note — CTA
  scene.add
    .text(x, y - 88, 'Click here!', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#ff4d4d',
      stroke: '#ffffff',
      strokeThickness: 2,
    })
    .setOrigin(0.5, 0.5)
    .setDepth(y + 1)

  // Interactive hit area (doubled)
  const hitZone = scene.add.zone(x, y - 100, 320, 200).setInteractive({ useHandCursor: true })
  hitZone.setDepth(y + 2)

  hitZone.on('pointerover', () => {
    gfx.clear()
    drawSkillBoardGfx(gfx, x, y, true)
  })

  hitZone.on('pointerout', () => {
    gfx.clear()
    drawSkillBoardGfx(gfx, x, y)
  })

  hitZone.on('pointerdown', () => {
    window.dispatchEvent(
      new CustomEvent('village-zone-click', { detail: { id: 'skill-board' } }),
    )
  })
}

// ── Public API ─────────────────────────────────────
export function placeDecorations(scene: Phaser.Scene, mapData: number[][]): void {
  const staticGfx = scene.add.graphics()
  staticGfx.setDepth(2)

  drawGrassTufts(staticGfx, mapData)

  for (const cluster of FLOWER_CLUSTERS) {
    drawFlowerCluster(staticGfx, cluster.x, cluster.y, cluster.count)
  }

  for (const rock of ROCK_POSITIONS) {
    drawRock(staticGfx, rock.x, rock.y, rock.size)
  }

  const propGfx = scene.add.graphics()
  propGfx.setDepth(250)
  for (const prop of PROP_DEFS) {
    drawProp(propGfx, prop.x, prop.y, prop.type)
  }

  for (const def of SIGNPOST_DEFS) {
    drawSignpost(scene, def)
  }

  for (const lamp of LAMP_POSITIONS) {
    drawLampPost(scene, lamp.x, lamp.y)
  }

  drawSkillBoard(scene, SKILL_BOARD.x, SKILL_BOARD.y)
}
