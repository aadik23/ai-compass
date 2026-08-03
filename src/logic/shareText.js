import { lowerFirst } from "./cardLayout";

/**
 * Share copy, per the design doc: identity-forward, no axis readouts, no
 * emoji. The four scores live on the card image instead.
 *
 *   I'm The Builder on AI Compass — optimistic, unprecedented, fast, and
 *   ready to steer. What do you believe about AI? → [link]
 */
export function shareText(label, tagline, link) {
  const body = `I'm ${label} on AI Compass — ${lowerFirst(
    tagline
  )}. What do you believe about AI?`;
  return link ? `${body} → ${link}` : body;
}
