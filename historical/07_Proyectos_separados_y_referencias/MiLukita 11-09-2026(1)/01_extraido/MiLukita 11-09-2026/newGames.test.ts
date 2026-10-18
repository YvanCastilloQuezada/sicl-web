import { describe, expect, it } from "vitest";
import { SCHEDULED_GAME_DEFINITIONS, UNIFORM_CREDIT_PRIZE_POLICY, calculateTicketPrize } from "./pilot";

describe("modalidades virtuales adicionales", () => {
  it("mantiene las cadencias declaradas con cron de seis campos", () => {
    expect(SCHEDULED_GAME_DEFINITIONS.loto_diario.cronExpression).toBe("0 0 0 * * *");
    expect(SCHEDULED_GAME_DEFINITIONS.pick_3.cronExpression).toBe("0 0,30 * * * *");
    expect(Object.values(SCHEDULED_GAME_DEFINITIONS).every((schedule) => schedule.cronExpression.split(" ").length === 6)).toBe(true);
  });

  it("liquida tablas enteras para premio recurrente, raspa y dígitos posicionales", () => {
    expect(calculateTicketPrize("sueldo_vida", [1, 2, 3, 4], { numbers: [1, 2, 3, 4] }, 1, 0, 82, {}, undefined, { sueldoVidaPrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.sueldoVidaPrizeTable })).toBe(21_912);
    expect(calculateTicketPrize("raspa_digital", [7], { winningPosition: 7 }, 1, 0, 82, {}, undefined, { raspaDigitalPrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.raspaDigitalPrizeTable })).toBe(17);
    expect(calculateTicketPrize("pick_3", [0, 0, 0], { digits: [0, 0, 0] }, 1, 0, 82, {}, undefined, { pick3PrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.pick3PrizeTable })).toBe(500);
    expect(calculateTicketPrize("pick_4", [2, 5, 7, 1], { digits: [2, 5, 7, 0] }, 1, 0, 82, {}, undefined, { pick4PrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.pick4PrizeTable })).toBe(58);
  });

  it("calcula Loto Diario y Loto Express por coincidencias sin mezclar sus tablas", () => {
    expect(calculateTicketPrize("loto_diario", [1, 2, 3, 4], { numbers: [1, 2, 3, 4] }, 1, 0, 82, {}, undefined, { lotoDiarioPrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.lotoDiarioPrizeTable })).toBe(2_000);
    expect(calculateTicketPrize("loto_express", [1, 2, 3], { numbers: [1, 2, 3] }, 1, 0, 82, {}, undefined, { lotoExpressPrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.lotoExpressPrizeTable })).toBe(60);
  });
});
