import { buildK9ValidationProof } from "./arkiK9ValidationPipeline";
import { buildK10Architecture } from "./arkiK10KnowledgeStorageArchitecture";
import { executeK6Question, validateK6Finding, type K6Finding } from "./arkiSpecialistPerspective";
import { synthesizeK7, validateK7Synthesis, type K7Synthesis } from "./arkiMultiPerspectiveSynthesis";
import { queryK4, type K4Store } from "./arkiKnowledgeStore";

export type K11Pilot = { question: string; k10: ReturnType<typeof buildK10Architecture>; housingFinding: K6Finding; bioclimaticFinding: K6Finding; retrieval: { housingKnowledgeIds: string[]; bioclimaticKnowledgeIds: string[] }; synthesis: K7Synthesis; architecturalImplication: string; humanAuthority: "HUMAN_ARCHITECT_FINAL"; noGeometryMutation: true; noDecision: true; noWinner: true };
const question = "For HOUSE-A21, how should the architect consider the kitchen relationship to living/dining while exploring passive solar and cross-ventilation strategies?";

export function buildK11DeepSpecialistPilot(): K11Pilot {
  const k9 = buildK9ValidationProof();
  const k10 = buildK10Architecture(k9.model.sourceModel, k9.k4);
  const context = { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" };
  const housingFinding = executeK6Question(question, "HOUSING_PERSPECTIVE", k10.knowledgeStore.k4, context);
  const bioclimaticFinding = executeK6Question(question, "BIOCLIMATIC_PERSPECTIVE", k10.knowledgeStore.k4, context);
  const synthesis = synthesizeK7(question, [housingFinding, bioclimaticFinding], { ...context, sourceMode: "REAL_SOURCE_PILOT" });
  const housingKnowledgeIds = queryK4(k10.knowledgeStore.k4, { domainIds: ["HOUSING"], spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT", validationRequirement: "VALIDATED", includeUnknownContext: true }).map((result) => result.knowledgeId);
  const bioclimaticKnowledgeIds = queryK4(k10.knowledgeStore.k4, { domainIds: ["CLIMATE_BIOCLIMATIC"], spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT", validationRequirement: "VALIDATED", includeUnknownContext: true }).map((result) => result.knowledgeId);
  return { question, k10, housingFinding, bioclimaticFinding, retrieval: { housingKnowledgeIds, bioclimaticKnowledgeIds }, synthesis, architecturalImplication: "The real-source knowledge may frame a provisional comparison between domestic relationship/privacy and passive environmental strategies; it does not select a layout, claim performance or mutate HOUSE-A21.", humanAuthority: "HUMAN_ARCHITECT_FINAL", noGeometryMutation: true, noDecision: true, noWinner: true };
}
export function k11Traceback(pilot: K11Pilot) { return [pilot.housingFinding, pilot.bioclimaticFinding].flatMap((finding) => finding.knowledgeIdsUsed.map((knowledgeId) => ({ findingId: finding.findingId, knowledgeId, source: pilot.k10.knowledgeStore.k4.records.find((record) => record.knowledgeId === knowledgeId)?.sourceTrace }))); }
export function validateK11DeepSpecialistPilot(pilot: K11Pilot): boolean { return validateK6Finding(pilot.housingFinding) && validateK6Finding(pilot.bioclimaticFinding) && pilot.housingFinding.knowledgeIdsUsed.length > 0 && pilot.bioclimaticFinding.knowledgeIdsUsed.length > 0 && validateK7Synthesis(pilot.synthesis) && pilot.synthesis.authorityBoundary === "HUMAN_ARCHITECT_FINAL" && pilot.humanAuthority === "HUMAN_ARCHITECT_FINAL" && pilot.noGeometryMutation && pilot.noDecision && pilot.noWinner && k11Traceback(pilot).every((item) => Boolean(item.source?.sourceId && item.source?.contentUnitId)); }
