# SiMS-DeI — ARQUI A20-P3R
# Regulatory Applicability + Evidence Foundation

## A. Executive classification

```text
A20_P3R = PASS_WITH_OBSERVATIONS
REGULATORY_SOURCE_IDENTITY = PASS
JURISDICTION = PASS
RULE_VERSION = PASS
TEMPORAL_VALIDITY = PARTIAL
APPLICABILITY_MODEL = PASS
APPLICABILITY_AUTOMATION = CANDIDATE_ONLY
HUMAN_APPLICABILITY_REVIEW = PASS
REQUIREMENT_REPRESENTATION = PASS
REQUIREMENT_PROVENANCE = PASS
SOURCE_LOCATION_TRACEABILITY = PASS
UNITS = PASS
TOLERANCES = PASS
SOURCE_CONFLICTS = PASS
CONTRADICTION_PRESERVATION = PASS
UNKNOWN_PRESERVATION = PASS
A20_P2_INTEGRATION = PASS
ACCESSIBILITY_COMPLIANCE = NOT_ASSESSED
REGULATORY_COMPLIANCE = NOT_ASSESSED
AUTOMATIC_APPROVAL = NO
DECISION = NONE
RECOMMENDATION = NONE
HUMAN_AUTHORITY = PRESERVED
REAL_GATE = NOT_TRIGGERED
```

`PASS_WITH_OBSERVATIONS` refleja que la fundación contractual funciona con fixtures sintéticos, pero no contiene corpus real, extracción automática, motor de vigencia ni motor de compliance.

## B. Baseline verification

```text
EXPECTED_CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
ACTUAL_CORE = 646dae525dd1db4b9f357aced21cc1302fc791a0
EXPECTED_WEB = 571b3d21965f026e7899c3955590ee0be4449e96
ACTUAL_WEB = 571b3d21965f026e7899c3955590ee0be4449e96
CORE_PRODUCT_DIVERGENCE = NO
WEB_PRODUCT_DIVERGENCE = NO
```

Los únicos elementos previos no rastreados fueron informes históricos. No fueron limpiados ni incluidos.

## C. Reuse audit

| Capacidad | Resultado | Uso en P3R |
|---|---|---|
| A20-P1 circulation evidence graph | Reutilizada | Referencias de ruta y evidencia espacial |
| A20-P2 accessibility assessment | Reutilizada | `route_id`, jurisdicción, versión, mediciones y referencias |
| SpatialRepresentation | Reutilizada indirectamente | Fuente del grafo A20-P1 |
| Existing HumanReview semantics | Reutilizada semánticamente | Estados `PENDING_HUMAN_REVIEW` y `CONFIRMED` |
| Existing provenance conventions | Reutilizada | `TEST_FIXTURE`, `HUMAN_SUPPLIED_TEST_INPUT` y locators |
| Existing Core regulatory entity | No encontrada | No se creó una entidad Core nueva |
| Existing canonical source registry | No encontrada | Se implementó fundación derivada mínima, no un segundo registro persistente |
| Existing jurisdiction model suficiente | No encontrada | Se conserva como campo explícito, no se infiere desde coordenadas |
| Existing compliance engine | No encontrado | Permanece fuera de alcance |

Orden aplicado:

```text
REUSE → COMPOSE → EXTEND → CREATE
```

## D. P3 audit gaps addressed

Se abordaron las brechas mínimas mediante estructuras derivadas:

```text
source_id
source_title
source_type
issuing_authority
jurisdiction
publication/effective information
version
amendment reference
source locator
provenance
verification state
human review state
```

También se añadió representación para:

```text
requirement_id
source_id
source locator
subject
parameter
operator
value
unit
tolerance
conditions
applicability state
epistemic state
provenance
human review state
```

## E. Remaining P3 gaps

Permanecen deliberadamente fuera de alcance:

```text
REAL_REGULATORY_CORPUS = NOT_IMPLEMENTED
SOURCE_INGESTION = NOT_AUTHORIZED
OCR = NOT_AUTHORIZED
LLM_RULE_EXTRACTION = NOT_AUTHORIZED
WEB_SCRAPING = NOT_AUTHORIZED
VIGENCY_ENGINE = NOT_IMPLEMENTED
LEGAL_PRECEDENCE_ENGINE = NOT_IMPLEMENTED
GENERAL_REGULATORY_DSL = NOT_IMPLEMENTED
COMPLIANCE_ENGINE = NOT_IMPLEMENTED
```

