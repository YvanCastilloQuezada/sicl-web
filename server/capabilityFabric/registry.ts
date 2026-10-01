import type {
  CapabilityOperation,
  CapabilityProviderDescriptor,
  CapabilitySelectionFailure,
} from "./types";

export type CapabilitySelectionResult =
  | { ok: true; provider: CapabilityProviderDescriptor }
  | { ok: false; code: CapabilitySelectionFailure };

function validToken(value: string): boolean {
  return value.trim().length > 0 && value === value.trim();
}

export function validateProviderDescriptor(
  provider: CapabilityProviderDescriptor,
): CapabilitySelectionFailure | null {
  if (!validToken(provider.providerId)) return "PROVIDER_DESCRIPTOR_INVALID";
  if (!Number.isSafeInteger(provider.priority)) return "PROVIDER_DESCRIPTOR_INVALID";
  if (provider.authority !== "NON_CANONICAL_PROVIDER") return "PROVIDER_DESCRIPTOR_INVALID";
  if (provider.capabilities.length === 0 || provider.operations.length === 0) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  if (new Set(provider.capabilities).size !== provider.capabilities.length) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  if (new Set(provider.operations).size !== provider.operations.length) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  if (provider.capabilities.some(capability => !validToken(capability))) {
    return "PROVIDER_DESCRIPTOR_INVALID";
  }
  return null;
}

export function selectCapabilityProvider(
  providers: readonly CapabilityProviderDescriptor[],
  capability: string,
  operation: CapabilityOperation,
): CapabilitySelectionResult {
  if (!validToken(capability)) return { ok: false, code: "CAPABILITY_INVALID" };

  for (const provider of providers) {
    const failure = validateProviderDescriptor(provider);
    if (failure) return { ok: false, code: failure };
  }

  const capable = providers.filter(
    provider => provider.enabled && provider.capabilities.includes(capability),
  );
  if (capable.length === 0) return { ok: false, code: "NO_PROVIDER" };

  const operable = capable.filter(provider => provider.operations.includes(operation));
  if (operable.length === 0) return { ok: false, code: "OPERATION_UNSUPPORTED" };

  const provider = [...operable].sort(
    (a, b) => b.priority - a.priority || a.providerId.localeCompare(b.providerId),
  )[0];

  return { ok: true, provider };
}
