import { describe, expect, it } from "vitest";
import {
  assertP9ProjectIsolation,
  buildP9CleanBoundary,
  buildP9Protocol,
  classifyP9LearningCandidate,
  createP9K0Snapshot,
  evaluateP9PostHoc,
  freezeP9BlindResult,
  validateP9InputContract,
} from "./arkiP9BlindProjectProtocol";

describe("P9.0 blind unseen project protocol", () => {
  const cleanInputs = [
    { id: "brief-1", kind: "CLIENT_FACT" as const, statement: "A new community project is requested.", state: "PROJECT_FACT" as const, sourceRefs: ["client-brief"] },
    { id: "site-1", kind: "SITE_FACT" as const, statement: "Site survey is not yet available.", state: "UNKNOWN" as const, sourceRefs: ["missing-survey-ledger"] },
    { id: "objective-1", kind: "OBJECTIVE" as const, statement: "Support public and staff activities.", state: "HUMAN_CONFIRMED" as const, sourceRefs: ["client-brief"] },
  ];

  it("freezes K0 before Project B and never creates K1", () => {
    const k0 = createP9K0Snapshot("PROJECT-B-UNSEEN-001", [
      { id: "known-1", bucket: "ALREADY_KNOWN", statement: "General architectural knowledge", sourceRefs: ["K0-source"] },
      { id: "unknown-1", bucket: "UNKNOWN", statement: "Project-specific solution is unknown", sourceRefs: ["K0-ledger"] },
    ]);
    expect(k0.frozen).toBe(true);
    expect(k0.k1Created).toBe(false);
    expect(k0.snapshotId).toContain("PROJECT-B-UNSEEN-001");
  });

  it("rejects contamination and project-specific answer leakage", () => {
    expect(assertP9ProjectIsolation("PROJECT-B-UNSEEN-001", ["general-knowledge", "PROJECT-B-UNSEEN-002"]).status).toBe("CLEAN");
    expect(assertP9ProjectIsolation("PROJECT-B-UNSEEN-001", ["docs/PROJECT-B-UNSEEN-001-answer.md"]).status).toBe("INVALID_CONTAMINATED");
    expect(validateP9InputContract(cleanInputs).valid).toBe(true);
    expect(validateP9InputContract([{ ...cleanInputs[0], statement: "preferredParti = courtyard" }]).valid).toBe(false);
  });

  it("separates blind execution from post-hoc evaluation and preserves immutability", () => {
    const blind = freezeP9BlindResult({ candidate: "unknown-at-blind-time", status: "PARTIAL" });
    const evaluated = evaluateP9PostHoc(blind, (frozen) => ({ checked: frozen.status === "PARTIAL" }));
    expect(evaluated.candidate).toBe("unknown-at-blind-time");
    expect(evaluated.postHoc.checked).toBe(true);
    expect((blind as { postHoc?: unknown }).postHoc).toBeUndefined();
  });

  it("does not mistake novelty, retrieval or execution for learning", () => {
    expect(classifyP9LearningCandidate({ inK0: true, supplied: false, directExecutionResult: false, simpleRetrieval: false, fixtureOracle: false, architecturallyMeaningful: true, traceableToEvidence: true })).toBe("OBSERVATION_ONLY");
    expect(classifyP9LearningCandidate({ inK0: false, supplied: false, directExecutionResult: false, simpleRetrieval: false, fixtureOracle: false, architecturallyMeaningful: true, traceableToEvidence: true })).toBe("LEARNING_CANDIDATE");
    expect(classifyP9LearningCandidate({ inK0: false, supplied: false, directExecutionResult: false, simpleRetrieval: false, fixtureOracle: false, architecturallyMeaningful: false, traceableToEvidence: true })).toBe("UNKNOWN");
  });

  it("keeps P9 bounded and reuses P8.2 boundaries", () => {
    const boundary = buildP9CleanBoundary("PROJECT-B-UNSEEN-001", cleanInputs);
    expect(boundary.state).toBe("CLEAN_BOUNDARY");
    const protocol = buildP9Protocol();
    expect(protocol.status).toBe("READY_FOR_PROJECT_B");
    expect(protocol.projectB).toBe("NOT_CREATED");
    expect(protocol.k1).toBe("NOT_CREATED");
    expect(protocol.specialistBoundary).toBe("P8.2_SEMANTICS_REUSED");
    expect(protocol.noArchitecturalAnswerKey).toBe(true);
  });
});
