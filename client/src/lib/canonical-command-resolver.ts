import { normalizeLocalizedCommand } from "@/components/CommandBar";

type ResolutionType = "CANONICAL" | "LOCALIZED_ALIAS" | "SHORT_ALIAS" | "AMBIGUOUS" | "UNKNOWN";

type ShortcutEntry = { shortcut: string; canonical: string; description: string; sensitive?: boolean };

export const SHORTCUTS: ShortcutEntry[] = [
  { shortcut: "PRO-OPE", canonical: "/PROJECT OPEN", description: "Abrir proyecto" },
  { shortcut: "PRO-SET", canonical: "/PROJECT SET SCOPE", description: "Definir alcance" },
  { shortcut: "OBJ-SET", canonical: "/OBJECTIVE SET", description: "Definir objetivo" },
  { shortcut: "CON-SET", canonical: "/CONSTRAINT SET", description: "Definir restricción" },
  { shortcut: "FAC-SET", canonical: "/FACT SET", description: "Registrar hecho" },
  { shortcut: "ASS-SET", canonical: "/ASSUMPTION SET", description: "Registrar supuesto" },
  { shortcut: "EVI-ADD", canonical: "/EVIDENCE ADD", description: "Añadir evidencia" },
  { shortcut: "HUM-REV", canonical: "/HUMAN REVIEW", description: "Solicitar revisión humana" },
  { shortcut: "GEN-DES", canonical: "/GENERATE DESIGN", description: "Generar diseño" },
  { shortcut: "GEN-LIS", canonical: "/GENERATE LIST", description: "Listar generaciones" },
  { shortcut: "GEN-SHO", canonical: "/GENERATE SHOW", description: "Mostrar generación" },
  { shortcut: "GEN-MET", canonical: "/GENERATE METHODS", description: "Mostrar métodos" },
  { shortcut: "SIT-INT", canonical: "/SITE INTELLIGENCE", description: "Analizar sitio" },
  { shortcut: "REG-SHO", canonical: "/REGULATION SHOW", description: "Mostrar regulación" },
  { shortcut: "PAR-ETO", canonical: "/PARETO", description: "Explorar Pareto" },
  { shortcut: "SNA-CRE", canonical: "/SNAPSHOT CREATE", description: "Crear snapshot" },
  { shortcut: "STA-TUS", canonical: "/STATUS", description: "Consultar estado" },
  { shortcut: "HIS-TOR", canonical: "/HISTORY", description: "Consultar historial" },
  { shortcut: "DEC-REC", canonical: "/DECISION RECORD", description: "Registrar decisión humana", sensitive: true },
];

export type CommandResolution = {
  originalInput: string;
  resolvedCanonical: string | null;
  resolutionType: ResolutionType;
  locale: string;
  aliasUsed: string | null;
  ambiguityStatus: "NONE" | "AMBIGUOUS";
  validationStatus: "VALID" | "NEEDS_ARGUMENTS" | "UNKNOWN";
  candidates: string[];
  humanReviewRequired: boolean;
  note: string;
};

export function resolveCommandInput(input: string, locale = "es"): CommandResolution {
  const originalInput = input.trim();
  const upper = originalInput.toUpperCase();
  const shortcutMatches = SHORTCUTS.filter((entry) => upper === entry.shortcut.toUpperCase() || upper.startsWith(`${entry.shortcut.toUpperCase()} `));
  if (shortcutMatches.length > 1) {
    return { originalInput, resolvedCanonical: null, resolutionType: "AMBIGUOUS", locale, aliasUsed: null, ambiguityStatus: "AMBIGUOUS", validationStatus: "UNKNOWN", candidates: shortcutMatches.map((entry) => entry.canonical), humanReviewRequired: true, note: "Shortcut ambiguo; selecciona una operación canónica." };
  }
  const shortcut = shortcutMatches[0];
  const expanded = shortcut ? `${shortcut.canonical}${originalInput.slice(shortcut.shortcut.length)}` : originalInput;
  if (shortcut) {
    return { originalInput, resolvedCanonical: expanded, resolutionType: "SHORT_ALIAS", locale, aliasUsed: shortcut.shortcut, ambiguityStatus: "NONE", validationStatus: expanded.trim() === shortcut.canonical ? "NEEDS_ARGUMENTS" : "VALID", candidates: [shortcut.canonical], humanReviewRequired: true, note: shortcut.sensitive ? "La resolución no ejecuta la decisión; requiere Human Authority." : "Shortcut humano resuelto a comando canónico." };
  }
  const normalized = normalizeLocalizedCommand(originalInput, locale);
  if (normalized) {
    const type: ResolutionType = normalized.aliasUsed ? "LOCALIZED_ALIAS" : "CANONICAL";
    return { originalInput, resolvedCanonical: normalized.canonical, resolutionType: type, locale, aliasUsed: normalized.aliasUsed ? originalInput.split(/\s+/).slice(0, 2).join(" ") : null, ambiguityStatus: "NONE", validationStatus: "VALID", candidates: [normalized.canonical], humanReviewRequired: true, note: "La previsualización no modifica Project State." };
  }
  return { originalInput, resolvedCanonical: null, resolutionType: "UNKNOWN", locale, aliasUsed: null, ambiguityStatus: "NONE", validationStatus: "UNKNOWN", candidates: [], humanReviewRequired: true, note: "No existe correspondencia canónica; no se inventa un comando." };
}

export function shortcutSuggestions(input: string): ShortcutEntry[] {
  const query = input.trim().toLowerCase();
  return SHORTCUTS.filter((entry) => !query || entry.shortcut.startsWith(query) || entry.canonical.toLowerCase().includes(query)).slice(0, 8);
}
