// Resize/compress JPGs in public/ for web use. Originals stay where they were
// copied from. Run once before committing large photo batches.
//
//   node scripts/optimize-public-images.mjs

import { Jimp } from "jimp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOTS = [
  "public/blog/cityhive-2025",
  "public/about",
];

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;

async function processDir(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch (e) {
    if (e.code === "ENOENT") return;
    throw e;
  }
  for (const name of entries) {
    if (!/\.jpe?g$/i.test(name)) continue;
    const file = path.join(dir, name);
    const before = (await fs.stat(file)).size;
    const img = await Jimp.read(file);
    if (img.bitmap.width > MAX_WIDTH) {
      img.resize({ w: MAX_WIDTH });
    }
    await img.write(file, { quality: JPEG_QUALITY });
    const after = (await fs.stat(file)).size;
    const pct = Math.round((1 - after / before) * 100);
    console.log(
      `${file}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(2)}MB  (-${pct}%)`,
    );
  }
}

for (const r of ROOTS) {
  await processDir(r);
}
console.log("\nDone.");
