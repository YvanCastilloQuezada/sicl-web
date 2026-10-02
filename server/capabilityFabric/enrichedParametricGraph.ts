import type { ParametricGraphIR } from "./parametricGraphIr";

export type ArkiGraphScale = "COMPONENT" | "BUILDING" | "CAMPUS_PARK" | "URBAN";
export type ArkiGraphOrigin = "ARKI_NATIVE" | "DYNAMO_HARVEST" | "GRASSHOPPER_HARVEST" | "RESEARCH_HARVEST";

export type ArkiGraphPort = {
  name: string;
  role: "INPUT" | "OUTPUT";
  dataType: string;
  required: boolean;
  architecturalMeaning: string;
};

export type ArkiGraphCapsule = {
  capsuleId: string;
  label: string;
  capability: string;
  intent: string;
  scales: readonly ArkiGraphScale[];
  exposedPorts: readonly ArkiGraphPort[];
  memberNodeIds: readonly string[];
  sourceArtifact: string | null;
  origin: ArkiGraphOrigin;
  constraints: readonly string[];
  executionCandidates: readonly string[];
  semanticStatus: "DESCRIPTIVE_PROPOSAL";
};

export type EnrichedArkiGraph = {
  contractVersion: "ARKI-ENRICHED-GRAPH-1.0";
  graph: ParametricGraphIR;
  capsules: readonly ArkiGraphCapsule[];
  transformations: readonly {
    kind: "IMPORT" | "NORMALIZE" | "ENRICH" | "CAPSULIZE" | "GENERATE";
    statement: string;
  }[];
  authority: {
    computationalGraph: "ARKI_GRAPH_IR";
    architecturalMeaning: "D2";
    operationalGeometry: "AGK";
    canonicalMutation: false;
  };
};

export function enrichParametricGraph(input: {
  graph: ParametricGraphIR;
  capsules: readonly ArkiGraphCapsule[];
  originStatement: string;
}): EnrichedArkiGraph {
  const nodeIds = new Set(input.graph.nodes.map((node: ParametricGraphIR["nodes"][number]) => node.id));
  const capsuleIds = new Set<string>();
  for (const capsule of input.capsules) {
    if (capsuleIds.has(capsule.capsuleId)) throw new Error(`DUPLICATE_CAPSULE_ID:${capsule.capsuleId}`);
    capsuleIds.add(capsule.capsuleId);
    if (capsule.memberNodeIds.length === 0) throw new Error(`EMPTY_CAPSULE:${capsule.capsuleId}`);
    for (const nodeId of capsule.memberNodeIds) {
      if (!nodeIds.has(nodeId)) throw new Error(`CAPSULE_NODE_NOT_FOUND:${nodeId}`);
    }
    if (!capsule.exposedPorts.some(port => port.role === "OUTPUT")) {
      throw new Error(`CAPSULE_OUTPUT_REQUIRED:${capsule.capsuleId}`);
    }
    if (capsule.semanticStatus !== "DESCRIPTIVE_PROPOSAL") {
      throw new Error(`CAPSULE_CANNOT_ASSERT_D2_TRUTH:${capsule.capsuleId}`);
    }
  }
  return {
    contractVersion: "ARKI-ENRICHED-GRAPH-1.0",
    graph: input.graph,
    capsules: [...input.capsules],
    transformations: [
      { kind: "IMPORT", statement: input.originStatement },
      { kind: "NORMALIZE", statement: "External node/wire structure normalized to ARKI-GRAPH-IR-1.0." },
      { kind: "ENRICH", statement: "Architectural intent, scale, constraints, capability and execution candidates attached without asserting D-2 truth." },
      { kind: "CAPSULIZE", statement: "Complex subgraphs may expose a minimal stable interface while preserving internal nodes and edges." },
    ],
    authority: {
      computationalGraph: "ARKI_GRAPH_IR",
      architecturalMeaning: "D2",
      operationalGeometry: "AGK",
      canonicalMutation: false,
    },
  };
}
