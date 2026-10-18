# ABB-001-F1 — Semantic Inventory

## Estado

`DOCUMENTARY INVENTORY / BOUNDED / NOT A BIM MODEL`

## 1. Disciplinas y hojas

| Discipline | Sheets | Semantic evidence |
|---|---|---|
| Site | U-01 | lot, street, urban context, normative table, areas |
| Architecture | A-01, A-02 | levels, rooms, walls, doors, windows, stairs, roof, elevations, sections |
| Structure | E-01, E-02, E-03 | foundations, columns, beams, slabs, confined masonry, stairs, cistern |
| Plumbing | IS-01..IS-04 | drainage, rainwater, cold/hot water, fixtures, tanks, vents |
| Electrical | IE-01, IE-02 | lighting, outlets, panels, grounding, communications, air-conditioning circuits |

## 2. Candidate semantic entities

| Class | Observed evidence | Reconstruction status |
|---|---|---|
| Site / parcel | U-01, 7 m frontage, 140 m² | DOCUMENTED |
| Level | first floor, second floor, rooftop, roof | DOCUMENTED |
| Space | sala, comedor, cocina, dormitorios, baños, recibo, cochera, terraza, balcón, lavandería/tendal, cuarto de planchado, escritorio, azotea | DOCUMENTED |
| Wall / masonry | architectural plans and E-01/E-02 details | DOCUMENTED; geometry not imported |
| Door | A-02 door schedule and plan symbols | DOCUMENTED |
| Window | A-02 window schedule and plan symbols | DOCUMENTED |
| Mampara | A-02 mampara schedule | DOCUMENTED |
| Stair | A-02 and E-03 typical stair detail | DOCUMENTED |
| Roof / slab | A-01, E-02, E-03 | DOCUMENTED |
| Column / beam | E-01..E-03 | DOCUMENTED |
| Foundation | E-01 | DOCUMENTED |
| Cistern / elevated tank | E-03, IS-01..IS-04 | DOCUMENTED |
| Plumbing network | IS-01..IS-04 | DOCUMENTED |
| Electrical network | IE-01..IE-02 | DOCUMENTED |
| Furniture symbols | A-01/A-02 | REFERENCE GRAPHICS; not canonical objects |

## 3. Provenance rule for F2

Every reconstructed entity must carry: `sourceFile`, `sheetCode`, `sourcePage`, `sourceRegion`, `extractionMethod`, `confidence`, and `epistemicStatus`. A visual observation from PDF cannot be silently promoted to exact CAD geometry.

## 4. Required reconciliation checks

1. Architecture levels and structural levels must match.
2. Openings in architecture must reconcile with structural walls and lintel conditions.
3. Plumbing fixtures must reconcile with architectural bathrooms and kitchen.
4. Electrical points must reconcile with rooms and equipment.
5. Cistern, elevated tank and pump must reconcile across structural, plumbing and electrical sheets.
6. Door/window/mampara schedules must reconcile with plan symbols.
7. Any unresolved discrepancy remains visible as `UNKNOWN`, `CONFLICTING` or `NOT_DEMONSTRATED`.

## 5. Explicit non-claims

This inventory does not claim: imported DWG geometry, generated IFC, verified quantities, professional structural design, code compliance certification, constructability approval, or a persisted canonical BIM snapshot.

**STOP F1.**
