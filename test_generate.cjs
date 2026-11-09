const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

async function main() {
  try {
    const client = createTRPCProxyClient({
      links: [
        httpBatchLink({
          url: 'http://127.0.0.1:8000/api/trpc',
          transformer: superjson,
        }),
      ],
    });

    console.log("Llamando a generateDynamicBuilding...");
    const result = await client.parametricRuntime.generateDynamicBuilding.mutate({
      familyId: "FAM-HEALTH",
      variantId: "GENERAL",
      context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
      parameters: { areaM2: 20000, capacity: 400 }
    });

    console.log("✅ RESULTADO RECIBIDO:");
    console.log(JSON.stringify(result, null, 2).substring(0, 1500) + "...");
    
    // Guardar para inspección
    require('fs').writeFileSync('generated_building.json', JSON.stringify(result, null, 2));
    console.log("\n📁 Guardado en generated_building.json");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    if (err.data) console.error("Data:", JSON.stringify(err.data, null, 2));
  }
}
main();
