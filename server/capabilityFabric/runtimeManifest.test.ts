import { describe, expect, it } from "vitest";
import { promoteVerifiedSolver } from "./runtimeManifest";
import type { SolverCandidate } from "./solverCatalog";

const verified: SolverCandidate = {
  solverId: "solver-x",
  domain: "GEOMETRY",
  requestedCapabilities: ["MESH_BOOLEAN"],
  lifecycle: "VERIFIED",
  executionMode: "WORKER",
  licenseSpdx: "MIT",
  licenseVerified: true,
  runtimeVerified: true,
  source: "ARKI_HARVEST",
  notes: [],
};

describe("solver runtime manifest", () => {
  it("promotes only evidenced verified solvers", () => {
    expect(promoteVerifiedSolver(verified, {
      boundary: "ISOLATED_WORKER",
      packageName: "solver-x",
      version: "1.2.3",
      evidence: ["ci://solver-x/1.2.3"],
    })).toEqual({
      solverId: "solver-x",
      boundary: "ISOLATED_WORKER",
      packageName: "solver-x",
      version: "1.2.3",
      enabled: true,
      evidence: ["ci://solver-x/1.2.3"],
    });
  });

  it("rejects promotion without runtime evidence", () => {
    expect(() => promoteVerifiedSolver(verified, {
      boundary: "ISOLATED_WORKER",
      packageName: "solver-x",
      version: "1.2.3",
      evidence: [],
    })).toThrow("SOLVER_RUNTIME_EVIDENCE_REQUIRED");
  });

  it("rejects candidates that have not completed verification", () => {
    expect(() => promoteVerifiedSolver({ ...verified, lifecycle: "CANDIDATE" }, {
      boundary: "ISOLATED_WORKER",
      packageName: "solver-x",
      version: "1.2.3",
      evidence: ["ci://solver-x/1.2.3"],
    })).toThrow("SOLVER_NOT_VERIFIED");
  });
});
