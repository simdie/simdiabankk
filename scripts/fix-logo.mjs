import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const inputPath = path.join(root, 'public', 'logo.png')
const outputPath = path.join(root, 'public', 'logo.png')

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const pixels = new Uint8Array(data)

for (let i = 0; i < pixels.length; i += channels) {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]
  if (r > 220 && g > 220 && b > 220) {
    pixels[i + 3] = 0
  }
}

await sharp(Buffer.from(pixels), { raw: { width, height, channels } })
  .png()
  .toFile(outputPath)

console.log(`Done. Transparent logo saved to: ${outputPath}`)
console.log(`Dimensions: ${width}x${height}`)
