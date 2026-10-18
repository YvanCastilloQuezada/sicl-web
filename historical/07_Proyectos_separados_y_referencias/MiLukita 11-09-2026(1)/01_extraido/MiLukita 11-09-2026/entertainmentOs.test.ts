import { describe, expect, it } from "vitest";
import { buildPresentationDecision, CHAOS_SCENARIOS, ENTERTAINMENT_OS_AGENT_PERMISSIONS, isAuthoritativeField } from "./entertainmentOs";

describe("Entertainment OS contracts", () => {
  it("limits presentation decisions to context and never produces an authoritative result", () => {
    const decision = buildPresentationDecision({ eventId: "TRIVIA_DEMO-001", currentState: "LIVE", lukitaState: "PRESENTING" });
    expect(decision.showLukita).toBe(true);
    expect(decision.authority).toBe("PRESENTATION_ONLY");
    expect(decision.result).toBeNull();
    expect(decision.eventId).toBe("TRIVIA_DEMO-001");
  });

  it("safe-stops presentation during PAUSED and STOPPED states", () => {
    for (const currentState of ["PAUSED", "STOPPED"] as const) {
      const decision = buildPresentationDecision({ eventId: "TRIVIA_DEMO-002", currentState, lukitaState: "PRESENTING" });
      expect(decision.showLukita).toBe(false);
      expect(decision.contentKey).toBe("safe-idle");
      expect(decision.result).toBeNull();
    }
  });

  it("defines explicit agent permissions and blocks authoritative fields", () => {
    expect(Object.keys(ENTERTAINMENT_OS_AGENT_PERMISSIONS)).toHaveLength(5);
    expect(ENTERTAINMENT_OS_AGENT_PERMISSIONS.AUDITOR.modifyResult).toBe(false);
    expect(ENTERTAINMENT_OS_AGENT_PERMISSIONS.WATCHDOG.alert).toBe(true);
    expect(ENTERTAINMENT_OS_AGENT_PERMISSIONS.LUKITA_DIRECTOR.propose).toBe(true);
    for (const field of ["rng", "rules", "result", "rtp", "wallet", "credits", "ledger", "liquidation", "mjpTvManifest"]) {
      expect(isAuthoritativeField(field)).toBe(true);
    }
  });

  it("keeps the controlled chaos scenario catalog explicit", () => {
    expect(CHAOS_SCENARIOS).toContain("QR_FAIL");
    expect(CHAOS_SCENARIOS).toContain("DATABASE_FAIL");
    expect(CHAOS_SCENARIOS).toContain("HEARTBEAT_FAIL");
    expect(CHAOS_SCENARIOS).toHaveLength(11);
  });
});
