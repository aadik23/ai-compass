/**
 * Shared results store (Supabase REST, no SDK — it's two endpoints).
 *
 * Configured by two build-time values in .env.local:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=sb_publishable_...
 *
 * Both are public by design; the schema in supabase/schema.sql only lets this
 * key insert rows and call the aggregate function. It cannot read raw rows.
 *
 * Everything here fails soft: if the backend is unset or unreachable, the app
 * falls back to local-only stats rather than breaking the quiz.
 */

const URL_BASE = (import.meta.env?.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";

export const isRemoteConfigured = Boolean(URL_BASE && KEY);

const headers = () => ({
  "Content-Type": "application/json",
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
});

/** Add one completed result to the shared totals. */
export async function submitResult(typeCode, scores, isHuman) {
  if (!isRemoteConfigured) return false;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/results`, {
      method: "POST",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify({
        type_code: typeCode.toUpperCase(),
        outcome: Math.round(scores.outcome),
        novelty: Math.round(scores.novelty),
        timeline: Math.round(scores.timeline),
        control: Math.round(scores.control),
        is_human: isHuman,
      }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return true;
  } catch (err) {
    console.warn("Could not add result to shared totals:", err.message);
    return false;
  }
}

/** Add the individual answers behind a result, for the per-question breakdown. */
export async function submitResponses(rows, isHuman) {
  if (!isRemoteConfigured || !rows.length) return false;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/responses`, {
      method: "POST",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify(
        rows.map((r) => ({
          question_id: r.questionId,
          score: r.score,
          is_human: isHuman,
        }))
      ),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return true;
  } catch (err) {
    console.warn("Could not add answers to shared totals:", err.message);
    return false;
  }
}

/** Population aggregates. Returns null if unavailable. */
export async function fetchSharedStats() {
  if (!isRemoteConfigured) return null;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/quiz_stats`, {
      method: "POST",
      headers: headers(),
      body: "{}",
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return await res.json();
  } catch (err) {
    console.warn("Could not load shared stats:", err.message);
    return null;
  }
}
