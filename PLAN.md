# CAN-nections — execution plan

For Claude Code. Work top to bottom; phases are in dependency order.

**Loop for every phase:** do the work → `npm test` → `git add -A` → commit → `git push` →
tick the boxes here → commit the tick with the next phase. Don't ask permission for git or
test commands, they're pre-approved in `.claude/settings.json`. Don't skip ahead to dodge a
blocker — say what's blocking and stop.

Read `CLAUDE.md` first. It has the puzzle rules and the commit rules.

---

## Phase 0 — Take control of the repo

Everything else depends on this working.

- [x] Confirm `git --version` and `gh auth status` both succeed. If `gh` isn't authed, stop
      and tell Noah to run `gh auth login` (see `SETUP.md`) — don't try to authenticate for him.
- [x] `git init -b main` if not already a repo; `git add -A`; commit as `Initial commit`.
- [x] `gh repo create cannections --public --source=. --remote=origin --push`
- [x] Enable Pages: `gh api -X POST repos/:owner/cannections/pages -f "source[branch]=main" -f "source[path]=/"`
- [x] `git config core.hooksPath .githooks` so the pre-commit gate runs.
- [x] Mark the hook executable in the index so it survives a fresh clone:
      `git update-index --chmod=+x .githooks/pre-commit`
- [x] `npm install` (pulls jsdom for the DOM suite).
- [x] `npm test` — all three suites must be green before you go further.
- [x] Read back the live Pages URL and put it in `js/game.js`: set `SITE_URL` to the Pages
      URL and `REPO_URL` to the repo URL. Both are placeholders right now and the share
      button is emitting a fake link.
- [x] Commit `Point share links at the live site`, push.

**Done when:** the game loads at `https://<user>.github.io/cannections/`, and the share
button produces a link that actually resolves.

---

## Phase 1 — Grow the archive to 30 puzzles

Currently 12. The rotation repeats every 12 days, which is too tight — a regular player
sees a repeat inside a fortnight.

- [x] Read all 12 existing puzzles in `data/puzzles.js` before writing anything. Note which
      categories, regions and eras are already used. **Do not repeat a category concept.**
- [x] Write 18 new puzzles, ids 13–30. Follow the authoring rules in `CLAUDE.md`.
- [x] Budget them deliberately across regions so the archive isn't Toronto-shaped:
      - 4 Atlantic (Newfoundland, Nova Scotia, PEI, New Brunswick)
      - 4 Québec (including at least one built on Québécois French in everyday English)
      - 4 Prairies + North (Yukon, NWT, Nunavut, Saskatchewan, Manitoba, Alberta)
      - 3 BC / Pacific
      - 3 national or cross-country
- [x] Vary the subject matter too. The existing archive is heavy on food, hockey and TV.
      Add: Canadian literature, Indigenous nations and languages, Canadian science and
      space, Canadian sports beyond hockey (lacrosse, CFL, curling, soccer), Canadian
      music beyond the obvious, Canadian law and civics, Canadian wildlife, Canadian
      failures and disasters (Avro Arrow, Bre-X, the Halifax Explosion).
- [x] For each new puzzle, write a one-line comment above it naming the intended traps.
      If you can't name two, the puzzle isn't finished.
- [x] `npm test` after every batch of six, not at the very end.
- [x] Commit in batches of six: `Add puzzles 13-18`, `Add puzzles 19-24`, `Add puzzles 25-30`.
      Push after each.

**Done when:** 30 puzzles, validator green with zero warnings, no two puzzles sharing a
category concept.

---

## Phase 2 — Streaks and a real results card

The stats block counts games but has no streak, and the endgame just fires a toast.

- [x] Add current-streak and max-streak to the stored stats. A streak counts **consecutive
      calendar days played**, not consecutive puzzles — playing three archive puzzles in one
      afternoon is one day. Store `lastPlayedDate`; if today is `lastPlayedDate + 1`,
      increment; if it's the same day, no change; otherwise reset to 1.
