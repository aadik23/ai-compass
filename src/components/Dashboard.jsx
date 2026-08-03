import { useState, useEffect } from "react";
import { fetchResponses, fetchResults, clearAll } from "../storage";
import { fetchSharedStats, isRemoteConfigured } from "../remote";
import { aggregateLocal, normalizeStats, percent } from "../logic/aggregate";
import { allQuestions } from "../data/questions";
import { typeDescriptions } from "../data/typeDescriptions";
import { AXES } from "../logic/axes";
import AxisMeter from "./AxisMeter";

const nf = new Intl.NumberFormat("en-US");

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [source, setSource] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Prefer the shared totals; fall back to this browser's own runs.
      const shared = normalizeStats(await fetchSharedStats());
      if (cancelled) return;

      if (shared) {
        setStats(shared);
        setSource("shared");
        return;
      }

      const [responses, results] = await Promise.all([
        fetchResponses(),
        fetchResults(),
      ]);
      if (cancelled) return;
      setStats(aggregateLocal(results, responses));
      setSource("local");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleReset() {
    if (!confirm("Delete the quiz data stored in this browser?")) return;
    clearAll();
    const [responses, results] = await Promise.all([
      fetchResponses(),
      fetchResults(),
    ]);
    setStats(aggregateLocal(results, responses));
  }

  if (source === "loading") {
    return <p className="stats-empty">Loading…</p>;
  }

  const isShared = source === "shared";
  const top = stats.types[0];
  const topDesc = top ? typeDescriptions[top.code] : null;

  return (
    <div>
      <div className="result-section-head">
        <span className="eyebrow">{isShared ? "Everyone so far" : "This browser only"}</span>
        {!isShared && (
          <button type="button" className="btn btn-quiet" onClick={handleReset}>
            Clear data
          </button>
        )}
      </div>

      {!isShared && (
        <p className="stats-banner">
          {isRemoteConfigured
            ? "Shared totals are unavailable right now, so these are just your own runs."
            : "No shared backend is configured yet, so these are just your own runs on this browser. See supabase/schema.sql to turn on global totals."}
        </p>
      )}

      {stats.total === 0 ? (
        <p className="stats-empty">
          Nobody has finished the quiz yet. Take it and you'll be the first.
        </p>
      ) : (
        <>
          {/* --- Headline numbers ------------------------------------------ */}
          <div className="stats-figures">
            <div className="intro-meta-item">
              <span className="eyebrow">{isShared ? "People" : "Runs"}</span>
              <span className="stats-figure-value">{nf.format(stats.total)}</span>
            </div>
            {topDesc && (
              <div className="intro-meta-item">
                <span className="eyebrow">Most common</span>
                <span className="stats-figure-value stats-figure-name">
                  {topDesc.label}
                </span>
                <span className="stats-figure-sub">
                  {percent(top.n, stats.total)}% · {nf.format(top.n)}
                </span>
              </div>
            )}
            {(stats.humans > 0 || stats.ais > 0) && (
              <div className="intro-meta-item">
                <span className="eyebrow">Human / AI</span>
                <span className="stats-figure-value">
                  {nf.format(stats.humans)} / {nf.format(stats.ais)}
                </span>
              </div>
            )}
          </div>

          {/* --- Where everyone falls -------------------------------------- */}
          <div className="result-section-head">
            <span className="eyebrow">Where everyone falls</span>
            <span className="eyebrow">Average, 0 – 100</span>
          </div>
          <div className="meters">
            {AXES.map((axis) => (
              <AxisMeter
                key={axis.key}
                label={axis.label}
                score={stats.axes[axis.key]}
                leftLabel={axis.left}
                rightLabel={axis.right}
              />
            ))}
          </div>

          <hr className="rule" />

          {/* --- Leaderboard ---------------------------------------------- */}
          <div className="result-section-head">
            <span className="eyebrow">Most popular archetypes</span>
            <span className="eyebrow">Share</span>
          </div>
          <ol className="stats-board">
            {stats.types.map(({ code, n }, i) => {
              const desc = typeDescriptions[code];
              const pct = percent(n, stats.total);
              return (
                <li key={code} className="stats-board-row">
                  <span className="stats-board-rank">{i + 1}</span>
                  <span className="stats-board-name">
                    {desc ? desc.label : code}
                    <span className="stats-board-code">{code}</span>
                  </span>
                  <span className="stats-board-track">
                    <span
                      className="stats-board-fill"
                      style={{ width: `${Math.max(pct, 1)}%` }}
                    />
                  </span>
                  <span className="stats-board-value">
                    {pct}%
                    <span className="stats-board-count">{nf.format(n)}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          {stats.types.length < 16 && (
            <p className="result-disclaimer">
              {16 - stats.types.length} of the sixteen archetypes have not come
              up yet.
            </p>
          )}

          {/* --- Per question --------------------------------------------- */}
          {stats.questions.length > 0 && (
            <>
              <hr className="rule" />
              <div className="result-section-head">
                <span className="eyebrow">Answer spread by question</span>
              </div>
              <div>
                {allQuestions.map((q) => {
                  const d = stats.questions.find((x) => x.question_id === q.id);
                  if (!d || !d.n) return null;
                  const buckets = [
                    ["-2", d.m2],
                    ["-1", d.m1],
                    ["0", d.z],
                    ["1", d.p1],
                    ["2", d.p2],
                  ];
                  const max = Math.max(...buckets.map(([, v]) => v || 0), 1);
                  return (
                    <div key={q.id} className="stats-q">
                      <span className="eyebrow">
                        {q.id} · {q.axis}
                      </span>
                      <p className="stats-q-text">{q.text}</p>
                      <div className="stats-q-meta">
                        <span>
                          {nf.format(d.n)} {d.n === 1 ? "answer" : "answers"}
                        </span>
                        <span>avg {Number(d.avg).toFixed(2)}</span>
                      </div>
                      <div className="stats-dist">
                        {buckets.map(([label, v]) => (
                          <div key={label} className="stats-dist-col">
                            <div
                              className="stats-dist-bar"
                              style={{ height: `${((v || 0) / max) * 100}%` }}
                            />
                            <span className="stats-dist-label">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
