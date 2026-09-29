import { describe, it, expect } from "vitest";
import {
  validateDeveloperProposal,
  type DeveloperProposal,
} from "./arkiDeveloperProposal.js";

const validProposal: DeveloperProposal = {
  proposalId: "dev-prop-001",
  parentProposalId: null,
  sourceExecutionId: "exec-d63-001",
  sourceD63: "d63-result-abc",
  fingerprint: "a".repeat(64),
  epistemicStatus: "HYPOTHESIS",
  proposedElements: [
    {
      provisionalId: "el-venta",
      kind: "SPACE",
      geometry: { x: 0, y: 0, width: 5, height: 10 },
      properties: {},
      provenance: [{ source: "input", ref: "venta-rect" }],
      epistemicStatus: "FACT",
    },
    {
      provisionalId: "el-bano",
      kind: "SPACE",
      geometry: { x: 5, y: 0, width: 1.5, height: 2 },
      properties: {},
      provenance: [{ source: "input", ref: "bano-rect" }],
      epistemicStatus: "FACT",
    },
  ],
  proposedRelations: [
    {
      fromProvisionalId: "el-venta",
      toProvisionalId: "el-bano",
      relationKind: "ADJACENT_TO",
      provenance: [{ source: "input", ref: "boundary-1" }],
    },
  ],
  proposedDerivations: [],
  unresolvedUnknowns: [
    {
      field: "el-venta.opening.location",
      reason: "no evidence in input",
      requiredEvidence: "human decision or explicit input",
    },
  ],
  requiredHumanActions: [
    { action: "confirm opening location", reason: "UNKNOWN in input" },
  ],
  provenance: [{ source: "d63", ref: "d63-result-abc" }],
  reviewRequired: true,
  mutation: null,
  rejectedBecause: null,
  feedbackLoops: [],
};

describe("validateDeveloperProposal", () => {
  it("accepts a valid proposal", () => {
    expect(validateDeveloperProposal(validProposal)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it("rejects empty proposalId", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposalId: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("proposalId must be non-empty");
  });

  it("rejects parentProposalId === proposalId", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      parentProposalId: validProposal.proposalId,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "parentProposalId must differ from proposalId"
    );
  });

  it("rejects malformed fingerprint", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      fingerprint: "ZZZ",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "fingerprint must be lowercase sha256 hex (64 chars)"
    );
  });

  it("rejects epistemicStatus outside HYPOTHESIS|PROPOSAL", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      epistemicStatus: "FACT" as unknown as DeveloperProposal["epistemicStatus"],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "epistemicStatus must be HYPOTHESIS or PROPOSAL"
    );
  });

  it("rejects reviewRequired !== true", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      reviewRequired: false as unknown as true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("reviewRequired must be true");
  });

  it("rejects duplicate provisionalIds", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [
        validProposal.proposedElements[0],
        { ...validProposal.proposedElements[1], provisionalId: "el-venta" },
      ],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("duplicate provisionalId"))
    ).toBe(true);
  });

  it("rejects relation referencing undeclared element", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedRelations: [
        {
          fromProvisionalId: "el-venta",
          toProvisionalId: "el-nonexistent",
          relationKind: "ADJACENT_TO",
          provenance: [],
        },
      ],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) =>
        e.includes("toProvisionalId el-nonexistent not declared")
      )
    ).toBe(true);
  });

  it("rejects derivation referencing undeclared element", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedDerivations: [
        {
          outputProvisionalId: "el-venta",
          inputsProvisionalIds: ["el-nonexistent"],
          method: "test",
          methodVersion: "1",
          assumptions: [],
        },
      ],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) =>
        e.includes("inputProvisionalId el-nonexistent not declared")
      )
    ).toBe(true);
  });

  it("rejects element with epistemicStatus UNKNOWN", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [
        { ...validProposal.proposedElements[0], epistemicStatus: "UNKNOWN" },
      ],
      proposedRelations: [],
      proposedDerivations: [],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("UNKNOWN element"))
    ).toBe(true);
  });

  it("rejects element declaring canonical:true", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [
        {
          ...validProposal.proposedElements[0],
          properties: { canonical: true },
        },
        validProposal.proposedElements[1],
      ],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("cannot declare canonical:true"))
    ).toBe(true);
  });

  it("rejects unknown with empty field", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      unresolvedUnknowns: [
        { field: "", reason: "x", requiredEvidence: "y" },
      ],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors).toContain("unresolvedUnknowns: field must be non-empty");
  });

  it("rejects provenance with malformed fingerprint", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      provenance: [{ source: "x", ref: "y", fingerprint: "NOT_HEX" }],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors).toContain(
        "provenance: fingerprint must be lowercase sha256 hex"
      );
  });

  it("accepts parentProposalId referencing another proposal", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      parentProposalId: "dev-prop-000",
    });
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it("accepts epistemicStatus PROPOSAL", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      epistemicStatus: "PROPOSAL",
    });
    expect(result).toEqual({ valid: true, errors: [] });
  });
});
