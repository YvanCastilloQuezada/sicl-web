# ARKI — BKH-3 Regeneration Engine Contract

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Propósito

BKH-3 convierte un cambio aceptado como entrada en un plan gobernado para identificar estado derivado afectado, invalidarlo, regenerarlo cuando exista un regenerador autorizado y evaluar el resultado con BKH-2. BKH-3 no convierte una propuesta en estado canónico.

## Fronteras

BKH-1 responde qué está relacionado. BKH-2 responde qué condiciones deben cumplirse. BKH-3 responde qué queda sucio y qué debe recomputarse. BKH-4 aplicará, comprometerá o revertirá cambios en el futuro. La autoridad humana conserva la decisión final.

## Distinción central

**Generation** crea un candidato desde intención, parámetros y reglas. **Regeneration** actualiza estado derivado porque una dependencia fuente cambió. Un generador sólo puede registrarse como regenerador si declara entradas, salidas, dependencias, versión, determinismo, precondiciones, postcondiciones y evidencia.

## Flujo contractual

`ChangeSet → ImpactAnalysis → DirtySet → RegenerationPlan → RegeneratorExecution → BKH-2 Evaluation → RegenerationResult → RegenerationTrace`.

El plan, la ejecución y el commit son objetos distintos. El resultado puede ser parcial. `SUCCESS` sólo significa éxito granular y nunca éxito global si existen bloqueos, fallos o UNKNOWN.

## No autorizado

Esta orden no autoriza implementación, mutación canónica, transaction journal, commit, rollback, undo, redo, HumanDecision transversal, un segundo grafo relacional, un solver general, solver estructural profesional ni interfaz de usuario.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine VERIFIED.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.


## Contract fixes v1.1

### FIX-BKH3-01 — Relationship versus regeneration dependency

Una relación BKH-1 no es automáticamente una arista de invalidación. Cada regla de propagación debe declarar `relationshipType`, `propagationDirection`, `affectedOutputDomain`, `condition` e `invalidationPolicy`. La dirección inversa sólo se utiliza cuando la regla la autoriza. BKH-3 consume un único Relationship Fabric y no crea un segundo grafo.

### FIX-BKH3-02 — Validity versus execution

La vigencia y la ejecución son dimensiones independientes. `validityState` admite `CLEAN`, `DIRTY` y `UNKNOWN`. `executionState` admite `PENDING`, `REGENERATING`, `COMPLETED`, `BLOCKED` y `FAILED`. `REGENERATED` es un evento, resultado o traza; no reemplaza a `CLEAN`. Por tanto, `COMPLETED + CLEAN`, `BLOCKED + DIRTY` y `FAILED + DIRTY` son combinaciones válidas.

### FIX-BKH3-03 — Freshness fingerprint

Un derivado sólo puede considerarse current cuando su fingerprint coincide con el fingerprint vigente. El fingerprint incluye source revisions/hashes, dependency revisions/hashes, regenerator identity/version y el contexto de regeneración relevante. Una bandera CLEAN aislada no prueba vigencia.

### FIX-BKH3-04 — RegenerationContext

El contexto incluye únicamente entradas externas deterministas que afectan el resultado: unidad y tolerancia, configuration revision, domain dataset revisions, PriceBook revision cuando corresponda, mapping/version y external oracle/solver version. La definición contractual de determinismo es: `SAME SOURCE + SAME DEPENDENCIES + SAME REGENERATOR VERSION + SAME REGENERATION CONTEXT = SAME DERIVED RESULT`.

### FIX-BKH3-05 — Node-level result

Cada output produce un `RegenerationNodeResult` con identity, regenerator, input fingerprint, output fingerprint, validity state, execution state, reason, diagnostics, constraint results y provenance. El resultado global se agrega desde nodos y nunca oculta BLOCKED, FAILED, UNKNOWN o dirty remaining. Se preserva `PARTIAL_NOT_GLOBAL_SUCCESS`.
