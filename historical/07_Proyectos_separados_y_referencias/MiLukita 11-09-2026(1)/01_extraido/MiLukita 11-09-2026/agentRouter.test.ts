import { describe, expect, it } from "vitest";
import { registeredAgentForIntent, routeAgentIntent } from "./agentRouter";

describe("Fase E.1 · Agent Router", () => {
  it("enruta auditoría al agente existente en modo READ_ONLY", () => {
    const result = routeAgentIntent("AUDIT");
    expect(result.status).toBe("ROUTED");
    expect(result.agentId).toBe("auditor");
    expect(result.mode).toBe("READ_ONLY");
    expect(result.canMutateCore).toBe(false);
  });

  it("enruta análisis financiero como propuesta y no como ejecución", () => {
    const result = routeAgentIntent("FINANCIAL_ANALYSIS");
    expect(result.status).toBe("ROUTED");
    expect(result.agentId).toBe("financial-intelligence");
    expect(result.mode).toBe("PROPOSE_ONLY");
    expect(result.canMutateCore).toBe(false);
  });

  it("mantiene Legal & Compliance planificado y deshabilitado", () => {
    const result = routeAgentIntent("LEGAL_REVIEW");
    expect(result.status).toBe("NO_DATA");
    expect(result.agentId).toBe("legal_compliance_intelligence");
    expect(result.canMutateCore).toBe(false);
  });

  it("no crea un super-agente y conserva boundaries explícitos", () => {
    const auditor = registeredAgentForIntent("AUDIT");
    const distribution = routeAgentIntent("DISTRIBUTION_REVIEW");
    expect(auditor?.authorityBoundary).toContain("MJP_CORE");
    expect(distribution.mode).toBe("PROJECTION_ONLY");
    expect(distribution.status).toBe("NO_DATA");
  });
});
