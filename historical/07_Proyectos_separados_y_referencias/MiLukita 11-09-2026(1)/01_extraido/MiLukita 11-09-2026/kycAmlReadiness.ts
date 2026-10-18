export const KYC_AML_READINESS = {
  version: "v1.0.0",
  enabled: false,
  provider: null,
  pilotOnly: true,
  collectsPersonalData: false,
  storesDocumentBytes: false,
  acceptsWebhooks: false,
  blocksVirtualPlay: false,
  activationPrerequisites: [
    "Proveedor seleccionado y contrato de tratamiento de datos vigente.",
    "Revisión legal, privacidad, conservación y eliminación aprobadas.",
    "Credenciales sandbox, firma de webhook e idempotencia verificadas.",
    "Política de consentimiento, soporte y canal de apelación publicados.",
    "Decisión expresa de abandonar el piloto exclusivamente virtual.",
  ],
  dataBoundary: "El piloto no recibe documentos, imágenes, números de identidad, direcciones, biometría ni resultados de verificación.",
} as const;

export type KycAmlFutureStatus = "disabled" | "not_started" | "provider_selected" | "in_review" | "verified" | "rejected" | "expired" | "manual_review";

export type KycAmlFutureProviderEvent = {
  providerCaseReference: string;
  providerEventId: string;
  status: Exclude<KycAmlFutureStatus, "disabled" | "not_started" | "provider_selected">;
  receivedAt: string;
};

export function getKycAmlReadiness() {
  return KYC_AML_READINESS;
}

export function assertKycAmlIntegrationDisabled() {
  if (!KYC_AML_READINESS.enabled) throw new Error("KYC/AML no está operativo en este piloto: no se aceptan proveedor, webhook ni datos personales.");
}
