import Phaser from 'phaser'

const LOBSTER_COLOR = 0xff4d4d
const LOBSTER_DARK = 0xcc3333
const CLAW_COLOR = 0xff6666

export class Lobster extends Phaser.GameObjects.Container {
  private gfx: Phaser.GameObjects.Graphics
  private animFrame = 0
  private wanderArea: { minX: number; minY: number; maxX: number; maxY: number }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    wanderRadius = 60,
  ) {
    super(scene, x, y)
    this.setDepth(5)

    this.wanderArea = {
      minX: Math.max(90, x - wanderRadius),
      minY: Math.max(90, y - wanderRadius),
      maxX: Math.min(1830, x + wanderRadius),
      maxY: Math.min(990, y + wanderRadius),
    }

    this.gfx = scene.add.graphics()
    this.add(this.gfx)
    this.drawLobster(0)

    scene.add.existing(this as Phaser.GameObjects.Container)

    this.wander()

    scene.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        this.animFrame = this.animFrame === 0 ? 1 : 0
        this.drawLobster(this.animFrame)
      },
    })
  }

  private drawLobster(frame: number): void {
    const g = this.gfx
    g.clear()

    const legOffset = frame === 0 ? 0 : 1

    // Body
    g.fillStyle(LOBSTER_COLOR, 1)
    g.fillRect(-5, -3, 10, 6)
    g.fillRect(-4, -4, 8, 8)

    // Head
    g.fillStyle(LOBSTER_DARK, 1)
    g.fillRect(-3, -5, 6, 2)

    // Eyes
    g.fillStyle(0xffffff, 1)
    g.fillRect(-3, -6, 2, 2)
    g.fillRect(1, -6, 2, 2)
    g.fillStyle(0x000000, 1)
    g.fillRect(-2, -6, 1, 1)
    g.fillRect(2, -6, 1, 1)

    // Claws
    g.fillStyle(CLAW_COLOR, 1)
    g.fillRect(-8, -4 + legOffset, 3, 2)
    g.fillRect(-9, -5 + legOffset, 2, 1)
    g.fillRect(-9, -2 + legOffset, 2, 1)
    g.fillRect(5, -4 + legOffset, 3, 2)
    g.fillRect(7, -5 + legOffset, 2, 1)
    g.fillRect(7, -2 + legOffset, 2, 1)

    // Tail
    g.fillStyle(LOBSTER_DARK, 1)
    g.fillRect(-2, 4, 4, 2)
    g.fillRect(-3, 6, 6, 1)

    // Legs
    g.fillStyle(LOBSTER_COLOR, 1)
    g.fillRect(-6, 0 + legOffset, 2, 1)
    g.fillRect(-6, 2 - legOffset, 2, 1)
    g.fillRect(4, 0 + legOffset, 2, 1)
    g.fillRect(4, 2 - legOffset, 2, 1)
  }

  private wander(): void {
    const targetX = Phaser.Math.Between(this.wanderArea.minX, this.wanderArea.maxX)
    const targetY = Phaser.Math.Between(this.wanderArea.minY, this.wanderArea.maxY)

    const dx = targetX - this.x
    this.setScale(dx < 0 ? -3 : 3, 3)

    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY)
    const duration = (distance / 15) * 1000

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration,
      ease: 'Linear',
      onUpdate: () => {
        this.setDepth(this.y)
      },
      onComplete: () => {
        this.scene.time.delayedCall(Phaser.Math.Between(2000, 5000), () => {
          this.wander()
        })
      },
    })
  }
}
