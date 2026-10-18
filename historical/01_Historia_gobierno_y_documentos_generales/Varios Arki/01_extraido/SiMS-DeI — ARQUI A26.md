# SiMS-DeI — ARQUI A26
# Estética, Materiales, Sostenibilidad, Tipologías y Caso Zaha Hadid

## 1. Estado

```text
A26 = IMPLEMENTED / WEB-DERIVED MODEL
AESTHETICS = IMPLEMENTED / HUMAN-JUDGMENT MODEL
MATERIAL_SELECTION = IMPLEMENTED / ILLUSTRATIVE PROXY
SUSTAINABILITY = IMPLEMENTED / PARTIAL PROXY
CARBON = IMPLEMENTED / NOT_LCA
TYPOLOGY_CATALOG = IMPLEMENTED
ZAHA_CRAZY_CASE = PASS_WITH_LIMITATIONS
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
HUMAN_AUTHORITY = PRESERVED
```

## 2. Belleza, estética, fealdad y excelencia

A26 no asigna una puntuación automática de belleza ni declara que una alternativa sea fea o excelente. En su lugar, estructura preguntas y dimensiones para la revisión arquitectónica:

```text
BEAUTY = HUMAN_JUDGMENT_REQUIRED
UGLINESS = HUMAN_JUDGMENT_REQUIRED
EXCELLENCE = HUMAN_JUDGMENT_REQUIRED
```

Las preguntas consideran:

```text
orden y carácter
adecuación al contexto
calidad de relaciones espaciales
legibilidad
proporción
complejidad útil versus arbitraria
dignidad humana
utilidad
durabilidad
mantenimiento
responsabilidad ambiental
constructabilidad
costo razonable
```

A26 evita confundir:

```text
NOVELTY ≠ BEAUTY
COMPLEXITY ≠ EXCELLENCE
EXPENSIVE ≠ EXCELLENT
CHEAP ≠ GOOD
UGLY ≠ UNUSABLE
```

## 3. Costo bajo o razonable

Se añadieron bandas orientativas:

```text
LOW
REASONABLE
HIGH
NOT_ASSESSED
```

El modelo recibe área y, opcionalmente, costo estimado. El resultado es un proxy orientativo, no un presupuesto:

```text
COST_PROXY ≠ BID
COST_PROXY ≠ MARKET_QUOTE
COST_PROXY ≠ LIFE_CYCLE_COST
```

## 4. Tipologías incorporadas

```text
HOUSING_SOCIAL
HOUSING
HOSPITAL
EDUCATION_UNIVERSITY
COMMERCIAL
RECREATIONAL
CULTURAL
PRISON
AIRPORT
BUS_TERMINAL
OFFICE
INDUSTRIAL
RELIGIOUS
PUBLIC_ADMINISTRATION
MIXED_USE
```

Cada tipología conserva preocupaciones diferenciadas. Por ejemplo:

| Tipología | Prioridades iniciales |
|---|---|
| Hospital | control de infecciones, flujos, orientación, resiliencia |
| Vivienda social | costo, dignidad, mantenimiento, comunidad |
| Comercial | flujo público, flexibilidad, operación, identidad |
| Recreativa | concentración de personas, experiencia, seguridad |
| Penitenciaria | dignidad, seguridad, supervisión, rehabilitación |
| Aeropuerto | pasajeros, seguridad, orientación, resiliencia |
| Terrapuerto | separación peatón-vehículo, flujos, accesibilidad |
| Universidad | aprendizaje, comunidad, flexibilidad, espacio público |

Neufert y otras referencias tipológicas quedan como futuras fuentes de conocimiento, no como reglas automáticas ni normativa vigente.

## 5. Materiales, sostenibilidad y carbono

Se incorporaron perfiles iniciales para:

```text
LOW_CARBON_CONCRETE
RECYCLED_STEEL
ENGINEERED_TIMBER
RAMMED_EARTH
BAMBOO_COMPOSITE
RECYCLED_BRICK
```

Cada perfil contiene:

```text
compatibilidad tipológica
rango orientativo de costo
rango orientativo de carbono
proxy de durabilidad
circularidad
necesidad de validación local
rol estructural
provenance
```

El selector cruza:

```text
typology
area
budgetUsd
carbonTargetKgCo2e
circularity
```

Las salidas se clasifican como:

```text
ILLUSTRATIVE_PROXY
REQUIRES_HUMAN_REVIEW
COST_IS_NOT_BID = true
CARBON_IS_NOT_LCA = true
```

No se afirma una huella de carbono real sin EPD, cantidades, transporte, energía incorporada, mantenimiento, reemplazos y fin de vida.

## 6. Caso de estudio Zaha Hadid + CRAZY

Se usaron fuentes oficiales:

