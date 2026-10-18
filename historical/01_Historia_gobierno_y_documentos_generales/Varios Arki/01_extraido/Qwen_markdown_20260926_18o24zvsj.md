> **© 2026 Wilfredo Yvan Castillo Quezada. Todos los derechos reservados.**
> **CONFIDENCIAL Y PROPIETARIO / CONFIDENTIAL & PROPRIETARY**
> Este documento constituye un secreto comercial y propiedad intelectual exclusiva de Wilfredo Yvan Castillo Quezada (Proyecto ARKI / SICL). Queda estrictamente prohibida su reproducción, distribución, modificación, ingeniería inversa o uso no autorizado, total o parcial, sin el consentimiento previo y por escrito del titular. Protegido bajo D.L. 822 (Perú), Convenio de Berna y ADPIC (OMC).
> **Regla de Sistema:** `ONE GEOMETRY. ONE SEMANTICS. MULTIPLE OUTPUTS.` | `HUMAN AUTHORITY = FINAL DECISION` | `GUARDRAIL-IP-001: APPLICADO`

---

# 📦 ARKI / ARQUI — PAQUETE CONSOLIDADO DE CONOCIMIENTO, RAZONAMIENTO Y EJECUCIÓN (v6.2 / D6.1 / H-002)

**Estado:** `AUTHORIZED FOR EXECUTION / P0`
**Autoridad:** Wilfredo Yvan Castillo Quezada (Product Owner)
**Fecha:** 2026-09-27
**Misión:** Preservar → Consolidar → Conectar la genealogía de investigación con la evidencia de runtime existente, sin crear motores paralelos.
**Alcance:** KR-6.2, D6.1, H-002 Examen 10. MC-02, MC-01, MC-03 y MC-04 permanecen STOPPED.
**Gate:** `GATE_ARKI_KNOWLEDGE_REASONING_V6_2 = PASS` solo si se preservan provenance, distinciones, UNKNOWN, conexiones de runtime y autoridad humana.

---

## 1. DELTA LINEAGE & MAPA DE EJECUCIÓN

| VERSION_OR_DELTA | NOMBRE | FAMILIA | ROL EN V6.2 / D6.1 |
|---|---|---|---|
| v1.0 | Knowledge Matrix | FOUNDATION | Raíz histórica; preservar workbook original y provenance de filas. |
| v2.0 | Canonical Knowledge Matrix L00–L08 | FOUNDATION | Fundación estructurada; no aplanada en razonamiento posterior. |
| v3.0 | Canonical Knowledge Matrix L09–L32 + Research KB | FOUNDATION / CANONICAL | Expansión multiescala e investigación arquitectónica. |
| v4.0 | Canonical Research Delta | CANONICAL KNOWLEDGE + REASONING | Evolución de investigación; canonicalización no implica implementación runtime. |
| v5.0 | Canonical Research Delta | CANONICAL KNOWLEDGE + REASONING | Conocimiento tipológico y de investigación; preservar estados. |
| v6.0 | Canonical Research Reasoning Checkpoint | CANONICAL KNOWLEDGE + REASONING | Checkpoint de razonamiento; conectar solo donde exista evidencia runtime. |
| v6.1 | Canonical Research Reasoning Checkpoint Delta | CANONICAL KNOWLEDGE + REASONING | Linaje incremental de razonamiento/runtime. |
| D6.1 | Executed Checkpoint | CANONICAL KNOWLEDGE + REASONING | Evidencia respaldada por runtime para ingestión/persistencia/recuperación. |
| D6.2–D6.4 | Runtime reports and manifests | RUNTIME EVIDENCE | Evidencia runtime adjunta a mapeos de capacidad actuales. |

---

## 2. REGLAS EPISTÉMICAS Y GUARDRAILS

| RULE_ID | REGLA | SIGNIFICADO OPERACIONAL | ESTADO |
|---|---|---|---|
| E-01 | SOURCE ≠ KNOWLEDGE | El conocimiento debe retener la provenance de la fuente. | CANONICALIZED |
| E-02 | GENERATED / INFERENCE / ASSUMPTION / UNKNOWN ≠ FACT | La generación probabilística no puede establecer hechos. | CANONICALIZED |
| E-03 | RESEARCH ≠ IMPLEMENTATION | Las filas de investigación nunca se auto-promocionan. | CANONICALIZED |
| E-04 | IMPLEMENTATION ≠ DEMONSTRATION | Una ruta de código no es prueba de capacidad demostrada. | CANONICALIZED |
| E-05 | DEMONSTRATION ≠ PROFESSIONAL VALIDATION | Las pruebas controladas no establecen autoridad profesional/permisos. | CANONICALIZED |
| E-06 | HISTORICAL EVIDENCE ≠ CURRENT CAPABILITY | Los workbooks históricos son evidencia, no runtime en vivo. | CANONICALIZED |
| E-07 | HUMAN AUTHORITY | Recomendación y decisión permanecen distintas. | IMPLEMENTED |

