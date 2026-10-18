import { describe, expect, it } from "vitest";
import { AGENT_MAP_PERMISSIONS, AGENT_PERMISSION_PROFILES, AGENT_MAP_PROHIBITIONS } from "./agentMap";

describe("agentMap", () => {
  it("mantiene la matriz documental completa de permisos", () => {
    expect(AGENT_MAP_PERMISSIONS).toEqual(["READ", "WRITE", "PROPOSE", "EXECUTE"]);
    expect(AGENT_PERMISSION_PROFILES.length).toBeGreaterThanOrEqual(8);
    expect(AGENT_PERMISSION_PROFILES.map((profile) => profile.id)).toContain("lukita");
    expect(AGENT_PERMISSION_PROFILES.find((profile) => profile.id === "lukita")?.canExecute).toBe("LIMITED");
  });

  it("no permite tratar agentes conceptuales como implementados", () => {
    const conceptual = AGENT_PERMISSION_PROFILES.filter((profile) => profile.status === "CONCEPTUAL");
    expect(conceptual.map((profile) => profile.id)).toEqual(expect.arrayContaining(["auditor-agent", "watchdog", "supervisor"]));
    expect(conceptual.every((profile) => profile.evidence.length > 20)).toBe(true);
  });

  it("conserva la golden rule de no generar resultados oficiales", () => {
    expect(AGENT_MAP_PROHIBITIONS).toContain("Generar resultados oficiales");
    expect(AGENT_MAP_PROHIBITIONS).toContain("Modificar resultados, RTP, rulesets o premios");
    expect(AGENT_MAP_PROHIBITIONS).toContain("Crear ganadores o alterar la wallet");
  });
});
