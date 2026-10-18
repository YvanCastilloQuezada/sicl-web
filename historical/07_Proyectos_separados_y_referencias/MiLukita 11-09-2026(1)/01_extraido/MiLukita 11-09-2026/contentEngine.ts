export type ContentFact = {
  gameName: string;
  state: string;
  countdownSeconds?: number | null;
  resultAvailable: boolean;
  virtualOnly: true;
};

export type ContentVariant = { text: string; source: "PRIMARY" | "FALLBACK" | "SAFE_FALLBACK"; virtualOnly: true };
export type ContentType = "OPENING" | "INTERACTION" | "TRANSITION" | "RESULT";
export type ContentItem = { id: string; version: "v2"; type: ContentType; text: string; tags: string[]; virtualOnly: true };

const CONTENT_V2: ContentItem[] = [
  { id: "v2-opening-01", version: "v2", type: "OPENING", text: "Bienvenidos a MiLukita. Revisa las reglas y participa con créditos virtuales.", tags: ["welcome", "safe"], virtualOnly: true },
  { id: "v2-interaction-01", version: "v2", type: "INTERACTION", text: "Tu pantalla móvil está conectada. La TV presenta el evento; el servidor valida la interacción.", tags: ["qr", "realtime"], virtualOnly: true },
  { id: "v2-transition-01", version: "v2", type: "TRANSITION", text: "Cambio de evento confirmado. Consulta el manifest y continúa desde tu celular.", tags: ["transition", "manifest"], virtualOnly: true },
  { id: "v2-result-01", version: "v2", type: "RESULT", text: "El resultado queda disponible con evidencia pública cuando el servidor cierra la ronda.", tags: ["result", "audit"], virtualOnly: true },
];

const BLOCKED_TERMS = /dinero real|retiro|ganancia garantizada|apuesta segura|premio garantizado/i;

export function getContent(version: string, type: ContentType): ContentItem[] {
  if (version !== "v2") return [];
  return CONTENT_V2.filter((item) => item.type === type).map((item) => ({ ...item, tags: [...item.tags] }));
}

export function rotateContent(type: ContentType, cursor = 0): ContentItem | null {
  const items = getContent("v2", type);
  return items.length ? items[Math.abs(cursor) % items.length] : null;
}

export function moderateContent(content: ContentItem | string): boolean {
  const text = typeof content === "string" ? content : content.text;
  return text.trim().length > 0 && text.length <= 500 && !BLOCKED_TERMS.test(text);
}

export function renderSafeContent(fact: ContentFact, primary?: string, fallback?: string): ContentVariant {
  const safe = fact.resultAvailable
    ? `El resultado verificado de ${fact.gameName} está disponible para consulta pública.`
    : fact.state === "OPEN"
      ? `La participación virtual de ${fact.gameName} está abierta.`
      : `El evento de ${fact.gameName} continúa bajo control del servidor.`;
  if (primary?.trim() && moderateContent(primary)) return { text: primary.trim(), source: "PRIMARY", virtualOnly: true };
  if (fallback?.trim() && moderateContent(fallback)) return { text: fallback.trim(), source: "FALLBACK", virtualOnly: true };
  return { text: safe, source: "SAFE_FALLBACK", virtualOnly: true };
}

export function contentCanChangeOfficialState(): false {
  return false;
}
