import { useState } from "react";
import { Send, Sparkles, Box, FileText, Activity, Shield, HardHat } from "lucide-react";
import ProfessionalFamilyViewer from "@/components/ProfessionalFamilyViewer";
import FunnelGallery from "@/components/FunnelGallery";

export default function ArkiCockpitPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hola Yvan. Soy ARKI. ¿Qué construimos hoy? Puedes pedirme un hospital, analizar un terreno o revisar un expediente." }
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildingData, setBuildingData] = useState<any>(null);

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
            
            const e2eRes = await fetch('/api/trpc/copilot.e2e', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'trpc-batch-mode': 'true' },
              body: JSON.stringify({
                "0": { "json": {
                  projectId: `PRO-${Date.now()}`,
                  name: `Proyecto ${tipo} en ${ciudad}`,
                  typology: tipo,
                  brief: userMsg,
                  location: ciudad,
                  jurisdiction: "RNE-PE",
                  areaM2: areaM2,
                  capacity: capacity
                }}
              })
            });
            
            const e2eJson = await e2eRes.json();
            if (!e2eRes.ok) {
              const errorMsg = e2eJson[0]?.error?.json?.message || `HTTP ${e2eRes.status}`;
              setMessages(prev => [...prev, { role: "assistant", text: `❌ Error en pipeline F1-F10: ${errorMsg}` }]);
              return;
            }
            
            const result = e2eJson[0]?.result?.data?.json;
            const partis = result?.partis || [];
            
            if (partis.length > 0) {
              setMessages(prev => [...prev, { 
                role: "assistant", 
                text: `✅ ARKI generó ${partis.length} propuestas (partis) para ${familyName}.\n📐 Revisa la galería en el centro para seleccionar las finalistas.` 
              }]);
              // Guardar las propuestas para que el Funnel las muestre
              (window as any).__ARKI_PARTIS__ = partis;
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
    <div className="flex h-screen w-full bg-[#0a0f16] text-[#e2e8f0] font-sans overflow-hidden">

      {/* IZQUIERDA (15%): MENÚ DE FLUJOS */}
      <div className="w-[15%] min-w-[180px] border-r border-[#1e293b] flex flex-col bg-[#0f172a]">
        <div className="p-4 flex items-center gap-2 border-b border-[#1e293b]">
          <div className="w-7 h-7 rounded bg-[#f0a35b] flex items-center justify-center font-bold text-black text-sm">A</div>
          <span className="font-bold tracking-widest text-sm">ARKI <span className="text-[10px] text-[#f0a35b]">v2.0</span></span>
        </div>
        
        <div className="p-3 flex-1 space-y-1">
          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-3">Nuevo Proyecto</p>
          <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-[#1e293b] transition text-left text-xs"><Box size={14} className="text-[#f0a35b]"/> Proyecto Privado</button>
          <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-[#1e293b] transition text-left text-xs"><FileText size={14} className="text-[#38bdf8]"/> Expediente Público</button>
          <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-[#1e293b] transition text-left text-xs"><HardHat size={14} className="text-[#fbbf24]"/> Supervisión Obra</button>
          <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-[#1e293b] transition text-left text-xs"><Shield size={14} className="text-[#a78bfa]"/> Licitación / Concurso</button>
        </div>

        <div className="p-3 border-t border-[#1e293b] text-[10px] text-[#64748b]">
          <p>GPU: RTX 3060 (Activa)</p>
          <p>Core: SICL v1.2</p>
        </div>
      </div>

      {/* CENTRO (70%): FUNNEL 16-4-1 (CUADRADO) */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[#1e293b] bg-[#0a0f16]">
        <div className="p-3 border-b border-[#1e293b] flex items-center justify-between bg-[#0f172a]">
          <span className="text-xs font-bold text-[#e2e8f0]">Embudo de Diseño · Funnel 16-4-1</span>
          <span className="text-[10px] text-[#f0a35b]">{buildingData ? "✅ Geometría generada" : "⏳ Esperando propuesta..."}</span>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          {buildingData ? (
            <div className="w-full h-full max-w-[800px] max-h-[800px] aspect-square">
              <FunnelGallery />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#64748b] space-y-4">
              <Box size={64} className="opacity-20"/>
              <p className="text-sm">Pídele a ARKI que genere un edificio para ver las propuestas aquí.</p>
            </div>
          )}
        </div>
      </div>

      {/* DERECHA (15%): CHAT DEL COPILOTO */}
      <div className="w-[15%] min-w-[200px] border-l border-[#1e293b] bg-[#0f172a] flex flex-col">
        <div className="p-3 border-b border-[#1e293b] flex items-center justify-between">
          <span className="text-xs font-bold text-[#e2e8f0]">Copiloto</span>
          <Sparkles size={14} className="text-[#f0a35b]"/>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[95%] p-2.5 rounded-lg text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-[#f0a35b] text-black' : 'bg-[#1e293b] text-[#e2e8f0]'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-[#1e293b] p-2.5 rounded-lg flex items-center gap-2 text-[11px]">
                <Activity className="animate-pulse text-[#f0a35b]" size={14} /> Consultando...
              </div>
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="p-3 border-t border-[#1e293b]">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe lo que quieres construir..." 
              className="w-full bg-[#1e293b] border border-[#334155] rounded-lg py-2.5 pl-3 pr-10 text-[11px] focus:outline-none focus:border-[#f0a35b] transition"
            />
            <button onClick={handleSend} className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-[#f0a35b] hover:bg-[#fbbf24] rounded flex items-center justify-center transition">
              <Send size={12} className="text-black" />
            </button>
          </div>
          <p className="text-center text-[9px] text-[#475569] mt-1.5">ARKI puede cometer errores. Verifica la normativa.</p>
        </div>
      </div>
    </div>
  );
}