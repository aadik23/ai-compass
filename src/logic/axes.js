/**
 * The four axes, in the standard display order used everywhere: results,
 * stats, share card, share text. Names and poles are unchanged from the
 * original quiz — only the ordering is standardised here.
 */
export const AXES = [
  { key: "outcome", label: "Outcome", left: "Bad", right: "Good" },
  { key: "novelty", label: "Novelty", left: "Analogous", right: "Unprecedented" },
  { key: "timeline", label: "Timeline", left: "Slow", right: "Fast" },
  { key: "control", label: "Control", left: "Inevitable", right: "Open" },
];

export const AXIS_KEYS = AXES.map((a) => a.key);
