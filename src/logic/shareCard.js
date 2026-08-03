import { CARD, layoutCard } from "./cardLayout";

/**
 * Execute the shared card draw list onto a canvas.
 * All geometry comes from cardLayout.js — this file only knows how to paint.
 */
export function drawShareCard(canvas, result) {
  const dpr = 2;
  canvas.width = CARD.width * dpr;
  canvas.height = CARD.height * dpr;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const measure = (text, font) => {
    ctx.font = cssFont(font);
    return ctx.measureText(text).width;
  };

  for (const op of layoutCard(result, measure)) {
    if (op.type === "rect") {
      ctx.fillStyle = op.fill;
      ctx.fillRect(op.x, op.y, op.w, op.h);
    } else {
      ctx.fillStyle = op.fill;
      ctx.font = cssFont(op.font);
      if (op.tracking) {
        // Canvas letterSpacing isn't universally supported — draw glyph by glyph.
        let x = op.x;
        for (const ch of op.text) {
          ctx.fillText(ch, x, op.y);
          x += ctx.measureText(ch).width + op.tracking;
        }
      } else {
        ctx.fillText(op.text, op.x, op.y);
      }
    }
  }

  return canvas;
}

function cssFont({ style, weight, size, family }) {
  const fallback = family === CARD.serif ? "Georgia, serif" : "sans-serif";
  return `${style} ${weight} ${size}px "${family}", ${fallback}`;
}

/** Wait for the webfonts so the card doesn't render in a fallback face. */
export async function ensureCardFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`700 78px "${CARD.serif}"`),
      document.fonts.load(`italic 400 30px "${CARD.serif}"`),
      document.fonts.load(`500 15px "${CARD.sans}"`),
      document.fonts.load(`600 15px "${CARD.sans}"`),
      document.fonts.load(`700 19px "${CARD.sans}"`),
    ]);
    await document.fonts.ready;
  } catch {
    // Fall back to the generic families rather than blocking the card.
  }
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
