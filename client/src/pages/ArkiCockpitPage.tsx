import { useState, useEffect } from "react";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { Send, Sparkles, Box, FileText, Activity, Shield, HardHat, Calculator, FileDown, Layers, BookOpen } from "lucide-react";
import ProfessionalFamilyViewer from "@/components/ProfessionalFamilyViewer";
import ProposalGallery from "@/components/ProposalGallery";

export default function ArkiCockpitPage() {
  
  const [preInversionOpen, setPreInversionOpen] = useState(false);
  const [ejecucionOpen, setEjecucionOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hola Yvan. Soy ARKI. ¿Qué construimos hoy? Puedes pedirme un hospital, analizar un terreno o revisar un expediente." }
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildingData, setBuildingData] = useState<any>(null);
  const [partis, setPartis] = useState<any[]>([]);
  const [bimOpen, setBimOpen] = useState(false);
  const [obrasOpen, setObrasOpen] = useState(false);
  const [jprdOpen, setJprdOpen] = useState(false);
  const [oeceOpen, setOeceOpen] = useState(false);
  const [estatalOpen, setEstatalOpen] = useState(false);
  const [estudiosOpen, setEstudiosOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const [expedienteOpen, setExpedienteOpen] = useState(false);
  const [tresDOpen, setTresDOpen] = useState(false);
  const [cuatroDOpen, setCuatroDOpen] = useState(false);
  const [cincoDOpen, setCincoDOpen] = useState(false);
  const [seisDOpen, setSeisDOpen] = useState(false);
  const [sieteDOpen, setSieteDOpen] = useState(false);
  const [generativoOpen, setGenerativoOpen] = useState(false);
  const [gpuUsage, setGpuUsage] = useState<number | null>(null);

  // Consultar el uso de la GPU cada 2 segundos (ruta REST)
  useEffect(() => {
    const fetchGpuUsage = async () => {
      try {
        const res = await fetch('/api/gpu-usage');
        const json = await res.json();
        const gpus = json.gpus || [];
        const rtx3060 = gpus.find((g: any) => g.name.includes("3060"));
        if (rtx3060) {
          setGpuUsage(rtx3060.usage);
        }
      } catch (e) {
        console.warn("Error obteniendo uso de GPU:", e);
      }
    };
    
    fetchGpuUsage();
    const interval = setInterval(fetchGpuUsage, 2000);
  
    return () => clearInterval(interval);
  }, []);
  const estudios = [
    "Acústico", "Asoleamiento", "Ciclo de Vida", "Cimentación", "Climatización (HVAC)",
    "Color y Acabados", "Contención de Taludes", "Costos", "Cronograma (4D)",
    "Cumplimiento Normativo (RNE)", "Demanda", "Drenaje", "Eficiencia Energética",
    "Eléctrico", "Ergonomía", "Estructura", "Evacuación", "Factibilidad",
    "Facility Management (7D)", "Flujos Peatonales", "Gases Medicinales", "Geotécnico",
    "Gestión de Residuos", "Hidráulico", "Hidrológico", "Huella de Carbono",
    "Impacto Ambiental", "Impacto Vial", "Impermeabilización", "Incendios", "Interiores",
    "Licencias y Permisos", "Logística", "Mantenimiento", "Materialidad",
    "Mecánica de Suelos", "Mercado", "Mobiliario", "Oferta", "Operación", "Paisajismo",
    "Partido Arquitectónico", "Pavimentos", "Presupuesto (5D)", "Programa Arquitectónico",
    "Riesgo Sísmico", "Riesgos Ambientales y de Desastres", "Riesgos Peatonales",
    "Sanitario", "Seguridad", "Seguridad y Salud en Obra", "Servidumbres", "Suelos",
    "Telecomunicaciones", "Títulos y Catastro", "Topográfico", "Tráfico", "Vientos", "Zonificación"
  ];
  const [copilotParams, setCopilotParams] = useState<any>(null);
  const handleHover = (menu: string, tooltip: string) => {
    setPreInversionOpen(false); setGenerativoOpen(false); setEstudiosOpen(false); setExpedienteOpen(false);
    setBimOpen(false); setObrasOpen(false); setJprdOpen(false); setOeceOpen(false);
    setTresDOpen(false); setCuatroDOpen(false); setCincoDOpen(false); setSeisDOpen(false); setSieteDOpen(false);
    setEjecucionOpen(false);
    
    if (menu === 'preinversion') setPreInversionOpen(true);
    if (menu === 'generativo') setGenerativoOpen(true);
    if (menu === 'estudios') setEstudiosOpen(true);
    if (menu === 'expediente') setExpedienteOpen(true);
    if (menu === 'bim') setBimOpen(true);
    if (menu === 'obras') setObrasOpen(true);
    if (menu === 'jprd') setJprdOpen(true);
    if (menu === 'oece') setOeceOpen(true);
    if (menu === '3d') setTresDOpen(true);
    if (menu === '4d') setCuatroDOpen(true);
    if (menu === '5d') setCincoDOpen(true);
    if (menu === '6d') setSeisDOpen(true);
    if (menu === '7d') setSieteDOpen(true);
    if (menu === 'ejecucion') setEjecucionOpen(true);

    setTooltipText(tooltip);
  };

  

  useEffect(() => {
    console.log('[ArkiCockpitPage] Partis actualizados:', partis.length);
  }, [partis]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsGenerating(true);

    try {
      // 1. Llamar al Copiloto real (Ollama + GPU) via sicl-core
      setMessages(prev => [...prev, { role: "assistant", text: "🧠 Consultando al copiloto (RTX 3060)..." }]);
      
      const copilotRes = await fetch('/api/core/v1/copilot/translate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(window as any).SICL_CORE_SERVICE_TOKEN || ''}`
        },
        body: JSON.stringify({ text: userMsg })
      });
      
      const copilotJson = await copilotRes.json();
      const intent = copilotJson?.data?.intent || copilotJson?.intent;
      
      if (intent) {
        let reply = "";
        if (intent.command && intent.command !== "UNKNOWN") {
          reply = `✅ Comando: ${intent.command}\n📝 ${intent.explanation || "Sin explicación."}\n🎯 Confianza: ${Math.round((intent.confidence || 0) * 100)}%`;
        } else if (intent.parameters && Object.keys(intent.parameters).length > 0) {
          // Mostrar resumen legible de los parámetros (no el JSON crudo)
          const p = intent.parameters;
          const resumen: string[] = [];
          if (p.tipo) resumen.push(`📌 Tipo: ${p.tipo}`);
          if (p.area_m2) resumen.push(`📐 Área: ${Number(p.area_m2).toLocaleString()} m²`);
          if (p.buses_interprovinciales) resumen.push(`🚌 Buses interprov.: ${p.buses_interprovinciales}`);
          if (p.buses_provinciales) resumen.push(`🚌 Buses prov.: ${p.buses_provinciales}`);
          if (p.taxis) resumen.push(`🚕 Taxis: ${p.taxis}`);
          if (p.estilo) resumen.push(`🎨 Estilo: ${p.estilo}`);
          if (p.areas_verdes) resumen.push(`🌳 Áreas verdes: Sí`);
          if (p.feng_shui) resumen.push(`☯️ Feng Shui: Sí`);
          if (p.parque_infantil) resumen.push(`🎠 Parque infantil: Sí`);
          if (p.presupuesto_uit) resumen.push(`💰 Presupuesto: ${Number(p.presupuesto_uit).toLocaleString()} UIT`);
          if (p.ciudad) resumen.push(`📍 Ciudad: ${p.ciudad}`);

          reply = `🏗️ Entendido. Esto es lo que voy a diseñar:\n\n${resumen.join("\n")}`;
        } else {
          reply = `🏗️ ${intent.explanation || "Necesito más información para diseñar."}`;
        }
        
        if (intent.questions && intent.questions.length > 0) {
          reply += `\n\n🏗️ Antes de diseñar, necesito saber:\n` + 
            intent.questions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n");
        }
        
        setMessages(prev => [...prev, { role: "assistant", text: reply }]);
        
        // ARKI: Si el copiloto extrajo parámetros, generar geometría con ELLOS
        const params = intent.parameters || {};
        setCopilotParams(params);
        const tipo = params.tipo || "otro";
        const areaM2 = params.area_m2 || params.areaM2 || 20000;
        const capacity = params.capacidad || params.capacity || 400;
        const ciudad = params.ciudad || params.city || "Trujillo";
        
        // Mapear tipo a familia
        // ARKI (el sistema) resuelve la familia y variante a partir del tipo
        // 1. Consultar las familias dinámicas disponibles
        const familiesRes = await fetch('/api/trpc/parametricRuntime.dynamicFamilies?batch=1&input=' + encodeURIComponent(JSON.stringify({"0":{"json":{}}})));
        const familiesJson = await familiesRes.json();
        const familiesList = familiesJson[0]?.result?.data?.json?.families || [];
        
        // 2. Buscar la familia que coincida con el tipo
        const tipoToFamilyKeyword: Record<string, string> = {
          "hospital": "HEALTH",
          "terminal_terrestre": "TRANSPORT",
          "aeropuerto": "TRANSPORT",
          "puerto": "INDUSTRY",
          "vivienda": "RESIDENTIAL",
          "oficina": "OFFICES",
          "comercio": "COMMERCE",
          "educacion": "EDUCATION",
          "deporte": "SPORT",
          "cultura": "CULTURE",
          "otro": "HEALTH"
        };
        const keyword = tipoToFamilyKeyword[tipo] || "HEALTH";
        const matchedFamily = familiesList.find((f: any) => f.id.includes(keyword));
        
        if (!matchedFamily) {
          setMessages(prev => [...prev, { role: "assistant", text: `❌ ARKI no encontró una familia para el tipo "${tipo}".` }]);
          return;
        }
        
        // 3. Elegir la variante (primera por defecto, o una específica si existe)
        const variantKeywords: Record<string, string> = {
          "terminal_terrestre": "BUS",
          "aeropuerto": "AIRPORT"
        };
        const variantKeyword = variantKeywords[tipo] || "";
        const matchedVariant = matchedFamily.variants.find((v: any) => v.id.includes(variantKeyword)) || matchedFamily.variants[0];
        
        const familyId = matchedFamily.id;
        const variantId = matchedVariant.id;
        const familyName = matchedFamily.name;
        const variantName = matchedVariant.name;


        if (params && Object.keys(params).length > 0 && tipo !== "otro") {
          setMessages(prev => [...prev, { role: "assistant", text: `🏗️ ARKI eligió: ${familyName} · ${variantName}\n📐 Generando geometría para ${tipo} de ${areaM2} m² en ${ciudad}...` }]);
          
                    // ARKI: Ejecutar el pipeline F1-F10 (Brain + D6.2) para generar las propuestas
          try {
            setMessages(prev => [...prev, { role: "assistant", text: "🧠 Ejecutando pipeline F1-F10 (Brain + D6.2) en el Core..." }]);
            
                        // Usar el cliente tRPC (mismo formato que Node)
            const trpcClient = createTRPCProxyClient<any>({
              links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
            });
            
            const result = await trpcClient.copilot.e2e.mutate({
              projectId: `PRO-TERMINAL-${Date.now()}`,
              name: `Proyecto ${tipo} en ${ciudad}`,
              typology: tipo,
              brief: userMsg,
              location: ciudad,
              jurisdiction: "RNE-PE",
              areaM2: areaM2,
              capacity: capacity,
            });
            
            const partis = result?.partis || [];
            console.log("[ARKI] Partis recibidos:", partis);
            
            // GENERAR 9 PROPUESTAS VARIANDO PARÁMETROS (misma variante BUS_TERMINAL)
            const familyMap: Record<string, { familyId: string; variantId: string }> = {
              "terminal_terrestre": { familyId: "FAM-TRANSPORT", variantId: "BUS_TERMINAL" },
              "hospital": { familyId: "FAM-HEALTH", variantId: "GENERAL" },
              "aeropuerto": { familyId: "FAM-TRANSPORT", variantId: "AIRPORT" },
              "vivienda": { familyId: "FAM-RESIDENTIAL", variantId: "GENERAL" },
              "otro": { familyId: "FAM-HEALTH", variantId: "GENERAL" },
            };
            const mapping = familyMap[tipo] || familyMap["otro"];
            const familyId = mapping.familyId;
            const variantId = mapping.variantId;
            
            let propuestasReales: any[] = [];
            try {
              const strategies = ["Patio central", "Espina pública", "Núcleo compacto", "Borde climático", "Torre mixta", "Bloque lineal", "Patio lineal", "Espiral", "Mixto"];
              
              // Generar 9 propuestas variando área y pisos (misma variante)
              
              // Crear cliente tRPC (igual que en Node)
              const trpcClient = createTRPCProxyClient<any>({
                links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
              });
              
              for (let i = 0; i < 9; i++) {
                const areaVar = areaM2 + i * 1250;
                const pisosVar = 2 + (i % 3);
                try {
                  const result = await trpcClient.parametricRuntime.generateDynamicBuilding.mutate({
                    familyId: familyId,
                    variantId: variantId,
                    context: { country: "PE", city: ciudad, jurisdiction: "RNE-PE" },
                    parameters: { areaM2: areaVar, capacity: capacity, floors: pisosVar },
                  });
                  if (result.generation) {
                    propuestasReales.push({
                      id: `PROP-${i + 1}`,
                      title: `Alternativa ${String(i + 1).padStart(2, '0')}`,
                      strategy: strategies[i % strategies.length],
                      metrics: {
                        area: result.generation.geometry2d?.footprintM2 || areaVar,
                        floors: result.generation.geometry3d?.floors || pisosVar,
                      },
                      building: result.generation,
                    });
                  }
                } catch (err) {
                  console.warn(`[ARKI] Error generando propuesta ${i + 1}:`, err);
                }
              }
              console.log(`[ARKI] ${propuestasReales.length} propuestas generadas para ${familyId}/${variantId}`);
            } catch (e) {
              console.error("[ARKI] Error generando propuestas:", e);
            }
            const partisToShow = propuestasReales.length > 0 ? propuestasReales : partis;
            console.log("[ARKI] Propuestas a mostrar:", partisToShow.map(p => ({title: p.title, area: p.metrics?.area, hasBuilding: !!p.building})));
            setPartis(partisToShow);
            console.log("[ARKI] setPartis ejecutado con:", partisToShow.length, "propuestas");
            (window as any).__ARKI_PARTIS__ = partisToShow;
            
            if (partis.length > 0) {
              setMessages(prev => [...prev, { 
                role: "assistant", 
                text: `✅ ARKI generó ${partis.length} propuestas (partis) para ${familyName}.\n📐 Revisa la galería en el centro para seleccionar las finalistas.` 
              }]);
            } else {
              setMessages(prev => [...prev, { role: "assistant", text: "⚠️ El pipeline no devolvió propuestas. Revisa los parámetros." }]);
            }
          } catch (e) {
            setMessages(prev => [...prev, { role: "assistant", text: `❌ Excepción en pipeline F1-F10: ${e instanceof Error ? e.message : "Desconocido"}` }]);
          }
        }
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: "El Copiloto no pudo procesar tu petición." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: `❌ Error: ${e instanceof Error ? e.message : "Desconocido"}` }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#061522] text-[#d7e8f2]">
        {/* BARRA SUPERIOR: TOOLTIPS + MENU */}
        <div className="w-full flex-shrink-0 z-[100] relative">
{/* BARRA DE TOOLTIPS */}
        <div className="w-full flex-shrink-0 flex items-center justify-center bg-[#0f172a] border-b border-[#1e293b] h-[28px] px-4 z-[110] relative">
          <div className="flex items-center gap-2">
            {tooltipText ? (
              <>
                <div className="bg-[#38bdf8] rounded-full p-0.5"><svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <span className="text-[#38bdf8] text-[10px] font-mono font-bold tracking-wide uppercase">{tooltipText}</span>
              </>
            ) : (
              <span className="text-[#64748b] text-[10px] font-mono uppercase tracking-widest">ARKI • Command Center</span>
            )}
          </div>
        </div>
        
        {/* MENÚ HORIZONTAL SUPERIOR */}
        <div className="flex items-center gap-1 border-b border-[#1e293b] bg-[#0f172a] h-[41px] px-2 whitespace-nowrap relative z-[100] overflow-visible">
          
          {/* PreInversión (Ahora menú) */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('preinversion', 'Fase de Preinversión: Ficha Técnica, Perfil y Viabilidad (Invierte.pe).')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${preInversionOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Calculator size={12} className={preInversionOpen ? 'text-black' : 'text-[#4ade80]'}/> PreInversión
            </button>
            {preInversionOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[220px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Ficha Técnica Estándar (FTE)</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Estudios de Preinversión (Perfil)</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Evaluación de Viabilidad</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Declaración de Viabilidad (DV)</button>
                </div>
              </div>
            )}
          </div>

          {/* Generativo */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('generativo', 'Herramientas de IA para crear familias y diseño paramétrico.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${generativoOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Layers size={12} className={generativoOpen ? 'text-black' : 'text-[#f472b6]'}/> Generativo
            </button>
            {generativoOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[220px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Fam. Generativas</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Diseño Paramétrico</button>
                </div>
              </div>
            )}
          </div>

          {/* Estudios */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('estudios', 'Catálogo de estudios técnicos, legales y de mercado (A-Z).')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${estudiosOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <BookOpen size={12} className={estudiosOpen ? 'text-black' : 'text-[#a78bfa]'}/> Estudios
            </button>
            {estudiosOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[250px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999] max-h-96 overflow-y-auto">
                <div className="p-2 flex flex-col space-y-1">
                  {estudios.map((e, i) => <button key={i} className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">{e}</button>)}
                </div>
              </div>
            )}
          </div>

          {/* Expediente Técnico */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('expediente', 'Documentación técnica completa para sector privado y estatal.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${expedienteOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <FileText size={12} className={expedienteOpen ? 'text-black' : 'text-[#38bdf8]'}/> Expediente Técnico
            </button>
            {expedienteOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[320px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <p className="text-[9px] text-[#64748b] uppercase px-2 py-1 font-bold">Expediente Privado</p>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Memoria Descriptiva</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Planos de Ejecución</button>
                  
                  <p className="text-[9px] text-[#64748b] uppercase px-2 py-1 mt-2 border-t border-[#1e293b] font-bold">Expediente Estatal (Invierte.pe)</p>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Memoria Descriptiva</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Estudios Básicos</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Planos de Ejecución</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Especificaciones Técnicas</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Presupuesto de Obra</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Análisis de Precios Unitarios (APU)</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Fórmula Polinómica</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Cronograma de Obra</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Estudio de Impacto Ambiental</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Plan de Seguridad y Salud</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Metrados y Cotizaciones</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">CIRA (Restos Arqueológicos)</button>
                </div>
              </div>
            )}
          </div>

          {/* 3D a 7D (Mantenidos como botones independientes) */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('3d', 'Modelado y Coordinación: Revisión IFC, Clash Detection y conversión.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${tresDOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Box size={12} className={tresDOpen ? 'text-black' : 'text-[#38bdf8]'}/> 3D
            </button>
            {tresDOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[200px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Revisar IFC</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Clash Detection</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Pdf / Dwg → IFC</button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('4d', 'Planificación Temporal: Cronogramas y simulación de tiempos.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${cuatroDOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Activity size={12} className={cuatroDOpen ? 'text-black' : 'text-[#4ade80]'}/> 4D
            </button>
            {cuatroDOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[200px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Cronograma</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Simul. Cronog.</button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('5d', 'Estimación de Costos: Metrados y presupuestos.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${cincoDOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Calculator size={12} className={cincoDOpen ? 'text-black' : 'text-[#fbbf24]'}/> 5D
            </button>
            {cincoDOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[200px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Metrados</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Presupuesto</button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('6d', 'Sostenibilidad: Análisis energético y huella de carbono.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${seisDOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Layers size={12} className={seisDOpen ? 'text-black' : 'text-[#a78bfa]'}/> 6D
            </button>
            {seisDOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[200px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Análisis Energético</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Sostenibilidad</button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('7d', 'Operación y Mantenimiento: Facility Management.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${sieteDOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Shield size={12} className={sieteDOpen ? 'text-black' : 'text-[#f472b6]'}/> 7D
            </button>
            {sieteDOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[200px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Mantenimiento</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Operación</button>
                </div>
              </div>
            )}
          </div>

          {/* Superv. BIM (Como en la foto) */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('bim', 'Metodología BIM completa.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${bimOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Shield size={12} className={bimOpen ? 'text-black' : 'text-[#38bdf8]'}/> Superv. BIM
            </button>
            {bimOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[220px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Revisar IFC</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Solucionar Interferencias</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Evaluar E.T. BIM</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Pdf / Dwg → IFC</button>
                </div>
              </div>
            )}
          </div>

          {/* Superv. Obras (Ampliado) */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('obras', 'Gestión de ejecución física, avances y valorizaciones.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${obrasOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <HardHat size={12} className={obrasOpen ? 'text-black' : 'text-[#fbbf24]'}/> Superv. Obras
            </button>
            {obrasOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[250px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Cuaderno de Obra Digital</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Registro de Avance Físico</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Valorizaciones</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Calendario de Avance (CAO)</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Adicionales de Obra</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Ampliaciones de Plazo</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Recepción de Obra (Acta)</button>
                </div>
              </div>
            )}
          </div>

          {/* JPRD (Ampliado) */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('jprd', 'Junta de Resolución de Disputas para contratos del Estado.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${jprdOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <FileText size={12} className={jprdOpen ? 'text-black' : 'text-[#f472b6]'}/> JPRD
            </button>
            {jprdOpen && (
              <div className="absolute top-full left-0 mt-1 w-max min-w-[260px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Solicitar JPRD (Obras &gt; 10M)</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Actas de Acuerdo</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Gestión de Cambios</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Designar Miembros</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Registrar Controversia</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Ver Resoluciones (Vinculantes)</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Historial de Disputas</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Audiencias de JPRD</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Laudos Arbitrales</button>
                </div>
              </div>
            )}
          </div>

          {/* Concurso/OECE (Ampliado) */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('oece', 'Procesos de licitación pública según normativa OECE.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${oeceOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <Shield size={12} className={oeceOpen ? 'text-black' : 'text-[#a78bfa]'}/> Concurso/OECE
            </button>
            {oeceOpen && (
              <div className="absolute top-full right-0 mt-1 w-max min-w-[250px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Conc. Arq. Priv.</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Conc. Arq. Estado</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Licit. Estudios</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Licit. Supervisiones</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Licit. Obras</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Licit. Bienes</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Licit. Consultoría</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Concursos Públicos</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Adjudicaciones Simplificadas</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Cotizaciones</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Contratos y Adendas</button>
                </div>
              </div>
            )}
          </div>

          {/* Nuevo Menú: Ejecución Contractual */}
          <div className="relative flex-shrink-0">
            <button onMouseEnter={() => handleHover('ejecucion', 'Gestión de la ejecución contractual y personal.')} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition text-[11px] ${ejecucionOpen ? 'bg-[#f0a35b] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
              <HardHat size={12} className={ejecucionOpen ? 'text-black' : 'text-[#38bdf8]'}/> Ejecución
            </button>
            {ejecucionOpen && (
              <div className="absolute top-full right-0 mt-1 w-max min-w-[220px] bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl z-[9999]">
                <div className="p-2 flex flex-col space-y-1">
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Residentes de Obra</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Supervisores</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Planillas de Personal</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Órdenes de Cambio</button>
                  <button className="w-full text-left px-2 py-1.5 text-[11px] text-[#e2e8f0] hover:bg-[#1e293b] rounded block">Órdenes de Servicio</button>
                </div>
              </div>
            )}
          </div>

        </div>

        
        </div>
        <div className="flex-1 flex overflow-hidden w-full relative">


      {/* IZQUIERDA (220px): MENÚ DE FLUJOS */}
      <div className="w-[220px] flex-shrink-0 border-r border-[#1e293b] flex flex-col bg-[#0f172a]">
        <div className="flex items-center gap-2 border-b border-[#1e293b] h-[41px] px-2">
          <div className="w-7 h-7 rounded bg-[#f0a35b] flex items-center justify-center font-bold text-black text-sm">A</div>
          <span className="font-bold tracking-widest text-sm">ARKI <span className="text-[10px] text-[#f0a35b]">v2.0</span></span>
        </div>
        
        <div className="p-3 flex-1 space-y-1">
          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-3">DATOS</p>
          {/* Aquí irán los datos del proyecto (área, pisos, etc.) */}
          <div className="space-y-2">
            <div className="bg-[#1e293b] p-2 rounded-lg">
              <p className="text-[9px] text-[#64748b]">Área</p>
              <p className="text-xs font-bold text-[#38bdf8]">{copilotParams?.area_m2 || "—"} m²</p>
            </div>
            <div className="bg-[#1e293b] p-2 rounded-lg">
              <p className="text-[9px] text-[#64748b]">Pisos</p>
              <p className="text-xs font-bold text-[#f0a35b]">{copilotParams?.pisos || "—"}</p>
            </div>
            <div className="bg-[#1e293b] p-2 rounded-lg">
              <p className="text-[9px] text-[#64748b]">Ciudad</p>
              <p className="text-xs font-bold text-[#e2e8f0]">{copilotParams?.ciudad || "—"}</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-[#1e293b] text-[10px] text-[#64748b]">
          <p>GPU: RTX 3060 ({gpuUsage !== null ? `${gpuUsage}%` : "—"})</p>
          <p>Core: SICL v1.2</p>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: FUNNEL + WORKSPACE */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 flex overflow-hidden relative z-0">
          {/* COLUMNA CENTRAL: FUNNEL */}
          <section className="min-w-0 min-h-0 flex-1 flex flex-col overflow-hidden border-r border-[#1e293b] bg-[#0a0f16]">
            <header className="flex-shrink-0 p-3 border-b border-[#1e293b] flex items-center justify-between bg-[#0f172a]">
              <span className="text-xs font-bold text-[#e2e8f0]">Embudo de Diseño · Funnel 16-4-1</span>
              <span className="text-[10px] text-[#f0a35b]">{buildingData ? "✅ Geometría generada" : "⏳ Esperando propuesta..."}</span>
            </header>
            <div className="flex-1 min-h-0 overflow-auto p-4">
              <ProposalGallery proposals={partis} />
            </div>
          </section>

          {/* COLUMNA DERECHA: WORKSPACE + PANELES + CHAT */}
          <aside className="w-[440px] min-w-[440px] max-w-[440px] min-h-0 flex-shrink-0 flex flex-col overflow-hidden bg-[#0f172a]">
            {/* WORKSPACE: FRANJA SUPERIOR (~10%) */}
            <header className="basis-[10%] min-h-[56px] flex-shrink-0 px-3 py-2 border-b border-[#1e293b] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#38bdf8]">Workspace</p>
                <p className="text-[11px] text-[#e2e8f0] truncate">Entorno de trabajo ARKI</p>
              </div>
              <span className="text-[9px] text-[#64748b] whitespace-nowrap">Funnel · Correcciones · Copiloto</span>
            </header>

            {/* CORRECCIONES Y COPILOTO: DOS PANELES HORIZONTALES */}
            <div className="flex-1 min-h-0 grid grid-cols-2 divide-x divide-[#1e293b] overflow-hidden">
              <section className="min-w-0 min-h-0 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 p-3 border-b border-[#1e293b] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e2e8f0]">Correcciones</span>
                  <Sparkles size={14} className="text-[#f0a35b]" />
                </header>
                <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
                  <p className="text-[10px] text-[#64748b]">Parámetros y ajustes del proyecto.</p>
                  <div className="bg-[#1e293b] p-2 rounded-lg">
                    <p className="text-[9px] text-[#64748b]">Área</p>
                    <p className="text-xs font-bold text-[#38bdf8]">{copilotParams?.area_m2 || copilotParams?.areaM2 || "—"} m²</p>
                  </div>
                  <div className="bg-[#1e293b] p-2 rounded-lg">
                    <p className="text-[9px] text-[#64748b]">Pisos</p>
                    <p className="text-xs font-bold text-[#f0a35b]">{copilotParams?.pisos || "—"}</p>
                  </div>
                  <div className="bg-[#1e293b] p-2 rounded-lg">
                    <p className="text-[9px] text-[#64748b]">Ciudad</p>
                    <p className="text-xs font-bold text-[#e2e8f0]">{copilotParams?.ciudad || copilotParams?.city || "—"}</p>
                  </div>
                  <div className="bg-[#1e293b] p-2 rounded-lg">
                    <p className="text-[9px] text-[#64748b]">Estilo</p>
                    <p className="text-xs font-bold text-[#e2e8f0]">{copilotParams?.estilo || "—"}</p>
                  </div>
                </div>
              </section>

              <section className="min-w-0 min-h-0 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 p-3 border-b border-[#1e293b] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e2e8f0]">Copiloto</span>
                  <Sparkles size={14} className="text-[#f0a35b]" />
                </header>
                <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
                  <div className="rounded-lg border border-[#334155] bg-[#1e293b] p-2">
                    <p className="text-[10px] font-semibold text-[#e2e8f0]">Asistente de diseño</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#94a3b8]">
                      Interpreta las instrucciones del chat y prepara los parámetros para el proceso de diseño.
                    </p>
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between gap-2">
                      <span className="text-[#64748b]">Estado</span>
                      <span className={isGenerating ? "text-[#f0a35b]" : "text-[#4ade80]"}>
                        {isGenerating ? "Procesando" : "En espera"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#64748b]">Parámetros</span>
                      <span className="text-[#e2e8f0]">{copilotParams ? Object.keys(copilotParams).length : 0}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#64748b]">Propuestas</span>
                      <span className="text-[#e2e8f0]">{partis.length}</span>
                    </div>
                  </div>
                  {isGenerating && (
                    <div className="flex items-center gap-2 rounded-lg bg-[#1e293b] p-2 text-[10px] text-[#e2e8f0]">
                      <Activity className="animate-pulse text-[#f0a35b]" size={14} />
                      Ejecutando solicitud...
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* CHAT: FRANJA INFERIOR (~20%), SEPARADA DEL PANEL COPILOTO */}
            <section className="basis-[20%] min-h-[140px] flex-shrink-0 min-w-0 flex flex-col border-t border-[#1e293b] bg-[#0b1420]">
              <header className="flex-shrink-0 px-3 py-2 border-b border-[#1e293b] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#e2e8f0]">Chat conversacional</span>
                <span className="text-[9px] text-[#64748b]">ARKI · SICL Core</span>
              </header>
              <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[95%] px-2.5 py-1.5 rounded-lg text-[10px] leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user" ? "bg-[#f0a35b] text-black" : "bg-[#1e293b] text-[#e2e8f0]"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-[#1e293b] px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-[10px]">
                      <Activity className="animate-pulse text-[#f0a35b]" size={13} /> Consultando...
                    </div>
                  </div>
                )}
              </div>
              <form
                className="flex-shrink-0 p-2 border-t border-[#1e293b]"
                onSubmit={(event) => { event.preventDefault(); void handleSend(); }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={isGenerating}
                    placeholder="Escribe una instrucción para ARKI..."
                    className="min-w-0 flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-[#f0a35b] transition disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !input.trim()}
                    aria-label="Enviar mensaje"
                    className="flex-shrink-0 w-8 h-8 bg-[#f0a35b] hover:bg-[#fbbf24] disabled:opacity-40 disabled:cursor-not-allowed rounded flex items-center justify-center transition"
                  >
                    <Send size={13} className="text-black" />
                  </button>
                </div>
                <p className="text-center text-[9px] text-[#475569] mt-1">Verifica los resultados y la normativa aplicable.</p>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </div>
</div>
  );
}