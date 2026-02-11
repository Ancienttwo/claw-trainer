import Phaser from 'phaser'

export const WORLD_WIDTH = 1920
export const WORLD_HEIGHT = 1080
export const TILE_SIZE = 24
export const COLS = 80
export const ROWS = 45

export const TERRAIN_COLORS = {
  GRASS: 0x7ec850,
  GRASS_DARK: 0x5ea832,
  DIRT: 0xd4a574,
  WATER: 0x5bc0eb,
  SAND: 0xf5deb3,
} as const

export const enum Terrain {
  GRASS = 0,
  GRASS_DARK = 1,
  DIRT = 2,
  WATER = 3,
  SAND = 4,
}

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
