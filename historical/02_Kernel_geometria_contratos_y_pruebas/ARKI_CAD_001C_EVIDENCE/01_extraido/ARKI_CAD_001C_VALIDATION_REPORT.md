# ARKI-CAD-001C — Validation Report

## Validation summary

| Check | Result | Evidence |
|---|---|---|
| `pnpm check` | PASS | TypeScript no emit completed successfully |
| `pnpm build` | PASS | Vite and server bundle completed successfully |
| CAD Gateway synthetic harness | PASS | 10 independent assertions in `scripts/test-arki-cad-gateway.ts` |
| IFC regression | PASS | exporter, fixtures, GlobalId and web-ifc tests all exited 0 |
| Commercial provider runtime | BLOCKED | License/access evidence not available and no SDK loaded |
| `CAD_GEOMETRY_READY` | NO | No real authorized CAD file was parsed |

## CAD-T01…T10 status

| Case | Status | Reason |
|---|---|---|
| CAD-T01 simple 2D DWG | NOT_EXECUTED | No real reader runtime |
| CAD-T02 complex layers | NOT_EXECUTED | No real reader runtime |
| CAD-T03 blocks and attributes | NOT_EXECUTED | No real reader runtime |
| CAD-T04 dimensions and text | NOT_EXECUTED | No real reader runtime |
| CAD-T05 external references | NOT_EXECUTED | No real reader runtime |
| CAD-T06 splines, hatches and curves | NOT_EXECUTED | No real reader runtime |
| CAD-T07 CAD 3D | NOT_EXECUTED | No real reader runtime |
| CAD-T08 legacy DWG | NOT_EXECUTED | No real reader runtime |
| CAD-T09 damaged/partial file | BLOCKED / SYNTHETIC ONLY | Corrupted-source behavior was tested synthetically; no real damaged file was authorized |
| CAD-T10 professional authorized file | BLOCKED | No authorized professional CAD source supplied |

## Gates

`TECHNOLOGY_SELECTED != IMPLEMENTED` remains enforced.  
`IMPLEMENTED != VERIFIED` remains enforced.  
`FILE_OPENED != GEOMETRY_VERIFIED` remains enforced.  
`GEOMETRY_VERIFIED != BIM_VERIFIED` remains enforced.

The synthetic adapter is not evidence of DWG/DXF geometry capability. It exists only to verify the Gateway, ACIR, diagnostics, provenance, deterministic serialization, and semantic firewall.
