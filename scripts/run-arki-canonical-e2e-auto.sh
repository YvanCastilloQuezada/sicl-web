#!/bin/bash
# ARKI — E2E canonical automatizado
# Genera execution_id únicos y ejecuta el E2E.
# Uso: SICL_CORE_URL=... SICL_CORE_SERVICE_TOKEN=... ./scripts/run-arki-canonical-e2e-auto.sh

set -euo pipefail

# 1. Verificar variables de entorno
if [ -z "${SICL_CORE_URL:-}" ]; then
  echo "ERROR: SICL_CORE_URL is required"
  exit 1
fi
if [ -z "${SICL_CORE_SERVICE_TOKEN:-}" ]; then
  echo "ERROR: SICL_CORE_SERVICE_TOKEN is required"
  exit 1
fi

# 2. Generar IDs únicos
TS=$(date +%Y%m%d_%H%M%S)
BRAIN_ID="E2E-BRAIN-${TS}"
D62_ID="E2E-D62-${TS}"
PROJECT_ID="E2E-PROJECT-${TS}"
EXEC_ID="E2E-CANONICAL-${TS}"

echo "=== IDs generados ==="
echo "  Project: ${PROJECT_ID}"
echo "  Brain:   ${BRAIN_ID}"
echo "  D62:     ${D62_ID}"
echo "  Exec:    ${EXEC_ID}"

# 3. Crear proyecto en el Core
echo ""
echo "=== Creando proyecto en el Core ==="
curl -s -X POST "${SICL_CORE_URL}/projects" \
  -H "Authorization: Bearer ${SICL_CORE_SERVICE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"project_id\": \"${PROJECT_ID}\", \"name\": \"E2E Test Project ${TS}\"}" \
  -o "/tmp/arki-core-create-${TS}.json"

echo "  Proyecto creado: $(cat /tmp/arki-core-create-${TS}.json | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("data",{}).get("project_id","ERROR"))')"

# 4. Crear input.json con IDs únicos
INPUT_FILE="/tmp/arki-e2e-input-${TS}.json"
cat > "$INPUT_FILE" <<JSON_EOF
{
  "brainExecutionId": "${BRAIN_ID}",
  "d62ExecutionId": "${D62_ID}",
  "requestedReasoningDepth": "STANDARD",
  "executionId": "${EXEC_ID}",
  "projectId": "${PROJECT_ID}",
  "brief": "Diseñar un edificio residencial de 3 pisos en Trujillo, Perú",
  "typology": "Residencial",
  "activities": [
    { "id": "A1", "label": "Vivienda", "capacity": 200 },
    { "id": "A2", "label": "Circulación", "capacity": 50 }
  ],
  "subjects": ["Residente", "Visitante"],
  "relationships": [
    { "id": "R1", "from": "A1", "to": "A2", "relation": "ADJACENCY" }
  ],
  "conditions": ["ACCESIBILIDAD"],
  "constraints": ["RNE", "Sismorresistente"],
  "unknowns": ["Topografía exacta"],
  "envelope": { "width": 20, "height": 15, "status": "EXPLICIT_PROJECT_DIMENSION" },
  "separationCondition": "PUBLIC_STAFF_SEPARATION"
}
JSON_EOF

echo ""
echo "=== Input creado: ${INPUT_FILE} ==="

# 5. Ejecutar E2E canonical
echo ""
echo "=== Ejecutando E2E canonical ==="
cd "$(dirname "$0")/.."
pnpm exec tsx scripts/run-arki-canonical-e2e.ts "$INPUT_FILE"

echo ""
echo "=== E2E canonical completado ==="
