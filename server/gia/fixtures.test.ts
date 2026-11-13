import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const TIPOLOGIAS = [
  "hospital", "educativo", "oficinas", "residencial", "comercial",
  "industrial", "cultural", "deportivo", "transporte", "hotelero",
  "clinica", "religioso", "penitenciario", "acueducto", "canal",
  "carretera", "represa", "puerto-lacustre", "puerto-maritimo", "aeropuerto",
  "almacen", "reactor", "centro-convenciones", "rascacielos", "multifamiliar",
  "museo", "universidad", "instituto-tecnologico", "centro-arte-cultura",
  "centro-nacional-tecnologia", "data-center-ia", "teatro", "biblioteca",
  "parque-infantil", "parque-diversiones", "restaurante", "centro-campestre",
  "parque-aguas", "centro-entretenimiento-digital",
] as const;
type Tipologia = typeof TIPOLOGIAS[number];

function loadFixture(tipologia: Tipologia) {
  const path = resolve(__dirname, `fixtures/${tipologia}.json`);
  return JSON.parse(readFileSync(path, "utf-8"));
}

describe.each(TIPOLOGIAS)("Fixture %s", (tipologia) => {
  it("carga y tiene la estructura de IntegratedArchitectInput", () => {
    const fixture = loadFixture(tipologia);

    expect(fixture.projectId).toBeDefined();
    expect(fixture.projectName).toBeDefined();
    expect(fixture.typology).toBeDefined();
    expect(fixture.brief).toBeDefined();
    expect(fixture.context).toBeInstanceOf(Object);
    expect(fixture.constraints).toBeInstanceOf(Array);
    expect(fixture.constraints.length).toBeGreaterThan(0);
    expect(fixture.activities).toBeInstanceOf(Array);
    expect(fixture.activities.length).toBeGreaterThanOrEqual(3);
    expect(fixture.relationships).toBeInstanceOf(Array);
    expect(fixture.relationships.length).toBeGreaterThanOrEqual(2);
    expect(fixture.subjects).toBeInstanceOf(Array);
    expect(fixture.conditions).toBeInstanceOf(Array);
    expect(fixture.unknowns).toBeInstanceOf(Array);
    expect(fixture.envelope.width).toBeGreaterThan(0);
    expect(fixture.envelope.height).toBeGreaterThan(0);
    expect(fixture.sourceIds).toBeInstanceOf(Array);
  });

  it("activities tienen id, name y capacity", () => {
    const fixture = loadFixture(tipologia);
    for (const activity of fixture.activities) {
      expect(activity.id).toBeDefined();
      expect(activity.name).toBeDefined();
      expect(activity.capacity).toBeGreaterThan(0);
    }
  });

  it("relationships tienen id, source, target, relation, subjects, control", () => {
    const fixture = loadFixture(tipologia);
    const activityIds = new Set(fixture.activities.map((a: { id: string }) => a.id));
    for (const rel of fixture.relationships) {
      expect(rel.id).toBeDefined();
      expect(rel.source).toBeDefined();
      expect(rel.target).toBeDefined();
      expect(rel.relation).toBeDefined();
      expect(rel.subjects).toBeInstanceOf(Array);
      expect(rel.control).toBeDefined();
      if (rel.source !== rel.target) {
        expect(activityIds.has(rel.source)).toBe(true);
        expect(activityIds.has(rel.target)).toBe(true);
      }
    }
  });
});
