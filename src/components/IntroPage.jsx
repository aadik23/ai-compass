export default function IntroPage({ onStart }) {
  return (
    <div className="intro">
      <h1 className="intro-headline">What do you believe about AI?</h1>

      <p className="intro-deck">
        The argument about AI is loud, fast, and split into camps that mostly
        talk past each other. Fifteen questions will show you where your own
        views sit — and point you to the thinkers and communities already
        working through them.
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
          <span className="eyebrow">Reading list</span>
          <span className="intro-meta-value">Every result</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        Start the quiz
      </button>

      <p className="intro-note">
        No right answers and no score. However your views land, you get people
        worth reading and places worth following — a way into the conversation
        rather than a verdict on it.
      </p>
    </div>
  );
}
