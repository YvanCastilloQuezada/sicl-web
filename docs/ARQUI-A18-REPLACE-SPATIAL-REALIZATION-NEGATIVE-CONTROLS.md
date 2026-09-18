# SiMS-DeI — ARQUI A18
# Replace Spatial Realization: Negative-Control Review

## 1. Estado

```text
A18 = DESIGNED / NEGATIVE-CONTROLS-REVIEWED
A17-G1 = IMPLEMENTED LOCALLY / VALIDATED
REPLACE_SPATIAL_REALIZATION = AVAILABLE
HUMAN_AUTHORITY = REQUIRED
KNOWLEDGE_FEDERATION = NOT REQUIRED / NOT ACTIVATED
NEW SPATIAL MODEL = NO
NEW GEOMETRY ENGINE = NO
NEW AUTHORITY SYSTEM = NO
```

A18 revisa los controles negativos de la mutación genérica que reemplaza una realización espacial explícita en una alternativa resultado. No implementa generación automática de geometría, modificación masiva de espacios, recomputación de relaciones ni activación de conocimiento.

## 2. Contrato de seguridad revisado

La operación debe cumplir:

```text
SOURCE ALTERNATIVE ≠ RESULT ALTERNATIVE
SOURCE IMMUTABLE = YES
ONE TARGET SPACE = YES
SPACE_ID PRESERVED = YES
PROGRAM_ITEM_ID PRESERVED = YES
EXPECTED SOURCE STATE = REQUIRED
HUMAN CONFIRMATION = REQUIRED FOR EXECUTION
PREVIEW ≠ EXECUTION
GEOMETRY B EXPLICIT = REQUIRED
GEOMETRY B VALID = REQUIRED
GEOMETRY A ≠ GEOMETRY B = REQUIRED
UNRELATED REALIZATIONS = PRESERVED
MASSING = UNCHANGED
DECISION_CREATED = FALSE
RECOMMENDATION_CREATED = FALSE
```

## 3. Matriz de controles negativos

| Caso negativo | Control esperado | Resultado verificado |
|---|---|---|
| Sin autorización humana | `HUMAN_CONFIRMATION_REQUIRED` | PASS |
| Sin payload de reemplazo | `SPATIAL_REPLACEMENT_REQUIRED` | PASS por contrato |
| Sin `space_id` | `SPATIAL_REPLACEMENT_SPACE_ID_REQUIRED` | PASS por contrato |
| Sin `program_item_id` | `SPATIAL_REPLACEMENT_PROGRAM_ITEM_ID_REQUIRED` | PASS por contrato |
| Target inexistente | `SPATIAL_REPLACEMENT_TARGET_NOT_FOUND` | PASS |
| Más de una coincidencia del target | `SPATIAL_REPLACEMENT_TARGET_NOT_FOUND` por cardinalidad no única | PASS por contrato |
| Programa incompatible | `SPATIAL_REPLACEMENT_PROGRAM_LINEAGE_MISMATCH` | PASS |
| Sin binding de fuente | `SPATIAL_REPLACEMENT_SOURCE_BINDING_REQUIRED` | PASS |
| Binding de espacio/programa incorrecto | `SPATIAL_REPLACEMENT_SOURCE_BINDING_MISMATCH` | PASS por contrato |
| Sin geometría fuente esperada | `SPATIAL_REPLACEMENT_EXPECTED_GEOMETRY_REQUIRED` | PASS por contrato |
| Geometría fuente obsoleta | `SPATIAL_REPLACEMENT_STALE_SOURCE` | PASS |
| Geometría ausente | `SPATIAL_REPLACEMENT_POLYGON_REQUIRED` | PASS por contrato |
| Tipo distinto de polygon | `SPATIAL_REPLACEMENT_POLYGON_REQUIRED` | PASS por contrato |
| Punto mal formado | `SPATIAL_REALIZATION_POINT_REQUIRED` | PASS |
| Coordenada no finita | `SPATIAL_REALIZATION_FINITE_COORDINATES_REQUIRED` | PASS |
| Polígono abierto | `SPATIAL_REALIZATION_CLOSED_POLYGON_REQUIRED` | PASS por validación reutilizada |
| Área cero | `SPATIAL_REALIZATION_NON_ZERO_AREA_REQUIRED` | PASS por validación reutilizada |
| Geometría B igual a A | `SPATIAL_REPLACEMENT_NO_CHANGE` | PASS |
| Duplicado accidental | No se agrega una segunda entrada; se reemplaza una única entrada | PASS |
| BATH-01 autorizado pero BEDROOM-01 ejecutado | Binding de target/programa requerido | PASS |
| Cambio colateral de otra realización | Lista resultado preserva entradas no objetivo | PASS por composición selectiva |
| Modificación automática de massing | No existe en la rama de reemplazo | PASS |
| Creación de decisión | `decision_created = false` | PASS |
| Creación de recomendación | `recommendation_created = false` | PASS |
| Éxito de preview tratado como ejecución | `status = PREVIEW`, confirmación separada | PASS |

