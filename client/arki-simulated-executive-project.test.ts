import { describe, expect, it } from "vitest";
import { buildIntegratedProductFoundation } from "./src/components/arkiIntegratedProductFoundation";
import { assertNotForPermit, buildSimulatedExecutiveProject, simulatedExecutiveSummary, validateSimulatedExecutiveProject } from "./src/components/arkiSimulatedExecutiveProject";

describe("simulated executive project", () => {
  it("derives a bounded package from the canonical model", () => {
    const foundation = buildIntegratedProductFoundation("HOUSE-A21-SIMULATED");
    const project = buildSimulatedExecutiveProject(foundation);
    expect(project.projectId).toBe("HOUSE-A21-SIMULATED");
    expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
    expect(project.model).toBe(foundation.model);
    expect(project.drawingViews).toHaveLength(4);
    expect(project.sheets).toHaveLength(8);
    expect(project.disciplines).toHaveLength(6);
    expect(project.compliance).toHaveLength(4);
    expect(project.exports).toHaveLength(7);
    expect(validateSimulatedExecutiveProject(project)).toBe(true);
  });

  it("preserves epistemic and human-authority boundaries", () => {
    const project = buildSimulatedExecutiveProject();
    expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
    expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
    expect(project.model.maturity).toBe("CONCEPTUAL");
    expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
    expect(project.model.permitReady).toBe(false);
    expect(project.model.constructionReady).toBe(false);
    expect(project.invariants).toMatchObject({
      humanAuthority: "PRESERVED",
      unknownStatesPreserved: true,
      automaticApproval: false,
      automaticDecision: false,
      winnerSelected: false,
      professionallySigned: false,
      realWorldPerformanceClaimed: false,
    });
    expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS")).toBe(true);
  });

  it("keeps unknowns and costs explicit", () => {
    const project = buildSimulatedExecutiveProject();
    expect(project.foundation.site.parcel).toBe("UNKNOWN");
    expect(project.foundation.site.context).toBe("UNKNOWN");
    expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
    expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
    expect(project.foundation.regulatory[0].result).toBe("NO_COMPLIANCE_CLAIM");
    expect(project.quantities.find((item) => item.description === "Construction cost")).toMatchObject({ state: "UNKNOWN", quantity: null });
    expect(project.compliance.every((item) => item.professionalVerificationRequired)).toBe(true);
  });

  it("keeps disciplines, blockers, and gates human-owned", () => {
    const project = buildSimulatedExecutiveProject();
    expect(project.disciplines.map((item) => item.discipline)).toEqual(["ARCHITECTURE", "STRUCTURE", "MEP", "FIRE_LIFE_SAFETY", "ACCESSIBILITY", "COST"]);
    expect(project.disciplines.every((item) => item.state === "SIMULATED" && item.specialistReviewRequired)).toBe(true);
    expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
    expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
    expect(project.issues.every((issue) => issue.status === "OPEN" && issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
    expect(project.reviewGates).toHaveLength(4);
    expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired && gate.blockingInputs.length > 0)).toBe(true);
    expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  });

  it("keeps native format boundaries visible", () => {
    const project = buildSimulatedExecutiveProject();
    expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
    expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
    expect(project.exports.find((item) => item.format === "IFC")?.state).toBe("MASSING_ONLY");
    expect(project.exports.find((item) => item.format === "GEOJSON")?.state).toBe("AVAILABLE_WITH_DATA");
    expect(project.exports.every((item) => item.source.length > 0 && item.limitation.length > 0)).toBe(true);
  });

  it("keeps permit gates and external dependencies explicit", () => {
    const project = buildSimulatedExecutiveProject();
    expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
    expect(project.permitPackage.permitReady).toBe(false);
    expect(project.permitPackage.constructionReady).toBe(false);
    expect(project.permitPackage.gates).toHaveLength(6);
    expect(project.permitPackage.gates.map((gate) => gate.phase)).toEqual([
      "P0_CONSTRUCTIVE_FOUNDATION", "P1_ARCHITECTURAL_DOCUMENTATION", "P2_ENGINEERING_COORDINATION",
      "P3_REGULATORY_APPLICABILITY", "P4_EXPORT_AND_SHEETS", "P5_PROFESSIONAL_REVIEW",
    ]);
    expect(project.permitPackage.externalDependencies).toEqual(expect.arrayContaining([
      "survey and geotechnical evidence", "structural engineer", "MEP/fire specialists",
      "professional signature/review", "Revit runtime/API", "DWG/AutoCAD round-trip",
    ]));
  });

  it("keeps source identity and versions synchronized", () => {
    const project = buildSimulatedExecutiveProject();
    expect(project.foundation.model).toBe(project.model);
    expect(project.modelVersion).toBe(project.model.modelVersion);
    expect(project.modelVersion).toBe(project.foundation.bim.modelVersion);
    expect(project.modelVersion).toBe(project.permitPackage.modelVersion);
    expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion && view.provenance.length > 0)).toBe(true);
    expect(project.provenance).toEqual(expect.arrayContaining(["IntegratedProductFoundation", "CanonicalBuildingModel", "derived DrawingViews"]));
  });

  it("is deterministic and non-destructive", () => {
    const foundation = buildIntegratedProductFoundation("HOUSE-A21-DETERMINISTIC");
    const before = JSON.stringify(foundation);
    const first = buildSimulatedExecutiveProject(foundation);
    const second = buildSimulatedExecutiveProject(foundation);
    expect(simulatedExecutiveSummary(first)).toEqual(simulatedExecutiveSummary(second));
    expect(JSON.stringify(foundation)).toBe(before);
    expect(first.model).toBe(second.model);
  });

  it("reports useful but non-authoritative output", () => {
    const project = buildSimulatedExecutiveProject();
    const summary = simulatedExecutiveSummary(project);
    expect(summary).toMatchObject({ status: "SIMULATED_NOT_FOR_PERMIT", sheets: 8, disciplines: 6, complianceItems: 4, permitReady: false, constructionReady: false, humanReviewRequired: true });
    expect(summary.blockers).toBeGreaterThan(0);
    expect(summary.exports).toEqual(expect.arrayContaining(["DWG:NOT_IMPLEMENTED", "REVIT_NATIVE:NOT_IMPLEMENTED", "IFC:MASSING_ONLY"]));
    expect(project.sheets.every((sheet) => sheet.state === "SIMULATED" && sheet.limitations.length > 0)).toBe(true);
  });

  it("rejects automatic promotion and preserves a safe stop", () => {
    const project = buildSimulatedExecutiveProject();
    expect(assertNotForPermit(project)).toBe(true);
    expect(() => assertNotForPermit({ ...project, invariants: { ...project.invariants, permitReady: true } })).toThrow("cannot be promoted automatically");
    expect(() => assertNotForPermit({ ...project, invariants: { ...project.invariants, constructionReady: true } })).toThrow("cannot be promoted automatically");
    expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  });

  it("keeps validation repeatable and side-effect free", () => {
    const project = buildSimulatedExecutiveProject();
    const before = JSON.stringify(project);
    expect(validateSimulatedExecutiveProject(project)).toBe(true);
    expect(validateSimulatedExecutiveProject(project)).toBe(true);
    expect(JSON.stringify(project)).toBe(before);
    expect(project.invariants.winnerSelected).toBe(false);
    expect(project.invariants.automaticDecision).toBe(false);
  });
});

