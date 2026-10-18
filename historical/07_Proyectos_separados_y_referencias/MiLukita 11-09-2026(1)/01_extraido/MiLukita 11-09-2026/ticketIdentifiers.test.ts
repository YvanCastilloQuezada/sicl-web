import { describe, expect, it } from "vitest";
import { MARKET_POSITION_PREFIX, TICKET_IDENTIFIER_ALPHABET, buildHumanTicketId, isHumanTicketId, ticketPrefixFor } from "../shared/ticketIdentifiers";

describe("identificadores legibles de comprobante", () => {
  it("asigna prefijos estables de modalidad y subtipo", () => {
    expect(ticketPrefixFor("loteria_29")).toBe("AA");
    expect(ticketPrefixFor("loteria_39")).toBe("AB");
    expect(ticketPrefixFor("loteria_39")).toBe("AB");
    expect(ticketPrefixFor("loteria_49")).toBe("AC");
    expect(ticketPrefixFor("ruleta")).toBe("BA");
    expect(ticketPrefixFor("cartas")).toBe("EA");
    expect(MARKET_POSITION_PREFIX).toBe("FA");
  });

  it("distingue los subtipos simplificados de Ruleta y Bingo", () => {
    expect(ticketPrefixFor("ruleta_7")).toBe("BB");
    expect(ticketPrefixFor("ruleta_17")).toBe("BC");
    expect(ticketPrefixFor("ruleta_27")).toBe("BD");
    expect(ticketPrefixFor("ruleta_37")).toBe("BE");
    expect(ticketPrefixFor("bingo_flash")).toBe("DB");
    expect(ticketPrefixFor("bingo_keno")).toBe("DC");
    expect(ticketPrefixFor("bingo_75")).toBe("DD");
  });

  it("genera 15 caracteres seguros en cinco grupos, precedidos por el código de juego", () => {
    let index = 0;
    const id = buildHumanTicketId("AA", () => index++ % TICKET_IDENTIFIER_ALPHABET.length);
    expect(id).toBe("AA-ABC-DEF-GHJ-KLM-NPQ");
    expect(isHumanTicketId(id)).toBe(true);
    expect(isHumanTicketId("TKT-ABCDEFGHIJKLMNO")).toBe(false);
  });
});
