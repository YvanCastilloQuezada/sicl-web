# SiMS-DeI — Geometry-Preserving Render Transport P0.1

**Status:** PASS_WITH_OBSERVATIONS  
**Source:** `SpatialRepresentation`  
**Transport:** GLB  
**Target:** Independent numeric glTF/GLB readback  
**Alternatives:** `UPAO-001-A`, `UPAO-001-B`, `UPAO-001-C`

## 1. Scope

This proof evaluates the existing GLB massing exporter. It does not implement photorealism, select a rendering engine, modify the Core, expand BIM semantics, or change the exporter. The proof uses the canonical massing-only representation and reads the generated GLB through an independent parser implemented in `scripts/glb_transport_proof.ts`, rather than trusting the exporter’s own internal data structures after serialization.

The test script generates three physical GLB files in the temporary workspace and reads their GLB header, JSON chunk, binary buffer, nodes, accessors and vertex positions independently.

## 2. Result summary

| Alternative | Source masses | Exported nodes/masses | Source dimensions (m) | Readback dimensions after inverse axis mapping (m) | Max position deviation (m) | Max dimension deviation (m) | Max height deviation (m) |
|---|---:|---:|---|---|---:|---:|---:|
| `UPAO-001-A` | 1 | 1 | `[24, 16, 16]` | `[24, 16, 16]` | `0` | `0` | `0` |
| `UPAO-001-B` | 4 | 4 | `[44, 24, 12.8]` | `[44, 24, 12.800000190734863]` | `0` | `1.9073486257070726e-7` | `1.9073486257070726e-7` |
| `UPAO-001-C` | 2 | 2 | `[44, 18, 9.6]` | `[44, 18, 9.600000381469727]` | `0` | `3.8146972691777137e-7` | `3.8146972691777137e-7` |

The deviations are consistent with Float32 serialization precision. No position, dimension, height, scale or rotation drift was detected beyond that precision.

## 3. Bounding boxes

### `UPAO-001-A`

```text
SOURCE_BOUNDING_BOX = min [10, 8, 0], max [34, 24, 16]
EXPORTED_BOUNDING_BOX_AFTER_INVERSE_AXIS_MAPPING = min [10, 8, 0], max [34, 24, 16]
```

### `UPAO-001-B`

```text
SOURCE_BOUNDING_BOX = min [8, 6, 0], max [52, 30, 12.8]
EXPORTED_BOUNDING_BOX_AFTER_INVERSE_AXIS_MAPPING = min [8, 6, 0], max [52, 30, 12.800000190734863]
```

The four exported masses preserve the courtyard/void arrangement. The void is not exported as a separate solid; it is preserved as the spatial relationship between the four mass footprints.

### `UPAO-001-C`

```text
SOURCE_BOUNDING_BOX = min [8, 8, 0], max [52, 26, 9.6]
EXPORTED_BOUNDING_BOX_AFTER_INVERSE_AXIS_MAPPING = min [8, 8, 0], max [52, 26, 9.600000381469727]
```

The two separated masses preserve their relative placement and vertical offset.

## 4. Units and coordinate system

```text
SOURCE_UNIT = meter (m)
GLB_UNIT_BEHAVIOR = glTF numeric scene units; the exporter encodes source meters without a scale transform
TARGET_UNIT_INTERPRETATION = one GLB scene unit is interpreted as one source meter for this proof
```

The source architectural convention is local ENU:

```text
LOCAL_ENU = [x east, y north, z up]
```

The exporter writes positions as:

```text
GLB / Three position = [x, z, -y]
```

The independent readback applied the inverse mapping:

```text
readback source coordinates = [glb_x, -glb_z, glb_y]
```

After that inverse mapping, the bounding boxes and dimensions match the source. No geographic or GIS transformation was added. `LOCAL_ENU` remains the design-space concept.

```text
AXIS_MAPPING = [x, y, z]LOCAL_ENU → [x, z, -y]GLB
ORIENTATION_PRESERVED = YES
SCALE_PRESERVED = YES
```

## 5. Mass relationships

```text
A_MASS_RELATIONSHIP_PRESERVED = YES
B_COURTYARD_VOID_PRESERVED = YES
C_SEPARATED_MASSES_PRESERVED = YES
```

