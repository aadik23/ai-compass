import { getQuestion } from "../data/questions";
import { calculateConfidence } from "./scoring";
import { selectNextAdaptiveQuestions } from "./adaptiveSelection";

function initAxis(axis) {
  return {
    axis,
    responses: [],
    rawScore: 0,
    maxPossible: 0,
    normalizedScore: 50,
    confidence: 0,
    questionsAsked: 0,
  };
}

export function initializeQuiz() {
  const seedingQuestions = [
    getQuestion("T1"),
    getQuestion("U1"),
    getQuestion("G1"),
    getQuestion("O1"),
    getQuestion("T2"),
    getQuestion("U2"),
    getQuestion("G2"),
    getQuestion("O2"),
  ];

  return {
    currentQuestionIndex: 0,
    phase: "seeding",
    axes: {
      timeline: initAxis("timeline"),
      novelty: initAxis("novelty"),
      outcome: initAxis("outcome"),
      control: initAxis("control"),
    },
    questionSequence: seedingQuestions,
    isComplete: false,
  };
}

export function recordResponse(state, questionId, score) {
  const question = getQuestion(questionId);
  const axis = state.axes[question.axis];

  axis.responses.push({
    questionId,
    score,
    weight: question.weight,
    axis: question.axis,
  });

  axis.rawScore += score * question.weight;
  axis.maxPossible += 2 * question.weight;
  axis.questionsAsked += 1;

  axis.normalizedScore = (axis.rawScore / axis.maxPossible + 1) * 50;
  axis.confidence = calculateConfidence(axis);

  return state;
}

export function undoLastResponse(state) {
  if (state.currentQuestionIndex === 0) return state;

  state.currentQuestionIndex -= 1;

  const currentQ = state.questionSequence[state.currentQuestionIndex];
  const question = getQuestion(currentQ.id);
  const axis = state.axes[question.axis];

  // Remove the last response for this axis
  const lastResponse = axis.responses.pop();
  axis.rawScore -= lastResponse.score * lastResponse.weight;
  axis.maxPossible -= 2 * lastResponse.weight;
  axis.questionsAsked -= 1;

  if (axis.maxPossible > 0) {
    axis.normalizedScore = (axis.rawScore / axis.maxPossible + 1) * 50;
    axis.confidence = calculateConfidence(axis);
  } else {
    axis.normalizedScore = 50;
    axis.confidence = 0;
  }

  // If we stepped back into seeding phase, revert phase
  if (state.currentQuestionIndex < 8) {
    state.phase = "seeding";
  }

  // Remove adaptive questions that were added at this boundary
  if (state.currentQuestionIndex === 7 && state.questionSequence.length > 8) {
    state.questionSequence.splice(8);
  }
  if (state.currentQuestionIndex === 9 && state.questionSequence.length > 10) {
    state.questionSequence.splice(10);
  }
  if (state.currentQuestionIndex === 11 && state.questionSequence.length > 12) {
    state.questionSequence.splice(12);
  }

  state.isComplete = false;

  return state;
}

export function processQuestionComplete(state) {
  state.currentQuestionIndex += 1;

  if (state.currentQuestionIndex === 8) {
    state.phase = "adaptive";
    const next = selectNextAdaptiveQuestions(state, 2);
    state.questionSequence.push(...next);
  }

  if (state.currentQuestionIndex === 10) {
    const next = selectNextAdaptiveQuestions(state, 2);
    state.questionSequence.push(...next);
  }

  if (state.currentQuestionIndex === 12) {
    const next = selectNextAdaptiveQuestions(state, 3);
    state.questionSequence.push(...next);
  }

  if (state.currentQuestionIndex === 15) {
    state.isComplete = true;
  }

  return state;
}
