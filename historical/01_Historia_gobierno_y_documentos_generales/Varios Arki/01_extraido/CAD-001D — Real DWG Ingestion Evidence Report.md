# CAD-001D — Real DWG Ingestion Evidence Report

**Scope:** ingest the real ABB-001 architectural DWG through the compiled LibreDWG `dwg2SVG` reader and map the resulting SVG entities into the existing ACIR contract.

## Result

CAD-001D is **PASS for bounded ingestion evidence**. The test executed against the real file `PROY. FERNANDEZ ROJAS - ARQUITECTURA.dwg`, generated SVG twice, confirmed deterministic output, mapped 7,447 SVG entities into ACIR, and validated the resulting document with `validateAcirDocument`.

The result does **not** claim complete DWG fidelity, exact BIM semantics, or production CAD round-trip. ACIR entities remain `UNKNOWN_CAD_FACT`, and `semanticPromotion` remains `PROHIBITED`.

## Evidence

| Check | Observed result |
| --- | --- |
| Source format | DWG |
| Declared source version | AC1032 / AutoCAD 2018 |
| Reader | LibreDWG `dwg2SVG` |
| Reader version | `dwg2SVG 0.14.8597` |
| Source SHA-256 | `e7e0f1bcaefe0b0cf7d845339e6d30178a0792b40d1500c67692485286acbbc9` |
| ACIR entities | 7,447 |
| Source handles preserved | 7,447 |
| ACIR layers | 1 (`MODELSPACE`) |
| Deterministic repeated read | PASS |
| ACIR validation | PASS |
| Provenance preservation | PASS |
| Semantic promotion | PROHIBITED |
| Exact CAD/BIM fidelity | NOT FULLY VERIFIED |

LibreDWG reported unsupported entity classes such as dimensions, MTEXT, and HATCH to stderr. Those messages are retained as raw evidence and are not silently converted into BIM facts.

## Scope boundary

This delivery proves **real-source ingestion into ACIR**, not a complete CAD adapter. It does not implement ODA Drawings SDK integration, semantic wall/door/window recognition, exact unit recovery, coordinate-system recovery, block-definition reconstruction, IFC export, or DWG round-trip writing.

The prior `ContextPanel.tsx` “missing semicolon” diagnostic is not reproducible in the current worktree: the file contains a valid terminating semicolon, `pnpm check` passes, and the production build passes. No unnecessary UI change was made.

## Verdict

**CAD-001D — VERIFIED FOR BOUNDED REAL-DWG INGESTION / ACIR MAPPING.**

This verdict is intentionally narrower than “full CAD interoperability.”

## References

[1]: `shared/arkiCadGateway.ts` "ARKI CAD Gateway and ACIR contract"
[2]: `scripts/test-arki-cad-real-reader.ts` "CAD-001D real DWG reader integration test"
[3]: `ARKI_ABB001_SOURCE_FREEZE_V1/extracted/EXPEDIENTE COMPLETO/PLANOS AUTOCAD/PROY. FERNANDEZ ROJAS - ARQUITECTURA.dwg` "ABB-001 frozen architectural DWG source"
