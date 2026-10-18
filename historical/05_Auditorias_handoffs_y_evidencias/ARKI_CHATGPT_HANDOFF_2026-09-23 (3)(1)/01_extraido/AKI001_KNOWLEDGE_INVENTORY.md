# ARKI — AKI-001: Inventario de conocimiento

| Disciplina | Competencia o conocimiento | Tema | Escala | Fuente local | Evidencia | Estado |
|---|---|---|---|---|---|---|
| Arquitectura | Generación de propuestas | Familias y variantes paramétricas | BUILDING | `shared/arkiDynamicFamilies.ts` | Tests de generación | PRACTICED / TESTED |
| Construcción | Muros constructivos | Capas, acabados y aberturas | OBJECT / BUILDING | `shared/arkiConstructionOntology.ts` | `test-wall-coherence.ts` | VERIFIED para el fixture probado |
| Construcción | Puertas y ventanas | Relación con muro | COMPONENT / OBJECT | `test-wall-door-canvas.ts` | Cuadrado de cuatro muros y puerta | VERIFIED para el caso probado |
| BIM | Modelo semántico | `ConstructionModel` y relaciones | OBJECT / BUILDING | Ontología constructiva | Código y tests | PRACTICED / TESTED |
| BIM | Selección | Selección individual y múltiple | OBJECT / SPACE | `shared/arkiBimSelection.ts` | Tests de selección e inspector | TESTED |
| BIM | Planta 2D | Canvas, filtros y contexto | SPACE / BUILDING | `client/src/canvas` | Tests UI y captura previa | PRACTICED / TESTED |
| BIM | Escena 3D | Nodos, zonas, capas y cámaras | SPACE / BUILDING | `shared/arkiSceneModel.ts` | Tests SceneModel | PRACTICED / TESTED |
| Parametrización | Parámetros de familia | Variantes y reglas | COMPONENT / BUILDING | `arkiDynamicFamilies.ts` | Generación | PRACTICED; Constraint Engine UNKNOWN |
| Geometría | Sólidos y bounds | Conversión de elementos | OBJECT / BUILDING | Ontología y SceneModel | Tests geométricos | TESTED en fixtures |
| Cantidades | Metrados | Área, volumen, peso | OBJECT / BUILDING | Ontología y 5D | `test-wall-coherence.ts` | TESTED |
| Costos | PriceBook y presupuesto | Partidas, precios, reconciliación | BUILDING / ACTIVITY | `shared/arki5d` | `test-e7.ts` | TESTED en fixture |
| Planificación | 4D | Actividades, precedencias y ruta crítica | ACTIVITY / BUILDING | `shared/arki4d` | `test-e7.ts` | TESTED en fixture |
| Coordinación | Clashes | Intersección volumétrica | SYSTEM/ZONE / BUILDING | `shared/coordination` | `test-e7.ts` | TESTED en fixture |
| Estructuras | Modelo estructural | Nodos, miembros y restricciones | OBJECT / BUILDING | `shared/structural` | Fixture pequeño | STRUCTURED / NOT_DEMONSTRATED |
| MEP | Redes mínimas | Gases, seguridad y sanitarias | SYSTEM/ZONE / BUILDING | `shared/mep` | Fixture hospitalario | STRUCTURED / PARTIAL |
| IFC | Exportación IFC4 | Entidades, GlobalId y pérdida | OBJECT / BUILDING | `shared/ifc4` | Tests IFC4 | TESTED en fixture; productivo UNKNOWN |
| Persistencia | Snapshots | Draft, approved, auditoría | BUILDING / ACTIVITY | `shared/persistence` | Tests IndexedDB | TESTED localmente |
| Documentación | Expediente técnico | Dossier y Markdown | BUILDING / ACTIVITY | módulos y reportes | Tests de dossier | PRACTICED / PARTIAL |
| i18n | Ocho idiomas | Catálogo y fallback | PRODUCT | `catalog.ts`, tests | `test-i18n-catalog.ts` | TESTED |
| Inteligencia | Reasoning y generación | Computational Fabric | Todas, sin transferencia automática | Documentos ARKI | Arquitectura escrita | STRUCTURED / NOT_DEMONSTRATED |

La ausencia de una fila no significa que la disciplina sea imposible; significa que AKI-001 no encontró evidencia suficiente dentro del corpus auditado.
