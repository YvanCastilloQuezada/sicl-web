# Existing BIM Forensic Map

| Capability | Existing evidence | Classification | Boundary |
|---|---|---|---|
| ConstructionModel / semantic entities | `shared/arkiConstructionOntology.ts`, DTOs, tests | REUSE_AS_IS | semantic owner remains existing model |
| Parametric generation | `shared/arkiDynamicFamilies.ts`, regeneration tests | INTEGRATE | no new generator |
| 2D / 3D / SceneModel | canvas, SceneModel, selection tests | DERIVE_VIEW | presentation is not semantic owner |
| IFC4 | `shared/ifc4`, exporter/web-ifc tests | ADAPT | round-trip remains bounded |
| Quantities / 4D / 5D | E7 modules and regression evidence | INTEGRATE | professional status not inferred |
| Clashes | E7 bounded volumetric fixtures | INTEGRATE | clash is not automatically a defect |
| Persistence | IndexedDB formal tests | INTEGRATE | worksharing not demonstrated |
| Project state / evidence | BKH and LKS evidence packages | REUSE_AS_IS | no second evidence system |
| BKH relationships | Relationship Fabric verified scope | INTEGRATE | no relationship duplicate |
| OPBI | LKS OPBI and rapid screening | DERIVE_VIEW | post-award is a derived service view |
| Field foundation | CFMI/ICWI bounded contracts | ADAPT | image is not dimensional truth |
| BIM service schemas | `shared/arkiBimServices.ts` | CREATE_ONLY_MISSING | bounded contracts, no product claim |

## Forensic conclusion

The service layer is a representation and assurance layer over existing ARKI capabilities. It is not a replacement BIM kernel.
