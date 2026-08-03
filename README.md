# AI Compass

A way into the AI conversation for anyone curious about it. Two minutes of
questions place your own views on four axes, then hand you a shareable
archetype and a short reading list — the thinkers and communities already
working through the same questions.

The point isn't the label. It's the on-ramp: most people encounter the AI
debate as noise from camps talking past each other, and this gives them a
foothold plus somewhere to go next.

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

**Somewhere to go next.** Every archetype's thinkers and communities are now
links, on the result and throughout the archetype index. They run a search
rather than pointing at one hardcoded homepage — see `src/logic/explore.js` for
why.

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

## Design

See [docs/DESIGN.md](docs/DESIGN.md) for the type scale, the full colour token
table, the axis-meter spec, and why there are two greens (the raw Wordle accents
fall below the contrast floor as text, so `--green-ink` carries green *text* while
`--green` stays exactly as specified for fills and markers).

## Shared stats

`#/stats` shows population totals — how many people have finished, the archetype
leaderboard with percentages, where everyone averages on each axis, and the
answer spread per question. Each completed quiz adds to those totals.

This needs a backend, since GitHub Pages can't store anything:

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Copy `.env.example` to `.env.local` and fill in the two values
4. Rebuild and deploy

Without it the page falls back to this browser's own runs and says so. The two
env values are public by design: the schema lets that key insert rows and call
one aggregate function, but **not** read individual submissions.

Still deferred: a "you vs the crowd" comparison view. The stats page is
population-only by choice.

## Documentation

| Document | What it covers |
|---|---|
| [docs/DESIGN.md](docs/DESIGN.md) | Type, palette, contrast decisions, axis-meter spec |
| [docs/ARCHETYPES.md](docs/ARCHETYPES.md) | All sixteen archetypes, generated from the data |
| [docs/GO-TO-MARKET-CONTEXT.md](docs/GO-TO-MARKET-CONTEXT.md) | Positioning, features, channels, metrics, risks |
| [docs/README.md](docs/README.md) | Index, plus where each source of truth lives |
