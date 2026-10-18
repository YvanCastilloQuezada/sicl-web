#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="BKH4_TX_001_PHASE_A_OUTPUTS.txt"
: > "$OUT"
run_cmd() {
  local label="$1"
  shift
  printf '\n## %s\nCOMMAND: %s\n' "$label" "$*" | tee -a "$OUT"
  "$@" >> "$OUT" 2>&1
  local code=$?
  echo "EXIT_CODE=$code" | tee -a "$OUT"
}
run_cmd "pnpm check" pnpm check
run_cmd "pnpm build" pnpm build
run_cmd "BKH-1" pnpm tsx scripts/test-bkh1-relationship-fabric.ts
run_cmd "BKH-2" pnpm tsx scripts/test-bkh2-constraint-engine.ts
run_cmd "BKH-3" pnpm tsx scripts/test-bkh3-regeneration-engine.ts
run_cmd "BKH-3 corrective" pnpm tsx scripts/test-bkh3-corrective.ts
run_cmd "BKH4 foundation" pnpm tsx scripts/test-bkh4-foundation.ts
run_cmd "BKH4-3 simulation" pnpm tsx scripts/test-bkh4-3-simulation.ts
run_cmd "persistence formal" pnpm tsx scripts/test-persistence-formal.ts
run_cmd "persistence contract" pnpm tsx scripts/test-persistence-idb.ts
printf '\n## SUMMARY\n'
grep -E '^(## |EXIT_CODE=|\{"status")' "$OUT" | tail -80
