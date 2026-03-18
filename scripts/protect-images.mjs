import sharp from 'sharp'
import { join } from 'path'

const publicDir = join(process.cwd(), 'public')

const imagesToProcess = [
  'banner-image1.png',
  'banner-image2.png',
  'banner-image3.png',
  'banner-image4.png',
  'banner-image5.png',
  'banner-image6.png',
  'homepage-image1.png',
]

for (const filename of imagesToProcess) {
  const inputPath = join(publicDir, filename)
  const tmpPath = inputPath + '.tmp'

  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    const w = metadata.width ?? 1920
    const h = metadata.height ?? 600

    await sharp(inputPath)
      // Strip ALL metadata
      .withMetadata(false)
      // Subtle perceptual changes — invisible to human eye
      .modulate({ hue: 2, brightness: 1.01, saturation: 0.99 })
      // 1-pixel crop + resize forces complete re-encode
      .extract({ left: 1, top: 1, width: Math.max(w - 2, 1), height: Math.max(h - 2, 1) })
      .resize(w, h, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
      .toFile(tmpPath)

    const { rename } = await import('fs/promises')
    await rename(tmpPath, inputPath)

    console.log(`✓ Protected: ${filename} (${w}×${h})`)
  } catch (err) {
    console.error(`✗ Failed: ${filename} —`, err.message)
  }
}

console.log('\nAll images processed.')
