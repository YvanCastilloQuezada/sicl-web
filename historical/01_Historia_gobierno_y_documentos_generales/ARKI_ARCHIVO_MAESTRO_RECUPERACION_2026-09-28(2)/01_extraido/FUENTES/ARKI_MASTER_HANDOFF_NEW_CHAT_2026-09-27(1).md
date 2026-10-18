# ARKI --- MASTER HANDOFF PARA NUEVO CHAT

**Fecha de corte:** 2026-09-27\
**Autoridad final:** Yvan Castillo\
**Rol ChatGPT:** arquitecto principal, ejecutor técnico, auditor y
responsable de continuidad\
**Estado:** trabajo autónomo autorizado; pedir intervención de Yvan sólo
cuando sea materialmente indispensable.

------------------------------------------------------------------------

## 0. INSTRUCCIÓN DE ARRANQUE PARA EL NUEVO CHAT

Este documento es el estado de continuidad. No reiniciar el proyecto ni
volver a preguntar decisiones ya fijadas.

Al recibir este handoff:

1.  Tratar **ARKI/ARQUI** como el proyecto activo.
2.  `SICL` y `Vitruvio` son nombres/etapas históricas del mismo linaje;
    no crear proyectos separados.
3.  **MiLukita es proyecto hermano/gemelo separado**: no tocarla en este
    frente.
4.  UPAO Plaza Center no es proyecto activo/relevante para este frente.
5.  Mantener Human Authority: Yvan decide asuntos materiales; ChatGPT
    ejecuta todo lo demás.
6.  No depender de Manus como ejecutor ordinario. ChatGPT debe
    investigar, diseñar, modificar, probar, auditar y documentar
    directamente cuando sus herramientas lo permitan.
7.  No fingir commits, pushes, runtime o integración que no hayan
    ocurrido.
8.  Continuar exactamente desde **H-002 --- Impact Analysis / WHAT-IF**,
    usando H-001 reforzado como baseline.
9.  Antes de avanzar de una fase a otra, aplicar el protocolo de
    repetición descrito en §3.
10. Mostrar en pantalla avances sustantivos mientras se trabaja y
    entregar ZIP/reporte al cierre de cada bloque importante.

------------------------------------------------------------------------

# 1. OBJETIVO DE ARKI

ARKI busca convertirse en un **arquitecto artificial profesional**, no
en un generador de imágenes, chatbot ni simple optimizador.

Debe poder cerrar el ciclo:

`PROBLEMA → HECHOS/UNKNOWN → RESTRICCIONES → CONOCIMIENTO/NORMAS → ESTRATEGIAS → GENERAR → SIMULAR → EVALUAR → CRITICAR → OPTIMIZAR → MUTAR → PROPAGAR DEPENDENCIAS → RE-EVALUAR → COMPARAR → 16→4→1 → HUMAN REVIEW`

Debe ser multiescala: objeto/componente → ambiente → edificio → conjunto
→ ciudad → territorio/país. Cada escala tiene normas, jurisdicción,
fuentes y verificaciones propias. No extrapolar automáticamente normas
entre escalas.

------------------------------------------------------------------------

# 2. REGLAS EPISTÉMICAS Y DE EVIDENCIA

No subir claims silenciosamente de categoría.

Taxonomía: - VISION - DOCUMENTED - CODE_EVIDENCE - RUNTIME_EVIDENCE -
IMPLEMENTED - VERIFIED - E2E_VERIFIED -
PROFESSIONAL_VALIDATION_REQUIRED - UNKNOWN - PROPOSAL

Estados de capacidad: - VERIFIED - IMPLEMENTED - PARTIAL -
DISCONNECTED - CODE_EVIDENCE_ONLY - DOCUMENTED_ONLY - STUB - ABSENT -
UNKNOWN

Principios que deben preservarse:

