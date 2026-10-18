# ARKI-CAD-001A — Recommendation

## Allowed verdict

**`MORE_EVIDENCE_REQUIRED`**

## Provisional technical recommendation

Use **ODA Drawings SDK as the primary candidate for the next controlled benchmark**, because the official product documentation aligns most closely with ARKI's target: native DWG/DXF access, layers, objects, layouts, coordinates, 2D/3D, Linux/Windows paths and a broader cloud ecosystem.

Use **LibreDWG as an open-source reading/security baseline**, not as the production fidelity authority. Its official manual reports broad R2018 reading but incomplete modern writing and unstable/undertested object classes.

Use **RealDWG as a possible validation oracle** only if Human Authority approves a Windows 64-bit worker and the vendor contract explicitly authorizes the intended deployment. Its native Autodesk fidelity is valuable, but its published platform and server restrictions conflict with a straightforward Linux-first ARKI service.

Use **ODA File Converter only as a diagnostic black-box baseline**, and only under an allowed non-commercial benchmark category.

## Why no final adapter recommendation

No candidate has yet been run against the five ABB-001 DWGs. Therefore no evidence exists for entity counts, handles, layers, blocks, dimensions, text, layouts, units, coordinates, extents, visual fidelity or DXF loss. A technical selection without that benchmark would be an unsupported product decision.

## Required decision before 001B

Human Authority must approve the benchmark environment and the commercial/legal category. Then ARKI-CAD-001B may implement only the selected adapter test harness and ACIR extraction boundary.
