# ARKI Three-Layer Forensic Map v1

Baseline inspected: `9093a9363647ea32accd548a94d729571d62abb6` on `main`.

| Current component | Current location | Responsibility | Target domain | Dependencies | Move required? | Risk |
|---|---|---|---|---|---|---|
| Dashboard, Home, First Contact, CommandBar | `client/src/components`, `client/src/pages` | UI, navigation, intent capture and presentation | EDGE | React, router, canonical resolver | No | Medium |
| PWA, service worker, Field Mode, WebXR, spatial preview | `client/public`, `client/src/pages`, `client/src/lib` | Local interaction, capability detection, preview and graceful degradation | EDGE | Browser APIs, optional WebXR, camera/location permissions | No | Medium |
| Parametric Runtime UI | `client/src/pages/ArkiParametricRuntimePage.tsx` | Slider exploration, comparison, local preview and command preview | EDGE | canonical commands, tRPC queries for persistence | No | Medium |
| Unified Motor | `server/arkiUnifiedMotor.ts` | Routes active/frozen/blocked capabilities through one governed motor | BRAIN | integrated architect cycle, Project State read | No | High |
| Project Brain, reasoning harness, Parti, superpowers | `server/arkiProjectBrain.ts`, `server/arkiD62*`, `server/arkiPartiContract.ts`, `server/arkiSuperpowersPack.ts` | Bounded reasoning, candidates, simulations and recommendations | BRAIN | SICL snapshot, provenance, human review boundary | No | High |
| Agent Registry/Orchestrator | `server/arkiAgentRegistry.ts`, `server/arkiAgentOrchestrator.ts` | Specialist contracts and bounded orchestration | BRAIN | Unified Motor and evidence contracts | No | High |
| Visual/OCR/geometry intelligence | `server/visualField.ts`, `server/arkiOcr.ts`, `server/arkiAdvancedGeometry.ts`, `server/arkiVisualIntelligence.ts` | Proposes observations and conceptual outputs | BRAIN | source ingestion, evidence status, external providers where configured | No | High |
| SICL snapshot/core invariants | `server/siclCore.ts`, `server/siclCorePort.ts` | Canonical state, parsing, validation, review, decision and history | CORE/TRUST | typed records, versioning, events | No | Critical |
| Protected tRPC procedures | `server/routers.ts`, `server/_core/trpc.ts` | Authentication, ownership, version checks and authorized persistence | CORE/TRUST boundary | session context, protectedProcedure, DB/Core adapter | No | Critical |
| DB/storage and project persistence | `server/db.ts`, `drizzle/`, `server/storage.ts` | Durable state, artifact ownership and optimistic concurrency | CORE/TRUST | DATABASE_URL, storage provider, migrations | No | Critical |
| Commercial facade | `server/arkiCommercialApi.ts` | External contract separated from architectural brain | Cross-cutting boundary | Unified Motor contracts, tenant/actor/idempotency | No | High |
| Shared types, auth context, errors | `shared/`, `server/_core/` | Shared infrastructure and failure reporting | Cross-cutting | runtime/build tooling | No | Medium |

## Decision

No mass file move is required for v1. The real separation is expressed by contracts, dependency checks, protected procedures and tests. Moving files without changing authority would create three folders without creating three responsibilities.

## Unresolved classification

`UNRESOLVED` is not promoted by filename. Any genuinely cross-cutting component requires human architectural review before relocation. External host execution, remote SICL Core and production queue infrastructure remain `PENDING_EXTERNAL`.
