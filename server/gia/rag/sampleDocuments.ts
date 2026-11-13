/**
 * Documentos de ejemplo para el RAG de normativa.
 *
 * 20 fragmentos de RNE, 10 building permits de Lima, 5 lecciones aprendidas.
 * Para producción, se reemplazan con el corpus real.
 */

import type { RagDocument } from "./types";

export const SAMPLE_DOCUMENTS: RagDocument[] = [
  // === RNE (20) ===
  { id: "rne-a010-1", title: "RNE A.010 — Ancho mínimo de pasillo", source: "RNE A.010", content: "El ancho mínimo de pasillo de circulación es 1.20 metros para uso residencial y 1.50 metros para uso comercial. En edificaciones de salud, el ancho mínimo es 2.00 metros.", type: "RNE" },
  { id: "rne-a010-2", title: "RNE A.010 — Altura mínima de ambiente", source: "RNE A.010", content: "La altura mínima de ambiente es 2.40 metros en viviendas, 2.70 metros en oficinas y 3.00 metros en comercio.", type: "RNE" },
  { id: "rne-a020-1", title: "RNE A.020 — Ventilación de viviendas", source: "RNE A.020", content: "Toda vivienda debe tener ventilación natural permanente. El área mínima de ventana es 10% del área del piso.", type: "RNE" },
  { id: "rne-a040-1", title: "RNE A.040 — Aulas educativas", source: "RNE A.040", content: "El área mínima por alumno en aulas educativas es 1.50 m². La altura mínima del aula es 2.70 metros.", type: "RNE" },
  { id: "rne-a050-1", title: "RNE A.050 — Hospitales", source: "RNE A.050", content: "Los hospitales requieren presión diferencial en UCI y quirófanos. La temperatura debe mantenerse entre 20 y 24 °C.", type: "RNE" },
  { id: "rne-a060-1", title: "RNE A.060 — Industria", source: "RNE A.060", content: "Las naves industriales requieren ventilación industrial. El área mínima de ventilación es 5% del área del piso.", type: "RNE" },
  { id: "rne-a070-1", title: "RNE A.070 — Comercio", source: "RNE A.070", content: "El área mínima de circulación en comercio es 1.50 metros. Las salidas de emergencia deben estar a 30 metros máximo.", type: "RNE" },
  { id: "rne-a080-1", title: "RNE A.080 — Iglesias", source: "RNE A.080", content: "Las naves principales de iglesias requieren acústica diferenciada. La reverberación óptima es 1.5 a 2.5 segundos.", type: "RNE" },
  { id: "rne-a090-1", title: "RNE A.090 — Cultural", source: "RNE A.090", content: "Los museos requieren control de luz y humedad. La humedad relativa debe mantenerse entre 40% y 60%.", type: "RNE" },
  { id: "rne-a100-1", title: "RNE A.100 — Deportivo", source: "RNE A.100", content: "Los estadios requieren evacuación masiva. La capacidad de salida es 1 persona por cada 0.5 metros de ancho de salida.", type: "RNE" },
  { id: "rne-a110-1", title: "RNE A.110 — Penitenciario", source: "RNE A.110", content: "Los penales requieren segregación total entre internos, personal y visitantes. Las celdas requieren ventilación permanente.", type: "RNE" },
  { id: "rne-a120-1", title: "RNE A.120 — Transporte", source: "RNE A.120", content: "Los terminales terrestres requieren separación de flujo pasajero/vehículo. El área mínima por pasajero es 1.20 m².", type: "RNE" },
  { id: "rne-a130-1", title: "RNE A.130 — Evacuación", source: "RNE A.130", content: "El cálculo de evacuación se hace por aforo: 1 persona por cada 1.5 m² en oficinas, 1 persona por cada 3 m² en aulas, 1 persona por cada 0.5 m² en comercio.", type: "RNE" },
  { id: "rne-a130-2", title: "RNE A.130 — Ancho de salida", source: "RNE A.130", content: "El ancho de salida de emergencia es 0.008 metros por persona, con un mínimo de 1.20 metros.", type: "RNE" },
  { id: "rne-a130-3", title: "RNE A.130 — Distancia de recorrido", source: "RNE A.130", content: "La distancia máxima de recorrido hasta una salida es 45 metros en edificaciones sin rociadores, 60 metros con rociadores.", type: "RNE" },
  { id: "rne-os010-1", title: "RNE OS.010 — Agua potable", source: "RNE OS.010", content: "El sistema de agua potable requiere presión mínima de 10 metros de columna de agua en el punto más desfavorable.", type: "RNE" },
  { id: "rne-os050-1", title: "RNE OS.050 — Desagüe", source: "RNE OS.050", content: "El sistema de desagüe requiere pendiente mínima de 1% en tuberías de 4 pulgadas.", type: "RNE" },
  { id: "rne-e030-1", title: "RNE E.030 — Diseño sismorresistente", source: "RNE E.030", content: "El diseño sismorresistente se basa en la NTE E.030. La zona sísmica de Lima es Z4 (la más alta).", type: "RNE" },
  { id: "rne-e050-1", title: "RNE E.050 — Suelos", source: "RNE E.050", content: "El estudio de suelos es obligatorio para edificaciones de más de 3 pisos. La capacidad portante típica de Lima es 1.5 a 3 kg/cm².", type: "RNE" },
  { id: "rne-em010-1", title: "RNE EM.010 — Instalaciones eléctricas", source: "RNE EM.010", content: "La demanda eléctrica típica es 25 W/m² en oficinas, 15 W/m² en viviendas, 50 W/m² en comercio.", type: "RNE" },

  // === Building permits (10) ===
  { id: "permit-2023-0045", title: "Permit 2023-0045 — Oficinas San Isidro", source: "Municipalidad de Lima", content: "Permiso para torre de oficinas de 15 pisos en San Isidro. Área construida: 8,000 m². Aprobado con observaciones de evacuación.", type: "BUILDING_PERMIT" },
  { id: "permit-2023-0078", title: "Permit 2023-0078 — Residencial Miraflores", source: "Municipalidad de Lima", content: "Permiso para edificio residencial de 8 pisos en Miraflores. 40 viviendas. Aprobado sin observaciones.", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0012", title: "Permit 2024-0012 — Comercial Surco", source: "Municipalidad de Lima", content: "Permiso para centro comercial en Surco. 15,000 m². Observaciones de estacionamiento (faltaban 20 espacios).", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0034", title: "Permit 2024-0034 — Educativo San Borja", source: "Municipalidad de Lima", content: "Permiso para colegio en San Borja. 5,000 m². Aprobado con observaciones de evacuación (ancho de escalera).", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0056", title: "Permit 2024-0056 — Hotel Miraflores", source: "Municipalidad de Lima", content: "Permiso para hotel de 120 habitaciones en Miraflores. Aprobado sin observaciones.", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0089", title: "Permit 2024-0089 — Clínica San Isidro", source: "Municipalidad de Lima", content: "Permiso para clínica de 50 camas en San Isidro. Observaciones de presión diferencial en quirófanos.", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0102", title: "Permit 2024-0102 — Industrial Callao", source: "Municipalidad del Callao", content: "Permiso para nave industrial en Callao. 10,000 m². Aprobado con observaciones de ventilación.", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0115", title: "Permit 2024-0115 — Cultural Barranco", source: "Municipalidad de Lima", content: "Permiso para centro cultural en Barranco. 3,000 m². Aprobado con observaciones de acústica.", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0140", title: "Permit 2024-0140 — Residencial La Molina", source: "Municipalidad de Lima", content: "Permiso para 60 viviendas en La Molina. Aprobado sin observaciones.", type: "BUILDING_PERMIT" },
  { id: "permit-2024-0156", title: "Permit 2024-0156 — Oficinas San Borja", source: "Municipalidad de Lima", content: "Permiso para oficinas de 10 pisos en San Borja. 6,000 m². Observaciones de estacionamiento (faltaban 10 espacios).", type: "BUILDING_PERMIT" },

  // === Lecciones aprendidas (5) ===
  { id: "lesson-001", title: "Lección 001 — Evacuación en altura", source: "ARKI interno", content: "En torres de más de 20 pisos, el ancho de escalera debe ser 1.50 metros (no 1.20). Los permisos 2023-0045 y 2024-0034 fallaron por esto.", type: "LESSON_LEARNED" },
  { id: "lesson-002", title: "Lección 002 — Estacionamiento en comercio", source: "ARKI interno", content: "Los centros comerciales requieren 1 espacio por cada 50 m². El permit 2024-0012 falló por faltar 20 espacios.", type: "LESSON_LEARNED" },
  { id: "lesson-003", title: "Lección 003 — Presión diferencial en clínicas", source: "ARKI interno", content: "Las clínicas requieren presión diferencial en quirófanos. El permit 2024-0089 falló por no especificarla.", type: "LESSON_LEARNED" },
  { id: "lesson-004", title: "Lección 004 — Ventilación en industria", source: "ARKI interno", content: "Las naves industriales requieren 5% de ventilación. El permit 2024-0102 falló por no cumplirlo.", type: "LESSON_LEARNED" },
  { id: "lesson-005", title: "Lección 005 — Acústica en cultural", source: "ARKI interno", content: "Los centros culturales requieren reverberación 1.5-2.5s. El permit 2024-0115 falló por exceso de reverberación.", type: "LESSON_LEARNED" },
];
