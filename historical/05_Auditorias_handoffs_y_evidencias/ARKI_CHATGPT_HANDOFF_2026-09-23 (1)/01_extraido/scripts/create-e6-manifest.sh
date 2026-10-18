#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
files=(
  E6_PO_APPROVAL.md E6_REPORT.md E6_SCOPE_LIMITS.md E6_DEBT_INHERITED.md E6_OUTPUTS.txt
  contracts/adr/ADR-004.md contracts/adr/ADR-005.md contracts/adr/ADR-007.md
  contracts/adr/ADR-020.md contracts/adr/ADR-021.md contracts/adr/ADR-022.md
  shared/persistence/arkiPersistence.ts client/src/persistence/arkiIndexedDb.ts
  shared/identity/arkiGlobalId.ts shared/ifc4/arkiIfc4.ts shared/ifc4/webIfcAdapter.ts
  client/src/ifc4/Ifc4Panel.tsx
  fixtures/ifc4/fixture_01_simple_wall.ifc fixtures/ifc4/fixture_02_room_with_door.ifc fixtures/ifc4/fixture_03_multi_storey.ifc
)
printf '{\n  "schema": "ARKI-E6-MANIFEST-1.0",\n  "status": "PARTIAL / IMPLEMENTATION FREEZE",\n  "generatedAt": "2026-09-23",\n  "files": [\n'
last=$((${#files[@]} - 1))
for index in "${!files[@]}"; do
  file="${files[$index]}"
  hash=$(sha256sum "$file" | awk '{print $1}')
  comma=","; [[ "$index" -eq "$last" ]] && comma=""
  printf '    {"path":"%s","sha256":"%s"}%s\n' "$file" "$hash" "$comma"
done
printf '  ]\n}\n'
