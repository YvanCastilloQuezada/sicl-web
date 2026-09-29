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

  it.each([true, false, "true", 1, null])("rejects reserved canonical property regardless of value: %s", (value) => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [
        {
          ...validProposal.proposedElements[0],
          properties: { canonical: value },
        },
        validProposal.proposedElements[1],
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "proposedElements[el-venta].properties[canonical]: PROPERTY_RESERVED_KEY"
    );
  });

  it("accepts the JSON-safe scalar property domain including Object.create(null) tolerance", () => {
    const properties = Object.create(null) as Record<string, string | number | boolean | null>;
    properties.s = "x";
    properties.i = 1;
    properties.f = 1.5;
    properties.t = true;
    properties.falsy = false;
    properties.n = null;
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [{ ...validProposal.proposedElements[0], properties }],
      proposedRelations: [],
    });
    expect(result).toEqual({ valid: true, errors: [] });
    expect(JSON.parse(JSON.stringify(properties))).toEqual({ s: "x", i: 1, f: 1.5, t: true, falsy: false, n: null });
  });

  it.each([
    ["object", { nested: true }, "PROPERTY_UNSUPPORTED_VALUE"],
    ["array", ["x"], "PROPERTY_UNSUPPORTED_VALUE"],
    ["undefined", undefined, "PROPERTY_UNSUPPORTED_VALUE"],
    ["NaN", Number.NaN, "PROPERTY_NON_FINITE_NUMBER"],
    ["Infinity", Number.POSITIVE_INFINITY, "PROPERTY_NON_FINITE_NUMBER"],
    ["-Infinity", Number.NEGATIVE_INFINITY, "PROPERTY_NON_FINITE_NUMBER"],
  ])("rejects runtime-bypassed %s property values", (_name, value, code) => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [{
        ...validProposal.proposedElements[0],
        properties: { x: value } as unknown as DeveloperProposal["proposedElements"][number]["properties"],
      }],
      proposedRelations: [],
    });
    expect(result.errors).toContain(`proposedElements[el-venta].properties[x]: ${code}`);
  });

  it.each(["", " ", "\t", "\n"])("rejects empty or whitespace-only property key %j", (key) => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [{
        ...validProposal.proposedElements[0],
        properties: { [key]: "x" },
      }],
      proposedRelations: [],
    });
    expect(result.errors).toContain(`proposedElements[el-venta].properties[${key}]: PROPERTY_INVALID_KEY`);
  });

  it("rejects exotic property containers, Symbols, non-enumerables, accessors and __proto__ own keys", () => {
    const cases: Array<[unknown, string]> = [
      [null, "PROPERTY_NOT_OBJECT"],
      [[], "PROPERTY_NOT_OBJECT"],
      [new Date(), "PROPERTY_INVALID_PROTOTYPE"],
      [new Set(), "PROPERTY_INVALID_PROTOTYPE"],
      [new Map(), "PROPERTY_INVALID_PROTOTYPE"],
      [Object.create({ inherited: "x" }), "PROPERTY_INVALID_PROTOTYPE"],
      [{ [Symbol("x")]: "y" }, "PROPERTY_SYMBOL_KEY"],
      [Object.defineProperty({}, "hidden", { value: "x", enumerable: false }), "PROPERTY_NON_ENUMERABLE"],
      [Object.defineProperty({}, "x", { get() { throw new Error("must not run"); }, enumerable: true }), "PROPERTY_ACCESSOR_NOT_ALLOWED"],
      [{ ["__proto__"]: "x" }, "PROPERTY_FORBIDDEN_PROTO_KEY"],
    ];
    for (const [properties, code] of cases) {
      const result = validateDeveloperProposal({
        ...validProposal,
        proposedElements: [{
          ...validProposal.proposedElements[0],
          properties: properties as DeveloperProposal["proposedElements"][number]["properties"],
        }],
        proposedRelations: [],
      });
      expect(result.errors.some((error) => error.includes(code))).toBe(true);
    }
  });

  it("fails closed when property introspection or descriptor lookup throws", () => {
    const ownKeysHostile = new Proxy({}, { ownKeys() { throw new Error("boom"); } });
    const descriptorHostile = new Proxy({ x: "a" }, {
      ownKeys() { return ["x"]; },
      getOwnPropertyDescriptor() { throw new Error("boom"); },
    });
    for (const [properties, code] of [
      [ownKeysHostile, "PROPERTY_INTROSPECTION_FAILED"],
      [descriptorHostile, "PROPERTY_DESCRIPTOR_UNREADABLE"],
    ] as const) {
      const result = validateDeveloperProposal({
        ...validProposal,
        proposedElements: [{
          ...validProposal.proposedElements[0],
          properties: properties as DeveloperProposal["proposedElements"][number]["properties"],
        }],
        proposedRelations: [],
      });
      expect(result.errors.some((error) => error.includes(code))).toBe(true);
    }
  });

  it("accumulates detectable property errors across elements and derives valid from errors length", () => {
    const result = validateDeveloperProposal({
      ...validProposal,
      proposedElements: [
        { ...validProposal.proposedElements[0], properties: { a: Number.NaN, canonical: false } as unknown as DeveloperProposal["proposedElements"][number]["properties"] },
        { ...validProposal.proposedElements[1], properties: { b: undefined } as unknown as DeveloperProposal["proposedElements"][number]["properties"] },
      ],
    });
    expect(result.errors.filter((error) => error.includes("PROPERTY_"))).toHaveLength(3);
    expect(result.valid).toBe(result.errors.length === 0);
    expect(result.valid).toBe(false);
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
