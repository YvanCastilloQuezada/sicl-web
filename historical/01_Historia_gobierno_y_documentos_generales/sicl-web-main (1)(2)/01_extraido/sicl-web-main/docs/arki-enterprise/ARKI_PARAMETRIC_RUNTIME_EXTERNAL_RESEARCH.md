# ARKI — Parametric Runtime and Real-Time Platform Research

## Executive decision

ARKI should keep its own deterministic, governed control plane. Dynamo/Revit, Grasshopper/Rhino and Blender Geometry Nodes should be optional execution adapters, not the architectural brain or authority. The AI may propose structured parameters and graph changes; a validator, policy engine and human approval must precede any commit to a model or file.

## Findings

| Platform | Can read/write | Real-time meaning | Main limitation | ARKI decision |
|---|---|---|---|---|
| Dynamo/Revit | `.dyn`/`.dyf`; Revit document through Dynamo/Revit API when the host/session exists | Interactive graph recomputation or Player execution | Local/host-bound; not a server, queue, durable API or autonomous `.rvt` editor; Revit/licensing required | Adapter for governed local BIM automation |
| Grasshopper/Rhino | `.gh`/`.ghx`, `.3dm` through RhinoCommon; Hops/Rhino.Compute for HTTP solve | Interactive recomputation; HTTP request/response and optional async/parallel Hops | Rhino runtime/licence/plugins; stateless Compute; no guaranteed hard real-time or transactional governance | Adapter for controlled geometric workers |
| Blender Geometry Nodes | `.blend`, node groups and evaluated geometry through `bpy` | Interactive dependency-graph/viewport evaluation | Not BIM authority; headless process and GPL obligations; no hard-real-time guarantee | Optional open visual/geometry worker |
| CPython/Pydantic/NumPy/Numba | Versioned JSON/arrays and ARKI contracts; files only through explicit tools | Measured soft-real-time when isolated and warmed | No built-in authority, sandbox, queue or deadline guarantee | **Own ARKI runtime baseline** |
| WebSockets/NATS/Redis/Ray/Dask | Messages, events, tasks and object references—not project authority | Low-latency events or distributed task execution | Delivery, ordering, persistence, retries and scheduling need explicit governance | WebSockets for UI; NATS JetStream or Redis Streams optional; Ray/Dask off critical commit path |

## Recommended architecture

The ARKI control plane runs in CPython and uses strict Pydantic/JSON Schema contracts. Each worker receives an immutable manifest containing runtime version, graph or script hash, approved dependencies, units, tolerances, optional seed, resource limits, correlation ID and actor. Each worker returns typed outputs, artefacts, warnings, metrics and an execution hash. Determinism means the same pinned environment and inputs produce equivalent results within declared tolerances; it does not promise bit-identical output without further validation.

WebSockets should serve UI progress, telemetry and human review. NATS JetStream is the preferred durable event bus when replay, consumers and decoupled services are needed; Redis Streams is a viable alternative where Redis is already operated. Neither becomes the source of truth. Commands must be authenticated, idempotent and versioned; AI proposals are never direct commits.

## Current implementation scope

ARKI now includes `server/arkiParametricRuntime.ts` and `tools/arki_parametric_worker.py`. The runtime has universal `inspect`, `validate` and `execute` boundaries; catalogs `.dyn/.dyf`, `.gh/.ghx` and `.blend` artefacts with hashes and dependency manifests; and executes a small allow-listed graph vocabulary in a bounded CPython worker. The worker returns an execution hash, deterministic flag, soft-real-time flag and structured result. The Control Center and protected tRPC endpoint expose the capability. Actual Dynamo execution still requires Revit/Dynamo; actual Grasshopper execution requires Rhino/Grasshopper or Rhino.Compute; actual Blender execution requires the Blender executable. Those hosts are not silently claimed as installed.

## External gates

Revit/Dynamo requires a compatible Windows host and Autodesk licensing. Rhino/Grasshopper/Rhino.Compute requires Rhino, compatible plugins and its runtime/licensing; Rhino.Compute is not an open-source replacement for Rhino. Blender requires a pinned executable and GPL review if modified/distributed. Production realtime requires durable storage, secrets, TLS/mTLS, quotas, observability, recovery and a persistent host when WebDev limits are insufficient.

## Primary sources

- [Dynamo Player and graph security](https://help.autodesk.com/view/RVT/2025/ENU/?guid=RevitDynamo_Dynamo_Player_About_Graph_Security_and_Trusted_Folders_html)
- [Dynamo for Revit Python connection](https://primer.dynamobim.org/10_Custom-Nodes/10-5_Python-Revit.html)
- [Dynamo repository](https://github.com/DynamoDS/Dynamo)
- [Rhino.Compute](https://developer.rhino3d.com/guides/compute/)
- [Hops](https://developer.rhino3d.com/guides/compute/what-is-hops/)
- [Rhino.Compute billing](https://developer.rhino3d.com/guides/compute/core-hour-billing/)
- [RhinoCommon File3dm](https://developer.rhino3d.com/api/rhinocommon/rhino.fileio.file3dm)
- [Blender Geometry Nodes](https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/introduction.html)
- [Blender scripting security](https://docs.blender.org/manual/en/latest/advanced/scripting/security.html)
- [Blender license](https://www.blender.org/about/license/)
- [Python embedding](https://docs.python.org/3/extending/embedding.html)
- [NumPy I/O](https://numpy.org/doc/stable/reference/routines.io.html)
- [Pydantic JSON Schema](https://docs.pydantic.dev/latest/concepts/json_schema/)
- [NATS JetStream](https://docs.nats.io/concepts/jetstream)
- [WebSockets Python documentation](https://websockets.readthedocs.io/en/stable/)

`HOST_AVAILABLE ≠ ADAPTER_IMPLEMENTED`; `WORKER_EXECUTED ≠ HUMAN_APPROVED`; `LOW_LATENCY ≠ HARD_REAL_TIME`.
