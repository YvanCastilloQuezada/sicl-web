# ARKI Corporation — Wave 1 integrada y hoja de ruta gobernada

**Estado:** Wave 1 implementada sobre el `ARKI-UNIFIED-MOTOR-1.0`.

## Decisión de arquitectura

ARKI utiliza un único motor y un único estado canónico de proyecto. La Wave 1 no crea un segundo sistema de diseño. Añade una capa de lectura, análisis y trazabilidad que reutiliza el proyecto, las fuentes, las relaciones, el contrato PARTI, el puente de topología/geometría y la autoridad humana existentes.

## Capacidades implementadas en Wave 1

| Capacidad | Implementación | Estado verificable | Límite explícito |
|---|---|---|---|
| Project Brain | `server/arkiProjectBrain.ts` | Implementado y probado | Estado canónico en runtime; persistencia remota y colaboración multiusuario no demostradas |
| Análisis de suficiencia | `analyzeInputSufficiency()` | 4 pruebas focalizadas PASS | Pregunta por datos críticos; no inventa datos de sitio, jurisdicción u operación |
| Problem Frame | `frameProblem()` | Deriva intención, tensiones e hipótesis | Las hipótesis no son decisiones humanas |
| Parti dinámico | `deriveDynamicPartis()` | Genera 3 alternativas derivadas del encargo | Son `AI_PROPOSED`; no equivalen a proyecto ejecutivo |
| Matriz de evaluación | `evaluateAlternatives()` | 11 dominios, celdas PASS/PARTIAL/UNKNOWN | No calcula estructura, energía, costo real ni cumplimiento legal |
| Devil’s Architect | `evaluations.devilArchitect` | Ataques, contradicciones, supuestos débiles y consecuencias desplazadas | Requiere revisión profesional para aceptar/rechazar |
| Genealogía | `buildArchitecturalGenealogy()` | Grafo de problema → tensión → parti → topología → decisión | La decisión permanece pendiente hasta revisión humana |
| Why / removal | `explainWhy()` y `simulateRemoval()` | Traza causal y consecuencias de retirar una hipótesis | La consecuencia es una señal de reevaluación, no una simulación completa |
| Acceso tRPC | `projectBrain.analyze` en `server/routers.ts` | Procedimiento protegido por proyecto propietario | No publica ni canoniza automáticamente el resultado |
| Control Center | Registro `ARKI-PROJECT-BRAIN-WAVE-1` | Visible como capacidad Wave 1 | El panel sigue siendo una proyección read-only |

## Flujo operativo único

`PROJECT INPUT → SUFFICIENCY → FACT / ASSUMPTION / UNKNOWN / CONFLICT → PROBLEM FRAME → TENSIONS → DYNAMIC PARTI → TOPOLOGY BRIDGE → CONCEPTUAL GEOMETRY → EVALUATION → DEVIL'S ARCHITECT → GENEALOGY / WHY → HUMAN REVIEW → DECISION OR BACKTRACK`

## Preguntas humanas mínimas

Cuando falta ubicación, jurisdicción, terreno, actividades o relaciones funcionales críticas, ARKI entra en `ASK_HUMAN`. Puede continuar con `PROCEED_WITH_EXPLICIT_ASSUMPTIONS` sólo cuando el dato faltante no contamina materialmente la interpretación y la hipótesis queda visible.

## Waves futuras

### Wave 2 — capacidad y desempeño

Debe agregar verificación de capacidad, área, operación pico, accesibilidad, evacuación, clima y confort con entradas medibles y evidencia jurisdiccional. No debe convertirse en un número único de “bueno/malo”; cada dominio necesita criterio, dato, unidad, método y fuente.

### Wave 3 — ingeniería y entrega

Debe integrar estructura, MEP, seguridad, costos, cantidades, programación, constructibilidad, operación y mantenimiento con especialistas o adaptadores verificables. La representación BIM semántica existente no equivale todavía a IFC/RVT/DWG nativo ni a documentación firmable.

### Wave 4 — interfaces y colaboración

Debe conectar SICL Core remoto, fuentes regulatorias versionadas, usuarios, roles, especialistas, revisiones y persistencia auditada. La autoridad humana no se reemplaza por el conector.

### Wave 5 — ecosistema y aprendizaje

Debe formalizar agentes especializados, ARKI Academy, libro vivo, investigación continua y aprendizaje por casos con regresión. La evidencia de un caso no debe ascender automáticamente a FACT universal.

## No promesas realizadas

Esta entrega no afirma que ARKI sea arquitecto profesional, que pueda otorgar licencia, que produzca automáticamente planos ejecutivos firmables, que calcule estructuras/MEP, que genere Revit/DWG/GIS nativos, que verifique toda norma nacional en tiempo real o que nunca pueda equivocarse. El sistema reduce alucinaciones mediante provenance, UNKNOWN, suficiencia y revisión humana; no puede garantizar infalibilidad absoluta.

## Gate de cierre de Wave 1

`WAVE_1_PROJECT_BRAIN = PASS_WITH_BOUNDS`

`HUMAN_AUTHORITY = FINAL`

`PROFESSIONAL_COMPLETION = NOT_CLAIMED`
