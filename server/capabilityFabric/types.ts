export type CapabilityOperation =
  | "QUERY"
  | "ANALYZE"
  | "SIMULATE"
  | "PROPOSE"
  | "FALSIFY"
  | "VERIFY";

export type CapabilityIntegrationMode =
  | "REUSE"
  | "COMPOSE"
  | "WRAP"
  | "ADAPT"
  | "LEARN"
  | "ORACLE"
  | "EXTERNAL";

export type CapabilityAuthority = "NON_CANONICAL_PROVIDER";

export interface CapabilityProviderDescriptor {
  providerId: string;
  capabilities: readonly string[];
  operations: readonly CapabilityOperation[];
  integrationMode: CapabilityIntegrationMode;
  authority: CapabilityAuthority;
  priority: number;
  enabled: boolean;
}

export interface CapabilityRequest<TInput = unknown> {
  requestId: string;
  capability: string;
  operation: CapabilityOperation;
  input: TInput;
  selectedProviderId?: string;
}

export interface CapabilityEvidence {
  providerId: string;
  runtime: {
    observed: boolean;
    name: string;
    version: string | null;
  };
  capability: string;
  operation: CapabilityOperation;
  status: "OBSERVED" | "SIMULATED" | "UNKNOWN";
  diagnostics: readonly string[];
}

export interface CapabilityResult<TOutput = unknown> {
  requestId: string;
  providerId: string;
  capability: string;
  operation: CapabilityOperation;
  output: TOutput;
  evidence: CapabilityEvidence;
  canonicalMutation: false;
}

export type CapabilitySelectionFailure =
  | "CAPABILITY_INVALID"
  | "NO_PROVIDER"
  | "OPERATION_UNSUPPORTED"
  | "PROVIDER_DESCRIPTOR_INVALID"
  | "PROVIDER_SELECTION_REQUIRED"
  | "SELECTED_PROVIDER_UNAVAILABLE";
