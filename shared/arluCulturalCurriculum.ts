export const ARLU_CULTURAL_CURRICULUM_VERSION = "AR-LU-CULTURAL-CURRICULUM-1.0" as const;
export type CulturalTopic = { topicId: string; title: string; domain: string; target: "ARKI" | "LUCA" | "BOTH"; status: "RESEARCH_PENDING"; learningGoal: string; guardrails: string[] };
export const ARLU_CULTURAL_CURRICULUM: readonly CulturalTopic[] = [
  ["HIST-PERU-001", "Historia del Perú: períodos y culturas", "HISTORY_PERU", "BOTH", "Reconocer contexto histórico sin inventar fechas, atribuciones o evidencias.", ["SOURCE_REQUIRED", "NO_UNVERIFIED_CLAIM"]],
  ["HIST-PERU-002", "Patrimonio prehispánico y huacas", "HERITAGE", "BOTH", "Relacionar un sitio con su patrimonio documentado y expresar incertidumbre.", ["GEOLOCATION_VALIDATION", "HERITAGE_SOURCE_REQUIRED"]],
  ["HIST-PERU-003", "Historia virreinal, republicana y contemporánea del Perú", "HISTORY_PERU", "BOTH", "Explicar capas históricas y evitar simplificaciones culturales.", ["MULTISOURCE_REVIEW"]],
  ["HIST-WORLD-001", "Historia universal: cronologías y civilizaciones", "HISTORY_WORLD", "BOTH", "Construir contexto comparativo con fuentes trazables.", ["SOURCE_REQUIRED"]],
  ["TOUR-PERU-001", "Lugares turísticos y áreas naturales del Perú", "TOURISM", "LUCA", "Guiar al visitante con ubicación, acceso, horario y fuente vigente.", ["FRESHNESS_REQUIRED", "NO_ROUTE_FABRICATION"]],
  ["TOUR-CITY-001", "Arquitectura y patrimonio de cada ciudad", "CITY_ARCHITECTURE", "BOTH", "Identificar rasgos urbanos sin atribuir estilos sin evidencia.", ["IMAGE_OR_SOURCE_EVIDENCE"]],
  ["LAND-001", "Arquitectura paisajista y lectura del territorio", "LANDSCAPE", "BOTH", "Relacionar topografía, clima, vegetación, agua y uso humano.", ["SITE_EVIDENCE_REQUIRED"]],
  ["URBAN-001", "Monumentos urbanos, plazas, ejes y espacios públicos", "URBAN_HERITAGE", "BOTH", "Interpretar valor urbano, simbólico y funcional con provenance.", ["HERITAGE_SOURCE_REQUIRED"]],
  ["URBAN-002", "Morfología urbana y evolución de las ciudades", "URBANISM", "BOTH", "Leer tejido, centralidades, bordes y transformaciones históricas.", ["MAP_SOURCE_REQUIRED"]],
  ["CULT-001", "Patrimonio material, inmaterial y memoria local", "CULTURAL_CONTEXT", "BOTH", "Distinguir hecho documentado, interpretación y memoria comunitaria.", ["COMMUNITY_CONTEXT", "HUMAN_REVIEW_REQUIRED"]],
  ["CULT-002", "Ética de la guía turística y representación cultural", "CULTURAL_ETHICS", "LUCA", "Evitar estereotipos, apropiación y recomendaciones inseguras.", ["HUMAN_REVIEW_REQUIRED", "SAFETY_REVIEW"]],
  ["ARCH-001", "Historia de la arquitectura y lenguajes constructivos", "ARCHITECTURE_HISTORY", "BOTH", "Reconocer períodos, tipologías y relaciones constructivas.", ["SOURCE_REQUIRED"]],
].map(([topicId, title, domain, target, learningGoal, guardrails]) => ({ topicId, title, domain, target, status: "RESEARCH_PENDING", learningGoal, guardrails })) as readonly CulturalTopic[];
export function listCulturalTopics(target?: "ARKI" | "LUCA") { return ARLU_CULTURAL_CURRICULUM.filter((topic) => !target || topic.target === target || topic.target === "BOTH"); }
export function culturalCurriculumSummary() { return { version: ARLU_CULTURAL_CURRICULUM_VERSION, total: ARLU_CULTURAL_CURRICULUM.length, researchPending: ARLU_CULTURAL_CURRICULUM.length, canonicalized: 0, targets: ["ARKI", "LUCA", "BOTH"] as const }; }