-   CLAIM ≠ ARTIFACT ≠ INTEGRITY ≠ PROVENANCE ≠ VERIFICATION ≠ FACT.
-   Hash prueba integridad, no verdad.
-   DECLARED_PROPAGATION ≠ COMPUTED_PROPAGATION ≠ VERIFIED_PROPAGATION.
-   DECLARED DEPENDENCY ≠ EXECUTABLE DEPENDENCY.
-   COMPUTATIONAL DEPENDENCY ≠ ARCHITECTURAL DEPENDENCY.
-   INTEGRITY ≠ CURRENT APPLICABILITY.
-   PROVENANCE ≠ DERIVATION COMPLETENESS.
-   PARENTAGE ≠ ARCHITECTURAL/SEMANTIC DEPENDENCY.
-   BIM OBJECT RECOGNITION ≠ ARCHITECTURAL CAUSAL UNDERSTANDING.
-   NAME / IFC CLASS / GEOMETRY / PARAMETER ≠ UNDERSTANDING.
-   EVENT STORE ≠ DEPENDENCY GRAPH.
-   EVENT REPLAY ≠ IMPACT PROPAGATION.
-   REALTIME TRANSPORT ≠ REACTIVE REASONING.
-   CHANGE ≠ PROPAGATION.
-   IMPACT DETECTED ≠ CHANGE EXECUTED.
-   EXPECTED IMPACT ≠ DISCOVERED IMPACT.
-   TEST DEFINITION ≠ TEST EXECUTION.
-   PROJECT VERSION ≠ DEPENDENCY VERSION.
-   DECISION HISTORY ≠ DECISION CURRENT JUSTIFICATION.
-   KNOWLEDGE AVAILABLE ≠ KNOWLEDGE INTEGRATED INTO GENERATION.
-   PROJECT MODEL ≠ ARCHITECTURAL RELATIONSHIP MODEL.
-   VISUALIZATION ≠ SIMULATION ≠ ARCHITECTURAL REASONING.
-   PROVENANCE LABEL ≠ REFERENTIAL PROVENANCE.
-   EXPLANATION TEXT ≠ MACHINE-TRAVERSABLE JUSTIFICATION.
-   LOCAL EXPLANATION ≠ FULL JUSTIFICATION TRACE.
-   DIRECT IMPACT LOOKUP ≠ TRANSITIVE IMPACT ANALYSIS ≠ CAUSAL
    PROPAGATION.

------------------------------------------------------------------------

# 3. PROTOCOLO DE TRABAJO AUTORIZADO POR YVAN

Yvan autorizó a ChatGPT a avanzar automáticamente salvo que su
participación sea indispensable.

## Regla de doble pasada + refuerzo

Para cada bloque importante:

### Pasada 1

Reconstruir/implementar → ejecutar pruebas → auditar → corregir.

### Pasada 2

Volver al baseline limpio → repetir independientemente → comparar
resultados.

### Puntos flacos

Cualquier debilidad detectada debe atacarse **todas las veces
necesarias, máximo 10 exámenes**.

Si persiste al examen 10: - no ocultarla; - no marcarla PASS; -
registrarla como KNOWN_RISK / DEFERRED / ENVIRONMENT_BLOCKED /
SEMANTIC_SCOPE_LIMIT según corresponda; - explicar evidencia, impacto y
ruta de corrección posterior.

## Coste de auditoría

Flujo normal:
`execute → deterministic local tests → validation → continue`.

Usar auditoría externa sólo cuando aporte valor material: seguridad,
core architecture, datos, autonomía, publicación, irreversible loss,
credenciales, E2E crítico o contradicción material.

DeepSeek = Red Team/research independiente.\
Qwen = fuente de investigación histórica/cognitiva cuando corresponda.\
Manus = no ejecutor ordinario; usar sólo si una capacidad necesaria no
puede ejecutarse aquí.

------------------------------------------------------------------------

# 4. RUTA DE ENDURECIMIENTO

Secuencia acordada:

1.  H-001 --- Derivation Integrity Foundation
2.  H-002 --- Impact Analysis / WHAT-IF
3.  H-003 --- Validity + Invalidation
4.  H-004 --- Reaction Planning
5.  H-005 --- Selective Recomputation
6.  H-006 --- Architectural Re-evaluation / Critique
7.  H-007 --- Wall-Move E2E
8.  Integración 16→4→1
9.  Optimización
10. BIM/paramétrico
11. Representación/output
12. Frontend al final

No saltar directamente al frontend.

------------------------------------------------------------------------

# 5. 16→4→1

