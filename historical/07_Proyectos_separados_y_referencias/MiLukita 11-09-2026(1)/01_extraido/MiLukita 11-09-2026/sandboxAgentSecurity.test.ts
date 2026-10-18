import { describe, expect, it } from "vitest";
import { evaluateAutonomyAction, isAuthoritativeAction } from "./autonomyEngine";
import { enterContingency, advanceContingency, resolveContingency } from "./contingencyEngine";
import { contentCanChangeOfficialState, renderSafeContent } from "./contentEngine";
import { createFinancialProposal } from "./financialIntelligence";
import { createExperienceProposal, scoreExperience } from "./experienceDirector";
import { distributionCanPublish, detectScheduleConflicts } from "./distributionOs";

 describe("Sandbox · auditoría auto-adversarial de agentes", () => {
  it("bloquea acciones autoritativas y toda acción autónoma bajo Kill Switch", () => {
    expect(isAuthoritativeAction("MODIFY_RESULT")).toBe(true);
    expect(isAuthoritativeAction("MODIFY_RTP")).toBe(true);
    expect(evaluateAutonomyAction("AUTONOMOUS", "OPEN_EVENT", "STOPPED").allowed).toBe(false);
    expect(evaluateAutonomyAction("AUTONOMOUS", "PUBLISH_CONTENT", "STOPPED").allowed).toBe(false);
  });

  it("conserva la autoridad del resultado durante una contingencia y no inventa uno", () => {
    const entered = enterContingency("TV_CLIENT", { eventId: "P0-EVENT", status: "DRAWING", gameName: "Lotería 39", result: null, verified: false, capturedAt: 1 });
    const fallback = advanceContingency(entered, "FALLBACK");
    expect(entered.resultAuthorityPreserved).toBe(true);
    expect(fallback.step).toBe("FALLBACK");
    expect(resolveContingency().mode).toBe("NORMAL");
  });

  it("rechaza que Content Agent cambie el estado oficial", () => {
    expect(contentCanChangeOfficialState()).toBe(false);
    expect(renderSafeContent({ gameName: "Lotería 39", state: "DRAWING", resultAvailable: false, virtualOnly: true }).source).toBe("SAFE_FALLBACK");
  });

  it("mantiene propuestas financieras y de experiencia en modo no autoritativo", () => {
    const finance = createFinancialProposal("Escenario sin datos", "No hay datos reales suficientes", "No ejecutar; requiere revisión profesional");
    const experience = createExperienceProposal({ id: "P0-FINDING", area: "QR", priority: "P1", problem: "No hay telemetría", evidence: "NO_DATA", impact: "No medible", recommendation: "Solicitar evidencia", dependency: "Datos reales", effort: "SMALL" });
    const experienceScore = scoreExperience({}, "UNAVAILABLE");
    expect(finance.requiresHumanApproval).toBe(true);
    expect(finance.executeAllowed).toBe(false);
    expect(experience.requiresHumanApproval).toBe(true);
    expect(experience.autoDesignAllowed).toBe(false);
    expect(experience.autoDeployAllowed).toBe(false);
    expect(experienceScore.total).toBeNull();
  });

  it("bloquea distribución cuando existen conflictos críticos o canales bloqueados", () => {
    const conflicts = detectScheduleConflicts([{ eventId: "E1", startAt: "2026-08-27T12:00:00Z", endAt: "2026-08-27T12:10:00Z", qrEventId: "QR-E1", contingency: true, nextEventId: "E2" }, { eventId: "E2", startAt: "2026-08-27T12:05:00Z", endAt: "2026-08-27T12:15:00Z", qrEventId: "QR-E2", contingency: true, nextEventId: null }]);
    expect(conflicts.some(conflict => conflict.severity === "CRITICAL")).toBe(true);
    expect(distributionCanPublish([{ channelId: "test", name: "Test", status: "BLOCKED", notes: "P0" }], conflicts)).toBe(false);
  });
});
