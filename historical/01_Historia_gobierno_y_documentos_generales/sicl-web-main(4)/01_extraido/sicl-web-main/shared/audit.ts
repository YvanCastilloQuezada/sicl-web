const SENSITIVE_KEY = /(token|secret|authorization|password|credential)/i;

export function safeAuditData(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return Object.fromEntries(Object.entries(input as Record<string, unknown>).filter(([key]) => !SENSITIVE_KEY.test(key)).map(([key, value]) => [key, safeAuditValue(value)]));
}

function safeAuditValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(safeAuditValue);
  if (!value || typeof value !== "object") return value;
  return safeAuditData(value);
}
