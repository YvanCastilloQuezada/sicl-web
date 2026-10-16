# AV036-17 — Cierre de preparación y puerta de validación

Fecha: 2026-10-16. Estado: **VALIDATION_CONFIGURED / CI_RESULT_UNKNOWN / PRUNING_BLOCKED**.

## Evidencia creada
- REC-001: dependencias relativas restauradas mediante copias no canónicas en su directorio; los originales permanecen preservados.
- REC-002: dependencia `arki-dependency-coverage.cjs` disponible en su directorio.
- Fixtures del coordinador recuperados desde `feat/arbol-vivo-functional-repair-20261014`: `experiments/arki-ideas/REC-001/assembly-registry.json` y `experiments/docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`.
- Prueba de humo `experiments/arki-ideas/av036-smoke.test.cjs`.
- Workflow `.github/workflows/av036-recovery-validation.yml` para Node 22 y cinco invocaciones de pruebas: humo, REC-001, REC-002, REC-003 y REC-006.

## Comandos de verificación
```bash
node --test experiments/arki-ideas/av036-smoke.test.cjs
node --test experiments/arki-ideas/REC-001/arki-live-systems-coordinator.test.cjs
node --test experiments/arki-ideas/REC-002/arki-relational-learning.test.cjs
node --test experiments/arki-ideas/REC-003/arki-twin-three-alternatives.test.cjs
node --test experiments/arki-ideas/REC-006/arki-live-pulse.test.cjs
```

## Criterios de salida obligatorios
1. Obtener URL de ejecución, SHA, logs y resultado de CI del HEAD exacto.
2. Resolver cualquier fallo; no marcar PASS por presencia del workflow.
3. Comparar hashes de los archivos originales con las copias, salvo duplicados de estructura.
4. Reconciliar las cinco ideas documentales adicionales en sus laboratorios separados; sus implementaciones no están incluidas en este paquete.
5. Revisar amenazas SSRF en REC-006 antes de permitir endpoints configurables no confiables.
6. No fusionar a main, modificar FROZEN ni podar ramas hasta preservar todas las capacidades exclusivas.

**Resultado:** preparación de prueba reproducible, no certificación de implementación.
