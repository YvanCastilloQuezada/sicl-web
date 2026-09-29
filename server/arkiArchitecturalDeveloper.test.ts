import { describe, expect, it } from "vitest";
import type { DesignCandidate } from "../shared/arkiDesignFunnel";
import { developProposal, type DeveloperInput } from "./arkiArchitecturalDeveloper";
import {
  executeIntegratedArchitectCycle,
  type IntegratedArchitectCycle,
  type IntegratedArchitectInput,
} from "./arkiIntegratedArchitectCycle";
import type { PartiContract } from "./arkiPartiContract";

const base = (
  projectId: IntegratedArchitectInput["projectId"]
): IntegratedArchitectInput => ({
  projectId,
  projectName: "Residential developer proof",
  typology: "RESIDENTIAL",
  brief: "A two-storey home with private, social and service zoning.",
  context: {
    location: "Peru",
    siteCondition: "single public edge",
    occupancy: 5,
  },
  constraints: [
    "Conceptual geometry only",
    "Separate public and service flows",
    "Human review required",
  ],
  activities: [
    {
      id: "public",
      label: "public arrival and use",
      subjects: ["visitor"],
      capacity: 5,
      frequency: "daily",
      duration: "long",
      temporalOverlap: true,
      privacy: "shared",
    },
    {
      id: "service",
      label: "service and supply",
      subjects: ["staff"],
      capacity: 20,
      frequency: "daily",
      duration: "medium",
      temporalOverlap: true,
      accessControl: "staff",
      privacy: "controlled",
    },
  ],
  relationships: [
    {
      id: "r1",
      from: "public",
      to: "service",
      relation: "controlled interface",
      subjects: ["visitor", "staff"],
      state: "open",
      frequency: "daily",
      time: "operating-hours",
      control: "staff-mediated",
    },
  ],
  subjects: ["visitor", "staff"],
  conditions: [
    "public and service flows must remain legible",
    "service route must reach storage and preparation",
  ],
  unknowns: ["exact egress and code parameters require jurisdictional review"],
  envelope: { width: 20, height: 40 },
  sourceIds: ["SRC-USER-BRIEF", "SRC-TYPOLOGY-REGISTRY"],
});

function selectedCandidate(projectId: string, id = "DEV-CANDIDATE-A"): DesignCandidate {
  return {
    id,
    projectId,
    generationId: "GEN-C7",
    stage: "SELECTED_FOR_DEVELOPMENT",
    status: "ELIGIBLE",
    title: "Selected architectural hypothesis",
    strategy: "Controlled public/service separation",
    preview: "PREVIEW_LOCAL_CONCEPTUAL",
    metrics: { evidenceLevel: "conceptual" },
    evidence: ["HUMAN_SELECTION_EVIDENCE"],
    unknowns: ["structural system remains unknown"],
    failureReasons: [],
    provenance: ["GEN-C7", id],
  };
}

function fixture(): DeveloperInput {
  const cycle = executeIntegratedArchitectCycle(base("RES-HOU-200-001"));
  return {
    selectedCandidate: selectedCandidate(cycle.project.projectId),
    cycle,
    partiContract: cycle.parti.partis[0],
    explicitInput: { envelope: { width: 20, height: 40 } },
  };
}

function acceptedFixture(): DeveloperInput {
  const input = fixture();
  const acceptedParti: PartiContract = {
    ...input.partiContract,
    humanAuthority: { required: true, decision: "ACCEPTED", reviewer: "human-reviewer" },
  };
  const cycle: IntegratedArchitectCycle = {
    ...input.cycle,
    parti: {
      ...input.cycle.parti,
      partis: input.cycle.parti.partis.map((parti) =>
        parti.partiId === acceptedParti.partiId ? acceptedParti : parti
      ),
    },
  };
  return { ...input, cycle, partiContract: acceptedParti };
}

