# AV036-15 — Extracciones físicas verificadas

Estado: SOURCE_COPIED / TESTS_NOT_EXECUTED / NO_CANONICAL_PROMOTION.

## REC-003 — Tres alternativas del gemelo
- Origen: `feat/arbol-vivo-functional-repair-20261014` @ `cad38bc314f9e8fa10d6ae542be888879cec1644`.
- Copiados sin modificación desde `tools/maqueta-viva/`: `arki-twin-three-alternatives.cjs` y `arki-twin-three-alternatives.test.cjs`.
- Destino: `experiments/arki-ideas/REC-003/`.
- Dependencias del módulo: `node:crypto`; test usa `node:test`, `node:assert/strict` y módulo local.
- Propósito: evaluar A/B/C y distinguir evidencia hipotética de medida; no simula AGK.
- Prueba pendiente: `node --test experiments/arki-ideas/REC-003/arki-twin-three-alternatives.test.cjs`.

## REC-006 — Pulso de disponibilidad Web/Core
- Origen: `feat/arki-live-readonly-pulse-20261013`; SHA exacto de origen debe reconciliarse con inventario AV036-12.
- Copiados sin modificación desde `tools/maqueta-viva/`: `arki-live-pulse.cjs` y `arki-live-pulse.test.cjs`.
- Blobs fuente: módulo `ada544b1bbe0755b2226a1c3b75f80dbefdd2f19`, test `8c9bdaf22249cee61ecbb88db416d5ce8e06ebb9`.
- Destino: `experiments/arki-ideas/REC-006/`.
- Propósito: comprobación HTTP de solo lectura; no certifica arquitectura, Core, D2 ni AGK.
- Prueba pendiente: `node --test experiments/arki-ideas/REC-006/arki-live-pulse.test.cjs`.

## Reglas de reducción de ramas
- El origen queda intacto hasta inventario exhaustivo de ideas, archivos, tests, dependencias y referencias cruzadas.
- La copia no implica que se haya reducido la rama de origen, ni que la capacidad esté integrada.
- No borrar una rama con PR abierto, ni una rama divergente, hasta demostrar absorción o preservación integral y aprobar cierre del PR.
- No reescribir historia publicada para aparentar que el código nunca existió.
