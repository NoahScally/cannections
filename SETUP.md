# Getting CAN-nections onto GitHub (Windows, from scratch)

You said you're not sure whether you have git or the GitHub CLI. This walks through all of
it. Every tool here is free.

---

## What GitHub Pages actually is

GitHub Pages is free static web hosting attached to any GitHub repo. You flip a switch in
the repo settings, point it at a branch, and GitHub serves the files in that branch at
`https://<your-username>.github.io/<repo-name>/`. Every time you push, it redeploys in
about a minute.

The catch — and the reason it fits this project perfectly — is that it serves **files, not
programs**. There's no server process. It hands the browser your HTML, CSS, JS and data
files exactly as they sit in the repo. That's why CAN-nections computes the daily puzzle in
the browser instead of asking a backend.

Cost: $0, no card, no limits you'll hit. Public repos get Pages on the free tier.

---

## About EJS

Short answer: skip it.

EJS is a **server-side / build-time** templating engine — it turns `.ejs` files into HTML by
running Node. Two problems here:

1. **Pages can't run it.** GitHub Pages only serves static files. You'd need a build step
   (a GitHub Action that runs EJS and commits the output) just to get back to the HTML you
   already have.
2. **There's nothing to template.** EJS earns its keep when you're generating many similar
   pages from data — 200 product pages, a blog. CAN-nections is *one* page whose content is
   assembled by JavaScript at runtime. Templating happens in `render()` in `game.js`.

If the project later grows a page-per-puzzle archive for SEO (`/puzzle/14/`), that's the
moment to add a static generator — and even then I'd reach for Eleventy over raw EJS, since
Eleventy handles the file-walking and *can* use EJS as its template language.

For now: no build step, no `node_modules`, no CI. Push and it's live.

---

## Step 1 — Install Git

