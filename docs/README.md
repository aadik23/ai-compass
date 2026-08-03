# Documentation

| Document | What it covers |
|---|---|
| [../README.md](../README.md) | Engineering: how to run it, what changed from upstream, architecture, deploy |
| [GO-TO-MARKET-CONTEXT.md](GO-TO-MARKET-CONTEXT.md) | Product positioning, feature inventory, distribution channels, metrics, risks |
| [ARCHETYPES.md](ARCHETYPES.md) | All sixteen archetypes — codes, titles, taglines, descriptions, thinkers, communities |
| [DESIGN.md](DESIGN.md) | The design system: type, palette, contrast decisions, the axis meter spec |
| [github-actions-deploy.yml.example](github-actions-deploy.yml.example) | CI deploy workflow, if you'd rather not use `npm run deploy` |

## Regenerating

`ARCHETYPES.md` is generated from the quiz data — never hand-edit it:

```bash
npm run docs:archetypes
```

Everything else is written by hand.

## Where the source of truth lives

| Thing | File |
|---|---|
| The four axes and their order | `src/logic/axes.js` |
| Questions and answer options | `src/data/questions.js` |
| Archetype names, taglines, descriptions | `src/data/typeDescriptions.js` |
| Scoring and the four-letter code | `src/logic/scoring.js` |
| Share card geometry and palette | `src/logic/cardLayout.js` |
| Share copy template | `src/logic/shareText.js` |
| Colours, type scale, spacing | `src/styles/app.css` |
| Shared stats schema | `supabase/schema.sql` |
