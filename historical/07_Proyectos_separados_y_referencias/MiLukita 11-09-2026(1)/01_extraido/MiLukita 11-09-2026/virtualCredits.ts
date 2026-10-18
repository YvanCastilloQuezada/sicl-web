export const VIRTUAL_CREDIT_REFERENCE = {
  unit: "CRV",
  label: "crédito virtual",
  referenceCurrency: "PEN",
  referenceUnitsPerCredit: 1,
  virtualOnly: true,
  redeemable: false,
  hasMonetaryValue: false,
  migrationRequiresLegalApproval: true,
  migrationRequiresExplicitUserAgreement: true,
} as const;

export const VIRTUAL_CREDIT_NOTICE = "Los créditos virtuales no son dinero, no se pueden retirar ni convertir. La referencia interna PEN sirve únicamente para diseño y conciliación de una eventual migración autorizada.";
