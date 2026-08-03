/**
 * Result state lives entirely in the URL — no backend.
 *
 * Share links point at the pre-generated per-archetype page so that crawlers
 * get the right OG image:
 *
 *   {origin}{base}a/{CODE}/?s=72-64-55-48
 *
 * Those pages only exist after `npm run build`, so in dev (and as a general
 * fallback) the same state is also readable from a hash route:
 *
 *   {origin}{base}#/r/{CODE}/72-64-55-48
 *
 * Order of the score triple-dash string is the standard display order:
 * outcome, novelty, timeline, control.
 */

import { typeCodeFromScores } from "./scoring";

import { AXIS_KEYS } from "./axes";

const ORDER = AXIS_KEYS;
export const BASE = import.meta.env?.BASE_URL || "/";

// These modules are also imported by the static-render checks in
// scripts/verify.mjs, where there is no window.
const origin = () =>
  typeof window === "undefined" ? "" : window.location.origin;

export function encodeScores(scores) {
  return ORDER.map((k) => clamp(Math.round(scores[k]))).join("-");
}

export function decodeScores(str) {
  if (!str) return null;
  const parts = str.split("-");
  if (parts.length !== ORDER.length) return null;

  const scores = {};
  for (let i = 0; i < ORDER.length; i++) {
    const n = Number(parts[i]);
    if (!Number.isFinite(n) || n < 0 || n > 100) return null;
    scores[ORDER[i]] = n;
  }
  return scores;
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

/** Canonical link to a specific result. Absolute, ready to paste. */
export function buildShareUrl(code, scores) {
  return `${origin()}${BASE}a/${code.toUpperCase()}/?s=${encodeScores(scores)}`;
}

/** Link to the quiz itself. */
export function buildHomeUrl() {
  return `${origin()}${BASE}`;
}

/**
 * Work out what to render from the current URL.
 * Returns {view: "quiz"|"stats"|"result", scores?, code?}
 */
export function readRoute() {
  if (typeof window === "undefined") return { view: "quiz" };
  const { pathname, search, hash } = window.location;

  // Hash route: #/r/GUFO/72-64-55-48  (also tolerates #/r/72-64-55-48)
  const hashPath = hash.replace(/^#\/?/, "");
  if (hashPath === "stats") return { view: "stats" };

  const hashResult = hashPath.match(/^r\/(?:([A-Za-z]{4})\/)?([\d-]+)$/);
  if (hashResult) {
    const scores = decodeScores(hashResult[2]);
    if (scores) {
      return {
        view: "result",
        scores,
        code: (hashResult[1] || typeCodeFromScores(scores)).toUpperCase(),
      };
    }
  }

  // Static archetype page: /a/GUFO/?s=72-64-55-48
  const pathMatch = pathname.match(/\/a\/([A-Za-z]{4})\/?$/);
  if (pathMatch) {
    const scores = decodeScores(new URLSearchParams(search).get("s"));
    if (scores) {
      return { view: "result", scores, code: pathMatch[1].toUpperCase() };
    }
    // No scores: the page was opened bare (e.g. from a link preview).
    // Show the archetype at its canonical corner position.
    return {
      view: "result",
      scores: canonicalScores(pathMatch[1].toUpperCase()),
      code: pathMatch[1].toUpperCase(),
      canonical: true,
    };
  }

  if (pathname.replace(/\/+$/, "").endsWith("/stats")) return { view: "stats" };

  return { view: "quiz" };
}

/**
 * Representative scores for an archetype with no measured result behind it —
 * used when someone opens a bare /a/{CODE}/ page. Strong lean = 75, so the
 * code round-trips through typeCodeFromScores.
 */
export function canonicalScores(code) {
  const c = code.toUpperCase();
  return {
    outcome: c[0] === "G" ? 75 : 25,
    novelty: c[1] === "U" ? 75 : 25,
    timeline: c[2] === "F" ? 75 : 25,
    control: c[3] === "O" ? 75 : 25,
  };
}