### GUARDRAILS MANDATORIOS (MUST PRESERVE / DO NOT IMPLEMENT)
- **Canonical authority:** ONE GEOMETRY. ONE SEMANTICS. MULTIPLE OUTPUTS.
- **Engines:** No segundo motor de geometría, topología, tipología, regulación, conocimiento, aprendizaje, revisión humana o específico de déficits.
- **Synthesis:** No construir WasteEngine / KitchenRepairEngine / HospitalFlowRepairEngine.
- **Learning:** La observación no se auto-canoniza; el input suministrado no es aprendizaje.
- **Transfer:** El puntaje de similitud no puede anular las diferencias semánticas críticas.
- **Unknown:** UNKNOWN ≠ PASS/FAIL/PENALTY; cada UNKNOWN necesita ruta de resolución.
- **Regulation:** FOREIGN REFERENCE ≠ PERU LAW; SOURCE VERIFIED ≠ PROJECT COMPLIANCE VERIFIED.
- **Multiscale:** FunctionalUnit↔Level y FunctionalSystem↔Unit no son relaciones universales padre-hijo.
- **Optimization:** Las restricciones duras (hard constraints) actúan como gate antes que las preferencias/Pareto; no hay candidatos de puntaje bajo ilegal.
- **Human authority:** No hay ganador arquitectónico automático; no hay reclamo de aprobación profesional.
- **Composition:** No hay puntaje universal de belleza; propiedad descriptiva ≠ juicio de valor.
- **Git:** Después de la validación completada: commit + push a la rama actual autorizado; NO merge/deploy a menos que sea explícito.

---

## 3. MODELOS DE SISTEMA Y CONEXIONES DE RUNTIME

| SYSTEM | DEFINICIÓN | EVIDENCIA PRIMARIA | INTERPRETACIÓN ACTUAL DE RUNTIME |
|---|---|---|---|
| WORLD MODEL | Entidades, escalas, relaciones, estados, tiempo, contexto y multiescala. | KNOWLEDGE + RUNTIME | Semántica de escala y estructuras de snapshot de proyecto; parcial en runtime. |
| KNOWLEDGE MODEL | Fuentes, evidencia, aplicabilidad, provenance y UNKNOWN. | KNOWLEDGE + RUNTIME | Biblioteca OCR/fuente, provenance, estados epistémicos; demostrado en alcance controlado. |
| REASONING MODEL | Requisitos, restricciones, déficits, causas, estrategias y trazabilidad. | RUNTIME | Harness D6.2; microcaso demostrado. |
| GENERATIVE MODEL | PARTI, realizaciones, topología, operadores, mutaciones y candidatos. | KNOWLEDGE + RUNTIME | Guardrails R-PARTI y puente D6.3; conceptual, no producción profesional. |
| EVALUATION MODEL | Restricciones duras, escenarios, rendimiento, comparaciones y gates. | RUNTIME | Registros de evaluación/gate existentes; alcance acotado. |
| LEARNING MODEL | Observación, memoria, contraejemplos, transferencia, generalización y promoción. | KNOWLEDGE + RUNTIME | Transferencia L2 y revisión humana; sin promoción automática. |

### RUNTIME CONNECTION MAP (Resumen)
- **KR-RUNTIME-001:** PROJECT_INPUT → RETRIEVED_KNOWLEDGE → REQUIREMENTS → UNKNOWN → DEFICITS → CAUSES → STRATEGIES → REALIZATIONS → TOPOLOGY. (`server/arkiD62ReasoningHarness.ts`) - DEMONSTRATED.
- **KR-RUNTIME-002:** TOPOLOGY → GEOMETRIC_REQUIREMENTS → DESIGN_MOVES → OPERATORS → MUTATIONS → CANDIDATES → VALIDATION. (`server/arkiD63GeometricBridge.ts`) - DEMONSTRATED.
- **KR-RUNTIME-003:** SOURCE → OCR/VISION → PROVENANCE → AI_PROPOSED → HUMAN REVIEW. (`server/arkiOcr.ts`, `server/visualField.ts`) - DEMONSTRATED.
- **KR-RUNTIME-004:** Persistence / reload / retrieval of project snapshots. (`server/siclCore.ts`, `server/db.ts`) - DEMONSTRATED (Local). Remote write = UNKNOWN.
- **KR-RUNTIME-005:** Typological transfer: TRANSFER / ADAPT / DO_NOT_TRANSFER / UNKNOWN. (`docs/arki-l2/`) - DEMONSTRATED.
- **KR-RUNTIME-006:** Human Authority: recommendation ≠ decision; promotion requires review. (`server/routers.ts`) - DEMONSTRATED.

---

## 4. ONTOLOGÍA Y CONCEPTOS DERIVADOS

### 4.1 Primitivos Canónicos (Provisional Convergence)
1. ENTITY | 2. SYSTEM | 3. ACTIVITY | 4. STATE | 5. TRANSITION | 6. PROCESS | 7. RELATIONSHIP | 8. FLOW | 9. CONTROL | 10. INTERFACE | 11. REQUIREMENT | 12. CONDITION | 13. CAPACITY | 14. TIME | 15. EVIDENCE | 16. ISSUE | 17. HAZARD (PROPOSED / NOT YET CANONIZED).

### 4.2 Conceptos Derivados (NO crear motor paralelo)
DESIGN INTENT, DESIGN PROBLEM, CAUSE MODEL, INTERVENTION DOMAIN, DESIGN FREEDOM, MUTABILITY, AUTHORITY SCOPE, STRATEGY, REALIZATION STRATEGY, DESIGN MOVE, DESIGN OPERATOR, MUTATION, IMPACT SCOPE, EFFECT GRAPH VIEW, COMPOSITIONAL INTENT, LEGIBILITY, LANDMARK, HIERARCHY, CENTRALITY, SPATIAL EXPERIENCE, CASE MEMORY, REASONING MEMORY VIEW, KNOWLEDGE PROMOTION, ADAPTATION BURDEN, TRANSFER RESTRAINT, KNOWLEDGE REGRESSION, REASONING REGRESSION.

---

## 5. INVARIANTES CANÓNICOS (v6)

