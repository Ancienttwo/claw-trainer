import Phaser from 'phaser'
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, Terrain } from '../config'
import { ZONES } from '../data/zone-defs'
import { generateMapData } from '../data/map-data'
import { renderTerrain } from '../systems/TerrainRenderer'
import { placeBuildings } from '../systems/BuildingPlacer'
import { NPC_DEFS } from '../data/npc-defs'
import { NPC } from '../entities/NPC'
import { Lobster } from '../entities/Lobster'
import { Critter } from '../entities/Critter'
import { placeDecorations } from '../systems/Decorations'

const LOBSTER_SPAWNS = [
  { x: 600, y: 525 },
  { x: 1050, y: 600 },
  { x: 450, y: 675 },
  { x: 1200, y: 450 },
  { x: 1650, y: 600 },
  { x: 750, y: 825 },
  { x: 1125, y: 300 },
  { x: 1650, y: 900 },
] as const

const CAMPFIRE_POSITIONS = [
  { x: 225, y: 435 },
  { x: 1380, y: 945 },
] as const

const TREE_POSITIONS = [
  { x: 555, y: 240, scale: 0.5 },
  { x: 690, y: 210, scale: 0.38 },
  { x: 1065, y: 195, scale: 0.5 },
  { x: 1260, y: 225, scale: 0.38 },
  { x: 1680, y: 570, scale: 0.45 },
  { x: 555, y: 960, scale: 0.38 },
  { x: 990, y: 945, scale: 0.5 },
  { x: 660, y: 660, scale: 0.38 },
  { x: 1170, y: 795, scale: 0.38 },
] as const

const CRITTER_SPAWNS = [
  { x: 480, y: 360, type: 'dog' as const },
  { x: 1200, y: 330, type: 'squirrel' as const },
  { x: 750, y: 870, type: 'frog' as const },
  { x: 1560, y: 480, type: 'penguin' as const },
  { x: 360, y: 600, type: 'dog' as const },
  { x: 1350, y: 870, type: 'squirrel' as const },
  { x: 900, y: 450, type: 'frog' as const },
  { x: 1680, y: 810, type: 'penguin' as const },
] as const

export class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' })
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.fadeIn(500)

    const mapData = generateMapData()
    renderTerrain(this, mapData)
    this.placeWaterWaves(mapData)
    placeDecorations(this, mapData)
    this.placeTrees()
    placeBuildings(this, ZONES)
    this.placeCampfires()
    this.placeFountain()

    for (const def of NPC_DEFS) {
      new NPC(this, def)
    }
    for (const spawn of LOBSTER_SPAWNS) {
      new Lobster(this, spawn.x, spawn.y)
    }
    for (const spawn of CRITTER_SPAWNS) {
      new Critter(this, spawn.x, spawn.y, spawn.type)
    }
  }

  private placeWaterWaves(mapData: number[][]): void {
    for (let r = 0; r < mapData.length; r++) {
      for (let c = 0; c < mapData[r].length; c++) {
        if (mapData[r][c] !== Terrain.WATER) continue
        const isEdge = this.isWaterEdge(mapData, r, c)
        if (!isEdge && Math.random() > 0.08) continue

        const wave = this.add.sprite(
          c * TILE_SIZE + TILE_SIZE / 2,
          r * TILE_SIZE + TILE_SIZE / 2,
          'water-waves',
        )
        wave.play('water-wave')
        wave.setDepth(-5)
        wave.setAlpha(0.6)
        wave.setScale(1.5)
        wave.anims.setProgress(Math.random())
      }
    }
  }

  private isWaterEdge(mapData: number[][], r: number, c: number): boolean {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr < 0 || nr >= mapData.length || nc < 0 || nc >= mapData[0].length) continue
        if (mapData[nr][nc] !== Terrain.WATER) return true
      }
    }
    return false
  }

  private placeTrees(): void {
    for (const tree of TREE_POSITIONS) {
      this.drawPixelTree(tree.x, tree.y, tree.scale)
    }
  }

  private drawPixelTree(x: number, y: number, size: number): void {
    const s = size * 100
    const gfx = this.add.graphics()
    gfx.setDepth(y)

    const trunkW = s * 0.15
    const trunkH = s * 0.35
    gfx.fillStyle(0x8b6914, 1)
    gfx.fillRect(x - trunkW / 2, y - trunkH, trunkW, trunkH)
    gfx.fillStyle(0xa07828, 1)
    gfx.fillRect(x - trunkW / 2 + 1, y - trunkH, trunkW / 3, trunkH)

    const layers = [
      { dy: -trunkH + 2, rx: s * 0.4, ry: s * 0.22, color: 0x2d8a30 },
      { dy: -trunkH - s * 0.1, rx: s * 0.35, ry: s * 0.2, color: 0x3da840 },
      { dy: -trunkH - s * 0.22, rx: s * 0.25, ry: s * 0.18, color: 0x4ec050 },
    ]
    for (const layer of layers) {
      gfx.fillStyle(layer.color, 1)
      gfx.fillEllipse(x, y + layer.dy, layer.rx * 2, layer.ry * 2)
    }

    gfx.fillStyle(0x6ad860, 1)
    gfx.fillCircle(x - s * 0.1, y - trunkH - s * 0.15, s * 0.06)
    gfx.fillCircle(x + s * 0.08, y - trunkH - s * 0.25, s * 0.05)
  }

  private placeCampfires(): void {
    for (const pos of CAMPFIRE_POSITIONS) {
      const fire = this.add.sprite(pos.x, pos.y, 'campfire')
      fire.play('campfire-burn')
      fire.setScale(3)
      fire.setDepth(pos.y)

      this.tweens.add({
        targets: fire,
        alpha: { from: 0.8, to: 1 },
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    }
  }

  private placeFountain(): void {
    const fx = 960
    const fy = 555

    const gfx = this.add.graphics()
    gfx.setDepth(fy - 1)
    gfx.fillStyle(0x666677, 1)
    gfx.fillCircle(fx, fy, 27)
    gfx.fillStyle(0x888899, 1)
    gfx.fillCircle(fx, fy, 21)
    gfx.fillStyle(0x5bc0eb, 0.7)
    gfx.fillCircle(fx, fy, 15)

    const spray = this.add.sprite(fx, fy - 21, 'water-waves')
    spray.play('water-wave')
    spray.setScale(2)
    spray.setDepth(fy)

    this.tweens.add({
      targets: spray,
      y: fy - 27,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }
}
