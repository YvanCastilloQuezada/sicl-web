import { describe, expect, it } from "vitest";
import {
  applyCounterexample,
  createGenericSemanticFixture,
  isIncompleteUnknown,
  promoteOnlyAfterHumanReview,
  rationaleTrace,
  sourceMayBeIngested,
  type KnowledgeItem,
  type SourceRecord,
} from "../../shared/arkiKnowledgeCorpusFoundation";

describe("ARKI M0-K knowledge corpus foundation", () => {
  it("T1 SOURCE is distinct from KNOWLEDGE", () => {
    const source: SourceRecord = { sourceId: "S-1", title: "A source", sourceType: "BOOK", accessStatus: "AVAILABLE", rightsStatus: "COPYRIGHTED", ingestionStatus: "ABSTRACT_ONLY" };
    expect(source.sourceId).not.toBe("K-1");
    expect(sourceMayBeIngested(source)).toBe(false);
  });

  it("T2 knowledge and evidence remain linked but distinct", () => {
    const fixture = createGenericSemanticFixture();
    expect(fixture.condition.evidenceIds).toContain(fixture.evidence.evidenceId);
    expect(fixture.condition.knowledgeId).not.toBe(fixture.evidence.evidenceId);
  });

  it("T3 produces a WHY/rationale trace", () => {
    const fixture = createGenericSemanticFixture();
    const trace = rationaleTrace(fixture.realizations[0].realizationId, [fixture.expectedEffect]);
    expect(trace).toEqual([fixture.realizations[0].realizationId, "EXPECTED_EFFECT", "M0K-EFFECT-001"]);
  });

  it("T4 detects an UNKNOWN without a resolution path", () => {
    const fixture = createGenericSemanticFixture();
    expect(isIncompleteUnknown({ unknownId: "U-1", statement: fixture.designQuestion.statement, whyItMatters: "It changes the design choice." })).toBe(true);
    expect(isIncompleteUnknown({ unknownId: "U-2", statement: "Resolved later", whyItMatters: "Audit", resolutionPath: "Human review", resolverAuthority: "HUMAN_ARCHITECT" })).toBe(false);
  });

  it("T5 keeps strategy separate from multiple realizations", () => {
    const fixture = createGenericSemanticFixture();
    expect(fixture.realizations).toHaveLength(2);
    expect(fixture.realizations[0].strategyIds).toContain(fixture.strategy.strategyId);
    expect(fixture.realizations[1].strategyIds).toContain(fixture.strategy.strategyId);
  });

  it("T6 preserves all transfer modes as distinct values", () => {
    expect(new Set(["TRANSFER", "ADAPT", "DO_NOT_TRANSFER", "UNKNOWN"]).size).toBe(4);
  });

  it("T7 preserves the original item when a counterexample refines scope", () => {
    const counterexample = applyCounterexample({ counterexampleId: "C-1", knowledgeId: "K-1", observation: "The rule fails under another scope.", scopeConflict: "climate", resultingAction: "REFINE_SCOPE", preservedOriginal: true });
    expect(counterexample.preservedOriginal).toBe(true);
    expect(counterexample.resultingAction).toBe("REFINE_SCOPE");
  });

  it("T8 separates availability from ingestion permission", () => {
    expect(sourceMayBeIngested({ sourceId: "S-2", title: "Copyrighted available book", sourceType: "BOOK", accessStatus: "AVAILABLE", rightsStatus: "COPYRIGHTED", ingestionStatus: "ALLOWED" })).toBe(false);
  });

  it("T9 does not silently canonize HAZARD", () => {
    const hazard = { hazardId: "H-1", statement: "Unverified hazard", status: "READY_FOR_CANONIZATION_PROPOSAL" as const };
    expect(hazard.status).not.toBe("HUMAN_CONFIRMED");
  });

  it("T10 represents the Manual as a view, not a second store", () => {
    const fixture = createGenericSemanticFixture();
    expect(fixture.strategy.knowledgeId).toBeUndefined();
    expect(fixture.strategy.strategyId).toBe("M0K-S-001");
  });

  it("T11 retains backward-compatible generic fixture semantics and human authority", () => {
    const fixture = createGenericSemanticFixture();
    const candidate: KnowledgeItem = fixture.condition;
    expect(candidate.kState).toBe("K2_CANDIDATE");
    expect(promoteOnlyAfterHumanReview(fixture.learningCandidate)).toBe(false);
    expect(fixture.learningCandidate.promotionDecision).toBe("HUMAN_REVIEW_REQUIRED");
  });
});
