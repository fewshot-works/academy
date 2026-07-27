// One-off script to (re)generate static/img/docusaurus-social-card.jpg from
// the Basecamp palette. Not part of the build, run by hand with
// `node scripts/generate-social-card.mjs` whenever the mark or copy changes.
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';

const width = 1200;
const height = 630;

const ring = 'M200 40 C260 40 320 80 340 140 C360 200 340 270 290 310 C240 350 160 350 110 310 C60 270 40 200 60 140 C80 80 140 40 200 40 Z';

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f6f4ef" />
  <defs>
    <path id="ring" d="${ring}" />
  </defs>
  <g fill="none" stroke="#1f5d4c" stroke-width="3" opacity="0.5">
    <use href="#ring" transform="translate(880 300) scale(1.35) translate(-204 -196)" />
    <use href="#ring" transform="translate(880 300) scale(1.05) translate(-198 -202)" />
    <use href="#ring" transform="translate(880 300) scale(0.75) translate(-196 -206)" />
    <use href="#ring" transform="translate(880 300) scale(0.5) translate(-192 -210)" />
  </g>
  <circle cx="985" cy="185" r="10" fill="#a85a1c" />
  <text x="90" y="280" font-family="Georgia, 'Iowan Old Style', serif" font-size="72" fill="#123a2e">Few-Shot Academy</text>
  <text x="90" y="335" font-family="-apple-system, Helvetica, Arial, sans-serif" font-size="32" fill="#55625b">From zero to your first AI agent</text>
  <text x="90" y="378" font-family="-apple-system, Helvetica, Arial, sans-serif" font-size="32" fill="#55625b">free, local-first, hands-on.</text>
</svg>
`;

const outPath = fileURLToPath(new URL('../static/img/docusaurus-social-card.jpg', import.meta.url));

await sharp(Buffer.from(svg)).jpeg({quality: 90}).toFile(outPath);

console.log(`Wrote ${outPath}`);
