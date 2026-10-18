# ARKI Enterprise Readiness and External-Execution Gaps

**Cut:** 2026-09-21  
**Status:** `LOCAL_CONTRACTS_VALIDATED / EXTERNAL_RUNTIME_NOT_AVAILABLE`

## Purpose

This register closes the implementation boundary for the enterprise expansion requested for ARKI. The local web project now contains versioned contracts for CAD/documentation, simulation, digital twin, cross-project transfer, global multiscale, external ecosystem, Python plugins, enterprise security, and a commercial API separated from the architectural brain. The contracts route through `ARKI-UNIFIED-MOTOR-1.0` and preserve human authority.

A local contract and passing test are not equivalent to a deployed specialist service. The items below require a real SICL Core instance, a persistent host, or independently connected vendor adapters. No claim of deployment is made.

## Evidence available locally

| Area | Local evidence | Current status |
|---|---|---|
| Enterprise capability registry | `server/arkiEnterpriseArchitecture.ts` and `server/arkiEnterpriseArchitecture.test.ts` | `CONTRACTED / FOCAL_TESTS_PASS` |
| Commercial facade | `server/arkiCommercialApi.ts`, `server/routers.ts` and enterprise tests | `SEPARATED_FROM_BRAIN / FACADE_VALIDATED` |
| Unified motor | `server/arkiUnifiedMotor.ts`, integrated cycle and prior activation ledger | `IMPLEMENTED / BOUNDED` |
| CAD/BIM/GIS representation | `server/arkiProjectLifecycle.ts`, `server/arkiAdvancedGeometry.ts` | `SEMANTIC_OR_CONCEPTUAL / NATIVE_EXPORT_NOT_DEMONSTRATED` |
| Visual generation | `server/arkiVisualIntelligence.ts` | `HD_2K_FULL_HD_4K_TARGET_PRESETS / PROVIDER_RESOLUTION_UNVERIFIED` |
| Enterprise UI | Control Center registry and browser verification report | `VISIBLE / READ_ONLY_REGISTRY` |

## External gates

| Gate | Why it cannot be honestly closed locally | Required evidence to close |
|---|---|---|
| Real SICL Core E2E | No attached persistent Python service or `SICL_CORE_URL` is available in this session. | A reachable authenticated SICL Core instance plus end-to-end tests for snapshots, Council, HumanReview, Decision, 401, 409 and 422 propagation. |
| Cloud Computer attachment | No Cloud Computer/SSH service connector is available in the current session. | Product Owner attaches a Cloud Computer or provides an authorized persistent host. |
| Persistent SQLite | The sandbox is not the requested production host and no `/data/sicl/` mount exists. | Restart test proving `core.sqlite` survives container/service restart on the persistent host. |
| UFW, systemd and HTTPS | These are host-level operations and cannot be performed against an unavailable host. | Firewall rules, systemd unit status, TLS certificate and public HTTPS health check. |
| `SICL_CORE_URL` registration | Registering a URL that does not exist would create a false deployment claim. | Verified HTTPS endpoint and server-side secret configuration. |
| Native CAD/BIM/GIS adapters | Revit/Dynamo, AutoCAD, Rhino/Grasshopper, Blender and GIS runtimes are not connected here. | Adapter-specific fixtures, export/import round trips and specialist review. |

## Stop condition

The remaining infrastructure gates are not implementation failures. They are **external coordination requirements**. ARKI should not fabricate a URL, mark a service deployed, or convert a semantic model into a native professional deliverable without the relevant adapter and evidence.

## Commercial boundary

The commercial API may expose capability discovery and register governed requests. It is not a payment, billing, entitlement, or production-tenant system. Before commercial launch, the following must be added outside this local contract: identity provider/API-key lifecycle, quota enforcement at the edge, billing provider, abuse controls, tenant isolation tests, backups, disaster recovery, incident response, legal terms, and security review.

## Recommended next external action

Attach or provision the persistent SICL Core host. Once it exists, run the documented deployment runbook, register the verified `SICL_CORE_URL`, execute the E2E matrix, and only then promote the corresponding readiness gates. Until that happens, retain the statuses `NOT_DEPLOYED`, `NOT_DEMONSTRATED`, or `CONTRACT_ONLY`.
