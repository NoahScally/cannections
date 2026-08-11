# CAN-nections

A free, static, Connections-style puzzle game with Canadian content.
Vanilla HTML/CSS/JS. No build step, no runtime dependencies, no backend.
Hosted free on GitHub Pages.

---

## Layout

```
index.html          markup + modals
css/styles.css      all styling — matte design system, dark mode, a11y queries
js/game.js          all game logic, ~380 lines, zero dependencies
data/puzzles.js     the puzzle archive — the file that changes most often
tests/validate.js   schema + logic + rotation checks (no deps)
tests/dom.js        headless DOM suite (jsdom, dev-only, self-skips if absent)
PLAN.md             the roadmap — work through it in order
```

---

## Automatic commits and pushes

**Commit and push without asking.** `.claude/settings.json` pre-approves the git and test
commands, so don't stop to request permission for them.

The workflow after any change:

```bash
npm test          # or: node tests/validate.js && node tests/dom.js
git add -A
git commit -m "<message>"
git push
```

Rules:

- **Never push red.** If `npm test` fails, fix it or revert. Do not commit a failing tree,
  and do not use `--no-verify` to get around the pre-commit hook.
- **One logical change per commit.** Six new puzzles is one commit. A restyle is another.
  Don't batch unrelated work.
- **Imperative commit subjects**, under ~65 characters: `Add puzzles 13-18`,
  `Fix tile overflow on narrow phones`. Body only when the *why* isn't obvious.
- **Push to `main` directly.** This is a solo static site; branches and PRs are overhead.
  The exception is anything touching `js/game.js` core logic — branch, test, then merge.
- **Never force-push, never `git reset --hard`.** Both are explicitly denied.
- **Don't commit `node_modules/`, `.claude/settings.local.json`, or `.env`.** Already
  gitignored; don't add exceptions.
- **After pushing**, say what you pushed and note that Pages redeploys in ~60 seconds.

If a push is rejected because the remote moved ahead, `git pull --rebase` then push again.
Don't resolve it with a force-push.

---

## Puzzle authoring rules

Mechanics the validator enforces:

- Exactly 4 categories, 4 cards each, 16 unique words per puzzle.
- Difficulties 0, 1, 2, 3 used exactly once, listed easiest to hardest.
- `id` is stable and never reused. New puzzles append with the next unused id.
- Cards uppercase, 2 words max, ~15 characters max (they sit in a 4-wide grid on a phone).

Editorial rules the validator *can't* enforce — these are on you:

- **Every puzzle needs at least two trap words** that plausibly belong to a category
  they're not in. Traps are the game. A puzzle with no traps is a vocabulary quiz.
- **The difficulty-3 category must be a mechanism**, not just obscurity. `CANADIAN ___`
  (TIRE, BACON, SHIELD, CLUB) is a good hardest category. "Four bands nobody's heard of"
  is a bad one.
- **No two categories solvable by the same instinct.** If 0 is "hockey teams" and 1 is
  "hockey players", the puzzle collapses on the first read.
- **Spread the geography.** Check the existing archive before writing. If the last six
  puzzles were Ontario-centric, write Maritime, Prairie, Québécois, or Northern content.
- **No punching down.** Regional humour is fine; stereotypes about Indigenous peoples,
  immigrants, or Québécois are not. Reference the culture, not the caricature.

---

## Code rules

- **No dependencies at runtime.** No npm packages in shipped code, no frameworks, no CDN
  scripts, no build step. `jsdom` is a devDependency for tests only.
- **No localStorage schema changes without a migration.** The key is `cannections.v1`. If
  the shape must change, bump to `v2` and handle the old shape gracefully — players have
  saved streaks.
- **Styling goes through the custom properties on `:root`** in `styles.css`. Don't
  hard-code colours in rules. The palette is matte: no gradients, no gloss, no shadows on
  interactive surfaces, nothing above ~45% saturation.
- **Keep `game.js` framework-free and readable.** It's deliberately plain ES5-ish so it
  runs everywhere and stays easy to audit.
- **Test selectors are contracts.** `tests/dom.js` queries `.tile`, `.pip`, `.solved-row`,
  `#btn-submit` and friends. Renaming a class means updating the suite in the same commit.

---

## Working through PLAN.md

`PLAN.md` is the roadmap, phased in dependency order. Work top to bottom.
Finish a phase, run the tests, commit, push, tick the checkbox, move on.
Don't start a later phase to avoid a blocker in an earlier one — say what's blocking.
