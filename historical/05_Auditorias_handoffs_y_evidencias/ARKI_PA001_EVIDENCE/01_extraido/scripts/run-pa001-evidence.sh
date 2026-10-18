#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="PA001_OUTPUTS.txt"
: > "$OUT"
run_cmd() { local label="$1"; shift; { echo "## $label"; echo "COMMAND: $*"; "$@"; echo "EXIT_CODE=$?"; } >> "$OUT" 2>&1; }
run_cmd "pnpm check" pnpm check
run_cmd "architectural program suite" pnpm tsx scripts/test-architectural-program.ts
run_cmd "pnpm build" pnpm build
{
 echo "## SUMMARY"
 grep -c 'EXIT_CODE=0' "$OUT" | sed 's/^/PASS_COMMANDS=/'
 grep -c 'EXIT_CODE=[1-9]' "$OUT" | sed 's/^/FAIL_COMMANDS=/'
 if grep -q 'EXIT_CODE=[1-9]' "$OUT"; then echo "OVERALL=FAIL"; else echo "OVERALL=PASS"; fi
} >> "$OUT"
cat "$OUT"
