#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="E6_OUTPUTS.txt"
: > "$OUT"
run_cmd() { local label="$1"; shift; { echo "## $label"; echo "COMMAND: $*"; "$@"; echo "EXIT_CODE=$?"; } >> "$OUT" 2>&1; }
run_cmd "pnpm check" pnpm check
for file in scripts/test-persistence-idb.ts scripts/test-persistence-formal.ts scripts/test-ifc4-globalid.ts scripts/test-ifc4-exporter.ts scripts/test-ifc4-fixtures.ts scripts/test-ifc4-web-ifc.ts scripts/test-scene-model.ts scripts/test-scene-model-mount.ts scripts/test-scene-comparison.ts; do run_cmd "E6 ${file#scripts/}" pnpm tsx "$file"; done
run_cmd "E6 generate evidence" pnpm tsx scripts/generate-e6-evidence.ts
for file in scripts/test-constructive.ts scripts/test-scene-model.ts scripts/test-scene-comparison.ts scripts/test-e5-close-snapshot.ts scripts/test-e5-close-viewpoint.ts scripts/test-e5-close-comparison-controls.ts; do run_cmd "E5 regression ${file#scripts/}" pnpm tsx "$file"; done
run_cmd "E7 regression" pnpm tsx scripts/test-e7.ts
for file in scripts/test-e8a-dossier.ts scripts/test-e8b-assets.ts scripts/test-e8c-gate.ts; do run_cmd "E8 regression ${file#scripts/}" pnpm tsx "$file"; done
run_cmd "pnpm build" pnpm build
{
 echo "## SUMMARY"
 grep -c 'EXIT_CODE=0' "$OUT" | sed 's/^/PASS_COMMANDS=/'
 grep -c 'EXIT_CODE=[1-9]' "$OUT" | sed 's/^/FAIL_COMMANDS=/'
 if grep -q 'EXIT_CODE=[1-9]' "$OUT"; then echo "OVERALL=FAIL"; else echo "OVERALL=PASS"; fi
} >> "$OUT"
cat "$OUT"
