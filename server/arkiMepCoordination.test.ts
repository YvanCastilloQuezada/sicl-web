import { describe, expect, it } from "vitest";
import { coordinateMepModels, mepCoordinationContract } from "./arkiMepCoordination";

const models = [{
  modelId: "ARCH-001",
  name: "Arquitectura",
  format: "ARK" as const,
  version: "1.0",
  units: "m",
  coordinateSystem: "LOCAL",
  sourceIds: ["ARCH-SOURCE"],
  humanReviewRequired: true as const,
  elements: [{ id: "WALL-1", kind: "WALL" as const, name: "Muro", discipline: "ARCHITECTURE", box: { min: [0, 0, 0] as [number, number, number], max: [5, 0.3, 3] as [number, number, number] }, sourceId: "ARCH-SOURCE" }],
}, {
  modelId: "MEP-001",
  name: "Sanitaria",
  format: "ARK" as const,
  version: "1.0",
  units: "m",
  coordinateSystem: "LOCAL",
  sourceIds: ["MEP-SOURCE"],
  humanReviewRequired: true as const,
  elements: [{ id: "PIPE-1", kind: "PIPE" as const, name: "Tubería", discipline: "SANITARY", box: { min: [2, -0.15, 1] as [number, number, number], max: [3, 0.35, 2] as [number, number, number] }, sourceId: "MEP-SOURCE", properties: { system: "COLD_WATER", elevationM: 1.2 } }],
}];

describe("ARKI-MEP-COORDINATION-1.0", () => {
  it("requires specialist review when clashes exist", () => {
    const result = coordinateMepModels({ models });
    expect(result.status).toBe("REVIEW_REQUIRED");
    expect(result.interferences).toHaveLength(1);
    expect(result.humanReviewRequired).toBe(true);
  });

  it("blocks mixed units or coordinate systems", () => {
    const result = coordinateMepModels({ models: models.map((model, index) => index === 1 ? { ...model, units: "mm" } : model) });
    expect(result.status).toBe("BLOCKED");
    expect(result.reason).toBe("INCONSISTENT_UNITS_OR_COORDINATE_SYSTEM");
  });

  it("reports missing MEP metadata without inventing values", () => {
    const result = coordinateMepModels({ models: models.map((model, index) => index === 1 ? { ...model, elements: [{ ...model.elements[0], properties: {} }] } : model) });
    expect(result.status).toBe("REVIEW_REQUIRED");
    expect(result.unknowns.map((unknown) => unknown.requiredEvidence)).toEqual(["system o systemType", "elevationM"]);
  });

  it("publishes explicit professional limitations", () => {
    const contract = mepCoordinationContract();
    expect(contract.humanReviewRequired).toBe(true);
    expect(contract.limitations.join(" ")).toContain("swept-volume");
  });
});
