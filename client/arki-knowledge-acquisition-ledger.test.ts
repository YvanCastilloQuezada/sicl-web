import { describe, expect, it } from "vitest";
import { buildHouseKnowledgeAcquisitionLedger, runKnowledgeAcquisitionLedgerNegativeControls, validateKnowledgeAcquisitionLedger } from "./src/components/arkiKnowledgeAcquisitionLedger";

describe("ARKI knowledge acquisition ledger", () => {
  it("connects curriculum evidence to A21 semantics without claiming geometry", () => {
    const ledger = buildHouseKnowledgeAcquisitionLedger();
    expect(validateKnowledgeAcquisitionLedger(ledger)).toBe(true);
    expect(ledger.designEvidenceStatus).toBe("SEMANTIC_TRACE_ONLY");
    expect(ledger.traces[0].maturity).toBe("PRACTICED_WITH_OBSERVATIONS");
    expect(ledger.traces[0].activityRefs.length).toBeGreaterThan(0);
    expect(ledger.traces[0].relationshipRefs.length).toBeGreaterThan(0);
    expect(ledger.traces[0].partiRefs.length).toBeGreaterThan(0);
    expect(ledger.traces[0].topologyRefs.length).toBeGreaterThanOrEqual(3);
    expect(ledger.traces[0].geometryRefs).toEqual([]);
  });

  it("preserves uncertainty and blocks automatic authority", () => {
    expect(runKnowledgeAcquisitionLedgerNegativeControls()).toEqual({
      noGeometryClaim: true,
      unknownPreserved: true,
      contradictionPreserved: true,
      humanAuthorityPreserved: true,
      automaticPromotionBlocked: true,
      automaticDecisionBlocked: true,
    });
  });
});
