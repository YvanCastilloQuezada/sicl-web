import { strict as assert } from "node:assert";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { adaptConstructionModelRelationships, migrateLegacyRelations } from "../shared/arkiRelationshipAdapters";
import { RelationshipFabric, RelationshipTypeRegistry, createRelationship, inverseRelationship, type RelationshipRecord } from "../shared/arkiRelationshipFabric";

const model = generateConstructionModel({ projectId: "bkh1-fixture", name: "BKH-1 fixture", widthM: 8, depthM: 6, floors: 2 });
const migrated = migrateLegacyRelations(model);
assert.equal(migrated.unknownLegacyTypes.length, 0, "all legacy relation types must map to the registry");
assert.ok(migrated.relationships.length > 0, "construction relations must be adapted");
assert.ok(migrated.relationships.every((record) => record.relationshipId.startsWith("rel:")));
assert.ok(migrated.relationships.every((record) => record.relationshipRevisionId.startsWith("rev:")));
assert.ok(migrated.relationships.every((record) => record.provenance.adapter === "arkiRelationshipAdapters"));

const fabric = new RelationshipFabric();
fabric.addMany(migrated.relationships);
assert.equal(fabric.all().length, migrated.relationships.length, "migration must be idempotent by semantic identity");
const saved = JSON.stringify(fabric.toJSON());
const reopened = RelationshipFabric.fromJSON(JSON.parse(saved) as RelationshipRecord[]);
assert.equal(JSON.stringify(reopened.toJSON()), saved, "save/close/reopen must preserve relationships");

const crossScale = createRelationship({ relationshipType: "SUPPORTS", sourceEntityId: "site-structure", targetEntityId: "building-1", direction: "DIRECTED", sourceScale: "SITE", targetScale: "BUILDING", applicabilityScale: "SITE", sourceDiscipline: "architecture", targetDiscipline: "estructuras", relationshipDiscipline: "coordination", origin: "CANONICAL", evidence: [{ kind: "fixture", reference: "RF-T00" }], epistemicStatus: "OBSERVED", projectVersion: "v1", provenance: { source: "fixture", transformations: [] } });
assert.equal(crossScale.sourceScale, "SITE");
assert.equal(crossScale.targetScale, "BUILDING");
assert.equal(crossScale.applicabilityScale, "SITE");
assert.equal(crossScale.relationshipDiscipline, "coordination");
const { relationshipId: _oldId, relationshipRevisionId: _oldRevision, ...crossScaleWithoutRevision } = crossScale;
const sameSemanticsNewVersion = createRelationship({ ...crossScaleWithoutRevision, projectVersion: "v2" });
assert.equal(sameSemanticsNewVersion.relationshipId, crossScale.relationshipId, "project revision must not change semantic identity");
assert.notEqual(sameSemanticsNewVersion.relationshipRevisionId, crossScale.relationshipRevisionId, "project revision must change revision identity");

const inverse = inverseRelationship(crossScale);
assert.ok(inverse);
assert.equal(inverse?.sourceEntityId, crossScale.targetEntityId);
assert.equal(inverse?.targetEntityId, crossScale.sourceEntityId);

assert.throws(() => createRelationship({ ...crossScale, relationshipType: "NOT_REGISTERED" }), /Unknown relationship type/);
assert.throws(() => createRelationship({ ...crossScale, sourceEntityId: crossScale.targetEntityId, targetEntityId: crossScale.targetEntityId }), /Self relationship/);
assert.throws(() => createRelationship({ ...crossScale, epistemicStatus: "VERIFIED", evidence: [] }), /requires evidence/);
assert.equal(RelationshipTypeRegistry.OPENS_TO.inverseType, "OPENED_BY");
assert.equal(RelationshipTypeRegistry.SUPPORTS.cyclePolicy, "REJECT");

const secondMigration = adaptConstructionModelRelationships(model);
assert.equal(JSON.stringify(secondMigration), JSON.stringify(migrated.relationships), "repeated migration must be deterministic");
console.log(`BKH-1 relationship fabric PASS: ${fabric.all().length} migrated relationships, registry=${Object.keys(RelationshipTypeRegistry).length}`);
