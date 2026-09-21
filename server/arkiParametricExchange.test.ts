import { describe, expect, it } from "vitest";
import { architecturalAssimilation, createArkProposal, exchangePackage, parseArkProposal, serializeArkProposal } from "./arkiParametricExchange";

const graph = { contractVersion: "ARKI-PARAMETRIC-1.0" as const, graphId: "test-mass", nodes: [{ id: "mass", op: "rectangle_points" as const, params: { width: 20, height: 12 } }], outputs: ["mass"], units: "m", tolerance: 0.001, humanReviewRequired: true as const };

describe("ARKI parametric exchange", () => {
  it("round-trips an .ark proposal without promoting it to a decision", () => {
    const proposal = createArkProposal({ projectId: "ABC-DEF-123-456", name: "casa_yvan", geometry: { kind: "RECTANGULAR_MASS", width: 20, depth: 12, height: 3.2, floors: 2 }, graph });
    const parsed = parseArkProposal(serializeArkProposal(proposal));
    expect(parsed).toMatchObject({ formatVersion: "ARKI-ARK-1.0", name: "casa_yvan", humanReviewRequired: true });
    if (!("formatVersion" in parsed)) throw new Error("proposal was rejected");
    expect(architecturalAssimilation(parsed)).toMatchObject({ status: "PROPOSAL_IMPORTED", architecturalRole: "VOLUMETRIC_PROPOSAL", humanReviewRequired: true, noAutomaticDecision: true });
  });

  it("generates Dynamo, Grasshopper and IFC semantic bridge artifacts plus ARK manifest", () => {
    const packageResult = exchangePackage({ projectId: "ABC-DEF-123-456", name: "casa_yvan", geometry: { kind: "COURTYARD_MASS", width: 20, depth: 12, height: 3.2, floors: 2, courtyardRatio: 0.25 }, graph });
    expect(packageResult.files.map((file) => file.fileName)).toEqual(["casa_yvan.ark", "casa_yvan.dyn", "casa_yvan.ghx", "casa_yvan.ifc.json"]);
    expect(packageResult.files.find((file) => file.format === "DYN")?.content).toContain("ARKI");
    expect(packageResult.files.find((file) => file.format === "GHX")?.content).toContain("Archive");
    expect(packageResult.files.find((file) => file.format === "IFC4_SEMANTIC_BRIDGE")?.content).toContain("ARKI IFC compatibility bridge");
    expect(packageResult.manifest).toMatchObject({ nativeRevit: "HOST_REQUIRED", nativeRhino: "HOST_REQUIRED", ifcSemanticBridge: "PREPARED_WITH_ADAPTER_VALIDATION", humanReviewRequired: true });
  });

  it("rejects .ark files without the governed contract", () => {
    expect(parseArkProposal("{\"geometry\":{}}" )).toMatchObject({ status: "REJECTED" });
  });
});
