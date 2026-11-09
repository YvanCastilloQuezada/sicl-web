const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');
const { execSync } = require('child_process');

async function main() {
  console.log("\n=============================================");
  console.log(" 🌟 INICIANDO PRUEBA DEL CICLO DE VIDA ARKI 2.0");
  console.log("=============================================\n");

  // 1. PRUEBA DE PRE-FACTIBILIDAD (Python)
  console.log("1️⃣  PRE-FACTIBILIDAD (Invierte.pe)");
  const pyScript = `
import sys
sys.path.append('${process.env.HOME}/ARKI/canonical/sicl-core/src')
from sicl.expediente.prefeasibility import PrefeasibilityEngine

engine = PrefeasibilityEngine(amount_uit=5000, sector='salud')
print(f"   Documento requerido: {engine.classify()['documento_requerido']}")
print(f"   Viabilidad: {engine.evaluate_viability(has_brecha=True, is_fraccionado=False, has_metodologia=True)['status']}")
  `;
  try {
    const pyOut = execSync(`python3 -c "${pyScript.replace(/"/g, '\\"')}"`).toString();
    console.log(pyOut);
  } catch (e) { console.error("Error en Python:", e.message); }

  // 2. PRUEBA DE DISEÑO (tRPC)
  console.log("2️⃣  DISEÑO GENERATIVO (Funnel 9-4-1)");
  const client = createTRPCProxyClient({
    links: [httpBatchLink({ url: 'http://127.0.0.1:8000/api/trpc', transformer: superjson })],
  });
  
  const building = await client.parametricRuntime.generateDynamicBuilding.mutate({
    familyId: "FAM-HEALTH", variantId: "GENERAL",
    context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
    parameters: { areaM2: 20000, capacity: 400 }
  });
  console.log(`   ✅ Generada propuesta: ${building.generation.name}`);
  console.log(`   📐 Geometría 2D: ${building.generation.geometry2d.widthM}x${building.generation.geometry2d.depthM} m`);

  // 3. PRUEBA DE EXPEDIENTE (Cálculo de Metrados)
  console.log("3️⃣  EXPEDIENTE TÉCNICO (Metrados y Costos)");
  const g2d = building.generation.geometry2d;
  const g3d = building.generation.geometry3d;
  const areaTechada = g2d.footprintM2 * g3d.floors;
  const muros = 2 * (g2d.widthM + g2d.depthM) * g3d.heightM * g3d.floors;
  const concretoLosa = g2d.footprintM2 * g3d.floors * 0.20;
  
  console.log(`   🧱 Área Techada: ${areaTechada} m2`);
  console.log(`   🧱 Concreto en losas: ${concretoLosa.toFixed(2)} m3`);
  console.log(`   🧱 Muros: ${muros.toFixed(2)} m2`);
  
  const costoTotal = (concretoLosa * 450) + (muros * 120) + (areaTechada * 65);
  console.log(`   💰 Presupuesto Estimado: S/ ${costoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`);

  console.log("\n=============================================");
  console.log(" 🎉 CICLO DE VIDA COMPLETADO CON ÉXITO");
  console.log("=============================================\n");
}

main().catch(console.error);
