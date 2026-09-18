import { describe, expect, it } from "vitest";
import { calculateA32Evacuation, calculateA32Occupancy, validateA32Result } from "./a32EvacuationOccupancy";
import { generateVerifiedResidentialPlan } from "./residentialConstructivePlan";

describe("A32 occupancy and evacuation", () => {
  it("calculates a deterministic preliminary occupancy proxy by level", () => {
    const plan = generateVerifiedResidentialPlan();
    const result = calculateA32Occupancy(plan, { PUBLIC: 8, PRIVATE: 12, SERVICE: 10, CIRCULATION: 10 });
    expect(result.state).toBe("COMPUTED");
    expect(result.maximumOccupancyPersons).toBe(5);
    expect(result.byLevel.N1).toBe(3);
    expect(result.byLevel.N2).toBe(2);
    expect(result.regulatoryStatus).toBe("NOT_ASSESSED");
  });

  it("marks occupancy incomplete when a zone factor is missing", () => {
    const result = calculateA32Occupancy(generateVerifiedResidentialPlan(), { PUBLIC: 8 }, "USER_SUPPLIED");
    expect(result.state).toBe("INCOMPLETE");
    expect(result.records.some((record) => record.occupantLoadFactorM2PerPerson === 0)).toBe(true);
  });

  it("computes a reachable capacity proxy without calling it evacuation time", () => {
    const plan = generateVerifiedResidentialPlan();
    const completeRoute = { ...plan.routes[0], roomIds: plan.rooms.map((room) => room.id).concat("STAIR-CORE") };
    const completePlan = { ...plan, routes: [completeRoute] };
    const occupancy = calculateA32Occupancy(completePlan, { PUBLIC: 8, PRIVATE: 12, SERVICE: 10, CIRCULATION: 10 });
    const result = calculateA32Evacuation(completePlan, occupancy, { exitNodeId: "STAIR-CORE", flowRatePersonsPerMinPerM: 1.3, source: "EDUCATIONAL_PROXY", evidenceRefs: ["TEST:A32-FLOW"], provenance: ["A32 test fixture"] });
    expect(result.state).toBe("COMPUTED");
    expect(result.routes.every((route) => route.reachable)).toBe(true);
    expect(result.maximumEstimatedFlowMinutes).not.toBeNull();
    expect(result.flowMeaning).toBe("CAPACITY_PROXY_NOT_EVACUATION_TIME");
    expect(validateA32Result(result)).toBe(true);
  });

  it("preserves unreachable routes and does not auto-correct them", () => {
    const plan = generateVerifiedResidentialPlan();
    const occupancy = calculateA32Occupancy(plan, { PUBLIC: 8, PRIVATE: 12, SERVICE: 10, CIRCULATION: 10 });
    const result = calculateA32Evacuation(plan, occupancy, { exitNodeId: "EXIT-NOT-IN-ROUTE", flowRatePersonsPerMinPerM: 1.3, source: "EDUCATIONAL_PROXY", evidenceRefs: ["TEST:A32-FLOW"], provenance: ["A32 test fixture"] });
    expect(result.state).toBe("CONFLICTING");
    expect(result.routes.some((route) => !route.reachable)).toBe(true);
    expect(result.noAutomaticCorrection).toBe(true);
    expect(result.evacuationCompliance).toBe("NOT_ASSESSED");
  });
});
