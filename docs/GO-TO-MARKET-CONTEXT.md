# AI Compass — Product Context for Go-to-Market

Everything a GTM/distribution plan needs to know: what it is, why it exists,
what's actually built, how growth is meant to work, and what's unresolved.

**Status:** live at https://aadik23.github.io/ai-compass/ · repo
`aadik23/ai-compass` (public) · pre-launch, zero promotion so far.

---

## 0. Read this first: the blocker

**The quiz content is not yours, and it has no license.**

This project is a fork of [justincurl/ai-quiz](https://github.com/justincurl/ai-quiz).
Inherited essentially unchanged: all 40+ questions and answer options, the four
axes and their definitions, the scoring model, the adaptive question selection,
and all sixteen archetypes with their names, taglines, descriptions, thinker
lists, and community lists. That is the entire substance of the product.

What this fork added: the name, the visual identity, the reveal timing, the
sharing system, and the stats backend.

The upstream repo has **no LICENSE file**. Under default copyright that means
all rights reserved — GitHub's terms let you view and fork within GitHub, but
they do not grant redistribution, modification-and-republication, or commercial
use. Publishing this under a new brand and actively driving traffic to it is
exactly what that doesn't cover.

**Resolve before any launch push.** Options, roughly in order of preference:

1. **Ask Justin Curl to collaborate or co-launch.** Cheapest and best outcome —
   you bring design, distribution, and infrastructure to work he's already done.
   The repo is 0 stars and was created 2026-01-30, so it's unlaunched; a joint
   launch is plausibly attractive to him.
2. **Get explicit written permission** plus an agreed license (MIT/CC-BY) and
   visible attribution.
3. **Replace the content.** Write your own questions and archetypes against the
   same four-axis idea. Axis *concepts* are far harder to protect than the
   specific text. This is real work — call it a week — but it makes the product
   unambiguously yours.
4. **Keep it unlisted.** Personal/portfolio use, no promotion. No GTM needed.

Everything below assumes one of 1–3 is settled. Distributing at scale without
that is the main risk to the whole plan, and it gets worse the more successful
the launch is.

---

## 1. What it is

**One-liner:** A two-minute quiz that maps what you believe about AI onto four
axes, then hands you a shareable archetype and a reading list.

**Positioning:** an on-ramp into the AI conversation, not a personality test.
Most people meet the AI debate as noise — loud camps talking past each other,
heavy jargon, no obvious entry point. This gives them three things in two
minutes: a vocabulary for their own position, a name for it they can say out
loud, and specific people and communities to go read next.

**What it is not:** not a knowledge test, not a scored assessment, not a
prediction market, not a judgement. There is no right answer and no total. Every
combination of views lands somewhere legitimate — including the sceptical,
pessimistic, and "this is all overblown" corners.

---

## 2. The problem it solves

| Who | Their problem today |
|---|---|
| The curious newcomer | Wants to follow the AI debate, doesn't know the camps, can't tell who to trust, bounces off 8,000-word essays |
| The lurker with opinions | Has views but no vocabulary; can't articulate where they sit or find people who agree |
| The person inside the debate | Can articulate their own position fine, but wants to see the shape of the whole space, or hand something to friends and family who ask "so what do you actually think?" |
| Educators / community organisers | Need a low-friction discussion starter for a class, reading group, or team offsite |

The insight the product is built on: **people will do a quiz about themselves
long before they'll read an explainer.** Identity is the delivery mechanism; the
reading list is the actual payload.

---

## 3. How it works

1. **Intro.** Framing plus the cost of entry (15 questions, ~2 min).
2. **One screening question:** human or AI? (Genuinely useful — see §7.)
3. **Fifteen questions.** Five-point answers, worded as positions rather than
   agree/disagree scales. Eight fixed seeding questions, then seven chosen
   adaptively to probe whichever axis the answers are least clear on.
4. **The reveal.** Archetype name, four-letter code, tagline, four axis meters
   with numeric positions, a paragraph on what the position implies.
5. **Where to go next.** Thinkers and communities whose views land nearest,
   every one a link out.
6. **Share.** Copy, one-tap posts, downloadable card.
7. **Explore.** All sixteen archetypes, with yours marked.

### The four axes

| Axis | Left pole | Right pole |
|---|---|---|
| Outcome | Bad | Good |
| Novelty | Analogous | Unprecedented |
| Timeline | Slow | Fast |
| Control | Inevitable | Open |

Sixteen archetypes, one per corner: The Builder, The Accelerationist, The Safety
Researcher, The Doomer, The Pragmatic Optimist, The Fatalist Realist, The Policy
Advocate, The Comfortable Observer, The Patient Architect, The Relaxed Visionary,
The Long-term Safety Advocate, The Distant Doomer, The Incrementalist, The Calm
Skeptic, The Skeptical Critic, The Quiet Pessimist.

The **Control** axis is the interesting differentiator. Most AI-position framings
are one-dimensional (accelerate ↔ doom). Separating "will it be good?" from "can
we steer it?" is what distinguishes a Safety Researcher from a Doomer — same
worry, different sense of agency. That distinction is the product's best claim
to being more than a BuzzFeed quiz, and it should lead the pitch.

---

## 4. Feature inventory

### Built and live

- **Adaptive 15-question quiz** — spends its questions where you're ambiguous
- **Back button** — correctly unwinds scores, not just navigation
- **Bias-free reveal** — no archetype name, code, or tagline appears anywhere
  before the results screen, and no axis labels during the quiz, so the labels
  can't steer answers. Enforced by an automated test.
- **Four axis meters** — NYT/Upshot-style: hairline scales, centre tick, precise
  marker, numeric readout, all four sharing one grid so rows are comparable
- **Archetype reveal** — name, four-letter code on a yellow badge, tagline,
  full description
- **Where to go next** — thinkers and communities as outbound links
- **All sixteen archetypes** — browsable index with yours marked
- **Share card** — 1200×630 PNG generated in-browser with your actual scores;
  download or native share sheet
- **One-tap posting** — X, LinkedIn, Bluesky, pre-filled
- **Result-encoded URLs** — `/a/GUFO/?s=72-64-55-48` reopens an exact result
- **Correct link previews** — 16 pre-generated static pages, each with its own
  OG image, so a shared link unfurls as that archetype rather than a generic card
- **Shared stats page** — total takers, most common archetype, full leaderboard
  with percentages, population average on each axis, answer spread per question
- **Local fallback** — with no backend configured, stats show your own runs
- **Accessible** — WCAG AA contrast (asserted in tests), visible focus states,
  `prefers-reduced-motion` respected, screen-reader labels on every chart
- **Responsive** — single-column reflow, meter poles restack on narrow screens

### Deliberately absent

- No accounts, no login, no email capture
- No cookies, no third-party analytics, no tracking pixels
- No "compare yourself to others" view (population-only by choice)
- No paid tier, no monetisation of any kind

### Infrastructure

Static React/Vite on GitHub Pages, free. Optional Supabase free tier for shared
totals; the browser can insert rows and read aggregates but cannot read anyone's
individual submission. Marginal cost per visitor is effectively zero, so a viral
spike costs nothing — a real advantage over anything server-rendered.

---

## 5. Distribution

### Built-in growth mechanics

The share loop is the product's only growth engine, and it's fully built:

1. Finishing the quiz produces an identity statement — *"I'm The Doomer"* — that
   people want to say publicly.
2. The share text is identity-forward, no scores, no spoilers:
   `I'm The Builder on AI Compass — optimistic, unprecedented, fast, and ready to steer. What do you believe about AI? → [link]`
3. The link unfurls with that archetype's own preview card.
4. The card is typographic and screenshot-friendly.
5. The landing page asks a question rather than making a claim, so the natural
   response is to take it.

**The share rate is the metric that decides whether this works.** Everything
else is secondary.

### Channels, best-fit first

**1. AI-adjacent social.** X and Bluesky are where the archetypes are already
argued about daily. Highest-leverage play: get people *inside* the debate to post
their result. A recognised safety researcher posting "apparently I'm The Patient
Architect" does more than any amount of paid reach. The sixteen names are
deliberately recognisable as real camps, which is what makes this land.

**2. Reddit.** r/artificial, r/singularity, r/ControlProblem, r/slatestarcodex,
r/MachineLearning. Genuinely useful and free, so it can survive these subs — but
read each one's self-promotion rules, and lead with the stats page (a data
artifact) rather than "check out my quiz."

