import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const beaconSource = readFileSync(resolve(process.cwd(), "client/src/components/ProductAnalyticsBeacon.tsx"), "utf8");

describe("ProductAnalyticsBeacon request stability", () => {
  it("depends on the stable mutate function instead of the whole mutation result", () => {
    expect(beaconSource).toContain("const { mutate: recordEvent } = trpc.operations.recordProductEvent.useMutation();");
    expect(beaconSource).toContain("recordEvent(event, {");
    expect(beaconSource).toContain("[isAuthenticated, recordEvent]");
    expect(beaconSource).not.toContain("[isAuthenticated, record]");
  });
});
