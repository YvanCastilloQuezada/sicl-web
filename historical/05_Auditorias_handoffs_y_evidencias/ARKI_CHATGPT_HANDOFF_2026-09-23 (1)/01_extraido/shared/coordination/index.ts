export type CoordinationNode = { id: string; discipline: string; position: [number, number, number]; dimensions: [number, number, number] };
export type Clash = { id: string; leftId: string; rightId: string; disciplines: [string, string]; intersectionVolume: number; severity: "low" | "medium" | "high"; status: "open" | "reviewed" | "accepted" | "resolved" | "rejected" };

function overlap(a: number, ad: number, b: number, bd: number, tolerance: number): number { return Math.max(0, Math.min(a + ad / 2, b + bd / 2) - Math.max(a - ad / 2, b - bd / 2) - tolerance); }
export function detectClashes(nodes: CoordinationNode[], tolerance = 0.001): Clash[] {
  const clashes: Clash[] = [];
  for (let i = 0; i < nodes.length; i += 1) for (let j = i + 1; j < nodes.length; j += 1) {
    const left = nodes[i]; const right = nodes[j]; if (left.discipline === right.discipline) continue;
    const volume = overlap(left.position[0], left.dimensions[0], right.position[0], right.dimensions[0], tolerance) * overlap(left.position[1], left.dimensions[1], right.position[1], right.dimensions[1], tolerance) * overlap(left.position[2], left.dimensions[2], right.position[2], right.dimensions[2], tolerance);
    if (volume > 0) clashes.push({ id: `clash:${left.id}:${right.id}`, leftId: left.id, rightId: right.id, disciplines: [left.discipline, right.discipline], intersectionVolume: Number(volume.toFixed(6)), severity: volume > 1 ? "high" : volume > 0.1 ? "medium" : "low", status: "open" });
  }
  return clashes;
}
