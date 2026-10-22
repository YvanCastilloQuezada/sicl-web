const test = require("node:test");
const assert = require("node:assert/strict");
const {scope}=require("./arki-executor-scope.cjs");
const REPO="YvanCastilloQuezada/sicl-web";

const sha = "a".repeat(40);

function manifest(phase = "F6") {
  return {
    schema: "ARKI-EXECUTOR-SCOPE-1",
    caseId: "AC-1",
    phase,
    repository: REPO,
    baseBranch: "feat/f7-f8-integral-closure",
    baseSha: sha,
    allowedPaths: ["tools/maqueta-viva/example.cjs"],
    noCanonicalPromotion: true,
    requiresRedTeam: true,
    requiresOwnerAuthorization: true
  };
}

function changes() {
  return [
    {
      status: "A",
      path: "tools/maqueta-viva/executor-scope.json"
    },
    {
      status: "M",
      path: "tools/maqueta-viva/example.cjs"
    }
  ];
}

function revocation() {
  return {
    decision: "PERMANENT_FROZEN_REVOCATION",
    authority: "PO_EXPLICIT",
    date: "2026-10-14",
    phase: "F6",
    current_status: "RECONCILIATION_REQUIRED",
    historical_evidence: "GO_BOUNDED_DEMONSTRATED_BOUNDARY",
    scope:
      "F6 phase status; historical evidence and other FROZEN contracts are preserved",
    rule:
      "Do not automatically restore FROZEN; any future freeze requires a new explicit PO decision and independently verified evidence."
  };
}

function state(status = "RECONCILIATION_REQUIRED") {
  return {
    roadmap: {
      phases: [
        {id: "F6", status},
        {id: "F7", status: "FROZEN"},
        {id: "F8", status: "IN_PROGRESS"}
      ]
    },
    f6_freeze_revocation: revocation()
  };
}

function inspect(m = manifest(), s = state(), c = changes()) {
  return scope(m, sha, sha, c, s);
}

test("F6 reconciliation is blocked by permanent PO revocation", () => {
  assert.throws(
    () => inspect(),
    /F6_PO_REVOCATION_RECONCILIATION_REQUIRED/
  );
});

test("F6 permanent revocation blocks alternative statuses", () => {
  for (const status of ["IN_PROGRESS", "APPROVED"]) {
    assert.throws(
      () => inspect(manifest(), state(status)),
      /F6_PO_REVOCATION_RECONCILIATION_REQUIRED/
    );
  }
});

test("F6 rejects missing or corrupted revocation", () => {
  const cases = [
    s => {delete s.f6_freeze_revocation;},
    s => {s.f6_freeze_revocation.authority = "UNKNOWN";},
    s => {s.f6_freeze_revocation.decision = "FROZEN";},
    s => {s.f6_freeze_revocation.phase = "F7";},
    s => {s.f6_freeze_revocation.date = "2026-10-13";},
    s => {s.f6_freeze_revocation.current_status = "APPROVED";},
    s => {s.f6_freeze_revocation.rule = "AUTO_FREEZE_ALLOWED";},
    s => {s.f6_freeze_revocation.scope = "F6";},
    s => {s.f6_freeze_revocation.historical_evidence = "UNKNOWN";}
  ];

  for (const mutate of cases) {
    const s = state("IN_PROGRESS");
    mutate(s);
    assert.throws(
      () => inspect(manifest(), s),
      /INVALID_F6_REVOCATION/
    );
  }
});

test("F6 corrupted revocation is rejected during reconciliation", () => {
  const cases = [
    s => {delete s.f6_freeze_revocation;},
    s => {s.f6_freeze_revocation.authority = "UNKNOWN";},
    s => {s.f6_freeze_revocation.decision = "FROZEN";},
    s => {s.f6_freeze_revocation.phase = "F7";},
    s => {s.f6_freeze_revocation.date = "2026-10-13";},
    s => {s.f6_freeze_revocation.current_status = "APPROVED";},
    s => {s.f6_freeze_revocation.historical_evidence = "UNKNOWN";},
    s => {s.f6_freeze_revocation.scope = "F6";},
    s => {s.f6_freeze_revocation.rule = "AUTO_FREEZE_ALLOWED";}
  ];

  for (const mutate of cases) {
    const candidate = state("RECONCILIATION_REQUIRED");
    mutate(candidate);

    assert.throws(
      () => inspect(manifest(), candidate),
      /INVALID_F6_REVOCATION/
    );
  }
});

test("synthetic F7 FROZEN scenario remains protected", () => {
  assert.throws(
    () => inspect(manifest("F7"), state()),
    /PHASE_UNKNOWN_OR_FROZEN/
  );
});

test("F8 scope never implies authorization", () => {
  const result = inspect(manifest("F8"), state());
  assert.equal(result.scope, "PASS");
  assert.equal(result.ownerAuthorization, "NOT_VERIFIED");
  assert.equal(result.redTeam, "NOT_VERIFIED");
  assert.equal(result.acceptance, "BLOCKED");
});

test("protected paths are rejected", () => {
  const m = manifest("F8");
  m.allowedPaths = ["docs/arki-master-map/state.json"];

  assert.throws(
    () => inspect(m, state()),
    /PROTECTED_ALLOWLIST/
  );
});

test("missing mandatory controls are rejected", () => {
  const m = manifest("F8");
  m.requiresOwnerAuthorization = false;

  assert.throws(
    () => inspect(m, state()),
    /MANDATORY_GATES_MISSING/
  );
});

console.log("AV036_03U_EXECUTOR_CONTRACT_TESTS_LOADED");
