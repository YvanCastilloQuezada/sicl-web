# ARKI-M10-001 — Macroorden de recuperación y autoensamblaje

Estado: AUTHORIZED_TO_INVESTIGATE_AND_PREPARE / NOT_AUTHORIZED_TO_BYPASS_GATES
Fecha: 2026-10-13
Base: main; trazabilidad en PR #59.

## Política de ejecución
- Ejecutar secuencialmente las diez órdenes sin interrupciones por decisiones menores. Cada orden produce artefacto/evidencia y veredicto CLAIM / IMPLEMENTED / EXECUTED / VERIFIED.
- En caso de bloqueo, registrar SHA, CI, contrato, causa y próximo desbloqueo; continuar con órdenes independientes.
- No modificar FROZEN, autoridad Core/D-2/AGK ni fusionar sin CI verde exacto, revisión de seguridad, mergeability y autorización. PR #58 conserva autorización condicional específica.
- No crear memoria canónica paralela; no confundir handoff con Event Store.
- Una única entrega al propietario: diez casos reproducibles, comandos, resultados GitHub y pendientes que exijan su intervención.

| ID | Macroorden | Evidencia exigida | Estado inicial |
|---|---|---|---|
| M01 | Genealogía completa de ramas y commits | DAG, merge bases, exclusivos, PR y SHAs | IN_PROGRESS; comparaciones parciales en PR #59 |
| M02 | Inventario de capacidades e ideas | ID, ruta, fuente, tests, clasificación | PENDING |
| M03 | Mapeo de F1–F10 y autoridades | matriz fase, dependencia, autoridad, FROZEN | PENDING |
| M04 | Mapa Vivo y continuidad | comparación 00_START, ARKI_HANDOFF, Event Store y fuentes | PARTIAL; generador observado |
| M05 | Árbol Vivo | contratos, spine, actividades, precedencias, pruebas | PARTIAL; módulo observado |
| M06 | Gemelo Digital Vivo | simuladores, alternativas, métricas, límites | PARTIAL; ADN hipotético observado |
| M07 | Memoria persistente | replay, durabilidad, integridad, procedencia | BLOCKED hasta verificar Core |
| M08 | Autoensamblaje controlado | tres alternativas, decisiones y dependencias | PARTIAL; planner observado |
| M09 | CI y seguridad | jobs exact SHA, tests, controles y regresión | BLOCKED; CI #58 fallido |
| M10 | Paquete de aceptación local | diez pruebas reproducibles con expected/actual | PENDING |

## Hechos ya verificados por inspección de GitHub
- La rama de precedencias contiene generador de ARKI_HANDOFF, workflow cada seis horas en rama experimental y memoria viva no persistente.
- La rama de autoensamblaje contiene 00_START, planner, inventario y puente ADN.
- El módulo de macroórdenes experimental solo ejecuta AUDIT_AND_PLAN y REASSESS, con resultado PLAN_AND_JOURNAL_ONLY, sin acciones externas.
- El PR #58 está bloqueado por CI fallido; ninguna autorización permite saltar ese gate.

## Salida de cada orden
`{id, source_sha, inputs, claims, implementation, execution, verification, evidence, blockers, next}`.

## Entrega final
Diez escenarios E2E en PC del propietario; no se inventarán resultados de su servidor. La aprobación se solicita una sola vez al final del lote, salvo riesgo crítico que exija detener la operación.
