# ARKI — Banco experimental de ideas recuperadas (AV036-15)

Estado: INVENTARIO INICIAL / NO INTEGRADO / SIN PRUEBAS DE ABSORCIÓN.
Base: integration/arki-av035-main-20261015 @ ffecd30daf44def79363a949d27f994286749d5f.
Regla: preservar ramas originales hasta que cada capacidad esté extraída con código, pruebas, dependencias, evidencia y verificación. No interpretar el traslado como eliminación de historial Git. Sin mutación de canon, FROZEN, AGK ni promoción automática.

| ID | Idea/capacidad | Rama origen | Archivos de entrada | Estado |
|---|---|---|---|---|
| REC-001 | Coordinación Mapa Vivo–Árbol Vivo–Gemelo | feat/arbol-vivo-functional-repair-20261014 | tools/maqueta-viva/arki-live-systems-coordinator.cjs, .test.cjs | CANDIDATE_REVIEW |
| REC-002 | Aprendizaje relacional con evidencia | feat/arbol-vivo-functional-repair-20261014 | tools/maqueta-viva/arki-relational-learning.cjs, .test.cjs | CANDIDATE_REVIEW |
| REC-003 | Tres alternativas A/B/C con límites epistémicos | feat/arbol-vivo-functional-repair-20261014 | tools/maqueta-viva/arki-twin-three-alternatives.cjs, .test.cjs | CANDIDATE_REVIEW |
| REC-004 | Precedencias seguras y aristas tipadas | feat/arbol-vivo-precedencias-seguras-20261010 | tools/maqueta-viva/arki-arbol-vivo-auto.cjs, .test.cjs | CANDIDATE_REVIEW |
| REC-005 | Proyección operativa de cinco vistas | feat/arki-operational-vitality-mo05-20261015 | tools/maqueta-viva/arki-mo05-operational.cjs | CANDIDATE_REVIEW |
| REC-006 | Pulso Web/Core de solo lectura | feat/arki-live-readonly-pulse-20261013 | tools/maqueta-viva/arki-live-pulse.cjs | CANDIDATE_REVIEW |
| REC-007 | Mapa–Árbol–Gemelo: auditoría de no duplicación | audit/mapa-arbol-gemelo-reconciliacion-20261014 | docs/arki-master-map/ARKI_LIVE_MAP_TREE_TWIN_DOUBLE_AUDIT_20261014.md | CANDIDATE_REVIEW |
| REC-008 | Operación supervisada L1–L5 | feat/arki-operational-vitality-mo05-20261015 | docs/ops/ARKI-MO-025-ACTIVACION-ARBOL-VIVO.md | CANDIDATE_REVIEW |

## Procedimiento por idea
1. Identificar SHA exacto, archivo, funciones, tests, documentación, dependencias y licencias.
2. Comparar con integración actual: ausente, idéntico, evolucionado, sustituido o incompatible.
3. Copiar a un directorio de laboratorio aislado solo cuando esté demostrada la necesidad; no copiar módulos enteros por defecto.
4. Ejecutar pruebas adversariales y de regresión; registrar evidencia y resultados.
5. Generar propuesta para Mapa Vivo y revisión del PO; prohibida la promoción implícita.
6. Después de confirmar extracción íntegra, proponer reducción de rama original con revisión separada. Nunca reescribir historia publicada ni modificar ramas con PR abierto sin reconciliación.

Los ocho registros son semillas, no el inventario completo de las doce ramas. La extracción física de código y pruebas todavía no está realizada.
