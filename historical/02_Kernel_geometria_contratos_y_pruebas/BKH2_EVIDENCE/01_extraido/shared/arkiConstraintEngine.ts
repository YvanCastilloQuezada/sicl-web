// ARKI — BKH-2 Constraint Engine
// Implementation scope: schema, registry, declarative evaluation and adapters only.
// No regeneration, transactions, approval authority or canonical mutation.

import type { Constraint as LegacyConstraint } from "./arkiParametricFamilies";
import type { RelationshipRecord } from "./arkiRelationshipFabric";

export type ConstraintHardness = "HARD" | "SOFT";
export type ConstraintApplicabilityMode = "UNCONDITIONAL" | "CONDITIONAL";
export type ConstraintSeverity = "INFORMATIONAL" | "ADVISORY" | "WARNING" | "ERROR" | "CRITICAL";
export type ConstraintEvaluationStatus = "SATISFIED" | "VIOLATED" | "UNKNOWN" | "NOT_APPLICABLE" | "CONFLICTING" | "ERROR";
export type ResolutionReason = "NONE" | "MISSING_DEPENDENCY" | "UNSUPPORTED_SOLVER" | "EXTERNAL_ORACLE_REQUIRED" | "NOT_DEMONSTRATED" | "INSUFFICIENT_EVIDENCE" | "INSUFFICIENT_EPISTEMIC_STATE" | "INVALID_INPUT";
export type ConstraintFamily = "GEOMETRIC" | "SPATIAL" | "PARAMETRIC" | "FUNCTIONAL" | "STRUCTURAL" | "MEP" | "REGULATORY" | "ACCESSIBILITY" | "ENVIRONMENTAL" | "PERFORMANCE" | "COST" | "SCHEDULE" | "CONSTRUCTABILITY" | "DOCUMENTATION" | "EPISTEMIC";
export type ConstraintScale = "HUMAN" | "COMPONENT" | "OBJECT" | "ACTIVITY" | "SPACE" | "SYSTEM" | "BUILDING" | "SITE" | "BLOCK" | "NEIGHBORHOOD" | "DISTRICT" | "CITY" | "REGION" | "COUNTRY";
export type ConstraintDiscipline = "architecture" | "estructuras" | "sanitarias" | "electricas" | "mecanicas" | "comunicaciones" | "seguridad" | "coordination" | "cost" | "schedule" | "documentary" | "unknown";
export type EpistemicStatus = "PROPOSED" | "OBSERVED" | "COMPUTED" | "VERIFIED" | "REJECTED" | "UNKNOWN" | "GENERATED" | "INFERENCE" | "ASSUMPTION" | "RESEARCHED";
export type ConstraintRecordStatus = "ACTIVE" | "DEPRECATED";

export type Dimension = "NONE" | "LENGTH" | "AREA" | "VOLUME" | "MASS" | "CURRENCY" | "TIME";
export type ValueType = "number" | "string" | "boolean" | "entity" | "relationship" | "date" | "unit" | "unknown";
export type UnitValue = { value: number; unit: string; dimension: Dimension };
export type PrimitiveValue = number | string | boolean | UnitValue;

export type ConstraintEvidence = { kind: "fixture" | "calculation" | "source" | "human_review" | "legacy"; reference: string; detail?: string };
export type ConstraintProvenance = { source: string; author?: string; adapter?: string; transformations: string[] };

export type ApplicabilityCondition = {
  scales: ConstraintScale[];
  disciplines: ConstraintDiscipline[];
  entityIds: string[];
  entityKinds: string[];
  jurisdictions: string[];
  phaseIds: string[];
  projectTypes: string[];
  conditions?: PredicateNode;
};

