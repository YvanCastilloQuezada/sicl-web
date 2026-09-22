export const AR_LU_PROVIDER_CATALOG = [
  { category: "TRANSCRIPTION", name: "Deepgram", fit: "Tiempo real y vocabulario especializado", status: "READY_FOR_SANDBOX", source: "https://deepgram.com/product/speech-to-text" },
  { category: "TRANSCRIPTION", name: "Google Cloud Speech-to-Text", fit: "Cobertura empresarial y multilingüe", status: "CANDIDATE", source: "https://cloud.google.com/speech-to-text" },
  { category: "TRANSCRIPTION", name: "Azure AI Speech", fit: "STT/TTS y ecosistema Microsoft", status: "CANDIDATE", source: "https://azure.microsoft.com/products/ai-services/ai-speech" },
  { category: "WEBRTC", name: "LiveKit", fit: "Salas WebRTC y agentes de voz", status: "READY_FOR_SANDBOX", source: "https://livekit.io/" },
  { category: "WEBRTC", name: "Cloudflare Calls", fit: "Transporte WebRTC administrado", status: "CANDIDATE", source: "https://developers.cloudflare.com/calls/" },
  { category: "WEBRTC", name: "coturn", fit: "Relay STUN/TURN autogestionado en Ubuntu", status: "UBUNTU_READY", source: "https://github.com/coturn/coturn" },
  { category: "DISTRIBUTION", name: "Cloudflare Stream", fit: "Ingesta RTMPS/SRT, HLS/DASH y ABR", status: "READY_FOR_SANDBOX", source: "https://developers.cloudflare.com/stream/stream-live/" },
  { category: "DISTRIBUTION", name: "Mux", fit: "Video live y on-demand administrado", status: "CANDIDATE", source: "https://www.mux.com/video" },
  { category: "DISTRIBUTION", name: "Livepeer", fit: "Distribución y transcodificación orientada a API", status: "CANDIDATE", source: "https://livepeer.org/" },
] as const;

export const AR_LU_IDEA_REGISTRY = [
  { id: "LUCA-IDEA-001", title: "Puntos georreferenciados creados por usuarios", status: "IDEA", next: "Moderación de imagen, ubicación y contenido" },
  { id: "LUCA-IDEA-002", title: "Publicidad AR en cielo y espacio urbano", status: "IDEA", next: "Prueba de seguridad, escala y privacidad" },
  { id: "LUCA-IDEA-003", title: "LUKA-TV con presentadora y campañas", status: "PARTIALLY_IMPLEMENTED", next: "Proveedor audiovisual sandbox" },
  { id: "ARKI-FFO-TV-001", title: "ARKI-TV arquitectura e inmobiliario", status: "FROZEN", next: "Gate de activación del propietario" },
  { id: "ARKI-FFO-FED-001", title: "AR-LU Federated Orchestrator", status: "FROZEN", next: "No descongelar sin revisión" },
] as const;

export const AR_LU_AGENT_TELEMETRY = [
  { id: "arki", name: "ARKI", role: "Arquitectura, BIM y razonamiento", state: "READY", load: 34 },
  { id: "luca", name: "LUCA", role: "Territorio, Geo-AR y publicidad", state: "ACTIVE", load: 47 },
  { id: "vision", name: "VISION", role: "Visión artificial y OCR", state: "READY", load: 22 },
  { id: "costos", name: "COSTOS", role: "Costos y trazabilidad", state: "STAGED", load: 18 },
] as const;

export type ArLuActivity = { id: string; time: string; agent: string; event: string; status: "PASS" | "STAGED" | "BLOCKED" | "FROZEN" };
export const AR_LU_ACTIVITY_SEED: ArLuActivity[] = [
  { id: "activity-1", time: "ahora", agent: "LUCA", event: "Conocimiento Delta 6.2 separado por producto", status: "PASS" },
  { id: "activity-2", time: "hace 1 min", agent: "AR-LU", event: "Handoff preparado para revisión humana", status: "STAGED" },
  { id: "activity-3", time: "hace 3 min", agent: "ARKI-TV", event: "Contrato conservado sin publicación", status: "FROZEN" },
  { id: "activity-4", time: "hace 5 min", agent: "VISION", event: "Proveedor externo no conectado en Manus", status: "BLOCKED" },
];
