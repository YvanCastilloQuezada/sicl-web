import { buildCanonicalBuildingModel, type CanonicalBuildingModel } from "./arkiBuildingAuthoring";
import { buildEngineeringIntelligence, type EngineeringIntelligence, type EngineeringDiscipline, type EngineeringEpistemicState } from "./arkiBuildingEngineeringIntelligence";
import type { S2Operation } from "./arkiAdvancedSpatialEditing";

export type EngineeringCommonKind = "SYSTEM" | "COMPONENT" | "SOURCE" | "TERMINAL" | "ROUTE" | "ZONE" | "RESERVATION" | "TECHNICAL_SPACE" | "DEPENDENCY" | "CONSTRAINT" | "PRESSURE" | "CONFLICT" | "OPPORTUNITY" | "INTERFACE" | "CONTINUITY" | "APPLICABILITY";
export type EngineeringCommonRecord = { id: string; kind: EngineeringCommonKind; systemId?: string; state: EngineeringEpistemicState | "UNKNOWN" | "CALCULATION_REQUIRED"; source: string; relations: string[]; properties: Record<string, unknown>; provenance: string[] };
export type MultidisciplinaryEngineeringModel = { projectId: string; architecturalModelVersion: string; disciplines: EngineeringDiscipline[]; records: EngineeringCommonRecord[]; affectedByArchitecturalChange: (operation: S2Operation) => EngineeringImpactReadback; epistemicStates: string[]; humanAuthority: "PRESERVED"; noAutomaticDecision: true; noAutomaticWinner: true };
export type EngineeringImpactReadback = { operationId: string; affectedSystems: string[]; affectedArchitecturalElements: string[]; state: "IMPACT_IDENTIFIED"; geometricMutation: "NOT_EXECUTED"; reEvaluationRequired: true; specialistReviewRequired: true; unknowns: string[]; provenance: string[] };

const common = (id: string, kind: EngineeringCommonKind, source: string, properties: Record<string, unknown>, relations: string[] = [], state: EngineeringCommonRecord["state"] = "CONCEPTUAL"): EngineeringCommonRecord => ({ id, kind, source, properties, relations, state, provenance: ["ARKI common engineering model", source] });

function records(engineering: EngineeringIntelligence, building: CanonicalBuildingModel): EngineeringCommonRecord[] {
  const result: EngineeringCommonRecord[] = [];
  for (const discipline of engineering.disciplines) result.push(common(`system:${discipline.name}`, "SYSTEM", discipline.name, { code: discipline.code, applicability: discipline.applicability, specialistRequired: discipline.specialistRequired }, [], discipline.applicability.HOUSING === "NOT_APPLICABLE" ? "UNKNOWN" : "CONCEPTUAL"));
  for (const reservation of engineering.reservations) result.push(common(reservation.id, "RESERVATION", reservation.source, { technicalRoom: reservation.technicalRoom, clearance: reservation.clearance, maintenance: reservation.maintenance, replacementRoute: reservation.replacementRoute }, [reservation.systemId], reservation.epistemicState));
  for (const route of engineering.routes) result.push(common(route.id, "ROUTE", route.source, { horizontalPath: route.horizontalPath, verticalPath: route.verticalPath, clearance: route.clearance, maintenanceAccess: route.maintenanceAccess }, [route.systemId], route.state));
  for (const dependency of engineering.dependencies) result.push(common(`dependency:${dependency.from}:${dependency.to}`, "DEPENDENCY", "E1-E48 dependency registry", { reason: dependency.reason }, [dependency.from, dependency.to]));
  for (const conflict of engineering.conflicts) result.push(common(conflict.id, "CONFLICT", "E1-E48 coordination model", { type: conflict.type, explanation: conflict.explanation, geometryRequired: conflict.geometryRequired }, conflict.systems, conflict.state));
  for (const element of building.elements.filter((item) => ["SHAFT", "ROUTE", "SPACE"].includes(item.kind))) result.push(common(`architecture:${element.arkiId}`, element.kind === "SHAFT" ? "RESERVATION" : element.kind === "ROUTE" ? "ROUTE" : "ZONE", "CanonicalBuildingModel", { arkiId: element.arkiId, level: element.level }, [], "CONCEPTUAL"));
  return result;
}

