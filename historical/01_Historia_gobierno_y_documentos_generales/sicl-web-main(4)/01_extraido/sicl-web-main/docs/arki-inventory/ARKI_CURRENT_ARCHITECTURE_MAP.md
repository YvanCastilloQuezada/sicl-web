# ARKI — Current Architecture Map (Delta 513)

## 1. Mapa lógico

```text
Usuario / Arquitecto / Cliente
        │ texto · micrófono · cámara · archivo · PDF
        ▼
Command Bar + páginas ARKI + Libro Vivo + Source Library
        │
        ├── Voice adapter / transcripción
        ├── Visual Field ingest
        │      ├── storage reference + provenance
        │      └── OCR (pdftotext | pdftoppm+tesseract | tesseract)
        └── proyecto/version/contexto declarado
        ▼
SICL Core boundary / snapshot / knowledge records
        │ FACT · HYPOTHESIS · UNKNOWN · source/evidence IDs
        ▼
D6.2 Reasoning Harness
        │ retrieval → transfer decision → strategies A/B
        │ perturbation → failure topology → counterexample
        │ trace → deficits → human review
        ▼
Knowledge → Topology bridge
        │ activities · relationships · flows · conditions · hazards
        ▼
D6.3 Geometric bridge
        │ requirements → design moves → mutations
        │ canonical SpatialRepresentation A/B
        │ geometric gates; functional/operational/regulatory gates
        ▼
2D SVG / 3D massing / AR camera-WebXR views
        │
        └── human interpretation, correction, approval and promotion
```

## 2. Component map

| Layer | Key files/symbols | Contract | State |
|---|---|---|---|
| Frontend shell | `client/src/App.tsx`, `DashboardLayout.tsx` | Routes `/`, `/sources`, `/spatial`, `/spatial-comparison`, `/arki-book` | DEMONSTRATED |
| User input | `CommandBar.tsx`, `ArkiBookPage.tsx` | Text, voice, camera/document pathways | DEMONSTRATED_UI |
| Source ingestion | `server/visualField.ts`, `server/arkiOcr.ts` | Source record, media reference, OCR result, provenance | DEMONSTRATED_LOCAL |
| Core boundary | `server/siclCore.ts`, `server/coreHttpClient*.ts` | Snapshot/knowledge/decision/remote transport | LOCAL DEMONSTRATED; REMOTE DEPENDENT |
| Reasoning | `server/arkiD62ReasoningHarness.ts` | Typed input/output, trace, transfer, unknown | DEMONSTRATED |
| Topology | `executeReasoningToTopology` in reasoning harness | Activities, relationships, requirements, unknowns | DEMONSTRATED |
| Geometry | `server/arkiD63GeometricBridge.ts` | Canonical representation, mutations, gates | DEMONSTRATED_CONCEPTUAL |
| Spatial viewer | `UPAO001SpatialViewer.tsx`, `UPAO001MassingViewer3D.tsx` | Shared 2D/3D representation | DEMONSTRATED_EXPERIMENTAL |
| AR | `ArkiRealityView.tsx` | camera, GPS, two-stake calibration, WebXR | EXPERIMENTAL |
| Persistence | `drizzle/schema.ts`, snapshot/manifest files | project row, version, snapshot | DEMONSTRATED_LOCAL |
| Education | `ArkiBookPage.tsx`, docs/manuals | public Book Vivo and evaluation | DEMONSTRATED_PRODUCT_UI |

## 3. Information and authority boundaries

1. **Declared project input** is not a FACT. It is provenance-bearing input.
2. **Retrieved FACT** is bounded by `sourceIds`, `evidenceIds`, scope and version.
3. **HYPOTHESIS/AI_PROPOSED** may drive a candidate but cannot silently become a requirement or FACT.
4. **UNKNOWN** has a resolution path and authority, normally `HUMAN_ARCHITECT` or specialist evidence.
5. **Geometry** is canonical analytical geometry; it is not automatically a legal or construction document.
6. **Human review** is the final authority for promotion, design selection, specialist validation and professional use.

## 4. Current execution cycle

```text
PROJECT INPUT
 → retrieve bounded knowledge
 → classify transfer
 → derive activity/relationship model
 → create two strategy candidates
 → test perturbations/failures/counterexamples
 → preserve unknowns
 → derive topology
 → create geometric requirements
 → apply reversible design moves
 → generate A/B canonical spatial representations
 → run containment/non-overlap/interface gates
 → expose 2D/3D/AR views
 → human review
```

## 5. External dependencies and environment evidence

The audited environment has `DATABASE_URL`, built-in Forge URL/key and a service-token variable, but no `SICL_CORE_URL`, no S3 bucket/access-key variables and no Google Maps key. This does not mean the adapters are absent; it means the corresponding remote integration cannot be claimed as active from environment evidence. The D6.4 report explicitly records remote persistence as conditional.

## 6. Architectural exclusions

The map deliberately does not draw a DWG/Revit/IFC export branch, a normative calculation engine, a structural/MEP solver, a cadastral GIS engine or an automatic licensing submission route. These are not present as demonstrated contracts in the audited repository and must remain outside the current capability boundary.
