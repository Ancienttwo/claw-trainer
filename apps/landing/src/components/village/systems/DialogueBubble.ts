import Phaser from 'phaser'

const BUBBLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '10px',
  color: '#ffffff',
  wordWrap: { width: 180 },
}

const PADDING = 12
const TAIL_SIZE = 9
const BG_COLOR = 0x222233
const BORDER_COLOR = 0x00e5cc
const BORDER_WIDTH = 2
const CORNER_RADIUS = 9

export function createBubble(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  duration = 3000,
): Phaser.GameObjects.Container {
  const textObj = scene.add.text(0, 0, text, BUBBLE_STYLE).setOrigin(0)
  const bubbleW = textObj.width + PADDING * 2
  const bubbleH = textObj.height + PADDING * 2

  textObj.setPosition(-bubbleW / 2 + PADDING, -bubbleH - TAIL_SIZE + PADDING)

  const gfx = scene.add.graphics()

  // Border
  gfx.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1)
  gfx.fillStyle(BG_COLOR, 0.9)

  const bx = -bubbleW / 2
  const by = -bubbleH - TAIL_SIZE

  // Rounded rect body
  gfx.fillRoundedRect(bx, by, bubbleW, bubbleH, CORNER_RADIUS)
  gfx.strokeRoundedRect(bx, by, bubbleW, bubbleH, CORNER_RADIUS)

  // Triangle tail
  gfx.fillStyle(BG_COLOR, 0.9)
  gfx.fillTriangle(
    -TAIL_SIZE, -TAIL_SIZE,
    TAIL_SIZE, -TAIL_SIZE,
    0, 0,
  )

  const container = scene.add.container(x, y - 30, [gfx, textObj])
  container.setDepth(999)
  container.setAlpha(0)

  scene.tweens.add({
    targets: container,
    alpha: 1,
    y: y - 42,
    duration: 200,
    ease: 'Power2',
  })

  scene.time.delayedCall(duration, () => {
    scene.tweens.add({
      targets: container,
      alpha: 0,
      y: y - 54,
      duration: 200,
      ease: 'Power2',
      onComplete: () => container.destroy(),
    })
  })

  return container
}
