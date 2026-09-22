import { createServer } from "node:http";
import { describe, expect, it } from "vitest";
import WebSocket from "ws";
import { attachParametricWebSocket, publishCollaborativeCursor, publishParametricEvent } from "./parametricRealtime";

describe("parametric realtime", () => {
  it("subscribes by project and receives governed progress events", async () => {
    const server = createServer();
    attachParametricWebSocket(server);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("server did not bind");
    const socket = new WebSocket(`ws://127.0.0.1:${address.port}/ws/parametric`);
    const messages: Array<Record<string, unknown>> = [];
    await new Promise<void>((resolve, reject) => {
      socket.on("open", () => socket.send(JSON.stringify({ type: "subscribe", channel: "project:TEST-001" })));
      socket.on("message", (raw) => { messages.push(JSON.parse(raw.toString())); if (messages.length === 1) { publishParametricEvent("project:TEST-001", { type: "REVIEW_REQUIRED", projectId: "TEST-001", progress: 80, message: "Review", humanReviewRequired: true, at: new Date().toISOString() }); } if (messages.length === 2) resolve(); });
      socket.on("error", reject);
    });
    expect(messages[0]).toMatchObject({ type: "VALIDATION_PROGRESS", progress: 0 });
    expect(messages[1]).toMatchObject({ type: "REVIEW_REQUIRED", projectId: "TEST-001", humanReviewRequired: true });
    socket.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("validates ephemeral collaborative cursor updates", () => {
    expect(publishCollaborativeCursor("project:TEST-001", { projectId: "TEST-001", participantId: "user-1", x: 10, y: 20 })).toBe(true);
    expect(publishCollaborativeCursor("project:TEST-001", { projectId: "TEST-001", participantId: "user-1", x: Number.NaN, y: 20 })).toBe(false);
  });
});
