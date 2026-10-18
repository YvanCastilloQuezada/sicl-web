const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

function randomIndex(max: number): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function generateProjectId(): string {
  const letters = Array.from({ length: 6 }, () => LETTERS[randomIndex(LETTERS.length)]).join("");
  const numbers = Array.from({ length: 6 }, () => DIGITS[randomIndex(DIGITS.length)]).join("");
  return `${letters.slice(0, 3)}-${letters.slice(3)}-${numbers.slice(0, 3)}-${numbers.slice(3)}`;
}

export function isProjectId(value: string): boolean {
  return /^[A-Z]{3}-[A-Z]{3}-\d{3}-\d{3}$/.test(value.trim().toUpperCase());
}

export function ensureProjectId(value?: string | null): string {
  const normalized = value?.trim().toUpperCase() ?? "";
  return isProjectId(normalized) ? normalized : generateProjectId();
}
