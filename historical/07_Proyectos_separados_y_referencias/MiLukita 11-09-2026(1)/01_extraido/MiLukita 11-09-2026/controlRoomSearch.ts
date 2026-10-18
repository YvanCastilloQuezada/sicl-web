export function matchesControlRoomSearch(query: string, values: readonly unknown[]): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;
  return values.some((value) => String(value ?? "").toLocaleLowerCase().includes(normalizedQuery));
}
