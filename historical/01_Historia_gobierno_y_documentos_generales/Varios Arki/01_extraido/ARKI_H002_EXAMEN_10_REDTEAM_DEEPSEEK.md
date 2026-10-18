# ARKI-HARDENING-H002 --- Impact Analysis / WHAT-IF --- Examen 10

## Estado

H-002 se construyó sobre H-001 Examen 10 y se sometió a diez
pasadas/ataques, conforme a la regla de reforzar cada punto débil hasta
resolverlo o marcarlo explícitamente.

**Resultado final reproducible:** 337 PASS / 0 FAIL en Core excluyendo
únicamente los dos tests IFC bloqueados por ausencia de `ifcopenshell`.
`compileall`: PASS.

## Objetivo

Responder de forma read-only:

-   ¿qué artefactos dependían de una referencia versionada?
-   si una entidad cambia `before → after`, ¿qué resultados existentes
    pueden estar potencialmente afectados?
-   ¿por qué caminos derivacionales se alcanza cada resultado?
-   ¿qué relación y dominio explica cada salto?

H-002 NO invalida, NO declara STALE, NO recomputa, NO muta geometría y
NO ejecuta consecuencias.

## Evolución de los exámenes

### 1 --- Traversal transitive

Se implementó reverse traversal sobre H-001:
`input → derivation → output`. Cadena control:
`G1@3 → A1@1 → Q1@2 → C1@4`.

### 2 --- Branch/join

Se detectó que un único `viaRecordId` perdía caminos alternativos. Se
sustituyó por `ImpactPath[]`.

### 3 --- Ciclos y explosión local

Ciclos acotados y reportados. Los ciclos se canonicalizan para no
duplicarlos por rotación. `max_paths_per_artifact` falla cerrado.

### 4 --- Cambio real before/after

Hallazgo crítico: consultar sólo `G1@4` no encuentra derivaciones que
consumieron `G1@3`. Se añadió `ImpactChange(before, after)` y
`analyze_change()`. La búsqueda usa el snapshot BEFORE; AFTER se
conserva como evidencia del cambio.

### 5 --- Cambio de contenido sin cambio de versión

`content_hash` permite representar `G1@1(hash A) → G1@1(hash B)` como
cambio real sin inventar STALE.

### 6 --- Semántica de cada hop

Los paths ahora conservan `recordIds`, `relationTypes` y
`relationDomains`. Impacto computacional, epistémico y arquitectónico no
se colapsan en una arista anónima.

### 7 --- Proveniencia del cambio

`ImpactReport` conserva `observedChange.before` y
`observedChange.after`.

### 8 --- Determinismo

Mismo ledger + misma consulta produce el mismo `to_dict()` ordenado.

### 9 --- Complejidad global

Además del límite por artefacto se añadió `max_total_paths` y
`max_impacted_artifacts`, ambos fail-closed.

### 10 --- Regresión

-   focal H-001 + H-002: 33 PASS;
-   Core reproducible: 337 PASS;
-   compileall: PASS.

## Contratos finales

-   `ImpactChange`
-   `ImpactPath`
-   `ImpactedArtifact`
-   `ImpactReport`
-   `ImpactAnalyzer.analyze_dependency()`
-   `ImpactAnalyzer.analyze_change()`

## Invariantes

-   `IMPACT DETECTED ≠ CHANGE EXECUTED`
-   `CHANGE ≠ PROPAGATION`
-   `VERSION MISMATCH ≠ STALE`
-   `PATH DISCOVERED ≠ CAUSAL EFFECT VERIFIED`
-   H-002 es read-only.

## Riesgos/deuda explícitos

1.  `DerivationLedger.list()` sigue reconstruyendo desde Event Store:
    deuda de rendimiento heredada de H-001.
2.  El número de caminos en un DAG puede ser exponencial; H-002 falla
    cerrado al alcanzar límites configurados, pero no resuelve aún un
    algoritmo resumido de causalidad a gran escala.
3.  H-002 descubre dependencias registradas; no inventa dependencias
    arquitectónicas ausentes del grafo.
4.  La calidad de WHAT-IF está limitada por la calidad/cobertura de
    H-001.
5.  IFC sigue environment-blocked por `ifcopenshell`.

## Estado de claims

-   Reverse dependency traversal: IMPLEMENTED + RUNTIME_EVIDENCE.
-   Transitive WHAT-IF: IMPLEMENTED + RUNTIME_EVIDENCE.
-   Alternative path preservation: IMPLEMENTED + RUNTIME_EVIDENCE.
-   Relation/domain preservation: IMPLEMENTED + RUNTIME_EVIDENCE.
-   Change before/after trace: IMPLEMENTED + RUNTIME_EVIDENCE.
-   Automatic invalidation: NOT IMPLEMENTED.
-   Automatic recomputation: NOT IMPLEMENTED.
-   Architectural causal completeness: NOT DEMONSTRATED.
-   Wall-move E2E: NOT YET DEMONSTRATED.

## Red Team para DeepSeek

Atacar especialmente:

1.  si `before` es siempre el lookup correcto para un cambio;
2.  si paths explícitos son sostenibles o necesitan DAG proof/summary;
3.  si la canonicalización de ciclos puede ocultar diferencias
    direccionales;
4.  si relationType/domain por hop basta para no confundir dependencia
    con causalidad;
5.  si `content_hash` + version pueden crear identidades inesperadas;
6.  si los límites fail-closed pueden causar denegación de análisis en
    proyectos grandes;
7.  si un output con múltiples justificaciones requiere semántica
    diferente a múltiples paths computacionales;
8.  si H-003 puede interpretar impactos sin contaminar H-002 con estados
    de validez.

No implementar. Buscar contraejemplos reproducibles y clasificar
severidad.
