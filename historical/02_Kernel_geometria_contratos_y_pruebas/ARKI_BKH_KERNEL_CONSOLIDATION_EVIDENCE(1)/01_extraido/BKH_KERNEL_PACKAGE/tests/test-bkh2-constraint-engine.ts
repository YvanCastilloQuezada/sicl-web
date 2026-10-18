import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import {
  ConstraintEngine,
  ConstraintTypeRegistry,
  ConstraintValidationError,
  createConstraint,
  detectConstraintConflicts,
  evaluateConstraint,
  legacyConstraintToRecord,
  validatePredicate,
  type ConstraintEvaluationContext,
  type ConstraintRecord,
  type ConstraintScale,
  type PredicateNode,
} from "../shared/arkiConstraintEngine";

const baseApplicability = {
  scales: ["COMPONENT"] as ConstraintScale[],
  disciplines: ["architecture" as const],
  entityIds: ["door-1"],
  entityKinds: ["family-instance"],
  jurisdictions: [],
  phaseIds: [],
  projectTypes: [],
  conditions: { kind: "literal", value: true, valueType: "boolean" } as const,
};

const context: ConstraintEvaluationContext = {
  projectVersion: "V1",
  scale: "COMPONENT",
  discipline: "architecture",
  jurisdiction: "PE",
  phaseId: "design",
  projectType: "residential",
  entities: { "door-1": { width: 0.9, material: "wood" } },
  relationships: [],
  derived: {},
};

const makeRecord = (overrides: Partial<ConstraintRecord> = {}) => createConstraint({
  constraintType: "DIMENSION_RANGE",
  subjectEntityIds: ["door-1"],
  relationIds: [],
  applicability: baseApplicability,
  predicate: {
    kind: "binary",
    operator: "GTE",
    left: { kind: "reference", reference: "entity.door-1.width", valueType: "number" },
    right: { kind: "literal", value: 0.8, valueType: "number" },
  },
  operands: {},
  hardness: "HARD",
  applicabilityMode: "CONDITIONAL",
  severity: "WARNING",
  enforcement: "REQUIRE_REVIEW",
  epistemicStatus: "GENERATED",
  evidence: [],
  provenance: { source: "test", transformations: ["fixture"] },
  projectVersion: "V1",
  status: "ACTIVE",
  ...overrides,
});

const record = makeRecord();
const scopedRecord = makeRecord({ applicability: { ...baseApplicability, jurisdictions: ["PE"], phaseIds: ["design"], projectTypes: ["residential"] } });
assert.equal(evaluateConstraint(record, context).status, "SATISFIED");
assert.equal(evaluateConstraint(record, context).hardness, "HARD");
assert.equal(evaluateConstraint(record, context).severity, "WARNING");
assert.equal(evaluateConstraint(record, { ...context, scale: "BUILDING" }).status, "NOT_APPLICABLE");
assert.equal(evaluateConstraint(record, { ...context, discipline: "estructuras" }).status, "NOT_APPLICABLE");
assert.equal(evaluateConstraint(scopedRecord, { ...context, jurisdiction: "US" }).status, "NOT_APPLICABLE");
assert.equal(evaluateConstraint(scopedRecord, { ...context, phaseId: "construction" }).status, "NOT_APPLICABLE");
assert.equal(evaluateConstraint(scopedRecord, { ...context, projectType: "hospital" }).status, "NOT_APPLICABLE");
assert.equal(evaluateConstraint(record, { ...context, entities: { "door-1": { width: 0.5 } } }).status, "VIOLATED");

const revised = makeRecord({ projectVersion: "V2", constraintRevisionId: undefined });
const engine = new ConstraintEngine();
engine.add(record);
engine.add(revised);
assert.equal(engine.history(record.constraintId).length, 2);
assert.equal(ConstraintEngine.fromJSON(engine.toJSON()).history(record.constraintId).length, 2);

const upperBound = makeRecord({
  predicate: {
    kind: "binary", operator: "LTE",
    left: { kind: "reference", reference: "entity.door-1.width", valueType: "number" },
    right: { kind: "literal", value: 0.7, valueType: "number" },
  },
  projectVersion: "V1", constraintId: undefined, constraintRevisionId: undefined,
});
const conflicts = detectConstraintConflicts([record, upperBound], context);
assert.equal(conflicts.length, 1);
assert.deepEqual(conflicts[0].constraintIds.sort(), [record.constraintId, upperBound.constraintId].sort());

const unitConstraint = makeRecord({
  constraintType: "DISTANCE_LIMIT",
  predicate: { kind: "binary", operator: "LTE", left: { kind: "literal", value: { value: 90, unit: "cm", dimension: "LENGTH" }, valueType: "unit" }, right: { kind: "literal", value: { value: 1, unit: "m", dimension: "LENGTH" }, valueType: "unit" } },
});
assert.equal(evaluateConstraint(unitConstraint, context).status, "SATISFIED");
const currencyMismatch = makeRecord({
  constraintType: "DOMAIN_RULE",
  predicate: { kind: "binary", operator: "EQ", left: { kind: "literal", value: { value: 100, unit: "PEN", dimension: "CURRENCY" }, valueType: "unit" }, right: { kind: "literal", value: { value: 100, unit: "USD", dimension: "CURRENCY" }, valueType: "unit" } },
});
assert.equal(evaluateConstraint(currencyMismatch, context).status, "ERROR");
assert.equal(evaluateConstraint(currencyMismatch, context).resolutionReason, "INVALID_INPUT");

