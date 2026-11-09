const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

async function main() {
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });

  // 1. Consultar las variantes de FAM-TRANSPORT
  const families = await client.parametricRuntime.dynamicFamilies.query({});
  const transport = families.families.find(f => f.id === "FAM-TRANSPORT");
  console.log("Variantes de FAM-TRANSPORT:", transport?.variants?.map(v => v.id));

  // 2. Generar 9 propuestas (rotando variantes y áreas)
  const variants = transport?.variants || [{ id: "BUS_TERMINAL" }];
  const strategies = ["Patio central", "Espina pública", "Núcleo compacto", "Borde climático", "Torre mixta", "Bloque lineal", "Patio lineal", "Espiral", "Mixto"];
  const propuestas = [];

  for (let i = 0; i < 9; i++) {
    const variant = variants[i % variants.length];
    const areaVar = 120000 + i * 1250;
    try {
      const result = await client.parametricRuntime.generateDynamicBuilding.mutate({
        familyId: "FAM-TRANSPORT",
        variantId: variant.id,
        context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
        parameters: { areaM2: areaVar, capacity: 420 },
      });
      if (result.generation) {
        propuestas.push({
          id: `PROP-${i + 1}`,
          title: `Alternativa ${String(i + 1).padStart(2, '0')}`,
          strategy: strategies[i % strategies.length],
          area: result.generation.geometry2d?.footprintM2 || areaVar,
          floors: result.generation.geometry3d?.floors || 2,
          building: result.generation,
        });
      }
    } catch (e) {
      console.error(`Error en propuesta ${i + 1}:`, e.message);
    }
  }

  console.log(`\n✅ ${propuestas.length} propuestas generadas:`);
  propuestas.forEach(p => console.log(`  - ${p.title}: ${p.area} m², ${p.floors} pisos, ${p.strategy}`));
}

main();
