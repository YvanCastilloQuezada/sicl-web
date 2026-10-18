# ARKI Advanced Geometry and Jurisdiction 1.0

## Advanced geometry

ARKI now includes a deterministic parametric geometry layer capable of generating non-conventional conceptual forms such as twisted towers, folded courtyards and branching/custum parametric families. Each result carries vertices, faces, levels, plan segments, parameters, constraints, UNKNOWNs and provenance-ready identifiers.

The geometry layer is deliberately separated from professional certification. Structural feasibility, fire egress, accessibility, daylight, ventilation, setbacks, height limits, constructability and cost must be checked before any project claim is promoted.

## Plan representation

The plan sheet layer projects each level into legible segments for walls, openings, circulation and annotations. It supports multi-level comparison and a higher representation quality than a raw geometry dump. It remains `HIGH_REPRESENTATION_CONCEPTUAL` until dimensions, symbols, north, scale, discipline coordination and local documentation standards are verified.

## Country and jurisdiction regulations

ARKI now has a regulation-source registry. A project country resolves to an official authority URL, retrieval date, jurisdiction and review status. For Peru, the initial official source is the Ministry of Housing, Construction and Sanitation page for the Reglamento Nacional de Edificaciones (RNE): <https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne>.

The registry intentionally does not invent clauses. It returns `SOURCE_READY_REVIEW_REQUIRED`, preserves current-clause and local-amendment UNKNOWNs, and requires a licensed local professional to verify the applicable code version and project-specific requirements. Countries without an official source in the registry return `NO_OFFICIAL_SOURCE_REGISTERED`.

## Boundary

Internet retrieval can improve source access and update awareness. It does not turn ARKI into a permitting authority, code certifier, structural engineer or architect of record. The final compliance decision remains human and jurisdiction-specific.
