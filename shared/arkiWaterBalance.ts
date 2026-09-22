export const ARKI_WATER_BALANCE_VERSION = "ARKI-WATER-BALANCE-1.0" as const;

export type WaterBalanceInput = {
  precipitationAnnualMm: number;
  catchmentRoofAreaM2: number;
  consumptionLitersPerPersonDay: number;
  annualVisitors: number;
  residents: number;
  daysPerYear?: number;
  collectionCoefficient?: number;
  location?: string;
  projectLocation?: string;
};

export type WaterBalanceResult = {
  version: typeof ARKI_WATER_BALANCE_VERSION;
  inputs: WaterBalanceInput;
  calculations: {
    precipitationDepthM: number;
    grossRainwaterCaptureM3PerYear: number;
    visitorConsumptionM3PerYear: number;
    residentConsumptionM3PerYear: number;
    totalConsumptionM3PerYear: number;
    netBalanceM3PerYear: number;
  };
  missingData: string[];
  warnings: string[];
  recommendation: string;
  status: "PRELIMINARY_BALANCE" | "BLOCKED_INSUFFICIENT_DATA";
  humanReviewRequired: true;
};

function finiteNonNegative(name: string, value: number) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a finite non-negative number`);
}

export function calculateAnnualWaterBalance(input: WaterBalanceInput): WaterBalanceResult {
  finiteNonNegative("precipitationAnnualMm", input.precipitationAnnualMm);
  finiteNonNegative("catchmentRoofAreaM2", input.catchmentRoofAreaM2);
  finiteNonNegative("consumptionLitersPerPersonDay", input.consumptionLitersPerPersonDay);
  finiteNonNegative("annualVisitors", input.annualVisitors);
  finiteNonNegative("residents", input.residents);
  const days = input.daysPerYear ?? 365;
  finiteNonNegative("daysPerYear", days);
  if (days === 0) throw new Error("daysPerYear must be greater than zero");
  if (input.collectionCoefficient !== undefined && (input.collectionCoefficient < 0 || input.collectionCoefficient > 1 || !Number.isFinite(input.collectionCoefficient))) throw new Error("collectionCoefficient must be between 0 and 1");

  const precipitationDepthM = input.precipitationAnnualMm / 1000;
  const grossRainwaterCaptureM3PerYear = precipitationDepthM * input.catchmentRoofAreaM2 * (input.collectionCoefficient ?? 1);
  const visitorConsumptionM3PerYear = input.annualVisitors * input.consumptionLitersPerPersonDay / 1000;
  const residentConsumptionM3PerYear = input.residents * input.consumptionLitersPerPersonDay * days / 1000;
  const totalConsumptionM3PerYear = visitorConsumptionM3PerYear + residentConsumptionM3PerYear;
  const netBalanceM3PerYear = grossRainwaterCaptureM3PerYear - totalConsumptionM3PerYear;

  const missingData: string[] = [];
  if (input.collectionCoefficient === undefined) missingData.push("FALTA_DATO: coeficiente real de captación (eficiencia de cubierta, primera escorrentía y pérdidas)");
  missingData.push("FALTA_DATO: distribución mensual/semanal de precipitación y demanda");
  missingData.push("FALTA_DATO: evaporación, fugas, calidad del agua y capacidad de almacenamiento");
  missingData.push("FALTA_DATO: consumos adicionales del parque (riego, limpieza, servicios, tratamiento y operación)");
  const warnings: string[] = [];
  if (input.location && input.projectLocation && input.location.toLowerCase() !== input.projectLocation.toLowerCase()) warnings.push(`La precipitación indicada corresponde a ${input.location}, mientras el proyecto figura en ${input.projectLocation}; el resultado no es transferible al sitio sin precipitación verificada.`);
  const locationWarning = warnings.length ? " Verificar la compatibilidad geográfica antes de usar el resultado." : "";
  return {
    version: ARKI_WATER_BALANCE_VERSION,
    inputs: input,
    calculations: { precipitationDepthM, grossRainwaterCaptureM3PerYear, visitorConsumptionM3PerYear, residentConsumptionM3PerYear, totalConsumptionM3PerYear, netBalanceM3PerYear },
    missingData,
    warnings,
    recommendation: `Usar este resultado sólo como balance anual bruto preliminar; no dimensionar cisternas ni declarar autosuficiencia hídrica hasta obtener los datos faltantes y validar el sitio.${locationWarning}`,
    status: "PRELIMINARY_BALANCE",
    humanReviewRequired: true,
  };
}

export const titicacaBalanceCase: WaterBalanceInput = { precipitationAnnualMm: 2800, catchmentRoofAreaM2: 3500, consumptionLitersPerPersonDay: 100, annualVisitors: 20000, residents: 50, location: "Iquitos", projectLocation: "Lago Titicaca" };
