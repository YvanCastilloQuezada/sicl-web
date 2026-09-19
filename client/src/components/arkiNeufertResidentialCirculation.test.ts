import { describe, expect, it } from "vitest";
import { evaluateNeufertResidentialCirculation, NEUFERT_CIRCULATION_PRINCIPLES, runNeufertThreeEvaluations } from "./arkiNeufertResidentialCirculation";

describe("Neufert residential circulation and adjacency", () => {
  it("defines circulation, relationship and exclusion principles", () => {
    expect(NEUFERT_CIRCULATION_PRINCIPLES).toHaveLength(7);
    expect(NEUFERT_CIRCULATION_PRINCIPLES.find((item) => item.id === "NC-05")?.principle).toContain("bathroom");
  });

  it("runs three independent residential evaluations", () => {
    const results = runNeufertThreeEvaluations();
    expect(results).toHaveLength(3);
    expect(results[0].findings.find((item) => item.principleId === "NC-05")?.status).toBe("PASS");
    expect(results[1].findings.find((item) => item.principleId === "NC-05")?.status).toBe("FAIL");
    expect(results[2].findings.find((item) => item.principleId === "NC-04")?.status).toBe("FAIL");
    expect(results.every((result) => result.humanReviewRequired)).toBe(true);
  });

  it("does not hide an absent vertical connection", () => {
    const result = runNeufertThreeEvaluations()[0];
    expect(result.findings.find((item) => item.principleId === "NC-07")?.status).toBe("UNKNOWN");
  });

  it("detects public arrival through a bedroom", () => {
    const result = runNeufertThreeEvaluations()[2];
    expect(result.findings.find((item) => item.principleId === "NC-01")?.status).toBe("FAIL");
  });
});
