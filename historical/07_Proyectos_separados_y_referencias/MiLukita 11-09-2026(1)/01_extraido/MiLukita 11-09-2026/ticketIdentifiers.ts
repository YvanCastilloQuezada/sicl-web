export const TICKET_IDENTIFIER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type TicketIdentifierGameType = "ruleta" | "ruleta_7" | "ruleta_17" | "ruleta_27" | "ruleta_37" | "jackpot" | "bingo" | "bingo_flash" | "bingo_keno" | "bingo_75" | "loteria" | "loteria_19" | "loteria_29" | "loteria_29_cons" | "loteria_39" | "loteria_39_5" | "loteria_39_cons" | "loteria_49" | "loteria_49_cons" | "loteria_59" | "loteria_59_cons" | "cartas" | "sueldo_vida" | "raspa_digital" | "pick_3" | "pick_4" | "loto_diario" | "loto_express";

export const TICKET_PREFIXES: Record<TicketIdentifierGameType, string> = {
  loteria_19: "AF",
  loteria_29: "AA",
  loteria_29_cons: "AG",
  loteria_39: "AB",
  loteria_39_5: "AK",
  loteria_39_cons: "AH",
  loteria_49: "AC",
  loteria_49_cons: "AI",
  loteria_59: "AD",
  loteria_59_cons: "AJ",
  loteria: "AE",
  ruleta: "BA",
  ruleta_7: "BB",
  ruleta_17: "BC",
  ruleta_27: "BD",
  ruleta_37: "BE",
  jackpot: "CA",
  bingo: "DA",
  bingo_flash: "DB",
  bingo_keno: "DC",
  bingo_75: "DD",
  cartas: "EA",
  sueldo_vida: "GA",
  raspa_digital: "GB",
  pick_3: "GC",
  pick_4: "GD",
  loto_diario: "GE",
  loto_express: "GF",
};

export const MARKET_POSITION_PREFIX = "FA";

export function ticketPrefixFor(gameType: TicketIdentifierGameType) {
  return TICKET_PREFIXES[gameType];
}

export function buildHumanTicketId(prefix: string, nextIndex: (upperExclusive: number) => number) {
  const suffix = Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => TICKET_IDENTIFIER_ALPHABET[nextIndex(TICKET_IDENTIFIER_ALPHABET.length)]).join("")).join("-");
  return `${prefix}-${suffix}`;
}

export function isHumanTicketId(value: string) {
  return /^(?:AA|AB|AC|AD|AE|AF|AG|AH|AI|AJ|AK|BA|BB|BC|BD|BE|CA|DA|DB|DC|DD|EA|FA|GA|GB|GC|GD|GE|GF)-[A-HJ-NP-Z2-9]{3}(?:-[A-HJ-NP-Z2-9]{3}){4}$/.test(value);
}
