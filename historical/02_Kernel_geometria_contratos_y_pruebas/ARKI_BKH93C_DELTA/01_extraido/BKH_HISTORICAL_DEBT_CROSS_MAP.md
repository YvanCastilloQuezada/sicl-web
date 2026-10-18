# BKH Historical Debt Cross-Map — Suplemento 93A-H

**Scope:** evidencia y clasificación únicamente. No reabre E5/E6/E7 ni completa funcionalmente esas entregas.

## Resumen reconciliado

| Clasificación | Cantidad |
|---|---:|
| TEST_NOW | 5 |
| CLOSE_IF_PROVEN | 3 |
| DEFER_TO_ORIGINAL_PHASE | 7 |
| ARCHITECTURAL_DECISION_REQUIRED | 4 |
| SUPERSEDED_BY_VERIFIED_CAPABILITY | 1 |
| **Total** | **20** |

## Cross-map

| ID | Origin | Description | Affected current invariant | BKH relevance | Current evidence | Current status | Action |
|---|---|---|---|---|---|---|---|
| E5-DEBT-01 | E5 | Ocho capturas obligatorias | Evidence integrity | Alta: no captura retroactiva válida | No evidencia histórica completa | Open | DEFER_TO_ORIGINAL_PHASE |
| E5-DEBT-02 | E5 | E5_MANIFEST.json | Manifest accuracy | Alta: integridad de evidencia | Manifest histórico separado; no prueba E5 | Open | CLOSE_IF_PROVEN |
| E5-DEBT-03 | E5 | E5_SCOPE_LIMITS.md | Scope firewall | Media | Documento histórico disponible | Open | DEFER_TO_ORIGINAL_PHASE |
| E5-DEBT-04 | E5 | E5_OUTPUTS.txt crudo | Raw evidence | Alta | Outputs históricos parciales | Open | CLOSE_IF_PROVEN |
| E5-DEBT-05 | E5 | Controles independientes de comparación | Deterministic derived views | Baja para BKH-0–3 | UI de comparación existe; control independiente no es BKH kernel | Open | DEFER_TO_ORIGINAL_PHASE |
| E5-DEBT-06 | E5 | Nomenclatura de clipping | No invariant BKH directo | Baja | Naming/UI concern | Open | DEFER_TO_ORIGINAL_PHASE |
| E5-DEBT-07 | E5 | Nomenclatura de snap | No invariant BKH directo | Baja | Naming/UI concern | Open | DEFER_TO_ORIGINAL_PHASE |
| E5-DEBT-08 | E5 | Clipping geométrico profesional | Geometry authority | Alta pero fuera del kernel cerrado | No solver profesional demostrado | Open | ARCHITECTURAL_DECISION_REQUIRED |
| E5-DEBT-09 | E5 | Snapping profesional | Geometry/constraint boundary | Alta pero fuera del kernel cerrado | No snapping profesional demostrado | Open | ARCHITECTURAL_DECISION_REQUIRED |
| E6-DEBT-01 | E6 | Restauración de snapshot tras reinicio | Persistence/version provenance | Alta | API/contrato; evidencia browser pendiente | Test now | TEST_NOW |
| E6-DEBT-02 | E6 | Persistencia y restauración de viewpoints | Persistence/derived representation | Alta | Test de viewpoints local; browser reload formal pendiente | Test now | TEST_NOW |
| E6-DEBT-03 | E6 | Geometría IFC completa | IFC semantic fidelity | Alta | IFC4 adapter parcial y fixtures | Open | ARCHITECTURAL_DECISION_REQUIRED |
| E6-DEBT-04 | E6 | Materiales IFC completos | IFC property fidelity | Media/alta | No round-trip productivo completo | Open | DEFER_TO_ORIGINAL_PHASE |
| E6-DEBT-05 | E6 | Relaciones IFC completas | Relationship authority | Alta | Adapter parcial; BKH-1 relationship core separado | Open | ARCHITECTURAL_DECISION_REQUIRED |
| E6-DEBT-06 | E6 | Propiedades IFC completas | Semantic identity/properties | Alta | Fixtures y exporter bounded | Close candidate | CLOSE_IF_PROVEN |
| E6-DEBT-07 | E6 | lossReport productivo | Loss visibility | Alta | Debe probarse en adapters existentes; no hay nuevo subsystem | Test now | TEST_NOW |
| E7-DEBT-01 | E7 | PriceBook/APU catálogo corporativo completo | Quantity/cost ownership | Media; no pertenece al kernel transversal | Contratos 5D bounded | SUPERSEDED_BY_VERIFIED_CAPABILITY |
| E7-DEBT-02 | E7 | Recursos y desarrollo completo 4D | Schedule ownership | Media; capacidad funcional E7 pendiente | 4D bounded con ruta crítica | DEFER_TO_ORIGINAL_PHASE |
| E7-DEBT-03 | E7 | Estados persistentes y revisión visual de clashes | Derived-state persistence/provenance | Alta | Clash volumétrico existe; persistencia/reload pendiente | Test now | TEST_NOW |
| E7-DEBT-04 | E7 | Límites visibles de Structural/MEP adapters | Professional-computation firewall | Alta | Structural NOT_DEMONSTRATED; MEP VERIFIED bounded/topological | Test now | TEST_NOW |

## Regla aplicada

`SUPERSEDED_BY_VERIFIED_CAPABILITY` no significa que la fase original esté VERIFIED. Sólo registra que la capacidad bounded equivalente está demostrada por una prueba actual y enlazable. En particular, E7-DEBT-01 queda superseded únicamente en su núcleo mínimo 5D/PriceBook; el catálogo corporativo y APU completo permanecen deuda funcional fuera de BKH.

No se eliminó ninguna deuda. Las deudas no cerradas permanecen deferidas, requieren decisión arquitectónica o deben volver a su fase original.
