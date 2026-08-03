// Local stand-in for the hosted Supabase backend.
// Everything is kept in localStorage so the app runs with no keys and no network.

const RESPONSES_KEY = "gufo.responses";
const RESULTS_KEY = "gufo.results";

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
