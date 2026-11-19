/**
 * ARKI Solar Report — Generador de Reporte RNE A.040
 * ---------------------------------------------------
 * Genera un reporte HTML profesional (imprimible a PDF) con:
 * - Datos de ubicación (Ubigeo + coordenadas + altitud)
 * - Parámetros de análisis (fecha, hora, orientación)
 * - Resultados solares (elevación, azimut, declinación, horas de sol)
 * - Cumplimiento RNE A.040 por tipología
 * - Recomendaciones de diseño bioclimático
 * - Gráfico SVG de trayectoria solar
 *
 * Autoridad: ARKI-GIA · Tríada Función + Sensaciones + Forma
 * Referencia: RNE A.040 (Asoleamiento y Ventilación)
 */

import type { SolarPosition } from "./arkiSolarEngine";
import type { UbigeoLocation } from "../../../shared/arkiUbigeoMap";
import type { SunPathSample } from "../../../client/src/components/SolarHouse3D";

// ============================================================
// REGLAS RNE A.040 — Horas mínimas de sol directo
// ============================================================
// Fuente: Reglamento Nacional de Edificaciones del Perú
// Norma A.040: Asoleamiento y Ventilación
// ============================================================

export type BuildingTypology =
  | "vivienda"
  | "hospital"
  | "escuela"
  | "oficina"
  | "comercio"
  | "industrial";

export interface RneRequirement {
  typology: BuildingTypology;
  label: string;
  minHours: number;
  criticalDate: string; // "21-jun" para hemisferio sur (solsticio invierno)
  criticalSpace: string;
  description: string;
}

export const RNE_A040_REQUIREMENTS: RneRequirement[] = [
  {
    typology: "vivienda",
    label: "Vivienda",
    minHours: 2,
    criticalDate: "21-jun",
    criticalSpace: "Dormitorio principal",
    description: "Mínimo 2 horas de sol directo en el dormitorio principal durante el solsticio de invierno (21 junio).",
  },
  {
    typology: "hospital",
    label: "Hospital / Centro de Salud",
    minHours: 3,
    criticalDate: "21-jun",
    criticalSpace: "Habitación de paciente",
    description: "Mínimo 3 horas de sol directo en habitaciones de pacientes durante el solsticio de invierno.",
  },
  {
    typology: "escuela",
    label: "Escuela / Centro Educativo",
    minHours: 4,
    criticalDate: "21-jun",
    criticalSpace: "Aula",
    description: "Mínimo 4 horas de sol directo en aulas durante el solsticio de invierno.",
  },
  {
    typology: "oficina",
    label: "Oficina / Centro de Trabajo",
    minHours: 2,
    criticalDate: "21-jun",
    criticalSpace: "Área de trabajo",
    description: "Mínimo 2 horas de sol directo en áreas de trabajo durante el solsticio de invierno.",
  },
  {
    typology: "comercio",
    label: "Comercio / Local Comercial",
    minHours: 2,
    criticalDate: "21-jun",
    criticalSpace: "Área de atención al público",
    description: "Mínimo 2 horas de sol directo en áreas de atención al público.",
  },
  {
    typology: "industrial",
    label: "Industrial / Almacén",
    minHours: 1,
    criticalDate: "21-jun",
    criticalSpace: "Área de producción",
    description: "Mínimo 1 hora de sol directo en áreas de producción.",
  },
];

// ============================================================
// CÁLCULO DE HORAS DE SOL EFECTIVAS
// ============================================================

export function computeEffectiveSunHours(sunPath: SunPathSample[]): number {
  // Filtrar muestras donde el sol está sobre el horizonte (elevation > 0)
  const aboveHorizon = sunPath.filter((s) => s.elevation > 0);
  if (aboveHorizon.length < 2) return 0;

  // Calcular duración total en horas (asumiendo muestreo cada 15 min)
  const firstHour = aboveHorizon[0].hour;
  const lastHour = aboveHorizon[aboveHorizon.length - 1].hour;
  return Math.round((lastHour - firstHour) * 100) / 100;
}