export type LiteralNode = { kind: "literal"; value: PrimitiveValue; valueType: ValueType };
export type ReferenceNode = { kind: "reference"; reference: string; valueType: ValueType; dimension?: Dimension };
export type UnaryNode = { kind: "unary"; operator: "NOT" | "NEGATE" | "ABS"; operand: PredicateNode };
export type BinaryOperator = "EQ" | "NE" | "LT" | "LTE" | "GT" | "GTE" | "ADD" | "SUB" | "MUL" | "DIV";
export type BinaryNode = { kind: "binary"; operator: BinaryOperator; left: PredicateNode; right: PredicateNode };
export type LogicalNode = { kind: "logical"; operator: "AND" | "OR"; operands: PredicateNode[] };
export type SetNode = { kind: "set"; operator: "IN" | "NOT_IN"; value: PredicateNode; options: PredicateNode[] };
export type CallNode = { kind: "call"; functionId: "MIN" | "MAX" | "ABS"; arguments: PredicateNode[] };
export type PredicateNode = LiteralNode | ReferenceNode | UnaryNode | BinaryNode | LogicalNode | SetNode | CallNode;

export type ConstraintRecord = {
  constraintId: string;
  constraintRevisionId: string;
  constraintType: string;
  family: ConstraintFamily;
  subjectEntityIds: string[];
  relationIds: string[];
  applicability: ApplicabilityCondition;
  predicate: PredicateNode;
  operands: Record<string, PrimitiveValue>;
  hardness: ConstraintHardness;
  applicabilityMode: ConstraintApplicabilityMode;
  severity: ConstraintSeverity;
  enforcement: "REPORT_ONLY" | "BLOCK_HYPOTHETICAL" | "REQUIRE_REVIEW";
  epistemicStatus: EpistemicStatus;
  evidence: ConstraintEvidence[];
  provenance: ConstraintProvenance;
  projectVersion: string;
  scenario?: string;
  validFrom?: string;
  validTo?: string;
  status: ConstraintRecordStatus;
};

export type ConstraintTypeDefinition = {
  typeId: string;
  family: ConstraintFamily;
  supportedHardness: ConstraintHardness[];
  supportedApplicabilityModes: ConstraintApplicabilityMode[];
  supportedSeverities: ConstraintSeverity[];
  allowedScales: ConstraintScale[];
  allowedDisciplines: ConstraintDiscipline[];
  minimumEvidence: "none" | "reference" | "reproducible" | "human_review";
  requiresExternalSolver: boolean;
  allowedOperators: string[];
  status: "ACTIVE" | "DEPRECATED";
  version: string;
};

const allScales: ConstraintScale[] = ["HUMAN", "COMPONENT", "OBJECT", "ACTIVITY", "SPACE", "SYSTEM", "BUILDING", "SITE", "BLOCK", "NEIGHBORHOOD", "DISTRICT", "CITY", "REGION", "COUNTRY"];
const allDisciplines: ConstraintDiscipline[] = ["architecture", "estructuras", "sanitarias", "electricas", "mecanicas", "comunicaciones", "seguridad", "coordination", "cost", "schedule", "documentary", "unknown"];
const allSeverities: ConstraintSeverity[] = ["INFORMATIONAL", "ADVISORY", "WARNING", "ERROR", "CRITICAL"];
const allOperators = ["EQ", "NE", "LT", "LTE", "GT", "GTE", "ADD", "SUB", "MUL", "DIV", "AND", "OR", "NOT", "NEGATE", "ABS", "IN", "NOT_IN", "MIN", "MAX"];

const definition = (input: Pick<ConstraintTypeDefinition, "typeId" | "family"> & Partial<Omit<ConstraintTypeDefinition, "typeId" | "family">>): ConstraintTypeDefinition => {
  const { typeId, family, ...rest } = input;
  return {
  typeId,
  family,
  supportedHardness: ["HARD", "SOFT"],
  supportedApplicabilityModes: ["UNCONDITIONAL", "CONDITIONAL"],
  supportedSeverities: allSeverities,
  allowedScales: allScales,
  allowedDisciplines: allDisciplines,
  minimumEvidence: "none",
  requiresExternalSolver: false,
  allowedOperators: allOperators,
  status: "ACTIVE",
  version: "1.2",
  ...rest,
  };
};

