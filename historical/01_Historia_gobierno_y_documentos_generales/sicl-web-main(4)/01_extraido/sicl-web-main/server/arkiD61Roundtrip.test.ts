import { describe, expect, it } from "vitest";
import { emptySnapshot, parseSnapshot, type SiclKnowledgeRecord, type SiclKnowledgeValidation } from "./siclCore";

describe("D6.1 Core knowledge round-trip contract", () => {
  it("preserves source, scope, epistemic status and human validation through snapshot reload", () => {
    const knowledge: SiclKnowledgeRecord[] = [
      { id: "KN-FACT", kind: "INVARIANT", title: "Program distinction", statement: "PROGRAM ≠ ROOM LIST.", epistemicStatus: "FACT", promotionState: "K7_CANONICAL_HUMAN_CONFIRMED", scopeId: "SCP-GENERAL", sourceIds: ["SRC-1"], evidenceIds: [], rightsStatus: "ABSTRACT_AND_REFERENCE_ONLY", version: 1 },
      { id: "KN-UNKNOWN", kind: "TYPOLOGY", title: "Hospital", statement: "Care/diagnosis/treatment/support", epistemicStatus: "UNKNOWN", promotionState: "PROVISIONAL", scopeId: "TYPOLOGY_PARTIAL", sourceIds: [], evidenceIds: [], unknown: "Processes require decomposition.", version: 1 },
    ];
    const validation: SiclKnowledgeValidation = { id: "HV-1", knowledgeId: "KN-FACT", decision: "CONFIRMED_WITHIN_SCOPE", authority: "PRODUCT_OWNER", scopeId: "SCP-GENERAL", validatedAt: "2026-09-20T00:00:00.000Z", evidenceHash: "hash" };
    const snapshot = { ...emptySnapshot(), sources: [{ id: "SRC-1", name: "Source", statement: "Abstract source" }], knowledge, knowledgeValidations: [validation] };
    const reloaded = parseSnapshot(JSON.stringify(snapshot));
    expect(reloaded.knowledge.find((item) => item.id === "KN-FACT")).toMatchObject({ epistemicStatus: "FACT", scopeId: "SCP-GENERAL", sourceIds: ["SRC-1"] });
    expect(reloaded.knowledge.find((item) => item.id === "KN-UNKNOWN")).toMatchObject({ epistemicStatus: "UNKNOWN", unknown: "Processes require decomposition." });
    expect(reloaded.knowledgeValidations).toEqual([validation]);
  });

  it("does not equate FACT knowledge kind with canonical promotion", () => {
    const snapshot = { ...emptySnapshot(), knowledge: [{ id: "KN-CANDIDATE", kind: "FACT", title: "Bounded fact", statement: "Fact within scope", epistemicStatus: "FACT", promotionState: "K3_SUPPORTED", scopeId: "SCP-LIMITED", sourceIds: ["SRC-1"], evidenceIds: [], version: 1 }] };
    const reloaded = parseSnapshot(JSON.stringify(snapshot));
    expect(reloaded.knowledge[0].kind).toBe("FACT");
    expect(reloaded.knowledge[0].promotionState).not.toBe("K7_CANONICAL_HUMAN_CONFIRMED");
  });
});
