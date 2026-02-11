import Phaser from 'phaser'

export const WORLD_WIDTH = 1280
export const WORLD_HEIGHT = 720

export function createGameConfig(
  parent: HTMLElement,
): Omit<Phaser.Types.Core.GameConfig, 'scene'> {
  return {
    type: Phaser.AUTO,
    parent,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    backgroundColor: 0x87ceeb,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
    },
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
    },
  }
}
