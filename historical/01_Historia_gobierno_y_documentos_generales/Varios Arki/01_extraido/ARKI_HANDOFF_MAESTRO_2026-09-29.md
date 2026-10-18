# ARKI / ARQUI --- HANDOFF MAESTRO DE CONTINUIDAD

**Fecha:** 2026-09-29\
**Objetivo:** continuar ARKI/ARQUI en otro chat sin reiniciar ideación,
perder decisiones ni duplicar órganos existentes.

## 0. Mensaje de arranque para el nuevo chat

Continuamos **ARKI/ARQUI desde implementación, no desde ideación**.
Revalida siempre los HEAD reales antes de tocar código. No crees segundo
D-2, segundo estado canónico, segundo Event Log, segundo ledger ni
segundo cerebro.

**IMPLEMENTAR → TESTEAR → INSPECCIONAR → CORREGIR → CONTINUAR**

Reglas: mínima burocracia, máximo rigor técnico; CLAIM ≠ IMPLEMENTED ≠
VERIFIED; CODE_PRESENT ≠ INTEGRATED ≠ CANONICAL; TEST GREEN ≠ corrección
arquitectónica; no evidencia → UNKNOWN; Human Authority explícita; no
inventar geometría, relaciones, normas, estructura, circulación, niveles
ni decisiones humanas.

## 1. Identidad

ARKI/ARQUI es el proyecto antes denominado Vitruvio/SICL. No tratarlos
como proyectos independientes.

**SICL ES EL ADN DE ARKI, no un órgano separado.**

ARKI debe funcionar como un **Super Arquitecto**: recibe un encargo,
investiga, razona, sintetiza, explora alternativas, desarrolla
propuestas, evalúa, maneja UNKNOWN, explica causalidad, solicita
decisiones humanas y produce un único estado arquitectónico canónico del
que derivan las representaciones.

No debe reducirse a generador de imágenes, layouts sintéticos, chatbot
con plantillas, optimizador aislado o frontend que simule canonicalidad.

## 2. Cadena cognitiva objetivo

**ENCARGO/CLIENTE/CONTEXTO → PROJECT BRAIN → D6.2 REASONING →
SÍNTESIS/PARTI → D6.3 MANIFESTACIÓN GEOMÉTRICA → ARKI ARCHITECTURAL
DEVELOPER → DEVELOPER PROPOSAL PRE-D-2 → HUMAN REVIEW → PROMOCIÓN
CONTROLADA → D-2 → REPRESENTATION/ARE → ARKI-DRAW/SVG/IFC**

Exploración amplia; estado canónico único.

## 3. Modelo del organismo

### D-2 --- cuerpo/esqueleto

D-2 es el único estado arquitectónico canónico. No crear estado
paralelo. D6.3 y Developer no son D-2.

### H-001/H-002/H-003/H-004/H-005 + Events --- sistema nervioso

Derivación, impacto, reacción, recomputación, evidencia y eventos
explican dependencias y consecuencias. No convertir H-001 en grafo
universal de relaciones espaciales.

### Project Brain / D6.2 --- cerebro

Problema, contexto, hipótesis, UNKNOWN, conflictos, razonamiento,
síntesis, WHY y Human Authority.

### Architectural Developer

Proceso de desarrollo arquitectónico controlado. Toma
hipótesis/parti/candidato y desarrolla función, espacio, geometría,
contexto, restricciones, relaciones, mutaciones y feedback. Produce
DeveloperProposal pre-D-2. No promueve.

### Human Authority

La promoción es humana y explícita. AI_PROPOSED ≠ HUMAN_DECIDED.

## 4. Cuatro universos separados

1.  Knowledge.
2.  Reasoning.
3.  Proposals.
4.  Architectural State (D-2).

Una propuesta no es un hecho. Una hipótesis no es decisión. Una
representación no es el modelo. Una imagen no es un plano.

## 5. Proceso arquitectónico que ARKI debe reproducir

1.  Entrevista/encargo.
2.  Separar USER_REQUEST / ARCHITECT_RECOMMENDATION / HUMAN_DECISION.
3.  Q&A activo; preguntar sólo lo no recuperable.
4.  Sitio/contexto: ubicación, dimensiones, frentes, clima, entorno,
    sol, terreno/topografía.
