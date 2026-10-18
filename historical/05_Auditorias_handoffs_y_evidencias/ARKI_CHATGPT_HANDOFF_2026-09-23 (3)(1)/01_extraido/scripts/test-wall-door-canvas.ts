import { readFile } from "node:fs/promises";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const model = generateConstructionModel({ projectId: "demo-wall-door", name: "Demo muro y puerta", widthM: 12, depthM: 8, floors: 1, familyCategory: "RESIDENTIAL" });
const firstLevelWalls = model.walls.filter((wall) => wall.nivel_piso === 0);
const northWall = firstLevelWalls.find((wall) => wall.nombre.startsWith("Muro norte"));
const door = model.doors.find((item) => item.id === "door-1");
const source = await readFile(new URL("../client/src/canvas/CanvasPlanView.tsx", import.meta.url), "utf8");

assert(firstLevelWalls.length === 4, "el nivel 1 debe formar un cuadrado de cuatro muros");
assert(northWall !== undefined, "debe existir el muro norte");
assert(northWall?.aberturas.some((opening) => opening.tipo === "puerta" && opening.ancho_m === 0.9 && opening.alto_m === 2.1), "el muro norte debe tener la abertura real de puerta 0.90 x 2.10");
assert(door !== undefined, "debe existir una entidad puerta real");
assert(door?.tracesTo.includes(northWall?.id ?? ""), "la puerta debe estar relacionada con el muro norte");
assert(source.includes("wallSegments") && source.includes("arki-door-symbol"), "el canvas debe dibujar el muro abierto y el símbolo de puerta");

console.log(JSON.stringify({ status: "PASS", squareWalls: firstLevelWalls.length, doorId: door?.id, hostWallId: northWall?.id, opening: northWall?.aberturas.find((opening) => opening.tipo === "puerta") }));
