import type { SceneModel, SceneNode } from "./arkiSceneModel";

export type SceneComparison = {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
};

function signature(node: SceneNode): string {
  return [node.kind, node.level, ...node.position, ...node.dimensions, node.rotationY, node.color, node.opacity].join("|");
}

export function compareSceneModels(reference: SceneModel, current: SceneModel): SceneComparison {
  const referenceMap = new Map(reference.nodes.map((node) => [node.id, node]));
  const currentMap = new Map(current.nodes.map((node) => [node.id, node]));
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];
  const unchanged: string[] = [];
  for (const [id, node] of Array.from(currentMap.entries())) {
    const previous = referenceMap.get(id);
    if (!previous) added.push(id);
    else if (signature(previous) === signature(node)) unchanged.push(id);
    else modified.push(id);
  }
  for (const id of Array.from(referenceMap.keys())) if (!currentMap.has(id)) removed.push(id);
  return { added: added.sort(), removed: removed.sort(), modified: modified.sort(), unchanged: unchanged.sort() };
}
