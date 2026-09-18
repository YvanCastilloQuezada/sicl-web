# SiMS-DeI — ARQUI A25
# Inteligencia Ambiental, Estructural Preliminar y Flujos Multinivel

## 1. Estado

```text
A25 = IMPLEMENTED / WEB-DERIVED MODEL
WEB_PRECEDENT_REGISTRY = IMPLEMENTED / SOURCE_METADATA_ONLY
NATURAL_LIGHTING = IMPLEMENTED / PARTIAL_PROXY
THERMAL_CONTEXT = IMPLEMENTED / AMBIENT_CONTEXT ONLY
CRAZY_STRUCTURAL_PRECHECK = IMPLEMENTED / PRELIMINARY
EVACUATION_FLOW_SIMULATION = EXECUTED / PARTIAL
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
HUMAN_AUTHORITY = PRESERVED
```

A25 no presenta análisis aproximados como certificaciones. Los estados de iluminación, confort, estructura y evacuación conservan sus límites epistemológicos.

## 2. Conocimiento arquitectónico desde Internet

Se incorporó un registro inicial de fuentes públicas con provenance y clasificación:

| Fuente | Uso permitido | Estado |
|---|---|---|
| Pritzker Architecture Prize | Identificar arquitectos laureados y obras seleccionadas como precedentes | `BIBLIOGRAPHICALLY_VERIFIED` |
| University of Pennsylvania Architectural Archives | Consultar colecciones, dibujos, modelos y procesos de diseño | `BIBLIOGRAPHICALLY_VERIFIED` |
| ArchiRef | Índice secundario de proyectos construidos y criterios de búsqueda | `REQUIRES_HUMAN_REVIEW` |

Reglas:

```text
AUTHOR ≠ AGENT
PRECEDENT ≠ REQUIREMENT
INFLUENCE ≠ AUTHORITY
SOURCE_METADATA_ONLY ≠ DESIGN_KNOWLEDGE
```

A25 permite nutrir el catálogo con fuentes web trazables. No descarga automáticamente libros, imágenes o contenido protegido; no convierte un precedente en una receta y no genera atribuciones que no estén verificadas. La incorporación de conocimiento sustantivo requiere una etapa posterior de revisión humana, derechos, extracción y validación.

## 3. Iluminación natural

A25 reutiliza la orientación y la geometría espacial de A24 y acepta, cuando existen, referencias a proporción de apertura.

Estado del análisis:

```text
orientation = CONTEXT
aperture_to_wall_ratio = PARTIAL_PROXY
annual_daylight_simulation = NOT_EXECUTED
sky_view = NOT_SUPPLIED
obstructions = NOT_SUPPLIED
```

El sistema no afirma niveles de iluminancia, autonomía de luz natural, factor de luz diurna ni cumplimiento normativo.

## 4. Confort térmico

A25 puede recibir datos ambientales existentes de Open-Meteo:

```text
air_temperature
relative_humidity
wind_speed
```

Clasificación:

```text
AIR_TEMPERATURE_CONTEXT = AMBIENT_CONTEXT
SURFACE_TEMPERATURE = NOT_ASSESSED
INDOOR_TEMPERATURE = NOT_ASSESSED
THERMAL_COMFORT = NOT_ASSESSED
ENERGY_SIMULATION = NOT_IMPLEMENTED
```

No se calcula PMV, PPD, UTCI, PET, SET, temperatura radiante media ni un campo térmico espacial. La temperatura ambiente no se presenta como temperatura interior ni como confort.

## 5. Reglas estructurales preliminares para CRAZY

### Superficies regladas

```text
GENERATRICES_REQUIRE_DEFINED_SUPPORT_LINES
EDGE_BOUNDARIES_REQUIRE_CLOSURE
LOAD_PATH_NOT_ASSESSED
MATERIAL_AND_CONNECTIONS_UNKNOWN
```

### Perfiles hiperbólicos

```text
CURVATURE_CHANGE_REQUIRES_CONTINUOUS_SHELL_OR_FRAME_HYPOTHESIS
THRUST_AND_SUPPORT_REQUIRE_ENGINEERING_REVIEW
BUCKLING_NOT_ASSESSED
```

Resultado del caso A24:

```text
state = PARTIAL
constructability = CONTROLLED_HYPOTHESIS
structural_certification = NOT_PROVIDED
human_review_required = YES
```

Estas reglas evitan presentar una forma compleja como estructuralmente válida. No sustituyen un modelo de cargas, material, conexiones, pandeo, cimentación o revisión de ingeniería.

## 6. Simulación de evacuación y flujo peatonal

Fixture multinivel:

```text
ALTERNATIVE = UPAO-001-A
ORIGIN = ORIGIN-N2
VERTICAL ROUTE = STAIR-N2 → STAIR-N1
EXIT = EXIT-N1
DEMAND = 15 persons
CAPACITY = 20 persons/min per edge
```

Ruta encontrada:

```text
ORIGIN-N2
→ STAIR-N2
→ STAIR-N1
→ EXIT-N1
```

Resultado:

```text
reachable = true
bottlenecks = []
maxEstimatedFlowMinutes = 0.75
state = PARTIAL
evacuationCompliance = NOT_ASSESSED
humanReviewRequired = true
noAutomaticCorrection = true
```

El valor de `0.75` minutos es un proxy determinista de demanda/capacidad. No es un tiempo reglamentario de evacuación.

No se modelaron:

```text
fire
smoke
door swings
stair width
occupant load code
reaction time
travel speed distribution
fire resistance
emergency lighting
regulatory egress requirements
```

## 7. Validación técnica

```text
A25_FOCUSED_TEST_FILES = 1 passed
A25_FOCUSED_TESTS = 5 passed
A24/A22_REGRESSION_TESTS = 7 passed
COMBINED_FOCUSED_TESTS = 12 passed
WEB_FULL_TEST_FILES = 54 passed
WEB_FULL_TESTS = 281 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE_CHANGED = NO
CORE_STATUS = CLEAN
```

El build conserva la advertencia existente sobre chunks mayores de 500 kB; no bloquea A25.

## 8. Archivos y fuentes

Implementación:

```text
client/src/components/a25ArchitecturalIntelligence.ts
client/src/components/a25ArchitecturalIntelligence.test.ts
```

Fuentes consultadas:

- [Pritzker Architecture Prize](https://www.pritzkerprize.com/)
- [University of Pennsylvania Architectural Archives](https://www.design.upenn.edu/architectural-archives/home)
- [ArchiRef](https://www.archiref.net/)

## 9. Estado final

```text
A25_PRECEDENT_REGISTRY = PASS_WITH_LIMITATIONS
NATURAL_LIGHTING = PASS_WITH_LIMITATIONS
THERMAL_CONTEXT = PASS_WITH_LIMITATIONS
CRAZY_STRUCTURAL_PRECHECK = PASS_WITH_LIMITATIONS
EVACUATION_ROUTE = REACHABLE / PARTIAL
EVACUATION_CERTIFICATION = NOT_ASSESSED
CORE_CHANGED = NO
HUMAN_AUTHORITY = PRESERVED
```
