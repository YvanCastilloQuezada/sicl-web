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

## Ejecución M01 — corte 2026-10-13 (inventario multi-repo parcial)
- WEB: primera página 84 ramas + segunda página 1 rama (`verify/commit-6`), cursor final `ODU`; enumeración no certificada exhaustiva. El conjunto incluye ramas históricas, de auditoría, de documentación y de pruebas; ninguna se integra por nombre.
- CORE: primera página 100 ramas; cursor `MTAw`, inventario **incompleto**. Requiere continuar paginación antes de cerrar M01.
- ACS: ramas `main` y `feat/oece-arki-integration-v1`. Esta última: 85 commits ahead / 0 behind de main, con cambios en corpus OECE, persistencia, portal, workers y pruebas; NO integrarla en Web.
- WEB `feat/arki-master-map-live-v1`: 0 ahead / 8 behind de main; no contiene delta exclusivo por comparación actual. Clasificación candidata `ALREADY_IN_MAIN_OR_SUPERSEDED`, sujeto a inspección de commits y contenido, no recrear.
- CORE `reconcile/arki-live-map-2026-10-07`: 2 commits ahead / 0 behind; solo `docs/ARKI_CROSS_REPO_AUTHORITY_CONTRACT_V1.md` y `docs/ARKI_KNOWN_LIMITATIONS_v1.0.md`. Son documentos de autoridad/limitaciones a auditar antes de tocar persistencia.
- WEB ramas de precedencias y autoensamblaje divergentes: 74 commits exclusivos en precedencias, 37 en autoensamblaje, y cambios netos distintos; preservar ambas fuentes.
- Veredicto M01: `IN_PROGRESS` por falta de paginación Core y clasificación de los SHAs exclusivos; ningún merge autorizado por esta inspección.

## Orden de recuperación refinado (sin duplicación)
1. Leer contrato de autoridad en CORE antes de crear adaptadores de memoria.
2. Identificar Event Store persistente existente y su interfaz de lectura, sin tocar FROZEN.
3. Mapear eventos derivados al Mapa Vivo, luego Árbol Vivo y finalmente gemelo experimental.
4. Conservar ACS como repositorio separado; inventariar interfaces públicas, no trasladar corpus a WEB.

## Ejecución M02–M03 — contratos y clasificación inicial
- CORE enumeración observada: 100 + 5 ramas en dos páginas; siguiente cursor `MTA1` aún devuelto, por lo que **no afirmar cierre de paginación**.
- Contrato de autoridad en `sicl-core@reconcile/arki-live-map-2026-10-07:docs/ARKI_CROSS_REPO_AUTHORITY_CONTRACT_V1.md`: Core = Project State, evidencia, decisiones; D-2 = semántica; AGK = geometría operacional; Web/F7/F8 = proyecciones; ACS = adquisición y laboratorio. F7 debe referenciar projectId, revisión Core, referencias D-2/AGK, fingerprint BASELINE_0, procedencia, UNKNOWN y aceptación humana antes de F8. **Es contrato documental, no prueba runtime**.
- `docs/ARKI_KNOWN_LIMITATIONS_v1.0.md` lleva aviso explícito de `HISTORICAL / RECONCILIATION_REQUIRED`. No convertir RT-89..RT-96 automáticamente en deuda actual sin revalidación.
- Clasificación preliminar: Web `feat/arki-master-map-live-v1` = `ALREADY_IN_MAIN_OR_SUPERSEDED` (0 ahead / 8 behind); Core contrato autoridad = `REVIEW_REQUIRED` (dos commits docs no fusionados); ACS OECE = `SEPARATE_LAB_CANDIDATE` (85 ahead); módulos living-memory y autonomy-memory = `EXPERIMENTAL_NONCANONICAL`; ADN-MC = `HYPOTHESIS_ONLY` sin ensayos comparativos verificados.
- Veredicto M02: `IN_PROGRESS`; M03: `PARTIAL`. Falta mapa exhaustivo de módulos/imports y prueba de interfaces reales.
