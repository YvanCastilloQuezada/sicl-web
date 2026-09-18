import { classifyK2Question, type K2EvidenceMode, type K2QuestionClassification } from "./arkiKnowledgeCurriculum";
import { buildK4FixtureStore, buildK4QueryFromK2, queryK4, type K4Match, type K4Result, type K4Store } from "./arkiKnowledgeStore";

export type K5Competence = "ARKI_GENERAL" | "SPECIALIST_DEEP" | "CROSS_CUTTING" | "MULTI_PERSPECTIVE" | "HUMAN_ONLY" | "INSUFFICIENT_INFORMATION";
export type K5KnowledgeAvailability = "RELEVANT_KNOWLEDGE_AVAILABLE" | "PARTIAL_KNOWLEDGE_AVAILABLE" | "NO_RELEVANT_KNOWLEDGE" | "KNOWLEDGE_AVAILABLE_BUT_CONTEXT_INSUFFICIENT" | "KNOWLEDGE_AVAILABLE_BUT_NOT_VALIDATED";
export type K5Answerability = "ANSWERABLE_WITH_ARKI_GENERAL" | "ANSWERABLE_WITH_AVAILABLE_KNOWLEDGE" | "PARTIALLY_ANSWERABLE" | "REQUIRES_SPECIALIST_CONSULTATION" | "REQUIRES_ADDITIONAL_EVIDENCE" | "REQUIRES_COMPUTATION" | "REQUIRES_SIMULATION" | "REQUIRES_REGULATORY_SOURCE" | "REQUIRES_HUMAN_INPUT" | "NOT_CURRENTLY_ANSWERABLE";
export type K5Missing = "MISSING_PROJECT_CONTEXT" | "MISSING_SOURCE" | "MISSING_PROJECT_EVIDENCE" | "MISSING_COMPUTATION" | "MISSING_SIMULATION" | "MISSING_REGULATORY_SOURCE" | "MISSING_JURISDICTION" | "MISSING_HUMAN_INPUT" | "MISSING_SPECIALIST_EVIDENCE" | "UNKNOWN_REQUIREMENT";
export type K5Perspective = { perspectiveId: string; reason: string; consultationQuestion: string; evidenceRequired: K2EvidenceMode[]; expectedOutputs: string[] };
export type K5Plan = { questionId: string; relevantDomains: string[]; competence: K5Competence; requiredPerspectives: K5Perspective[]; knowledgeRequirements: string[]; evidenceRequirements: K2EvidenceMode[]; availableKnowledgeIds: string[]; missingInformation: K5Missing[]; questionsForSpecialist: string[]; expectedOutputTypes: string[]; authorityBoundary: "HUMAN_ARCHITECT_FINAL"; executionStatus: "PLANNED_NOT_EXECUTED" };
export type K5Assessment = { questionId: string; question: string; k2: K2QuestionClassification; relevantDomains: string[]; competence: K5Competence; evidenceNeeds: K2EvidenceMode[]; knowledgeAvailability: K5KnowledgeAvailability; availableKnowledge: K4Result[]; missingInformation: K5Missing[]; answerability: K5Answerability; specialistRequired: boolean; specialistPlan: K5Plan; noDecision: true; noDesignOperation: true; noKnowledgePromotion: true };

const stableId = (question: string) => `K5-Q-${Array.from(question).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7).toString(16).padStart(8, "0")}`;
const has = (q: string, ...terms: string[]) => terms.some((term) => q.includes(term));
const unique = <T,>(items: T[]) => Array.from(new Set(items));
const perspective = (id: string, reason: string, question: string, evidence: K2EvidenceMode[], outputs: string[]): K5Perspective => ({ perspectiveId: id, reason, consultationQuestion: question, evidenceRequired: evidence, expectedOutputs: outputs });

