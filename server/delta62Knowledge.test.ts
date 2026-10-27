import { describe, expect, it } from "vitest";
import { DELTA_62_AUTHORITY_BOUNDARY, DELTA_62_FORMAT_VERSION, makeDelta62LucaSeed, partitionDelta62Records, proposeDelta62Promotion, validateDelta62Record } from "../shared/delta62Knowledge";

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
  it("cannot use Delta 6.2 as a direct canonical mutation path", () => {
    const staged = makeDelta62LucaSeed("luca-test-commit")[0];
    expect(() => proposeDelta62Promotion({ proposalId: "P1", record: staged, target: "D2", evidence: ["E1"], requestedBy: "TEST" })).toThrow("DELTA62_RECORD_NOT_PROMOTABLE");
    const validated = { ...staged, state: "VALIDATED" as const };
    const proposal = proposeDelta62Promotion({ proposalId: "P2", record: validated, target: "D2", evidence: ["E1"], requestedBy: "TEST" });
    expect(proposal.canonicalMutation).toBe(false);
    expect(proposal.status).toBe("PROPOSED");
    expect(DELTA_62_AUTHORITY_BOUNDARY.directCoreMutation).toBe(false);
    expect(DELTA_62_AUTHORITY_BOUNDARY.directD2Mutation).toBe(false);
    expect(DELTA_62_AUTHORITY_BOUNDARY.directAgkMutation).toBe(false);
  });
});
