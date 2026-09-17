# SiMS-DeI — Photorealistic Rendering Architecture P0

**Estado:** DOCUMENTED / FUTURE  
**Tipo:** Architecture and technical evaluation  
**Implementation:** No  
**Spatial focus:** Primarily `edificacion`; possible future relevance for `objeto`, `espacio` and `parcela_sitio`  
**Engine selected:** None

## 1. Executive conclusion

SiMS-DeI should preserve the current Three.js/React Three Fiber renderer as the **realtime architectural presentation path**. It should not label its current `REALISTIC` mode as photorealistic. The current state remains:

```text
PHOTO_REALISTIC = NOT_AVAILABLE
```

A future high-quality path should be evaluated as a separate renderer that consumes the same canonical spatial design without replacing it. The strongest architecture candidate is a hybrid model in which the Web application remains the interactive exploration environment and an optional geometry-preserving offline renderer is evaluated later. No engine, service, dependency or infrastructure is selected by this document.

## 2. Fundamental separation

```text
SpatialRepresentation
        ↓
PresentationScene
        ↓
Rendering Pipeline
        ↓
Image / Video
```

The rendered image is not the canonical spatial model. The renderer must not silently modify design geometry.

```text
RENDERED IMAGE ≠ CANONICAL SPATIAL MODEL
RENDER ≠ EVALUATION
RENDER ≠ SIMULATION
RENDER ≠ DECISION
```

## 3. Capability families

Three capabilities must remain separate:

| Capability | Meaning | Current status |
|---|---|---|
| Realtime architectural rendering | Interactive Web viewport with camera, materials, lights and presentation modes | Implemented through Three.js/R3F |
| Offline/high-quality rendering | Dedicated pipeline for higher samples, resolution and controlled output | Future architecture |
| Generative presentation imagery | Interpretive image generation for atmosphere or style exploration | Future, strictly separated from verified rendering |

The current V2 implementation improves realtime presentation but does not cross the boundary into photorealism.

## 4. Geometry fidelity requirements

Any future renderer must preserve, when represented by the source model:

- mass position;
- mass dimensions;
- mass height;
- orientation;
- voids;
- relative proportions;
- site relationship;
- alternative identity;
- camera relationship.

A visually attractive image that changes the design is not a valid SiMS-DeI rendering.

```text
GEOMETRY_FIDELITY = MANDATORY
DESIGN_CHANGED = NO
```

## 5. PresentationScene concept

A future non-canonical `PresentationScene` may reference:

- `SpatialRepresentation`;
- camera and saved-view state;
- presentation materials;
- lighting;
- environment;
- neutral ground;
- context assets;
- render settings.

It must not replace `SpatialRepresentation`.

```text
SpatialRepresentation
        │
        └── immutable design source
                ↓
        PresentationScene
                ↓
             Renderer
```

Presentation materials are not construction materials and are not BIM material specifications. Context assets such as vegetation, people, neighboring geometry or vehicles must be classified separately from design geometry.

## 6. Option matrix

| Dimension | Current Three.js realtime | Advanced Web realtime | Blender/offline rendering | Generative presentation |
|---|---|---|---|---|
| Geometry fidelity | High for current massing source | Potentially high if pipeline remains source-driven | Potentially high through GLB or another validated transport | Not guaranteed; geometric drift risk |
| Visual quality ceiling | Good architectural preview; bounded by browser renderer | Potentially higher, but requires technical validation | High potential for controlled imagery | High visual style potential, not proof of geometry |
| Realtime capability | Yes | Yes, subject to browser support | Usually no or limited | Usually no deterministic realtime fidelity |
| Offline capability | No dedicated offline path | No dedicated offline path | Strong candidate | Service or local model dependent |
| Automation | Existing and low complexity | Medium to high complexity | Possible through scripting/headless execution | Possible but difficult to verify geometrically |
| GLB compatibility | Native through existing visual/export path | Likely, subject to validation | Strong candidate for transport evaluation | Input may be optional or indirect |
| Camera fidelity | Existing camera and saved-view state | Requires validation | Can be driven from saved-view transforms | Not reliable by default |
| Material capability | Presentation materials | Advanced browser materials/post-processing | Advanced materials and lighting | Style-dependent and non-deterministic |
| Image resolution | Browser/device limited | Browser/device limited | Strong high-resolution potential | Service/model dependent |
| Video capability | WebM through MediaRecorder | WebM or browser-supported output | Frame or animation pipeline possible | Not assumed |
| GPU requirement | Client GPU/WebGL | Client GPU/WebGL/WebGPU | Local or worker GPU/CPU dependent | Model/runtime dependent |
| Server feasibility | Existing Web deployment | Requires browser support | Requires worker or desktop/headless runtime | Requires model runtime or external service |
| Local feasibility | High | Medium | Potentially high for professional workstations | Depends on local model availability |
| Cost characteristics | Existing operating cost | Infrastructure and compatibility cost | Compute and storage cost | Model/service cost and governance cost |
| Open/proprietary | Open ecosystem | Open ecosystem with browser constraints | Open tooling candidate | Varies by model |
| Implementation complexity | Existing | Medium/high | High | High plus validation burden |
| Geometric drift risk | Low for direct source rendering | Low/medium if source-driven | Low/medium if transport validated | High unless separately verified |
| Professional role | Interactive design exploration | Future realtime enhancement | Potential presentation-quality output | Clearly labeled concept atmosphere |