function detectDomains(q: string): string[] {
  const domains: string[] = [];
  if (has(q, "kitchen", "courtyard", "dining", "housing", "bedroom", "house")) domains.push("HOUSING", "SPATIAL_COMPOSITION", "ARCHITECTURAL_PROGRAMMING");
  if (has(q, "ventilation", "ventil", "daylight", "thermal", "climate", "cross ventilation", "airflow")) domains.push("CLIMATE_BIOCLIMATIC");
  if (has(q, "structural", "structure", "earthquake", "seismic", "grid")) domains.push("STRUCTURE");
  if (has(q, "comply", "regulation", "code", "jurisdiction")) domains.push("REGULATORY_INTELLIGENCE");
  if (has(q, "accessible", "accessibility", "route", "wheelchair")) domains.push("ACCESSIBILITY_INCLUSIVE_DESIGN", "CIRCULATION_EXPERIENCE");
  if (has(q, "material", "facade", "facade assembly", "fire performance")) domains.push("MATERIAL_INTELLIGENCE");
  if (has(q, "cost", "economic", "moderate")) domains.push("ECONOMICS_DEVELOPMENT");
  return unique(domains);
}
function inferEvidence(q: string, domains: string[]): K2EvidenceMode[] {
  const evidence: K2EvidenceMode[] = [];
  if (domains.includes("REGULATORY_INTELLIGENCE") || has(q, "comply", "regulation", "code")) evidence.push("REGULATORY_SOURCE_REQUIRED", "PROJECT_EVIDENCE_REQUIRED");
  if (has(q, "will", "adequate", "resist", "performance", "satisfy", "exact", "moved", "preserving", "this project")) evidence.push("PROJECT_EVIDENCE_REQUIRED");
  if (has(q, "will", "adequate", "resist", "performance", "satisfy", "exact") && has(q, "daylight", "ventilation", "thermal", "resist", "performance")) evidence.push("COMPUTATION_REQUIRED", "SIMULATION_REQUIRED");
  if (has(q, "fire performance", "certified", "assembly")) evidence.push("SPECIALIST_EVIDENCE_REQUIRED");
  if (has(q, "prefer", "preference", "approve", "accept", "execute")) evidence.push("HUMAN_INPUT_REQUIRED");
  if (!evidence.length) evidence.push("GENERAL_KNOWLEDGE_ALLOWED");
  return unique(evidence);
}
function missingFor(q: string, competence: K5Competence, evidence: K2EvidenceMode[], contextProvided: boolean): K5Missing[] {
  const missing: K5Missing[] = [];
  if (!contextProvided && (has(q, "this", "exact", "will", "comply", "good"))) missing.push("MISSING_PROJECT_CONTEXT");
  if (evidence.includes("PROJECT_EVIDENCE_REQUIRED")) missing.push("MISSING_PROJECT_EVIDENCE");
  if (evidence.includes("COMPUTATION_REQUIRED")) missing.push("MISSING_COMPUTATION");
  if (evidence.includes("SIMULATION_REQUIRED")) missing.push("MISSING_SIMULATION");
  if (evidence.includes("REGULATORY_SOURCE_REQUIRED")) missing.push("MISSING_REGULATORY_SOURCE", "MISSING_JURISDICTION");
  if (evidence.includes("SPECIALIST_EVIDENCE_REQUIRED") || competence === "SPECIALIST_DEEP" || competence === "MULTI_PERSPECTIVE") missing.push("MISSING_SPECIALIST_EVIDENCE");
  if (evidence.includes("HUMAN_INPUT_REQUIRED") || competence === "HUMAN_ONLY") missing.push("MISSING_HUMAN_INPUT");
  if (!q.trim()) missing.push("UNKNOWN_REQUIREMENT");
  return unique(missing);
}
function perspectivesFor(q: string, competence: K5Competence, domains: string[], evidence: K2EvidenceMode[]): K5Perspective[] {
  const perspectives: K5Perspective[] = [];
  if (competence === "SPECIALIST_DEEP" || competence === "CROSS_CUTTING" || competence === "MULTI_PERSPECTIVE") {
    if (domains.includes("CLIMATE_BIOCLIMATIC")) perspectives.push(perspective("BIOCLIMATIC", "Project-specific environmental performance exceeds general explanation.", "Assess whether the available geometry, orientation, openings and climate evidence are sufficient to evaluate the environmental question.", evidence, ["PERFORMANCE_RESULT", "RISK", "OPEN_QUESTION"]));
    if (domains.includes("STRUCTURE")) perspectives.push(perspective("STRUCTURAL", "Resistance or structural performance requires specialist calculation and project evidence.", "Assess the structural evidence and identify what calculations are required; do not assume a performance result.", evidence, ["CONSTRAINT", "RISK", "OPEN_QUESTION"]));
    if (domains.includes("MATERIAL_INTELLIGENCE")) perspectives.push(perspective("MATERIAL", "Exact assembly performance requires material evidence, testing or certification.", "Assess the available assembly evidence and identify unresolved material and fire-performance questions.", evidence, ["FACT", "CONSTRAINT", "UNKNOWN"]));
    if (domains.includes("REGULATORY_INTELLIGENCE")) perspectives.push(perspective("REGULATORY", "Applicability depends on jurisdiction, source version and project evidence.", "Assess which jurisdictional source and project evidence are required; do not assert compliance.", evidence, ["SOURCE_STATEMENT", "OPEN_QUESTION", "UNKNOWN"]));
    if (domains.includes("ACCESSIBILITY_INCLUSIVE_DESIGN")) perspectives.push(perspective("ACCESSIBILITY", "Accessibility claims require route geometry and applicable criteria.", "Assess whether the route geometry and criteria are sufficient for an accessibility assessment.", evidence, ["CONSTRAINT", "OPEN_QUESTION", "UNKNOWN"]));
    if (domains.includes("ECONOMICS_DEVELOPMENT")) perspectives.push(perspective("ECONOMICS", "The question explicitly contains a cost trade-off.", "Assess cost-driver evidence and trade-offs without selecting a preferred alternative.", evidence, ["TRADEOFF", "RISK", "OPEN_QUESTION"]));
  }
  return perspectives;
}
export function assessKnowledgeNeed(question: string, store: K4Store = buildK4FixtureStore(), context: { spatialScope?: string; typology?: string; designStage?: string; projectId?: string } = {}): K5Assessment {
  const trimmed = question.trim(); const q = trimmed.toLowerCase(); const domains = detectDomains(q); const k2 = classifyK2Question(trimmed, { hasSource: true, hasProjectEvidence: Boolean(context.projectId), hasHumanInput: has(q, "prefer", "approve", "execute") });
  let competence: K5Competence = "ARKI_GENERAL";
  if (!trimmed || q === "is this good?" || q === "is this good") competence = "INSUFFICIENT_INFORMATION";
  else if (has(q, "which of", "do i prefer", "which alternative", "should i accept", "approve", "execute this")) competence = "HUMAN_ONLY";
  else if (has(q, "enlarge the courtyard", "construction cost", "cost must remain", "tradeoff")) competence = "MULTI_PERSPECTIVE";
  else if (has(q, "will", "adequate", "resist", "earthquake", "seismic", "fire performance", "exact facade", "comply", "accessible")) competence = domains.length > 1 ? "CROSS_CUTTING" : "SPECIALIST_DEEP";
  else if (domains.includes("CLIMATE_BIOCLIMATIC") && has(q, "what is", "define")) competence = "ARKI_GENERAL";
  const evidenceNeeds = inferEvidence(q, domains); const contextProvided = Boolean(context.projectId || context.spatialScope || context.typology || context.designStage); const missingInformation = missingFor(q, competence, evidenceNeeds, contextProvided);
  const k2Query = buildK4QueryFromK2({ domains, context }); const availableKnowledge = domains.length ? queryK4(store, { ...k2Query, includeUnknownContext: true, validationRequirement: "VALIDATED" }) : [];
  const hasCandidate = domains.length ? queryK4(store, { ...k2Query, includeUnknownContext: true, validationRequirement: "INCLUDE_CANDIDATES" }).some((result) => result.record.validation === "CANDIDATE") : false;
  const knowledgeAvailability: K5KnowledgeAvailability = hasCandidate && !availableKnowledge.length ? "KNOWLEDGE_AVAILABLE_BUT_NOT_VALIDATED" : availableKnowledge.length && availableKnowledge.some((result) => result.match === "UNKNOWN_CONTEXT" || result.match === "PARTIAL_CONTEXT") ? "KNOWLEDGE_AVAILABLE_BUT_CONTEXT_INSUFFICIENT" : availableKnowledge.length === 0 ? "NO_RELEVANT_KNOWLEDGE" : availableKnowledge.length < domains.length ? "PARTIAL_KNOWLEDGE_AVAILABLE" : "RELEVANT_KNOWLEDGE_AVAILABLE";
  let answerability: K5Answerability = "ANSWERABLE_WITH_ARKI_GENERAL";
  if (competence === "HUMAN_ONLY") answerability = "REQUIRES_HUMAN_INPUT";
  else if (competence === "INSUFFICIENT_INFORMATION") answerability = "NOT_CURRENTLY_ANSWERABLE";
  else if (evidenceNeeds.includes("REGULATORY_SOURCE_REQUIRED")) answerability = "REQUIRES_REGULATORY_SOURCE";
  else if (evidenceNeeds.includes("SIMULATION_REQUIRED")) answerability = "REQUIRES_SIMULATION";
  else if (evidenceNeeds.includes("COMPUTATION_REQUIRED")) answerability = "REQUIRES_COMPUTATION";
  else if (evidenceNeeds.includes("PROJECT_EVIDENCE_REQUIRED")) answerability = "REQUIRES_ADDITIONAL_EVIDENCE";
  else if (competence === "SPECIALIST_DEEP" || competence === "CROSS_CUTTING" || competence === "MULTI_PERSPECTIVE") answerability = "REQUIRES_SPECIALIST_CONSULTATION";
  else if (competence === "ARKI_GENERAL") answerability = "ANSWERABLE_WITH_ARKI_GENERAL";
  else if (knowledgeAvailability === "NO_RELEVANT_KNOWLEDGE") answerability = "PARTIALLY_ANSWERABLE";
  const requiredPerspectives = perspectivesFor(q, competence, domains, evidenceNeeds); const specialistRequired = requiredPerspectives.length > 0; const questionsForSpecialist = requiredPerspectives.map((item) => item.consultationQuestion);
  const plan: K5Plan = { questionId: stableId(trimmed), relevantDomains: domains, competence, requiredPerspectives, knowledgeRequirements: domains.map((domain) => `Retrieve validated knowledge for ${domain}`), evidenceRequirements: evidenceNeeds, availableKnowledgeIds: availableKnowledge.map((result) => result.knowledgeId), missingInformation, questionsForSpecialist, expectedOutputTypes: unique(requiredPerspectives.flatMap((item) => item.expectedOutputs)).filter((output) => output !== "DECISION"), authorityBoundary: "HUMAN_ARCHITECT_FINAL", executionStatus: "PLANNED_NOT_EXECUTED" };
  return { questionId: plan.questionId, question: trimmed, k2, relevantDomains: domains, competence, evidenceNeeds, knowledgeAvailability, availableKnowledge, missingInformation, answerability, specialistRequired, specialistPlan: plan, noDecision: true, noDesignOperation: true, noKnowledgePromotion: true };
}
export function validateK5Assessment(assessment: K5Assessment): boolean { return assessment.noDecision && assessment.noDesignOperation && assessment.noKnowledgePromotion && assessment.specialistPlan.executionStatus === "PLANNED_NOT_EXECUTED" && assessment.specialistPlan.authorityBoundary === "HUMAN_ARCHITECT_FINAL" && assessment.specialistPlan.expectedOutputTypes.every((output) => output !== "DECISION") && assessment.specialistPlan.requiredPerspectives.every((item) => item.reason.length > 0 && item.consultationQuestion.length > 0); }
export const K5_CONTEXT_MATCHES: K4Match[] = ["EXACT_CONTEXT_MATCH", "COMPATIBLE_CONTEXT", "PARTIAL_CONTEXT", "UNKNOWN_CONTEXT", "CONTEXT_MISMATCH"];