| ID | INVARIANTE | CLASE |
|---|---|---|
| INV6-001 | DESIGN SPACE EXPLORATION ≠ ARCHITECTURAL SYNTHESIS | MUST PRESERVE |
| INV6-002 | GENERATED GEOMETRY WITHOUT TRACEABLE DESIGN INTENT IS SEMANTICALLY INCOMPLETE | MUST PRESERVE |
| INV6-003 | DEFICIT ≠ CAUSE ≠ STRATEGY ≠ SOLUTION | MUST PRESERVE |
| INV6-004 | STRATEGY ≠ TEMPLATE | MUST PRESERVE |
| INV6-005 | OPERATOR ≠ MUTATION | MUST PRESERVE |
| INV6-006 | DESIGN MOVE ≠ ATOMIC OPERATOR | MUST PRESERVE |
| INV6-007 | GEOMETRIC POSSIBILITY ≠ OPERATOR APPLICABILITY | MUST PRESERVE |
| INV6-008 | LOCAL MUTATION PASS ≠ GLOBAL CONFIGURATION PASS | MUST PRESERVE |
| INV6-009 | PARAMETRIC VARIATION ≠ STRATEGIC DIVERSITY | MUST PRESERVE |
| INV6-010 | INVALID ≠ LOW SCORE | MUST PRESERVE |
| INV6-011 | PARETO NON-DOMINATED ≠ ARCHITECTURALLY PREFERRED | MUST PRESERVE |
| INV6-012 | UNKNOWN ≠ PENALTY ≠ FAIL ≠ PASS | MUST PRESERVE |
| INV6-013 | INFEASIBILITY MUST NOT BE HIDDEN BY SILENT CONSTRAINT RELAXATION | MUST PRESERVE |
| INV6-014 | MULTISCALE ARCHITECTURAL STRUCTURE ≠ STRICT CONTAINMENT TREE | MUST PRESERVE |
| INV6-015 | SPATIAL CONFIGURATION ≠ SPATIAL EXPERIENCE ≠ ARCHITECTURAL COMPOSITION ≠ AESTHETIC JUDGMENT | MUST PRESERVE |
| INV6-016 | WAYFINDING ≠ SIGNAGE | MUST PRESERVE |
| INV6-017 | VISIBLE ≠ REACHABLE | MUST PRESERVE |
| INV6-018 | FUNCTION CONSTRAINS AND INFORMS FORM; IT DOES NOT UNIQUELY DETERMINE FORM | MUST PRESERVE |
| INV6-019 | GEOMETRIC DIVERSITY ≠ ARCHITECTURAL DIVERSITY | MUST PRESERVE |
| INV6-020 | EXECUTION ≠ RETRIEVAL ≠ ADAPTATION ≠ KNOWLEDGE ACQUISITION ≠ TRANSFER ≠ GENERALIZATION ≠ LEARNING | MUST PRESERVE |
| INV6-021 | RETRIEVAL OF A STORED SOLUTION ≠ LEARNING | MUST PRESERVE |
| INV6-022 | PRECEDENT TRANSFER ≠ FORM COPYING | MUST PRESERVE |
| INV6-023 | ONE SUCCESSFUL CASE ≠ GENERALIZATION | MUST PRESERVE |
| INV6-024 | GENERALIZATION REQUIRES BOTH POSITIVE TRANSFER AND TRANSFER RESTRAINT | MUST PRESERVE |
| INV6-025 | SIMILARITY ≠ TRANSFERABILITY | MUST PRESERVE |
| INV6-026 | MOST SIMILAR CASE ≠ MOST REUSABLE CASE | MUST PRESERVE |
| INV6-027 | SUPPLIED INFORMATION ≠ DISCOVERED KNOWLEDGE | MUST PRESERVE |
| INV6-028 | LEARNING CLAIM WITHOUT PRE-TEST BASELINE IS UNVERIFIABLE | MUST PRESERVE |
| INV6-029 | IN-SESSION INFERENCE ≠ PERSISTED LEARNING | MUST PRESERVE |
| INV6-030 | KNOWLEDGE MATURITY ≠ KNOWLEDGE GENERALITY | MUST PRESERVE |
| INV6-031 | OBSERVATION MUST NOT DIRECTLY BECOME CANONICAL KNOWLEDGE | MUST PRESERVE |
| INV6-032 | AUTOMATIC OBSERVATION ≠ AUTOMATIC CANONIZATION | MUST PRESERVE |
| INV6-033 | KNOWING WHAT NOT TO INFER IS ARCHITECTURAL KNOWLEDGE | MUST PRESERVE |
| INV6-034 | EPISTEMIC STRENGTH ≠ NORMATIVE FORCE | MUST PRESERVE |
| INV6-035 | ARKI LANGUAGE CERTAINTY MUST NOT EXCEED KNOWLEDGE CERTAINTY | MUST PRESERVE |
| INV6-036 | PROJECT UNKNOWN ≠ KNOWLEDGE UNKNOWN | MUST PRESERVE |
| INV6-037 | KNOWLEDGE GROWTH ≠ REASONING IMPROVEMENT | MUST PRESERVE |
| INV6-038 | GENERATIVE CAPABILITY ≠ LEARNING CAPABILITY | MUST PRESERVE |

---

## 6. GRAMÁTICAS DE RAZONAMIENTO Y SÍNTESIS

### 6.1 Canonical Reasoning Grammar
- **General:** PURPOSE → OPERATING/SERVICE MODEL → REQUIRED CAPABILITIES → SUBJECTS+ROLES → SUBJECT STATES → ACTIVITIES+PROCESSES → HAZARDS+CONDITIONS → DEMAND+TEMPORAL PROFILE → CAPABILITIES.
- **Synthesis:** ISSUE/DEFICIT → CAUSE MODEL → REQUIRED CAPABILITY → RESOLUTION TARGET → HARD REQUIREMENTS → REALIZATION STRATEGIES → CANDIDATE MUTATIONS → CANONICAL MODEL DERIVATIVES.
- **Learning:** OBSERVATION → CASE EVIDENCE → CANDIDATE KNOWLEDGE → ABSTRACTION → SCOPE → CHALLENGE → TRANSFER TEST → COUNTEREXAMPLE → REFINEMENT → PROMOTION DECISION.
- **Transfer:** TARGET PROBLEM → STRUCTURAL CHARACTERIZATION → RELEVANT KNOWLEDGE RETRIEVAL → CRITICAL COMPATIBILITY GATES → ADAPTATION BURDEN → TRANSFER/ADAPT/REJECT → APPLICATION → RESULT.

