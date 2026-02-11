/**
 * Generate deterministic tree positions and inject them into the
 * "trees" object layer of clawvili.json.
 *
 * Uses the same exclusion-zone algorithm as the old VillageScene code,
 * but with a seeded PRNG so results are repeatable.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const MAP_PATH = join(ROOT, 'apps/landing/public/village/clawvili.json')

const WORLD_WIDTH = 1280
const WORLD_HEIGHT = 720
const MAX_TREES = 18
const MAX_ATTEMPTS = 200

const map = JSON.parse(readFileSync(MAP_PATH, 'utf-8'))

// Read building rectangles from the buildings layer for exclusion zones
const buildingsLayer = map.layers.find((l) => l.name === 'buildings')
const exclusions = (buildingsLayer?.objects ?? []).map((obj) => {
  const w = obj.width ?? 64
  const h = obj.height ?? 64
  const cx = obj.x + w / 2
  const cy = obj.y + h / 2
  return { cx, cy, rx: w / 2 + 30, ry: h / 2 + 20 }
})

// Also exclude fountain area
const propsLayer = map.layers.find((l) => l.name === 'props')
for (const obj of propsLayer?.objects ?? []) {
  if (obj.name === 'fountain') {
    const w = obj.width ?? 64
    const h = obj.height ?? 48
    exclusions.push({ cx: obj.x + w / 2, cy: obj.y + h / 2, rx: 60, ry: 40 })
  }
}

// Simple seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)
const randBetween = (min, max) => Math.floor(rand() * (max - min + 1)) + min

const trees = []
let placed = 0
let attempts = 0

while (placed < MAX_TREES && attempts < MAX_ATTEMPTS) {
  attempts++
  const x = randBetween(40, WORLD_WIDTH - 40)
  const y = randBetween(80, WORLD_HEIGHT - 40)

  const blocked = exclusions.some(
    (z) => Math.abs(x - z.cx) < z.rx && Math.abs(y - z.cy) < z.ry,
  )
  if (blocked) continue

  const key = randBetween(0, 1) === 0 ? 'tree-big' : 'tree-small'
  trees.push({ name: key, x, y })
  placed++
}

// Remove old trees layer if exists
map.layers = map.layers.filter((l) => l.name !== 'trees')

let nextLayerId = Math.max(...map.layers.map((l) => l.id)) + 1
let nextObjId = map.nextobjectid ?? 1

const treeObjects = trees.map((t) => ({
  id: nextObjId++,
  name: t.name,
  type: 'tree',
  x: t.x,
  y: t.y,
  width: 0,
  height: 0,
  point: true,
  rotation: 0,
  visible: true,
  properties: [],
}))

map.layers.push({
  draworder: 'topdown',
  id: nextLayerId++,
  name: 'trees',
  objects: treeObjects,
  opacity: 1,
  type: 'objectgroup',
  visible: true,
  x: 0,
  y: 0,
})

map.nextlayerid = nextLayerId
map.nextobjectid = nextObjId

writeFileSync(MAP_PATH, JSON.stringify(map))
console.log(`Placed ${trees.length} trees (${attempts} attempts)`)
for (const t of trees) console.log(`  ${t.name} at (${t.x}, ${t.y})`)
