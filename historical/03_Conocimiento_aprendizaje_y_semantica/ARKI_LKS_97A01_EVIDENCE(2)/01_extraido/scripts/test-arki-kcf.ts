import { strict as assert } from "node:assert";
import { KCF_INTERNET_POLICY, KCF_SCHEDULER_STATUS, assertForesightCannotModifyProduct, createLearningNeedCandidate, createLearningNeedFromProjectFeedback, createResearchActivation, prioritizeLearningNeed, validateForesightSignal, type ForesightSignal } from "../shared/arkiLivingKnowledge";

const popularSignal: ForesightSignal = { signalId: "s-popular", source: "vendor-blog", sourceType: "MARKET", detectedAt: "2026-09-23", domain: "technology", discipline: ["BIM"], applicableScales: ["BUILDING"], jurisdiction: [], description: "Popular vendor trend", evidence: [], curatorStatus: "UNKNOWN", novelty: "HIGH", relevance: "HIGH", persistence: "UNKNOWN", uncertainty: "HIGH", relatedKnowledge: [], relatedCompetencies: [], relatedCapabilities: [], relatedStandards: [], relatedProjects: [] };
assert.equal(validateForesightSignal(popularSignal), "INSUFFICIENT_EVIDENCE");
const internal: ForesightSignal = { ...popularSignal, signalId: "s-internal", sourceType: "INTERNAL", evidence: ["internal"], curatorStatus: "VERIFIED" };
assert.equal(validateForesightSignal(internal), "REJECTED");
const strategic = prioritizeLearningNeed(createLearningNeedCandidate({ needId: "need-1", canonicalName: "Structural solver validation", sourceSignals: ["s-popular"], evidence: [], curatorStatus: "UNKNOWN", domain: "Structures", discipline: ["Structures"], applicableScales: ["BUILDING"], jurisdiction: ["PE"], currentARKIKnowledge: [], currentARKICompetency: [], currentARKICapability: [], requiredKnowledge: ["FEM"], requiredCompetency: ["solver validation"], requiredCapability: ["verified solver"], knowledgeGap: true, competencyGap: true, capabilityGap: true, societalRelevance: "MEDIUM", professionalRelevance: "HIGH", projectRelevance: "HIGH", standardsRelevance: "HIGH", regulatoryRelevance: "HIGH", scientificRelevance: "HIGH", technologyRelevance: "MEDIUM", urgency: "HIGH", persistence: "HIGH", dependencies: [], proposedCurriculumImpact: ["REVIEW"], proposedRevalidationImpact: [], unknowns: ["primary source"], conflicts: [], governanceLevel: "LEVEL_C_STRATEGIC_CURRICULUM_CHANGE" }));
assert.equal(strategic.humanDecisionRequired, true);
assert.equal(strategic.governanceLevel, "LEVEL_C_STRATEGIC_CURRICULUM_CHANGE");
assert.throws(() => assertForesightCannotModifyProduct({ ...strategic, proposedCurriculumImpact: ["AUTO_CODE_CHANGE"] }));
const feedback = createLearningNeedFromProjectFeedback({ needId: "need-project", canonicalName: "Repeated unknown", projectId: "P-1", repeatedUnknown: true, repeatedFailure: false, evidence: ["fixture"], discipline: ["BIM"], scale: "BUILDING" });
assert.equal(feedback.knowledgeGap, true);
assert.equal(feedback.capabilityGap, false);
const activation = createResearchActivation({ mode: "FORESIGHT_REVIEW", purpose: "Assess signals", scope: ["BIM"], sourcePolicy: "PRIMARY_FIRST", budget: { maxSources: 10, maxDurationMinutes: 20 }, stoppingConditions: ["budget reached", "sufficient evidence"], evidenceRequirements: ["official source"] });
assert.equal(activation.schedulerStatus, "NOT_DEMONSTRATED");
assert.equal(KCF_SCHEDULER_STATUS, "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED");
assert.equal(KCF_INTERNET_POLICY, "INTERNET_AVAILABLE_ON_DEMAND / RESEARCH_ACTIVATED_BY_POLICY");
console.log(JSON.stringify({ status: "PASS", signalValidation: "PASS", marketNotAuthority: "PASS", strategicHumanGate: "PASS", projectFeedback: "PASS", noAutoCode: "PASS", schedulerBoundary: "PASS", internetPolicy: "PASS" }, null, 2));
