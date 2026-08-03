import { AXES } from "./axes.js";

/**
 * Single source of truth for the share card.
 *
 * `layoutCard` turns a result into a flat list of draw operations. Two engines
 * execute that list: a <canvas> at runtime (src/logic/shareCard.js) and an SVG
 * writer at build time for the static OG images (scripts/generate-og.mjs).
 * Neither owns any geometry of its own, so the two renderings can't drift.
 *
 * Purely typographic, per the design doc: no emblem, no mascot.
 */

export const CARD = {
  width: 1200,
  height: 630,
  pad: 76,

  paper: "#FBFAF8",
  ink: "#1A1A1A",
  inkSecondary: "#5A5A5A",
  inkTertiary: "#6E6E6E",
  rule: "#E0DEDB",
  ruleStrong: "#C4C1BD",
  chartLine: "#8F8B86",
  green: "#6AAA64",
  yellow: "#C9B458",

  serif: "Source Serif 4",
  sans: "Inter",
};

/** "Optimistic, unprecedented, fast" -> "optimistic, unprecedented, fast" */
export function lowerFirst(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

const serif = (size, weight = 400, style = "normal") => ({
  family: CARD.serif,
  size,
  weight,
  style,
});
const sans = (size, weight = 400) => ({
  family: CARD.sans,
  size,
  weight,
  style: "normal",
});

/**
 * Build the draw list.
 *
 * @param result  {code, label, tagline, scores}
 * @param measure (text, font) => width in px, excluding tracking
 * @returns array of {type:'rect'|'text', ...} in paint order
 */
export function layoutCard({ code, label, tagline, scores }, measure) {
  const { width, height, pad } = CARD;
  const contentWidth = width - pad * 2;
  const ops = [];

  const trackedWidth = (text, font, tracking = 0) =>
    measure(text, font) + tracking * Math.max(0, [...text].length - 1);

  const rect = (x, y, w, h, fill) => ops.push({ type: "rect", x, y, w, h, fill });
  const text = (str, x, y, font, fill, tracking = 0) =>
    ops.push({ type: "text", text: str, x, y, font, fill, tracking });

  // ---- Ground ----------------------------------------------------------
  rect(0, 0, width, height, CARD.paper);

  // ---- Eyebrow ---------------------------------------------------------
  text("AI COMPASS", pad, pad + 18, sans(15, 600), CARD.inkTertiary, 2.4);

  // ---- Archetype name: shrink to fit the measure ------------------------
  // "The Long-term Safety Advocate" overruns at the default size.
  let nameSize = 78;
  while (nameSize > 40 && measure(label, serif(nameSize, 700)) > contentWidth) {
    nameSize -= 2;
  }
  const nameBaseline = pad + 104;
  text(label, pad, nameBaseline, serif(nameSize, 700), CARD.ink);

  // ---- Four-letter code on the yellow badge ----------------------------
  const codeText = code.toUpperCase();
  const codeFont = sans(19, 700);
  const codeTracking = 4.2;
  const codeWidth = trackedWidth(codeText, codeFont, codeTracking);
  const badgeY = nameBaseline + 20;
  const badgeH = 38;
  const badgePadX = 18;
  rect(pad, badgeY, codeWidth + badgePadX * 2, badgeH, CARD.yellow);
  text(codeText, pad + badgePadX, badgeY + 26, codeFont, CARD.ink, codeTracking);

  // ---- Tagline ----------------------------------------------------------
  // Every current tagline fits on one line; the wrap is a guard for future edits.
  const taglineFont = serif(30, 400, "italic");
  const taglineLines = wrapLines(
    lowerFirst(tagline),
    contentWidth,
    (s) => measure(s, taglineFont)
  );
  let taglineY = badgeY + badgeH + 42;
  for (const line of taglineLines) {
    text(line, pad, taglineY, taglineFont, CARD.inkSecondary);
    taglineY += 40;
  }

  // ---- Divider ----------------------------------------------------------
  // Floats below the tagline block so a wrapped tagline pushes it down.
  const dividerY = taglineY - 40 + 26;
  rect(pad, dividerY, contentWidth, 1, CARD.rule);

  // ---- Axis meters ------------------------------------------------------
  // Left gutter sized to the widest pole label so every scale starts flush.
  const poleFont = sans(14, 400);
  const widestLeft = Math.max(
    ...AXES.map((a) => measure(a.left, poleFont))
  );
  const widestRight = Math.max(
    ...AXES.map((a) => measure(a.right, poleFont))
  );

  const meterX = pad + widestLeft + 18;
  const meterRight = width - pad - widestRight - 18;
  const meterWidth = meterRight - meterX;

  AXES.forEach((axis, i) => {
    const value = Math.round(scores[axis.key]);
    const y = dividerY + 48 + i * 58;
    const centerX = meterX + meterWidth / 2;
    const markerX = meterX + (meterWidth * value) / 100;

    // Axis name and reading share a line above the scale, as on the web meter.
    text(axis.label.toUpperCase(), pad, y - 20, sans(13, 600), CARD.inkTertiary, 1.4);

    const valFont = sans(15, 600);
    const valStr = String(value);
    text(valStr, width - pad - measure(valStr, valFont), y - 20, valFont, CARD.ink);

    // Pole labels — the leaned-toward side goes full ink
    const leansRight = value > 50;
    const leansLeft = value < 50;
    text(
      axis.left,
      meterX - 18 - measure(axis.left, poleFont),
      y + 5,
      poleFont,
      leansLeft ? CARD.ink : CARD.inkTertiary
    );
    text(
      axis.right,
      meterRight + 18,
      y + 5,
      poleFont,
      leansRight ? CARD.ink : CARD.inkTertiary
    );

    // Baseline, end ticks, centre tick
    rect(meterX, y, meterWidth, 1, CARD.chartLine);
    rect(meterX, y - 4, 1, 9, CARD.chartLine);
    rect(meterRight, y - 4, 1, 9, CARD.chartLine);
    rect(centerX, y - 7, 1, 15, CARD.chartLine);

    // Filled span from centre to the reading
    rect(
      Math.min(centerX, markerX),
      y - 1,
      Math.abs(markerX - centerX),
      3,
      CARD.green
    );

    // Marker
    rect(markerX - 1.5, y - 11, 3, 23, CARD.ink);
  });

  // ---- Footer -----------------------------------------------------------
  const footerBaseline = height - 44;
  rect(pad, footerBaseline - 32, contentWidth, 1, CARD.rule);
  text(
    "What do you believe about AI?",
    pad,
    footerBaseline,
    sans(15, 500),
    CARD.inkTertiary
  );

  const markFont = sans(15, 600);
  const markTracking = 2.4;
  const markWidth = trackedWidth("AI COMPASS", markFont, markTracking);
  text(
    "AI COMPASS",
    width - pad - markWidth,
    footerBaseline,
    markFont,
    CARD.ink,
    markTracking
  );

  return ops;
}

function wrapLines(str, maxWidth, measureLine) {
  const words = str.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && measureLine(candidate) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}
