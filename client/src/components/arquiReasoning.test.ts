import { describe, expect, it } from "vitest";
import { deriveArchitecturalReasoning, resolveDesignSubject } from "./arquiReasoning";

describe("ARQUI P7 architectural reasoning", () => {
  it("requires an explicit subject", () => {
    const result = deriveArchitecturalReasoning({ question: "¿Qué está pasando?", alternatives: [] });
    expect(result.subject).toBe("UNRESOLVED");
    expect(result.unknowns[0].epistemicClass).toBe("UNKNOWN");
  });
  it("compares A/B without creating a winner", () => {
    const result = deriveArchitecturalReasoning({ question: "¿En qué se diferencian A y B?", alternatives: [
      { alternative_id: "A", parameters: { height: 3, gap: 2 } },
      { alternative_id: "B", parameters: { height: 4, gap: 2 } },
    ] });
    expect(resolveDesignSubject({ question: "comparar A y B", alternatives: [{}, {}] })).toBe("A + B");
    expect(result.computed[0].epistemicClass).toBe("COMPUTED");
    expect(result.interpretations[0].epistemicClass).toBe("INTERPRETATION");
    expect(result.winnerCreated).toBe(false);
    expect(result.decisionCreated).toBe(false);
    expect(result.unknowns.length).toBeGreaterThan(0);
  });
  it("keeps knowledge as interpretation and marks downstream effects unknown", () => {
    const result = deriveArchitecturalReasoning({ question: "¿Qué podría explorar en el courtyard?", selectedSubject: "courtyard", hasGeometry: true, hasKnowledge: true });
    expect(result.interpretations.some((item) => item.basis.includes("DESIGN_KNOWLEDGE"))).toBe(true);
    expect(result.hypotheses[0].epistemicClass).toBe("HYPOTHESIS");
    expect(result.unknowns.some((item) => item.text.includes("Downstream"))).toBe(true);
    expect(result.availableActions).toHaveLength(1);
  });
  it("does not claim geometry when geometry is unavailable", () => {
    const result = deriveArchitecturalReasoning({ question: "What is happening here?", selectedSubject: "mass", hasGeometry: false });
    expect(result.unknowns[0].epistemicClass).toBe("UNKNOWN");
    expect(result.interpretations).toHaveLength(0);
  });
});
