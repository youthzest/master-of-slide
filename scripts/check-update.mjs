#!/usr/bin/env node
/*
 * Master Of Slide — silent update notifier.
 *
 * Runs at the start of `pnpm dev` (and `pnpm refresh`'s tail) to tell the
 * user when the local clone is behind origin/main. Designed to be:
 *
 *   - Non-blocking (always exits 0; never delays dev startup more than ~3s)
 *   - Offline-safe (network failures are silent)
 *   - Optional (set OPENSLIDE_NO_UPDATE_CHECK=1 to skip entirely)
 *   - Polite (no banner if the clone is already up to date)
 *
 * What it prints when the clone is behind:
 *
 *   ──────────────────────────────────────────────────────────────────────
 *     💡 Master Of Slide is 5 commits behind origin/main.
 *     Run  pnpm refresh  to pull and rebuild.
 *     Recent commits:
 *       a205523 fix(mp4): probe-driven frame-aligned segments
 *       5fdf2c1 fix(styles): hoist CDN @import above tailwind entries
 *       ...
 *     (silence with OPENSLIDE_NO_UPDATE_CHECK=1)
 *   ──────────────────────────────────────────────────────────────────────
 */

import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// Hard timeout on every git command. We never want to delay dev start.
const STEP_TIMEOUT_MS = 3000;

// Number of recent remote commits to preview when we're behind.
const PREVIEW_COMMITS = 5;

const COLORS = {
  dim: '[2m',
  bold: '[1m',
  cyan: '[36m',
  yellow: '[33m',
  green: '[32m',
  reset: '[0m',
};

function silentExit() {
  process.exit(0);
}

function dim(s) {
  return process.stdout.isTTY ? `${COLORS.dim}${s}${COLORS.reset}` : s;
}

function bold(s) {
  return process.stdout.isTTY ? `${COLORS.bold}${s}${COLORS.reset}` : s;
}

function cyan(s) {
  return process.stdout.isTTY ? `${COLORS.cyan}${s}${COLORS.reset}` : s;
}

function yellow(s) {
  return process.stdout.isTTY ? `${COLORS.yellow}${s}${COLORS.reset}` : s;
}

async function git(args) {
  return exec('git', args, {
    cwd: REPO_ROOT,
    timeout: STEP_TIMEOUT_MS,
    windowsHide: true,
  });
}

async function main() {
  if (process.env.OPENSLIDE_NO_UPDATE_CHECK === '1') {
    silentExit();
  }

  // Skip when the script is run outside a git checkout (e.g. someone vendored
  // the repo as a tarball).
  if (!existsSync(resolve(REPO_ROOT, '.git'))) {
    silentExit();
  }

  // Determine current branch. If we're not on a real branch (detached HEAD,
  // rebase mid-flight, etc.) skip — the user has more important things going.
  let branch;
  try {
    const { stdout } = await git(['rev-parse', '--abbrev-ref', 'HEAD']);
    branch = stdout.trim();
    if (!branch || branch === 'HEAD') silentExit();
  } catch {
    silentExit();
  }

  // Best-effort fetch. --quiet hides the network spinner on slow links;
  // failures (offline, no remote) are swallowed.
  try {
    await git(['fetch', '--quiet', 'origin', branch]);
  } catch {
    silentExit();
  }

  // Confirm origin/<branch> exists locally after fetch.
  try {
    await git(['rev-parse', '--verify', `origin/${branch}`]);
  } catch {
    silentExit();
  }

  // Count commits we don't have yet.
  let behind = 0;
  let ahead = 0;
  try {
    const { stdout } = await git([
      'rev-list',
      '--left-right',
      '--count',
      `HEAD...origin/${branch}`,
    ]);
    const parts = stdout.trim().split(/\s+/);
    if (parts.length === 2) {
      ahead = Number.parseInt(parts[0], 10) || 0;
      behind = Number.parseInt(parts[1], 10) || 0;
    }
  } catch {
    silentExit();
  }

  if (behind === 0) {
    silentExit();
  }

  // Pull a small commit preview to make the notice actionable, not nagging.
  let preview = '';
  try {
    const { stdout } = await git([
      'log',
      '--no-merges',
      '--pretty=format:  %h %s',
      `-${PREVIEW_COMMITS}`,
      `HEAD..origin/${branch}`,
    ]);
    preview = stdout.trimEnd();
  } catch {
    preview = '';
  }

  const aheadNote =
    ahead > 0
      ? dim(`(you are ${ahead} commit${ahead === 1 ? '' : 's'} ahead — push or rebase as needed)`)
      : '';

  const lines = [];
  const rule = '─'.repeat(70);
  lines.push('');
  lines.push(dim(rule));
  lines.push(
    `  ${yellow('💡')} ${bold('Master Of Slide')} is ${bold(`${behind} commit${behind === 1 ? '' : 's'} behind`)} ${cyan(`origin/${branch}`)}.`,
  );
  lines.push(`     Run  ${bold(cyan('pnpm refresh'))}  to pull and rebuild.`);
  if (preview) {
    lines.push('');
    lines.push(`     ${dim('Recent upstream commits:')}`);
    lines.push(
      preview
        .split('\n')
        .map((line) => `   ${line}`)
        .join('\n'),
    );
  }
  if (aheadNote) {
    lines.push('');
    lines.push(`     ${aheadNote}`);
  }
  lines.push('');
  lines.push(`     ${dim('(silence with OPENSLIDE_NO_UPDATE_CHECK=1)')}`);
  lines.push(dim(rule));
  lines.push('');

  process.stdout.write(`${lines.join('\n')}\n`);
  silentExit();
}

// Top-level guard: any unexpected throw should still exit 0.
main().catch(() => silentExit());