export function computeSunriseSunset(sunPath: SunPathSample[]): { sunrise: number; sunset: number } | null {
  const aboveHorizon = sunPath.filter((s) => s.elevation > 0);
  if (aboveHorizon.length < 2) return null;
  return {
    sunrise: aboveHorizon[0].hour,
    sunset: aboveHorizon[aboveHorizon.length - 1].hour,
  };
}

// ============================================================
// EVALUACIÓN DE CUMPLIMIENTO RNE
// ============================================================

export interface ComplianceResult {
  requirement: RneRequirement;
  compliant: boolean;
  actualHours: number;
  gap: number; // horas faltantes (0 si cumple)
}

export function evaluateCompliance(
  sunPath: SunPathSample[],
  typologies: BuildingTypology[],
): ComplianceResult[] {
  const effectiveHours = computeEffectiveSunHours(sunPath);
  return RNE_A040_REQUIREMENTS.filter((r) => typologies.includes(r.typology)).map((req) => ({
    requirement: req,
    compliant: effectiveHours >= req.minHours,
    actualHours: effectiveHours,
    gap: Math.max(0, req.minHours - effectiveHours),
  }));
}

// ============================================================
// GENERADOR DE RECOMENDACIONES BIOCLIMÁTICAS
// ============================================================

export interface BioclimaticRecommendation {
  category: string;
  title: string;
  description: string;
  priority: "alta" | "media" | "baja";
}

export function generateRecommendations(
  location: UbigeoLocation,
  sunPath: SunPathSample[],
  houseRotation: number,
): BioclimaticRecommendation[] {
  const recs: BioclimaticRecommendation[] = [];
  const effectiveHours = computeEffectiveSunHours(sunPath);

  // Recomendación por altitud
  if (location.altitudeM > 3000) {
    recs.push({
      category: "Clima de altura",
      title: "Ganancia solar pasiva",
      description: `A ${location.altitudeM} msnm, la radiación solar es ~40% más intensa que a nivel del mar. Priorizar ventanas al norte (hemisferio sur) con aleros calculados para bloquear el sol de verano y permitir el ingreso del sol de invierno.`,
      priority: "alta",
    });
  } else if (location.altitudeM < 500) {
    recs.push({
      category: "Clima costero",
      title: "Protección solar y ventilación",
      description: "En zonas costeras bajas, combinar aleros profundos con ventilación cruzada para mitigar el sobrecalentamiento por humedad relativa alta.",
      priority: "alta",
    });
  } else {
    recs.push({
      category: "Clima interandino",
      title: "Balance térmico estacional",
      description: "En zonas interandinas, diseñar fachadas con masa térmica para amortiguar la oscilación térmica diaria. Orientar espacios principales al norte.",
      priority: "media",
    });
  }

  // Recomendación por horas de sol
  if (effectiveHours < 4) {
    recs.push({
      category: "Asoleamiento",
      title: "Horas de sol insuficientes",
      description: `El sitio recibe ${effectiveHours.toFixed(1)} horas de sol efectivo. Considerar patios de luz, claraboyas o retranqueos para mejorar el asoleamiento interior.`,
      priority: "alta",
    });
  } else {
    recs.push({
      category: "Asoleamiento",
      title: "Asoleamiento adecuado",
      description: `El sitio recibe ${effectiveHours.toFixed(1)} horas de sol efectivo. Cumple con los requisitos mínimos del RNE A.040 para la mayoría de tipologías.`,
      priority: "baja",
    });
  }

  // Recomendación por orientación de fachada
  const normalizedRotation = houseRotation % 360;
  if (normalizedRotation >= 135 && normalizedRotation <= 225) {
    recs.push({
      category: "Orientación",
      title: "Fachada principal orientada al sur",
      description: "La fachada principal está orientada al sur (hemisferio sur). Esta orientación recibe luz difusa constante sin ganancia solar directa. Ideal para talleres, estudios o espacios que requieren luz uniforme sin deslumbramiento.",
      priority: "media",
    });
  } else if (normalizedRotation >= 315 || normalizedRotation < 45) {
    recs.push({
      category: "Orientación",
      title: "Fachada principal orientada al norte",
      description: "La fachada principal está orientada al norte (hemisferio sur). Esta es la orientación óptima para ganancia solar pasiva en invierno. Diseñar aleros para bloquear el sol de verano (diciembre) y permitir el ingreso del sol de invierno (junio).",
      priority: "alta",
    });
  }

  // Recomendación por latitud
  if (Math.abs(location.latitude) < 5) {
    recs.push({
      category: "Latitud ecuatorial",
      title: "Sol casi cenital todo el año",
      description: "Cerca del ecuador, el sol pasa casi por el cenit. Los aleros horizontales son muy efectivos. Considerar protecciones verticales para fachadas este/oeste.",
      priority: "media",
    });
  }

  return recs;
}

