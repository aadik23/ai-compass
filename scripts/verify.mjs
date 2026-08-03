/**
 * Checks that don't need a browser: render components to static HTML and
 * assert the design doc's hard rules. Run with `npm run verify`.
 */

import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

import IntroPage from "../src/components/IntroPage.jsx";
import Question from "../src/components/Question.jsx";
import ProgressBar from "../src/components/ProgressBar.jsx";
import IdentityQuestion from "../src/components/IdentityQuestion.jsx";
import Results from "../src/components/Results.jsx";
import { typeDescriptions } from "../src/data/typeDescriptions.js";
import { allQuestions } from "../src/data/questions.js";
import {
  initializeQuiz,
  recordResponse,
  processQuestionComplete,
} from "../src/logic/quizState.js";
import { generateTypeCode } from "../src/logic/scoring.js";
import { shareText } from "../src/logic/shareText.js";
import { AXES } from "../src/logic/axes.js";

const h = React.createElement;
let failures = 0;

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`  ok    ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}${detail ? `\n        ${detail}` : ""}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

// ---------------------------------------------------------------------------
section("Anti-bias: no archetype leaks before the results screen");

const codes = Object.keys(typeDescriptions);
const archetypeStrings = [];
for (const code of codes) {
  archetypeStrings.push(code);
  archetypeStrings.push(typeDescriptions[code].label);
  archetypeStrings.push(typeDescriptions[code].tagline);
}

// Every screen a person can see before the reveal.
const preRevealHtml = [
  renderToStaticMarkup(h(IntroPage, { onStart() {} })),
  renderToStaticMarkup(h(IdentityQuestion, { onAnswer() {} })),
  renderToStaticMarkup(h(ProgressBar, { current: 7, total: 15 })),
  ...allQuestions.map((q) =>
    renderToStaticMarkup(h(Question, { question: q, onAnswer() {} }))
  ),
].join("\n");

const leaks = archetypeStrings.filter((s) => preRevealHtml.includes(s));
check(
  "no archetype name, code or tagline appears pre-results",
  leaks.length === 0,
  leaks.length ? `leaked: ${leaks.slice(0, 5).join(" | ")}` : ""
);

check(
  "the word 'archetype' does not appear pre-results",
  !/archetype/i.test(preRevealHtml)
);

check(
  "no axis names appear during the quiz",
  !AXES.some((a) => new RegExp(`>\\s*${a.label}\\s*<`).test(preRevealHtml))
);

// ---------------------------------------------------------------------------
section("Naming");

// Four-letter archetype codes are product data and belong on results. What must
// never reappear is an older product name in any rendered copy.
const RETIRED_NAMES = [/\bAI\s*Quiz\b/i, /\bg\s*u\s*f\s*o\b(?!['"\s]*[:,])/i];
check(
  "no retired product name in pre-results copy",
  !RETIRED_NAMES.some((re) => re.test(preRevealHtml))
);

const FIXTURE = "BASO";
const fixtureDesc = typeDescriptions[FIXTURE];
const resultHtml = renderToStaticMarkup(
  h(Results, {
    code: FIXTURE,
    scores: { outcome: 32, novelty: 28, timeline: 35, control: 61 },
    onRestart() {},
  })
);
check(
  "the four-letter code is still shown on the result",
  resultHtml.includes(FIXTURE)
);
check(
  "archetype name is revealed on the result",
  resultHtml.includes(fixtureDesc.label)
);

// ---------------------------------------------------------------------------
section("Results screen");

for (const axis of AXES) {
  check(`meter present: ${axis.label}`, resultHtml.includes(axis.label));
}

const order = AXES.map((a) => resultHtml.indexOf(`>${a.label}<`));
check(
  "meters render in Outcome, Novelty, Timeline, Control order",
  order.every((v, i) => i === 0 || (v > order[i - 1] && v !== -1)),
  `indices: ${order.join(", ")}`
);

check(
  "numeric scores are shown",
  ["32", "28", "35", "61"].every((n) => resultHtml.includes(`>${n}<`))
);

check(
  "no signature graphic / emblem markup",
  !/<svg/i.test(resultHtml)
);

// ---------------------------------------------------------------------------
section("Share copy");

const expected = `I'm ${fixtureDesc.label} on AI Compass — ${
  fixtureDesc.tagline.charAt(0).toLowerCase() + fixtureDesc.tagline.slice(1)
}. What do you believe about AI? → https://example.test/`;
const actual = shareText(
  fixtureDesc.label,
  fixtureDesc.tagline,
  "https://example.test/"
);
check("share text matches the doc template exactly", actual === expected, actual);