export const ConstraintTypeRegistry: Readonly<Record<string, ConstraintTypeDefinition>> = Object.freeze({
  DISTANCE_LIMIT: definition({ typeId: "DISTANCE_LIMIT", family: "GEOMETRIC" }),
  ALIGNMENT: definition({ typeId: "ALIGNMENT", family: "GEOMETRIC" }),
  DIMENSION_RANGE: definition({ typeId: "DIMENSION_RANGE", family: "PARAMETRIC" }),
  PARAMETER_FORMULA: definition({ typeId: "PARAMETER_FORMULA", family: "PARAMETRIC" }),
  HOST_COMPATIBILITY: definition({ typeId: "HOST_COMPATIBILITY", family: "SPATIAL", minimumEvidence: "reference" }),
  CLEARANCE: definition({ typeId: "CLEARANCE", family: "SPATIAL" }),
  CONTAINMENT: definition({ typeId: "CONTAINMENT", family: "SPATIAL" }),
  PHASE_COMPATIBILITY: definition({ typeId: "PHASE_COMPATIBILITY", family: "FUNCTIONAL" }),
  MATERIAL_COMPATIBILITY: definition({ typeId: "MATERIAL_COMPATIBILITY", family: "CONSTRUCTABILITY" }),
  DOMAIN_RULE: definition({ typeId: "DOMAIN_RULE", family: "FUNCTIONAL" }),
  STRUCTURAL_SOLVER: definition({ typeId: "STRUCTURAL_SOLVER", family: "STRUCTURAL", requiresExternalSolver: true, minimumEvidence: "reproducible" }),
  REGULATORY_RULE: definition({ typeId: "REGULATORY_RULE", family: "REGULATORY", minimumEvidence: "reference" }),
});

export type ConstraintEvaluationContext = {
  projectVersion: string;
  scale: ConstraintScale;
  discipline: ConstraintDiscipline;
  jurisdiction?: string;
  phaseId?: string;
  projectType?: string;
  entities: Readonly<Record<string, Readonly<Record<string, PrimitiveValue>>>>;
  relationships: readonly RelationshipRecord[];
  derived: Readonly<Record<string, PrimitiveValue>>;
};

export type ConstraintEvaluation = {
  constraintId: string;
  constraintRevisionId: string;
  projectVersion: string;
  status: ConstraintEvaluationStatus;
  resolutionReason: ResolutionReason;
  actualValue?: PrimitiveValue;
  expectedValue?: PrimitiveValue;
  tolerance?: UnitValue;
  units?: string;
  hardness: ConstraintHardness;
  severity: ConstraintSeverity;
  explanation: string;
  evidence: ConstraintEvidence[];
  conflictingConstraintIds: string[];
  dependencies: string[];
  provenance: ConstraintProvenance;
  evaluatedAtRevision: string;
};

export type ConstraintConflict = {
  conflictId: string;
  constraintIds: string[];
  sharedApplicability: { scales: ConstraintScale[]; disciplines: ConstraintDiscipline[]; entityIds: string[] };
  status: "CONFLICTING";
  resolutionReason: "INCOMPATIBLE_HARD_CONSTRAINTS";
  explanation: string;
  evidence: ConstraintEvidence[];
};

export class ConstraintValidationError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) { super(`Constraint validation failed: ${issues.join("; ")}`); this.name = "ConstraintValidationError"; this.issues = issues; }
}

const hash = (input: string): string => { let value = 2166136261; for (let index = 0; index < input.length; index += 1) { value ^= input.charCodeAt(index); value = Math.imul(value, 16777619); } return (value >>> 0).toString(16).padStart(8, "0"); };
const semanticKey = (input: Pick<ConstraintRecord, "constraintType" | "subjectEntityIds" | "relationIds" | "applicability" | "predicate">): string => JSON.stringify({ constraintType: input.constraintType, subjectEntityIds: [...input.subjectEntityIds].sort(), relationIds: [...input.relationIds].sort(), applicability: input.applicability, predicate: input.predicate });
export const stableConstraintId = (input: Pick<ConstraintRecord, "constraintType" | "subjectEntityIds" | "relationIds" | "applicability" | "predicate">): string => `constraint:${hash(semanticKey(input))}`;
export const constraintRevisionId = (constraintId: string, projectVersion: string): string => `constraint-rev:${hash(`${constraintId}|${projectVersion}`)}`;

