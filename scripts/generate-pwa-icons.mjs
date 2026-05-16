/**
 * Generates PNG PWA icons from SVG. Run: node scripts/generate-pwa-icons.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconsDir = join(root, "public", "icons");

mkdirSync(iconsDir, { recursive: true });

const svg = readFileSync(join(iconsDir, "icon.svg"), "utf8");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("sharp not installed; copying SVG-only fallback.");
    return;
  }

  const sizes = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "icon-maskable-512.png", size: 512, padding: 64 },
  ];

  for (const { name, size, padding = 0 } of sizes) {
    let pipeline = sharp(Buffer.from(svg));
    if (padding > 0) {
      const inner = size - padding * 2;
      pipeline = pipeline.resize(inner, inner).extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      });
    } else {
      pipeline = pipeline.resize(size, size);
    }
    await pipeline.png().toFile(join(iconsDir, name));
    console.log("Wrote", name);
  }
}

main().catch(console.error);
