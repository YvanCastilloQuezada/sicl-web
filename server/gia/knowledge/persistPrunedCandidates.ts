/**
 * Persiste las 25 pruned (o N) en un archivo JSON versionado.
 *
 * El registro permite rastrear las ideas después de la poda:
 * - Qué candidato
 * - Qué métricas
 * - Qué evidencia
 * - Qué provenance
 * - Qué criterio de poda lo seleccionó
 *
 * Los archivos se guardan en data/arki-funnel/pruned-{generationId}.json.
 * Son append-only: una vez escrito, no se reescribe.
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";

export type PersistedPrunedCandidate = {
  candidateId: string;
  generationId: string;
  title: string;
  strategy: string;
  metrics: Record<string, number | string>;
  epistemic: DesignCandidate["epistemic"];
  evidence: string[];
  unknowns: string[];
  failureReasons: string[];
  provenance: string[];
};

export type PrunedRegistry = {
  schema: "ARKI-FUNNEL-PRUNED-REGISTRY-1.0";
  generationId: string;
  createdAt: string;
  funnelCount: number;
  generateCount: number;
  survivorsCount: number;
  archivedCount: number;
  pruningCriteria: {
    totalBefore: number;
    totalAfter: number;
    byStrategy: Record<string, number>;
  };
  candidates: PersistedPrunedCandidate[];
};

const DATA_DIR = resolve(process.cwd(), "data", "arki-funnel");

export function persistPrunedCandidates(input: {
  generationId: string;
  funnelCount: number;
  generateCount: number;
  survivorsCount: number;
  archivedCount: number;
  pruningCriteria: {
    totalBefore: number;
    totalAfter: number;
    byStrategy: Record<string, number>;
  };
  pruned: DesignCandidate[];
}): string {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  const registry: PrunedRegistry = {
    schema: "ARKI-FUNNEL-PRUNED-REGISTRY-1.0",
    generationId: input.generationId,
    createdAt: new Date().toISOString(),
    funnelCount: input.funnelCount,
    generateCount: input.generateCount,
    survivorsCount: input.survivorsCount,
    archivedCount: input.archivedCount,
    pruningCriteria: input.pruningCriteria,
    candidates: input.pruned.map((c) => ({
      candidateId: c.id,
      generationId: c.generationId,
      title: c.title,
      strategy: c.strategy,
      metrics: c.metrics,
      epistemic: c.epistemic,
      evidence: c.evidence,
      unknowns: c.unknowns,
      failureReasons: c.failureReasons,
      provenance: c.provenance,
    })),
  };

  const filePath = resolve(DATA_DIR, `pruned-${input.generationId}.json`);
  writeFileSync(filePath, JSON.stringify(registry, null, 2), "utf-8");
  return filePath;
}
