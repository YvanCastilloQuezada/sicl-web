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
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