### 6.2 Architectural Synthesis Grammar (22 Steps)
1. PROBLEM FRAMING | 2. CAPABILITY MODEL | 3. REQUIREMENT / CONSTRAINT EXTRACTION | 4. UNKNOWN + COVERAGE ANALYSIS | 5. DEFICIT DETECTION | 6. CAUSE ANALYSIS | 7. DESIGN FREEDOM / AUTHORITY ANALYSIS | 8. STRATEGY GENERATION | 9. REALIZATION FAMILY GENERATION | 10. CANDIDATE GENERATION | 11. HARD-CONSTRAINT FILTER | 12. GEOMETRIC / TOPOLOGICAL VALIDATION | 13. OPERATIONAL / TEMPORAL VALIDATION | 14. DEPENDENCY PROPAGATION | 15. NEW-DEFICIT DETECTION | 16. SCENARIO / FAILURE / RECOVERY TEST | 17. PERFORMANCE EVALUATION | 18. MULTIOBJECTIVE COMPARISON | 19. TRADE-OFF EXPLANATION | 20. HUMAN SELECTION | 21. PROVENANCE / DECISION RECORD | 22. OBSERVATION / LEARNING.
*(Nota: Estructura de grafo; bucles de retroalimentación permitidos; no tratar como asistente rígido).*

---

## 7. ESTRATEGIAS, OPERADORES Y MOVIMIENTOS DE DISEÑO

### 7.1 Design Strategy Families
- **SPATIAL:** separate, enlarge, relocate (NO/PARTIAL non-geometric). Rule: Do not default from deficit directly to room.
- **TOPOLOGICAL:** connect, disconnect, reroute, bypass (YES). Rule: Topology change may occur without geometry.
- **ALLOCATIVE:** assign, share, dedicate, reserve (YES). Rule: Allocation change ≠ physical change.
- **TEMPORAL:** schedule, stagger, resequence, separate in time (YES). Rule: Requires enforceable control/changeover.
- **CONTROL:** authorize, restrict, prioritize, interlock (YES). Rule: Control ≠ physical barrier.
- **RESOURCE:** add, reserve, substitute, reallocate (YES). Rule: Duplicate resource ≠ redundant capability.
- **TECHNICAL:** system/service intervention (YES/PARTIAL). Rule: Specialist sufficiency remains separate.
- **EXTERNAL:** request intervention / alternate interface (YES). Rule: Respect authority boundary.
- **HYBRID:** composed strategy (YES). Rule: May combine multiple families.

### 7.2 Design Move Contract (Required Fields)
Intent, Target, Strategy family, Operators, Preconditions, Forbidden conditions, Authority scope, Expected benefits, Expected costs, Expected risks, Unknown effects, Impact scope, Verification plan, Actual effects (POST), Unexpected effects (POST), Provenance.

---

## 8. ARQUITECTURA MULTIESCALA Y RELACIONES

### 8.1 Dimensiones Multiescala
- **PHYSICAL / SPATIAL:** space, level, building, site (Containment/location).
- **FUNCTIONAL:** functional unit, functional system (May cross physical levels).
- **ORGANIZATIONAL:** department, tenancy, authority (≠ spatial partition).
- **OPERATIONAL / NETWORK:** journeys, active topology, service networks (State/scenario/time dependent).
- **TERRITORIAL:** site, public realm, district, city (Analytical boundary may exceed property).
- **Regla:** SCALE COUNT WITHOUT SCALE DIMENSION IS AMBIGUOUS.

### 8.2 Typed Multiscale Relationships
- SPACE `PART_OF` / `PARTICIPATES_IN` FUNCTIONAL_UNIT (Potential many-to-many).
- SPACE `LOCATED_ON` LEVEL.
- FUNCTIONAL_UNIT `SPANS` LEVEL.
- LEVEL `CONTAINS` SPACE.
- FUNCTIONAL_UNIT `PARTICIPATES_IN` FUNCTIONAL_SYSTEM.
- FUNCTIONAL_SYSTEM `SERVES` FUNCTIONAL_UNIT / BUILDING.
- TENANCY `OCCUPIES` / `USES` SPACE / UNIT / LEVEL.

---

## 9. COMPOSICIÓN Y EXPERIENCIA ESPACIAL

| CONCEPTO | TRATAMIENTO | REGLA EPISTÉMICA |
|---|---|---|
| SPATIAL CONFIGURATION | Computable/representable | ≠ experience |
| SPATIAL EXPERIENCE | Journey/actor/state/time dependent | ≠ static room property |
| ARCHITECTURAL COMPOSITION | Intent + relations + descriptive patterns | No universal automatic ranking |
| AESTHETIC JUDGMENT | Human-involved | No universal beauty score |
| WAYFINDING | Capability / derived evaluation | ≠ signage |
| LEGIBILITY | Derived performance | Connected ≠ legible |
| VISIBILITY | Computable proxy | Visible ≠ reachable |
| LANDMARK | Relational status | Not intrinsic |
| HIERARCHY | Multidimensional | Functional ≠ perceptual |
| LIGHT | Performance + experiential domain | Light ≠ illuminance |
| PROPORTION / RHYTHM / SYMMETRY | Descriptive/formal | Presence ≠ compositional success |

