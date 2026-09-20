import { describe, expect, it } from "vitest";
import {
  buildP94K0Check,
  buildP94UnknownInventory,
  p94Markdown,
  runP94EvidenceLearningExperiment,
  validateP94Experiment,
} from "./arkiP94EvidenceLearningExperiment";

describe("P9.4→P9.x evidence-to-learning experiment", () => {
  it("selects an existing UNKNOWN with an explicit bounded resolution path", () => {
    const inventory = buildP94UnknownInventory();
    expect(inventory.map(item => item.id)).toEqual([
      "B-unknown-capacity",
      "B-unknown-regulation",
    ]);
    expect(inventory[0].resolutionPath).toContain(
      "Controlled scenario fixture"
    );
  });
  it("keeps K0 frozen and does not confuse synthetic evidence with real project fact", () => {
    const k0 = buildP94K0Check();
    expect(k0.frozen).toBe(true);
    expect(k0.k1Created).toBe(false);
    const result = runP94EvidenceLearningExperiment();
    expect(result.evidence.realOrSynthetic).toBe(
      "SYNTHETIC_EXPERIMENTAL_EVIDENCE"
    );
    expect(result.evidence.doesNotSupport).toContain("regulatory compliance");
  });
  it("propagates to evaluation only and preserves geometry and UNKNOWN regulation", () => {
    const result = runP94EvidenceLearningExperiment();
    expect(result.impact.level).toBe("EVALUATION_ONLY");
    expect(result.propagation.after).toContain("geometry unchanged");
    expect(result.reevaluation.remainingUnknown).toContain(
      "B-unknown-regulation"
    );
    expect(result.reevaluation.newDeficits.length).toBeGreaterThan(0);
  });
  it("demonstrates project discovery, restraint and no L10 generalization", () => {
    const result = runP94EvidenceLearningExperiment();
    expect(result.discovery.status).toBe("PROJECT_DISCOVERY");
    expect(result.variantChallenge.result).toBe("CHANGES");
    expect(result.counterexample.scopeRefinement).toContain("not a universal");
    expect(result.learning.after).toBe("K2_CANDIDATE");
    expect(result.autonomy.highestLevel).toBe("L9_COMPARES");
    expect(result.autonomy.l10Demonstrated).toBe(false);
  });
  it("passes anti-contamination and structural validation", () => {
    const result = runP94EvidenceLearningExperiment();
    expect(validateP94Experiment(result)).toBe(true);
    expect(p94Markdown(result)).toContain("NEXT_STEP_READY");
  });
});
