import type {
  CapabilityProviderDescriptor,
  CapabilityRequest,
  CapabilityResult,
} from "./types";

export interface CapabilityProvider<TInput = unknown, TOutput = unknown> {
  descriptor: CapabilityProviderDescriptor;
  execute(request: CapabilityRequest<TInput>): Promise<CapabilityResult<TOutput>>;
}

/**
 * Boundary reserved for COMPAS-backed capabilities.
 *
 * COMPAS remains a non-canonical horizontal provider. This adapter does not
 * import Python, COMPAS, OCCT, CGAL, libigl, Triangle, Rhino, Blender, or any
 * host runtime. A concrete transport is injected later after its capability
 * and license/runtime contract is verified.
 */
export interface CompasTransport {
  invoke<TInput, TOutput>(
    capability: string,
    operation: CapabilityRequest<TInput>["operation"],
    input: TInput,
  ): Promise<{
    output: TOutput;
    evidenceStatus: "OBSERVED" | "SIMULATED" | "UNKNOWN";
    diagnostics?: readonly string[];
  }>;
}

export function createCompasProvider<TInput = unknown, TOutput = unknown>(
  descriptor: CapabilityProviderDescriptor,
  transport: CompasTransport,
): CapabilityProvider<TInput, TOutput> {
  if (descriptor.authority !== "NON_CANONICAL_PROVIDER") {
    throw new Error("COMPAS_PROVIDER_MUST_BE_NON_CANONICAL");
  }

  return {
    descriptor,
    async execute(request) {
      if (!descriptor.enabled || !descriptor.capabilities.includes(request.capability)) {
        throw new Error("COMPAS_CAPABILITY_NOT_DECLARED");
      }
      if (!descriptor.operations.includes(request.operation)) {
        throw new Error("COMPAS_OPERATION_NOT_DECLARED");
      }

      const observed = await transport.invoke<TInput, TOutput>(
        request.capability,
        request.operation,
        request.input,
      );

      return {
        requestId: request.requestId,
        providerId: descriptor.providerId,
        capability: request.capability,
        operation: request.operation,
        output: observed.output,
        evidence: {
          providerId: descriptor.providerId,
          capability: request.capability,
          operation: request.operation,
          status: observed.evidenceStatus,
          diagnostics: Object.freeze([...(observed.diagnostics ?? [])]),
        },
        canonicalMutation: false,
      };
    },
  };
}
