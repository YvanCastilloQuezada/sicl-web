# ARKI — Cómo replicar el E2E canonical

## Prerrequisitos

- Core corriendo en `http://127.0.0.1:8000`.
- `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` configurados.
- Node.js y pnpm instalados.

## Script automatizado

```bash
cd /home/arki/ARKI/canonical/sicl-web
export SICL_CORE_URL=http://127.0.0.1:8000
export SICL_CORE_SERVICE_TOKEN=4d68d3c449864b7d560e09916559a7e2f9f7affb7115c33aa61af0881a11d506
./scripts/run-arki-canonical-e2e-auto.sh
TS=$(date +%Y%m%d_%H%M%S)
PROJECT_ID="E2E-PROJECT-${TS}"

curl -s -X POST http://127.0.0.1:8000/projects \
  -H "Authorization: Bearer ${SICL_CORE_SERVICE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"project_id\": \"${PROJECT_ID}\", \"name\": \"E2E Test Project ${TS}\"}"

cd /home/arki/ARKI/canonical/sicl-web
pnpm exec tsx scripts/run-arki-canonical-e2e.ts /tmp/arki-e2e-input.json
cat > /tmp/arki-e2e-input.json <<EOF
{
  "brainExecutionId": "E2E-BRAIN-${TS}",
  "d62ExecutionId": "E2E-D62-${TS}",
  "requestedReasoningDepth": "STANDARD",
  "executionId": "E2E-CANONICAL-${TS}",
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
