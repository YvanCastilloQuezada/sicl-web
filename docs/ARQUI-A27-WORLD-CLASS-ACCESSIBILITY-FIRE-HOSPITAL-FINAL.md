# SiMS-DeI — ARQUI A27
# Excelencia Arquitectónica Mundial, Accesibilidad, Incendios y Hospital MASTER

## 1. Resultado ejecutivo

A27 implementa una fundación verificable para que ARQUI se aproxime al comportamiento de un arquitecto de excelencia mundial. La fase incorpora accesibilidad universal, perfiles normativos versionados, análisis conceptual de evacuación contra incendios, razonamiento hospitalario multinivel y selección de materiales de baja huella como proxy.

El resultado no es una certificación de cumplimiento. La normativa se utiliza como referencia estructurada y cada salida conserva `HUMAN_REVIEW_REQUIRED`.

```text
A27 = IMPLEMENTED / WEB-DERIVED MODEL
ACCESSIBILITY = IMPLEMENTED / PENDING HUMAN AND JURISDICTION REVIEW
FIRE_EVACUATION = IMPLEMENTED / CONCEPTUAL EVIDENCE ANALYSIS
HOSPITAL_MASTER_CASE = EXECUTED / PARTIAL
LOW_CARBON_MATERIALS = REUSED FROM A26 / ILLUSTRATIVE PROXY
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
AUTOMATIC_APPROVAL = FORBIDDEN
```

## 2. Cualidades adicionales para un arquitecto de excelencia mundial

Un arquitecto de clase mundial no solo produce formas llamativas. Debe integrar, en una secuencia coherente, las siguientes cualidades.

### Juicio arquitectónico

Debe distinguir entre belleza, novedad, complejidad, carácter, proporción, utilidad, dignidad y excelencia. Debe explicar por qué una forma es apropiada para un lugar, un programa y una sociedad concreta.

### Dominio tipológico

Debe comprender hospitales, vivienda social, universidades, aeropuertos, terrapuertos, prisiones, edificios comerciales, recreativos, culturales, industriales, religiosos y de uso mixto. Debe reconocer que cada tipología tiene flujos, riesgos, usuarios, tiempos, escalas y responsabilidades diferentes.

### Razonamiento espacial

Debe conectar programa, espacios, adyacencias, privacidad, jerarquía, accesos, circulación horizontal, circulación vertical, núcleos, patios, vacíos, estructura y experiencia.

### Multinivel y continuidad

Debe evitar plantas inconexas entre niveles. Escaleras, ascensores, ductos, núcleos, rutas de evacuación, instalaciones y masas deben mantener continuidad verificable.

### Accesibilidad universal

Debe considerar movilidad, visión, audición, cognición, edad, pacientes en cama, camillas, acompañantes y personal de operación. La ruta accesible no debe ser una ruta residual.

### Seguridad y resiliencia

Debe razonar sobre incendio, humo, evacuación, compartimentación, redundancia de salidas, alarmas, señalización, continuidad operativa, sismo, inundación, calor y fallas de infraestructura.

### Materialidad y ciclo de vida

Debe seleccionar materiales por costo, mantenimiento, disponibilidad, reparabilidad, durabilidad, carbono, circularidad, desempeño y apropiación local. Un material de baja huella no es automáticamente adecuado para un hospital.

### Economía y justicia

Debe buscar excelencia a costo razonable. Debe reconocer cuándo la complejidad formal aumenta el costo, el mantenimiento o el riesgo sin aumentar el valor humano.

### Evidencia y normativa

Debe diferenciar ley, norma, guía, precedente, observación, hipótesis, cálculo y preferencia. Debe mantener jurisdicción, versión, fuente, fecha y alcance de cada requisito.

### Cultura y contexto

Debe considerar clima, territorio, historia, memoria, prácticas sociales, recursos locales, identidad y conflictos culturales sin imponer una estética universal.

### Crítica y autocrítica

Debe comparar alternativas, reconocer contradicciones, exponer unknowns, preservar ramas descartadas y revisar sus propias hipótesis.

### Comunicación profesional

Debe explicar decisiones a arquitectos, ingenieros, médicos, autoridades, usuarios, comunidades y clientes mediante dibujos, diagramas, modelos, métricas y lenguaje comprensible.

### Autoridad humana

Debe proponer y razonar, pero no usurpar la decisión humana, la responsabilidad profesional ni la firma regulatoria.

## 3. Fuentes normativas integradas

A27 registra perfiles versionados para:

```text
ADA_2010
PERU_RNE_A120
PERU_RNE_A130
LOCAL_AUTHORITY
```

La fuente oficial estadounidense de ADA organiza requisitos de rutas accesibles, superficies, puertas, rampas, ascensores, escaleras, señalización, alarmas, espacios médicos y transporte.[1]

El Ministerio de Vivienda del Perú publica la Norma Técnica A.120, aprobada mediante Resolución Ministerial N.° 072-2019-VIVIENDA.[2]

El Reglamento Nacional de Edificaciones identifica A.120 como accesibilidad y A.130 como requisitos de seguridad, junto con A.050 Salud y otras normas tipológicas y técnicas.[3]

Los perfiles no se presentan como una combinación universal. La autoridad competente debe determinar qué jurisdicción, versión, alcance, excepción y norma complementaria aplican al proyecto.

## 4. Accesibilidad universal

A27 reutiliza el grafo de circulación A20-P1 y la evaluación de rutas existente. Una ruta considera:

