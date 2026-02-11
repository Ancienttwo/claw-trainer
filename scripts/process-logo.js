import sharp from 'sharp';

const inputPath = 'assets/2026-02-12-01-47-clawtrainer-square-icon.png';
const outputPath = 'assets/logo-transparent.png';

async function processLogo() {
  try {
    const image = sharp(inputPath);
    const { data: rawPixels, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const whiteThreshold = 240;
    const bytesPerPixel = 4;
    const pixelCount = info.width * info.height;
    const processedBuffer = Buffer.alloc(pixelCount * bytesPerPixel);
    
    for (let i = 0; i < rawPixels.length; i += bytesPerPixel) {
      const red = rawPixels[i];
      const green = rawPixels[i + 1];
      const blue = rawPixels[i + 2];
      const alpha = rawPixels[i + 3];
      
      const isWhiteish = red > whiteThreshold && green > whiteThreshold && blue > whiteThreshold;
      
      if (isWhiteish) {
        processedBuffer[i] = 0;
        processedBuffer[i + 1] = 0;
        processedBuffer[i + 2] = 0;
        processedBuffer[i + 3] = 0;
      } else {
        processedBuffer[i] = red;
        processedBuffer[i + 1] = green;
        processedBuffer[i + 2] = blue;
        processedBuffer[i + 3] = alpha;
      }
    }

    await sharp(processedBuffer, {
      raw: {
        width: info.width,
        height: info.height,
        channels: bytesPerPixel
      }
    })
    .trim()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(outputPath);

    console.log(`Saved transparent logo to ${outputPath}`);
  } catch (err) {
    console.error('Error processing logo:', err);
  }
}

processLogo();

