import { describe, expect, it } from "vitest";
import { deriveArquiWorkflow, routeArquiGoal } from "./arquiWorkflow";

const base = { alternatives: 1, photos: 1, pendingReview: 2, locationRegistered: false };

describe("ARQUI P6 workflow", () => {
  it("maps bounded goals without inventing capabilities", () => {
    expect(routeArquiGoal("Quiero comparar mis alternativas.")).toBe("COMPARE_ALTERNATIVES");
    expect(routeArquiGoal("Quiero revisar lo que detectó la IA.")).toBe("REVIEW_VISUAL_EVIDENCE");
    expect(routeArquiGoal("Quiero ver el diseño en el terreno.")).toBe("PREPARE_REGISTERED_AR_VIEW");
    expect(routeArquiGoal("Quiero hacer magia cuántica.")).toBe("UNKNOWN_GOAL");
  });
  it("reuses P5 readiness for a blocked comparison", () => {
    const workflow = deriveArquiWorkflow("COMPARE_ALTERNATIVES", base);
    expect(workflow.currentStep?.capabilityId).toBe("COMPARISON");
    expect(workflow.currentStep?.readiness).toBe("BLOCKED");
    expect(workflow.currentStep?.action?.target).toBe("alternatives");
  });
  it("refreshes blocked to ready after human state change", () => {
    const ready = deriveArquiWorkflow("COMPARE_ALTERNATIVES", { ...base, alternatives: 2 });
    expect(ready.currentStep?.readiness).toBe("READY");
    expect(ready.currentStep?.action?.target).toBe("comparisons");
  });
  it("keeps unknown goals safe and does not auto-run tools", () => {
    const workflow = deriveArquiWorkflow("UNKNOWN_GOAL", base);
    expect(workflow.unknown).toBe(true);
    expect(workflow.steps).toHaveLength(0);
  });
});
