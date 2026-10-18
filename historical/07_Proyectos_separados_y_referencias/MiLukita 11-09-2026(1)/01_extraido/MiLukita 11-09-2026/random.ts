export class SeededRandom {
  private state: number;

  constructor(seed: string) {
    let value = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
      value ^= seed.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    this.state = value >>> 0;
  }

  next(): number {
    this.state += 0x6d2b79f5;
    let value = this.state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  integer(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) throw new Error("El límite del simulador debe ser un entero positivo.");
    return Math.floor(this.next() * maxExclusive);
  }

  unique(range: number, count: number, startAt = 1): number[] {
    if (count > range) throw new Error("No se puede seleccionar más valores que el rango disponible.");
    const pool = Array.from({ length: range }, (_, index) => index + startAt);
    const picks: number[] = [];
    while (picks.length < count) picks.push(pool.splice(this.integer(pool.length), 1)[0]);
    return picks.sort((left, right) => left - right);
  }
}
