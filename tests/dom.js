/*
 * CAN-nections headless DOM suite.
 * Run:  npm run test:dom      (or: node tests/dom.js)
 *
 * Boots index.html in jsdom, drives the real game.js, and asserts on behaviour.
 * jsdom is a DEV-only dependency — the shipped game has zero dependencies.
 * If jsdom isn't installed this skips cleanly instead of failing the build.
 */
const fs = require("fs");
const path = require("path");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch (e) {
  console.log("SKIP  jsdom not installed — run `npm install` to enable DOM tests.");
  process.exit(0);
}

const ROOT = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const PUZZLES_JS = fs.readFileSync(path.join(ROOT, "data", "puzzles.js"), "utf8");
const GAME_JS = fs.readFileSync(path.join(ROOT, "js", "game.js"), "utf8");

let failures = 0;
const t = (label, cond) => {
  console.log((cond ? "  ok  " : "FAIL  ") + label);
  if (!cond) failures++;
};

/* Boot a fresh page sharing a given localStorage backing store. */
function boot(mem) {
  const dom = new JSDOM(HTML, { runScripts: "outside-only", url: "https://example.org/" });
  const w = dom.window;
  const clip = { text: null };

  Object.defineProperty(w, "localStorage", {
    value: {
      getItem: k => (k in mem ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v); },
      removeItem: k => { delete mem[k]; }
    }
  });
  Object.defineProperty(w.navigator, "clipboard", {
    value: { writeText: x => { clip.text = x; return Promise.resolve(); } }
  });

  w.eval(PUZZLES_JS);
  w.eval(GAME_JS);

  const d = w.document;
  const words = [...d.querySelectorAll(".tile")].map(e => e.dataset.word);
  const live = w.CANNECTIONS_PUZZLES.find(p =>
    p.categories.every(c => c.cards.every(x => words.includes(x))));

  return {
    w, d, clip, live,
    $:  s => d.querySelector(s),
    $$: s => [...d.querySelectorAll(s)],
    pick(cards) {
      d.getElementById("btn-deselect").click();
      cards.forEach(x =>
        d.querySelector(`[data-word="${x.replace(/"/g, '\\"')}"]`).click());
    },
    submit() { d.getElementById("btn-submit").click(); }
  };
}

const wait = ms => new Promise(r => setTimeout(r, ms));

/* ── Suite 1: initial render + interaction ─────────────────── */
async function testRender() {
  console.log("\n▸ initial render + interaction");
  const g = boot({});
  const C = g.live.categories;

  t("16 tiles rendered", g.$$(".tile").length === 16);
  t("4 mistake pips", g.$$(".pip").length === 4);
  t("a known puzzle is on the board", !!g.live);
  t("help modal auto-opens for a first-time visitor", !g.$("#modal-help").hidden);
  t("submit disabled with nothing selected", g.$("#btn-submit").disabled);

  C[0].cards.slice(0, 3).forEach(x =>
    g.d.querySelector(`[data-word="${x.replace(/"/g, '\\"')}"]`).click());
  t("submit still disabled at 3 selected", g.$("#btn-submit").disabled);

  g.d.querySelector(`[data-word="${C[0].cards[3].replace(/"/g, '\\"')}"]`).click();
  t("submit enabled at 4 selected", !g.$("#btn-submit").disabled);
  t("exactly 4 tiles marked selected", g.$$(".tile.selected").length === 4);

  g.d.querySelector(`[data-word="${C[1].cards[0].replace(/"/g, '\\"')}"]`).click();
  t("a 5th selection is rejected", g.$$(".tile.selected").length === 4);

  g.$("#btn-deselect").click();
  t("deselect all clears the selection", g.$$(".tile.selected").length === 0);

  const before = g.$$(".tile").map(e => e.dataset.word);
  g.$("#btn-shuffle").click();
  const after = g.$$(".tile").map(e => e.dataset.word);
  t("shuffle preserves all 16 tiles",
    after.length === 16 && before.slice().sort().join() === after.slice().sort().join());
}

