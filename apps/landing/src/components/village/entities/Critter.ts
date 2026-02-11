import Phaser from 'phaser'

type CritterType = 'dog' | 'frog' | 'squirrel' | 'penguin'

const CRITTER_DRAW: Record<CritterType, (g: Phaser.GameObjects.Graphics, f: number) => void> = {
  dog(g, f) {
    const bounce = f === 0 ? 0 : 1
    // Body
    g.fillStyle(0xc8964a, 1)
    g.fillRect(-6, -2 + bounce, 12, 6)
    // Head
    g.fillStyle(0xd4a85a, 1)
    g.fillRect(-8, -5 + bounce, 6, 5)
    // Ears
    g.fillStyle(0x8b6530, 1)
    g.fillRect(-9, -7 + bounce, 2, 3)
    g.fillRect(-4, -7 + bounce, 2, 3)
    // Eye
    g.fillStyle(0x000000, 1)
    g.fillRect(-6, -4 + bounce, 1, 1)
    // Nose
    g.fillStyle(0x333333, 1)
    g.fillRect(-9, -3 + bounce, 1, 1)
    // Tail
    g.fillStyle(0xc8964a, 1)
    g.fillRect(6, -4 + f, 2, 3)
    // Legs
    g.fillStyle(0x8b6530, 1)
    g.fillRect(-5, 4, 2, 3 - bounce)
    g.fillRect(-1, 4, 2, 3 + bounce)
    g.fillRect(3, 4, 2, 3 - bounce)
  },
  frog(g, f) {
    const hop = f === 0 ? 0 : -2
    // Body
    g.fillStyle(0x55aa44, 1)
    g.fillRect(-5, -2 + hop, 10, 6)
    g.fillRect(-4, -4 + hop, 8, 8)
    // Eyes (big!)
    g.fillStyle(0x88dd66, 1)
    g.fillCircle(-3, -5 + hop, 3)
    g.fillCircle(3, -5 + hop, 3)
    g.fillStyle(0x000000, 1)
    g.fillRect(-3, -5 + hop, 1, 1)
    g.fillRect(3, -5 + hop, 1, 1)
    // Mouth
    g.fillStyle(0x338822, 1)
    g.fillRect(-2, 1 + hop, 4, 1)
    // Legs
    g.fillStyle(0x44882e, 1)
    g.fillRect(-7, 2 + hop, 3, 2)
    g.fillRect(4, 2 + hop, 3, 2)
    // Feet
    g.fillRect(-8, 4 + hop, 4, 1)
    g.fillRect(4, 4 + hop, 4, 1)
  },
  squirrel(g, f) {
    const bounce = f === 0 ? 0 : 1
    // Body
    g.fillStyle(0xb86830, 1)
    g.fillRect(-4, -1 + bounce, 8, 6)
    // Head
    g.fillStyle(0xc87840, 1)
    g.fillRect(-6, -5 + bounce, 5, 5)
    // Ear tufts
    g.fillStyle(0xd89050, 1)
    g.fillRect(-6, -7 + bounce, 2, 2)
    // Eye
    g.fillStyle(0x000000, 1)
    g.fillRect(-4, -4 + bounce, 1, 1)
    // Big fluffy tail
    g.fillStyle(0xd89050, 1)
    g.fillRect(4, -6 + bounce, 4, 3)
    g.fillRect(5, -4 + bounce, 3, 5)
    g.fillRect(6, 1 + bounce, 2, 2)
    // Legs
    g.fillStyle(0x8b5020, 1)
    g.fillRect(-3, 5 + bounce, 2, 2 - bounce)
    g.fillRect(1, 5 + bounce, 2, 2 + bounce)
  },
  penguin(g, f) {
    const waddle = f === 0 ? -1 : 1
    // Body (black)
    g.fillStyle(0x222233, 1)
    g.fillRect(-4, -3, 8, 8)
    g.fillRect(-3, -5, 6, 10)
    // White belly
    g.fillStyle(0xeeeeff, 1)
    g.fillRect(-2, -1, 4, 6)
    // Head
    g.fillStyle(0x222233, 1)
    g.fillRect(-3, -7, 6, 3)
    // Eyes
    g.fillStyle(0xffffff, 1)
    g.fillRect(-2, -6, 2, 2)
    g.fillRect(1, -6, 2, 2)
    g.fillStyle(0x000000, 1)
    g.fillRect(-1, -6, 1, 1)
    g.fillRect(2, -6, 1, 1)
    // Beak
    g.fillStyle(0xffaa00, 1)
    g.fillRect(-1, -4, 2, 1)
    // Flippers
    g.fillStyle(0x222233, 1)
    g.fillRect(-6, -1 + waddle, 2, 4)
    g.fillRect(4, -1 - waddle, 2, 4)
    // Feet
    g.fillStyle(0xffaa00, 1)
    g.fillRect(-3, 5, 2, 1)
    g.fillRect(1, 5, 2, 1)
  },
}

export class Critter extends Phaser.GameObjects.Container {
  private gfx: Phaser.GameObjects.Graphics
  private animFrame = 0
  private critterType: CritterType
  private wanderArea: { minX: number; minY: number; maxX: number; maxY: number }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: CritterType,
    wanderRadius = 80,
  ) {
    super(scene, x, y)
    this.critterType = type
    this.setDepth(y)

    this.wanderArea = {
      minX: Math.max(90, x - wanderRadius),
      minY: Math.max(90, y - wanderRadius),
      maxX: Math.min(1830, x + wanderRadius),
      maxY: Math.min(990, y + wanderRadius),
    }

    this.gfx = scene.add.graphics()
    this.add(this.gfx)
    this.draw(0)

    scene.add.existing(this as Phaser.GameObjects.Container)

    this.wander()

    scene.time.addEvent({
      delay: type === 'frog' ? 600 : 350,
      loop: true,
      callback: () => {
        this.animFrame = this.animFrame === 0 ? 1 : 0
        this.draw(this.animFrame)
      },
    })
  }

  private draw(frame: number): void {
    this.gfx.clear()
    CRITTER_DRAW[this.critterType](this.gfx, frame)
  }

  private wander(): void {
    const targetX = Phaser.Math.Between(this.wanderArea.minX, this.wanderArea.maxX)
    const targetY = Phaser.Math.Between(this.wanderArea.minY, this.wanderArea.maxY)

    const dx = targetX - this.x
    this.setScale(dx < 0 ? -3 : 3, 3)

    const speed = this.critterType === 'frog' ? 20 : 25
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY)
    const duration = (distance / speed) * 1000

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration,
      ease: 'Linear',
      onUpdate: () => this.setDepth(this.y),
      onComplete: () => {
        const pause = this.critterType === 'frog'
          ? Phaser.Math.Between(3000, 7000)
          : Phaser.Math.Between(2000, 5000)
        this.scene.time.delayedCall(pause, () => this.wander())
      },
    })
  }
}
