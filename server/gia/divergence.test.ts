import { describe, expect, it } from "vitest";
import { passesGIA002, divergence, type Parti } from "./divergence";

// Fixtures: 3 PARTIs de un hospital
const partiA: Parti = {
  id: "PARTI-A",
  spaces: [
    { id: "s1", type: "EMERGENCY", zone: "PUBLIC" },
    { id: "s2", type: "TRIAGE", zone: "PUBLIC" },
    { id: "s3", type: "ICU", zone: "CLINICAL" },
    { id: "s4", type: "SURGERY", zone: "CLINICAL" },
    { id: "s5", type: "WASTE", zone: "SERVICE" },
  ],
  edges: [
    { a: "s1", b: "s2" },
    { a: "s2", b: "s3" },
    { a: "s3", b: "s4" },
    { a: "s4", b: "s5" },
  ],
  accessOrder: ["EMERGENCY", "TRIAGE", "ICU", "SURGERY", "WASTE"],
};

const partiB: Parti = {
  id: "PARTI-B",
  spaces: [
    { id: "s1", type: "EMERGENCY", zone: "PUBLIC" },
    { id: "s2", type: "TRIAGE", zone: "PUBLIC" },
    { id: "s3", type: "ICU", zone: "CLINICAL" },
    { id: "s4", type: "SURGERY", zone: "CLINICAL" },
    { id: "s5", type: "WASTE", zone: "SERVICE" },
  ],
  edges: [
    { a: "s1", b: "s2" },
    { a: "s2", b: "s4" }, // diferente orden
    { a: "s4", b: "s3" }, // diferente orden
    { a: "s3", b: "s5" },
  ],
  accessOrder: ["EMERGENCY", "TRIAGE", "SURGERY", "ICU", "WASTE"], // orden diferente
};

const partiC: Parti = {
  id: "PARTI-C",
  spaces: [
    { id: "s1", type: "EMERGENCY", zone: "PUBLIC" },
    { id: "s2", type: "TRIAGE", zone: "PUBLIC" },
    { id: "s3", type: "ICU", zone: "CLINICAL" },
    { id: "s4", type: "SURGERY", zone: "CLINICAL" },
    { id: "s5", type: "WASTE", zone: "SERVICE" },
  ],
  edges: [
    { a: "s1", b: "s2" },
    { a: "s2", b: "s3" },
    { a: "s3", b: "s4" },
    { a: "s4", b: "s5" },
  ],
  accessOrder: ["EMERGENCY", "TRIAGE", "ICU", "SURGERY", "WASTE"],
};

// PARTI C es idéntico a A en topología y orden, pero diferente en asignación de zonas
const partiD: Parti = {
  id: "PARTI-D",
  spaces: [
    { id: "s1", type: "EMERGENCY", zone: "CLINICAL" }, // zona diferente
    { id: "s2", type: "TRIAGE", zone: "PUBLIC" },
    { id: "s3", type: "ICU", zone: "PUBLIC" }, // zona diferente
    { id: "s4", type: "SURGERY", zone: "CLINICAL" },
    { id: "s5", type: "WASTE", zone: "SERVICE" },
  ],
  edges: [
    { a: "s1", b: "s2" },
    { a: "s2", b: "s3" },
    { a: "s3", b: "s4" },
    { a: "s4", b: "s5" },
  ],
  accessOrder: ["EMERGENCY", "TRIAGE", "ICU", "SURGERY", "WASTE"],
};

describe("GIA-002 — divergencia entre PARTIs", () => {
  it("PARTI A y B son divergentes (orden de acceso y topología)", () => {
    const { m1, m2, m3 } = divergence(partiA, partiB);
    // M2 (secuencia) debe ser > 0.30
    expect(m2).toBeGreaterThan(0.30);
    // Al menos 2 métricas deben cumplir
    const votes = [m1 >= 0.25, m2 >= 0.30, m3 <= 0.70].filter(Boolean).length;
    expect(votes).toBeGreaterThanOrEqual(2);
  });

  it("PARTI A y C son idénticos (divergencia ~0)", () => {
    const { m1, m2 } = divergence(partiA, partiC);
    expect(m1).toBeLessThan(0.25);
    expect(m2).toBeLessThan(0.30);
  });

  it("PARTI A y D divergen en esquema funcional (zonas)", () => {
    const { m3 } = divergence(partiA, partiD);
    // ARI debe ser < 0.70
    expect(m3).toBeLessThan(0.70);
  });

  it("GIA-002 PASA si al menos un par es realmente divergente", () => {
    const result = passesGIA002([partiA, partiB, partiC]);
    expect(result.pass).toBe(true);
    // Al menos un par debe tener votes >= 2
    expect(result.details.some((d) => d.votes >= 2)).toBe(true);
  });

  it("GIA-002 FALLA si todas las alternativas son cosméticas (idénticas)", () => {
    const result = passesGIA002([partiA, partiC]);
    // A y C son idénticos, así que no debería pasar
    expect(result.pass).toBe(false);
  });
});
