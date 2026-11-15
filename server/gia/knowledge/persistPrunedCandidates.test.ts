import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";
import type { ScreeningResult } from "./arkiArchitectDecision";
import {
  persistPrunedCandidates,
  type PrunedRegistry,
} from "./persistPrunedCandidates";

const generationId = "12345678-1234-4234-8234-123456789abc";

function candidate(id: string): DesignCandidate {
  return {
    id,
    projectId: "PROJECT-001",
    generationId,
    stage: "SURVIVOR",
    status: "ELIGIBLE",
    title: `Candidate ${id}`,
    strategy: "PARAMETRIC",
    variantId: `VARIANT-${id}`,
    shapeType: "LINEAR",
    floors: 3,
    preview: "PREVIEW_LOCAL_CONCEPTUAL",
    metrics: {
      area: 1000,
      floors: 3,
      height: 12,
      capacity: 100,
      cost: 500000,
    },
    epistemic: {
      facts: [],
      assumptions: [],
      preferences: [],
      requirements: [],
      objectives: [],
      constraints: [],
    },
    evidence: [`EVIDENCE-${id}`],
    unknowns: [],
    failureReasons: [],
    provenance: [`GENERATION-${generationId}`, id],
  } as DesignCandidate;
}

function fixture() {
  const generatedCandidates = Array.from(
    { length: 27 },
    (_, i) => candidate(`C${i + 1}`),
  );

  const survivors = generatedCandidates.slice(0, 26);
  const archived: ScreeningResult[] = [{
    candidateId: "C27",
    decision: "ARCHIVED",
    severity: "HARD",
    failureReasons: ["HARD_CONSTRAINT"],
    softPenalties: [],
    unknownReasons: [],
  }];

  return {
    generationId,
    funnelCount: 25,
    generateCount: 27,
    generatedCandidates,
    sourceProposalsByCandidateId: Object.fromEntries(
      generatedCandidates.map((item) => [
        item.id,
        {
          candidateId: item.id,
          generationId,
          building: { id: item.id, parameters: { shapeType: "LINEAR" } },
          geometry: {
            g2d: { source: "GENERATOR" },
            section: { source: "GENERATOR" },
            g3d: { source: "GENERATOR" },
            unified: { source: "GENERATOR" },
          },
          metrics: { builtAreaM2: 1000, floors: 3 },
          validation: { status: "VALID" },
          agkCompilation: { status: "COMPILED" },
          governance: { proposalOnly: true },
        },
      ]),
    ),
    survivors,
    archived,
    held: [] as ScreeningResult[],
    cohort: survivors.slice(0, 25),
    prunedOut: survivors.slice(25),
    pruningCriteria: {
      totalBefore: 26,
      totalAfter: 25,
      byStrategy: { PARAMETRIC: 25 },
      byDiversityKey: { "variant:VARIANT-C1": 1 },
    },
  };
}

describe("persistPrunedCandidates — selective cohort registry", () => {
  it("stores 25 complete files and only lightweight metadata for the rest", () => {
    const dir = mkdtempSync(join(tmpdir(), "arki-cohort-"));
    try {
      const path = persistPrunedCandidates(fixture(), dir);
      const raw = readFileSync(path, "utf-8");
      const registry = JSON.parse(raw) as PrunedRegistry;

      expect(registry.schema).toBe("ARKI-FUNNEL-COHORT-REGISTRY-2.1");
      expect(registry.generated.count).toBe(27);
      expect(registry.generated.candidates).toHaveLength(27);
      expect(registry.candidates).toHaveLength(25);
      expect(registry.pruning.cohortCandidateIds).toHaveLength(25);
      expect(registry.pruning.prunedOutCandidateIds).toEqual(["C26"]);

      expect(registry.candidates[0].candidate).toHaveProperty("metrics");
      expect(registry.candidates[0].candidate).toHaveProperty("epistemic");
      expect(registry.candidates[0].candidate).toHaveProperty("evidence");

      expect(registry.candidates[0].sourceProposal).toHaveProperty("building");
      expect(registry.candidates[0].sourceProposal).toHaveProperty("geometry");
      expect(registry.candidates[0].sourceProposal).toHaveProperty("agkCompilation");
      expect(registry.candidates[0].sourceProposal).toHaveProperty("validation");

      expect(registry.candidates[24].candidate.id).toBe("C25");
      expect(registry.candidates).toHaveLength(25);

      // Las propuestas fuera de la cohorte solo conservan metadatos.
      expect(registry.generated.candidates[25]).not.toHaveProperty("metrics");
      expect(registry.generated.candidates[25]).not.toHaveProperty("epistemic");
      expect(registry.generated.candidates[25]).not.toHaveProperty("evidence");

      expect(raw).not.toContain('"candidateId": "C26",\n      "generationId":');
      expect(registry.screening.archived).toHaveLength(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects a cohort candidate without its original architectural source", () => {
    const dir = mkdtempSync(join(tmpdir(), "arki-cohort-"));
    try {
      const input = fixture();
      delete input.sourceProposalsByCandidateId["C1"].geometry;
      expect(() => persistPrunedCandidates(input, dir)).toThrow(
        "ARKI_REGISTRY_SOURCE_EXPEDIENT_INCOMPLETE:C1",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects a cohort that does not contain exactly 25 candidates", () => {
    const dir = mkdtempSync(join(tmpdir(), "arki-cohort-"));
    try {
      const input = fixture();
      input.cohort = input.cohort.slice(0, 24);
      expect(() => persistPrunedCandidates(input, dir)).toThrow(
        "ARKI_REGISTRY_COHORT_MUST_BE_25",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects incomplete screening partitions", () => {
    const dir = mkdtempSync(join(tmpdir(), "arki-cohort-"));
    try {
      const input = fixture();
      input.archived = [];
      expect(() => persistPrunedCandidates(input, dir)).toThrow(
        "ARKI_REGISTRY_SCREENING_PARTITION_INCOMPLETE",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects incomplete pruning partitions", () => {
    const dir = mkdtempSync(join(tmpdir(), "arki-cohort-"));
    try {
      const input = fixture();
      input.prunedOut = [];
      expect(() => persistPrunedCandidates(input, dir)).toThrow(
        "ARKI_REGISTRY_PRUNING_PARTITION_INCOMPLETE",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("does not overwrite a previous registry", () => {
    const dir = mkdtempSync(join(tmpdir(), "arki-cohort-"));
    try {
      const first = persistPrunedCandidates(fixture(), dir);
      const original = readFileSync(first, "utf-8");
      expect(() => persistPrunedCandidates(fixture(), dir)).toThrow();
      expect(readFileSync(first, "utf-8")).toBe(original);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
