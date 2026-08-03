import { useState, useEffect, useCallback } from "react";
import Quiz from "./components/Quiz";
import Dashboard from "./components/Dashboard";
import Results from "./components/Results";
import { readRoute, BASE } from "./logic/resultUrl";
import "./styles/app.css";

export default function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onNav = () => setRoute(readRoute());
    window.addEventListener("hashchange", onNav);
    window.addEventListener("popstate", onNav);
    return () => {
      window.removeEventListener("hashchange", onNav);
      window.removeEventListener("popstate", onNav);
    };
  }, []);

  // Leaving a shared result for the quiz: clear the URL so the person's own
  // run doesn't sit under someone else's link.
  const goHome = useCallback((e) => {
    if (e) e.preventDefault();
    window.history.pushState({}, "", BASE);
    setRoute({ view: "quiz" });
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="app">
      <header className="masthead">
        <a href={BASE} onClick={goHome} style={{ textDecoration: "none" }}>
          <span className="wordmark">AI Compass</span>
        </a>
        <p className="masthead-tagline">What do you believe about AI?</p>
        <nav className="masthead-nav">
          <a
            href={BASE}
            onClick={goHome}
            className={route.view !== "stats" ? "active" : ""}
          >
            Quiz
          </a>
          <a href="#/stats" className={route.view === "stats" ? "active" : ""}>
            Stats
          </a>
        </nav>
      </header>

      <main>
        {route.view === "stats" && <Dashboard />}
        {route.view === "result" && (
          <Results
            code={route.code}
            scores={route.scores}
            shared
            canonical={route.canonical}
            onRestart={goHome}
          />
        )}
        {route.view === "quiz" && <Quiz />}
      </main>
    </div>
  );
}