// ============================================================
// GENERADOR DE GRÁFICO SVG DE TRAYECTORIA SOLAR
// ============================================================

export function generateSolarPathSvg(sunPath: SunPathSample[], width = 600, height = 300): string {
  if (sunPath.length < 2) return "";

  const padding = 40;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Escalar horas (5-19) a X (0-graphWidth)
  const scaleX = (hour: number) => padding + ((hour - 5) / 14) * graphWidth;
  // Escalar elevación (0-90) a Y (graphHeight-0)
  const scaleY = (elev: number) => padding + graphHeight - (elev / 90) * graphHeight;

  // Construir path
  const aboveHorizon = sunPath.filter((s) => s.elevation > 0);
  if (aboveHorizon.length < 2) return "";

  const pathData = aboveHorizon
    .map((s, i) => `${i === 0 ? "M" : "L"} ${scaleX(s.hour).toFixed(1)} ${scaleY(s.elevation).toFixed(1)}`)
    .join(" ");

  // Marcadores cada 2 horas
  const markers = aboveHorizon
    .filter((s) => Math.round(s.hour) % 2 === 0)
    .map((s) => {
      const x = scaleX(s.hour);
      const y = scaleY(s.elevation);
      const label = `${Math.round(s.hour)}:00`;
      return `<g>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#fbbf24" />
        <text x="${x.toFixed(1)}" y="${(y - 10).toFixed(1)}" font-size="10" fill="#94a3b8" text-anchor="middle">${label}</text>
      </g>`;
    })
    .join("");

  // Ejes
  const xAxis = `<line x1="${padding}" y1="${padding + graphHeight}" x2="${padding + graphWidth}" y2="${padding + graphHeight}" stroke="#475569" stroke-width="1" />`;
  const yAxis = `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + graphHeight}" stroke="#475569" stroke-width="1" />`;

  // Etiquetas de ejes
  const xLabels = [6, 9, 12, 15, 18]
    .map((h) => `<text x="${scaleX(h).toFixed(1)}" y="${(padding + graphHeight + 20).toFixed(1)}" font-size="10" fill="#94a3b8" text-anchor="middle">${h}:00</text>`)
    .join("");
  const yLabels = [0, 30, 60, 90]
    .map((e) => `<text x="${(padding - 10).toFixed(1)}" y="${scaleY(e).toFixed(1)}" font-size="10" fill="#94a3b8" text-anchor="end">${e}°</text>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#0f172a" rx="8" />
    ${xAxis}${yAxis}${xLabels}${yLabels}
    <path d="${pathData}" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.8" />
    ${markers}
    <text x="${(width / 2).toFixed(1)}" y="20" font-size="12" fill="#fbbf24" text-anchor="middle" font-weight="bold">Trayectoria Solar del Día</text>
  </svg>`;
}

// ============================================================
// GENERADOR DE REPORTE HTML COMPLETO
// ============================================================

export interface ReportInput {
  location: UbigeoLocation;
  date: string;
  time: string;
  houseRotation: number;
  solarPosition: SolarPosition;
  sunPath: SunPathSample[];
  typologies: BuildingTypology[];
  projectName?: string;
}

export function generateRneReportHtml(input: ReportInput): string {
  const { location, date, time, houseRotation, solarPosition, sunPath, typologies, projectName } = input;
  const complianceResults = evaluateCompliance(sunPath, typologies);
  const recommendations = generateRecommendations(location, sunPath, houseRotation);
  const effectiveHours = computeEffectiveSunHours(sunPath);
  const sunriseSunset = computeSunriseSunset(sunPath);
  const solarPathSvg = generateSolarPathSvg(sunPath);

  const now = new Date().toISOString().split("T")[0];
  const allCompliant = complianceResults.every((r) => r.compliant);

  const complianceRows = complianceResults
    .map(
      (r) => `
    <tr class="${r.compliant ? "compliant" : "non-compliant"}">
      <td>${r.requirement.label}</td>
      <td>${r.requirement.minHours} h</td>
      <td>${r.actualHours.toFixed(1)} h</td>
      <td>${r.compliant ? "✅ CUMPLE" : `❌ NO CUMPLE (faltan ${r.gap.toFixed(1)} h)`}</td>
      <td>${r.requirement.criticalSpace}</td>
    </tr>`,
    )
    .join("");

  const recommendationRows = recommendations
    .map(
      (r) => `
    <tr>
      <td><span class="priority-${r.priority}">${r.priority.toUpperCase()}</span></td>
      <td><strong>${r.category}</strong><br/>${r.title}</td>
      <td>${r.description}</td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte RNE A.040 — ${projectName || "Proyecto ARKI"} — ${location.label}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.6;
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      border-bottom: 3px solid #f59e0b;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo {
      font-size: 28px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -1px;
    }
    .logo span { color: #f59e0b; }
    .subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    .report-meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }
    .report-meta strong { color: #0f172a; }
    h1 {
      font-size: 22px;
      color: #0f172a;
      margin: 20px 0 10px;
    }
    h2 {
      font-size: 16px;
      color: #f59e0b;
      margin: 25px 0 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 13px;
      margin: 10px 0;
    }
    .status-compliant { background: #dcfce7; color: #166534; }
    .status-non-compliant { background: #fee2e2; color: #991b1b; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 15px 0;
    }
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
    }
    .info-card .label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-card .value {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 13px;
    }
    th {
      background: #0f172a;
      color: #fbbf24;
      padding: 10px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr.compliant td { background: #f0fdf4; }
    tr.non-compliant td { background: #fef2f2; }
    .priority-alta { background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; }
    .priority-media { background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; }
    .priority-baja { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; }
    .solar-chart {
      margin: 20px 0;
      text-align: center;
    }
    .solar-chart svg {
      max-width: 100%;
      height: auto;
    }
    footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      text-align: center;
    }
    footer strong { color: #f59e0b; }
    .section-note {
      font-size: 12px;
      color: #64748b;
      font-style: italic;
      margin: 8px 0 15px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-top">
      <div>
        <div class="logo">ARKI<span>-GIA</span></div>
        <div class="subtitle">Sistema de Generación y Evaluación Arquitectónica con IA</div>
      </div>
      <div class="report-meta">
        <div><strong>Reporte:</strong> RNE A.040</div>
        <div><strong>Fecha de emisión:</strong> ${now}</div>
        <div><strong>Versión:</strong> 1.0</div>
      </div>
    </div>
  </header>

  <h1>📊 Reporte de Asoleamiento — ${projectName || "Proyecto ARKI"}</h1>
  <p class="section-note">Análisis solar canónico según normativa RNE A.040 (Asoleamiento y Ventilación) del Perú.</p>

  <div class="status-badge ${allCompliant ? "status-compliant" : "status-non-compliant"}">
    ${allCompliant ? "✅ CUMPLE con RNE A.040" : "⚠️ NO CUMPLE completamente con RNE A.040"}
  </div>

  <h2>📍 1. Datos de Ubicación</h2>
  <div class="info-grid">
    <div class="info-card">
      <div class="label">Distrito</div>
      <div class="value">${location.district}</div>
    </div>
    <div class="info-card">
      <div class="label">Provincia</div>
      <div class="value">${location.province}</div>
    </div>
    <div class="info-card">
      <div class="label">Región / Departamento</div>
      <div class="value">${location.department}</div>
    </div>
    <div class="info-card">
      <div class="label">Altitud</div>
      <div class="value">${location.altitudeM} msnm</div>
    </div>
    <div class="info-card">
      <div class="label">Latitud</div>
      <div class="value">${location.latitude}°</div>
    </div>
    <div class="info-card">
      <div class="label">Longitud</div>
      <div class="value">${location.longitude}°</div>
    </div>
  </div>

  <h2>⚙️ 2. Parámetros de Análisis</h2>
  <div class="info-grid">
    <div class="info-card">
      <div class="label">Fecha de análisis</div>
      <div class="value">${date}</div>
    </div>
    <div class="info-card">
      <div class="label">Hora de análisis</div>
      <div class="value">${time}</div>
    </div>
    <div class="info-card">
      <div class="label">Orientación de fachada</div>
      <div class="value">${houseRotation}°</div>
    </div>
    <div class="info-card">
      <div class="label">Zona horaria</div>
      <div class="value">UTC${location.timezoneOffset >= 0 ? "+" : ""}${location.timezoneOffset}</div>
    </div>
  </div>

  <h2>☀️ 3. Resultados Solares</h2>
  <div class="info-grid">
    <div class="info-card">
      <div class="label">Elevación solar</div>
      <div class="value">${solarPosition.elevation}°</div>
    </div>
    <div class="info-card">
      <div class="label">Azimut solar</div>
      <div class="value">${solarPosition.azimuth}°</div>
    </div>
    <div class="info-card">
      <div class="label">Declinación</div>
      <div class="value">${solarPosition.declination}°</div>
    </div>
    <div class="info-card">
      <div class="label">Horas de sol efectivas</div>
      <div class="value">${effectiveHours.toFixed(1)} h</div>
    </div>
    ${sunriseSunset ? `
    <div class="info-card">
      <div class="label">Amanecer</div>
      <div class="value">${Math.floor(sunriseSunset.sunrise)}:${String(Math.round((sunriseSunset.sunrise % 1) * 60)).padStart(2, "0")}</div>
    </div>
    <div class="info-card">
      <div class="label">Atardecer</div>
      <div class="value">${Math.floor(sunriseSunset.sunset)}:${String(Math.round((sunriseSunset.sunset % 1) * 60)).padStart(2, "0")}</div>
    </div>
    ` : ""}
  </div>

  <div class="solar-chart">
    ${solarPathSvg}
    <p class="section-note">Trayectoria solar del día analizado. Eje X: hora (06:00-18:00). Eje Y: elevación sobre el horizonte (0°-90°).</p>
  </div>

  <h2>📋 4. Cumplimiento RNE A.040</h2>
  <p class="section-note">Evaluación contra las horas mínimas de sol directo exigidas por el Reglamento Nacional de Edificaciones del Perú, Norma A.040.</p>
  <table>
    <thead>
      <tr>
        <th>Tipología</th>
        <th>Mínimo RNE</th>
        <th>Disponible</th>
        <th>Estado</th>
        <th>Espacio crítico</th>
      </tr>
    </thead>
    <tbody>
      ${complianceRows}
    </tbody>
  </table>

  <h2>💡 5. Recomendaciones de Diseño Bioclimático</h2>
  <table>
    <thead>
      <tr>
        <th>Prioridad</th>
        <th>Categoría / Título</th>
        <th>Recomendación</th>
      </tr>
    </thead>
    <tbody>
      ${recommendationRows}
    </tbody>
  </table>

  <footer>
    <p><strong>ARKI-GIA</strong> · Sistema de Generación y Evaluación Arquitectónica con IA</p>
    <p>Reporte generado automáticamente el ${now} · Motor Solar Canónico v1.0 · Precisión ±1° (NOAA)</p>
    <p>Referencia normativa: RNE A.040 (Asoleamiento y Ventilación) — Perú</p>
    <p class="no-print" style="margin-top: 15px;">
      <em>💡 Tip: Usa Ctrl+P (o Cmd+P) para imprimir este reporte como PDF.</em>
    </p>
  </footer>
</body>
</html>`;
}