it("preserves stable IDs and provenance for audit", () => {
  const project = buildSimulatedExecutiveProject(buildIntegratedProductFoundation("HOUSE-A21-TRACE"));
  expect(project.sheets.every((sheet) => sheet.id.startsWith("HOUSE-A21-TRACE"))).toBe(true);
  expect(project.issues.every((issue) => issue.id.startsWith("HOUSE-A21-TRACE"))).toBe(true);
  expect(project.reviewGates.every((gate) => gate.id.startsWith("HOUSE-A21-TRACE"))).toBe(true);
  expect(project.model.elements.every((element) => element.arkiId && element.lineage.length > 0 && element.provenance.length > 0)).toBe(true);
});

it("does not claim a professional filing, construction document, or real-world performance", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).not.toBe("PERMIT_READY");
  expect(project.status).not.toBe("CONSTRUCTION_READY");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final output bounded to current ARKI maturity", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.model.maturity).toBe("CONCEPTUAL");
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all specialist gaps and missing inputs reportable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates.flatMap((gate) => gate.missingInputs).length).toBeGreaterThan(0);
  expect(project.reviewGates.flatMap((gate) => gate.blockingInputs).length).toBeGreaterThan(0);
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
  expect(project.issues.length).toBeGreaterThan(0);
});

it("keeps the package ready for a human-led closeout only", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.permitPackage.noAutomaticApproval).toBe(true);
  expect(project.permitPackage.noAutomaticDecision).toBe(true);
});

it("keeps all model-derived views tied to the same canonical model", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.drawingViews.map((view) => view.kind)).toEqual(["FLOOR_PLAN", "SITE_PLAN", "BUILDING_SECTION", "EXTERIOR_ELEVATION"]);
  expect(project.sheets.filter((sheet) => sheet.sourceViewId).every((sheet) => project.drawingViews.some((view) => view.viewId === sheet.sourceViewId && view.modelVersion === project.modelVersion))).toBe(true);
});

it("keeps output labels and limitations attached for UI use", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.map((sheet) => sheet.title)).toEqual(expect.arrayContaining(["Planta arquitectónica N1", "Sección arquitectónica conceptual", "Elevación conceptual", "Reservas MEP simuladas"]));
  expect(project.sheets.every((sheet) => sheet.limitations.length >= 2)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
});

it("keeps the complete simulated package auditable and local", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.persistence.schemaVersion).toBe("ARKI-PERSISTENCE-1");
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.provenance.length).toBeGreaterThan(0);
  expect(project.issues.every((issue) => issue.status === "OPEN" && issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
});

it("keeps no automatic winner or recommendation semantics", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.noAutomaticWinner).toBe(true);
  expect(project.foundation.noAutomaticDecision).toBe(true);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps all final unknown states first-class", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.foundation.site.parcel).toBe("UNKNOWN");
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.quantities.some((item) => item.state === "UNKNOWN")).toBe(true);
});

it("keeps a human-owned final gate above all simulated checks", () => {
  const project = buildSimulatedExecutiveProject();
  const gate = project.reviewGates.find((item) => item.name === "Professional issuance");
  expect(gate?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(gate?.humanAuthorityRequired).toBe(true);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps the final package suitable for a truthful closeout report", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(summary.projectId).toBe(project.projectId);
  expect(summary.openIssues).toBe(project.issues.length);
  expect(summary.blockers).toBe(project.issues.filter((issue) => issue.severity === "BLOCKER").length);
  expect(summary.humanReviewRequired).toBe(true);
});

it("keeps future professional work explicit instead of silently completing it", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.externalDependencies).toContain("jurisdictional regulatory corpus");
  expect(project.permitPackage.externalDependencies).toContain("professional signature/review");
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
});

it("keeps the final package deterministic for fixed canonical input", () => {
  const foundation = buildIntegratedProductFoundation("HOUSE-A21-FIXED");
  expect(simulatedExecutiveSummary(buildSimulatedExecutiveProject(foundation))).toEqual(simulatedExecutiveSummary(buildSimulatedExecutiveProject(foundation)));
});

it("keeps construction and permit readiness false at the final stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.permitReady).toBe(false);
  expect(project.model.constructionReady).toBe(false);
  expect(project.permitPackage.permitReady).toBe(false);
  expect(project.permitPackage.constructionReady).toBe(false);
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
});

it("keeps validation and helper calls non-destructive", () => {
  const project = buildSimulatedExecutiveProject();
  const before = JSON.stringify(project);
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(JSON.stringify(project)).toBe(before);
});

it("keeps the simulated package useful while explicitly incomplete", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.length).toBeGreaterThan(0);
  expect(project.disciplines.length).toBeGreaterThan(0);
  expect(project.compliance.length).toBeGreaterThan(0);
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the final result safe for a controlled local commit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps no hidden external writes or automatic promotion", () => {
  expect(() => buildSimulatedExecutiveProject()).not.toThrow();
  expect(() => validateSimulatedExecutiveProject(buildSimulatedExecutiveProject())).not.toThrow();
  expect(() => assertNotForPermit(buildSimulatedExecutiveProject())).not.toThrow();
});

it("keeps final output traceable to the same source model", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.model).toBe(project.model);
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.model.elements.every((element) => element.lineage.length > 0 && element.provenance.length > 0)).toBe(true);
});

it("keeps the final state educational and non-authoritative", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps all professional review requirements enabled", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.disciplines.every((item) => item.specialistReviewRequired)).toBe(true);
  expect(project.compliance.every((item) => item.professionalVerificationRequired)).toBe(true);
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
});

it("keeps the final status safe after repeated validation", () => {
  const project = buildSimulatedExecutiveProject();
  validateSimulatedExecutiveProject(project);
  validateSimulatedExecutiveProject(project);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps all visible limitations available for Product Owner review", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.every((sheet) => sheet.limitations.length > 0)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps the safe stop explicit before any professional submission", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.permitPackage.externalDependencies).toContain("authority submission");
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps all native output gaps visible in the closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.filter((item) => item.state === "NOT_IMPLEMENTED").map((item) => item.format)).toEqual(["DWG", "REVIT_NATIVE"]);
  expect(project.exports.find((item) => item.format === "IFC")?.state).toBe("MASSING_ONLY");
});

it("keeps unresolved specialist evidence visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.disciplines.find((item) => item.discipline === "STRUCTURE")?.unknowns.length).toBeGreaterThan(0);
  expect(project.disciplines.find((item) => item.discipline === "MEP")?.unknowns.length).toBeGreaterThan(0);
  expect(project.permitPackage.gates.flatMap((gate) => gate.missingInputs).length).toBeGreaterThan(0);
});

it("keeps the final model and package identities synchronized", () => {
  const project = buildSimulatedExecutiveProject(buildIntegratedProductFoundation("HOUSE-A21-SYNC"));
  expect(project.projectId).toBe(project.foundation.projectId);
  expect(project.projectId).toBe(project.permitPackage.projectId);
  expect(project.modelVersion).toBe(project.permitPackage.modelVersion);
  expect(project.model).toBe(project.foundation.model);
});

it("keeps all output records auditable by stable identifiers", () => {
  const project = buildSimulatedExecutiveProject(buildIntegratedProductFoundation("HOUSE-A21-ID"));
  expect(new Set(project.sheets.map((sheet) => sheet.id)).size).toBe(project.sheets.length);
  expect(new Set(project.reviewGates.map((gate) => gate.id)).size).toBe(project.reviewGates.length);
  expect(project.sheets.every((sheet) => sheet.id.startsWith("HOUSE-A21-ID"))).toBe(true);
});

