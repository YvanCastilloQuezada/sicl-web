import type { ArchitecturalStrategy } from "./arquiArchitecturalSynthesis";
import type { SpatialDesignOrganization } from "./arquiSpatialRealization";

export type A14Status = "SUPPORTED" | "PARTIAL" | "UNSUPPORTED" | "UNKNOWN";
export type A14Capability = { status?: string; implementation?: string };
export type A14Capabilities = Record<string, A14Capability>;

export type RealizationStep = {
  order: number;
  target: string;
  purpose: string;
  operationType: string;
  parameters: Record<string, unknown>;
  parameterSource: string[];
  preconditions: string[];
  expectedEffect: string;
  affectedIntent: string;
  authorityRequired: true;
};

export type ArchitecturalRealizationPlan = {
  strategyId: string;
  organizationId: string;
  sourceIntent: string[];
  status: A14Status;
  steps: RealizationStep[];
  requiredCapabilities: string[];
  requiredInputs: string[];
  unresolvedRequirements: string[];
  preservationTargets: string[];
  humanAuthorityRequired: true;
  executionStatus: "PREPARED" | "BLOCKED" | "UNSUPPORTED";
  provenance: string[];
};

export type A14Coverage = {
  concept: string;
  representable: boolean;
  operation: string;
  operationStatus: A14Status;
  inputsAvailable: boolean;
  executable: boolean;
  expectedLoss: string[];
};

export type A14Readback = {
  actualGeometryChanged: boolean;
  readbackAvailable: boolean;
  sourceAlternativeId: string;
  resultAlternativeId?: string;
  intentPreservation: "PRESERVED" | "PARTIALLY_PRESERVED" | "NOT_PRESERVED" | "UNKNOWN";
  preservationEvidence: string[];
  falseSuccess: boolean;
};

const statusFor = (capabilities: A14Capabilities, operation: string): A14Status => {
  const status = String(capabilities[operation]?.status ?? "UNKNOWN").toUpperCase();
  if (status === "AVAILABLE") return "SUPPORTED";
  if (status === "PARTIAL") return "PARTIAL";
  if (status === "NOT_CURRENTLY_SUPPORTED" || status === "UNSUPPORTED") return "UNSUPPORTED";
  return "UNKNOWN";
};

function sourceAlternativeParameters(alternative: Record<string, unknown>): Record<string, unknown> {
  const parameters = alternative.parameters;
  return parameters && typeof parameters === "object" && !Array.isArray(parameters) ? parameters as Record<string, unknown> : {};
}

export function deriveA14Coverage(organization: SpatialDesignOrganization, capabilities: A14Capabilities): A14Coverage[] {
  const concepts = organization.strategyFamily === "COURTYARD"
    ? [["CENTRAL_VOID", "CREATE_COURTYARD"], ["MASS_SEPARATION", "SET_GAP"]]
    : organization.strategyFamily === "COMPACT_VERTICAL"
      ? [["VERTICAL_INTENSIFICATION", "CHANGE_HEIGHT"], ["MASS_SCALING", "SCALE_MASS"]]
      : organization.strategyFamily === "LINEAR_BAR"
        ? [["LINEAR_ORGANIZATION", "CREATE_SPINE"]]
        : [["SPATIAL_ORGANIZATION", "UNKNOWN"]];
  return concepts.map(([concept, operation]) => {
    const operationStatus = statusFor(capabilities, operation);
    const representable = organization.spatialUnits.length > 0;
    const inputsAvailable = operationStatus === "SUPPORTED" || operationStatus === "PARTIAL";
    return { concept, representable, operation, operationStatus, inputsAvailable, executable: operationStatus === "SUPPORTED" && inputsAvailable, expectedLoss: operationStatus === "SUPPORTED" ? [] : ["Canonical operation or operation-specific input is unavailable."] };
  });
}

