import { useState } from "react";
import { typeDescriptions } from "../data/typeDescriptions";
import { lowerFirst } from "../logic/cardLayout";
import { exploreUrl } from "../logic/explore";

const typeKeys = Object.keys(typeDescriptions);

/** Only ever rendered on the results screen. */
export default function Archetypes({ currentCode }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const current = currentCode.toUpperCase();

  return (
    <div className="archetypes">
      <div className="result-section-head">
        <span className="eyebrow">All sixteen</span>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open && (
        <div className="archetypes-list">
          {typeKeys.map((code) => {
            const t = typeDescriptions[code];
            const isCurrent = code === current;
            const isExpanded = expanded === code;

            return (
              <div key={code}>
                <button
                  type="button"
                  className={`archetype-row${isCurrent ? " is-current" : ""}`}
                  onClick={() => setExpanded(isExpanded ? null : code)}
                  aria-expanded={isExpanded}
                >
                  <span className="archetype-row-code">{code}</span>
                  <span className="archetype-row-name">{t.label}</span>
                  {isCurrent && <span className="archetype-row-you">You</span>}
                </button>

                {isExpanded && (
                  <div className="archetype-detail">
                    <p className="archetype-detail-tagline">
                      {lowerFirst(t.tagline)}.
                    </p>
                    <p>{t.description}</p>

                    {t.thinkers.length > 0 && (
                      <div className="result-list" style={{ marginTop: "1.25rem" }}>
                        <span className="eyebrow">Thinkers</span>
                        <ul>
                          {t.thinkers.map((x) => (
                            <li key={x}>
                              <a
                                href={exploreUrl(x, "thinker")}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {x}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {t.communities.length > 0 && (
                      <div className="result-list" style={{ marginTop: "1.25rem" }}>
                        <span className="eyebrow">Communities</span>
                        <ul>
                          {t.communities.map((x) => (
                            <li key={x}>
                              <a
                                href={exploreUrl(x, "community")}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {x}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
