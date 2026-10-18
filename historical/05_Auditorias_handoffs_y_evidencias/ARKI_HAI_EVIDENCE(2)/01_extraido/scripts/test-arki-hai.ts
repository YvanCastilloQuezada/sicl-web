import { strict as assert } from "node:assert";
import { HAI_MAXIMUM_STATUS, HAI_SCHEDULER_STATUS, assertHistoricalClassificationSeparation, assertHistoricalNotCurrentCompliance, classifyHistoricalWork, validateArchivalSource, validateHistoricalIdentity, type ArchitecturalArchiveSource, type HistoricalIdentity, type ReferenceArchitecturalWorkRecord } from "../shared/arkiLivingKnowledge";

const identity: HistoricalIdentity = { identityId: "H-001", historicalName: "Original Name", currentName: "Current Name", alternateTransliterations: ["Original Name RU"], originalScript: "Original", jurisdictionAtProjectDate: "Historical State", currentJurisdiction: "Current State", historicalCountry: "USSR", currentCountry: "Country", aliases: ["Old Name"] };
validateHistoricalIdentity(identity);
assert.throws(() => validateHistoricalIdentity({ ...identity, identityId: "", historicalName: "" }));
const archive: ArchitecturalArchiveSource = { archiveId: "A-001", institution: "Archive", country: "RU", collection: "Collection", sourceType: "ARCHIVAL", temporalCoverage: ["1930s"], geographicCoverage: ["USSR"], accessMode: "REQUEST", digitizationStatus: "EXISTS_BUT_NOT_DIGITIZED", rightsStatus: "RESTRICTED", language: ["Russian"], authority: "Institution", reliability: "HIGH", relevantProjects: [], relevantCompetitions: ["C-001"], lastChecked: "2026-09-23", curatorStatus: "PARTIAL" };
validateArchivalSource(archive);
assert.throws(() => validateArchivalSource({ ...archive, language: [] }));
const classification = classifyHistoricalWork({ documented: ["MODERNISM"], retrospectiveLabel: "BRUTALISM", selfIdentification: "MODERNISM" });
assert.equal(classification.retrospectiveLabel, "BRUTALISM");
assert.equal(classification.status, "DOCUMENTED");
assert.throws(() => assertHistoricalClassificationSeparation({ status: "DOCUMENTED", selfIdentification: "YUGOSLAV", arkiClassification: "SOVIET" }));
const work: ReferenceArchitecturalWorkRecord = { workId: "W-001", name: "Unbuilt Work", location: "City", country: "YU", date: "1960", architects: [], status: "UNBUILT", competitionOrigin: "UNKNOWN", typology: ["CIVIC"], scales: ["BUILDING"], disciplines: ["ARCHITECTURE"], sourceEvidence: ["archive"], drawings: [], models: [], photographs: [], texts: [], historicalContext: { political: "context" }, architecturalObservations: ["observation"], classifications: [classification], disputedClassifications: [], provenance: ["archive"], rights: "RESTRICTED", unknowns: ["AUTHOR_UNKNOWN"] };
assert.doesNotThrow(() => assertHistoricalNotCurrentCompliance(work, "STRUCTURAL_SAFETY"));
assert.throws(() => assertHistoricalNotCurrentCompliance({ ...work, sourceEvidence: [] }, "STRUCTURAL_SAFETY"));
assert.equal(HAI_MAXIMUM_STATUS, "FOUNDATION IMPLEMENTED / HISTORICAL PILOT / PENDING INDEPENDENT VERIFICATION");
assert.equal(HAI_SCHEDULER_STATUS, "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED");
console.log(JSON.stringify({ status: "PASS", historicalIdentity: "PASS", archiveSource: "PASS", digitizationDistinction: "PASS", multilingualSource: "PASS", classificationSafety: "PASS", sovietYugoslavSeparation: "PASS", unbuiltSafety: "PASS", performanceClaimGate: "PASS", temporalStatus: "PASS", schedulerBoundary: "PASS" }, null, 2));
