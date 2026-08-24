import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("analytical UI contract", () => {
  it("exposes explicit Evaluation and Comparison authoring in the Alternatives module", () => {
    expect(homeSource).toContain("EvaluationComparisonModule");
    expect(homeSource).toContain('onSubmit("evaluations"');
    expect(homeSource).toContain('"multiComparisons"');
    expect(homeSource).toContain("feasibilityStatus");
    expect(homeSource).toContain("provenance");
  });

  it("keeps Evaluation and Comparison objective selections independent", () => {
    expect(homeSource).toContain("comparisonObjectiveId");
    expect(homeSource).toContain("setComparisonObjectiveId");
    expect(homeSource).toContain("objectiveId: comparisonObjectiveId");
  });

  it("keeps the analytical module from creating authority acts", () => {
    const moduleSource = homeSource.slice(homeSource.indexOf("function EvaluationComparisonModule"));
    expect(moduleSource).not.toContain("decisionRecord");
    expect(moduleSource).not.toContain("reviewRecord");
    expect(moduleSource).not.toContain("recommendationCreate");
    expect(moduleSource).toContain("No missing direction defaults to MINIMIZE");
  });

  it("exposes Decision Conditions as a distinct declarative record", () => {
    expect(homeSource).toContain("DecisionConditionsModule");
    expect(homeSource).toContain('onSubmit("decisionConditions"');
    expect(homeSource).toContain("conditionStatus");
    expect(homeSource).toContain("not a prediction or automatic decision");
    const conditionSource = homeSource.slice(homeSource.indexOf("function DecisionConditionsModule"));
    expect(conditionSource).not.toContain("recommendationCreate");
    expect(conditionSource).not.toContain("decisionRecord");
  });

  it("exposes Preferences as a distinct semantic record", () => {
    expect(homeSource).toContain("PreferenceModule");
    expect(homeSource).toContain("preferenceStrength");
    expect(homeSource).toContain("Preference requires a name and justification");
    expect(homeSource).toContain("not silently promoted to a requirement or hard constraint");
  });

  it("exposes a contextual spatial representation without geographic inference", () => {
    expect(homeSource).toContain("SpatialContextPanel");
    expect(homeSource).toContain("Declared frame · not georeferenced");
    expect(homeSource).toContain("does not infer coordinates");
  });

  it("exports a filtered traceability report without authority claims", () => {
    expect(homeSource).toContain("ReportExportButton");
    expect(homeSource).toContain("safeAuditData(snapshot ?? {})");
    expect(homeSource).toContain("not a professional certification or automatic decision");
  });
});
