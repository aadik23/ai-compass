import { typeCodeFromScores } from "./scoring";
import { AXES } from "./axes";

/**
 * Both stats sources are reduced to one shape so the page has a single
 * rendering path:
 *
 *   { total, humans, ais, types: [{code, n}], axes: {…}, questions: [{…}] }
 *
 * The shared version comes straight out of the quiz_stats() SQL function; this
 * builds the same thing from localStorage rows.
 */
export function aggregateLocal(results, responses) {
  const typeCounts = new Map();
  for (const r of results) {
    const code = (r.scores ? typeCodeFromScores(r.scores) : r.type_code || "").toUpperCase();
    if (!code) continue;
    typeCounts.set(code, (typeCounts.get(code) || 0) + 1);
  }

  const axes = {};
  for (const axis of AXES) {
    const vals = results.map((r) => r.scores?.[axis.key]).filter((v) => v != null);
    axes[axis.key] = vals.length
      ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
      : 50;
  }

  const byQuestion = new Map();
  for (const r of responses) {
    if (!byQuestion.has(r.question_id)) byQuestion.set(r.question_id, []);
    byQuestion.get(r.question_id).push(r.score);
  }

  const questions = [...byQuestion.entries()].map(([question_id, scores]) => {
    const count = (v) => scores.filter((s) => s === v).length;
    return {
      question_id,
      n: scores.length,
      avg: Number((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2)),
      m2: count(-2),
      m1: count(-1),
      z: count(0),
      p1: count(1),
      p2: count(2),
    };
  });

  return {
    total: results.length,
    humans: results.filter((r) => r.is_human === true).length,
    ais: results.filter((r) => r.is_human === false).length,
    types: [...typeCounts.entries()]
      .map(([code, n]) => ({ code, n }))
      .sort((a, b) => b.n - a.n || a.code.localeCompare(b.code)),
    axes,
    questions,
  };
}

/** Guards against a malformed or partial payload from the backend. */
export function normalizeStats(raw) {
  if (!raw || typeof raw !== "object") return null;
  const axes = {};
  for (const axis of AXES) {
    const v = raw.axes?.[axis.key];
    axes[axis.key] = Number.isFinite(v) ? v : 50;
  }
  return {
    total: Number(raw.total) || 0,
    humans: Number(raw.humans) || 0,
    ais: Number(raw.ais) || 0,
    types: Array.isArray(raw.types)
      ? raw.types.filter((t) => t?.code).map((t) => ({ code: String(t.code).toUpperCase(), n: Number(t.n) || 0 }))
      : [],
    axes,
    questions: Array.isArray(raw.questions) ? raw.questions : [],
  };
}

export function percent(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}
