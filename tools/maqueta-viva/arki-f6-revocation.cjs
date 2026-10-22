"use strict";

const EXPECTED = Object.freeze({
  decision: "PERMANENT_FROZEN_REVOCATION",
  authority: "PO_EXPLICIT",
  date: "2026-10-14",
  phase: "F6",
  current_status: "RECONCILIATION_REQUIRED",
  historical_evidence: "GO_BOUNDED_DEMONSTRATED_BOUNDARY",
  scope: "F6 phase status; historical evidence and other FROZEN contracts are preserved",
  rule: "Do not automatically restore FROZEN; any future freeze requires a new explicit PO decision and independently verified evidence."
});

function validateF6Revocation(value) {
  if (!value || typeof value !== "object" ||
      Object.entries(EXPECTED).some(
        ([key, expected]) => value[key] !== expected
      )) {
    throw Error("INVALID_F6_REVOCATION");
  }
  return true;
}

function validateF6Map(map, phases) {
  validateF6Revocation(map?.f6_freeze_revocation);
  const f6 = phases.find(p => p && p.id === "F6");
  if (!f6 ||
      f6.status !== "RECONCILIATION_REQUIRED" ||
      f6.evidence_status !==
        "HISTORICAL_GO_BOUNDED_EVIDENCE_RETAINED_REVALIDATION_REQUIRED") {
    throw Error("F6_REVOCATION_STATUS_CONFLICT");
  }
  return true;
}

module.exports = {validateF6Revocation, validateF6Map};
