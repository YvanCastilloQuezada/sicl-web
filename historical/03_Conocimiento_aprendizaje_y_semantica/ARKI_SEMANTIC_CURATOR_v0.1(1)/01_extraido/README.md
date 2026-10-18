# ARKI Semantic Curator v0.1 — starter

Status: **PROPOSAL / STARTER CODE — NOT INTEGRATED — NOT CANONICAL**

This package is intentionally small. It creates the semantic governance boundary before the future enterprise/IFC work expands the model.

## What it does

- Defines a versioned ARKI semantic concept contract.
- Defines multiscale applicability.
- Defines external mappings (IFC 4.3 ADD2, bSDD, IDS, Revit, CAD/ACIR, GIS, gbXML).
- Preserves ARKI-owned identity separately from external IDs.
- Detects duplicate canonical names, alias collisions, and exact external mapping collisions.
- Refuses autonomous semantic canonization: curator review always returns `canonicalMutation: false`.
- Rejects promotion of an `UNKNOWN` candidate into a canonical definition.
- Provides a deliberately tiny IFC 4.3 starter seed for Project/Site/Building/Space/Wall/Door.

## What it deliberately does NOT do

- It does not replace `CanonicalProjectRepository`.
- It does not write canonical Project State.
- It does not bypass BKH4 transactions.
- It does not modify `ProjectContext`, `constructionModel`, `SceneModel`, CAD/ACIR, IFC exporters, or legacy writers.
- It does not claim a complete IFC schema implementation.
- It does not promote CAD geometry into BIM semantics.
- It does not make professional decisions.
- It does not treat IFC as ARKI's world model.

## Required integration rule

Semantic changes must eventually follow:

`PROPOSE → CURATOR REVIEW → HUMAN AUTHORITY (where required) → VALIDATED TRANSACTION → DURABLE COMMIT → CANONICAL REVISION → PROJECTION`

Until TX-005/global writer migration is completed, do not create a second canonical writer.

## IFC baseline

Starter mappings target IFC 4.3 ADD2 / 4.3.2.0 as the reference mapping baseline. The mapping layer is versioned so future schemas can coexist.

## Recommended next implementation slice

1. Audit existing `CanonicalBuildingModel`, `arkiBuildingAuthoring.ts`, CAD/ACIR semantic types, IFC code, and Project State contracts.
2. Produce `ARKI ↔ IFC4.3 SEMANTIC ALIGNMENT MATRIX`.
3. Replace the starter seed only with mappings proven against the actual repository and authoritative IFC schema.
4. Integrate semantic proposals into the existing transaction engine; never direct-write canonical state.
5. Add mutation tests: duplicate concept, alias collision, scale leak, missing provenance, UNKNOWN promotion, CAD candidate→fact, external identity collision, IFC version mismatch.
