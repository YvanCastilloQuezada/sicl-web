# BKH-0 — Implementation Gaps

| Capacidad | Estado | Evidencia real | Próxima clasificación |
|---|---|---|---|
| BIM Object Kernel | PARTIAL | `Muro`, `StructuralElement`, espacios y elementos semánticos. | CONSOLIDATE |
| Parametric Constraint Engine | MISSING | Parámetros y reglas de familia existen; no hay solver ni restricciones geométricas generales. | CREATE |
| Relationship / Topology Engine | PARTIAL | Relaciones tipadas y referencias por ID. | EXTEND / CONSOLIDATE |
| Transaction Engine | MISSING | No hay commit atómico, undo, redo ni rollback general. | CREATE |
| BIM Documentation Engine | PARTIAL | Dossier técnico, exportaciones y vistas. | CREATE / EXTEND |
| Family / Component System | PARTIAL | Familias de edificio y elementos generados; no existe sistema completo de tipos/instancias reutilizables. | EXTEND |
| Coordination Engine | PARTIAL | Clashes volumétricos y contratos mínimos de disciplina. | EXTEND |
| BIM Data / IFC Engine | PARTIAL | IFC4 textual y parser/adaptador; geometría conceptual y round-trip productivo no demostrado. | EXTEND |
| Worksharing | MISSING | No se observan locks, merge, conflictos o sincronización multiusuario. | CREATE |
| Performance Kernel | NOT_DEMONSTRATED | No hay benchmark de proyectos grandes ni carga parcial. | CREATE |
| Human Authority | CONTRACT_ONLY | Flags de revisión y gates; no hay entidad transversal de decisión con enforcement. | CREATE / CONSOLIDATE |
| Stable identity | PARTIAL | Hay `GlobalIdMapping`, pero generación de elementos usa fuentes no deterministas. | EXTEND |
| Mutation centralization | MISSING | UI, localStorage, IndexedDB y generación mutan por rutas separadas. | CREATE |
| Local regulations | CONTRACT_ONLY | Reglas y fuentes aparecen en familias/documentos; consulta normativa online productiva no está demostrada. | EXTEND |
| Complex geometry | PARTIAL | Estrategias de masa y geometría conceptual; no existe cobertura general de geometrías complejas. | EXTEND |

## Limitación

Estas brechas no son defectos inesperados dentro de BKH-0. Son el resultado esperado de auditar un producto que ya contiene varias capacidades parciales. La auditoría no las corrige.
