# ARKI-HARDENING-H002 --- Impact Analysis / WHAT-IF

## Objetivo

Añadir consulta transitoria read-only de impacto sobre las derivaciones
H-001.

**Invariante:** `IMPACT DETECTED ≠ CHANGE EXECUTED`.

## Contrato

-   `ImpactPath`: secuencia exacta de VersionedRef + IDs de
    DerivationRecord.
-   `ImpactedArtifact`: referencia afectable, profundidad mínima y todas
    las rutas encontradas dentro del límite.
-   `ImpactReport`: changedRef, artefactos impactados, ciclos
    detectados, `readOnly=true`.
-   `ImpactAnalyzer`: reverse traversal sobre inputs exactos registrados
    en DerivationLedger.

## Pasadas y ataques

1.  Cadena transitoria, exact version, branching/join, aislamiento,
    ciclos.
2.  Hallazgo: se perdían rutas alternativas. Corrección: paths
    explícitos.
3.  Hallazgo: representación de ciclos dependía del punto de entrada.
    Corrección: canonicalización rotacional.
4.  Explosión de rutas: límite explícito y fail-closed; no truncamiento
    silencioso.
5.  Identidad por versión exacta.
6.  Aislamiento de proyecto.
7.  Joins conservan múltiples rutas.
8.  Ciclos acotados/canónicos.
9.  Scan de acciones prohibidas: no
    invalidate/recompute/mutate/propagate/apply.
10. Regresión Core reproducible completa.

## Runtime final

-   H-001 + H-002 focal: PASS.
-   Core reproducible: **327 passed / 0 failed**.
-   compileall: PASS.
-   IFC: dos archivos continúan bloqueados por `ifcopenshell` ausente;
    no instalado silenciosamente.

## No-capacidades

H-002 NO: - marca STALE; - invalida; - recomputa; - muta geometría; -
aplica cambios; - escribe BIM; - decide por Human Authority.

## Riesgos/deuda abierta

1.  `PATH_EXPLOSION`: actualmente fail-closed al superar
    `max_paths_per_artifact`; una futura UX/read-model puede necesitar
    resumen explícito PARTIAL sin perder evidencia.
2.  `EVENT_STORE_SCALING`: reconstrucción desde ledger sigue siendo
    O(E); deferred.
3.  `RELATION_SEMANTICS`: impacto sigue las dependencias declaradas; no
    prueba causalidad arquitectónica real.
4.  `CONCURRENT_WRITER_UNIQUENESS`: riesgo heredado H-001, no resuelto
    por H-002.
5.  `IFC_ENVIRONMENT`: suite IFC no ejecutada.

## Estado

H-002 = IMPLEMENTED + RUNTIME_EVIDENCE en el workspace de trabajo. No se
reclama E2E arquitectónico ni wall-move. Siguiente candidato: H-003
Validity/Invalidation, sujeto a Red Team o revisión crítica del paquete
H-002.
