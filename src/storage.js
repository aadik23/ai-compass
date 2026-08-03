// This browser's own quiz history, used by the stats page when no shared
// backend is configured. Nothing leaves the device.

const RESPONSES_KEY = "aicompass.responses";
const RESULTS_KEY = "aicompass.results";

// Earlier builds used different key names. Move anything found under them once,
// so returning visitors keep their history instead of silently losing it.
const LEGACY_KEYS = {
  [RESPONSES_KEY]: "gufo.responses",
  [RESULTS_KEY]: "gufo.results",
};

function migrateLegacyKeys() {
  try {
    for (const [current, legacy] of Object.entries(LEGACY_KEYS)) {
      const old = localStorage.getItem(legacy);
      if (old === null) continue;
      if (localStorage.getItem(current) === null) {
        localStorage.setItem(current, old);
      }
      localStorage.removeItem(legacy);
    }
  } catch {
    // Storage unavailable (private mode, quota). Nothing to recover.
  }
}

migrateLegacyKeys();

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn(`Failed to read ${key}:`, err.message);
    return [];
  }
}

function append(key, row) {
  try {
    const rows = read(key);
    rows.push({ id: rows.length + 1, created_at: new Date().toISOString(), ...row });
    localStorage.setItem(key, JSON.stringify(rows));
  } catch (err) {
    console.warn(`Failed to write ${key}:`, err.message);
  }
}

export async function logResponse(questionId, score, isHuman) {
  append(RESPONSES_KEY, { question_id: questionId, score, is_human: isHuman });
}

export async function logResult(typeCode, scores, isHuman) {
  append(RESULTS_KEY, { type_code: typeCode, scores, is_human: isHuman });
}

export async function fetchResponses() {
  return read(RESPONSES_KEY);
}

export async function fetchResults() {
  return read(RESULTS_KEY);
}

export function clearAll() {
  localStorage.removeItem(RESPONSES_KEY);
  localStorage.removeItem(RESULTS_KEY);
}
