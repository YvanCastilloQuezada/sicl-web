import { describe, expect, it } from "vitest";
import { AGENT_MATURITY_CRITERIA, assessAgentMaturity, canAutonomouslyPromoteToImplemented, maturityRequiresHumanGate } from "./agentMaturityGate";

describe("agent maturity gate", () => {
  it("requires explicit contract, tests and authority boundary", () => {
    const assessment = assessAgentMaturity({ agentId: "distribution", criteria: { CONTRACT: true, TESTS: true, AUTHORITY_BOUNDARY: true }, blockedByHuman: ["provider connection"] });
    expect(assessment.state).toBe("PREPARED");
    expect(assessment.missing).toContain("EVIDENCE");
    expect(maturityRequiresHumanGate(assessment)).toBe(true);
  });
  it("does not promote an agent to IMPLEMENTED by inference", () => {
    const assessment = assessAgentMaturity({ agentId: "legal", criteria: { CONTRACT: true, VALIDATOR: true, TESTS: true, AUTHORITY_BOUNDARY: true }, blockedByHuman: ["professional review"] });
    expect(assessment.state).toBe("PREPARED");
    expect(canAutonomouslyPromoteToImplemented(assessment)).toBe(false);
  });
  it("keeps a stable seven-part evidence checklist", () => {
    expect(AGENT_MATURITY_CRITERIA).toEqual(["CONTRACT", "VALIDATOR", "TESTS", "EVIDENCE", "OBSERVABILITY", "FAILURE_BEHAVIOR", "AUTHORITY_BOUNDARY"]);
  });
});
