# ABB-001-F1C — Tooling Audit

## Result

`DWG_GEOMETRY_ACCESS_NOT_DEMONSTRATED` / `BLOCKED_BY_TOOLING`

The repository was audited before any derived representation was created. No `dwg2dxf`, `dwgread`, `dwg2svg`, QCAD, LibreCAD, ODA/Teigha converter or `ezdxf` executable/package was available. The project contains `web-ifc`, which is an IFC reader/writer and does not consume DWG.

## Source evidence

All five frozen DWGs have binary signature `AC1032`, consistent with AutoCAD 2018 format identification. This is metadata evidence only; it does not expose entities.

## Reuse decision

| Capability | Decision | Reason |
|---|---|---|
| Existing DWG reader | REUSE | None found |
| Existing IFC adapter | DO NOT USE FOR DWG | Different format and semantics |
| CAD intermediate representation | NOT CREATED | No extraction input available |
| New Geometry/BIM core | PROHIBITED | Outside F1C and contract firewall |
| Future adapter | DEFER | Small governed adapter may be proposed after deficit review |

## Consequence

F1C cannot demonstrate native or derived DWG geometry access in this environment. It records the deficit without repairing ARKI and without approximating CAD entities from PDF drawings.
