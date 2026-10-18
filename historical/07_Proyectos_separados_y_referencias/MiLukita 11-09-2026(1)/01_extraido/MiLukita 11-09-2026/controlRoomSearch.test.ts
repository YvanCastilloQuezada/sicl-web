import { describe, expect, it } from "vitest";
import { matchesControlRoomSearch } from "./controlRoomSearch";

describe("Control Room search contract", () => {
  it("matches every record when the query is empty", () => {
    expect(matchesControlRoomSearch("   ", ["evento", "agente"])).toBe(true);
  });

  it("matches text without depending on case or surrounding whitespace", () => {
    expect(matchesControlRoomSearch("  WATCHDOG ", ["Watchdog", "PASS"])).toBe(true);
    expect(matchesControlRoomSearch("qr-42", ["evento", "QR-420"])).toBe(true);
  });

  it("returns false when none of the searchable values contain the query", () => {
    expect(matchesControlRoomSearch("revenue", ["Watchdog", "PASS", null])).toBe(false);
  });
});
