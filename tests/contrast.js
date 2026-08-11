/*
 * CAN-nections contrast gate.
 * Run:  node tests/contrast.js
 *
 * Parses the custom properties straight out of css/styles.css and checks every
 * foreground/background pair the UI actually uses against WCAG 2.1 AA.
 * No dependencies. Exits non-zero on failure, so it works as a commit hook.
 *
 * The matte palette is desaturated by design, which makes it easy to drift into
 * mud. This is the guardrail — change a swatch and this tells you immediately.
 */
const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.join(__dirname, "..", "css", "styles.css"), "utf8");

/* Pull the two :root blocks — the second one is inside the dark-mode query. */
function varsFrom(block) {
  const out = {};
  const re = /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let m;
  while ((m = re.exec(block))) out[m[1]] = m[2];
  return out;
}

const rootBlocks = [];
const rootRe = /:root\s*\{([^}]*)\}/g;
let match;
while ((match = rootRe.exec(css))) rootBlocks.push(match[1]);

if (rootBlocks.length < 2) {
  console.log("FAIL  expected two :root blocks (light + dark) in styles.css");
  process.exit(1);
}

const light = varsFrom(rootBlocks[0]);
const dark = Object.assign({}, light, varsFrom(rootBlocks[1]));

/* ── WCAG maths ────────────────────────────────────────────── */
function channels(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
}
function luminance(hex) {
  const [r, g, b] = channels(hex).map(v =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ── Pairs the UI actually renders ─────────────────────────── */
// [label, foreground var, background var, minimum ratio]
// 4.5 = AA normal text. 3.0 = AA large text (18.66px+ bold, or 24px+).
const PAIRS = [
  ["body text on background",        "--ink",      "--bg",       4.5],
  ["muted text on background",       "--ink-soft", "--bg",       4.5],
  ["tile label on tile",             "--ink",      "--surface",  4.5],
  ["tile label on hovered tile",     "--ink",      "--surface-2", 4.5],
  ["selected tile label",            "--on-sel",   "--sel",      4.5],
  ["toast text",                     "--on-sel",   "--sel",      4.5],
  ["stat label on stat panel",       "--ink-soft", "--surface",  4.5],
  ["archive tile label",             "--ink",      "--surface",  4.5],
  ["solved row text on sand",        "--on-d",     "--d0",       4.5],
  ["solved row text on sage",        "--on-d",     "--d1",       4.5],
  ["solved row text on slate",       "--on-d",     "--d2",       4.5],
  ["solved row text on clay",        "--on-d",     "--d3",       4.5],
  ["primary button label",           "--bg",       "--ink",      4.5]
];

/* Difficulty swatches must also be distinguishable from the page itself,
   otherwise a solved row disappears into the background. */
const VS_BG = [["--d0", 1.35], ["--d1", 1.35], ["--d2", 1.35], ["--d3", 1.35]];

let failures = 0;

function audit(name, vars) {
  console.log(`\n▸ ${name}`);
  PAIRS.forEach(([label, fg, bg, min]) => {
    if (!vars[fg] || !vars[bg]) {
      console.log(`FAIL  ${label} — missing ${!vars[fg] ? fg : bg}`);
      failures++;
      return;
    }
    const r = ratio(vars[fg], vars[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      (ok ? "  ok  " : "FAIL  ") +
      label.padEnd(30) +
      r.toFixed(2).padStart(6) + ":1" +
      (ok ? "" : `  (needs ${min}:1)`)
    );
  });

  VS_BG.forEach(([sw, min]) => {
    const r = ratio(vars[sw], vars["--bg"]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      (ok ? "  ok  " : "FAIL  ") +
      `${sw} distinct from page`.padEnd(30) +
      r.toFixed(2).padStart(6) + ":1" +
      (ok ? "" : `  (needs ${min}:1)`)
    );
  });

  // The four ramp colours must be distinguishable from each other, or the
  // difficulty ordering stops reading at a glance.
  const ramp = ["--d0", "--d1", "--d2", "--d3"];
  for (let i = 0; i < ramp.length; i++) {
    for (let j = i + 1; j < ramp.length; j++) {
      const r = ratio(vars[ramp[i]], vars[ramp[j]]);
      const sameish = r < 1.08;
      if (sameish) {
        failures++;
        console.log(`FAIL  ${ramp[i]} vs ${ramp[j]} nearly identical (${r.toFixed(2)}:1)`);
      }
    }
  }
}

audit("light mode", light);
audit("dark mode", dark);

console.log(failures
  ? `\nFAILED — ${failures} contrast issue(s). Adjust the :root variables in css/styles.css.`
  : "\nPASSED — every pair clears WCAG AA in both modes.");
process.exit(failures ? 1 : 0);
