#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
files=(
  E7_PO_APPROVAL.md E7_CONTRATO_PROPUESTO_V1.md E7_REPORT.md E7_SCOPE_LIMITS.md E7_DEBT_INHERITED.md E7_OUTPUTS.txt
  contracts/adr/ADR-E7-001.md contracts/adr/ADR-E7-002.md contracts/adr/ADR-E7-003.md contracts/adr/ADR-E7-004.md
  shared/arki5d/index.ts shared/arki4d/index.ts shared/coordination/index.ts shared/structural/index.ts shared/mep/index.ts shared/arkiImpacts/index.ts
  scripts/test-e7.ts fixtures/e7/fixture_cost_schedule_project.json fixtures/e7/fixture_structural_small_frame.json fixtures/e7/fixture_mep_hospital_subset.json
)
printf '{\n  "schema":"ARKI-E7-MANIFEST-1.0",\n  "status":"PARTIAL / CYCLE 2 OF 2",\n  "generatedAt":"2026-09-23",\n  "files":[\n'
last=$((${#files[@]} - 1))
for index in "${!files[@]}"; do file="${files[$index]}"; hash=$(sha256sum "$file" | awk '{print $1}'); comma=","; [[ "$index" -eq "$last" ]] && comma=""; printf '    {"path":"%s","sha256":"%s"}%s\n' "$file" "$hash" "$comma"; done
printf '  ]\n}\n'
