import { describe, expect, it } from "vitest";
import { p10Markdown, runP10KnowledgeTransferChallenge, validateP10Report } from "./arkiP10KnowledgeTransferChallenge";

describe("P10 knowledge transfer and generalization challenge", () => {
  it("reconstructs the repository K2 candidate without rewriting P9.4", () => {
    const report = runP10KnowledgeTransferChallenge();
    expect(report.k2.knowledgeId).toBe("P9.4-CAPACITY-ROUTE-DEPENDENCY");
    expect(report.k2.stateBefore).toBe("K2_CANDIDATE");
    expect(report.k2.observed[0]).toContain("same represented route");
    expect(report.antiContamination.p94Reexecuted).toBe(false);
  });

  it("separates case memory from a bounded relational hypothesis", () => {
    const report = runP10KnowledgeTransferChallenge();
    expect(report.abstraction.epistemicStatus).toBe("HYPOTHESIS");
    expect(report.abstraction.removed).toContain("geometry template");
    expect(report.abstraction.retained).toContain("route organization");
  });

  it("evaluates near, cross-project, cross-typology and adversarial outcomes", () => {
    const report = runP10KnowledgeTransferChallenge();
    expect(report.transferMatrix.map(row => row.actual)).toEqual([
      "PERSISTS", "ADAPTS", "ADAPTS", "UNKNOWN", "DO_NOT_TRANSFER", "DO_NOT_TRANSFER",
    ]);
    expect(report.scopeAfter.doesNotApplyWhen).toContain("Project B threshold is copied");
  });

  it("keeps K2, preserves UNKNOWN and refuses automatic universalization", () => {
    const report = runP10KnowledgeTransferChallenge();
    expect(report.promotion.stateAfter).toBe("K2_CANDIDATE");
    expect(report.promotion.humanConfirmationRequired).toBe(true);
    expect(report.autonomy.l10Process).toBe("L10_DEMONSTRATED");
    expect(report.autonomy.knowledgeGeneralization).toBe("G1");
    expect(report.battery).toHaveLength(20);
  });

  it("validates the complete P10 report and existing ANEXO I references", () => {
    const report = runP10KnowledgeTransferChallenge();
    expect(validateP10Report(report)).toBe(true);
    expect(p10Markdown(report)).toContain("HUMAN REVIEW REQUIRED");
  });
});
