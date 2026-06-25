// Generates themed 9:16 gradient placeholder "photos" for the landing-page demo.
// These stand in for the real product library images. Captions are NOT baked in —
// they are overlaid in the React <SlidePreview> component so the demo shows the
// caption-compositing concept. Run: `node scripts/gen-placeholders.mjs`.
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "demo");

// Per-niche palettes: each slide is [gradientTop, gradientBottom, emoji].
const NICHES = {
  gym: [
    ["#1e1b4b", "#4f46e5", "🏋️"],
    ["#0f172a", "#b91c1c", "🔥"],
    ["#18181b", "#ea580c", "💪"],
    ["#082f49", "#0ea5e9", "🏃"],
  ],
  food: [
    ["#7c2d12", "#f59e0b", "🍔"],
    ["#b91c1c", "#f97316", "🍜"],
    ["#78350f", "#fbbf24", "🥗"],
    ["#831843", "#f43f5e", "🍰"],
  ],
  fashion: [
    ["#1e1b4b", "#db2777", "👗"],
    ["#18181b", "#a855f7", "👜"],
    ["#4a044e", "#ec4899", "🕶️"],
    ["#0c0a09", "#6366f1", "👟"],
  ],
  realestate: [
    ["#0c4a6e", "#0ea5e9", "🏡"],
    ["#064e3b", "#10b981", "🔑"],
    ["#1e293b", "#38bdf8", "🏙️"],
    ["#0f172a", "#14b8a6", "🛋️"],
  ],
};

const W = 1080;
const H = 1920;

function svg(top, bottom, emoji, seed) {
  // A couple of soft light blobs give the flat gradient some photographic depth.
  const blob = (cx, cy, r, op) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow)" opacity="${op}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.15"/>
      <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${blob(W * 0.78, H * 0.18, 520, 0.5)}
  ${blob(W * 0.15, H * 0.62, 380, 0.28)}
  <text x="${W * 0.5}" y="${H * 0.42}" font-size="520" text-anchor="middle" dominant-baseline="central" opacity="0.22">${emoji}</text>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;
}

await mkdir(OUT, { recursive: true });
let count = 0;
for (const [niche, slides] of Object.entries(NICHES)) {
  for (let i = 0; i < slides.length; i++) {
    const [top, bottom, emoji] = slides[i];
    const file = join(OUT, `${niche}-${i + 1}.svg`);
    await writeFile(file, svg(top, bottom, emoji, `${niche}${i}`));
    count++;
  }
}
console.log(`Wrote ${count} placeholder images to ${OUT}`);
