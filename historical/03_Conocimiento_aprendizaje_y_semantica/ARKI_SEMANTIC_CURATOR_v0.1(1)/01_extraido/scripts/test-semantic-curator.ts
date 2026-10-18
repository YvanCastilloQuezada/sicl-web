import assert from "node:assert/strict";
import { IFC43_STARTER_SEED, SemanticCurator, SemanticRegistry } from "../shared/semantic";

const registry = new SemanticRegistry(IFC43_STARTER_SEED);
const curator = new SemanticCurator(registry);

assert.equal(curator.resolveLabel("Muro").decision, "REUSE_EXISTING");
assert.equal(curator.resolveLabel("Wall").suggestedSemanticId, "arki-sem:wall");
assert.equal(curator.resolveLabel("MysteryThing").decision, "PROPOSE_NEW");

const duplicate = curator.review({
  proposalId: "p1",
  kind: "ADD_CONCEPT",
  rationale: "test duplicate",
  requestedBy: "test",
  provenance: [{ sourceId:"test", sourceType:"HUMAN" }],
  candidate: {
    id:"arki-sem:wall-2",
    canonicalName:"Wall",
    definition:"duplicate",
    status:"PROPOSED",
    scales:["BUILDING"],
    parentIds:[],
    properties:[],
    quantities:[],
    relationships:[],
    mappings:[],
    provenance:[{sourceId:"test",sourceType:"HUMAN"}],
    epistemicState:"PROPOSAL",
    schemaVersion:"0.1.0"
  }
});
assert.equal(duplicate.decision, "REJECT_DUPLICATE");
assert.equal(duplicate.canonicalMutation, false);

const unknown = curator.review({
  proposalId:"p2", kind:"ADD_CONCEPT", rationale:"unknown promotion test",
  requestedBy:"test", provenance:[{sourceId:"test",sourceType:"HUMAN"}],
  candidate:{
    id:"arki-sem:unknown-x", canonicalName:"UNKNOWN_X", definition:"test",
    status:"PROPOSED", scales:["OBJECT"], parentIds:[], properties:[], quantities:[],
    relationships:[], mappings:[], provenance:[{sourceId:"test",sourceType:"HUMAN"}],
    epistemicState:"UNKNOWN", schemaVersion:"0.1.0"
  }
});
assert.equal(unknown.decision, "REJECT_UNSUPPORTED");

console.log("SEMANTIC_CURATOR_STARTER=PASS");
console.log("CANONICAL_MUTATION=false");
