# Design System

Clean editorial — the visual language of newspaper feature journalism and
Upshot-style data graphics. Six rules, then the specifics.

1. **Typography does the heavy lifting.** An editorial serif for display, a
   clean sans for UI and data labels.
2. **Near-monochrome, restrained accents.** White-ish ground, near-black text,
   greys between. Wordle green and yellow are the only colours.
3. **Hairline rules over boxes.** Thin dividers and whitespace for structure.
   No drop shadows, no heavy borders, no rounded corners.
4. **Generous whitespace and a real grid.** Wide margins, ~660px reading
   measure, consistent alignment.
5. **Upshot-grade data viz.** Clean scales, precise markers, small labels,
   numeric readouts. No gradients, glow, or 3D.
6. **Quiet, purposeful motion.** Subtle fades, one orchestrated reveal.
   No bounce. `prefers-reduced-motion` fully respected.

---

## Type

| Role | Face | Notes |
|---|---|---|
| Display, decks, prose | **Source Serif 4** | 600 for headlines, 700 for the archetype name, italic for taglines |
| UI, labels, data, eyebrows | **Inter** | 400–700 |

Body is 18px / 1.6 (17px below 560px). Headlines use `clamp()` so they scale
with the viewport. Eyebrows are 11px, 600 weight, uppercase, `0.14em` tracked.

Numbers that sit in columns use `font-variant-numeric: tabular-nums` so digits
don't jitter between rows.

---

## Colour

All tokens live in `:root` in `src/styles/app.css`.

| Token | Value | Used for |
|---|---|---|
| `--paper` | `#fbfaf8` | Page ground |
| `--ink` | `#1a1a1a` | Body text, markers, primary buttons |
| `--ink-secondary` | `#5a5a5a` | Decks, secondary prose |
| `--ink-tertiary` | `#6e6e6e` | Eyebrows, inactive pole labels, footnotes |
| `--rule` | `#e0dedb` | Section dividers (decorative) |
| `--rule-strong` | `#c4c1bd` | Button borders |
| `--chart-line` | `#8f8b86` | Axis baselines and ticks |
| `--green` | `#6aaa64` | Meter fills, progress, markers |
| `--green-ink` | `#4a7a45` | Green *text* (active pole labels) |
| `--yellow` | `#c9b458` | The archetype code badge, banner accents |

### Why there are two greens and a darker grey

The specified Wordle accents don't clear the contrast floor as text:

| Pair | Ratio | Verdict |
|---|---|---|
| `#6aaa64` on paper | 2.67:1 | Fails 4.5:1 for text |
| `#c9b458` on paper | ~2.0:1 | Worse |
| `#8a8a8a` on paper | 3.31:1 | Fails 4.5:1 — was the original tertiary grey |

Resolution, which keeps the palette intent and the accessibility floor:

- **Green stays exactly as specified for fills and markers.** It is never the
  sole carrier of information — a near-black marker sits at the same position
  and the numeric value is printed alongside. Removing all colour loses nothing.
- **Green as text** uses `--green-ink` (4.84:1).
- **Yellow only ever appears as a background** behind near-black text (8.41:1).
- **Tertiary grey** was darkened to `#6e6e6e` (4.89:1) because it carries real
  text.
- **Axis scales** use `--chart-line` (3.24:1), clearing the 3:1 non-text floor,
  while `--rule` stays faint for purely decorative dividers.

`npm run verify` asserts every one of these ratios, so a future palette tweak
that breaks contrast fails the build.

---

## The axis meter

The centrepiece. One axis reads:

```
OUTCOME                                              72
Bad   |————————————————┼————————▮—————————|   Good
```

- Hairline baseline in `--chart-line`, with end ticks at 0 and 100
- A taller centre tick at 50, so lean direction is readable at a glance
- A green span from centre to the reading — length encodes distance from neutral
- A 3px near-black marker at the exact value
- Axis name and numeric reading share the line above
- Pole labels flank the scale; the leaned-toward side goes green and 600 weight

**All four meters share one CSS grid.** Each `.meter` is `display: contents`, so
every part is placed on the parent `.meters` grid and the tracks start and end
at the same x across all four rows. Without this, differing pole-label widths
("Bad" vs "Inevitable") shift each track and the rows stop being comparable —
which defeats the point of a chart.

Below 560px the poles move above the scale on a two-column row, so long labels
never crush the track.

Each scale carries an `aria-label` giving the axis, the value, and both poles.

---

## Motion

| Moment | Treatment |
|---|---|
| Screen changes | 300–500ms fade, slight rise |
| Question changes | Fade up, keyed on question id |
| Result reveal | Staggered: eyebrow → name → badge → tagline → meters |
| Meter fills | `scaleX` sweep from the centre outward, staggered 0.12s apart |

Under `prefers-reduced-motion: reduce`, durations **and delays** are both zeroed.
Zeroing only duration would leave `animation-fill-mode: both` holding elements
at their invisible from-state through the delay, so reduced-motion users would
watch content pop in late — worse than no animation.

---

## Accessibility floor

- WCAG AA contrast on all text, asserted in `npm run verify`
- Visible focus ring on every interactive element (`:focus-visible`, 2px ink)
- The result heading is focused on reveal to move the reading cursor; its ring is
  suppressed since it isn't tab-reachable
- Charts carry text alternatives; decorative marks are `aria-hidden`
- Progress bar is a real `role="progressbar"` with min/now/max
- Reflows to a single column, no horizontal scroll at 320px

---

## Share card

1200×630, purely typographic — no emblem, no mascot.

Defined once in `src/logic/cardLayout.js` as engine-agnostic draw operations
(`rect` and `text` with explicit positions). Two renderers execute that list:

- `src/logic/shareCard.js` — paints onto a `<canvas>` at 2× for download and the
  native share sheet
- `scripts/generate-og.mjs` — emits SVG, rasterised through resvg with the font
  files in `build-assets/fonts`, for the 16 static OG images

Neither renderer owns geometry, so the runtime card and the static preview can't
drift. Text measurement is injected — canvas uses `measureText`, the build uses
fontkit — which lets the layout auto-shrink the archetype name to fit
("The Long-term Safety Advocate" overruns at the default 78px).
