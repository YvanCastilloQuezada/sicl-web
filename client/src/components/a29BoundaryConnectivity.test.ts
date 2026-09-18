import { describe, expect, it } from "vitest";
import { applyRoomOperation, generateVerifiedResidentialPlan } from "./residentialConstructivePlan";
import { buildA29ReadModel, deriveA29Boundaries, deriveA29Connections, deriveA29IntentObservations } from "./a29BoundaryConnectivity";

describe("A29 architectural building anatomy and connectivity", () => {
  it("derives deterministic boundaries and shared interfaces without creating walls", () => {
    const plan = generateVerifiedResidentialPlan();
    const boundaries = deriveA29Boundaries(plan);
    expect(boundaries.length).toBe(plan.rooms.length * 4);
    expect(boundaries.some((boundary) => boundary.classification === "INTERIOR_SHARED")).toBe(true);
    expect(boundaries.every((boundary) => boundary.sourceSpatialElementId)).toBe(true);
    expect(boundaries.every((boundary) => boundary.epistemicState === "DERIVED")).toBe(true);
  });

  it("does not infer a shared boundary from point contact or near geometry", () => {
    const plan = generateVerifiedResidentialPlan();
    const changed = applyRoomOperation(plan, "MOVE_ROOM", "KITCHEN", { dx: 0.01 }).plan;
    const boundaries = deriveA29Boundaries(changed);
    expect(boundaries.some((boundary) => boundary.classification === "INTERIOR_SHARED" && ((boundary.spaceId === "LIVING" && boundary.relatedSpaceId === "KITCHEN") || (boundary.spaceId === "KITCHEN" && boundary.relatedSpaceId === "LIVING")))).toBe(false);
  });

  it("derives connections only from explicit openings, not from room labels", () => {
    const plan = generateVerifiedResidentialPlan();
    const boundaries = deriveA29Boundaries(plan);
    const connections = deriveA29Connections(plan, boundaries);
    expect(connections.some((connection) => connection.connectionId.endsWith("DOOR-LIVING-KITCHEN") && connection.state === "CONNECTION_OBSERVED")).toBe(true);
    expect(connections.some((connection) => connection.fromSpaceId === "BED-01" && connection.toSpaceId === "BED-02")).toBe(false);
  });

  it("keeps access separate from connection and preserves A21 intent versus observation", () => {
    const model = buildA29ReadModel(generateVerifiedResidentialPlan());
    expect(model.accessStates.every((state) => state.state === "ACCESS_UNVERIFIED")).toBe(true);
    expect(model.intentObservations.some((item) => item.result === "GEOMETRIC_ADJACENCY_OBSERVED")).toBe(true);
    expect(model.warnings).toContain("Shared boundary does not prove a door or connection.");
  });

  it("marks a required adjacency without observed boundary as intent not observed", () => {
    const plan = generateVerifiedResidentialPlan();
    const observations = deriveA29IntentObservations({ ...plan, adjacency: [{ from: "LIVING", to: "BED-01", kind: "REQUIRED", evidence: "DECLARED_PROGRAM" }] });
    expect(observations[0].result).toBe("INTENT_NOT_OBSERVED");
    expect(observations[0].humanReviewRequired).toBe(true);
  });
});