const hasEvidence = (record: ConstraintRecord, minimum: ConstraintTypeDefinition["minimumEvidence"]): boolean => {
  if (minimum === "none") return true;
  if (minimum === "reference") return record.evidence.length > 0;
  if (minimum === "reproducible") return record.evidence.some((item) => item.kind === "fixture" || item.kind === "calculation");
  return record.evidence.some((item) => item.kind === "human_review");
};

const nodeOperatorIds = (node: PredicateNode): string[] => {
  if (node.kind === "literal" || node.kind === "reference") return [];
  if (node.kind === "unary") return [node.operator, ...nodeOperatorIds(node.operand)];
  if (node.kind === "binary") return [node.operator, ...nodeOperatorIds(node.left), ...nodeOperatorIds(node.right)];
  if (node.kind === "logical") return [node.operator, ...node.operands.flatMap(nodeOperatorIds)];
  if (node.kind === "set") return [node.operator, ...nodeOperatorIds(node.value), ...node.options.flatMap(nodeOperatorIds)];
  return [node.functionId, ...node.arguments.flatMap(nodeOperatorIds)];
};

export function validatePredicate(predicate: PredicateNode, allowedOperators: readonly string[] = allOperators): void {
  const issues: string[] = [];
  const operators = nodeOperatorIds(predicate);
  for (const operator of operators) if (!allowedOperators.includes(operator)) issues.push(`operator not registered: ${operator}`);
  const visit = (node: PredicateNode, depth: number): void => {
    if (depth > 32) { issues.push("predicate depth exceeds 32"); return; }
    if (node.kind === "literal" || node.kind === "reference") return;
    if (node.kind === "unary") visit(node.operand, depth + 1);
    else if (node.kind === "binary") { visit(node.left, depth + 1); visit(node.right, depth + 1); }
    else if (node.kind === "logical") { if (node.operands.length === 0) issues.push("logical operator requires operands"); node.operands.forEach((item) => visit(item, depth + 1)); }
    else if (node.kind === "set") { if (node.options.length === 0) issues.push("set operator requires options"); visit(node.value, depth + 1); node.options.forEach((item) => visit(item, depth + 1)); }
    else { if (node.arguments.length === 0) issues.push("call requires arguments"); node.arguments.forEach((item) => visit(item, depth + 1)); }
  };
  visit(predicate, 0);
  if (issues.length > 0) throw new ConstraintValidationError(issues);
}

export function validateConstraint(record: ConstraintRecord): void {
  const issues: string[] = [];
  const type = ConstraintTypeRegistry[record.constraintType];
  if (!type) issues.push(`constraint type is not registered: ${record.constraintType}`);
  if (record.subjectEntityIds.length === 0) issues.push("subjectEntityIds is required");
  if (record.hardness !== "HARD" && record.hardness !== "SOFT") issues.push("hardness is invalid");
  if (record.applicabilityMode !== "UNCONDITIONAL" && record.applicabilityMode !== "CONDITIONAL") issues.push("applicabilityMode is invalid");
  if (record.applicabilityMode === "CONDITIONAL" && !record.applicability.conditions) issues.push("conditional applicability requires conditions");
  if (!allSeverities.includes(record.severity)) issues.push("severity is invalid");
  if (!record.projectVersion) issues.push("projectVersion is required");
  if (!record.provenance.source || record.provenance.transformations.some((item) => item.length === 0)) issues.push("provenance is incomplete");
  if (type) {
    if (!type.supportedHardness.includes(record.hardness)) issues.push("hardness is not supported by registry");
    if (!type.supportedApplicabilityModes.includes(record.applicabilityMode)) issues.push("applicabilityMode is not supported by registry");
    if (!type.supportedSeverities.includes(record.severity)) issues.push("severity is not supported by registry");
    if (!type.allowedScales.some((scale) => record.applicability.scales.includes(scale))) issues.push("applicability scale is not supported by registry");
    if (!record.applicability.disciplines.every((discipline) => type.allowedDisciplines.includes(discipline))) issues.push("applicability discipline is not supported by registry");
    if (record.applicability.entityIds.some((entityId) => !record.subjectEntityIds.includes(entityId))) issues.push("applicability entityIds must be subjects of the constraint");
    if (!hasEvidence(record, type.minimumEvidence)) issues.push(`minimum evidence required: ${type.minimumEvidence}`);
    try { validatePredicate(record.predicate, type.allowedOperators); } catch (error) { if (error instanceof ConstraintValidationError) issues.push(...error.issues); else issues.push("predicate validation failed"); }
    if (record.applicability.conditions) {
      try { validatePredicate(record.applicability.conditions, type.allowedOperators); } catch (error) { if (error instanceof ConstraintValidationError) issues.push(...error.issues); else issues.push("conditional applicability validation failed"); }
    }
  }
  if (issues.length > 0) throw new ConstraintValidationError(issues);
}

