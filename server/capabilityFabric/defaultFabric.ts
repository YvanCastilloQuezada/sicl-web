import { createCompasProvider } from "./compasAdapter";
import { createCompasWorkerTransport } from "./compasWorkerTransport";
import { CapabilityRouter } from "./router";
import type { CapabilityOperation, CapabilityProviderDescriptor } from "./types";

export const COMPAS_CORE_PROVIDER: CapabilityProviderDescriptor = Object.freeze({
  providerId: "compas-core-2.15.0",
  capabilities: Object.freeze(["COMPAS_RUNTIME_IDENTITY", "TRANSFORM_POINTS_3D"]),
  operations: Object.freeze(["VERIFY"] satisfies CapabilityOperation[]),
  integrationMode: "WRAP",
  authority: "NON_CANONICAL_PROVIDER",
  priority: 100,
  enabled: true,
});

export function createDefaultCapabilityRouter(): CapabilityRouter {
  return new CapabilityRouter([
    createCompasProvider(
      COMPAS_CORE_PROVIDER,
      createCompasWorkerTransport(),
    ),
  ]);
}
