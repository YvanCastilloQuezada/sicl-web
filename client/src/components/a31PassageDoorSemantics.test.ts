import { describe, expect, it } from "vitest";
import { buildA29ReadModel } from "./a29BoundaryConnectivity";
import { legacyOpeningEvidence, deriveA30OpeningObservations } from "./a30ArchitecturalOpenings";
import { buildA31SyntheticDoorEvidence, auditA31PassageDoorSemantics, deriveA31PassageDoorObservation, validateA31DoorEvidence } from "./a31PassageDoorSemantics";
import { generateVerifiedResidentialPlan } from "./residentialConstructivePlan";

describe("A31 passage and door semantics", () => {
  it("does not promote legacy kind=DOOR into verified door semantics", () => {
    const plan = generateVerifiedResidentialPlan();
    const audit = auditA31PassageDoorSemantics(plan);
    expect(audit.legacyCount).toBe(6);
    expect(audit.explicitDoorCount).toBe(0);
    expect(audit.observations.every((item) => item.doorSemantics === "NOT_ESTABLISHED")).toBe(true);
    expect(audit.observations[0]?.accessibility).toBe("NOT_ASSESSED");
  });

  it("derives explicit passage, door operation, clear width and threshold from A30-valid evidence", () => {
    const plan = generateVerifiedResidentialPlan();
    const a29 = buildA29ReadModel(plan);
    const boundary = a29.boundaries.find((item) => item.spaceId === "LIVING" && item.relatedSpaceId === "KITCHEN");
    expect(boundary).toBeDefined();
    const legacy = legacyOpeningEvidence(plan).find((item) => item.openingId === "DOOR-LIVING-KITCHEN")!;
    const evidence = { ...buildA31SyntheticDoorEvidence(plan, legacy), sourceOpeningId: legacy.openingId, threshold: { state: "PRESENT" as const, heightM: 0.01, evidenceRefs: ["SURVEY:THRESHOLD-01"] } };
    const a30Opening = deriveA30OpeningObservations(plan, [{ ...legacy, extent: boundary!.segment }], a29)[0]!;
    const result = deriveA31PassageDoorObservation(plan, a30Opening, evidence);
    expect(result.a30Binding).toBe("VALID");
    expect(result.doorSemantics).toBe("OBSERVED");
    expect(result.passageRole).toBe("INTERNAL_PASSAGE");
    expect(result.operation).toBe("SWING");
    expect(result.clearWidthM).toBe(0.9);
    expect(result.threshold.state).toBe("PRESENT");
    expect(result.accessibility).toBe("NOT_ASSESSED");
  });

  it("rejects invalid width and preserves an explicit warning", () => {
    const plan = generateVerifiedResidentialPlan();
    const legacy = legacyOpeningEvidence(plan)[0]!;
    const invalid = { ...buildA31SyntheticDoorEvidence(plan, legacy), clearWidthM: 0 };
    expect(validateA31DoorEvidence(invalid)).toContain("CLEAR_WIDTH_INVALID");
    const result = deriveA31PassageDoorObservation(plan, deriveA30OpeningObservations(plan, [legacy])[0]!, invalid);
    expect(result.doorSemantics).toBe("UNVERIFIED");
    expect(result.warnings).toContain("CLEAR_WIDTH is missing or invalid.");
  });

  it("marks door evidence stale when alternative or geometry version changes", () => {
    const plan = generateVerifiedResidentialPlan();
    const legacy = legacyOpeningEvidence(plan)[0]!;
    const a30Opening = deriveA30OpeningObservations(plan, [legacy])[0]!;
    const result = deriveA31PassageDoorObservation(plan, a30Opening, { ...buildA31SyntheticDoorEvidence(plan, legacy), sourceAlternativeId: "OTHER", geometryVersion: "HOUSE-001-EXPLICIT:v2" });
    expect(result.doorSemantics).toBe("STALE");
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
