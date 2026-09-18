import { describe, expect, it } from "vitest";
import { routeArquiQuestion } from "./arquiDialogue";

const context = { photos: 4, pendingReview: 2, confirmed: 1, totalEvidence: 6, locationRegistered: true, alternatives: 3, hasAnalysis: true, workContext: "DESIGN" };

describe("ARQUI P3 intent routing", () => {
  it("answers project state deterministically", () => {
    const result = routeArquiQuestion("¿Qué tenemos pendiente?", context);
    expect(result.intent).toBe("PROJECT_STATE_QUERY");
    expect(result.answerParams).toEqual({ count: 2 });
    expect(result.basis).toBe("PROJECT_EVIDENCE");
  });
  it("offers navigation without executing it", () => {
    const result = routeArquiQuestion("Muéstrame las alternativas", context);
    expect(result.intent).toBe("NAVIGATION_QUERY");
    expect(result.action?.target).toBe("alternatives");
  });
  it("routes knowledge questions to the existing knowledge capability", () => {
    const result = routeArquiQuestion("¿Por qué es importante registrar el acceso?", context);
    expect(result.intent).toBe("KNOWLEDGE_QUERY");
    expect(result.basis).toBe("DESIGN_KNOWLEDGE");
  });
  it("preserves unknown instead of inventing", () => {
    const result = routeArquiQuestion("¿Quién ganará?", context);
    expect(result.intent).toBe("UNKNOWN_QUERY");
    expect(result.action).toBeUndefined();
  });
});
