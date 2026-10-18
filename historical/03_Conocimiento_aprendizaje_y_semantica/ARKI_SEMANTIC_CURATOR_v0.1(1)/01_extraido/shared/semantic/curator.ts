import { SemanticRegistry } from "./registry";
import {
  CuratorFinding, CuratorReview, SemanticChangeProposal, SemanticConcept
} from "./types";

function normalize(v: string): string {
  return v.trim().toLocaleLowerCase("en-US").replace(/[\s_\-./]+/g, "");
}

function validateCandidate(candidate: SemanticConcept): CuratorFinding[] {
  const findings: CuratorFinding[] = [];
  if (!candidate.definition.trim()) findings.push({
    code: "SEM_DEFINITION_REQUIRED", severity: "ERROR",
    message: "A canonical semantic concept requires an explicit definition."
  });
  if (!candidate.scales.length) findings.push({
    code: "SEM_SCALE_REQUIRED", severity: "ERROR",
    message: "At least one explicit semantic scale is required."
  });
  if (!candidate.provenance.length) findings.push({
    code: "SEM_PROVENANCE_REQUIRED", severity: "ERROR",
    message: "Canonical semantic concepts require provenance."
  });
  if (candidate.epistemicState === "UNKNOWN") findings.push({
    code: "SEM_UNKNOWN_CANNOT_DEFINE_CANON", severity: "ERROR",
    message: "UNKNOWN cannot be promoted into a canonical semantic definition."
  });
  return findings;
}

export class SemanticCurator {
  constructor(private readonly registry: SemanticRegistry) {}

  review(proposal: SemanticChangeProposal): CuratorReview {
    const findings: CuratorFinding[] = [];

    if (!proposal.provenance.length) {
      findings.push({
        code: "SEM_PROPOSAL_PROVENANCE_REQUIRED", severity: "ERROR",
        message: "Semantic change proposal has no provenance."
      });
    }

    if (proposal.kind === "ADD_CONCEPT" && proposal.candidate) {
      findings.push(...validateCandidate(proposal.candidate));

      const byName = this.registry.findByName(proposal.candidate.canonicalName);
      if (byName) {
        findings.push({
          code: "SEM_DUPLICATE_NAME", severity: "ERROR",
          message: `Concept already exists as ${byName.id}.`,
          conceptIds: [byName.id]
        });
        return this.result(proposal, "REJECT_DUPLICATE", findings, byName.id);
      }

      for (const alias of proposal.candidate.aliases ?? []) {
        const existing = this.registry.findByName(alias);
        if (existing) {
          findings.push({
            code: "SEM_ALIAS_COLLISION", severity: "ERROR",
            message: `Alias "${alias}" already resolves to ${existing.id}.`,
            conceptIds: [existing.id]
          });
        }
      }

      for (const mapping of proposal.candidate.mappings) {
        if (mapping.kind !== "EXACT") continue;
        const existing = this.registry.findByExternal(mapping.standard, mapping.externalId, mapping.version);
        if (existing && existing.id !== proposal.candidate.id) {
          findings.push({
            code: "SEM_EXTERNAL_EXACT_COLLISION", severity: "ERROR",
            message: `${mapping.standard}:${mapping.externalId} already maps exactly to ${existing.id}.`,
            conceptIds: [existing.id]
          });
        }
      }

      if (findings.some(f => f.severity === "ERROR")) {
        return this.result(proposal, "REJECT_UNSUPPORTED", findings);
      }

      findings.push({
        code: "SEM_NEW_CONCEPT_REQUIRES_HUMAN_AUTHORITY", severity: "WARNING",
        message: "Curator may recommend a concept but cannot canonize it autonomously."
      });
      return this.result(proposal, "REQUIRES_HUMAN_AUTHORITY", findings, proposal.candidate.id);
    }

    if (proposal.kind === "ADD_ALIAS" && proposal.targetId && proposal.alias) {
      const target = this.registry.get(proposal.targetId);
      if (!target) {
        findings.push({ code: "SEM_TARGET_NOT_FOUND", severity: "ERROR", message: "Target concept does not exist." });
        return this.result(proposal, "REJECT_UNSUPPORTED", findings);
      }
      const existing = this.registry.findByName(proposal.alias);
      if (existing) {
        const same = existing.id === target.id;
        findings.push({
          code: same ? "SEM_ALIAS_ALREADY_RESOLVES" : "SEM_ALIAS_COLLISION",
          severity: same ? "INFO" : "ERROR",
          message: same
            ? `Alias already resolves to ${target.id}.`
            : `Alias resolves to another concept: ${existing.id}.`,
          conceptIds: [existing.id]
        });
        return this.result(proposal, same ? "REUSE_EXISTING" : "REJECT_DUPLICATE", findings, existing.id);
      }
      return this.result(proposal, "REQUIRES_HUMAN_AUTHORITY", findings, target.id);
    }

    if (proposal.kind === "ADD_MAPPING" && proposal.targetId && proposal.mapping) {
      const target = this.registry.get(proposal.targetId);
      if (!target) {
        findings.push({ code: "SEM_TARGET_NOT_FOUND", severity: "ERROR", message: "Target concept does not exist." });
        return this.result(proposal, "REJECT_UNSUPPORTED", findings);
      }
      if (!proposal.mapping.provenance.length) {
        findings.push({
          code: "SEM_MAPPING_PROVENANCE_REQUIRED", severity: "ERROR",
          message: "External semantic mapping requires provenance."
        });
      }
      const existing = this.registry.findByExternal(
        proposal.mapping.standard, proposal.mapping.externalId, proposal.mapping.version
      );
      if (proposal.mapping.kind === "EXACT" && existing && existing.id !== target.id) {
        findings.push({
          code: "SEM_EXTERNAL_EXACT_COLLISION", severity: "ERROR",
          message: "External concept is already exactly mapped to another ARKI concept.",
          conceptIds: [existing.id, target.id]
        });
      }
      if (findings.some(f => f.severity === "ERROR")) {
        return this.result(proposal, "REJECT_UNSUPPORTED", findings);
      }
      return this.result(proposal, "REQUIRES_HUMAN_AUTHORITY", findings, target.id);
    }

    findings.push({
      code: "SEM_CHANGE_NOT_AUTO_SUPPORTED", severity: "WARNING",
      message: "This semantic mutation requires an explicit governed implementation path."
    });
    return this.result(proposal, "REQUIRES_HUMAN_AUTHORITY", findings, proposal.targetId);
  }

  resolveLabel(label: string): CuratorReview {
    const existing = this.registry.findByName(label);
    const proposalId = `resolve:${normalize(label)}`;
    if (existing) {
      return {
        proposalId, decision: "REUSE_EXISTING", findings: [{
          code: "SEM_EXISTING_CONCEPT", severity: "INFO",
          message: `"${label}" resolves to ${existing.id}.`, conceptIds: [existing.id]
        }], suggestedSemanticId: existing.id, canonicalMutation: false
      };
    }
    return {
      proposalId, decision: "PROPOSE_NEW", findings: [{
        code: "SEM_NO_CANONICAL_MATCH", severity: "WARNING",
        message: `"${label}" has no canonical match. Do not create one automatically.`
      }], canonicalMutation: false
    };
  }

  private result(
    proposal: SemanticChangeProposal,
    decision: CuratorReview["decision"],
    findings: CuratorFinding[],
    suggestedSemanticId?: CuratorReview["suggestedSemanticId"]
  ): CuratorReview {
    return { proposalId: proposal.proposalId, decision, findings, suggestedSemanticId, canonicalMutation: false };
  }
}
