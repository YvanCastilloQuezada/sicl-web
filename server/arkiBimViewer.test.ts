import { describe, expect, it } from "vitest";
import { arkiBimViewerContract, detectBimInterferences, inspectBimArtifact } from "./arkiBimViewer";

describe("ARKI-BIM-VISOR-1.0", () => {
  it("uses ARK as canonical format and governs native adapters", () => {
    const contract = arkiBimViewerContract();
    expect(contract.oneMotor).toBe(true);
    expect(contract.canonicalFormat).toBe("ARK");
    expect(contract.formats.RVT.status).toBe("HOST_REQUIRED");
    expect(contract.formats.DGN.status).toBe("HOST_REQUIRED");
    expect(contract.formats.IFC.status).toBe("INSPECTABLE_WITH_ADAPTER");
  });

  it("inspects ARK, IFC and rejects unknown formats without fabricating support", () => {
    expect(inspectBimArtifact("hospital.ark", "{}").format).toBe("ARK");
    expect(inspectBimArtifact("hospital.ifc", "ISO-10303").format).toBe("IFC");
    expect(inspectBimArtifact("hospital.xyz", "data").status).toBe("REJECTED");
  });

  it("detects cross-discipline AABB clash candidates and preserves human review", () => {
    const result = detectBimInterferences([{ modelId: "M-ARK", name: "Coordination", format: "ARK", version: "1", units: "m", coordinateSystem: "LOCAL", sourceIds: ["SRC-1"], humanReviewRequired: true, elements: [
      { id: "W-1", kind: "WALL", name: "Wall", discipline: "ARCHITECTURE", box: { min: [0, 0, 0], max: [3, 0.3, 3] }, sourceId: "SRC-1" },
      { id: "P-1", kind: "PIPE", name: "Pipe", discipline: "SANITARY", box: { min: [1, -0.1, 1], max: [2, 0.5, 2] }, sourceId: "SRC-2" },
    ] }]);
    expect(result.schema).toBe("ARKI-BIM-CLASH-1.0");
    expect(result.interferences).toHaveLength(1);
    expect(result.interferences[0].status).toBe("OPEN");
    expect(result.humanReviewRequired).toBe(true);
  });
});
