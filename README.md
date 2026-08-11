# 🍁 CAN-nections

A free, open-source daily word-grouping puzzle built entirely on Canadian references.
Find four groups of four. Four mistakes and you're done.

No ads, no accounts, no paywall, no backend, no build step. Three files and a JSON-shaped
puzzle archive.

---

## Run it

Open `index.html` in a browser. That's it — it works from `file://` because the puzzle data
is loaded as a plain script instead of `fetch()`.

To serve it locally on a real HTTP origin:

```bash
npx serve .
# or
python -m http.server 8000
```

Validate the puzzle archive:

```bash
node tests/validate.js
```

---

## How the daily rotation works

There's no server. The game computes which puzzle is "today's" from the calendar:

```
index = (days since LAUNCH) mod (number of puzzles)
```

`LAUNCH` lives at the top of `js/game.js`. Everyone who opens the page on the same local
date gets the same puzzle, and the board is shuffled with a **seeded** PRNG keyed to the
puzzle id — so the tiles are in the same starting positions for everyone too. That's what
makes shared emoji grids comparable.

When you add puzzles to `data/puzzles.js`, the cycle just gets longer. Nothing else changes.

> This is the same *user-facing* model NYT uses (one puzzle per calendar date, everyone
> gets the same one, share grid encodes your guesses). The difference is they resolve the
> date to a puzzle server-side; we resolve it client-side from a bundled archive. For a
> free static site that's the right trade — no hosting cost, works offline, and nobody can
> break it by hammering an endpoint.

### Pinning specific dates instead

If you'd rather assign puzzles to explicit dates (so a Canada Day puzzle lands on July 1),
add a `date: "2027-07-01"` field to the puzzle and change `todaysIndex()` to prefer an
exact date match before falling back to the rotation. About six lines.

---

## Puzzle schema

Modelled on the shape NYT Connections uses, with two additions (`difficulty` explicit on
each category, and an internal `title` per puzzle).

```js
{
  id: 13,                       // stable, never reuse
  title: "Loonie Toonie",       // internal nickname, shown in the archive
  editor: "CAN-nections",
  categories: [                 // exactly 4, listed easiest -> hardest
    {
      title: "TIM HORTONS ORDER",   // revealed on solve
      difficulty: 0,                // 0..3, each used exactly once
      cards: ["DOUBLE DOUBLE", "TIMBIT", "ICE CAPP", "CRULLER"]
    },
    // ... 3 more
  ]
}
```

**For reference**, the shape NYT's own puzzle endpoint returns
(`/svc/connections/v2/{date}.json`) is roughly:

```jsonc
{
  "status": "OK",
  "id": 1144,
  "print_date": "2026-07-29",
  "editor": "Wyna Liu",
  "categories": [
    {
      "title": "CATEGORY NAME",
      "cards": [ { "content": "WORD", "position": 0 }, /* ... */ ]
    }
    // 4 categories; array order IS the difficulty order
  ]
}
```

Two things worth stealing from that design, both of which this repo does:

1. **Difficulty is positional.** Category `[0]` is always yellow/easiest, `[3]` always
   purple/hardest. We make it explicit with a `difficulty` field so reordering can't
   silently break the colours.
2. **Board position is baked into the data**, not randomised per-player. NYT ships a
   `position` per card; we get the same effect with a seeded shuffle, which means we don't
   have to hand-author 16 positions per puzzle.

That endpoint is undocumented and unlicensed — this project doesn't call it, scrape it, or
reuse any NYT puzzle content. All categories and cards here are original.

---

## Difficulty ramp

A matte Canadian-landscape palette standing in for NYT's yellow/green/blue/purple.

| Level | Light | Dark | Name | What it should feel like |
|---|---|---|---|---|
| 0 | `#d4bb85` | `#c0a76f` | **Sand** | Any Canadian gets it on sight. Tim Hortons, provinces, hockey teams. |
| 1 | `#9bb097` | `#89a085` | **Sage** | One extra step of reasoning. Still broad. |
| 2 | `#93a5b8` | `#7c92a8` | **Slate** | Real CanCon knowledge. Group of Seven, CBC, Newfoundland slang. |
| 3 | `#c78b7b` | `#b57565` | **Clay** | Wordplay, a fill-in-the-blank, or a genuine deep cut. |

Share grids still use 🟨🟩🟦🟥, because those are the only four squares that exist as
emoji and everyone already reads them as a difficulty ramp.

### Design rules

Everything visual lives in `css/styles.css`, driven by custom properties on `:root`.
To keep the matte feel: no gradients, no gloss, no drop shadows on interactive surfaces,
nothing above roughly 45% saturation. Contrast comes from **value**, not saturation. The
one exception is a single soft elevation shadow, used only on modals.

Dark mode, reduced-motion and increased-contrast are all handled with media queries — no
theme toggle, no JS involved.

Muted palettes drift into mud easily, so contrast is enforced rather than eyeballed:

```bash
node tests/contrast.js
```

It reads the variables straight out of the stylesheet and checks every foreground/background
pair the UI renders against WCAG AA, in **both** colour schemes, plus that the four ramp
colours stay distinguishable from each other and from the page. Change a swatch and it will
tell you immediately. It also runs in the pre-commit hook.

---

## Writing a good puzzle

The validator enforces the mechanics. These are the editorial rules it can't check:

- **Plant traps.** Every puzzle should have at least two cards that plausibly belong to a
  category they're not in. `BOARDING` looks like a penalty *and* like travel. `TWAIN` looks
  like Mark. `RUSH` looks like a verb. Traps are the whole game.
- **The purple should be a mechanism, not just obscurity.** `CANADIAN ___` (TIRE, BACON,
  SHIELD, CLUB) is a good purple. "Four bands nobody's heard of" is a bad one.
- **Don't let two categories be solvable by the same instinct.** If yellow is "hockey teams"
  and green is "hockey players", the puzzle collapses.
- **Keep cards to two words and ~15 characters.** They have to fit a phone in a 4-wide grid.
  `node tests/validate.js` warns you.
- **Spread the regions.** Twelve puzzles that are all Ontario references is a Toronto game,
  not a Canadian one.

Add your puzzle to the end of `data/puzzles.js`, bump the `id`, run the validator, commit.

---

## Project layout

```
cannections/
├── index.html            # markup + modals
├── css/styles.css        # matte design system, dark mode, a11y queries
├── js/game.js            # all game logic (~380 lines, zero dependencies)
├── data/puzzles.js       # the puzzle archive — the file you'll edit most
├── tests/
│   ├── validate.js       # schema + logic + rotation checks (no deps)
│   ├── contrast.js       # WCAG AA gate over the palette (no deps)
│   └── dom.js            # headless DOM suite (jsdom, dev-only)
├── .githooks/pre-commit  # blocks red commits; enable with core.hooksPath
├── .claude/settings.json # pre-approved commands for Claude Code
├── PLAN.md               # the roadmap
├── CLAUDE.md             # project rules for Claude Code
└── .nojekyll             # tells GitHub Pages to serve the files as-is
```

Run everything:

```bash
npm install   # jsdom, dev-only — the shipped game has no dependencies
npm test
```

---

## Deploying free on GitHub Pages

See `SETUP.md` for the full from-scratch walkthrough (installing git, authenticating,
first push, enabling Pages, and letting Claude Code push for you).

Short version, once the repo exists:

```bash
git add -A && git commit -m "Add puzzles" && git push
```

Pages redeploys automatically in about a minute.

---

## Licence

MIT — see `LICENSE`. Puzzle content is original and released under the same terms.
Not affiliated with, endorsed by, or connected to The New York Times Company.