---

## 10. ARQUITECTURA DE APRENDIZAJE Y PROMOCIÓN

### 10.1 Responsabilidades
- **KNOW:** Represent facts, relationships, invariants, cases, provenance. (≠ Reasoning)
- **REASON:** Apply knowledge and derive consequences. (≠ Generation)
- **GENERATE:** Produce strategies, moves, candidates, mutations. (≠ Learning)
- **VERIFY:** Check requirements, effects, coverage, claims. (≠ Professional approval)
- **LEARN:** Change reusable knowledge state from evidence. (≠ Execution / storage)
- **HUMAN AUTHORITY:** Controls intent, trade-offs, promotion/canonization where required.

### 10.2 Learning Classes
- **L1 Parameter:** Value/range/observation (e.g., observed capacity/range).
- **L2 Relationship:** A affects B (e.g., route conflict affects journey).
- **L3 Structural:** new dependency/process structure (e.g., capability depends on generation+storage+removal).
- **L4 Reasoning pattern:** cross-domain problem-solving pattern (e.g., incompatible flows → consider spatial/temporal/control separation).

### 10.3 Knowledge Promotion State Graph
OBSERVED → CANDIDATE → SUPPORTED → TRANSFER_TESTED → GENERALIZED_CANDIDATE → CANONICAL_CANDIDATE → CANONICAL/HUMAN-CONFIRMED.
*(Estados adicionales: CONTEXT_SPECIFIC, CONFLICTED, SUPERSEDED, REJECTED).*

### 10.4 Knowledge Delta K0 → K1
- **Cuentan como aprendizaje:** ADD, REFINE, GENERALIZE, SPECIALIZE, REVISE, RETIRE.
- **NO cuentan como aprendizaje persistente por sí solos:** INPUT_ACQUISITION, RETRIEVAL, EXECUTION, IN_SESSION_INFERENCE.

---

## 11. TRANSFERENCIA, GENERALIZACIÓN Y DESCONOCIDOS

### 11.1 Transfer & Generalization Contract
Required evidence: Source domain, Target domain, Transfer unit, Structural match, Critical differences, Adaptation burden (NONE/LOW/MODERATE/HIGH/STRUCTURALLY_INCOMPATIBLE/UNKNOWN), Decision (TRANSFER/ADAPT/DO_NOT_TRANSFER), Adaptation, Domain-specific code, Result, Counterexample, Scope refinement, Fixation check, Generalization status.

### 11.2 UNKNOWN Taxonomy & Resolution Contract
- **PROJECT_DATA:** occupancy/capacity input missing → request project data / survey / client decision.
- **ARCHITECTURAL_KNOWLEDGE:** relationship insufficiently established → research / precedent / controlled test.
- **REGULATORY:** applicability/current requirement unresolved → official source + applicability analysis.
- **SPECIALIST:** engineering/clinical/biosafety fact required → qualified specialist input.
- **IMPLEMENTATION:** runtime support unknown → repo audit / controlled software test.
- **EVIDENCE:** claim lacks sufficient evidence → identify acceptable evidence.
- **HUMAN_DECISION:** trade-off or intent unresolved → explicit human decision.
- **Invariant:** UNKNOWN WITHOUT RESOLUTION PATH = INCOMPLETE DIAGNOSIS. UNKNOWN ≠ PASS ≠ FAIL ≠ PENALTY.

---

## 12. EVIDENCIA, PROVENANCE Y MADUREZ

### 12.1 Evidence & Provenance Dimensions
Fact provenance, Reasoning provenance, Candidate lineage, Knowledge provenance, Normative provenance, Epistemic status (HYPOTHESIS/SUPPORTED/VERIFIED/CONFLICTED), Coverage, Human authority.

### 12.2 Independent Maturity Dimensions
- **Research:** UNKNOWN → RESEARCHED → FORMALIZED
- **Teachability:** NOT_TEACHABLE → TEACHABLE
- **Implementation:** NOT_IMPLEMENTED → PARTIAL → IMPLEMENTED
- **Validation:** NOT_TESTED → CONTROLLED_TESTED → CROSS_TYPOLOGY_TESTED
- **Generalization:** NONE → POSSIBLE → PARTIAL → DEMONSTRATED
- **Autonomy:** L0 RECEIVES → L1 REPRESENTS → L2 DETECTS → L3 DIAGNOSES → L4 EVALUATES → L5 GENERATES STRATEGIES → L6 GENERATES CANDIDATES → L7 MUTATES/SYNTHESIZES → L8 REEVALUATES → L9 LEARNS → L10 CANONIZES (HUMAN GATED).

---

## 13. PROTOCOLO DE EVALUACIÓN PERMANENTE (Obligatorio para cada Delta futuro)

**Core rule:** WHAT DID ARKI LEARN ≠ WHAT DID ARKI ALREADY KNOW ≠ WHAT DID ARKI REUSE ≠ WHAT DID ARKI EXECUTE ≠ WHAT WAS SUPPLIED AS INPUT.

Secciones requeridas (A-AV): Baseline/K0, Input, Initial Unknowns, Reasoning activated, Knowledge reused, Reasoning provenance, Deficits detected, Cause hypotheses, Strategies generated, Candidates, Rejected candidates, Geometry mutations, Relationships changed, Active topology, Scenario results, Dependency propagation, New deficits created, Expected vs actual effects, Coverage, Evidence/provenance, UNKNOWN, UNKNOWN resolution path, Regulatory status, Human decisions required, Knowledge before/K0, Supplied knowledge, Retrieved knowledge, Adapted knowledge, Learning candidate, Learning class, Persistence, Transfer source/target, Context differences, Adaptation burden, Transfer decision, Transfer result, Counterexample/adversarial test, Scope refinement, Fixation check, Knowledge after/K1, Learning delta K0→K1, Generalization status, Knowledge regression, Reasoning regression, Software regression, Runtime maturity, Autonomy level demonstrated, Final epistemic state.

