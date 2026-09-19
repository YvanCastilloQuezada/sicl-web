import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { synthesizeV62ContextualStrategies } from "./arkiV62StrategyKnowledge";

describe("D6.3 candidate synthesis", () => {
  it("maps contextual strategies to design moves and composed operators", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const result = synthesizeD63Candidates(d62.synthesis.contextualStrategies);
    expect(result.gate).toBe("PASS");
    expect(result.l6).toBe("DEMONSTRATED");
    expect(result.candidates.length).toBe(result.contextualStrategies);
    expect(result.designMoves.every((move) => move.noAutomaticDecision && move.provenance.length > 0)).toBe(true);
    expect(result.candidates.every((candidate) => candidate.geometryMutation === "NOT_EXECUTED")).toBe(true);
  });

  it("preserves rejection when contextual provenance or epistemic status is invalid", () => {
    const contextual = synthesizeV62ContextualStrategies(D62_GENERIC_FIXTURE).contextualStrategies;
    const result = synthesizeD63Candidates([{ ...contextual[0], epistemicStatus: "SUPPORTED" as never, provenance: [] }]);
    expect(result.gate).toBe("BLOCKED");
    expect(result.rejected[0].reason).toContain("PROVENANCE_OR_STATE");
  });

  it("is structural rather than dispatched by typology label", () => {
    const hospital = synthesizeV62ContextualStrategies({ ...D62_GENERIC_FIXTURE, conditionTags: [...D62_GENERIC_FIXTURE.conditionTags, "label:hospital"] });
    const restaurant = synthesizeV62ContextualStrategies({ ...D62_GENERIC_FIXTURE, conditionTags: [...D62_GENERIC_FIXTURE.conditionTags, "label:restaurant"] });
    const a = synthesizeD63Candidates(hospital.contextualStrategies);
    const b = synthesizeD63Candidates(restaurant.contextualStrategies);
    expect(a.candidates.map((candidate) => candidate.designMove.operators[0].operation)).toEqual(b.candidates.map((candidate) => candidate.designMove.operators[0].operation));
  });
});
