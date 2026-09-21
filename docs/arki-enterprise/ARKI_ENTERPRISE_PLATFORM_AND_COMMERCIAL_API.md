# ARKI Enterprise Platform and Commercial API

## Decision

ARKI uses **one architectural motor** and a **separate commercial API boundary**. The API is not a second brain: it does not invent architectural knowledge, bypass provenance, promote UNKNOWN to FACT, or replace human authority.

## Implemented boundary

| Layer | Module | Responsibility | Status |
|---|---|---|---|
| Architectural brain | `server/arkiUnifiedMotor.ts` | Executes the governed conceptual cycle and routes active, frozen, blocked and historical pieces | IMPLEMENTED |
| Enterprise contract | `server/arkiEnterpriseArchitecture.ts` | Registers CAD, simulation, digital twin, transfer, multiscale, ecosystem, plugins and security capabilities with maturity and limits | IMPLEMENTED |
| Commercial facade | `server/arkiCommercialApi.ts` | Versioned API envelope, tenant, actor, plan, idempotency, catalog and human-review audit | IMPLEMENTED |
| tRPC exposure | `server/routers.ts` | Publishes `commercialApi.contract`, `commercialApi.capabilities` and protected `commercialApi.register` | IMPLEMENTED |

## Capability truth table

The enterprise contract distinguishes **available conceptual support** from **planned integrations**. CAD output currently means conceptual SVG/PDF/JSON-oriented representation; native DWG, Revit, live GIS and permit-ready documentation remain NOT_DEMONSTRATED. Simulation, live digital twins, external BIM/ERP connectors and Python sandbox execution are CONTRACT_ONLY or PLANNED until their real adapters and evidence exist.

Cross-project transfer, multiscale scope, provenance, human review, and security primitives are partially implemented through the existing reasoning, SICL snapshot, authentication and audit structures. They are not equivalent to a complete enterprise deployment, disaster-recovery service, or production tenancy platform.

## API contract

The commercial boundary is versioned as `v1`. Each request requires:

- `tenantId`;
- `actorId`;
- commercial `plan`;
- operation type;
- idempotency key.

Every response includes a request identifier and an audit record with `humanReviewRequired: true`. Billing is deliberately an external integration concern; no payment or billing change is performed by this implementation.

## Security and governance

The existing protected tRPC procedures remain protected. The temporary direct-access switch affects only the interface gate and does not weaken backend authorization. Commercial API registration uses `protectedProcedure`; the public catalog exposes only the contract and capability matrix.

## Validation evidence

- `server/arkiEnterpriseArchitecture.test.ts` verifies the eight requested enterprise domains, reuse of `ARKI-UNIFIED-MOTOR-1.0`, and separation of the commercial facade.
- `pnpm check` and `pnpm build` are required before checkpointing.
- The implementation does not claim native CAD/BIM, live simulation, operational digital twin, or production disaster recovery until those integrations are independently demonstrated.

## Next activation gates

1. Native CAD/BIM exchange: signed DWG/IFC/Revit adapter and round-trip test.
2. Simulation: solver connector, input validation, reproducible result provenance and calibration.
3. Digital twin: sensor ingestion, identity mapping, anomaly policy and maintenance workflow.
4. Python plugins: sandbox, package signing, permissions, resource quotas and kill switch.
5. Enterprise deployment: tenant isolation, backup/restore drill, disaster recovery and security review.

`DOCUMENTED ≠ IMPLEMENTED`; `CONTRACT_ONLY ≠ DEMONSTRATED`; human authority remains final.
