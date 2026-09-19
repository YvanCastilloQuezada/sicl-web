import { describe, expect, it } from "vitest";
import {
  buildAllTypologyOperationalPrograms,
  buildEducationPreCoordinateTopologies,
  evaluateEducationPreCoordinateTopologies,
  evaluateAllTypologyPrograms,
  validateAllTypologyPrograms,
} from "./arkiTypologyOperationalPrograms";

describe("ARKI canonical typology operational programs", () => {
  it("materializes every registered typology without creating a second engine", () => {
    const programs = buildAllTypologyOperationalPrograms();
    const validation = validateAllTypologyPrograms(programs);
    expect(validation).toHaveLength(23);
    expect(validation.every((item) => item.profilePresent)).toBe(true);
    expect(validation.every((item) => item.hypothesis)).toBe(true);
    expect(validation.every((item) => item.humanReviewRequired)).toBe(true);
    expect(validation.every((item) => item.noRoomListOntology)).toBe(true);
    expect(validation.every((item) => item.requirementsPresent)).toBe(true);
  });

  it("connects education zoning to three pre-coordinate adjacency strategies", () => {
    const candidates = buildEducationPreCoordinateTopologies();
    expect(candidates).toHaveLength(3);
    expect(new Set(candidates.map((candidate) => candidate.strategy)).size).toBe(3);
    expect(candidates.every((candidate) => candidate.zones.join("|") === "PUBLIC_ENTRY|SUPERVISED_SHARED|LEARNING|STAFF_RESTRICTED|SERVICE")).toBe(true);
    expect(candidates.every((candidate) => candidate.edges.some((edge) => edge.relation === "SEPARATION" && edge.from === "SERVICE" && edge.to === "LEARNING"))).toBe(true);
    expect(candidates.every((candidate) => candidate.epistemicState === "HYPOTHESIS" && candidate.humanReviewRequired)).toBe(true);
  });

  it("evaluates the same candidates twice with independent synthetic contexts", () => {
    const first = evaluateEducationPreCoordinateTopologies({ evaluationId: "EDU-EVAL-01", enrollment: 180, siteConstraint: "urban_compact_site", climateCondition: "warm_dry" });
    const second = evaluateEducationPreCoordinateTopologies({ evaluationId: "EDU-EVAL-02", enrollment: 96, siteConstraint: "suburban_open_site", climateCondition: "cool_wet" });
    expect(first).toHaveLength(3);
    expect(second).toHaveLength(3);
    expect(first.every((result) => result.evaluationId === "EDU-EVAL-01")).toBe(true);
    expect(second.every((result) => result.evaluationId === "EDU-EVAL-02")).toBe(true);
    expect(first.every((result) => result.checks.some((check) => check.status === "UNKNOWN"))).toBe(true);
    expect(second.every((result) => result.checks.some((check) => check.status === "UNKNOWN"))).toBe(true);
    expect(first.every((result) => !result.winnerCreated && !result.recommendationCreated && !result.decisionCreated)).toBe(true);
    expect(second.every((result) => !result.winnerCreated && !result.recommendationCreated && !result.decisionCreated)).toBe(true);
  });

  it("evaluates all canonical typologies twice without promoting hypotheses to decisions", () => {
    const programs = buildAllTypologyOperationalPrograms();
    const first = evaluateAllTypologyPrograms(programs, "TYPOLOGY-EVAL-01");
    const second = evaluateAllTypologyPrograms(programs, "TYPOLOGY-EVAL-02");
    expect(first).toHaveLength(23);
    expect(second).toHaveLength(23);
    expect(first.every((result) => result.passCount === 4 && result.checks.some((check) => check.status === "UNKNOWN"))).toBe(true);
    expect(second.every((result) => result.passCount === 4 && result.checks.some((check) => check.status === "UNKNOWN"))).toBe(true);
    expect(first.every((result) => result.humanReviewRequired && !result.winnerCreated && !result.recommendationCreated && !result.decisionCreated)).toBe(true);
    expect(second.every((result) => result.humanReviewRequired && !result.winnerCreated && !result.recommendationCreated && !result.decisionCreated)).toBe(true);
  });
});
