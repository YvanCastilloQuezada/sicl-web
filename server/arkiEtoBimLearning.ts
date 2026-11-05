import { z } from "zod";

/**
 * Experiment registry linking curated public technical-expedient evidence to
 * governed CAD → BIM → federated IFC validation. It records experiments;
 * it does not convert files or certify model equivalence.
 */
export const ETOBimSourceFormatSchema = z.enum(["DWG", "DXF", "DGN", "IFC", "RVT", "PDF", "IMAGE", "OTHER"]);
export const ETOBimTargetFormatSchema = z.enum(["ARK", "IFC4", "IFC4X3", "FEDERATED_IFC"]);
export const ETOBimStageSchema = z.enum([
  "SOURCE_INTAKE",
  "SOURCE_INTEGRITY_CHECK",
  "CAD_GEOMETRY_EXTRACTION",
  "SEMANTIC_CLASSIFICATION",
  "BIM_ELEMENT_MAPPING",
  "DISCIPLINE_MODEL_BUILD",
  "FEDERATION",
  "CLASH_REVIEW",
  "ROUND_TRIP_VALIDATION",
  "HUMAN_ACCEPTANCE",
]);
export const ETOBimStageStatusSchema = z.enum([
  "NOT_STARTED",
  "BLOCKED",
  "RUNNING",
  "PASS",
  "PASS_WITH_ISSUES",
  "FAIL",
  "UNKNOWN",
]);

export const ETOBimArtifactSchema = z.object({
  artifactId: z.string().trim().min(1),
  role: z.enum(["SOURCE", "INTERMEDIATE", "DISCIPLINE_MODEL", "FEDERATED_MODEL", "VALIDATION_REPORT"]),
  format: z.union([ETOBimSourceFormatSchema, ETOBimTargetFormatSchema]),
  sourceRef: z.string().trim().min(1),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i),
  byteSize: z.number().int().nonnegative(),
  units: z.string().trim().min(1),
  coordinateSystem: z.string().trim().min(1),
  discipline: z.string().trim().min(1).optional(),
  modelVersion: z.string().trim().min(1),
}).strict();

export const ETOBimStageEvidenceSchema = z.object({
  stage: ETOBimStageSchema,
  status: ETOBimStageStatusSchema,
  observedAt: z.string().datetime({ offset: true }),
  toolName: z.string().trim().min(1).optional(),
  toolVersion: z.string().trim().min(1).optional(),
  inputArtifactIds: z.array(z.string().trim().min(1)),
  outputArtifactIds: z.array(z.string().trim().min(1)),
  evidenceRefs: z.array(z.string().trim().min(1)),
  unknowns: z.array(z.string()),
  notes: z.string(),
}).strict().superRefine((stage, ctx) => {
  if (["PASS", "PASS_WITH_ISSUES"].includes(stage.status) && !stage.evidenceRefs.length) {
    ctx.addIssue({ code: "custom", path: ["evidenceRefs"], message: "BIM_STAGE_PASS_REQUIRES_EVIDENCE" });
  }
});

export const ETOBimExperimentSchema = z.object({
  schema: z.literal("ARKI-ETO-BIM-EXPERIMENT-1.0"),
  experimentId: z.string().trim().min(1),
  projectRef: z.string().trim().min(1),
  etoQualityReviewId: z.string().trim().min(1),
  sourceExpedienteRef: z.string().trim().min(1),
  sourceExpedienteSha256: z.string().regex(/^[a-f0-9]{64}$/i),
  typology: z.string().trim().min(1),
  jurisdiction: z.string().trim().min(1),
  sourceArtifacts: z.array(ETOBimArtifactSchema).min(1),
  producedArtifacts: z.array(ETOBimArtifactSchema),
  stages: z.array(ETOBimStageEvidenceSchema),
  targetFormats: z.array(ETOBimTargetFormatSchema).min(1),
  federationModelIds: z.array(z.string().trim().min(1)),
  acceptance: z.enum(["NOT_REVIEWED", "ACCEPTED_FOR_LEARNING", "REJECTED", "REQUIRES_REWORK"]),
  humanReviewer: z.string().trim().min(1).optional(),
  humanReviewedAt: z.string().datetime({ offset: true }).optional(),
}).strict().superRefine((experiment, ctx) => {
  const ids = new Set<string>();
  for (const artifact of [...experiment.sourceArtifacts, ...experiment.producedArtifacts]) {
    if (ids.has(artifact.artifactId)) {
      ctx.addIssue({ code: "custom", path: ["sourceArtifacts"], message: `BIM_ARTIFACT_ID_DUPLICATE:${artifact.artifactId}` });
    }
    ids.add(artifact.artifactId);
  }
  const artifacts = [...experiment.sourceArtifacts, ...experiment.producedArtifacts];
  for (const stage of experiment.stages) {
    for (const id of [...stage.inputArtifactIds, ...stage.outputArtifactIds]) {
      if (!ids.has(id)) {
        ctx.addIssue({ code: "custom", path: ["stages"], message: `BIM_STAGE_ARTIFACT_NOT_REGISTERED:${id}` });
      }
    }
  }

  // A federation reference must resolve to an actual federated IFC artifact.
  const federatedArtifacts = experiment.producedArtifacts.filter((artifact) => artifact.role === "FEDERATED_MODEL");
  const federatedIds = federatedArtifacts.map((artifact) => artifact.artifactId).sort();
  const declaredFederationIds = [...experiment.federationModelIds].sort();
  if (federatedArtifacts.some((artifact) => artifact.format !== "FEDERATED_IFC")) {
    ctx.addIssue({ code: "custom", path: ["producedArtifacts"], message: "BIM_FEDERATED_MODEL_MUST_USE_FEDERATED_IFC_FORMAT" });
  }
  if (JSON.stringify(federatedIds) !== JSON.stringify(declaredFederationIds)) {
    ctx.addIssue({ code: "custom", path: ["federationModelIds"], message: "BIM_FEDERATION_MODEL_IDS_MUST_MATCH_REGISTERED_OUTPUTS" });
  }

  // Discipline models and the federated deliverable must declare one shared
  // normalized unit and coordinate reference. Source CAD units may differ.
  const coordinationArtifacts = experiment.producedArtifacts.filter((artifact) =>
    artifact.role === "DISCIPLINE_MODEL" || artifact.role === "FEDERATED_MODEL");
  if (coordinationArtifacts.some((artifact) => !artifact.discipline && artifact.role === "DISCIPLINE_MODEL")) {
    ctx.addIssue({ code: "custom", path: ["producedArtifacts"], message: "BIM_DISCIPLINE_MODEL_REQUIRES_DISCIPLINE_IDENTITY" });
  }
  const coordinationUnits = new Set(coordinationArtifacts.map((artifact) => artifact.units));
  const coordinationCoordinates = new Set(coordinationArtifacts.map((artifact) => artifact.coordinateSystem));
  if (coordinationUnits.size > 1) {
    ctx.addIssue({ code: "custom", path: ["producedArtifacts"], message: "BIM_FEDERATION_UNITS_MISMATCH" });
  }
  if (coordinationCoordinates.size > 1) {
    ctx.addIssue({ code: "custom", path: ["producedArtifacts"], message: "BIM_FEDERATION_COORDINATE_SYSTEM_MISMATCH" });
  }

  if (experiment.acceptance !== "NOT_REVIEWED" && (!experiment.humanReviewer || !experiment.humanReviewedAt)) {
    ctx.addIssue({ code: "custom", path: ["humanReviewer"], message: "BIM_ACCEPTANCE_REQUIRES_HUMAN_REVIEW" });
  }
});

