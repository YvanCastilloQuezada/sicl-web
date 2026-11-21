import { describe, expect, it } from "vitest";
import {
  arkiArchitectDecision,
  screenCandidate,
} from "./arkiArchitectDecision";
import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";
import type { ProjectConstraints } from "./deriveProjectConstraints";

const candidate = (
  overrides: Partial<DesignCandidate> = {},
): DesignCandidate => ({
  id: "C-001",
  projectId: "P-001",
  generationId: "G-001",
  stage: "GENERATED",
  status: "ELIGIBLE",
  title: "Candidate",
  strategy: "PARAMETRIC",
  preview: "LOCAL",
  metrics: { floors: 4 },
  epistemic: {
    facts: [],
    assumptions: [],
    preferences: [],
    requirements: [],
    objectives: [],
    constraints: [],
  },
  evidence: ["CANDIDATE-001"],
  unknowns: [],
  failureReasons: [],
  provenance: ["G-001"],
  ...overrides,
});

const constraints = (
  hard: ProjectConstraints["hard"] = [],
): ProjectConstraints => ({
  hard,
  soft: [],
  normativeResults: [],
});

const maxFloors: ProjectConstraints["hard"][number] = {
  layer: "ZONING",
  severity: "HARD",
  code: "MAX_FLOORS",
  message: "Maximum floors",
  source: "TEST",
  evidenceRequired: true,
  limitValue: 7,
  metricKey: "floors",
  operator: "<=",
};

describe("ARKI architect screening — fail closed", () => {
  it("admits an eligible candidate with verified hard constraints", () => {
    const result = screenCandidate(candidate(), constraints([maxFloors]));
    expect(result.decision).toBe("SURVIVOR");
  });

  it("archives a FAILED candidate", () => {
    const result = screenCandidate(
      candidate({
        status: "FAILED",
        failureReasons: ["GEOMETRY_INVALID"],
      }),
      constraints(),
    );
    expect(result.decision).toBe("ARCHIVED");
    expect(result.failureReasons).toContain("GEOMETRY_INVALID");
  });

  it("holds an UNKNOWN candidate outside survivors", () => {
    const result = screenCandidate(
      candidate({
        status: "UNKNOWN",
        unknowns: ["AGK_COMPILATION_UNSUPPORTED"],
      }),
      constraints(),
    );
    expect(result.decision).toBe("HELD");
  });

  it("holds a candidate when a required metric is missing", () => {
    const result = screenCandidate(
      candidate({ metrics: {} }),
      constraints([maxFloors]),
    );
    expect(result.decision).toBe("HELD");
    expect(result.unknownReasons.join(" ")).toContain("METRIC_MISSING");
  });

  it("archives a proven hard numeric violation", () => {
    const result = screenCandidate(
      candidate({ metrics: { floors: 9 } }),
      constraints([maxFloors]),
    );
    expect(result.decision).toBe("ARCHIVED");
    expect(result.failureReasons.join(" ")).toContain("LIMIT_VIOLATED");
  });

  it("does not treat identity evidence as compliance evidence", () => {
    const nonNumericConstraint: ProjectConstraints["hard"][number] = {
      layer: "ZONING",
      severity: "HARD",
      code: "REQUIRED_SETBACK",
      message: "Setback verification",
      source: "TEST",
      evidenceRequired: true,
    };

    const result = screenCandidate(
      candidate({ evidence: ["CANDIDATE-001", "REQUIRED_SETBACK"] }),
      constraints([nonNumericConstraint]),
    );

    expect(result.decision).toBe("HELD");
  });

  it("separates survivors, archived and held candidates", () => {
    const result = arkiArchitectDecision(
      [
        candidate({ id: "PASS" }),
        candidate({
          id: "FAIL",
          status: "FAILED",
          failureReasons: ["INVALID"],
        }),
        candidate({
          id: "UNKNOWN",
          status: "UNKNOWN",
          unknowns: ["MISSING_DATA"],
        }),
      ],
      constraints(),
    );

    expect(result.survivors.map((item) => item.id)).toEqual(["PASS"]);
    expect(result.archived.map((item) => item.candidateId)).toEqual(["FAIL"]);
    expect(result.held.map((item) => item.candidateId)).toEqual(["UNKNOWN"]);
  });
});
