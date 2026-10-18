#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="ARKI_COCO_EXAM_002_REGRESSIONS.txt"
: > "$OUT"
run_cmd() {
  label="$1"; shift
  printf '\n## %s\nCOMMAND: %q ' "$label" "$1" >> "$OUT"
  printf '%q ' "$@" >> "$OUT"
  printf '\n' >> "$OUT"
  "$@" >> "$OUT" 2>&1
  code=$?
  printf 'EXIT_CODE=%s\n' "$code" >> "$OUT"
}
run_cmd "pnpm check" pnpm check
run_cmd "pnpm build" pnpm build
run_cmd "COCO core" pnpm tsx scripts/test-coco.ts
run_cmd "COCO express" pnpm tsx scripts/test-coco-express-002.ts
run_cmd "architectural program" pnpm tsx scripts/test-architectural-program.ts
run_cmd "NEXUS baseline" pnpm tsx scripts/test-coco-exam-001.ts
run_cmd "TRANSFER-002 R1" pnpm tsx scripts/test-coco-exam-001-r1.ts
run_cmd "BKH1" pnpm tsx scripts/test-bkh1-relationship-fabric.ts
run_cmd "BKH2" pnpm tsx scripts/test-bkh2-constraint-engine.ts
run_cmd "BKH3" pnpm tsx scripts/test-bkh3-regeneration-engine.ts
run_cmd "BKH4 foundation" pnpm tsx scripts/test-bkh4-foundation.ts
run_cmd "TX-003A" pnpm tsx scripts/test-bkh4-tx-003a-repository.ts
run_cmd "TX-003B persistence" pnpm tsx scripts/test-bkh4-tx-003b-persistence.ts
run_cmd "TX-003C" pnpm tsx scripts/test-bkh4-tx-003c-cas-idempotency.ts
run_cmd "TX-004" pnpm tsx scripts/test-bkh4-tx-004-reversal.ts
run_cmd "PF-H01 source lock" test -s ARKI_FOUNDATIONAL_PRINCIPLE_PF-H01_LOCK.json
run_cmd "E5 close snapshot" pnpm tsx scripts/test-e5-close-snapshot.ts
run_cmd "E5 close viewpoint" pnpm tsx scripts/test-e5-close-viewpoint.ts
run_cmd "E5 comparison" pnpm tsx scripts/test-e5-close-comparison-controls.ts
run_cmd "E6 IFC fixtures" pnpm tsx scripts/test-ifc4-fixtures.ts
run_cmd "E7" pnpm tsx scripts/test-e7.ts
run_cmd "E8-A" pnpm tsx scripts/test-e8a-dossier.ts
run_cmd "E8-B" pnpm tsx scripts/test-e8b-assets.ts
run_cmd "E8-C" pnpm tsx scripts/test-e8c-gate.ts
printf '\n## SUMMARY\n'
pass=$(grep -c 'EXIT_CODE=0' "$OUT")
fail=$(grep -c 'EXIT_CODE=[1-9]' "$OUT")
printf 'PASS_COMMANDS=%s\nFAIL_COMMANDS=%s\n' "$pass" "$fail" >> "$OUT"
cat "$OUT"
exit 0