export type ETOBimExperiment = z.infer<typeof ETOBimExperimentSchema>;

export function evaluateETOBimExperiment(input: ETOBimExperiment) {
  const experiment = ETOBimExperimentSchema.parse(input);
  const requiredStages = [
    "SOURCE_INTAKE",
    "SOURCE_INTEGRITY_CHECK",
    "CAD_GEOMETRY_EXTRACTION",
    "SEMANTIC_CLASSIFICATION",
    "BIM_ELEMENT_MAPPING",
    "DISCIPLINE_MODEL_BUILD",
    "FEDERATION",
    "CLASH_REVIEW",
    "ROUND_TRIP_VALIDATION",
    "HUMAN_ACCEPTANCE",
  ] as const;
  const byStage = new Map(experiment.stages.map(stage => [stage.stage, stage]));
  const missingStages = requiredStages.filter(stage => !byStage.has(stage));
  const failedStages = experiment.stages.filter(stage => stage.status === "FAIL" || stage.status === "BLOCKED");
  const unknownStages = experiment.stages.filter(stage => stage.status === "UNKNOWN" || stage.status === "NOT_STARTED" || stage.status === "RUNNING");
  const noFederatedOutput = !experiment.producedArtifacts.some(artifact => artifact.role === "FEDERATED_MODEL");
  const accepted = experiment.acceptance === "ACCEPTED_FOR_LEARNING"
    && experiment.humanReviewer !== undefined
    && experiment.humanReviewedAt !== undefined;
  const allStagesPassed = missingStages.length === 0
    && failedStages.length === 0
    && unknownStages.length === 0
    && experiment.stages.every(stage => stage.status === "PASS" || stage.status === "PASS_WITH_ISSUES");
  return {
    experimentId: experiment.experimentId,
    status: accepted && allStagesPassed && !noFederatedOutput
      ? "ACCEPTED_LEARNING_CASE" as const
      : failedStages.length
        ? "FAILED_OR_BLOCKED" as const
        : "INCOMPLETE_UNKNOWN" as const,
    missingStages,
    failedStages: failedStages.map(stage => stage.stage),
    unknownStages: unknownStages.map(stage => stage.stage),
    federatedOutputPresent: !noFederatedOutput,
    humanAcceptance: experiment.acceptance,
    limitations: [
      "CAD-to-BIM requires semantic interpretation and element mapping; geometry extraction alone is not BIM conversion.",
      "Federated IFC requires validated units, coordinate reference, placement, discipline identity and duplicate-element policy.",
      "A successful round-trip is bounded by the normalized properties and geometry actually tested; it does not prove native RVT equivalence or professional correctness.",
      "This registry records evidence and acceptance; it does not execute CAD, IFC or Revit conversion.",
    ],
  };
}

export function etoBimLearningContract() {
  return {
    schema: "ARKI-ETO-BIM-EXPERIMENT-1.0",
    flow: "CURATED ETO → SOURCE CAD/IFC INTAKE → INTEGRITY → GEOMETRY → SEMANTIC MAPPING → DISCIPLINE BIM → FEDERATED IFC → CLASH/ROUND-TRIP → HUMAN ACCEPTANCE",
    supportedSourceFormats: ETOBimSourceFormatSchema.options,
    targetFormats: ETOBimTargetFormatSchema.options,
    oneMotor: true,
    conversionExecution: "NOT_PROVIDED_BY_THIS_CONTRACT",
    canonicalMutation: false,
    humanAuthority: "FINAL",
  } as const;
}
