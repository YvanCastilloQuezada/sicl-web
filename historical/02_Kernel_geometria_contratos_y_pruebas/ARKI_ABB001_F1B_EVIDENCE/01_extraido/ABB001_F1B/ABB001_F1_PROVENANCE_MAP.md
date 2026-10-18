# ABB-001-F1 — Provenance and Traceability Map

| Source | Discipline | Primary sheet evidence | Candidate downstream use | Evidence state |
|---|---|---|---|---|
| `...UBICACION.dwg` | Site | U-01 | parcel, location, area table | NOT_IMPORTED |
| `...ARQUITECTURA.dwg` | Architecture | A-01, A-02 | levels, spaces, envelope, openings | NOT_IMPORTED |
| `ARQUITECTURA MODIFICADA.dwg` | Architecture revision | modified A-01/A-02 | comparison baseline and revision | NOT_IMPORTED |
| `...ESTRUCTURAS.dwg` | Structure | E-01, E-02, E-03 | structural members and foundation | NOT_IMPORTED |
| `...SANITARIAS ELECTRICAS.dwg` | MEP | IS-01..IS-04, IE-01..IE-02 | networks and terminals | NOT_IMPORTED |
| `PROY. FERNANDEZ ROJAS.pdf` | All | U-01 through IE-02 | visual evidence and fixtures | VERIFIED_READABLE |
| `ARQUITECTURA MODIFICADA.pdf` | Architecture revision | modified A-01/A-02 | visual comparison | VERIFIED_READABLE |

## Provenance identifiers

- `ABB001-SF-V1` — Source Freeze V1.
- `ABB001-U01` — location and site sheet.
- `ABB001-A01`, `ABB001-A02` — architecture sheets.
- `ABB001-E01`, `ABB001-E02`, `ABB001-E03` — structural sheets.
- `ABB001-IS01` through `ABB001-IS04` — plumbing sheets.
- `ABB001-IE01`, `ABB001-IE02` — electrical sheets.

## Authority rule

PDF review establishes documentary evidence only. DWG remains the intended geometry authority when and if a governed adapter is executed and its output is independently checked. No sheet is promoted to canonical project state by this report.

## Revision note

The modified architecture PDF is retained as a distinct revision source. It must not overwrite the base architecture source. Any future comparison must report additions, deletions, moves and unresolved differences.

**STOP F1.**
