#!/usr/bin/env bash
set +e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="COCO_EXPRESS_002/OUTPUTS/ARKI_COCO_EXPRESS_TESTS.txt"
: > "$OUT"
run_cmd() { local label="$1"; shift; { echo "## $label"; echo "COMMAND: $*"; "$@"; echo "EXIT_CODE=$?"; } >> "$OUT" 2>&1; }
run_cmd "required family artifacts" bash -c 'set -e; for f in A_ARCHITECTURE/FICHA_A.md T_ENGINEERING/FICHA_T.md N_REGULATION/FICHA_N.md P_PROCESS/FICHA_P.md S_SIMULATION/FICHA_S.md C_COMPUTATIONAL/FICHA_C.md L_LIFECYCLE/FICHA_L.md G_AGENTS/FICHA_G.md I_INTELLIGENCE/FICHA_I.md X_INTEROPERABILITY/FICHA_X.md Y_COLLABORATION/FICHA_Y.md Z_ANALYTICS/FICHA_Z.md W_SUSTAINABILITY/FICHA_W.md R_RESEARCH/FICHA_R.md; do test -s COCO_EXPRESS_002/$f; done'
run_cmd "required exercise artifacts" bash -c 'set -e; for f in A_ARCHITECTURE/EXERCISES_A.txt T_ENGINEERING/EXERCISES_T.txt N_REGULATION/EXERCISES_N.txt P_PROCESS/EXERCISES_P.txt S_SIMULATION/EXERCISES_S.txt C_COMPUTATIONAL/EXERCISES_C.txt L_LIFECYCLE/EXERCISES_L.txt G_AGENTS/EXERCISES_G.txt I_INTELLIGENCE/EXERCISES_I.txt X_INTEROPERABILITY/EXERCISES_X.txt Y_COLLABORATION/EXERCISES_Y.txt Z_ANALYTICS/EXERCISES_Z.txt W_SUSTAINABILITY/EXERCISES_W.txt R_RESEARCH/EXERCISES_R.txt; do test -s COCO_EXPRESS_002/$f; done'
run_cmd "COCO core suite" pnpm tsx scripts/test-coco.ts
run_cmd "COCO-EXPRESS transverse test" pnpm tsx scripts/test-coco-express-002.ts
run_cmd "pnpm check" pnpm check
run_cmd "PA-001 regression" pnpm tsx scripts/test-architectural-program.ts
run_cmd "E8-A regression" pnpm tsx scripts/test-e8a-dossier.ts
run_cmd "E8-B regression" pnpm tsx scripts/test-e8b-assets.ts
run_cmd "E8-C regression" pnpm tsx scripts/test-e8c-gate.ts
run_cmd "BKH4 foundation regression" pnpm tsx scripts/test-bkh4-foundation.ts
run_cmd "E5 close regressions" bash -c 'pnpm tsx scripts/test-e5-close-snapshot.ts && pnpm tsx scripts/test-e5-close-viewpoint.ts && pnpm tsx scripts/test-e5-close-comparison-controls.ts'
run_cmd "E7 regression" pnpm tsx scripts/test-e7.ts
run_cmd "pnpm build" pnpm build
{
 echo "## SUMMARY"
 grep -c 'EXIT_CODE=0' "$OUT" | sed 's/^/PASS_COMMANDS=/'
 grep -c 'EXIT_CODE=[1-9]' "$OUT" | sed 's/^/FAIL_COMMANDS=/'
 if grep -q 'EXIT_CODE=[1-9]' "$OUT"; then echo "OVERALL=FAIL"; else echo "OVERALL=PASS"; fi
} >> "$OUT"
cat "$OUT"