---

## 14. PRUEBAS CROSS-TIPOLOGÍA Y ADVERSARIALES

### 14.1 Controlled Cross-Typology Transfer Test Suite
- **A:** Restaurant dirty-return conflict (Source case).
- **B:** Restaurant variant (Same-typology adaptation).
- **C:** Hospital incompatible clinical journeys (Positive cross-typology transfer).
- **D:** Laboratory / biosafety waste or flow (Transfer restraint/adaptation burden).
- **E:** Public realm accessibility + external dependency (Authority-boundary transfer).
- **F:** Mixed-use shared capacity (Different realization family).

### 14.2 Adversarial / Counterexample Tests
- **AT-01 Similar label:** Restaurant waste vs biosafety waste → Reject superficial equivalence.
- **AT-02 Temporal separation:** Flows appear separable but emergency requires concurrency → Reject invalid temporal strategy.
- **AT-03 High similarity score:** Cases match except critical hazard → Critical semantic gate overrides aggregate similarity.
- **AT-04 Precedent fixation:** One strong precedent supplied → Maintain strategic diversity.
- **AT-05 Silent relaxation:** No feasible solution under hard constraints → Report infeasibility; do not silently relax.
- **AT-06 External authority:** Public route deficit outside project control → Propose alternate/request/unknown.
- **AT-07 Unknown as score:** Critical unknown exists → Do not convert unknown to penalty/pass/fail.
- **AT-08 Functional success:** Candidate solves local deficit but harms egress/access → Dependency propagation must expose new deficit.

---

## 15. PROTOCOLO DE REGRESIÓN Y DELTA DE IMPLEMENTACIÓN

### 15.1 Regression Protocol
- **SOFTWARE:** focused tests + full suite + typecheck + build + git diff --check.
- **KNOWLEDGE:** K0/K1 ledger comparison + invariants.
- **REASONING:** repeat controlled prior cases + compare reasoning trace.
- **GEOMETRY:** immutability/lineage checks.
- **EPISTEMIC:** status comparison (No UNKNOWN→PASS).
- **REGULATORY:** RNE/regulatory regression checks.

### 15.2 Implementation Delta (Desired disposition)
- **CanonicalBuildingModel:** REUSE (No second building/geometry model).
- **GDI/A21/S1/S2 generation:** REUSE/EXTEND (No parallel generation engine).
- **Dependency reevaluation:** REUSE/EXTEND (No DesignEffectGraph engine if existing graph suffices).
- **Typology knowledge entrypoint:** REUSE/EXTEND DATA (No typology-specific repair engines).
- **FunctionalUnit + A22Level integration:** AUDIT + EXTEND TYPED RELATIONS (Do not force parent-child hierarchy).
- **Learning cycle + acquisition ledger:** REUSE/EXTEND (No second learning engine).
- **Regulatory foundation / RNE verifier:** REUSE (No mixing foreign guidance with Peru law).
- **Candidate lineage / immutable parent:** REUSE (No destructive baseline mutation).
- **Synthesis grammar:** EXTEND canonical reasoning (No deficit→room hardcoding).
- **Design operators:** DATA_ONLY / semantic contract first (Do not create one engine per operator family).
- **Composition/experience:** DERIVED_VIEW / RESEARCH_ONLY initially (No universal beauty score).
- **Transfer/generalization tests:** IMPLEMENT TEST HARNESS (No claim of generalization without evidence).
- **Permanent evaluation report:** IMPLEMENT (No abbreviated learning claim).

### 15.3 Reuse Classification Contract
REUSE, EXTEND, ADAPT, DATA_ONLY, DERIVED_VIEW, RESEARCH_ONLY, DO_NOT_ADD.

---

## 16. CRITERIOS DE ACEPTACIÓN Y FUENTES

### 16.1 Acceptance Criteria for Next Manus Delta (AC-01 a AC-16)
Incluye: Repo discovery, Reuse-first, No parallel engine, Strategy diversity, Hard gates, Learning evidence, Positive transfer, Transfer restraint, Unknown discipline, Regression, Human authority, Validation, Git discipline, No merge/deploy.

### 16.2 Source Register (v6 Research Support)
SRC-01: NASA Systems Engineering Handbook. SRC-02: NASA SE Handbook Appendix. SRC-03: NASA NPR 7123.1C. SRC-04: Oxman 1994. SRC-05: Akin 2002. SRC-06: Heylighen et al. SRC-07: Jansson & Smith 1991. SRC-08: Sio, Kotovsky & Cagan 2015. SRC-09: Wang, Akbarzadeh & Aviv 2024. (Plus legacy sources: Ching, Neufert, Metric, Time-Saver, Peña, etc.).

### 16.3 Research / Implementation Roadmap After v6
R6.1 Freeze v6 canonical checkpoint → R6.2 Manus read-only discovery → R6.3 Implement permanent evaluation protocol → R6.4 General synthesis strategy layer → R6.5 Cross-typology transfer harness → R6.6 Adversarial transfer restraint → R6.7 Knowledge/reasoning regression harness → R6.8 Composition/experience derived views → R6.9 Further typologies.

---

## 17. ESPECIFICACIONES D6.1 (CORPUS INTEGRATION & SICL CORE INGESTION)

