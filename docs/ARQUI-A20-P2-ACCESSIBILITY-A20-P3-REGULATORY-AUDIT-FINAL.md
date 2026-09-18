# SiMS-DeI — ARQUI A20-P2 / A20-P3
# Accessibility Assessment and Regulatory Gap Audit

## 1. Estado

```text
A20-P2 = IMPLEMENTED / VALIDATED
A20-P3 = REVIEWED READ-ONLY / NOT ACTIVATED
ACCESSIBILITY = EVIDENCE ASSESSMENT, NOT COMPLIANCE
REGULATORY_COMPLIANCE = NOT_ASSESSED
HUMAN_AUTHORITY = PRESERVED
REAL_GATE = NOT_TRIGGERED
```

A20-P2 consume el grafo A20-P1 y evalúa si existe evidencia suficiente para estudiar una ruta. No produce una aprobación automática de accesibilidad y no sustituye la revisión normativa humana.

## 2. A20-P2 implementado

El contrato admite:

```text
route_id
origin_node_id
destination_node_id
edge_ids
measurements
accessibility_profile
jurisdiction_ref
rule_version
human_review_state
evidence_refs
```

El perfil es un conjunto de criterios suministrado explícitamente. A20-P2 no trae valores normativos por defecto y no asume una jurisdicción.

Los estados producidos son:

```text
INCOMPLETE
CONFLICTING_EVIDENCE
PENDING_HUMAN_REVIEW
UNKNOWN
NOT_ASSESSED
```

Una evaluación completa permanece en `PENDING_HUMAN_REVIEW`. Un conflicto dimensional queda en `CONFLICTING_EVIDENCE`; no se convierte automáticamente en `NON_COMPLIANT` ni bloquea una alternativa.

Siempre se mantienen:

```text
complianceStatus = NOT_ASSESSED
noAutomaticApproval = true
noDecision = true
noRecommendation = true
```

## 3. Pruebas A20-P2

Se verificó que:

1. Una ruta sin perfil o mediciones queda `INCOMPLETE`.
2. Un ancho o pendiente que contradice el perfil queda `CONFLICTING_EVIDENCE`.
3. Una ruta completa queda pendiente de revisión humana.
4. Una arista o destino no observado no puede evaluarse como ruta.
5. Un acceso observado no se convierte en una afirmación de accesibilidad.
6. El estado de cumplimiento permanece `NOT_ASSESSED`.

```text
A20-P2 + A20-P1 focused tests = 8 passed
```

## 4. Auditoría A20-P3

La revisión normativa fue ejecutada en modo read-only. No se activó corpus, no se extrajeron requisitos y no se emitió cumplimiento.

| Brecha | Estado | Consecuencia |
|---|---|---|
| Jurisdicción | `MISSING` | No puede determinarse qué marco aplica |
| Identidad de fuente | `PARTIAL` | Debe fijarse fuente y referencia exacta |
| Versión de fuente | `MISSING` | No puede saberse qué edición es efectiva |
| Vigencia | `MISSING` | No se resolvieron sustituciones ni modificatorias |
| Aplicabilidad | `MISSING` | No existe vínculo entre escala, tipología, uso, jurisdicción y etapa |
| Extracción de requisito | `MISSING` | No existe una aserción normativa trazable |
| Unidades y tolerancias | `PARTIAL` | A20-P2 acepta medidas, pero no tiene comparación normativa canónica |
| Evidencia normativa | `PARTIAL` | Existen referencias de medición, no evidencia normativa enlazada |
| Conflictos | `MISSING` | No existe resolución de fuentes contradictorias |
| Revisión humana | `PARTIAL` | Hay flags de revisión en A20-P2, no firma normativa ni identidad de autoridad |
| Estado de cumplimiento | `NOT_ASSESSED` | No se permite ninguna conclusión de cumplimiento |

## 5. Contrato normativo futuro A20-P3

La futura evaluación debe enlazar:

```text
SpatialSubject
→ ProgramRequirement
→ RegulatoryRequirement
→ Jurisdiction
→ SourceVersion
→ VigencyAssessment
→ ApplicabilityAssessment
→ UnitAndTolerance
→ Evidence
→ ConflictSet
→ HumanReview
→ ComplianceStatus
```

El estado debe distinguir, como mínimo:

```text
NOT_ASSESSED
NOT_APPLICABLE
INSUFFICIENT_EVIDENCE
PENDING_HUMAN_REVIEW
SUPPORTED
CONFLICTING_EVIDENCE
NON_COMPLIANT_CANDIDATE
```

`NON_COMPLIANT_CANDIDATE` solo debe ser un resultado trazable para revisión humana. No debe crear una decisión, recomendación o bloqueo automático.

## 6. Autoridad humana y controles A18

Los controles A18 continúan intactos:

```text
HUMAN_CONFIRMATION_REQUIRED
SPATIAL_REPLACEMENT_STALE_SOURCE
SPATIAL_REPLACEMENT_PROGRAM_LINEAGE_MISMATCH
SPATIAL_REPLACEMENT_NO_CHANGE
SPATIAL_REALIZATION_FINITE_COORDINATES_REQUIRED
```

A20-P2 no ejecuta mutaciones. A20-P3 no ejecuta revisión normativa. Ningún dato de accesibilidad puede autorizar una operación espacial y ningún resultado normativo puede convertir una hipótesis en decisión.

## 7. Validación completa

```text
WEB_TEST_FILES = 49 passed
WEB_TESTS = 256 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS

CORE_TESTS = 402 passed
CORE_COMPILEALL = PASS
CORE_GIT_DIFF_CHECK = PASS
```

## 8. Límites

A20-P2 no implementa:

```text
ACCESSIBILITY_CERTIFICATION
REGULATORY_COMPLIANCE
AUTOMATIC_ROUTE_REPAIR
CODE_INTERPRETATION
JURISDICTION_INFERENCE
```

A20-P3 no activa:

```text
NORMATIVE_CORPUS_LOADING
REQUIREMENT_EXTRACTION
VIGENCY_ENGINE
APPLICABILITY_ENGINE
HUMAN_SIGN_OFF_WORKFLOW
```

## 9. Próximo gate seguro

La siguiente activación debe ser específica y separada. Antes de implementar A20-P3, debe autorizarse un subconjunto concreto para:

```text
source identity + version + jurisdiction
```

Después puede autorizarse extracción de requisitos y aplicabilidad. No se recomienda implementar cumplimiento completo junto con interpretación automática de fuentes.

## 10. Cambios

```text
CORE_CODE_CHANGED = NO
WEB_CODE_CHANGED = YES
NEW_DEPENDENCY = NO
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```
