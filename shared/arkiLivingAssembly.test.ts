import { describe, expect, it } from "vitest";
import { evaluateAssembly, type AssemblyCapability } from "./arkiLivingAssembly";

const base: AssemblyCapability = {
  id: "ARKI-F6-TEST", phase: 6, authority: "AGK",
  inputs: ["topology"], outputs: ["candidate"], dependencies: ["F2", "F1", "F2"],
  evidence: ["evidence-hash"], verified: true,
};

describe("ARKI living assembly deterministic deduplication", () => {
  it("deduplicates and sorts missing dependencies without changing approval state", () => {
    const result = evaluateAssembly(base, []);
    expect(result.blockers).toEqual(["MISSING_DEPENDENCY:F1", "MISSING_DEPENDENCY:F2"]);
    expect(result.options[0].requiredChecks.filter(x => x === "RESOLVE:F2")).toHaveLength(1);
    expect(result.status).toBe("PROPOSAL_ONLY");
    expect(result.selected).toBeNull();
    expect(result.options.every(x => x.authorized === false)).toBe(true);
    expect(evaluateAssembly(base, [])).toEqual(result);
  });
  it("does not manufacture missing dependencies when they are available", () => {
    const result = evaluateAssembly(base, ["F1", "F2"]);
    expect(result.blockers).toEqual([]);
    expect(result.options[0].requiredChecks).toEqual([...result.options[0].requiredChecks].sort());
  });
});
