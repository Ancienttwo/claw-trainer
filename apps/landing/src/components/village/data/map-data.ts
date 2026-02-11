import { COLS, ROWS, Terrain } from '../config'

function createGrid(): number[][] {
  const grid: number[][] = []
  for (let r = 0; r < ROWS; r++) {
    grid[r] = new Array(COLS).fill(Terrain.GRASS)
  }
  return grid
}

function stampRect(
  grid: number[][],
  x: number,
  y: number,
  w: number,
  h: number,
  tile: Terrain,
): void {
  for (let r = y; r < Math.min(y + h, ROWS); r++) {
    for (let c = x; c < Math.min(x + w, COLS); c++) {
      if (r >= 0 && c >= 0) grid[r][c] = tile
    }
  }
}

function stampDarkGrass(grid: number[][]): void {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === Terrain.GRASS && Math.random() < 0.15) {
        grid[r][c] = Terrain.GRASS_DARK
      }
    }
  }
}

function stampSandBorder(grid: number[][]): void {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== Terrain.WATER) continue
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue
          if (grid[nr][nc] === Terrain.GRASS || grid[nr][nc] === Terrain.GRASS_DARK) {
            grid[nr][nc] = Terrain.SAND
          }
        }
      }
    }
  }
}

export function generateMapData(): number[][] {
  const grid = createGrid()

  // Horizontal main road (center-ish)
  stampRect(grid, 0, 20, COLS, 3, Terrain.DIRT)

  // Vertical crossroads
  stampRect(grid, 25, 0, 3, ROWS, Terrain.DIRT)
  stampRect(grid, 55, 0, 3, ROWS, Terrain.DIRT)

  // Side paths connecting buildings
  stampRect(grid, 8, 8, 2, 12, Terrain.DIRT)
  stampRect(grid, 8, 8, 18, 2, Terrain.DIRT)
  stampRect(grid, 65, 8, 2, 12, Terrain.DIRT)
  stampRect(grid, 55, 8, 12, 2, Terrain.DIRT)
  stampRect(grid, 8, 30, 2, 10, Terrain.DIRT)
  stampRect(grid, 8, 38, 18, 2, Terrain.DIRT)
  stampRect(grid, 55, 30, 2, 10, Terrain.DIRT)
  stampRect(grid, 55, 38, 15, 2, Terrain.DIRT)

  // Water — pond bottom-right
  stampRect(grid, 68, 32, 8, 6, Terrain.WATER)
  stampRect(grid, 69, 31, 6, 8, Terrain.WATER)

  // Water — stream along left edge
  stampRect(grid, 0, 0, 3, ROWS, Terrain.WATER)
  stampRect(grid, 0, 0, COLS, 3, Terrain.WATER)
  stampRect(grid, COLS - 3, 0, 3, ROWS, Terrain.WATER)
  stampRect(grid, 0, ROWS - 3, COLS, 3, Terrain.WATER)

  // Sand borders around water
  stampSandBorder(grid)

  // Sprinkle dark grass
  stampDarkGrass(grid)

  return grid
}
