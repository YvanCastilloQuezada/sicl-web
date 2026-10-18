# BKH-2 — Forensic Findings

**Fecha:** 23 de septiembre de 2026  
**Estado:** auditoría contractual; no se modificó código de producto.

## Conclusión

ARKI posee numerosas reglas de dominio, pero no un Constraint Engine transversal. La futura implementación debe consolidar referencias y resultados sin borrar ni duplicar prematuramente los validadores existentes.

## Hallazgos observados

`shared/arkiDynamicFamilies.ts` contiene sanitización y límites paramétricos para área, capacidad, niveles, proporciones y dimensiones derivadas. Son reglas de generación y no un registro general de constraints.

`shared/arkiConstructionOntology.ts` contiene derivaciones constructivas para muros, capas, aberturas, áreas, volúmenes, pesos, niveles y presupuesto. Estas funciones son cálculos y validadores del dominio constructivo.

`shared/arki4d/index.ts` contiene cálculo de actividades, precedencias y ruta crítica. `shared/arki5d/index.ts` contiene contratos y cálculos de costos. Ambos deben conservar sus owners de dominio.

`shared/coordination/index.ts` contiene detección volumétrica de clashes. Un clash puede alimentar un resultado de coordinación, pero no debe convertirse automáticamente en una constraint genérica.

`shared/structural/index.ts` y `shared/mep/index.ts` contienen contratos especializados y fixtures. La evidencia no permite declarar solvers profesionales completos.

`shared/ifc4/*` contiene parser/exporter y reportes de pérdida. IFC aporta interoperabilidad y provenance, no ownership universal de constraints.

`shared/persistence/*` contiene contratos de proyectos, versiones, snapshots y auditoría. BKH-2 debe referenciar `projectVersion`, no controlar commits.

`shared/arkiRelationshipFabric.ts` es el owner relacional verificado de BKH-1. BKH-2 debe consumirlo mediante IDs y consultas contractuales.

No se observó una entidad transversal implementada equivalente a `ConstraintRecord`, un `ConstraintTypeRegistry` general ni un evaluador general. Esos son candidatos `CREATE`.

## Clasificación global

| Capacidad | Estado de auditoría | Acción contractual |
|---|---|---|
| Límites de familias | EXISTS — dominio | KEEP_AS_DOMAIN_VALIDATOR |
| Métricas constructivas | EXISTS — dominio | KEEP_AS_DOMAIN_VALIDATOR |
| 4D | EXISTS — dominio | KEEP_AS_DOMAIN_VALIDATOR |
| 5D | EXISTS — dominio | KEEP_AS_DOMAIN_VALIDATOR |
| Clashes | EXISTS — dominio | ADAPT sólo con evidencia |
| StructuralModel | CONTRACT_ONLY / parcial | KEEP_AS_DOMAIN_VALIDATOR |
| MEPModel | CONTRACT_ONLY / parcial | KEEP_AS_DOMAIN_VALIDATOR |
| IFC4 | PARTIAL | ADAPT |
| Persistencia | EXISTS — scope propio | KEEP |
| Relationship Fabric | VERIFIED — BKH-1 | REUSE |
| Constraint Engine general | MISSING | CREATE |
| Constraint ownership transversal | MISSING | CREATE en BKH-2 |
| Regulatory solver profesional | NOT_DEMONSTRATED | No crear por declaración |
| HumanDecision transversal | MISSING / reservado | Fuera de BKH-2 |

## Precaución

La auditoría contractual no autoriza implementar ni reclasifica automáticamente todos los mecanismos existentes. Cada adapter futuro requiere equivalencia, provenance, pruebas negativas y prueba de no mutación.
