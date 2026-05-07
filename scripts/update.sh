#!/usr/bin/env bash
#
# Master Of Slide — one-command updater.
#
# What it does (in order):
#   1. Pulls the latest code from origin/main (fast-forward only).
#   2. Reinstalls workspace deps.
#   3. Rebuilds @open-slide/core so the dev server picks up plugin changes.
#   4. Re-syncs the /slide skill into ~/.claude/skills and ~/.codex/skills.
#   5. Restarts the LaunchAgent (com.openslide.dev) if one is loaded so the
#      running dev server reloads with the new code.
#
# Usage:
#   ./scripts/update.sh           # default: update from origin/main
#   ./scripts/update.sh --branch foo  # pull a different branch
#   ./scripts/update.sh --no-restart  # skip the LaunchAgent restart
#
# Exit codes:
#   0 = success
#   non-zero = some step failed; later steps are skipped.

set -euo pipefail

BRANCH=""
RESTART=1
while [ $# -gt 0 ]; do
  case "$1" in
    --branch) BRANCH="$2"; shift 2 ;;
    --no-restart) RESTART=0; shift ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "Unknown flag: $1" >&2; exit 2 ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

step() { printf '\n\033[1;36m▸ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
# If --branch wasn't passed, default to whatever branch we're already on so
# users on a feature branch don't accidentally pull main on top.
if [ -z "$BRANCH" ]; then
  BRANCH="$CURRENT_BRANCH"
fi

if [ "$BRANCH" != "$CURRENT_BRANCH" ]; then
  step "Switching from '$CURRENT_BRANCH' to '$BRANCH'"
  git checkout "$BRANCH"
fi

step "Pulling origin/$BRANCH"
git fetch origin "$BRANCH"
if ! git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
  warn "origin/$BRANCH does not exist — nothing to pull. Skipping."
else
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse "origin/$BRANCH")
  if [ "$LOCAL" = "$REMOTE" ]; then
    ok "Already up to date ($LOCAL)"
  elif git merge-base --is-ancestor "$LOCAL" "$REMOTE"; then
    ahead=$(git rev-list --count "$LOCAL..$REMOTE")
    ok "$ahead new commit(s) available — fast-forwarding"
    git merge --ff-only "origin/$BRANCH"
  else
    behind=$(git rev-list --count "$LOCAL..$REMOTE")
    ahead_local=$(git rev-list --count "$REMOTE..$LOCAL")
    warn "Branch '$BRANCH' has diverged ($ahead_local local / $behind remote)."
    warn "Skipping git pull — resolve manually with: git pull --rebase origin $BRANCH"
  fi
fi

step "Installing workspace dependencies"
pnpm install --silent
ok "Dependencies in sync"

step "Rebuilding @open-slide/core"
pnpm --filter @open-slide/core build >/dev/null
ok "Core rebuilt"

step "Re-syncing /slide skill into ~/.claude and ~/.codex"
pnpm install:agents >/dev/null
ok "Skills re-installed"

if [ "$RESTART" = 1 ]; then
  step "Restarting LaunchAgent (if loaded)"
  if launchctl list | grep -q com.openslide.dev; then
    if launchctl kickstart -k "gui/$(id -u)/com.openslide.dev" 2>/dev/null; then
      ok "LaunchAgent restarted"
    else
      warn "kickstart failed — try: launchctl unload then load the plist manually"
    fi
  else
    warn "com.openslide.dev not loaded — skipping restart"
  fi
fi

step "Done"
git --no-pager log --oneline -1
echo
echo "Open http://127.0.0.1:5173/ to see the updated build."
