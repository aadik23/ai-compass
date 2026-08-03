/**
 * Regenerates docs/ARCHETYPES.md from the quiz data.
 *
 * The tables are useful for GTM copy, so they must never drift from what the
 * app actually shows. Run `npm run docs:archetypes` after any change to
 * src/data/typeDescriptions.js.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { typeDescriptions } from "../src/data/typeDescriptions.js";
import { AXES } from "../src/logic/axes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DECODE = {
  G: "Good",
  B: "Bad",
  U: "Unprecedented",
  A: "Analogous",
  F: "Fast",
  S: "Slow",
  O: "Open",
  I: "Inevitable",
};

// Grouped so the fast block sits above its slow mirror, rather than the
// interleaved order the data file happens to use.
const ORDER = [
  "GUFO", "GUFI", "BUFO", "BUFI",
  "GAFO", "GAFI", "BAFO", "BAFI",
  "GUSO", "GUSI", "BUSO", "BUSI",
  "GASO", "GASI", "BASO", "BASI",
];

const missing = ORDER.filter((c) => !typeDescriptions[c]);
const extra = Object.keys(typeDescriptions).filter((c) => !ORDER.includes(c));
if (missing.length || extra.length) {
  throw new Error(
    `ORDER is out of sync with typeDescriptions — missing: ${missing}, extra: ${extra}`
  );
}

const LETTERS = [
  ["G", "B"],
  ["U", "A"],
  ["F", "S"],
  ["O", "I"],
];

const entries = ORDER.map((code) => [code, typeDescriptions[code]]);
const out = [];

out.push("# The Sixteen Archetypes");
out.push("");
out.push("Generated from `src/data/typeDescriptions.js`. Do not hand-edit —");
out.push("run `npm run docs:archetypes` so this can never drift from the app.");
out.push("");

out.push("## Reading a code");
out.push("");
out.push("One letter per axis, in the standard display order:");
out.push("");
out.push("| Position | Axis | Letters |");
out.push("|---|---|---|");
AXES.forEach((axis, i) => {
  const [hi, lo] = LETTERS[i];
  out.push(`| ${i + 1} | ${axis.label} | \`${hi}\` ${axis.right} · \`${lo}\` ${axis.left} |`);
});
out.push("");
out.push("Uppercase marks a strong lean, lowercase a weak one. The code shown on a");
out.push("result is uppercased so it always matches one of the sixteen below.");
out.push("");

out.push("## Codes and titles");
out.push("");
out.push(`| Code | ${AXES.map((a) => a.label).join(" | ")} | Title |`);
out.push(`|---|${AXES.map(() => "---").join("|")}|---|`);
for (const [code, d] of entries) {
  const cells = [...code].map((ch) => DECODE[ch]).join(" | ");
  out.push(`| \`${code}\` | ${cells} | ${d.label} |`);
}
out.push("");

out.push("## Titles and taglines");
out.push("");
out.push("| Code | Title | Tagline |");
out.push("|---|---|---|");
for (const [code, d] of entries) {
  out.push(`| \`${code}\` | ${d.label} | ${d.tagline} |`);
}
out.push("");

out.push("## Full entries");
out.push("");
for (const [code, d] of entries) {
  out.push(`### ${d.label} · \`${code}\``);
  out.push("");
  out.push(`*${d.tagline}*`);
  out.push("");
  out.push(d.description);
  out.push("");
  out.push(
    `**Thinkers:** ${d.thinkers.length ? d.thinkers.join(" · ") : "_none listed_"}`
  );
  out.push("");
  out.push(`**Communities:** ${d.communities.join(" · ")}`);
  out.push("");
}

const target = path.join(root, "docs", "ARCHETYPES.md");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out.join("\n"));
console.log(`  wrote docs/ARCHETYPES.md — ${entries.length} archetypes`);
