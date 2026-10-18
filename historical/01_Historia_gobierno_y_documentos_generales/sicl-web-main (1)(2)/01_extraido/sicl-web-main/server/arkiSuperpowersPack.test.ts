import { describe, expect, it } from "vitest";
import { executeArkiSuperpowersPack, summarizeSuperpowers, type SuperpowersInput } from "./arkiSuperpowersPack";

const input: SuperpowersInput = {
  projectId: "TER-ABC-250-001",
  projectName: "Terminal intermodal",
  typology: "TRANSPORT",
  brief: "Terminal para pasajeros, buses y carga con separación de flujos.",
  context: { location: "Peru", occupancy: 500 },
  constraints: ["separate public and service flows", "conceptual review"],
  activities: [
    { id: "passengers", label: "passenger movement", subjects: ["public"], capacity: 500, frequency: "daily", duration: "medium", temporalOverlap: true, privacy: "shared" },
    { id: "buses", label: "bus operation", subjects: ["operator"], capacity: 20, frequency: "daily", duration: "short", temporalOverlap: true, privacy: "controlled" },
  ],
  relationships: [{ id: "r1", from: "passengers", to: "buses", relation: "controlled interface", subjects: ["public", "operator"], state: "open", frequency: "daily", time: "peak", control: "staff-mediated" }],
  subjects: ["public", "operator"],
  conditions: ["independent service access", "safe boarding"],
  unknowns: ["exact topography", "local evacuation code"],
  envelope: { width: 150, height: 200 },
  sourceIds: ["SRC-BRIEF-001"],
  change: "+10 buses",
  baselineDecision: "PARTI B with central plaza",
  decisions: [{ id: "AD-031", decision: "reduce service corridor", benefit: ["lower built area"], liabilities: ["operational conflict", "maintenance difficulty"], horizon: "YEAR_5_20", evidenceStatus: "PARTIAL" }],
};

describe("ARKI SUPERPOWERS PACK 1.0", () => {
  it("runs all five capabilities through the same unified motor", () => {
    const result = executeArkiSuperpowersPack(input);
    expect(result.version).toBe("ARKI-SUPERPOWERS-PACK-1.0");
    expect(result.motor.motorVersion).toBe("ARKI-UNIFIED-MOTOR-1.0");
    expect(result.consequenceRadar.items.map((item) => item.class)).toEqual(expect.arrayContaining(["DIRECT", "SECONDARY", "TERTIARY", "POSSIBLE", "UNKNOWN"]));
    expect(result.valueOfInformation.rankedUnknowns[0].priority).toBe("FIRST");
    expect(result.designDivergence.alternativeIds).toHaveLength(3);
    expect(result.architecturalDebt.items[0].risk).toBe("HIGH");
    expect(result.counterfactualExplorer.scenarios).toHaveLength(8);
    expect(result.humanAuthority).toBe("FINAL");
  });

  it("does not convert heuristics into regulatory, structural or professional proof", () => {
    const result = executeArkiSuperpowersPack(input);
    expect(result.claim).toBe("TRANSVERSAL_DECISION_SUPPORT_ONLY");
    expect(result.consequenceRadar.items.find((item) => item.class === "POSSIBLE")?.evidence).toContain("UNKNOWN:REGULATION");
    expect(result.counterfactualExplorer.humanReviewRequired).toBe(true);
    expect(summarizeSuperpowers(result).noProfessionalCompletionClaim).toBe(true);
  });

  it("preserves UNKNOWN when no explicit change or alternative evidence is supplied", () => {
    const result = executeArkiSuperpowersPack({ ...input, change: undefined, alternatives: [] });
    expect(result.consequenceRadar.status).toBe("PARTIAL");
    expect(result.designDivergence.conclusion).toBe("INSUFFICIENT_EVIDENCE");
    expect(result.motor.humanAuthority).toBe("FINAL");
  });
});