**3. Hacker News.** Plausible front page: quiz + clean data viz + no signup +
open source. Best framing is the *method* — "I built a four-axis map of AI
positions" — not "take my quiz." Expect the top comment to attack the question
wording; have a real answer ready. **Do not post until §0 is resolved** — HN
will find the fork, and that becomes the story.

**4. Newsletters.** Import AI, AI Snake Oil, Zvi's substack, Platformer. The
reading-list feature makes this mutually useful: their audience gets pointed
back at people like them.

**5. Classrooms and reading groups.** Highest-quality use, lowest virality. An
instructor putting this in front of 200 students each term is worth more than a
one-day traffic spike. Needs an educator-facing page: how to use it in a
seminar, how to read the distribution.

**6. Podcasts / YouTube.** Hosts taking it live is good content. Longer lead
time, needs a person to pitch it.

### The stats page is an underrated asset

Once there's real volume, "where 10,000 people actually land on AI" is a
publishable finding — a chart with news value, independent of the quiz. That's
a second, more durable distribution surface than the share loop, and it gets
better as the dataset grows. Worth planning a write-up at 1k and 10k takers.

### Launch sequencing

1. Resolve §0.
2. Configure Supabase so the counter is live from the first visitor. Launching
   without it wastes the data from the best traffic day.
