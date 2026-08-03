export function calculateConfidence(axis) {
  if (axis.questionsAsked === 0) return 0;

  const distanceFromCenter = Math.abs(axis.normalizedScore - 50) / 50;

  const scores = axis.responses.map((r) => r.score);
  const avgMagnitude =
    scores.reduce((sum, s) => sum + Math.abs(s), 0) / scores.length;
  const consistency = avgMagnitude / 2;

  const hasStrong = scores.some((s) => Math.abs(s) === 2);
  const hasMixed = scores.some((s) => s > 0) && scores.some((s) => s < 0);
  const contradictionPenalty = hasStrong && hasMixed ? 0.2 : 0;

  return Math.max(
    0,
    distanceFromCenter * 0.5 + consistency * 0.5 - contradictionPenalty
  );
}

const letterForScore = (score, highLetter, lowLetter) => {
  if (score >= 60) return highLetter;
  if (score <= 40) return lowLetter;
  if (score >= 50) return highLetter.toLowerCase();
  return lowLetter.toLowerCase();
};

export function generateTypeCode(axes) {
  return [
    letterForScore(axes.outcome.normalizedScore, "G", "B"),
    letterForScore(axes.novelty.normalizedScore, "U", "A"),
    letterForScore(axes.timeline.normalizedScore, "F", "S"),
    letterForScore(axes.control.normalizedScore, "O", "I"),
  ].join("");
}

// Reconstruct a GUFO-ordered type code from the stored scores object
// {timeline: N, novelty: N, outcome: N, control: N}
// This is order-independent, so it works for both old (FUGO) and new (GUFO) results.
export function typeCodeFromScores(scores) {
  return [
    letterForScore(scores.outcome, "G", "B"),
    letterForScore(scores.novelty, "U", "A"),
    letterForScore(scores.timeline, "F", "S"),
    letterForScore(scores.control, "O", "I"),
  ].join("");
}