check(
  "share text carries no axis readouts",
  !AXES.some((a) => actual.includes(a.label))
);
check("share text is emoji-free", !/\p{Extended_Pictographic}/u.test(actual));

// ---------------------------------------------------------------------------
section("Gendered language");

const gendered = /\b(he|him|his|she|her|hers|himself|herself)\b/i;
const copySurfaces = { preReveal: preRevealHtml, results: resultHtml };
for (const [name, html] of Object.entries(copySurfaces)) {
  const text = html.replace(/<[^>]+>/g, " ");
  const hit = text.match(gendered);
  check(`${name} copy is gender-neutral`, !hit, hit ? `found "${hit[0]}"` : "");
}

// ---------------------------------------------------------------------------
section("Quiz engine still intact (logic is out of scope, so it must not move)");

let allCodes = new Set();
for (let run = 0; run < 300; run++) {
  const s = initializeQuiz();
  let n = 0;
  while (!s.isComplete) {
    const q = s.questionSequence[s.currentQuestionIndex];
    recordResponse(s, q.id, [-2, -1, 0, 1, 2][n % 5]);
    processQuestionComplete(s);
    if (++n > 40) break;
  }
  if (n !== 15) {
    check("every run is exactly 15 questions", false, `run ${run} took ${n}`);
    break;
  }
  allCodes.add(generateTypeCode(s.axes));
}
check("every run is exactly 15 questions", true);
check("all 16 archetypes have descriptions", codes.length === 16);

// ---------------------------------------------------------------------------
section("Contrast (the doc's non-negotiable floor)");

const toRgb = (h) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const PAPER = "#fbfaf8";
const contrastCases = [
  ["body ink on paper", "#1a1a1a", PAPER, 4.5],
  ["secondary text on paper", "#5a5a5a", PAPER, 4.5],
  ["eyebrow / inactive pole on paper", "#6e6e6e", PAPER, 4.5],
  ["active pole (green text) on paper", "#4a7a45", PAPER, 4.5],
  ["code badge: ink on yellow", "#1a1a1a", "#c9b458", 4.5],
  ["primary button: paper on ink", PAPER, "#1a1a1a", 4.5],
  ["chart axis line on paper", "#8f8b86", PAPER, 3.0],
  ["result marker on paper", "#1a1a1a", PAPER, 3.0],
];

for (const [name, fg, bg, min] of contrastCases) {
  const r = contrast(fg, bg);
  check(`${name} — ${r.toFixed(2)}:1 (need ${min})`, r >= min);
}

// The raw Wordle green is kept as specified. It sits at 2.7:1 on paper, so it
// is only ever used where a near-black marker and a numeric readout carry the
// same information — never as the sole encoding.
const rawGreen = contrast("#6aaa64", PAPER);
check(
  `Wordle green kept as specified (${rawGreen.toFixed(2)}:1, redundant encoding only)`,
  Math.abs(rawGreen - 2.67) < 0.05
);

// ---------------------------------------------------------------------------
console.log(
  failures === 0
    ? "\nAll checks passed.\n"
    : `\n${failures} check(s) failed.\n`
);
process.exit(failures === 0 ? 0 : 1);
