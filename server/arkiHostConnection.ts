import { createHash } from "node:crypto";

export type ArkiHostKind = "REVIT" | "DYNAMO";
export type HostConnectionStatus = "CONFIGURATION_VALID" | "CONFIGURATION_INVALID" | "SERVER_HOST_PENDING";
const PRIVATE_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

export function validateHostEndpoint(input: { kind: ArkiHostKind; endpoint: string; hostId?: string; capabilities: string[] }) {
  let url: URL;
  try { url = new URL(input.endpoint); } catch { return { status: "CONFIGURATION_INVALID" as const, reason: "INVALID_URL", kind: input.kind, requiresHttps: true };
  }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:") return { status: "CONFIGURATION_INVALID" as const, reason: "HTTPS_REQUIRED", kind: input.kind, requiresHttps: true };
  if (PRIVATE_HOSTS.has(host) || host.endsWith(".local") || /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)) return { status: "CONFIGURATION_INVALID" as const, reason: "PRIVATE_OR_LOCAL_ENDPOINT_NOT_ALLOWED", kind: input.kind, requiresHttps: true };
  const required = input.kind === "REVIT" ? ["revit-export", "shared-coordinates", "parameter-map"] : ["dynamo-run", "revit-transaction-guard"];
  const missingCapabilities = required.filter((capability) => !input.capabilities.includes(capability));
  return { status: missingCapabilities.length ? "CONFIGURATION_INVALID" as const : "CONFIGURATION_VALID" as const, kind: input.kind, hostId: input.hostId ?? "UNNAMED_HOST", endpoint: `${url.origin}${url.pathname}`, requiredCapabilities: required, missingCapabilities, tokenMustRemainServerSide: true as const, noBrowserSecretStorage: true as const, humanReviewRequired: true as const };
}

export function hostConnectionCatalog() {
  return { schema: "ARKI-HOST-CONNECTION-1.0", hosts: [{ kind: "REVIT" as const, envEndpoint: "ARKI_REVIT_HOST_URL", envToken: "ARKI_REVIT_HOST_TOKEN", capabilities: ["revit-export", "shared-coordinates", "parameter-map"] }, { kind: "DYNAMO" as const, envEndpoint: "ARKI_DYNAMO_WORKER_URL", envToken: "ARKI_DYNAMO_WORKER_TOKEN", capabilities: ["dynamo-run", "revit-transaction-guard"] }], policy: ["Only HTTPS endpoints", "No localhost/private network endpoints from the public app", "Tokens are server-side only", "Validate before execute", "Execution/export requires explicit human approval", "Host health is not proof of model correctness"], humanReviewRequired: true as const };
}

export function buildHostConnectionRequest(input: { kind: ArkiHostKind; endpoint: string; hostId: string; capabilities: string[] }) {
  const validation = validateHostEndpoint(input);
  return { schema: "ARKI-HOST-CONNECTION-REQUEST-1.0", requestId: `HOST-${createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16)}`, validation, action: validation.status === "CONFIGURATION_VALID" ? "ADMIN_MUST_CONFIGURE_SERVER_SECRET" as const : "CORRECT_CONFIGURATION" as const, execution: "DISABLED_UNTIL_SERVER_HOST_AND_HUMAN_REVIEW" as const };
}

export function selfCareContract() {
  return { schema: "ARKI-SELF-CARE-1.0", modes: ["PROPOSE_ONLY", "OWNER_APPROVED_CHANGE", "EMERGENCY_SAFE_DEGRADE"] as const, automaticActions: ["detect", "isolate", "preserve evidence", "degrade safely", "prepare patch proposal"], forbiddenAutomaticActions: ["modify canonical knowledge", "change permissions", "rotate owner access", "execute arbitrary code", "publish changes", "self-approve repair", "erase audit evidence"], requiredApproval: "Explicit owner approval after a human-readable change list", oneMotor: true as const, failClosed: true as const };
}
