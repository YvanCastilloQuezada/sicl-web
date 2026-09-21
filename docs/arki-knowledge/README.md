# ARKI Knowledge Preservation Package v1.0

**Status:** preserved documentary layer · **runtime ingestion:** disabled · **Control Center:** read-only

This directory preserves the supplied package exactly as versioned Excel sources. The files are indexed for retrieval and traceability; they are not automatically promoted into the canonical runtime knowledge corpus, and no workbook has been rewritten.

## Boundaries

- `RESEARCH ≠ CANONICAL KNOWLEDGE ≠ IMPLEMENTATION`.
- `HISTORICAL ≠ CURRENT`.
- `DOCUMENTED ≠ AUTHORIZED ≠ IMPLEMENTED ≠ INTEGRATED ≠ DEPLOYED`.
- `CURRENT ≠ PRODUCTION ≠ PROFESSIONAL AUTHORITY`.
- `IDEA ≠ ROADMAP`; `PRECEDENT ≠ TEMPLATE`; `SOURCE ≠ KNOWLEDGE`.
- `UNKNOWN BEFORE INVENTING`.
- The Frozen workbook remains documentary/frozen. The External AI Research Format is a template only.

## Preserved workbooks

| # | File | Domain | Purpose / role | Version | Status | Repository path | Rule / boundary |
|---:|---|---|---|---|---|---|---|
| 1 | [01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx](preserved/01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx) | Governance | Constitution/decisions | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx` | Do not rediscuss without evidence/decision |
| 2 | [02_ARKI_Investigacion_y_Hallazgos_v1.0.xlsx](preserved/02_ARKI_Investigacion_y_Hallazgos_v1.0.xlsx) | Research | Findings/provenance | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/02_ARKI_Investigacion_y_Hallazgos_v1.0.xlsx` | Research ≠ canon |
| 3 | [03_ARKI_Historia_y_Evolucion_v1.0.xlsx](preserved/03_ARKI_Historia_y_Evolucion_v1.0.xlsx) | History | Genealogy | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/03_ARKI_Historia_y_Evolucion_v1.0.xlsx` | Historical ≠ current |
| 4 | [04_ARKI_Experimentos_y_Evidencia_v1.0.xlsx](preserved/04_ARKI_Experimentos_y_Evidencia_v1.0.xlsx) | Evidence | Experiments/A–AV | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/04_ARKI_Experimentos_y_Evidencia_v1.0.xlsx` | Result ≠ universal knowledge |
| 5 | [05_ARKI_Capacidades_y_Madurez_v1.0.xlsx](preserved/05_ARKI_Capacidades_y_Madurez_v1.0.xlsx) | Capability | Maturity truth | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/05_ARKI_Capacidades_y_Madurez_v1.0.xlsx` | Research ≠ production ≠ authority |
| 6 | [06_ARKI_UNKNOWN_Gaps_Preguntas_Abiertas_v1.0.xlsx](preserved/06_ARKI_UNKNOWN_Gaps_Preguntas_Abiertas_v1.0.xlsx) | Unknowns | Open gaps | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/06_ARKI_UNKNOWN_Gaps_Preguntas_Abiertas_v1.0.xlsx` | UNKNOWN before inventing |
| 7 | [07_ARKI_Frozen_Future_Architecture_v1.0.xlsx](preserved/07_ARKI_Frozen_Future_Architecture_v1.0.xlsx) | Frozen | FFO/V1–V24 | v1.0 | `FROZEN` | `docs/arki-knowledge/preserved/07_ARKI_Frozen_Future_Architecture_v1.0.xlsx` | Documented ≠ authorized |
| 8 | [08_ARKI_Casos_y_Precedentes_Arquitectonicos_v1.0.xlsx](preserved/08_ARKI_Casos_y_Precedentes_Arquitectonicos_v1.0.xlsx) | Architecture | Cases/precedents | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/08_ARKI_Casos_y_Precedentes_Arquitectonicos_v1.0.xlsx` | Precedent ≠ template |
| 9 | [09_ARKI_Fuentes_y_Biblioteca_Arquitectonica_v1.0.xlsx](preserved/09_ARKI_Fuentes_y_Biblioteca_Arquitectonica_v1.0.xlsx) | Sources | Library | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/09_ARKI_Fuentes_y_Biblioteca_Arquitectonica_v1.0.xlsx` | Source ≠ knowledge |
| 10 | [10_ARKI_Tipologias_Arquitectonicas_v1.0.xlsx](preserved/10_ARKI_Tipologias_Arquitectonicas_v1.0.xlsx) | Architecture | Typology knowledge | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/10_ARKI_Tipologias_Arquitectonicas_v1.0.xlsx` | Typology ≠ occupancy |
| 11 | [11_ARKI_Ideas_No_Implementadas_v1.0.xlsx](preserved/11_ARKI_Ideas_No_Implementadas_v1.0.xlsx) | Ideas | Idea parking lot | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/11_ARKI_Ideas_No_Implementadas_v1.0.xlsx` | Idea ≠ roadmap |
| 12 | [12_ARKI_Libro_Arquitectura_Conocimiento_Maestro_v1.0.xlsx](preserved/12_ARKI_Libro_Arquitectura_Conocimiento_Maestro_v1.0.xlsx) | Book | Master architectural book knowledge | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/12_ARKI_Libro_Arquitectura_Conocimiento_Maestro_v1.0.xlsx` | Book knowledge stays traceable |
| 13 | [13_ARKI_Formato_Investigacion_IA_Externa_v1.0.xlsx](preserved/13_ARKI_Formato_Investigacion_IA_Externa_v1.0.xlsx) | Research Ops | External AI delivery template | v1.0 | `ACTIVE` | `docs/arki-knowledge/preserved/13_ARKI_Formato_Investigacion_IA_Externa_v1.0.xlsx` | External AI ≠ canonical authority |

## Package manifest

The machine-readable manifest with SHA-256 hashes is [`package-manifest-v1.0.json`](package-manifest-v1.0.json). The supplied macroorder is preserved as [`MACROORDEN_MANUS_ARKI_KNOWLEDGE_PRESERVATION_PACKAGE_v1.0.txt`](MACROORDEN_MANUS_ARKI_KNOWLEDGE_PRESERVATION_PACKAGE_v1.0.txt).

## Control Center registration

The package is registered read-only under **Knowledge → Preserved Registers** and **Documents**. The Control Center exposes metadata and repository paths only; it does not duplicate workbook contents into the database.

## Gate

`GATE_ARKI_KNOWLEDGE_PRESERVATION_PACKAGE_V1 = PASS`