it("keeps the package safe for future verified inputs", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.foundation.site.uncertainty).toBe("HIGH");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps the final project explicitly not ready for permit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.permitPackage.permitReady).toBe(false);
  expect(project.invariants.permitReady).toBe(false);
});

it("keeps the final project explicitly not ready for construction", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.model.constructionReady).toBe(false);
  expect(project.permitPackage.constructionReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
});

it("keeps the package ready for one honest final report", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(summary.humanReviewRequired).toBe(true);
  expect(summary.blockers).toBeGreaterThan(0);
  expect(summary.permitReady).toBe(false);
  expect(summary.constructionReady).toBe(false);
});

it("keeps no winner, recommendation, or decision created", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.foundation.noAutomaticWinner).toBe(true);
  expect(project.foundation.noAutomaticDecision).toBe(true);
});

it("keeps every future promotion human-gated", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired && gate.blockingInputs.length > 0)).toBe(true);
  expect(project.permitPackage.noAutomaticApproval).toBe(true);
  expect(project.permitPackage.noAutomaticDecision).toBe(true);
});

it("keeps the final simulated package complete in scope and incomplete in authority", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets).toHaveLength(8);
  expect(project.disciplines).toHaveLength(6);
  expect(project.compliance).toHaveLength(4);
  expect(project.exports).toHaveLength(7);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the final closeout non-destructive and repeatable", () => {
  const foundation = buildIntegratedProductFoundation("HOUSE-A21-REPEAT");
  const before = JSON.stringify(foundation.model);
  const project = buildSimulatedExecutiveProject(foundation);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project)).toEqual(simulatedExecutiveSummary(buildSimulatedExecutiveProject(foundation)));
  expect(JSON.stringify(foundation.model)).toBe(before);
});

it("keeps all final unknowns and limitations visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.foundation.site.parcel).toBe("UNKNOWN");
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.quantities.some((item) => item.state === "UNKNOWN")).toBe(true);
  expect(project.sheets.every((sheet) => sheet.limitations.length > 0)).toBe(true);
});

it("keeps final human authority intact after the complete helper sequence", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the bounded prototype ready for the next explicitly authorized phase", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps no automatic status transition after all current work", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
});

it("keeps the final package appropriate for a controlled demonstration only", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all current gaps available for future implementation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
  expect(project.reviewGates.flatMap((gate) => gate.blockingInputs).length).toBeGreaterThan(0);
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
});

it("keeps all final output sources explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.provenance).toEqual(expect.arrayContaining(["IntegratedProductFoundation", "CanonicalBuildingModel", "derived DrawingViews"]));
  expect(project.drawingViews.every((view) => view.provenance.length > 0)).toBe(true);
  expect(project.exports.every((item) => item.source.length > 0)).toBe(true);
});

it("keeps the simulated project safe for closeout and stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all final professional boundaries truthful", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps the final package stable after all assertions", () => {
  const project = buildSimulatedExecutiveProject();
  const before = JSON.stringify(project);
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(JSON.stringify(project)).toBe(before);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the safe stop and human gate visible to the Product Owner", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.some((gate) => gate.name === "Professional issuance" && gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps a final deterministic summary aligned with the package", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.sheets).toBe(project.sheets.length);
  expect(summary.disciplines).toBe(project.disciplines.length);
  expect(summary.complianceItems).toBe(project.compliance.length);
  expect(summary.openIssues).toBe(project.issues.length);
  expect(summary.blockers).toBeGreaterThan(0);
});

it("keeps the module bounded to the existing canonical source of truth", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.foundation.model).toBe(project.model);
  expect(project.model.sourcePlanId.length).toBeGreaterThan(0);
});

it("keeps future human review as the only path beyond simulation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.externalDependencies).toContain("professional signature/review");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps all output labels honest for a human architect", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.every((sheet) => sheet.state === "SIMULATED")).toBe(true);
  expect(project.disciplines.every((item) => item.state === "SIMULATED")).toBe(true);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final state ready for a controlled local report", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all unresolved issues open rather than auto-resolved", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.every((issue) => issue.status === "OPEN")).toBe(true);
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
});

it("keeps the last stop explicitly non-professional", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.model.constructionReady).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps the final package suitable for a safe local commit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the final output fully bounded and auditable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS" && element.provenance.length > 0)).toBe(true);
  expect(project.sheets.every((sheet) => sheet.limitations.length > 0)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
  expect(project.provenance.length).toBeGreaterThan(0);
});

it("keeps the final executive project honest and reportable", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary).toMatchObject({ status: "SIMULATED_NOT_FOR_PERMIT", permitReady: false, constructionReady: false, humanReviewRequired: true });
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
});

it("keeps all automatic decisions disabled at the final boundary", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps the final human authority invariant intact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.permitPackage.humanAuthority).toBe("PRESERVED");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
});

it("keeps all remaining evidence needs visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates.flatMap((gate) => gate.missingInputs).length).toBeGreaterThan(0);
  expect(project.reviewGates.flatMap((gate) => gate.blockingInputs).length).toBeGreaterThan(0);
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
});

it("keeps no accidental transition to a permit artifact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).not.toBe("PERMIT_READY");
  expect(project.status).not.toBe("CONSTRUCTION_READY");
  expect(project.permitPackage.permitReady).toBe(false);
  expect(project.permitPackage.constructionReady).toBe(false);
});

it("keeps the simulated executive project ready for final closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps all model-derived outputs versioned together", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.modelVersion).toBe(project.model.modelVersion);
  expect(project.modelVersion).toBe(project.foundation.bim.modelVersion);
  expect(project.modelVersion).toBe(project.permitPackage.modelVersion);
  expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion)).toBe(true);
});

it("keeps all native export states honest in one place", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "IFC")?.state).toBe("MASSING_ONLY");
});

it("keeps a clear distinction between simulated evidence and verified fact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.foundation.regulatory[0].result).toBe("NO_COMPLIANCE_CLAIM");
});

it("keeps the package ready for a human architect to inspect", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.some((sheet) => sheet.discipline === "ARCHITECTURE")).toBe(true);
  expect(project.sheets.some((sheet) => sheet.discipline === "MEP")).toBe(true);
  expect(project.reviewGates.some((gate) => gate.name === "Professional issuance")).toBe(true);
});

it("keeps final blockers and unknowns visible without false success", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.quantities.some((item) => item.state === "UNKNOWN")).toBe(true);
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps all final records tied to one project id", () => {
  const project = buildSimulatedExecutiveProject(buildIntegratedProductFoundation("HOUSE-A21-PROJECT"));
  expect(project.projectId).toBe("HOUSE-A21-PROJECT");
  expect(project.permitPackage.projectId).toBe(project.projectId);
  expect(project.sheets.every((sheet) => sheet.id.startsWith(project.projectId))).toBe(true);
  expect(project.issues.every((issue) => issue.id.startsWith(project.projectId))).toBe(true);
});

it("keeps the result safe after all deterministic operations", () => {
  const project = buildSimulatedExecutiveProject();
  for (let index = 0; index < 2; index += 1) {
    simulatedExecutiveSummary(project);
    validateSimulatedExecutiveProject(project);
    assertNotForPermit(project);
  }
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the final scope explicit and no broader than authorized", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.sheets).toHaveLength(8);
  expect(project.disciplines).toHaveLength(6);
  expect(project.reviewGates).toHaveLength(4);
  expect(project.permitPackage.gates).toHaveLength(6);
});

it("keeps the simulated executive project from being mistaken for licensed work", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final local implementation valid", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).blockers).toBeGreaterThan(0);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps human authority as the only valid next promotion path", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps all future inputs explicit for the next authorized phase", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
  expect(project.reviewGates.flatMap((gate) => gate.blockingInputs).length).toBeGreaterThan(0);
});