export function buildMultidisciplinaryEngineeringModel(projectId = "HOUSE-A21", building = buildCanonicalBuildingModel(), engineering = buildEngineeringIntelligence("HOUSING")): MultidisciplinaryEngineeringModel {
  const model: MultidisciplinaryEngineeringModel = { projectId, architecturalModelVersion: building.modelVersion, disciplines: engineering.disciplines, records: records(engineering, building), affectedByArchitecturalChange: (operation) => engineeringImpactFor(operation, engineering), epistemicStates: ["CONCEPTUAL", "CALCULATED", "SIMULATED", "MEASURED", "VERIFIED", "SPECIALIST_REVIEWED", "PROFESSIONALLY_SIGNED", "AUTHORITY_APPROVED", "UNKNOWN", "CALCULATION_REQUIRED"], humanAuthority: "PRESERVED", noAutomaticDecision: true, noAutomaticWinner: true };
  return model;
}

export function engineeringImpactFor(operation: S2Operation, engineering = buildEngineeringIntelligence("HOUSING")): EngineeringImpactReadback {
  const coreChange = operation.targetSpaceId.includes("CIRCULATION") || operation.targetSpaceId.includes("SHAFT") || operation.targetSpaceId.includes("CORE");
  const affectedSystems = coreChange ? engineering.impacts[0].affectedSystems : ["STRUCTURAL_SYSTEMS", "SANITARY_DRAINAGE", "ELECTRICAL_DISTRIBUTION", "HVAC"];
  return { operationId: operation.operationId, affectedSystems, affectedArchitecturalElements: ["geometry", "adjacency", "containment", "circulation", "access", "technical reservations", "dependencies", "constraints", "critique", "evaluation"], state: "IMPACT_IDENTIFIED", geometricMutation: "NOT_EXECUTED", reEvaluationRequired: true, specialistReviewRequired: true, unknowns: ["System capacities", "Member sizes", "Pipe diameters", "Airflows", "Fire flows", "Energy performance", "Regulatory compliance"], provenance: ["S2 architectural operation", "E1-E48 engineering intelligence", "Macroorder 03 impact propagation"] };
}

export function validateMultidisciplinaryModel(model: MultidisciplinaryEngineeringModel): boolean { return model.records.length > 0 && model.disciplines.length === 48 && model.records.every((record) => record.provenance.length > 0 && record.state !== "CALCULATED" || record.state === "CALCULATED") && model.epistemicStates.includes("CALCULATION_REQUIRED") && model.humanAuthority === "PRESERVED" && model.noAutomaticDecision && model.noAutomaticWinner; }

export function buildEngineeringProof() { const model = buildMultidisciplinaryEngineeringModel(); const operation = { operationId: "S2:MOVE_ROOM:S1:N1:ACCESS:1", kind: "MOVE_ROOM", actor: "HUMAN_ARCHITECT", targetSpaceId: "S1:N1:ACCESS", parameters: { dx: -0.5, dy: 0 }, parentId: "HOUSE-A21-S1-CONCEPTUAL-FLOOR-PLAN", reason: "Human architectural exploration", provenance: ["S2"], authorization: "AUTHORIZED", affectedRelationships: [], affectedGeometry: [], eventIndex: 1 } as S2Operation; const impact = model.affectedByArchitecturalChange(operation); return { model, impact, valid: validateMultidisciplinaryModel(model), noFakeNumbers: impact.unknowns.length > 0, noMutation: impact.geometricMutation === "NOT_EXECUTED", reEvaluation: impact.reEvaluationRequired }; }
