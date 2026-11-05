import { describe, expect, it } from "vitest";
import {
  ETOBimExperimentSchema,
  evaluateETOBimExperiment,
  etoBimLearningContract,
  type ETOBimExperiment,
} from "./arkiEtoBimLearning";

const artifact = (artifactId: string, role: "SOURCE" | "FEDERATED_MODEL", format: "DWG" | "FEDERATED_IFC") => ({
  artifactId,
  role,
  format,
  sourceRef: `artifact:${artifactId}`,
  sha256: "a".repeat(64),
  byteSize: 1024,
  units: "m",
  coordinateSystem: "EPSG:32718",
  modelVersion: "v1",
});

const base = (): ETOBimExperiment => {
  const source = artifact("cad-source", "SOURCE", "DWG");
  const federated = artifact("ifc-federated", "FEDERATED_MODEL", "FEDERATED_IFC");
  const stageNames = [
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
  return {
    schema: "ARKI-ETO-BIM-EXPERIMENT-1.0",
    experimentId: "ETO-BIM-EXP-001",
    projectRef: "OECE:PROJECT:001",
    etoQualityReviewId: "ETO-REVIEW-001",
    sourceExpedienteRef: "OECE:ETO:001",
    sourceExpedienteSha256: "b".repeat(64),
    typology: "EDUCATIONAL",
    jurisdiction: "PE-LIM",
    sourceArtifacts: [source],
    producedArtifacts: [federated],
    stages: stageNames.map(stage => ({
      stage,
      status: "PASS",
      observedAt: "2026-11-01T10:00:00Z",
      toolName: "controlled-test-fixture",
      toolVersion: "1.0",
      inputArtifactIds: stage === "SOURCE_INTAKE" ? [] : ["cad-source"],
      outputArtifactIds: stage === "FEDERATION" ? ["ifc-federated"] : [],
      evidenceRefs: [`evidence:${stage.toLowerCase()}`],
      unknowns: [],
      notes: "Fixture only; not evidence of a real conversion.",
    })),
    targetFormats: ["IFC4", "FEDERATED_IFC"],
    federationModelIds: ["ifc-federated"],
    acceptance: "ACCEPTED_FOR_LEARNING",
    humanReviewer: "reviewer-01",
    humanReviewedAt: "2026-11-01T11:00:00Z",
  };
};

describe("ARKI ETO-to-BIM learning experiment", () => {
  it("defines a governed CAD-to-federated-IFC pipeline without claiming execution", () => {
    const contract = etoBimLearningContract();
    expect(contract.oneMotor).toBe(true);
    expect(contract.conversionExecution).toBe("NOT_PROVIDED_BY_THIS_CONTRACT");
    expect(contract.flow).toContain("SEMANTIC MAPPING");
  });

  it("accepts a complete evidence-backed experiment fixture", () => {
    expect(evaluateETOBimExperiment(base()).status).toBe("ACCEPTED_LEARNING_CASE");
  });

  it("keeps missing conversion stages UNKNOWN rather than green", () => {
    const experiment = base();
    experiment.stages = experiment.stages.filter(stage => stage.stage !== "SEMANTIC_CLASSIFICATION");
    expect(evaluateETOBimExperiment(experiment)).toMatchObject({
      status: "INCOMPLETE_UNKNOWN",
      missingStages: ["SEMANTIC_CLASSIFICATION"],
    });
  });

  it("does not accept a failed round-trip", () => {
    const experiment = base();
    experiment.stages = experiment.stages.map(stage => stage.stage === "ROUND_TRIP_VALIDATION"
      ? { ...stage, status: "FAIL" }
      : stage);
    expect(evaluateETOBimExperiment(experiment).status).toBe("FAILED_OR_BLOCKED");
  });

  it("requires human reviewer and timestamp for acceptance", () => {
    const experiment = base();
    experiment.humanReviewer = undefined;
    expect(() => ETOBimExperimentSchema.parse(experiment)).toThrow("BIM_ACCEPTANCE_REQUIRES_HUMAN_REVIEW");
  });

  it("rejects stage evidence referencing an unregistered artifact", () => {
    const experiment = base();
    experiment.stages[0] = { ...experiment.stages[0], inputArtifactIds: ["not-registered"] };
    expect(() => ETOBimExperimentSchema.parse(experiment)).toThrow("BIM_STAGE_ARTIFACT_NOT_REGISTERED");
  });

  it("does not allow a pass status without evidence references", () => {
    const experiment = base();
    experiment.stages[0] = { ...experiment.stages[0], evidenceRefs: [] };
    expect(() => ETOBimExperimentSchema.parse(experiment)).toThrow("BIM_STAGE_PASS_REQUIRES_EVIDENCE");
  });

  it("requires federation IDs to resolve to registered federated IFC outputs", () => {
    const experiment = base();
    experiment.federationModelIds = ["missing-model"];
    expect(() => ETOBimExperimentSchema.parse(experiment)).toThrow("BIM_FEDERATION_MODEL_IDS_MUST_MATCH_REGISTERED_OUTPUTS");
  });

  it("rejects discipline/federated models with inconsistent normalized units", () => {
    const experiment = base();
    experiment.producedArtifacts.unshift({
      ...artifact("architecture-model", "FEDERATED_MODEL", "FEDERATED_IFC"),
      role: "DISCIPLINE_MODEL",
      format: "IFC4",
      discipline: "ARCHITECTURE",
      units: "mm",
    });
    expect(() => ETOBimExperimentSchema.parse(experiment)).toThrow("BIM_FEDERATION_UNITS_MISMATCH");
  });

  it("requires discipline identity on each discipline model", () => {
    const experiment = base();
    experiment.producedArtifacts.unshift({
      ...artifact("structure-model", "FEDERATED_MODEL", "FEDERATED_IFC"),
      role: "DISCIPLINE_MODEL",
      format: "IFC4",
    });
    expect(() => ETOBimExperimentSchema.parse(experiment)).toThrow("BIM_DISCIPLINE_MODEL_REQUIRES_DISCIPLINE_IDENTITY");
  });
});