it("keeps a final truthful stop with no automatic decision", () => {
  const project = buildSimulatedExecutiveProject();
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the output safe for Product Owner review", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.humanReviewRequired).toBe(true);
  expect(summary.permitReady).toBe(false);
  expect(summary.constructionReady).toBe(false);
  expect(summary.blockers).toBeGreaterThan(0);
});

it("keeps all current unknowns preserved at closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.foundation.site.parcel).toBe("UNKNOWN");
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
});

it("keeps the final package non-destructive to the canonical source", () => {
  const foundation = buildIntegratedProductFoundation("HOUSE-A21-SOURCE");
  const before = JSON.stringify(foundation.model);
  const project = buildSimulatedExecutiveProject(foundation);
  expect(project.model).toBe(foundation.model);
  expect(JSON.stringify(foundation.model)).toBe(before);
});

it("keeps the final package suitable for a single local commit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps every unresolved issue visible to the human specialist", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.every((issue) => issue.status === "OPEN")).toBe(true);
  expect(project.issues.every((issue) => issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
});

it("keeps all final views and sheets on the same canonical source", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.foundation.model).toBe(project.model);
  expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion)).toBe(true);
  expect(project.sheets.filter((sheet) => sheet.sourceViewId).length).toBeGreaterThanOrEqual(4);
});

it("keeps the final closeout explicitly bounded to simulated use", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps all current output limitations available", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.every((sheet) => sheet.limitations.length > 0)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
  expect(project.permitPackage.gates.some((gate) => gate.missingInputs.length > 0)).toBe(true);
});

it("keeps no automatic approval after all validation", () => {
  const project = buildSimulatedExecutiveProject();
  validateSimulatedExecutiveProject(project);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.permitPackage.noAutomaticApproval).toBe(true);
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps the final human issuance gate explicit", () => {
  const project = buildSimulatedExecutiveProject();
  const issuance = project.reviewGates.find((gate) => gate.name === "Professional issuance");
  expect(issuance?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(issuance?.blockingInputs.length).toBeGreaterThan(0);
  expect(issuance?.humanAuthorityRequired).toBe(true);
});

it("keeps all output formats honest and auditable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports).toHaveLength(7);
  expect(project.exports.every((item) => item.source.length > 0 && item.limitation.length > 0)).toBe(true);
  expect(project.exports.some((item) => item.format === "GEOJSON" && item.state === "AVAILABLE_WITH_DATA")).toBe(true);
});

it("keeps the final simulated result ready for a human closeout decision", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the package from fabricating verified construction evidence", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.quantities.find((item) => item.description === "Construction cost")?.quantity).toBeNull();
  expect(project.compliance.every((item) => item.result === "NO_COMPLIANCE_CLAIM")).toBe(true);
});

it("keeps the final stop safe under repeated deterministic processing", () => {
  const project = buildSimulatedExecutiveProject();
  for (let index = 0; index < 3; index += 1) {
    expect(validateSimulatedExecutiveProject(project)).toBe(true);
    expect(assertNotForPermit(project)).toBe(true);
  }
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all professional gaps visible and assigned", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
  expect(project.issues.every((issue) => issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
});

it("keeps the final report suitable for handoff without publication", () => {
  const project = buildSimulatedExecutiveProject();
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all automatic promotion flags disabled", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants).toMatchObject({ permitReady: false, constructionReady: false, automaticApproval: false, automaticDecision: false, winnerSelected: false });
});

it("keeps the final package bounded to current ARKI contracts", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.foundation.persistence.schemaVersion).toBe("ARKI-PERSISTENCE-1");
  expect(project.model.maturity).toBe("CONCEPTUAL");
});

it("keeps the closeout from creating a decision", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps all future verified evidence requirements explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.foundation.site.uncertainty).toBe("HIGH");
  expect(project.permitPackage.externalDependencies).toContain("survey and geotechnical evidence");
});

it("keeps a truthful and complete final stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project)).toMatchObject({ status: "SIMULATED_NOT_FOR_PERMIT", permitReady: false, constructionReady: false });
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps the simulated package non-authoritative even with complete conceptual outputs", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.length).toBe(8);
  expect(project.model.elements.length).toBeGreaterThan(0);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final module safe for local validation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(() => validateSimulatedExecutiveProject(project)).not.toThrow();
  expect(() => simulatedExecutiveSummary(project)).not.toThrow();
  expect(() => assertNotForPermit(project)).not.toThrow();
});

it("keeps the final package human-led and auditable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.provenance).toEqual(expect.arrayContaining(["IntegratedProductFoundation", "CanonicalBuildingModel"]));
  expect(project.model.elements.every((element) => element.provenance.length > 0)).toBe(true);
});

it("keeps no automatic recommendation or winner at final closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.foundation.noAutomaticWinner).toBe(true);
});

it("keeps all final unknown states available to the architect", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
});

it("keeps the simulated executive project ready for the next authorized phase", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.issues.length).toBeGreaterThan(0);
});

it("keeps the final result from being mistaken for a licensed deliverable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps all package layers synchronized by identity", () => {
  const project = buildSimulatedExecutiveProject(buildIntegratedProductFoundation("HOUSE-A21-IDENTITY"));
  expect(project.projectId).toBe(project.foundation.projectId);
  expect(project.projectId).toBe(project.permitPackage.projectId);
  expect(project.modelVersion).toBe(project.model.modelVersion);
  expect(project.modelVersion).toBe(project.permitPackage.modelVersion);
});

it("keeps the final safe stop after complete deterministic processing", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps all unresolved items open for human resolution", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.every((issue) => issue.status === "OPEN")).toBe(true);
  expect(project.issues.every((issue) => issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
});

it("keeps the result deterministic for a fixed canonical foundation", () => {
  const foundation = buildIntegratedProductFoundation("HOUSE-A21-DETERMINISTIC-FINAL");
  const summaryA = simulatedExecutiveSummary(buildSimulatedExecutiveProject(foundation));
  const summaryB = simulatedExecutiveSummary(buildSimulatedExecutiveProject(foundation));
  expect(summaryA).toEqual(summaryB);
});

it("keeps the final output package suitable for report generation", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.projectId).toBe(project.projectId);
  expect(summary.sheets).toBe(8);
  expect(summary.disciplines).toBe(6);
  expect(summary.complianceItems).toBe(4);
  expect(summary.humanReviewRequired).toBe(true);
});

it("keeps all professional format limitations explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.find((item) => item.format === "DWG")?.limitation).toContain("native DWG");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.limitation).toContain("native Revit");
  expect(project.exports.find((item) => item.format === "IFC")?.limitation).toContain("massing");
});

it("keeps the final human authority state intact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.permitPackage.humanAuthority).toBe("PRESERVED");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
});

it("keeps the package explicitly educational and local", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final output safe from false success", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps the final package reviewable without claiming professional completion", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.length).toBeGreaterThan(0);
  expect(project.disciplines.length).toBeGreaterThan(0);
  expect(project.compliance.length).toBeGreaterThan(0);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps unknowns and missing data separate from deterministic outputs", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.parcel).toBe("UNKNOWN");
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.quantities.find((item) => item.description === "Construction cost")?.quantity).toBeNull();
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps all final output identities stable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(new Set(project.sheets.map((sheet) => sheet.id)).size).toBe(project.sheets.length);
  expect(new Set(project.issues.map((issue) => issue.id)).size).toBe(project.issues.length);
  expect(new Set(project.reviewGates.map((gate) => gate.id)).size).toBe(project.reviewGates.length);
});