const isUnitValue = (value: PrimitiveValue): value is UnitValue => typeof value === "object" && value !== null && "dimension" in value && "unit" in value && "value" in value;
const unitFactor: Readonly<Record<string, number>> = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, km: 1000, m2: 1, cm2: 0.0001, m3: 1, cm3: 0.000001, kg: 1, g: 0.001, PEN: 1, USD: 1 });
const convertUnit = (value: UnitValue, target: UnitValue): UnitValue => { const from = unitFactor[value.unit]; const to = unitFactor[target.unit]; if (from === undefined || to === undefined || value.dimension !== target.dimension) throw new ConstraintValidationError([`incompatible units: ${value.unit} and ${target.unit}`]); return { value: value.value * from / to, unit: target.unit, dimension: target.dimension }; };
const comparable = (left: PrimitiveValue, right: PrimitiveValue): [PrimitiveValue, PrimitiveValue] => { if (isUnitValue(left) && isUnitValue(right)) return [convertUnit(left, right), right]; return [left, right]; };
const primitiveEqual = (left: PrimitiveValue, right: PrimitiveValue): boolean => { const [a, b] = comparable(left, right); return JSON.stringify(a) === JSON.stringify(b); };
const numericPair = (left: PrimitiveValue, right: PrimitiveValue): [number, number] => { const [a, b] = comparable(left, right); const leftNumber = isUnitValue(a) ? a.value : a; const rightNumber = isUnitValue(b) ? b.value : b; if (typeof leftNumber !== "number" || typeof rightNumber !== "number") throw new ConstraintValidationError(["numeric operator requires numbers or compatible unit values"]); return [leftNumber, rightNumber]; };

const referenceValue = (node: ReferenceNode, context: ConstraintEvaluationContext): PrimitiveValue => {
  const parts = node.reference.split(".");
  if (parts[0] === "derived") { const value = context.derived[parts.slice(1).join(".")]; if (value === undefined) throw new ConstraintValidationError([`missing derived dependency: ${node.reference}`]); return value; }
  if (parts[0] === "entity" && parts.length >= 3) { const value = context.entities[parts[1]]?.[parts.slice(2).join(".")]; if (value === undefined) throw new ConstraintValidationError([`missing entity dependency: ${node.reference}`]); return value; }
  if (parts[0] === "context" && parts[1] === "scale") return context.scale;
  if (parts[0] === "context" && parts[1] === "discipline") return context.discipline;
  if (parts[0] === "context" && parts[1] === "jurisdiction") return context.jurisdiction ?? "";
  throw new ConstraintValidationError([`unsupported reference: ${node.reference}`]);
};