5.  Precedentes y tipología.
6.  Generar muchas hipótesis/candidatos.
7.  Podar progresivamente; no producir miles de edificios completos.
8.  Síntesis/Parti.
9.  Desarrollo funcional macro→micro:
    conjunto→sector→zona→subzona→ambiente.
10. Relaciones, ocupación y circulaciones públicas/servicio.
11. Función antes que forma, pero proceso no lineal: intuición temprana,
    desarrollo funcional, forma, feedback, backtracking/restarts.
12. Evaluar cumplimiento, función, espacio, geometría, contexto,
    restricciones, optimización y trade-offs.
13. Mantener genealogía y causas de rechazo.
14. Human Review.
15. Promoción a D-2.
16. Representar desde D-2.

**MODEL ONCE → REASON ONCE → REPRESENT MANY.**

## 6. Referentes

Edward T. White: FUNCTION, SPACE, GEOMETRY, CONTEXT,
LIMITATIONS/CONSTRAINTS → SYNTHESIS. El Parti es síntesis organizadora;
no se reduce a X/L/C/círculo/patio/piloti.

Ching: forma/espacio, organización, circulación, proporción, orden y
contexto.

Los autores son referencias, no plantillas ni reemplazos del arquitecto.

## 7. Redes arquitectónicas

ARKI debe manejar al menos cinco redes superpuestas: - funcional; -
circulación; - espacial; - física; - causal.

La causal pertenece a derivation/provenance. Las relaciones
arquitectónicas no deben forzarse dentro de H-001.

## 8. Core arquitectónico

Repo: `YvanCastilloQuezada/sicl-core`.

`src/sicl/archi/model.py`: ElementKind verificado = SITE, SPACE, WALL,
SLAB, COLUMN, BEAM, DOOR, WINDOW, OPENING. **No existe CIRCULATION.**

ArchiElement incluye hosted_in, contained_in, versiones, semantic_dict,
content_hash y VersionedRef.

`src/sicl/archi/relationships.py`: RelationshipKind = HOSTED_IN, BOUNDS.
ArchiRelationship es dirigida, versionada, ID determinista y prohíbe
self-reference.

Gap: ArchiElement.hosted_in/contained_in, ArchiRelationship y
DerivationLedger.TypedRelation son representaciones parcialmente
separadas. **No ampliar RelationshipKind sin gap demostrado.**

`src/sicl/derivation.py`: domains ARCHITECTURAL, COMPUTATIONAL,
EPISTEMIC, NORMATIVE, GOVERNANCE; relation types DERIVED_FROM,
COMPUTED_FROM, SUPPORTED_BY. No meter HOSTED_IN en DerivationRecord.

ArchiTransaction ya existe con cadena A-002/H-002/H-003/H-004/H-005. No
duplicarla. ADD_OPENING permanece fail-closed/no implementado en el
estado auditado. DELETE requiere Human Authority.

## 9. Event Store y reasoning transport

Core tiene Event Store SQLite append-only: id, timestamp, project_id,
type, payload, actor, source. Triggers `events_no_update` y
`events_no_delete`. No crear segundo Event Log.

Commit 4 añadió `POST /v1/projects/{project_id}/reasoning-executions`.

Event: `REASONING_EXECUTION_RECORDED`, source `ARKI_REASONING`.

Invariantes: append-only; sin tabla nueva; no incrementa
project.version; no promoción; no D-2; idempotencia por execution_id;
mismo id+contenido devuelve evento existente; mismo id+contenido
distinto → 409.

Kinds: PROJECT_BRAIN, D6_2, D6_3, DEVELOPER_PROPOSAL.

Epistemic status: FACT, ASSUMPTION, HYPOTHESIS, UNKNOWN, CONFLICT,
PROPOSAL.

D6_3 exige HYPOTHESIS. DEVELOPER_PROPOSAL permite HYPOTHESIS\|PROPOSAL.
PROJECT_BRAIN y D6_2 no pueden usar PROPOSAL.

## 10. D6.3 --- verdad semántica

Se corrigió el falso `canonical:true` y el falso G12 PASS del
hardcoding.

Estado: canonical=false; semanticStatus=HYPOTHESIS;
G12_NO_TEMPLATE_HARDCODING=FAIL; finalStatus=PARTIAL.

PARTIAL se propaga por D6.3 → Integrated Architect Cycle → Parti
validator → Unified Motor. No convertirlo falsamente en PASS o FAIL.