function verticallyAuthorizedFixture(height = 2800, elevation = 0): DeveloperInput {
  const input = fixture();
  const representation = input.partiContract.geometryIds.includes(input.cycle.geometry.candidateA.id)
    ? input.cycle.geometry.candidateA
    : input.cycle.geometry.candidateB;
  const spaceIds = representation.elements.filter((e) => e.element_type === "SpatialZone").map((e) => `d63-${e.id}`);
  const levelId = "LEVEL-01";
  const elevationId = "VD-ELEVATION-01";
  const clearId = "VD-CLEAR-01";
  const verticalDecisions = [
    {
      decisionId: elevationId, target: { kind: "LEVEL" as const, levelId }, dimensionKind: "ELEVATION" as const,
      selectedDimension_mm: elevation, regulatoryConstraints: [], designReferences: [], designDrivers: [],
      reasoning: "Architect establishes the project level datum.", status: "RESOLVED" as const, epistemicStatus: "HYPOTHESIS" as const,
      decisionAuthority: "ARCHITECTURAL_DECISION" as const, evidence: [{ kind: "ARCHITECT_DECISION" as const, ref: "ARCH-ELEV-01" }],
      provenance: ["PARTI:vertical"], unknowns: [], conflicts: [], humanAuthorityRequired: true,
    },
    {
      decisionId: clearId, target: { kind: "LEVEL" as const, levelId }, dimensionKind: "CLEAR_HEIGHT" as const,
      selectedDimension_mm: height, regulatoryConstraints: [], designReferences: [], designDrivers: [{ kind: "SPACE_USE" as const, description: "occupied spatial zone", influence: "NEUTRAL" as const }],
      reasoning: "Architect adopts a coherent clear height for this level.", status: "RESOLVED" as const, epistemicStatus: "HYPOTHESIS" as const,
      decisionAuthority: "ARCHITECTURAL_DECISION" as const, evidence: [{ kind: "ARCHITECT_DECISION" as const, ref: "ARCH-CLEAR-01" }],
      provenance: ["PARTI:vertical"], unknowns: [], conflicts: [], humanAuthorityRequired: true,
    },
  ];
  const partiContract: PartiContract = {
    ...input.partiContract,
    verticalDecisions,
    verticalSystem: { systemId: "VS-01", kind: "LEVEL_BASED", levels: [{ levelId, name: "Level 01", members: spaceIds, elevationDecisionId: elevationId, clearHeightDecisionId: clearId }], provenance: ["PARTI:vertical"] },
  };
  const cycle = { ...input.cycle, parti: { ...input.cycle.parti, partis: input.cycle.parti.partis.map((p) => p.partiId === partiContract.partiId ? partiContract : p) } };
  return { ...input, cycle, partiContract };
}

