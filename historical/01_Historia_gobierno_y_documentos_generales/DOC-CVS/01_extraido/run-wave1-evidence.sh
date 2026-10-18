#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="WAVE1_OUTPUTS.txt"
: > "$OUT"
run_cmd() {
  local label="$1"; shift
  printf '\n## %s\n' "$label" >> "$OUT"
  printf 'COMMAND=%q ' "$@" >> "$OUT"; printf '\n' >> "$OUT"
  "$@" >> "$OUT" 2>&1
  local code=$?
  printf 'EXIT_CODE=%s\n' "$code" >> "$OUT"
  return 0
}
run_cmd "pnpm check" pnpm check
run_cmd "pnpm build" pnpm build
run_cmd "WAVE1 foundation and DAG" pnpm tsx scripts/test-wave1-foundation.ts
run_cmd "WAVE0 registry regression" python3 scripts/test-c1c80-wave0.py
run_cmd "CAD gateway regression" pnpm tsx scripts/test-arki-cad-gateway.ts
run_cmd "E8-A regression" pnpm tsx scripts/test-e8a-dossier.ts
run_cmd "E8-B regression" pnpm tsx scripts/test-e8b-assets.ts
printf '\n## SCOPE GUARD\nTX005=NOT_EXECUTED\nLEGACY_WRITER_MIGRATION=NOT_EXECUTED\nWAVE2=NOT_EXECUTED\nSOLVERS=NOT_INSTALLED\nENTERPRISE=NOT_IMPLEMENTED\nDEPLOY=NOT_EXECUTED\nPRODUCT_CANONICAL_MUTATION=NOT_EXECUTED\n' >> "$OUT"
if grep -q 'EXIT_CODE=[1-9]' "$OUT"; then
  echo 'WAVE1_OVERALL=FAIL' >> "$OUT"
else
  echo 'WAVE1_OVERALL=PASS' >> "$OUT"
fi
cat "$OUT"
exit 0
