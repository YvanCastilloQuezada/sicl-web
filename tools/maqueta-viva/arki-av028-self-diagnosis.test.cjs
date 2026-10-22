"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { diagnose } = require("./arki-av028-self-diagnosis.cjs");

const root = path.resolve(__dirname, "../..");

test("AV-028 inventories tracked project files", () => {
  const r = diagnose(root);
  assert.ok(r.inventory.totalTrackedFiles > 0);
  assert.ok(r.inventory.tests.length > 0);
});

test("AV-028 preserves historical frontend identity", () => {
  const r = diagnose(root);
  const c = r.checks.find(
    x => x.id === "AV028_HISTORICAL_UI_IDENTITY"
  );
  assert.equal(c.status, "PASS");
});

test("AV-028 does not authorize canonical writes", () => {
  const r = diagnose(root);
  assert.equal(r.policy.canonicalWrite, false);
  assert.equal(r.policy.automaticRepair, false);
  assert.equal(r.policy.poApproval, "REQUIRED");
});

test("AV-028 distinguishes unknown capabilities", () => {
  const r = diagnose(root);
  assert.ok(r.unknowns.length >= 4);
  assert.ok(r.unknowns.every(x => x.status === "UNKNOWN"));
});

test("AV-028 proposals cannot execute automatically", () => {
  const r = diagnose(root);
  assert.ok(r.proposals.every(
    x => x.executionAuthorized === false
  ));
});
