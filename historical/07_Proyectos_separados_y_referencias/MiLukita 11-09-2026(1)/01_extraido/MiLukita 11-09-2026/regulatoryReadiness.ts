export type RegulatoryReadinessControl = {
  id: "authorization" | "technical-certification" | "identity" | "aml" | "payments" | "geolocation" | "responsible-gaming" | "audit";
  label: string;
  status: "design-only";
  enabled: false;
  pilotBehavior: string;
  activationGate: string;
};

/**
 * Registro arquitectónico, no un sistema de cumplimiento activo.
 * Mantener cada integración desactivada evita que el piloto virtual procese
 * identidad, pagos, ubicación o documentos antes de una revisión legal y técnica.
 */
export const REGULATORY_READINESS: readonly RegulatoryReadinessControl[] = [
  { id: "authorization", label: "Autorización operativa", status: "design-only", enabled: false, pilotBehavior: "No ofrece ni explota juegos con dinero real.", activationGate: "Autorización aplicable y revisión jurídica independiente." },
  { id: "technical-certification", label: "Homologación y certificación técnica", status: "design-only", enabled: false, pilotBehavior: "Publica reglas, RTP y evidencia de sorteos exclusivamente como piloto virtual.", activationGate: "Certificación técnica y homologación de la plataforma y modalidades aplicables." },
  { id: "identity", label: "Identidad y mayoría de edad", status: "design-only", enabled: false, pilotBehavior: "No solicita documento, biometría ni verificación de edad para créditos virtuales.", activationGate: "Política aprobada, proveedor evaluado y evaluación de privacidad antes de recolectar datos." },
  { id: "aml", label: "Prevención LA/FT", status: "design-only", enabled: false, pilotBehavior: "No existe depósito, retiro, conversión ni monitoreo transaccional real.", activationGate: "Programa SPLAFT, roles, reportes y controles exigibles revisados por especialistas." },
  { id: "payments", label: "Pagos y conciliación", status: "design-only", enabled: false, pilotBehavior: "Los créditos no tienen valor monetario ni pasarela activa.", activationGate: "Autorización aplicable, contratos de proveedor, seguridad y pruebas de conciliación." },
  { id: "geolocation", label: "Geolocalización y controles territoriales", status: "design-only", enabled: false, pilotBehavior: "No se recopila ubicación precisa ni se bloquea por geografía.", activationGate: "Base legal, aviso de privacidad y reglas territoriales confirmadas por asesoría competente." },
  { id: "responsible-gaming", label: "Juego responsable", status: "design-only", enabled: false, pilotBehavior: "Incluye límites de sesión, pausas y avisos de piloto virtual.", activationGate: "Políticas, flujos de exclusión y monitoreo aprobados antes de actividad regulada." },
  { id: "audit", label: "Auditoría, cambio y trazabilidad", status: "design-only", enabled: false, pilotBehavior: "Mantiene reglas versionadas, HMAC, comprobantes y bitácora del piloto.", activationGate: "Alcance de auditoría, retención y evidencia definido con certificador y asesoría legal." },
] as const;

export const REGULATORY_READINESS_PILOT_GUARD = Object.freeze({
  virtualOnly: true,
  moneyFlowsEnabled: false,
  identityCollectionEnabled: false,
  preciseGeolocationEnabled: false,
  complianceClaim: "No activo ni homologado",
});
