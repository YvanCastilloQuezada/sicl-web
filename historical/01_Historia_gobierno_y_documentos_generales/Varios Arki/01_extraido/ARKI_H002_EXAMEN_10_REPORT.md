# ARKI-HARDENING-H002 --- Impact Analysis / WHAT-IF --- Examen 10

## Propósito

H-002 añade análisis transitive read-only sobre las derivaciones H-001.
Responde qué artefactos son alcanzables aguas abajo desde una referencia
versionada exacta. No ejecuta cambios.

## Regla semántica

`DEPENDENCY_REACHABLE ≠ CAUSAL_EFFECT ≠ STALE ≠ RECOMPUTE_REQUIRED`.

## Endurecimiento 1--10

1.  Cadena transitive, versión exacta, branch/join, ciclos, aislamiento.
2.  Se detectó pérdida de caminos alternativos; se reconstruyó el
    contrato para conservar paths.
3.  Ciclos canonicalizados y path explosion fail-closed.
4.  Se rechazó inferir sustitución G1@3→G1@4 sin ChangeSet.
5.  Cada ImpactStep conserva relationType/relationDomain y derivation
    record.
6.  Reporte declara `evidenceLevel=DEPENDENCY_REACHABLE`.
7.  Multi-genealogía preserva dominios sin inferir equivalencia causal.
8.  Límites `max_paths_per_artifact` y `max_expansions`, ambos
    fail-closed.
9.  Determinismo verificado ante reordenamiento de eventos.
10. Regresión Core + compileall.

## Runtime final

**335 passed / 0 failed** en Core reproducible, excluyendo únicamente
dos tests IFC bloqueados por `ifcopenshell`. `compileall`: PASS.

## Capacidades

-   reverse dependency traversal: IMPLEMENTED + RUNTIME_EVIDENCE
-   transitive impact discovery: IMPLEMENTED + RUNTIME_EVIDENCE
-   multiple path preservation: IMPLEMENTED + RUNTIME_EVIDENCE
-   relation semantics per step: IMPLEMENTED + RUNTIME_EVIDENCE
-   cycle detection: IMPLEMENTED + RUNTIME_EVIDENCE
-   deterministic report: IMPLEMENTED + RUNTIME_EVIDENCE
-   automatic invalidation: NOT IMPLEMENTED
-   automatic recomputation: NOT IMPLEMENTED
-   causal effect proof: NOT IMPLEMENTED
-   geometry mutation: NOT IMPLEMENTED

## Riesgos diferidos

-   H-001 concurrent writer uniqueness.
-   Event Store/read-model scaling.
-   Path enumeration may be expensive; bounded fail-closed, no
    streaming/indexed graph yet.
-   Old→new change transition requires an explicit future ChangeSet
    contract.
-   Dependency reachability must never be presented as causal/physical
    consequence.

## Próximo incremento

H-003 deberá introducir validez/invalidation como una interpretación
explícita sobre observaciones de dependencia y ChangeSet, sin convertir
automáticamente toda reachability en STALE.
