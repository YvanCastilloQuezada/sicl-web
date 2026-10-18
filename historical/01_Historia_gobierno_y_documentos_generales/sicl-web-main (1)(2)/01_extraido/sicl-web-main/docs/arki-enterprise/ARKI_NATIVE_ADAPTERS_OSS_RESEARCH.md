# ARKI — OSS Native Adapter Research and Activation Boundary

## Decision

ARKI adopts a **layered adapter contract** rather than embedding a second architectural motor. The current implementation registers candidate adapters, validates exchange envelopes, selects a bounded adapter family, and emits a loss manifest. It does **not** claim that the external workers are installed, that a file was converted, or that round-trip fidelity is demonstrated.

## Recommended free/open-source stack

| Domain | Preferred adapter | Canonical contract | Current ARKI state |
|---|---|---|---|
| BIM/openBIM | IfcOpenShell / IfcConvert | IFC2X3, IFC4, IFC4.3 with profile/MVD, IDS, GUIDs and properties | Contract registered; worker and real corpus pending |
| CAD 3D | Open CASCADE Technology (OCCT) | STEP AP203/AP214/AP242 and IGES 5.3 | Contract registered; C++ worker and round-trip fixtures pending |
| CAD 2D | ezdxf; LibreCAD as human-operated QA tool | DXF with explicit version, units, layers and entities | Contract registered; Python worker and fixtures pending |
| GIS | GDAL/OGR + PROJ/GEOS | GeoPackage as canonical exchange; GeoJSON for APIs; explicit CRS | Contract registered; worker/build and spatial fixtures pending |
| Web/visual mesh | glTF Transform, IfcConvert or Assimp | GLB/glTF/OBJ as derived visual output | Contract registered; never a source-of-truth model |
| Professional publication | WeasyPrint, CairoSVG and python-docx | PDF/SVG/DOCX as derived documents | Contract registered; renderer fixtures and font policy pending |

## What was implemented locally

`server/arkiNativeAdapters.ts` provides a versioned registry, license and source metadata, runtime maturity, format coverage, adapter selection, exchange-envelope validation, and `ARKI-EXCHANGE-LOSS-1.0` manifests. The contract requires preservation of the original file and human review. GIS exchanges require a CRS; CAD exchanges warn when units are absent; IFC exchanges warn when profile/MVD and IDS are absent; projections to mesh or publication formats record loss of editability and semantics.

The tRPC facade remains separate from the architectural brain. No proprietary SDK, conversion service, or professional certification is silently introduced. The OSS workers are now installed in an isolated virtual environment outside the repository and exercised against synthetic fixtures; this is a local worker demonstration, not a claim that arbitrary ARKI project geometry has completed a professional round-trip.

## Local worker demonstration

The isolated worker generated and read back valid demonstration files for **IFC4, DXF R2018, GeoJSON (EPSG:4326), GeoPackage (EPSG:4326), STEP and IGES**. The IFC fixture contains one project and one wall; the CAD fixtures contain a bounded box/plan; the GIS fixtures contain one site polygon. The TypeScript orchestrator successfully invoked the IFC worker through `executeOssWorker`.

The demonstrated scope is therefore: **OSS worker installed and fixture conversion/readback PASS**. It is not yet: **ARKI project model export**, **multi-provider round-trip**, **permit-ready documentation**, **DWG support**, or **professional certification**.

## Explicit non-claims

DWG is not treated as an open format. LibreDWG remains experimental/beta and cannot support an enterprise round-trip promise. ODA File Converter is freeware but is not an open-source SDK and does not grant redistribution rights for the ODA SDK. OCCT's advanced proprietary exchange components are outside the OSS baseline. PDF, SVG, DOCX, GLB and OBJ are projections or publications, not substitutes for IFC, STEP, GeoPackage or a parametric source file.

## Activation gates

1. Pin tool versions and produce an SBOM and license notices.
2. Move the isolated worker environment into a reproducible deployment image with resource limits.
3. Add real project fixtures for IFC2X3/IFC4/IFC4.3, DXF, STEP, IGES, GeoPackage and GeoJSON.
4. Connect ARKI's conceptual geometry/project lifecycle output to the worker input contract.
5. Validate schemas, GUIDs, properties, geometry, units, tolerances, CRS and rendered outputs.
6. Record every dropped entity, attribute, relation, layer, material, source reference and precision change.
7. Run human-reviewed round-trip tests before changing any capability to `DEMONSTRATED`.

## Sources consulted

- [IfcOpenShell documentation](https://docs.ifcopenshell.org/introduction.html)
- [Open CASCADE documentation](https://occt3d.com/dev/doc/overview/html/index.html)
- [ezdxf documentation](https://ezdxf.readthedocs.io/en/stable/introduction.html)
- [GDAL license and dependency notice](https://gdal.org/en/stable/license.html)
- [GDAL GeoPackage driver](https://gdal.org/en/stable/drivers/vector/gpkg.html)
- [glTF Transform](https://gltf-transform.dev/)
- [WeasyPrint](https://doc.courtbouillon.org/weasyprint/stable/)
- [CairoSVG](https://cairosvg.org/documentation/)
- [python-docx](https://python-docx.readthedocs.io/)
- [Open Design Alliance File Converter](https://www.opendesign.com/guestfiles/oda_file_converter)

`DOCUMENTED ≠ INSTALLED`; `CONTRACT_VALID ≠ CONVERTED`; `CONVERTED ≠ PROFESSIONALLY CERTIFIED`.
