import sharp from 'sharp'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TILESETS = join(ROOT, 'apps/landing/public/village/Modern_Exteriors_RPG_Maker_MV')
const OUTPUT = join(ROOT, 'apps/landing/public/village/buildings')

const BUILDINGS = [
  {
    name: 'tavern',
    source: 'Tileset_13_MV.png',
    crop: { left: 0, top: 0, width: 384, height: 480 },
  },
  {
    name: 'lab',
    source: 'Tileset_15_MV.png',
    crop: { left: 0, top: 0, width: 384, height: 480 },
  },
  {
    name: 'shop',
    source: 'Tileset_11_MV.png',
    crop: { left: 0, top: 0, width: 240, height: 384 },
  },
  {
    name: 'arena',
    source: 'Tileset_44_MV.png',
    crop: { left: 0, top: 0, width: 384, height: 576 },
  },
  {
    name: 'tech_center',
    source: 'Tileset_41_MV.png',
    crop: { left: 0, top: 0, width: 768, height: 768 },
  },
]

for (const b of BUILDINGS) {
  const src = join(TILESETS, b.source)
  const dst = join(OUTPUT, `${b.name}.png`)
  await sharp(src).extract(b.crop).png().toFile(dst)
  console.log(`${b.name}: ${b.crop.width}x${b.crop.height} → ${dst}`)
}

console.log('\nDone — 5 building sprites extracted.')
