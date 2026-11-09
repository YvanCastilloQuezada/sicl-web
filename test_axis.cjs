const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

async function main() {
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });

  console.log("Generando 9 propuestas variando pisos (10 a 20)...");
  try {
    const result = await client.explorationAxis.generateFunnel.mutate({
      type: "PARAMETRIC",
      fixed: { areaM2: 20000, city: "Trujillo", jurisdiction: "RNE-PE", familyId: "FAM-HEALTH" },
      variable: { min: 10, max: 20, steps: 9, parameterName: "floors" },
      constraints: { requiredNorms: ["RNE-A.050"] }
    });
    
    console.log(`✅ ${result.proposals.length} propuestas generadas:`);
    result.proposals.forEach((p, idx) => {
      const gen = p.building?.generation || p.building;
      const geom2d = gen?.geometry2d || {};
      const geom3d = gen?.geometry3d || {};
      console.log(`  [${idx + 1}] Pisos: ${geom3d.floors} | Área: ${geom2d.footprintM2}m² | Costo: $${p.metrics.costEstimate}`);
    });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}
main();
