import Phaser from 'phaser'
import type { ZoneDef } from '../data/zone-defs'

const LABEL_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '12px',
  color: '#ffd700',
  stroke: '#000000',
  strokeThickness: 4,
  align: 'center',
}

export function placeBuildings(scene: Phaser.Scene, zones: ZoneDef[]): void {
  for (const zone of zones) {
    const building = scene.add.image(zone.x, zone.y, zone.buildingKey)
    building.setScale(zone.buildingScale)
    building.setDepth(zone.y)
    building.setInteractive({ useHandCursor: true, pixelPerfect: false })

    // Label above building
    const label = scene.add
      .text(zone.x, zone.y - (building.displayHeight / 2) - 10, zone.label, LABEL_STYLE)
      .setOrigin(0.5, 1)
      .setDepth(zone.y + 1)

    // Hover effects
    building.on('pointerover', () => {
      building.setTint(0xffffcc)
      scene.tweens.add({
        targets: building,
        scaleX: zone.buildingScale * 1.05,
        scaleY: zone.buildingScale * 1.05,
        duration: 150,
        ease: 'Power2',
      })
    })

    building.on('pointerout', () => {
      building.clearTint()
      scene.tweens.add({
        targets: building,
        scaleX: zone.buildingScale,
        scaleY: zone.buildingScale,
        duration: 150,
        ease: 'Power2',
      })
    })

    building.on('pointerdown', () => {
      window.dispatchEvent(
        new CustomEvent('village-zone-click', { detail: { id: zone.id } }),
      )
    })
  }
}