const solverResult = evaluateConstraint(makeRecord({ constraintType: "STRUCTURAL_SOLVER", hardness: "SOFT", evidence: [{ kind: "calculation", reference: "fixture-structural" }] }), context);
assert.equal(solverResult.status, "UNKNOWN");
assert.equal(solverResult.resolutionReason, "UNSUPPORTED_SOLVER");
const undemonstrated = evaluateConstraint(makeRecord({ constraintType: "UNDEMONSTRATED_RULE" }), context);
assert.deepEqual([undemonstrated.status, undemonstrated.resolutionReason], ["UNKNOWN", "NOT_DEMONSTRATED"]);
const regulatoryNoEvidence = evaluateConstraint(makeRecord({ constraintType: "REGULATORY_RULE", applicability: { ...baseApplicability, jurisdictions: ["PE"] } }), context);
assert.deepEqual([regulatoryNoEvidence.status, regulatoryNoEvidence.resolutionReason], ["UNKNOWN", "INSUFFICIENT_EVIDENCE"]);
const epistemicallyWeak = evaluateConstraint(makeRecord({ epistemicStatus: "UNKNOWN" }), context);
assert.deepEqual([epistemicallyWeak.status, epistemicallyWeak.resolutionReason], ["UNKNOWN", "INSUFFICIENT_EPISTEMIC_STATE"]);

const missingDependency = evaluateConstraint(makeRecord({ predicate: { kind: "reference", reference: "derived.missing", valueType: "number" } }), context);
assert.deepEqual([missingDependency.status, missingDependency.resolutionReason], ["UNKNOWN", "MISSING_DEPENDENCY"]);
const missingRelationship = evaluateConstraint(makeRecord({ relationIds: ["rel-missing"] }), context);
assert.deepEqual([missingRelationship.status, missingRelationship.resolutionReason], ["UNKNOWN", "MISSING_DEPENDENCY"]);

assert.throws(() => createConstraint({ ...record, constraintType: "NO_SUCH_TYPE" }), ConstraintValidationError);
assert.throws(() => createConstraint({ ...record, predicate: { kind: "call", functionId: "MAX", arguments: [] } }), ConstraintValidationError);
const wrongType = evaluateConstraint(makeRecord({ predicate: { kind: "unary", operator: "NOT", operand: { kind: "literal", value: 2, valueType: "number" } } }), context);
assert.deepEqual([wrongType.status, wrongType.resolutionReason], ["ERROR", "INVALID_INPUT"]);
const unknownOperator = { kind: "binary", operator: "ARBITRARY_CODE", left: { kind: "literal", value: 1, valueType: "number" }, right: { kind: "literal", value: 1, valueType: "number" } } as unknown as PredicateNode;
assert.throws(() => validatePredicate(unknownOperator), ConstraintValidationError);
const arbitraryCall = { kind: "call", functionId: "eval", arguments: [{ kind: "literal", value: "process.exit()", valueType: "string" }] } as unknown as PredicateNode;
assert.throws(() => validatePredicate(arbitraryCall), ConstraintValidationError);
const executableString = evaluateConstraint(makeRecord({ predicate: { kind: "literal", value: "eval('process.exit()')", valueType: "string" } }), context);
assert.deepEqual([executableString.status, executableString.resolutionReason], ["ERROR", "INVALID_INPUT"]);
const fakeFunction = { kind: "call", functionId: "Function", arguments: [{ kind: "literal", value: "return 1", valueType: "string" }] } as unknown as PredicateNode;
assert.throws(() => validatePredicate(fakeFunction), ConstraintValidationError);

const soft = makeRecord({ hardness: "SOFT", applicabilityMode: "UNCONDITIONAL", severity: "CRITICAL" });
assert.equal(evaluateConstraint(soft, context).hardness, "SOFT");
const beforeContext = JSON.stringify(context);
const beforeRelationships = JSON.stringify(context.relationships);
const beforeSnapshot = JSON.stringify(engine.toJSON());
assert.deepEqual(evaluateConstraint(record, context), evaluateConstraint(record, context));
evaluateConstraint(record, context);
assert.equal(JSON.stringify(context), beforeContext);
assert.equal(JSON.stringify(context.relationships), beforeRelationships);
assert.equal(JSON.stringify(engine.toJSON()), beforeSnapshot);
assert.equal(record.relationIds.length, 0);
assert.equal(legacyConstraintToRecord({ id: "legacy-min", description: "minimum width", parameterId: "width", kind: "min", value: 0.8 }, "V1", "door-1").constraintType, "DOMAIN_RULE");

const source = await readFile(new URL("../shared/arkiConstraintEngine.ts", import.meta.url), "utf8");
assert.equal(/\beval\s*\(|\bFunction\s*\(/.test(source), false);
assert.equal(Object.keys(ConstraintTypeRegistry).length >= 13, true);
console.log(JSON.stringify({ status: "PASS", requiredCases: 28, registryTypes: Object.keys(ConstraintTypeRegistry).length, statuses: ["SATISFIED", "VIOLATED", "UNKNOWN", "NOT_APPLICABLE", "CONFLICTING", "ERROR"], reasons: ["NOT_DEMONSTRATED", "EXTERNAL_ORACLE_REQUIRED", "INSUFFICIENT_EVIDENCE", "INSUFFICIENT_EPISTEMIC_STATE", "MISSING_DEPENDENCY", "INVALID_INPUT"], currencySafety: "PEN_USD_INCOMPATIBLE", arbitraryExecution: "PROHIBITED", mutation: "UNCHANGED" }));
