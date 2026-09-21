import { describe, expect, it } from "vitest";
import { analyzeInputSufficiency, executeProjectBrainWave1, explainWhy, simulateRemoval, type ProjectBrainInput } from "./arkiProjectBrain";

const base: ProjectBrainInput = {
  projectId: "TER-ARK-300-001", name: "Terminal intermodal", typology: "TRANSPORT", brief: "Organizar un terminal para autos, carga pesada y autobuses con flujos separados.",
  location: "Perú", jurisdiction: "PE", site: { areaM2: 30000, access: "UNKNOWN" }, knownFacts: ["30000 m2", "250 autos", "50 camiones", "20 autobuses"],
  activities: [{ id: "passenger", label: "pasajeros", subjects: ["public"], capacity: 500, frequency: "peak", duration: "short", temporalOverlap: true, privacy: "shared" }],
  relationships: [{ id: "r1", from: "pasajeros", to: "autobuses", relation: "direct interface", subjects: ["public"], state: "open", frequency: "peak", time: "all-day" }],
  capacities: { cars: 250, trucks: 50, buses: 20 }, constraints: ["separate heavy freight from public access"], sourceIds: ["MODEL:INTERMODAL-30000"]
};

describe("ARKI Project Brain Wave 1", () => {
  it("asks for critical missing inputs instead of drawing with false certainty", () => {
    const result = analyzeInputSufficiency({ ...base, location: undefined, jurisdiction: undefined, site: undefined });
    expect(result.status).toBe("ASK_HUMAN");
    expect(result.blockingUnknowns).toEqual(expect.arrayContaining(["LOCATION", "JURISDICTION", "SITE"]));
    expect(result.humanQuestions.length).toBeGreaterThan(0);
  });

  it("derives three project-specific partis from activities and relationships", () => {
    const result = executeProjectBrainWave1(base);
    expect(result.partis).toHaveLength(3);
    expect(new Set(result.partis.map((parti) => parti.organizingIdea)).size).toBe(3);
    expect(result.partis.every((parti) => parti.status === "AI_PROPOSED" && parti.humanReviewRequired)).toBe(true);
    expect(result.brain.evidence.unknowns.length).toBeGreaterThan(0);
  });

  it("builds a causal genealogy and answers why/remove questions", () => {
    const result = executeProjectBrainWave1(base);
    const partiNode = result.genealogy.nodes.find((node) => node.type === "PARTI");
    expect(partiNode).toBeTruthy();
    const why = explainWhy(result.genealogy, partiNode!.id);
    expect(why.status).toBe("TRACEABLE");
    expect(why.explanation.length).toBeGreaterThan(1);
    const removal = simulateRemoval(result.genealogy, partiNode!.id);
    expect(removal.humanReviewRequired).toBe(true);
    expect(removal.consequence).toBe("REQUIRES_REEVALUATION");
  });

  it("includes a domain matrix and devil architect attack without collapsing to one score", () => {
    const result = executeProjectBrainWave1(base);
    expect(result.evaluations.domains.length).toBeGreaterThan(8);
    expect(Object.keys(result.evaluations.alternatives)).toHaveLength(3);
    expect(result.evaluations.devilArchitect.attacks.length).toBeGreaterThan(1);
    expect(result.evaluations.devilArchitect.humanReviewRequired).toBe(true);
  });
});
