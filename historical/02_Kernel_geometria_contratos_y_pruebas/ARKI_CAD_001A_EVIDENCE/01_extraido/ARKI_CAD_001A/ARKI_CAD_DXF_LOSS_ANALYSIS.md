# ARKI CAD — DXF Intermediate Loss Analysis

## Status

`NOT_EXECUTED`.

No candidate runtime was installed or authorized, so neither `DWG → DXF → ACIR` nor `DWG → direct extraction → ACIR` was performed.

## Required loss ledger

The future benchmark must compare, at minimum, entity type and count, handles/identity, layers, blocks/inserts/attributes, dimensions, text/MTEXT, XREFs, layouts, units, coordinates, extents, 2D/3D geometry, proxy/custom objects, associative behavior, styles/materials, metadata and audit changes.

DXF must not be treated as a lossless intermediate by assumption. A conversion run must preserve the original, record source/output hashes, adapter/version, target DXF version, audit mode and an explicit loss report. The ODA File Converter's audit mode must be a separate experimental condition because it may repair or change loaded data.
