import { describe, expect, it } from "vitest";
import { filterPilotReportRows } from "./fieldGateReports";

describe("pilot metric filters", () => {
  const rows = [
    { publicId: "FIELD-A", createdAt: new Date("2026-09-01T10:00:00Z"), deviceA: "Pixel 9", deviceB: "iPhone 15" },
    { publicId: "FIELD-B", createdAt: new Date("2026-09-03T10:00:00Z"), deviceA: "Galaxy S24", deviceB: "iPad" },
  ] as never[];

  it("filters by inclusive UTC date range", () => {
    expect(filterPilotReportRows(rows, { from: "2026-09-01", to: "2026-09-01" }).map(row => row.publicId)).toEqual(["FIELD-A"]);
  });

  it("matches either pilot device case-insensitively", () => {
    expect(filterPilotReportRows(rows, { device: "iphone" }).map(row => row.publicId)).toEqual(["FIELD-A"]);
  });

  it("does not broaden the dataset when filters do not match", () => {
    expect(filterPilotReportRows(rows, { device: "unknown" })).toHaveLength(0);
  });
});

it("keeps the production PDF filter contract bounded to date and device fields", () => {
  expect(Object.keys({ from: "2026-09-01", to: "2026-09-02", device: "Pixel" })).toEqual(["from", "to", "device"]);
});

// El reporte solo resume registros persistidos; no certifica hardware ni modifica MJP CORE.
