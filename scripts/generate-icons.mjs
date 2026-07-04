// One-off: node scripts/generate-icons.mjs
// Renders a placeholder app icon (green rounded square + ฿) to public/icons/.
// Replace the SVG below with real artwork later and re-run.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="110" fill="#58CC02"/>
  <text x="256" y="350" font-family="Arial, sans-serif" font-size="280" font-weight="800"
        fill="#ffffff" text-anchor="middle">฿</text>
</svg>`

mkdirSync('public/icons', { recursive: true })
for (const size of [192, 512]) {
  await sharp(Buffer.from(svg)).resize(size, size).png()
    .toFile(`public/icons/icon-${size}.png`)
}
console.log('icons written to public/icons/')
