export type Activity4D = { id: string; name: string; durationDays: number; elementIds: string[]; predecessors: string[] };
export type Schedule4D = { activities: Activity4D[]; criticalPath: string[]; durationDays: number };

export function calculateSchedule4D(activities: Activity4D[]): Schedule4D {
  const byId = new Map(activities.map((activity) => [activity.id, activity]));
  const memo = new Map<string, number>();
  const visiting = new Set<string>();
  const finish = (id: string): number => {
    const cached = memo.get(id); if (cached !== undefined) return cached;
    if (visiting.has(id)) throw new Error(`Schedule cycle detected at ${id}`);
    const activity = byId.get(id); if (!activity) throw new Error(`Missing predecessor: ${id}`);
    visiting.add(id);
    const start = activity.predecessors.reduce((max, predecessor) => Math.max(max, finish(predecessor)), 0);
    const result = start + activity.durationDays;
    visiting.delete(id); memo.set(id, result); return result;
  };
  let durationDays = 0; let endId = "";
  for (const activity of activities) { const end = finish(activity.id); if (end > durationDays) { durationDays = end; endId = activity.id; } }
  const criticalPath: string[] = [];
  while (endId) { criticalPath.unshift(endId); const activity = byId.get(endId); if (!activity) break; endId = activity.predecessors.slice().sort((left, right) => finish(right) - finish(left))[0] ?? ""; }
  return { activities, criticalPath, durationDays };
}
