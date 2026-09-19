import { describe, expect, it } from "vitest";
import { ARKI_HANDOFF_ACCEPTANCE_IDS, ARKI_HANDOFF_DISPOSITION, buildEducationOperationalProgram, buildHandoffAcceptanceFixture, buildHospitalSeparationTransferCases, buildResidentialOperationalProgram, deriveFunctionalViews, deriveFunctionalZoning, evaluateLearningTransfer, evaluateRegulatoryCoverage, evaluateSystemCompleteness, selectTemporalRegulatoryVersion, validateHandoffOperationalization } from "./arkiCanonicalFunctionalOperationalization";

describe("ARKI canonical functional operationalization", () => {
  it("maps the handoff to reuse/extend/adapt/derived dispositions", () => {
    expect(ARKI_HANDOFF_DISPOSITION.REUSE_AS_IS).toContain("CanonicalBuildingModel");
    expect(ARKI_HANDOFF_DISPOSITION.EXTEND).toContain("functional profile");
    expect(ARKI_HANDOFF_DISPOSITION.DERIVED_VIEW).toContain("organigram");
    expect(ARKI_HANDOFF_DISPOSITION.DO_NOT_ADD).toContain("second typology engine");
  });
  it("models a minimum system without forcing one room", () => {
    const p = buildResidentialOperationalProgram();
    expect(p.requirements.find((r) => r.id === "SYS-REST")?.functionalNecessity).toBe("ESSENTIAL");
    expect(p.requirements.find((r) => r.id === "SYS-REST")?.compatibleRealizations.length).toBeGreaterThan(1);
    expect(p.noRoomListOntology).toBe(true);
  });
  it("keeps activity sharing/separation reasoned rather than geometric by default", () => {
    const p = buildResidentialOperationalProgram();
    expect(p.relationships.find((r) => r.id === "REL-FOOD")?.compatibility).toBe("SHARE_WITH_CONDITIONS");
    expect(p.relationships.find((r) => r.id === "REL-PUBLIC-PRIVATE")?.compatibility).toBe("SEPARATE");
  });
  it("preserves process and state semantics", () => {
    const p = buildResidentialOperationalProgram();
    expect(p.processes[0].activityIds.length).toBeGreaterThan(1);
    expect(p.processes[0].state).toBe("PROPOSED");
    expect(p.flows.some((f) => f.operationalStates.includes("EMERGENCY"))).toBe(true);
  });
  it("derives organigram, flow, zoning and network views from one program", () => {
    const views = deriveFunctionalViews(buildResidentialOperationalProgram());
    expect(views.noIndependentTruthStore).toBe(true);
    expect(views.organigram[0]).toBe("PURPOSE");
    expect(views.flowView.length).toBeGreaterThan(0);
    expect(views.networkView.length).toBeGreaterThan(0);
  });
  it("reports completeness as stage-dependent and does not claim spatial resolution", () => {
    const result = evaluateSystemCompleteness(buildResidentialOperationalProgram());
    expect(result.state).toBe("PARTIAL");
    expect(result.missing).toContain("spatial realization");
    expect(result.unresolved.length).toBeGreaterThan(0);
  });
  it("keeps unknown site data explicit", () => {
    const p = buildResidentialOperationalProgram();
    expect(p.profile.contextConditions).toContain("SITE_ORIENTATION_UNKNOWN");
  });
  it("keeps capacity tied to time", () => {
    const p = buildResidentialOperationalProgram();
    expect(p.capacities[0].timeBasis).toBeTruthy();
    expect(p.capacities[0].state).toBe("PROPOSED");
  });
  it("distinguishes regulatory coverage from project compliance", () => {
    const result = evaluateRegulatoryCoverage({ context: { jurisdiction: "PERU", spatialScope: "EDIFICACION", projectUseType: "RESIDENTIAL", projectStage: "ANTEPROYECTO" }, sources: [], requirements: [{ requirementId: "R-1", sourceId: "MISSING", applicability: "APPLICABLE_CANDIDATE", epistemicState: "IDENTIFIED", provenance: [], humanReviewState: "PENDING_HUMAN_REVIEW" }] });
    expect(result.coverage).toBe("PARTIAL");
    expect(result.noAutomaticCompliance).toBe(true);
  });
  it("selects a temporal source by effective date rather than latest blindly", () => {
    const result = selectTemporalRegulatoryVersion("2025-01-01", [{ sourceId: "OLD", sourceType: "REGULATION", effectiveDate: "2020-01-01", provenance: ["official"], verificationState: "VERIFIED", humanReviewState: "CONFIRMED" }, { sourceId: "FUTURE", sourceType: "REGULATION", effectiveDate: "2026-01-01", provenance: ["official"], verificationState: "VERIFIED", humanReviewState: "CONFIRMED" }]);
    expect(result.source?.sourceId).toBe("OLD");
  });
  it("transfers a principle without copying a solution", () => {
    expect(evaluateLearningTransfer({ fromTypology: "HEALTHCARE", toTypology: "HOSPITALITY_COMMERCE", preservedPrinciples: ["separate flows"], changedConditions: ["service model"], nonApplicationCases: ["no sterile layout copied"], copiedSolution: false }).outcome).toBe("PASS");
    expect(evaluateLearningTransfer({ fromTypology: "HEALTHCARE", toTypology: "HOSPITALITY_COMMERCE", preservedPrinciples: ["separate flows"], changedConditions: [], nonApplicationCases: [], copiedSolution: true }).outcome).toBe("NOT_PROVEN");
  });
  it("preserves epistemic and human authority guards", () => {
    const p = buildResidentialOperationalProgram();
    expect(validateHandoffOperationalization(p)).toBe(true);
    expect(p.profile.epistemicState).toBe("HYPOTHESIS");
  });
  it("covers the mandatory acceptance-test inventory", () => {
    expect(ARKI_HANDOFF_ACCEPTANCE_IDS).toHaveLength(18);
    expect(ARKI_HANDOFF_ACCEPTANCE_IDS).toContain("false-precision");
    expect(ARKI_HANDOFF_ACCEPTANCE_IDS).toContain("human-authority");
  });
  it("provides a consolidated fixture with no automatic decision", () => {
    const fixture = buildHandoffAcceptanceFixture();
    expect(fixture.validated).toBe(true);
    expect(fixture.noAutomaticDecision).toBe(true);
    expect(fixture.humanAuthority).toBe("PRESERVED");
    expect(fixture.transfer.outcome).toBe("PASS");
  });
  it("builds an education profile as a functional program before geometry", () => {
    const school = buildEducationOperationalProgram();
    expect(school.profile.typology).toBe("EDUCATION");
    expect(school.profile.epistemicState).toBe("HYPOTHESIS");
    expect(school.profile.humanReviewRequired).toBe(true);
    expect(school.requirements.map((r) => r.id)).toEqual(expect.arrayContaining(["SYS-ARRIVAL-SUPERVISION", "SYS-LEARNING", "SYS-FOOD", "SYS-ESCAPE"]));
    expect(school.flows.some((flow) => flow.kind === "SERVICE" && flow.separation === "SPATIAL")).toBe(true);
    expect(school.relationships.find((r) => r.id === "REL-SERVICE-LEARNING")?.compatibility).toBe("SEPARATE");
    expect(school.noRoomListOntology).toBe(true);
  });
  it("derives school zoning bands from the canonical typology profile", () => {
    const zones = deriveFunctionalZoning(buildEducationOperationalProgram());
    expect(zones.map((zone) => zone.band)).toEqual(["PUBLIC_ENTRY", "SUPERVISED_SHARED", "LEARNING", "STAFF_RESTRICTED", "SERVICE"]);
    expect(zones.every((zone) => zone.state === "PROPOSED")).toBe(true);
    expect(zones.every((zone) => zone.evidence.length > 0)).toBe(true);
    expect(zones.find((zone) => zone.band === "SERVICE")?.access).toBe("SERVICE");
  });
  it("transfers hospital flow separation independently to hotel and laboratory", () => {
    const cases = buildHospitalSeparationTransferCases();
    expect(cases.hotel.outcome).toBe("PASS");
    expect(cases.laboratory.outcome).toBe("PASS");
    expect(cases.hotel.humanReviewRequired).toBe(true);
    expect(cases.laboratory.humanReviewRequired).toBe(true);
    expect(cases.hotel.reason).toContain("without copying");
    expect(cases.laboratory.reason).toContain("without copying");
  });
  it("rejects a hospital layout copied into a laboratory", () => {
    expect(evaluateLearningTransfer({ fromTypology: "HEALTHCARE", toTypology: "INDUSTRY_LABORATORY_AGRICULTURE", preservedPrinciples: ["separate flows"], changedConditions: ["laboratory process"], nonApplicationCases: [], copiedSolution: true }).outcome).toBe("NOT_PROVEN");
  });
});
