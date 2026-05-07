# Always-on dev server (macOS LaunchAgent)

`pnpm dev:demo` is great while you're at the desk, but if you want the slide
viewer at `http://127.0.0.1:5173/` to be **always available** — survive
logout, sleep/wake, and accidental crashes — register the dev server as a
LaunchAgent.

## 1. Create the plist

Save this to `~/Library/LaunchAgents/com.openslide.dev.plist`. Edit the
absolute paths to match your environment (run `which pnpm` and `which node`
to find yours).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openslide.dev</string>

    <key>ProgramArguments</key>
    <array>
        <string>/PATH/TO/pnpm</string>
        <string>dev</string>
        <string>--host</string>
        <string>127.0.0.1</string>
    </array>

    <key>WorkingDirectory</key>
    <string>/PATH/TO/master-of-slide/apps/demo</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    </dict>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
        <key>Crashed</key>
        <true/>
    </dict>

    <key>ThrottleInterval</key>
    <integer>10</integer>

    <key>StandardOutPath</key>
    <string>/Users/YOU/Library/Logs/open-slide-dev.log</string>

    <key>StandardErrorPath</key>
    <string>/Users/YOU/Library/Logs/open-slide-dev.error.log</string>

    <key>ProcessType</key>
    <string>Background</string>
</dict>
</plist>
```

## 2. Load it

```bash
plutil -lint ~/Library/LaunchAgents/com.openslide.dev.plist   # validate
launchctl load -w ~/Library/LaunchAgents/com.openslide.dev.plist
```

After ~10 seconds:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5173/   # → 200
```

## 3. Operate

| Action | Command |
|--------|---------|
| Pause | `launchctl stop com.openslide.dev` (auto-restarts) |
| Stop permanently | `launchctl unload ~/Library/LaunchAgents/com.openslide.dev.plist` |
| Force restart | `launchctl kickstart -k gui/$(id -u)/com.openslide.dev` |
| Tail logs | `tail -f ~/Library/Logs/open-slide-dev.log` |
| Errors only | `tail -f ~/Library/Logs/open-slide-dev.error.log` |

## 4. Updating with `pnpm refresh`

Once the LaunchAgent is loaded, [`pnpm refresh`](../scripts/update.sh) handles
the whole sync flow — `git pull`, `pnpm install`, core rebuild, skill
re-install, and a `kickstart` of the agent so the new build is live within
seconds. No need to touch launchctl manually after the first time.

## Common gotchas

- **`localhost` works but `127.0.0.1` doesn't.** macOS Vite often binds to
  `::1` (IPv6) only. Pass `--host 127.0.0.1` (this plist already does that)
  to bind to IPv4 explicitly.
- **`packages/core/dist/cli/bin.js` not found.** The core hasn't been built
  yet — run `pnpm --filter @open-slide/core build` once after cloning, or
  just run `pnpm refresh`.
- **Agent loaded but server isn't up.** Check the error log: usually a
  missing dep (`pnpm install`) or the wrong PATH for pnpm/node. The plist's
  `EnvironmentVariables.PATH` must include the directory containing pnpm.
