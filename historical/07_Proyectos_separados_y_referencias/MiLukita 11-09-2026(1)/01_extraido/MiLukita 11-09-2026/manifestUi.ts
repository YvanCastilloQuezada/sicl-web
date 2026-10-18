import type { MjpTvManifest } from "./tvManifest";

export type ManifestConnectionState = "loading" | "connected" | "disconnected";
export type ManifestNotice = { kind: "update" | "round"; title: string; detail: string };

type ManifestSnapshot = Pick<MjpTvManifest, "sequence"> & { event: Pick<MjpTvManifest["event"], "eventId" | "gameName" | "status"> };

export function getManifestConnectionState(input: { isLoading: boolean; isError: boolean; hasManifest: boolean }): ManifestConnectionState {
  if (input.isLoading && !input.hasManifest) return "loading";
  if (input.isError || !input.hasManifest) return "disconnected";
  return "connected";
}

export function describeManifestChange(previous: ManifestSnapshot | null, current: ManifestSnapshot): ManifestNotice | null {
  if (!previous || (previous.sequence === current.sequence && previous.event.eventId === current.event.eventId)) return null;
  const isNewRound = previous.event.eventId !== current.event.eventId;
  return isNewRound ? { kind: "round", title: "Nueva ronda disponible", detail: `${current.event.gameName} ya está sincronizada con el canal.` } : { kind: "update", title: "Manifest actualizado", detail: `El estado ${current.event.status} de ${current.event.gameName} fue actualizado desde MJP Core.` };
}