const evaluateNode = (node: PredicateNode, context: ConstraintEvaluationContext): PrimitiveValue => {
  if (node.kind === "literal") return node.value;
  if (node.kind === "reference") return referenceValue(node, context);
  if (node.kind === "unary") { const value = evaluateNode(node.operand, context); if (node.operator === "NOT") { if (typeof value !== "boolean") throw new ConstraintValidationError(["NOT requires boolean"]); return !value; } if (node.operator === "NEGATE") { const [number] = numericPair(value, 0); return -number; } const [number] = numericPair(value, 0); return Math.abs(number); }
  if (node.kind === "logical") { const values = node.operands.map((item) => evaluateNode(item, context)); if (!values.every((item) => typeof item === "boolean")) throw new ConstraintValidationError([`${node.operator} requires boolean operands`]); return node.operator === "AND" ? values.every(Boolean) : values.some(Boolean); }
  if (node.kind === "set") { const value = evaluateNode(node.value, context); const found = node.options.some((item) => primitiveEqual(value, evaluateNode(item, context))); return node.operator === "IN" ? found : !found; }
  if (node.kind === "call") { const values = node.arguments.map((item) => evaluateNode(item, context)); if (node.functionId === "ABS") { const [number] = numericPair(values[0], 0); return Math.abs(number); } const numbers = values.map((item) => numericPair(item, 0)[0]); return node.functionId === "MIN" ? Math.min(...numbers) : Math.max(...numbers); }
  const left = evaluateNode(node.left, context); const right = evaluateNode(node.right, context);
  if (["EQ", "NE"].includes(node.operator)) return node.operator === "EQ" ? primitiveEqual(left, right) : !primitiveEqual(left, right);
  if (["LT", "LTE", "GT", "GTE"].includes(node.operator)) { const [a, b] = numericPair(left, right); if (node.operator === "LT") return a < b; if (node.operator === "LTE") return a <= b; if (node.operator === "GT") return a > b; return a >= b; }
  const [a, b] = numericPair(left, right); if (node.operator === "ADD") return a + b; if (node.operator === "SUB") return a - b; if (node.operator === "MUL") return a * b; if (b === 0) throw new ConstraintValidationError(["division by zero"]); return a / b;
};

const applicabilityMatches = (record: ConstraintRecord, context: ConstraintEvaluationContext): boolean => {
  const item = record.applicability;
  if (!item.scales.includes(context.scale) || !item.disciplines.includes(context.discipline)) return false;
  if (item.jurisdictions.length > 0 && (!context.jurisdiction || !item.jurisdictions.includes(context.jurisdiction))) return false;
  if (item.phaseIds.length > 0 && (!context.phaseId || !item.phaseIds.includes(context.phaseId))) return false;
  if (item.projectTypes.length > 0 && (!context.projectType || !item.projectTypes.includes(context.projectType))) return false;
  return true;
};

export function evaluateConstraint(record: ConstraintRecord, context: ConstraintEvaluationContext): ConstraintEvaluation {
  validateConstraint(record);
  const type = ConstraintTypeRegistry[record.constraintType];
  if (!applicabilityMatches(record, context)) return result(record, "NOT_APPLICABLE", "NONE", "Instance applicability does not match evaluation context.");
  if (record.applicabilityMode === "CONDITIONAL" && record.applicability.conditions) { let active: PrimitiveValue; try { active = evaluateNode(record.applicability.conditions, context); } catch { return result(record, "UNKNOWN", "INVALID_INPUT", "Conditional applicability could not be evaluated."); } if (active !== true) return result(record, "NOT_APPLICABLE", "NONE", "Conditional applicability is inactive."); }
  if (type.requiresExternalSolver) return result(record, "UNKNOWN", "UNSUPPORTED_SOLVER", "The registered type requires an external solver not connected in this environment.");
  if (record.relationIds.some((id) => !context.relationships.some((relationship) => relationship.relationshipId === id))) return result(record, "UNKNOWN", "MISSING_DEPENDENCY", "A required Relationship Fabric dependency is missing.");
  try { const value = evaluateNode(record.predicate, context); if (typeof value !== "boolean") return result(record, "ERROR", "INVALID_INPUT", "Predicate did not evaluate to boolean.", value); return result(record, value ? "SATISFIED" : "VIOLATED", "NONE", value ? "Predicate satisfied." : "Predicate violated.", value); } catch (error) { if (error instanceof ConstraintValidationError) return result(record, "ERROR", "INVALID_INPUT", error.message); return result(record, "ERROR", "INVALID_INPUT", "Evaluation failed."); }
}