### 17.1 D6.1 Executive Decisions
- **Baseline:** v6.0 FROZEN. D6.1 extends integration only.
- **Knowledge corpus:** OPEN / INGESTION-GATED.
- **Core architecture:** ONE KNOWLEDGE SYSTEM.
- **Epistemic separation:** SOURCE ≠ EVIDENCE ≠ CLAIM ≠ KNOWLEDGE ≠ CASE.
- **FACT policy:** FACT is a knowledge kind, not automatic universal truth.
- **Promotion:** Use v6.0 state graph.
- **Persistence:** Required before retest (PERSIST→RELOAD→RETRIEVE).
- **Restaurant retest:** BLOCKED UNTIL GATES PASS.
- **Rights:** ACCESS_STATUS ≠ RIGHTS_STATUS ≠ INGESTION_PERMISSION.
- **Human authority:** MANDATORY. No automatic canonization.
- **D6.1 end-state:** SCHEMA + ADAPTER CONTRACT + PILOT ROUND-TRIP.

### 17.2 D6.1 Core Object Contract (Minimum)
- **Source:** id, title, reference, accessStatus, rightsStatus, ingestionPermission.
- **Evidence:** id, sourceId, locator, kind.
- **Claim:** id, statement, modality, evidenceRefs.
- **Knowledge:** id, kind, statement, promotionState, epistemicStatus, scopeRef, rationaleRefs, provenanceRefs.
- **Scope:** id, domain.
- **Rationale:** id, statement.
- **Relationship:** id, type, subjectRef, objectRef.
- **Unknown:** id, type, reason, resolutionPath, resolverAuthority.
- **HumanValidation:** id, status, authorityRef, scope, date, targetRef.
- **Case:** id, context, inputRefs, observationRefs.
- **LearningEvent:** id, kBefore, kAfter, deltaType, evidenceRefs.

### 17.3 D6.1 Promotion Gate (PG-01 to PG-11)
Reglas estrictas que impiden la promoción automática. PG-06 requiere decisión humana para CANONICAL/HUMAN-CONFIRMED. PG-09, PG-10, PG-11 establecen que INPUT_ACQUISITION, RETRIEVAL y EXECUTION no cuentan como aprendizaje por sí solos.

### 17.4 D6.1 Pilot Round-Trip Protocol (RT-01 to RT-09)
RT-01 Select records → RT-02 Map through Schema_Map → RT-03 Create Core objects → RT-04 Persist → RT-05 Reload in fresh context → RT-06 Retrieve by semantic query → RT-07 Verify provenance/scope/rights/validation → RT-08 Verify UNKNOWN/conflict preservation → RT-09 Regression check.

### 17.5 D6.1 Mass Corpus Ingestion Gate (IG-01 to IG-10)
Bloquea la ingestión masiva hasta que se aprueben: Schema reconciliation, Pilot round-trip, Provenance preservation, Scope preservation, Rights/permission preservation, Human validation preservation, Conflict/UNKNOWN preservation, No parallel engine, Regression, Human authorization.

### 17.6 D6.1 Restaurant Blind Exam Retest Gate (RG-01 to RG-06)
RG-01 CORPUS_PERSISTENCE, RG-02 CORPUS_RETRIEVAL, RG-03 PROVENANCE_PRESERVATION, RG-04 SCOPE_PRESERVATION, RG-05 HUMAN_VALIDATION_PRESERVATION, RG-06 Same exam protocol available. **FINAL:** BLOCKED until all PASS.

### 17.7 D6.1 Controlled Enumerations
Mapping disposition, Loss class, Knowledge kind, Modality, Promotion state, Unknown type, Learning class, Knowledge delta, Human validation, Gate status.

---

## 18. REPORTE H-002 EXAMEN 10 RED TEAM DEEPSEEK

**Estado:** 337 PASS / 0 FAIL en Core (excluyendo 2 tests IFC bloqueados por ausencia de `ifcopenshell`). `compileall`: PASS.
**Objetivo:** Responder de forma read-only: ¿qué artefactos dependían de una referencia versionada? Si una entidad cambia `before → after`, ¿qué resultados existentes pueden estar potencialmente afectados? ¿Por qué caminos derivacionales se alcanza cada resultado?
**H-002 NO invalida, NO declara STALE, NO recomputa, NO muta geometría y NO ejecuta consecuencias.**

### Evolución de los exámenes:
1. **Traversal transitive:** Reverse traversal sobre H-001.
2. **Branch/join:** Sustitución de `viaRecordId` único por `ImpactPath[]`.
3. **Ciclos y explosión local:** Ciclos acotados, reportados y canonicalizados. `max_paths_per_artifact` falla cerrado.
4. **Cambio real before/after:** Añadido `ImpactChange(before, after)` y `analyze_change()`. La búsqueda usa el snapshot BEFORE.
5. **Cambio de contenido sin cambio de versión:** `content_hash` permite representar cambios reales sin inventar STALE.
6. **Semántica de cada hop:** Los paths conservan `recordIds`, `relationTypes` y `relationDomains`.
7. **Proveniencia del cambio:** `ImpactReport` conserva `observedChange.before` y `after`.
8. **Determinismo:** Mismo ledger + misma consulta produce el mismo `to_dict()` ordenado.
9. **Complejidad global:** Añadidos `max_total_paths` y `max_impacted_artifacts`, ambos fail-closed.
10. **Regresión:** focal H-001 + H-002: 33 PASS; Core reproducible: 337 PASS.

### Contratos Finales H-002:
`ImpactChange`, `ImpactPath`, `ImpactedArtifact`, `ImpactReport`, `ImpactAnalyzer.analyze_dependency()`, `ImpactAnalyzer.analyze_change()`.

### Invariantes H-002:
`IMPACT DETECTED ≠ CHANGE EXECUTED`, `CHANGE ≠ PROPAGATION`, `VERSION MISMATCH ≠ STALE`, `PATH DISCOVERED ≠ CAUSAL EFFECT VERIFIED`. H-002 es read-only.