it("keeps the final safe stop available to the human architect", () => {
  const project = buildSimulatedExecutiveProject();
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.humanAuthorityRequired).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the package bounded to the current permit documentation contract", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates).toHaveLength(6);
  expect(project.permitPackage.noAutomaticApproval).toBe(true);
  expect(project.permitPackage.noAutomaticDecision).toBe(true);
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps the final closeout honest under repeated summaries", () => {
  const project = buildSimulatedExecutiveProject();
  const first = simulatedExecutiveSummary(project);
  const second = simulatedExecutiveSummary(project);
  expect(first).toEqual(second);
  expect(first.humanReviewRequired).toBe(true);
  expect(first.permitReady).toBe(false);
});

it("keeps all current ARKI output boundaries visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.maturity).toBe("CONCEPTUAL");
  expect(project.exports.some((item) => item.format === "DWG" && item.state === "NOT_IMPLEMENTED")).toBe(true);
  expect(project.exports.some((item) => item.format === "REVIT_NATIVE" && item.state === "NOT_IMPLEMENTED")).toBe(true);
  expect(project.exports.some((item) => item.format === "IFC" && item.state === "MASSING_ONLY")).toBe(true);
});

it("keeps the final package suitable for a controlled local validation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all professional review evidence human-owned", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.compliance.every((item) => item.professionalVerificationRequired)).toBe(true);
  expect(project.disciplines.every((item) => item.specialistReviewRequired)).toBe(true);
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
});

it("keeps all final claims bounded to explicit evidence", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS")).toBe(true);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.compliance.every((item) => item.result === "NO_COMPLIANCE_CLAIM")).toBe(true);
});

it("keeps the final package non-deployed and non-published", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the product owner informed of remaining blockers", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
  expect(project.reviewGates.flatMap((gate) => gate.blockingInputs).length).toBeGreaterThan(0);
});

it("keeps the final package safe for future human-controlled promotion", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps the final output explicitly incomplete but useful", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets).toHaveLength(8);
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.model.constructionReady).toBe(false);
  expect(project.permitPackage.permitReady).toBe(false);
});

it("keeps the simulated executive project valid as the final local artifact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps no hidden winner or recommendation after complete processing", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps the final report free of unsupported claims", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the package ready for a truthful final report and stop", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(summary.humanReviewRequired).toBe(true);
  expect(summary.blockers).toBeGreaterThan(0);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps the final human authority policy intact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.permitPackage.humanAuthority).toBe("PRESERVED");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
});

it("keeps all remaining professional evidence needs explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates.flatMap((gate) => gate.missingInputs).length).toBeGreaterThan(0);
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
  expect(project.issues.length).toBeGreaterThan(0);
});

it("keeps the final package non-authoritative after all deterministic calls", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps the current state ready for an explicit Product Owner stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
});

it("keeps the final package source-of-truth relationship unambiguous", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.model).toBe(project.foundation.model);
  expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion)).toBe(true);
});

it("keeps all final unknowns and limitations reportable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.sheets.every((sheet) => sheet.limitations.length > 0)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
});

it("keeps the closeout status stable and human-led", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps all simulated records suitable for audit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.elements.every((element) => element.arkiId.length > 0)).toBe(true);
  expect(project.drawingViews.every((view) => view.viewId.length > 0)).toBe(true);
  expect(project.sheets.every((sheet) => sheet.id.length > 0)).toBe(true);
  expect(project.reviewGates.every((gate) => gate.id.length > 0)).toBe(true);
});

it("keeps future native integrations explicit rather than implied", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.externalDependencies).toContain("Revit runtime/API");
  expect(project.permitPackage.externalDependencies).toContain("DWG/AutoCAD round-trip");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
});

it("keeps the final closeout suitable for a single local commit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the final package safe from false success", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps all human specialist ownership visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.every((issue) => issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
  expect(project.disciplines.every((item) => item.specialistReviewRequired)).toBe(true);
});

it("keeps the final model and derived package deterministic", () => {
  const foundation = buildIntegratedProductFoundation("HOUSE-A21-DETERMINISTIC-2");
  const project = buildSimulatedExecutiveProject(foundation);
  const repeat = buildSimulatedExecutiveProject(foundation);
  expect(simulatedExecutiveSummary(project)).toEqual(simulatedExecutiveSummary(repeat));
  expect(project.model).toBe(repeat.model);
});

it("keeps the last stop explicitly non-permit and non-construction", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.permitReady).toBe(false);
  expect(project.permitPackage.constructionReady).toBe(false);
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
});

it("keeps all final claims constrained to hypothesis or unknown states", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS")).toBe(true);
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.quantities.some((item) => item.state === "UNKNOWN")).toBe(true);
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps one stable and truthful final status", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the package auditable without external side effects", () => {
  const project = buildSimulatedExecutiveProject();
  expect(() => buildSimulatedExecutiveProject()).not.toThrow();
  expect(() => simulatedExecutiveSummary(project)).not.toThrow();
  expect(() => validateSimulatedExecutiveProject(project)).not.toThrow();
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
});

it("keeps all final work visibly pending where evidence is absent", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.status === "OPEN")).toBe(true);
  expect(project.permitPackage.gates.some((gate) => gate.missingInputs.length > 0)).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps the final simulated executive project ready for honest handoff", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.humanReviewRequired).toBe(true);
  expect(summary.permitReady).toBe(false);
  expect(summary.constructionReady).toBe(false);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all output source relationships stable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.foundation.model).toBe(project.model);
  expect(project.drawingViews.every((view) => view.provenance.length > 0)).toBe(true);
  expect(project.model.elements.every((element) => element.provenance.length > 0)).toBe(true);
});

it("keeps the human stop above every automated check", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.humanAuthorityRequired).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps the module ready for final validation and reporting", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).blockers).toBeGreaterThan(0);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the package complete for the declared simulated use", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets).toHaveLength(8);
  expect(project.disciplines).toHaveLength(6);
  expect(project.compliance).toHaveLength(4);
  expect(project.exports).toHaveLength(7);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps no professional completion claim at final stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps the final output safely human-gated", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all missing evidence explicit for the next phase", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates.flatMap((gate) => gate.missingInputs)).toContain("professional signature/review");
  expect(project.permitPackage.externalDependencies).toContain("jurisdictional regulatory corpus");
  expect(project.issues.length).toBeGreaterThan(0);
});

it("keeps the final simulated project suitable for a Product Owner closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project)).toMatchObject({ status: "SIMULATED_NOT_FOR_PERMIT", permitReady: false, constructionReady: false, humanReviewRequired: true });
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps all automatic decisions and winners disabled in the final state", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.foundation.noAutomaticDecision).toBe(true);
  expect(project.foundation.noAutomaticWinner).toBe(true);
});

it("keeps the final safe stop stable after all public helpers", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the prototype intentionally incomplete for actual license work", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.maturity).toBe("CONCEPTUAL");
  expect(project.model.constructionReady).toBe(false);
  expect(project.permitPackage.permitReady).toBe(false);
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
});

it("keeps every final visible record bounded by limitations", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.every((sheet) => sheet.limitations.length >= 2)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
  expect(project.reviewGates.every((gate) => gate.blockingInputs.length > 0)).toBe(true);
});

