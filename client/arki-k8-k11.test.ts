import { describe, expect, it } from "vitest";
import { buildK8RealSourcePilot, validateK8RealSourcePilot } from "./src/components/arkiK8RealSourcePilot";
import { buildK9ValidationProof, validateK9ValidationProof } from "./src/components/arkiK9ValidationPipeline";
import { buildK10Proof, validateK10Architecture } from "./src/components/arkiK10KnowledgeStorageArchitecture";
import { buildK11DeepSpecialistPilot, k11Traceback, validateK11DeepSpecialistPilot } from "./src/components/arkiK11DeepSpecialistKnowledgePilot";

describe("ARKI knowledge program K8-K11", () => {
  it("proves three real source identities, locations, claims and rights boundaries", () => {
    const pilot = buildK8RealSourcePilot();
    expect(validateK8RealSourcePilot(pilot)).toBe(true);
    expect(pilot.sources.map((source) => source.sourceId)).toEqual(["K8-ARB-ARCHITECTS-CODE-2025", "K8-ASES-PASSIVE-SOLAR-DESIGN", "K8-PERU-RNE-2021"]);
    expect(pilot.contentUnits.every((unit) => Object.values(unit.location).some(Boolean))).toBe(true);
    expect(pilot.knowledgeUnits.every((unit) => unit.epistemicStatus === "SOURCE_STATEMENT")).toBe(true);
    expect(pilot.sources.every((source) => source.rights === "UNKNOWN")).toBe(true);
  });

  it("proves human validation, correction, rejection, context limitation and supersession", () => {
    const proof = buildK9ValidationProof();
    expect(validateK9ValidationProof(proof)).toBe(true);
    expect(proof.model.records.find((record) => record.knowledgeId === "K8-KU-ARB-01")?.state).toBe("CORRECTED");
    expect(proof.model.records.find((record) => record.knowledgeId === "K8-KU-ASES-01")?.state).toBe("VALIDATED");
    expect(proof.model.records.find((record) => record.knowledgeId === "K8-KU-RNE-01")?.state).toBe("CONTEXT_LIMITED");
    expect(proof.rejected.records.find((record) => record.knowledgeId === "K8-KU-RNE-01")?.state).toBe("REJECTED");
    expect(proof.superseded.records.find((record) => record.knowledgeId === "K8-KU-ARB-01")?.state).toBe("SUPERSEDED");
    expect(proof.model.records.find((record) => record.knowledgeId === "K8-KU-ARB-01")?.originalClaim).not.toBe(proof.model.records.find((record) => record.knowledgeId === "K8-KU-ARB-01")?.currentClaim);
    expect(proof.k4.records.some((record) => record.knowledgeId === "K8-KU-ASES-01")).toBe(true);
    expect(proof.k4.records.some((record) => record.knowledgeId === "K8-KU-RNE-01")).toBe(true);
  });

  it("proves K10 logical separation without infrastructure detour", () => {
    const proof = buildK10Proof();
    expect(validateK10Architecture(proof.architecture)).toBe(true);
    expect(proof.architecture.sourceStore.storeId).not.toBe(proof.architecture.knowledgeStore.storeId);
    expect(proof.architecture.knowledgeStore.storeId).not.toBe(proof.architecture.projectExperienceStore.storeId);
    expect(proof.architecture.localCache).toBe("OPTIONAL_NON_AUTHORITATIVE");
    expect(proof.architecture.productionPersistence).toBe("DEFERRED_BY_ARCHITECTURE");
    expect(proof.architecture.vectorDatabase).toBe("NOT_REQUIRED");
    expect(proof.architecture.rag).toBe("NOT_REQUIRED");
  });

  it("proves K11 real knowledge through Housing, Bioclimatic, K4, K5, K6 and K7", () => {
    const pilot = buildK11DeepSpecialistPilot();
    expect(validateK11DeepSpecialistPilot(pilot)).toBe(true);
    expect(pilot.retrieval.housingKnowledgeIds.length).toBeGreaterThan(0);
    expect(pilot.retrieval.bioclimaticKnowledgeIds.length).toBeGreaterThan(0);
    expect(pilot.housingFinding.knowledgeIdsUsed.length).toBeGreaterThan(0);
    expect(pilot.bioclimaticFinding.knowledgeIdsUsed.length).toBeGreaterThan(0);
    expect(k11Traceback(pilot).every((item) => item.source?.sourceId && item.source?.contentUnitId)).toBe(true);
    expect(pilot.synthesis.noDecision).toBe(true);
    expect(pilot.synthesis.noWinner).toBe(true);
    expect(pilot.noGeometryMutation).toBe(true);
  });
});
