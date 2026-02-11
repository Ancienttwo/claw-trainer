/**
 * Inject object layers into clawvili.json so all game objects
 * can be visually positioned in the Tiled editor.
 *
 * Layers added:
 *   - buildings (rectangle objects with texture/label/zoneId)
 *   - npcs      (rectangle objects with texture/anim/dialogue)
 *   - props     (rectangle objects for fountain, chest, etc.)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const MAP_PATH = join(ROOT, 'apps/landing/public/village/clawvili.json')

const map = JSON.parse(readFileSync(MAP_PATH, 'utf-8'))

// Remove existing object layers (idempotent re-run)
map.layers = map.layers.filter((l) => l.type !== 'objectgroup')

let nextLayerId = Math.max(...map.layers.map((l) => l.id)) + 1
let objId = 1

function prop(name, type, value) {
  return { name, type, value }
}

// ── Buildings ────────────────────────────────────────────────
// Rectangles represent the display footprint (origin: top-left).
// Phaser conversion: x_center = x + width/2, y_bottom = y + height
const buildingObjects = [
  {
    name: 'village-center',
    x: 576, y: 232, width: 128, height: 128,
    props: [
      prop('texture', 'string', 'building-tech-center'),
      prop('label', 'string', 'Village Center'),
      prop('zoneId', 'string', 'plaza'),
    ],
  },
  {
    name: 'tavern',
    x: 268, y: 200, width: 64, height: 80,
    props: [
      prop('texture', 'string', 'building-tavern'),
      prop('label', 'string', 'Tech Tavern'),
      prop('zoneId', 'string', 'tavern'),
    ],
  },
  {
    name: 'lab',
    x: 1008, y: 120, width: 64, height: 80,
    props: [
      prop('texture', 'string', 'building-lab'),
      prop('label', 'string', 'Lobster Lab'),
      prop('zoneId', 'string', 'lab'),
    ],
  },
  {
    name: 'shop',
    x: 936, y: 463, width: 48, height: 77,
    props: [
      prop('texture', 'string', 'building-shop'),
      prop('label', 'string', 'Tech Shop'),
      prop('zoneId', 'string', 'districts'),
    ],
  },
  {
    name: 'arena',
    x: 160, y: 420, width: 80, height: 120,
    props: [
      prop('texture', 'string', 'building-arena'),
      prop('label', 'string', 'Arena'),
      prop('zoneId', 'string', 'training'),
    ],
  },
]

// ── NPCs ─────────────────────────────────────────────────────
const npcObjects = [
  {
    name: 'Guide',
    x: 636, y: 396, width: 8, height: 8,
    props: [
      prop('texture', 'string', 'npc-adam'),
      prop('anim', 'string', 'adam-idle'),
    ],
  },
  {
    name: 'Scientist',
    x: 1036, y: 226, width: 8, height: 8,
    props: [
      prop('texture', 'string', 'npc-alex'),
    ],
  },
  {
    name: 'Blacksmith',
    x: 956, y: 566, width: 8, height: 8,
    props: [
      prop('texture', 'string', 'npc-bob'),
    ],
  },
  {
    name: 'Trainer',
    x: 196, y: 566, width: 8, height: 8,
    props: [
      prop('texture', 'string', 'npc-bob'),
    ],
  },
  {
    name: 'Bartender',
    x: 296, y: 306, width: 8, height: 8,
    props: [
      prop('texture', 'string', 'npc-amelia'),
    ],
  },
]

// ── Props ────────────────────────────────────────────────────
const propObjects = [
  {
    name: 'fountain',
    x: 608, y: 192, width: 64, height: 48,
    props: [prop('type', 'string', 'fountain')],
  },
  {
    name: 'chest',
    x: 440, y: 632, width: 16, height: 16,
    props: [
      prop('type', 'string', 'chest'),
      prop('zoneId', 'string', 'districts'),
    ],
  },
]

function makeLayer(name, items) {
  const layerId = nextLayerId++
  return {
    draworder: 'topdown',
    id: layerId,
    name,
    objects: items.map((item) => ({
      id: objId++,
      name: item.name,
      type: name === 'buildings' ? 'building' : name === 'npcs' ? 'npc' : 'prop',
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      rotation: 0,
      visible: true,
      properties: item.props,
    })),
    opacity: 1,
    type: 'objectgroup',
    visible: true,
    x: 0,
    y: 0,
  }
}

map.layers.push(makeLayer('buildings', buildingObjects))
map.layers.push(makeLayer('npcs', npcObjects))
map.layers.push(makeLayer('props', propObjects))
map.nextlayerid = nextLayerId
map.nextobjectid = objId

writeFileSync(MAP_PATH, JSON.stringify(map))
console.log(`Injected 3 object layers (${buildingObjects.length} buildings, ${npcObjects.length} NPCs, ${propObjects.length} props)`)
console.log(`Map saved to ${MAP_PATH}`)
