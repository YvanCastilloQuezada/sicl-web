export type Vec3 = Readonly<[number, number, number]>;
export type Transform = Readonly<{ position: Vec3; scale: Vec3; rotation: Vec3 }>;
export type SceneNode = Readonly<{ id: string; parentId?: string; meshId?: string; transform: Transform }>;
export type AvatarAsset = Readonly<{ id: string; format: "GLTF" | "GLB"; nodes: readonly SceneNode[]; meshes: readonly string[]; materials: readonly string[]; animations: readonly AnimationClip[]; provenance: Readonly<{ source: string; evidenceRefs: readonly string[] }> }>;
export type AnimationClip = Readonly<{ id: string; duration: number; tracks: readonly string[] }>;
export type DeviceCommand = Readonly<{ id: string; intent: "IDLE" | "WALK" | "POINT" | "GESTURE" | "LISTEN" | "SPEAK"; issuedAt: string }>;
export type DeviceObservation = Readonly<{ commandId: string; observed: boolean; timestamp: string; source: string; confidence: number }>;
export type PerceptionObservation = Readonly<{ source: string; timestamp: string; confidence: number; kind: "OCR" | "OBJECT" | "POSE" | "DEPTH"; value: string; evidenceRef?: string }>;

const multiply = (a: Transform, b: Transform): Transform => ({ position: [a.position[0] + b.position[0], a.position[1] + b.position[1], a.position[2] + b.position[2]], scale: [a.scale[0] * b.scale[0], a.scale[1] * b.scale[1], a.scale[2] * b.scale[2]], rotation: [a.rotation[0] + b.rotation[0], a.rotation[1] + b.rotation[1], a.rotation[2] + b.rotation[2]] });
export const worldTransform = (nodeId: string, nodes: readonly SceneNode[]): Transform | undefined => {
  const byId = new Map(nodes.map((node) => [node.id, node])); const seen = new Set<string>(); let current = byId.get(nodeId); if (!current) return undefined; let result: Transform = { position: [0, 0, 0], scale: [1, 1, 1], rotation: [0, 0, 0] };
  while (current) { if (seen.has(current.id)) return undefined; seen.add(current.id); result = multiply(current.transform, result); current = current.parentId ? byId.get(current.parentId) : undefined; }
  return result;
};
export const validateAvatarAsset = (asset: AvatarAsset): string[] => { const errors: string[] = []; const ids = new Set<string>(); for (const node of asset.nodes) { if (ids.has(node.id)) errors.push(`DUPLICATE_NODE:${node.id}`); ids.add(node.id); if (node.parentId && node.parentId === node.id) errors.push(`SELF_PARENT:${node.id}`); } for (const clip of asset.animations) if (clip.duration <= 0) errors.push(`INVALID_DURATION:${clip.id}`); return errors; };
export const commandResult = (command: DeviceCommand, observations: readonly DeviceObservation[]) => observations.find((item) => item.commandId === command.id) ?? { commandId: command.id, observed: false, timestamp: "UNKNOWN", source: "UNKNOWN", confidence: 0 };
export const perceptionIsEvidence = (observation: PerceptionObservation) => Boolean(observation.evidenceRef) && observation.confidence >= 0 && observation.confidence <= 1;