- [Zaha Hadid Architects](https://www.zha.com/), que documenta trabajo cultural, cívico, transporte, urbano, investigación y sostenibilidad.
- [Pritzker — Zaha Hadid 2004](https://www.pritzkerprize.com/laureates/2004), que documenta Vitra Fire Station, Bergisel Ski Jump y Rosenthal Center, entre otras obras.

Precedentes registrados:

```text
ZAHA-VITRA-FIRE-STATION
ZAHA-HADID-STUDIO-MULTISCALE
ZAHA-BERGISER-SKI-JUMP
```

### Hipótesis transferibles

```text
fluid spatial sequence
directional movement
continuous profile
formal tension tied to program and circulation
```

### Inferencias prohibidas

```text
Zaha precedent ≠ structural safety
Zaha precedent ≠ guaranteed beauty
Zaha precedent ≠ low cost
Zaha precedent ≠ permission to copy
Zaha precedent ≠ local code compliance
```

Resultado del caso:

```text
profile = CRAZY
shapeFamilies = RULED_SURFACE + HYPERBOLIC_PROFILE
structuralReading = PARTIAL
finalState = PARTIAL
humanReviewRequired = true
```

Pendientes explícitos:

```text
load path
shell or frame system
buckling
connections
local cost
constructability
```

## 7. Resumen consolidado de implementaciones ARQUI

### A11 — Design Problem

Se estructuraron brief, objetivos, restricciones, programa y preguntas de diseño como insumos epistemológicamente diferenciados.

### A12 — Architectural Synthesis

Se incorporaron estrategia, parti, intenciones generativas y relaciones espaciales sin convertir hipótesis en hechos.

### A13 — Spatial Realization

Se creó el modelo derivado de organización espacial con unidades, relaciones, zonas e intenciones generativas, sin mutar geometría.

### A14 — Controlled Geometric Realization

Se añadió preparación, autorización explícita, ejecución controlada y readback de realizaciones geométricas existentes.

### A15 — Architectural Reading

Se implementó la lectura de geometría realizada, distinguiendo observación, expectativa, derivación, unknown y contradicción.

### A16 — Architectural Design Critic

Se añadieron crítica trazable, hallazgos, hipótesis, incertidumbres y límites de autoridad.

### A17 — Controlled Design Revision

Se implementó selección humana, preparación, doble gate de autorización, revisión espacial y relectura posterior.

### A18 — Negative Controls

Se endurecieron controles contra coordenadas inválidas, geometría no finita, falso éxito y reemplazos espaciales inseguros.

### A19 — Integrated Robustness Diagnostic

Se simuló la cadena A15-A18 y se diagnosticaron brechas en circulación, accesibilidad, normativa y conexión bioclimática.

### A20 — Circulation, Accessibility and Regulatory Intelligence

Se implementaron grafo de evidencia de circulación, evaluación de accesibilidad como evidencia y fundación de aplicabilidad normativa sin afirmar cumplimiento.

### A21 — Program, Adjacency, Zoning and DesignMemory

Se implementaron relaciones espaciales, zonas funcionales, `CirculationIntent` y memoria de diseño para registrar ramas, trade-offs y decisiones humanas.

### A22 — Multilevel Coherence

Se implementaron niveles, relaciones verticales, alineamiento de masas, apilamiento y detección de plantas desplazadas injustificadamente.

### A23 — Intelligent Floorplan and Vertical Core Design

Se diseñaron perfiles de capacidad arquitectónica y reglas de continuidad de escaleras, ascensores y núcleos entre niveles.

### A24 — Intelligent Floorplan Candidates

Se implementó generación controlada de candidatos por perfil, incluidos `JUNIOR`, `ARCHITECT`, `MASTER`, `GENIUS` y `CRAZY`, con validación anti-absurdo.

### A25 — Environmental, Structural and Flow Intelligence

Se implementaron precedentes web trazables, contexto de iluminación natural, contexto térmico ambiental, reglas preliminares para formas regladas/hiperbólicas y simulación conceptual de evacuación.

### A26 — Aesthetics, Materials, Sustainability and Typologies

Se implementaron criterios estructurados para belleza, fealdad, excelencia y costo razonable; catálogo tipológico; selección material orientativa; proxies de sostenibilidad/carbono; y caso Zaha Hadid + CRAZY.

## 8. Validación A26

```text
A26 focused tests = 4 passed
A25/A24 regression tests = 8 passed
Combined focused tests = 12 passed
WEB_FULL_TEST_FILES = 55 passed
WEB_FULL_TESTS = 285 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE_CHANGED = NO
CORE_STATUS = CLEAN
```

Advertencia no bloqueante conservada: el build contiene chunks mayores de 500 kB.

## 9. Límites que permanecen

```text
BEAUTY_SCORING = HUMAN_REVIEW_REQUIRED
STRUCTURAL_ENGINEERING = NOT_IMPLEMENTED
LCA = NOT_IMPLEMENTED
REGULATORY_CERTIFICATION = NOT_IMPLEMENTED
MARKET_COST_ESTIMATION = NOT_IMPLEMENTED
NEUFERT_CORPUS_INGESTION = NOT_IMPLEMENTED
AUTONOMOUS_WEB_HARVESTING = NOT_IMPLEMENTED
AUTOMATIC_WINNER = FORBIDDEN
```
