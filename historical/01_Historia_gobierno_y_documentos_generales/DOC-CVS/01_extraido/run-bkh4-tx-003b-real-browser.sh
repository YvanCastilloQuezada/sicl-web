#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-4179}"
CDP_PORT="${CDP_PORT:-9227}"
PROFILE="/tmp/arki-tx003b-chromium-${CDP_PORT}"
OUT="$ROOT/BKH4_TX_003B_R_BROWSER_OUTPUT.txt"
rm -rf "$PROFILE"
pnpm exec esbuild scripts/test-bkh4-tx-003b-browser.ts --bundle --format=iife --platform=browser --outfile=/tmp/arki-tx003b-browser.js
cat >/tmp/arki-tx003b-browser.html <<'HTML'
<!doctype html><html><body><script src="/arki-tx003b-browser.js"></script></body></html>
HTML
python3 -m http.server "$PORT" --directory /tmp >/tmp/arki-tx003b-http.log 2>&1 &
SERVER_PID=$!
chromium --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --remote-debugging-port="$CDP_PORT" --user-data-dir="$PROFILE" about:blank >/tmp/arki-tx003b-chromium.log 2>&1 &
CHROME_PID=$!
cleanup() { kill "$CHROME_PID" "$SERVER_PID" 2>/dev/null || true; rm -rf "$PROFILE"; }
trap cleanup EXIT
sleep 2
node scripts/tx003b-cdp.mjs "$CDP_PORT" "http://127.0.0.1:${PORT}/arki-tx003b-browser.html" | tee "$OUT"
