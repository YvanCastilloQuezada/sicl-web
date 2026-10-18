import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import {
  ConstraintEngine,
  ConstraintValidationError,
  ConstraintTypeRegistry,
  createConstraint,
  detectConstraintConflicts,
  evaluateConstraint,
  legacyConstraintToRecord,
  type ConstraintEvaluationContext,
  type ConstraintRecord,
  type ConstraintScale,
} from "../shared/arkiConstraintEngine";

const baseApplicability = {
  scales: ["COMPONENT"] as ConstraintScale[],
  disciplines: ["architecture" as const],
  entityIds: ["door-1"],
  entityKinds: ["family-instance"],
  jurisdictions: [],
  phaseIds: [],
  projectTypes: [],
  conditions: { kind: "literal", value: true, valueType: "boolean" },
};

const context: ConstraintEvaluationContext = {
  projectVersion: "V1",
  scale: "COMPONENT",
  discipline: "architecture",
  entities: { "door-1": { width: 0.9, material: "wood" } },
  relationships: [],
  derived: {},
};

const record = createConstraint({
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
});

assert.equal(record.constraintId.startsWith("constraint:"), true);
assert.equal(record.constraintRevisionId.length > 0, true);
assert.equal(evaluateConstraint(record, context).status, "SATISFIED");

const inapplicable = evaluateConstraint(record, { ...context, scale: "BUILDING" });
assert.equal(inapplicable.status, "NOT_APPLICABLE");
assert.equal(inapplicable.resolutionReason, "NONE");

const violated = evaluateConstraint(record, { ...context, entities: { "door-1": { width: 0.5 } } });
assert.equal(violated.status, "VIOLATED");

const revised = createConstraint({ ...record, projectVersion: "V2", constraintRevisionId: undefined });
const engine = new ConstraintEngine();
engine.add(record);
engine.add(revised);
assert.equal(engine.history(record.constraintId).length, 2);
assert.equal(engine.get(record.constraintId)?.projectVersion, "V2");
const reopened = ConstraintEngine.fromJSON(engine.toJSON());
assert.equal(reopened.history(record.constraintId).length, 2);
assert.equal(reopened.get(record.constraintId)?.projectVersion, "V2");

const upperBound = createConstraint({
  ...record,
  predicate: {
    kind: "binary",
    operator: "LTE",
    left: { kind: "reference", reference: "entity.door-1.width", valueType: "number" },
    right: { kind: "literal", value: 0.7, valueType: "number" },
  },
  projectVersion: "V1",
  constraintId: undefined,
  constraintRevisionId: undefined,
});
const conflicts = detectConstraintConflicts([record, upperBound], context);
assert.equal(conflicts.length, 1);
assert.deepEqual(conflicts[0].constraintIds.sort(), [record.constraintId, upperBound.constraintId].sort());

const unitConstraint = createConstraint({
  ...record,
  constraintType: "DISTANCE_LIMIT",
  predicate: {
    kind: "binary",
    operator: "LTE",
    left: { kind: "literal", value: { value: 90, unit: "cm", dimension: "LENGTH" }, valueType: "unit" },
    right: { kind: "literal", value: { value: 1, unit: "m", dimension: "LENGTH" }, valueType: "unit" },
  },
});
assert.equal(evaluateConstraint(unitConstraint, context).status, "SATISFIED");

const solverRecord = createConstraint({
  ...record,
  constraintType: "STRUCTURAL_SOLVER",
  hardness: "SOFT",
  evidence: [{ kind: "calculation", reference: "fixture-structural" }],
});
const solverResult = evaluateConstraint(solverRecord, context);
assert.equal(solverResult.status, "UNKNOWN");
assert.equal(solverResult.resolutionReason, "UNSUPPORTED_SOLVER");

const legacy = legacyConstraintToRecord({ id: "legacy-min", description: "minimum width", parameterId: "width", kind: "min", value: 0.8 }, "V1", "door-1");
assert.equal(evaluateConstraint(legacy, context).status, "SATISFIED");

assert.throws(() => createConstraint({
  ...record,
  predicate: { kind: "call", functionId: "MAX", arguments: [] },
}), ConstraintValidationError);

assert.throws(() => createConstraint({
  ...record,
  constraintType: "STRUCTURAL_SOLVER",
  evidence: [],
}), /minimum evidence required/);

const negativeContext = { ...context, derived: {} };
assert.equal(evaluateConstraint(createConstraint({
  ...record,
  predicate: { kind: "reference", reference: "derived.missing", valueType: "number" },
}), negativeContext).status, "ERROR");

const source = await readFile(new URL("../shared/arkiConstraintEngine.ts", import.meta.url), "utf8");
assert.equal(/\beval\s*\(|\bFunction\s*\(/.test(source), false);
assert.equal(Object.keys(ConstraintTypeRegistry).length >= 10, true);

console.log(JSON.stringify({ status: "PASS", registryTypes: Object.keys(ConstraintTypeRegistry).length, history: 2, statuses: ["SATISFIED", "VIOLATED", "UNKNOWN", "NOT_APPLICABLE", "ERROR"], arbitraryExecution: "PROHIBITED" }));
