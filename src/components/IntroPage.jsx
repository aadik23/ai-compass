export default function IntroPage({ onStart }) {
  return (
    <div className="intro">
      <h1 className="intro-headline">What do you believe about AI?</h1>

      <p className="intro-deck">
        Fifteen questions, about two minutes. Your answers are mapped onto four
        axes — how AI turns out, how new it is, how fast it arrives, and how
        much of it is still up to us.
      </p>

      <div className="intro-meta">
        <div className="intro-meta-item">
          <span className="eyebrow">Questions</span>
          <span className="intro-meta-value">15</span>
        </div>
        <div className="intro-meta-item">
          <span className="eyebrow">Time</span>
          <span className="intro-meta-value">~2 min</span>
        </div>
        <div className="intro-meta-item">
          <span className="eyebrow">Axes</span>
          <span className="intro-meta-value">4</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        Start the quiz
      </button>

      <p className="intro-note">
        There is no right answer and no scored total. Every combination of views
        lands somewhere on the compass.
      </p>
    </div>
  );
}
