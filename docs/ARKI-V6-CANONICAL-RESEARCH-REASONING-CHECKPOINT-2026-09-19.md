# ARKI / ARQUI — Checkpoint canónico v6.0

## Estado consolidado

La Delta v6.0 se integró como una **extensión declarativa y verificable** de la arquitectura existente. No se creó un segundo motor de geometría, topología, tipología, aprendizaje o revisión humana. El repositorio auditado fue `YvanCastilloQuezada/sicl-web`, rama `feat/spatial-pilot-media-studio-v1`, con HEAD `41d647ab50ca44e5e8469efd9cb816d97fbbfac0` y worktree limpio antes de los cambios.

La implementación v6.0 formaliza el paso de:

> **DETECT → DIAGNOSE → EVALUATE → CONTROLLED REPAIR**

hacia un contrato trazable:

> **CAUSE → STRATEGY → CANDIDATE → MUTATION → REEVALUATION → TRANSFER → LEARNING EVIDENCE**

El contrato conserva el estado epistemológico `HYPOTHESIS` cuando no existe evidencia suficiente y mantiene la autoridad humana como autoridad final.

## Delta real frente a v3–v5

| Área | Estado anterior | Extensión v6.0 | Estado después |
|---|---|---|---|
| Causa | El déficit podía auditarse; la causa no tenía contrato uniforme | `V6CauseModel` distingue observado, hipotetizado, soportado y verificado | Implementado como contrato declarativo |
| Estrategia | Existían reparaciones controladas y memoria de diseño | Familias espaciales, topológicas, allocativas, temporales, de control, recursos, técnicas, externas e híbridas | Implementado como clasificación, no como motores separados |
| Design Move | No existía un contrato común para intención, precondiciones y verificación | `V6DesignMove` exige intención, objetivo, operadores, autoridad, riesgos, unknowns, impacto y verificación posterior | Implementado |
| Aprendizaje | Existían conocimiento, provenance y ledger, pero no un reporte K0→K1 uniforme | `V6LearningLedger` separa input, retrieval, ejecución, adaptación, observación, persistencia y aprendizaje | Implementado con controles negativos |
| Transferencia | Había conocimiento contextual y perspectivas acotadas | `V6TransferAssessment` exige compatibilidad estructural, diferencias críticas, adaptación, contraejemplo y decisión | Implementado |
| Evaluación | Las evaluaciones anteriores eran específicas de cada delta | `V6EvaluationReport` establece el protocolo permanente A–AV | Implementado como contrato reutilizable |
| Regresión | Existía regresión de software en las fases previas | El informe v6 separa regresión de software, conocimiento, razonamiento, geometría, epistemología y regulación | Implementado en el contrato; harness ampliado queda como siguiente prueba controlada |

## Matriz de descubrimiento y reutilización

| Capacidad v6 | Artefacto existente | Capacidad actual | Brecha | Disposición | Archivos afectados |
|---|---|---|---|---|---|
| Modelo geométrico canónico | `CanonicalBuildingModel` y planes constructivos | Representación geométrica, muros, aperturas, niveles y derivados | Ninguna para este checkpoint | `REUSE` | `residentialConstructivePlan.ts`, diseños tipológicos |
| Generación GDI/A21/S1/S2 | A21, memoria de diseño, realización espacial y alternativas | Propuestas, ramas, geometría controlada y trazabilidad | Falta contrato general de estrategia y causa | `EXTEND` | `a21DesignMemory.ts`, módulos espaciales |
| Déficit funcional | `arkiFunctionalVoidAudit.ts`, evaluaciones v3–v5 | Detecta residuos y déficits de capability | Causa y resolución no estaban normalizadas | `EXTEND` | `arkiFunctionalVoidAudit.ts`, delta v6 |
| Mutación | `arkiWasteGeometryRepair.ts` y mutaciones controladas | Reparación acotada con baseline e inmutabilidad | Falta separar design move de mutación | `EXTEND` | reparación existente, delta v6 |
| Knowledge Store | K4, provenance y adquisición | Recuperación contextual y validación humana | Falta ledger uniforme K0→K1 para cada evaluación | `EXTEND` | `arkiKnowledgeStore.ts`, delta v6 |
| Jerarquía multiescala | `arkiMultiscaleSpatialHierarchy.ts`, A22 | FunctionalUnit y Level con relaciones derivadas | Falta contrato explícito para relaciones typed v6 | `EXTEND` | jerarquía existente, delta v6 |
| Síntesis multiperspectiva | K6/K7 | Complementariedad, tensión, contradicción y unknowns | Debe conectarse a causa/estrategia sin crear motor nuevo | `REUSE` | K6/K7 existentes |
| Operadores | No había runtime general de operadores | Hay mutaciones concretas y vocabulario conceptual | Falta contrato semántico | `DATA_ONLY` | delta v6 |
| Composición y experiencia | K7 y conocimiento descriptivo | Perspectivas y derived views parciales | No existe evidencia para universal beauty score | `RESEARCH_ONLY` / `DERIVED_VIEW` | sin motor nuevo |
| Transferencia | Knowledge Store y perspectivas | Context matching y provenance | Falta restraint y counterexample obligatorios | `EXTEND` | delta v6 |
| Reporte permanente | Reportes D3–D5 específicos | Evidencia parcial por delta | Falta protocolo único A–AV | `IMPLEMENT` | delta v6 |

