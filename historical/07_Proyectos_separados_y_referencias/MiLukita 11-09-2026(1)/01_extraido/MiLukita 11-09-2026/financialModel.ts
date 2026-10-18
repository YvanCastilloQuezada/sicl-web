export type FinancialModelInput = {
  dailyPlays: number;
  ticketPriceSoles: number;
  rtp: number;
  gameTaxRate: number;
  maintenanceRate: number;
  iscRate: number;
  gatewayRate: number;
  marketingRate: number;
  daysPerMonth: number;
};

export const DEFAULT_FINANCIAL_MODEL: FinancialModelInput = {
  dailyPlays: 10_000,
  ticketPriceSoles: 1,
  rtp: 0.85,
  gameTaxRate: 0.12,
  maintenanceRate: 0.02,
  iscRate: 0.01,
  gatewayRate: 0.05,
  marketingRate: 0.2,
  daysPerMonth: 30,
};

export function calculateFinancialProjection(input: FinancialModelInput) {
  const monthlyPlays = input.dailyPlays * input.daysPerMonth;
  const revenue = monthlyPlays * input.ticketPriceSoles;
  const prizes = revenue * input.rtp;
  const grossHold = revenue - prizes;
  const gameTaxBase = grossHold * (1 - input.maintenanceRate);
  const gameTax = gameTaxBase * input.gameTaxRate;
  const isc = revenue * input.iscRate;
  const gateway = revenue * input.gatewayRate;
  const marketing = revenue * input.marketingRate;
  const contribution = grossHold - gameTax - isc - gateway - marketing;
  return {
    monthlyPlays,
    revenue,
    prizes,
    grossHold,
    gameTaxBase,
    gameTax,
    isc,
    gateway,
    marketing,
    contribution,
    contributionPerPlay: monthlyPlays ? contribution / monthlyPlays : 0,
    assumptions: { ...input },
    pilotOnly: true,
    disclaimer: "Modelo ilustrativo; tasas y costos requieren validación profesional y no representan dinero real.",
  };
}

export function calculateUnitEconomics(input: FinancialModelInput) {
  const projection = calculateFinancialProjection({ ...input, dailyPlays: 1, daysPerMonth: 1 });
  return { ...projection, plays: 1 };
}
