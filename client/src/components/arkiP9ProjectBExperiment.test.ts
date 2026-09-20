import { describe, expect, it } from "vitest";
import { PROJECT_B_ID, evaluateProjectBPostHoc, runProjectBBlind, challengeProjectBObservation } from "./arkiP9ProjectBExperiment";

describe("P9 Project B controlled experiment", () => {
  it("executes a clean blind run with frozen K0 and no answer key", () => {
    const result = runProjectBBlind();
    expect(result.projectId).toBe(PROJECT_B_ID);
    expect(result.boundary.state).toBe("CLEAN_BOUNDARY");
    expect(result.inputContract.valid).toBe(true);
    expect(result.isolation.status).toBe("CLEAN");
    expect(result.k0.frozen).toBe(true);
    expect(result.k1Created).toBe(false);
    expect(result.automaticWinner).toBe("NONE");
    expect(result.candidateTopologies).toHaveLength(2);
    expect(result.geometry.state).toBe("NOT_EXECUTED");
  });

  it("keeps Phase B post-hoc and records unresolved dependencies honestly", () => {
    const result = evaluateProjectBPostHoc(runProjectBBlind());
    expect(result.postHoc.phase).toBe("POST_HOC_EVALUATION");
    expect(result.postHoc.inputFreeze).toBe("PASS");
    expect(result.postHoc.noAnswerKey).toBe("PASS");
    expect(result.postHoc.capacity).toBe("INSUFFICIENT_EVIDENCE");
    expect(result.postHoc.regulatoryApplicability).toBe("SPECIALIST_INPUT_REQUIRED");
    expect(result.postHoc.geometry).toBe("NOT_EXECUTED");
    expect(result.postHoc.learningCandidate).toBe("OBSERVATION_ONLY");
    expect(result.postHoc.acceptance).toBe("OBSERVATION_ONLY_NO_K1");
  });

  it("does not promote a Project B observation before challenge cases", () => {
    const challenge = challengeProjectBObservation();
    expect(challenge.repetition).toBe("PENDING_NEXT_AUTHORIZED_RUN");
    expect(challenge.variant).toBe("PENDING_NEXT_AUTHORIZED_RUN");
    expect(challenge.counterexample).toBe("PENDING_NEXT_AUTHORIZED_RUN");
    expect(challenge.candidateStatus).toBe("OBSERVATION_ONLY");
    expect(challenge.k1Created).toBe(false);
  });
});