-   16 = exploración esquemática amplia y barata.
-   4 = finalistas con evaluación más profunda.
-   1 = alternativa seleccionada desarrollada a mayor profundidad
    BIM/documental.

A menor número de alternativas, mayor profundidad geométrica, BIM,
simulación y documentación.

Principio: **semantic fidelity before visual fidelity**.

El modelo debe evolucionar/enriquecerse, no redibujarse
desconectadamente.

------------------------------------------------------------------------

# 6. CASO E2E OBJETIVO --- WALL MOVE

Caso futuro de prueba:

`W1 +0.80 m`

Debe permitir razonar y mostrar consecuencias sobre: - límites de
ambientes; - puertas/hosted openings; - áreas; - circulación; -
fachada; - cantidades; - costo; - evaluaciones; -
planta/sección/elevación/3D; - restricciones/normas afectadas; -
decisiones cuya justificación dejó de ser actual.

Cadena deseada:

`CHANGE → IMPACT ANALYSIS → REACTION PLAN → AUTHORIZED EXECUTION → RECOMPUTE → RE-EVALUATE → CRITIQUE → VERIFY`

No ejecutar consecuencias durante Impact Analysis.

------------------------------------------------------------------------

# 7. RADIOGRAFÍA PREVIA --- CONCLUSIONES IMPORTANTES

Se inspeccionaron paquetes SICL Core/Web.

Históricamente: - Core mostró 304 tests PASS excluyendo 2 IFC
dependientes de `ifcopenshell`. - Web tenía tests pero sin
`node_modules`; no afirmar runtime Web si no se ejecuta. - Parametric
Runtime real pero acotado:
constant/add/multiply/rectangle_points/translate_points/scale_points. -
Pareto real. - Monte Carlo real. - BIM contracts reales pero live
mutation/dependency regeneration no demostrados. - Project Brain tiene
FACT/ASSUMPTION/HYPOTHESIS/UNKNOWN/CONFLICT y política de suficiencia. -
Integrated Architect Cycle existe pero es conceptual/acotado. - D6.2
tiene reevaluación selectiva acotada. - D6.3 tiene trazabilidad de
perturbación hasta geometría, pero impacto declarado/programado, no
descubierto por un grafo general. - Event Store es append-only pero
pasivo. - `.ARK` puede transportar semántica, pero relaciones generadas
estaban vacías en inspecciones previas. - Core tiene
Source/Evidence/Fact/Assumption/Decision/HumanReview separados, pero no
cadena universal de justificación actual. - Cost module ya tenía buen
patrón ESTIMATE→STALE→RECALCULATE→DELTA, pero trigger
domain-specific/manual. - No se encontró antes de H-001 un
`VersionedRef`, `TypedRelation` o `DerivationRecord` transversal
genérico equivalente.

Arquitectura provisional:

`PROJECT BRAIN` → `ARCHITECTURAL SEMANTICS` →
`DERIVATION / DEPENDENCY NERVOUS SYSTEM` → `IMPACT` → `REACTION` →
`DOMAIN ENGINES` → `RE-EVALUATION` → `CRITIQUE` → `PARETO` →
`HUMAN DECISION`

------------------------------------------------------------------------

# 8. H-001 --- DERIVATION INTEGRITY FOUNDATION

## Propósito

Responder computablemente: - ¿de dónde salió este resultado? - ¿qué
entidades exactas@version consumió? - ¿qué método@version lo produjo? -
¿qué relación existe? - ¿siguen existiendo esos inputs? - ¿siguen siendo
esas versiones? - ¿mantienen su identidad de contenido?

H-001 es READ-ONLY respecto de consecuencias.

## Primitivas

-   `VersionedRef`
-   `TypedRelation`
-   `DerivationRecord`
-   `DerivationLedger` como adapter sobre Event Store existente

## Convención semántica reforzada

Sujeto → predicado → dependencia: - `Area COMPUTED_FROM Geometry` -
`Claim SUPPORTED_BY Evidence`

No aceptar simultáneamente dirección opuesta como equivalente.

## Endurecimientos ejecutados

