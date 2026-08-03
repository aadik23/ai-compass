import { getQuestionsForAxis } from "../data/questions";

export function selectNextAdaptiveQuestions(state, count) {
  const axisRankings = Object.values(state.axes)
    .map((a) => ({ axis: a.axis, confidence: a.confidence, asked: a.questionsAsked }))
    .sort((a, b) => a.confidence - b.confidence);

  // Track ALL question IDs already in the sequence (answered or queued)
  const usedIds = new Set(state.questionSequence.map((q) => q.id));
  const selectedQuestions = [];

  for (let i = 0; i < count; i++) {
    let picked = null;

    // Try each axis in priority order until we find an available question
    for (let j = 0; j < axisRankings.length; j++) {
      const targetAxis = axisRankings[(i + j) % axisRankings.length].axis;
      const question = selectUnaskedQuestion(targetAxis, usedIds);
      if (question) {
        picked = question;
        usedIds.add(question.id);
        const ranking = axisRankings.find((a) => a.axis === targetAxis);
        ranking.asked += 1;
        axisRankings.sort((a, b) => {
          if (Math.abs(a.confidence - b.confidence) < 0.1) {
            return a.asked - b.asked;
          }
          return a.confidence - b.confidence;
        });
        break;
      }
    }

    if (picked) {
      selectedQuestions.push(picked);
    }
  }

  return selectedQuestions;
}

function selectUnaskedQuestion(axis, usedIds) {
  const allQuestions = getQuestionsForAxis(axis);

  const available = allQuestions
    .filter((q) => !usedIds.has(q.id))
    .sort((a, b) => b.weight - a.weight);

  // In adaptive phase, prefer weight 2, then weight 1, then anything left
  return (
    available.find((q) => q.weight === 2) ||
    available.find((q) => q.weight === 1) ||
    available[0] ||
    null
  );
}
