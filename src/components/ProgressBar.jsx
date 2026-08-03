export default function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div className="progress">
      <div className="progress-meta">
        {/* Progress copy stays neutral — no hint of where the answers are heading. */}
        <span className="eyebrow">Question</span>
        <span className="eyebrow progress-count">
          {current} of {total}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Quiz progress"
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
