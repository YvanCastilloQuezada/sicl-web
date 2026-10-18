# ARKI-COCO-EXAM-001 — Fallos y límites

## Fallos de capacidad observados

El examen no encontró un fallo de ejecución del harness después de corregir la expectativa del ciclo no dirigido. Encontró, en cambio, brechas de capacidad: no existe todavía un analizador completo del programa NEXUS; no existe un motor productivo para física, estructuras, MEP, costos, analítica o propagación interdisciplinaria; y no se ejecutó una transferencia Q con un segundo escenario.

## Fallos del test-the-test

Se detectaron seis mutantes sobrevivientes: `IGNORE_PROVENANCE`, `IGNORE_APPLICABILITY`, `IGNORE_SCALE`, `OBSERVATION_TO_CANONICAL_FACT`, `HASH_TO_SIGNATURE` y `COMMAND_SENT_TO_OBSERVED_SUCCESS`. Estos mutantes indican que la evidencia disponible todavía no distingue suficientemente algunas fronteras.

## Corrección mínima permitida

La corrección siguiente debe endurecer únicamente el harness y sus regresiones. No debe convertir una ausencia de capacidad profunda en PASS ni implementar silenciosamente C3–C7.
