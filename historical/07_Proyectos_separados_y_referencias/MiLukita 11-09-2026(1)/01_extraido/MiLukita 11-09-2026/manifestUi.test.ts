import { describe, expect, it } from "vitest";
import { describeManifestChange, getManifestConnectionState } from "./manifestUi";

describe("manifest UI state", () => {
  it("distingue carga, conexión y desconexión", () => {
    expect(getManifestConnectionState({ isLoading: true, isError: false, hasManifest: false })).toBe("loading");
    expect(getManifestConnectionState({ isLoading: false, isError: false, hasManifest: true })).toBe("connected");
    expect(getManifestConnectionState({ isLoading: false, isError: true, hasManifest: false })).toBe("disconnected");
  });

  it("notifica una actualización solo cuando cambia la secuencia", () => {
    const previous = { sequence: 10, event: { eventId: "ROUND-1", gameName: "Lotería 39", status: "OPEN" as const } };
    expect(describeManifestChange(previous, previous)).toBeNull();
    expect(describeManifestChange(previous, { ...previous, sequence: 11, event: { ...previous.event, status: "LOCKED" } })).toMatchObject({ kind: "update", title: "Manifest actualizado" });
  });

  it("distingue una nueva ronda de una actualización de estado", () => {
    const previous = { sequence: 10, event: { eventId: "ROUND-1", gameName: "Lotería 39", status: "OPEN" as const } };
    const next = { sequence: 20, event: { eventId: "ROUND-2", gameName: "Bingo Rápido", status: "OPEN" as const } };
    expect(describeManifestChange(previous, next)).toMatchObject({ kind: "round", title: "Nueva ronda disponible" });
  });
});