/* ── Suite 2: winning ──────────────────────────────────────── */
async function testWin() {
  console.log("\n▸ perfect solve");
  const mem = {};
  const g = boot(mem);

  for (const cat of g.live.categories) {
    g.pick(cat.cards);
    g.submit();
    await wait(1400);
  }

  t("all 4 categories solved", g.$$(".solved-row").length === 4);
  t("board is empty", g.$$(".tile").length === 0);
  t("endgame controls swapped in",
    !g.$("#endgame").hidden && g.$("#controls").hidden);
  t("solved rows carry all 4 difficulty classes",
    [0, 1, 2, 3].every(n => g.$(".solved-row.d-" + n)));

  const s = JSON.parse(mem["cannections.v1"]);
  t("result persisted as a win", s.results["p" + g.live.id].won === true);
  t("0 mistakes recorded", s.results["p" + g.live.id].mistakes === 0);
  t("4 guesses in history", s.games["p" + g.live.id].history.length === 4);

  g.$("#btn-archive").click();
  t("archive lists every puzzle",
    g.$$(".arch").length === g.w.CANNECTIONS_PUZZLES.length);
  t("exactly one puzzle marked today", g.$$(".arch.today").length === 1);
  t("played stat reads 1", g.$(".stat b").textContent === "1");
}

/* ── Suite 3: losing, one-away, share, reload ──────────────── */
async function testLoss() {
  console.log("\n▸ four mistakes, one-away, share, reload");
  const mem = {};
  const g = boot(mem);
  const C = g.live.categories;

  const guesses = [
    [C[0].cards[0], C[1].cards[0], C[2].cards[0], C[3].cards[0]], // 1-1-1-1
    [C[0].cards[0], C[0].cards[1], C[0].cards[2], C[1].cards[1]], // one away
    [C[1].cards[0], C[1].cards[1], C[1].cards[2], C[2].cards[1]], // one away
    [C[2].cards[0], C[2].cards[1], C[2].cards[2], C[3].cards[1]]  // one away
  ];

  let oneAways = 0;
  for (const guess of guesses) {
    g.pick(guess);
    t("guess selects exactly 4 tiles", g.$$(".tile.selected").length === 4);
    g.submit();
    await wait(600);
    if (g.$("#toast").textContent === "One away…") oneAways++;
    await wait(900);
  }
  await wait(2400);

  t('"One away…" fired on each 3-of-4 guess', oneAways === 3);
  t("all 4 pips spent", g.$$(".pip.spent").length === 4);
  t("board fully revealed on loss", g.$$(".solved-row").length === 4);
  t("reveal order is easiest-to-hardest",
    g.$$(".solved-row").map(r => +r.className.match(/d-(\d)/)[1]).join() === "0,1,2,3");

  const s = JSON.parse(mem["cannections.v1"]);
  t("result persisted as a loss", s.results["p" + g.live.id].won === false);
  t("4 mistakes recorded", s.results["p" + g.live.id].mistakes === 4);

  g.$("#btn-share").click();
  await wait(80);
  const SQ = { 0: "🟨", 1: "🟩", 2: "🟦", 3: "🟥" };
  const rows = g.clip.text.split("\n")
    .filter(l => /[\u{1F7E8}\u{1F7E9}\u{1F7E6}\u{1F7E5}]/u.test(l))
    .map(r => r.replace("❌", "").trim());
  const expected = guesses.map(gs =>
    gs.map(x => SQ[C.find(c => c.cards.includes(x)).difficulty]).join(""));

  t("share names the puzzle", g.clip.text.includes("CAN-nections No. " + g.live.id));
  t("loss is marked with ❌", g.clip.text.includes("❌"));
  t("share grid is 4 rows of 4 squares",
    rows.length === 4 && rows.every(r => [...r].length === 4));
  t("share grid matches the guesses made",
    JSON.stringify(rows) === JSON.stringify(expected));

  // Reload against the same storage
  const g2 = boot(mem);
  t("reload restores the finished board",
    g2.$$(".solved-row").length === 4 && g2.$$(".tile").length === 0);
  t("reload does not re-show help", g2.$("#modal-help").hidden);
  t("reload does not double-count the result",
    Object.keys(JSON.parse(mem["cannections.v1"]).results).length === 1);
}

/* ── Run ───────────────────────────────────────────────────── */
(async () => {
  await testRender();
  await testWin();
  await testLoss();

  console.log(failures
    ? `\nFAILED — ${failures} assertion(s).`
    : "\nPASSED — all DOM assertions green.");
  process.exit(failures ? 1 : 0);
})();