## F. Regulatory source contract

La fuente sintética se representa con identidad, categoría, autoridad, jurisdicción, versión, locator, provenance, verification state y HumanReview state. Los tipos de fuente son acotados y no implican una jerarquía legal automática.

## G. Jurisdiction

La jurisdicción es un campo explícito. Una fuente con jurisdicción distinta al contexto produce `NOT_APPLICABLE` con razón `JURISDICTION_MISMATCH`. No se infiere jurisdicción desde coordenadas ni se hardcodea Perú como comportamiento universal.

## H. Version / temporal state

`version`, `publicationDate`, `effectiveDate`, `expiryOrRepealState` y `amendmentReference` pueden preservarse cuando están disponibles. La ausencia de versión o verificación genera `INSUFFICIENT_CONTEXT`; no se supone que el documento más reciente sea vigente.

La prueba sintética usa `TEST_V1`. No representa una norma real.

## I. Applicability contract

La evaluación acotada considera:

```text
jurisdiction
spatialScope
projectUseType
buildingUseCategory
projectStage
subject
temporalDate
accessibilityContext
```

Resultados posibles:

```text
APPLICABLE_CANDIDATE
NOT_APPLICABLE
INSUFFICIENT_CONTEXT
CONFLICTING_EVIDENCE
PENDING_HUMAN_REVIEW
HUMAN_CONFIRMED_APPLICABLE
HUMAN_CONFIRMED_NOT_APPLICABLE
UNKNOWN
```

La automatización solo produce candidato, conflicto o contexto insuficiente. La confirmación requiere una acción humana explícita.

## J. HumanReview integration

Una aplicabilidad candidata pasa a `HUMAN_CONFIRMED_APPLICABLE` únicamente mediante `confirmApplicability(..., true)`. La confirmación de aplicabilidad no crea una decisión, una recomendación ni un resultado de compliance.

```text
HUMAN_CONFIRMED_APPLICABILITY ≠ HUMAN_DECISION
```

## K. Requirement representation

La representación de requisito conserva el valor y su semántica, incluyendo operador, unidad y tolerancia. Un requisito sin fuente compatible no se valida como requisito trazable.

No se implementó un lenguaje regulatorio universal.

## L. Requirement provenance

Cada requisito debe enlazar:

```text
SOURCE → SOURCE LOCATOR → REQUIREMENT REPRESENTATION
```

La fixture usa:

```text
TEST_FIXTURE
HUMAN_SUPPLIED_TEST_INPUT
NOT_REAL_REGULATION
NOT_LEGAL_ADVICE
```

## M. Source location traceability

El locator sintético `fixture://TEST-ACCESSIBILITY-RULE-01#section-1` se conserva junto con `sourceId`. La ausencia de locator no se rellena por inferencia.

## N. Units / tolerances

El fixture preserva:

```text
value = 1.2
unit = m
tolerance = NONE_AS_EXPLICITLY_MODELED
```

La implementación no convierte unidades ni compara valores incompatibles. No se creó un motor general de unidades.

## O. Source conflicts

Dos requisitos sintéticos contradictorios producen:

```text
CONFLICT_PRESERVED
automaticWinner = false
humanReviewRequired = true
```

No se resuelve por timestamp, orden de fuente, mayoría, LLM ni preferencia de ARQUI.

## P. UNKNOWN preservation

La ausencia de jurisdicción, versión o verificación produce `INSUFFICIENT_CONTEXT`. No se transforma `UNKNOWN` en `FAIL`, `FALSE` o `HUMAN_CONFIRMED_APPLICABLE`.

## Q. Synthetic positive fixture

```text
SOURCE_ID = TEST-ACCESSIBILITY-RULE-01
JURISDICTION = TEST_JURISDICTION
VERSION = TEST_V1
SUBJECT = ROUTE_CLEAR_WIDTH
REQUIREMENT = synthetic minimum width = 1.2 m
```

Flujo probado:

```text
TEST SOURCE
→ SOURCE IDENTITY
→ JURISDICTION
→ VERSION
→ TEST REQUIREMENT
→ APPLICABILITY CANDIDATE
→ HUMAN REVIEW
→ HUMAN_CONFIRMED_APPLICABLE
→ A20-P2 TRACEABLE REFERENCE
```

Resultado final:

```text
COMPLIANCE = NOT_ASSESSED
```

## R. Missing-jurisdiction control

Una fuente sin jurisdicción produce `INSUFFICIENT_CONTEXT` y conserva `JURISDICTION` y `SOURCE_JURISDICTION` como faltantes.

## S. Missing-version control

Una fuente sin versión produce `INSUFFICIENT_CONTEXT` y conserva `SOURCE_VERSION` y `SOURCE_VERIFICATION` como faltantes.

## T. Wrong-jurisdiction control

Una fuente de `TEST_JURISDICTION` contra `OTHER_JURISDICTION` produce:

```text
state = NOT_APPLICABLE
reason = JURISDICTION_MISMATCH
```

No se convierte automáticamente en aplicable.

## U. Conflict control

El conflicto sintético conserva ambos requisitos, ambos source IDs y exige revisión humana. No existe ganador automático.

## V. Missing-evidence control

Las referencias de evidencia se conservan como lista explícita. P3R no afirma que una medición sea evidencia normativa suficiente. Una requirement sin provenance no puede considerarse verificada por esta fundación.

## W. A20-P2 integration

La integración es mínima y no rediseña A20-P2. `buildAccessibilityRegulatoryTrace` conserva:

```text
route_id
jurisdiction_ref
rule_version
measurement evidence_refs
requirement_refs
regulatory_evidence_refs
```

El vínculo es trazable, pero no cambia el resultado de A20-P2:

```text
A20-P2 complianceStatus = NOT_ASSESSED
```

## X. Proof compliance remains NOT_ASSESSED

Se verificó en la prueba positiva, en el caso de conflicto, en el caso de jurisdicción incorrecta y en el caso de contexto incompleto. Ninguno puede producir `COMPLIES`, `DOES NOT COMPLY`, `APPROVED`, `CERTIFIED`, `ACCESSIBLE` o `NOT ACCESSIBLE`.

## Y. ARQUI boundaries

ARQUI puede identificar contexto faltante, mostrar candidatos, explicar provenance y pedir HumanReview. No puede declarar aplicabilidad legal, inventar requisitos, resolver conflictos, certificar accesibilidad, declarar compliance ni crear decisiones.

## Z. Knowledge-federation isolation

```text
KNOWLEDGE_FEDERATION = REGISTERED / FROZEN / NOT_ACTIVATED
BIOCLIMATIC_PROFILE = FROZEN
HOUSING_PROFILE = FROZEN
SOURCE_INGESTION = NOT_AUTHORIZED
```

La fundación regulatoria no se implementó como federación de conocimiento.

## AA. Tests

```text
P3R focused tests = 5 passed
A20-P1/P2/P3R focused tests = 13 passed
WEB_TEST_FILES = 49 passed
WEB_TESTS = 261 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE = UNCHANGED; full Core suite not rerun per proportional-regression rule
```

La validación completa Web cubrió la superficie afectada y las regresiones A20-P1/A20-P2.

## AB. Changed files

```text
client/src/components/regulatoryApplicabilityFoundation.ts
client/src/components/regulatoryApplicabilityFoundation.test.ts
docs/ARQUI-A20-P3R-REGULATORY-APPLICABILITY-EVIDENCE-FOUNDATION-FINAL.md
```

No se modificó Core, A20-P1 ni A20-P2.

## AC. Commit(s)

Un único commit Web local, posterior a pruebas. El SHA final se reporta en el handoff de esta ejecución:

```text
FINAL_LOCAL_WEB_COMMIT_SHA = REPORTED_IN_HANDOFF
```

## AD. Core SHA

```text
646dae525dd1db4b9f357aced21cc1302fc791a0
```

## AE. Web SHA

```text
FINAL_LOCAL_WEB_COMMIT_SHA = REPORTED_IN_HANDOFF
```

## AF. Worktree state

Los cambios de producto A20-P3R están preparados para un único commit. Los informes históricos no rastreados permanecen sin tocar y no forman parte del commit.

## AG. Final classifications

