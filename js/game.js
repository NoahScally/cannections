/* ── CAN-nections ────────────────────────────────────────────
   Vanilla JS, no build step, no backend, no network calls.
   Everything (progress, stats) lives in localStorage.
   ──────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var PUZZLES   = window.CANNECTIONS_PUZZLES || [];
  var LAUNCH    = "2026-08-11";   // day 1 of the rotation
  var MAX_MISS  = 4;
  var STORE     = "cannections.v2";
  var STORE_V1  = "cannections.v1";  // migrated forward on first load, then dropped
  var SQUARES   = ["🟨", "🟩", "🟦", "🟥"]; // 🟨🟩🟦🟥
  var REPO_URL  = "https://github.com/NoahScally/cannections";
  var SITE_URL  = "https://noahscally.github.io/cannections/";

  /* ── Dates ─────────────────────────────────────────────── */
  // Work in local time so "today" means the player's today, not UTC's.
  function todayKey() {
    var d = new Date();
    return [d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0")].join("-");
  }

  function daysBetween(aKey, bKey) {
    var a = aKey.split("-").map(Number), b = bKey.split("-").map(Number);
    var ms = Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2]);
    return Math.round(ms / 86400000);
  }

  // Which puzzle is "today's"? Deterministic, wraps forever.
  function todaysIndex() {
    var n = daysBetween(LAUNCH, todayKey());
    return ((n % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
  }

  function prettyDate(key) {
    var p = key.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("en-CA", {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    });
  }

  /* ── Deterministic shuffle ─────────────────────────────── */
  // Same puzzle => same starting board for everyone.
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function shuffle(arr, rand) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((rand || Math.random)() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ── Persistence ───────────────────────────────────────── */
  function readKey(k) {
    try { return JSON.parse(localStorage.getItem(k)); }
    catch (e) { return null; }
  }

  function loadStore() {
    var cur = readKey(STORE);
    if (cur && typeof cur === "object") return cur;

    // One-time v1 → v2 migration. Players have saved games and results in the
    // old key; carry them forward and only drop v1 once v2 is safely written.
    var old = readKey(STORE_V1);
    if (!old || typeof old !== "object") return {};

    var next = {
      games:    old.games   || {},
      results:  old.results || {},
      seenHelp: !!old.seenHelp,
      streak:   emptyStreak()   // v1 never tracked one, so nothing is lost
    };
    saveStore(next);
    if (readKey(STORE)) {
      try { localStorage.removeItem(STORE_V1); } catch (e) {}
    }
    return next;
  }

  function saveStore(s) {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {}
  }

  /* ── Streaks ───────────────────────────────────────────── */
  function emptyStreak() {
    return { current: 0, max: 0, lastPlayedDate: null };
  }

  // A streak counts consecutive calendar DAYS PLAYED, not consecutive puzzles —
  // three archive puzzles in one afternoon is still one day. Only the daily
  // moves it; see recordResult.
  function bumpStreak(store) {
    var today = todayKey();
    var st = store.streak || emptyStreak();
    if (st.lastPlayedDate !== today) {
      st.current = (st.lastPlayedDate && daysBetween(st.lastPlayedDate, today) === 1)
        ? st.current + 1
        : 1;
      st.lastPlayedDate = today;
      if (st.current > st.max) st.max = st.current;
    }
    store.streak = st;
    return st;
  }

  /* ── State ─────────────────────────────────────────────── */
  var puzzle, order, selected = [], solved = [], mistakes = 0,
      history = [], over = false, isDaily = true, busy = false;

  var el = {
    board:    document.getElementById("board"),
    solved:   document.getElementById("solved"),
    pips:     document.getElementById("pips"),
    toast:    document.getElementById("toast"),
    controls: document.getElementById("controls"),
    endgame:  document.getElementById("endgame"),
    date:     document.getElementById("meta-date"),
    number:   document.getElementById("meta-number"),
    submit:   document.getElementById("btn-submit"),
    deselect: document.getElementById("btn-deselect"),
    shuffle:  document.getElementById("btn-shuffle"),
    share:    document.getElementById("btn-share"),
    next:     document.getElementById("btn-next"),
    archive:  document.getElementById("archive-grid"),
    stats:    document.getElementById("stats"),

    resTitle: document.getElementById("results-title"),
    resSub:   document.getElementById("results-sub"),
    resGrid:  document.getElementById("results-grid"),
    resCats:  document.getElementById("results-cats"),
    resStats: document.getElementById("results-stats"),
    countdown: document.getElementById("countdown")
  };

  function allCards(p) {
    return p.categories.reduce(function (acc, c) { return acc.concat(c.cards); }, []);
  }

  function catOf(word) {
    for (var i = 0; i < puzzle.categories.length; i++) {
      if (puzzle.categories[i].cards.indexOf(word) !== -1) return puzzle.categories[i];
    }
    return null;
  }

  /* ── Boot a puzzle ─────────────────────────────────────── */
  function start(index, daily) {
    puzzle   = PUZZLES[index];
    isDaily  = !!daily;
    selected = [];
    solved   = [];
    history  = [];
    mistakes = 0;
    over     = false;
    order    = shuffle(allCards(puzzle), rng(puzzle.id * 7919 + 13));

    // Resume an in-progress or finished daily game
    var store = loadStore();
    var saved = store.games && store.games["p" + puzzle.id];
    if (daily && saved) {
      order    = saved.order;
      solved   = saved.solved;
      history  = saved.history;
      mistakes = saved.mistakes;
      over     = saved.over;
    }

    el.date.textContent   = daily ? prettyDate(todayKey()) : puzzle.title;
    el.number.textContent = "No. " + puzzle.id;

    render();
    if (over) finish(solved.length === 4, true);
  }

  function persist() {
    if (!isDaily) return;
    var s = loadStore();
    s.games = s.games || {};
    s.games["p" + puzzle.id] = {
      order: order, solved: solved, history: history,
      mistakes: mistakes, over: over, date: todayKey()
    };
    saveStore(s);
  }

  function recordResult(won) {
    var s = loadStore();
    s.results = s.results || {};
    // The streak tracks "played the daily today", win or lose, and is idempotent
    // within a day — so it moves even if this puzzle already has a result row.
    if (isDaily) bumpStreak(s);
    if (!s.results["p" + puzzle.id]) {     // don't double-count
      s.results["p" + puzzle.id] = { won: won, mistakes: mistakes, date: todayKey() };
    }
    saveStore(s);
  }

  /* ── Render ────────────────────────────────────────────── */
  function render() {
    // Solved rows
    el.solved.innerHTML = "";
    solved.forEach(function (title) {
      var cat = puzzle.categories.filter(function (c) { return c.title === title; })[0];
      var row = document.createElement("div");
      row.className = "solved-row d-" + cat.difficulty;
      row.innerHTML = '<div class="cat"></div><div class="words"></div>';
      row.querySelector(".cat").textContent   = cat.title;
      row.querySelector(".words").textContent = cat.cards.join(", ");
      el.solved.appendChild(row);
    });

    // Remaining tiles
    var done = {};
    solved.forEach(function (t) {
      puzzle.categories.filter(function (c) { return c.title === t; })[0]
        .cards.forEach(function (w) { done[w] = true; });
    });

    el.board.innerHTML = "";
    order.filter(function (w) { return !done[w]; }).forEach(function (word) {
      var b = document.createElement("button");
      b.className = "tile" + (selected.indexOf(word) !== -1 ? " selected" : "");
      b.type = "button";
      b.textContent = word;
      b.dataset.word = word;
      b.setAttribute("aria-pressed", selected.indexOf(word) !== -1 ? "true" : "false");
      b.disabled = over;
      b.addEventListener("click", function () { toggle(word); });
      el.board.appendChild(b);
    });

    // Pips
    el.pips.innerHTML = "";
    for (var i = 0; i < MAX_MISS; i++) {
      var p = document.createElement("span");
      p.className = "pip" + (i < mistakes ? " spent" : "");
      el.pips.appendChild(p);
    }

    el.submit.disabled   = selected.length !== 4 || over || busy;
    el.deselect.disabled = selected.length === 0 || over;
    el.shuffle.disabled  = over;
  }

  function toggle(word) {
    if (over || busy) return;
    var i = selected.indexOf(word);
    if (i !== -1) selected.splice(i, 1);
    else if (selected.length < 4) selected.push(word);
    else { toast("You can only pick four."); return; }
    render();
  }

  function tilesFor(words) {
    return words.map(function (w) {
      return el.board.querySelector('[data-word="' + w.replace(/"/g, '\\"') + '"]');
    }).filter(Boolean);
  }

  /* ── Submit ────────────────────────────────────────────── */
  function submit() {
    if (selected.length !== 4 || over || busy) return;

    // Log this guess for the share grid
    history.push(selected.map(function (w) { return catOf(w).difficulty; }));

    // Reject exact repeats of a previous wrong guess? NYT allows them; so do we.
    var counts = {};
    selected.forEach(function (w) {
      var t = catOf(w).title;
      counts[t] = (counts[t] || 0) + 1;
    });
    var best = Math.max.apply(null, Object.keys(counts).map(function (k) { return counts[k]; }));
    var hitTitle = Object.keys(counts).filter(function (k) { return counts[k] === best; })[0];

    busy = true;
    var tiles = tilesFor(selected);
    tiles.forEach(function (t, i) {
      setTimeout(function () { t.classList.add("bounce"); }, i * 90);
    });

    setTimeout(function () {
      if (best === 4) {
        solved.push(hitTitle);
        selected = [];
        busy = false;
        render();
        persist();
        if (solved.length === 4) finish(true);
      } else {
        mistakes++;
        tiles.forEach(function (t) { t.classList.remove("bounce"); t.classList.add("shake"); });
        if (best === 3) toast("One away…");
        setTimeout(function () {
          busy = false;
          if (mistakes >= MAX_MISS) {
            revealRest();
          } else {
            render();
            persist();
          }
        }, 520);
      }
    }, 480);
  }

  function revealRest() {
    // Reveal remaining categories easiest-first, then end the game.
    var left = puzzle.categories
      .filter(function (c) { return solved.indexOf(c.title) === -1; })
      .sort(function (a, b) { return a.difficulty - b.difficulty; });

    selected = [];
    left.forEach(function (c, i) {
      setTimeout(function () {
        solved.push(c.title);
        render();
        if (i === left.length - 1) { persist(); finish(false); }
      }, i * 420);
    });
  }

  function finish(won, restoring) {
    over = true;
    persist();
    if (!restoring) recordResult(won);
    render();
    el.controls.hidden = true;
    el.endgame.hidden  = false;
    // Reloading a finished board restores it quietly; only a fresh finish
    // earns the results card.
    if (!restoring) {
      renderResults(won);
      openModal("modal-results");
    }
  }

  function winMessage() {
    var m = ["Beauty.", "Give 'er.", "That's a snipe.", "Top shelf.", "Not bad, eh?"];
    return m[mistakes] || m[0];
  }

  /* ── Results card ──────────────────────────────────────── */
  function renderResults(won) {
    el.resTitle.textContent = won ? winMessage() : "Next time, bud.";
    el.resSub.textContent = "CAN-nections No. " + puzzle.id + " · " +
      (won
        ? (mistakes === 0 ? "perfect" : mistakes + (mistakes === 1 ? " mistake" : " mistakes"))
        : "out of mistakes");

    // The share grid, drawn instead of typed.
    el.resGrid.innerHTML = "";
    history.forEach(function (row) {
      var r = document.createElement("div");
      r.className = "mini-row";
      row.forEach(function (d) {
        var c = document.createElement("span");
        c.className = "mini d-" + d;
        r.appendChild(c);
      });
      el.resGrid.appendChild(r);
    });

    el.resCats.innerHTML = "";
    puzzle.categories.slice()
      .sort(function (a, b) { return a.difficulty - b.difficulty; })
      .forEach(function (c) {
        var li = document.createElement("li");
        li.innerHTML = '<span class="sw sw-' + c.difficulty + '"></span><span class="rc-title"></span>';
        li.querySelector(".rc-title").textContent = c.title;
        el.resCats.appendChild(li);
      });

    var st = loadStore().streak || emptyStreak();
    el.resStats.innerHTML = "";
    [["Mistakes", mistakes],
     ["Streak", st.current],
     ["Max streak", st.max]
    ].forEach(function (pair) {
      var d = document.createElement("div");
      d.className = "res-stat";
      d.innerHTML = "<b></b><span></span>";
      d.querySelector("b").textContent = pair[1];
      d.querySelector("span").textContent = pair[0];
      el.resStats.appendChild(d);
    });
  }

  /* ── Countdown to the next puzzle (local midnight) ─────── */
  var countdownTimer = null;

  function tickCountdown() {
    if (!el.countdown) return;
    var now  = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var s    = Math.max(0, Math.floor((next - now) / 1000));
    var pad  = function (n) { return String(n).padStart(2, "0"); };
    el.countdown.textContent =
      pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60);
  }

  function startCountdown() {
    tickCountdown();
    countdownTimer = setInterval(tickCountdown, 1000);
  }

  function stopCountdown() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }

  /* ── Share ─────────────────────────────────────────────── */
  function shareText() {
    var grid = history.map(function (row) {
      return row.map(function (d) { return SQUARES[d]; }).join("");
    }).join("\n");

    var won = solved.length === 4 && mistakes < MAX_MISS;
    return "CAN-nections No. " + puzzle.id + "\n" +
           (won ? "" : "❌ ") + grid + "\n" +
           (SITE_URL || REPO_URL);
  }

  function share() {
    var text = shareText();
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () { copy(text); });
    } else {
      copy(text);
    }
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(function () { toast("Copied to clipboard"); })
        .catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast("Copied to clipboard"); }
    catch (e) { toast("Couldn't copy — select it manually"); }
    document.body.removeChild(ta);
  }

  /* ── Toast ─────────────────────────────────────────────── */
  var toastTimer;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.toast.classList.remove("show");
    }, 1900);
  }

  /* ── Archive + stats ───────────────────────────────────── */
  function buildArchive() {
    var s = loadStore();
    var results = s.results || {};
    var t = todaysIndex();

    el.archive.innerHTML = "";
    PUZZLES.forEach(function (p, i) {
      var r = results["p" + p.id];
      var b = document.createElement("button");
      b.className = "arch" + (i === t ? " today" : "") +
                    (r ? (r.won ? " won" : " lost") : "");
      b.type = "button";
      b.innerHTML = "#" + p.id + "<small></small>";
      b.querySelector("small").textContent = i === t ? "today" : p.title;
      b.title = p.title;
      b.addEventListener("click", function () {
        closeModals();
        el.controls.hidden = false;
        el.endgame.hidden  = true;
        start(i, i === t);          // may re-hide controls if already finished
        window.scrollTo(0, 0);
      });
      el.archive.appendChild(b);
    });

    var played = Object.keys(results).length;
    var wins   = Object.keys(results).filter(function (k) { return results[k].won; }).length;
    var perfect= Object.keys(results).filter(function (k) {
      return results[k].won && results[k].mistakes === 0;
    }).length;

    var st = s.streak || emptyStreak();

    el.stats.innerHTML = "";
    [["Played", played],
     ["Won", wins],
     ["Win %", played ? Math.round(wins / played * 100) : 0],
     ["Perfect", perfect],
     ["Streak", st.current],
     ["Max", st.max]
    ].forEach(function (pair) {
      var d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = "<b></b><span></span>";
      d.querySelector("b").textContent = pair[1];
      d.querySelector("span").textContent = pair[0];
      el.stats.appendChild(d);
    });
  }

  /* ── Modals ────────────────────────────────────────────── */
  var MODALS = ["modal-help", "modal-archive", "modal-results"];

  function openModal(id) {
    closeModals();                       // only ever one open at a time
    if (id === "modal-archive") buildArchive();
    document.getElementById(id).hidden = false;
    if (id === "modal-results") startCountdown();
  }
  function closeModals() {
    MODALS.forEach(function (id) {
      var m = document.getElementById(id);
      if (m) m.hidden = true;
    });
    stopCountdown();
  }

  /* ── Wiring ────────────────────────────────────────────── */
  el.submit.addEventListener("click", submit);
  el.shuffle.addEventListener("click", function () {
    order = shuffle(order);
    render();
    persist();
  });
  el.deselect.addEventListener("click", function () { selected = []; render(); });
  el.share.addEventListener("click", share);
  el.next.addEventListener("click", function () { openModal("modal-archive"); });

  document.getElementById("btn-share-modal").addEventListener("click", share);
  document.getElementById("btn-archive-modal")
    .addEventListener("click", function () { openModal("modal-archive"); });

  document.getElementById("btn-help").addEventListener("click", function () { openModal("modal-help"); });
  document.getElementById("btn-archive").addEventListener("click", function () { openModal("modal-archive"); });

  document.querySelectorAll("[data-close]").forEach(function (b) {
    b.addEventListener("click", closeModals);
  });
  document.querySelectorAll(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) { if (e.target === m) closeModals(); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModals();
    if (e.key === "Enter" && !el.submit.disabled) submit();
  });

  var repoLink = document.getElementById("repo-link");
  if (repoLink) repoLink.href = REPO_URL;

  /* ── Go ────────────────────────────────────────────────── */
  if (!PUZZLES.length) {
    el.board.innerHTML = "<p>No puzzles loaded. Check data/puzzles.js</p>";
  } else {
    start(todaysIndex(), true);
    // First-time visitors get the rules.
    var st = loadStore();
    if (!st.seenHelp) {
      openModal("modal-help");
      st.seenHelp = true;
      saveStore(st);
    }
  }

  // Exposed for the test harness in tests/validate.js
  window.__CANNECTIONS_TEST__ = { rng: rng, shuffle: shuffle, daysBetween: daysBetween };
})();
