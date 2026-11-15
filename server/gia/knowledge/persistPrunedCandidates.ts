/**
 * ARKI — Registro selectivo de cohorte.
 *
 * Solo la cohorte inicial de 25 conserva expedientes completos.
 * El resto de propuestas conserva metadatos de trazabilidad.
 *
 * La diversidad no representa mérito arquitectónico.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";
import type { ScreeningResult } from "./arkiArchitectDecision";

export type PrunedRegistry = {
  schema: "ARKI-FUNNEL-COHORT-REGISTRY-2.1";
  generationId: string;
  createdAt: string;
  generateCount: number;
  funnelCount: 25;

  // Datos ligeros de todas las propuestas generadas.
  generated: {
    count: number;
    candidates: {
      candidateId: string;
      generationId: string;
      status: DesignCandidate["status"];
      strategy: string;
      variantId?: string;
      shapeType?: string;
    }[];
  };

  screening: {
    survivorsCount: number;
    survivorIds: string[];
    archivedCount: number;
    archived: ScreeningResult[];
    heldCount: number;
    held: ScreeningResult[];
  };

  pruning: {
    method: "DIVERSITY_ROUND_ROBIN";
    totalBefore: number;
    totalAfter: number;
    byStrategy: Record<string, number>;
    byDiversityKey: Record<string, number>;
    cohortCandidateIds: string[];
    prunedOutCandidateIds: string[];
  };

  // Únicos expedientes completos del registro:
  // candidato Funnel + propuesta original del generador.
  candidates: {
    candidate: DesignCandidate;
    sourceProposal: Record<string, unknown>;
  }[];
};

const DATA_DIR = resolve(process.cwd(), "data", "arki-funnel");

function assertUnique(ids: string[], label: string): void {
  if (ids.some((id) => typeof id !== "string" || !id.trim())) {
    throw new Error(`ARKI_REGISTRY_INVALID_ID:${label}`);
  }
  if (new Set(ids).size !== ids.length) {
    throw new Error(`ARKI_REGISTRY_DUPLICATE_ID:${label}`);
  }
}

function assertSubset(
  ids: string[],
  universe: Set<string>,
  label: string,
): void {
  for (const id of ids) {
    if (!universe.has(id)) {
      throw new Error(`ARKI_REGISTRY_UNKNOWN_ID:${label}:${id}`);
    }
  }
}

function assertDisjoint(groups: string[][], label: string): void {
  const seen = new Set<string>();
  for (const group of groups) {
    for (const id of group) {
      if (seen.has(id)) {
        throw new Error(`ARKI_REGISTRY_OVERLAP:${label}:${id}`);
      }
      seen.add(id);
    }
  }
}

export function persistPrunedCandidates(
  input: {
    generationId: string;
    funnelCount: number;
    generateCount: number;
    generatedCandidates: DesignCandidate[];
    sourceProposalsByCandidateId: Record<string, Record<string, unknown>>;
    survivors: DesignCandidate[];
    archived: ScreeningResult[];
    held: ScreeningResult[];
    cohort: DesignCandidate[];
    prunedOut: DesignCandidate[];
    pruningCriteria: {
      totalBefore: number;
      totalAfter: number;
      byStrategy: Record<string, number>;
      byDiversityKey: Record<string, number>;
    };
  },
  dataDirectory: string = DATA_DIR,
): string {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      .test(input.generationId)
  ) {
    throw new Error("ARKI_REGISTRY_INVALID_GENERATION_ID");
  }

  if (input.funnelCount !== 25 || input.cohort.length !== 25) {
    throw new Error("ARKI_REGISTRY_COHORT_MUST_BE_25");
  }

  if (
    !Number.isInteger(input.generateCount) ||
    input.generateCount < 25 ||
    input.generatedCandidates.length !== input.generateCount
  ) {
    throw new Error("ARKI_REGISTRY_GENERATION_COUNT_MISMATCH");
  }

  const generatedIds = input.generatedCandidates.map((c) => c.id);
  const survivorIds = input.survivors.map((c) => c.id);
  const archivedIds = input.archived.map((c) => c.candidateId);
  const heldIds = input.held.map((c) => c.candidateId);
  const cohortIds = input.cohort.map((c) => c.id);
  const prunedOutIds = input.prunedOut.map((c) => c.id);

  assertUnique(generatedIds, "GENERATED");
  assertUnique(survivorIds, "SURVIVORS");
  assertUnique(archivedIds, "ARCHIVED");
  assertUnique(heldIds, "HELD");
  assertUnique(cohortIds, "COHORT");
  assertUnique(prunedOutIds, "PRUNED_OUT");

  const universe = new Set(generatedIds);

  for (const [ids, label] of [
    [survivorIds, "SURVIVORS"],
    [archivedIds, "ARCHIVED"],
    [heldIds, "HELD"],
    [cohortIds, "COHORT"],
    [prunedOutIds, "PRUNED_OUT"],
  ] as [string[], string][]) {
    assertSubset(ids, universe, label);
  }

  // Screening: cada propuesta generada debe tener una sola decisión.
  assertDisjoint([survivorIds, archivedIds, heldIds], "SCREENING");

  const screenedIds = new Set([
    ...survivorIds,
    ...archivedIds,
    ...heldIds,
  ]);

  if (
    screenedIds.size !== universe.size ||
    generatedIds.some((id) => !screenedIds.has(id))
  ) {
    throw new Error("ARKI_REGISTRY_SCREENING_PARTITION_INCOMPLETE");
  }

  // Poda: cada superviviente debe entrar en la cohorte o quedar fuera.
  assertDisjoint([cohortIds, prunedOutIds], "PRUNING");

  const pruningIds = new Set([...cohortIds, ...prunedOutIds]);

  if (
    pruningIds.size !== survivorIds.length ||
    survivorIds.some((id) => !pruningIds.has(id))
  ) {
    throw new Error("ARKI_REGISTRY_PRUNING_PARTITION_INCOMPLETE");
  }

  if (
    input.pruningCriteria.totalBefore !== input.survivors.length ||
    input.pruningCriteria.totalAfter !== 25
  ) {
    throw new Error("ARKI_REGISTRY_PRUNING_CRITERIA_MISMATCH");
  }

  for (const candidate of input.generatedCandidates) {
    if (candidate.generationId !== input.generationId) {
      throw new Error(`ARKI_REGISTRY_GENERATION_MISMATCH:${candidate.id}`);
    }
  }

  const completeCohort = input.cohort.map((candidate) => {
    if (candidate.generationId !== input.generationId) {
      throw new Error(`ARKI_REGISTRY_COHORT_GENERATION_MISMATCH:${candidate.id}`);
    }

    const sourceProposal = input.sourceProposalsByCandidateId[candidate.id];

    if (
      !sourceProposal ||
      typeof sourceProposal !== "object" ||
      Array.isArray(sourceProposal) ||
      sourceProposal.candidateId !== candidate.id ||
      sourceProposal.generationId !== input.generationId ||
      !sourceProposal.building ||
      !sourceProposal.geometry ||
      !sourceProposal.metrics ||
      !sourceProposal.validation ||
      !sourceProposal.agkCompilation
    ) {
      throw new Error(`ARKI_REGISTRY_SOURCE_EXPEDIENT_INCOMPLETE:${candidate.id}`);
    }

    return { candidate, sourceProposal };
  });

  if (completeCohort.length !== 25) {
    throw new Error("ARKI_REGISTRY_COMPLETE_EXPEDIENTS_MUST_BE_25");
  }

  const registry: PrunedRegistry = {
    schema: "ARKI-FUNNEL-COHORT-REGISTRY-2.1",
    generationId: input.generationId,
    createdAt: new Date().toISOString(),
    generateCount: input.generateCount,
    funnelCount: 25,

    generated: {
      count: input.generatedCandidates.length,
      candidates: input.generatedCandidates.map((c) => ({
        candidateId: c.id,
        generationId: c.generationId,
        status: c.status,
        strategy: c.strategy,
        ...(c.variantId ? { variantId: c.variantId } : {}),
        ...(c.shapeType ? { shapeType: c.shapeType } : {}),
      })),
    },

    screening: {
      survivorsCount: survivorIds.length,
      survivorIds,
      archivedCount: archivedIds.length,
      archived: input.archived,
      heldCount: heldIds.length,
      held: input.held,
    },

    pruning: {
      method: "DIVERSITY_ROUND_ROBIN",
      totalBefore: input.pruningCriteria.totalBefore,
      totalAfter: input.pruningCriteria.totalAfter,
      byStrategy: input.pruningCriteria.byStrategy,
      byDiversityKey: input.pruningCriteria.byDiversityKey,
      cohortCandidateIds: cohortIds,
      prunedOutCandidateIds: prunedOutIds,
    },

    // No se serializan expedientes completos de las otras propuestas.
    candidates: completeCohort,
  };

  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  const filePath = resolve(
    dataDirectory,
    `pruned-${input.generationId}.json`,
  );

  // No sobrescribir una generación existente.
  writeFileSync(
    filePath,
    JSON.stringify(registry, null, 2),
    { encoding: "utf-8", flag: "wx" },
  );

  return filePath;
}
