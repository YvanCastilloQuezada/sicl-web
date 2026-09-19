# ARKI — Reconciliación del handoff autoritativo

**Fuente prioritaria:** `ARKI_Research_Implementation_Handoff_Manus_v1.0(2).xlsx`

**Fecha:** 2026-09-19

## Decisión de precedencia

El Excel adjunto es la referencia autoritativa para interpretar el alcance, la madurez y los límites de ARKI. Los documentos históricos que utilicen expresiones más fuertes quedan **superseded for status interpretation**; se conservan para trazabilidad y no se borran, porque eliminarlos destruiría la historia de decisiones y evidencia.

La cobertura de tipologías implementada se conserva. Lo que cambia es la interpretación: un perfil operativo existente significa una **hipótesis funcional trazable y revisable**, no conocimiento profesional exhaustivo, una plantilla universal, cumplimiento normativo ni capacidad de emitir un proyecto aprobado.

## Resultado de la comparación

| Área | Estado reconciliado | Evidencia | Límite vinculante |
|---|---|---|---|
| 23 tipologías canónicas | IMPLEMENTED / HYPOTHESIS | `arkiTypologyFunctionalKnowledge.ts`, `arkiTypologyOperationalPrograms.ts` | Cobertura funcional declarada; no corpus exhaustivo |
| Programas operativos | IMPLEMENTED / PARTIAL | perfiles, sistemas, actividades, flujos y relaciones | Programar no equivale a resolver geometría |
| Educación + topologías pre-coordenadas | IMPLEMENTED / HYPOTHESIS | tres candidatos y dos evaluaciones sintéticas | No genera ganador, recomendación ni decisión |
| Neufert | PARTIAL SOURCE-DERIVED | referencias y reglas adaptadas | Referencia profesional, no norma universal |
| Plazola | PARTIAL SOURCE-DERIVED | referencia tipológica/funcional | Soluciones y diagramas no son plantillas universales |
| RNE | IMPLEMENTED FOUNDATION / PARTIAL CORPUS | registro y verificador versionado | RNE verificado no equivale a cumplimiento de proyecto ni licencia |
| Aprendizaje/transferencia | PARTIAL | ciclo, ledger y pruebas | Investigación, enseñanza e implementación no son equivalentes |
| Multiescala/sitio | PARTIAL / UNKNOWN | contratos existentes | Faltan datos de sitio, jurisdicción y evidencias específicas |
| Ingeniería | PARTIAL | reservas, rutas y dependencias | No se fabrican cálculos ni dimensionamientos profesionales |
| Estética | HUMAN JUDGMENT | crítica y trade-offs | No se implementa score universal ni ganador automático |
| Organigramas/zoning/networks | DERIVED VIEWS | derivables del programa canónico | No son almacenes de verdad paralelos |

## Correcciones de interpretación aplicadas

1. `IMPLEMENTED` se usa para contratos y comportamiento de software, no para afirmar competencia profesional certificada.
2. `VERIFIED` queda reservado a la evidencia y al alcance exactos del gate; no se eleva por inferencia desde una referencia o desde una prueba sintética.
3. Neufert y Plazola informan hipótesis de función, actividad, relaciones, circulación, objetos y organización. No sustituyen el RNE ni la revisión profesional.
4. Las dimensiones mínimas o ejemplos de fuente se conservan como datos de referencia contextualizados. No se convierten automáticamente en requisitos universales.
5. Una lista de habitaciones no constituye programa completo. El programa debe conservar actores, actividades, recursos, procesos, flujos, controles, interfaces, capacidad, tiempo, relaciones y unknowns.
6. Un espacio vacío solo se considera funcional cuando existe una razón semántica o geométrica trazable. Un vacío no justificado permanece como issue, no se rellena artificialmente.
7. La casa de ejemplo continúa siendo un fixture educativo sintético. Sus resultados no prueban cumplimiento RNE, habitabilidad profesional, cálculo estructural, licencia ni proyecto ejecutivo.

## Cobertura de las tipologías solicitadas

Las 23 entradas canónicas están presentes y se validan con estado `HYPOTHESIS` y revisión humana obligatoria:

`Residential`, `Hospitality`, `Care`, `Education`, `Office`, `Healthcare`, `Laboratory`, `Industry`, `Logistics`, `Transport`, `Retail`, `Market`, `Restaurant`, `Library`, `Museum`, `Sports`, `Religious`, `Civic`, `Justice`, `Emergency`, `Mixed-use`, `Campus`, `Urban/Public realm`.

Los aliases históricos se mantienen solamente por compatibilidad y no crean perfiles duplicados.

## Orden canónico de razonamiento

```text
PURPOSE
→ TYPOLOGY / FUNCTIONAL PROFILE
→ ACTORS + ACTIVITIES + RESOURCES
→ SYSTEM REQUIREMENTS
→ PROCESS / FLOW / RELATIONSHIPS
→ PROGRAM
→ ORGANIGRAM (DERIVED VIEW)
→ MULTIDIMENSIONAL ZONING (DERIVED VIEW)
→ PRE-COORDINATE TOPOLOGY
→ PLAN / SECTION / MASSING
→ CANONICAL BUILDING MODEL
→ EVALUATION
→ HUMAN REVIEW
```

La regulación sigue su propio gate de aplicabilidad y evidencia; no se deduce desde la tipología. La ingeniería se representa mediante dependencias y reservas cuando corresponda; el dimensionamiento requiere datos y especialistas.

## Estado de implementación frente al Excel

`HANDOFF_CONTRACT = IMPLEMENTED`

`TYPOLOGY_CATALOG = 23 / 23 PRESENT`

`TYPOLOGY_KNOWLEDGE = PARTIAL_SOURCE_DERIVED`

`PROGRAMMING = PARTIAL_EXISTING`

`MULTISCALE = PARTIAL / UNKNOWN`

`SITE_ENVIRONMENT = PARTIAL / UNKNOWN`

`CONSTRUCTIVE = PARTIAL`

`RNE_REGISTRY = PARTIAL_CORPUS`

`RNE_VERIFIER = IMPLEMENTED_WITH_EVIDENCE_GATE`

`LEARNING_TRANSFER = PARTIAL`

`PROFESSIONAL_CERTIFICATION = NOT_CLAIMED`

`PERMIT_APPROVAL = NOT_CLAIMED`

`AUTOMATIC_DECISION = FORBIDDEN`

## Repositorio y sincronización

El Excel exige como plan interno no hacer push durante la macroorden. La instrucción posterior y explícita del Product Owner solicita sincronizar el resultado reconciliado a GitHub; esa instrucción posterior autoriza el push **sin merge, PR, deploy, force-push ni cambios en Core**. El push se ejecuta únicamente después de typecheck, pruebas, regresión, build, diff check y verificación de rama/remoto.

## Conclusión

No hay una contradicción arquitectónica que obligue a retirar la cobertura tipológica ya implementada. Sí había una contradicción de lenguaje entre algunos cierres históricos y el Excel: cobertura de software se estaba leyendo como aprendizaje completo o capacidad profesional. La superficie queda corregida mediante esta reconciliación. ARKI tiene una base funcional tipológica operacionalizada, trazable y evaluada sintéticamente; todavía requiere datos de proyecto, cobertura regulatoria completa, validación disciplinar y revisión humana para afirmar resultados profesionales.
