import { typeDescriptions } from "../data/typeDescriptions";
import { generateTypeCode, typeCodeFromScores } from "./scoring";

/**
 * Archetype lookup. The mapping itself is unchanged from the original quiz:
 * uppercase the four-letter code to land on the nearest archetype.
 */
export function describeCode(code) {
  const key = code.toUpperCase();
  if (typeDescriptions[key]) return typeDescriptions[key];

  return {
    label: "The Uncertain",
    tagline: "Mixed or uncertain views",
    description: "This set of answers doesn't fit neatly into common categories.",
    thinkers: [],
    communities: [],
  };
}

export function describeAxes(axes) {
  return describeCode(generateTypeCode(axes));
}

export function scoresFromAxes(axes) {
  return {
    outcome: axes.outcome.normalizedScore,
    novelty: axes.novelty.normalizedScore,
    timeline: axes.timeline.normalizedScore,
    control: axes.control.normalizedScore,
  };
}

export { generateTypeCode, typeCodeFromScores };
