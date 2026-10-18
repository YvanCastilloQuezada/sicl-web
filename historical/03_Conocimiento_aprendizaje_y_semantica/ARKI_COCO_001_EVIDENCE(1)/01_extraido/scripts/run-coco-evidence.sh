#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="COCO/OUTPUTS/COCO_OUTPUTS.txt"
: > "$OUT"
run_cmd() { local label="$1"; shift; { echo "## $label"; echo "COMMAND: $*"; "$@"; echo "EXIT_CODE=$?"; } >> "$OUT" 2>&1; }
run_cmd "pnpm check" pnpm check
run_cmd "COCO-A/B/C/D suite" pnpm tsx scripts/test-coco.ts
run_cmd "PA-001 regression" pnpm tsx scripts/test-architectural-program.ts
run_cmd "E8-A regression" pnpm tsx scripts/test-e8a-dossier.ts
run_cmd "E8-B regression" pnpm tsx scripts/test-e8b-assets.ts
run_cmd "E8-C regression" pnpm tsx scripts/test-e8c-gate.ts
run_cmd "BKH4 foundation regression" pnpm tsx scripts/test-bkh4-foundation.ts
run_cmd "E5 closure regressions" bash -c 'pnpm tsx scripts/test-e5-close-snapshot.ts && pnpm tsx scripts/test-e5-close-viewpoint.ts && pnpm tsx scripts/test-e5-close-comparison-controls.ts'
run_cmd "E7 regression" pnpm tsx scripts/test-e7.ts
run_cmd "pnpm build" pnpm build
{
 echo "## SUMMARY"
 grep -c 'EXIT_CODE=0' "$OUT" | sed 's/^/PASS_COMMANDS=/'
 grep -c 'EXIT_CODE=[1-9]' "$OUT" | sed 's/^/FAIL_COMMANDS=/'
 if grep -q 'EXIT_CODE=[1-9]' "$OUT"; then echo "OVERALL=FAIL"; else echo "OVERALL=PASS"; fi
} >> "$OUT"
cat "$OUT"