### Riesgos/Deuda explícitos:
- `DerivationLedger.list()` sigue reconstruyendo desde Event Store (deuda de rendimiento heredada de H-001).
- El número de caminos en un DAG puede ser exponencial; H-002 falla cerrado al alcanzar límites, pero no resuelve aún un algoritmo resumido de causalidad a gran escala.
- H-002 descubre dependencias registradas; no inventa dependencias arquitectónicas ausentes del grafo.
- La calidad de WHAT-IF está limitada por la calidad/cobertura de H-001.
- IFC sigue environment-blocked por `ifcopenshell`.

### Claims de Estado:
- Reverse dependency traversal: IMPLEMENTED + RUNTIME_EVIDENCE.
- Transitive WHAT-IF: IMPLEMENTED + RUNTIME_EVIDENCE.
- Alternative path preservation: IMPLEMENTED + RUNTIME_EVIDENCE.
- Relation/domain preservation: IMPLEMENTED + RUNTIME_EVIDENCE.
- Change before/after trace: IMPLEMENTED + RUNTIME_EVIDENCE.
- Automatic invalidation: NOT IMPLEMENTED.
- Automatic recomputation: NOT IMPLEMENTED.
- Architectural causal completeness: NOT DEMONSTRATED.
- Wall-move E2E: NOT YET DEMONSTRATED.

### Red Team para DeepSeek (Áreas de ataque):
- Si `before` es siempre el lookup correcto para un cambio.
- Si paths explícitos son sostenibles o necesitan DAG proof/summary.
- Si la canonicalización de ciclos puede ocultar diferencias direccionales.
- Si relationType/domain por hop basta para no confundir dependencia con causalidad.
- Si `content_hash` + version pueden crear identidades inesperadas.
- Si los límites fail-closed pueden causar denegación de análisis en proyectos grandes.
- Si un output con múltiples justificaciones requiere semántica diferente a múltiples paths computacionales.
- Si H-003 puede interpretar impactos sin contaminar H-002 con estados de validez.
*(Instrucción: No implementar. Buscar contraejemplos reproducibles y clasificar severidad).*

---

## 19. REGISTROS DE SISTEMA: UNKNOWN, MODELOS Y REGLAS

### 19.1 UNKNOWN_REGISTER
| UNKNOWN_ID | UNKNOWN_TYPE | CONCEPT | WHY_UNKNOWN | IMPACT | RESOLUTION_PATH | CURRENT_STATUS |
|---|---|---|---|---|---|---|
| UNK-KR62-001 | IMPLEMENTATION | Remote canonical Core write | La evidencia local muestra persistencia fallback/local; no hay endpoint remoto canónico evidenciado. | No promover persistencia local a integración remota. | Evidencia de endpoint + verificación controlada bajo orden posterior. | UNKNOWN |
| UNK-KR62-002 | ARCHITECTURAL_KNOWLEDGE | Unprovided or unavailable historical workbook | Algunas versiones nombradas pueden estar ausentes o representadas solo por archivos disponibles actuales. | No reconstruir filas faltantes de memoria. | Adquirir archivo fuente exacto y preservar metadatos de origen. | UNKNOWN |
| UNK-KR62-003 | REGULATORY | Professional/legal/permit validation | La evidencia runtime no establece autoridad de aprobación específica de jurisdicción. | No etiquetar geometría conceptual como lista para permisos. | Fuente jurisdiccional + revisión de especialista. | UNKNOWN |
| UNK-KR62-004 | SPECIALIST | BIM/CAD/MEP/structure production authority | Ninguna evidencia en este conjunto fuente/runtime KR-6.2 demuestra entregables profesionales nativos. | Mantener la brecha de capacidad explícita. | Orden futura integrada con especialista con evidencia. | NOT_DEMONSTRATED |
| UNK-KR62-005 | HUMAN_DECISION | Promotion of knowledge to FACT | Se requiere autoridad humana; no se permite promoción automática. | Mantener material generado/inferido/asumido como no factual. | Registro de revisión humana. | UNKNOWN |

### 19.2 R-PARTI GUARDRAILS
- RP-01: SEED ≠ PARTI ≠ STRATEGY ≠ FORM ≠ CANDIDATE (CANONICALIZED).
- RP-02: FORM ≠ ORGANIZATION ≠ TOPOLOGY (CANONICALIZED).
- RP-03: SAME CONDITIONS → MULTIPLE POSSIBLE PARTIS (CANONICALIZED).
- RP-04: SAME PARTI → MULTIPLE REALIZATIONS (CANONICALIZED).
- RP-05: VOCABULARY ≠ ANSWER; RETRIEVAL ≠ COPYING (CANONICALIZED).

### 19.3 GATES_AND_GAPS
- **GATE_ARKI_KNOWLEDGE_REASONING_V6_2:** PASS. (Provenance fields, lineage, model separation, runtime map, UNKNOWN register and epistemic rules are present).
- **REMOTE_CANONICAL_CORE_WRITE:** UNKNOWN. (D6.1 evidence covers local persistence/reload/retrieval; remote write endpoint not evidenced).
- **PROFESSIONAL_BIM_CAD_MEP_PERMIT_OUTPUT:** NOT_DEMONSTRATED. (Current runtime reports explicitly bound conceptual geometry).
- **AUTOMATIC_KNOWLEDGE_PROMOTION:** NOT_ALLOWED. (Human authority and review records remain mandatory).

---
**FIN DEL DOCUMENTO CONSOLIDADO**
*Generado bajo autorización de Wilfredo Yvan Castillo Quezada. Estado: LOCKED / READ-ONLY REFERENCE.*