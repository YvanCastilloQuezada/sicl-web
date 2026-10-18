import { describe, expect, it } from "vitest";
import { AGENT_AUTONOMY_BACKLOG, allAgentsHaveAuthorityBoundary, countByState, getAutonomousWork } from "./agentAutonomyBacklog";

describe("agent autonomous backlog", () => {
  it("covers all 16 governed agents", () => {
    expect(AGENT_AUTONOMY_BACKLOG).toHaveLength(16);
    expect(new Set(AGENT_AUTONOMY_BACKLOG.map((item) => item.agentId)).size).toBe(16);
  });
  it("gives Legal and Distribution explicit safe work and human gates", () => {
    expect(getAutonomousWork("legal_compliance_intelligence")?.currentState).toBe("PLANNED");
    expect(getAutonomousWork("legal_compliance_intelligence")?.humanGates).toContain("professional legal review");
    expect(getAutonomousWork("distribution")?.safeDeliverables).toContain("provider matrix");
    expect(getAutonomousWork("distribution")?.humanGates).toContain("publication");
  });
  it("does not infer production readiness from autonomous work", () => {
    expect(countByState("IMPLEMENTED")).toBe(7);
    expect(countByState("PARTIAL")).toBe(5);
    expect(countByState("PREPARED")).toBe(3);
    expect(countByState("PLANNED")).toBe(1);
    expect(allAgentsHaveAuthorityBoundary()).toBe(true);
  });
});
