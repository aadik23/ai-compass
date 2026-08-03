import { useEffect, useRef } from "react";
import AxisMeter from "./AxisMeter";
import { AXES } from "../logic/axes";
import Share from "./Share";
import Archetypes from "./Archetypes";
import { describeCode } from "../logic/archetype";
import { lowerFirst } from "../logic/cardLayout";
import { exploreUrl } from "../logic/explore";

/**
 * The archetype's first and only appearance. Nothing above this screen names
 * it, codes it, or hints at it.
 */
export default function Results({ code, scores, onRestart, shared, canonical }) {
  const desc = describeCode(code);
  const headingRef = useRef(null);

  // Move focus to the reveal so keyboard and screen-reader users land on it.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="results">
      {shared && (
        <p className="shared-banner">
          {canonical
            ? "You're looking at one of the sixteen archetypes on AI Compass."
            : "You're looking at a result someone shared. Take the quiz to find your own."}
        </p>
      )}

      <p className="eyebrow result-eyebrow">Your archetype</p>

      <h1 className="result-name" tabIndex={-1} ref={headingRef}>
        {desc.label}
      </h1>

      <div>
        <span className="result-code">{code.toUpperCase()}</span>
      </div>

      <p className="result-tagline">{lowerFirst(desc.tagline)}.</p>

      <hr className="rule" />

      <div className="result-section-head">
        <span className="eyebrow">Where you land</span>
        <span className="eyebrow">0 – 100</span>
      </div>

      <div className="meters animate">
        {AXES.map((axis, i) => (
          <AxisMeter
            key={axis.key}
            label={axis.label}
            score={scores[axis.key]}
            leftLabel={axis.left}
            rightLabel={axis.right}
            animate
            delay={0.35 + i * 0.12}
          />
        ))}
      </div>

      <hr className="rule" />

      <div className="result-section-head">
        <span className="eyebrow">The read</span>
      </div>
      <div className="result-prose">
        <p>{desc.description}</p>
      </div>

      {(desc.thinkers.length > 0 || desc.communities.length > 0) && (
        <>
          <hr className="rule" />
          <div className="result-section-head">
            <span className="eyebrow">Where to go next</span>
          </div>
          <p className="result-deck">
            Starting points, not endorsements. These are the people and groups
            whose thinking lands nearest yours — the fastest way in is to go
            read the ones you haven't heard of.
          </p>

          <div className="result-lists">
            {desc.thinkers.length > 0 && (
              <div className="result-list">
                <span className="eyebrow">Thinkers</span>
                <ul>
                  {desc.thinkers.map((t) => (
                    <li key={t}>
                      <a
                        href={exploreUrl(t, "thinker")}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {desc.communities.length > 0 && (
              <div className="result-list">
                <span className="eyebrow">Communities</span>
                <ul>
                  {desc.communities.map((c) => (
                    <li key={c}>
                      <a
                        href={exploreUrl(c, "community")}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {c}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="result-disclaimer">
            These selections were made by Claude, and each link runs a search
            rather than pointing at one official page. They are
            oversimplifications that don't fully represent what those people and
            groups actually think — treat them as directions, not labels.
          </p>
        </>
      )}

      <hr className="rule" />

      <div className="result-section-head">
        <span className="eyebrow">Share</span>
      </div>
      <Share
        code={code}
        label={desc.label}
        tagline={desc.tagline}
        scores={scores}
      />

      <hr className="rule" />

      <div className="result-actions">
        <button type="button" className="btn" onClick={onRestart}>
          {shared ? "Take the quiz" : "Take it again"}
        </button>
      </div>

      <hr className="rule" />

      <Archetypes currentCode={code} />
    </div>
  );
}
