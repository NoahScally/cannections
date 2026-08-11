/*
 * CAN-nections puzzle validator + logic smoke test.
 * Run:  node tests/validate.js
 * Exits non-zero if anything is wrong, so it works as a CI gate.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "data", "puzzles.js"), "utf8"), sandbox);
const PUZZLES = sandbox.window.CANNECTIONS_PUZZLES;

let errors = [];
let warnings = [];
const fail = m => errors.push("✗ " + m);
const warn = m => warnings.push("! " + m);

/* ── Structural checks ─────────────────────────────────────── */
if (!Array.isArray(PUZZLES) || PUZZLES.length === 0) fail("no puzzles found");

const ids = new Set();
PUZZLES.forEach((p, i) => {
  const tag = `puzzle #${p.id ?? "(no id)"} [index ${i}]`;

  if (typeof p.id !== "number") fail(`${tag}: id must be a number`);
  if (ids.has(p.id)) fail(`${tag}: duplicate id`);
  ids.add(p.id);

  if (!p.title) fail(`${tag}: missing title`);
  if (!Array.isArray(p.categories) || p.categories.length !== 4)
    return fail(`${tag}: needs exactly 4 categories`);

  const diffs = [];
  const words = [];

  p.categories.forEach(c => {
    if (!c.title) fail(`${tag}: a category is missing a title`);
    if (!Array.isArray(c.cards) || c.cards.length !== 4)
      fail(`${tag} / "${c.title}": needs exactly 4 cards`);
    if (![0, 1, 2, 3].includes(c.difficulty))
      fail(`${tag} / "${c.title}": difficulty must be 0-3`);
    diffs.push(c.difficulty);
    (c.cards || []).forEach(w => {
      words.push(w);
      if (typeof w !== "string" || !w.trim())
        fail(`${tag} / "${c.title}": empty card`);
      if (w !== w.toUpperCase())
        warn(`${tag}: "${w}" is not uppercase`);
      if (w.length > 17)
        warn(`${tag}: "${w}" is ${w.length} chars — may overflow on small phones`);
      if (w.split(/\s+/).length > 2)
        warn(`${tag}: "${w}" is ${w.split(/\s+/).length} words — keep to 2 max`);
    });
  });

  if ([...new Set(diffs)].length !== 4)
    fail(`${tag}: difficulties must be 0,1,2,3 exactly once (got ${diffs})`);

  const sortedDiffs = diffs.slice().sort();
  if (JSON.stringify(diffs) !== JSON.stringify(sortedDiffs))
    warn(`${tag}: categories not listed easiest-to-hardest`);

  if (words.length !== 16) fail(`${tag}: expected 16 cards, got ${words.length}`);
  const dupes = words.filter((w, k) => words.indexOf(w) !== k);
  if (dupes.length) fail(`${tag}: duplicate card(s) within puzzle: ${[...new Set(dupes)].join(", ")}`);
});

/* ── Logic smoke test ──────────────────────────────────────── */
// Simulate a perfect solve and a total loss on every puzzle.
function simulate(p, strategy) {
  const remaining = new Set(p.categories.map(c => c.title));
  let mistakes = 0, history = [];
  const catOf = w => p.categories.find(c => c.cards.includes(w));

  while (remaining.size > 0 && mistakes < 4) {
    const open = p.categories.filter(c => remaining.has(c.title));
    let guess;
    if (strategy === "perfect") {
      guess = open[0].cards.slice();
    } else {
      // one word from each open category (or pad from the first)
      guess = open.map(c => c.cards[0]).slice(0, 4);
      while (guess.length < 4) guess.push(open[0].cards[guess.length]);
    }
    history.push(guess.map(w => catOf(w).difficulty));

    const counts = {};
    guess.forEach(w => { const t = catOf(w).title; counts[t] = (counts[t] || 0) + 1; });
    const best = Math.max(...Object.values(counts));
    if (best === 4) {
      remaining.delete(Object.keys(counts).find(k => counts[k] === 4));
    } else {
      mistakes++;
    }
  }
  return { solved: 4 - remaining.size, mistakes, history };
}

PUZZLES.forEach(p => {
  const win = simulate(p, "perfect");
  if (win.solved !== 4 || win.mistakes !== 0)
    fail(`puzzle #${p.id}: perfect play did not produce a clean solve`);
  if (win.history.length !== 4)
    fail(`puzzle #${p.id}: perfect play should be exactly 4 guesses`);

  const lose = simulate(p, "spread");
  if (lose.mistakes !== 4)
    fail(`puzzle #${p.id}: worst-case play should burn all 4 mistakes`);
});

/* ── Daily rotation check ──────────────────────────────────── */
function daysBetween(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}
const LAUNCH = "2026-08-11";
const seen = new Set();
for (let d = 0; d < PUZZLES.length; d++) {
  const dt = new Date(Date.UTC(2026, 7, 11 + d));
  const key = dt.toISOString().slice(0, 10);
  const idx = ((daysBetween(LAUNCH, key) % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
  seen.add(idx);
}
if (seen.size !== PUZZLES.length)
  fail(`rotation does not cover every puzzle in one cycle (${seen.size}/${PUZZLES.length})`);

/* ── Report ────────────────────────────────────────────────── */
console.log(`Checked ${PUZZLES.length} puzzles (${PUZZLES.length * 16} cards).`);
warnings.forEach(w => console.log(w));
errors.forEach(e => console.log(e));

if (errors.length) {
  console.log(`\nFAILED — ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nPASSED${warnings.length ? ` — with ${warnings.length} warning(s)` : ""}.`);