const result = (record: ConstraintRecord, status: ConstraintEvaluationStatus, resolutionReason: ResolutionReason, explanation: string, actualValue?: PrimitiveValue): ConstraintEvaluation => ({ constraintId: record.constraintId, constraintRevisionId: record.constraintRevisionId, projectVersion: record.projectVersion, status, resolutionReason, actualValue, expectedValue: undefined, tolerance: undefined, units: undefined, hardness: record.hardness, severity: record.severity, explanation, evidence: [...record.evidence], conflictingConstraintIds: [], dependencies: [...record.relationIds], provenance: { ...record.provenance, transformations: [...record.provenance.transformations] }, evaluatedAtRevision: record.constraintRevisionId });

const simpleComparison = (record: ConstraintRecord): { reference: string; operator: BinaryOperator; value: number } | undefined => {
  if (record.predicate.kind !== "binary" || !["GTE", "GT", "LTE", "LT"].includes(record.predicate.operator)) return undefined;
  const { left, right } = record.predicate;
  if (left.kind !== "reference" || right.kind !== "literal" || typeof right.value !== "number") return undefined;
  return { reference: left.reference, operator: record.predicate.operator, value: right.value };
};

export function detectConstraintConflicts(records: readonly ConstraintRecord[], context: ConstraintEvaluationContext): ConstraintConflict[] {
  const conflicts: ConstraintConflict[] = [];
  for (let leftIndex = 0; leftIndex < records.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < records.length; rightIndex += 1) {
      const left = records[leftIndex];
      const right = records[rightIndex];
      if (left.hardness !== "HARD" || right.hardness !== "HARD") continue;
      const commonEntities = left.subjectEntityIds.filter((id) => right.subjectEntityIds.includes(id));
      if (commonEntities.length === 0 || left.applicability.scales.every((scale) => !right.applicability.scales.includes(scale)) || left.applicability.disciplines.every((discipline) => !right.applicability.disciplines.includes(discipline))) continue;
      const leftComparison = simpleComparison(left);
      const rightComparison = simpleComparison(right);
      if (!leftComparison || !rightComparison || leftComparison.reference !== rightComparison.reference) continue;
      const contradictory = (leftComparison.operator.startsWith("GT") && rightComparison.operator.startsWith("LT") && leftComparison.value >= rightComparison.value)
        || (leftComparison.operator.startsWith("LT") && rightComparison.operator.startsWith("GT") && rightComparison.value >= leftComparison.value);
      if (!contradictory) continue;
      const leftResult = evaluateConstraint(left, context);
      const rightResult = evaluateConstraint(right, context);
      if (leftResult.status === "NOT_APPLICABLE" || rightResult.status === "NOT_APPLICABLE") continue;
      conflicts.push({ conflictId: `conflict:${hash(`${left.constraintId}|${right.constraintId}`)}`, constraintIds: [left.constraintId, right.constraintId], sharedApplicability: { scales: left.applicability.scales.filter((scale) => right.applicability.scales.includes(scale)), disciplines: left.applicability.disciplines.filter((discipline) => right.applicability.disciplines.includes(discipline)), entityIds: commonEntities }, status: "CONFLICTING", resolutionReason: "INCOMPATIBLE_HARD_CONSTRAINTS", explanation: "Two applicable HARD constraints impose incompatible bounds on the same reference.", evidence: [...left.evidence, ...right.evidence] });
    }
  }
  return conflicts;
}

export function createConstraint(input: Omit<ConstraintRecord, "constraintId" | "constraintRevisionId" | "family"> & { constraintId?: string; constraintRevisionId?: string }): ConstraintRecord {
  const family = ConstraintTypeRegistry[input.constraintType]?.family;
  if (!family) throw new ConstraintValidationError([`constraint type is not registered: ${input.constraintType}`]);
  const constraintId = input.constraintId ?? stableConstraintId(input);
  const record: ConstraintRecord = { ...input, constraintId, constraintRevisionId: input.constraintRevisionId ?? constraintRevisionId(constraintId, input.projectVersion), family };
  validateConstraint(record);
  return record;
}

