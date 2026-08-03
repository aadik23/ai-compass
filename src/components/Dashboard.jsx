import { useState, useEffect } from "react";
import { fetchResponses, fetchResults, clearAll } from "../storage";
import { allQuestions } from "../data/questions";
import { typeCodeFromScores } from "../logic/scoring";
import AxisMeter from "./AxisMeter";
import { AXES } from "../logic/axes";

export default function Dashboard() {
  const [responses, setResponses] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchResponses(), fetchResults()]).then(([r, res]) => {
      setResponses(r);
      setResults(res);
      setLoading(false);
    });
  }, []);

  function handleReset() {
    if (!confirm("Delete all locally stored quiz data?")) return;
    clearAll();
    setResponses([]);
    setResults([]);
  }

  if (loading) {
    return <p className="stats-empty">Loading…</p>;
  }

  if (!responses.length && !results.length) {
    return (
      <div>
        <p className="stats-empty">
          Nothing here yet. Take the quiz and your runs will show up on this page.
        </p>
      </div>
    );
  }

  // --- Per-question ---
  const questionMap = {};
  for (const q of allQuestions) questionMap[q.id] = { ...q, scores: [] };
  for (const r of responses) {
    if (questionMap[r.question_id]) questionMap[r.question_id].scores.push(r.score);
  }

  // --- Overall ---
  const humanResults = results.filter((r) => r.is_human === true);
  const aiResults = results.filter((r) => r.is_human === false);

  const typeCounts = {};
  for (const r of results) {
    const code = r.scores
      ? typeCodeFromScores(r.scores).toUpperCase()
      : r.type_code.toUpperCase();
    typeCounts[code] = (typeCounts[code] || 0) + 1;
  }
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const maxTypeCount = sortedTypes.length ? sortedTypes[0][1] : 1;

  const axisAverages = {};
  for (const ax of AXES) {
    const vals = results.map((r) => r.scores?.[ax.key]).filter((v) => v != null);
    axisAverages[ax.key] = vals.length
      ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
      : 50;
  }

  function distribution(scores) {
    const buckets = { "-2": 0, "-1": 0, "0": 0, "1": 0, "2": 0 };
    for (const s of scores) buckets[String(s)] = (buckets[String(s)] || 0) + 1;
    return buckets;
  }

  return (
    <div>
      <p className="stats-note">
        <span>Stored in this browser only.</span>
        <button type="button" className="btn btn-quiet" onClick={handleReset}>
          Clear data
        </button>
      </p>

      <div className="stats-figures">
        <div className="intro-meta-item">
          <span className="eyebrow">Completions</span>
          <span className="stats-figure-value">{results.length}</span>
        </div>
        <div className="intro-meta-item">
          <span className="eyebrow">Human</span>
          <span className="stats-figure-value">{humanResults.length}</span>
        </div>
        <div className="intro-meta-item">
          <span className="eyebrow">AI</span>
          <span className="stats-figure-value">{aiResults.length}</span>
        </div>
        <div className="intro-meta-item">
          <span className="eyebrow">Answers</span>
          <span className="stats-figure-value">{responses.length}</span>
        </div>
      </div>

      {sortedTypes.length > 0 && (
        <>
          <div className="result-section-head">
            <span className="eyebrow">Archetypes recorded</span>
          </div>
          <div>
            {sortedTypes.map(([code, count]) => (
              <div key={code} className="stats-bar-row">
                <span className="stats-bar-label">{code}</span>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar-fill"
                    style={{ width: `${(count / maxTypeCount) * 100}%` }}
                  />
                </div>
                <span className="stats-bar-value">{count}</span>
              </div>
            ))}
          </div>
          <hr className="rule" />
        </>
      )}

      <div className="result-section-head">
        <span className="eyebrow">Average position</span>
        <span className="eyebrow">0 – 100</span>
      </div>
      <div className="meters">
        {AXES.map((ax) => (
          <AxisMeter
            key={ax.key}
            label={ax.label}
            score={axisAverages[ax.key]}
            leftLabel={ax.left}
            rightLabel={ax.right}
          />
        ))}
      </div>

      <hr className="rule" />

      <div className="result-section-head">
        <span className="eyebrow">By question</span>
      </div>
      <div>
        {allQuestions.map((q) => {
          const data = questionMap[q.id];
          if (!data.scores.length) return null;
          const avg = (
            data.scores.reduce((s, v) => s + v, 0) / data.scores.length
          ).toFixed(2);
          const dist = distribution(data.scores);
          const maxBucket = Math.max(...Object.values(dist), 1);
          return (
            <div key={q.id} className="stats-q">
              <span className="eyebrow">
                {q.id} · {q.axis}
              </span>
              <p className="stats-q-text">{q.text}</p>
              <div className="stats-q-meta">
                <span>
                  {data.scores.length}{" "}
                  {data.scores.length === 1 ? "answer" : "answers"}
                </span>
                <span>avg {avg}</span>
              </div>
              <div className="stats-dist">
                {["-2", "-1", "0", "1", "2"].map((b) => (
                  <div key={b} className="stats-dist-col">
                    <div
                      className="stats-dist-bar"
                      style={{ height: `${(dist[b] / maxBucket) * 100}%` }}
                    />
                    <span className="stats-dist-label">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
