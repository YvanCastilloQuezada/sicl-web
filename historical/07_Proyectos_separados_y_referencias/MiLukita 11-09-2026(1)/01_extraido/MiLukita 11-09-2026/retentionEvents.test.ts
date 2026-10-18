import { describe, expect, it } from "vitest";
import { buildRetentionEvents } from "./retentionEvents";

describe("retention event plan", () => {
  it("emits a return event after a previous active day", () => {
    const events = buildRetentionEvents({ sessionId: "sess-test-123", day: "2026-08-25", pathname: "/juegos/loteria_39", roundId: "RP-L-1", lastActiveDay: "2026-08-24", lastSecondaryScreenDay: "2026-08-24" });
    expect(events.map((event) => event.eventType)).toEqual(["session_started", "session_returned", "secondary_screen_returned"]);
    expect(events[2]?.payload).toMatchObject({ roundId: "RP-L-1", entry: "tv_qr" });
  });
  it("does not record a secondary-screen event without a QR round", () => {
    const events = buildRetentionEvents({ sessionId: "sess-test-123", day: "2026-08-25", pathname: "/juegos/loteria_39", roundId: null, lastActiveDay: null, lastSecondaryScreenDay: null });
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe("session_started");
  });
});
