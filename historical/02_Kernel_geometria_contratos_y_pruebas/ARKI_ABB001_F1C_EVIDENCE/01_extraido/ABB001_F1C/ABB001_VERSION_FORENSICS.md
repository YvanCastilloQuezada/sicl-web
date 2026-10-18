# ABB-001 — Version Forensics

**Scope:** documentary comparison only.  
**Sources:** `PROY. FERNANDEZ ROJAS.pdf` pages 2–3 and `ARQUITECTURA MODIFICADA.pdf` pages 1–2, plus corresponding DWG names in the frozen source.  
**Status:** `DOCUMENTARY COMPARISON / NO GOVERNING VERSION ESTABLISHED`

## Method

The comparison uses extracted PDF text, sheet titles, levels, labels, dimensions and visible annotations. It does not compare DWG entities because no governed DWG reader was executed. A textual or visual difference is not automatically a geometric difference.

## Demonstrable observations

| Finding | Location | Classification | Evidence | Epistemic status |
|---|---|---|---|---|
| Both sets contain four architectural plan views: first floor, second floor, roof terrace and roof | Base A-01 p.2; modified A 01 p.1 | UNCHANGED | Same sheet title and plan set | DOCUMENTED |
| Both sets show the principal level family +0.00/+0.15, +3.15, +6.15 and +9.15 | Base A-01/A-02 pp.2–3; modified p.1–2 | UNCHANGED | Repeated N.P.T. labels | DOCUMENTED; not CAD-verified |
| Modified set uses `A 01` in the extracted title while base uses `A-01` | Base p.2; modified p.1 | MODIFIED | Title-block text | DOCUMENTED; may be formatting only |
| Modified page includes labels `M-1`, `V-9` and `V-10` in the plan graphics | Modified p.1 | ADDED OR EXPOSED | Visible extracted annotations | DOCUMENTED in modified source; correspondence to a base absence is not fully proven |
| Base architecture identifies `DORMITORIO 01`; modified extraction identifies `DORMITORIO` | Base p.2; modified p.1 | MODIFIED / UNKNOWN | Room-label text | Documentary label change; geometric change unknown |
| Base extraction includes `JARDIN N.P.T.+0.10`; modified extraction does not expose that exact label | Base p.2; modified p.1 | REMOVED OR NOT_VISIBLE | Extracted text | Cannot distinguish deletion from plotting/text extraction difference |
| Modified set exposes `BALCÓN N.P.T.+3.15` and dimensions 1.75 in plan text | Modified p.1; base p.2 contains balcony-related dimensions/labels in a different extraction arrangement | MODIFIED / UNKNOWN | Plan annotations | Exact geometric delta unknown |
| Modified elevation page exposes N.P.T.+7.35 and +6.40; base page exposes N.P.T.+7.15 and +6.15 in corresponding elevation text | Base A-02 p.3; modified A 02 p.2 | POSSIBLE MODIFIED | Elevation labels | Requires CAD or controlled overlay to determine whether these are different elements, annotations or extraction artifacts |
| Both sets show architecture, two floors, azotea/roof and fence/elevation content | Base A-01/A-02; modified A 01/A 02 | UNCHANGED | Sheet titles and visible labels | DOCUMENTED |

## Governing-version determination

No explicit revision table, revision number, revision cloud, approval signature, issue date tied to supersession, or transmittal instruction was identified in the reviewed PDF evidence. The word **MODIFICADA** identifies a file/title description, not an authoritative supersession rule.

**Conclusion:** documentary evidence does **not** establish that the modified architecture governs the base architecture. The governing version is `UNKNOWN` and requires customer/project-authority clarification, followed by professional review if the difference affects design or construction.

## Required clarification

The project authority must identify whether the modified architecture is an approved revision, its effective date, and whether structural, sanitary and electrical sheets were updated consistently. Until then, both architectural sets remain preserved as separate source revisions.

**STOP F1B.**