The proof exports building masses only. Site boundaries, zones and circulation elements are not included in the current GLB massing exporter. This is an observation about exporter scope, not a geometry failure for the authorized `MASSING_ONLY` profile.

## 6. Metadata and camera

The generated GLB JSON `extras` preserve:

```json
{
  "project_id": "UPAO-001",
  "alternative_id": "UPAO-001-A|UPAO-001-B|UPAO-001-C",
  "provenance": "SiMS-DeI SpatialRepresentation"
}
```

```text
PROJECT_ID_TRANSPORT = YES
ALTERNATIVE_ID_TRANSPORT = YES
REPRESENTATION_VERSION_TRANSPORT = NO
INPUT_FINGERPRINT_TRANSPORT = NO
CAMERA_EXPORTED = NO
```

The missing camera is not a geometry transport failure. A future camera contract should use:

```text
SavedView → RenderCamera
```

and preserve camera transform independently from the canonical geometry transport.

## 7. Geometry and presentation materials

```text
GEOMETRY_TRANSPORT = PASS
PRESENTATION_MATERIAL_TRANSPORT = NOT_PRESENT / NOT_REQUIRED FOR THIS PROOF
```

The GLB contains geometry, nodes and source metadata. The proof did not add materials, context, vegetation, people, furniture, walls, doors, windows, slabs, roofs or construction semantics.

## 8. Independent readback

```text
INDEPENDENT_READBACK = YES
```

The readback parser validated the GLB container, JSON chunk, binary chunk, scene nodes, position accessor and bounding data independently of the serializer’s in-memory representation.

A full external visual roundtrip using a separate viewer was not required to establish the numerical result. The existing Spatial Pilot already provides the Web rendering path; this proof’s primary purpose was to detect transport drift numerically.

```text
VISUAL_ROUNDTRIP = NOT_EXECUTED AS AN INDEPENDENT VIEWER STEP
```

## 9. Failure classification

```text
UNIT_LOSS = NO
AXIS_MISMATCH = NO AFTER DOCUMENTED INVERSE MAPPING
TRANSFORM_LOSS = NO
GEOMETRY_LOSS = NO
MULTI_MASS_LOSS = NO
METADATA_LOSS = PARTIAL
CAMERA_NOT_TRANSPORTED = YES / OBSERVATION
OTHER = NONE
```

The metadata observation concerns representation version and input fingerprint. It does not affect the massing geometry result. Camera absence is also an observation and does not affect geometry transport.

## 10. Proposed transport profile

```text
GLB_RENDER_TRANSPORT_PROFILE_V1 = PROPOSED
```

Minimum contract:

```text
SOURCE = SpatialRepresentation
CONTENT = MASSING_ONLY
GEOMETRY_FIDELITY = REQUIRED
UNITS = EXPLICITLY_VALIDATED
TRANSFORMS = PRESERVED
CANONICAL_GEOMETRY_MUTATION = NO
```

This profile must not be interpreted as construction BIM, native Revit, or photorealistic rendering. It is a geometry-preserving massing transport toward a future compatible presentation pipeline.

## 11. Gate result

```text
GLB_GEOMETRY_TRANSPORT = PASS_WITH_OBSERVATIONS
PHOTOREALISTIC_RENDER_PIPELINE_P1_READY = YES
```

`P1_READY` means that the geometry transport proof did not block future technical evaluation. It does not authorize a renderer, Blender integration, WebGPU implementation, paid service, photorealistic engine, Core change, push or deployment.

## 12. Governance

```text
CURRENT_GLB_EXPORTER_CHANGED = NO
IFC_CHANGED = NO
DXF_CHANGED = NO
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
PHOTO_REALISTIC_IMPLEMENTED = NO
RENDER_ENGINE_SELECTED = NO
BLENDER_INTEGRATION = NO
FFO_ACTIVATED = NO
PUSH_EXECUTED = NO
DEPLOYMENT_EXECUTED = NO
```

## References

[1]: docs/PHOTOREALISTIC_RENDERING_ARCHITECTURE_P0.md "SiMS-DeI Photorealistic Rendering Architecture P0"
[2]: docs/ADAPTIVE_MULTISCALE_VISUAL_EXPERIENCE_FOUNDATION_V1.md "SiMS-DeI Adaptive Multiscale Visual Experience Foundation V1"
[3]: docs/VISUALIZATION_ENGINE.md "SiMS-DeI Visualization Engine"