- [x] Archive-mode games must not touch the streak. Only the daily puzzle counts.
- [x] Bump the storage key to `cannections.v2` and migrate `v1` data forward rather than
      dropping it. Delete the `v1` key only after a successful migration.
- [x] Replace the endgame toast with a results modal: the emoji grid rendered visually, the
      four category names, mistakes used, current streak, and the Share button.
- [x] Add a countdown to the next puzzle (local midnight) in that modal.
- [x] Extend `tests/dom.js`: streak increments across simulated days, streak resets after a
      gap, archive play doesn't move it, v1→v2 migration preserves the old results.
- [x] Commit `Add streaks and results modal`, push.

**Done when:** the DOM suite covers all four streak cases and passes.

---

## Phase 3 — Accessibility pass

Right now the board is only reachable by mouse in practice, and screen readers get nothing
useful when a group is solved.

- [ ] Arrow-key navigation across the grid. Wrap at row ends. `Space`/`Enter` toggles a tile.
- [ ] Make the board a proper roving-tabindex widget — one tile in the tab order at a time,
      not sixteen.
- [ ] Announce outcomes to screen readers: which category was solved and its difficulty
      name; "one away"; mistakes remaining. Use the existing `aria-live` region rather than
      adding more.
- [ ] Give tiles real `aria-pressed` state (already partly there) and label the board with
      how many groups remain.
- [ ] Contrast is already gated by `tests/contrast.js` and currently passes in both modes.
      Extend it to cover any new colour pair you introduce — never add a colour without
      adding its pair to the audit.
- [ ] Trap focus inside open modals and return focus to the triggering button on close.
- [ ] Add keyboard-navigation assertions to `tests/dom.js`.
- [ ] Commit `Add keyboard navigation and screen reader support`, push.

**Done when:** the whole game is playable with the keyboard alone, and contrast is
documented in the README.

---

## Phase 4 — Ship it properly

- [ ] Open Graph and Twitter card meta so shared links preview. Generate a simple 1200×630
      `og.png` from the matte palette — flat colour blocks, wordmark, no photography.
- [ ] Web app manifest + maskable icons so it installs to a phone home screen.
- [ ] A service worker that caches the six static files for offline play. Cache-first with a
      version constant you bump on release. Nothing dynamic, nothing clever.
- [ ] A GitHub Action running `npm test` on push to `main`. Fail the build on red.
- [ ] Add a `CONTRIBUTING.md` with a puzzle-submission template, and an issue template that
      asks for the four categories, sixteen cards, intended difficulty and intended traps.
- [ ] Commit each of these separately, push each.

**Done when:** the Action badge is green in the README and the site works offline.

---

## Phase 5 — Nice-to-haves, only if the above is done

Ask Noah before starting any of these — they're genuine forks in the road, not obvious wins.

- [ ] **Per-puzzle static pages** for SEO (`/puzzle/14/`). This is the only thing that would
      justify a static generator. Use Eleventy if so, not raw EJS. It adds a build step, so
      it needs a real decision.
- [ ] **A puzzle editor page** — a local HTML tool that validates a puzzle as you type and
      emits the JS snippet to paste into `data/puzzles.js`. Cheaper than it sounds and makes
      Noah self-sufficient.
- [ ] **Difficulty telemetry** — but only if it stays anonymous and local. Do not add
      analytics, a backend, or third-party scripts. If it can't be done locally, don't.

---

## Standing constraints

Repeated here because they're the things most likely to get quietly violated:

- **Free forever.** No ads, no analytics, no accounts, no paywall, no third-party scripts,
  no backend, no paid hosting tier.
- **No runtime dependencies.** No frameworks, no CDN links, no build step for the shipped
  game. `jsdom` is dev-only.
- **No NYT content.** Don't call `nytimes.com`, don't scrape it, don't copy a category, a
  card, or a puzzle. The format is fair game; the content is not. Everything ships original.
- **Matte palette.** Changes go through the `:root` custom properties. No gradients, no
  gloss, no shadows on interactive surfaces, nothing above ~45% saturation.
- **Never push red**, never force-push, never `--no-verify`.
