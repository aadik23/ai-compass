import { useState, useCallback, useRef, useEffect } from "react";
import {
  initializeQuiz,
  recordResponse,
  processQuestionComplete,
  undoLastResponse,
} from "../logic/quizState";
import { generateTypeCode, scoresFromAxes } from "../logic/archetype";
import { logResponse, logResult } from "../storage";
import Question from "./Question";
import ProgressBar from "./ProgressBar";
import Results from "./Results";
import IntroPage from "./IntroPage";
import IdentityQuestion from "./IdentityQuestion";

export default function Quiz() {
  const [started, setStarted] = useState(false);
  const [isHuman, setIsHuman] = useState(null);
  const [state, setState] = useState(initializeQuiz);
  const resultLogged = useRef(false);

  const handleIdentityAnswer = useCallback((human) => {
    setIsHuman(human);
  }, []);

  const handleAnswer = useCallback(
    (score) => {
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const currentQ = next.questionSequence[next.currentQuestionIndex];

        logResponse(currentQ.id, score, isHuman);

        recordResponse(next, currentQ.id, score);
        processQuestionComplete(next);
        return next;
      });
    },
    [isHuman]
  );

  const handleBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex === 0) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      undoLastResponse(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (state.isComplete && !resultLogged.current) {
      resultLogged.current = true;
      const scores = scoresFromAxes(state.axes);
      logResult(
        generateTypeCode(state.axes),
        {
          timeline: Math.round(scores.timeline),
          novelty: Math.round(scores.novelty),
          outcome: Math.round(scores.outcome),
          control: Math.round(scores.control),
        },
        isHuman
      );
    }
  }, [state.isComplete, state.axes, isHuman]);

  const handleRestart = useCallback(() => {
    resultLogged.current = false;
    setIsHuman(null);
    setStarted(false);
    setState(initializeQuiz());
    window.scrollTo({ top: 0 });
  }, []);

  if (!started) {
    return <IntroPage onStart={() => setStarted(true)} />;
  }

  if (isHuman === null) {
    return <IdentityQuestion onAnswer={handleIdentityAnswer} />;
  }

  if (state.isComplete) {
    return (
      <Results
        code={generateTypeCode(state.axes)}
        scores={scoresFromAxes(state.axes)}
        onRestart={handleRestart}
      />
    );
  }

  const currentQuestion = state.questionSequence[state.currentQuestionIndex];

  return (
    <div className="quiz">
      <ProgressBar current={state.currentQuestionIndex + 1} total={15} />
      <Question
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswer={handleAnswer}
      />
      <div className="quiz-footer">
        {state.currentQuestionIndex > 0 ? (
          <button type="button" className="btn btn-quiet" onClick={handleBack}>
            ← Back
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