function specialVolumeFixture(baseElevation = 0, extent = 6200, withArchitecturalBase = true): DeveloperInput {
  const input = fixture();
  const representation = input.partiContract.geometryIds.includes(input.cycle.geometry.candidateA.id)
    ? input.cycle.geometry.candidateA
    : input.cycle.geometry.candidateB;
  const spaceIds = representation.elements.filter((e) => e.element_type === "SpatialZone").map((e) => `d63-${e.id}`);
  const levelId = "LEVEL-SPECIAL-BASE";
  const elevationId = "VD-SPECIAL-ELEVATION";
  const extentId = "VD-SPECIAL-EXTENT";
  const volumeId = "SPECIAL-VOLUME-01";
  const verticalDecisions = [
    {
      decisionId: elevationId, target: { kind: "LEVEL" as const, levelId }, dimensionKind: "ELEVATION" as const,
      selectedDimension_mm: baseElevation, regulatoryConstraints: [], designReferences: [], designDrivers: [],
      reasoning: "Architect establishes the special-volume base datum.", status: "RESOLVED" as const, epistemicStatus: "HYPOTHESIS" as const,
      decisionAuthority: "ARCHITECTURAL_DECISION" as const, evidence: [{ kind: "ARCHITECT_DECISION" as const, ref: "ARCH-SPECIAL-BASE" }],
      provenance: ["PARTI:vertical"], unknowns: [], conflicts: [], humanAuthorityRequired: true,
    },
    {
      decisionId: extentId, target: { kind: "SPECIAL_VOLUME" as const, volumeId, members: spaceIds }, dimensionKind: "SPECIAL_VERTICAL" as const,
      selectedDimension_mm: extent, regulatoryConstraints: [], designReferences: [], designDrivers: [],
      reasoning: "Architect establishes the special-volume vertical extent.", status: "RESOLVED" as const, epistemicStatus: "HYPOTHESIS" as const,
      decisionAuthority: "ARCHITECTURAL_DECISION" as const, evidence: [{ kind: "ARCHITECT_DECISION" as const, ref: "ARCH-SPECIAL-EXTENT" }],
      provenance: ["PARTI:vertical"], unknowns: [], conflicts: [], humanAuthorityRequired: true,
    },
  ];
  const specialVolume = {
    volumeId,
    kind: "DOUBLE_HEIGHT" as const,
    members: spaceIds,
    volumeDecisionId: extentId,
    ...(withArchitecturalBase
      ? { architecturalBase: { kind: "LEVEL_BASE" as const, levelId, authorization: "ELEVATION_AS_BASE" as const } }
      : {}),
  };
  const partiContract: PartiContract = {
    ...input.partiContract,
    verticalDecisions,
    verticalSystem: {
      systemId: "VS-SPECIAL",
      kind: "HYBRID",
      levels: [{ levelId, name: "Special base level", members: [], elevationDecisionId: elevationId }],
      specialVolumes: [specialVolume],
      provenance: ["PARTI:vertical"],
    },
  };
  const cycle = { ...input.cycle, parti: { ...input.cycle.parti, partis: input.cycle.parti.partis.map((p) => p.partiId === partiContract.partiId ? partiContract : p) } };
  return { ...input, cycle, partiContract };
}

