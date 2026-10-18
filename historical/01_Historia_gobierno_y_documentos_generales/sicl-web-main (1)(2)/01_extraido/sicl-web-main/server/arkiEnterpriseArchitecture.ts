import { executeArkiUnifiedMotor, type UnifiedMotorInput, type UnifiedMotorResult } from "./arkiUnifiedMotor";

export type EnterpriseDomain =
  | "CAD_DOCUMENTATION" | "SIMULATION" | "DIGITAL_TWIN" | "CROSS_PROJECT_TRANSFER"
  | "GLOBAL_MULTISCALE" | "EXTERNAL_ECOSYSTEM" | "PYTHON_PLUGINS" | "SECURITY_ENTERPRISE";
export type Maturity = "CONTRACT_ONLY" | "PARTIAL" | "DEMONSTRATED";
export type ExportFormat = "DWG" | "DXF" | "IFC" | "RVT" | "GLB" | "GIS" | "PDF" | "CSV";

export type EnterpriseCapability = {
  id: string; domain: EnterpriseDomain; name: string; maturity: Maturity;
  status: "AVAILABLE" | "PLANNED" | "NOT_DEMONSTRATED";
  inputs: string[]; outputs: string[]; evidence: string[]; limits: string[];
};

export const ENTERPRISE_CAPABILITIES: EnterpriseCapability[] = [
  { id: "CAD-DOC-01", domain: "CAD_DOCUMENTATION", name: "Plantas, cortes, elevaciones, detalles y metrados conceptuales", maturity: "PARTIAL", status: "AVAILABLE", inputs: ["canonical project", "conceptual geometry"], outputs: ["SVG", "PDF", "JSON schedule"], evidence: ["docs/exams", "server/arkiAdvancedGeometry.ts"], limits: ["native DWG/Revit and permit-ready documentation not demonstrated"] },
  { id: "SIM-01", domain: "SIMULATION", name: "Simulation contract and result provenance", maturity: "CONTRACT_ONLY", status: "PLANNED", inputs: ["geometry", "climate", "loads", "occupancy"], outputs: ["simulation request", "UNKNOWN until solver connected"], evidence: ["enterprise roadmap"], limits: ["no physics solver is bundled"] },
  { id: "TWIN-01", domain: "DIGITAL_TWIN", name: "Operational building twin contract", maturity: "CONTRACT_ONLY", status: "PLANNED", inputs: ["BIM identity", "sensor feed", "maintenance events"], outputs: ["twin event envelope"], evidence: ["enterprise roadmap"], limits: ["no live sensor connector or anomaly engine demonstrated"] },
  { id: "TRANSFER-01", domain: "CROSS_PROJECT_TRANSFER", name: "Traceable cross-project transfer", maturity: "PARTIAL", status: "AVAILABLE", inputs: ["source project", "target project", "provenance"], outputs: ["TRANSFER/ADAPT/DO_NOT_TRANSFER/UNKNOWN"], evidence: ["server/arkiD62ReasoningHarness.ts"], limits: ["human review remains final"] },
  { id: "SCALE-01", domain: "GLOBAL_MULTISCALE", name: "Object to territory scale registry", maturity: "PARTIAL", status: "AVAILABLE", inputs: ["spatial scope", "scale transitions"], outputs: ["scale-aware project envelope"], evidence: ["server/siclCore.ts", "drizzle/schema.ts"], limits: ["cross-scale geometry federation not demonstrated"] },
  { id: "ADAPTER-OSS-01", domain: "EXTERNAL_ECOSYSTEM", name: "OSS native adapter registry and exchange-loss contract", maturity: "PARTIAL", status: "AVAILABLE", inputs: ["exchange envelope", "source and target format", "license metadata"], outputs: ["adapter selection", "validation diagnostic", "loss manifest"], evidence: ["server/arkiNativeAdapters.ts", "docs/arki-enterprise/ARKI_NATIVE_ADAPTERS_OSS_RESEARCH.md"], limits: ["workers are not installed; conversion and professional round-trip remain not demonstrated"] },
  { id: "ECO-01", domain: "EXTERNAL_ECOSYSTEM", name: "Connector boundary for BIM/CAD/GIS/ERP", maturity: "CONTRACT_ONLY", status: "PLANNED", inputs: ["versioned connector", "credentials", "mapping"], outputs: ["validated exchange envelope"], evidence: ["enterprise roadmap"], limits: ["no live Revit, AutoCAD, Rhino, GIS or ERP connector in this phase"] },
  { id: "PY-01", domain: "PYTHON_PLUGINS", name: "Versioned Python/plugin boundary", maturity: "CONTRACT_ONLY", status: "PLANNED", inputs: ["signed package", "declared permissions"], outputs: ["sandbox execution request"], evidence: ["enterprise roadmap"], limits: ["sandbox/runner is not installed"] },
  { id: "SEC-01", domain: "SECURITY_ENTERPRISE", name: "Tenant, roles, audit, backup and recovery contract", maturity: "PARTIAL", status: "AVAILABLE", inputs: ["user", "tenant", "audit event"], outputs: ["authorization decision", "trace event"], evidence: ["server/_core/trpc.ts", "drizzle/schema.ts"], limits: ["disaster recovery and production tenancy require deployment infrastructure"] },
];

export type EnterpriseRunInput = UnifiedMotorInput & { domains?: EnterpriseDomain[]; requestedExports?: ExportFormat[]; jurisdiction?: string };
export type EnterpriseRunResult = { architectureVersion: "ARKI-ENTERPRISE-ARCH-1.0"; domains: EnterpriseCapability[]; exports: Array<{ format: ExportFormat; status: "CONTRACT_ONLY" | "CONCEPTUAL" | "NOT_DEMONSTRATED" }>; motor: UnifiedMotorResult; unknowns: string[]; humanAuthority: "FINAL" };

export function planEnterpriseRun(input: EnterpriseRunInput): EnterpriseRunResult {
  const domains = input.domains?.length ? ENTERPRISE_CAPABILITIES.filter((c) => input.domains!.includes(c.domain)) : ENTERPRISE_CAPABILITIES;
  const motor = executeArkiUnifiedMotor(input);
  const exports = (input.requestedExports ?? []).map((format) => ({ format, status: format === "PDF" ? "CONCEPTUAL" : "NOT_DEMONSTRATED" } as const));
  return { architectureVersion: "ARKI-ENTERPRISE-ARCH-1.0", domains, exports, motor, unknowns: ["External solvers, live twins, native authoring formats and commercial connector execution remain UNKNOWN until integrated and tested."], humanAuthority: "FINAL" };
}

export function enterpriseCapabilityMatrix() { return ENTERPRISE_CAPABILITIES.map(({ id, domain, name, maturity, status }) => ({ id, domain, name, maturity, status })); }