## 7. Architecture options

### Option A — Web only

Keep all presentation in Three.js/R3F. This minimizes infrastructure and preserves immediate interaction. It is the simplest path, but the quality ceiling and capture resolution remain bounded by the browser and client hardware.

### Option B — Web plus offline renderer

Keep Web exploration and add an optional offline renderer that consumes a validated transport representation. This can provide higher-quality output while preserving the current workflow. It introduces worker execution, packaging, camera transfer, artifact storage and provenance requirements.

### Option C — Web plus generative presentation

Use the Web renderer for geometry-preserving views and add a separately labeled generative mode for atmosphere or style studies. This is useful for ideation but cannot be presented as geometrically verified rendering without a validation process.

### Option D — Hybrid

Combine Web realtime exploration, a geometry-preserving offline renderer and optional generative presentation. This is the most capable architecture, but also the most complex. It should be considered only after the transport, provenance and validation contracts are defined.

## 8. Technical recommendation

The recommended future direction is **Option D in stages**, beginning with the least irreversible step:

1. Continue using the current Web renderer for exploration and fast presentation.
2. Define a non-canonical `PresentationScene` contract.
3. Validate GLB as a massing transport using the existing exporter without modifying it in this order.
4. Prototype offline rendering locally against one canonical UPAO-001 alternative and one saved camera.
5. Compare source geometry, camera, dimensions and alternative identity before considering any deployment.
6. Add generative presentation only as an explicitly separate capability after geometric drift governance exists.

This is a technical recommendation, not an implementation authorization and not a paid-provider selection.

## 9. GLB and IFC assessment

### GLB

GLB is the more natural candidate for future visual transport because it is designed for 3D scene exchange and can carry mesh geometry, transforms and presentation-oriented data. The existing massing exporter should be tested for dimensions, transforms, units, camera handling and metadata preservation before it is used as a render transport.

```text
GLB_RENDER_TRANSPORT = PROMISING / REQUIRES TECHNICAL VALIDATION
```

No GLB exporter changes are authorized by this document.

### IFC

IFC remains a massing BIM exchange format in the current profile. It should not be assumed to be the default photorealistic rendering transport merely because Revit can consume IFC.

```text
IFC_RENDER_TRANSPORT = NOT_PRIMARY / MASSING_BIM_EXCHANGE
```

## 10. Local and cloud execution

### Local rendering

A local-first future path could package the canonical spatial representation, presentation settings and saved camera for a local rendering worker. This may improve privacy and use professional workstation hardware, but it adds packaging, installation, versioning and support complexity.

### Cloud rendering

A future cloud path could use:

```text
SiMS-DeI
        ↓
Render Job
        ↓
GPU Worker
        ↓
Artifact Storage
        ↓
Image / Video
```

It would require job control, storage, authentication, cost governance and infrastructure decisions. None of these are selected or implemented here.

## 11. Image, video and camera architecture

A future image pipeline should preserve:

```text
SavedView
        ↓
Camera Transform
        ├── Realtime Renderer
        └── High-quality Renderer
```

A future video pipeline may use:

```text
Saved Views
        ↓
Camera Path
        ↓
Renderer
        ↓
Frames
        ↓
Video
```

The camera path is documentation-only at this stage. The current Web recording remains WebM with microphone disabled by default.

## 12. Traceability

Every future high-quality render should record, at minimum:

- `project_id`;
- `alternative_id`;
- `SpatialRepresentation` version or hash when available;
- camera state;
- presentation profile;
- renderer and version;
- render settings;
- timestamp.

This traceability is required to know which design generated which image. The render remains presentation evidence, not evaluation or decision evidence.

## 13. Multiscale boundary

This P0 focuses primarily on `edificacion`, with possible future relevance to `objeto`, `espacio` and `parcela_sitio`. Architectural photorealism is not assumed to be the correct presentation model for:

- `region`;
- `macro_region`;
- `pais`.

Territorial visualization requires a separate visual profile with its own semantics.

## 14. Proposed Decision Lock

### DL-PHOTOREALISTIC-RENDERING-01 — DRAFT / OPEN_PENDING_PO_DECISION

1. Photorealism is a presentation capability, not design generation.
2. Photorealism is not canonical geometry.
3. Generative imagery is not a geometry-verified render.
4. Presentation materials are not BIM materials.
5. Presentation assets are not design geometry.
6. A render is not a simulation or decision.
7. One canonical design may have multiple presentation qualities.
8. Saved camera state should be reusable across realtime and future high-quality rendering.
9. `PHOTO_REALISTIC` remains `NOT_AVAILABLE` until a real pipeline is selected and validated.
10. Engine selection, external services and infrastructure require a separate Product Owner decision.

## 15. Required future decisions

The following decisions remain open:

1. Whether to authorize a local offline renderer evaluation.
2. Whether Blender or another open renderer should be tested.
3. Whether GLB is sufficient as the first render transport.
4. Whether a local worker or cloud worker is preferred.
5. Whether generative presentation should be included at all.
6. What geometric validation threshold is required before a render is called verified.
7. What image and video artifact retention policy should apply.

## 16. Final status

```text
STATUS = ARCHITECTURE_EVALUATION_COMPLETE
V2_PREREQUISITE_STATUS = PASS_WITH_OBSERVATIONS
CURRENT_REALTIME_RENDERER = Three.js / React Three Fiber
CURRENT_REALISTIC_CEILING = DEGRADED REALTIME ARCHITECTURAL PRESENTATION
PHOTO_REALISTIC_CURRENT_STATE = NOT_AVAILABLE
PRESENTATION_SCENE_MODEL = DOCUMENTED / FUTURE
DESIGN_PRESENTATION_SEPARATION = YES
GLB_RENDER_TRANSPORT_ASSESSMENT = PROMISING / REQUIRES TECHNICAL VALIDATION
IFC_RENDER_TRANSPORT_ASSESSMENT = MASSING BIM EXCHANGE / NOT PRIMARY
LOCAL_RENDER_ASSESSMENT = PROMISING / REQUIRES TECHNICAL VALIDATION
CLOUD_RENDER_ASSESSMENT = POSSIBLE / INFRASTRUCTURE DECISION REQUIRED
TECHNICAL_RECOMMENDATION = STAGED HYBRID, WEB-FIRST, GEOMETRY-PRESERVING
DL_PHOTOREALISTIC_RENDERING_01 = DRAFT / OPEN_PENDING_PO_DECISION
PRODUCT_CODE_CHANGED = NO
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
RENDER_ENGINE_INSTALLED = NO
PAID_SERVICE_USED = NO
FFO_ACTIVATED = NO
PUSH_EXECUTED = NO
DEPLOYMENT_EXECUTED = NO
```

## References

[1]: docs/ADAPTIVE_MULTISCALE_VISUAL_EXPERIENCE_FOUNDATION_V1.md "SiMS-DeI Adaptive Multiscale Visual Experience Foundation V1"
[2]: docs/MULTISCALE_INTEROPERABILITY_MATRIX_V1.md "SiMS-DeI Complete Canonical Multiscale Interoperability Matrix V1"
[3]: docs/VISUALIZATION_ENGINE.md "SiMS-DeI Visualization Engine"
[4]: docs/UPAO_001_SYNTHETIC_FIXTURE.json "UPAO-001 Synthetic Fixture"
