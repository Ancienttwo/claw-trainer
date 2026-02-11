import { writeFileSync } from 'fs'

// Serene Village 16x16: 304×720px, 19 cols × 45 rows, 0 spacing, 855 tiles
const COLS = 19, ROWS = 45
const MAP_W = 80, MAP_H = 45

// === MODE: 'catalog' shows all tiles for identification, 'village' builds the map ===
const MODE = process.argv[2] || 'catalog'

function tileCatalog() {
  const data = []
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (x < COLS && y < ROWS) {
        data.push(y * COLS + x + 1) // show tileset in order
      } else {
        data.push(1) // fill rest with tile 1
      }
    }
  }
  return data
}

function villageMap() {
  const groundGrid = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(0))
  const pathGrid = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(0))

  const T = {
    GRASS: 5,         
    GRASS_ALT: [4, 6, 23, 24],
    DIRT: 45,          
    DIRT_CORNER: 46,
    WATER: 22,        
    BUSH: 200,
    FLOWER: 160
  }

  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++)
      groundGrid[y][x] = T.GRASS

  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      const r = ((x * 7 + y * 13 + 42) % 17) / 17
      if (r < 0.15)
        groundGrid[y][x] = T.GRASS_ALT[Math.floor(r * 50) % T.GRASS_ALT.length]
    }

  const setPathOrganic = (x1, y1, x2, y2) => {
    let x = x1, y = y1
    while (x !== x2 || y !== y2) {
      if (x !== x2) x += (x2 > x ? 1 : -1)
      else if (y !== y2) y += (y2 > y ? 1 : -1)
      for (let r = -1; r <= 1; r++)
        for (let c = -1; c <= 1; c++)
          if (y+r >= 0 && y+r < MAP_H && x+c >= 0 && x+c < MAP_W)
            pathGrid[y+r][x+c] = T.DIRT
    }
  }

  setPathOrganic(40, 0, 40, 45) 
  setPathOrganic(0, 22, 80, 22) 
  setPathOrganic(10, 10, 40, 22) 
  setPathOrganic(70, 10, 40, 22) 
  setPathOrganic(10, 35, 40, 22) 
  setPathOrganic(70, 35, 40, 22) 

  return { ground: groundGrid.flat(), paths: pathGrid.flat() }
}

const mapResult = MODE === 'catalog' ? { ground: tileCatalog(), paths: null } : villageMap()

const layers = [
  {
    data: mapResult.ground,
    height: MAP_H,
    id: 1,
    name: 'ground',
    opacity: 1,
    type: 'tilelayer',
    visible: true,
    width: MAP_W,
    x: 0,
    y: 0,
  }
]

if (mapResult.paths) {
  layers.push({
    data: mapResult.paths,
    height: MAP_H,
    id: 2,
    name: 'paths',
    opacity: 1,
    type: 'tilelayer',
    visible: true,
    width: MAP_W,
    x: 0,
    y: 0,
  })
}

const tiledJson = {
  compressionlevel: -1,
  height: MAP_H,
  infinite: false,
  layers: layers,
  nextlayerid: layers.length + 1,
  nextobjectid: 1,
  orientation: 'orthogonal',
  renderorder: 'right-down',
  tiledversion: '1.10.2',
  tileheight: 16,
  tilesets: [{
    columns: COLS,
    firstgid: 1,
    image: 'serene.png',
    imageheight: 720,
    imagewidth: 304,
    margin: 0,
    name: 'SereneVillage',
    spacing: 0,
    tilecount: COLS * ROWS,
    tileheight: 16,
    tilewidth: 16,
  }],
  tilewidth: 16,
  type: 'map',
  version: '1.10',
  width: MAP_W,
}

const outPath = new URL('../apps/landing/public/village/clawvili.json', import.meta.url).pathname
writeFileSync(outPath, JSON.stringify(tiledJson))
console.log(`Mode: ${MODE} → ${outPath} (${MAP_W}×${MAP_H})`)