export function buildA14Plan(strategy: ArchitecturalStrategy, organization: SpatialDesignOrganization, alternative: Record<string, unknown> | undefined, capabilities: A14Capabilities): ArchitecturalRealizationPlan {
  const parameters = sourceAlternativeParameters(alternative ?? {});
  const floors = parameters.floors;
  const provenance = ["A11.design-problem", "A12.strategy", strategy.id, "A12.parti", organization.id, "A13.spatial-organization", "A14.derived-plan"];
  const common = { strategyId: strategy.id, organizationId: organization.id, sourceIntent: [...strategy.designDrivers, strategy.parti.organizingIdea], humanAuthorityRequired: true as const, provenance };
  if (!alternative) return { ...common, status: "UNKNOWN", steps: [], requiredCapabilities: strategy.operationMapping, requiredInputs: ["selected canonical alternative"], unresolvedRequirements: ["Select an explicit source alternative."], preservationTargets: [], executionStatus: "BLOCKED", provenance };
  if (strategy.family === "COURTYARD") {
    const status = statusFor(capabilities, "CREATE_COURTYARD");
    if (status === "SUPPORTED") return { ...common, status, steps: [{ order: 1, target: "BUILDING_MASS", purpose: "Realize the central protected void expressed by the parti.", operationType: "CREATE_COURTYARD", parameters: { courtyard_ratio: 0.3, footprint_ratio: 0.48 }, parameterSource: ["bounded A14 preview parameter", "existing spatial operation contract"], preconditions: ["source alternative is canonical", "human confirmation is explicit"], expectedEffect: "Courtyard massing with a measurable central void.", affectedIntent: "CENTRAL_VOID", authorityRequired: true }], requiredCapabilities: ["CREATE_COURTYARD"], requiredInputs: ["selected canonical alternative", "bounded courtyard parameters"], unresolvedRequirements: [], preservationTargets: ["central void exists", "courtyard strategy is present"], executionStatus: "PREPARED", provenance };
    return { ...common, status, steps: [], requiredCapabilities: ["CREATE_COURTYARD"], requiredInputs: ["selected canonical alternative"], unresolvedRequirements: ["CREATE_COURTYARD is not available in the current contract."], preservationTargets: ["central void exists"], executionStatus: "UNSUPPORTED", provenance };
  }
  if (strategy.family === "COMPACT_VERTICAL") {
    const scaleStatus = statusFor(capabilities, "SCALE_MASS");
    const heightStatus = statusFor(capabilities, "CHANGE_HEIGHT");
    const canScale = scaleStatus === "SUPPORTED";
    const canHeight = heightStatus === "SUPPORTED" && Number.isInteger(Number(floors));
    if (canScale || canHeight) {
      const steps: RealizationStep[] = [];
      if (canScale) steps.push({ order: 1, target: "BUILDING_MASS", purpose: "Concentrate the mass while preserving the compact family.", operationType: "SCALE_MASS", parameters: { footprint_ratio: 0.42 }, parameterSource: ["bounded A14 preview parameter", "existing spatial operation contract"], preconditions: ["source alternative is canonical", "human confirmation is explicit"], expectedEffect: "Compact massing with bounded footprint change.", affectedIntent: "MASS_SCALING", authorityRequired: true });
      if (canHeight) steps.push({ order: steps.length + 1, target: "BUILDING_MASS", purpose: "Test vertical intensification using the existing floor-count operation.", operationType: "CHANGE_HEIGHT", parameters: { floors: Number(floors) }, parameterSource: ["existing alternative.parameters.floors"], preconditions: ["floor count is available", "human confirmation is explicit"], expectedEffect: "Changed canonical floor count.", affectedIntent: "VERTICAL_INTENSIFICATION", authorityRequired: true });
      return { ...common, status: steps.length === 2 ? "SUPPORTED" : "PARTIAL", steps, requiredCapabilities: ["SCALE_MASS", "CHANGE_HEIGHT"], requiredInputs: ["selected canonical alternative", ...(canHeight ? [] : ["existing floor count"])], unresolvedRequirements: canHeight ? [] : ["Existing floor count is unavailable; vertical change remains unresolved."], preservationTargets: ["compact mass remains identifiable", ...(canHeight ? ["floor count changes"] : [])], executionStatus: "PREPARED", provenance };
    }
    return { ...common, status: "PARTIAL", steps: [], requiredCapabilities: ["SCALE_MASS", "CHANGE_HEIGHT"], requiredInputs: ["selected canonical alternative", "existing floor count"], unresolvedRequirements: ["No supported compact-vertical step has sufficient inputs."], preservationTargets: ["compact mass remains identifiable"], executionStatus: "BLOCKED", provenance };
  }
  return { ...common, status: "UNSUPPORTED", steps: [], requiredCapabilities: ["CREATE_SPINE", "ALIGN_TO_EDGE"], requiredInputs: ["canonical linear organization operation"], unresolvedRequirements: ["The current contract has no canonical CREATE_SPINE or ALIGN_TO_EDGE operation."], preservationTargets: ["linear organization"], executionStatus: "UNSUPPORTED", provenance };
}

function representationFingerprint(value: unknown): string { return JSON.stringify(value ?? null); }

export function readbackA14(result: Record<string, unknown>, plan: ArchitecturalRealizationPlan, sourceAlternativeId: string): A14Readback {
  const child = result.proposed_child && typeof result.proposed_child === "object" ? result.proposed_child as Record<string, unknown> : undefined;
  const before = result.before_representation;
  const after = result.after_representation;
  const readbackAvailable = Boolean(child && before && after);
  const resultAlternativeId = child?.alternative_id ? String(child.alternative_id) : undefined;
  const actualGeometryChanged = readbackAvailable && representationFingerprint(before) !== representationFingerprint(after) && resultAlternativeId !== sourceAlternativeId;
  const parameters = child?.parameters && typeof child.parameters === "object" ? child.parameters as Record<string, unknown> : {};
  const strategy = String(parameters.strategy ?? "");
  const afterElements = after && typeof after === "object" && Array.isArray((after as Record<string, unknown>).elements) ? (after as Record<string, unknown>).elements as Array<Record<string, unknown>> : [];
  const massCount = afterElements.filter((item) => item.element_type === "BuildingMass").length;
  const courtyardPreserved = plan.preservationTargets.includes("central void exists") && strategy === "courtyard" && massCount >= 4;
  const compactPreserved = plan.preservationTargets.includes("compact mass remains identifiable") && strategy === "compact" && massCount >= 1;
  const heightPreserved = plan.preservationTargets.includes("floor count changes") && Number(parameters.floors) > 0;
  const preservationEvidence = [courtyardPreserved && "courtyard strategy and multiple perimeter masses read back", compactPreserved && "compact strategy reads back", heightPreserved && "floor count reads back"].filter(Boolean) as string[];
  const intentPreservation = !readbackAvailable ? "UNKNOWN" : courtyardPreserved || (compactPreserved && (heightPreserved || !plan.preservationTargets.includes("floor count changes"))) ? "PRESERVED" : actualGeometryChanged ? "PARTIALLY_PRESERVED" : "NOT_PRESERVED";
  return { actualGeometryChanged, readbackAvailable, sourceAlternativeId, resultAlternativeId, intentPreservation, preservationEvidence, falseSuccess: Boolean(result.status === "EXECUTED" && !actualGeometryChanged) };
}

export function a14NoExecutionReason(plan: ArchitecturalRealizationPlan): string { return plan.executionStatus === "UNSUPPORTED" ? "UNSUPPORTED — no execution" : "AUTHORITY_REQUIRED — preview only until explicit confirmation"; }