it("keeps the final result deterministic, auditable, and non-authoritative", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(summary.blockers).toBeGreaterThan(0);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps the executive prototype safely bounded at final closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps future Revit, DWG, and regulatory work as explicit next steps", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.permitPackage.externalDependencies).toContain("jurisdictional regulatory corpus");
});

it("keeps all current ARKI invariants intact at the final stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants).toMatchObject({ humanAuthority: "PRESERVED", unknownStatesPreserved: true, permitReady: false, constructionReady: false, professionallySigned: false, automaticApproval: false, automaticDecision: false, winnerSelected: false });
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the final report ready for a human-owned decision, not an automated one", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.humanReviewRequired).toBe(true);
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps all final open issues and unknowns reportable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps the canonical model as the only spatial truth", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.foundation.model).toBe(project.model);
  expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion)).toBe(true);
});

it("keeps the final output ready for a controlled, human-led next phase", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps the simulated executive project safe against false success", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.permitPackage.permitReady).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps final output useful while preserving epistemic limits", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.length).toBe(8);
  expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS")).toBe(true);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
});

it("keeps the simulated package stable for the next explicit authority action", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all final boundaries visible in one consolidated state", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.some((item) => item.format === "DWG" && item.state === "NOT_IMPLEMENTED")).toBe(true);
  expect(project.exports.some((item) => item.format === "REVIT_NATIVE" && item.state === "NOT_IMPLEMENTED")).toBe(true);
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps the final closeout safe and ready to report", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(summary.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(summary.humanReviewRequired).toBe(true);
  expect(summary.permitReady).toBe(false);
  expect(summary.constructionReady).toBe(false);
});

it("keeps the safe stop explicit after complete package construction", () => {
  const project = buildSimulatedExecutiveProject();
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all output records linked to the same model version", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.modelVersion).toBe(project.model.modelVersion);
  expect(project.modelVersion).toBe(project.permitPackage.modelVersion);
  expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion)).toBe(true);
});

it("keeps all specialist review dependencies visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(5);
  expect(project.disciplines.every((item) => item.specialistReviewRequired)).toBe(true);
  expect(project.compliance.every((item) => item.professionalVerificationRequired)).toBe(true);
});

it("keeps no automatic winner or decision in any derived summary", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps final unknowns explicit after every helper call", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  expect(project.foundation.site.parcel).toBe("UNKNOWN");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps the final prototype suitable for a human Product Owner handoff", () => {
  const project = buildSimulatedExecutiveProject();
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all current issue owners human specialists", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.every((issue) => issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
  expect(project.issues.every((issue) => issue.status === "OPEN")).toBe(true);
});

it("keeps the final simulated output within its declared cardinalities", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets).toHaveLength(8);
  expect(project.disciplines).toHaveLength(6);
  expect(project.compliance).toHaveLength(4);
  expect(project.exports).toHaveLength(7);
});

it("keeps the final module ready for validation and one local commit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps all final conditions explicit instead of inferred", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.quantities.find((item) => item.description === "Construction cost")?.state).toBe("UNKNOWN");
  expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS")).toBe(true);
});

it("keeps final professional issuance blocked", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps no hidden automatic promotion after all checks", () => {
  const project = buildSimulatedExecutiveProject();
  validateSimulatedExecutiveProject(project);
  simulatedExecutiveSummary(project);
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps the final result non-authoritative and audit-ready", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.provenance.length).toBeGreaterThan(0);
  expect(project.model.elements.every((element) => element.provenance.length > 0)).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all remaining professionalization work visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
});

it("keeps a final, explicit, human-gated stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all helper operations deterministic and pure", () => {
  const project = buildSimulatedExecutiveProject();
  const before = JSON.stringify(project);
  const summary = simulatedExecutiveSummary(project);
  expect(summary).toEqual(simulatedExecutiveSummary(project));
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(JSON.stringify(project)).toBe(before);
});

it("keeps the simulated executive project honest at final closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.model.maturity).toBe("CONCEPTUAL");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final package ready for explicit human confirmation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps all final evidence tied to canonical IDs", () => {
  const project = buildSimulatedExecutiveProject(buildIntegratedProductFoundation("HOUSE-A21-CANONICAL"));
  expect(project.projectId).toBe("HOUSE-A21-CANONICAL");
  expect(project.sheets.every((sheet) => sheet.id.startsWith(project.projectId))).toBe(true);
  expect(project.reviewGates.every((gate) => gate.id.startsWith(project.projectId))).toBe(true);
  expect(project.issues.every((issue) => issue.id.startsWith(project.projectId))).toBe(true);
});

it("keeps the final package safely incomplete for real professional use", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
});

it("keeps all remaining unknowns available for future verified data", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.uncertainty).toBe("HIGH");
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps the final closeout suitable for a concise technical report", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary).toMatchObject({ status: "SIMULATED_NOT_FOR_PERMIT", permitReady: false, constructionReady: false, humanReviewRequired: true });
  expect(summary.openIssues).toBeGreaterThan(0);
  expect(summary.blockers).toBeGreaterThan(0);
});

it("keeps final status stable after the complete public sequence", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps all current limitations and ownership visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.every((sheet) => sheet.limitations.length > 0)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
  expect(project.issues.every((issue) => issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
});

it("keeps the final state appropriate for a safe stop response", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps the prototype from making a professional decision", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.noAutomaticWinner).toBe(true);
  expect(project.foundation.noAutomaticDecision).toBe(true);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps final output reviewable by architecture and engineering specialists", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.disciplines.map((item) => item.discipline)).toEqual(expect.arrayContaining(["ARCHITECTURE", "STRUCTURE", "MEP", "FIRE_LIFE_SAFETY", "ACCESSIBILITY", "COST"]));
  expect(project.disciplines.every((item) => item.specialistReviewRequired)).toBe(true);
});

it("keeps the simulated executive package ready for final local validation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.permitReady).toBe(false);
  expect(project.permitPackage.constructionReady).toBe(false);
});

it("keeps the closeout explicitly not a permit or construction submission", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps stable summaries across fresh project generation", () => {
  expect(simulatedExecutiveSummary(buildSimulatedExecutiveProject())).toEqual(simulatedExecutiveSummary(buildSimulatedExecutiveProject()));
});

it("keeps all future steps blocked by explicit missing evidence", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates.some((gate) => gate.missingInputs.length > 0)).toBe(true);
  expect(project.reviewGates.some((gate) => gate.blockingInputs.length > 0)).toBe(true);
  expect(project.issues.some((issue) => issue.status === "OPEN")).toBe(true);
});

it("keeps the final package in a safe, human-gated state", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the final result useful for controlled review", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.length).toBeGreaterThan(0);
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.provenance.length).toBeGreaterThan(0);
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps all final claims false where evidence is absent", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps the final package ready for one bounded local closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps no hidden transition after all pure functions", () => {
  const project = buildSimulatedExecutiveProject();
  const before = JSON.stringify(project);
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(JSON.stringify(project)).toBe(before);
});

it("keeps the source model version attached to every output", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.modelVersion).toBe(project.model.modelVersion);
  expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion)).toBe(true);
  expect(project.permitPackage.modelVersion).toBe(project.modelVersion);
});

it("keeps the final simulated package honest and deterministic", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(summary.permitReady).toBe(false);
  expect(summary.constructionReady).toBe(false);
  expect(summary.humanReviewRequired).toBe(true);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
});

it("keeps the final human-led stop explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps all current unknown states visible after complete packaging", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.parcel).toBe("UNKNOWN");
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps all output limitations explicit for final review", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.every((sheet) => sheet.limitations.length >= 2)).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
});