```text
CIRCULATION_GRAPH_CHANGED = NO
ACCESSIBILITY_COMPLIANCE = NOT_ASSESSED
REGULATORY_COMPLIANCE = NOT_ASSESSED
AUTOMATIC_APPROVAL = NO
AUTOMATIC_REQUIREMENT_EXTRACTION = NO
SOURCE_INGESTION = NO
EXTERNAL_FETCH = NO
KNOWLEDGE_FEDERATION = FROZEN
DECISION = NONE
RECOMMENDATION = NONE
NEW_CANONICAL_ENTITY = 0 / REAL_GATE NOT TRIGGERED
NEW_SOURCE_SYSTEM = NO
NEW_EVIDENCE_SYSTEM = NO
NEW_HUMAN_REVIEW_SYSTEM = NO
NEW_AUTHORITY_SYSTEM = NO
NEW_DEPENDENCY = NO
CORE_CHANGED = NO
WEB_CODE_CHANGED = YES
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## AH. Remaining observations

La base es Web-derivada y no persistente. La identidad canónica en Core, la ingestión de fuentes reales, la vigencia jurídica, la aplicabilidad completa por jurisdicción y cualquier evaluación de cumplimiento requieren una orden independiente. El fixture no puede reutilizarse como norma real.

## AI. Recommendation for A20-P4 readiness

```text
A20-P4_READINESS = NOT_READY_FOR_ACTIVATION
```

A20-P4 debe permanecer congelado hasta que exista una orden específica y se defina cómo persistir o transportar la fundación regulatoria sin crear un modelo Web-only como fuente de verdad. No se recomienda activar un motor de impacto normativo mientras `COMPLIANCE = NOT_ASSESSED` y no exista corpus verificable.

## Required evidence matrix

| FIELD | SOURCE | VALUE | EPISTEMIC STATE | PROVENANCE | HUMAN REVIEW | MISSING? | CONFLICT? | USED FOR COMPLIANCE? |
|---|---|---|---|---|---|---|---|---|
| source_id | Fixture | `TEST-ACCESSIBILITY-RULE-01` | `IDENTIFIED` | `TEST_FIXTURE` | `CONFIRMED` | NO | NO | NO |
| jurisdiction | Fixture | `TEST_JURISDICTION` | `IDENTIFIED` | `HUMAN_SUPPLIED_TEST_INPUT` | `CONFIRMED` | NO | NO | NO |
| version | Fixture | `TEST_V1` | `IDENTIFIED` | `TEST_FIXTURE` | `CONFIRMED` | NO | NO | NO |
| effective state | Fixture | `UNKNOWN` in positive fixture | `UNKNOWN` | No verified temporal engine | `NOT_STARTED` | YES | NO | NO |
| requirement_id | Fixture | `TEST-REQ-WIDTH-01` | `IDENTIFIED` | `TEST_FIXTURE` | `PENDING_HUMAN_REVIEW` | NO | NO | NO |
| source locator | Fixture | `fixture://...#section-1` | `IDENTIFIED` | Source reference | `CONFIRMED` | NO | NO | NO |
| subject | Fixture | `ROUTE_CLEAR_WIDTH` | `IDENTIFIED` | `HUMAN_SUPPLIED_TEST_INPUT` | `PENDING_HUMAN_REVIEW` | NO | NO | NO |
| operator | Fixture | `>=` | `IDENTIFIED` | `TEST_FIXTURE` | `PENDING_HUMAN_REVIEW` | NO | NO | NO |
| value | Fixture | `1.2` | `IDENTIFIED` | `TEST_FIXTURE` | `PENDING_HUMAN_REVIEW` | NO | NO | NO |
| unit | Fixture | `m` | `IDENTIFIED` | `TEST_FIXTURE` | `PENDING_HUMAN_REVIEW` | NO | NO | NO |
| tolerance | Fixture | `NONE_AS_EXPLICITLY_MODELED` | `UNKNOWN` | Explicit fixture value | `PENDING_HUMAN_REVIEW` | NO | NO | NO |
| applicability | Derived foundation | `APPLICABLE_CANDIDATE` then `HUMAN_CONFIRMED_APPLICABLE` | `DERIVED` | Source + context + HumanReview | `CONFIRMED` after explicit action | NO | NO | NO |
| route reference | A20-P2 | `ROUTE-01` | `OBSERVED_REFERENCE` | A20-P2 | `PENDING_HUMAN_REVIEW` | NO | NO | NO |
| measurement reference | A20-P2 | `measurement://EDGE-01` | `OBSERVED_REFERENCE` | A20-P2 measurement | `PENDING_HUMAN_REVIEW` | NO | NO | NO |

`USED FOR COMPLIANCE = NO` for every row in this phase.
