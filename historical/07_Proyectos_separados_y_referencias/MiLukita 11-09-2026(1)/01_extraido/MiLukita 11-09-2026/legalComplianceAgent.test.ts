import { describe, expect, it } from "vitest";
import {
  LEGAL_ALLOWED_FUTURE_ACTIONS,
  LEGAL_AUDIT_RECORD_FIELDS,
  LEGAL_COMPLIANCE_AGENT,
  LEGAL_COMPLIANCE_DOMAINS,
  LEGAL_FORBIDDEN_ACTIONS,
  canLegalAgentExecute,
  legalAgentIsOperational,
  legalAgentStateSummary,
} from "./legalComplianceAgent";

describe("Legal & Compliance Intelligence Agent constitutional contract", () => {
  it("remains planned, disabled, not started and autonomy zero", () => {
    expect(LEGAL_COMPLIANCE_AGENT.status).toBe("PLANNED");
    expect(LEGAL_COMPLIANCE_AGENT.implementation.state).toBe("NOT_STARTED");
    expect(LEGAL_COMPLIANCE_AGENT.implementation.enabled).toBe(false);
    expect(LEGAL_COMPLIANCE_AGENT.implementation.production).toBe(false);
    expect(LEGAL_COMPLIANCE_AGENT.authority.level).toBe("ADVISORY_ONLY");
    expect(LEGAL_COMPLIANCE_AGENT.authority.autonomy).toBe(0);
    expect(LEGAL_COMPLIANCE_AGENT.authority.execution).toBe("DISABLED");
    expect(LEGAL_COMPLIANCE_AGENT.humanApproval.required).toBe(true);
    expect(LEGAL_COMPLIANCE_AGENT.coreAccess).toBe("NONE");
    expect(legalAgentIsOperational()).toBe(false);
  });

  it("never executes even future advisory actions in the current phase", () => {
    expect(LEGAL_ALLOWED_FUTURE_ACTIONS).toContain("ANALYZE");
    expect(LEGAL_ALLOWED_FUTURE_ACTIONS).toContain("PROPOSE");
    expect(canLegalAgentExecute("ANALYZE")).toBe(false);
    expect(canLegalAgentExecute("SIGN_CONTRACT")).toBe(false);
    expect(LEGAL_FORBIDDEN_ACTIONS).toContain("MODIFY_MJP_CORE");
    expect(LEGAL_FORBIDDEN_ACTIONS).toContain("MAKE_BINDING_LEGAL_DECISION");
  });

  it("reserva dominios y registro de evidencia sin crear subagentes", () => {
    expect(LEGAL_COMPLIANCE_DOMAINS).toContain("GAMING_REGULATION");
    expect(LEGAL_COMPLIANCE_DOMAINS).toContain("PRIVACY_DATA_PROTECTION");
    expect(LEGAL_COMPLIANCE_DOMAINS).toContain("LEGAL_CLAIMS_REPRESENTATION_GUARD");
    expect(LEGAL_AUDIT_RECORD_FIELDS).toContain("jurisdiction");
    expect(LEGAL_AUDIT_RECORD_FIELDS).toContain("humanReview");
    expect(LEGAL_AUDIT_RECORD_FIELDS).toContain("decisionMaker");
    expect(legalAgentStateSummary()).toMatchObject({ status: "PLANNED", autonomy: 0, execution: "DISABLED", domains: 13 });
  });
});
