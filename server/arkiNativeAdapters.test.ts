import { describe, expect, it } from "vitest";
import { ARKI_NATIVE_ADAPTERS, nativeAdapterCapabilityMatrix, planProfessionalExport, validateExchangeEnvelope } from "./arkiNativeAdapters";

describe("ARKI native adapter contracts", () => {
  it("registers OSS candidates without claiming installed workers", () => {
    expect(ARKI_NATIVE_ADAPTERS.map((adapter) => adapter.id)).toEqual(["IFC-OPEN-SHELL", "OCCT", "EZDXF", "GDAL-PROJ-GEOS", "GLTF-TRANSFORM", "PUBLICATION-OSS"]);
    expect(nativeAdapterCapabilityMatrix().every((adapter) => adapter.runtime === "OSS_WORKER_REQUIRED" || adapter.runtime === "WEB_WASM_OPTIONAL")).toBe(true);
  });

  it("requires preservation, review, CRS and IFC exchange metadata", () => {
    const diagnostic = validateExchangeEnvelope({ projectId: "P-001", sourceFormat: "IFC4", targetFormat: "GEOPACKAGE", sourceFileName: "model.ifc", schemaVersion: "ARKI-EXCHANGE-1.0", preserveOriginal: true, humanReviewRequired: true });
    expect(diagnostic.status).toBe("REJECTED");
    expect(diagnostic.errors).toContain("CRS is required for GIS exchanges");
    expect(diagnostic.warnings).toContain("IFC profile/MVD is not declared");
  });

  it("plans a bounded export and records loss without executing a worker", () => {
    const result = planProfessionalExport({ projectId: "P-002", sourceFormat: "IFC4", targetFormat: "GLB", sourceFileName: "model.ifc", sourceChecksum: "sha256:demo", schemaVersion: "ARKI-EXCHANGE-1.0", profile: "IFC4 Reference View", idsProfile: "IDS-1", preserveOriginal: true, humanReviewRequired: true });
    expect(result.adapterId).toBe("IFC-OPEN-SHELL");
    expect(result.execution).toBe("NOT_EXECUTED_WORKER_NOT_INSTALLED");
    expect(result.lossManifest.originalPreserved).toBe(true);
    expect(result.lossManifest.diagnostic.lossCategories).toContain("SOURCE_EDITABILITY");
  });
});
