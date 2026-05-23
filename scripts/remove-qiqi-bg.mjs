// One-shot script to strip the near-white background out of the QiQi PNGs.
// Run with: node scripts/remove-qiqi-bg.mjs
//
// Strategy: any pixel whose RGB luminance is above THRESHOLD_LOW fades toward
// transparent; pixels above THRESHOLD_HIGH become fully transparent. This
// preserves the anti-aliased edges of the figure and the soft music-note edges.

import { Jimp } from "jimp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_QIQI = path.resolve(__dirname, "..", "public", "qiqi");

const THRESHOLD_LOW = 200;   // below this stays fully opaque
const THRESHOLD_HIGH = 235;  // above this becomes fully transparent

const files = ["qiqi-dance.png", "qiqi-welcome.png"];

for (const file of files) {
  const inPath = path.join(PUBLIC_QIQI, file);
  const outPath = path.join(PUBLIC_QIQI, file); // overwrite in place

  console.log(`Processing ${file}…`);
  const img = await Jimp.read(inPath);

  const { data, width, height } = img.bitmap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      if (lum >= THRESHOLD_HIGH) {
        data[idx + 3] = 0;
      } else if (lum > THRESHOLD_LOW) {
        const t = (lum - THRESHOLD_LOW) / (THRESHOLD_HIGH - THRESHOLD_LOW);
        data[idx + 3] = Math.round((1 - t) * 255);
      }
    }
  }

  await img.write(outPath);
  console.log(`  → wrote ${outPath}`);
}

console.log("Done.");
