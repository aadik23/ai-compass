/**
 * Post-build step: generate one static page per archetype at /a/{CODE}/ with
 * its own hard-coded OG/Twitter image.
 *
 * Static hosting can't render a preview image per result on the fly, but the
 * archetype set is finite (16), so every share link can point at a page whose
 * preview is already correct. The exact axis scores ride along in ?s= and are
 * read by the app at runtime.
 *
 * Cards are drawn from the same draw list the browser canvas uses
 * (src/logic/cardLayout.js), measured with the real font files in
 * build-assets/fonts, and rasterised with resvg.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import * as fontkit from "fontkit";

import { CARD, layoutCard } from "../src/logic/cardLayout.js";
import { typeDescriptions } from "../src/data/typeDescriptions.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const fontDir = path.join(root, "build-assets", "fonts");

const BASE = process.env.VITE_BASE || "/";
const SITE_URL = (process.env.VITE_SITE_URL || "").replace(/\/+$/, "");

if (!SITE_URL) {
  console.warn(
    "\n  ! VITE_SITE_URL is not set. og:image needs an absolute URL, so link\n" +
      "    previews will not resolve until you rebuild with, e.g.:\n" +
      "    VITE_SITE_URL=https://you.github.io npm run build\n"
  );
}

// --- Fonts ---------------------------------------------------------------

const FONT_FILES = {
  "Inter|400|normal": "Inter-Regular.ttf",
  "Inter|500|normal": "Inter-Medium.ttf",
  "Inter|600|normal": "Inter-SemiBold.ttf",
  "Inter|700|normal": "Inter-Bold.ttf",
  "Source Serif 4|400|normal": "SourceSerif4-Regular.ttf",
  "Source Serif 4|700|normal": "SourceSerif4-Bold.ttf",
  "Source Serif 4|400|italic": "SourceSerif4-Italic.ttf",
};

const loaded = new Map();
for (const [key, file] of Object.entries(FONT_FILES)) {
  const full = path.join(fontDir, file);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing font for OG rendering: ${full}`);
  }
  loaded.set(key, fontkit.openSync(full));
}

function fontFor({ family, weight, style }) {
  return (
    loaded.get(`${family}|${weight}|${style}`) ||
    loaded.get(`${family}|400|normal`)
  );
}

/** Advance width in px, matching what the browser canvas would report. */
function measure(text, font) {
  const f = fontFor(font);
  const run = f.layout(text);
  return (run.advanceWidth / f.unitsPerEm) * font.size;
}

// --- SVG renderer for the shared draw list -------------------------------

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
  );
}

function renderSvg(ops) {
  const body = ops
    .map((op) => {
      if (op.type === "rect") {
        return `<rect x="${round(op.x)}" y="${round(op.y)}" width="${round(
          op.w
        )}" height="${round(op.h)}" fill="${op.fill}"/>`;
      }
      const { font } = op;
      const attrs = [
        `x="${round(op.x)}"`,
        `y="${round(op.y)}"`,
        `fill="${op.fill}"`,
        `font-family="${font.family}"`,
        `font-size="${font.size}"`,
        `font-weight="${font.weight}"`,
      ];
      if (font.style === "italic") attrs.push(`font-style="italic"`);
      if (op.tracking) attrs.push(`letter-spacing="${op.tracking}"`);
      return `<text ${attrs.join(" ")} xml:space="preserve">${escapeXml(
        op.text
      )}</text>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.width}" height="${CARD.height}" viewBox="0 0 ${CARD.width} ${CARD.height}">
  ${body}
</svg>`;
}

const round = (n) => Math.round(n * 100) / 100;

// --- Canonical scores (mirrors resultUrl.canonicalScores) ----------------

function canonicalScores(code) {
  const c = code.toUpperCase();
  return {
    outcome: c[0] === "G" ? 75 : 25,
    novelty: c[1] === "U" ? 75 : 25,
    timeline: c[2] === "F" ? 75 : 25,
    control: c[3] === "O" ? 75 : 25,
  };
}

// --- Pull the built asset URLs out of dist/index.html ---------------------

const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const scriptSrc = indexHtml.match(/<script[^>]+src="([^"]+)"/)?.[1];
const styleHref = indexHtml.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/)?.[1];

if (!scriptSrc || !styleHref) {
  throw new Error("Could not find built asset URLs in dist/index.html");
}

const fontLink = indexHtml.match(/<link href="https:\/\/fonts\.googleapis[^>]+>/)?.[0] ?? "";

// --- Generate ------------------------------------------------------------

const ogDir = path.join(dist, "og");
fs.mkdirSync(ogDir, { recursive: true });

const codes = Object.keys(typeDescriptions);

for (const code of codes) {
  const desc = typeDescriptions[code];

  const ops = layoutCard(
    {
      code,
      label: desc.label,
      tagline: desc.tagline,
      scores: canonicalScores(code),
    },
    measure
  );

  const svg = renderSvg(ops);
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: CARD.width },
    font: { fontDirs: [fontDir], loadSystemFonts: false, defaultFontFamily: "Inter" },
  })
    .render()
    .asPng();

  fs.writeFileSync(path.join(ogDir, `${code}.png`), png);

  // The static page carrying that image as its preview.
  const dir = path.join(dist, "a", code);
  fs.mkdirSync(dir, { recursive: true });

  const pageUrl = `${SITE_URL}${BASE}a/${code}/`;
  const imageUrl = `${SITE_URL}${BASE}og/${code}.png`;
  const title = `${desc.label} — AI Compass`;
  const description = `${desc.tagline}. What do you believe about AI?`;

  fs.writeFileSync(
    path.join(dir, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="${BASE}favicon.svg" />
    <title>${escapeXml(title)}</title>
    <meta name="description" content="${escapeXml(description)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AI Compass" />
    <meta property="og:title" content="${escapeXml(title)}" />
    <meta property="og:description" content="${escapeXml(description)}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="${CARD.width}" />
    <meta property="og:image:height" content="${CARD.height}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeXml(title)}" />
    <meta name="twitter:description" content="${escapeXml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    ${fontLink}
    <link rel="stylesheet" crossorigin href="${styleHref}" />
    <script type="module" crossorigin src="${scriptSrc}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
  );
}

console.log(
  `  ✓ ${codes.length} archetype pages -> dist/a/{CODE}/index.html\n` +
    `  ✓ ${codes.length} OG images     -> dist/og/{CODE}.png`
);
