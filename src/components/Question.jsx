import { useState } from "react";

export default function Question({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  // Scoring and option order are unchanged from the original quiz.
  const options = [
    { score: 2, label: question.optionA },
    { score: 1, label: question.optionLeanA },
    { score: 0, label: question.optionNeutral },
    { score: -1, label: question.optionLeanB },
    { score: -2, label: question.optionB },
  ];

  function handleClick(score) {
    if (selected !== null) return;
    setSelected(score);
    setTimeout(() => {
      onAnswer(score);
      setSelected(null);
    }, 250);
  }

  return (
    <div className="question">
      {/* No axis label here — the person sees only the statement. */}
      <h2 className="question-text">{question.text}</h2>
      <div className="options">
        {options.map((opt) => (
          <button
            key={opt.score}
            type="button"
            className={`option${selected === opt.score ? " selected" : ""}`}
            onClick={() => handleClick(opt.score)}
          >
            <span className="option-marker" aria-hidden="true" />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
