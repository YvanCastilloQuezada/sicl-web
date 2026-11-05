import { describe, expect, it } from "vitest";
import {
  ETOCriterionWeights,
  evaluateETOQuality,
  type ETOCriterion,
  type ETOQualityReview,
} from "./arkiEtoQualityReview";

const criteria = Object.keys(ETOCriterionWeights) as ETOCriterion[];
const completeReview = (overrides: Partial<ETOQualityReview> = {}): ETOQualityReview => ({
  reviewId: "ETO-REVIEW-001",
  projectRef: "OECE:PROJECT:001",
  sourceRef: "OECE:DOCUMENT:ETO-001",
  sourceSha256: "a".repeat(64),
  assessments: criteria.map(criterion => ({
    criterion,
    points: ETOCriterionWeights[criterion],
    evidenceRefs: [`evidence:${criterion.toLowerCase()}`],
    rationale: `Revisión documentada de ${criterion}`,
    reviewerId: "reviewer-01",
    reviewedAt: "2026-11-01T10:00:00Z",
  })),
  hardFails: [],
  copyPasteSignals: [],
  humanDecision: "ACCEPT_REFERENCE",
  reviewerId: "reviewer-01",
  reviewedAt: "2026-11-01T10:00:00Z",
  ...overrides,
});

describe("ETO evidence-led quality review", () => {
  it("scores only a complete set of evidence-backed criteria", () => {
    expect(evaluateETOQuality(completeReview()))
      .toMatchObject({ status: "REVIEWED", score: 100, class: "HIGH_QUALITY_REFERENCE" });
  });

  it("keeps missing criteria UNKNOWN instead of assigning zero", () => {
    const review = completeReview({ assessments: completeReview().assessments.slice(0, 5) });
    expect(evaluateETOQuality(review)).toMatchObject({
      status: "INCOMPLETE_UNKNOWN",
      score: null,
      class: "NOT_CLASSIFIED",
      missingCriteria: ["EXECUTION_OUTCOMES"],
    });
  });

  it("rejects a hard-fail case independently of its numeric score", () => {
    expect(evaluateETOQuality(completeReview({
      hardFails: ["MAJOR_TECHNICAL_INCOMPATIBILITY"],
    }))).toMatchObject({ status: "REJECTED_HARD_FAIL", score: null, class: "REJECTED" });
  });

  it("does not treat unreviewed copy-paste signals as proven duplication", () => {
    expect(evaluateETOQuality(completeReview({
      copyPasteSignals: [{
        signal: "DRAWING_SIMILARITY",
        referenceProjectRef: "OECE:PROJECT:OTHER",
        evidenceRef: "comparison:drawings:01",
        humanDisposition: "UNREVIEWED",
      }],
    })).status).toBe("INCOMPLETE_UNKNOWN");
  });

  it("allows a reviewer to classify a legitimate standard solution", () => {
    expect(evaluateETOQuality(completeReview({
      copyPasteSignals: [{
        signal: "TEXT_SIMILARITY",
        referenceProjectRef: "OECE:PROJECT:STANDARD",
        evidenceRef: "comparison:text:01",
        humanDisposition: "LEGITIMATE_STANDARD_SOLUTION",
      }],
    })).status).toBe("REVIEWED");
  });

  it("does not claim a reviewed score is approved when human decision is pending", () => {
    expect(evaluateETOQuality(completeReview({ humanDecision: "PENDING" })))
      .toMatchObject({ status: "PENDING_HUMAN_DECISION", score: 100, class: "NOT_CLASSIFIED" });
  });

  it("rejects criterion scores above their documented weight", () => {
    const review = completeReview();
    review.assessments[0] = { ...review.assessments[0], points: ETOCriterionWeights[review.assessments[0].criterion] + 1 };
    expect(() => evaluateETOQuality(review)).toThrow();
  });

  it("rejects duplicate criterion assessments", () => {
    const review = completeReview();
    review.assessments[1] = { ...review.assessments[1], criterion: review.assessments[0].criterion };
    expect(() => evaluateETOQuality(review)).toThrow();
  });
});
