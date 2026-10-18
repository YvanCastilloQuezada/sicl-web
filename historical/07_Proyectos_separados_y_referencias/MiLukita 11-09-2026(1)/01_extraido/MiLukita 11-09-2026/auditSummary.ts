export type AuditStatus = "VERIFICADO" | "CORREGIDO" | "LOCAL" | "SIMULADO" | "PAUSADO" | "NO VERIFICADO" | "PENDIENTE" | "PREPRODUCCIÓN";
export type AuditPriority = "P0" | "P1" | "P2";

export type AuditSummaryItem = {
  area: string;
  status: AuditStatus;
  priority: AuditPriority;
  title: string;
  detail: string;
};

export const AUDIT_SUMMARY_ITEMS: readonly AuditSummaryItem[] = [
  { area: "Núcleo virtual", status: "VERIFICADO", priority: "P0", title: "Juegos, wallet y liquidación virtual", detail: "Implementados y cubiertos por pruebas; sin dinero real ni retiros." },
  { area: "Integridad", status: "VERIFICADO", priority: "P0", title: "MJP CORE conserva la autoridad", detail: "El cliente, Lukita, Watchdog y Auditor no fijan resultados oficiales." },
  { area: "Auditoría", status: "VERIFICADO", priority: "P1", title: "Auditor READ_ONLY", detail: "PASS/WARN/FAIL, detección de inconsistencia y NO DATA → NO CLAIM." },
  { area: "Watchdog", status: "VERIFICADO", priority: "P1", title: "Watchdog ALERT_ONLY", detail: "Detecta y persiste alertas sin ejecutar correcciones autoritativas." },
  { area: "TV / móvil", status: "LOCAL", priority: "P1", title: "Flujo TV → QR → celular", detail: "Manifest, QR circular, contingencia y estados probados localmente." },
  { area: "Autonomía", status: "SIMULADO", priority: "P1", title: "LIVE-24", detail: "15 eventos y 3 recuperaciones simuladas; no equivale a 24 horas reales." },
  { area: "E2E", status: "CORREGIDO", priority: "P1", title: "Lote sobre rondas universales", detail: "El fixture abre temporalmente todas las rondas usadas y las restaura al finalizar." },
  { area: "Staging", status: "PAUSADO", priority: "P1", title: "Heartbeat/Watchdog persistente", detail: "Pausado a pedido del propietario; requiere publicación y entorno real." },
  { area: "Multiinstancia", status: "PAUSADO", priority: "P1", title: "Dos procesos contra base compartida", detail: "Solo existe evidencia lógica/local; la certificación real está pausada." },
  { area: "Hardware", status: "NO VERIFICADO", priority: "P1", title: "Samsung, LG, Android TV, iOS y Android", detail: "La matriz está preparada, pero no hay certificación física desde el sandbox." },
  { area: "Regulación", status: "PENDIENTE", priority: "P0", title: "RNG, legal y homologación", detail: "Revisión independiente obligatoria antes de cualquier dinero real." },
  { area: "Lukita 3D", status: "PREPRODUCCIÓN", priority: "P2", title: "Candidate / Review", detail: "No es avatar productivo; rigging, voz e integración siguen bloqueados." },
] as const;

export function filterAuditSummary(items: readonly AuditSummaryItem[], query: string, status: "TODOS" | AuditStatus, priority: "TODAS" | AuditPriority) {
  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) => (status === "TODOS" || item.status === status) && (priority === "TODAS" || item.priority === priority) && `${item.area} ${item.title} ${item.detail}`.toLowerCase().includes(normalizedQuery));
}
