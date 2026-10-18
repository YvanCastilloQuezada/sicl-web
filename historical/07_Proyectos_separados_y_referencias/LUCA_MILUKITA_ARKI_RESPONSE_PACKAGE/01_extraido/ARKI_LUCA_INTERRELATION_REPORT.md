# ARKI ↔ LUCA / MiLukita — Interrelation Report

**Estado:** `CONCEPTUALLY COMPATIBLE / TECHNICALLY UNCOUPLED / NO FUSION AUTHORIZED`

## 1. Ontological comparison

| System | Observable responsibility | Evidence status |
|---|---|---|
| **ARKI** | Built-environment and architectural intelligence: semantic BIM entities, constraints, relationships, regeneration, transactions, documentation, IFC and professional project lifecycle. | Real kernel and UI evidence exists in the ARKI repository, with declared boundaries and known technical debt. |
| **LUCA/MiLukita** | Spatial/real-world interaction: identity, devices, territorial observations, WorldObjects, POIs/claims/evidence, mapper/review/publication, TV/mobile control, AR/Lukita surfaces and community/discovery concepts. | Structured branch evidence exists; current main is governance-only and physical/runtime completeness is partial. |

They overlap in **spatial intelligence**, **coordinates**, **3D/AR**, **evidence**, **buildings**, **identity**, **agents** and **storage**, but they do not have the same semantic owner.

## 2. Potentially shareable contracts

| Capability | Boundary decision | Reason |
|---|---|---|
| Identity federation | Potentially shared adapter | Shared login/identity can exist without shared product authority. |
| Device and session identity | Potentially shared | User/device/session contracts can be common while permissions remain product-specific. |
| Coordinates and spatial references | Potentially shared, versioned | LUCA observes real-world location; ARKI consumes governed project/site coordinates. |
| Evidence/provenance | Potentially shared contract | Both need source, hash, timestamp, responsible actor and epistemic status. |
| 3D asset transport | Potentially shared adapter | GLB/scene transport is not semantic BIM ownership. |
| Computer vision/OCR | Shared infrastructure candidate | Outputs must enter each product as evidence, not automatic truth. |
| AI model gateway | Shared infrastructure candidate | Each product retains separate prompts, tools, permissions and authority. |
| Offline sync | Shared infrastructure candidate | Conflict and canonical ownership must remain product-specific. |
| Maps/GIS | Shared infrastructure candidate | LUCA can provide observation context; ARKI remains owner of project semantics. |
| Storage/compute | Shared infrastructure candidate | Shared infrastructure does not mean shared domain database. |

## 3. Must remain product-specific

### ARKI-specific

- BIM semantic ownership.
- Family/type/instance semantics.
- Constraint, relationship, regeneration and transaction kernels.
- Quantity, cost, schedule and documentation authority.
- Professional project versions and design decisions.
- IFC/project interoperability semantics.

### LUCA-specific

- World observation and field capture lifecycle.
- POI/community contribution and public discovery.
- TV/mobile control and entertainment experience.
- Device pairing, remote control and interaction surfaces.
- Public moderation and territorial publication context.
- Lukita character/live experience semantics.

### Must not be shared directly

- Direct writes from LUCA agents into ARKI canonical BIM state.
- Direct writes from ARKI kernels into MiLukita public content.
- MJP CORE access through either product's generic agent gateway.
- One product's publication authority used to publish the other product's data.
- Shared database tables with ambiguous ownership for Geometry, WorldObject, BIM Entity, POI or Evidence.

## 4. Multiscale continuity

```text
LUCA
territory → city → street → POI → building observation → person/device
                                      ↕ governed adapter
ARKI
territory → city → site → building → space → object/component → discipline
```

The overlap is real at **territory, site, building and observation**, but an observed building is not automatically an ARKI building model. LUCA can provide field evidence and context; ARKI must decide whether and how that evidence enters a project model.

## 5. Concrete scenarios

| Scenario | Current status |
|---|---|
| LUCA detects a building → ARKI understands an architectural entity | **PROPOSED / NOT IMPLEMENTED**; requires geospatial matching, evidence review and Human Authority. |
| ARKI creates/understands a building → LUCA represents it in AR | **PROPOSED / PARTIAL prerequisites**; requires governed export, coordinates, GLB/scene adapter and physical AR validation. |
| LUCA field observation → GPS/camera/OCR/user → evidence → ARKI project understanding | **CONCEPTUALLY VALID / NOT IMPLEMENTED E2E**; OCR is not demonstrated and evidence cannot silently become BIM truth. |
| ARKI project status → LUCA public representation | **PROPOSED / REQUIRES publication adapter**; must expose only approved/public representations. |

## 6. Independence

**Can ARKI function without LUCA?** Yes. ARKI can operate with project-native models, files, IFC, user input and professional evidence. LUCA is not a kernel dependency.

**Can LUCA function without ARKI?** Yes. LUCA can operate as a spatial, social, content, device and AR platform without BIM semantics.

**Potential benefits of interoperability:** field-to-project evidence, site observation, AR visualization of approved models, building/POI continuity, shared provenance and reduced duplication in identity/vision infrastructure.

**Risks of excessive coupling:** ambiguous ownership, accidental public publication of professional data, privacy leakage, IDOR/authz confusion, inconsistent coordinate systems, stale models, autonomous agents crossing authority boundaries and forced release synchronization.

## 7. Recommended relationship

Keep two autonomous products connected through **versioned adapters and evidence contracts**. Do not merge codebases, databases or domain authorities. A future AR-LU umbrella may be a corporate or governance hypothesis, but it is not currently established as a technical runtime.

**Verdict:** `INTEROPERABILITY CANDIDATE — NO FUSION / NO IMPLEMENTATION`.