Se detectaron/corrigieron: - dirección semántica contradictoria; -
output usado como input; - inputs duplicados; - relaciones duplicadas; -
IDs de derivación contradictorios; - dos derivaciones distintas para
mismo output@version; - repetición idéntica idempotente; -
`MISSING_DEPENDENCY` separado de `VERSION_MISMATCH`; -
`CONTENT_HASH_MISMATCH`; - lectura histórica fail-closed; - conflicto
histórico por ID/output; - assumptions normalizados y únicos; -
fingerprint canónico independiente del orden; - rechazo de campos
desconocidos; - `contractVersion=1`; - no acciones automáticas.

## Resultado final reproducible de H-001

Último cierre: - **322 passed / 0 failed** en suite Core reproducible. -
`compileall`: PASS. - métodos de acción prohibidos en H-001: NONE.

Dos tests IFC seguían fuera por ausencia de `ifcopenshell`; no instalar
silenciosamente.

## Riesgos diferidos tras máximo de 10 exámenes

P1. `CONCURRENT_WRITER_UNIQUENESS` --- KNOWN_RISK / DEFERRED.\
La unicidad output@version no está garantizada atómicamente frente a dos
escritores concurrentes; posible TOCTOU.

P2. `EVENT_STORE_QUERY_SCALING` --- PERFORMANCE_DEBT / DEFERRED.\
`list()` reconstruye desde eventos; futuro read-model/index.

P3. `RELATION_ONTOLOGY_COMPLETENESS` --- SEMANTIC_SCOPE_LIMIT /
DEFERRED.\
No inventar matriz masiva de relaciones prematuramente.

P4. `FINGERPRINT_NAMING` --- NAMING_SEMANTIC_DEBT / DEFERRED.

P5. `IFC_FULL_SUITE` --- ENVIRONMENT_BLOCKED por `ifcopenshell`.

## Artefactos H-001 disponibles en conversación

-   `ARKI_H001_EXAMEN_10_PACKAGE.zip`
-   `ARKI_H001_EXAMEN_10_REDTEAM_DEEPSEEK.md`
-   SHA-256 del paquete:
    `2b08ed93c5e82b63079e52f6c06e15e01e11efe4ef74beef101bde4d729b6b10`

No confundir con versiones H-001 anteriores.

------------------------------------------------------------------------

# 9. H-002 --- IMPACT ANALYSIS / WHAT-IF --- ESTADO EXACTO

**H-002 está INICIADO, NO CERRADO.**

Objetivo: dado un `changed_ref` exacto, recorrer en sentido inverso las
derivaciones H-001 para descubrir artefactos dependientes de forma
transitiva.

Principio: `IMPACT DETECTED ≠ CHANGE EXECUTED`.

H-002 no debe: - invalidar; - recalcular; - mutar; - escribir BIM; -
decidir; - modificar Human Authority.

## Pasada 1 ejecutada

Se implementó prototipo `ImpactAnalyzer`.

Pruebas iniciales: - cadena `G1@3 → A1@1 → Q1@2 → C1@4`; - impacto
transitive depths 1/2/3; - exact version: `G1@4` no hereda dependientes
de `G1@3`; - branching/join; - unrelated branch; - cycle bounded; -
project isolation.

Resultado focal inicial: **6 PASS**.

### Debilidad detectada

Un único `viaRecordId` por artefacto perdía caminos alternativos.
Ejemplo: Cost podía depender de Geometry por Area y también por
Perimeter.

## Pasada 2

Contrato redefinido para conservar: 1. artefactos afectados; 2.
profundidad mínima; 3. todos los caminos relevantes; 4. derivation
record de cada salto; 5. read-only.

Se introdujeron conceptualmente: - `ImpactPath` - `ImpactedArtifact` -
`ImpactReport` - `ImpactAnalyzer(max_paths_per_artifact=32)`

Se añadió fail-closed ante explosión de paths en vez de truncamiento
silencioso.

Resultado focal: **8 PASS**.

## Pasada 3

Ataques: - paths alternativos; - explosión combinatoria; - ciclos; -
versión exacta; - aislamiento.

Debilidad detectada: la representación del mismo ciclo podía variar por
rotación según punto de entrada.

Se empezó a implementar `_canonical_cycle(...)` para canonicalización
rotacional y test: `test_cycle_representation_is_canonical`.

