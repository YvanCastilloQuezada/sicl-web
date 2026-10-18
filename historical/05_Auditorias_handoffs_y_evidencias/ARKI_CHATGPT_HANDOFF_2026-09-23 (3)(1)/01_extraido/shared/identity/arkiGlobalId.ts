import type { SceneNode } from "../arkiSceneModel";

export type GlobalIdMapping = { archiElementId: string; globalId: string; projectId: string; versionNumber: number };

function bytesToHex(bytes: Uint8Array): string { return Array.from(bytes).map((value) => value.toString(16).padStart(2, "0")).join(""); }

export async function deterministicGlobalId(archiElementId: string, projectId: string, versionNumber: number): Promise<string> {
  const payload = new TextEncoder().encode(`${archiElementId}|${projectId}|${versionNumber}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return bytesToHex(new Uint8Array(digest)).slice(0, 22).toUpperCase();
}

export async function mapSceneNodeIdentity(node: SceneNode, projectId: string, versionNumber: number): Promise<GlobalIdMapping> {
  return { archiElementId: node.id, globalId: await deterministicGlobalId(node.id, projectId, versionNumber), projectId, versionNumber };
}

export async function mapSceneIdentities(nodes: SceneNode[], projectId: string, versionNumber: number): Promise<GlobalIdMapping[]> {
  return Promise.all(nodes.map((node) => mapSceneNodeIdentity(node, projectId, versionNumber)));
}
