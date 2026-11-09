const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

async function main() {
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });

  console.log("Probando generateDynamicBuilding directamente...");
  try {
    const result = await client.parametricRuntime.generateDynamicBuilding.mutate({
      familyId: "FAM-HEALTH",
      variantId: "GENERAL",
      context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
      parameters: { areaM2: 20000, capacity: 400, floors: 15 }
    });
    console.log("✅ FUNCIONA. Pisos:", result.geometry3d?.floors, "| Área:", result.geometry2d?.footprintM2);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}
main();
