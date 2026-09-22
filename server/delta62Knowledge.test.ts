import { describe, expect, it } from "vitest";
import { DELTA_62_FORMAT_VERSION, makeDelta62LucaSeed, partitionDelta62Records, validateDelta62Record } from "../shared/delta62Knowledge";

describe("Delta 6.2 federated knowledge", () => {
  it("validates LUCA-specific records under the shared ARKI format", () => {
    const records = makeDelta62LucaSeed("luca-test-commit");
    expect(records).toHaveLength(5);
    expect(records.every((record) => validateDelta62Record(record).valid)).toBe(true);
    expect(records.every((record) => record.formatVersion === DELTA_62_FORMAT_VERSION && record.product === "LUCA")).toBe(true);
  });
  it("keeps product partitions explicit", () => {
    const partitions = partitionDelta62Records(makeDelta62LucaSeed("luca-test-commit"));
    expect(partitions.luca).toHaveLength(5);
    expect(partitions.arki).toHaveLength(0);
    expect(partitions.shared).toHaveLength(0);
  });
});
