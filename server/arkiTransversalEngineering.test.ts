import { describe, expect, it } from "vitest";
import { createArkProposal, exportIfcSemanticBridge, exchangePackage } from "./arkiParametricExchange";
import { runPreliminaryPredimensioning } from "./arkiTransversalEngineering";

describe("ARKI transversal engineering and ARK-IFC bridge", () => {
  it("flags structural and services inputs before architectural freeze", () => {
    const report = runPreliminaryPredimensioning({ projectId: "HOUSE-001", use: "HOUSE", floors: 2, typicalSpanM: 5, floorToFloorM: 3, structuralSystem: "REINFORCED_CONCRETE_FRAME", columnWidthM: 0.2, columnDepthM: 0.25, beamDepthM: 0.25, slabThicknessM: 0.1, wetAreaCount: 4, serviceShaftCount: 0, electricalRoomCount: 0, hvacRequired: undefined });
    expect(report.schema).toBe("ARKI-PREDIMENSIONING-1.0");
    expect(report.status).toBe("BLOCKED_UNKNOWN");
    expect(report.checks.some((check) => check.id === "STR-COL-001" && check.status === "WARNING")).toBe(true);
    expect(report.unknowns).toEqual(expect.arrayContaining(["sanitary shaft strategy", "electrical room and riser strategy", "HVAC requirement"]));
  });

  it("stores IFC-like properties and quantities inside ARK", () => {
    const proposal = createArkProposal({ projectId: "HOUSE-001", name: "Casa Yvan", geometry: { kind: "RECTANGULAR_MASS", width: 10, depth: 12, height: 6, floors: 2 } });
    expect(proposal.bim?.schema).toBe("ARKI-IFC-COMPAT-1.0");
    expect(proposal.bim?.elements[0].ifcClass).toBe("IfcBuilding");
    expect(proposal.bim?.elements[0].quantities).toEqual(expect.arrayContaining([expect.objectContaining({ name: "Width", value: 10 })]));
    const bridge = exportIfcSemanticBridge(proposal);
    expect(bridge.status).toBe("PREPARED");
    expect(bridge.format).toBe("IFC4_SEMANTIC_BRIDGE");
  });

  it("includes the IFC semantic bridge in the parametric exchange package", () => {
    const packageResult = exchangePackage({ projectId: "HOUSE-001", name: "Casa Yvan", geometry: { kind: "RECTANGULAR_MASS", width: 10, depth: 12, height: 6, floors: 2 }, graph: { contractVersion: "ARKI-PARAMETRIC-1.0", graphId: "G-1", nodes: [{ id: "n1", op: "constant", params: { value: 1 } }], outputs: ["n1"], units: "m", tolerance: 0.01, humanReviewRequired: true } });
    expect(packageResult.manifest.contractVersion).toBe("ARKI-EXCHANGE-PACKAGE-1.1");
    expect(packageResult.files.some((file) => file.format === "IFC4_SEMANTIC_BRIDGE")).toBe(true);
  });
});
