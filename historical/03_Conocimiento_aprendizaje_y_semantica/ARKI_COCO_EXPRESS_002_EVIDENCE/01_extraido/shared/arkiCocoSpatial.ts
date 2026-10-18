export type GraphNodeId = string;
export type WeightedEdge = Readonly<{ from: GraphNodeId; to: GraphNodeId; weight?: number }>;
export type Graph = Readonly<{ nodes: readonly GraphNodeId[]; edges: readonly WeightedEdge[]; directed?: boolean }>;

const adjacency = (graph: Graph) => {
  const map = new Map<GraphNodeId, Array<{ id: GraphNodeId; weight: number }>>();
  for (const node of graph.nodes) map.set(node, []);
  for (const edge of graph.edges) {
    if (!map.has(edge.from) || !map.has(edge.to)) continue;
    map.get(edge.from)!.push({ id: edge.to, weight: edge.weight ?? 1 });
    if (!graph.directed) map.get(edge.to)!.push({ id: edge.from, weight: edge.weight ?? 1 });
  }
  return map;
};

export const bfs = (graph: Graph, start: GraphNodeId): GraphNodeId[] => {
  if (!graph.nodes.includes(start)) return [];
  const next = adjacency(graph); const seen = new Set([start]); const queue = [start]; const order: string[] = [];
  while (queue.length) { const node = queue.shift()!; order.push(node); for (const item of next.get(node) ?? []) if (!seen.has(item.id)) { seen.add(item.id); queue.push(item.id); } }
  return order;
};

export const dfs = (graph: Graph, start: GraphNodeId): GraphNodeId[] => {
  if (!graph.nodes.includes(start)) return [];
  const next = adjacency(graph); const seen = new Set<string>(); const order: string[] = [];
  const visit = (node: string) => { if (seen.has(node)) return; seen.add(node); order.push(node); for (const item of next.get(node) ?? []) visit(item.id); };
  visit(start); return order;
};

export const connectedComponents = (graph: Graph): GraphNodeId[][] => {
  const next = adjacency(graph); const seen = new Set<string>(); const result: string[][] = [];
  for (const node of graph.nodes) if (!seen.has(node)) { const component: string[] = []; const queue = [node]; seen.add(node); while (queue.length) { const current = queue.shift()!; component.push(current); for (const item of next.get(current) ?? []) if (!seen.has(item.id)) { seen.add(item.id); queue.push(item.id); } } result.push(component); }
  return result;
};

export const shortestPath = (graph: Graph, start: string, goal: string): { distance: number; path: string[]; status: "FOUND" | "UNREACHABLE" | "UNKNOWN" } => {
  if (!graph.nodes.includes(start) || !graph.nodes.includes(goal)) return { distance: Number.POSITIVE_INFINITY, path: [], status: "UNKNOWN" };
  const next = adjacency(graph); const distances = new Map(graph.nodes.map((node) => [node, Number.POSITIVE_INFINITY])); const previous = new Map<string, string>(); const open = new Set(graph.nodes); distances.set(start, 0);
  while (open.size) { let current: string | undefined; for (const node of Array.from(open)) if (current === undefined || distances.get(node)! < distances.get(current)!) current = node; if (!current || distances.get(current) === Number.POSITIVE_INFINITY) break; open.delete(current); if (current === goal) break; for (const item of next.get(current) ?? []) { const candidate = distances.get(current)! + item.weight; if (candidate < distances.get(item.id)!) { distances.set(item.id, candidate); previous.set(item.id, current); } } }
  const distance = distances.get(goal)!; if (!Number.isFinite(distance)) return { distance, path: [], status: "UNREACHABLE" };
  const path = [goal]; while (path[0] !== start) path.unshift(previous.get(path[0])!); return { distance, path, status: "FOUND" };
};

export const hasCycle = (graph: Graph): boolean => {
  const next = adjacency(graph); const visiting = new Set<string>(); const visited = new Set<string>();
  const visit = (node: string): boolean => { if (visiting.has(node)) return true; if (visited.has(node)) return false; visiting.add(node); for (const item of next.get(node) ?? []) if (visit(item.id)) return true; visiting.delete(node); visited.add(node); return false; };
  return graph.nodes.some(visit);
};

export const degree = (graph: Graph, node: string) => (adjacency(graph).get(node) ?? []).length;
export const normalizedDegree = (graph: Graph, node: string) => graph.nodes.length <= 1 ? 0 : degree(graph, node) / (graph.nodes.length - 1);
export const graphFingerprint = (graph: Graph) => JSON.stringify({ nodes: [...graph.nodes].sort(), edges: graph.edges.map((edge) => `${edge.from}>${edge.to}:${edge.weight ?? 1}`).sort(), directed: Boolean(graph.directed) });