**IMPORTANTE:** la ejecución final de esa corrección fue interrumpida
por el cambio de conversación/petición del usuario.\
Por tanto:

`H-002 PASADA 3 = WIP / NOT VERIFIED AFTER LAST PATCH`

No afirmar PASS de la canonicalización hasta volver a ejecutar tests.

### Primer trabajo del nuevo chat

1.  Recuperar el baseline H-001 examen 10.
2.  Reconstruir `impact.py` y `test_impact.py` desde este handoff o
    desde artefactos disponibles.
3.  Reaplicar/confirmar `_canonical_cycle`.
4.  Ejecutar tests focales.
5.  Ejecutar regresión Core reproducible.
6.  Continuar ataques 4...10 sólo si aparecen puntos flacos.
7.  Si H-002 queda sólido antes del examen 10, hacer al menos la doble
    pasada desde baseline según protocolo.
8.  Crear ZIP + reporte DeepSeek antes de autorizar H-003.

------------------------------------------------------------------------

# 10. GITHUB Y REPOSITORIOS

Repositorios declarados por Yvan: -
`https://github.com/YvanCastilloQuezada/sicl-web` -
`https://github.com/YvanCastilloQuezada/sicl-core`

En la conversación anterior, el conector GitHub de ChatGPT devolvió: -
installed accounts: 0 - installations: 0 - accessible repos: 0 - lookup
directo: 404 desde el conector

Esto no prueba que los repos no existan; prueba que el conector no
estaba autorizado/instalado.

No afirmar que se hizo push/commit a GitHub si no se verifica.

La implementación H-001 de Manus se hizo en workspace local y declaró: -
repo `YvanCastilloQuezada/sicl-core` - branch `main` - starting HEAD
`1ef0db8420f268a43ae3c92d86a4443a5514359c` - sin commit/push/merge.

ChatGPT posteriormente endureció H-001 en entorno de trabajo y produjo
paquetes, pero no afirmar persistencia en GitHub hasta verificarla.

------------------------------------------------------------------------

# 11. BRIDGE --- ESTADO CONGELADO

No reabrir salvo necesidad real.

-   `BRIDGE_CLOSEOUT=PASS`
-   `BASELINE_FROZEN=YES`
-   `REAL_E2E_VERIFIED=YES`
-   scope: `SYNTHETIC_CONTROLLED_ARKI_AGENT_BRIDGE`
-   `ARKI_INTEGRATION_VERIFIED=NO`
-   `COLD_START_CONTINUITY=PASS`
-   `MANIFEST_HASH_MATCH=PASS`
-   `SECRET_SCAN=PASS`
-   blocker: NONE

Paquete histórico: `ARKI_CONTINUITY_PACKAGE_2026-09-25_alpha8.zip`

SHA-256:
`010c8205d65c2f7d650879edb6907ec8d373423dd96a1db61228c79d0bb8dc51`

No confundir bridge synthetic E2E con integración ARKI real.

------------------------------------------------------------------------

# 12. DEEPSEEK / QWEN --- CONTEXTO

## Qwen

Documento de cognitive blind spots: - problem discovery; - productive
ambiguity; - embodied experience; - frame criticism; - calibrated
epistemic humility; - stopping judgment; - stakeholder tradeoffs; -
causality/dependency/provenance/invalidation questions.

Útil como investigación; no prueba capacidades actuales.

## DeepSeek

Self-audit previo convergió con la radiografía: - seis modelos
conceptuales; - genealogías; - necesidad de reactive dependency
network; - downstream invalidation; - minimal recompute; - current
justification vs decision history; - semantic versioning; - normative
traceability; - closed INTENT→...→BIM no demostrado.

Clasificación:
`INDEPENDENT CONCEPTUAL CORROBORATION / NOT CODE EVIDENCE / NOT CANONIZED`.

No congelar automáticamente "cinco genealogías", 20 estados o 50
relaciones.

------------------------------------------------------------------------

# 13. PRINCIPIOS DE DISEÑO QUE NO DEBEN ROMPERSE

1.  Event Store = memoria histórica, no cerebro reactivo.
2.  Parametric Runtime = executor, no arquitecto.
3.  Domain engines no deben convertirse en orquestador cognitivo.
4.  Antes de mutar:
    `CHANGE → THINK CONSEQUENCES → IMPACT PLAN → AUTHORIZATION → EXECUTION`.
