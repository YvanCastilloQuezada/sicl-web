import { describe, expect, it } from "vitest";
import { isHumanDecisionStatus, isLrciCaseExpired, LRCI_CASE_STATUSES, LRCI_INITIAL_STATUS, normalizeLrciJurisdiction } from "../server/lrciReviewCases";

describe("LRCI review case contract", () => {
  it("starts every new case in professional review", () => {
    expect(LRCI_INITIAL_STATUS).toBe("REQUIRES_PROFESSIONAL_REVIEW");
  });

  it("normalizes jurisdiction without inventing a country", () => {
    expect(normalizeLrciJurisdiction(" pe ")).toBe("PE");
    expect(normalizeLrciJurisdiction("es-PE")).toBe("ES-PE");
  });

  it("only human approval or rejection counts as a human decision", () => {
    expect(isHumanDecisionStatus("HUMAN_APPROVED")).toBe(true);
    expect(isHumanDecisionStatus("REJECTED")).toBe(true);
    expect(isHumanDecisionStatus("POLICY_BLOCKED")).toBe(false);
  });

  it("detects an expired case at the exact expiry instant", () => {
    const now = new Date("2026-08-27T18:00:00.000Z");
    expect(isLrciCaseExpired(new Date("2026-08-27T17:59:59.000Z"), now)).toBe(true);
    expect(isLrciCaseExpired(now, now)).toBe(true);
    expect(isLrciCaseExpired(new Date("2026-08-27T18:00:01.000Z"), now)).toBe(false);
    expect(isLrciCaseExpired(null, now)).toBe(false);
  });

  it("keeps the contract status set explicit and finite", () => {
    expect(LRCI_CASE_STATUSES).toEqual(["NO_DATA", "TECHNICAL_CONTROL_ONLY", "REQUIRES_PROFESSIONAL_REVIEW", "POLICY_BLOCKED", "SOURCE_EXPIRED", "HUMAN_APPROVED", "REJECTED"]);
  });
});
