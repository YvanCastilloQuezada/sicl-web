# SiMS-DeI — ARQUI A20-P1
# Circulation Evidence Graph

## 1. Estado

```text
A20-P1 = IMPLEMENTED / VALIDATED
SCOPE = DERIVED CIRCULATION EVIDENCE ONLY
ACCESSIBILITY_ASSESSMENT = NOT_IMPLEMENTED
REGULATORY_ASSESSMENT = NOT_IMPLEMENTED
AUTOMATIC_REPAIR = NOT_IMPLEMENTED
HUMAN_AUTHORITY = PRESERVED
DECISION_CREATED = FALSE
RECOMMENDATION_CREATED = FALSE
```

A20-P1 construye un grafo derivado a partir de `SpatialRepresentation` y de los `CirculationElement` existentes. No muta geometría, no genera rutas accesibles y no evalúa cumplimiento normativo.

## 2. Contrato implementado

El grafo contiene:

```text
nodes
edges
continuity
loop
spine
accessibleRoute
compliance
provenance
```

Los nodos pueden representar circulación, acceso, espacio, destino o nivel. Las aristas solo se crean cuando existe metadata explícita, como `connects_to`, `connected_to`, `destination_space_ids` o `to_space_id`.

Una referencia a un destino no observado crea un nodo `UNVERIFIED`; no crea geometría ni confirma que la conexión exista físicamente.

## 3. Estados epistemológicos

```text
OBSERVED = proviene de un elemento o metadata real
DERIVED = resultado derivado con evidencia explícita
UNKNOWN = falta evidencia suficiente
UNVERIFIED = referencia declarada pero no confirmada por el estado observado
```

El grafo mantiene obligatoriamente:

```text
accessibleRoute = NOT_ASSESSED
compliance = NOT_ASSESSED
readOnly = true
noGeometryMutation = true
noDecision = true
noRecommendation = true
```

## 4. Comparación A/B

Se implementó comparación entre grafos de dos alternativas o estados.

Cada nodo y arista puede quedar como:

```text
CHANGED
PRESERVED
BROKEN
UNKNOWN
```

La comparación también reporta cambios de continuidad, loop y spine. No repara conexiones y exige revisión humana.

## 5. Auditoría de los cinco controles A18

Los cinco bloqueos se revisaron contra el alcance A20-P1:

| Control A18 | Resultado | Relevancia para A20-P1 |
|---|---|---|
| Sin autorización humana | `HUMAN_CONFIRMATION_REQUIRED` | El grafo no puede convertir una lectura en ejecución |
| Estado fuente obsoleto | `SPATIAL_REPLACEMENT_STALE_SOURCE` | A20-P1 no acepta una mutación basada en fuente obsoleta |
| Lineage de programa incorrecto | `SPATIAL_REPLACEMENT_PROGRAM_LINEAGE_MISMATCH` | El grafo conserva identidad y no la sustituye por proximidad |
| Geometría sin cambio | `SPATIAL_REPLACEMENT_NO_CHANGE` | Una falsa modificación no puede producir impacto A/B |
| Coordenada no finita | `SPATIAL_REALIZATION_FINITE_COORDINATES_REQUIRED` | La geometría inválida no puede alimentar un grafo confiable |

Los cinco permanecen bloqueantes. A20-P1 no los debilita ni los convierte en advertencias.

## 6. Pruebas A20-P1

La suite focalizada validó:

1. Observación de circulación sin inferir ruta, loop, accesibilidad o cumplimiento.
2. Creación de aristas únicamente desde metadata explícita.
3. Uso de nodos `UNVERIFIED` para destinos declarados pero no observados.
4. Comparación A/B con estados `BROKEN` y `CHANGED`.
5. Separación entre punto de acceso y ruta accesible.
6. Preservación de provenance y flags de solo lectura.

```text
A20-P1 focused tests = 4 passed
```

## 7. Validación completa

```text
WEB_TEST_FILES = 47 passed
WEB_TESTS = 252 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS

CORE_TESTS = 402 passed
CORE_COMPILEALL = PASS
CORE_GIT_DIFF_CHECK = PASS
```

La suite Core no tuvo cambios en esta fase y sus cinco controles A18 permanecen cubiertos por las pruebas existentes.

## 8. Límites preservados

A20-P1 no declara:

```text
CONTINUOUS_ROUTE = TRUE
LOOP = TRUE
SPINE = TRUE
ACCESSIBLE_ROUTE = TRUE
COMPLIANCE = TRUE
QUALITY = TRUE
```

La presencia de un `CirculationElement` es evidencia de un elemento observado. No equivale a una red continua. Una arista declarada por metadata es una conexión observada o declarada, no una validación de accesibilidad.

## 9. Próximos gates

```text
A20-P2 = FUTURE / REQUIRES EXPLICIT ACTIVATION
A20-P3 = FUTURE / REQUIRES EXPLICIT ACTIVATION
A20-P4 = FUTURE / REQUIRES EXPLICIT ACTIVATION
```

A20-P2 debe recibir una ruta confirmada, unidades y datos dimensionales antes de evaluar accesibilidad. A20-P3 debe recibir jurisdicción, versión normativa, aplicabilidad y evidencia antes de evaluar requisitos.

## 10. Cambios

```text
CORE_CODE_CHANGED = NO
WEB_CODE_CHANGED = YES
NEW_DEPENDENCY = NO
NEW_CORE_ENTITY = NO
NEW_REGULATORY_ENGINE = NO
NEW_ACCESSIBILITY_ENGINE = NO
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

A20-P1 quedó implementado como superficie derivada local y validada. No se publicó ni desplegó.
