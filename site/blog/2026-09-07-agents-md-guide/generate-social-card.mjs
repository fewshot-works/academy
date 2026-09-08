import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const directory = new URL('./', import.meta.url);
const svgPath = fileURLToPath(new URL('social-card.svg', directory));
const pngPath = fileURLToPath(new URL('social-card.png', directory));

await sharp(svgPath).png().toFile(pngPath);
console.log(`Wrote ${pngPath}`);
