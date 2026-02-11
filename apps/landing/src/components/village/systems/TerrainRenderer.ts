import Phaser from 'phaser'
import { TILE_SIZE, TERRAIN_COLORS, Terrain } from '../config'

const COLOR_MAP: Record<number, number> = {
  [Terrain.GRASS]: TERRAIN_COLORS.GRASS,
  [Terrain.GRASS_DARK]: TERRAIN_COLORS.GRASS_DARK,
  [Terrain.DIRT]: TERRAIN_COLORS.DIRT,
  [Terrain.WATER]: TERRAIN_COLORS.WATER,
  [Terrain.SAND]: TERRAIN_COLORS.SAND,
}

export function renderTerrain(scene: Phaser.Scene, mapData: number[][]): void {
  const gfx = scene.add.graphics()
  gfx.setDepth(-10)

  for (let r = 0; r < mapData.length; r++) {
    const row = mapData[r]
    for (let c = 0; c < row.length; c++) {
      const color = COLOR_MAP[row[c]] ?? TERRAIN_COLORS.GRASS
      gfx.fillStyle(color, 1)
      gfx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }
}
