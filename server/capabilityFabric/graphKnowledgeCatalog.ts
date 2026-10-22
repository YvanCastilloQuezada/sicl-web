import { createHash } from "node:crypto";
import type { EnrichedArkiGraph } from "./enrichedParametricGraph";

export type GraphKnowledgeRecord = {
  knowledgeId: string;
  graphId: string;
  fingerprint: string;
  enrichmentContract: "ARKI-ENRICHED-GRAPH-1.0";
  capabilities: readonly string[];
  intents: readonly string[];
  scales: readonly string[];
  sourceArtifacts: readonly string[];
  exposedInterfaces: readonly {
    capsuleId: string;
    inputs: readonly string[];
    outputs: readonly string[];
  }[];
  canonicalMutation: false;
};

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function indexEnrichedGraph(graph: EnrichedArkiGraph): GraphKnowledgeRecord {
  const fingerprint = `sha256:${createHash("sha256").update(stable(graph)).digest("hex")}`;
  const unique = (values: string[]) => Array.from(new Set(values)).sort();
  return {
    knowledgeId: `graph-knowledge:${fingerprint.slice(7, 23)}`,
    graphId: graph.graph.graphId,
    fingerprint,
    enrichmentContract: "ARKI-ENRICHED-GRAPH-1.0",
    capabilities: unique(graph.capsules.map(capsule => capsule.capability)),
    intents: unique(graph.capsules.map(capsule => capsule.intent)),
    scales: unique(graph.capsules.flatMap(capsule => [...capsule.scales])),
    sourceArtifacts: unique(graph.capsules.map(capsule => capsule.sourceArtifact).filter((value): value is string => Boolean(value))),
    exposedInterfaces: graph.capsules.map(capsule => ({
      capsuleId: capsule.capsuleId,
      inputs: capsule.exposedPorts.filter(port => port.role === "INPUT").map(port => port.name),
      outputs: capsule.exposedPorts.filter(port => port.role === "OUTPUT").map(port => port.name),
    })),
    canonicalMutation: false,
  };
}
