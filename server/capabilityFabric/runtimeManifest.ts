import type { SolverCandidate } from "./solverCatalog";

export type RuntimeBoundary = "CORE" | "ISOLATED_WORKER" | "EXTERNAL_SERVICE";

export interface SolverRuntimeManifest {
  solverId: string;
  boundary: RuntimeBoundary;
  packageName: string | null;
  version: string | null;
  enabled: boolean;
  evidence: readonly string[];
}

export function promoteVerifiedSolver(
  candidate: SolverCandidate,
  runtime: Omit<SolverRuntimeManifest, "solverId" | "enabled">,
): SolverRuntimeManifest {
  if (candidate.lifecycle !== "VERIFIED") throw new Error("SOLVER_NOT_VERIFIED");
  if (!candidate.licenseVerified || !candidate.licenseSpdx) {
    throw new Error("SOLVER_LICENSE_NOT_VERIFIED");
  }
  if (!candidate.runtimeVerified) throw new Error("SOLVER_RUNTIME_NOT_VERIFIED");
  if (candidate.requestedCapabilities.length === 0) throw new Error("SOLVER_HAS_NO_CAPABILITY");
  if (runtime.evidence.length === 0) throw new Error("SOLVER_RUNTIME_EVIDENCE_REQUIRED");

  return Object.freeze({
    solverId: candidate.solverId,
    boundary: runtime.boundary,
    packageName: runtime.packageName,
    version: runtime.version,
    enabled: true,
    evidence: Object.freeze([...runtime.evidence]),
  });
}
