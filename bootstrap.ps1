<#
    CAN-nections bootstrap
    ----------------------
    Checks prerequisites, then hands the repo to Claude Code to execute PLAN.md.

    Run from the repo folder:

        powershell -ExecutionPolicy Bypass -File .\bootstrap.ps1

    This script deliberately does NOT create the repo or enable Pages — that's
    Phase 0 of PLAN.md, and Claude Code does it so the work is logged in one
    place. All this does is make sure the tools exist and you're signed in.
#>

[CmdletBinding()]
param(
    # Skip launching Claude Code; just report readiness.
    [switch]$CheckOnly,

    # Model to run. Opus 5 is the default; override if you want.
    [string]$Model = "claude-opus-5"
)

$ErrorActionPreference = "Stop"
$repo = $PSScriptRoot
Set-Location $repo

function Say($msg)  { Write-Host "  $msg" }
function Ok($msg)   { Write-Host "  [ok]   $msg"   -ForegroundColor Green }
function Warn($msg) { Write-Host "  [warn] $msg"   -ForegroundColor Yellow }
function Bad($msg)  { Write-Host "  [X]    $msg"   -ForegroundColor Red }
function Head($msg) { Write-Host ""; Write-Host $msg -ForegroundColor Cyan }

function Have($name) { $null -ne (Get-Command $name -ErrorAction SilentlyContinue) }

$blockers = @()

Write-Host ""
Write-Host "CAN-nections bootstrap" -ForegroundColor White
Write-Host "Repo: $repo"

# ── 1. Sanity: are we actually in the repo? ────────────────────────
Head "Checking repo contents"
foreach ($f in @("index.html", "PLAN.md", "CLAUDE.md", "data\puzzles.js", "package.json")) {
    if (Test-Path (Join-Path $repo $f)) { Ok $f }
    else { Bad "$f missing"; $blockers += "Run this from inside the cannections folder." }
}

# ── 2. Tooling ─────────────────────────────────────────────────────
Head "Checking tooling"

if (Have git)  { Ok "git    $((git --version) -replace 'git version ','')" }
else { Bad "git not found"; $blockers += "Install Git: https://git-scm.com/download/win" }

if (Have node) { Ok "node   $(node --version)" }
else { Bad "node not found"; $blockers += "Install Node LTS: https://nodejs.org/" }

if (Have gh)   { Ok "gh     $((gh --version | Select-Object -First 1) -replace 'gh version ','')" }
else { Bad "gh not found"; $blockers += "Install GitHub CLI: winget install --id GitHub.cli" }

# ── 3. GitHub auth ─────────────────────────────────────────────────
Head "Checking GitHub authentication"
if (Have gh) {
    gh auth status 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $who = (gh api user --jq .login 2>$null)
        Ok "signed in as $who"

        # git credential helper — this is what makes `git push` silent
        $helper = git config --get credential.https://github.com.helper 2>$null
        if (-not $helper) {
            Warn "git isn't using your gh credentials yet"
            Say  "fixing: gh auth setup-git"
            gh auth setup-git
            Ok   "git credential helper configured"
        } else {
            Ok "git credential helper configured"
        }
    } else {
        Bad "not signed in"
        $blockers += "Run: gh auth login   (choose HTTPS, and answer Yes to 'Authenticate Git with your GitHub credentials')"
    }
}

# ── 4. Commit identity ─────────────────────────────────────────────
Head "Checking commit identity"
$name  = git config --global user.name  2>$null
$email = git config --global user.email 2>$null
if ($name)  { Ok "user.name  = $name" }  else { Warn "user.name not set";  $blockers += 'Run: git config --global user.name "Your Name"' }
if ($email) { Ok "user.email = $email" } else { Warn "user.email not set"; $blockers += 'Run: git config --global user.email "you@example.com"' }

# ── 5. Dev dependencies + test suites ──────────────────────────────
Head "Checking test suites"
if (Have node) {
    if (-not (Test-Path (Join-Path $repo "node_modules\jsdom"))) {
        Say "installing jsdom (dev-only)…"
        npm install --silent 2>&1 | Out-Null
    }
    if (Test-Path (Join-Path $repo "node_modules\jsdom")) { Ok "jsdom installed" }
    else { Warn "jsdom missing — DOM suite will self-skip" }

    node tests\validate.js  2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Ok "puzzle validator passes" } else { Bad "puzzle validator FAILS"; $blockers += "Run: node tests\validate.js" }

    node tests\contrast.js  2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Ok "contrast gate passes" }    else { Bad "contrast gate FAILS";    $blockers += "Run: node tests\contrast.js" }

    node tests\dom.js       2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Ok "DOM suite passes" }        else { Bad "DOM suite FAILS";        $blockers += "Run: node tests\dom.js" }
}

# ── 6. Claude Code ─────────────────────────────────────────────────
Head "Checking Claude Code"
if (Have claude) {
    Ok "claude installed"
} elseif (Have npm) {
    Warn "not installed — installing now"
    npm install -g @anthropic-ai/claude-code
    if (Have claude) { Ok "claude installed" }
    else { Bad "install failed"; $blockers += "Run manually: npm install -g @anthropic-ai/claude-code" }
}

# ── Report ─────────────────────────────────────────────────────────
Write-Host ""
if ($blockers.Count -gt 0) {
    Write-Host "Not ready. Fix these first:" -ForegroundColor Red
    $blockers | Select-Object -Unique | ForEach-Object { Write-Host "   - $_" }
    Write-Host ""
    exit 1
}

Write-Host "Ready." -ForegroundColor Green

if ($CheckOnly) {
    Write-Host "  (-CheckOnly set, not launching)"
    exit 0
}

# ── Hand off to Claude Code ────────────────────────────────────────
$prompt = @'
Read CLAUDE.md and PLAN.md, then execute PLAN.md starting at Phase 0.

Work phase by phase, in order. For each phase: do the work, run `npm test`,
commit, push, then tick the checkboxes in PLAN.md before moving on.

Git and test commands are pre-approved in .claude/settings.json — run them
without asking. Do not force-push. Do not use --no-verify. Do not push a
failing tree.

Stop and ask me before starting Phase 5.

If something blocks you, say what it is and stop rather than working around it.
'@

Head "Launching Claude Code ($Model)"
Write-Host ""

claude --model $Model $prompt
