import { describe, expect, it } from "vitest";
import { appendDesignMemoryEntry, createDesignBranch, createDesignMemory, recordDesignTradeoff, recordHumanDesignDecision, validateDesignMemory } from "./a21DesignMemory";

describe("A21 DesignMemory", () => {
  it("records a branch, trade-off and unresolved question without automatic decision", () => {
    let memory = createDesignMemory("PROJECT-01");
    memory = createDesignBranch(memory, { branchId: "branch-courtyard", parentBranchId: "branch-main", label: "Courtyard alternative", status: "SELECTED_FOR_REVIEW", changedParameters: ["central_void"], changedRelations: ["SOCIAL↔PRIVATE"], changedZones: ["PUBLIC", "PRIVATE"], changedCirculation: ["PRIMARY_SPINE"], newUnknowns: ["DAYLIGHT"], resolvedUnknowns: [], provenance: ["architectural-study"] });
    memory = appendDesignMemoryEntry(memory, { entryId: "entry-1", entryType: "DISTRIBUTION_GENERATED", branchId: "branch-courtyard", author: "ARQUI", trigger: "Human requested privacy separation", statement: "Generated a candidate with public and private zones.", architecturalQuestion: "Does the courtyard improve privacy without harming access?", observations: ["Public/private separation is explicit"], interpretation: "Candidate only", hypothesis: "Review courtyard strategy", alternativesConsidered: ["branch-main", "branch-courtyard"], rejectedAlternatives: [], tradeoffIds: [], consequences: ["Longer private route may occur"], unresolvedQuestions: ["DAYLIGHT"], sourceRefs: ["A21"], geometryRefs: [], programRefs: ["PROGRAM-SOCIAL", "PROGRAM-PRIVATE"], adjacencyRefs: ["ADJ-01"], zoningRefs: ["ZONE-PUBLIC", "ZONE-PRIVATE"], circulationRefs: ["INTENT-01"], reviewState: "PENDING_HUMAN_REVIEW", epistemicState: "AI_PROPOSED" });
    memory = recordDesignTradeoff(memory, { branchId: "branch-courtyard", gained: "privacy separation", sacrificed: "direct route length", rationale: "The candidate introduces a transition zone.", evidenceRefs: ["entry-1"], humanReviewState: "PENDING_HUMAN_REVIEW", epistemicState: "HYPOTHESIS" });
    expect(memory.activeBranchId).toBe("branch-courtyard");
    expect(memory.openQuestions).toContain("DAYLIGHT");
    expect(memory.tradeoffs[0].sacrificed).toBe("direct route length");
    expect(memory.noAutomaticDecision).toBe(true);
    expect(validateDesignMemory(memory)).toBe(true);
  });

  it("preserves rejected branches and records a human decision explicitly", () => {
    let memory = createDesignMemory("PROJECT-02");
    memory = createDesignBranch(memory, { branchId: "branch-a", parentBranchId: "branch-main", label: "A", status: "CANDIDATE", changedParameters: [], changedRelations: [], changedZones: [], changedCirculation: [], newUnknowns: [], resolvedUnknowns: [], provenance: ["fixture"] });
    memory = createDesignBranch(memory, { branchId: "branch-b", parentBranchId: "branch-main", label: "B", status: "CANDIDATE", changedParameters: [], changedRelations: [], changedZones: [], changedCirculation: [], newUnknowns: [], resolvedUnknowns: [], provenance: ["fixture"] });
    memory = recordHumanDesignDecision(memory, { memoryEntryId: "decision-entry", actor: "ARCHITECT", statement: "Select B for review and retain A as rejected alternative.", scope: "DISTRIBUTION", selectedBranchId: "branch-b", rejectedBranchIds: ["branch-a"], reason: "Better separation between public and private zones.", constraintsAcknowledged: ["privacy"], evidenceAcknowledged: ["A21-zone-proposal"] });
    expect(memory.branches.find((branch) => branch.branchId === "branch-b")?.status).toBe("HUMAN_SELECTED");
    expect(memory.branches.find((branch) => branch.branchId === "branch-a")?.status).toBe("DISCARDED");
    expect(memory.decisions[0].humanConfirmed).toBe(true);
    expect(validateDesignMemory(memory)).toBe(true);
  });

  it("does not validate a memory whose entry references an unknown branch", () => {
    const memory = appendDesignMemoryEntry(createDesignMemory("PROJECT-03"), { entryId: "bad", entryType: "UNKNOWN_RECORDED", branchId: "missing-branch", author: "ARQUI", trigger: "test", statement: "Unknown branch reference", observations: [], alternativesConsidered: [], rejectedAlternatives: [], tradeoffIds: [], consequences: [], unresolvedQuestions: [], sourceRefs: [], geometryRefs: [], programRefs: [], adjacencyRefs: [], zoningRefs: [], circulationRefs: [], reviewState: "PENDING_HUMAN_REVIEW", epistemicState: "UNKNOWN" });
    expect(validateDesignMemory(memory)).toBe(false);
  });
});
