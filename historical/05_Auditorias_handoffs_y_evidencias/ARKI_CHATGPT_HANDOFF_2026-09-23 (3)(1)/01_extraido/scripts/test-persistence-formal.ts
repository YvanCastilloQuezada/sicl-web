import { strict as assert } from "node:assert";
import { nextAuditEntry, validateSnapshotGate, verifyAuditChain } from "../shared/persistence/arkiPersistence";

const first = nextAuditEntry({ id: "audit-1", timestamp: "2026-09-23T00:00:00Z", actor: "po", action: "create", target: "snapshot-1", afterHash: "hash-1" });
const second = nextAuditEntry({ id: "audit-2", timestamp: "2026-09-23T00:01:00Z", actor: "po", action: "approve", target: "snapshot-1", beforeHash: "hash-1", afterHash: "hash-2" }, first.chainHash);
assert.deepEqual(verifyAuditChain([first, second]), { valid: true });
const missing = validateSnapshotGate({ modelHash: "model-hash", criticalElementIds: ["wall-1"], auditTrail: [first], approvedBy: "po", validationErrors: [], parentVersionExists: true });
assert.deepEqual(missing, []);
const rejected = validateSnapshotGate({ modelHash: undefined, criticalElementIds: [""], auditTrail: [], approvedBy: undefined, validationErrors: ["geometry"], parentVersionExists: false });
assert.ok(rejected.length >= 5);
console.log(JSON.stringify({ status: "PASS", auditChain: "valid", gatePassed: missing.length === 0, rejectedRequirements: rejected.length }));
