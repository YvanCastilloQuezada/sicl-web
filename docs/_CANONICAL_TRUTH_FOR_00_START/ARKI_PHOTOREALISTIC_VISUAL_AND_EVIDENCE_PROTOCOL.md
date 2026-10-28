# ARKI Photorealistic Visual and Evidence Protocol 1.0

## Photorealistic generation

ARKI now exposes server-side visual generation for exterior renders, interior renders, material studies, site context and AR overlays. The user may request **Full HD** or **4K UHD**. Full HD targets 1920 × 1080 and 4K targets 3840 × 2160. The provider receives a high-quality request, but the response is explicitly marked `providerResolutionVerified: false` until the returned file dimensions are checked.

A render is a visual proposal. It is not a survey, a measured drawing, a structural analysis, a code certificate or evidence that an unobserved material or room exists.

## Photorealistic AR

The existing AR path is extended conceptually through a visual capability contract. It can use a reference render or canonical representation over the live camera, two-stake calibration, geospatial anchoring and optional WebXR. The current device still determines camera quality, depth sensing, occlusion, tracking and native WebXR support. Those conditions remain visible to the user instead of being simulated as certainty.

## Super eyes: bounded vision

ARKI's visual field accepts camera images, architectural photographs, plans, scanned documents, OCR and urban-parameter documents. Every observation is provisional and must carry an evidence class:

| Evidence class | Meaning |
| --- | --- |
| `VISIBLE_IN_IMAGE` | Directly visible in the image. |
| `LEGIBLE_TEXT` | Text legible enough to transcribe provisionally. |
| `MEASURED_METADATA` | Supplied or measured metadata, not inferred from appearance. |
| `NOT_OBSERVED` | Not visible, not legible or insufficiently supported. |

Unsupported claims are forced to `UNKNOWN`, with low confidence and mandatory human review. The system is designed not to present an inference as a fact. Absolute elimination of model error cannot be promised; the enforceable guarantee is that unsupported observations are not promoted as verified facts by the visual contract.

## Controls

- `AI_PROPOSED_VISUAL` for generated images.
- `providerResolutionVerified: false` until dimensions are verified.
- `humanReviewRequired: true` for generated visuals and vision observations.
- `UNKNOWN` whenever the image does not support a claim.
- No automatic legal, structural, ownership, dimensional or permitting conclusions from an image.


## Quality presets update

ARKI now exposes four selectable target presets through `VISUAL_PRESETS` and `visualGeneration.generate`:

| Preset | Target dimensions | Meaning |
|---|---:|---|
| `HD` | 1280 × 720 | Preview and lightweight review |
| `2K` | 2560 × 1440 | High-detail review |
| `FULL_HD` | 1920 × 1080 | Standard presentation output |
| `4K` | 3840 × 2160 | High-resolution presentation target |

The target dimensions are requested output contracts. `providerResolutionVerified = false` remains mandatory because the image provider may return a different native size. A generated render is therefore `AI_PROPOSED_VISUAL`, not proof of geometry, dimensions, code compliance or construction quality.
