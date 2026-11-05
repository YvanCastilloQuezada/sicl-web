import { z } from "zod";

/**
 * Evidence-led review record for technical-expedient references.
 * This is a curation gate, not an automated technical approval engine.
 */
export const ETOCriterionSchema = z.enum([
  "ARCHITECTURE_FUNCTIONAL",
  "INTERDISCIPLINARY_COHERENCE",
  "QUANTITIES_BUDGET_APU",
  "STUDIES_CALCULATIONS",
  "INTEGRITY_TRACEABILITY",
  "EXECUTION_OUTCOMES",
]);
export type ETOCriterion = z.infer<typeof ETOCriterionSchema>;

export const ETOCriterionWeights: Readonly<Record<ETOCriterion, number>> = Object.freeze({
  ARCHITECTURE_FUNCTIONAL: 20,
  INTERDISCIPLINARY_COHERENCE: 20,
  QUANTITIES_BUDGET_APU: 20,
  STUDIES_CALCULATIONS: 15,
  INTEGRITY_TRACEABILITY: 10,
  EXECUTION_OUTCOMES: 15,
});

export const ETOHardFailSchema = z.enum([
  "WRONG_PROJECT_OR_UNRELATED_DOCUMENTS",
  "MAJOR_TECHNICAL_INCOMPATIBILITY",
  "ESSENTIAL_COMPONENTS_MISSING",
  "UNVERIFIABLE_SOURCE_OR_INTEGRITY",
  "MATERIAL_COPY_PASTE_WITHOUT_TERRITORIAL_ADAPTATION",
]);
export type ETOHardFail = z.infer<typeof ETOHardFailSchema>;

export const ETOCriterionAssessmentSchema = z.object({
  criterion: ETOCriterionSchema,
  points: z.number().finite().nonnegative(),
  evidenceRefs: z.array(z.string().trim().min(1)).min(1),
  rationale: z.string().trim().min(1),
  reviewerId: z.string().trim().min(1),
  reviewedAt: z.string().datetime({ offset: true }),
}).strict().superRefine((assessment, ctx) => {
  const maximum = ETOCriterionWeights[assessment.criterion];
  if (assessment.points > maximum) {
    ctx.addIssue({ code: "custom", path: ["points"], message: `ETO_CRITERION_MAX_EXCEEDED:${maximum}` });
  }
});

export const ETOQualityReviewSchema = z.object({
  reviewId: z.string().trim().min(1),
  projectRef: z.string().trim().min(1),
  sourceRef: z.string().trim().min(1),
  sourceSha256: z.string().regex(/^[a-f0-9]{64}$/i),
  assessments: z.array(ETOCriterionAssessmentSchema),
  hardFails: z.array(ETOHardFailSchema),
  copyPasteSignals: z.array(z.object({
    signal: z.enum(["TEXT_SIMILARITY", "DRAWING_SIMILARITY", "BUDGET_PATTERN_SIMILARITY", "TERRITORIAL_MISMATCH"]),
    referenceProjectRef: z.string().trim().min(1),
    evidenceRef: z.string().trim().min(1),
    humanDisposition: z.enum(["UNREVIEWED", "LEGITIMATE_STANDARD_SOLUTION", "UNADAPTED_DUPLICATION", "INCONCLUSIVE"]),
  }).strict()),
  humanDecision: z.enum(["PENDING", "ACCEPT_REFERENCE", "ACCEPT_CASE_STUDY", "REJECT"]),
  reviewerId: z.string().trim().min(1),
  reviewedAt: z.string().datetime({ offset: true }),
}).strict().superRefine((review, ctx) => {
  const seen = new Set<string>();
  for (const assessment of review.assessments) {
    if (seen.has(assessment.criterion)) {
      ctx.addIssue({ code: "custom", path: ["assessments"], message: `ETO_DUPLICATE_CRITERION:${assessment.criterion}` });
    }
    seen.add(assessment.criterion);
  }
});

export type ETOQualityReview = z.infer<typeof ETOQualityReviewSchema>;

export type ETOQualityResult = {
  status: "REJECTED_HARD_FAIL" | "INCOMPLETE_UNKNOWN" | "PENDING_HUMAN_DECISION" | "REVIEWED";
  score: number | null;
  class: "HIGH_QUALITY_REFERENCE" | "USEFUL_REFERENCE" | "CASE_STUDY" | "REJECTED" | "NOT_CLASSIFIED";
  missingCriteria: ETOCriterion[];
  hardFails: ETOHardFail[];
  copyPasteReviewRequired: boolean;
  humanDecision: ETOQualityReview["humanDecision"];
};

const allCriteria = Object.keys(ETOCriterionWeights) as ETOCriterion[];

/**
 * Scores only complete, evidence-backed human assessments. Missing criteria
 * remain UNKNOWN; they are never silently converted to zero.
 */
export function evaluateETOQuality(input: ETOQualityReview): ETOQualityResult {
  const review = ETOQualityReviewSchema.parse(input);
  const assessed = new Set(review.assessments.map(item => item.criterion));
  const missingCriteria = allCriteria.filter(criterion => !assessed.has(criterion));
  const copyPasteReviewRequired = review.copyPasteSignals.some(signal =>
    signal.humanDisposition === "UNREVIEWED" || signal.humanDisposition === "INCONCLUSIVE"
  );

  if (review.hardFails.length) {
    return {
      status: "REJECTED_HARD_FAIL",
      score: null,
      class: "REJECTED",
      missingCriteria,
      hardFails: review.hardFails,
      copyPasteReviewRequired,
      humanDecision: review.humanDecision,
    };
  }

  if (missingCriteria.length || copyPasteReviewRequired) {
    return {
      status: "INCOMPLETE_UNKNOWN",
      score: null,
      class: "NOT_CLASSIFIED",
      missingCriteria,
      hardFails: [],
      copyPasteReviewRequired,
      humanDecision: review.humanDecision,
    };
  }

  const score = review.assessments.reduce((sum, assessment) => sum + assessment.points, 0);
  if (review.humanDecision === "PENDING") {
    return {
      status: "PENDING_HUMAN_DECISION",
      score,
      class: "NOT_CLASSIFIED",
      missingCriteria: [],
      hardFails: [],
      copyPasteReviewRequired: false,
      humanDecision: review.humanDecision,
    };
  }

  const scoreClass = score >= 85 ? "HIGH_QUALITY_REFERENCE"
    : score >= 70 ? "USEFUL_REFERENCE"
      : score >= 50 ? "CASE_STUDY"
        : "REJECTED";
  const acceptedClass = review.humanDecision === "REJECT" ? "REJECTED"
    : review.humanDecision === "ACCEPT_CASE_STUDY" ? "CASE_STUDY"
      : scoreClass;
  return {
    status: "REVIEWED",
    score,
    class: acceptedClass,
    missingCriteria: [],
    hardFails: [],
    copyPasteReviewRequired: false,
    humanDecision: review.humanDecision,
  };
}
