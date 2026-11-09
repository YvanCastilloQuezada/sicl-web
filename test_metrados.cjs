const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

// Importamos el motor (simulado en JS para esta prueba rápida)
async function main() {
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });

  console.log("Pidiendo geometría del hospital a ARKI...");
  const result = await client.parametricRuntime.generateDynamicBuilding.mutate({
    familyId: "FAM-HEALTH", variantId: "GENERAL",
    context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
    parameters: { areaM2: 20000, capacity: 400 }
  });

  const building = result.generation;
  const geo2d = building.geometry2d;
  const geo3d = building.geometry3d;

  console.log("\n📐 Calculando metrados...");
  
  const width = geo2d.widthM;
  const depth = geo2d.depthM;
  const floors = geo3d.floors;
  const height = geo3d.heightM;
  const footprint = geo2d.footprintM2;
  const perimeter = 2 * (width + depth);

  const areaTechada = footprint * floors;
  const muros = perimeter * height * floors;
  const losas = footprint * floors;
  const concretoLosas = losas * 0.20;
  const acero = concretoLosas * 100;

  console.log("=====================================");
  console.log("📊 RESUMEN DE METRADOS (Hospital)");
  console.log("=====================================");
  console.log(`Huella: ${footprint} m2`);
  console.log(`Área Techada Total: ${areaTechada} m2`);
  console.log(`Pisos: ${floors}`);
  console.log("-------------------------------------");
  console.log("ESTRUCTURAS:");
  console.log(`- Concreto en losas: ${concretoLosas.toFixed(2)} m3`);
  console.log(`- Acero estimado: ${acero.toFixed(2)} kg`);
  console.log("ARQUITECTURA:");
  console.log(`- Muros: ${muros.toFixed(2)} m2`);
  console.log(`- Pisos: ${areaTechada.toFixed(2)} m2`);
  console.log("=====================================");
  console.log("💰 PRESUPUESTO ESTIMADO:");
  const costo = (concretoLosas * 450) + (acero * 5.5) + (muros * 120) + (areaTechada * 65);
  console.log(`Total Estimado: S/ ${costo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`);
  console.log("=====================================");
}
main().catch(console.error);
