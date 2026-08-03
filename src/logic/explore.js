/**
 * Turns a thinker or community name into somewhere you can actually go.
 *
 * These are deliberately searches rather than hardcoded links: the archetype
 * data names ~60 people and groups, and inventing a canonical URL for each
 * would mean a lot of guesses that rot. A search always resolves, and it lands
 * on the current conversation rather than one frozen homepage.
 */
export function exploreUrl(name, kind) {
  const query = kind === "community" ? `${name} AI` : `${name} AI views`;
  return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
}
