import Phaser from 'phaser'
import { WORLD_WIDTH, WORLD_HEIGHT } from '../config'
import { ZONES } from '../data/zone-defs'

const LABEL_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '10px',
  color: '#ffd700',
  stroke: '#000000',
  strokeThickness: 3,
  align: 'center',
}

export class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' })
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

    this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'village-bg').setDepth(-1)

    for (const zone of ZONES) {
      const rect = this.add.rectangle(zone.x, zone.y, zone.w, zone.h, 0xffd700, 0)
      rect.setInteractive({ useHandCursor: true })

      rect.on('pointerover', () => {
        rect.setFillStyle(0xffd700, 0.15)
      })
      rect.on('pointerout', () => {
        rect.setFillStyle(0xffd700, 0)
      })
      rect.on('pointerdown', () => {
        window.dispatchEvent(
          new CustomEvent('village-zone-click', { detail: { id: zone.id } }),
        )
      })

      this.add
        .text(zone.x, zone.y - zone.h / 2 - 8, zone.label, LABEL_STYLE)
        .setOrigin(0.5, 1)
    }
  }

  update(): void {
    /* no animated entities */
  }
}
