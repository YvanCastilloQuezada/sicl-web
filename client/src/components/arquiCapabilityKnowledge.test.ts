import { describe, expect, it } from "vitest";
import { answerCapabilityQuestion, deriveCapabilityKnowledge } from "./arquiCapabilityKnowledge";

describe("ARQUI P8 capability self-knowledge", () => {
  const empty = { alternatives: 1, photos: 0, pendingReview: 0, locationRegistered: false, hasAnalysis: false };
  it("reuses P5 readiness and blocks comparison with one alternative", () => {
    const knowledge = deriveCapabilityKnowledge(empty);
    const comparison = knowledge.descriptors.find((item) => item.id === "COMPARISON");
    expect(comparison?.availability).toBe("IMPLEMENTED_WITH_LIMITATIONS");
    expect(comparison?.readiness).toBe("BLOCKED");
    expect(comparison?.requiredInputs).toEqual(["at least two alternatives"]);
  });
  it("reports photo capability as blocked without photo", () => {
    const answer = answerCapabilityQuestion("Can you analyze this photo?", empty);
    expect(answer.kind).toBe("CAPABILITY");
    expect(answer.descriptor?.id).toBe("VISUAL_FIELD_INTELLIGENCE");
    expect(answer.descriptor?.readiness).toBe("BLOCKED");
    expect(answer.descriptor?.epistemicOutputs).toContain("AI_PROPOSED");
  });
  it("distinguishes capability knowledge from execution authority", () => {
    const answer = answerCapabilityQuestion("Can you do it for me and change the height?", { ...empty, alternatives: 2 });
    expect(answer.kind).toBe("EXECUTION");
    expect(answer.textKey).toBe("arqui.capability_execution_not_authorized");
  });
  it("returns a bounded workflow for review questions", () => {
    const answer = answerCapabilityQuestion("How do I review AI observations?", { ...empty, photos: 1, pendingReview: 2 });
    expect(answer.kind).toBe("WORKFLOW");
    expect(answer.descriptor?.id).toBe("HUMAN_REVIEW");
    expect(answer.descriptor?.humanAuthorityLevel).toBe("HUMAN_ONLY");
  });
  it("answers generic self-knowledge without exposing a false catalogue", () => {
    const answer = answerCapabilityQuestion("What can you do?", empty);
    expect(answer.kind).toBe("CAPABILITY");
    expect(answer.textKey).toBe("arqui.capability_catalog_answer");
    expect(Number(answer.params?.count)).toBeGreaterThan(0);
  });
});
