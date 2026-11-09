const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

async function main() {
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });

  try {
    const building = await client.parametricRuntime.generateDynamicBuilding.mutate({
      familyId: "FAM-HEALTH",
      variantId: "GENERAL",
      context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
      parameters: { areaM2: 20000, capacity: 400, floors: 15 }
    });
    
    console.log("=== ESTRUCTURA DEL OBJETO building ===");
    console.log("Claves de nivel superior:", Object.keys(building));
    
    // Buscar geometry2d en cualquier nivel
    function findKey(obj, key, path = "") {
      if (!obj || typeof obj !== "object") return;
      if (obj[key]) {
        console.log(`✅ Encontrado '${key}' en: ${path || "raíz"}`);
        console.log(`   Valor:`, JSON.stringify(obj[key]).substring(0, 200));
      }
      for (const k of Object.keys(obj)) {
        findKey(obj[k], key, path ? `${path}.${k}` : k);
      }
    }
    
    findKey(building, "geometry2d");
    findKey(building, "geometry3d");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}
main();
