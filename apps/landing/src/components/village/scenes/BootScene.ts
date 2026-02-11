import Phaser from 'phaser'
import { WORLD_WIDTH, WORLD_HEIGHT } from '../config'

const CHAR_BASE = '/village/Modern tiles_Free/Characters_free'
const ANIM_BASE = '/village/SERENE_VILLAGE_REVAMPED/Animated stuff'

const CHARACTERS = ['Alex', 'Adam', 'Bob', 'Amelia'] as const

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    this.createProgressBar()

    // Buildings
    this.load.image('building-tavern', '/village/buildings/tavern.png')
    this.load.image('building-lab', '/village/buildings/lab.png')
    this.load.image('building-shop', '/village/buildings/shop.png')
    this.load.image('building-tech', '/village/buildings/tech_center.png')
    this.load.image('building-arena', '/village/buildings/arena.png')

    // Character spritesheets (16×32 per frame — 16 wide, full 32 tall)
    for (const name of CHARACTERS) {
      this.load.spritesheet(`${name}-idle`, `${CHAR_BASE}/${name}_idle_16x16.png`, {
        frameWidth: 16,
        frameHeight: 32,
      })
      this.load.spritesheet(`${name}-run`, `${CHAR_BASE}/${name}_run_16x16.png`, {
        frameWidth: 16,
        frameHeight: 32,
      })
    }

    // Environment animations
    this.load.spritesheet('campfire', `${ANIM_BASE}/campfire_16x16.png`, {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.spritesheet('water-waves', `${ANIM_BASE}/water_waves_16x16.png`, {
      frameWidth: 16,
      frameHeight: 16,
    })
  }

  create(): void {
    this.createAnimations()
    this.scene.start('VillageScene')
  }

  private createProgressBar(): void {
    const cx = WORLD_WIDTH / 2
    const cy = WORLD_HEIGHT / 2
    const barW = 300
    const barH = 20

    const bg = this.add.graphics()
    bg.fillStyle(0x222222, 0.8)
    bg.fillRect(cx - barW / 2 - 4, cy - barH / 2 - 4, barW + 8, barH + 8)

    const bar = this.add.graphics()

    const loadingText = this.add
      .text(cx, cy - 30, 'Loading Clawvili...', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#00e5cc',
      })
      .setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      bar.clear()
      bar.fillStyle(0x00e5cc, 1)
      bar.fillRect(cx - barW / 2, cy - barH / 2, barW * value, barH)
    })

    this.load.on('complete', () => {
      bg.destroy()
      bar.destroy()
      loadingText.destroy()
    })
  }

  private createAnimations(): void {
    for (const name of CHARACTERS) {
      this.anims.create({
        key: `${name}-idle-down`,
        frames: this.anims.generateFrameNumbers(`${name}-idle`, { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1,
      })

      this.anims.create({
        key: `${name}-run-down`,
        frames: this.anims.generateFrameNumbers(`${name}-run`, { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1,
      })

      this.anims.create({
        key: `${name}-run-right`,
        frames: this.anims.generateFrameNumbers(`${name}-run`, { start: 6, end: 11 }),
        frameRate: 8,
        repeat: -1,
      })

      this.anims.create({
        key: `${name}-run-up`,
        frames: this.anims.generateFrameNumbers(`${name}-run`, { start: 12, end: 17 }),
        frameRate: 8,
        repeat: -1,
      })

      this.anims.create({
        key: `${name}-run-left`,
        frames: this.anims.generateFrameNumbers(`${name}-run`, { start: 18, end: 23 }),
        frameRate: 8,
        repeat: -1,
      })
    }

    this.anims.create({
      key: 'campfire-burn',
      frames: this.anims.generateFrameNumbers('campfire', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'water-wave',
      frames: this.anims.generateFrameNumbers('water-waves', { start: 0, end: 13 }),
      frameRate: 4,
      repeat: -1,
    })
  }
}