D6.3 sigue siendo manifestación geométrica hipotética, no D-2.

## 11. Parti

Parti ≠ forma, topología completa ni geometría. AI_PROPOSED ≠
HUMAN_DECIDED. UNKNOWN ≠ FAILURE.

El proof documental puede pasar sus propias gates mientras el nivel
superior conserva PARTIAL por D6.3. No tocar G10 sin auditoría
específica.

## 12. Reasoning transport web

Repo: `YvanCastilloQuezada/sicl-web`.

Commit 5 `9490c6b3e1ab452a8790f31517b93d12b556dfdc` cerró verde: -
`server/arkiFingerprint.ts`; - D6.2 reutiliza fingerprint; -
coreHttpClient tipado; - arkiCanonicalExecution usa snake_case Core; -
semántica de versiones corregida.

Cadena correcta: snapshot v7 → POST Brain observed_version 7 → refetch
sigue v7 → POST D6.2 observed_version 7.

Cambio de versión durante reasoning →
`CANONICAL_MUTATION_DURING_REASONING`.

## 13. Fingerprint

`server/arkiFingerprint.ts`: SHA-256 lowercase hex 64 sobre
`JSON.stringify(value)` con orden de inserción. Fue extraído de D6.2 sin
cambiar comportamiento. No introducir segunda implementación.

Pendiente futuro: migración coordinada a canonical JSON con claves
ordenadas antes de formalizar binding criptográfico
proposal→review→promotion. No mezclarla con otros commits.

## 14. Commits cerrados con CI real verde

-   Commit 1 --- Core baseline:
    `9543518e87a826df8d41de45c0e1dc1355f3d9ab`.
-   Commit 2 --- D6.3 semantic truth/PARTIAL:
    `83b528259f5386215ae40cb0d660293c155003e5`.
-   Commit 3 --- Relationships audit:
    `7ff971148b12049dd3e22708066ae3fa883a04fd`.
-   Commit 4 --- Reasoning Transport Core:
    `42f7071b2b8d7fc03fb9d3f26cf6b6dbebfd0cee`.
-   Commit 5 --- Web reasoning contract:
    `9490c6b3e1ab452a8790f31517b93d12b556dfdc`; CI `36536421970`
    SUCCESS; TypeScript/tests/build PASS.

## 15. Commit 6 --- estado actual

Fase: **DEVELOPER CONTRACT**. Repo: `sicl-web`. Baseline a revalidar:
`9490c6b3...`.

El usuario entregó diff definitivo para dos archivos: -
`shared/arkiDeveloperProposal.ts` -
`shared/arkiDeveloperProposal.test.ts`

**Commit 6 NO debe asumirse aplicado todavía.**

Reglas duras: no tocar arkiCanonicalExecution.ts, coreHttpClient.ts,
Core, D6.3, Parti ni Cycle; sin Zod; no reutilizar ArkiChangeProposal.

DeveloperProposal = propuesta arquitectónica pre-D-2. No es D-2, Human
Decision, ArkiChangeProposal ni DesignCandidate.

Tipos objetivo: DeveloperEpistemicStatus, DeveloperProvenanceRef,
DeveloperUnknown, DeveloperHumanAction, DeveloperMutation,
DeveloperFeedbackLoop, ProposedArchiElementDTO,
ProposedArchiRelationDTO, ProposedDerivationDTO, DeveloperProposal,
DeveloperProposalValidation.

Campos principales: proposalId, parentProposalId, sourceExecutionId,
sourceD63, fingerprint, epistemicStatus, proposedElements,
proposedRelations, proposedDerivations, unresolvedUnknowns,
requiredHumanActions, provenance, reviewRequired:true, mutation,
rejectedBecause, feedbackLoops.

Decisiones: kind y relationKind siguen string; Core decidirá mapeo en
Commit 8. sourceD63 es referencia, no copia de D63Result. UNKNOWN se
expresa vía unresolvedUnknowns, no elemento fantasma. `canonical:true`
prohibido. Relaciones/derivaciones sólo pueden referenciar
provisionalIds declarados.

## 16. Distinciones para Developer

ArkiChangeProposal ≠ DeveloperProposal: el primero cambia ProjectState;
el segundo es propuesta arquitectónica pre-D-2.

DesignCandidate ≠ DeveloperProposal: Funnel selecciona; Developer
desarrolla.