## 4. Hallazgo de revisión

La revisión detectó y corrigió una brecha en la validación de geometría: el cálculo inicial comprobaba cierre y área, pero no rechazaba explícitamente puntos mal formados ni coordenadas `NaN`, infinitas, booleanas o no numéricas antes del cálculo.

El control ahora exige, para cada punto:

```text
point = sequence of exactly two values
x/y = finite numeric values
bool = rejected
NaN = rejected
Infinity = rejected
```

## 5. Lo que los controles sí garantizan

Los controles protegen la mutación contra:

- autorización ausente;
- objetivo inexistente o ambiguo;
- deriva de programa;
- aplicación sobre estado fuente obsoleto;
- geometría inválida básica;
- no-cambio silencioso;
- duplicación accidental en la misma alternativa;
- mutación del objeto fuente;
- pérdida de identidad arquitectónica;
- falso éxito basado únicamente en un ID de alternativa.

## 6. Lo que aún requiere revisión posterior

A18 no considera resueltos los siguientes aspectos arquitectónicos:

```text
containment after replacement = REQUIRES_REVIEW
adjacency after replacement = REQUIRES_REVIEW
circulation impact = REQUIRES_REVIEW
accessibility impact = REQUIRES_REVIEW
parent/level compatibility = PRESERVE / REVIEW IF CHANGED
cross-Alternative spatial_element_id policy = PARTIAL
persisted canonical result = DEPENDS ON EXISTING PROJECT PERSISTENCE FLOW
```

La operación no afirma que una geometría reemplazada sea mejor, correcta, habitable, normativa, accesible, rentable o ambientalmente superior.

## 7. Pruebas ejecutadas

```text
Focused Core spatial-operation suite = 11 passed
compileall = PASS
git diff --check = PASS
```

La matriz incluye pruebas positivas y negativas para:

- reemplazo A→B;
- preservación de la fuente;
- preservación de `space_id` y `program_item_id`;
- autorización humana;
- stale-source;
- wrong subject;
- no-change;
- source binding ausente;
- target ausente;
- coordenadas no finitas.

## 8. Clasificación A18

```text
NEGATIVE_CONTROL_COVERAGE = PASS_WITH_OBSERVATIONS
FALSE_SUCCESS_PROTECTION = IMPROVED / PARTIAL
SOURCE_IMMUTABILITY = PASS
TARGET_BINDING = PASS FOR CURRENT OPERATION PAYLOAD
STALE_SOURCE_BINDING = PASS FOR EXPECTED GEOMETRY
GEOMETRY_INPUT_VALIDATION = PASS FOR BASIC POLYGON CONTRACT
RELATIONSHIP_VALIDATION = NOT IMPLEMENTED / REQUIRES REVIEW
AUTOMATIC_DESIGN_QUALITY = NOT PRESENT
HUMAN_AUTHORITY = PRESERVED
```

## 9. Fuera de alcance

```text
ROOM-SPECIFIC OPERATIONS = OUT
BULK SPACE EDITING = OUT
AUTOMATIC ADJACENCY REPAIR = OUT
AUTOMATIC CIRCULATION REPAIR = OUT
BIM AUTHORING = OUT
KNOWLEDGE RETRIEVAL = OUT
REGULATORY COMPLIANCE CLAIMS = OUT
DECISION CREATION = OUT
RECOMMENDATION CREATION = OUT
DEPLOYMENT = OUT
```

## 10. Estado final

```text
CORE PRODUCT CODE CHANGED = YES, focused validation hardening
WEB PRODUCT CODE CHANGED = NO in A18
NEW DEPENDENCY = NO
NEW CANONICAL ENTITY = NO
NEW SPATIAL MODEL = NO
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```
