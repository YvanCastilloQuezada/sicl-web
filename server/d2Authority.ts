const D2_AUTHORITY_BRAND = Symbol("ARKI_D2_AUTHORITY");

export interface D2AuthorityToken {
  readonly intentId: string;
  readonly authority: "D2";
}

const issuedTokens = new WeakSet<object>();

export function issueD2AuthorityToken(intentId: string): D2AuthorityToken {
  if (!intentId.trim()) throw new Error("D2_AUTHORITY_INTENT_ID_REQUIRED");
  const token = Object.freeze({
    intentId,
    authority: "D2" as const,
    [D2_AUTHORITY_BRAND]: true,
  });
  issuedTokens.add(token);
  return token;
}

export function verifyD2AuthorityToken(
  token: D2AuthorityToken | undefined,
  intentId: string,
): boolean {
  return !!token &&
    typeof token === "object" &&
    issuedTokens.has(token as object) &&
    token.authority === "D2" &&
    token.intentId === intentId;
}
