import { describe, expect, it } from "vitest";
import { evaluateAutonomyAction, isAuthoritativeAction } from "./autonomyEngine";
import { advanceContingency, enterContingency, resolveContingency } from "./contingencyEngine";
import { contentCanChangeOfficialState, renderSafeContent } from "./contentEngine";
import { approveSchedule, publishSchedule, proposeSchedule } from "../server/schedulerEngine";

describe("Orden 25 — motores seguros", () => {
  it("bloquea autonomía con Kill Switch y nunca permite acciones autoritativas", () => {
    expect(evaluateAutonomyAction("AUTONOMOUS", "OPEN_EVENT", "STOPPED").allowed).toBe(false);
    expect(isAuthoritativeAction("MODIFY_RESULT")).toBe(true);
    expect(isAuthoritativeAction("OPEN_EVENT")).toBe(false);
  });

  it("usa fallback seguro cuando no hay contenido primario", () => {
    const content = renderSafeContent({ gameName: "Lotería 39", state: "DRAWING", resultAvailable: false, virtualOnly: true });
    expect(content.source).toBe("SAFE_FALLBACK");
    expect(contentCanChangeOfficialState()).toBe(false);
  });

  it("conserva el resultado confirmado durante una contingencia y permite recuperar", () => {
    const state = enterContingency("TV_CLIENT", { eventId: "E-1", status: "DRAWING", gameName: "Lotería 39", result: null, verified: false, capturedAt: 1 });
    expect(state.resultAuthorityPreserved).toBe(true);
    expect(advanceContingency(state, "FALLBACK").step).toBe("FALLBACK");
    expect(resolveContingency().mode).toBe("NORMAL");
  });

  it("exige aprobación humana antes de publicar un programa", () => {
    const draft = proposeSchedule([{ gameId: "loteria_39", title: "Lotería 39", frequencyPerWeek: 1, durationMinutes: 5, priority: "HIGH", primeTime: true, minGapMinutes: 5, category: "lottery", rulesetValid: true, rtpValidated: true, experienceComplete: true, contingencyConfigured: true, contentConfigured: true, tvConfigured: true, mobileConfigured: true, resourcesAvailable: true }], 0, 1);
    expect(draft.publicationState).toBe("DRAFT");
    const approved = approveSchedule(draft, "operator-1");
    expect(approved.publicationState).toBe("APPROVED");
    expect(publishSchedule(approved, "operator-1").published).toBe(true);
  });
});
