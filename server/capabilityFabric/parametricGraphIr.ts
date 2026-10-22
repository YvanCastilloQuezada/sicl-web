import type { ParametricGraph } from "../arkiParametricRuntime";

export type ParametricGraphEdge = {
  fromNodeId: string;
  fromPort: "result";
  toNodeId: string;
  toPort: string;
};

export type ParametricGraphIR = {
  contractVersion: "ARKI-GRAPH-IR-1.0";
  graphId: string;
  nodes: ParametricGraph["nodes"];
  edges: ParametricGraphEdge[];
  outputs: string[];
  units: string;
  tolerance: number;
  provenance: {
    sourceFormat: "ARKI_GRAPH" | "DYNAMO" | "GRASSHOPPER" | "HARVESTED_ROUTINE";
    sourceArtifact?: string;
  };
};

export function compileParametricGraphIR(
  graph: ParametricGraph,
  provenance: ParametricGraphIR["provenance"] = { sourceFormat: "ARKI_GRAPH" },
): ParametricGraphIR {
  const nodeIds = new Set(graph.nodes.map(node => node.id));
  const edges: ParametricGraphEdge[] = [];
  for (const node of graph.nodes) {
    for (const [port, value] of Object.entries(node.params)) {
      if (typeof value !== "string" || !value.startsWith("$")) continue;
      const fromNodeId = value.slice(1);
      if (!nodeIds.has(fromNodeId)) throw new Error(`GRAPH_REFERENCE_NOT_FOUND:${fromNodeId}`);
      edges.push({ fromNodeId, fromPort: "result", toNodeId: node.id, toPort: port });
    }
  }
  edges.sort((a, b) =>
    a.fromNodeId.localeCompare(b.fromNodeId) ||
    a.toNodeId.localeCompare(b.toNodeId) ||
    a.toPort.localeCompare(b.toPort),
  );
  return {
    contractVersion: "ARKI-GRAPH-IR-1.0",
    graphId: graph.graphId,
    nodes: graph.nodes,
    edges,
    outputs: [...graph.outputs],
    units: graph.units,
    tolerance: graph.tolerance,
    provenance,
  };
}
