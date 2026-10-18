# COCO-001 — Auditoría consolidada

| Frente | Estado | Reutilizable | Gaps principales | Conflictos relevantes |
|---|---|---|---|---|
| COCO-A | PARTIAL | RelationshipFabric, ConstructionSpace, provenance/evidence, revisiones | Grafo espacial canónico, topología de movimiento, métricas de sintaxis y contrato matemático | BOUNDED_BY no equivale a adyacencia; relaciones legacy paralelas; projectVersion no enlazado explícitamente |
| COCO-B | PARTIAL / NO EMITIBLE | E8-A compiler, E8-C gates, snapshots, manifests, hashes | Provenance estructural por sección, responsabilidad por sección, revisión independiente, PKI, UNKNOWN obligatorio | Approval Product Owner no es firma profesional; outputs profesionales siguen no aptos |
| COCO-C | PARTIAL | SceneModel, Three.js, snapshots, viewpoints, IndexedDB, provenance/evidence | glTF/GLB loader/validator, rig, animación, percepción, OCR, AR | SceneModel3D usa `active-project` en persistencia; versionados y provenance divergen |
| COCO-D | PARTIAL | E8-B assets/work orders/history, IndexedDB, gates, RelationshipFabric | System hierarchy, workflow O&M, append-only completo, as-built, sensores y predictivo | Versiones IndexedDB/ownership divergentes; sensor observation no es canonical fact |

## Decisión de arquitectura

`REUSE > EXTEND > CREATE` se aplicó. Los cuatro contratos COCO son fundamentos aislados, no nuevos propietarios canónicos del Project State. Se evita modificar `ConstructionModel`, E8, BKH, TX o PF-H01.

## Nota de evidencia

Los reportes de auditoría por frente se conservan en `COCO/AUDIT/COCO-A_AUDIT.md`, `COCO-B_AUDIT.md`, `COCO-C_AUDIT.md` y `COCO-D_AUDIT.md`. Cada uno fue producido desde inspección del repositorio real antes de escribir código.
