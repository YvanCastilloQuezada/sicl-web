# ARKI — F7 OECE / ACS Procurement Evidence Contract V1

**Date:** 2026-10-07  
**State:** CONTRACT + BOUNDED IMPLEMENTATION / EXECUTION VERIFICATION PENDING

## 1. Purpose

Make public-procurement information acquired by ACS/OECE a governed upstream evidence source for ARKI existing-project and bid-analysis workflows.

## 2. Authority boundary

```
OECE / public procurement source
  -> ACS acquisition/corpus
  -> immutable evidence package
  -> ARKI BASELINE_0
  -> D-2 / AGK / professional projections
  -> Human Authority acceptance
  -> F8
```

OECE/ACS is not canonical Project State, architectural semantic authority or Operational Geometry Authority. Procurement metadata and downloaded files never bypass reconciliation.

## 3. Current official source families

The Peruvian National Open Data Platform currently exposes OECE datasets/surfaces including:

- procurement call/invitation data;
- awards;
- contracts;
- contracting entities;
- suppliers/consortia;
- work-log information;
- work valuations;
- additional procurement/public-information datasets.

The existence of a record in one surface does not prove that all related surfaces or a complete technical dossier are available.

Official catalog:
- https://www.datosabiertos.gob.pe/group/organismo-especializado-para-las-contrataciones-p%C3%BAblicas-eficientes-oece
- https://www.datosabiertos.gob.pe/dataset/datos-de-la-convocatoria-o-invitaci%C3%B3n-de-las-entidades-organismo-especializado-para-las
- https://www.datosabiertos.gob.pe/dataset/datos-de-la-adjudicaci%C3%B3n-organismo-especializado-para-las-contrataciones-p%C3%BAblicas-eficientes
- https://www.datosabiertos.gob.pe/dataset/contratos-de-las-entidades-organismo-especializado-para-las-contrataciones-p%C3%BAblicas

## 4. Evidence package

`OeceEvidencePackage` preserves:

- package/project identity;
- OCID and/or procedure identity;
- dataset kind;
- source reference;
- source checksum;
- observation date;
- document acquisition status;
- downloaded-document checksum;
- local evidence reference;
- missing source surfaces;
- package completeness;
- technical-document-set claim;
- immutable package fingerprint.

## 5. Document acquisition states

- `DISCOVERED`
- `DOWNLOADED`
- `VERIFIED`
- `FAILED`
- `UNAVAILABLE`

`VERIFIED` requires checksum and local evidence reference. A URL, metadata row or successful HTTP response alone is insufficient.

## 6. Technical dossier epistemic rule

A downloaded file is not a complete technical dossier.

Current bounded implementation recognizes a technical core only when verified evidence includes at least:

- technical dossier/document;
- budget;
- specification.

Even that state is named `TECHNICAL_CORE_SET_VERIFIED`, not `COMPLETE_TECHNICAL_DOSSIER`. Completeness of a real procurement dossier requires a specimen-specific manifest and reconciliation.

## 7. BASELINE_0 translation

Structured procurement fields are imported as source claims with provenance and `PARTIAL` evidence state. Verified downloaded documents preserve artifact lineage. Neither becomes accepted architectural truth until F7 reconciliation.

## 8. ACS integration target

The local ACS implementation has previously demonstrated corpus/portal surfaces and OECE record/document/award/contract parser concepts. The next real specimen campaign must demonstrate:

```
search procedure
 -> resolve related records
 -> discover document references
 -> download
 -> checksum
 -> persist local evidence reference
 -> build OeceEvidencePackage
 -> build ARKI BASELINE_0
 -> report missing surfaces/UNKNOWN
```

No claim of complete historical OECE coverage or complete technical-dossier download is authorized until that campaign is executed.

## 9. Bidding analysis future surface

Once the evidence path is verified, ARKI may compare official evidence against its own accepted professional/economic projections:

- official budget vs ARKI quantities/cost;
- document inconsistencies;
- missing evidence;
- technical risks;
- required capability;
- economic variance;
- GO/NO-GO support.

The decision layer remains downstream of evidence acquisition and does not alter source evidence.


## 10. Completeness anti-overclaim rule

A producer may declare the source surfaces expected for a specimen/campaign. ARKI independently derives which expected surfaces are absent from the received records/documents. If the producer omits a derived missing surface from `missingSurfaces`, ingestion fails closed with `OECE_MISSING_SURFACES_UNDERREPORTED`.

`SOURCE_PACKAGE_VERIFIED` additionally requires a PROCEDURE record, at least one verified document, an explicit non-empty expected-surface set, and zero derived/declared missing surfaces. This is source-package completeness only; it is not equivalent to architectural correctness or a complete technical dossier.
