import sharp from "sharp";
import type { SlideRole } from "./listicle";

// Server-only. Composites a listicle slide onto a 9:16 (1080x1920) background,
// styled by role: oversized title, number-badge reasons/plug, CTA pill.

export const SLIDE_W = 1080;
export const SLIDE_H = 1920;

const ACCENT = "#6366f1";
const BOTTOM_PAD = 170;

export interface CompositeOptions {
  text: string;
  role: SlideRole;
  number: number | null;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= maxChars) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/[.,;:!?]?$/, "…");
    return kept;
  }
  return lines;
}

function tspans(lines: string[], cx: number, lh: number): string {
  return lines
    .map(
      (ln, i) =>
        `<tspan x="${cx}" dy="${i === 0 ? 0 : lh}">${escapeXml(ln)}</tspan>`,
    )
    .join("");
}

const DEFS = `<defs>
  <linearGradient id="scrim" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#000000" stop-opacity="0.9"/>
    <stop offset="0.5" stop-color="#000000" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0"/>
  </linearGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="3" stdDeviation="7" flood-color="#000000" flood-opacity="0.6"/>
  </filter>
</defs>`;

function svgShell(inner: string): string {
  const scrimY = Math.round(SLIDE_H * 0.42);
  return `<svg width="${SLIDE_W}" height="${SLIDE_H}" xmlns="http://www.w3.org/2000/svg">
  ${DEFS}
  <rect x="0" y="${scrimY}" width="${SLIDE_W}" height="${SLIDE_H - scrimY}" fill="url(#scrim)"/>
  ${inner}
</svg>`;
}

function buildSvg(opts: CompositeOptions): string {
  const cx = SLIDE_W / 2;

  if (opts.role === "title") {
    const fontSize = 100;
    const lh = Math.round(fontSize * 1.12);
    const maxChars = Math.max(8, Math.floor((SLIDE_W * 0.84) / (fontSize * 0.54)));
    const lines = wrapText(opts.text, maxChars, 4);
    const blockH = lines.length * lh;
    const firstBaseline = SLIDE_H - BOTTOM_PAD - blockH + Math.round(fontSize * 0.8);
    const ruleY = firstBaseline - Math.round(fontSize * 0.8) - 36;
    return svgShell(
      `<rect x="${cx - 60}" y="${ruleY}" width="120" height="8" rx="4" fill="${ACCENT}"/>
  <text x="${cx}" y="${firstBaseline}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="${fontSize}" letter-spacing="-1" fill="#ffffff" filter="url(#shadow)">${tspans(lines, cx, lh)}</text>`,
    );
  }

  if (opts.role === "reason" || opts.role === "plug") {
    const fontSize = 62;
    const lh = Math.round(fontSize * 1.16);
    const maxChars = Math.max(10, Math.floor((SLIDE_W * 0.82) / (fontSize * 0.54)));
    const lines = wrapText(opts.text, maxChars, 4);
    const badge = 132;
    const gap = 32;
    const textH = lines.length * lh;
    const blockTop = SLIDE_H - BOTTOM_PAD - (badge + gap + textH);
    const badgeX = cx - badge / 2;
    const textBaseline = blockTop + badge + gap + Math.round(fontSize * 0.8);
    const num = opts.number != null ? String(opts.number) : "";
    return svgShell(
      `<rect x="${badgeX}" y="${blockTop}" width="${badge}" height="${badge}" rx="28" fill="${ACCENT}" filter="url(#shadow)"/>
  <text x="${cx}" y="${blockTop + badge / 2}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="800" font-size="78" fill="#ffffff">${num}</text>
  <text x="${cx}" y="${textBaseline}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="${fontSize}" letter-spacing="-0.5" fill="#ffffff" filter="url(#shadow)">${tspans(lines, cx, lh)}</text>`,
    );
  }

  // cta — accent pill
  const fontSize = 58;
  const lh = Math.round(fontSize * 1.12);
  const maxChars = Math.max(10, Math.floor((SLIDE_W * 0.7) / (fontSize * 0.56)));
  const lines = wrapText(opts.text, maxChars, 2);
  const textH = lines.length * lh;
  const padX = 60;
  const padY = 32;
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a), "");
  const textW = Math.min(SLIDE_W * 0.84, longest.length * (fontSize * 0.56));
  const pillW = Math.min(SLIDE_W * 0.9, textW + padX * 2);
  const pillH = textH + padY * 2;
  const pillX = cx - pillW / 2;
  const pillTop = SLIDE_H - BOTTOM_PAD - pillH;
  const firstBaseline = pillTop + padY + Math.round(fontSize * 0.8);
  return svgShell(
    `<rect x="${pillX}" y="${pillTop}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${ACCENT}" filter="url(#shadow)"/>
  <text x="${cx}" y="${firstBaseline}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="${fontSize}" fill="#ffffff">${tspans(lines, cx, lh)}</text>`,
  );
}

export async function compositeSlide(
  background: Buffer,
  opts: CompositeOptions,
): Promise<Buffer> {
  const svg = buildSvg(opts);
  return sharp(background)
    .resize(SLIDE_W, SLIDE_H, { fit: "cover", position: "centre" })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}
