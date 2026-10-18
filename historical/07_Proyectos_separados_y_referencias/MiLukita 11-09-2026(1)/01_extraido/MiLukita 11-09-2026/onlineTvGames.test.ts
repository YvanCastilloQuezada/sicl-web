import { describe, expect, it } from "vitest";
import { createOnlineTvSession, getOnlineTvSession, submitOnlineTvAction } from "./onlineTvGames";
import { buildOnlineTvManifest } from "../shared/tvManifest";

describe("online TV games", () => {
  it("valida trivia en el servidor y cierra tras una respuesta correcta", () => {
    const session = createOnlineTvSession("TRIVIA", 1_000);
    const result = submitOnlineTvAction(session.sessionId, { type: "TRIVIA", answerIndex: 1 }, 2_000);
    expect(result.accepted).toBe(true);
    expect(result.session.phase).toBe("RESULT");
  });
  it("rechaza combinaciones incorrectas sin otorgar puntos", () => {
    const session = createOnlineTvSession("COMBINATION", 1_000);
    const result = submitOnlineTvAction(session.sessionId, { type: "COMBINATION", values: ["ROJO"] }, 2_000);
    expect(result.accepted).toBe(false);
    expect(result.scoreDelta).toBe(0);
    expect(getOnlineTvSession(session.sessionId)?.phase).toBe("ACTIVE");
  });
  it("acumula progreso cooperativo con límite de umbral", () => {
    const session = createOnlineTvSession("TEAM_SCORE", 1_000);
    const first = submitOnlineTvAction(session.sessionId, { type: "TEAM_SCORE", points: 100 }, 2_000);
    expect(first.accepted).toBe(true);
    expect(first.session.phase).toBe("RESULT");
    expect(first.session.progress).toBe(100);
  });
  it("valida Semáforo, Intruso y Código Cooperativo en el servidor", () => {
    const traffic = createOnlineTvSession("TRAFFIC_LIGHT", "HARD", 1_000);
    expect(submitOnlineTvAction(traffic.sessionId, { type: "TRAFFIC_LIGHT", signal: "GO" }, 2_000).accepted).toBe(true);
    const odd = createOnlineTvSession("ODD_ONE_OUT", "STANDARD", 1_000);
    expect(submitOnlineTvAction(odd.sessionId, { type: "ODD_ONE_OUT", index: 6 }, 2_000).accepted).toBe(true);
    const coop = createOnlineTvSession("COOP_CODE", "STANDARD", 1_000);
    expect(submitOnlineTvAction(coop.sessionId, { type: "COOP_CODE", fragment: "LU" }, 2_000).accepted).toBe(true);
    expect(submitOnlineTvAction(coop.sessionId, { type: "COOP_CODE", fragment: "LU" }, 2_100).accepted).toBe(false);
  });
  it("expone dificultad, versión de contenido y progreso en el manifest", () => {
    const session = createOnlineTvSession("TRAFFIC_LIGHT", "HARD", 1_000);
    const manifest = buildOnlineTvManifest(session, "1970-01-01T00:00:02.000Z", 7);
    expect(manifest.onlineTv?.difficulty).toBe("HARD");
    expect(manifest.onlineTv?.contentVersion).toBe("online-tv-content-v1");
    expect(manifest.event.gameId).toBe("ONLINE_TRAFFIC_LIGHT");
    expect(manifest.source.authoritative).toBe(true);
  });
  it("impide aportes negativos o superiores al máximo del contrato", () => {
    const session = createOnlineTvSession("TEAM_SCORE", 1_000);
    const result = submitOnlineTvAction(session.sessionId, { type: "TEAM_SCORE", points: -1 }, 2_000);
    expect(result.accepted).toBe(false);
    expect(result.scoreDelta).toBe(0);
  });
});