## Contrato implementado

El archivo `arkiV6ReasoningCheckpoint.ts` contiene los siguientes contratos:

- `V6DiscoveryRecord` para clasificar `REUSE`, `EXTEND`, `ADAPT`, `DATA_ONLY`, `DERIVED_VIEW`, `RESEARCH_ONLY` y `DO_NOT_ADD`.
- `V6CauseModel` para evitar inferir directamente `déficit → reparación`.
- `V6DesignMove` para separar intención estratégica de operadores y mutaciones.
- `V6LearningLedger` para distinguir `K0`, input suministrado, conocimiento recuperado, razonamiento ejecutado, adaptación, observaciones y `K1`.
- `V6TransferAssessment` para medir compatibilidad, diferencias críticas, carga de adaptación y restraint.
- `V6EvaluationReport` para preservar el protocolo permanente de evaluación.
- `buildV6CheckpointDelta` para registrar cambios sin borrar conocimiento superseded.

## Pruebas y controles negativos

La suite focalizada v6.0 contiene siete pruebas y pasó completamente:

```text
TEST FILES = 1 passed
TESTS = 7 passed
TYPESCRIPT = PASS
git diff --check = PASS
```

Los controles cubren que:

1. La matriz de descubrimiento clasifica una extensión sin crear un motor paralelo.
2. Un `DesignMove` exige un plan de verificación posterior a la mutación.
3. `INPUT_ACQUISITION`, `RETRIEVAL` y `EXECUTION` no se reportan como aprendizaje.
4. Un aprendizaje candidato exige evidencia persistida.
5. Una transferencia estructuralmente incompatible no se acepta por similitud superficial.
6. Un reporte inválido por pérdida de autoridad humana falla.
7. La delta K0→K1 conserva el historial y registra los elementos retirados sin borrarlos.

## Qué adquirió ARKI y qué no adquirió

La v6.0 agrega una **capacidad de descripción, trazabilidad y evaluación del razonamiento**. No demuestra todavía que ARKI genere estrategias arquitectónicas generales de forma autónoma. El estado correcto es:

```text
CAUSE MODEL = IMPLEMENTED AS CONTRACT
STRATEGY GENERATION = NOT GENERALLY DEMONSTRATED
DESIGN MOVE CONTRACT = IMPLEMENTED
GENERIC CROSS-TYPOLOGY MUTATION = NOT DEMONSTRATED
TRANSFER RESTRAINT = CONTROLLED CONTRACT
K0→K1 LEARNING EVIDENCE = CONTRACT + NEGATIVE CONTROLS
GENERALIZATION = NOT DEMONSTRATED
AUTOMATIC CANONIZATION = PROHIBITED
AUTOMATIC WINNER = PROHIBITED
HUMAN AUTHORITY = PRESERVED
```

En consecuencia, no debe afirmarse que ARKI “aprendió” las fuentes de v6.0 por haberlas recibido. La matriz v6.0 es **input de investigación**. Solo una prueba futura con baseline K0, ejecución, observación persistida, transferencia y revisión humana podrá sustentar una afirmación de aprendizaje.

## Protocolo de pruebas futuras

La siguiente fase recomendada es un harness controlado de seis casos: variante de restaurante, hospital, laboratorio, espacio público, edificio de uso mixto y un caso adversarial de alta similitud con diferencia crítica de hazard. Cada caso debe producir el reporte A–AV y medir por separado:

- regresión de software;
- regresión de conocimiento;
- regresión de razonamiento;
- regresión geométrica;
- regresión epistemológica;
- regresión regulatoria.

Esta fase debe demostrar al menos una transferencia positiva y un rechazo de transferencia inválida antes de cambiar `GENERALIZATION` a `DEMONSTRATED`.

## Fuentes y límites

El workbook `ARKI_ARQUI_Canonical_Research_Reasoning_Checkpoint_v6.0.xlsx` se conserva como fuente de investigación. Las fuentes externas registradas allí son referencias técnicas o académicas. No sustituyen la normativa peruana, la revisión de especialistas ni la aprobación profesional del proyecto.

## Estado final

```text
V6_CHECKPOINT = INTEGRATED / PASS_WITH_OBSERVATIONS
NEW_CANONICAL_PRIMITIVE = NO
HAZARD_CANONIZATION = NOT_AUTHORIZED
SECOND_ENGINE = NO
FOCUSED_TESTS = PASS (7/7)
TYPECHECK = PASS
HUMAN_AUTHORITY = PRESERVED
PROFESSIONAL_CERTIFICATION = NOT_CLAIMED
```

## References

[1]: https://www.nasa.gov/reference/systems-engineering-handbook/ "NASA Systems Engineering Handbook"
[2]: https://www.sciencedirect.com/science/article/pii/0142694X94900213 "Oxman 1994 — Precedents in design"
[3]: https://www.sciencedirect.com/science/article/pii/0142694X9190003F "Jansson and Smith 1991 — Design fixation"