D63Result ≠ DeveloperProposal: D6.3 es manifestación geométrica
hipotética; DeveloperProposal añade desarrollo arquitectónico,
relaciones, derivaciones, UNKNOWN, provenance, feedback y Human Review.

## 17. Commit 7 previsto

Implementar `server/arkiArchitecturalDeveloper.ts` proposal-only. Debe
consumir DesignCandidate/D63Result seleccionado, Parti, Cycle, INPUT
explícito y UNKNOWNs; producir DeveloperProposal.

No mutar D-2; no escribir canonicalidad; no inventar elementos; no crear
CIRCULATION en Core; no ampliar RelationshipKind; no promover
automáticamente.

## 18. Commit 8 previsto

Core-owned validation/promotion. Aquí decidir: - ProposedArchiElementDTO
→ ArchiElement; - ProposedArchiRelationDTO → relaciones reales; - gap de
circulación; - derivaciones; - Human Review; - promoción usando órganos
existentes; - fuente canónica única.

No copiar dataclass Python al frontend como falso contrato.

## 19. Gap de circulación

D6.3 puede tener CirculationElement, pero Core D-2 no tiene CIRCULATION
en ElementKind. No resolver inventando enum, relación, tabla o estado
paralelo. Requiere decisión explícita de modelado durante
integración/promotion.

## 20. Generation / Optimization / Funnel

Ya existen generación, candidatos, Pareto/trade-offs y Design Funnel. No
confundir generación de candidatos con arquitectura profesional. Funnel
selecciona; Developer desarrolla.

Estados futuros contemplados: ACTIVE, MUTATED, DOMINATED, REJECTED,
INVALID, BLOCKED_UNKNOWN, HUMAN_REJECTED, SELECTED_FOR_DEVELOPMENT. No
introducirlos en Commit 6 sin necesidad demostrada.

## 21. Site Intelligence y multiescala

Existe base Open-Meteo/solar/fallback Trujillo. No asumir
DEM/hidrología/topografía profesional completos.

ARKI es multiescala:
componente→ambiente→edificio→conjunto→ciudad→territorio→región/país.
Cada escala tiene normas, jurisdicciones, fuentes y criterios propios.
No extrapolar normas automáticamente entre escalas.

## 22. Knowledge

Base acotada de design knowledge: Ching, Alexander, RNE/contexto
normativo. Distinguir teoría, norma, evidencia, recomendación y
decisión. KNOWLEDGE AVAILABLE ≠ INTEGRATED.

## 23. Representation / Drawing / IFC

ARE/SpatialRepresentation/Drawing/IFC son derivados. Representación ≠
estado canónico.

El fallo histórico de Plaza Trujillo mostró el error
PROMPT→CONCEPT→REPRESENTATION→RENDER sin suficiente desarrollo. Cadena
correcta: reasoning→proposal→development→D-2→representation.

## 24. Frontend

Frontend existente aceptado. No rediseñarlo sin necesidad. Debe servir
experiencia, visualización, interacción y Human Review. No debe ser
segundo generador canónico ni guardar segundo D-2.

## 25. Proyectos fuera de este frente

UPAO Plaza Center: descartado; no usar como próximo caso principal.

MiLukita: proyecto hermano separado; **no tocar**.

## 26. Microcaso de validación

Demostrar primero una cadena pequeña: INPUT → reasoning → parti → D6.3
hypothesis → DeveloperProposal → Human Review → Core promotion → D-2 →
representation.

Debe demostrar provenance, UNKNOWN, relaciones, derivación, no mutación
silenciosa, Human Authority y trazabilidad. Después escalar a caso más
exigente. No usar Plaza Trujillo.

## 27. Principios de calidad

La vida de las ideas es cruel: candidatos pueden morir con causa y
conservar genealogía. UNKNOWN no se rellena. Cumplir ≠ óptimo ≠
seleccionado ≠ Human Approved. Aesthetics/language importan pero no
deben reducirse a un escalar universal. La creatividad humana no se
reduce a if/else.

## 28. Recuperación y consolidación

**RECOVER → PROVE → CLASSIFY → MAP → CONSOLIDATE → REWIRE → VERIFY →
DEPRECATE DUPLICATES**

Antes de crear: buscar, inspeccionar contrato, determinar ownership,
reutilizar y extender sólo ante gap demostrado.

