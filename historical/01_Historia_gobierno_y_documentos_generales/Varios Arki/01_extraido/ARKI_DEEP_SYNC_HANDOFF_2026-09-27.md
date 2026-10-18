# ARKI --- DEEP SYNC / RED TEAM HANDOFF

**Fecha de corte:** 2026-09-27\
**Destino:** DeepSeek\
**Autoridad:** Yvan Castillo\
**Función de DeepSeek:** Red Team conceptual/técnico independiente. No
implementar salvo orden posterior.

------------------------------------------------------------------------

## 1. MISIÓN

Atacar ARKI con criterio adversarial. No validar por cortesía.

Distinguir estrictamente: - CODE_EVIDENCE - RUNTIME_EVIDENCE -
DOCUMENTED - PROPOSAL - UNKNOWN - REFUTED cuando corresponda

No convertir un test PASS en prueba de corrección arquitectónica.

------------------------------------------------------------------------

## 2. ESTADO DE ARKI

ARKI busca un arquitecto artificial profesional multiescala.

Cadena objetivo:
`PROBLEMA → HECHOS/UNKNOWN → RESTRICCIONES → KNOWLEDGE/NORMS → STRATEGIES → GENERATE → SIMULATE → EVALUATE → CRITIQUE → OPTIMIZE → MUTATE → PROPAGATE → RE-EVALUATE → 16→4→1 → HUMAN REVIEW`.

Secuencia de hardening: H-001 Derivation Integrity → H-002
Impact/WHAT-IF → H-003 Validity/Invalidation → H-004 Reaction Planning →
H-005 Selective Recomputation → H-006 Architectural Re-evaluation →
H-007 Wall-Move E2E.

------------------------------------------------------------------------

## 3. H-001 CERRADO COMO BASELINE REFORZADO

H-001 implementa: - VersionedRef - TypedRelation - DerivationRecord -
DerivationLedger sobre Event Store existente - WHY traversal -
MISSING_DEPENDENCY - VERSION_MISMATCH - CONTENT_HASH_MISMATCH -
deterministic/canonical serialization - fail-closed historical reading -
explicit `contractVersion=1`

Convención: - `Area COMPUTED_FROM Geometry` -
`Claim SUPPORTED_BY Evidence`

Resultado final reproducible: **322 PASS / 0 FAIL**, excluyendo 2 tests
IFC bloqueados por ausencia de `ifcopenshell`.

H-001 NO implementa: - propagation; - invalidation; - recomputation; -
geometry mutation; - BIM write; - autonomous decision; - full
architectural causality.

### Riesgos H-001 después del máximo de 10 exámenes

P1 `CONCURRENT_WRITER_UNIQUENESS` --- KNOWN_RISK / DEFERRED\
Check-before-write no garantiza atomicidad bajo escritores concurrentes.

P2 `EVENT_STORE_QUERY_SCALING` --- PERFORMANCE_DEBT / DEFERRED\
Rebuild desde Event Store por consulta.

P3 `RELATION_ONTOLOGY_COMPLETENESS` --- SEMANTIC_SCOPE_LIMIT / DEFERRED.

P4 `FINGERPRINT_NAMING` --- NAMING_SEMANTIC_DEBT / DEFERRED.

P5 `IFC_FULL_SUITE` --- ENVIRONMENT_BLOCKED.

No aceptar estos puntos como resueltos sin evidencia nueva.

------------------------------------------------------------------------

## 4. H-002 --- ESTADO ACTUAL

H-002 es read-only Impact Analysis / WHAT-IF.

Regla: `IMPACT DETECTED ≠ CHANGE EXECUTED`.

Debe descubrir dependientes transitivos de una referencia exacta@version
sin invalidar ni recomputar.

### Pasada 1

Prototipo: - cadena transitive; - exact version; - branching/join; -
unrelated branch; - cycles bounded; - project isolation.

6 tests focales PASS.

Debilidad: un solo `viaRecordId` perdía caminos alternativos.

### Pasada 2

Rediseño: - ImpactPath - ImpactedArtifact - ImpactReport -
ImpactAnalyzer - min_depth - múltiples paths - derivation record IDs por
salto - max_paths_per_artifact con fail-closed

8 tests focales PASS.

### Pasada 3

Debilidad: el mismo ciclo podía representarse rotado según el punto de
entrada.

Se empezó a añadir `_canonical_cycle(...)` y test de canonicalización.

**La ejecución posterior quedó interrumpida.** Estado:
`H-002 PASS 3 = WIP / NOT VERIFIED AFTER LAST PATCH`.