3. Soft launch to 20–50 people. Watch completion rate and read the free-text
   reactions. Fix question wording that confuses people.
4. Seed with recognisable names in the space.
5. Reddit and newsletters.
6. HN once the above is holding up.
7. At 1k takers, publish the distribution.

---

## 6. Differentiation

| Comparable | How this differs |
|---|---|
| Political compass quizzes | Same mechanic, applied to a live debate with genuine expert disagreement rather than settled political axes |
| BuzzFeed-style quizzes | Real construct behind it (four defensible axes, adaptive selection), and it points outward to sources instead of dead-ending |
| MBTI / personality tests | Beliefs, not personality — falsifiable positions people can update, and it never claims to describe who you are |
| AI literacy explainers | Starts from your own view rather than a curriculum; two minutes rather than an hour |
| Surveys and polls | You get the result immediately, and it's about you |

**The moat is thin.** The mechanic is easy to copy and the content is the only
real asset — which is exactly why §0 matters. The durable advantages are the
accumulated dataset and whatever brand recognition the name earns.

---

## 7. Measurement

### Available now

From the shared stats page: total completions, archetype distribution,
population average per axis, answer spread per question, and human vs AI splits.

**The human/AI question is quietly one of the best assets here.** Nothing else
is measuring how language models answer this and whether they diverge from
people. That's a publishable finding on its own and a genuine press hook.

### Missing, and worth adding before launch

The single biggest gap: **there is no way to measure the funnel.** No page views,
no starts, no drop-off, no share events. Completions are recorded, but not how
many people arrived or bailed — so completion rate and share rate, the two
metrics that decide whether the launch worked, are currently uncomputable.

Minimum viable fix, consistent with the no-tracking stance: count anonymous
`visit`, `start`, `complete`, and `share` events into an existing table. Four
integers, no identifiers, no cookies. Roughly an hour's work. **Do this before
launch, not after** — the launch day is the only time you get that data.

### Targets to set

- **Completion rate.** Below ~50% means the questions are too long or too hard.
- **Share rate.** The one that predicts everything. Even 5–10% is strong.
- **Archetype spread.** If one archetype is >40%, the questions are skewed and
  the result feels less personal — a product problem, not just a data one.
- **Return / repeat takers.**

---

## 8. Risks

| Risk | Severity | Notes |
|---|---|---|
| Unlicensed forked content (§0) | **High** | Grows with success. Blocks launch. |
| No funnel instrumentation | Medium | Cheap to fix; irreversible if skipped |
| "The questions are loaded" | Medium | Inevitable critique of any instrument like this. Being open source helps; a written note on question design would help more. |
| LLM-picked thinker lists | Medium | Real people mapped to camps by Claude. Disclaimed in the UI, but someone will object to their placement. Have a correction process. |
| Skewed distribution | Medium | If early takers are all from one community the "population average" misleads. Say so on the stats page once volume is real. |
| Spam / ballot-stuffing | Low–Medium | Nothing stops repeat submissions. Fine at small scale; add rate limiting before publishing findings. |
| Supabase free-tier limits | Low | Generous, and the quiz survives the backend being down |
| Topic fatigue | Low | Cuts both ways — high interest, crowded field |

---

## 9. Open questions

1. **§0** — collaborate, license, rewrite, or stay unlisted?
2. **Own domain?** `aadik23.github.io/ai-compass/` reads as a side project.
   A real domain is the cheapest credibility upgrade available.
3. **Attribution and about page.** There is currently no page explaining who
   made this, how the axes were chosen, or how to contest a placement. For a
   product whose whole claim is "helping you think about this," that absence is
   conspicuous.
4. **Add the compare-to-others view?** Deliberately skipped, but "you vs the
   crowd" is a strong second share moment. Reconsider once volume exists.
5. **Any monetisation, ever?** Currently zero-cost to run, which is a real
   strategic asset. Introducing money changes the trust equation.
6. **Who owns the launch?** Seeding to recognisable people requires a person
   with standing to do the asking.

---

## 10. Assets on hand

- Live site, mobile-friendly, zero hosting cost
- 16 pre-rendered 1200×630 archetype cards at `/og/{CODE}.png` — usable directly
  as social creative
- Per-result share cards generated on the fly
- A stats page that doubles as a data artifact
- Open-source repo — credibility with the technical audience
- `README.md` for engineering context; this file for GTM

**Not yet built:** about/methodology page, educator guide, press kit, funnel
analytics, own domain, any written copy about who made this or why.