```text
origin
 destination
observed edges
clear width
slope
turning radius
level change
evidence
jurisdiction
rule version
human review state
```

El sistema puede detectar información incompleta o conflictos dimensionales, pero devuelve:

```text
complianceStatus = NOT_ASSESSED
noAutomaticApproval = true
noDecision = true
noRecommendation = true
```

Esto evita presentar una comparación numérica como aprobación normativa.

## 5. Evacuación contra incendios

A27 añade un análisis conceptual de rutas de incendio con:

```text
route completeness
origin and exit reachability
travel distance
occupant load
number of exits
fire-resistance input
compartmentation state
alarm and wayfinding state
```

El sistema detecta, entre otros, los siguientes conflictos:

```text
TRAVEL_DISTANCE_EXCEEDS_PROFILE
EXIT_REDUNDANCY_NOT_ESTABLISHED
FIRE_RATING_BELOW_PROFILE
```

La evaluación mantiene:

```text
complianceStatus = NOT_ASSESSED
noAutomaticEvacuationCertification = true
humanReviewRequired = true
```

No se implementó una certificación de evacuación. Todavía faltan modelado de humo, puertas, anchos reglamentarios por ocupación, presurización, alarma, resistencia al fuego, rociadores, rutas horizontales de pacientes y validación de autoridad.

## 6. Caso hospitalario completo

El caso controlado usa:

```text
PROJECT = HOSPITAL-001
TYPOLOGY = HOSPITAL
PROFILE = MASTER
LEVELS = N1 + N2
```

Unidades consideradas:

```text
ED       = Emergency Department
IMAGING  = Imaging and Diagnostics
ICU      = Intensive Care Unit
SURGERY  = Surgical Suite
PUBLIC   = Public and Family Services
```

El caso distingue pacientes móviles, limitados y dependientes de cama. También diferencia flujos públicos, de emergencia, clínicos, limpios y sucios.

Fortalezas derivadas:

```text
separación inicial de flujos públicos, emergencia y clínicos
visibilidad de pacientes dependientes de cama
continuidad del núcleo vertical
conexión entre emergencia, imágenes, cirugía e ICU
selección inicial de material de menor carbono
revisión humana y especializada obligatoria
```

Riesgos abiertos:

```text
infection-control validation
smoke-control and fire-alarm design
horizontal evacuation for bed-dependent patients
local authority interpretation
medical planning and equipment coordination
```

## 7. Material hospitalario de baja huella

Para 5,000 m², con un presupuesto ilustrativo de USD 1,200,000 y objetivo indicativo de 1,500,000 kgCO₂e, el candidato obtenido fue:

```text
material = LOW_CARBON_CONCRETE
estimatedCostUsd = 1,050,000
estimatedCarbonKgCo2e = 1,500,000
score = 85
state = ILLUSTRATIVE_PROXY
```

Este resultado no es una especificación. En un hospital debe validarse con EPD, resistencia, limpieza, control de infecciones, mantenimiento, disponibilidad local, logística, estructura y costo real.

## 8. Resultado de ejecución

```text
accessibleRoute = PENDING_HUMAN_REVIEW
accessibleCompliance = NOT_ASSESSED
fireRoute = REACHABLE
fireSafetyState = PARTIAL
fireCompliance = NOT_ASSESSED
hospitalCaseState = PARTIAL
materialCandidate = LOW_CARBON_CONCRETE
humanReviewRequired = YES
noAutomaticWinner = YES
```

## 9. Límites

```text
ADA_COMPLIANCE_CERTIFICATION = NOT_IMPLEMENTED
PERU_RNE_COMPLIANCE_CERTIFICATION = NOT_IMPLEMENTED
FIRE_ENGINEERING_CERTIFICATION = NOT_IMPLEMENTED
SMOKE_SIMULATION = NOT_IMPLEMENTED
MEDICAL_PLANNING_FINALIZATION = NOT_IMPLEMENTED
HOSPITAL_INFECTION_CONTROL_VALIDATION = NOT_IMPLEMENTED
FULL_LCA = NOT_IMPLEMENTED
FINAL_COST_ESTIMATE = NOT_IMPLEMENTED
PROFESSIONAL_SIGNATURE = NOT_REPLACED
```

## 10. Validación

```text
A27_FOCUSED_TESTS = 4 passed
A25/A26_REGRESSION_TESTS = 9 passed
COMBINED_FOCUSED_TESTS = 13 passed
WEB_FULL_TEST_FILES = 56 passed
WEB_FULL_TESTS = 289 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE_CHANGED = NO
CORE_STATUS = CLEAN
```

El build conserva una advertencia no bloqueante sobre chunks superiores a 500 kB.

## 11. Archivos

```text
client/src/components/a27UniversalAccessFireSafety.ts
client/src/components/a27UniversalAccessFireSafety.test.ts
docs/ARQUI-A27-WORLD-CLASS-ACCESSIBILITY-FIRE-HOSPITAL-FINAL.md
```

## References

[1]: https://www.ada.gov/law-and-regs/design-standards/2010-stds/ "2010 ADA Standards for Accessible Design"
[2]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/353700-norma-tecnica-a-120 "Norma Técnica A.120 — Ministerio de Vivienda, Construcción y Saneamiento"
[3]: https://ww3.vivienda.gob.pe/ejes/vivienda-y-urbanismo/documentos/Reglamento%20Nacional%20de%20Edificaciones.pdf "Reglamento Nacional de Edificaciones del Perú"