Pregunta guía: **¿Cómo hacemos que los órganos existentes se comporten
como un solo arquitecto?**

## 29. Ownership

Core: identidad, D-2, estado canónico, evidence, authority, derivation,
impact, reaction, recomputation, Event Store, validation/promotion.

Reasoning: Project Brain, D6.2, synthesis, Parti, hypotheses,
exploration, Developer proposal generation.

Representation: consume D-2 y deriva spatial representation, drawings,
SVG, IFC.

UI: muestra, interactúa y captura Human Review; no es autoridad
canónica.

## 30. Tres backbones prioritarios

1.  D-2 body.
2.  Derivation/Impact/Reaction/Recomputation nervous system.
3.  Brain→Synthesis→Developer→Human→D-2 cognitive cycle.

No dispersarse en funciones periféricas antes de cerrar estos backbones.

## 31. Protocolo de evidencia

Distinguir cuando aplique: Baseline, Input, Unknowns iniciales,
Reasoning activated, Knowledge reused, New knowledge, Deficits,
Strategies, Candidates, Rejected candidates, Geometry mutations,
Relationships changed, Active topology, Scenario results, Dependency
propagation, New deficits, Coverage, Evidence, UNKNOWN, UNKNOWN
resolution path, Human decisions y Promotion state.

## 32. Protocolo GitHub

CAMBIO → TESTS → RESULTADO → HALLAZGO → SIGUIENTE.

Revalidar HEAD antes de escribir. No declarar verde hasta CI real. Si
rojo: log→causa→corrección mínima. Cambios
pequeños/coherentes/reversibles.

## 33. Estado exacto al cerrar este handoff

Core relevante: `42f7071b2b8d7fc03fb9d3f26cf6b6dbebfd0cee`.

Web último HEAD verde confirmado:
`9490c6b3e1ab452a8790f31517b93d12b556dfdc`.

Commit 6: orden/diff definitivo recibido, **no aplicado todavía**.

Antes de aplicarlo: 1. revalidar sicl-web/main; 2. confirmar baseline o
investigar divergencia; 3. crear sólo `shared/arkiDeveloperProposal.ts`
y test; 4. no tocar módulos congelados; 5. `pnpm check`, `pnpm test`,
`pnpm build`; 6. inspeccionar CI real; 7. verde → Commit 6 cerrado; 8.
pasar a Commit 7.

## 34. Roadmap inmediato

Commit 6: DeveloperProposal DTO + validación + tests.\
Commit 7: Architectural Developer proposal-only.\
Commit 8: Core validation/mapping/promotion contract.\
Commit 9: microcaso controlado si el orden de integración lo requiere.\
Commit 10: conectar Developer a orquestación/transport/promotion según
contratos verificados.

## 35. Prohibiciones

No segundo D-2/Event Log/ledger/cerebro. No frontend canónico. No D6.3
canonical. No PASS para hardcoding conocido. No fabricar UNKNOWN. No
inventar CIRCULATION en Core. No ampliar RelationshipKind sin gap. No
HOSTED_IN en DerivationRecord. No copiar tipos Python al frontend como
contrato falso. No confundir Candidate/ChangeProposal/DeveloperProposal.
No migrar fingerprint a canonical JSON dentro de otro commit. No
promoción sin Human Review. No usar render como evidencia de diseño
profesional. No reabrir Plaza Trujillo. No tocar MiLukita.

## 36. Frases canónicas

**SICL ES EL ADN DE ARKI.**\
**ARQUI ES UN SUPER ARQUITECTO Y ESO LO CAMBIA TODO.**\
**Una propuesta no es D-2.**\
**Reasoning no incrementa project.version.**\
**Human Authority decide la promoción.**\
**No evidence → UNKNOWN.**\
**MODEL ONCE → REASON ONCE → REPRESENT MANY.**\
**TEST GREEN ≠ architectural correctness.**

## 37. Instrucción final

No empezar ARKI desde cero. Cinco commits están cerrados en verde y el
trabajo entra al Developer Contract.

Revalida HEAD, aplica el Commit 6 limitado a su contrato y tests,
ejecuta CI y sólo después continúa con Architectural Developer. El
objetivo no es acumular módulos: es cerrar el ciclo **razonar →
sintetizar → desarrollar → revisar → promover → representar** con un
único cuerpo canónico, trazabilidad completa y Human Authority.
