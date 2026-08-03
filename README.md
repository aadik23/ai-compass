# AI Compass

A two-minute quiz that maps what you believe about AI onto four axes, then
hands you a shareable archetype — whatever your views.

Forked from [justincurl/ai-quiz](https://github.com/justincurl/ai-quiz) (which
shipped as "GUFO"). The quiz itself is unchanged; this is a naming and
aesthetics pass, plus a local-only storage layer.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
```

```bash
npm run build          # production build + per-archetype OG pages
npm run preview        # serve the build
npm run lint
npm run verify         # design-rule checks (see below)
node scripts/screenshots.mjs http://localhost:4173   # browser walkthrough
```

### Deploying

Two environment variables matter at build time:

```bash
# Root of a domain:
VITE_SITE_URL=https://aicompass.example npm run build

# GitHub Pages project site (served from /repo-name/):
VITE_BASE=/ai-compass/ VITE_SITE_URL=https://you.github.io npm run build
```

`VITE_SITE_URL` is required for link previews — `og:image` has to be an
absolute URL. The build warns if it's unset.

## What changed from upstream

**Storage.** Upstream logged every answer to the author's own hosted Supabase
project (URL and key committed in the repo). `src/storage.js` keeps the same
function signatures but writes to `localStorage`, so this runs with no keys, no
network calls, and no writes into someone else's database. Stats live at
`#/stats` with a "Clear data" button.

**Name and identity.** "GUFO" is retired from all user-facing copy. The
four-letter code survives as the per-result token — and for The Builder that
code still happens to be G-U-F-O.

**Look.** Rebuilt as clean editorial: Source Serif 4 for display, Inter for UI
and data, near-monochrome on `#FBFAF8`, Wordle green and yellow as the only
accents, hairline rules, no shadows, no border radius, no per-axis colours.

**Archetype reveal.** Nothing before the results screen names, codes, or hints
at an archetype, so the label can't bias the answers. Enforced by a test.

**Sharing.** Typographic share card, pre-filled X / LinkedIn / Bluesky links,
native share sheet where available, and results encoded in the URL.

### Unchanged, deliberately

The four axes and their poles, the questions, the scoring, the adaptive
question selection, and all sixteen archetype definitions. `npm run verify`
asserts the engine still produces exactly 15 questions per run.

## How it fits together

```
src/
  data/questions.js          question bank, tagged by axis        (untouched)
  data/typeDescriptions.js   the 16 archetypes                    (untouched)
  logic/quizState.js         15-question state machine            (untouched)
  logic/adaptiveSelection.js picks the next question              (untouched)
  logic/scoring.js           answers -> axis values -> code       (untouched)
  logic/axes.js              the four axes in standard order
  logic/archetype.js         code -> archetype lookup
  logic/resultUrl.js         result state <-> URL, routing
  logic/cardLayout.js        share card as a list of draw ops
  logic/shareCard.js         executes that list onto a <canvas>
  logic/shareText.js         the share copy template
scripts/
  generate-og.mjs            executes the same list into SVG -> PNG
  verify.mjs                 design-rule checks, no browser needed
  screenshots.mjs            full walkthrough in real Chromium
```

The share card is defined once, in `cardLayout.js`, as engine-agnostic draw
operations. The browser paints them on a canvas; the build rasterises them
through resvg with the font files in `build-assets/fonts`. Neither renderer
owns any geometry, so the runtime card and the static OG image can't drift.

### The four axes

Standard display order everywhere — card, results, share text:

| Axis | Left | Right |
|---|---|---|
| Outcome | Bad | Good |
| Novelty | Analogous | Unprecedented |
| Timeline | Slow | Fast |
| Control | Inevitable | Open |

Uppercase means a strong lean, lowercase a weak one. The displayed code is
uppercased to match the sixteen archetypes.

### Link previews without a backend

Static hosting can't render a preview image per result. The archetype set is
finite, so the build writes 16 pages at `/a/{CODE}/`, each with its own
hard-coded OG image at `/og/{CODE}.png`. Share links point there and carry the
exact scores in `?s=48-75-63-33`, which the app reads on load. Crawlers get a
correct preview; the person opening the link gets the exact result.

## Notes on the palette

Wordle green `#6aaa64` is 2.7:1 on the paper background, and yellow `#c9b458`
is worse — both fall under the contrast floor as text. So:

- Green stays exactly as specified for **fills and markers**, where a near-black
  marker and a numeric readout carry the same information. Green is never the
  only thing encoding a value.
- Text that needs to read as green (active pole labels) uses `--green-ink`
  `#4a7a45`, at 4.8:1.
- Yellow appears only as a **badge background** behind near-black text (8.4:1).
- Axis scales use `--chart-line` `#8f8b86` (3.2:1) rather than the faint
  decorative `--rule`, which is reserved for section dividers.

`npm run verify` asserts every one of these ratios.

## Deferred

"Compare to others" / result distribution across all takers. It needs a
backend (serverless function plus a store); the local `#/stats` page only ever
shows your own runs.