export class ConstraintEngine {
  private readonly current = new Map<string, ConstraintRecord>();
  private readonly historyById = new Map<string, ConstraintRecord[]>();
  add(record: ConstraintRecord): ConstraintRecord { validateConstraint(record); const existing = this.current.get(record.constraintId); if (existing && semanticKey(existing) !== semanticKey(record)) throw new ConstraintValidationError([`constraint identity collision: ${record.constraintId}`]); const history = this.historyById.get(record.constraintId) ?? []; if (!history.some((item) => item.constraintRevisionId === record.constraintRevisionId)) history.push(record); this.historyById.set(record.constraintId, history); this.current.set(record.constraintId, record); return record; }
  addMany(records: ConstraintRecord[]): ConstraintRecord[] { return records.map((record) => this.add(record)); }
  get(constraintId: string): ConstraintRecord | undefined { return this.current.get(constraintId); }
  history(constraintId: string): ConstraintRecord[] { return [...(this.historyById.get(constraintId) ?? [])]; }
  all(): ConstraintRecord[] { return Array.from(this.current.values()).sort((left, right) => left.constraintId.localeCompare(right.constraintId)); }
  evaluate(constraintId: string, context: ConstraintEvaluationContext): ConstraintEvaluation { const record = this.get(constraintId); if (!record) throw new ConstraintValidationError([`constraint not found: ${constraintId}`]); return evaluateConstraint(record, context); }
  toJSON(): ConstraintRecord[] { return Array.from(this.historyById.values()).flat().sort((left, right) => left.constraintId.localeCompare(right.constraintId) || left.projectVersion.localeCompare(right.projectVersion)); }
  static fromJSON(records: ConstraintRecord[]): ConstraintEngine { const engine = new ConstraintEngine(); engine.addMany(records); return engine; }
}

export function legacyConstraintToRecord(legacy: LegacyConstraint, projectVersion: string, subjectEntityId: string): ConstraintRecord {
  const predicate: PredicateNode = legacy.kind === "min" ? { kind: "binary", operator: "GTE", left: { kind: "reference", reference: `entity.${subjectEntityId}.${legacy.parameterId}`, valueType: "number" }, right: { kind: "literal", value: Number(legacy.value ?? 0), valueType: "number" } } : legacy.kind === "max" ? { kind: "binary", operator: "LTE", left: { kind: "reference", reference: `entity.${subjectEntityId}.${legacy.parameterId}`, valueType: "number" }, right: { kind: "literal", value: Number(legacy.value ?? 0), valueType: "number" } } : { kind: "binary", operator: "EQ", left: { kind: "reference", reference: `entity.${subjectEntityId}.${legacy.parameterId}`, valueType: "unknown" }, right: { kind: "literal", value: legacy.value ?? legacy.formula ?? "", valueType: typeof legacy.value === "number" ? "number" : "string" } };
  const base = { constraintType: "DOMAIN_RULE", subjectEntityIds: [subjectEntityId], relationIds: [], applicability: { scales: ["COMPONENT"] as ConstraintScale[], disciplines: ["architecture"] as ConstraintDiscipline[], entityIds: [subjectEntityId], entityKinds: ["family-instance"], jurisdictions: [], phaseIds: [], projectTypes: [] }, predicate, operands: {}, hardness: "HARD" as ConstraintHardness, applicabilityMode: "UNCONDITIONAL" as ConstraintApplicabilityMode, severity: "ERROR" as ConstraintSeverity, enforcement: "REPORT_ONLY" as const, epistemicStatus: "GENERATED" as EpistemicStatus, evidence: [{ kind: "legacy" as const, reference: legacy.id }], provenance: { source: "arkiParametricFamilies.Constraint", adapter: "legacyConstraintToRecord", transformations: ["legacy-adapter"] }, projectVersion, status: "ACTIVE" as ConstraintRecordStatus };
  return createConstraint(base);
}
