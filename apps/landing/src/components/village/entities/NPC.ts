import Phaser from 'phaser'
import type { NpcDef } from '../data/npc-defs'
import { createBubble } from '../systems/DialogueBubble'

const NAME_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '9px',
  color: '#00e5cc',
  stroke: '#000000',
  strokeThickness: 2,
}

export class NPC extends Phaser.GameObjects.Sprite {
  private def: NpcDef
  private waypointIndex = 0
  private nameLabel: Phaser.GameObjects.Text
  private dialogueIndex = 0
  private bubbleActive = false

  constructor(scene: Phaser.Scene, def: NpcDef) {
    super(scene, def.startX, def.startY, `${def.spriteKey}-idle`, 0)
    this.def = def
    this.setScale(3)
    this.setDepth(def.startY)

    scene.add.existing(this)

    // Name label
    this.nameLabel = scene.add
      .text(def.startX, def.startY - 20, def.name, NAME_STYLE)
      .setOrigin(0.5)
      .setDepth(def.startY + 1)

    // Start idle animation
    this.play(`${def.spriteKey}-idle-down`)

    // Click for dialogue
    this.setInteractive({ useHandCursor: true })
    this.on('pointerdown', () => this.showDialogue())

    // Start patrol after random delay
    scene.time.delayedCall(Phaser.Math.Between(500, 2000), () => {
      this.startPatrol()
    })
  }

  private startPatrol(): void {
    this.moveToNextWaypoint()
  }

  private moveToNextWaypoint(): void {
    const wp = this.def.waypoints[this.waypointIndex]
    this.waypointIndex = (this.waypointIndex + 1) % this.def.waypoints.length

    const dx = wp.x - this.x
    const dy = wp.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const duration = (distance / 30) * 1000

    // Determine direction for animation
    const animKey = this.getRunAnim(dx, dy)
    this.play(animKey, true)

    this.scene.tweens.add({
      targets: this,
      x: wp.x,
      y: wp.y,
      duration,
      ease: 'Linear',
      onUpdate: () => {
        this.setDepth(this.y)
        this.nameLabel.setPosition(this.x, this.y - 30)
        this.nameLabel.setDepth(this.y + 1)
      },
      onComplete: () => {
        this.play(`${this.def.spriteKey}-idle-down`, true)
        // Pause before next waypoint
        this.scene.time.delayedCall(Phaser.Math.Between(1500, 4000), () => {
          this.moveToNextWaypoint()
        })
      },
    })
  }

  private getRunAnim(dx: number, dy: number): string {
    const key = this.def.spriteKey
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? `${key}-run-right` : `${key}-run-left`
    }
    return dy > 0 ? `${key}-run-down` : `${key}-run-up`
  }

  private showDialogue(): void {
    if (this.bubbleActive) return
    this.bubbleActive = true

    const line = this.def.dialogueLines[this.dialogueIndex]
    this.dialogueIndex = (this.dialogueIndex + 1) % this.def.dialogueLines.length

    createBubble(this.scene, this.x, this.y - 24, line, 3000)

    this.scene.time.delayedCall(3500, () => {
      this.bubbleActive = false
    })
  }
}
