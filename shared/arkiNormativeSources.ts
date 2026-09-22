export const ARKI_NORMATIVE_SOURCES_VERSION = "ARKI-NORMATIVE-SOURCES-1.0" as const;
export type NormativeSource = { id: string; country: string; code: string; title: string; authority: string; url: string; status: "REFERENCE_PENDING_VERIFICATION"; appliesTo: string[] };
export const ARKI_NORMATIVE_SOURCES: readonly NormativeSource[] = [
  { id: "SRC-PE-RNE", country: "PE", code: "RNE", title: "Reglamento Nacional de Edificaciones", authority: "MVCS", url: "https://www.gob.pe/institucion/vivienda/informes-publicaciones", status: "REFERENCE_PENDING_VERIFICATION", appliesTo: ["BUILDING", "SITE"] },
  { id: "SRC-PE-AIT", country: "PE", code: "A.010", title: "Condiciones generales de diseño", authority: "MVCS", url: "https://www.gob.pe/institucion/vivienda", status: "REFERENCE_PENDING_VERIFICATION", appliesTo: ["BUILDING"] },
  { id: "SRC-PE-EDU", country: "PE", code: "EDUCACION", title: "Criterios de diseño para locales educativos", authority: "MINEDU", url: "https://www.gob.pe/minedu", status: "REFERENCE_PENDING_VERIFICATION", appliesTo: ["EDUCATION"] },
  { id: "SRC-PE-SALUD", country: "PE", code: "SALUD", title: "Criterios de infraestructura y equipamiento de salud", authority: "MINSA", url: "https://www.gob.pe/minsa", status: "REFERENCE_PENDING_VERIFICATION", appliesTo: ["HEALTH"] },
  { id: "SRC-PE-TRANSPORTE", country: "PE", code: "TRANSPORTE", title: "Normativa sectorial de transporte", authority: "MTC", url: "https://www.gob.pe/mtc", status: "REFERENCE_PENDING_VERIFICATION", appliesTo: ["TRANSPORT"] },
  { id: "SRC-PE-PATRIMONIO", country: "PE", code: "PATRIMONIO", title: "Protección del patrimonio cultural", authority: "MINCUL", url: "https://www.gob.pe/cultura", status: "REFERENCE_PENDING_VERIFICATION", appliesTo: ["CULTURE", "WORSHIP", "URBANISM"] },
] as const;
export function normativeSourceCatalog() { return { version: ARKI_NORMATIVE_SOURCES_VERSION, count: ARKI_NORMATIVE_SOURCES.length, sources: ARKI_NORMATIVE_SOURCES, automaticAdoption: false, humanVerificationRequired: true }; }