Deep no debe asumir que esa corrección funciona.

------------------------------------------------------------------------

## 5. ATAQUES QUE DEEP DEBE REALIZAR

Prioridad alta:

1.  ¿`output → dependency` es una dirección semántica sostenible para
    genealogías computacionales, arquitectónicas y epistémicas?
2.  ¿Una salida@version debe tener exactamente una derivación, o puede
    tener múltiples justificaciones válidas?
3.  ¿Impact paths completos son correctos o generan explosión
    combinatoria inmanejable?
4.  ¿`max_paths_per_artifact` fail-closed es la política adecuada?
5.  ¿La canonicalización de ciclos por rotación es suficiente? ¿Qué
    ocurre con ciclos equivalentes en dirección inversa?
6.  ¿Exact-version impact es demasiado estricto para algunos tipos de
    relación?
7.  ¿Cómo distinguir:
    -   computational dependency;
    -   architectural causality;
    -   epistemic support;
    -   normative applicability; sin contaminar H-002?
8.  ¿Un Event Store es fuente adecuada para construir el índice de
    impacto o debe existir read-model derivacional?
9.  ¿Qué pasa con eventos históricos corruptos/importados?
10. ¿Qué pasa con branching + join + cycle + multiple project scopes
    simultáneamente?
11. ¿Puede H-002 producir falsos positivos de impacto sin inferir
    causalidad?
12. ¿Puede producir falsos negativos si una dependencia arquitectónica
    no está registrada como derivación?
13. ¿Cómo reportar UNKNOWN sin inventar una arista?
14. ¿Cómo preservar Human Authority?
15. ¿Qué invariantes deben probarse antes de H-003?

------------------------------------------------------------------------

## 6. CASO FUTURO DE REFERENCIA

`Wall W1 +0.80m`

No resolverlo todavía como E2E, pero usarlo para desafiar el modelo.

Esperado eventualmente: Wall → RoomBoundary → Openings → Area →
Circulation → Facade → Quantities → Cost → Evaluations → Drawings/BIM.

Preguntar: - ¿qué aristas son computacionales? - ¿cuáles
arquitectónicas? - ¿cuáles físicas? - ¿cuáles normativas? - ¿cuáles
requieren re-evaluación profesional? - ¿cuáles son UNKNOWN?

No aceptar un mapa programado manualmente como causalidad descubierta.

------------------------------------------------------------------------

## 7. REGLAS DE RESPUESTA DE DEEP

Para cada hallazgo devolver:

-   ID
-   Severidad: CRITICAL / HIGH / MEDIUM / LOW
-   Claim atacado
-   Evidencia
-   Contraejemplo reproducible
-   Qué demuestra realmente
-   Qué NO demuestra
-   Corrección mínima
-   Si bloquea H-002
-   Si puede diferirse
-   Test adversarial recomendado

No implementar. No canonizar vocabulario nuevo innecesariamente. No
asumir que cinco genealogías/20 estados/50 relaciones son correctos. No
usar marketing.

------------------------------------------------------------------------

## 8. PRINCIPIOS FIJOS

-   CLAIM ≠ ARTIFACT ≠ INTEGRITY ≠ PROVENANCE ≠ VERIFICATION ≠ FACT.
-   EVENT STORE ≠ DEPENDENCY GRAPH.
-   EVENT REPLAY ≠ IMPACT PROPAGATION.
-   PARENTAGE ≠ SEMANTIC DEPENDENCY.
-   CHANGE ≠ PROPAGATION.
-   IMPACT DETECTED ≠ CHANGE EXECUTED.
-   EXPECTED IMPACT ≠ DISCOVERED IMPACT.
-   DIRECT IMPACT LOOKUP ≠ TRANSITIVE IMPACT ANALYSIS ≠ CAUSAL
    PROPAGATION.
-   DECISION HISTORY ≠ CURRENT JUSTIFICATION.
-   Hash ≠ truth.
-   Human Authority remains.

------------------------------------------------------------------------

## 9. SALIDA ESPERADA DE DEEP

Primero atacar H-001 residual + H-002 WIP.

Terminar con:

`DEEP_VERDICT_H001 = ...` `DEEP_VERDICT_H002 = ...`
`BLOCKERS_BEFORE_H003 = [...]` `RECOMMENDED_MINIMAL_FIXES = [...]`
`ADVERSARIAL_TESTS = [...]`

No declarar H-002 cerrado; su Pasada 3 todavía requiere verificación
runtime.

**FIN DE DEEP SYNC.**
