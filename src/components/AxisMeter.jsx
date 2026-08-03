/**
 * One axis, drawn as a Times/Upshot-style scale: hairline baseline, end ticks,
 * a taller centre tick at 50, a green span from centre to the reading, and a
 * precise marker. No gradients, no glow.
 *
 * The element itself is `display: contents` — every meter's parts are placed
 * on the shared `.meters` grid so the tracks align across rows.
 */
export default function AxisMeter({
  label,
  score,
  leftLabel,
  rightLabel,
  animate = false,
  delay = 0,
}) {
  const value = Math.round(score);
  const leansRight = value > 50;
  const leansLeft = value < 50;

  const fillLeft = Math.min(50, value);
  const fillWidth = Math.abs(value - 50);

  return (
    <div className="meter">
      <div className="meter-head">
        <span className="eyebrow">{label}</span>
        <span className="meter-value">{value}</span>
      </div>

      <div className="meter-body">
        <span className={`meter-pole left${leansLeft ? " active" : ""}`}>
          {leftLabel}
        </span>

        <div
          className="meter-scale"
          role="img"
          aria-label={`${label}: ${value} out of 100, between ${leftLabel} and ${rightLabel}`}
        >
          <span className="meter-axis-line" />
          <span className="meter-scale-ends" style={{ left: 0 }} />
          <span className="meter-scale-ends" style={{ left: "100%" }} />
          <span className="meter-center" />
          <span
            className={`meter-fill${animate ? " animate" : ""}`}
            style={{
              left: `${fillLeft}%`,
              width: `${fillWidth}%`,
              "--fill-origin": leansRight ? "left" : "right",
              "--meter-delay": `${delay}s`,
            }}
          />
          <span
            className={`meter-marker${animate ? " animate" : ""}`}
            style={{ left: `${value}%`, "--meter-delay": `${delay}s` }}
          />
        </div>

        <span className={`meter-pole right${leansRight ? " active" : ""}`}>
          {rightLabel}
        </span>
      </div>
    </div>
  );
}
