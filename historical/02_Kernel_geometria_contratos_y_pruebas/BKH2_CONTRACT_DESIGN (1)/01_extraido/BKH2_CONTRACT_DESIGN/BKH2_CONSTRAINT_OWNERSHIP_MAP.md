# BKH-2 — Constraint Ownership Map

**Estado:** Contract Design Only. No ownership conflict is resolved by this document.

## Hallazgo principal

El repositorio no contiene todavía una entidad canónica transversal `ConstraintRecord` ni un motor general de evaluación. Existen validadores y límites distribuidos por dominio. Por tanto, el owner futuro de una constraint general debe diseñarse en BKH-2 y no puede atribuirse por conveniencia a `ConstructionModel`, `DynamicBuildingFamily` o `Relationship Fabric`.

| Capacidad | Owner actual observado | Representación | Readers / writers observados | Clasificación futura |
|---|---|---|---|---|
| Límites paramétricos de familias | `shared/arkiDynamicFamilies.ts` | `safeNumber`, `Math.max`, `Math.min` y modifiers | Generación de familias | `KEEP_AS_DOMAIN_VALIDATOR`; adaptar reglas explícitas |
| Reglas de muros y aberturas | `Muro` y `ConstructionModel` en `shared/arkiConstructionOntology.ts` | Métodos de área, volumen, peso y abertura | Ontología constructiva, planta, metrados | `KEEP_AS_DOMAIN_VALIDATOR`; adaptar predicados cuando corresponda |
| Relaciones BIM | `shared/arkiRelationshipFabric.ts` | `RelationshipRecord` | Adapters y consumidores legacy | `REUSE`; BKH-1 permanece owner relacional |
| Clashes geométricos | `shared/coordination/index.ts` | `CoordinationNode` y `Clash` | Módulo de coordinación y pruebas | `KEEP_AS_DOMAIN_VALIDATOR`; adaptar a resultados de constraint sólo por contrato |
| Costos y cantidades | `shared/arki5d/index.ts` y ontología constructiva | PriceBook, quantities y budget | PRESUP-5D, E7 | `KEEP_AS_DOMAIN_VALIDATOR`; no transferir ownership a BKH-2 |
| Planificación 4D | `shared/arki4d/index.ts` | Activities, precedences y critical path | Módulo 4D y E7 | `KEEP_AS_DOMAIN_VALIDATOR` |
| Estructuras | `shared/structural/index.ts` | StructuralModel y stub | Contratos y fixtures E7 | `KEEP_AS_DOMAIN_VALIDATOR` / `CONTRACT_ONLY` según solver |
| MEP | `shared/mep/index.ts` | MepModel y topología | Contratos y fixtures E7 | `KEEP_AS_DOMAIN_VALIDATOR` / `CONTRACT_ONLY` |
| IFC | `shared/ifc4/arkiIfc4.ts`, `webIfcAdapter.ts` | Parser/exporter y loss report | Panel IFC4, fixtures | `ADAPT`; IFC no es owner de constraints |
| Snapshots y versiones | `shared/persistence/arkiPersistence.ts` | Project, version, snapshot, audit | IndexedDB y SceneModel | `KEEP`; BKH-2 sólo referencia `projectVersion` |
| Constraint general | No existe owner canónico observado | No existe entidad general | No existe writer/reader transversal | `CREATE` en BKH-2 |
| Decisión humana | No existe owner transversal | Contratos parciales | Ningún writer canónico | Fuera de BKH-2; reservar para BKH-4 |

## Regla de ownership futuro

BKH-2 será owner de la identidad semántica y evaluación de `ConstraintRecord` únicamente cuando el contrato sea aprobado e implementado. No será owner de las entidades sujetas, de las relaciones, de la geometría, de los costos, del cronograma ni de las decisiones humanas.
