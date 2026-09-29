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

describe("ARKI Architectural Developer proposal-only", () => {
  it("produces a valid pre-D-2 proposal from a selected candidate", () => {
    const result = developProposal(fixture());
    expect(result.validation.valid).toBe(true);
    expect(result.proposal.reviewRequired).toBe(true);
    expect(result.proposal.rejectedBecause).toBeNull();
    expect(result.proposal.mutation).toBeNull();
    expect(result.proposal.proposedElements.length).toBeGreaterThan(0);
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
});
