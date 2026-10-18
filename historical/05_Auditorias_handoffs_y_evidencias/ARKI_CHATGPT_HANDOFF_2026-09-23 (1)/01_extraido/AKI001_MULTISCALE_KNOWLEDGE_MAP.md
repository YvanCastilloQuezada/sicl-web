# ARKI — AKI-001: Mapa multiescala

| Escala | Conocimiento con evidencia | Estado | Vacíos o límites |
|---|---|---|---|
| HUMAN | Roles, decisión humana, revisión profesional | STRUCTURED | No existe entidad universal de HumanDecision. |
| COMPONENT | Familias, puertas, ventanas, capas y materiales | PRACTICED / TESTED | Cobertura de familias especializadas incompleta. |
| OBJECT | Muros, columnas, vigas, losas, escaleras y elementos MEP mínimos | PRACTICED / TESTED | No todas las tipologías están implementadas. |
| ACTIVITY | Actividades 4D, precedencias y ruta crítica | TESTED en fixture | Falta planificación de obra real. |
| SPACE | Espacios, zonas, planta 2D y selección | PRACTICED / TESTED | No hay semántica espacial completa. |
| SYSTEM/ZONE | Clashes, MEP mínimo, seguridad y gases | PARTIAL | Redes completas, cálculo y coordinación productiva faltan. |
| BUILDING | ConstructionModel, presupuesto y SceneModel | PRACTICED / TESTED | Validación profesional y escalabilidad faltan. |
| SITE | Aparece en visión de producto y catálogos | EXPOSED / STRUCTURED | No hay ejercicio reproducible de terreno y sitio. |
| BLOCK/PUBLIC REALM | No se encontró implementación demostrada | UNKNOWN | NOT_FOUND como competencia practicada. |
| NEIGHBORHOOD | No se encontró evidencia de modelado operativo | UNKNOWN | NOT_FOUND. |
| DISTRICT | No se encontró evidencia | UNKNOWN | NOT_FOUND. |
| CITY | Se menciona en tipologías y contexto, no como modelo | EXPOSED | No hay ejercicio reproducible. |
| PROVINCE/METROPOLITAN SYSTEM | No se encontró evidencia | UNKNOWN | NOT_FOUND. |
| REGION | Regionalización de precios aparece como idea y fixture | STRUCTURED / PARTIAL | No hay cobertura regional completa. |
| COUNTRY | Perú aparece como decisión de contexto y RNE en documentos | EXPOSED / STRUCTURED | Cumplimiento normativo no demostrado. |

## Regla de no extrapolación

Una prueba de un muro dentro de un edificio no demuestra competencia sobre una ciudad. Una prueba de ruta crítica de dos actividades no demuestra planificación de obra completa. Una exportación IFC4 de un fixture no demuestra round-trip productivo universal.
