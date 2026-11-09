const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

async function main() {
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });

  try {
    const result = await client.copilot.e2e.mutate({
      projectId: "PRO-TERMINAL-001",
      name: "Terminal Terrestre Trujillo",
      typology: "terminal_terrestre",
      brief: "Terminal terrestre para 120 buses interprovinciales, 60 provinciales, 240 taxis",
      location: "Trujillo",
      jurisdiction: "RNE-PE",
      areaM2: 120000,
      capacity: 420,
    });
    
    console.log("=== RESULTADO ===");
    console.log(JSON.stringify(result, null, 2).substring(0, 1500));
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    if (err.data) console.error("Data:", JSON.stringify(err.data, null, 2).substring(0, 1000));
  }
}

main();
