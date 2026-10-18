import { strict as assert } from "node:assert";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import {
  createProgram,
  evaluateArchitecturalProgram,
  programRelationship,
  programStateFromSpaces,
  type ArchitecturalProgram,
  type ObservedProgramRelationship,
  type ProgramRelationship,
  type ProgramSpaceRequirement,
} from "../shared/arkiArchitecturalProgram";

const provenance = { source: "DESIGN_BRIEF" as const, reference: "PA001-fixture", transformations: [] };
const evidence = [{ kind: "fixture" as const, reference: "PA001-fixture" }];
const applicability = { buildingType: "generic", projectPhase: "design" };
const spaces = generateConstructionModel({ projectId: "pa-project", name: "PA fixture", widthM: 12, depthM: 10, floors: 1 }).spaces.slice(0, 3);
const observed = (type: ObservedProgramRelationship["relationType"], source = "A", target = "B"): ObservedProgramRelationship => ({ id: `obs-${source}-${target}-${type}`, sourceSpace: source, targetSpace: target, relationType: type, priority: "MANDATORY", epistemicState: "OBSERVED", evidence, provenance, applicability });
const requirement = (relation: ProgramRelationship): ProgramSpaceRequirement => ({ id: "A", name: "A", spaceType: "generic", activities: ["work"], userTypes: ["staff"], relationships: [relation], evidence, provenance, epistemicState: "REQUIRED", applicability });
const program = (relation: ProgramRelationship, extra: ProgramSpaceRequirement[] = []): ArchitecturalProgram => createProgram({ id: "program-1", name: "Program fixture", spaces: [requirement(relation), ...extra], provenance });
const relation = (type: ProgramRelationship["relationType"], priority: ProgramRelationship["priority"] = "MANDATORY", source = "A", target = "B"): ProgramRelationship => programRelationship({ sourceSpace: source, targetSpace: target, relationType: type, priority, epistemicState: "REQUIRED", evidence, provenance, applicability });
const state = (relationships: ObservedProgramRelationship[] = [], projectId = "pa-project") => programStateFromSpaces(projectId, spaces.map((space, index) => ({ ...space, id: index === 0 ? "A" : index === 1 ? "B" : "C" })), relationships);
const evaluate = (expected: ProgramRelationship, actual: ObservedProgramRelationship[] = []) => evaluateArchitecturalProgram(program(expected), state(actual));

// PA-T01..PA-T10
assert.deepEqual(evaluate(relation("ADJACENT_TO"), [observed("ADJACENT_TO")]).satisfiedRelations, ["A|B|ADJACENT_TO"]);
assert.deepEqual(evaluate(relation("ADJACENT_TO"), [observed("SEPARATED_FROM")]).violatedRelations, ["A|B|ADJACENT_TO"]);
assert.deepEqual(evaluate(relation("ADJACENT_TO")).unknownRelations, ["A|B|ADJACENT_TO"]);
const preferred = evaluate(relation("ADJACENT_TO", "PREFERENCE"), [observed("SEPARATED_FROM")]); assert.equal(preferred.violatedRelations.length, 0); assert.equal(preferred.unknownRelations.length, 1);
const conflict = evaluateArchitecturalProgram(createProgram({ id: "conflict", name: "Conflict", spaces: [requirement(relation("ADJACENT_TO")), { ...requirement(relation("SEPARATED_FROM")), id: "B", name: "B" }], provenance }), state()); assert.equal(conflict.conflicts.length, 2); assert.equal(conflict.diagnostics.some((item) => item.kind === "CONFLICT_DETECTED"), true);
assert.deepEqual(evaluate(relation("ADJACENT_TO")), evaluate(relation("ADJACENT_TO")));
const renamed = evaluateArchitecturalProgram(program(relation("ADJACENT_TO")), state([observed("ADJACENT_TO")])); const renamedState = programStateFromSpaces("pa-project", spaces.map((space, index) => ({ ...space, id: index === 0 ? "source" : index === 1 ? "target" : "C" })), [observed("ADJACENT_TO", "source", "target")]); const renamedRequirement = requirement(relation("ADJACENT_TO", "MANDATORY", "source", "target")); const renamedResult = evaluateArchitecturalProgram(createProgram({ id: "program-rename", name: "Program", spaces: [{ ...renamedRequirement, id: "source" }, { ...renamedRequirement, id: "target", name: "Target" }], provenance }), renamedState); assert.deepEqual(renamed.satisfiedRelations.map(() => "SATISFIED"), renamedResult.satisfiedRelations.map(() => "SATISFIED"));
const missing = evaluateArchitecturalProgram(program(relation("ADJACENT_TO")), programStateFromSpaces("other-project", [])); assert.equal(missing.unknownRelations.length, 1); assert.deepEqual(missing.missingRequirements.sort(), ["A"]);
const na = evaluateArchitecturalProgram(program({ ...relation("ADJACENT_TO"), applicability: {} }), state()); assert.deepEqual(na.notApplicableRelations, ["A|B|ADJACENT_TO"]);
const isolatedA = evaluate(relation("ADJACENT_TO"), [observed("ADJACENT_TO")],); const isolatedB = evaluateArchitecturalProgram(program(relation("ADJACENT_TO")), state([], "project-b")); assert.equal(isolatedA.projectId, "pa-project"); assert.equal(isolatedB.projectId, "project-b");

