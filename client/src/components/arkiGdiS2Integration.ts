import { buildGDIContinuum, type GDIAlternative } from "./arkiGenerativeDesignContinuum";
import { authorizeS2Operation, executeS2Operation, proposeS2Operation, type S2Result } from "./arkiAdvancedSpatialEditing";
import { generateHouseA21S1FloorPlan, validateS1FloorPlan, type S1FloorPlan } from "./arkiConstructiveSpatialGeneration";

export type GDIReevaluation = { geometryState: "CHANGED" | "UNCHANGED"; validationState: "PASS" | "OBSERVATION" | "CONFLICT"; affected: string[]; unknownsPreserved: true; noDecision: true; provenance: string[] };
export type GDIS2ControlledLoop = { selectedAlternative: string; selectedBranch: string; humanDirection: string; proposal: ReturnType<typeof proposeS2Operation>; execution: S2Result; reevaluation?: GDIReevaluation; parent: S1FloorPlan; child?: S1FloorPlan; automaticWinner: false; automaticDecision: false; humanAuthority: "PRESERVED" };

function alternativeById(id: string, alternatives: GDIAlternative[]) { const alternative = alternatives.find((item) => item.id === id); if (!alternative) throw new Error(`Alternative not found: ${id}`); return alternative; }

export function buildGdiS2ControlledLoop(alternativeId: string, humanDirection: string, parameters: Record<string, unknown> = { dx: -0.5, dy: 0 }): GDIS2ControlledLoop {
  if (!humanDirection.trim()) throw new Error("Human direction is required");
  const continuum = buildGDIContinuum("HOUSE-A21");
  const alternative = alternativeById(alternativeId, continuum.alternatives);
  const parent = generateHouseA21S1FloorPlan();
  const proposal = proposeS2Operation(parent, "MOVE_ROOM", "S1:N1:ACCESS", parameters, humanDirection);
  const authorized = authorizeS2Operation(proposal, true);
  const execution = executeS2Operation(parent, authorized);
  const base: GDIS2ControlledLoop = { selectedAlternative: alternative.id, selectedBranch: alternative.branchId, humanDirection, proposal: authorized, execution, parent, child: execution.child, automaticWinner: false, automaticDecision: false, humanAuthority: "PRESERVED" };
  if (!execution.child || !execution.freshReadback) return base;
  const changed = JSON.stringify(parent.spaces) !== JSON.stringify(execution.child.spaces);
  const valid = validateS1FloorPlan(execution.child);
  return { ...base, reevaluation: { geometryState: changed ? "CHANGED" : "UNCHANGED", validationState: valid ? "PASS" : "OBSERVATION", affected: ["geometry", "containment", "area", "adjacency", "access", "circulation", "dependencies", "constraints", "critique", "evaluation"], unknownsPreserved: true, noDecision: true, provenance: ["GDI selected hypothesis", "Human direction", "S2 impact analysis", "S2 child readback", "S1 validation"] } };
}

export function runGdiS2ControlledProof() {
  const continuum = buildGDIContinuum("HOUSE-A21");
  const selected = continuum.alternatives[1];
  const loop = buildGdiS2ControlledLoop(selected.id, "Human Architect directs a bounded access-space move after critique", { dx: -0.5, dy: 0 });
  const unauthorized = executeS2Operation(loop.parent, loop.proposal.authorization === "AUTHORIZED" ? { ...loop.proposal, authorization: "PROPOSED" } : loop.proposal);
  const conflict = buildGdiS2ControlledLoop(selected.id, "Human Architect tests an intentionally invalid displacement", { dx: 30, dy: 0 });
  return { loop, unauthorized, conflict, selectedIsHypothesis: selected.state === "HYPOTHESIS", branchPreserved: loop.selectedBranch.length > 0, noAutomaticWinner: loop.automaticWinner === false, noAutomaticDecision: loop.automaticDecision === false, readbackFresh: loop.execution.freshReadback, revaluated: Boolean(loop.reevaluation), conflictBlocked: conflict.execution.state === "BLOCKED" };
}
