#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="ARKI_COCO_EXAM_001_R1_OUTPUTS.txt"
: > "$OUT"
run_cmd() {
  local label="$1"; shift
  printf '\n## %s\n' "$label" | tee -a "$OUT"
  "$@" >> "$OUT" 2>&1
  local code=$?
  printf 'EXIT_CODE=%s\n' "$code" | tee -a "$OUT"
}
run_cmd "pnpm check" pnpm check
run_cmd "pnpm build" pnpm build
run_cmd "COCO core" pnpm tsx scripts/test-coco.ts
run_cmd "COCO express" pnpm tsx scripts/test-coco-express-002.ts
run_cmd "architectural program regression" pnpm tsx scripts/test-architectural-program.ts
run_cmd "NEXUS baseline" pnpm tsx scripts/test-coco-exam-001.ts
run_cmd "ARKI-TRANSFER-002 R1" pnpm tsx scripts/test-coco-exam-001-r1.ts
run_cmd "E5 close snapshot" pnpm tsx scripts/test-e5-close-snapshot.ts
run_cmd "E5 close viewpoint" pnpm tsx scripts/test-e5-close-viewpoint.ts
run_cmd "E5 comparison controls" pnpm tsx scripts/test-e5-close-comparison-controls.ts
run_cmd "E8-A regression" pnpm tsx scripts/test-e8a-dossier.ts
run_cmd "E8-B regression" pnpm tsx scripts/test-e8b-assets.ts
run_cmd "E8-C regression" pnpm tsx scripts/test-e8c-gate.ts
printf '\n## SUMMARY\n' | tee -a "$OUT"
if grep -q 'EXIT_CODE=[1-9]' "$OUT"; then
  echo 'OVERALL=FAIL' | tee -a "$OUT"
else
  echo 'OVERALL=PASS' | tee -a "$OUT"
fi
