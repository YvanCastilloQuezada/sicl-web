# SiMS-DeI — ARQUI A20
# Circulation, Accessibility and Regulatory Design

## 1. Estado

```text
A20 = DESIGNED / P0 EXECUTED READ-ONLY
A19_BASELINE = PASS_WITH_OBSERVATIONS
REAL_GATE = NOT_TRIGGERED
IMPLEMENTATION = NOT AUTHORIZED BY A20-P0
PRODUCT_CODE_CHANGED = NO
CORE_CODE_CHANGED = NO
WEB_CODE_CHANGED = NO
NEW_CANONICAL_ENTITY = NO
NEW_DEPENDENCY = NO
HUMAN_AUTHORITY = PRESERVED
```

A20 define la arquitectura necesaria para abordar tres brechas identificadas por A19. La fase no convierte una geometría sintética en una afirmación de accesibilidad o cumplimiento. Su primera etapa es un gate de datos y trazabilidad.

## 2. Resultado ejecutivo de A20-P0

La ejecución se realizó sobre la evidencia A15-A19 y sobre los controles negativos A18.

| Gate | Entrada parcial | Suficiente para verificar | Estado | Resultado |
|---|---:|---:|---|---|
| Circulación | Sí | No | `UNRESOLVED` | Falta grafo canónico de continuidad loop/spine |
| Accesibilidad | Sí | No | `UNKNOWN` | Faltan ruta, anchos, pendientes, niveles y radios |
| Cumplimiento normativo | No | No | `UNKNOWN` | Faltan jurisdicción, versión, aplicabilidad y evidencia |
| Acoplamiento bioclimático | No | No | `CONTEXT_ONLY` | Contexto ambiental no enlazado a desempeño espacial |

Controles adicionales:

```text
A18_NEGATIVE_CONTROLS_ALL_BLOCKED = TRUE
REAL_GATE_TRIGGERED = FALSE
DECISION_CREATED = FALSE
RECOMMENDATION_CREATED = FALSE
NEXT_SAFE_STATE = DESIGN_ONLY / REQUIRES PRODUCT_OWNER ACTIVATION
```

## 3. Principios obligatorios

A20 debe conservar estas distinciones:

```text
UNKNOWN ≠ FAIL
OBSERVED_CONDITION ≠ REGULATION
ACCESS_POINT ≠ ACCESSIBLE_ROUTE
CIRCULATION_ELEMENT ≠ CIRCULATION_GRAPH
GEOMETRY ≠ COMPLIANCE
CONTEXT ≠ PERFORMANCE
REGULATION_SOURCE ≠ APPLIED_REQUIREMENT
CRITIQUE ≠ RECOMMENDATION
```

La autoridad humana sigue siendo necesaria para confirmar el brief, el alcance de accesibilidad, la jurisdicción y cualquier conclusión normativa.

## 4. Arquitectura propuesta

A20 se organiza en tres capas coordinadas y un registro transversal de evidencia.

### 4.1 Capa de circulación

La circulación debe modelarse como una red espacial explícita. La red requiere nodos, segmentos, accesos, destinos, niveles, continuidad, dirección cuando exista y referencias a la geometría fuente.

El sistema debe poder distinguir entre:

```text
INTENDED_CIRCULATION
OBSERVED_CIRCULATION_ELEMENT
CONNECTED_SEGMENT
CONTINUOUS_ROUTE
LOOP
SPINE
DEAD_END
UNVERIFIED_CONNECTION
```

La primera versión no debe calcular calidad arquitectónica. Debe responder únicamente si una conexión está observada, derivada, ausente o no verificable.

### 4.2 Capa de accesibilidad

La accesibilidad debe consumir una ruta explícita y parámetros verificables. Como mínimo, el diseño futuro debe admitir:

```text
route_id
origin
destination
level_sequence
clear_width
slope
landing_length
turning_radius
level_change
obstacle_state
evidence_refs
jurisdiction_ref
rule_version
human_review_state
```

Un acceso puntual no basta para crear una ruta accesible. Si falta cualquier dato esencial, el estado debe permanecer `UNKNOWN` o `INCOMPLETE`.

### 4.3 Capa de cumplimiento normativo

La comprobación normativa debe separar fuente, requisito, aplicabilidad y resultado. El vínculo mínimo futuro es:

```text
SpatialSubject
→ ProgramRequirement
→ RegulatoryRequirement
→ Jurisdiction
→ SourceVersion
→ ApplicabilityAssessment
→ Evidence
→ HumanReview
→ ComplianceStatus
```

El resultado no debe ser un booleano aislado. Debe distinguir:

```text
NOT_ASSESSED
NOT_APPLICABLE
INSUFFICIENT_EVIDENCE
PENDING_HUMAN_REVIEW
SUPPORTED
CONFLICTING_EVIDENCE
NON_COMPLIANT_CANDIDATE
```

`NON_COMPLIANT_CANDIDATE` debe describir una condición de revisión; no debe crear una decisión ni bloquear automáticamente una alternativa sin autoridad humana.

## 5. Plan de implementación futuro

### A20-P1 — Circulation Evidence Graph

**Entrada:** `SpatialRepresentation`, `CirculationElement`, access metadata, space IDs y relaciones existentes.

**Salida:** grafo derivado de circulación con estado epistemológico, continuidad y conexiones no verificables.