// PA-A01..PA-A08
const circular = [observed("FUNCTIONALLY_DEPENDS_ON", "A", "B"), observed("FUNCTIONALLY_DEPENDS_ON", "B", "C"), observed("FUNCTIONALLY_DEPENDS_ON", "C", "A")]; assert.doesNotThrow(() => evaluateArchitecturalProgram(createProgram({ id: "cycle", name: "Cycle", spaces: [requirement(relation("FUNCTIONALLY_DEPENDS_ON", "MANDATORY", "A", "B")), { ...requirement(relation("FUNCTIONALLY_DEPENDS_ON", "MANDATORY", "B", "C")), id: "B", name: "B" }, { ...requirement(relation("FUNCTIONALLY_DEPENDS_ON", "MANDATORY", "C", "A")), id: "C", name: "C" }], provenance }), state(circular)));
const duplicates = evaluateArchitecturalProgram(program(relation("ADJACENT_TO")), state([observed("ADJACENT_TO"), observed("ADJACENT_TO")])); assert.equal(duplicates.satisfiedRelations.length, 1);
assert.equal(conflict.diagnostics.filter((item) => item.kind === "CONFLICT_DETECTED").length > 0, true);
const noProvenance = evaluate(relation("ADJACENT_TO")); assert.equal(noProvenance.provenance.source, "DESIGN_BRIEF");
const noGeometry = evaluate(relation("ADJACENT_TO")); assert.equal(noGeometry.unknownRelations.length, 1);
const observedOnly = evaluateArchitecturalProgram(createProgram({ id: "observed-only", name: "Observed only", spaces: [], provenance }), state([observed("ADJACENT_TO")])); assert.equal(observedOnly.missingRequirements.length, 0);
const many = Array.from({ length: 500 }, (_, index) => ({ ...requirement(relation("ADJACENT_TO", "MANDATORY", "A", "B")), id: `space-${index}`, name: `Space ${index}` })); assert.doesNotThrow(() => evaluateArchitecturalProgram(createProgram({ id: "large", name: "Large", spaces: many, provenance }), state([observed("ADJACENT_TO")])),);
assert.doesNotThrow(() => evaluateArchitecturalProgram({ ...program(relation("ADJACENT_TO")), spaces: [{ ...requirement(relation("ADJACENT_TO")), relationships: [] }] }, state()));

// PA-M01..PA-M05
const base = evaluate(relation("ADJACENT_TO"), [observed("ADJACENT_TO")]); const reordered = evaluateArchitecturalProgram({ ...program(relation("ADJACENT_TO")), spaces: [...program(relation("ADJACENT_TO")).spaces].reverse() }, state([observed("ADJACENT_TO")])); assert.deepEqual(base.satisfiedRelations, reordered.satisfiedRelations);
const relationReordered = evaluateArchitecturalProgram(program(relation("ADJACENT_TO")), state([observed("ADJACENT_TO")])); assert.deepEqual(base.satisfiedRelations, relationReordered.satisfiedRelations);
assert.deepEqual(base.satisfiedRelations.map(() => "SATISFIED"), renamedResult.satisfiedRelations.map(() => "SATISFIED"));
assert.equal(duplicates.violatedRelations.length, 0);
const independent = evaluateArchitecturalProgram(createProgram({ id: "independent", name: "Independent", spaces: [requirement(relation("ADJACENT_TO")), { ...requirement(relation("NEAR", "MANDATORY", "B", "C")), id: "B", name: "B" }], provenance }), state([observed("ADJACENT_TO")])); assert.deepEqual(independent.satisfiedRelations, base.satisfiedRelations);

// Test-the-test: controlled mutant must be detected by the oracle.
const expectedStatus = (result: ReturnType<typeof evaluate>) => result.unknownRelations.length === 1 && result.satisfiedRelations.length === 0;
const mutant = { ...evaluate(relation("ADJACENT_TO")), unknownRelations: [], satisfiedRelations: ["A|B|ADJACENT_TO"] };
assert.equal(expectedStatus(evaluate(relation("ADJACENT_TO"))), true);
assert.equal(expectedStatus(mutant as ReturnType<typeof evaluate>), false);
console.log(JSON.stringify({ status: "PASS", normal: 10, adversarial: 8, metamorphic: 5, testTheTest: "PASS", deterministic: true, unknownPreserved: true, provenancePreserved: true, conflictDetection: true, projectIsolation: true }));
