export const ARLU_TRAVEL_GUIDE_TOPICS = [
  { topicId: "TRAVEL-001", title: "Guías turísticas por ciudad y región", domain: "TOURIST_GUIDE", targets: ["LUCA", "ARKI", "BOTH"], status: "RESEARCH_PENDING", goal: "Orientar con lugares, contexto, acceso y fuentes vigentes." },
  { topicId: "TRAVEL-002", title: "Guías de viaje y planificación diaria", domain: "TRAVEL_GUIDE", targets: ["LUCA", "BOTH"], status: "RESEARCH_PENDING", goal: "Construir itinerarios trazables sin inventar horarios, rutas o disponibilidad." },
  { topicId: "TRAVEL-003", title: "Guías para viajeros: seguridad, accesibilidad y conducta", domain: "TRAVEL_SAFETY", targets: ["LUCA", "BOTH"], status: "RESEARCH_PENDING", goal: "Dar recomendaciones prudentes, inclusivas y verificables." },
  { topicId: "TRAVEL-004", title: "Patrimonio, museos y monumentos urbanos", domain: "HERITAGE_TRAVEL", targets: ["LUCA", "ARKI", "BOTH"], status: "RESEARCH_PENDING", goal: "Explicar valor cultural con fuente, fecha de consulta y nivel de certeza." },
  { topicId: "TRAVEL-005", title: "Paisaje, parques y arquitectura del territorio", domain: "LANDSCAPE_TRAVEL", targets: ["LUCA", "ARKI", "BOTH"], status: "RESEARCH_PENDING", goal: "Relacionar paisaje, clima, vegetación, arquitectura y experiencia del visitante." },
] as const;
export function travelGuideTopicSummary() { return { total: ARLU_TRAVEL_GUIDE_TOPICS.length, researchPending: ARLU_TRAVEL_GUIDE_TOPICS.length, canonicalized: 0, immediateConsumptionAfterApproval: true as const }; }