5.  WHY = backward derivation traversal.
6.  WHAT IF = forward/reverse-dependency impact traversal.
7.  Impact analysis no puede inferir automáticamente STALE.
8.  Invalidation y reaction policy pertenecen a fases posteriores.
9.  Recompute técnico no basta; luego debe existir re-evaluación
    arquitectónica.
10. Human Authority se mantiene.
11. Semantic fidelity before visual fidelity.
12. No gates auto-declarados PASS sin evidencia calculada.
13. No instalar dependencias silenciosamente sólo para conseguir verde.
14. No esconder blockers ambientales.
15. No inventar normativa, evidencia, hechos ni causalidad.

------------------------------------------------------------------------

# 14. ARQUITECTURA OBJETIVO PROVISIONAL

`VERSIONED STATE` → `CHANGE/EVENT` → `TYPED RELATIONS` →
`DERIVATION RECORDS` → `IMPACT ANALYSIS` → `VALIDITY/INVALIDATION` →
`REACTION PLAN` → `SELECTIVE RECOMPUTATION` → `DOMAIN ENGINES` →
`ARCHITECTURAL RE-EVALUATION` → `CRITIQUE` → `MUTATE / REFRAME / HOLD` →
`HUMAN REVIEW`

Todavía PROPOSAL en las capas no implementadas.

------------------------------------------------------------------------

# 15. COGNITIVE CLOSURE

Objetivo de largo plazo:

`OBSERVE → UNDERSTAND → REPRESENT → REASON → PROPOSE → MUTATE → PROPAGATE → SIMULATE → EVALUATE → CRITIQUE → LEARN/REFRAME → LOOP`

Matriz útil:
`CAPABILITY × KNOW × REPRESENT × REASON × ACT × PROPAGATE × VERIFY × LEARN`.

------------------------------------------------------------------------

# 16. QUÉ NO HACER AL ABRIR EL NUEVO CHAT

-   No volver a hacer radiografía completa salvo evidencia de baseline
    nuevo.
-   No empezar frontend.
-   No mandar trabajo rutinario a Manus.
-   No tratar SICL, Vitruvio y ARKI como tres proyectos.
-   No tocar MiLukita.
-   No afirmar que H-002 está cerrado.
-   No saltar H-002→H-003 sin pruebas.
-   No convertir mismatch en STALE dentro de H-002.
-   No instalar `ifcopenshell` sin una razón/decisión explícita de
    entorno.
-   No inventar acceso GitHub.
-   No perder los riesgos H-001 P1--P5.
-   No aceptar un test verde como prueba de corrección arquitectónica.

------------------------------------------------------------------------

# 17. PRIMER MENSAJE OPERATIVO SUGERIDO PARA EL NUEVO CHAT

> Continúa ARKI desde el MASTER HANDOFF. Asume ejecución autónoma.
> Retoma H-002 exactamente en la Pasada 3: canonicalización de ciclos
> pendiente de verificación. Reconstruye el working baseline H-001
> examen 10, ejecuta los tests focales y la regresión Core, aplica la
> regla de máximo 10 exámenes para cualquier punto flaco y no avances a
> H-003 hasta cerrar H-002 con paquete ZIP + reporte para DeepSeek.
> Muéstrame en pantalla el progreso sustantivo.

------------------------------------------------------------------------

# 18. AUTORIDAD

Yvan conserva decisión final sobre asuntos materiales.

ChatGPT está autorizado para: - investigar; - diseñar; - editar
código; - crear tests; - ejecutar tests; - auditar; - corregir; -
documentar; - generar paquetes; - avanzar entre subpasos no
materiales; - repetir pruebas hasta 10 veces por punto flaco.

Solicitar a Yvan sólo cuando: - haya dos arquitecturas incompatibles con
consecuencias materiales; - se requieran credenciales/permisos; - una
acción sea irreversible/destructiva; - implique
publicación/deploy/merge/push no previamente autorizado; - exista una
decisión profesional/negocio/normativa que deba tomar un humano.

**FIN DEL HANDOFF.**
