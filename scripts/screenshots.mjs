/**
 * Drives the built site in a real browser: walks the full quiz, captures each
 * screen, and checks the pieces that only exist at runtime (canvas share card,
 * URL routing, focus states). Point it at a running server:
 *
 *   npm run preview &
 *   node scripts/screenshots.mjs http://localhost:4173
 */

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:4173";
const OUT = path.resolve("screenshots");
fs.mkdirSync(OUT, { recursive: true });

const shot = async (page, name, opts = {}) => {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), ...opts });
  console.log(`  captured ${name}.png`);
};

const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });

page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

// --- Intro ---------------------------------------------------------------
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await shot(page, "01-intro");

// --- Identity ------------------------------------------------------------
await page.getByRole("button", { name: "Start the quiz" }).click();
await page.waitForTimeout(300);
await shot(page, "02-identity");

await page.getByRole("button", { name: "I'm a human" }).click();
await page.waitForTimeout(400);
await shot(page, "03-question-1");

// --- Walk all 15 questions ----------------------------------------------
for (let i = 0; i < 15; i++) {
  const options = page.locator("button.option");
  await options.first().waitFor({ state: "visible" });
  const count = await options.count();
  if (count !== 5) errors.push(`question ${i + 1} had ${count} options, expected 5`);
  // Vary the answers so the result isn't all-extreme.
  await options.nth([0, 2, 1, 4, 3][i % 5]).click();
  await page.waitForTimeout(320);
  if (i === 6) await shot(page, "04-question-mid");
}

// --- Results -------------------------------------------------------------
await page.locator(".result-name").waitFor({ state: "visible" });
await page.waitForTimeout(1400);
await shot(page, "05-results-top");
await shot(page, "06-results-full", { fullPage: true });

const code = (await page.locator(".result-code").textContent())?.trim();
const name = (await page.locator(".result-name").textContent())?.trim();
console.log(`  result: ${name} (${code})`);

// The canvas share card must actually have pixels drawn.
const cardInfo = await page.evaluate(() => {
  const c = document.querySelector(".share-card-preview canvas");
  if (!c) return { ok: false, reason: "no canvas" };
  const ctx = c.getContext("2d");
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let nonPaper = 0;
  for (let i = 0; i < d.length; i += 4 * 97) {
    if (d[i] < 200 || d[i + 1] < 200 || d[i + 2] < 200) nonPaper++;
  }
  return { ok: true, w: c.width, h: c.height, nonPaper };
});
if (!cardInfo.ok || cardInfo.nonPaper < 50) {
  errors.push(`share card looks blank: ${JSON.stringify(cardInfo)}`);
}
console.log(`  share card: ${cardInfo.w}x${cardInfo.h}, ${cardInfo.nonPaper} ink samples`);

await page.locator(".share-card-preview").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await shot(page, "07-share");

// The share link must round-trip.
const shareLink = await page.evaluate(
  () => document.querySelector(".share-text").textContent.split("→ ")[1]
);
console.log(`  share link: ${shareLink}`);

// --- Archetype index -----------------------------------------------------
await page.getByRole("button", { name: "Show" }).click();
await page.waitForTimeout(300);
await page.locator(".archetypes-list").scrollIntoViewIfNeeded();
await shot(page, "08-archetypes");

// --- Reopening a shared result ------------------------------------------
await page.goto(shareLink, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const reopenedCode = (await page.locator(".result-code").textContent())?.trim();
const reopenedName = (await page.locator(".result-name").textContent())?.trim();
if (reopenedCode !== code || reopenedName !== name) {
  errors.push(
    `shared link reopened as ${reopenedName} (${reopenedCode}), expected ${name} (${code})`
  );
}
const reopenedScores = await page.locator(".meter-value").allTextContents();
console.log(`  reopened: ${reopenedName} (${reopenedCode}) scores ${reopenedScores.join(", ")}`);
await shot(page, "09-shared-result");

// --- Stats ---------------------------------------------------------------
await page.goto(`${BASE}/#/stats`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await shot(page, "10-stats", { fullPage: true });

// --- Mobile --------------------------------------------------------------
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(shareLink, { waitUntil: "networkidle" });
await mobile.waitForTimeout(1200);
await shot(mobile, "11-mobile-results", { fullPage: true });

await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.getByRole("button", { name: "Start the quiz" }).click();
await mobile.waitForTimeout(200);
await mobile.getByRole("button", { name: "I'm a human" }).click();
await mobile.waitForTimeout(400);
await shot(mobile, "12-mobile-question");

// --- Keyboard focus ------------------------------------------------------
await mobile.close();
const kb = await browser.newPage({ viewport: { width: 1000, height: 900 } });
await kb.goto(BASE, { waitUntil: "networkidle" });
await kb.keyboard.press("Tab");
await kb.keyboard.press("Tab");
await kb.keyboard.press("Tab");
await shot(kb, "13-focus-ring");
const focusVisible = await kb.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const s = getComputedStyle(el);
  return { tag: el.tagName, text: el.textContent?.slice(0, 30), outline: s.outlineWidth };
});
console.log(`  focus: ${JSON.stringify(focusVisible)}`);

await browser.close();

if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log("\nBrowser walkthrough clean.\n");