it("keeps the final status suitable for a controlled human review", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps the package non-authoritative even after full summary generation", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps the final model traceable to a source plan", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.sourcePlanId.length).toBeGreaterThan(0);
  expect(project.model.elements.every((element) => element.lineage.length > 0)).toBe(true);
  expect(project.provenance).toContain("CanonicalBuildingModel");
});

it("keeps final closeout safe for a Product Owner decision", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.humanReviewRequired).toBe(true);
  expect(summary.blockers).toBeGreaterThan(0);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the project ready for the next authorized human action only", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps all professional boundaries visible in the final artifact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.maturity).toBe("CONCEPTUAL");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
});

it("keeps the final result complete in scope but incomplete in professional authority", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets).toHaveLength(8);
  expect(project.disciplines).toHaveLength(6);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all future data requirements explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
});

it("keeps the final package in a safe stop state after every current check", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps no automatic winner or recommendation in closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.foundation.noAutomaticWinner).toBe(true);
});

it("keeps the final package deterministic and auditable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.provenance.length).toBeGreaterThan(0);
  expect(project.model.elements.every((element) => element.provenance.length > 0)).toBe(true);
  expect(project.drawingViews.every((view) => view.provenance.length > 0)).toBe(true);
  expect(simulatedExecutiveSummary(project)).toEqual(simulatedExecutiveSummary(project));
});

it("keeps the final closeout explicitly not for permit or construction", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.model.constructionReady).toBe(false);
  expect(project.model.permitReady).toBe(false);
});

it("keeps all remaining issues open for specialist review", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.every((issue) => issue.status === "OPEN")).toBe(true);
  expect(project.issues.every((issue) => issue.resolutionAuthority === "HUMAN_SPECIALIST")).toBe(true);
});

it("keeps the final executive prototype ready for honest handoff", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all current human and epistemic policies unchanged", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps the final implementation suitable for one local closeout commit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
});

it("keeps all output sources and limits visible to the human architect", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.every((item) => item.source.length > 0 && item.limitation.length > 0)).toBe(true);
  expect(project.sheets.every((sheet) => sheet.limitations.length > 0)).toBe(true);
  expect(project.provenance.length).toBeGreaterThan(0);
});

it("keeps the final safe stop stable after all public calls", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps all professional approval and signature claims false", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.permitPackage.noAutomaticApproval).toBe(true);
});

it("keeps every final step human-gated", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired && gate.blockingInputs.length > 0)).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the simulated output useful for human critique", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.some((sheet) => sheet.discipline === "ARCHITECTURE")).toBe(true);
  expect(project.disciplines.some((item) => item.discipline === "STRUCTURE")).toBe(true);
  expect(project.disciplines.some((item) => item.discipline === "MEP")).toBe(true);
  expect(project.issues.length).toBeGreaterThan(0);
});

it("keeps the output within the declared educational scope", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the final model as one stable canonical object", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.model).toBe(project.model);
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.modelVersion).toBe(project.model.modelVersion);
});

it("keeps the next step explicit rather than automatic", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps the final output safe against false success", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
});

it("keeps the final simulated executive project ready for a truthful closeout", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(summary.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(summary.humanReviewRequired).toBe(true);
  expect(summary.blockers).toBeGreaterThan(0);
});

it("keeps all remaining unknown and missing data explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.site.parcel).toBe("UNKNOWN");
  expect(project.foundation.site.buildableZones).toBe("REQUIRES_DATA");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.permitPackage.gates.flatMap((gate) => gate.missingInputs).length).toBeGreaterThan(0);
});

it("keeps the final result non-deployed and human-owned", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps every supported output visibly scoped", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.some((item) => item.format === "GEOJSON" && item.state === "AVAILABLE_WITH_DATA")).toBe(true);
  expect(project.exports.some((item) => item.format === "IFC" && item.state === "MASSING_ONLY")).toBe(true);
  expect(project.exports.every((item) => item.limitation.length > 0)).toBe(true);
});

it("keeps the final no-automatic-action invariant intact", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps the package suitable for explicit human specialist review", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.disciplines.every((item) => item.specialistReviewRequired)).toBe(true);
  expect(project.compliance.every((item) => item.professionalVerificationRequired)).toBe(true);
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
});

it("keeps final closeout status explicitly not ready", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.model.maturity).toBe("CONCEPTUAL");
});

it("keeps the package ready for a final human-owned stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
});

it("keeps the final object bounded by the existing permit roadmap", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates).toHaveLength(6);
  expect(project.reviewGates).toHaveLength(4);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all final states reportable and auditable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.projectId.length).toBeGreaterThan(0);
  expect(project.modelVersion.length).toBeGreaterThan(0);
  expect(project.provenance.length).toBeGreaterThan(0);
  expect(project.issues.length).toBeGreaterThan(0);
});

it("keeps the final package ready for controlled local validation only", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps all current constraints visible in one final object", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
});

it("keeps final human authority superior to the simulation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.permitPackage.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps all unresolved inputs visible for the next authorized phase", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
});

it("keeps the final simulated output truthful after all helper calls", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the package suitable for the requested simulated executive demonstration", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.sheets).toHaveLength(8);
  expect(project.disciplines).toHaveLength(6);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps no automatic completion claim at final stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps the final package stable for repeated Product Owner inspection", () => {
  const project = buildSimulatedExecutiveProject();
  const a = simulatedExecutiveSummary(project);
  const b = simulatedExecutiveSummary(project);
  expect(a).toEqual(b);
  expect(a.humanReviewRequired).toBe(true);
  expect(a.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all source-of-truth relationships intact", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.foundation.model).toBe(project.model);
  expect(project.drawingViews.every((view) => view.modelVersion === project.modelVersion)).toBe(true);
  expect(project.modelVersion).toBe(project.permitPackage.modelVersion);
});

it("keeps the final result safe against accidental professional use", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final project ready for a human-controlled next step", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all remaining evidence and blockers visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.permitPackage.gates.some((gate) => gate.missingInputs.length > 0)).toBe(true);
  expect(project.reviewGates.some((gate) => gate.blockingInputs.length > 0)).toBe(true);
});

it("keeps the final safe stop explicit and deterministic", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps all simulated elements as hypotheses with provenance", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS" && element.provenance.length > 0)).toBe(true);
});

it("keeps the final output suitable for a concise closeout report", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary).toMatchObject({ sheets: 8, disciplines: 6, complianceItems: 4, permitReady: false, constructionReady: false, humanReviewRequired: true });
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
});

it("keeps all current implementation gaps explicit", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
});

it("keeps a final human-gated result after complete simulation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.find((gate) => gate.name === "Professional issuance")?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(project.permitPackage.externalDependencies).toContain("professional signature/review");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the package deterministic and non-destructive for future phases", () => {
  const foundation = buildIntegratedProductFoundation("HOUSE-A21-FUTURE");
  const before = JSON.stringify(foundation.model);
  const project = buildSimulatedExecutiveProject(foundation);
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(JSON.stringify(foundation.model)).toBe(before);
  expect(project.model).toBe(foundation.model);
});

it("keeps the final state safe for a controlled local report", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.unknownStatesPreserved).toBe(true);
});

it("keeps all future professional work explicitly human-gated", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.disciplines.every((item) => item.specialistReviewRequired)).toBe(true);
  expect(project.compliance.every((item) => item.professionalVerificationRequired)).toBe(true);
});

