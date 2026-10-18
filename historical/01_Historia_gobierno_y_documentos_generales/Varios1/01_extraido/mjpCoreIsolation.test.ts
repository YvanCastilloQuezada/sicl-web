import { describe, expect, it } from "vitest";
import { AGENT_AUTHORITY_BOUNDARY, AGENT_REGISTRY, canAgentMutateCore } from "./agentRegistry";
import { createManifestFixture } from "./tvManifest";
import { orchestrateManifest } from "./experienceOrchestrator";
import { projectShowState } from "./showState";
import { commercialCanMutateCore } from "./commercialOs";
import { characterCanMutateCore } from "./characterOs";

const protectedDomains = ["MJP_CORE", "RNG", "RTP", "WALLET", "LEDGER", "SETTLEMENT", "RULES", "MjpTvManifest"] as const;

describe("P0 · aislamiento de MJP CORE", () => {
  it("declara todos los dominios protegidos en el límite común", () => {
    expect(AGENT_AUTHORITY_BOUNDARY).toEqual(protectedDomains);
  });

  it("rechaza la mutación del núcleo para cada agente registrado", () => {
    expect(AGENT_REGISTRY.length).toBeGreaterThan(0);
    for (const agent of AGENT_REGISTRY) {
      expect(canAgentMutateCore(agent)).toBe(false);
      expect(agent.authorityBoundary).toEqual(protectedDomains);
      expect(["READ_ONLY", "ALERT_ONLY", "PROPOSE_ONLY", "PROJECTION_ONLY"]).toContain(agent.mode);
    }
  });

  it("mantiene los límites críticos incluso ante un agente con metadatos alterados", () => {
    const hostileMetadata = {
      ...AGENT_REGISTRY[0],
      mode: "PROPOSE_ONLY" as const,
      authorityBoundary: [...protectedDomains, "RESULT_OVERRIDE"],
    };
    expect(canAgentMutateCore(hostileMetadata)).toBe(false);
  });

  it("permite únicamente proyección del manifest y no muta su contenido", () => {
    const manifest = createManifestFixture("OPEN");
    const before = JSON.stringify(manifest);

    const show = projectShowState(manifest);
    const answer = orchestrateManifest(manifest);

    expect(JSON.stringify(manifest)).toBe(before);
    expect(show.authoritativeSource).toBe("MJP_CORE");
    expect(show.virtualOnly).toBe(true);
    expect(answer.authority).toBe("MJP_CORE");
    expect(answer.execution).toBe("PROJECTION_ONLY");
  });

  it("garantiza que el Commercial OS no tiene autoridad sobre el núcleo", () => {
    expect(commercialCanMutateCore()).toBe(false);
  });

  it("garantiza que el Character OS no tiene autoridad sobre el núcleo", () => {
    expect(characterCanMutateCore()).toBe(false);
  });

  it("no convierte datos faltantes del núcleo en una afirmación operativa", () => {
    const manifest = createManifestFixture("OPEN");
    const withoutNextEvent = {
      ...manifest,
      nextEvent: { ...manifest.nextEvent, available: false, eventId: null },
    };
    const answer = orchestrateManifest(withoutNextEvent);

    expect(answer.whatHappensNext).toBe("NO DATA");
    expect(answer.authority).toBe("MJP_CORE");
    expect(answer.execution).toBe("PROJECTION_ONLY");
  });
});
