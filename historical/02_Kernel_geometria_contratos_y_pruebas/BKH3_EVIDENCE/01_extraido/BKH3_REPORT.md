# ARKI — BKH-3 Regeneration Engine

**Fecha:** 23 de septiembre de 2026  
**Estado:** `IMPLEMENTED / PENDING EVIDENCE REVIEW`  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Resultado del ciclo

Se implementó el núcleo compartido `shared/arkiRegenerationEngine.ts` y la prueba ejecutable `scripts/test-bkh3-regeneration-engine.ts`. La implementación permanece deliberadamente separada de BKH-1 Relationship Fabric, BKH-2 Constraint Engine y cualquier futuro Transaction Engine.

El motor actual puede recibir un `RegenerationChangeSet`, calcular el conjunto dirty mediante entidades, dependencias y reglas de propagación registradas, ordenar nodos mediante dependencias topológicas, resolver el `RegeneratorDefinition` correspondiente, calcular `FreshnessFingerprint`, ejecutar regeneradores deterministas y producir resultados por nodo junto con una `RegenerationTrace` reproducible.

## Evidencia ejecutada

| Comprobación | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm tsx scripts/test-bkh3-regeneration-engine.ts` | PASS |
| `pnpm build` | PASS |
| Gate 1 previo | PASS; baseline registrado en `BKH3_GATE1_BASELINE.txt` |
| BKH-1 regresión | PASS en Gate 1 |
| BKH-2 regresión | PASS en Gate 1 |
| Regresiones constructiva, profesional, dossier, serialización y E7 | PASS en Gate 1 |

La prueba específica demuestra `planStatus=BLOCKED` cuando existe un dominio sin regenerador, `executionStatus=BLOCKED`, dos nodos regenerados, un nodo bloqueado, cinco eventos de traza y ausencia de mutación del modelo fuente.

## Fronteras preservadas

BKH-3 no hace commit, no realiza transacciones, no autoriza decisiones humanas, no modifica el estado canónico de entidades, no ejecuta código arbitrario y no sustituye a BKH-1 ni BKH-2. La salida de un regenerador es una propuesta derivada con hashes y provenance; la promoción a estado canónico queda fuera del alcance y corresponde a BKH-4.

## Limitaciones actuales

La implementación no constituye todavía un regenerador productivo de todos los dominios de ARKI. Los regeneradores concretos de geometría, cantidades, costos, cronograma, documentación e IFC deben registrarse posteriormente como `RegeneratorDefinition` gobernados. Tampoco existe aún persistencia de resultados, commit transaccional, recuperación ante fallos ni ejecución distribuida. La detección de ciclos bloquea el plan, pero no intenta resolverlos automáticamente.

El worktree ya estaba sucio antes de esta implementación. Gate 1 lo registró explícitamente; BKH-3 no reclasifica ni elimina esos artefactos históricos.

## Veredicto del ciclo

**BKH-3: IMPLEMENTED / PENDING EVIDENCE REVIEW.**

No se declara `VERIFIED` hasta completar la revisión independiente del paquete de evidencia, los casos obligatorios restantes del plan contractual y la regresión final sobre el estado de trabajo.

**BKH-4, BKH-5, BKH-6 y BKH-7 permanecen bloqueados.**

---

## Archivos de producto añadidos

- `shared/arkiRegenerationEngine.ts`
- `scripts/test-bkh3-regeneration-engine.ts`

## Evidencia de baseline

- `BKH3_GATE1_BASELINE.txt`
- `BKH3_CONTRACT_DESIGN/`