describe("ARKI Architectural Developer proposal-only", () => {
  it("emits SPACE height_mm only from RESOLVED CLEAR_HEIGHT and z_mm from RESOLVED ELEVATION", () => {
    const proposal = developProposal(verticallyAuthorizedFixture(2800, -3200)).proposal;
    expect(proposal.proposedElements.length).toBeGreaterThan(0);
    expect(proposal.proposedElements.every((el) => el.kind === "SPACE")).toBe(true);
    expect(proposal.proposedElements.every((el) => el.geometry?.height_mm === 2800 && el.geometry?.z_mm === -3200)).toBe(true);
    expect(proposal.proposedElements.every((el) => el.provenance.some((p) => p.source === "vertical_dimension_decision"))).toBe(true);
  });

  it("does not let CLEAR_HEIGHT authorize non-SPACE D6.3 elements", () => {
    const proposal = developProposal(verticallyAuthorizedFixture()).proposal;
    expect(proposal.proposedElements.some((el) => el.kind === "SITE")).toBe(false);
    expect(proposal.unresolvedUnknowns.some((u) => u.reason.includes("Core kind SITE"))).toBe(true);
  });


  it("produces a valid pre-D-2 proposal from a selected candidate", () => {
    const result = developProposal(fixture());
    expect(result.validation.valid).toBe(true);
    expect(result.proposal.reviewRequired).toBe(true);
    expect(result.proposal.rejectedBecause).toBeNull();
    expect(result.proposal.mutation).toBeNull();
    expect(result.proposal.proposedElements).toHaveLength(0);
    expect(result.proposal.unresolvedUnknowns.some((item) => item.reason.includes("LEVEL_MEMBERSHIP_GAP"))).toBe(true);
  });

  it("rejects a candidate that was not selected for development", () => {
    const input = fixture();
    expect(() =>
      developProposal({
        ...input,
        selectedCandidate: { ...input.selectedCandidate, stage: "FINALIST_4" },
      })
    ).toThrow("DEVELOPER_REQUIRES_SELECTED_CANDIDATE");
  });

  it("rejects a candidate from another project", () => {
    const input = fixture();
    expect(() =>
      developProposal({
        ...input,
        selectedCandidate: { ...input.selectedCandidate, projectId: "OTHER-PROJECT" },
      })
    ).toThrow("CANDIDATE_PROJECT_MISMATCH");
  });

  it("rejects a PartiContract that is not in the cycle", () => {
    const input = fixture();
    expect(() =>
      developProposal({
        ...input,
        partiContract: { ...input.partiContract, partiId: "PARTI-NOT-IN-CYCLE" },
      })
    ).toThrow("PARTI_NOT_IN_CYCLE");
  });

  it("rejects a modified PartiContract with a reused partiId", () => {
    const input = fixture();
    expect(() =>
      developProposal({
        ...input,
        partiContract: {
          ...input.partiContract,
          humanAuthority: { required: true, decision: "ACCEPTED" },
        },
      })
    ).toThrow("PARTI_CONTRACT_MISMATCH");
  });

  it("preserves candidate, cycle and Parti UNKNOWNs", () => {
    const result = developProposal(fixture());
    const reasons = result.proposal.unresolvedUnknowns.map((item) => item.reason);
    expect(reasons).toContain("structural system remains unknown");
    expect(reasons).toContain("Exact capacity, code compliance and professional approval remain unresolved.");
    expect(reasons.some((reason) => reason.includes("Functional fit requires architect review"))).toBe(true);
  });

  it("does not promote CirculationElement into a fabricated Core kind", () => {
    const result = developProposal(fixture());
    expect(result.proposal.proposedElements.some((element) => element.kind === "CIRCULATION")).toBe(false);
    expect(result.proposal.unresolvedUnknowns.some((item) => item.reason.includes("CirculationElement"))).toBe(true);
    expect(result.proposal.requiredHumanActions.some((item) => item.action === "decide_circulation_element_mapping")).toBe(true);
  });

  it("does not fabricate architectural relations or element-level derivations", () => {
    const result = developProposal(fixture());
    expect(result.proposal.proposedRelations).toEqual([]);
    expect(result.proposal.proposedDerivations).toEqual([]);
  });

  it("produces a stable fingerprint for identical input", () => {
    const input = fixture();
    expect(developProposal(input).proposal.fingerprint).toBe(
      developProposal(input).proposal.fingerprint
    );
  });

  it("changes the fingerprint when explicit input changes", () => {
    const input = fixture();
    const changed: DeveloperInput = {
      ...input,
      explicitInput: { envelope: { width: 21, height: 40 } },
    };
    expect(developProposal(input).proposal.fingerprint).not.toBe(
      developProposal(changed).proposal.fingerprint
    );
  });

  it("propagates parentProposalId into genealogy and fingerprint", () => {
    const input = fixture();
    const child = developProposal({ ...input, parentProposalId: "dev-prop-parent" }).proposal;
    const root = developProposal(input).proposal;
    expect(child.parentProposalId).toBe("dev-prop-parent");
    expect(child.fingerprint).not.toBe(root.fingerprint);
  });

  it("remains HYPOTHESIS while Human Authority is pending", () => {
    expect(developProposal(fixture()).proposal.epistemicStatus).toBe("HYPOTHESIS");
  });

  it("becomes PROPOSAL only when the cycle-bound Parti records human acceptance", () => {
    expect(developProposal(acceptedFixture()).proposal.epistemicStatus).toBe("PROPOSAL");
  });

  it("never declares canonical:true or invents a DOOR", () => {
    const proposal = developProposal(fixture()).proposal;
    expect(proposal.proposedElements.some((element) => element.kind === "DOOR")).toBe(false);
    expect(
      proposal.proposedElements.some(
        (element) => (element.properties as Record<string, unknown>).canonical === true
      )
    ).toBe(false);
  });

  it("preserves D6.3 PARTIAL and G12 FAIL as provenance/feedback evidence", () => {
    const proposal = developProposal(fixture()).proposal;
    expect(proposal.provenance).toEqual(
      expect.arrayContaining([
        { source: "d63_final_status", ref: "PARTIAL" },
        { source: "d63_g12_no_template_hardcoding", ref: "FAIL" },
      ])
    );
    expect(proposal.feedbackLoops.some((loop) => loop.to === "d63" && loop.reason.includes("G12"))).toBe(true);
  });

  it("keeps provenance on every proposed element", () => {
    const proposal = developProposal(fixture()).proposal;
    expect(proposal.proposedElements.every((element) => element.provenance.length > 0)).toBe(true);
  });

  it.each([-3200, 0, 4500])("materializes SPECIAL_VOLUME base %i only from the closed resolver", (baseElevation) => {
    const proposal = developProposal(specialVolumeFixture(baseElevation, 6200, true)).proposal;
    const spaces = proposal.proposedElements.filter((el) => el.kind === "SPACE");
    expect(spaces.length).toBeGreaterThan(0);
    expect(spaces.every((el) => el.geometry?.z_mm === baseElevation && el.geometry?.height_mm === 6200)).toBe(true);
    expect(spaces.every((el) => el.provenance.some((p) => p.source === "vertical_dimension_decision" && p.ref === "VD-SPECIAL-EXTENT"))).toBe(true);
    expect(spaces.every((el) => el.provenance.some((p) => p.source === "vertical_elevation_decision" && p.ref === "VD-SPECIAL-ELEVATION"))).toBe(true);
    expect(spaces.every((el) => el.provenance.some((p) => p.source === "vertical_base_declaration"))).toBe(true);
  });

  it("fails closed for SPECIAL_VOLUME without architecturalBase instead of fabricating z=0", () => {
    const proposal = developProposal(specialVolumeFixture(0, 6200, false)).proposal;
    expect(proposal.proposedElements.filter((el) => el.kind === "SPACE")).toHaveLength(0);
    expect(proposal.unresolvedUnknowns.some((u) =>
      u.field.endsWith(".vertical_geometry") &&
      u.reason === "SPECIAL_VOLUME_GEOMETRY_RESOLUTION_FAILED:SPECIAL_VOLUME_INDEPENDENT_DATUM_PENDING"
    )).toBe(true);
  });

  it("rejects LEVEL_BASED missing elevation authority at the Parti boundary before materialization", () => {
    const input = verticallyAuthorizedFixture();
    const level = input.partiContract.verticalSystem.levels?.[0];
    if (!level) throw new Error("TEST_LEVEL_REQUIRED");
    const partiContract: PartiContract = {
      ...input.partiContract,
      verticalDecisions: input.partiContract.verticalDecisions.filter((d) => d.decisionId !== level.elevationDecisionId),
    };
    const cycle = { ...input.cycle, parti: { ...input.cycle.parti, partis: input.cycle.parti.partis.map((p) => p.partiId === partiContract.partiId ? partiContract : p) } };
    expect(() => developProposal({ ...input, cycle, partiContract })).toThrow(/PARTI_CONTRACT_INVALID: .*VERTICAL_ELEVATION_DECISION_REF_INVALID/);
  });

  it.each([0, -3200, 4500])("preserves explicit LEVEL_BASED ELEVATION %i without defaulting", (elevation) => {
    const proposal = developProposal(verticallyAuthorizedFixture(2800, elevation)).proposal;
    expect(proposal.proposedElements.filter((el) => el.kind === "SPACE").every((el) => el.geometry?.z_mm === elevation)).toBe(true);
  });

});