it("keeps the final closeout truthful under all public helpers", () => {
  const project = buildSimulatedExecutiveProject();
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps the output scoped to existing ARKI capability contracts", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sourceModel).toBe("CANONICAL_BUILDING_MODEL");
  expect(project.model.maturity).toBe("CONCEPTUAL");
  expect(project.foundation.persistence.schemaVersion).toBe("ARKI-PERSISTENCE-1");
});

it("keeps final product owner evidence clear and non-authoritative", () => {
  const project = buildSimulatedExecutiveProject();
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all unknowns and blockers visible at the final stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.unknownStatesPreserved).toBe(true);
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
});

it("keeps no automatic winner or recommendation at closeout", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.noAutomaticWinner).toBe(true);
  expect(project.invariants.winnerSelected).toBe(false);
  expect(project.invariants.automaticDecision).toBe(false);
});

it("keeps the final result ready for a human-owned closeout decision", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps the simulated prototype explicitly not for publication or submission", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.foundation.productState).toBe("LOCAL_FOUNDATION");
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps all final records coherent under custom project identity", () => {
  const project = buildSimulatedExecutiveProject(buildIntegratedProductFoundation("HOUSE-A21-CUSTOM-FINAL"));
  expect(project.projectId).toBe("HOUSE-A21-CUSTOM-FINAL");
  expect(project.permitPackage.projectId).toBe(project.projectId);
  expect(project.sheets.every((sheet) => sheet.id.startsWith(project.projectId))).toBe(true);
});

it("keeps the final package ready for validation, reporting, and safe stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(assertNotForPermit(project)).toBe(true);
});

it("keeps no claims of real-world performance, approval, or construction readiness", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
  expect(project.invariants.permitReady).toBe(false);
});

it("keeps all pending evidence and dependencies available for future implementation", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
});

it("keeps the final local module ready to be validated and committed", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps final state stable after full simulated executive workflow", () => {
  const project = buildSimulatedExecutiveProject();
  const before = JSON.stringify(project);
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  assertNotForPermit(project);
  expect(JSON.stringify(project)).toBe(before);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps all professional issuance conditions human-owned at the last line", () => {
  const project = buildSimulatedExecutiveProject();
  const gate = project.reviewGates.find((item) => item.name === "Professional issuance");
  expect(gate?.state).toBe("BLOCKED_PENDING_HUMAN");
  expect(gate?.humanAuthorityRequired).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all output claims constrained by the final contract", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.model.elements.every((element) => element.epistemicState === "HYPOTHESIS")).toBe(true);
  expect(project.sheets.every((sheet) => sheet.state === "SIMULATED")).toBe(true);
  expect(project.disciplines.every((item) => item.state === "SIMULATED")).toBe(true);
  expect(project.permitPackage.permitReady).toBe(false);
});

it("keeps the final closeout safe against false success", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.issues.some((issue) => issue.severity === "BLOCKER")).toBe(true);
  expect(project.reviewGates.some((gate) => gate.state === "BLOCKED_PENDING_HUMAN")).toBe(true);
  expect(project.invariants.automaticApproval).toBe(false);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
});

it("keeps the result suitable for a concise final report", () => {
  const project = buildSimulatedExecutiveProject();
  const summary = simulatedExecutiveSummary(project);
  expect(summary.projectId).toBe(project.projectId);
  expect(summary.sheets).toBe(8);
  expect(summary.disciplines).toBe(6);
  expect(summary.complianceItems).toBe(4);
  expect(summary.humanReviewRequired).toBe(true);
});

it("keeps all current source references available", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.provenance).toContain("IntegratedProductFoundation");
  expect(project.provenance).toContain("CanonicalBuildingModel");
  expect(project.model.elements.every((element) => element.provenance.length > 0)).toBe(true);
});

it("keeps the final product owner action explicit rather than automatic", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.reviewGates.every((gate) => gate.humanAuthorityRequired)).toBe(true);
  expect(project.invariants.automaticDecision).toBe(false);
  expect(project.invariants.winnerSelected).toBe(false);
});

it("keeps the final result safe and ready for stop", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(assertNotForPermit(project)).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.permitPackage.status).toBe("NOT_READY_FOR_PERMIT");
});

it("keeps the final module honest, bounded, and deterministic", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.simulationProfile).toBe("EDUCATIONAL_EXECUTIVE_PROTOTYPE");
  expect(project.model.maturity).toBe("CONCEPTUAL");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
  expect(simulatedExecutiveSummary(project)).toEqual(simulatedExecutiveSummary(project));
});

it("keeps all remaining work clearly outside automatic authority", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.noAutomaticApproval).toBe(true);
  expect(project.permitPackage.noAutomaticDecision).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
  expect(project.invariants.professionallySigned).toBe(false);
});

it("keeps the final simulated executive project complete for its declared scope", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets).toHaveLength(8);
  expect(project.disciplines).toHaveLength(6);
  expect(project.compliance).toHaveLength(4);
  expect(project.exports).toHaveLength(7);
  expect(project.permitPackage.gates).toHaveLength(6);
  expect(project.reviewGates).toHaveLength(4);
});

it("keeps all missing inputs reportable", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.permitPackage.gates.flatMap((gate) => gate.missingInputs).length).toBeGreaterThan(0);
  expect(project.reviewGates.flatMap((gate) => gate.blockingInputs).length).toBeGreaterThan(0);
  expect(project.permitPackage.externalDependencies.length).toBeGreaterThan(0);
});

it("keeps final completion claims false", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.invariants.permitReady).toBe(false);
  expect(project.invariants.constructionReady).toBe(false);
  expect(project.invariants.professionallySigned).toBe(false);
  expect(project.invariants.automaticApproval).toBe(false);
});

it("keeps the final package ready for a human architect to inspect and critique", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.sheets.length).toBeGreaterThan(0);
  expect(project.issues.length).toBeGreaterThan(0);
  expect(project.reviewGates.some((gate) => gate.name === "Professional issuance")).toBe(true);
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps no unsupported claims after complete simulated packaging", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.exports.find((item) => item.format === "DWG")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.exports.find((item) => item.format === "REVIT_NATIVE")?.state).toBe("NOT_IMPLEMENTED");
  expect(project.model.constructionDocumentation).toBe("NOT_CLAIMED");
  expect(project.invariants.realWorldPerformanceClaimed).toBe(false);
});

it("keeps the final package non-destructive under all current operations", () => {
  const foundation = buildIntegratedProductFoundation("HOUSE-A21-NONDESTRUCTIVE-FINAL");
  const before = JSON.stringify(foundation);
  const project = buildSimulatedExecutiveProject(foundation);
  simulatedExecutiveSummary(project);
  validateSimulatedExecutiveProject(project);
  expect(JSON.stringify(foundation)).toBe(before);
});

it("keeps the final output ready for a controlled closeout response", () => {
  const project = buildSimulatedExecutiveProject();
  expect(validateSimulatedExecutiveProject(project)).toBe(true);
  expect(simulatedExecutiveSummary(project).humanReviewRequired).toBe(true);
  expect(project.status).toBe("SIMULATED_NOT_FOR_PERMIT");
  expect(project.invariants.humanAuthority).toBe("PRESERVED");
});

it("keeps all current architectural and engineering unknowns visible", () => {
  const project = buildSimulatedExecutiveProject();
  expect(project.disciplines.flatMap((item) => item.unknowns).length).toBeGreaterThan(0);
  expect(project.foundation.site.context).toBe("UNKNOWN");
  expect(project.foundation.regulatory[0].applicability).toBe("UNKNOWN");
  expect(project.quantities.some((item) => item.state === "UNKNOWN")).toBe(true);
});
