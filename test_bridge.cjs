const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

async function main() {
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });

  console.log("Probando el puente del Copiloto...");
  try {
    const result = await client.copilotBridge.generateGeometry.mutate({
      projectId: "PRO-001",
      familyId: "FAM-HEALTH",
      variantId: "GENERAL",
      areaM2: 20000,
      capacity: 400,
      city: "Trujillo"
    });
    console.log("✅ Puente OK. Geometría recibida:");
    console.log(JSON.stringify(result, null, 2).substring(0, 1000) + "...");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}
main();
