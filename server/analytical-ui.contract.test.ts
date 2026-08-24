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

  it("keeps the analytical module from creating authority acts", () => {
    const moduleSource = homeSource.slice(homeSource.indexOf("function EvaluationComparisonModule"));
    expect(moduleSource).not.toContain("decisionRecord");
    expect(moduleSource).not.toContain("reviewRecord");
    expect(moduleSource).not.toContain("recommendationCreate");
    expect(moduleSource).toContain("No missing direction defaults to MINIMIZE");
  });
});
