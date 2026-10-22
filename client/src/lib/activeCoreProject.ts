import { siclClient } from "@/api/sicl-client";

const KEY = "arki.activeCoreProjectId";
export function getActiveCoreProjectId(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("project") || window.localStorage.getItem(KEY) || "";
}
export function setActiveCoreProjectId(id: string): void {
  if (typeof window !== "undefined" && id) window.localStorage.setItem(KEY, id);
}
export async function resolveActiveCoreProjectId(): Promise<string> {
  const projects = await siclClient.listProjects();
  const current = getActiveCoreProjectId();
  if (current && projects.some((project) => project.project_id === current)) {
    setActiveCoreProjectId(current);
    return current;
  }
  const selected = projects.find((project) => project.project_id !== "ARKI-SYSTEM");
  if (!selected) return "";
  setActiveCoreProjectId(selected.project_id);
  return selected.project_id;
}