Download from [git-scm.com/download/win](https://git-scm.com/download/win) and run the
installer. Accept every default.

Open a new PowerShell window and check:

```powershell
git --version
```

If you get a version number, you're good.

---

## Step 2 — Install GitHub CLI

This is the piece that makes everything else painless — it handles authentication, so you
never deal with tokens or password prompts.

```powershell
winget install --id GitHub.cli
```

Close and reopen PowerShell, then:

```powershell
gh --version
```

(If `winget` isn't available, grab the `.msi` from
[cli.github.com](https://cli.github.com/).)

---

## Step 3 — Sign in

```powershell
gh auth login
```

Answer the prompts:

- **What account?** → `GitHub.com`
- **Preferred protocol?** → `HTTPS`
- **Authenticate Git with your GitHub credentials?** → **`Yes`** ← this one matters, it's
  what lets `git push` work without asking for a password
- **How to authenticate?** → `Login with a web browser`

It shows an eight-character code. Press Enter, paste the code in the browser, approve.

Verify:

```powershell
gh auth status
```

Set your commit identity while you're here:

```powershell
git config --global user.name  "Noah Scally"
git config --global user.email "scallynoah@gmail.com"
```

---

## Step 4 — Create the repo and push

Move the `cannections` folder somewhere permanent first (e.g. `C:\Users\scall\code\cannections`),
then:

```powershell
cd C:\Users\scall\code\cannections

git init -b main
git add -A
git commit -m "CAN-nections: initial commit"

gh repo create cannections --public --source=. --remote=origin --push
```

That last command creates the GitHub repo, wires it up as `origin`, and pushes — in one go.

---

## Step 5 — Turn on Pages

```powershell
gh api -X POST repos/:owner/cannections/pages -f "source[branch]=main" -f "source[path]=/"
```

Or click through the UI: **repo → Settings → Pages → Source: Deploy from a branch →
Branch: `main` / `(root)` → Save**.

Wait ~60 seconds, then your game is live at:

```
https://<your-github-username>.github.io/cannections/
```

Once you know that URL, put it in two places so the share button and footer link work:

- `js/game.js` → `SITE_URL` and `REPO_URL` at the top
- then `git add -A && git commit -m "Add live URL" && git push`

---

## Step 6 — Everyday workflow

```powershell
node tests/validate.js          # check your new puzzles
git add -A
git commit -m "Add puzzles 13-18"
git push
```

Live in about a minute.

---

## Can Claude Code push automatically?

**Yes — but not from this Cowork session.** Worth being precise about why, because it's the
part people get wrong.

### Why not here

What I'm running in right now has two separate filesystems:

- The **file tools** write to your real Windows folder — that's where `cannections` is.
- The **shell** runs in an isolated Linux sandbox that has no access to your GitHub
  credentials, and no `git` identity of yours.

So I can *write* the repo for you (done), but I can't run `git push` as you.

### How to get automatic pushes

Install **Claude Code**, the terminal tool. It runs directly on your machine, uses your
local git config and your `gh` authentication, and can commit and push on its own.

```powershell
npm install -g @anthropic-ai/claude-code
cd C:\Users\scall\code\cannections
claude
```

(Needs Node.js — [nodejs.org](https://nodejs.org/), take the LTS installer.)

### The one-command version

`bootstrap.ps1` checks every prerequisite above, installs what's missing, runs all three
test suites, and then launches Claude Code pointed at `PLAN.md`:

```powershell
cd C:\Users\scall\code\cannections
powershell -ExecutionPolicy Bypass -File .\bootstrap.ps1
```

It won't launch if anything is broken — it prints exactly what to fix and exits. To check
readiness without launching:

```powershell
powershell -ExecutionPolicy Bypass -File .\bootstrap.ps1 -CheckOnly
```

It defaults to Opus 5. Override with `-Model claude-sonnet-5` for cheaper grunt work.

### Or by hand

```powershell
claude --model claude-opus-5
```

Then:

> Read CLAUDE.md and PLAN.md, then execute PLAN.md starting at Phase 0. Work phase by
> phase, running `npm test` and pushing after each. Stop and ask me before Phase 5.

**Auto-push is already wired up.** Three pieces are in the repo, and they work together:

**1. `.claude/settings.json`** — pre-approves the commands. It's checked in, so the
automation is reproducible rather than living in your head. Claude can run the tests and
ordinary git operations without stopping to ask, and nothing else. Destructive git
(`push --force`, `reset --hard`, `clean -fd`) is in the `deny` list, and deny always beats
allow — so even if you later widen the allowlist, those stay blocked.

Personal tweaks go in `.claude/settings.local.json`, which is gitignored.

You *can* also toggle blanket auto-approval for a session with **Shift+Tab**, but I'd stick
with the allowlist. It automates the commands you actually want automated instead of
everything, which matters the first time a command surprises you.

**2. `CLAUDE.md`** — the rules Claude Code reads every session. It says to commit and push
without asking, one logical change per commit, imperative subjects, never push red, never
force-push, and never bypass the hook. It also carries the puzzle-authoring rules so new
puzzles come out consistent.

**3. `.githooks/pre-commit`** — the safety net under the automation. Runs the puzzle
validator and the contrast gate, and refuses the commit if either fails. This is the piece
that makes auto-push safe: it doesn't matter who typed the commit, broken data can't reach
`main`. Enable it once per clone:

```powershell
git config core.hooksPath .githooks
```

Together: Claude does the work, the hook decides whether it's allowed to land, and `main`
stays deployable.

### The other option: a GitHub Action

If you want pushes to *trigger* work rather than Claude doing the pushing, add
[Claude Code Action](https://github.com/anthropics/claude-code-action) to the repo. Then you
`@claude` in an issue or PR comment and it opens a PR with the change. Different shape —
good for "review this puzzle submission from a stranger", overkill for solo work.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `git: command not found` | Reopen PowerShell after installing — PATH is only read at launch. |
| Push asks for a password | `gh auth login` again and answer **Yes** to "Authenticate Git with your GitHub credentials". GitHub killed password auth in 2021. |
| Pages shows 404 | Give it 2 minutes. Then check Settings → Pages says branch `main`, folder `/ (root)`. |
| Page loads but no tiles | Open DevTools console (F12). Almost always a typo in `data/puzzles.js` — run `node tests/validate.js`. |
| Styles missing on Pages, fine locally | Pages is case-sensitive, Windows isn't. Check `css/styles.css` matches exactly. |
