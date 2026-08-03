import { useState } from "react";

export default function IdentityQuestion({ onAnswer }) {
  const [selected, setSelected] = useState(null);

  function handleClick(value) {
    if (selected !== null) return;
    setSelected(value);
    setTimeout(() => onAnswer(value), 250);
  }

  return (
    <div className="quiz">
      <div className="question">
        <h2 className="question-text">Before we begin — are you a human or an AI?</h2>
        <div className="options">
          <button
            type="button"
            className={`option${selected === true ? " selected" : ""}`}
            onClick={() => handleClick(true)}
          >
            <span className="option-marker" aria-hidden="true" />
            <span>I'm a human</span>
          </button>
          <button
            type="button"
            className={`option${selected === false ? " selected" : ""}`}
            onClick={() => handleClick(false)}
          >
            <span className="option-marker" aria-hidden="true" />
            <span>I'm an AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
