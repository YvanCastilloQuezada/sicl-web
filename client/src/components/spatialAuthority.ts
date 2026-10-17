/**
 * Visual classification only. Does not grant AGK/D2 authority.
 */
export type SpatialAuthority = {
  status: "EDUCATIONAL" | "DERIVED" | "UNKNOWN";
  label: string;
  explanation: string;
  canonicalVerified: false;
  mutationAuthorized: false;
};

export function classifySpatialAuthority(
  provenance: unknown,
  readOnly: unknown
): SpatialAuthority {
  const denied = {
    canonicalVerified: false as const,
    mutationAuthorized: false as const,
  };

  if (readOnly !== true) {
    return {
      ...denied,
      status: "UNKNOWN",
      label: "Autoridad no verificada",
      explanation: "Solo lectura no confirmada. Sin autorización de modificación o promoción.",
    };
  }

  if (provenance === "SYNTHETIC / EDUCATIONAL / MODEL PROJECT") {
    return {
      ...denied,
      status: "EDUCATIONAL",
      label: "Modelo educativo · No canónico",
      explanation: "Geometría sintética de exploración; no constituye geometría AGK verificada.",
    };
  }

  if (provenance === "DERIVED_FROM_PROJECT_ALTERNATIVE") {
    return {
      ...denied,
      status: "DERIVED",
      label: "Alternativa derivada · No canónica",
      explanation: "Representación analítica sin acreditación de snapshot D2 o promoción AGK.",
    };
  }

  return {
    ...denied,
    status: "UNKNOWN",
    label: "Procedencia desconocida · No verificada",
    explanation: "Procedencia ausente, desconocida o autoridad declarada sin evidencia.",
  };
}
