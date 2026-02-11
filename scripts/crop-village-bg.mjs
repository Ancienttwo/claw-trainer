import sharp from 'sharp'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const src = resolve(root, 'docs/plans/2026-02-10-clawtrainer-v3-npc-variety.png')
const dst = resolve(root, 'apps/landing/public/village/village-bg.png')

const TARGET_W = 1280
const TARGET_H = 720

const meta = await sharp(src).metadata()
const srcW = meta.width ?? 0
const srcH = meta.height ?? 0

const left = Math.round((srcW - TARGET_W) / 2)
const top = Math.round((srcH - TARGET_H) / 2)

await sharp(src)
  .extract({ left, top, width: TARGET_W, height: TARGET_H })
  .toFile(dst)

console.log(`Cropped ${srcW}×${srcH} → ${TARGET_W}×${TARGET_H} at offset (${left}, ${top})`)
console.log(`Output: ${dst}`)