**No debe hacer:** inferir una ruta accesible, reparar geometría o declarar calidad.

**Criterios de aceptación:** una modificación espacial debe producir una comparación A/B del grafo; conexiones afectadas deben aparecer como `CHANGED`, `PRESERVED`, `BROKEN` o `UNKNOWN`.

### A20-P2 — Accessibility Assessment Contract

**Entrada:** grafo de circulación confirmado, geometría dimensional, datos de nivel y perfil de accesibilidad autorizado.

**Salida:** evaluaciones trazables por tramo y ruta, cada una con fuente, unidad, tolerancia, regla aplicable y estado de revisión.

**No debe hacer:** sustituir datos faltantes, convertir un valor sintético en medida real o asumir una norma por país sin jurisdicción.

**Criterios de aceptación:** una ruta con datos incompletos queda en `UNKNOWN`/`INCOMPLETE`, no en `PASS`.

### A20-P3 — Regulatory Applicability and Evidence

**Entrada:** jurisdicción, versión normativa, corpus vigente, programa, espacio, geometría y evidencia.

**Salida:** requisitos aplicables y evaluación con provenance completa.

**No debe hacer:** usar una fuente `NO_VERIFICADA` como requisito vigente, inferir aplicabilidad territorial o generar aprobación automática.

**Criterios de aceptación:** cada resultado debe identificar requisito, fuente, versión, aplicabilidad, evidencia y autoridad de revisión.

### A20-P4 — Post-Revision Impact Handoff

**Entrada:** lectura A15 antes/después, crítica A16, resultado A17 y controles A18.

**Salida:** registro de impactos en circulación, accesibilidad y regulación.

**Criterios de aceptación:** la revisión espacial puede quedar verificada geométricamente y simultáneamente permanecer `UNKNOWN` en accesibilidad o normativa.

## 6. Matriz de estados

| Dominio | Estado actual | Próximo estado seguro | No permitido |
|---|---|---|---|
| Circulación | `UNRESOLVED` | `OBSERVED` / `UNKNOWN` por tramo | declarar ruta completa desde un elemento aislado |
| Accesibilidad | `UNKNOWN` | `INCOMPLETE` o evaluación trazable | inventar medidas o norma |
| Normativa | `UNKNOWN` | `PENDING_HUMAN_REVIEW` | afirmar cumplimiento sin aplicabilidad |
| Bioclimática | `CONTEXT_ONLY` | resultado acoplado con evidencia | presentar clima como confort |

## 7. Contrato con A15-A19

A20 no crea un segundo flujo. Reutiliza:

```text
A15 = lectura real y clasificación epistemológica
A16 = crítica trazable y unknowns
A17 = selección, autorización, ejecución y readback
A18 = controles negativos y false-success protection
A19 = simulación integrada y límites bioclimáticos
```

La cadena futura debe ser:

```text
A15 READ
→ A16 CRITIQUE
→ A17 AUTHORIZED REVISION
→ A18 NEGATIVE CONTROLS
→ A20 IMPACT ASSESSMENT
→ HUMAN REVIEW
```

## 8. Gates de activación

La implementación de A20 no debe comenzar hasta que exista autorización explícita para el subconjunto correspondiente.

### Gate de circulación

Requiere un caso con al menos dos espacios, un origen, un destino y una conexión espacial explícita. Si no existe esta evidencia, solo se puede ejecutar el diagnóstico de disponibilidad.

### Gate de accesibilidad

Requiere perfil de accesibilidad, jurisdicción o regla elegida, unidades y valores verificables. La ausencia de un dato crítico bloquea la evaluación positiva, no necesariamente toda la cadena.

### Gate normativo

Requiere fuente normativa vigente, versión identificable, jurisdicción y evidencia de aplicabilidad. Un corpus disponible no equivale a un requisito aplicable.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Confundir circulación con accesibilidad | Mantener grafos y evaluaciones separados |
| Confundir observación con cumplimiento | Exigir requisito, fuente, versión y aplicabilidad |
| Falso `PASS` por datos faltantes | Estados `UNKNOWN` e `INCOMPLETE` obligatorios |
| Invalidar geometría sin evidencia | Emitir impacto para revisión humana |
| Acoplar demasiado pronto bioclimática | Mantener `CONTEXT_ONLY` hasta tener análisis espacial válido |
| Crear un motor normativo paralelo | Reutilizar corpus y provenance existentes |
| Convertir una crítica en decisión | Mantener `noDecision` y `noRecommendation` |

## 10. Veredicto A20-P0

```text
A20_DESIGN = COMPLETE
A20_P0_EXECUTION = PASS_WITH_OBSERVATIONS
CIRCULATION_REALIZATION = NOT_READY
ACCESSIBILITY_ASSESSMENT = NOT_READY
REGULATORY_ASSESSMENT = NOT_READY
BIOCLIMATIC_COUPLING = NOT_READY
REAL_GATE = NOT_TRIGGERED
IMPLEMENTATION_AUTHORIZED = NO
```

La siguiente acción segura es solicitar autorización específica para **A20-P1 Circulation Evidence Graph**. No se recomienda activar simultáneamente accesibilidad y normativa porque ambas dependen de una circulación y una base de datos espacial suficientemente trazables.

## 11. Evidencia local

```text
/tmp/a20_p0_result.json
```
